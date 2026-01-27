# backend/app/services/ai_service.py

import os
from anthropic import Anthropic
from typing import Dict, List, Any

class AIService:
    def __init__(self):
        """Initialize Anthropic Claude client"""
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-sonnet-4-20250514"
    
    async def analyze_notice(self, notice_text: str, platform: str = None) -> Dict[str, Any]:
        """
        Analyze a deactivation notice and extract key information
        """
        prompt = f"""You are an expert in gig economy platform policies and worker rights.

Analyze this deactivation notice and extract the following information:

DEACTIVATION NOTICE:
{notice_text}

Please provide:
1. Platform name (DoorDash, Uber, Lyft, Instacart, etc.) - if mentioned
2. Specific reason for deactivation
3. Urgency level (URGENT, MODERATE, or LOW)
4. Deadline to appeal (number of days, if mentioned)
5. Risk level (Low, Medium, or High based on the severity)
6. Missing information that would be helpful for the appeal
7. Specific recommendations for the worker

Respond in JSON format with these exact keys:
{{
    "platform": "platform name or Unknown",
    "reason": "specific deactivation reason",
    "urgency_level": "URGENT/MODERATE/LOW",
    "deadline_days": number or null,
    "risk_level": "Low/Medium/High",
    "missing_info": ["item1", "item2"],
    "recommendations": ["rec1", "rec2", "rec3"]
}}"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract the JSON response
            import json
            result_text = response.content[0].text
            
            # Try to parse as JSON
            try:
                result = json.loads(result_text)
            except json.JSONDecodeError:
                # If not pure JSON, try to extract JSON from the text
                import re
                json_match = re.search(r'\{[\s\S]*\}', result_text)
                if json_match:
                    result = json.loads(json_match.group())
                else:
                    raise ValueError("Could not parse AI response as JSON")
            
            return result
            
        except Exception as e:
            print(f"Error analyzing notice with AI: {e}")
            # Fallback to basic analysis
            return {
                "platform": platform or "Unknown",
                "reason": "Unable to determine specific reason",
                "urgency_level": "MODERATE",
                "deadline_days": 14,
                "risk_level": "Medium",
                "missing_info": ["Specific policy violated", "Date of incident", "Evidence"],
                "recommendations": [
                    "Gather all delivery/ride records",
                    "Document your account history",
                    "Review platform terms of service"
                ]
            }
    
    async def generate_appeal(
        self, 
        platform: str,
        deactivation_reason: str,
        user_story: str,
        account_details: Dict[str, Any]
    ) -> str:
        """
        Generate a personalized appeal letter using Claude
        """
        prompt = f"""You are an expert legal writer specializing in gig economy worker appeals.

Generate a professional, persuasive appeal letter for a gig worker whose account has been deactivated.

PLATFORM: {platform}
DEACTIVATION REASON: {deactivation_reason}

WORKER'S ACCOUNT DETAILS:
- Account Tenure: {account_details.get('account_tenure', 'Not provided')}
- Rating: {account_details.get('current_rating', 'Not provided')}
- Completion Rate: {account_details.get('completion_rate', 'Not provided')}
- Total Deliveries/Rides: {account_details.get('total_deliveries', 'Not provided')}
- State: {account_details.get('user_state', 'Not provided')}

WORKER'S EXPLANATION:
{user_story}

TONE: {account_details.get('appeal_tone', 'professional')}

Generate a complete appeal letter that:
1. Is professionally formatted with proper business letter structure
2. States the purpose clearly in the opening
3. Highlights the worker's positive track record
4. Addresses the deactivation reason respectfully
5. Provides context from the worker's perspective
6. Requests specific information about the incident
7. Asks for reinstatement with clear justification
8. Maintains the requested tone

Include proper spacing, date, addressing, and signature blocks.
Make it persuasive but respectful."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return response.content[0].text
            
        except Exception as e:
            print(f"Error generating appeal with AI: {e}")
            # Return basic template as fallback
            return f"""[Current Date]

{platform} Appeals Team
Re: Appeal of Account Deactivation

Dear {platform} Appeals Team,

I am writing to respectfully appeal the deactivation of my {platform} account.

{user_story}

I have maintained a strong record on your platform and request that you review my case for reinstatement.

Thank you for your consideration.

Sincerely,
[Your Name]"""
    
    async def chat(self, message: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Handle chatbot conversations about worker rights
        """
        system_prompt = """You are a helpful assistant specializing in gig economy worker rights, platform policies, and appeal processes. 

You help workers understand:
- Their rights under platform terms of service
- How to appeal deactivations
- What documentation they should gather
- Platform-specific policies (DoorDash, Uber, Lyft, Instacart, etc.)
- Labor laws relevant to gig workers

Be supportive, informative, and action-oriented. Provide specific steps workers can take."""

        # Build message history
        messages = []
        if conversation_history:
            for msg in conversation_history:
                messages.append({"role": msg["role"], "content": msg["content"]})
        
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=messages
            )
            
            return {
                "response": response.content[0].text,
                "suggested_actions": [
                    {"label": "Analyze Notice", "action": "notice-analyzer"},
                    {"label": "Start Appeal", "action": "wizard"}
                ]
            }
            
        except Exception as e:
            print(f"Error in chat with AI: {e}")
            return {
                "response": "I'm here to help with your gig worker rights questions. Please try your question again.",
                "suggested_actions": []
            }

# Create singleton instance
ai_service = AIService()
