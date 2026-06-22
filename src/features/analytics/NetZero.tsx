import React, { useState } from 'react';
import { 
  Leaf, 
  Sparkles, 
  HelpCircle, 
  Calendar, 
  CheckCircle,
  TrendingDown 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface TargetPhase {
  year: number;
  phaseName: string;
  energyGoal: string;
  waterGoal: string;
  carbonGoal: string;
  wasteGoal: string;
  description: string;
  completedTasks: string[];
  pendingTasks: string[];
}

const targetPhases: Record<number, TargetPhase> = {
  2026: {
    year: 2026,
    phaseName: 'Baseline Alignment & Audit Setup',
    energyGoal: 'Reduce baseload usage by 5%',
    waterGoal: 'Achieve 15% wastewater recycling rate',
    carbonGoal: 'Offset 1,200 Tons CO2e via solar yard',
    wasteGoal: 'Divert 40% of scrap away from landfills',
    description: 'Establish secure IoT smart telemetry streams on all core manufacturing machinery assembly sections.',
    completedTasks: [
      'Install IoT electric grid smart meters.',
      'Calibrate primary factory discharge flow rate sensors.'
    ],
    pendingTasks: [
      'Establish baseline water balance diagrams.',
      'Deploy synthetic deepfake check filters.'
    ]
  },
  2027: {
    year: 2027,
    phaseName: 'Systemic Optimization & Capacity Upgrades',
    energyGoal: 'Reduce baseload usage by 18%',
    waterGoal: 'Achieve 35% wastewater recycling rate',
    carbonGoal: 'Offset 6,500 Tons CO2e via turbine expansions',
    wasteGoal: 'Divert 70% of scrap away from landfills',
    description: 'Implement automated variable speed sludge motors and optimize HVAC heating loads across buildings.',
    completedTasks: [
      'Install baseline water balance diagrams.',
      'Configure automated HVAC thermostat timers.',
      'Activate variable speed drives on primary sludge lines.'
    ],
    pendingTasks: [
      'Construct East wing solar array extension.',
      'Integrate blockchain anchors for certificates.'
    ]
  },
  2028: {
    year: 2028,
    phaseName: 'Full Net Zero Decarbonization Target',
    energyGoal: 'Reduce grid dependency by 35%',
    waterGoal: 'Achieve 80% wastewater recycling loop',
    carbonGoal: 'Offset 12,400 Tons CO2e via unified system',
    wasteGoal: 'Divert 95% of scrap (Zero Waste Certificate)',
    description: 'Fully cycle production operations utilizing renewable credits, on-site solar yards, and secondary filters.',
    completedTasks: [
      'Integrate blockchain anchors for certificates.',
      'Deploy full-scale composting facility for scraps.'
    ],
    pendingTasks: [
      'Optimize turbine blade pitch angles for high wind seasons.',
      'Establish carbon capture scrubbers in main assembly.'
    ]
  }
};

export const NetZero: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2027);
  const phase = targetPhases[selectedYear] || targetPhases[2027];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 16</span>
          <h1 className="text-2xl font-black text-gray-800">Net Zero Decarbonization Intelligence</h1>
          <p className="text-xs text-gray-400 font-medium">Configure corporate milestones, offset targets, and yearly goals.</p>
        </div>
      </div>

      {/* Slider scrubber bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
          <span>Target Timeline Roadmap</span>
          <span className="text-emerald-700 font-extrabold">{selectedYear} Phase Selected</span>
        </div>

        <div className="flex justify-between items-center relative py-6">
          {/* Horizontal tracking line */}
          <div className="absolute left-[10%] right-[10%] h-0.5 bg-gray-200 top-1/2 -translate-y-1/2" />
          
          {[2026, 2027, 2028].map((yr) => {
            const isSel = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`h-11 w-24 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all z-10 ${
                  isSel 
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-250 scale-105' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span>{yr}</span>
                <span className="text-[8px] opacity-75 font-semibold">
                  {yr === 2026 ? 'Baseline' : yr === 2027 ? 'Optimize' : 'Net Zero'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Year goals list */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span>Target Carbon & Resource Commitments</span>
          </h3>

          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            {phase.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Energy Target</span>
              <p className="text-xs font-bold text-gray-800">{phase.energyGoal}</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Water Target</span>
              <p className="text-xs font-bold text-gray-800">{phase.waterGoal}</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Carbon Target</span>
              <p className="text-xs font-bold text-gray-800">{phase.carbonGoal}</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Waste Target</span>
              <p className="text-xs font-bold text-gray-800">{phase.wasteGoal}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Checklist tasks */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
            Task Alignment Status
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                ✓ Completed Operations
              </span>
              <div className="space-y-2">
                {phase.completedTasks.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                Pending Actions
              </span>
              <div className="space-y-2">
                {phase.pendingTasks.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                    <span className="h-4 w-4 rounded-full border border-gray-300 mt-0.5 flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
