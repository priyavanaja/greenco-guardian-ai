import React from 'react';
import { 
  Building, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Database, 
  ChevronRight, 
  Activity, 
  Calendar 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const CompanyIntelligence: React.FC = () => {
  const { selectedTenantId, tenants } = usePlatformStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 3</span>
          <h1 className="text-2xl font-black text-gray-800">Company Intelligence Node</h1>
          <p className="text-xs text-gray-400 font-medium">Enterprise sustainability profile, assets, and historical records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Company Profile Identity */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
            <div className="h-14 w-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {currentTenant.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800">{currentTenant.name}</h2>
              <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Verified Corporate Entity</span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold text-gray-500 uppercase">
            <div className="flex justify-between items-center">
              <span>Corporate ID</span>
              <span className="text-gray-800 font-bold">L34101TN1978PLC007587</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Primary Sector</span>
              <span className="text-gray-800 font-bold">Automotive & Engineering</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Primary Representative</span>
              <span className="text-gray-800 font-bold">Nagaraj Swamy (VP Sustainability)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Trust Index score</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100">
                {currentTenant.trustScore}% Verified
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">IoT Connectivity</span>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>42 Sensors Syncing Active</span>
            </div>
          </div>
        </div>

        {/* Right Section: Assets & Locations / History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Factory Locations List */}
          <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <span>Registered Production Facilities</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-150 rounded-xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800">Chennai Plant Yard</h4>
                  <p className="text-[10px] text-gray-400 font-medium">IoT Telemetry Node #102 • Active</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="p-4 border border-gray-150 rounded-xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800">Mysuru Solar Array</h4>
                  <p className="text-[10px] text-gray-400 font-medium">IoT Telemetry Node #105 • Active</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="p-4 border border-gray-150 rounded-xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800">Hosur Assembly Grid</h4>
                  <p className="text-[10px] text-gray-400 font-medium">IoT Telemetry Node #109 • Active</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="p-4 border border-gray-150 rounded-xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800">Bengaluru Warehouse D</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Sensor Feed Pending Setup</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Historical Certifications */}
          <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>GreenCo Certification Ledger Timeline</span>
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold border border-emerald-100 text-xs">
                  26
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Annual Audit Completed</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase font-bold">
                      {currentTenant.certificationStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Verified by GreenCo Assessor Sarah Jenkins. Trust engine verified 4 validation points.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center flex-shrink-0 font-bold border border-gray-200 text-xs">
                  25
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Silver Certificate Issued</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-gray-150 text-gray-700 uppercase font-bold">
                      Silver
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Sustainability rating recorded at 76%. Water recycle capacity deficiencies noted.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
