import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Smartphone, 
  UserCheck, 
  ShieldCheck, 
  RotateCw, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const LiveCameraAudit: React.FC = () => {
  const { addEvidence, activeRole } = usePlatformStore();
  const [capturing, setCapturing] = useState<boolean>(false);
  const [capturedData, setCapturedData] = useState<any>(null);

  const handleCapture = () => {
    setCapturing(true);
    setCapturedData(null);
    
    setTimeout(() => {
      setCapturing(false);
      const randomToken = Math.random().toString(36).substring(2, 10).toUpperCase();
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      setCapturedData({
        gps: '12.9716° N, 79.1588° E (TVS Motors Chennai HQ)',
        timestamp,
        deviceId: 'DEV_MOTOROLA_EDGE_G99',
        assessor: 'Sarah Jenkins',
        token: `GRN-SEC-${randomToken}`,
        accuracy: '± 2.4 meters'
      });

      // Automatically add capture to evidence store
      addEvidence({
        name: `audit_capture_${randomToken.toLowerCase()}.jpg`,
        type: 'image',
        uploadedBy: 'Sarah Jenkins (Assessor)',
        size: '1.2 MB',
        authenticityScore: 99,
        aiGeneratedProb: 0,
        manipulationRisk: 0,
        locationMatched: true,
        gps: '12.9716° N, 79.1588° E (TVS Motors Chennai HQ)',
        timestamp,
        deviceFingerprint: 'DEV_MOTOROLA_EDGE_G99',
        ocrContent: 'Live Audit Telemetry. Decoded Token: ' + randomToken
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 5 Upgrade</span>
          <h1 className="text-2xl font-black text-gray-800">Live Camera Audit & Proof of Presence</h1>
          <p className="text-xs text-gray-400 font-medium">Assessor field verification module locking GPS, timestamp, and device state.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Mock Camera Viewfinder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex flex-col items-center">
          <div className="relative w-full max-w-[400px] aspect-[3/4] bg-slate-900 rounded-3xl border-8 border-gray-800 overflow-hidden flex flex-col justify-between p-6 shadow-xl">
            {/* Camera grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
              <div className="border border-white/40" />
            </div>

            {/* Viewfinder indicators */}
            <div className="flex justify-between items-center z-10 text-[9px] text-white font-bold tracking-widest uppercase">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                <span>REC LIVE</span>
              </div>
              <span>HDR AUTO</span>
            </div>

            {/* Center target cursor */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="h-10 w-10 border-2 border-dashed border-white rounded-full" />
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col items-center gap-4 z-10 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-xl">
              <div className="flex justify-between items-center w-full text-[9px] text-emerald-300 font-bold">
                <span>GPS: ACTIVE</span>
                <span>DEVICE: MATCHED</span>
              </div>

              {activeRole === 'GreenCo Assessor' ? (
                <button
                  onClick={handleCapture}
                  disabled={capturing}
                  className="h-14 w-14 rounded-full border-4 border-white bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  {capturing ? (
                    <RotateCw className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
              ) : (
                <div className="text-[10px] text-yellow-300 font-bold text-center bg-yellow-900/40 p-2 rounded-lg border border-yellow-800/40 w-full">
                  Audit capture restricted to accredited GreenCo Assessor.
                </div>
              )}
            </div>

          </div>
          
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-wider">
            Device Gallery Uploads Disabled • Camera Capture Mode Only
          </span>
        </div>

        {/* Right: Verification Status & Token */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Proof of Presence Registry</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase">
              <MapPin className="h-4.5 w-4.5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-gray-400">Location Status</span>
                <span className="text-gray-800 font-extrabold mt-0.5">
                  {capturedData ? '✓ Geofence Verified' : 'Awaiting Geolocation...'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase">
              <Clock className="h-4.5 w-4.5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-gray-400">Timestamp Status</span>
                <span className="text-gray-800 font-extrabold mt-0.5">
                  {capturedData ? '✓ Real-time Verified' : 'Awaiting sync...'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase">
              <Smartphone className="h-4.5 w-4.5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-gray-400">Device Fingerprint</span>
                <span className="text-gray-800 font-extrabold mt-0.5">
                  {capturedData ? '✓ Device Authenticated' : 'Validating hardware...'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase">
              <UserCheck className="h-4.5 w-4.5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-gray-400">Assessor Profile</span>
                <span className="text-gray-800 font-extrabold mt-0.5">
                  {capturedData ? '✓ Sarah Jenkins' : 'Validating token...'}
                </span>
              </div>
            </div>
          </div>

          {capturedData && (
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl space-y-2 mt-6">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                Digital Verification Badge Issued
              </span>
              <div className="text-xs font-mono text-emerald-700 space-y-1">
                <div>Token: <span className="font-extrabold">{capturedData.token}</span></div>
                <div>Coordinates: <span className="font-extrabold">{capturedData.gps}</span></div>
                <div>Accuracy: <span className="font-extrabold">{capturedData.accuracy}</span></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
