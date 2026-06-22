import React from 'react';
import { 
  AlertTriangle, 
  Bot, 
  Clock, 
  LayoutGrid, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const RiskCenter: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 8</span>
          <h1 className="text-2xl font-black text-gray-800">AI Risk Intelligence Center</h1>
          <p className="text-xs text-gray-400 font-medium">Consolidated monitoring of compliance, evidence, and corporate risks.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Overall Risk Score</span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-black px-2.5 py-0.5 border rounded-lg ${getRiskColor(currentTenant.riskLevel)}`}>
              {currentTenant.riskLevel}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Company Risk</span>
          <p className="text-xl font-black text-gray-800">{currentTenant.riskLevel === 'Critical' ? 'High' : 'Low'}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Evidence Authenticity Risk</span>
          <p className="text-xl font-black text-gray-800">{currentTenant.riskLevel === 'Critical' ? 'Critical' : 'Low'}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Compliance Violation Risk</span>
          <p className="text-xl font-black text-gray-800">{currentTenant.riskLevel === 'Critical' ? 'Critical' : 'Medium'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Risk Matrix Heatmap */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-emerald-600" />
            <span>Risk Matrix Grid (Likelihood vs Severity)</span>
          </h3>

          <div className="relative p-6 bg-slate-50 border border-gray-200 rounded-xl">
            <div className="grid grid-cols-5 gap-3 h-64">
              {Array.from({ length: 25 }).map((_, idx) => {
                const row = Math.floor(idx / 5);
                const col = idx % 5;
                
                // Color zones: red at top-right, yellow in middle, green at bottom-left
                let bg = 'bg-emerald-100 hover:bg-emerald-200';
                if (row <= 1 && col >= 3) bg = 'bg-red-100 hover:bg-red-200';
                else if (row === 2 || col === 2) bg = 'bg-yellow-100 hover:bg-yellow-200';
                else if (row === 1 && col === 1) bg = 'bg-emerald-100 hover:bg-emerald-200';
                else if (row <= 2 && col >= 2) bg = 'bg-orange-100 hover:bg-orange-200';

                // Display active threat marker for Company A
                const isThreatMarker = (currentTenant.id === 'company-a' && row === 0 && col === 4) ||
                                      (currentTenant.id !== 'company-a' && row === 4 && col === 1);

                return (
                  <div 
                    key={idx} 
                    className={`rounded-lg transition-colors flex items-center justify-center relative cursor-pointer ${bg}`}
                  >
                    {isThreatMarker && (
                      <div className="h-4 w-4 rounded-full bg-red-600 border-2 border-white animate-ping absolute" />
                    )}
                    {isThreatMarker && (
                      <div className="h-4 w-4 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white z-10" title={currentTenant.name}>
                        !
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase pt-3">
              <span>Low Likelihood</span>
              <span>High Likelihood</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Explanation & Action Plans */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600 animate-pulse" />
            <span>AI Risk Explanation</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Threat Overview</span>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                {currentTenant.id === 'company-a' 
                  ? 'Critical risk alert triggered due to recurrent submission of AI-generated invoice documents and EXIF metadata geolocation mismatch in compost photo e-3.'
                  : 'All primary factory sensors are synced with consistent grid power factors. Low risk index calculated.'
                }
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 pb-1">
                Remediation Actions
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-gray-700">
                {currentTenant.id === 'company-a' ? (
                  <>
                    <li className="flex items-center gap-2 text-red-700">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Suspend certification status immediately.</span>
                    </li>
                    <li className="flex items-center gap-2 text-red-700">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Request physical proof of compost yard ownership.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Maintain automated sensor checks.</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Process routine audit certificates.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
