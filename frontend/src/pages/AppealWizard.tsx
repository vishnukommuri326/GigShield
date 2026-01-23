import { useState } from 'react';
import { ArrowLeft, Check, Upload, Sparkles } from 'lucide-react';

interface AppealWizardProps {
  onNavigate: (page: string) => void;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  bgGradient: string;
  icon: string;
}

const AppealWizard = ({ onNavigate }: AppealWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [deactivationNotice, setDeactivationNotice] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const steps = [
    { number: 1, label: 'Platform' },
    { number: 2, label: 'Notice' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Generate' },
  ];

  const platforms: Platform[] = [
    { id: 'doordash', name: 'DoorDash', color: 'bg-[#FF3008]', bgGradient: 'from-red-500 to-red-600', icon: '🚗' },
    { id: 'uber', name: 'Uber', color: 'bg-black', bgGradient: 'from-gray-900 to-black', icon: '🚕' },
    { id: 'instacart', name: 'Instacart', color: 'bg-[#43B02A]', bgGradient: 'from-green-500 to-green-600', icon: '🛒' },
    { id: 'lyft', name: 'Lyft', color: 'bg-[#FF00BF]', bgGradient: 'from-pink-500 to-pink-600', icon: '🚙' },
    { id: 'amazonflex', name: 'Amazon Flex', color: 'bg-[#FF9900]', bgGradient: 'from-orange-400 to-orange-500', icon: '📦' },
    { id: 'shipt', name: 'Shipt', color: 'bg-[#00B88D]', bgGradient: 'from-teal-500 to-teal-600', icon: '🛍️' },
  ];

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return selectedPlatform !== '';
    if (currentStep === 2) return deactivationNotice.trim() !== '';
    if (currentStep === 3) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Exit</span>
          </button>
        </div>
      </div>

      <div className="relative bg-white/60 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step.number === currentStep ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50 scale-110' : step.number < currentStep ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg' : 'bg-white border-2 border-slate-300 text-slate-400 shadow-sm'}`}>
                    {step.number < currentStep ? <Check className="w-7 h-7" /> : step.number}
                  </div>
                  <span className={`mt-3 text-sm font-semibold transition-colors ${step.number === currentStep ? 'text-blue-700' : step.number < currentStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  {step.number === currentStep && (
                    <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-lg -z-10 animate-pulse"></div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="relative w-32 h-1 mx-6 mb-8 rounded-full overflow-hidden bg-slate-200">
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500 ${step.number < currentStep ? 'translate-x-0' : '-translate-x-full'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {currentStep === 1 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Step 1 of 4
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 leading-tight">
              Which platform deactivated you?
            </h1>
            <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
              Select the gig platform so we can provide platform-specific guidance.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 ${selectedPlatform === platform.id ? 'border-blue-600 shadow-2xl shadow-blue-500/20 scale-105' : 'border-slate-200 hover:border-blue-300 hover:shadow-xl'}`}
                >
                  {selectedPlatform === platform.id && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-lg opacity-30 -z-10"></div>
                  )}
                  <div className={`bg-gradient-to-br ${platform.bgGradient} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {platform.icon}
                  </div>
                  <div className="text-lg font-bold text-slate-900">{platform.name}</div>
                  {selectedPlatform === platform.id && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-blue-600 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className={`group px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${canContinue() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <span className="flex items-center gap-2">
                Continue
                {canContinue() && <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Step 2 of 4
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 leading-tight">
              Share your deactivation notice
            </h1>
            <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
              Paste the text from your deactivation email or upload a screenshot.
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200 p-8 mb-12 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="mb-6 flex items-center gap-3 text-slate-600">
                <Upload className="w-5 h-5" />
                <span className="text-sm font-medium">Paste your notice or upload a file</span>
              </div>
              <textarea
                value={deactivationNotice}
                onChange={(e) => setDeactivationNotice(e.target.value)}
                placeholder="Paste your deactivation notice here..."
                className="w-full h-80 p-6 border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 bg-white shadow-inner"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="group px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-md hover:shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back
                </span>
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`group px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${canContinue() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                <span className="flex items-center gap-2">
                  Continue
                  {canContinue() && <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            {/* Deadline Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-lg mb-1">30 days remaining to appeal</h3>
                <p className="text-amber-700">Deadline: 2026-02-22</p>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-3">Information the platform should have provided:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Specific policy violated
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Date and time of alleged incident
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Evidence supporting the deactivation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account History */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Account History</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Account Tenure</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 years"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Rating</label>
                  <input
                    type="text"
                    placeholder="e.g., 4.95"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Completion Rate</label>
                  <input
                    type="text"
                    placeholder="e.g., 98%"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Deliveries/Rides</label>
                  <input
                    type="text"
                    placeholder="e.g., 2,500"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Your Side of the Story */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Side of the Story</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">What happened in your own words?</label>
                <textarea
                  placeholder="Describe what you believe happened. If you don't know why you were deactivated, that's okay — we'll help you request that information."
                  className="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Evidence you have (optional)</label>
                <textarea
                  placeholder="Describe any evidence: screenshots, dashcam footage, messages with customers, GPS records, etc."
                  className="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Appeal Preferences */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 mb-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Appeal Preferences</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your State</label>
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option>Select your state...</option>
                  <option>California</option>
                  <option>New York</option>
                  <option>Washington</option>
                  <option>Texas</option>
                </select>
                <p className="text-sm text-slate-500 mt-2">Some states have specific gig worker protections we'll reference</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Appeal Tone</label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="px-6 py-4 border-2 border-blue-600 bg-blue-50 rounded-xl text-left transition-all hover:shadow-md">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-blue-900">Professional</span>
                    </div>
                    <p className="text-sm text-blue-700">Polite and factual</p>
                  </button>
                  <button className="px-6 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl text-left transition-all hover:border-slate-300 hover:shadow-md">
                    <div className="font-semibold text-slate-900 mb-1">Assertive</div>
                    <p className="text-sm text-slate-600">Firm but respectful</p>
                  </button>
                  <button className="px-6 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl text-left transition-all hover:border-slate-300 hover:shadow-md">
                    <div className="font-semibold text-slate-900 mb-1">Legal</div>
                    <p className="text-sm text-slate-600">References laws and rights</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 shadow-lg transition-all"
              >
                Generate Appeal Letter
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto">
            {/* Action Buttons */}
            <div className="flex gap-4 justify-end mb-6">
              <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email to Lyft
              </button>
            </div>

            {/* Letter Preview */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 mb-8 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Appeal Letter Preview</h2>
                <span className="text-sm text-slate-500">Generated in 13.2 (Shortened) seconds</span>
              </div>

              <div className="space-y-6 text-slate-800 leading-relaxed">
                <div className="text-right text-slate-600">January 23, 2026</div>

                <div>
                  <div className="font-semibold text-slate-900">Lyft Appeals Team</div>
                  <div className="text-red-600 font-medium">Re: Appeal of Account Deactivation</div>
                </div>

                <div>Dear <span className="text-blue-600">Lyft Appeals</span> Team,</div>

                <p>
                  I am writing to formally appeal the deactivation of my Lyft account, which I received notice of on <span className="font-semibold">2026-01-23</span>. I have been an active driver for approximately <span className="font-semibold">2 years</span> with a consistent track record of excellence:
                </p>

                <ul className="list-disc pl-6 space-y-1">
                  <li><span className="font-semibold">Account Tenure:</span> [user's input]</li>
                  <li><span className="font-semibold">Completion Rate:</span> [completion ratio]</li>
                  <li><span className="font-semibold">Total Rides:</span> [total]</li>
                </ul>

                <div>
                  <div className="font-bold text-blue-700 mb-2">REGARDING THE DEACTIVATION</div>
                  <p>
                    The deactivation notice stated <span className="text-red-600">"Violation of community guidelines."</span> However, I believe this decision was made in error for the following reasons:
                  </p>
                  <p className="mt-2 italic text-blue-600">[Your explanation will appear here based on the details you provided]</p>
                </div>

                <div>
                  <div className="font-bold text-blue-700 mb-2">MISSING INFORMATION</div>
                  <p>
                    I respectfully request that Lyft provide me with the following information, which was not included in this deactivation notice but is necessary for me to adequately respond to these allegations:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 mt-2">
                    <li>Specific policy violated</li>
                    <li>Date and time of alleged incident</li>
                    <li>Evidence supporting the deactivation</li>
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-blue-700 mb-2">REQUEST FOR REINSTATEMENT</div>
                  <p>Based on the above, I respectfully request:</p>
                  <ol className="list-decimal pl-6 space-y-1 mt-2">
                    <li>Immediate reinstatement of my account</li>
                    <li>A detailed explanation of the specific incident(s) that led to this decision</li>
                    <li>An opportunity to review and respond to any evidence against me</li>
                    <li>Confirmation that this deactivation will not appear on my permanent record if found to be in error</li>
                  </ol>
                </div>

                <p>
                  I take my work with <span className="text-blue-600">Lyft</span> seriously and have always strived to provide excellent service. I am confident that a thorough review of my account history will demonstrate my commitment to the platform's standards and policies.
                </p>

                <p>
                  I kindly request a response within 7 business days. Thank you for your time and consideration.
                </p>

                <div className="mt-8">
                  <div>Sincerely,</div>
                  <div className="mt-2 space-y-1">
                    <div>[Your Full Name]</div>
                    <div>[Your Phone Number]</div>
                    <div>[Your Email Address]</div>
                    <div className="font-semibold">ACCOUNT ID: [Your Account ID]</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">1</div>
                  <p className="text-slate-700">Fill in the [bracketed] sections with your information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">2</div>
                  <p className="text-slate-700">Submit via Lyft's official appeal channel</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">3</div>
                  <p className="text-slate-700">Keep a copy of everything you submit</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">4</div>
                  <p className="text-slate-700">Follow up if you don't hear back within 7 days</p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onNavigate('landing')}
                className="px-8 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700"
              >
                ← Start New Appeal
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700"
              >
                🔄 Regenerate Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealWizard;
