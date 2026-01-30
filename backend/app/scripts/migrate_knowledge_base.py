# backend/app/scripts/migrate_knowledge_base.py

"""
One-time migration script to move knowledge base articles from hardcoded list to Firestore.
Run this once to populate the knowledge_base collection.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path to import firebase
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.firebase import db

def get_articles():
    """Get all 13 knowledge base articles"""
    return [
        {
            "id": "ca-ab5",
            "title": "California AB5 - Worker Classification",
            "category": "State Laws",
            "state": "California",
            "platform": "All",
            "content": """California AB5 (2019) established the ABC test for determining worker classification. 
                Key Points:
                - Employers must prove workers are independent contractors, not employees
                - Three-part ABC test must be met
                - Right to detailed explanation for deactivation
                - Right to appeal with human review
                - Cannot be deactivated for declining low-paying orders
                - Protection against arbitrary deactivation
                
                Relevance: Provides strong protections for gig workers in California regarding deactivation rights and appeal processes.""",
            "tags": ["california", "ab5", "worker rights", "classification", "deactivation", "appeal rights"]
        },
        {
            "id": "ca-prop22",
            "title": "California Proposition 22",
            "category": "State Laws",
            "state": "California",
            "platform": "Uber, Lyft, DoorDash, Instacart",
            "content": """Proposition 22 (2020) exempts app-based drivers from AB5 but provides specific protections.
                Key Points:
                - Guarantees minimum earnings
                - Healthcare stipends for qualifying drivers
                - Occupational accident insurance
                - Anti-discrimination and sexual harassment policies
                - Right to transparency in deactivation decisions
                - Appeal process required before permanent deactivation
                
                Platforms Covered: Uber, Lyft, DoorDash, Instacart, Postmates
                Relevance: Balances flexibility with worker protections specific to rideshare and delivery platforms.""",
            "tags": ["california", "prop 22", "rideshare", "delivery", "deactivation rights", "transparency"]
        },
        {
            "id": "wa-seattle-gig",
            "title": "Seattle Gig Worker Protections",
            "category": "State Laws",
            "state": "Washington",
            "platform": "All",
            "content": """Seattle Gig Worker Protections (2025) and PayUp Act provide comprehensive rights.
                Key Points:
                - Platforms must provide specific reason for deactivation
                - Right to appeal with evidence submission
                - Cannot be deactivated without warning for first offense (most cases)
                - Required waiting period before permanent deactivation
                - Minimum pay standards
                - Transparency in rating and ranking systems
                
                Relevance: Strong protections requiring clear communication and fair appeal processes.""",
            "tags": ["washington", "seattle", "payup act", "deactivation", "appeal process", "transparency"]
        },
        {
            "id": "ny-gig-rights",
            "title": "NYC Gig Worker Rights (2023)",
            "category": "State Laws",
            "state": "New York",
            "platform": "All",
            "content": """New York City Gig Worker Rights and Delivery Worker Protection laws.
                Key Points:
                - Right to transparency in deactivation decisions
                - Protection against retaliation for asserting rights
                - Required notice period before deactivation
                - Access to earnings data and trip records
                - Minimum pay for delivery workers
                - Right to use any restroom
                
                Relevance: Protects workers from surprise deactivations and ensures access to information.""",
            "tags": ["new york", "nyc", "delivery workers", "transparency", "deactivation notice", "retaliation"]
        },
        {
            "id": "doordash-deactivation",
            "title": "DoorDash Deactivation Policy",
            "category": "Platform Policies",
            "state": "All",
            "platform": "DoorDash",
            "content": """DoorDash deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Customer rating below 4.2
                - Completion rate below 80%
                - Contract violations (fraud, safety issues)
                - Multiple customer complaints
                - Background check issues
                
                Appeal Process:
                - Appeal deadline: 7-10 days from deactivation
                - Submit through Dasher app or support portal
                - Include evidence: screenshots, delivery photos, GPS data
                - Human review required in CA, WA, NY
                
                Best Practices: Respond within 48 hours, provide detailed explanation, include supporting documentation.""",
            "tags": ["doordash", "deactivation", "appeal deadline", "rating", "completion rate", "policy"]
        },
        {
            "id": "uber-deactivation",
            "title": "Uber Deactivation Policy",
            "category": "Platform Policies",
            "state": "All",
            "platform": "Uber",
            "content": """Uber driver/delivery deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Star rating below 4.6 (varies by market)
                - Acceptance rate too low in some markets
                - Cancellation rate too high
                - Safety incidents or complaints
                - Fraudulent activity
                - Background check issues
                
                Appeal Process:
                - Appeal deadline: 30 days but respond quickly
                - Use Uber app Help section
                - Provide trip details, evidence, explanation
                - May require in-person review at Greenlight Hub
                
                State-Specific: CA and NY require detailed explanation and appeal rights.""",
            "tags": ["uber", "deactivation", "rating", "appeal", "safety", "fraud", "greenlight hub"]
        },
        {
            "id": "lyft-deactivation",
            "title": "Lyft Deactivation Policy",
            "category": "Platform Policies",
            "state": "All",
            "platform": "Lyft",
            "content": """Lyft driver deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Star rating below 4.6-4.8 (market dependent)
                - Acceptance rate too low (varies by market)
                - Cancellation rate above 10%
                - Safety incidents or customer complaints
                - Fraudulent activity or policy violations
                - Failed background check or annual inspection
                - Vehicle does not meet platform standards
                
                Appeal Process:
                - Appeal deadline: 30 days from deactivation
                - Submit through Lyft Driver app or help.lyft.com
                - Include trip logs, evidence, detailed explanation
                - May require in-person Hub visit for serious issues
                - Human review required in California and New York
                
                Key Metrics:
                - Maintain 4.8+ rating in most markets
                - Keep cancellation rate under 10%
                - Accept ride requests when online (some markets)
                
                State-Specific: California Prop 22 requires transparency in deactivation decisions and appeal rights.
                
                Best Practices: Document all trips with screenshots, respond to appeals within 48 hours, maintain professional communication.""",
            "tags": ["lyft", "deactivation", "rating", "cancellation rate", "appeal", "rideshare", "policy"]
        },
        {
            "id": "instacart-deactivation",
            "title": "Instacart Shopper Deactivation Policy",
            "category": "Platform Policies",
            "state": "All",
            "platform": "Instacart",
            "content": """Instacart shopper deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Customer rating below 4.7
                - Order cancellation rate too high
                - Late deliveries or missing items
                - Fraudulent activity (false purchases, receipt manipulation)
                - Poor shopping quality (wrong items, damaged products)
                - Customer complaints about professionalism
                - Alcohol delivery violations
                
                Appeal Process:
                - Appeal deadline: 10-14 days from deactivation
                - Contact through Shopper app or email to shoppers@instacart.com
                - Provide order history, photos of deliveries, communication records
                - Include explanation of circumstances beyond control
                
                Key Metrics:
                - Maintain 4.7+ average rating
                - Keep cancellation rate low (under 15%)
                - On-time delivery rate above 90%
                - Item accuracy and quality scores
                
                Common Issues:
                - Out-of-stock items (not your fault - document substitutions)
                - Customer address errors
                - Apartment access issues
                - Store supply problems
                
                California/Washington: Additional protections for transparency and appeal rights.
                
                Best Practices: Photo every delivery, communicate proactively about substitutions, keep timestamps of store issues.""",
            "tags": ["instacart", "deactivation", "shopper", "rating", "delivery", "grocery", "appeal", "policy"]
        },
        {
            "id": "amazon-flex-deactivation",
            "title": "Amazon Flex Deactivation Policy",
            "category": "Platform Policies",
            "state": "All",
            "platform": "Amazon Flex",
            "content": """Amazon Flex delivery partner deactivation reasons and appeal process.
                Common Deactivation Reasons:
                - Reliability score below threshold
                - Multiple late deliveries
                - Missed blocks or last-minute forfeit
                - Customer complaints (not received, damaged packages)
                - Package misdelivery or theft
                - Violation of delivery protocols
                - Failed background check
                
                Appeal Process:
                - Appeal deadline: 10 days from deactivation
                - Email amazonflex-appeals@amazon.com
                - Include delivery records, GPS data, photos, block history
                - Provide detailed explanation with supporting evidence
                - Response time varies (3-14 days typically)
                
                Key Metrics:
                - Reliability score (on-time delivery, block completion)
                - Customer feedback rating
                - Delivery success rate
                - Block acceptance and completion
                
                Critical Issues:
                - Late arrivals to warehouse can impact reliability
                - Package scanning errors
                - Photo proof of delivery required
                - Route completion within timeframe
                
                State Protections:
                - California: Transparency in deactivation decisions
                - Washington: Appeal rights and specific reason disclosure
                
                Best Practices: Always photograph deliveries, arrive early to blocks, track all packages carefully, document any app issues or route problems.
                
                Note: Amazon Flex is strict on reliability - multiple late blocks can lead to deactivation even with good delivery ratings.""",
            "tags": ["amazon flex", "deactivation", "reliability", "delivery", "appeal", "blocks", "policy"]
        },
        {
            "id": "appeal-evidence",
            "title": "What Evidence to Include in Appeals",
            "category": "Appeal Strategies",
            "state": "All",
            "platform": "All",
            "content": """Essential evidence for successful gig worker deactivation appeals.
                
                Always Include:
                - Screenshots of platform stats (rating, completion rate, total trips/deliveries)
                - Full deactivation notice with timestamp
                - Account history summary
                - Professional track record highlights
                
                For Rating-Based Deactivations:
                - Customer messages showing positive interactions
                - Delivery/trip completion photos with timestamps
                - GPS/route history proving on-time performance
                - Evidence of circumstances beyond your control
                
                For Fraud/Safety Claims:
                - GPS location data for disputed deliveries
                - Timestamped delivery photos
                - Customer communication records
                - Witness statements if applicable
                
                For Policy Violations:
                - Screenshots showing policy compliance
                - Timeline of events
                - Explanation of misunderstanding
                - Training completion records
                
                Format Tips: Organize chronologically, label clearly, keep professional tone.""",
            "tags": ["evidence", "appeal", "documentation", "proof", "screenshots", "gps", "strategy"]
        },
        {
            "id": "appeal-timeline",
            "title": "Appeal Deadlines by Platform",
            "category": "Appeal Strategies",
            "state": "All",
            "platform": "All",
            "content": """Critical appeal deadlines for major gig platforms.
                
                Platform Deadlines:
                - DoorDash: 7-10 days from deactivation
                - Uber: 30 days (respond within 48-72 hours recommended)
                - Lyft: 30 days
                - Instacart: 10-14 days
                - Amazon Flex: 10 days
                - Grubhub: 14 days
                - Postmates: 7 days
                
                State Extensions:
                - California: May have extended timelines under Prop 22
                - Washington: Platforms must allow reasonable time for evidence gathering
                - New York: Required notice period may extend appeal window
                
                Best Practice: Submit appeal within 48-72 hours of deactivation for maximum impact. Quick response shows professionalism and urgency.
                
                Warning: Missing deadlines usually results in permanent deactivation with no recourse.""",
            "tags": ["deadline", "timeline", "appeal window", "platform specific", "urgent", "time limit"]
        },
        {
            "id": "rating-deactivation",
            "title": "Understanding Rating-Based Deactivations",
            "category": "Common Issues",
            "state": "All",
            "platform": "All",
            "content": """How to handle and appeal rating-based deactivations.
                
                Platform Rating Requirements:
                - DoorDash: 4.2 minimum customer rating
                - Uber: 4.6 minimum (varies by city)
                - Lyft: 4.6-4.8 minimum (market dependent)
                - Instacart: 4.7 minimum
                
                Appeal Strategies:
                - Show total positive deliveries vs negative ratings
                - Identify unfair ratings (customer fraud, issues beyond control)
                - Document circumstances: weather, app issues, customer mistakes
                - Highlight recent improvement trend
                - Emphasize completion rate and professionalism
                
                State Protections:
                - California: Cannot deactivate solely for declining low-paying orders
                - Washington: Must explain specific rating incidents
                - New York: Transparency required in rating calculation
                
                Common Defenses: App glitches, customer address errors, weather delays, items out of stock (Instacart), restaurant delays (delivery apps).""",
            "tags": ["rating", "customer rating", "deactivation", "appeal strategy", "unfair rating", "defense"]
        },
        {
            "id": "fraud-accusations",
            "title": "Defending Against Fraud Accusations",
            "category": "Common Issues",
            "state": "All",
            "platform": "All",
            "content": """How to defend against fraud or theft accusations in gig work.
                
                Common Accusations:
                - Undelivered orders
                - Account sharing
                - GPS manipulation
                - False delivery photos
                - Unauthorized charges
                
                Defense Evidence:
                - GPS location data showing you at delivery location
                - Timestamped delivery photos matching GPS coordinates
                - Customer communication records
                - Delivery completion patterns showing consistency
                - No prior violations or complaints
                
                Key Arguments:
                - Customer may have provided wrong address
                - Photo shows delivery at instructed location
                - GPS proves presence at delivery site
                - Other household member may have taken order
                - App error or glitch occurred
                
                Legal Rights:
                - Right to see specific evidence against you
                - Right to respond to accusations
                - Protection against false claims (varies by state)
                
                Response Tips: Stay professional, provide detailed timeline, include all available proof, request specific incident details from platform.""",
            "tags": ["fraud", "theft accusation", "undelivered", "gps proof", "defense", "false claim"]
        }
    ]

def migrate_to_firestore():
    """Upload all articles to Firestore knowledge_base collection"""
    articles = get_articles()
    
    print(f"Starting migration of {len(articles)} articles to Firestore...")
    print(f"Collection: knowledge_base\n")
    
    success_count = 0
    error_count = 0
    
    for article in articles:
        try:
            # Add metadata
            article_data = {
                **article,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "tier": "summary",  # Default tier
                "usage_count": 0,
                "success_rate": 0.0,
                "source_url": None
            }
            
            # Use article ID as document ID
            doc_ref = db.collection('knowledge_base').document(article['id'])
            doc_ref.set(article_data)
            
            print(f"✓ Uploaded: {article['id']} - {article['title']}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ Failed: {article['id']} - {str(e)}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Migration Complete!")
    print(f"✓ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"{'='*60}")
    print(f"\nNext steps:")
    print(f"1. Verify documents in Firebase Console")
    print(f"2. Restart backend to load from Firestore")
    print(f"3. Check Pinecone re-indexes the 13 documents")

if __name__ == "__main__":
    migrate_to_firestore()
