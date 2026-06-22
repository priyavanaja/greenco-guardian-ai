import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Activity, 
  ChevronRight,
  Gauge
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const PredictiveAnalytics: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  // Simulator State: 0 (Baseline), 1 (Optimized), 2 (Net Zero Target)
  const [scenario, setScenario] = useState<number>(1); 

  const getCarbonReduction = () => {
    switch (scenario) {
      case 0: return currentTenant.carbonReduction * 0.7; // baseline
      case 2: return currentTenant.carbonReduction * 1.6; // net zero target
      default: return currentTenant.carbonReduction; // optimized
    }
  };

  const getEnergySaving = () => {
    switch (scenario) {
      case 0: return '5%';
      case 2: return '38%';
      default: return '18%';
    }
  };

  const getWaterSaving = () => {
    switch (scenario) {
      case 0: return '3%';
      case 2: return '45%';
      default: return '22%';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 12</span>
          <h1 className="text-2xl font-black text-gray-800">Predictive Sustainability Analytics</h1>
          <p className="text-xs text-gray-400 font-medium">Model future emission milestones and simulate green optimization scenarios.</p>
        </div>
      </div>

      {/* Scenario Switcher Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4.5 w-4.5 text-emerald-600" />
          <span className="text-xs font-bold text-gray-500 uppercase">Active Scenario Simulator:</span>
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            {['Baseline Status', 'Optimized System', 'Net Zero Target'].map((name, idx) => (
              <button
                key={name}
                onClick={() => setScenario(idx)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  scenario === idx 
                    ? 'bg-white text-emerald-800 shadow-xs border border-gray-150' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold text-emerald-700 uppercase">
          AI Scenario Modelling Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center Columns: Forecast graph */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span>Carbon Abatement Forecast Timeline (Tons CO2e)</span>
          </h3>

          <div className="h-64 relative flex flex-col justify-between">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-gray-100 h-0 w-full" />
              <div className="border-b border-gray-100 h-0 w-full" />
              <div className="border-b border-gray-100 h-0 w-full" />
            </div>

            <svg className="w-full h-full z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Dynamic line based on scenario */}
              <path
                d={
                  scenario === 0 
                    ? 'M0,180 Q100,165 200,155 T400,140 T500,135' // baseline
                    : scenario === 2 
                    ? 'M0,180 Q100,130 200,80 T400,30 T500,5' // net zero target
                    : 'M0,180 Q100,150 200,110 T400,75 T500,55' // optimized
                }
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              <defs>
                <linearGradient id="gradient-predict" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-Axis */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase pt-2">
              <span>2026 (Baseline)</span>
              <span>2027 (Optimized)</span>
              <span>2028 (Net Zero)</span>
              <span>2029 (Forecast)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Savings stats */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
            <span>Predicted Savings Metrics</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Estimated Carbon Abated</span>
              <p className="text-2xl font-black text-gray-800">
                {Math.floor(getCarbonReduction()).toLocaleString()} Tons/yr
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Energy Savings</span>
                <p className="text-lg font-black text-emerald-700 mt-1">{getEnergySaving()}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Water Savings</span>
                <p className="text-lg font-black text-emerald-700 mt-1">{getWaterSaving()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <span>Future Level Forecast</span>
            </h4>
            <p className="text-xs text-emerald-700 font-medium">
              {scenario === 2 
                ? 'Platinum certification ranking expected within 12 months under Net Zero scenario.'
                : 'Current trajectory points to Gold status retention next quarter.'
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
