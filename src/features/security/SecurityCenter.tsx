import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  Terminal, 
  MapPin 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const SecurityCenter: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 18</span>
          <h1 className="text-2xl font-black text-gray-800">Zero Trust Security Command Center</h1>
          <p className="text-xs text-gray-400 font-medium">Verify login hardware fingerprints, session variables, and telemetry integrity.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Security Score</span>
            <h4 className="text-2xl font-extrabold text-gray-850">98%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold">✓ Secure Anchor State</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Threat Severity Index</span>
            <h4 className={`text-2xl font-extrabold ${currentTenant.riskLevel === 'Critical' ? 'text-red-600' : 'text-gray-800'}`}>
              {currentTenant.riskLevel === 'Critical' ? 'HIGH' : 'LOW'}
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold">Real-time scan</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Device Fingerprint trust</span>
            <h4 className="text-2xl font-extrabold text-gray-850">98.2%</h4>
            <p className="text-[10px] text-emerald-600 font-semibold">Identities verified</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
            <Smartphone className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Fingerprint parameters */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-600" />
            <span>Assessor Device Integrity Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Device Identity</span>
              <p className="text-xs font-bold text-gray-800">✓ Verified Secure (DEV_MOCK_MOBILE)</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Browser Fingerprint</span>
              <p className="text-xs font-bold text-gray-800">✓ Consistent SHA-256 canvas hash</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Location Geofence</span>
              <p className="text-xs font-bold text-gray-800">✓ Active Geolocation matched</p>
            </div>
            <div className="p-4 border border-gray-150 rounded-xl space-y-1 bg-slate-50/50">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Session Hijack Shield</span>
              <p className="text-xs font-bold text-gray-800">✓ Tokens matched (Secure Session)</p>
            </div>
          </div>
        </div>

        {/* Right Column: Security Audits */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-600" />
            <span>Login Audit Log</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-start font-medium border-b border-gray-100 pb-2">
              <div className="space-y-0.5">
                <p className="font-bold text-gray-700">Sarah Jenkins (Assessor)</p>
                <p className="text-[10px] text-gray-400">DEV_TERM_02 • Chennai</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">✓ Active</span>
            </div>

            <div className="flex justify-between items-start font-medium border-b border-gray-100 pb-2">
              <div className="space-y-0.5">
                <p className="font-bold text-gray-700">Nagaraj Swamy (Manager)</p>
                <p className="text-[10px] text-gray-400">DEV_WEB_WIN_11 • Chennai</p>
              </div>
              <span className="text-[10px] text-gray-450">2 hrs ago</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
