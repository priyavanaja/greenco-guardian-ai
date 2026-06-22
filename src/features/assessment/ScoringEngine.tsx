import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  SlidersHorizontal,
  Info 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const ScoringEngine: React.FC = () => {
  const { selectedTenantId, tenants, activeRole } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const canAdjust = activeRole === 'GreenCo Assessor' || activeRole === 'Certification Administrator';

  // User can adjust sub-scores to see dynamic overall calculation
  const [energyScore, setEnergyScore] = useState<number>(85);
  const [waterScore, setWaterScore] = useState<number>(72);
  const [wasteScore, setWasteScore] = useState<number>(91);
  const [carbonScore, setCarbonScore] = useState<number>(88);
  const [resourceScore, setResourceScore] = useState<number>(84);

  // Calculate weighted overall score
  const overallScore = Math.floor(
    (energyScore * 0.3) + 
    (waterScore * 0.2) + 
    (wasteScore * 0.2) + 
    (carbonScore * 0.2) + 
    (resourceScore * 0.1)
  );

  const getRating = (score: number) => {
    if (score >= 90) return { label: 'Platinum', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'Gold', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    if (score >= 70) return { label: 'Silver', color: 'text-gray-700 bg-gray-50 border-gray-200' };
    return { label: 'Bronze', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  const currentRating = getRating(overallScore);
  const predictionRating = getRating(overallScore + 6); // Predict progress of +6 points in 12 months

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 10</span>
          <h1 className="text-2xl font-black text-gray-800">Advanced AI Scoring Engine</h1>
          <p className="text-xs text-gray-400 font-medium">Verify metrics weights, benchmark comparisons, and future predicted levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Interactive score sliders */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
              <span>Interactive Score Adjustments (Live Simulator)</span>
            </div>
            {!canAdjust && (
              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
                Read-Only (Assessor Locked)
              </span>
            )}
          </h3>

          <div className="space-y-5">
            {/* Slider 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Energy Efficiency (Weight: 30%)</span>
                <span>{energyScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={energyScore}
                disabled={!canAdjust}
                onChange={(e) => setEnergyScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Water Management (Weight: 20%)</span>
                <span>{waterScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={waterScore}
                disabled={!canAdjust}
                onChange={(e) => setWaterScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Waste Management (Weight: 20%)</span>
                <span>{wasteScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={wasteScore}
                disabled={!canAdjust}
                onChange={(e) => setWasteScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Carbon Performance (Weight: 20%)</span>
                <span>{carbonScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={carbonScore}
                disabled={!canAdjust}
                onChange={(e) => setCarbonScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50"
              />
            </div>

            {/* Slider 5 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Resource Optimization (Weight: 10%)</span>
                <span>{resourceScore}/100</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={resourceScore}
                disabled={!canAdjust}
                onChange={(e) => setResourceScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-50"
              />
            </div>
          </div>
        </div>


        {/* Right Column: Score calculations & predictions */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <span>AI Rating Forecast</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Computed Overall Score</span>
              <p className="text-3xl font-black text-gray-800">{overallScore}/100</p>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase">
              <span>Current Level</span>
              <span className={`px-2.5 py-0.5 rounded border font-extrabold ${currentRating.color}`}>
                {currentRating.label}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 pb-4">
              <span>AI Predicted Rating (12mo)</span>
              <span className={`px-2.5 py-0.5 rounded border font-extrabold ${predictionRating.color}`}>
                {predictionRating.label}
              </span>
            </div>

            {/* Benchmarking data */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Industrial Benchmarks
              </h4>
              <div className="space-y-2 text-xs font-semibold text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sector Average</span>
                  <span>78/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platinum Baseline</span>
                  <span>90/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
              <span>AI Recommendation</span>
            </h4>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              {waterScore < 80 
                ? 'Improve Water recycling score by 12 points to reach Platinum rating immediately.' 
                : 'Current overall rating is on track for Platinum renewal next quarter. Maintain sensor reporting.'
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
