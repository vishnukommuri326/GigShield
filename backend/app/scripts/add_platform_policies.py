"""
Add Grubhub and Shipt platform policies to knowledge base
Expands platform coverage from 5 to 7 platforms
"""

import asyncio
from datetime import datetime
from app.core.firebase import db


def get_platform_articles():
    """Returns Grubhub and Shipt platform policy articles"""
    
    articles = [
        # GRUBHUB
        {
            "id": "grubhub-deactivation",
            "title": "Grubhub Deactivation Policies and Appeal Process",
            "category": "platform_policies",
            "state": None,
            "platform": "Grubhub",
            "content": """# Grubhub Deactivation and Appeal Guide

## Common Deactivation Reasons

**Performance Metrics**:
- **Acceptance Rate**: Grubhub prefers 90%+ (Premier), 70%+ (Pro)
- **Block Drop Rate**: Dropping blocks hurts you
- **Customer Rating**: Below 4.5 puts you at risk
- **Attendance Rate**: Missing scheduled blocks

**Policy Violations**:
- Fraud (GPS manipulation, order theft)
- Multiple customer complaints
- Safety violations
- Background check issues
- Failure to deliver orders

**Program Level**:
Grubhub has tier system (Partner → Pro → Premier). Lower acceptance rate affects scheduling access but generally won't deactivate unless extremely low with other issues.

## Appeal Timeline

**Official Deadline**: 14 days from deactivation
**Recommended**: Appeal within 24-48 hours

## Appeal Process

### Step 1: Access Appeal System
- Email: driverpayments@grubhub.com
- Subject: "Account Deactivation Appeal - [Your Name] - [Driver ID]"
- Include deactivation email reference number

### Step 2: Gather Evidence

**For Rating Deactivations**:
- Screenshots of delivery completion photos
- Customer communication showing professionalism
- Evidence of restaurant delays (not your fault)
- GPS data showing you were at correct location

**For Block Issues**:
- Proof of emergency (medical, family, car trouble)
- Weather reports for severe conditions
- App glitches preventing check-in

**For Fraud Allegations**:
- GPS data proving you were at delivery location
- Delivery photos with timestamps
- Bank statements showing legitimate earnings
- Witness statements if applicable

### Step 3: Write Professional Appeal

**Template**:
```
Subject: Deactivation Appeal - [Your Name] - Driver ID: [NUMBER]

Dear Grubhub Driver Specialist Team,

I am writing to formally appeal my account deactivation dated [DATE]. I have been a dedicated Grubhub driver since [START DATE], maintaining [acceptance rate]% acceptance and [rating] customer rating while completing [number] deliveries.

REASON FOR DEACTIVATION:
[State what Grubhub told you - be specific]

MY RESPONSE:
[Address the specific issue with facts and evidence]

SUPPORTING EVIDENCE:
1. [List attached documents]
2. [Screenshots, GPS data, photos]
3. [Weather reports, restaurant delays, etc.]

I take pride in providing excellent service to Grubhub customers and restaurants. [If legitimate mistake, acknowledge and explain how you'll prevent recurrence].

I respectfully request reinstatement of my account and the opportunity to continue serving the Grubhub community.

Thank you for your consideration.

Sincerely,
[Your Full Name]
[Driver ID]
[Phone Number]
[Email Address]
```

## Grubhub-Specific Tips

**Block System**:
- Dropping blocks counts against you
- Missing blocks without unassigning = worse
- Always unassign ASAP if you can't work a block

**Acceptance Rate**:
- Partner level: No minimum (but affects scheduling)
- Pro level: 70%+ for priority scheduling
- Premier: 90%+ for best blocks
- Low AR alone rarely causes deactivation

**Customer Ratings**:
- Weighted heavily on recent deliveries
- One bad rating can tank you if you're new
- Provide evidence of unfair ratings in appeal

**Multi-Apping**:
- Grubhub knows drivers multi-app
- Don't let it affect delivery times
- If you're late due to multi-apping, harder to appeal

## Escalation Options

**If Appeal Denied**:

1. **Second Appeal**
   - Email again with additional evidence
   - Reference first appeal
   - Provide new information if available

2. **Driver Care Escalation**
   - Call Driver Care: 1 (866) 834-3963
   - Ask to speak with supervisor
   - Be professional and persistent

3. **Social Media**
   - Tweet @GrubHub @AskGrubHub
   - Public pressure sometimes works
   - Keep it professional

4. **Legal Options**
   - File misclassification claim (state-specific)
   - Small claims court for lost wages
   - Employment attorney consultation

## Success Rate by Reason

**High Success (70%+)**:
- App glitches causing block issues
- Clear evidence of unfair customer rating
- Restaurant delays documented
- First offense with good track record

**Moderate Success (40-60%)**:
- Block attendance issues with valid excuse
- Acceptance rate drop with explanation
- Minor customer complaints

**Low Success (10-20%)**:
- Multiple customer complaints (pattern)
- Fraud allegations with GPS evidence against you
- Safety violations
- Repeated policy violations

## Tips for Grubhub Drivers

✅ **Maintain high attendance**: Block system is key
✅ **Document deliveries**: Always take photo, even if not required
✅ **Communicate**: Update customers on restaurant delays
✅ **Know your market**: Acceptance rate varies by market need
✅ **Track metrics**: Monitor your stats weekly

## Grubhub vs Other Platforms

**More Forgiving Than**: Uber (easier to appeal)
**About Same As**: DoorDash, Lyft
**Less Forgiving Than**: Instacart

**Key Difference**: Block system means scheduled obligations. Missing blocks hits you harder than other platforms.

## State-Specific Considerations

**California**: Prop 22 provides some appeal protections
**New York**: NYC delivery workers may have additional rights
**Washington**: Seattle ordinance provides protections
**All States**: Cannot deactivate for discriminatory reasons

## Resources

- Grubhub Driver Care: 1 (866) 834-3963
- Email: driverpayments@grubhub.com
- Driver FAQ: driver.grubhub.com
- Reddit: r/grubhubdrivers (community support)
""",
            "tags": ["grubhub", "deactivation", "appeals", "block system"],
            "related_articles": ["doordash-deactivation", "uber-deactivation", "common-deactivation-reasons"]
        },

        # SHIPT
        {
            "id": "shipt-deactivation",
            "title": "Shipt Shopper Deactivation and Appeal Process",
            "category": "platform_policies",
            "state": None,
            "platform": "Shipt",
            "content": """# Shipt Shopper Deactivation and Appeal Guide

## Common Deactivation Reasons

**Performance Metrics**:
- **Star Rating**: Must maintain 4.7+ average
- **On-Time Percentage**: Must stay above 90%
- **Acceptance Rate**: While no strict minimum, consistently low acceptance affects matching
- **Late Forgiveness**: Limited late forgiveness granted

**Quality Issues**:
- Wrong items delivered
- Missing items (not out of stock)
- Poor substitution choices
- Damaged items
- Not following delivery instructions

**Policy Violations**:
- Shopping multiple orders without authorization
- Fraud (fake out of stock, keeping items)
- Customer harassment
- Safety violations
- Background check issues

## Unique Shipt Challenges

**Substitution Complexity**:
- Required to offer substitutions
- Customer must approve substitutions
- Marking items out of stock when available = policy violation
- Poor substitutions = low ratings

**Member Match System**:
- Get "matched" with customers you serve well
- Lose matches if rating drops or they rate you low
- Deactivation can follow loss of all matches

## Appeal Timeline

**Official Deadline**: 10 days from deactivation
**Recommended**: Appeal immediately (within 24 hours)

## Appeal Process

### Step 1: Access Shopper Support
- In-app: Help → Account Status → Submit Appeal
- Email: shoppersuccess@shipt.com
- Include your Shipt Shopper ID

### Step 2: Gather Evidence

**For Rating Deactivations**:
- Screenshots of customer messages (approval of substitutions)
- Photos of delivered items at doorstep
- Receipt photos showing items purchased
- GPS data showing delivery completed
- Chat history showing communication

**For On-Time Issues**:
- Store delays (long checkout lines, slow staff)
- Weather reports
- Traffic delays
- Customer unavailable at delivery
- App glitches

**For Item Issues**:
- Photos of empty shelf (out of stock proof)
- Customer chat approving substitutions
- Delivery photos showing correct items
- Store receipt

### Step 3: Write Detailed Appeal

**Template**:
```
Subject: Appeal for Shipt Shopper Deactivation - [Your Name] - Shopper ID: [NUMBER]

Dear Shipt Shopper Success Team,

I am respectfully appealing my deactivation dated [DATE]. I have been a committed Shipt Shopper since [START DATE], maintaining a [rating] star rating and [on-time %]% on-time delivery while completing [number] shops.

DEACTIVATION REASON:
[State specific reason - rating drop, late deliveries, etc.]

MY EXPLANATION:
[Provide context and evidence]

SUPPORTING EVIDENCE:
1. Customer communication screenshots showing [specifics]
2. Delivery photos with timestamps
3. [Weather reports / store delays / etc.]

ACTION PLAN:
[If you made mistakes, explain how you'll improve. If unfair, explain why.]

I value the opportunity to serve Shipt members and am committed to the high standards Shipt expects. I respectfully request reinstatement.

Thank you for your consideration.

[Your Full Name]
Shopper ID: [NUMBER]
[Phone Number]
[Email Address]

Attachments: [List evidence files]
```

## Shipt-Specific Strategies

**Rating Recovery**:
- Even if reinstated, may start with damaged rating
- Ask if they'll remove unfair ratings
- Provide evidence specific ratings were unjustified

**Member Matches**:
- Emphasize your matched members
- Show member communications praising you
- Losing matches = losing income

**Substitution Documentation**:
- Always photograph empty shelves
- Screenshot customer substitution approvals
- Save chat history

**Delivery Proof**:
- Take photos even if not required
- Show house number or apartment door
- Timestamp critical

## Escalation if Denied

1. **Second Appeal**
   - Email shoppersuccess@shipt.com again
   - Provide new evidence
   - Request supervisor review

2. **Twitter**
   - Tweet @Shipt @ShiptShopper
   - Professional tone
   - Brief description of issue

3. **Target Corporation** (Shipt's Parent Company)
   - Shipt owned by Target
   - Can escalate through Target corporate
   - Usually last resort

4. **Legal Options**
   - State misclassification claims
   - Small claims court for lost income
   - Employment attorney (if discrimination)

## Success Rates

**High Success (60-70%)**:
- First offense with good track record
- Clear evidence of unfair rating
- Store issues well-documented
- Customer communication shows professionalism

**Moderate Success (30-50%)**:
- Rating drop with partial explanation
- On-time issues with some valid excuses
- Substitution complaints with evidence

**Low Success (10-20%)**:
- Multiple item accuracy issues
- Pattern of late deliveries
- Customer complaints about behavior
- Fraud allegations

## Tips for Shipt Shoppers

✅ **Over-communicate**: Text customers about every substitution
✅ **Photo everything**: Empty shelves, delivered items, receipts
✅ **Double-check orders**: Item accuracy is critical
✅ **Time management**: Build in buffer for checkout, delivery
✅ **Know your stores**: Familiarize yourself with store layouts

## Shipt vs Other Platforms

**More Complex Than**: DoorDash (more shopper responsibility)
**Similar To**: Instacart (grocery shopping model)
**More Forgiving Than**: Uber (easier appeals)

**Key Difference**: Shipt's member match system means individual customer relationships matter more. One angry customer can severely impact you.

## Metro-Specific Considerations

**Target Stores** (Shipt Preferred):
- Faster processing often
- Staff knows Shipt process
- Prepaid orders easier

**Non-Target Stores**:
- May have less Shipt familiarity
- Longer checkout times
- More substitution challenges

**Busy Metros** (NYC, LA, Chicago):
- More orders but also more competition
- Parking challenges
- Apartment delivery complexities

## State-Specific Rights

**California**: Prop 22 applies - some appeal protections
**New York**: NYC delivery worker protections may apply
**Illinois**: Chicago ordinance provides some rights
**Washington**: Seattle delivery ordinance

**All States**:
- Cannot deactivate for discriminatory reasons
- Must follow own Terms of Service
- Misclassification claims possible

## Resources

- Shipt Shopper Success: shoppersuccess@shipt.com
- Shopper Support: In-app or 1 (205) 502-2500
- Shopper Hub: shoppers.shipt.com
- Reddit: r/ShiptShoppers (community advice)
- Facebook: Shipt Shoppers groups (market-specific)

## Special Situations

**Holiday Deactivations**:
- Common due to increased volume and stress
- Emphasize unusual circumstances
- Holiday traffic, store chaos, etc.

**New Shopper Deactivations**:
- Less history to prove yourself
- Every rating counts more
- Emphasize training completion, commitment

**Veteran Shopper Deactivations**:
- Leverage long track record
- Show ratings history
- Emphasize member matches and loyalty
""",
            "tags": ["shipt", "grocery delivery", "deactivation", "member match"],
            "related_articles": ["instacart-deactivation", "evidence-documentation", "rating-based-appeals"]
        },
    ]
    
    return articles


async def add_platforms_to_firestore():
    """Add Grubhub and Shipt articles to Firestore"""
    print("\n" + "="*60)
    print("Adding Platform Policies: Grubhub & Shipt")
    print("="*60 + "\n")
    
    articles = get_platform_articles()
    
    print(f"📦 Prepared {len(articles)} platform articles")
    print("\nPlatforms being added:")
    print("  • Grubhub - Deactivation policies and appeal guide")
    print("  • Shipt - Shopper deactivation and appeal process")
    print(f"\nThis expands platform coverage from 5 to 7 platforms")
    
    collection = db.collection('knowledge_base')
    success_count = 0
    error_count = 0
    
    for article in articles:
        try:
            # Add timestamps
            article['created_at'] = datetime.utcnow()
            article['updated_at'] = datetime.utcnow()
            article['tier'] = 'free'
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
    print(f"Platform Migration Complete!")
    print(f"{'='*60}")
    print(f"✓ Successfully added: {success_count} articles")
    print(f"✗ Errors: {error_count}")
    print(f"\nPlatform coverage: Uber, DoorDash, Lyft, Instacart, Amazon Flex, Grubhub, Shipt")


if __name__ == "__main__":
    asyncio.run(add_platforms_to_firestore())
