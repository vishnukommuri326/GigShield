import { useState } from 'react';
import { Send, Bot, User, Lightbulb, FileText, AlertCircle, Scale, Shield } from 'lucide-react';

interface RightsChatbotProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: { label: string; action: string }[];
}

const RightsChatbot = ({ onNavigate }: RightsChatbotProps) => {
  const knowledgeBase = {
    // Deactivation Rights
    'deactivation rights': {
      answer: `🛡️ **Your Deactivation Rights:**

**Federal Rights (All States):**
• Protection against discrimination (race, gender, age, disability)
• Right to file complaints with EEOC if discrimination suspected
• Basic contract law protections

**California (AB5, Prop 22):**
• Right to detailed explanation for deactivation
• Right to appeal with human review
• Cannot be deactivated for declining low-paying orders
• Protection against arbitrary deactivation

**Washington (Seattle/PayUp Act):**
• Platforms must provide specific reason
• Right to appeal with evidence
• Warning required for first offense (most cases)

**New York (NYC 2023):**
• Right to transparency in deactivation
• Protection against retaliation
• Required notice period before deactivation

**What to do:**
1. Document everything (emails, screenshots, delivery photos)
2. Review your deactivation notice carefully
3. Use our Notice Analyzer to understand your case
4. Prepare your appeal within the deadline`,
      actions: [
        { label: 'Analyze My Notice', action: 'notice-analyzer' },
        { label: 'Check State Laws', action: 'knowledge-base' }
      ]
    },

    // Appeal Timeline
    'appeal deadline|appeal timeline|how long|how much time': {
      answer: `⏰ **Appeal Deadlines by Platform:**

**DoorDash:** 7-10 days from deactivation
**Uber:** 30 days (but faster is better)
**Lyft:** 30 days  
**Instacart:** 10-14 days
**Amazon Flex:** 10 days
**Grubhub:** 14 days

⚠️ **Critical Timeline Notes:**
• These are STRICT deadlines - missing them usually means permanent deactivation
• Some platforms have informal "soft" deadlines (respond faster)
• State laws may extend these timelines (CA, WA, NY)
• Document when you received the notice (email timestamp)

**Best Practice:**
Submit your appeal within 48-72 hours for maximum impact. Platforms may view quick responses as showing you care.`,
      actions: [
        { label: 'Start Appeal Wizard', action: 'wizard' },
        { label: 'Organize Evidence', action: 'evidence-organizer' }
      ]
    },

    // Evidence Needed
    'evidence|proof|documentation|what do i need': {
      answer: `📋 **Evidence You Need for Your Appeal:**

**Always Include:**
• Screenshots of your platform stats (rating, completion %, deliveries)
• Deactivation notice (full text/screenshot)
• Account history summary
• Your professional delivery record

**For Rating-Based Deactivations:**
• Customer messages showing positive interactions
• Delivery completion photos (timestamps visible)
• GPS/route history showing on-time performance
• Evidence of circumstances beyond your control

**For Fraud/Safety:**
• GPS location data proving you were at delivery location
• Timestamps of delivery photos
• Customer communication (professional tone)
• Witness statements if applicable

**For Policy Violations:**
• Evidence showing you followed ToS
• Screenshots of communications
• Platform guideline documentation
• Proof of misunderstanding/error

Use our Evidence Organizer to build a comprehensive package!`,
      actions: [
        { label: 'Open Evidence Organizer', action: 'evidence-organizer' }
      ]
    },

    // Warning Signs
    'warning|deactivated without warning|no warning': {
      answer: `⚠️ **Can They Deactivate Without Warning?**

**Generally, YES for:**
• Serious safety violations (assault, dangerous driving)
• Fraud/theft allegations
• Criminal background check issues
• Terms of Service violations (major)

**Generally, NO for:**
• Low ratings (you see it decline gradually)
• Low completion rates (tracked in real-time)
• Minor policy violations (usually get warning)

**State Protections:**
• **California:** Platforms should provide progressive discipline for non-serious issues
• **Washington:** First offense warnings required (Seattle law)
• **New York:** Notice period required in most cases

**Red Flags You're at Risk:**
🚨 Rating dropped below minimum (check your state/platform)
🚨 Completion rate under 80%
🚨 Multiple customer complaints in short period
🚨 "Under review" status showing in app
🚨 Policy violation warning received

**Proactive Steps:**
1. Check your stats DAILY
2. Document every delivery with photos
3. Save all customer communications
4. Know your platform's thresholds`,
      actions: [
        { label: 'See All Red Flags', action: 'knowledge-base' }
      ]
    },

    // Platform Specific
    'doordash|uber|lyft|instacart|amazon flex': {
      answer: `🚗 **Platform-Specific Information:**

I can provide detailed information about:
• **DoorDash** - Moderate appeal process, 4.2 rating minimum, 80% completion
• **Uber** - Difficult appeals, 4.6 rating minimum, 30-day timeline
• **Lyft** - Moderate appeals, 4.7 rating minimum, better transparency
• **Instacart** - Easier appeals, 4.6 rating minimum, faster response
• **Amazon Flex** - Difficult appeals, "Fantastic" rating required

**What I need:**
Which platform were you deactivated from? I'll give you:
✓ Specific appeal process details
✓ Success rate estimates
✓ Best practices for that platform
✓ Common reasons for deactivation
✓ Platform-specific evidence tips`,
      actions: [
        { label: 'Platform Comparison', action: 'knowledge-base' }
      ]
    },

    // Legal Help
    'lawyer|attorney|legal help': {
      answer: `⚖️ **When to Consider Legal Help:**

**You Might Need a Lawyer If:**
• Deactivation involves discrimination (race, gender, disability, age)
• Large income loss (you relied on this as primary income)
• Platform refuses to provide reason for deactivation
• You have strong evidence they violated state law
• Multiple appeal attempts rejected unfairly

**Free/Low-Cost Options:**
• Legal Aid Society (low-income workers)
• Worker centers and gig worker unions
• Law school legal clinics
• State labor department complaints

**California-Specific:**
• AB5 may classify you as employee (stronger protections)
• Prop 22 provides some appeal rights
• Contact CA Labor Commissioner

**Most Cases Don't Need a Lawyer:**
95% of gig worker deactivations can be successfully appealed with:
✓ Well-organized evidence
✓ Professional appeal letter
✓ Understanding of platform policies
✓ Quick response time

Let me help you build a strong appeal first!`,
      actions: [
        { label: 'Start Appeal Process', action: 'wizard' }
      ]
    },

    // Success Rate
    'success rate|chances|will it work': {
      answer: `📊 **Appeal Success Rates & Factors:**

**Overall Success Rates (Industry Estimates):**
• **With strong evidence:** 60-70%
• **With organized appeal:** 50-60%
• **Without preparation:** 20-30%

**Success Factors:**
✅ **High Success (70-80%):**
• Clear evidence of error/misunderstanding
• Professional tone in appeal
• Quick response (within 48 hours)
• Well-documented delivery history
• First offense with good track record

⚠️ **Moderate Success (40-50%):**
• Rating-based deactivation with context
• Completion rate issues with valid reasons
• Minor policy violations
• Platform has moderate appeal process

❌ **Low Success (10-20%):**
• Serious safety violations
• Fraud with limited counter-evidence
• Multiple previous violations
• Platform with difficult appeal process
• Missing appeal deadline

**How to Maximize Success:**
1. Use our Appeal Wizard for professional letters
2. Organize all evidence systematically
3. Address the specific reason clearly
4. Show accountability + improvement plan
5. Be respectful and professional`,
      actions: [
        { label: 'Check Platform Comparison', action: 'knowledge-base' },
        { label: 'Build Strong Appeal', action: 'wizard' }
      ]
    },

    // What Now / Next Steps
    'what now|next steps|what should i do|help me': {
      answer: `🎯 **Your Step-by-Step Action Plan:**

**Immediate Actions (Today):**
1️⃣ **Analyze Your Notice** - Upload it to our Notice Analyzer
   → Understand the specific reason
   → See your deadline and urgency

2️⃣ **Gather Evidence** - Use Evidence Organizer
   → Screenshots of stats
   → Delivery photos
   → Customer communications
   → GPS/tracking data

3️⃣ **Check Your Rights** - Review state protections
   → Understand applicable laws
   → Know platform requirements
   → Identify any violations by platform

**Within 24-48 Hours:**
4️⃣ **Draft Your Appeal** - Use Appeal Wizard
   → Professional tone
   → Address specific issues
   → Include evidence
   → Show improvement plan

5️⃣ **Submit & Document** - Keep records
   → Screenshot submission confirmation
   → Save all correspondence
   → Track timeline

**After Submission:**
6️⃣ **Follow Up** - Stay proactive
   → Check status daily
   → Respond quickly to requests
   → Escalate if no response after stated timeframe

**Need Specific Help?**
Tell me where you are in this process and I'll guide you!`,
      actions: [
        { label: 'Analyze My Notice Now', action: 'notice-analyzer' },
        { label: 'Start Gathering Evidence', action: 'evidence-organizer' },
        { label: 'Create My Appeal', action: 'wizard' }
      ]
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: "👋 Hi! I'm your GigShield Rights Assistant. I can help you understand your rights as a gig worker, answer questions about deactivations, and guide you through the appeal process.\n\nI have knowledge about:\n• Your legal rights by state\n• Appeal deadlines and processes\n• Evidence requirements\n• Platform-specific information\n• Warning signs and red flags\n\nWhat would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const suggestedQuestions = [
    "What are my deactivation rights?",
    "How long do I have to appeal?",
    "What evidence do I need?",
    "Can they deactivate me without warning?",
    "What should I do right now?",
    "Will my appeal work?"
  ];

  const getResponse = (question: string): { answer: string; actions?: { label: string; action: string }[] } => {
    const lowerQuestion = question.toLowerCase();

    // Find matching knowledge base entry
    for (const [pattern, response] of Object.entries(knowledgeBase)) {
      const patterns = pattern.split('|');
      if (patterns.some(p => lowerQuestion.includes(p))) {
        return response;
      }
    }

    // Default response
    return {
      answer: `I understand you're asking about "${question}". While I don't have a specific answer for that exact question, I can help you with:

• **Deactivation Rights** - What protections you have by state
• **Appeal Process** - Deadlines, requirements, and success rates
• **Evidence Gathering** - What documentation you need
• **Platform Information** - Specific details for DoorDash, Uber, etc.
• **Next Steps** - Your complete action plan

Could you rephrase your question or choose one of the topics above?`,
      actions: [
        { label: 'See Action Plan', action: 'none' },
        { label: 'Start Appeal Process', action: 'wizard' }
      ]
    };
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    const userQuestion = inputText;
    setInputText('');

    // Get bot response
    setTimeout(() => {
      const response = getResponse(userQuestion);
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString(),
        actions: response.actions
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleQuickAction = (action: string) => {
    if (action !== 'none') {
      onNavigate(action);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Rights Chatbot
          </h1>
          <p className="text-lg text-slate-600">
            Get instant answers to your gig worker rights questions
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-10 h-10 rounded-full bg-[#0d9488] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-[#0d9488] text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Quick Actions */}
                {message.type === 'bot' && message.actions && (
                  <div className="flex gap-2 mt-3 ml-14">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="px-4 py-2 bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        {action.action === 'wizard' && <FileText className="w-4 h-4" />}
                        {action.action === 'notice-analyzer' && <AlertCircle className="w-4 h-4" />}
                        {action.action === 'knowledge-base' && <Scale className="w-4 h-4" />}
                        {action.action === 'evidence-organizer' && <Shield className="w-4 h-4" />}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-[#0d9488]" />
                <p className="text-sm font-medium text-slate-700">Suggested questions:</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(question)}
                    className="text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your rights..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightsChatbot;
