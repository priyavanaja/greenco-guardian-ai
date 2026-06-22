import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  RotateCw, 
  Sparkles, 
  Bot, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface ReportTemplate {
  id: string;
  name: string;
  desc: string;
  aiVerdict: string;
  pages: number;
}

const reportTemplates: ReportTemplate[] = [
  { id: 'rep-1', name: 'Annual Environmental Audit Report', desc: 'Verified resource inputs, water recyclers, and electricity baseload records.', aiVerdict: 'Audit Passed • High source consensus verified.', pages: 18 },
  { id: 'rep-2', name: 'Compliance Forensics Report', desc: 'Complete log of deepfake image screening, duplicate checks, and EXIF metadata anomalies.', aiVerdict: '1 duplicate warning resolved, no open disputes.', pages: 8 },
  { id: 'rep-3', name: 'Net Zero Targets Projections Report', desc: 'Simulated multi-year models mapping baseline alignment to final 2028 decarbonization target.', aiVerdict: 'Platinum trajectory verified under optimized scenario.', pages: 12 },
  { id: 'rep-4', name: 'AI Decision Explanation Report', desc: 'Citation timeline logs explaining weight calculations for environmental sub-scores.', aiVerdict: 'Fully explainable decision chain anchored.', pages: 14 }
];

export const ReportsView: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const [selectedRepId, setSelectedRepId] = useState<string>('rep-1');
  const [compiling, setCompiling] = useState<boolean>(false);
  const [compiledReport, setCompiledReport] = useState<any>(null);

  const selectedRep = reportTemplates.find(r => r.id === selectedRepId) || reportTemplates[0];

  const handleCompile = (format: 'pdf' | 'excel') => {
    setCompiling(true);
    setCompiledReport(null);

    setTimeout(() => {
      setCompiling(false);
      setCompiledReport({
        format,
        filename: `${selectedRep.name.toLowerCase().replace(/ /g, '_')}_${currentTenant.id}.${format}`,
        size: format === 'pdf' ? '2.4 MB' : '450 KB',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 15</span>
          <h1 className="text-2xl font-black text-gray-800">AI Report Generator</h1>
          <p className="text-xs text-gray-400 font-medium">Export secure PDF audit trails, compliance certifications, and forecasting tables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Report Templates */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Available Templates
          </h3>

          <div className="space-y-3">
            {reportTemplates.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedRepId(rep.id)}
                className={`w-full p-4 rounded-xl border text-left space-y-1 transition-all ${
                  selectedRepId === rep.id 
                    ? 'border-emerald-600 bg-emerald-50/20 shadow-xs' 
                    : 'border-gray-150 hover:bg-gray-50'
                }`}
              >
                <h4 className="text-xs font-bold text-gray-850">{rep.name}</h4>
                <p className="text-[10px] text-gray-400 font-medium line-clamp-2">{rep.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Columns: Generator Panel */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <div className="flex justify-between items-start border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-gray-850 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>{selectedRep.name}</span>
              </h2>
              <span className="text-[10px] text-gray-400 font-semibold">
                Scope: {currentTenant.name} • {selectedRep.pages} Pages
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCompile('pdf')}
                disabled={compiling}
                className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {compiling ? <RotateCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                <span>Compile PDF</span>
              </button>
              <button
                onClick={() => handleCompile('excel')}
                disabled={compiling}
                className="h-8 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-655 border border-gray-250 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Compile Excel</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase">AI Compiler Verdict</span>
            <p className="text-xs text-gray-700 font-semibold">{selectedRep.aiVerdict}</p>
          </div>

          {compiledReport && (
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl space-y-2 mt-4 animate-scale-in">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Compilation Complete</span>
              </h4>
              <div className="text-xs text-emerald-700 font-semibold space-y-1">
                <div>Filename: <span className="font-mono font-extrabold">{compiledReport.filename}</span></div>
                <div>Size: <span className="font-extrabold">{compiledReport.size}</span></div>
                <div>Timestamp: <span className="font-extrabold">{compiledReport.timestamp}</span></div>
              </div>
            </div>
          )}

          <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-2 mt-4">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>AI Report Explainer</span>
            </h4>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              Export builds a cryptographically signed payload incorporating local factory water/electricity telemetry logs, audit trails, and assessor location tokens.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
