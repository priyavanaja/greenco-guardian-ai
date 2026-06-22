import React, { useState } from 'react';
import { ThreeTwinCanvas } from './ThreeTwinCanvas';
import { 
  Activity, 
  Sun, 
  Wind, 
  Building, 
  Droplet, 
  Trash2, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

interface ComponentDetail {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  efficiency: string;
  carbonReduction: string;
  recommendation: string;
  metrics: { label: string; value: string }[];
}

const componentDetailsMap: Record<string, ComponentDetail> = {
  solar: {
    title: 'Solar Panel Array',
    icon: Sun,
    efficiency: '87%',
    carbonReduction: '25 tons/year',
    recommendation: 'Increase solar installation density by 15% on East facade.',
    metrics: [
      { label: 'Installed Capacity', value: '350 kW' },
      { label: 'Current Output', value: '280 kW (Peak)' },
      { label: 'Irradiance Factor', value: '4.8 kWh/m²/day' }
    ]
  },
  wind: {
    title: 'Wind Energy Turbines',
    icon: Wind,
    efficiency: '92%',
    carbonReduction: '40 tons/year',
    recommendation: 'Perform routine mechanical lubrication on turbine hub pitch controls.',
    metrics: [
      { label: 'Rotor Diameter', value: '12 meters' },
      { label: 'Wind Velocity', value: '6.2 m/s' },
      { label: 'Current Frequency', value: '50.1 Hz' }
    ]
  },
  factory: {
    title: 'Main Assembly Building',
    icon: Building,
    efficiency: '78%',
    carbonReduction: '15 tons/year (HVAC optimized)',
    recommendation: 'Replace standard mercury gas light fixtures with high efficiency LEDs.',
    metrics: [
      { label: 'Production Floor Area', value: '12,500 sq ft' },
      { label: 'Baseload Draw', value: '45 kW' },
      { label: 'Power Factor', value: '0.84' }
    ]
  },
  water: {
    title: 'Water Filtration System',
    icon: Droplet,
    efficiency: '84%',
    carbonReduction: '12 tons/year',
    recommendation: 'Upgrade secondary sludge pump assemblies to variable frequency speed drives.',
    metrics: [
      { label: 'Filter Velocity', value: '120 KL/hour' },
      { label: 'Total Dissolved Solids', value: '280 ppm' },
      { label: 'Recycle Rate', value: '15.4%' }
    ]
  },
  waste: {
    title: 'Waste Management Yard',
    icon: Trash2,
    efficiency: '89%',
    carbonReduction: '8 tons/year',
    recommendation: 'Implement solid waste category segregation directly at source bin collection points.',
    metrics: [
      { label: 'Daily Output', value: '2.4 Tons' },
      { label: 'Compost Yield', value: '0.8 Tons' },
      { label: 'Landfill Diversion', value: '78.2%' }
    ]
  }
};

export const DigitalTwinView: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<string>('solar');
  const details = componentDetailsMap[selectedComp] || componentDetailsMap.solar;
  const DetailIcon = details.icon;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 4</span>
          <h1 className="text-2xl font-black text-gray-800">3D Digital Twin Preview</h1>
          <p className="text-xs text-gray-400 font-medium">Real-time WebGL spatial telemetry model & smart controls.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Three.js Canvas Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Interactive Telemetry Viewer</span>
            </span>
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" /> Orbit: Left Click + Drag
            </span>
          </div>

          <ThreeTwinCanvas 
            onSelectComponent={setSelectedComp} 
            activeComponent={selectedComp} 
          />

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.keys(componentDetailsMap).map((key) => {
              const comp = componentDetailsMap[key];
              const Icon = comp.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedComp(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedComp === key
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{comp.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Inspection Column */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <DetailIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{details.title}</h3>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">Sensor telemetry telemetry</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Efficiency Rating</span>
                <p className="text-xl font-black text-gray-800">{details.efficiency}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Carbon Reduction</span>
                <p className="text-xs font-extrabold text-emerald-700 mt-1">{details.carbonReduction}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 pb-1">
                Raw Telemetry Registers
              </h4>
              <div className="space-y-2 text-xs">
                {details.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center font-medium">
                    <span className="text-gray-400">{m.label}</span>
                    <span className="text-gray-700 font-bold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendation Alert */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-1.5 mt-4">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>AI Recommendation</span>
            </h4>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              {details.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
