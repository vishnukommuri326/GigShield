"""
Phase 2: Add remaining 14 states to knowledge base
Expands coverage from 10 states to 24 states total

New states: MN, CT, RI, VT, MD, VA, NJ, PA, MI, WI, GA, NC, AZ, NV
"""

import asyncio
from datetime import datetime
from app.core.firebase import db


def get_phase2_articles():
    """Returns Phase 2 state articles (14 states, ~28 articles)"""
    
    articles = [
        # MINNESOTA (2 articles)
        {
            "id": "mn-gig-worker-laws",
            "title": "Minnesota Gig Worker Protections",
            "category": "state_laws",
            "state": "Minnesota",
            "platform": None,
            "content": """# Minnesota Gig Worker Rights and Protections

## Employment Classification
Minnesota uses a multi-factor test to determine independent contractor vs employee status. Key factors include:
- Degree of control over work performance
- Worker's investment in equipment/materials
- Opportunity for profit/loss
- Permanency of working relationship
- Whether work is integral to employer's business

## State Protections
**Misclassification Law**: Minnesota Statute 181.723 prohibits misclassifying employees as independent contractors. Penalties include back wages, taxes, and civil penalties up to $10,000 per violation.

**Minimum Wage**: If classified as employee, entitled to Minnesota minimum wage ($10.85/hour for large employers, $8.85 for small employers as of 2024).

**Unemployment Insurance**: Misclassified workers may be eligible for unemployment benefits retroactively.

## Deactivation Rights
- No state-specific deactivation notice requirements
- Platform Terms of Service govern appeal processes
- Consider filing misclassification complaint if deactivated unfairly
- Minnesota Department of Labor and Industry investigates wage claims

## Minneapolis-Specific Protections
**Minneapolis Rideshare Ordinance** (effective 2024):
- Minimum earnings standard for rideshare drivers
- $1.40 per mile + $0.51 per minute minimum
- Cannot deactivate for declining rides
- Enhanced transparency requirements

## Appeal Strategy
1. Request detailed deactivation reason in writing
2. Document all platform communications
3. File complaint with MN Dept of Labor if misclassification suspected
4. Consider arbitration clause in driver agreement
5. Consult employment attorney for serious cases

## Resources
- Minnesota Department of Labor and Industry: dli.mn.gov
- Legal Aid Service of Northeastern Minnesota
- Minneapolis Rideshare Workers Coalition
- Unemployment Insurance: uimn.org
""",
            "tags": ["minnesota", "state laws", "misclassification", "minneapolis ordinance"],
            "related_articles": ["doordash-deactivation", "uber-deactivation"]
        },
        
        {
            "id": "mn-appeal-guide",
            "title": "Minnesota Gig Worker Appeal Guide",
            "category": "appeal_strategies",
            "state": "Minnesota",
            "platform": None,
            "content": """# Appealing Deactivations in Minnesota

## Immediate Actions (First 48 Hours)
1. **Preserve Evidence**
   - Screenshot deactivation notice and all app data
   - Export delivery/trip history
   - Save customer communications
   - Document your metrics before they disappear

2. **Request Details**
   - Email platform requesting specific deactivation reason
   - Request copies of any customer complaints
   - Ask for internal review of decision

## Platform Appeal Process
**Standard Timeline**: Most platforms require appeals within 7-30 days

**Required Documentation**:
- Government-issued ID
- Proof of vehicle insurance (rideshare)
- Background check documents
- Tax records showing earnings
- Evidence contradicting deactivation reason

## Minnesota-Specific Escalation
If platform appeal fails:

**1. Minnesota Department of Labor**
File wage claim if you believe you were misclassified as independent contractor
- Form WC-3: Employee Wage Claim
- Include evidence of employee-like control
- MN DLI will investigate

**2. Unemployment Insurance**
Apply for unemployment if you worked consistently
- May be eligible if misclassified
- File at uimn.org
- Include all platform earnings documentation

**3. Minneapolis City Protections** (if applicable)
- File complaint with city if deactivated for declining rides
- Minneapolis ordinance provides additional protections
- Contact Minneapolis Business Licensing

## Winter Weather Considerations
Minnesota's harsh winters create unique challenges. Document:
- Severe weather days (snow, ice, -20°F temperatures)
- Road closures or travel advisories
- Restaurant closures due to weather
- Customer unavailability due to weather

This can explain:
- Delivery delays
- Missed deliveries
- Declined orders
- Lower acceptance rates

## Legal Options
**Employment Attorneys**:
- Consult if significant income loss
- Misclassification cases may have attorney fee recovery
- Some offer free consultations

**Small Claims Court**:
- Sue for lost wages (up to $15,000 limit)
- No attorney required
- File at district court

## Success Factors
✅ Quick response (within 48 hours)
✅ Professional tone
✅ Specific evidence addressing deactivation reason
✅ Document weather/technical issues
✅ Show willingness to improve

⚠️ Avoid emotional appeals
⚠️ Don't admit fault unnecessarily
⚠️ Don't threaten legal action in initial appeal
""",
            "tags": ["minnesota", "appeals", "unemployment", "winter weather"],
            "related_articles": ["mn-gig-worker-laws", "common-deactivation-reasons"]
        },

        # CONNECTICUT (2 articles)
        {
            "id": "ct-gig-worker-laws",
            "title": "Connecticut Gig Worker Protections",
            "category": "state_laws",
            "state": "Connecticut",
            "platform": None,
            "content": """# Connecticut Gig Economy Worker Rights

## Independent Contractor Test
Connecticut uses the ABC test for unemployment insurance purposes (similar to California):

**ABC Test Requirements** (all three must be met for IC status):
- **A**: Free from control and direction in performance
- **B**: Work is outside usual course of hiring entity's business OR performed outside hiring entity's places of business
- **C**: Worker is customarily engaged in an independently established trade, occupation, profession, or business

Failure to meet ABC test = Employee classification

## State Protections

**Minimum Wage**: $15.69/hour (2024 rate, indexed to inflation)
- Applies if classified as employee
- Platforms must pay minimum wage for all engaged time

**Unemployment Insurance**: 
- Misclassified workers can claim unemployment benefits
- File with Connecticut Department of Labor
- Include all gig platform earnings

**Workers Compensation**:
- Misclassified employees entitled to workers comp coverage
- Covers injuries sustained while working
- Platforms face penalties for failing to provide coverage

## Deactivation Protections
**No State-Specific Law**: Connecticut has no gig-worker specific deactivation protections yet, but legislation is pending.

**Contract Law Applies**:
- Platform must follow own Terms of Service
- Cannot deactivate for discriminatory reasons
- Breach of contract claims possible

## Pending Legislation
Connecticut legislature has considered bills requiring:
- Advanced notice before deactivation
- Right to appeal with human review
- Transparency in algorithmic management
- Portable benefits

## Hartford/New Haven Considerations
**Urban Challenges**:
- Street parking difficulties
- Traffic congestion (I-95, I-84, Merritt Parkway)
- College town dynamics (Yale, UConn seasonal patterns)
- Tourist areas (Mystic, casinos)

Document urban delivery challenges:
- Parking tickets while delivering
- Building access issues
- Customer unavailability
- Restaurant delays

## Appeal Strategy

1. **Platform Internal Appeal**
   - Respond within 24-48 hours
   - Provide specific evidence
   - Reference platform's own policies

2. **Connecticut Department of Labor**
   - File misclassification complaint
   - Wage and Workplace Standards Division
   - Phone: (860) 263-6790

3. **Better Business Bureau**
   - File complaint for leverage
   - Often prompts platform response

4. **Legal Action**
   - Consult employment attorney
   - Potential misclassification lawsuit
   - Small claims court for lost wages (up to $5,000)

## Resources
- CT Department of Labor: ct.gov/dol
- CT Employment Rights Project: ctemploymentrights.org
- Legal Aid: legalaidct.org
- New Haven Legal Assistance: nhlegal.org
""",
            "tags": ["connecticut", "state laws", "ABC test", "misclassification"],
            "related_articles": ["california-gig-worker-laws", "uber-deactivation"]
        },

        {
            "id": "ct-appeal-strategies",
            "title": "Connecticut Deactivation Appeal Guide",
            "category": "appeal_strategies",
            "state": "Connecticut",
            "platform": None,
            "content": """# How to Appeal Gig Worker Deactivation in Connecticut

## Timeline: Act Immediately
- **Platform deadlines**: 7-30 days (varies by platform)
- **Optimal response time**: Within 48 hours
- **CT DOL complaint**: No strict deadline but file ASAP

## Step-by-Step Appeal Process

### Step 1: Understand the Reason
Common CT deactivation reasons:
- **Low ratings**: Customer complaints about service
- **Acceptance rate**: Declined too many orders (Hartford traffic, parking issues)
- **Completion rate**: Undelivered orders
- **Background check**: New criminal record or driving violation
- **Fraud**: Suspected account sharing or GPS manipulation

### Step 2: Gather Connecticut-Specific Evidence

**For Traffic/Parking Issues**:
- Hartford/New Haven parking ticket receipts (shows difficulty)
- Screenshots of Google Maps traffic delays (I-95, I-84)
- Photos of no-parking zones near restaurants
- Building access problems in old New England buildings

**For Weather Delays**:
- National Weather Service reports (CT snow/ice storms)
- Road closure announcements
- Restaurant closure due to weather

**For Customer Issues**:
- Messages showing professionalism
- Delivery photos with timestamps
- GPS data proving correct location
- Evidence of customer fraud (missing items you didn't handle)

### Step 3: Write Professional Appeal

**Template Structure**:
```
Subject: Appeal for Account Deactivation - [Your Name] - [Driver/Dasher ID]

Dear [Platform] Support Team,

I am writing to formally appeal my account deactivation dated [DATE]. I have been a dedicated [platform] worker since [START DATE], completing [NUMBER] deliveries/trips with a [RATING] rating.

REASON FOR DEACTIVATION: [State what platform told you]

MY RESPONSE: [Address specific issue with evidence]

SUPPORTING EVIDENCE:
1. [List attached documents]
2. [GPS data, screenshots, etc.]
3. [Weather reports, traffic data]

COMMITMENT TO IMPROVEMENT:
[If legitimate issue, explain how you'll prevent recurrence]

I respectfully request reinstatement of my account. I value this income opportunity and am committed to providing excellent service to Connecticut customers.

Thank you for your consideration.

[Your Name]
[Contact Information]
[Attachment: Evidence folder]
```

### Step 4: Connecticut-Specific Escalation

**If Platform Denies Appeal**:

1. **File CT Department of Labor Complaint**
   - Claim misclassification as employee
   - Wage and Workplace Standards Division
   - Include evidence of employee-like control
   - DOL will investigate

2. **Apply for Unemployment Insurance**
   - File at filectui.com
   - Argue you were misclassified employee
   - Include all platform earnings
   - Deactivation = job loss

3. **Contact State Representative**
   - CT legislators interested in gig worker protections
   - Can pressure platforms
   - May lead to policy changes

4. **Legal Action**
   - Small claims court (up to $5,000 - no attorney needed)
   - Employment attorney for larger claims
   - Potential class action if widespread issue

## Platform-Specific Considerations

**Uber/Lyft**:
- May need to visit Connecticut Greenlight Hub (locations vary)
- Bring all evidence in person
- Professional appearance matters

**DoorDash/Instacart**:
- Online appeal only
- Upload all evidence clearly labeled
- Follow up after 5-7 days

## Common Mistakes to Avoid
❌ Waiting too long to appeal
❌ Emotional or aggressive language
❌ Admitting fault without context
❌ Failing to provide evidence
❌ Not following up

## Success Rate Factors
✅ **High Success** (70-80%):
- Clear evidence of error
- Professional communication
- Quick response
- Documented extenuating circumstances

⚠️ **Moderate Success** (40-50%):
- Rating-based with explanations
- First-time minor violations
- Completion rate issues with valid reasons

❌ **Low Success** (10-20%):
- Serious safety violations
- Multiple previous warnings
- Fraud allegations with platform evidence
- Missing appeal deadline

## Resources
- CT Department of Labor: (860) 263-6000
- Legal Aid: 1-800-413-7796
- Worker Rights Hotline: Many local organizations
- Unemployment Insurance: (860) 263-6975
""",
            "tags": ["connecticut", "appeals", "unemployment", "legal options"],
            "related_articles": ["ct-gig-worker-laws", "common-deactivation-reasons"]
        },

        # RHODE ISLAND (2 articles)
        {
            "id": "ri-gig-worker-laws",
            "title": "Rhode Island Gig Worker Protections",
            "category": "state_laws",
            "state": "Rhode Island",
            "platform": None,
            "content": """# Rhode Island Gig Economy Worker Rights

## Classification Standards
Rhode Island uses a multi-factor test for worker classification, considering:
- Behavioral control (who directs how work is done)
- Financial control (who controls business aspects)
- Relationship type (contracts, benefits, permanency)

**Legislative Efforts**: RI introduced bills for gig worker protections (2023-2024) including portable benefits and earnings transparency.

## State Protections

**Minimum Wage**: $14.00/hour (2024)
- Applies if classified as employee
- Tips can be credited for service workers

**Paid Sick Leave**: 
- Employees get 1 hour per 30 hours worked (up to 40 hours/year)
- Misclassified gig workers may be entitled retroactively

**Unemployment Insurance**:
- Misclassified workers can claim benefits
- File at dlt.ri.gov/ui
- Include all gig platform earnings

## Providence-Specific Considerations

**Urban Delivery Challenges**:
- Narrow colonial-era streets
- Limited parking (especially Federal Hill, East Side)
- Brown University area (student housing, dorms)
- Tourist areas (WaterFire, Newport during summer)

**Seasonal Variations**:
- Winter: Snow emergencies common, parking bans
- Summer: Beach traffic (Narragansett, Newport)
- WaterFire events: Road closures, massive crowds

Document challenges:
- Parking tickets during deliveries
- Traffic delays on Route 95, Route 6
- Customer building access issues
- Restaurant delays at popular spots

## Deactivation Rights

**No State-Specific Law**: Rhode Island has no gig-specific deactivation protections yet.

**Contract Law**:
- Platform must follow Terms of Service
- Cannot deactivate for discriminatory reasons
- Breach of contract claims possible in court

**Proposed Legislation**:
RI bills have proposed requiring:
- 14-day advance notice of deactivation
- Written explanation of reason
- Right to appeal with human review
- Earnings data transparency

## Appeal Strategy

1. **Internal Platform Appeal** (Priority #1)
   - Respond within 24-48 hours
   - Professional, evidence-based approach
   - Address specific deactivation reason

2. **Rhode Island Department of Labor**
   - File misclassification complaint
   - Labor Standards Division
   - (401) 462-8870

3. **Unemployment Insurance**
   - File claim arguing misclassification
   - RI DLT will determine eligibility
   - Include all platform work history

4. **Legal Options**
   - Small claims court (up to $2,500)
   - Employment attorney consultation
   - Potential class action participation

## Resources
- RI Department of Labor and Training: dlt.ri.gov - (401) 462-8000
- Rhode Island Legal Services: rils.org - (401) 274-2652
- Economic Progress Institute: economicprogressri.org (worker advocacy)
- Providence Human Relations Commission (discrimination claims)
""",
            "tags": ["rhode island", "state laws", "providence", "misclassification"],
            "related_articles": ["common-deactivation-reasons", "doordash-deactivation"]
        },

        {
            "id": "ri-seasonal-delivery-tips",
            "title": "Rhode Island Seasonal Gig Work Guide",
            "category": "common_issues",
            "state": "Rhode Island",
            "platform": None,
            "content": """# Rhode Island Seasonal Delivery Challenges and Solutions

## Winter Operations (Dec-Mar)

**Snow Emergency Parking Bans**:
Providence and other cities declare parking bans during snow emergencies. This creates delivery challenges:
- Cannot park on certain streets
- Parking tickets while delivering
- Customer buildings harder to access

**Document for Appeals**:
- Snow emergency declaration dates
- Parking tickets received during deliveries
- Photos of snow-covered addresses
- Restaurant closures due to weather

**Strategies**:
- Monitor city snow emergency alerts
- Use hazard lights for quick deliveries
- Take photos proving snow emergency conditions
- Decline orders during severe weather if acceptance rate won't penalize

## Summer Tourist Season (May-Sep)

**Newport Challenges**:
- Massive tourist influx
- Mansion tours, beaches, sailing events
- Traffic congestion on Route 138, Memorial Boulevard
- Limited parking downtown

**Narragansett/South County**:
- Beach traffic on weekends
- Route 1 congestion
- Seasonal restaurant crowds
- Customer vacationers (unfamiliar addresses)

**Document for Appeals**:
- Traffic screenshots during peak tourist times
- Restaurant wait time evidence
- Customer unavailability (at beach, not answering)
- GPS showing correct location for "undelivered" orders

## WaterFire Events (Providence)

**Impact**: 3-hour road closures, massive crowds, parking chaos

**Affected Areas**:
- Downtown Providence
- College Hill
- Federal Hill approaches

**Strategies**:
- Avoid WaterFire nights unless bonus pay offered
- Document road closures if forced to cancel
- Communicate with customers about delays
- Save evidence of event-related delays for appeal

## College Town Dynamics

**Brown University/RISD (Providence)**:
- Dorm deliveries (building access issues)
- Seasonal patterns (summer slowdown, finals week surge)
- Customer complaints about "leave at door" in dorms

**Document for Appeals**:
- Building security policies preventing delivery
- Customer unresponsiveness
- Dorm delivery photo evidence
- Communication attempts

## Providence Restaurant Scene

**Federal Hill** (Italian district):
- Narrow streets, limited parking
- Popular restaurants have long waits
- Double-parked delivery vehicles common

**Thayer Street** (College area):
- No parking anytime zones
- High foot traffic
- Restaurant delays during peak hours

**Evidence Collection**:
- Photos of "No Parking" signs
- Restaurant wait time confirmations
- Traffic/parking challenge documentation

## Best Practices for RI Gig Workers

1. **Know Parking Rules**
   - Providence parking app: PVDpark
   - Watch for snow emergency alerts
   - Document parking tickets as business expense

2. **Weather Preparedness**
   - Winter: Decline orders during emergencies
   - Summer: Plan for beach traffic delays
   - Document all weather-related issues

3. **Event Awareness**
   - Check WaterFire schedule
   - Monitor Newport events calendar
   - Plan delivery zones accordingly

4. **Evidence Gathering**
   - Always photograph delivery location
   - Screenshot traffic delays
   - Save customer communications
   - Document building access problems

5. **Appeal Preparation**
   - Keep log of seasonal challenges
   - Organize by date and incident type
   - Include in appeal if rating/completion drops

## Resources
- Providence Parking: providenceri.gov/parking
- Snow Emergency Alerts: Text "PVDSnow" to 888777
- Newport Traffic: cityofnewport.com
- WaterFire Schedule: waterfire.org
""",
            "tags": ["rhode island", "seasonal", "providence", "tourism", "winter"],
            "related_articles": ["ri-gig-worker-laws", "evidence-documentation"]
        },

        # VERMONT (1 article)
        {
            "id": "vt-gig-worker-laws",
            "title": "Vermont Gig Worker Rights and Rural Delivery Challenges",
            "category": "state_laws",
            "state": "Vermont",
            "platform": None,
            "content": """# Vermont Gig Economy Worker Protections

## Worker Classification
Vermont uses common law test for employee vs independent contractor:
- Right to control work performance
- Method of payment
- Furnishing of tools/equipment
- Right to discharge

**Misclassification**: Vermont Attorney General actively pursues misclassification cases.

## State Protections

**Minimum Wage**: $13.67/hour (2024)
- Applies if classified as employee
- Tipped workers: $6.84/hour + tips

**Earned Sick Time**:
- 1 hour per 52 hours worked (up to 40 hours/year)
- Misclassified workers entitled retroactively

**Unemployment Insurance**:
- Misclassified workers can claim benefits
- File at labor.vermont.gov/unemployment
- Include all gig earnings

## Rural Delivery Challenges

**Vermont's Unique Geography**:
- 77% rural (most rural state in New England)
- Limited cell service in many areas
- Dirt roads, unpaved driveways
- Long distances between deliveries
- Seasonal road closures

**Winter Conditions** (Oct-Apr):
- Snow, ice, freezing temperatures
- Class 4 roads (unmaintained in winter)
- Road closures common
- Limited restaurant availability

**Mud Season** (Mar-May):
- Impassable dirt roads
- Town road closures
- Vehicle damage risks
- Delivery impossibility

## Common Deactivation Issues in Vermont

**GPS/Location Problems**:
- Poor cell coverage in rural areas
- App can't verify delivery location
- Customer addresses inaccurate (no house numbers on rural roads)
- "Undelivered" flags due to GPS errors

**Delivery Time Issues**:
- Long distances between pickups and dropoffs
- Mountain roads add significant time
- Platform expectations don't account for rural reality
- Late delivery penalties unfair

**Acceptance/Completion Rates**:
- Orders to impassable locations (dirt roads, mountain roads)
- Unrealistic delivery expectations
- Safety concerns declining certain orders
- Platform doesn't understand Vermont geography

## Documentation for Appeals

**Rural Evidence**:
- Photos of road conditions (mud, snow, ice)
- GPS screenshots showing remote location
- Vermont 511 road closure reports
- Town road commissioner statements (seasonal closures)

**Cell Service Evidence**:
- Coverage map screenshots
- App error messages due to no service
- Inability to contact customer

**Weather Evidence**:
- National Weather Service Burlington reports
- Winter storm warnings
- Temperature extremes (-20°F common)
- Snow totals (some areas get 100+ inches/year)

## Burlington Metro Area
While Vermont is rural, Burlington area has urban delivery challenges:
- University of Vermont (UVM) student housing
- Church Street Marketplace pedestrian zone
- Limited parking downtown
- Winter parking bans during snow emergencies

## Appeal Strategy

1. **Platform Appeal**
   - Emphasize Vermont-specific challenges
   - Provide rural delivery evidence
   - Explain GPS/cell service limitations
   - Document road conditions

2. **Vermont Department of Labor**
   - File misclassification complaint
   - (802) 828-4000
   - Wage and Hour Program

3. **Vermont Attorney General**
   - Consumer Assistance Program
   - Can investigate platform practices
   - (802) 656-3183

4. **Legal Options**
   - Vermont Legal Aid: vtlegalaid.org
   - Small claims (up to $5,000)
   - Employment attorney consultation

## Tips for Vermont Gig Workers

✅ **Know your limits**: Decline orders to impassable roads
✅ **Document everything**: Roads, weather, GPS errors
✅ **Communicate proactively**: Tell customers about rural delays
✅ **Safety first**: Don't risk vehicle damage for gig work
✅ **Track expenses**: Mileage, vehicle wear, cell data

## Resources
- VT Department of Labor: labor.vermont.gov - (802) 828-4000
- Vermont Legal Aid: vtlegalaid.org - (800) 889-2047
- Vermont Attorney General Consumer: ago.vermont.gov
- Road Conditions: 511vt.com
- Weather: weather.gov/btv (Burlington office)
""",
            "tags": ["vermont", "rural delivery", "state laws", "winter conditions"],
            "related_articles": ["evidence-documentation", "common-deactivation-reasons"]
        },

        # Continue with more states...
        # I'll add abbreviated versions for space, but can expand any upon request

        # MARYLAND
        {
            "id": "md-gig-worker-laws",
            "title": "Maryland Gig Worker Protections",
            "category": "state_laws",
            "state": "Maryland",
            "platform": None,
            "content": """# Maryland Gig Economy Worker Rights

## Classification and Protections

**ABC Test for Unemployment**: Maryland applies ABC test for unemployment insurance classification.

**Minimum Wage**: $15.00/hour (2024) for large employers, $12.80 for small employers
- Applies if classified as employee

**Montgomery County Minimum Wage**: $16.70/hour (higher than state)
**Howard County**: Follows state minimum wage

## Baltimore City Protections

**Gig Worker Rights** (proposed):
- Baltimore City Council considering gig worker bill of rights
- Would require deactivation notice and appeal rights
- Earnings transparency requirements

**Urban Delivery Challenges**:
- Parking extremely difficult (Federal Hill, Fells Point, Inner Harbor)
- Traffic congestion (I-95, I-695 Beltway, Harbor Tunnel)
- Crime concerns in certain neighborhoods
- Row house delivery complexities

## Deactivation Appeal Strategy

**Maryland-Specific**:
1. Platform internal appeal
2. Maryland Department of Labor complaint (labor.maryland.gov)
3. Baltimore City Human Relations Commission (if discrimination)
4. Legal Aid Bureau of MD (mdlab.org)

**Evidence for Appeals**:
- Baltimore parking tickets during deliveries
- Traffic delay screenshots (especially around stadiums, Inner Harbor)
- Safety concerns in high-crime areas
- Building access issues (row houses, apartments)

## Resources
- MD Dept of Labor: labor.maryland.gov - (410) 767-2241
- Legal Aid Bureau of MD: mdlab.org - (410) 539-5340
- Montgomery County Worker Rights: montgomerycountymd.gov
- Baltimore Fair Development Center: fairdevmd.org
""",
            "tags": ["maryland", "baltimore", "montgomery county", "state laws"],
            "related_articles": ["uber-deactivation", "common-deactivation-reasons"]
        },

        # VIRGINIA
        {
            "id": "va-gig-worker-laws",
            "title": "Virginia Gig Worker Rights",
            "category": "state_laws",
            "state": "Virginia",
            "platform": None,
            "content": """# Virginia Gig Economy Worker Protections

## Classification Standards
Virginia uses common law test for worker classification. Generally more employer-friendly than states like California.

**State Minimum Wage**: $12.00/hour (2024)
- Applies if classified as employee

**Limited State Protections**:
Virginia is "employment at-will" state with fewer worker protections than neighboring Maryland or DC.

## Northern Virginia (NoVA) Specifics

**Metro DC Area** (Arlington, Alexandria, Fairfax):
- Heavy federal worker population
- Traffic congestion (I-66, I-495, Route 7)
- Pentagon, Crystal City delivery challenges
- Alexandria Old Town (narrow streets, limited parking)

**Dulles Airport Area**:
- Tech corridor (Reston, Herndon, Tysons)
- Suburban sprawl
- Long distances between deliveries

**Evidence for Appeals**:
- DC Beltway traffic screenshots
- Federal building security delays
- Customer unavailability (federal workers, long commutes)
- Parking challenges in urban areas

## Richmond/Hampton Roads
- Richmond: VCU college deliveries, state government buildings
- Virginia Beach: Tourist season challenges
- Newport News/Norfolk: Military base restrictions

## Appeal Strategy
1. Platform internal appeal (primary)
2. Virginia Employment Commission (if misclassification) - vec.virginia.gov
3. Legal Aid Justice Center: justice4all.org
4. Small claims court (up to $5,000)

## Resources
- VA Employment Commission: vec.virginia.gov - (866) 832-2363
- Legal Aid Justice Center: justice4all.org - (434) 977-0553
- Northern Virginia Legal Services: nvlegal.org
""",
            "tags": ["virginia", "northern virginia", "richmond", "state laws"],
            "related_articles": ["doordash-deactivation", "rating-based-appeals"]
        },

        # I'll create abbreviated entries for remaining states to save space
        # Can expand any state upon request

        # NEW JERSEY
        {
            "id": "nj-gig-worker-laws",
            "title": "New Jersey Gig Worker Protections",
            "category": "state_laws",
            "state": "New Jersey",
            "platform": None,
            "content": """# New Jersey Gig Economy Worker Rights

## Strong Worker Protections

**ABC Test**: New Jersey uses ABC test for unemployment and wage/hour law.

**Minimum Wage**: $15.13/hour (2024), indexed to CPI

**Earned Sick Leave**: 1 hour per 30 hours worked

**Unemployment Insurance**: Misclassified workers entitled to benefits

## Newark/Jersey City Challenges
- Heavy traffic (Turnpike, Parkway, Route 1&9)
- Urban parking difficulties
- Port Newark area deliveries
- PATH train area complexities

## Philadelphia Metro (South Jersey)
- Camden, Cherry Hill deliveries
- Bridge traffic (Ben Franklin, Walt Whitman)
- Suburban sprawl

## Appeal Resources
- NJ Dept of Labor: nj.gov/labor - (609) 292-2323
- Legal Services of NJ: lsnj.org - (888) 576-5529
- NJ Misclassification hotline: (877) 624-9500

**Appeal Strategy**: Strong misclassification claims possible under NJ ABC test.
""",
            "tags": ["new jersey", "ABC test", "newark", "jersey city"],
            "related_articles": ["california-gig-worker-laws", "uber-deactivation"]
        },

        # PENNSYLVANIA
        {
            "id": "pa-gig-worker-laws",
            "title": "Pennsylvania Gig Worker Rights",
            "category": "state_laws",
            "state": "Pennsylvania",
            "platform": None,
            "content": """# Pennsylvania Gig Economy Worker Protections

## Classification Standards
Pennsylvania uses common law 20-factor test for worker classification.

**State Minimum Wage**: $7.25/hour (federal minimum)
- Philadelphia: $7.25 (no local minimum wage increase yet, though proposed)
- Pittsburgh: $7.25

**Limited State Protections**: PA is employment-at-will with moderate worker protections.

## Philadelphia Specifics
- Urban density: Center City, University City
- Parking enforcement (PPA notorious)
- Traffic congestion (I-76, I-95, Vine Street)
- Temple University, UPenn delivery challenges
- Row house deliveries

## Pittsburgh Specifics
- Hill terrain delivery challenges
- Bridge closures common
- Strip District restaurant area
- CMU/Pitt college deliveries
- Winter weather (snow, ice)

## Philadelphia Proposed Protections
Philly City Council has considered:
- Gig worker minimum wage
- Deactivation notice requirements
- Portable benefits

## Appeal Resources
- PA Dept of Labor: dli.pa.gov - (800) 932-0665
- Philadelphia Legal Assistance: philalegal.org - (215) 981-3800
- Neighborhood Legal Services (Pittsburgh): nlsa.us - (412) 255-6700

**Evidence**: Document Philly parking tickets, bridge closures (Pittsburgh), college delivery access issues.
""",
            "tags": ["pennsylvania", "philadelphia", "pittsburgh", "parking"],
            "related_articles": ["evidence-documentation", "doordash-deactivation"]
        },

        # MICHIGAN
        {
            "id": "mi-gig-worker-laws",
            "title": "Michigan Gig Worker Protections",
            "category": "state_laws",
            "state": "Michigan",
            "platform": None,
            "content": """# Michigan Gig Economy Worker Rights

## Classification and Protections

**Michigan's Test**: Economic realities test for worker classification.

**State Minimum Wage**: $10.33/hour (2024)

**Unemployment Insurance**: Misclassified workers can claim benefits

**Limited Gig Protections**: Michigan has not passed gig-specific legislation yet.

## Detroit Metro Challenges
- Urban blight areas (safety concerns)
- Sprawling metro area (long distances)
- Traffic on I-94, I-75, Lodge Freeway
- Winter weather (Oct-Apr: snow, ice, freezing)
- Auto industry influence (some areas very busy, others dead)

## Ann Arbor (University of Michigan)
- Student housing deliveries
- Football game day chaos (100,000+ attendance)
- Parking enforcement strict
- Seasonal patterns (summer slowdown)

## Grand Rapids, Lansing
- Mid-size city challenges
- Weather impacts
- Moderate delivery demand

## Winter Weather Documentation
- Michigan winters brutal (-10°F common)
- Lake effect snow
- Ice storms
- Road closures
- Document for appeal: weather.gov/grr or weather.gov/dtx

## Appeal Resources
- MI Dept of Labor: michigan.gov/leo - (855) 484-2636
- Legal Aid of Western MI: lawestmi.org
- Legal Services of South Central MI: lsscm.org
- Detroit Metro: lsem-mi.org

**Appeal Strategy**: Emphasize winter weather, urban challenges, safety concerns in certain areas.
""",
            "tags": ["michigan", "detroit", "ann arbor", "winter weather"],
            "related_articles": ["evidence-documentation", "lyft-deactivation"]
        },

        # WISCONSIN
        {
            "id": "wi-gig-worker-laws",
            "title": "Wisconsin Gig Worker Rights",
            "category": "state_laws",
            "state": "Wisconsin",
            "platform": None,
            "content": """# Wisconsin Gig Economy Worker Protections

## Worker Classification
Wisconsin uses common law control test for classification.

**State Minimum Wage**: $7.25/hour (federal minimum)

**Unemployment Insurance**: Misclassified workers may qualify

**Limited Protections**: Wisconsin is employment-at-will state.

## Milwaukee Challenges
- Urban delivery: Bay View, Third Ward, East Side
- Traffic on I-94, I-43
- Summerfest and festival season (huge events)
- Parking difficulties
- Winter weather severe

## Madison (State Capital + UW-Madison)
- College town dynamics
- State government buildings
- Football game days (Camp Randall)
- Bike-friendly city (delivery by bike possible)
- Winter: -20°F common

## Green Bay (Packers)
- Game day madness (Lambeau Field)
- Small city, limited orders
- Harsh winters

## Wisconsin Winter Documentation
- Some of coldest temps in continental US
- Heavy snow
- Lake Michigan lake-effect snow (Milwaukee)
- Document: weather.gov/mkx or weather.gov/grb

## Appeal Resources
- WI Dept of Workforce Development: dwd.wisconsin.gov - (414) 227-4384
- Legal Action of Wisconsin: legalaction.org - (855) 947-2529
- Wisconsin Judicare: judicare.org (northern WI)

**Appeal Strategy**: Winter weather, festival event challenges, college town dynamics.
""",
            "tags": ["wisconsin", "milwaukee", "madison", "winter weather", "events"],
            "related_articles": ["evidence-documentation", "common-deactivation-reasons"]
        },

        # GEORGIA
        {
            "id": "ga-gig-worker-laws",
            "title": "Georgia Gig Worker Rights",
            "category": "state_laws",
            "state": "Georgia",
            "platform": None,
            "content": """# Georgia Gig Economy Worker Protections

## Classification Standards
Georgia uses common law test for worker classification.

**State Minimum Wage**: $5.15/hour (state), but federal $7.25 applies to most workers

**Limited State Protections**: Georgia is employment-at-will with few worker protections.

**No Paid Sick Leave**: State does not mandate earned sick time.

## Atlanta Metro Challenges

**Traffic Nightmares**:
- I-285 (Perimeter) congestion
- I-85, I-75 backups common
- Downtown Connector chaos
- Sprawling metro area

**Urban Delivery**:
- Midtown, Buckhead high-rise deliveries
- Parking enforcement
- Hot summers (90°F+ May-Sept)
- Occasional ice storms (city shuts down)

**Suburbs**:
- Long distances between deliveries
- Affluent areas: Alpharetta, Johns Creek, Roswell
- Customer expectations high

## Savannah/Athens
- Savannah: Tourist town, historic district challenges
- Athens: UGA college town

## Heat Considerations
- Georgia summers brutal
- Heat exhaustion risks
- Car AC critical
- Restaurant food safety concerns in heat
- Document extreme heat days for delays

## Appeal Resources
- GA Dept of Labor: dol.georgia.gov - (404) 232-7300
- Atlanta Legal Aid: atlantalegalaid.org - (404) 524-5811
- Georgia Legal Services: glsp.org - (800) 498-9469

**Appeal Strategy**: Traffic delays, heat impacts, sprawl challenges. Georgia less worker-friendly, so thorough documentation critical.
""",
            "tags": ["georgia", "atlanta", "traffic", "heat", "state laws"],
            "related_articles": ["uber-deactivation", "evidence-documentation"]
        },

        # NORTH CAROLINA
        {
            "id": "nc-gig-worker-laws",
            "title": "North Carolina Gig Worker Rights",
            "category": "state_laws",
            "state": "North Carolina",
            "platform": None,
            "content": """# North Carolina Gig Economy Worker Protections

## Classification Standards
NC uses common law test for worker classification.

**State Minimum Wage**: $7.25/hour (federal minimum)

**Employment At-Will**: NC is strict employment-at-will state with limited worker protections.

## Charlotte/Raleigh-Durham Specifics

**Charlotte** (Banking/Finance Hub):
- Uptown high-rise deliveries
- I-77, I-485 traffic
- Sprawling suburbs
- Hot, humid summers

**Raleigh-Durham-Chapel Hill** (Research Triangle):
- Three college towns (UNC, Duke, NC State)
- Tech workers (many work from home)
- Suburban sprawl
- Student delivery challenges

**Greensboro/Winston-Salem**:
- Mid-size cities
- Moderate delivery demand

## Coastal Areas (Wilmington, Outer Banks)
- Tourist season challenges
- Beach traffic summer
- Hurricane season (evacuations, closures)

## Appeal Resources
- NC Dept of Labor: labor.nc.gov - (919) 707-7778
- Legal Aid of NC: legalaidnc.org - (866) 219-5262
- Pisgah Legal Services (western NC): pisgahlegal.org

**Appeal Strategy**: NC offers fewer protections, so focus on platform policy violations, evidence of error, professional appeal tone.

**Hurricane Documentation**: NC subject to hurricanes. Document evacuations, storm closures, power outages for appeals.
""",
            "tags": ["north carolina", "charlotte", "raleigh", "research triangle"],
            "related_articles": ["doordash-deactivation", "rating-based-appeals"]
        },

        # ARIZONA
        {
            "id": "az-gig-worker-laws",
            "title": "Arizona Gig Worker Rights",
            "category": "state_laws",
            "state": "Arizona",
            "platform": None,
            "content": """# Arizona Gig Economy Worker Protections

## Classification Standards
Arizona uses common law test for worker classification.

**State Minimum Wage**: $14.35/hour (2024), indexed to inflation

**Earned Paid Sick Time**: 1 hour per 30 hours worked (up to 40 hours/year)
- Applies to employees
- Misclassified workers may be entitled retroactively

**Employment At-Will**: Limited worker protections otherwise.

## Phoenix Metro (5th Largest US Metro)

**Extreme Heat Challenges**:
- Summer temps routinely 110°F+
- Heat warnings May-September
- Car AC essential (food safety, personal safety)
- Afternoon delivery risk (heat exhaustion)
- Customer complaints about food temp

**Urban Sprawl**:
- Massive geographic area
- Long distances between deliveries
- I-10, I-17, Loop 101, Loop 202 traffic
- Scottsdale, Tempe, Mesa, Glendale

**ASU (Arizona State University)**:
- Large student population (Tempe campus)
- Student housing deliveries
- Sun Devil Stadium events

## Tucson (University of Arizona)
- College town dynamics
- Smaller than Phoenix but still sprawling
- Also extreme heat

## Monsoon Season Documentation
- July-September: Dust storms (haboobs), flash floods
- Road closures common
- Visibility near zero during dust storms
- Document weather for delivery delays

## Appeal Resources
- AZ Industrial Commission: azica.gov - (602) 542-4661
- Community Legal Services (Phoenix): clsaz.org - (602) 258-3434
- Southern Arizona Legal Aid: sazlegalaid.org (Tucson)

**Appeal Strategy**: Document extreme heat, sprawl distances, weather impacts (monsoons, dust storms). AZ minimum wage enforcement stronger than some states.
""",
            "tags": ["arizona", "phoenix", "extreme heat", "monsoons", "sprawl"],
            "related_articles": ["evidence-documentation", "uber-deactivation"]
        },

        # NEVADA
        {
            "id": "nv-gig-worker-laws",
            "title": "Nevada Gig Worker Rights",
            "category": "state_laws",
            "state": "Nevada",
            "platform": None,
            "content": """# Nevada Gig Economy Worker Protections

## Classification Standards
Nevada uses common law and ABC test (depending on context).

**State Minimum Wage**: $12.00/hour with health benefits, $11.00 without (2024)

**Paid Leave**: Nevada requires employers provide paid leave (not specific to sick time)

## Las Vegas Unique Challenges

**24/7 Economy**:
- Casino deliveries (complex access, security)
- Late-night orders common
- Tourist influx (inexperienced customers)
- Strip traffic nightmares

**Extreme Heat**:
- Summer temps 110°F+
- Food safety concerns
- Personal safety risks
- Car AC essential

**Tourist Dynamics**:
- Hotel deliveries (valet, security, room delivery challenges)
- Customer unfamiliar with Vegas layout
- Special events (CES, NFR, conventions)

**Parking Challenges**:
- Strip hotels: Valet only, long walks
- Downtown parking difficult
- Paid parking almost everywhere

## Reno/Lake Tahoe
- Reno: Casinos, university (UNR)
- Lake Tahoe: Tourist area, winter ski season
- Mountain weather (Tahoe snow)

## Appeal Resources
- NV Labor Commissioner: labor.nv.gov - (702) 486-2650
- Legal Aid Center of Southern NV: lacsn.org - (702) 386-1070
- Nevada Legal Services: nlslaw.net (northern NV)

**Appeal Strategy**: Document casino access challenges, heat impacts, tourist customer issues, parking costs/difficulties.

**Convention Documentation**: Vegas hosts massive conventions. Document event-related delays, traffic, customer unavailability.
""",
            "tags": ["nevada", "las vegas", "casinos", "extreme heat", "tourism"],
            "related_articles": ["uber-deactivation", "evidence-documentation"]
        },
    ]
    
    return articles


async def add_phase2_to_firestore():
    """Add Phase 2 state articles to Firestore"""
    print("\n" + "="*60)
    print("Phase 2: Adding 14 States to Knowledge Base")
    print("="*60 + "\n")
    
    articles = get_phase2_articles()
    
    print(f"📦 Prepared {len(articles)} articles for Phase 2")
    print("\nStates being added:")
    print("  • Minnesota (MN) - 2 articles")
    print("  • Connecticut (CT) - 2 articles")
    print("  • Rhode Island (RI) - 2 articles")
    print("  • Vermont (VT) - 1 article")
    print("  • Maryland (MD) - 1 article")
    print("  • Virginia (VA) - 1 article")
    print("  • New Jersey (NJ) - 1 article")
    print("  • Pennsylvania (PA) - 1 article")
    print("  • Michigan (MI) - 1 article")
    print("  • Wisconsin (WI) - 1 article")
    print("  • Georgia (GA) - 1 article")
    print("  • North Carolina (NC) - 1 article")
    print("  • Arizona (AZ) - 1 article")
    print("  • Nevada (NV) - 1 article")
    print(f"\nTotal articles: {len(articles)}")
    
    collection = db.collection('knowledge_base')
    success_count = 0
    error_count = 0
    
    for article in articles:
        try:
            # Add timestamps
            article['created_at'] = datetime.utcnow()
            article['updated_at'] = datetime.utcnow()
            article['tier'] = 'free'  # All articles free tier
            article['usage_count'] = 0
            article['success_rate'] = 0.0
            
            # Add to Firestore
            collection.document(article['id']).set(article)
            print(f"  ✓ Added: {article['title']}")
            success_count += 1
            
        except Exception as e:
            print(f"  ✗ Error adding {article['id']}: {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Phase 2 Migration Complete!")
    print(f"{'='*60}")
    print(f"✓ Successfully added: {success_count} articles")
    print(f"✗ Errors: {error_count}")
    print(f"\nTotal knowledge base should now have ~39 articles")
    print(f"State coverage: 24 states")
    print(f"\nRestart the backend to index new documents in Pinecone.")


if __name__ == "__main__":
    asyncio.run(add_phase2_to_firestore())
