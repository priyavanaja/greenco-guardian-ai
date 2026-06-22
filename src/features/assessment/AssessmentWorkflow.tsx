import React, { useState } from 'react';
import { 
  GitMerge, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  AlertTriangle 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface WorkflowStage {
  id: number;
  label: string;
  desc: string;
  status: 'Completed' | 'Active' | 'Pending';
  checkpoint: string;
}

export const AssessmentWorkflow: React.FC = () => {
  const { addAuditLog, activeRole } = usePlatformStore();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(5); // Default at site audit stage

  const stages: WorkflowStage[] = [
    { id: 0, label: 'Registration', desc: 'Corporate details verification', status: currentStageIndex > 0 ? 'Completed' : 'Active', checkpoint: 'Tax, Corporate Registrations checked' },
    { id: 1, label: 'Data Collection', desc: 'Telemetry configuration & upload', status: currentStageIndex > 1 ? 'Completed' : currentStageIndex === 1 ? 'Active' : 'Pending', checkpoint: 'Meters syncing' },
    { id: 2, label: 'AI Validation', desc: 'Authenticity & EXIF tests', status: currentStageIndex > 2 ? 'Completed' : currentStageIndex === 2 ? 'Active' : 'Pending', checkpoint: 'Forensic overlay checks' },
    { id: 3, label: 'Risk Assessment', desc: 'Risk matrix and geofences checked', status: currentStageIndex > 3 ? 'Completed' : currentStageIndex === 3 ? 'Active' : 'Pending', checkpoint: 'Mismatches scanned' },
    { id: 4, label: 'Site Audit', desc: 'Assessor physical or camera verification', status: currentStageIndex > 4 ? 'Completed' : currentStageIndex === 4 ? 'Active' : 'Pending', checkpoint: 'GPS Proof of Presence' },
    { id: 5, label: 'Scoring', desc: 'Weighting environmental factors', status: currentStageIndex > 5 ? 'Completed' : currentStageIndex === 5 ? 'Active' : 'Pending', checkpoint: 'Benchmark comparisons' },
    { id: 6, label: 'Human Approval', desc: 'GreenCo auditor review signoff', status: currentStageIndex > 6 ? 'Completed' : currentStageIndex === 6 ? 'Active' : 'Pending', checkpoint: 'Manual review override' },
    { id: 7, label: 'Certification', desc: 'Issue verifiable QR credentials', status: currentStageIndex === 7 ? 'Completed' : 'Pending', checkpoint: 'Blockchain anchor registered' }
  ];

  const handleNextStage = () => {
    if (currentStageIndex < 7) {
      setCurrentStageIndex(currentStageIndex + 1);
      addAuditLog({
        user: activeRole,
        action: 'Workflow Advanced',
        details: `Assessment workflow advanced to stage: ${stages[currentStageIndex + 1].label}`,
        reason: 'Authorized process progression.',
        category: 'Score'
      });
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
      addAuditLog({
        user: activeRole,
        action: 'Workflow Reverted',
        details: `Assessment workflow rolled back to stage: ${stages[currentStageIndex - 1].label}`,
        reason: 'Required review trigger.',
        category: 'Score'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 9</span>
          <h1 className="text-2xl font-black text-gray-800">Smart Assessment Workflow Engine</h1>
          <p className="text-xs text-gray-400 font-medium">Verify credentials from registration up to final blockchain certificate issuance.</p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevStage}
            disabled={currentStageIndex === 0}
            className="px-3.5 py-1.5 bg-white border border-gray-150 hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            Back Step
          </button>
          <button
            onClick={handleNextStage}
            disabled={currentStageIndex === 7}
            className="px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-xs font-semibold rounded-lg shadow-sm shadow-emerald-200 transition-all flex items-center gap-1"
          >
            <span>Next Stage</span> <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workflow Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center Columns: Timeline list */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-emerald-600" />
            <span>Smart Certification Progress</span>
          </h3>

          <div className="space-y-4">
            {stages.map((stage) => {
              const isActive = stage.id === currentStageIndex;
              const isCompleted = stage.id < currentStageIndex;
              const isLast = stage.id === 7;
              
              return (
                <div 
                  key={stage.id} 
                  className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    isActive 
                      ? 'border-emerald-600 bg-emerald-50/20 shadow-xs' 
                      : 'border-gray-150 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : isActive ? (
                      <span className="h-5 w-5 rounded-full border-4 border-emerald-600 bg-white animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                    {!isLast && <div className="h-8 w-0.5 bg-gray-200 mt-2" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-800">{stage.label}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        isCompleted ? 'bg-emerald-50 text-emerald-800' : isActive ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">{stage.desc}</p>
                    {isActive && (
                      <div className="text-[10px] text-emerald-800 font-semibold mt-1 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-block">
                        AI Checkpoint: {stage.checkpoint}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Workflows Explanation */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            <span>AI Smart Audit Summary</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Current Active Stage</span>
              <h4 className="text-xs font-bold text-gray-700">{stages[currentStageIndex].label}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                The platform is verifying data points under {stages[currentStageIndex].label}. Camera audit GPS captures are being cross-matched with database anchors.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
                <span>AI Recommendation</span>
              </h4>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                Ensure all telemetry nodes are synced and active before advancing to human approval stage to avoid scoring lock.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
