# backend/app/scripts/add_phase1_states.py

"""
Add Phase 1 state coverage: Top 6 states with gig worker protections
Texas, Florida, Illinois, Massachusetts, Colorado, Oregon
"""

import sys
import os
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.firebase import db

def get_phase1_articles():
    """Get all Phase 1 state articles (Texas, Florida, Illinois, MA, CO, OR)"""
    return [
        # ============================================
        # TEXAS
        # ============================================
        {
            "id": "tx-gig-laws",
            "title": "Texas Gig Worker Protections",
            "category": "State Laws",
            "state": "Texas",
            "platform": "All",
            "content": """Texas gig worker laws and independent contractor protections.
                
                Key Points:
                - Independent contractor status generally upheld
                - Limited specific gig worker legislation (as of 2026)
                - Right to appeal deactivation varies by platform
                - No state-mandated minimum pay for gig workers
                - Workers' compensation not required for ICs
                - Anti-retaliation protections under general labor law
                
                Local Ordinances:
                - Austin: Delivery worker protections being considered
                - Houston: Standard independent contractor laws apply
                - Dallas: Platform-specific agreements govern
                
                Appeal Rights:
                - No state-mandated appeal process
                - Rely on platform's internal appeal procedures
                - Document everything for potential legal claims
                - Consider consulting Texas employment attorney
                
                Best Practices for Texas Workers:
                - Maintain detailed records of all work
                - Keep platform communications
                - Track earnings and expenses meticulously
                - Join local gig worker advocacy groups
                
                Relevance: Texas has fewer protections than CA/WA/NY but general labor laws still apply to unfair treatment.""",
            "tags": ["texas", "independent contractor", "limited protections", "appeal", "documentation"]
        },
        {
            "id": "tx-platform-apps",
            "title": "Texas Platform-Specific Applications",
            "category": "Platform Policies",
            "state": "Texas",
            "platform": "All",
            "content": """How major platforms operate in Texas and state-specific considerations.
                
                DoorDash in Texas:
                - Same national standards (4.2 rating, 80% completion)
                - No Texas-specific appeal extensions
                - Houston/Dallas/Austin high-volume markets
                - Heat-related delivery issues common in summer
                
                Uber/Lyft in Texas:
                - Major rideshare presence (Austin, Houston, Dallas, San Antonio)
                - No state-mandated background check exemptions
                - Rating requirements same as national (4.6+)
                - Airport queues managed by local regulations
                
                Instacart in Texas:
                - H-E-B partnership creates unique market
                - Alcohol delivery restrictions (age verification required)
                - Rural delivery zones in West Texas
                - No state-specific protections beyond national policy
                
                Appeal Strategies for Texas:
                - Emphasize extreme weather conditions (heat, storms)
                - Document traffic issues (Houston notorious)
                - Reference platform's national policies
                - Keep all evidence: GPS, photos, messages
                - Consider BBB complaint if appeal denied
                
                Texas-Specific Challenges:
                - Extreme heat affecting vehicle/app performance
                - Large distances between deliveries in rural areas
                - Language barriers in border regions
                - No state arbitration requirement""",
            "tags": ["texas", "platform policies", "doordash", "uber", "lyft", "instacart", "appeal strategy"]
        },
        {
            "id": "tx-appeal-guide",
            "title": "Texas Gig Worker Appeal Guide",
            "category": "Appeal Strategies",
            "state": "Texas",
            "platform": "All",
            "content": """Comprehensive appeal strategy for Texas gig workers.
                
                Understanding Your Position:
                - Texas is "employment at will" state
                - Independent contractors have limited protections
                - No state-mandated appeal timeframe
                - Platform policies are primary governing document
                
                Building Your Case:
                - Focus on platform policy violations by company
                - Document any discriminatory treatment
                - Highlight excellent track record
                - Emphasize financial hardship
                - Reference any misleading platform communications
                
                Evidence Collection:
                - All platform notifications and emails
                - Screenshot metrics before deactivation
                - GPS data for disputed deliveries/rides
                - Customer messages showing professionalism
                - Weather reports for difficult delivery days
                - Traffic incident reports
                
                Escalation Path:
                1. Platform's internal appeal (first 48 hours)
                2. Request supervisor review (if denied)
                3. File BBB complaint
                4. Contact Texas Workforce Commission
                5. Consider small claims court for lost wages
                6. Consult employment attorney for misclassification
                
                Legal Considerations:
                - Misclassification claims possible under IRS rules
                - Discrimination claims under federal law
                - Contract law applies to platform agreements
                - Consider arbitration clause in Terms of Service
                
                Resources:
                - Texas Workforce Commission: twc.texas.gov
                - Better Business Bureau Texas
                - Local gig worker Facebook groups
                - Texas RioGrande Legal Aid (for low-income)""",
            "tags": ["texas", "appeal strategy", "legal rights", "evidence", "escalation", "resources"]
        },
        
        # ============================================
        # FLORIDA
        # ============================================
        {
            "id": "fl-gig-laws",
            "title": "Florida Gig Worker Protections",
            "category": "State Laws",
            "state": "Florida",
            "platform": "All",
            "content": """Florida gig economy regulations and worker protections.
                
                State-Level Protections:
                - Independent contractor status generally recognized
                - No statewide gig worker specific legislation (as of 2026)
                - Workers' compensation optional for ICs
                - Right to appeal varies by platform
                - Anti-discrimination laws apply
                
                Miami-Dade Specific Rules:
                - Delivery worker protections under consideration
                - Restaurant access requirements for delivery workers
                - Heat safety guidelines during summer months
                - No mandatory minimum pay
                
                Tampa/Orlando Considerations:
                - Tourism industry creates high demand
                - Theme park delivery restrictions
                - Airport pickup regulations strictly enforced
                - Peak season surge pricing common
                
                Appeal Rights:
                - No state-mandated appeal process
                - Platform internal procedures govern
                - Document all work and communications
                - Florida contract law applies to agreements
                
                Key Protections:
                - General employment discrimination laws
                - Wage theft prevention (if misclassified)
                - Public accommodation access
                - Freedom from retaliation for reporting safety issues
                
                Best Practices:
                - Keep detailed records in hurricane season
                - Document weather-related delivery issues
                - Save all platform communications
                - Track mileage and expenses for tax purposes
                
                Relevance: Florida's tourism economy creates unique challenges; document everything for appeals.""",
            "tags": ["florida", "miami", "orlando", "tampa", "independent contractor", "appeal", "tourism"]
        },
        {
            "id": "fl-platform-apps",
            "title": "Florida Platform Operations Guide",
            "category": "Platform Policies",
            "state": "Florida",
            "platform": "All",
            "content": """Platform-specific operations and appeal strategies in Florida.
                
                DoorDash Florida:
                - Heavy tourism traffic in Orlando/Miami/Tampa
                - Beach delivery challenges (parking, access)
                - Hurricane season delivery suspensions
                - Alcohol delivery with strict ID requirements
                
                Uber/Lyft Florida:
                - Major markets: Miami, Orlando, Tampa, Jacksonville
                - Airport queue management critical
                - Cruise port pickups in Miami/Port Canaveral
                - Theme park surge pricing
                - Hurricane evacuations affect ratings temporarily
                
                Instacart Florida:
                - Publix partnership dominates market
                - Seasonal population changes (snowbirds)
                - Gated community access challenges
                - Hurricane prep creates massive demand spikes
                
                Amazon Flex Florida:
                - Major distribution centers in all metro areas
                - Rural deliveries in Panhandle and Central FL
                - Package theft common in tourist areas
                - Heat damage to packages in summer
                
                Appeal Strategies:
                - Reference hurricane/tropical storm impacts
                - Document theme park traffic delays
                - Explain tourist customer communication barriers
                - Show evidence of gated community access issues
                - Highlight seasonal demand fluctuations
                
                Florida-Specific Evidence:
                - Weather reports (hurricanes, thunderstorms)
                - Traffic data (I-4 in Orlando, I-95 in Miami)
                - Gate access denial from communities
                - Photos of package left per customer instruction
                - Customer messages about tourism-related delays""",
            "tags": ["florida", "doordash", "uber", "lyft", "instacart", "amazon flex", "tourism", "hurricanes"]
        },
        
        # ============================================
        # ILLINOIS
        # ============================================
        {
            "id": "il-gig-laws",
            "title": "Illinois Gig Worker Protections",
            "category": "State Laws",
            "state": "Illinois",
            "platform": "All",
            "content": """Illinois state laws and Chicago ordinances protecting gig workers.
                
                State-Level Protections:
                - Day and Temporary Labor Services Act applies to some gig work
                - Independent contractor misclassification protections
                - Wage theft prevention measures
                - Right to rest periods (if classified as employee)
                
                Chicago Gig Worker Ordinance:
                - Minimum pay standards for delivery workers (phased implementation)
                - Transparency requirements for algorithms and deactivation
                - Right to appeal deactivation with human review
                - Protection against retaliation
                - Access to restrooms at restaurants
                - Data access rights
                
                Key Protections:
                - Cannot be deactivated without specific reason (Chicago)
                - Right to appeal within 14 days (Chicago)
                - Minimum compensation per hour worked (Chicago delivery)
                - Protection from arbitrary rating systems
                - Right to know how algorithms affect earnings
                
                Appeal Rights (Chicago):
                - Platform must provide detailed deactivation reason
                - 14-day appeal window
                - Human review required
                - Opportunity to submit evidence
                - Decision must be in writing
                
                Statewide Considerations:
                - Illinois Human Rights Act protects against discrimination
                - Unemployment benefits may apply if misclassified
                - Workers' compensation if employee relationship exists
                
                Best Practices:
                - Know if you work in Chicago city limits (ordinance applies)
                - Document all work hours and locations
                - Save all platform communications
                - Request written explanation for deactivation
                - File appeal within 14 days if in Chicago
                
                Relevance: Chicago has some of the strongest gig worker protections in the US; use them.""",
            "tags": ["illinois", "chicago", "ordinance", "minimum pay", "appeal rights", "transparency", "protections"]
        },
        {
            "id": "il-chicago-appeals",
            "title": "Chicago Gig Worker Appeal Strategy",
            "category": "Appeal Strategies",
            "state": "Illinois",
            "platform": "All",
            "content": """How to leverage Chicago's strong gig worker protections in appeals.
                
                Chicago Ordinance Rights:
                - Detailed explanation required for deactivation
                - 14-day appeal window from notification
                - Human review (not just automated)
                - Right to submit evidence
                - Written decision required
                
                Building Your Appeal:
                1. Confirm you worked in Chicago city limits
                2. Request detailed deactivation reason in writing
                3. Reference Chicago Municipal Code Chapter 4-6-300
                4. Demand human review as required by ordinance
                5. Submit comprehensive evidence package
                
                Evidence to Include:
                - Work logs showing Chicago deliveries/rides
                - Platform statistics (rating, completion, earnings)
                - Customer communications
                - GPS data for disputed incidents
                - Photos of completed work
                - Weather/traffic data for delays
                - Restaurant wait time documentation
                
                Key Legal Arguments:
                - Platform violated transparency requirements
                - Deactivation reason was not specific enough
                - Automated decision without human review
                - Retaliation for asserting rights
                - Algorithm unfairly penalized you
                - No opportunity to correct alleged issues
                
                Escalation Path:
                1. Platform internal appeal (within 14 days)
                2. Request supervisor review
                3. File complaint with Chicago Dept of Business Affairs
                4. Contact Chicago Workers' Rights office
                5. Consider legal representation (wage theft claim)
                
                Platform-Specific Chicago Tips:
                - DoorDash: Cite minimum pay protections
                - Uber/Lyft: Reference algorithm transparency rules
                - Instacart: Emphasize worker classification
                - All: Demand written decision per ordinance
                
                Resources:
                - Chicago Dept of Business Affairs: chicago.gov/bacp
                - Workers' Rights Clinic: (312) 744-7658
                - Legal Aid Chicago
                - Chicago Workers' Collaborative""",
            "tags": ["illinois", "chicago", "appeal strategy", "ordinance", "legal rights", "transparency", "evidence"]
        },
        
        # ============================================
        # MASSACHUSETTS
        # ============================================
        {
            "id": "ma-gig-laws",
            "title": "Massachusetts Gig Worker Classification Laws",
            "category": "State Laws",
            "state": "Massachusetts",
            "platform": "All",
            "content": """Massachusetts strong worker classification protections and gig economy laws.
                
                ABC Test for Classification:
                - Similar to California's AB5
                - Three-part test to prove independent contractor status
                - Presumption of employee status unless proven otherwise
                - Significant legal precedent favoring workers
                
                Key Protections:
                - Minimum wage laws may apply if misclassified
                - Earned sick time for employees
                - Unemployment insurance eligibility
                - Workers' compensation coverage
                - Protection against retaliation
                - Right to organize
                
                Gig Worker Specific:
                - No Prop 22-style exemption (unlike CA)
                - Uber/Lyft settlement provides some benefits
                - Delivery workers exploring unionization
                - Strong attorney general enforcement
                
                Appeal Rights:
                - Platforms must provide clear deactivation reason
                - Right to challenge misclassification
                - Can file wage claims if misclassified
                - Unemployment benefits possible
                - Legal aid available for wage theft
                
                Boston-Specific:
                - High concentration of gig workers
                - Strong labor union presence
                - Active worker advocacy groups
                - Progressive city council
                
                Rideshare Settlement Benefits:
                - Minimum earnings guarantees
                - Paid sick time
                - Occupational accident insurance
                - Healthcare stipends
                - Appeals process for deactivation
                
                Best Practices:
                - Understand your classification status
                - Document all platform control over work
                - Save evidence of employee-like treatment
                - Track hours and earnings meticulously
                - Join worker advocacy organizations
                
                Relevance: Massachusetts has strong worker protections; misclassification claims are viable.""",
            "tags": ["massachusetts", "abc test", "worker classification", "misclassification", "protections", "boston"]
        },
        {
            "id": "ma-appeal-strategy",
            "title": "Massachusetts Gig Worker Appeal Guide",
            "category": "Appeal Strategies",
            "state": "Massachusetts",
            "platform": "All",
            "content": """Leveraging Massachusetts' strong labor laws in deactivation appeals.
                
                Legal Foundation:
                - MA ABC Test creates employee presumption
                - Strong wage and hour laws
                - Attorney General actively enforces
                - Significant legal precedent for workers
                
                Appeal Strategy:
                1. Challenge deactivation through platform
                2. Reference MA worker classification laws
                3. Cite rideshare settlement if applicable
                4. Threaten misclassification claim
                5. File wage claim if applicable
                
                Evidence Collection:
                - Platform's control over work methods
                - Required acceptance rates
                - Inability to set own rates
                - Termination without cause
                - Performance monitoring
                - Training requirements
                - Equipment requirements
                
                Key Legal Arguments:
                - Deactivation proves employee relationship
                - Platform exercised employer-like control
                - No true independence in work
                - Entitled to employee protections
                - Wage theft if unpaid for work time
                
                Misclassification Claim Elements:
                - Platform controls when/where you work
                - Can't negotiate rates
                - Performance monitoring
                - Unilateral termination
                - Required to follow platform rules
                - Use of platform's equipment/app
                
                Escalation Resources:
                - MA Attorney General's Office: mass.gov/ago
                - Fair Labor Division: (617) 727-3465
                - MA Unemployment Assistance
                - Greater Boston Legal Services
                - Community Labor United
                - Rideshare Drivers United (Boston)
                
                Platform-Specific Tips:
                - Uber/Lyft: Reference 2024 settlement terms
                - DoorDash: Challenge independent contractor status
                - Instacart: Document control over work
                - All: Emphasize lack of true independence
                
                Settlement Leverage:
                - Uber/Lyft workers have specific appeal rights
                - Reference settlement agreement terms
                - Cite minimum earnings guarantees
                - Demand benefits you're entitled to""",
            "tags": ["massachusetts", "appeal strategy", "abc test", "misclassification", "legal rights", "settlement"]
        },
        
        # ============================================
        # COLORADO
        # ============================================
        {
            "id": "co-gig-laws",
            "title": "Colorado Gig Worker Bill of Rights",
            "category": "State Laws",
            "state": "Colorado",
            "platform": "All",
            "content": """Colorado's emerging gig worker protections and bill of rights.
                
                Proposed Gig Worker Bill of Rights:
                - Minimum earnings standards
                - Transparency in deactivation decisions
                - Right to appeal with evidence
                - Protection against retaliation
                - Access to earnings data
                - Rest period requirements
                
                Current Protections:
                - Wage theft prevention laws
                - Anti-discrimination protections
                - Independent contractor misclassification remedies
                - Unemployment insurance in some cases
                - Workers' compensation for certain work
                
                Denver Specific:
                - City council considering gig worker ordinance
                - Strong labor advocacy presence
                - High cost of living driving worker organizing
                - Active gig worker coalitions
                
                Key Worker Rights:
                - Right to transparent deactivation reasoning
                - Protection from arbitrary termination
                - Access to dispute resolution
                - Fair treatment regardless of classification
                - Ability to organize and advocate
                
                Appeal Considerations:
                - Document platform control over work
                - Reference Colorado wage laws
                - Highlight lack of true independence
                - Cite proposed bill of rights principles
                - Gather evidence of unfair treatment
                
                Platform Operations:
                - Uber/Lyft: Major presence in Denver/Boulder
                - DoorDash: Active throughout Front Range
                - Instacart: King Soopers/Safeway partnerships
                - Ski resort area unique challenges
                
                Best Practices:
                - Stay informed on pending legislation
                - Join Colorado gig worker groups
                - Document all work and communications
                - Track earnings and expenses
                - Participate in advocacy efforts
                
                Relevance: Colorado is rapidly developing protections; early adoption expected soon.""",
            "tags": ["colorado", "bill of rights", "denver", "protections", "transparency", "organizing"]
        },
        
        # ============================================
        # OREGON
        # ============================================
        {
            "id": "or-gig-laws",
            "title": "Oregon Gig Worker Protections",
            "category": "State Laws",
            "state": "Oregon",
            "platform": "All",
            "content": """Oregon and Portland gig worker protections and labor laws.
                
                State-Level Protections:
                - Independent contractor test (similar to ABC)
                - Wage and hour laws if misclassified
                - Paid sick leave (if employee status)
                - Workers' compensation coverage
                - Unemployment insurance eligibility
                
                Portland Specific:
                - Delivery worker protections under consideration
                - Living wage advocacy efforts
                - Strong union presence
                - Progressive city council
                - Worker-friendly enforcement
                
                Key Protections:
                - Right to fair treatment
                - Protection from discrimination
                - Wage theft remedies
                - Access to legal aid
                - Organizing rights protected
                
                Appeal Rights:
                - Platform policies govern primary appeal
                - State labor laws provide backup
                - Misclassification claims viable
                - Legal aid available
                - Worker advocacy groups active
                
                Portland Metro Considerations:
                - Bridge toll issues affect earnings
                - Bike delivery common (Portland culture)
                - Rain/weather impacts year-round
                - Parking enforcement strict downtown
                - Food cart delivery challenges
                
                Best Practices:
                - Document weather-related delays
                - Keep bridge toll receipts
                - Track parking tickets from work
                - Save customer communications
                - Join Portland gig worker groups
                
                Resources:
                - Oregon Bureau of Labor and Industries: oregon.gov/boli
                - Portland Workers' Rights Center
                - Legal Aid Services of Oregon
                - Portland Rideshare Drivers Association
                
                Relevance: Oregon's progressive labor stance creates favorable environment for worker appeals.""",
            "tags": ["oregon", "portland", "protections", "labor laws", "misclassification", "progressive"]
        },
        {
            "id": "or-portland-appeals",
            "title": "Portland Gig Worker Appeal Strategy",
            "category": "Appeal Strategies",
            "state": "Oregon",
            "platform": "All",
            "content": """Appeal strategies leveraging Oregon's worker-friendly environment.
                
                Legal Foundation:
                - Oregon independent contractor test
                - Strong wage and hour enforcement
                - Progressive labor bureau
                - Worker-friendly legal precedent
                
                Building Your Appeal:
                1. Platform internal process (48-72 hours)
                2. Reference Oregon labor laws
                3. Cite worker-protective policies
                4. Gather comprehensive evidence
                5. Threaten BOLI complaint if needed
                
                Evidence Collection:
                - Portland weather impacts (rain, ice)
                - Bridge toll documentation
                - Traffic/parking issues
                - Customer communications
                - Platform control documentation
                - Earnings records
                
                Key Arguments:
                - Weather beyond control (Portland rain)
                - Infrastructure challenges (bridges)
                - Platform's unreasonable expectations
                - Excellent overall track record
                - Lack of true independent contractor status
                
                Escalation Path:
                1. Platform appeal
                2. Request supervisor review
                3. Oregon BOLI complaint
                4. Legal Aid consultation
                5. Misclassification claim
                6. Small claims for lost wages
                
                Portland-Specific Tips:
                - Document MAX train delays affecting deliveries
                - Show bridge openings causing delays
                - Cite bike infrastructure issues
                - Reference parking enforcement problems
                - Highlight rainy weather impacts
                
                Resources:
                - Oregon BOLI: (971) 673-0761
                - Portland Workers' Rights: (503) 233-4181
                - Legal Aid Services: (503) 224-4086
                - Portland Rideshare Drivers group""",
            "tags": ["oregon", "portland", "appeal strategy", "weather", "boli", "worker rights"]
        }
    ]

def add_phase1_to_firestore():
    """Add Phase 1 state articles to Firestore"""
    articles = get_phase1_articles()
    
    print(f"\n{'='*70}")
    print(f"PHASE 1 STATE EXPANSION")
    print(f"Adding {len(articles)} articles for 6 states:")
    print(f"Texas, Florida, Illinois, Massachusetts, Colorado, Oregon")
    print(f"{'='*70}\n")
    
    success_count = 0
    error_count = 0
    
    for article in articles:
        try:
            article_data = {
                **article,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "tier": "summary",
                "usage_count": 0,
                "success_rate": 0.0,
                "source_url": None
            }
            
            doc_ref = db.collection('knowledge_base').document(article['id'])
            doc_ref.set(article_data)
            
            print(f"✓ Added: {article['id']} - {article['title']}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ Failed: {article['id']} - {str(e)}")
            error_count += 1
    
    print(f"\n{'='*70}")
    print(f"Phase 1 Addition Complete!")
    print(f"✓ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"{'='*70}")
    print(f"\nTotal knowledge base: 13 (existing) + {success_count} (new) = {13 + success_count}")
    print(f"\nNext steps:")
    print(f"1. Restart backend to index new documents in Pinecone")
    print(f"2. Test appeals for new states (TX, FL, IL, MA, CO, OR)")
    print(f"3. Verify RAG retrieves state-specific policies")

if __name__ == "__main__":
    add_phase1_to_firestore()
