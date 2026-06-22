import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { usePlatformStore } from '../../store/usePlatformStore';

// Lazy load or import direct for fast compilation
import { Overview } from '../../features/dashboard/Overview';
import { CommandCenter } from '../../features/dashboard/CommandCenter';
import { NotificationCenter } from '../../features/dashboard/NotificationCenter';
import { CompanyIntelligence } from '../../features/company/CompanyIntelligence';
import { DigitalTwinView } from '../../features/digital-twin/DigitalTwinView';
import { EvidenceVerification } from '../../features/evidence/EvidenceVerification';
import { EvidenceTrust } from '../../features/evidence/EvidenceTrust';
import { LiveCameraAudit } from '../../features/evidence/LiveCameraAudit';
import { FraudIntelligence } from '../../features/fraud/FraudIntelligence';
import { RiskCenter } from '../../features/fraud/RiskCenter';
import { AssessmentWorkflow } from '../../features/assessment/AssessmentWorkflow';
import { ScoringEngine } from '../../features/assessment/ScoringEngine';
import { CopilotView } from '../../features/copilot/CopilotView';
import { PredictiveAnalytics } from '../../features/analytics/PredictiveAnalytics';
import { ControlRoom } from '../../features/analytics/ControlRoom';
import { NetZero } from '../../features/analytics/NetZero';
import { CertificatesView } from '../../features/certificates/CertificatesView';
import { ReportsView } from '../../features/certificates/ReportsView';
import { GovernanceView } from '../../features/governance/GovernanceView';
import { SecurityCenter } from '../../features/security/SecurityCenter';
import { AdministrationView } from '../../features/admin/AdministrationView';

export const MainLayout: React.FC = () => {
  const { currentTab } = usePlatformStore();

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <Overview />;
      case 'command-center':
        return <CommandCenter />;
      case 'company-intelligence':
        return <CompanyIntelligence />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'evidence-verification':
        return <EvidenceVerification />;
      case 'evidence-trust':
        return <EvidenceTrust />;
      case 'fraud-intelligence':
        return <FraudIntelligence />;
      case 'risk-center':
        return <RiskCenter />;
      case 'assessment-workflow':
        return <AssessmentWorkflow />;
      case 'scoring-engine':
        return <ScoringEngine />;
      case 'copilot':
        return <CopilotView />;
      case 'predictive-analytics':
        return <PredictiveAnalytics />;
      case 'control-room':
        return <ControlRoom />;
      case 'certificates':
        return <CertificatesView />;
      case 'reports':
        return <ReportsView />;
      case 'net-zero':
        return <NetZero />;
      case 'governance':
        return <GovernanceView />;
      case 'security':
        return <SecurityCenter />;
      case 'notifications':
        return <NotificationCenter />;
      case 'administration':
        return <AdministrationView />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white via-gray-55/30 to-emerald-50/10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
