from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import Dict, List, Any
from ..core.firebase import db
from collections import defaultdict
from .scoring import categorize_reason, CATEGORY_WEIGHTS, score_evidence_count

router = APIRouter()

@router.get("/analytics/overview")
async def get_analytics_overview():
    """
    Aggregate analytics across all appeals.
    
    Returns aggregated data including:
    - Cases by platform
    - Outcomes by platform
    - Average response times
    - Reason distribution
    
    Data may include simulated cases marked with isSimulated: true
    """
    try:
        # Query all appeals from Firestore
        appeals_ref = db.collection('appeals')
        appeals = appeals_ref.stream()
        
        # Initialize aggregation structures
        cases_by_platform = defaultdict(int)
        outcomes_by_platform = defaultdict(lambda: {
            'approved': 0,
            'denied': 0,
            'pending': 0
        })
        response_times_by_platform = defaultdict(list)
        reason_distribution = defaultdict(int)
        score_distribution = {'low': 0, 'medium': 0, 'high': 0}
        
        total_cases = 0
        simulated_count = 0
        
        # Aggregate data
        for appeal in appeals:
            data = appeal.to_dict()
            platform = data.get('platform', 'Unknown')
            
            # Normalize platform names (handle inconsistent capitalization)
            platform_normalized = platform.strip().title()
            # Fix specific platforms
            if platform_normalized == 'Doordash':
                platform_normalized = 'DoorDash'
            elif platform_normalized == 'Grubhub':
                platform_normalized = 'Grubhub'
            elif platform_normalized == 'Amazon Flex':
                platform_normalized = 'Amazon Flex'
            
            status = data.get('status', 'pending')
            reason = data.get('reason', '')
            is_simulated = data.get('isSimulated', False)
            evidence_count = len(data.get('evidence', []))
            prior_appeal_count = data.get('priorAppealCount', 0)
            
            # Count cases
            total_cases += 1
            cases_by_platform[platform_normalized] += 1
            if is_simulated:
                simulated_count += 1
            
            # Compute score for distribution (same logic as scoring endpoint)
            base_score = 50
            category = categorize_reason(reason)
            category_impact = CATEGORY_WEIGHTS.get(category, 0)
            evidence_impact, _ = score_evidence_count(evidence_count)
            status_impact = -15 if (status.lower() == 'denied' and prior_appeal_count > 0) else 0
            
            total_impact = category_impact + evidence_impact + status_impact
            final_score = max(0, min(100, base_score + total_impact))
            
            # Categorize score
            if final_score < 40:
                score_distribution['low'] += 1
            elif final_score < 70:
                score_distribution['medium'] += 1
            else:
                score_distribution['high'] += 1
            
            # Count outcomes
            if status in ['approved', 'denied', 'pending']:
                outcomes_by_platform[platform_normalized][status] += 1
            
            # Calculate response time for resolved cases
            if status in ['approved', 'denied']:
                created_at = data.get('createdAt')
                last_updated = data.get('lastUpdated')
                
                if created_at and last_updated:
                    # Handle both Firestore timestamps and ISO strings
                    if hasattr(created_at, 'timestamp'):
                        created_dt = datetime.fromtimestamp(created_at.timestamp())
                    else:
                        created_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    
                    if hasattr(last_updated, 'timestamp'):
                        updated_dt = datetime.fromtimestamp(last_updated.timestamp())
                    else:
                        updated_dt = datetime.fromisoformat(last_updated.replace('Z', '+00:00'))
                    
                    response_days = (updated_dt - created_dt).days
                    if response_days >= 0:  # Sanity check
                        response_times_by_platform[platform_normalized].append(response_days)
            
            # Categorize reasons
            reason_lower = reason.lower()
            if 'rating' in reason_lower or 'review' in reason_lower:
                reason_distribution['Ratings'] += 1
            elif 'safety' in reason_lower or 'incident' in reason_lower:
                reason_distribution['Safety'] += 1
            elif 'completion' in reason_lower or 'acceptance' in reason_lower:
                reason_distribution['Completion Rate'] += 1
            elif 'fraud' in reason_lower:
                reason_distribution['Fraud'] += 1
            else:
                reason_distribution['Unknown'] += 1
        
        # Calculate statistics
        avg_response_times = {}
        median_response_times = {}
        for platform, times in response_times_by_platform.items():
            if times:
                avg_response_times[platform] = round(sum(times) / len(times), 1)
                sorted_times = sorted(times)
                mid = len(sorted_times) // 2
                if len(sorted_times) % 2 == 0:
                    median_response_times[platform] = (sorted_times[mid - 1] + sorted_times[mid]) / 2
                else:
                    median_response_times[platform] = sorted_times[mid]
        
        # Calculate overall statistics
        total_approved = sum(platform['approved'] for platform in outcomes_by_platform.values())
        total_denied = sum(platform['denied'] for platform in outcomes_by_platform.values())
        total_pending = sum(platform['pending'] for platform in outcomes_by_platform.values())
        
        # Prepare response time histogram buckets
        all_response_times = []
        for times in response_times_by_platform.values():
            all_response_times.extend(times)
        
        response_time_buckets = {
            '0-3 days': sum(1 for t in all_response_times if 0 <= t <= 3),
            '4-7 days': sum(1 for t in all_response_times if 4 <= t <= 7),
            '8-14 days': sum(1 for t in all_response_times if 8 <= t <= 14),
            '15-21 days': sum(1 for t in all_response_times if 15 <= t <= 21),
            '22+ days': sum(1 for t in all_response_times if t >= 22),
        }
        
        # Build response
        return {
            "summary": {
                "totalCases": total_cases,
                "totalApproved": total_approved,
                "totalDenied": total_denied,
                "totalPending": total_pending,
                "simulatedCount": simulated_count,
                "dataSource": "mixed" if simulated_count > 0 and simulated_count < total_cases else "simulated" if simulated_count == total_cases else "real"
            },
            "casesByPlatform": dict(cases_by_platform),
            "outcomesByPlatform": {
                platform: dict(outcomes) 
                for platform, outcomes in outcomes_by_platform.items()
            },
            "avgResponseTimeDays": avg_response_times,
            "medianResponseTimeDays": median_response_times,
            "responseTimeBuckets": response_time_buckets,
            "reasonDistribution": dict(reason_distribution),
            "scoreDistribution": score_distribution
        }
        
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")
