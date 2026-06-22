import React, { useState } from 'react';
import { 
  ClipboardList, 
  QrCode, 
  ShieldCheck, 
  Calendar, 
  ExternalLink,
  History,
  Activity
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const CertificatesView: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  const blockchainStages = [
    { label: 'Certificate Created', time: '2026-06-22 10:00', details: 'Initialized metadata payload' },
    { label: 'AI Verified', time: '2026-06-22 10:15', details: 'Authenticity & sensor telemetry check passed' },
    { label: 'Assessor Approved', time: '2026-06-22 12:42', details: 'Physical confirmation signed by Sarah Jenkins' },
    { label: 'Issued', time: '2026-06-22 13:00', details: 'Anchored on Polygon public hash address' },
    { label: 'Renewed', time: 'Pending Renewal', details: 'Annual evaluation scheduled' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 14</span>
          <h1 className="text-2xl font-black text-gray-800">Secure Certificate Trust System</h1>
          <p className="text-xs text-gray-400 font-medium">Verify credentials signatures, audit hashes, and public ledger anchors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Certificate Display */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div className="border-4 border-emerald-600/30 p-8 rounded-xl bg-gradient-to-br from-emerald-50/20 to-transparent space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5 -translate-y-10 translate-x-10 scale-125">
              <ShieldCheck className="h-64 w-64" />
            </div>

            <div className="flex justify-between items-start border-b border-emerald-600/10 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Verifiable Environmental Credential</span>
                <h3 className="text-xl font-extrabold text-gray-800">GreenCo Guardian AI Certificate</h3>
              </div>
              <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                G
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase">Certified Corporate Entity</span>
                <h4 className="text-lg font-black text-gray-800">{currentTenant.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Assigned Rating</span>
                  <p className="text-sm font-extrabold text-emerald-800 uppercase">{currentTenant.certificationStatus}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Verification Score</span>
                  <p className="text-sm font-extrabold text-emerald-800">{currentTenant.sustainabilityScore}/100</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Date of Issuance</span>
                  <p className="text-xs font-bold text-gray-700">June 22, 2026</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Verifiable ID</span>
                  <p className="text-xs font-mono font-bold text-gray-500">GRN-2026-TVS9883</p>
                </div>
              </div>
            </div>

            <div className="border-t border-emerald-600/10 pt-4 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase font-mono">
              <span>Anchor: 0x4b78...E45</span>
              <button 
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-150 px-2.5 py-1 rounded transition-colors"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Verify QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Timeline */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-600" />
            <span>Verification Ledger Trail</span>
          </h3>

          <div className="space-y-4">
            {blockchainStages.map((s, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center w-full gap-4">
                    <h5 className="text-xs font-bold text-gray-800">{s.label}</h5>
                    <span className="text-[9px] text-gray-400 font-bold">{s.time.split(' ')[1] || s.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">{s.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QR MODAL SIMULATOR */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 p-8 max-w-sm w-full space-y-6 text-center shadow-2xl relative animate-scale-in">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
              Verifiable QR Credentials
            </h3>
            
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl max-w-[200px] mx-auto">
              <QrCode className="h-32 w-32 text-slate-800" />
            </div>

            <div className="space-y-3 text-xs font-semibold text-gray-500 uppercase">
              <div className="flex justify-between">
                <span>Certificate Status</span>
                <span className="text-emerald-700 font-extrabold">✓ Verified Active</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Score</span>
                <span className="text-gray-800 font-extrabold">{currentTenant.sustainabilityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Issuer Signature</span>
                <span className="text-gray-800 font-extrabold">GreenCo India Ltd</span>
              </div>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-emerald-200"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
