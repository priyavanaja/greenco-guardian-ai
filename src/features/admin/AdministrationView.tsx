import React from 'react';
import { 
  Settings, 
  Users, 
  Database, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  Cpu 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const AdministrationView: React.FC = () => {
  const { resetTenantData, addAuditLog, activeRole } = usePlatformStore();

  const handleReset = () => {
    resetTenantData();
    addAuditLog({
      user: activeRole,
      action: 'Platform Database Reset',
      details: 'Restored platform mock telemetry state and notifications to initial values.',
      reason: 'Administrative cleanup action.',
      category: 'User'
    });
    alert('System Database reset completed. All mock data restored.');
  };

  const usersList = [
    { name: 'Sarah Jenkins', role: 'GreenCo Assessor', status: 'Active', scope: 'Chennai/Mysuru' },
    { name: 'Nagaraj Swamy', role: 'Company Sustainability Manager', status: 'Active', scope: 'TVS Motors' },
    { name: 'Ramesh Patel', role: 'Certification Administrator', status: 'Active', scope: 'Global' }
  ];

  const isAdmin = activeRole === 'Certification Administrator';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 20</span>
          <h1 className="text-2xl font-black text-gray-800">Administration & Operations Node</h1>
          <p className="text-xs text-gray-400 font-medium">Configure user permissions, smart integrations, and clean databases.</p>
        </div>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Users & Permission matrices */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Active Accreditations</span>
            </h3>

            <div className="space-y-4">
              {usersList.map((user, idx) => (
                <div key={idx} className="p-4 border border-gray-150 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-855">{user.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Role: {user.role} • Scope: {user.scope}</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-855 font-bold border border-emerald-100 uppercase">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Database Maintenance & Integrations */}
          <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-600" />
              <span>Operational Controls</span>
            </h3>

            <div className="space-y-4">
              {/* Blockchain Settings info */}
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Verifiable Credentials Contract</span>
                <p className="text-xs font-mono font-bold text-gray-700">0x288C...E109 (v1.2)</p>
              </div>

              {/* Reset Database Button */}
              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-gray-50 hover:bg-red-50 text-gray-755 hover:text-red-700 border border-gray-250 hover:border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Platform State</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-800">Administrative Access Required</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your current simulated role is <span className="font-extrabold text-emerald-700">{activeRole}</span>. This module is restricted to <span className="font-extrabold text-emerald-700">Certification Administrator</span> to protect active system parameters.
            </p>
          </div>
          <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl text-[10px] text-amber-700 font-bold uppercase">
            Toggle "Role Simulator" dropdown in navbar to "Administrator" to test.
          </div>
        </div>
      )}
    </div>
  );

};
