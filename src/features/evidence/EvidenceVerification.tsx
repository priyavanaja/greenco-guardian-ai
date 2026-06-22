import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Check, 
  X, 
  AlertTriangle, 
  Bot, 
  MapPin, 
  Clock, 
  HardDrive 
} from 'lucide-react';
import { usePlatformStore, EvidenceItem } from '../../store/usePlatformStore';

export const EvidenceVerification: React.FC = () => {
  const { evidenceList, updateEvidenceStatus, addEvidence, activeRole } = usePlatformStore();
  const [selectedItem, setSelectedItem] = useState<EvidenceItem>(evidenceList[0]);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const canApprove = activeRole === 'GreenCo Assessor' || activeRole === 'AI Compliance Officer' || activeRole === 'Certification Administrator';
  const canUpload = activeRole !== 'Executive Viewer';

  const handleSelectItem = (item: EvidenceItem) => {
    setSelectedItem(item);
  };

  const handleApprove = (id: string) => {
    if (!canApprove) return;
    updateEvidenceStatus(id, 'Approved');
    const updated = usePlatformStore.getState().evidenceList.find(e => e.id === id);
    if (updated) setSelectedItem(updated);
  };

  const handleReject = (id: string) => {
    if (!canApprove) return;
    updateEvidenceStatus(id, 'Rejected');
    const updated = usePlatformStore.getState().evidenceList.find(e => e.id === id);
    if (updated) setSelectedItem(updated);
  };

  // Mock upload logic
  const handleMockUpload = () => {
    if (!canUpload) return;
    const names = ['utility_bill_june.pdf', 'factory_compost_photo.jpg', 'sensor_reading_discharge.csv'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const isImage = selectedName.endsWith('.jpg');
    const isPdf = selectedName.endsWith('.pdf');

    addEvidence({
      name: selectedName,
      type: isImage ? 'image' : isPdf ? 'pdf' : 'sensor',
      uploadedBy: activeRole + ' (Simulated)',
      size: '2.1 MB',
      authenticityScore: Math.floor(Math.random() * 40) + 60, // 60 to 99
      aiGeneratedProb: Math.floor(Math.random() * 20), // 0 to 20
      manipulationRisk: Math.floor(Math.random() * 30), // 0 to 30
      locationMatched: true,
      gps: '12.9716° N, 79.1588° E (Chennai HQ)',
      timestamp: '2026-06-22 22:05:00',
      deviceFingerprint: 'DEV_MOCK_MOBILE_SYNC',
      ocrContent: 'Detected invoice metadata, billing cycle matches Q2 reporting guidelines.'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Rejected':
        return 'bg-red-50 text-red-800 border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-100';
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 5</span>
          <h1 className="text-2xl font-black text-gray-800">AI Digital Evidence Workspace</h1>
          <p className="text-xs text-gray-400 font-medium">Verify documents, raw bills, sensor feeds, and digital hashes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Evidence upload zone & list */}
        <div className="space-y-6 lg:col-span-1">
          {/* Upload card */}
          <div 
            onClick={handleMockUpload}
            className="border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 bg-white"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <h4 className="text-xs font-bold text-gray-700">Submit New Evidence</h4>
            <p className="text-[10px] text-gray-400 font-medium">Drag PDFs, photos, sensor CSVs here or click to simulate upload</p>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Recent Submissions
            </h3>
            
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {evidenceList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    selectedItem?.id === item.id 
                      ? 'border-emerald-600 bg-emerald-50/20 shadow-xs' 
                      : 'border-gray-150 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-bold text-gray-700 truncate">{item.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                      <span>{item.size}</span>
                      <span>{item.uploadedAt.split(' ')[1]}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Verification details & OCR */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItem ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <span>{selectedItem.name}</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Uploaded by {selectedItem.uploadedBy} on {selectedItem.uploadedAt}
                  </p>
                </div>

                <div className="flex gap-2">
                  {selectedItem.status === 'Pending' ? (
                    canApprove ? (
                      <>
                        <button 
                          onClick={() => handleApprove(selectedItem.id)}
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </button>
                        <button 
                          onClick={() => handleReject(selectedItem.id)}
                          className="h-8 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg font-bold uppercase flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Assessor Verification Required
                      </span>
                    )
                  ) : (
                    <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(selectedItem.status)}`}>
                      Verification State: {selectedItem.status}
                    </span>
                  )}
                </div>

              </div>

              {/* Grid: AI Analysis Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4.5 w-4.5 text-emerald-600" />
                    <span className="text-lg font-black text-gray-800">{selectedItem.authenticityScore}%</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">GPS Metadata Status</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">
                      {selectedItem.locationMatched ? 'Match Verified' : 'EXIF Mismatch'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Device Signature</span>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4.5 w-4.5 text-emerald-600" />
                    <span className="text-[10px] font-bold text-gray-700 truncate">{selectedItem.deviceFingerprint}</span>
                  </div>
                </div>
              </div>

              {/* OCR content */}
              <div className="space-y-2">
                <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 pb-1">
                  AI Text / Document Extraction (OCR)
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs text-gray-600 leading-relaxed border border-gray-200">
                  {selectedItem.ocrContent || 'Processing OCR extraction modules...'}
                </div>
              </div>

              {/* Warnings / Alerts */}
              {selectedItem.forensicAlerts && selectedItem.forensicAlerts.length > 0 && (
                <div className="p-4 bg-red-50/50 border border-red-150 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Forensic Warnings</span>
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-red-700 font-medium space-y-1">
                    {selectedItem.forensicAlerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center space-y-2">
              <Clock className="h-12 w-12 text-gray-300" />
              <h3 className="text-sm font-bold text-gray-700">No Evidence Selected</h3>
              <p className="text-xs text-gray-400">Select a file from the list to begin audit checks.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
