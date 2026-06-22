import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Activity, 
  FileImage 
} from 'lucide-react';

interface MockPhoto {
  id: string;
  name: string;
  authenticity: number;
  aiProb: number;
  manipulationRisk: number;
  gpsMatch: boolean;
  mismatchReason?: string;
  heatmapColors: string; // Tailwind bg styles representing custom fake regions
}

const mockPhotos: MockPhoto[] = [
  {
    id: 'photo-1',
    name: 'solar_farm_east.png (Clean)',
    authenticity: 98,
    aiProb: 1,
    manipulationRisk: 1,
    gpsMatch: true,
    heatmapColors: 'border-emerald-500 bg-emerald-500/10'
  },
  {
    id: 'photo-2',
    name: 'waste_flow_inconsistent.jpg (FLAGGED)',
    authenticity: 45,
    aiProb: 88,
    manipulationRisk: 72,
    gpsMatch: false,
    mismatchReason: 'Modified EXIF headers; GPS location registered in San Francisco, CA instead of TVS Chennai Factory Yard.',
    heatmapColors: 'border-red-500 bg-red-500/25 ring-4 ring-red-300'
  },
  {
    id: 'photo-3',
    name: 'wind_turbines_facade.jpg (Clean)',
    authenticity: 97,
    aiProb: 2,
    manipulationRisk: 1,
    gpsMatch: true,
    heatmapColors: 'border-emerald-500 bg-emerald-500/10'
  }
];

export const FraudIntelligence: React.FC = () => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('photo-2');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  
  const photo = mockPhotos.find(p => p.id === selectedPhotoId) || mockPhotos[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 7</span>
          <h1 className="text-2xl font-black text-gray-800">AI Evidence Forensics System</h1>
          <p className="text-xs text-gray-400 font-medium">Deepfake screening, image manipulation overlays, and metadata scanning.</p>
        </div>

        {/* Photo Switcher */}
        <div className="flex items-center gap-2">
          <FileImage className="h-4.5 w-4.5 text-emerald-600" />
          <select
            value={selectedPhotoId}
            onChange={(e) => setSelectedPhotoId(e.target.value)}
            className="bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-700 py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {mockPhotos.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forensic Viewer Canvas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-emerald-600" />
              <span>Image Forensic Visualizer</span>
            </span>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-150 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}</span>
            </button>
          </div>

          {/* Interactive photo box representing photoshop bounding boxes */}
          <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-gray-800">
            {/* Mock original background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-900 opacity-80" />
            
            <div className="z-10 flex flex-col items-center justify-center text-white space-y-2 p-6 text-center">
              <FileImage className="h-12 w-12 text-slate-500" />
              <h5 className="text-sm font-bold truncate max-w-xs">{photo.name.split(' ')[0]}</h5>
              <p className="text-[10px] text-gray-400 font-medium">Original image channel data loaded</p>
            </div>

            {/* Bounding box manipulation overlay */}
            {showHeatmap && (
              <div className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed rounded-lg transition-all flex flex-col justify-between p-3 ${photo.heatmapColors}`}>
                <span className="text-[9px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded shadow-sm self-start">
                  {photo.aiProb > 50 ? 'AI GENERATED CHARACTERISTICS' : 'MANIPULATED PIXELS DETECTED'}
                </span>
                <span className="text-[8px] text-white/90 font-mono font-bold text-right self-end bg-black/60 px-1 py-0.2 rounded">
                  Prob: {Math.max(photo.aiProb, photo.manipulationRisk)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trust Analytics Dashboard */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>AI Forensic Analytics</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Evidence Trust Score</span>
              <p className="text-2xl font-black text-gray-800">{photo.authenticity}%</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                <span>AI Generated Risk</span>
                <span className={`font-extrabold ${photo.aiProb > 50 ? 'text-red-600' : 'text-gray-800'}`}>
                  {photo.aiProb}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                <span>Manipulation Risk</span>
                <span className={`font-extrabold ${photo.manipulationRisk > 50 ? 'text-red-600' : 'text-gray-800'}`}>
                  {photo.manipulationRisk}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
                <span>GPS Telemetry Status</span>
                <span className={`font-extrabold ${photo.gpsMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                  {photo.gpsMatch ? '✓ Verified Match' : 'Mismatched Geofence'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Explanation of Fraud Detection */}
          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2 mt-4">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Forensic Explainer</span>
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              {photo.gpsMatch 
                ? 'Metadata integrity verified. Image EXIF properties are aligned with the spatial bounds of the Chennai Yard facility.'
                : photo.mismatchReason
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
