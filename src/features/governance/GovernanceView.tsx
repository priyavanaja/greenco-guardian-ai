import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  History, 
  Sparkles, 
  Activity,
  CheckCircle2 
} from 'lucide-react';

interface ModelCard {
  name: string;
  version: string;
  accuracy: string;
  confidence: string;
  status: string;
  biasIndex: string;
}

const modelCards: ModelCard[] = [
  { name: 'Document AI OCR Extractor', version: 'v5.0.0', accuracy: '98.4%', confidence: '96.2%', status: 'Healthy', biasIndex: '0.01 (Negligible)' },
  { name: 'Computer Vision Forensics Node', version: 'v4.12.0', accuracy: '96.8%', confidence: '94.5%', status: 'Healthy', biasIndex: '0.02 (Negligible)' },
  { name: 'Fraud Deepfake Screening Engine', version: 'v3.2.1', accuracy: '99.2%', confidence: '98.1%', status: 'Healthy', biasIndex: '0.00 (None)' }
];

export const GovernanceView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 17</span>
          <h1 className="text-2xl font-black text-gray-800">AI Governance Center</h1>
          <p className="text-xs text-gray-400 font-medium">Monitor AI bias parameters, model weights, versions, and verification accuracy.</p>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modelCards.map((model, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4 hover:border-emerald-200 transition-all group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{model.version}</span>
                <h4 className="text-sm font-bold text-gray-850 truncate max-w-[180px]">{model.name}</h4>
              </div>
              <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                <Cpu className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-gray-500 uppercase">
              <div className="flex justify-between items-center">
                <span>Model Accuracy</span>
                <span className="text-gray-800 font-bold">{model.accuracy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Confidence Index</span>
                <span className="text-gray-800 font-bold">{model.confidence}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bias Index</span>
                <span className="text-gray-800 font-bold">{model.biasIndex}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Health State</span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {model.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decision timeline log */}
      <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <History className="h-5 w-5 text-emerald-600" />
          <span>AI Decision Logs & Explainability Register</span>
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Decision: document_ocr_extraction</span>
              <span className="text-gray-400 font-medium">10 mins ago</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
              Extracted total billing volume of 2,300 KL from invoice water invoice may.pdf. Signature matched registered municipal utility billing key.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Decision: photo_deepfake_filtering</span>
              <span className="text-gray-400 font-medium">1 hour ago</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
              Flagged photo waste_flow_inconsistent.jpg as 88% probability synthetic generation. Diffusion noise pattern detected in background pixels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
