import React from 'react';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  User, 
  Building, 
  Bot, 
  Moon 
} from 'lucide-react';
import { usePlatformStore, UserRole } from '../../store/usePlatformStore';

export const Navbar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    selectedTenantId, 
    setSelectedTenantId, 
    tenants, 
    notifications,
    setCurrentTab
  } = usePlatformStore();

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const unresolvedCount = notifications.filter(n => !n.resolved).length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveRole(e.target.value as UserRole);
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTenantId(e.target.value);
  };

  // Threat level colors
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Search & Switcher */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search credentials, audits, telemetry..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-250 rounded-lg text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Tenant Switcher */}
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-emerald-600" />
          <select
            value={selectedTenantId}
            onChange={handleTenantChange}
            className="bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-700 py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Tenant Risk Status indicator */}
        <div className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold tracking-wide uppercase ${getRiskColor(currentTenant.riskLevel)}`}>
          Risk: {currentTenant.riskLevel}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 border-r border-gray-150 pr-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Role Simulator:</span>
          <select
            value={activeRole}
            onChange={handleRoleChange}
            className="bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-emerald-800 py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Company Sustainability Manager">Sustainability Manager</option>
            <option value="GreenCo Assessor">GreenCo Assessor</option>
            <option value="AI Compliance Officer">Compliance Officer</option>
            <option value="Certification Administrator">Administrator</option>
            <option value="Executive Viewer">Executive Viewer</option>
          </select>
        </div>

        {/* Copilot button */}
        <button
          onClick={() => setCurrentTab('copilot')}
          className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-150 transition-all duration-200"
        >
          <Bot className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
          <span>AI Copilot</span>
        </button>

        {/* System Threats Alert */}
        <button 
          onClick={() => setCurrentTab('security')}
          className="relative p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ShieldAlert className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setCurrentTab('notifications')}
          className="relative p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-full transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unresolvedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[8px] flex items-center justify-center animate-pulse">
              {unresolvedCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 border-l border-gray-150 pl-4">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold border border-emerald-200">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 leading-tight">Sarah Jenkins</span>
            <span className="text-[10px] text-gray-400 font-medium leading-none">{currentTenant.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
