import React from 'react';
import { 
  ShieldCheck, 
  Bot, 
  History, 
  GitCommit, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const EvidenceTrust: React.FC = () => {
  const { selectedTenantId, tenants, evidenceList } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  // Average trust metrics
  const avgTrustScore = Math.floor(
    evidenceList.reduce((acc, curr) => acc + curr.authenticityScore, 0) / evidenceList.length
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 6</span>
          <h1 className="text-2xl font-black text-gray-800">AI Evidence Trust Engine</h1>
          <p className="text-xs text-gray-400 font-medium">Verify blockchain anchors, source consensus, and historical reliability.</p>
        </div>
      </div>

      {/* Trust stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Evidence Trust</span>
            <h4 className="text-2xl font-extrabold text-gray-800">{avgTrustScore}%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold">✓ Normal Operations</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Source Reliability</span>
            <h4 className="text-2xl font-extrabold text-gray-800">97.8%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold">Consensus matches</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Bot className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blockchain Ledger Anchor</span>
            <h4 className="text-sm font-extrabold text-emerald-800 leading-tight">ACTIVE (Polygon ID)</h4>
            <p className="text-[9px] text-gray-400 font-semibold font-mono truncate max-w-[150px]">
              0x4b78912A...E45
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Workflow Timeline Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <History className="h-5 w-5 text-emerald-600" />
          <span>Evidence Validation Ledger Pipeline</span>
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative p-4 bg-gray-50 border border-gray-150 rounded-xl">
          {/* Horizontal line for progress */}
          <div className="absolute left-8 right-8 top-10 h-0.5 bg-gray-200 hidden md:block" />

          {/* Node 1 */}
          <div className="flex items-center gap-3 md:flex-col md:text-center z-10 bg-gray-50 px-2">
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              1
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-gray-800">Upload Receipt</h5>
              <p className="text-[10px] text-gray-400 font-medium">Capture SHA-256 hash</p>
            </div>
          </div>

          {/* Node 2 */}
          <div className="flex items-center gap-3 md:flex-col md:text-center z-10 bg-gray-50 px-2">
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              2
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-gray-800">AI OCR Extraction</h5>
              <p className="text-[10px] text-gray-400 font-medium">Extract invoice metadata</p>
            </div>
          </div>

          {/* Node 3 */}
          <div className="flex items-center gap-3 md:flex-col md:text-center z-10 bg-gray-50 px-2">
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              3
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-gray-800">Forensic Filter</h5>
              <p className="text-[10px] text-gray-400 font-medium">Deepfake & edit validation</p>
            </div>
          </div>

          {/* Node 4 */}
          <div className="flex items-center gap-3 md:flex-col md:text-center z-10 bg-gray-50 px-2">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-gray-800">Assessor Approval</h5>
              <p className="text-[10px] text-gray-400 font-medium">Human certification signoff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Evidence Alert Table */}
      <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>Evidence Integrity Mismatch Checks</span>
        </h3>

        <div className="space-y-4">
          {evidenceList.filter(e => e.status === 'Rejected').map((e) => (
            <div key={e.id} className="p-4 border border-red-100 bg-red-50/20 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-red-800">Flagged Duplicate / Mismatch: {e.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  Upload GPS coordinates did not match physical geo-fence. Device footprint flag triggers alert.
                </p>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded font-bold uppercase">
                Risk critical
              </span>
            </div>
          ))}
          {evidenceList.filter(e => e.status === 'Rejected').length === 0 && (
            <p className="text-xs text-gray-400 font-medium italic text-center py-4">
              No evidence integrity alerts triggered for active organization.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
