import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  TrendingUp, 
  Gauge, 
  Sparkles, 
  Percent, 
  Activity 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const CommandCenter: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 1</span>
          <h1 className="text-2xl font-black text-gray-800">AI Executive Command Center</h1>
          <p className="text-xs text-gray-400 font-medium">Futuristic sustainability intelligence & forecasting center.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-150 px-3.5 py-1.5 rounded-xl shadow-xs">
          <Activity className="h-4 w-4 text-emerald-600 animate-spin" />
          <span className="text-[11px] font-bold text-gray-600 uppercase">Live Model State: ACTIVE</span>
        </div>
      </div>

      {/* Accuracy KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Document AI Accuracy</span>
            <h4 className="text-2xl font-extrabold text-gray-800">98.4%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Model v5.0 Active
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Cpu className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Image Verification Accuracy</span>
            <h4 className="text-2xl font-extrabold text-gray-800">96.8%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Forensics Enabled
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fraud Detection Accuracy</span>
            <h4 className="text-2xl font-extrabold text-gray-800">99.2%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Deepfake filter active
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Trust Gauge & Certification status */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
            Trust & Rankings
          </h3>
          
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100">
            {/* Mock Gauge */}
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="351.8"
                  strokeDashoffset={351.8 - (351.8 * currentTenant.trustScore) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-800">{currentTenant.trustScore}%</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Trust Score</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium text-center mt-4 max-w-[200px]">
              AI trust metric computed by verifying raw data vs physical location sensors.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
              <span>National Sustainability Rank</span>
              <span className="text-emerald-700 font-extrabold">#4 in Category</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
              <span>Certification Status</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                {currentTenant.certificationStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Interactive Risk Prediction Graph / Simulated SVG Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Emission Reduction Forecast & Risk Prediction
            </h3>
            <div className="flex gap-2">
              <span className="text-[9px] px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded font-bold text-emerald-700 uppercase">
                Forecasted Carbon
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-gray-100 rounded font-bold text-gray-500 uppercase">
                Risk Probability
              </span>
            </div>
          </div>

          {/* Simple Custom SVG Chart */}
          <div className="h-64 relative flex flex-col justify-between">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-gray-100 h-0 w-full" />
              <div className="border-b border-gray-100 h-0 w-full" />
              <div className="border-b border-gray-100 h-0 w-full" />
              <div className="border-b border-gray-100 h-0 w-full" />
            </div>

            <svg className="w-full h-full z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Carbon reduction line */}
              <path
                d="M0,160 Q100,120 200,90 T400,40 T500,20"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              {/* Area under carbon reduction line */}
              <path
                d="M0,160 Q100,120 200,90 T400,40 T500,20 L500,200 L0,200 Z"
                fill="url(#gradient)"
                opacity="0.1"
              />
              {/* Risk prediction line */}
              <path
                d="M0,20 Q100,45 200,60 T400,140 T500,180"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase pt-2">
              <span>Q1 2026</span>
              <span>Q2 2026</span>
              <span>Q3 2026</span>
              <span>Q4 2026</span>
              <span>2027 (Forecast)</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Predicted Carbon Saving (by 2027):</span>
            <span className="font-extrabold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="h-4.5 w-4.5" /> +28% over Baseline
            </span>
          </div>
        </div>

      </div>

      {/* Global Sustainability Map Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <span>Global Factory Sustainability & Risk Map</span>
        </h3>

        <div className="bg-gradient-to-br from-emerald-50/20 to-emerald-100/10 border border-emerald-100 rounded-xl h-64 flex items-center justify-center relative overflow-hidden group">
          {/* Mock Map visualization */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="z-10 flex flex-wrap gap-8 justify-center p-6">
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-100 flex items-center gap-3 shadow-xs">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h5 className="text-xs font-bold text-gray-700">Chennai Plant (HQ)</h5>
                <p className="text-[10px] text-emerald-700 font-semibold">Trust: 98% • Low Risk</p>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-100 flex items-center gap-3 shadow-xs">
              <div className="h-3.5 w-3.5 rounded-full bg-yellow-500 animate-ping" />
              <div>
                <h5 className="text-xs font-bold text-gray-700">Hosur Assembly</h5>
                <p className="text-[10px] text-yellow-700 font-semibold">Trust: 89% • Mid Risk</p>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-100 flex items-center gap-3 shadow-xs">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h5 className="text-xs font-bold text-gray-700">Mysuru Solar Yard</h5>
                <p className="text-[10px] text-emerald-700 font-semibold">Trust: 97% • Low Risk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
