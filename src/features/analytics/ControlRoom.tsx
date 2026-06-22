import React from 'react';
import { 
  Sliders, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const ControlRoom: React.FC = () => {
  const { 
    energyThreshold, 
    setEnergyThreshold, 
    waterThreshold, 
    setWaterThreshold, 
    carbonThreshold, 
    setCarbonThreshold, 
    addNotification, 
    addAuditLog, 
    selectedTenantId, 
    tenants 
  } = usePlatformStore();

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const handleSimulateSpike = (type: 'energy' | 'water') => {
    if (type === 'energy') {
      addNotification({
        title: 'Energy Threshold Alert',
        description: `Energy consumption increased by 18% compared to previous month at ${currentTenant.name} Chennai facility.`,
        severity: 'High',
        category: 'Sustainability Control Room'
      });
      addAuditLog({
        user: 'Sensor Telemetry',
        action: 'Load Spike Captured',
        details: 'Industrial meter registered active energy demand spike of 18%.',
        reason: 'Over-load production line activity.',
        category: 'Security'
      });
    } else {
      addNotification({
        title: 'Water Level Anomaly',
        description: `Water treatment discharge flow rate exceeded baseline parameters at ${currentTenant.name} Chennai facility.`,
        severity: 'Medium',
        category: 'Sustainability Control Room'
      });
      addAuditLog({
        user: 'Flow Sensor Node #10',
        action: 'Discharge Flow Anomaly',
        details: 'Flow velocity sensor registered rate spike of 38% above 120 KL limit.',
        reason: 'Backwash cycle duration exceeded.',
        category: 'Security'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 13</span>
          <h1 className="text-2xl font-black text-gray-800">Sustainability Control Room</h1>
          <p className="text-xs text-gray-400 font-medium">Real-time industrial carbon footprints, load logs, and active alarms.</p>
        </div>

        {/* Live Simulation buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSimulateSpike('energy')}
            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-850 border border-orange-200 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="h-4 w-4 text-orange-600" />
            <span>Simulate Energy Spike (+18%)</span>
          </button>
          <button
            onClick={() => handleSimulateSpike('water')}
            className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-850 border border-yellow-200 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="h-4 w-4 text-yellow-600" />
            <span>Simulate Water Leak (+38%)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Real-time Meters & Threshold Sliders */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-8">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-600" />
            <span>Operational Threshold Limits</span>
          </h3>

          <div className="space-y-6">
            {/* Slider 1: Energy */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Energy Load Threshold Limit</span>
                <span className="text-emerald-700">{energyThreshold} MWh</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={energyThreshold}
                onChange={(e) => setEnergyThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                <span>Current: 54 MWh</span>
                <span>Max Capacity: 150 MWh</span>
              </div>
            </div>

            {/* Slider 2: Water */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Water Discharge Threshold Limit</span>
                <span className="text-emerald-700">{waterThreshold} KL/h</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={waterThreshold}
                onChange={(e) => setWaterThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                <span>Current: 35 KL/h</span>
                <span>Max Capacity: 120 KL/h</span>
              </div>
            </div>

            {/* Slider 3: Carbon */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Carbon Intensity Limit</span>
                <span className="text-emerald-700">{carbonThreshold} gCO2e/kWh</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={carbonThreshold}
                onChange={(e) => setCarbonThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                <span>Current: 82 gCO2e/kWh</span>
                <span>Max Limit: 200 gCO2e/kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Alarms */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            <span>Environmental Alarms</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Active Safety Clearance</span>
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                Overall parameters are within normalized grid thresholds. No automatic shutdowns flagged.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase">AI Safety Tip</span>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Configure production batch schedules outside peak grid load periods (04:00 PM - 08:00 PM) to reduce base energy rates.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
