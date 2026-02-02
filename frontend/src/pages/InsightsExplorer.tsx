import { useState } from 'react';
import { Database, FileText, AlertCircle, Scale, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface InsightsExplorerProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const InsightsExplorer = ({ onNavigate }: InsightsExplorerProps) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: Database },
    { id: 'deactivation', label: 'Deactivation Reasons', icon: AlertCircle },
    { id: 'appeals', label: 'Appeal Processes', icon: FileText },
    { id: 'policies', label: 'Platform Policies', icon: Scale },
    { id: 'evidence', label: 'Documentation', icon: Shield },
  ];

  const faqs: FAQItem[] = [
    {
      category: 'deactivation',
      question: 'What are the most common deactivation reasons?',
      answer: 'Based on observed patterns across platforms:\n\n1. **Rating drops** (customer ratings below platform thresholds)\n2. **Completion rate issues** (cancelled/unaccepted orders)\n3. **Safety flags** (reported incidents, suspected fraud)\n4. **Policy violations** (sharing accounts, using scripts)\n5. **Background check updates** (new criminal records, driving violations)\n\nSpecific thresholds vary by platform and region.'
    },
    {
      category: 'appeals',
      question: 'How do platform appeal processes typically work?',
      answer: 'General patterns observed:\n\n**DoorDash**: In-app appeal submission, usually responds within 3-7 days. Multiple appeals sometimes allowed.\n\n**Uber**: Support ticket system, 5-10 day average response. May require documentation upload.\n\n**Instacart**: Email-based appeals, variable response time (1-14 days). Human review not guaranteed.\n\n**Note**: These are observed patterns, not guarantees. Actual processes change frequently.'
    },
    {
      category: 'deactivation',
      question: 'Can I be deactivated without warning?',
      answer: 'Yes, most platform contracts allow immediate deactivation for:\n\n• Safety violations\n• Fraud suspicions\n• Severe policy breaches\n\nHowever, for performance metrics (ratings, completion rate), platforms typically:\n\n• Show real-time dashboards\n• Send warning notifications at thresholds\n• Provide grace periods in some cases\n\nNo universal requirement exists for advance notice in most jurisdictions.'
    },
    {
      category: 'policies',
      question: 'Do any jurisdictions require specific deactivation disclosures?',
      answer: 'Some jurisdictions have disclosure requirements:\n\n**Seattle (2025)**: Platforms must provide specific reason and human review option for appeals.\n\n**California (Prop 22)**: Limited protections for classification, but no specific deactivation disclosure mandate.\n\n**New York City**: App-based driver protections include some due process provisions.\n\n**Most areas**: No specific disclosure requirements beyond contract terms. Platform policies vary significantly.'
    },
    {
      category: 'evidence',
      question: 'What documentation should I gather for an appeal?',
      answer: 'Effective evidence varies by deactivation reason:\n\n**Rating Appeals**:\n• Screenshots of positive recent feedback\n• Delivery completion stats\n• Customer service chat logs\n\n**Safety Flag Appeals**:\n• Dashcam footage (if applicable)\n• Police reports (if incident occurred)\n• Witness statements\n• GPS/timestamp data\n\n**Account Sharing Appeals**:\n• Government ID matching account\n• Selfie verification\n• Device/login history\n\nOrganize chronologically and label clearly.'
    },
    {
      category: 'appeals',
      question: 'What are typical appeal response times?',
      answer: 'Observed response time ranges by platform:\n\n• **DoorDash**: 3-7 days (sometimes faster for safety appeals)\n• **Uber**: 5-10 days (highly variable)\n• **Lyft**: 7-14 days\n• **Instacart**: 3-14 days (very inconsistent)\n• **Amazon Flex**: 5-10 days\n\nFactors affecting timing:\n• Appeal volume at time of submission\n• Complexity/severity of case\n• Quality of documentation provided\n• Escalation to specialized teams'
    },
    {
      category: 'policies',
      question: 'Can platforms change their deactivation policies?',
      answer: 'Yes. Platforms typically:\n\n• Update independent contractor agreements periodically\n• Notify via email or in-app message\n• Allow continued work = acceptance of new terms\n\nCommon policy changes include:\n• Minimum rating thresholds\n• Acceptance/completion rate requirements\n• Background check criteria\n• Safety protocols\n\nYou should periodically review active agreements in app settings.'
    },
    {
      category: 'evidence',
      question: 'Can I request platform records about my account?',
      answer: 'In many cases, yes:\n\n**California (CCPA)**: Residents can request data access including ratings, customer feedback, and decision rationale.\n\n**GDPR (EU)**: Right to access personal data, though enforcement for US-based platforms varies.\n\n**General**: Most platforms offer some level of account data export through settings, though comprehensiveness varies.\n\nTypically accessible:\n• Trip/delivery history\n• Earnings records\n• Rating breakdown\n\nTypically NOT provided:\n• Specific customer complaints\n• Internal investigation notes\n• Algorithmic decision details'
    },
    {
      category: 'deactivation',
      question: 'What happens to pending earnings after deactivation?',
      answer: 'Standard practice across most platforms:\n\n✅ **Owed earnings**: Usually paid out on normal schedule\n✅ **Pending deposits**: Typically processed despite deactivation\n✅ **Tip adjustments**: Should still be credited\n\n⚠️ **Exceptions**:\n• Fraud investigations may freeze payments\n• Chargebacks/customer refunds may be deducted\n• Some platforms require tax forms before final payout\n\n❌ **Bonuses/incentives**: Often forfeited if deactivated mid-promotion period\n\nDocument all pending earnings immediately upon deactivation.'
    },
    {
      category: 'appeals',
      question: 'Should I submit multiple appeals?',
      answer: 'Strategic considerations:\n\n**Initial Appeal**:\n• Submit within first 48 hours if possible\n• Include all available evidence\n• Be concise and factual\n\n**Follow-up**:\n• Wait for initial response before re-appealing\n• Some platforms explicitly allow multiple submissions\n• Others may flag repeated appeals as spam\n\n**Escalation**:\n• If denied, ask for human review (not guaranteed)\n• Some platforms have specialized teams for certain violations\n• Social media escalation occasionally effective but inconsistent\n\n**General rule**: One well-documented appeal > multiple rushed attempts'
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const quickActions = [
    { icon: FileText, label: 'Analyze Notice', action: 'notice-analyzer', description: 'Upload your deactivation notice' },
    { icon: Shield, label: 'Organize Evidence', action: 'evidence-organizer', description: 'Manage your documentation' },
    { icon: Scale, label: 'Browse Knowledge Base', action: 'knowledge-base', description: 'Platform-specific data' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Policy Insights Explorer
          </h1>
          <p className="text-lg text-slate-600">
            Common questions and observed patterns across gig platform enforcement
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <p className="text-sm font-medium text-slate-700 mb-4">Filter by topic:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-[#0d9488] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <span className="text-lg font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-[#0d9488] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-5">
                  <div 
                    className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: faq.answer
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        .replace(/\n\n/g, '<br/><br/>')
                        .replace(/^• (.*$)/gim, '<li class="ml-6">$1</li>')
                        .replace(/✅/g, '<span class="text-green-600">✅</span>')
                        .replace(/⚠️/g, '<span class="text-yellow-600">⚠️</span>')
                        .replace(/❌/g, '<span class="text-red-600">❌</span>')
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-lg font-semibold text-slate-900 mb-4">Take action on your case:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(action.action)}
                  className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-[#0d9488]/10 hover:to-[#0d9488]/5 rounded-xl border-2 border-slate-200 hover:border-[#0d9488] transition-all group"
                >
                  <div className="w-14 h-14 bg-[#0d9488]/10 group-hover:bg-[#0d9488] rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-7 h-7 text-[#0d9488] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-semibold text-slate-900 mb-1">{action.label}</p>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> These insights are based on observed patterns and publicly available information. 
            Platform policies change frequently and vary by region. This is not legal advice or guaranteed to be current.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsExplorer;
