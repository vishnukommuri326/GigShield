"""
Seed Firestore with simulated appeal cases for analytics demonstration.

Run this script once to populate the database with realistic test data.
All seeded cases are marked with isSimulated: true for transparency.

Usage:
    python -m backend.data.seed_cases
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.firebase import db

# Realistic seed data
PLATFORMS = ['DoorDash', 'Uber', 'Instacart', 'Lyft', 'Amazon Flex', 'Grubhub', 'Shipt']

REASONS = {
    'Ratings': [
        'Customer rating below 4.2',
        'Low customer satisfaction score',
        'Rating dropped below platform minimum',
        'Received multiple 1-star ratings',
    ],
    'Safety': [
        'Safety incident reported by customer',
        'Traffic violation flagged',
        'Unsafe driving behavior reported',
        'Background check update required',
    ],
    'Completion Rate': [
        'Completion rate below 80%',
        'Excessive order cancellations',
        'Acceptance rate too low',
        'Multiple undelivered orders',
    ],
    'Fraud': [
        'Suspected account sharing',
        'Fraudulent activity detected',
        'GPS location inconsistencies',
        'Multiple failed identity verifications',
    ],
    'Unknown': [
        'Terms of service violation',
        'Policy breach - details not specified',
        'Account under review',
        'Contract violation',
    ]
}

# Platform-specific characteristics (based on observed patterns)
PLATFORM_STATS = {
    'DoorDash': {'cases': 42, 'approval_rate': 0.55, 'avg_response': 8},
    'Uber': {'cases': 38, 'approval_rate': 0.39, 'avg_response': 12},
    'Instacart': {'cases': 29, 'approval_rate': 0.68, 'avg_response': 6},
    'Lyft': {'cases': 24, 'approval_rate': 0.45, 'avg_response': 10},
    'Amazon Flex': {'cases': 18, 'approval_rate': 0.33, 'avg_response': 14},
    'Grubhub': {'cases': 15, 'approval_rate': 0.58, 'avg_response': 7},
    'Shipt': {'cases': 12, 'approval_rate': 0.60, 'avg_response': 9},
}

def generate_appeal_case(platform: str, category: str, index: int):
    """Generate a single realistic appeal case"""
    
    # Select reason from category
    reason = random.choice(REASONS[category])
    
    # Generate timestamps
    days_ago = random.randint(1, 90)
    created_at = datetime.utcnow() - timedelta(days=days_ago)
    
    # Determine status and response time
    stats = PLATFORM_STATS[platform]
    approval_rate = stats['approval_rate']
    avg_response = stats['avg_response']
    
    # Some cases still pending (20%)
    if random.random() < 0.20:
        status = 'pending'
        last_updated = created_at
    else:
        # Resolved cases
        status = 'approved' if random.random() < approval_rate else 'denied'
        # Response time with variance
        response_days = max(1, int(random.gauss(avg_response, avg_response * 0.3)))
        last_updated = created_at + timedelta(days=response_days)
    
    # Generate deadline (typically 10-14 days from deactivation)
    deadline_days = random.randint(10, 14)
    appeal_deadline = created_at + timedelta(days=deadline_days)
    
    # Generate simple appeal text
    appeal_letter = f"""Dear {platform} Appeals Team,

I am writing to appeal my recent account deactivation dated {created_at.strftime('%B %d, %Y')}. 
The notice cited: "{reason}"

I have been a dedicated driver/shopper on your platform and believe this decision warrants review. 
I have gathered relevant evidence and documentation to support my case.

I respectfully request reconsideration of this deactivation.

Thank you for your time.
"""
    
    # Build case document
    case = {
        'platform': platform,
        'reason': reason,
        'category': category,
        'deactivationNotice': f'{platform} deactivation notice - {reason}',
        'userStory': f'Simulated case #{index} for {platform}',
        'evidence': 'Screenshots and documentation',
        'appealLetter': appeal_letter,
        'status': status,
        'appealDeadline': appeal_deadline.isoformat(),
        'createdAt': created_at.isoformat(),
        'lastUpdated': last_updated.isoformat(),
        'isSimulated': True,  # KEY FLAG
        'userId': f'simulated_user_{index}',
    }
    
    return case

def seed_database():
    """Seed Firestore with realistic appeal cases"""
    
    print("🌱 Starting database seeding...")
    print("=" * 50)
    
    # Clear existing simulated cases
    print("\n🧹 Removing old simulated cases...")
    existing_simulated = db.collection('appeals').where('isSimulated', '==', True).stream()
    delete_count = 0
    for doc in existing_simulated:
        doc.reference.delete()
        delete_count += 1
    print(f"   Deleted {delete_count} old simulated cases")
    
    # Generate new cases
    print("\n📊 Generating new simulated cases...")
    total_cases = 0
    reason_counts = {category: 0 for category in REASONS.keys()}
    
    for platform, stats in PLATFORM_STATS.items():
        platform_cases = []
        target_count = stats['cases']
        
        # Distribute cases across reason categories (with realistic weights)
        category_weights = {
            'Ratings': 0.38,
            'Safety': 0.25,
            'Completion Rate': 0.18,
            'Fraud': 0.10,
            'Unknown': 0.09,
        }
        
        for category, weight in category_weights.items():
            count = int(target_count * weight)
            for i in range(count):
                case = generate_appeal_case(platform, category, total_cases)
                platform_cases.append(case)
                reason_counts[category] += 1
                total_cases += 1
        
        # Add to Firestore
        for case in platform_cases:
            db.collection('appeals').add(case)
        
        print(f"   ✓ {platform}: {len(platform_cases)} cases")
    
    print("\n" + "=" * 50)
    print(f"✅ Seeded {total_cases} simulated cases")
    print(f"\n📈 Reason Distribution:")
    for category, count in reason_counts.items():
        percentage = (count / total_cases) * 100 if total_cases > 0 else 0
        print(f"   {category}: {count} ({percentage:.1f}%)")
    
    print("\n🎯 Data is ready for analytics aggregation!")
    print(f"   All cases marked with isSimulated: true")
    print(f"   Access analytics at: GET /api/analytics/overview")

if __name__ == '__main__':
    seed_database()
