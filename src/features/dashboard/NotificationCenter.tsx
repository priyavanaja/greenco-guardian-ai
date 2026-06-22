import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  PlusCircle, 
  Filter, 
  Info, 
  AlertOctagon, 
  AlertTriangle 
} from 'lucide-react';
import { usePlatformStore, Notification } from '../../store/usePlatformStore';

export const NotificationCenter: React.FC = () => {
  const { notifications, resolveNotification, addNotification } = usePlatformStore();
  const [filterLevel, setFilterLevel] = useState<string>('All');
  
  const filteredNotifications = notifications.filter(n => {
    if (filterLevel === 'All') return true;
    return n.severity === filterLevel;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-800 border-red-200 icon-red';
      case 'High': return 'bg-orange-50 text-orange-800 border-orange-200 icon-orange';
      case 'Medium': return 'bg-yellow-50 text-yellow-800 border-yellow-200 icon-yellow';
      default: return 'bg-blue-50 text-blue-800 border-blue-200 icon-blue';
    }
  };

  const triggerMockAlert = (type: string) => {
    if (type === 'gps') {
      addNotification({
        title: 'Critical Geofence Breach',
        description: 'Assessor terminal ID DEV_TERM_99 reported audit capture 42km outside factory boundary.',
        severity: 'Critical',
        category: 'Evidence Trust'
      });
    } else if (type === 'energy') {
      addNotification({
        title: 'High Load Anomaly',
        description: 'Main production line energy draw exceeded safety threshold of 95 MWh.',
        severity: 'High',
        category: 'Sustainability Control Room'
      });
    } else {
      addNotification({
        title: 'New Certificate Renewal Pending',
        description: 'Annual carbon efficiency assessment scheduled for TVS Motors Chennai Facility.',
        severity: 'Low',
        category: 'Assessment Workflow'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Module 19</span>
          <h1 className="text-2xl font-black text-gray-800">Notification Intelligence Center</h1>
          <p className="text-xs text-gray-400 font-medium">Priority-based alert tracking and simulated notification triggers.</p>
        </div>

        {/* Simulators */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Simulate:</span>
          <button
            onClick={() => triggerMockAlert('gps')}
            className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg text-[10px] font-bold uppercase transition-all"
          >
            + GPS Alert
          </button>
          <button
            onClick={() => triggerMockAlert('energy')}
            className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 rounded-lg text-[10px] font-bold uppercase transition-all"
          >
            + Energy Alert
          </button>
          <button
            onClick={() => triggerMockAlert('low')}
            className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-[10px] font-bold uppercase transition-all"
          >
            + Standard Alert
          </button>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase">Filter Severity:</span>
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterLevel === level 
                    ? 'bg-white text-emerald-800 shadow-xs border border-gray-150' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="font-bold text-gray-800">{filteredNotifications.length}</span> alerts
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Bell className="h-12 w-12 text-gray-300" />
            <h3 className="text-sm font-bold text-gray-700">All alerts cleared!</h3>
            <p className="text-xs text-gray-400 max-w-xs">There are no unresolved notifications matching your filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const styles = getSeverityStyles(notif.severity);
            const isCritical = notif.severity === 'Critical';
            const isHigh = notif.severity === 'High';

            return (
              <div 
                key={notif.id}
                className={`bg-white p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  notif.resolved ? 'opacity-50 border-gray-150' : 'hover:shadow-md border-gray-150'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-11 w-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${styles.split(' ')[0]} ${styles.split(' ')[2]}`}>
                    {isCritical ? (
                      <AlertOctagon className="h-5.5 w-5.5 text-red-600" />
                    ) : isHigh ? (
                      <AlertTriangle className="h-5.5 w-5.5 text-orange-600" />
                    ) : (
                      <Bell className="h-5.5 w-5.5 text-emerald-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${styles}`}>
                        {notif.severity}
                      </span>
                      <span className="text-[10px] text-gray-400">• {notif.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-[10px] text-gray-400 font-semibold">{notif.timestamp}</span>
                  {!notif.resolved && (
                    <button
                      onClick={() => resolveNotification(notif.id)}
                      className="h-8 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Clear Notification"
                    >
                      <Check className="h-4 w-4" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
