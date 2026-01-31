import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, FileText, AlertCircle, Scale, Shield, Loader2 } from 'lucide-react';
import { chatWithBot } from '../services/apiService';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: "👋 Hi! I'm your GigShield Rights Assistant powered by AI and our comprehensive knowledge base.\n\nI can help answer questions about:\n• Your deactivation rights in any state (Texas, California, Florida, Illinois, Massachusetts, Colorado, Oregon, Washington, New York, and more)\n• Platform-specific policies and appeal processes (Uber, DoorDash, Lyft, Instacart, Amazon Flex)\n• Evidence you need for appeals\n• Deadlines and next steps\n• State-specific labor laws and protections\n\nWhat would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What are my deactivation rights in Texas?",
    "How do I appeal an Uber deactivation?",
    "What does California Prop 22 protect?",
    "Can I be deactivated without warning?",
    "What evidence do I need for a rating appeal?",
    "What's the Chicago gig worker ordinance?",
  ];

  const quickActions = [
    { icon: FileText, label: 'Analyze Notice', action: 'notice-analyzer' },
    { icon: Shield, label: 'Evidence Organizer', action: 'evidence-organizer' },
    { icon: Scale, label: 'State Laws', action: 'knowledge-base' },
  ];

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call RAG-powered backend
      const response = await chatWithBot(currentInput, messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      })));

      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        text: response.response,
        timestamp: new Date().toLocaleTimeString(),
        actions: response.suggested_actions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        text: "I'm having trouble connecting right now. Please try again or use the other tools to analyze your deactivation notice.",
        timestamp: new Date().toLocaleTimeString(),
        actions: [
          { label: 'Analyze Notice', action: 'notice-analyzer' },
          { label: 'Browse Laws', action: 'knowledge-base' }
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleActionClick = (action: string) => {
    if (action) {
      onNavigate(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatBotMessage = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Checkmarks
      .replace(/✅/g, '<span class="text-green-600">✅</span>')
      .replace(/❌/g, '<span class="text-red-600">❌</span>')
      .replace(/⚠️/g, '<span class="text-yellow-600">⚠️</span>')
      // Bullet lists
      .replace(/^[\-\•] (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Rights Chatbot
          </h1>
          <p className="text-lg text-slate-600">
            AI-powered assistant with knowledge of gig worker laws across 10 states
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-180px)] flex flex-col">
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
                    <div 
                      className={`prose prose-sm max-w-none ${message.type === 'user' ? 'prose-invert' : ''}`}
                      dangerouslySetInnerHTML={{
                        __html: message.type === 'bot' 
                          ? formatBotMessage(message.text)
                          : message.text.replace(/\n/g, '<br/>')
                      }}
                    />
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
                  <div className="flex gap-2 mt-3 ml-14 flex-wrap">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action.action)}
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

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-[#0d9488] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-slate-100 text-slate-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
                    <span className="text-sm">Searching knowledge base...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3 mt-4">
                <Lightbulb className="w-5 h-5 text-[#0d9488]" />
                <p className="text-sm font-medium text-slate-700">Try asking:</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Or jump to:</p>
                <div className="flex gap-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action.action)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0d9488] to-[#0d9488]/80 hover:from-[#0d9488]/90 hover:to-[#0d9488]/70 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your state, platform, or deactivation rights..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#0d9488]/90 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
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
