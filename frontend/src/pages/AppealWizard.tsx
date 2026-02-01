import { useState } from 'react';
import { ArrowLeft, Check, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { generateAppeal } from '../services/apiService';
import jsPDF from 'jspdf';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [appealId, setAppealId] = useState('');
  const [error, setError] = useState('');
  
  // Step 1: Platform Selection
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  
  // Step 2: Deactivation Notice
  const [deactivationNotice, setDeactivationNotice] = useState('');
  
  // Step 3: Account Details
  const [accountTenure, setAccountTenure] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [completionRate, setCompletionRate] = useState('');
  const [totalDeliveries, setTotalDeliveries] = useState('');
  const [userStory, setUserStory] = useState('');
  const [evidence, setEvidence] = useState('');
  const [userState, setUserState] = useState('');
  const [appealTone, setAppealTone] = useState('professional');

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

  // Get platform name for display
  const getPlatformName = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    return platform ? platform.name : 'the platform';
  };

  // Get current date formatted
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Copy letter to clipboard
  const copyToClipboard = () => {
    const letterText = generatedLetter || generateLetterText();
    navigator.clipboard.writeText(letterText).then(() => {
      alert('Appeal letter copied to clipboard!');
    });
  };

  // Download appeal as PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    // Margins and formatting
    const leftMargin = 25;
    const rightMargin = 25;
    const pageWidth = 216; // letter width in mm
    const contentWidth = pageWidth - leftMargin - rightMargin;
    let yPosition = 25;
    const lineHeight = 7;
    const fontSize = 11;
    const headingSize = 13;

    // Set font
    doc.setFont('helvetica');

    // Date (right aligned)
    doc.setFontSize(fontSize);
    doc.text(getCurrentDate(), pageWidth - rightMargin, yPosition, { align: 'right' });
    yPosition += lineHeight * 2;

    // Recipient address
    doc.setFontSize(headingSize);
    doc.setFont('helvetica', 'bold');
    doc.text(`${getPlatformName()} Appeals Team`, leftMargin, yPosition);
    yPosition += lineHeight;
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 38, 38); // Red color for Re: line
    doc.text('Re: Appeal of Account Deactivation', leftMargin, yPosition);
    doc.setTextColor(0, 0, 0); // Back to black
    yPosition += lineHeight * 2;

    // Salutation
    doc.text(`Dear ${getPlatformName()} Appeals Team,`, leftMargin, yPosition);
    yPosition += lineHeight * 1.5;

    // Get the letter content
    const letterText = generatedLetter || generateLetterText();
    
    // Split text into lines that fit the page width
    const splitText = (text: string) => {
      const lines: string[] = [];
      const paragraphs = text.split('\n');
      
      paragraphs.forEach(paragraph => {
        if (paragraph.trim() === '') {
          lines.push('');
        } else {
          const words = paragraph.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = doc.getTextWidth(testLine);
            
            if (textWidth > contentWidth) {
              if (currentLine) lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine) lines.push(currentLine);
        }
      });
      
      return lines;
    };

    // Remove the salutation from letter text since we already added it
    let bodyText = letterText.replace(/^.*?Dear.*?Appeals Team,\s*/s, '');
    
    // Split and add text to PDF
    const lines = splitText(bodyText);
    
    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 25;
      }

      // Check for section headers (all caps lines)
      if (line === line.toUpperCase() && line.length > 0 && line.length < 50) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(headingSize);
        yPosition += lineHeight * 0.5;
        doc.text(line, leftMargin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        yPosition += lineHeight;
      } else if (line.trim() === '') {
        yPosition += lineHeight * 0.5;
      } else {
        doc.text(line, leftMargin, yPosition);
        yPosition += lineHeight;
      }
    });

    // Add signature section if not already in generated letter
    if (!letterText.includes('Sincerely')) {
      yPosition += lineHeight;
      doc.text('Sincerely,', leftMargin, yPosition);
      yPosition += lineHeight * 3;
      doc.text('[Your Full Name]', leftMargin, yPosition);
      yPosition += lineHeight;
      doc.text('[Your Phone Number]', leftMargin, yPosition);
      yPosition += lineHeight;
      doc.text('[Your Email Address]', leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'bold');
      doc.text('ACCOUNT ID: [Your Account ID]', leftMargin, yPosition);
    }

    // Add footer with GigShield branding
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(128, 128, 128);
      doc.text(
        'Generated by GigShield - Protecting Gig Workers Rights',
        pageWidth / 2,
        285,
        { align: 'center' }
      );
      doc.setTextColor(0, 0, 0);
    }

    // Download the PDF
    const fileName = `${getPlatformName()}_Appeal_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Generate plain text version of letter
  const generateLetterText = () => {
    let letter = `${getCurrentDate()}\n\n`;
    letter += `${getPlatformName()} Appeals Team\n`;
    letter += `Re: Appeal of Account Deactivation\n\n`;
    letter += `Dear ${getPlatformName()} Appeals Team,\n\n`;
    letter += `I am writing to formally appeal the deactivation of my ${getPlatformName()} account, which I received notice of on ${getCurrentDate()}.`;
    
    if (accountTenure) {
      letter += ` I have been an active ${selectedPlatform === 'uber' || selectedPlatform === 'lyft' ? 'driver' : 'worker'} for approximately ${accountTenure}`;
    }
    
    if (currentRating || completionRate || totalDeliveries) {
      letter += ' with a consistent track record of excellence:\n\n';
      if (accountTenure) letter += `- Account Tenure: ${accountTenure}\n`;
      if (currentRating) letter += `- Rating: ${currentRating}\n`;
      if (completionRate) letter += `- Completion Rate: ${completionRate}\n`;
      if (totalDeliveries) letter += `- Total ${selectedPlatform === 'uber' || selectedPlatform === 'lyft' ? 'Rides' : 'Deliveries'}: ${totalDeliveries}\n`;
    }
    
    letter += `\n\nREGARDING THE DEACTIVATION\n\n`;
    letter += `The deactivation notice ${deactivationNotice ? 'stated the following:\n\n"' + deactivationNotice.substring(0, 200) + '"\n\n' : 'provided limited information about the reason for this action.\n\n'}`;
    
    if (userStory) {
      letter += `However, I believe this decision was made in error for the following reasons:\n\n${userStory}\n\n`;
    }
    
    if (evidence) {
      letter += `SUPPORTING EVIDENCE\n\nI have the following evidence to support my case:\n\n${evidence}\n\n`;
    }
    
    letter += `MISSING INFORMATION\n\n`;
    letter += `I respectfully request that ${getPlatformName()} provide me with the following information:\n\n`;
    letter += `1. Specific policy or community guideline violated\n`;
    letter += `2. Date, time, and details of the alleged incident(s)\n`;
    letter += `3. Evidence or documentation supporting the deactivation decision\n`;
    letter += `4. Opportunity to review and respond to any customer complaints or reports\n\n`;
    
    letter += `REQUEST FOR REINSTATEMENT\n\n`;
    letter += `Based on the above, I respectfully request:\n\n`;
    letter += `1. Immediate reinstatement of my account\n`;
    letter += `2. A detailed explanation of the specific incident(s) that led to this decision\n`;
    letter += `3. An opportunity to review and respond to any evidence against me\n`;
    letter += `4. Confirmation that this deactivation will not appear on my permanent record if found to be in error\n\n`;
    
    letter += `I take my work with ${getPlatformName()} seriously and have always strived to provide excellent service. I am confident that a thorough review of my account history will demonstrate my commitment to the platform's standards and policies.\n\n`;
    letter += `I kindly request a response within 7 business days. Thank you for your time and consideration.\n\n`;
    letter += `Sincerely,\n\n`;
    letter += `[Your Full Name]\n`;
    letter += `[Your Phone Number]\n`;
    letter += `[Your Email Address]\n`;
    letter += `ACCOUNT ID: [Your Account ID]`;
    
    return letter;
  };

  const handleContinue = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Generate appeal by calling backend API
      await handleGenerateAppeal();
    }
  };

  const handleGenerateAppeal = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Call backend API to generate appeal
      const result = await generateAppeal({
        platform: selectedPlatform,
        deactivation_reason: deactivationNotice,
        user_story: userStory,
        account_tenure: accountTenure,
        current_rating: currentRating,
        completion_rate: completionRate,
        total_deliveries: totalDeliveries,
        appeal_tone: appealTone,
        user_state: userState
      });

      // Save the generated letter and appeal ID
      setGeneratedLetter(result.appeal_letter);
      setAppealId(result.appeal_id);
      
      // Move to step 4 to show the generated letter
      setCurrentStep(4);
      
      console.log('✓ Appeal generated and saved:', result.appeal_id);
    } catch (err: any) {
      console.error('Error generating appeal:', err);
      setError(err.message || 'Failed to generate appeal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return selectedPlatform !== '';
    if (currentStep === 2) return deactivationNotice.trim() !== '';
    if (currentStep === 3) return true;
    return false;
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedPlatform('');
    setDeactivationNotice('');
    setAccountTenure('');
    setCurrentRating('');
    setCompletionRate('');
    setTotalDeliveries('');
    setUserStory('');
    setEvidence('');
    setUserState('');
    setAppealTone('professional');
    setGeneratedLetter('');
    setAppealId('');
    setError('');
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
                    value={accountTenure}
                    onChange={(e) => setAccountTenure(e.target.value)}
                    placeholder="e.g., 2 years"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Rating</label>
                  <input
                    type="text"
                    value={currentRating}
                    onChange={(e) => setCurrentRating(e.target.value)}
                    placeholder="e.g., 4.95"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Completion Rate</label>
                  <input
                    type="text"
                    value={completionRate}
                    onChange={(e) => setCompletionRate(e.target.value)}
                    placeholder="e.g., 98%"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Deliveries/Rides</label>
                  <input
                    type="text"
                    value={totalDeliveries}
                    onChange={(e) => setTotalDeliveries(e.target.value)}
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
                  value={userStory}
                  onChange={(e) => setUserStory(e.target.value)}
                  placeholder="Describe what you believe happened. If you don't know why you were deactivated, that's okay — we'll help you request that information."
                  className="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Evidence you have (optional)</label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
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
                <select 
                  value={userState}
                  onChange={(e) => setUserState(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your state...</option>
                  <option value="Arizona">Arizona</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="Texas">Texas</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Other">Other State</option>
                </select>
                <p className="text-sm text-slate-500 mt-2">Some states have specific gig worker protections we'll reference</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Appeal Tone</label>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    type="button"
                    onClick={() => setAppealTone('professional')}
                    className={`px-6 py-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                      appealTone === 'professional' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {appealTone === 'professional' && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-semibold ${appealTone === 'professional' ? 'text-blue-900' : 'text-slate-900'}`}>
                        Professional
                      </span>
                    </div>
                    <p className={`text-sm ${appealTone === 'professional' ? 'text-blue-700' : 'text-slate-600'}`}>
                      Polite and factual
                    </p>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAppealTone('assertive')}
                    className={`px-6 py-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                      appealTone === 'assertive' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {appealTone === 'assertive' && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-semibold ${appealTone === 'assertive' ? 'text-blue-900' : 'text-slate-900'}`}>
                        Assertive
                      </span>
                    </div>
                    <p className={`text-sm ${appealTone === 'assertive' ? 'text-blue-700' : 'text-slate-600'}`}>
                      Firm but respectful
                    </p>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAppealTone('legal')}
                    className={`px-6 py-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                      appealTone === 'legal' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {appealTone === 'legal' && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-semibold ${appealTone === 'legal' ? 'text-blue-900' : 'text-slate-900'}`}>
                        Legal
                      </span>
                    </div>
                    <p className={`text-sm ${appealTone === 'legal' ? 'text-blue-700' : 'text-slate-600'}`}>
                      References laws and rights
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={isGenerating}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Appeal Letter
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Appeal Generated Successfully!</p>
                <p className="text-sm text-green-700">Your appeal has been saved. Appeal ID: {appealId}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end mb-6">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
              <button 
                onClick={downloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>

            {/* Letter Preview */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 mb-8 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Appeal Letter Preview</h2>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Platform: <span className="font-semibold text-slate-700">{getPlatformName()}</span></div>
                  <div className="text-sm text-slate-500">Tone: <span className="font-semibold text-slate-700 capitalize">{appealTone}</span></div>
                </div>
              </div>

              {generatedLetter ? (
                /* Show backend-generated letter */
                <div className="space-y-4 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {generatedLetter}
                </div>
              ) : (
                /* Fallback to template */
                <div className="space-y-6 text-slate-800 leading-relaxed">
                <div className="text-right text-slate-600">{getCurrentDate()}</div>

                <div>
                  <div className="font-semibold text-slate-900">{getPlatformName()} Appeals Team</div>
                  <div className="text-red-600 font-medium">Re: Appeal of Account Deactivation</div>
                </div>

                <div>Dear {getPlatformName()} Appeals Team,</div>

                <p>
                  I am writing to formally appeal the deactivation of my {getPlatformName()} account, which I received notice of on {getCurrentDate()}. 
                  {accountTenure && (
                    <> I have been an active {selectedPlatform === 'uber' || selectedPlatform === 'lyft' ? 'driver' : 'worker'} for approximately <span className="font-semibold">{accountTenure}</span></>
                  )}
                  {(currentRating || completionRate || totalDeliveries) && ' with a consistent track record of excellence:'}
                </p>

                {(accountTenure || currentRating || completionRate || totalDeliveries) && (
                  <ul className="list-disc pl-6 space-y-1">
                    {accountTenure && <li><span className="font-semibold">Account Tenure:</span> {accountTenure}</li>}
                    {currentRating && <li><span className="font-semibold">Rating:</span> {currentRating}</li>}
                    {completionRate && <li><span className="font-semibold">Completion Rate:</span> {completionRate}</li>}
                    {totalDeliveries && <li><span className="font-semibold">Total {selectedPlatform === 'uber' || selectedPlatform === 'lyft' ? 'Rides' : 'Deliveries'}:</span> {totalDeliveries}</li>}
                  </ul>
                )}

                <div>
                  <div className="font-bold text-blue-700 mb-2">REGARDING THE DEACTIVATION</div>
                  <p>
                    The deactivation notice {deactivationNotice ? 'stated the following:' : 'provided limited information about the reason for this action.'}
                  </p>
                  {deactivationNotice && (
                    <div className="mt-2 p-4 bg-slate-50 border-l-4 border-slate-300 italic text-slate-600">
                      "{deactivationNotice.substring(0, 200)}{deactivationNotice.length > 200 ? '...' : ''}"
                    </div>
                  )}
                  {userStory && (
                    <>
                      <p className="mt-3">However, I believe this decision was made in error for the following reasons:</p>
                      <p className="mt-2 italic text-blue-800">{userStory}</p>
                    </>
                  )}
                </div>

                {evidence && (
                  <div>
                    <div className="font-bold text-blue-700 mb-2">SUPPORTING EVIDENCE</div>
                    <p>I have the following evidence to support my case:</p>
                    <p className="mt-2 italic text-blue-800">{evidence}</p>
                  </div>
                )}

                <div>
                  <div className="font-bold text-blue-700 mb-2">MISSING INFORMATION</div>
                  <p>
                    I respectfully request that {getPlatformName()} provide me with the following information, which was not included in the deactivation notice but is necessary for me to adequately respond to these allegations:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 mt-2">
                    <li>Specific policy or community guideline violated</li>
                    <li>Date, time, and details of the alleged incident(s)</li>
                    <li>Evidence or documentation supporting the deactivation decision</li>
                    <li>Opportunity to review and respond to any customer complaints or reports</li>
                  </ol>
                </div>

                {userState && ['California', 'Washington', 'New York'].includes(userState) && (
                  <div>
                    <div className="font-bold text-blue-700 mb-2">APPLICABLE STATE PROTECTIONS</div>
                    <p>
                      As a gig worker in {userState}, I am entitled to certain protections under state law:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      {userState === 'California' && (
                        <>
                          <li>Right to notice and explanation for deactivation (AB5)</li>
                          <li>Right to appeal deactivation decisions</li>
                        </>
                      )}
                      {userState === 'Washington' && (
                        <>
                          <li>Right to written notice with specific reasons for deactivation</li>
                          <li>Right to appeal with supporting evidence</li>
                        </>
                      )}
                      {userState === 'New York' && (
                        <>
                          <li>Right to transparency in deactivation decisions</li>
                          <li>Protection against arbitrary deactivation</li>
                        </>
                      )}
                    </ul>
                    <p className="mt-2">I respectfully request that this appeal be handled in accordance with these protections.</p>
                  </div>
                )}

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
                  I take my work with {getPlatformName()} seriously and have always strived to provide excellent service. I am confident that a thorough review of my account history will demonstrate my commitment to the platform's standards and policies.
                </p>

                <p>
                  I kindly request a response within 7 business days. Thank you for your time and consideration.
                </p>

                <div className="mt-8">
                  <div>Sincerely,</div>
                  <div className="mt-2 space-y-1">
                    <div className="text-slate-500">[Your Full Name]</div>
                    <div className="text-slate-500">[Your Phone Number]</div>
                    <div className="text-slate-500">[Your Email Address]</div>
                    <div className="font-semibold text-slate-500">ACCOUNT ID: [Your Account ID]</div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">1</div>
                  <p className="text-slate-700">Download as PDF or copy to clipboard using the buttons above</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">2</div>
                  <p className="text-slate-700">Fill in the [bracketed] sections with your personal information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">3</div>
                  <div className="text-slate-700">
                    <p className="mb-1">Submit via {getPlatformName()}'s official appeal channel:</p>
                    <div className="ml-4 text-sm text-blue-600 font-medium">
                      {selectedPlatform === 'doordash' && '→ help.doordash.com/dashers → Account → Appeal Deactivation'}
                      {selectedPlatform === 'uber' && '→ help.uber.com → Account → Deactivated Account'}
                      {selectedPlatform === 'lyft' && '→ help.lyft.com/hc → Driver Account → Appeal'}
                      {selectedPlatform === 'instacart' && '→ shoppers.instacart.com → Support → Account Status'}
                      {selectedPlatform === 'amazonflex' && '→ flex.amazon.com → Support → Account Issue'}
                      {selectedPlatform === 'shipt' && '→ shoppers.shipt.com → Support → Account Appeal'}
                      {!selectedPlatform && '→ Check your platform\'s help center'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">4</div>
                  <p className="text-slate-700">Keep copies of your submission for your records</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">5</div>
                  <p className="text-slate-700">Follow up if you don't hear back within 7 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-sm">!</div>
                  <p className="text-slate-700"><span className="font-semibold">Pro tip:</span> Some platforms respond faster via Twitter/X. Tag them publicly if your appeal is urgent.</p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetWizard}
                className="px-8 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700"
              >
                ← Start New Appeal
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700"
              >
                ← Edit Details
              </button>
              <button
                onClick={() => onNavigate('tracker')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Track This Appeal →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealWizard;
