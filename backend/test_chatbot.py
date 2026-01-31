"""
Test script to verify the RAG-powered chatbot
"""

import sys
sys.path.append('.')

import asyncio
from app.services.ai_service import ai_service

async def test_chatbot():
    """Test the RAG chatbot with various questions"""
    
    test_questions = [
        {
            "question": "What are my deactivation rights in Texas?",
            "expected_context": ["texas", "gig", "law"]
        },
        {
            "question": "How do I appeal an Uber deactivation?",
            "expected_context": ["uber", "appeal", "deactivation"]
        },
        {
            "question": "What's the Chicago gig worker ordinance?",
            "expected_context": ["chicago", "ordinance", "gig worker"]
        },
        {
            "question": "Can DoorDash deactivate me for low ratings in California?",
            "expected_context": ["doordash", "california", "rating"]
        }
    ]
    
    print("🤖 Testing RAG-Powered Chatbot\n")
    print("=" * 80)
    
    for i, test in enumerate(test_questions, 1):
        print(f"\n\n📝 Test {i}: {test['question']}")
        print("-" * 80)
        
        try:
            result = await ai_service.chat(
                message=test['question'],
                conversation_history=[]
            )
            
            print(f"\n✅ Response ({len(result['response'])} chars):")
            print(result['response'][:500])  # First 500 chars
            if len(result['response']) > 500:
                print(f"... (truncated, total {len(result['response'])} chars)")
            
            print(f"\n🎯 Suggested Actions:")
            for action in result['suggested_actions']:
                print(f"  - {action['label']} → {action['action']}")
            
            # Check if expected context keywords appear
            response_lower = result['response'].lower()
            found_keywords = [kw for kw in test['expected_context'] if kw in response_lower]
            print(f"\n✓ Found expected keywords: {', '.join(found_keywords)}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
    
    print("\n\n" + "=" * 80)
    print("✓ Chatbot test complete!")

if __name__ == "__main__":
    asyncio.run(test_chatbot())
