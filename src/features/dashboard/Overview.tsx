import React from 'react';
import { 
  Shield, 
  Leaf, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const Overview: React.FC = () => {
  const { selectedTenantId, tenants, activeRole, auditLogs, notifications } = usePlatformStore();

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const activeUnresolvedAlerts = notifications.filter(n => !n.resolved);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-8 rounded-2xl shadow-lg border border-emerald-900 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-20 -translate-y-10 scale-150 pointer-events-none">
          <Leaf className="h-64 w-64 text-white" />
        </div>
        
        <div className="space-y-2 z-10">
          <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Enterprise Intelligence Node</span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            GreenCo Guardian <span className="text-emerald-400">AI Platform</span>
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl font-medium">
            AI-powered sustainability certification ecosystem verifying operations for {currentTenant.name}. Authenticity metrics, fraud screening, and net-zero targets fully synchronized.
          </p>
        </div>

        <div className="flex gap-4 z-10">
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 flex flex-col gap-1 min-w-[120px]">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">System Health</span>
            <span className="text-2xl font-extrabold flex items-center gap-1.5">
              <Activity className="h-5 w-5 text-emerald-400 animate-pulse" /> 99.8%
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 flex flex-col gap-1 min-w-[120px]">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Active Role</span>
            <span className="text-xs font-bold text-emerald-200 mt-1 truncate max-w-[130px]" title={activeRole}>
              {activeRole.split(' ')[0]} Manager
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Performance Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Organization Trust Score */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Organization Trust Score</span>
              <h3 className="text-3xl font-black text-gray-800">{currentTenant.trustScore}%</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Verified • Trusted Blockchain Anchor</span>
          </div>
        </div>

        {/* KPI 2: Certification Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GreenCo Certification</span>
              <h3 className="text-2xl font-black text-emerald-800">{currentTenant.certificationStatus.split(' ')[0]}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-4 font-medium truncate">
            Status: {currentTenant.certificationStatus}
          </span>
        </div>

        {/* KPI 3: Carbon Reduction */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carbon Reduction (Annual)</span>
              <h3 className="text-3xl font-black text-gray-800">{currentTenant.carbonReduction.toLocaleString()} T</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            <span>Targeting Net Zero {currentTenant.netZeroYear}</span>
          </div>
        </div>

        {/* KPI 4: Active Threat Flags */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Risk Level</span>
              <h3 className="text-3xl font-black text-gray-800">{currentTenant.riskLevel}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <span className="text-xs text-red-500 font-semibold mt-4">
            {activeUnresolvedAlerts.length} Unresolved System Alerts
          </span>
        </div>
      </div>

      {/* Main Grid: Telemetry & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Organization Summary & Quick Actions */}
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Tenant Summary</span>
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Total Energy Usage</span>
                <span className="text-gray-700 font-bold">{currentTenant.energyUsage.toLocaleString()} MWh</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Water Consumption</span>
                <span className="text-gray-700 font-bold">{currentTenant.waterUsage.toLocaleString()} KL</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Industrial Waste Gen</span>
                <span className="text-gray-700 font-bold">{currentTenant.wasteGen.toLocaleString()} Tons</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">Sustainability Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">{currentTenant.sustainabilityScore}/100</span>
                  <div className="h-2 w-12 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${currentTenant.sustainabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Audit Clearance: PASS</span>
            </h4>
            <p className="text-[11px] text-emerald-700 font-medium">
              GreenCo trust nodes verified and registered on decentralized ledger. No open security disputes active.
            </p>
          </div>
        </div>

        {/* Center/Right: Audit Trail & Real-time System Logs */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span>Live Audit Event Stream</span>
            </h3>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-500 uppercase tracking-wider">
              Real-time update
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5 hover:bg-gray-100/50 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-700">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] uppercase">
                      {log.category}
                    </span>
                    <span>{log.user}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                </div>
                <p className="text-xs font-medium text-gray-800">{log.action}</p>
                <div className="text-[11px] text-gray-500 font-medium">
                  {log.details}
                </div>
                {log.reason && (
                  <div className="text-[10px] text-emerald-700 font-semibold italic">
                    Reason: {log.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
