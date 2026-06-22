import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ListChecks, 
  ChevronRight, 
  FileText, 
  HelpCircle 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const CopilotView: React.FC = () => {
  const { copilotMessages, sendCopilotMessage } = usePlatformStore();
  const [inputText, setInputText] = useState<string>('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendCopilotMessage(text);
    if (!textToSend) setInputText('');
  };

  // Get last AI message for explanation panel
  const aiMessages = copilotMessages.filter(m => m.sender === 'ai');
  const lastAiMsg = aiMessages[aiMessages.length - 1];

  const suggestedQuestions = [
    'Why did company receive Gold rating?',
    'How to improve rating to Platinum?',
    'Any fraud detected in recent files?'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 11</span>
          <h1 className="text-2xl font-black text-gray-800">Explainable AI Assessor Copilot</h1>
          <p className="text-xs text-gray-400 font-medium">Verify AI decision logs, recommendation traces, and OCR evidence citations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Chat Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex flex-col h-[500px] justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {copilotMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold border text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white border-emerald-700' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {msg.sender === 'user' ? 'U' : <Bot className="h-4.5 w-4.5" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed border shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 rounded-tr-none' 
                    : 'bg-slate-50 border-gray-200 text-gray-700 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider self-center">Evidence Citations:</span>
                      {msg.citations.map((c, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[9px] font-bold flex items-center gap-1 font-mono">
                          <FileText className="h-3 w-3" /> {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI Copilot why a rating was assigned or how to optimize..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-250 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
              />
              <button
                onClick={() => handleSend()}
                className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-200 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Decision Steps */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6 overflow-y-auto max-h-[500px]">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-emerald-600" />
            <span>AI Reasoning Flow</span>
          </h3>

          {lastAiMsg && lastAiMsg.reasoningSteps && lastAiMsg.reasoningSteps.length > 0 ? (
            <div className="space-y-4">
              {lastAiMsg.reasoningSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-800">{step.label}</h5>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center space-y-2">
              <HelpCircle className="h-10 w-10 text-gray-300 animate-pulse" />
              <h4 className="text-xs font-bold text-gray-700">No active reasoning trace</h4>
              <p className="text-xs text-gray-400 max-w-[200px]">
                Click one of the suggested questions to display the step-by-step AI decision logic.
              </p>
            </div>
          )}

          {lastAiMsg && lastAiMsg.citations && lastAiMsg.citations.length > 0 && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-1.5 mt-4">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>Explainable Summary</span>
              </h4>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                Evaluations derived from verifiable utility water bills and telemetry CSV datasets.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
