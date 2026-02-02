from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import Dict, List, Any
from ..core.firebase import db

router = APIRouter()

# Category impact weights
CATEGORY_WEIGHTS = {
    'safety': -30,
    'fraud': -20,
    'ratings': -10,
    'completion': -5,
    'unknown': -5,
}

# Evidence count scoring
def score_evidence_count(count: int) -> tuple[int, str]:
    """Score based on evidence uploaded"""
    if count == 0:
        return -15, "No evidence uploaded - weaker appeal"
    elif count <= 2:
        return 5, "Some evidence provided - moderate support"
    else:
        return 15, "Strong evidence package - well documented"

# Time-based scoring
def score_timeliness(deactivated_at: datetime, submitted_at: datetime = None) -> tuple[int, str]:
    """Score based on how quickly appeal was submitted"""
    if not submitted_at:
        days_since = (datetime.now() - deactivated_at).days
        if days_since > 7:
            return -10, "No appeal submitted yet - waiting too long"
        return 0, "Not yet submitted - time window still open"
    
    hours_diff = (submitted_at - deactivated_at).total_seconds() / 3600
    if hours_diff <= 48:
        return 10, "Appealed within 48 hours - shows urgency"
    return 0, "Appeal submitted after 48 hours"

# Status scoring
def score_status(status: str, prior_appeal_count: int) -> tuple[int, str]:
    """Score based on current status and appeal history"""
    score = 0
    explanation = ""
    
    if status.lower() == 'denied' and prior_appeal_count > 0:
        score = -15
        explanation = "Previous denial on record - harder to overturn"
    elif status.lower() == 'pending' and prior_appeal_count == 0:
        score = 5
        explanation = "First appeal - platform may be more receptive"
    elif status.lower() == 'approved':
        score = 0
        explanation = "Already approved - no action needed"
    
    return score, explanation

def categorize_reason(reason: str) -> str:
    """Categorize deactivation reason into buckets"""
    reason_lower = reason.lower()
    
    if any(word in reason_lower for word in ['safety', 'unsafe', 'accident', 'incident']):
        return 'safety'
    elif any(word in reason_lower for word in ['fraud', 'scam', 'theft', 'stolen']):
        return 'fraud'
    elif any(word in reason_lower for word in ['rating', 'star', 'review', 'satisfaction']):
        return 'ratings'
    elif any(word in reason_lower for word in ['completion', 'cancel', 'acceptance']):
        return 'completion'
    else:
        return 'unknown'

@router.get("/cases/{case_id}/score")
async def get_case_score(case_id: str):
    """
    Compute explainable probability score for a case.
    
    Uses rule-based weighted factors:
    - Category impact (safety, fraud, ratings, etc.)
    - Evidence quality (number of documents)
    - Timeliness (how fast appeal was submitted)
    - Appeal history (prior denials)
    
    Returns score 0-100 with band and detailed factors.
    """
    try:
        # Fetch case from Firestore
        case_ref = db.collection('appeals').document(case_id)
        case_doc = case_ref.get()
        
        if not case_doc.exists:
            raise HTTPException(status_code=404, detail="Case not found")
        
        case_data = case_doc.to_dict()
        
        # Extract fields
        reason = case_data.get('reason') or case_data.get('deactivationReason', '')
        status = case_data.get('status', 'pending')
        evidence = case_data.get('evidence', [])
        evidence_count = len(evidence) if isinstance(evidence, list) else 0
        prior_appeal_count = case_data.get('priorAppealCount', 0)
        
        # Handle timestamps
        deactivated_at = case_data.get('deactivatedAt')
        submitted_at = case_data.get('submittedAt')
        
        # Convert Firestore timestamps to datetime
        if hasattr(deactivated_at, 'timestamp'):
            deactivated_at = datetime.fromtimestamp(deactivated_at.timestamp())
        elif isinstance(deactivated_at, str):
            deactivated_at = datetime.fromisoformat(deactivated_at.replace('Z', '+00:00'))
        else:
            deactivated_at = datetime.now() - timedelta(days=3)  # Default fallback
        
        if submitted_at:
            if hasattr(submitted_at, 'timestamp'):
                submitted_at = datetime.fromtimestamp(submitted_at.timestamp())
            elif isinstance(submitted_at, str):
                submitted_at = datetime.fromisoformat(submitted_at.replace('Z', '+00:00'))
        
        # Start with base score of 50
        base_score = 50
        factors = []
        
        # Factor 1: Category impact
        category = categorize_reason(reason)
        category_impact = CATEGORY_WEIGHTS.get(category, 0)
        factors.append({
            "name": f"{category.title()} category",
            "impact": category_impact,
            "explanation": f"{'Harder' if category_impact < 0 else 'Easier'} to reverse {category} cases"
        })
        
        # Factor 2: Evidence count
        evidence_impact, evidence_explanation = score_evidence_count(evidence_count)
        factors.append({
            "name": f"Evidence: {evidence_count} documents",
            "impact": evidence_impact,
            "explanation": evidence_explanation
        })
        
        # Factor 3: Timeliness
        time_impact, time_explanation = score_timeliness(deactivated_at, submitted_at)
        factors.append({
            "name": "Response timing",
            "impact": time_impact,
            "explanation": time_explanation
        })
        
        # Factor 4: Appeal history
        status_impact, status_explanation = score_status(status, prior_appeal_count)
        if status_impact != 0:
            factors.append({
                "name": "Appeal history",
                "impact": status_impact,
                "explanation": status_explanation
            })
        
        # Calculate final score
        total_impact = sum(f['impact'] for f in factors)
        final_score = base_score + total_impact
        
        # Clamp to 0-100
        final_score = max(0, min(100, final_score))
        
        # Determine label and band
        if final_score < 40:
            label = "low"
            band = [0, 40]
        elif final_score < 70:
            label = "medium"
            band = [40, 70]
        else:
            label = "high"
            band = [70, 100]
        
        # Sort factors by absolute impact (most significant first)
        factors.sort(key=lambda f: abs(f['impact']), reverse=True)
        
        return {
            "caseId": case_id,
            "score": final_score,
            "label": label,
            "band": band,
            "factors": factors,
            "metadata": {
                "category": category,
                "evidenceCount": evidence_count,
                "daysSinceDeactivation": (datetime.now() - deactivated_at).days,
                "priorAppealCount": prior_appeal_count,
                "status": status
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing score: {str(e)}")
