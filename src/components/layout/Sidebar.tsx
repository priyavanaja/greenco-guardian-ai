import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Building2, 
  Layers, 
  FileCheck, 
  ShieldCheck, 
  Eye, 
  AlertTriangle, 
  GitMerge, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Sliders, 
  FileText, 
  ClipboardList, 
  Leaf, 
  ShieldAlert, 
  Lock, 
  Bell, 
  Settings 
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', name: '1 Overview', icon: LayoutDashboard },
  { id: 'command-center', name: '2 AI Command Center', icon: Cpu },
  { id: 'company-intelligence', name: '3 Company Intelligence', icon: Building2 },
  { id: 'digital-twin', name: '4 Digital Twin', icon: Layers },
  { id: 'evidence-verification', name: '5 Evidence Verification', icon: FileCheck },
  { id: 'evidence-trust', name: '6 Evidence Trust Engine', icon: ShieldCheck },
  { id: 'fraud-intelligence', name: '7 Fraud Intelligence', icon: Eye },
  { id: 'risk-center', name: '8 AI Risk Center', icon: AlertTriangle },
  { id: 'assessment-workflow', name: '9 Assessment Workflow', icon: GitMerge },
  { id: 'scoring-engine', name: '10 Scoring Engine', icon: Award },
  { id: 'copilot', name: '11 AI Copilot', icon: MessageSquare },
  { id: 'predictive-analytics', name: '12 Predictive Analytics', icon: TrendingUp },
  { id: 'control-room', name: '13 Sustainability Control Room', icon: Sliders },
  { id: 'certificates', name: '14 Certificates', icon: ClipboardList },
  { id: 'reports', name: '15 Reports', icon: FileText },
  { id: 'net-zero', name: '16 Net Zero Intelligence', icon: Leaf },
  { id: 'governance', name: '17 AI Governance Center', icon: ShieldAlert },
  { id: 'security', name: '18 Security Center', icon: Lock },
  { id: 'notifications', name: '19 Notification Center', icon: Bell },
  { id: 'administration', name: '20 Administration', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, activeRole } = usePlatformStore();

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto sticky top-0 shadow-sm z-20">
      <div className="p-6 border-b border-gray-100 flex flex-col gap-1 bg-gradient-to-br from-emerald-50/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-200">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">
            GreenCo <span className="text-emerald-600">Guardian AI</span>
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-1">
          Sustainability Certification
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border-l-4 border-emerald-600 pl-3' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive ? 'text-emerald-600 scale-110' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/70">
        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-150 shadow-xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Active Workspace
          </span>
          <span className="text-xs font-semibold text-gray-700 truncate">
            {activeRole}
          </span>
          <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-4/5 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
};
