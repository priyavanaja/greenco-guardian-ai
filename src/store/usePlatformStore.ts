import { create } from 'zustand';

export type UserRole = 
  | 'Company Sustainability Manager'
  | 'GreenCo Assessor'
  | 'AI Compliance Officer'
  | 'Certification Administrator'
  | 'Executive Viewer';

export interface Tenant {
  id: string;
  name: string;
  trustScore: number;
  certificationStatus: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  sustainabilityScore: number;
  carbonReduction: number;
  energyUsage: number; // MWh
  waterUsage: number; // KL
  wasteGen: number; // Tons
  netZeroYear: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  category: string;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  reason: string;
  category: 'User' | 'AI' | 'Evidence' | 'Score' | 'Certificate' | 'Security';
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'sensor' | 'invoice';
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Approved';
  authenticityScore: number;
  aiGeneratedProb: number;
  manipulationRisk: number;
  locationMatched: boolean;
  gps: string;
  timestamp: string;
  deviceFingerprint: string;
  ocrContent?: string;
  forensicAlerts?: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: string[];
  reasoningSteps?: { label: string; desc: string }[];
}

interface PlatformState {
  // Navigation & Tenant
  currentTab: string;
  activeRole: UserRole;
  selectedTenantId: string;
  tenants: Tenant[];
  
  // Data lists
  notifications: Notification[];
  auditLogs: AuditLog[];
  evidenceList: EvidenceItem[];
  copilotMessages: CopilotMessage[];
  
  // Real-time Controls / Thresholds
  energyThreshold: number;
  waterThreshold: number;
  carbonThreshold: number;
  activeControlPanelComponent: string | null;

  // Actions
  setCurrentTab: (tab: string) => void;
  setActiveRole: (role: UserRole) => void;
  setSelectedTenantId: (id: string) => void;
  resolveNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'resolved'>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'uploadedAt' | 'status'>) => void;
  updateEvidenceStatus: (id: string, status: EvidenceItem['status']) => void;
  sendCopilotMessage: (text: string) => void;
  setEnergyThreshold: (val: number) => void;
  setWaterThreshold: (val: number) => void;
  setCarbonThreshold: (val: number) => void;
  setActiveControlPanelComponent: (comp: string | null) => void;
  resetTenantData: () => void;
}

const mockTenants: Tenant[] = [
  {
    id: 'tvs-motors',
    name: 'TVS Motors',
    trustScore: 97,
    certificationStatus: 'Gold (Active)',
    riskLevel: 'Low',
    sustainabilityScore: 84,
    carbonReduction: 12400,
    energyUsage: 5400,
    waterUsage: 2300,
    wasteGen: 820,
    netZeroYear: 2028
  },
  {
    id: 'hyundai',
    name: 'Hyundai India',
    trustScore: 91,
    certificationStatus: 'Silver (Pending Audit)',
    riskLevel: 'Medium',
    sustainabilityScore: 76,
    carbonReduction: 9800,
    energyUsage: 6800,
    waterUsage: 3100,
    wasteGen: 1100,
    netZeroYear: 2030
  },
  {
    id: 'ashok-leyland',
    name: 'Ashok Leyland',
    trustScore: 98,
    certificationStatus: 'Platinum (Active)',
    riskLevel: 'Low',
    sustainabilityScore: 92,
    carbonReduction: 18500,
    energyUsage: 4200,
    waterUsage: 1900,
    wasteGen: 510,
    netZeroYear: 2027
  },
  {
    id: 'company-a',
    name: 'EcoManufacturing Inc (Company A)',
    trustScore: 48,
    certificationStatus: 'Suspended (Fraud Alert)',
    riskLevel: 'Critical',
    sustainabilityScore: 35,
    carbonReduction: 1200,
    energyUsage: 9400,
    waterUsage: 5200,
    wasteGen: 3100,
    netZeroYear: 2035
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'Duplicate Evidence Flagged',
    description: 'System identified matching sensor screenshot uploaded by TVS Motors as previously submitted in 2025.',
    severity: 'High',
    timestamp: '10 Mins Ago',
    category: 'Fraud Detection',
    resolved: false
  },
  {
    id: 'n-2',
    title: 'Water Level Anomaly',
    description: 'Industrial Water Treat plant flow spikes above standard benchmark by 38%.',
    severity: 'Medium',
    timestamp: '1 Hour Ago',
    category: 'Sustainability Control Room',
    resolved: false
  },
  {
    id: 'n-3',
    title: 'AI Forensic Warning: Manipulated GPS',
    description: 'Photo submitted from Factory B contains mismatched metadata GPS coordinates.',
    severity: 'Critical',
    timestamp: '2 Hours Ago',
    category: 'Evidence Trust',
    resolved: false
  },
  {
    id: 'n-4',
    title: 'Model Version Upgraded',
    description: 'Computer Vision Evidence Extractor model version updated from 4.12.0 to 5.0.0.',
    severity: 'Low',
    timestamp: 'Yesterday',
    category: 'AI Governance',
    resolved: false
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'a-1',
    timestamp: '2026-06-22 21:40:02',
    user: 'AI Trust Engine',
    action: 'Evidence Scan Complete',
    details: 'Scanned doc-invoice-water-q2.pdf, verified signature matching supplier ledger.',
    reason: 'Periodic automated review pipeline.',
    category: 'AI'
  },
  {
    id: 'a-2',
    timestamp: '2026-06-22 21:05:42',
    user: 'Sarah Jenkins (Assessor)',
    action: 'Manual Score Overwrite',
    details: 'Adjusted Waste Management score from 78 to 82 based on physical factory audit verification.',
    reason: 'Verified on-site composting unit operational.',
    category: 'Score'
  },
  {
    id: 'a-3',
    timestamp: '2026-06-22 19:12:00',
    user: 'Ramesh Patel (Admin)',
    action: 'Access Level Modified',
    details: 'Upgraded John Doe role to GreenCo Assessor.',
    reason: 'Accreditation renewal paperwork verified.',
    category: 'User'
  },
  {
    id: 'a-4',
    timestamp: '2026-06-22 17:34:11',
    user: 'AI Forensic Scan',
    action: 'Deepfake Filter Triggered',
    details: 'Flagged factory_facade_v3.png as 94% probability generated via synthetic image model.',
    reason: 'Scene inconsistency, metadata strip, missing EXIF.',
    category: 'Security'
  }
];

const initialEvidence: EvidenceItem[] = [
  {
    id: 'e-1',
    name: 'solar_farm_east.png',
    type: 'image',
    uploadedAt: '2026-06-22 18:22:15',
    uploadedBy: 'Nagaraj Swamy (Manager)',
    size: '4.2 MB',
    status: 'Verified',
    authenticityScore: 98,
    aiGeneratedProb: 1,
    manipulationRisk: 1,
    locationMatched: true,
    gps: '12.9716° N, 79.1588° E (TVS Factory Yard)',
    timestamp: '2026-06-22 18:15:30',
    deviceFingerprint: 'DEV_IPHONE_15_PRO_AC88F',
    ocrContent: 'Detected: Solar panels model TSM-DE19, Serial: 48821990234',
  },
  {
    id: 'e-2',
    name: 'water_invoice_may.pdf',
    type: 'pdf',
    uploadedAt: '2026-06-22 17:40:11',
    uploadedBy: 'Nagaraj Swamy (Manager)',
    size: '1.8 MB',
    status: 'Verified',
    authenticityScore: 95,
    aiGeneratedProb: 0,
    manipulationRisk: 5,
    locationMatched: true,
    gps: 'Vellore Municipal Office billing terminal',
    timestamp: '2026-05-31 12:00:00',
    deviceFingerprint: 'DEV_DESKTOP_WIN_442A',
    ocrContent: 'Vellore Water Board invoice. Amount due: 45,210 INR. Volume: 2,300 KL.',
  },
  {
    id: 'e-3',
    name: 'waste_flow_inconsistent.jpg',
    type: 'image',
    uploadedAt: '2026-06-22 15:10:00',
    uploadedBy: 'Nagaraj Swamy (Manager)',
    size: '3.1 MB',
    status: 'Rejected',
    authenticityScore: 45,
    aiGeneratedProb: 88,
    manipulationRisk: 72,
    locationMatched: false,
    gps: 'Unknown (EXIF mismatch: San Francisco, CA)',
    timestamp: '2025-10-12 04:22:18',
    deviceFingerprint: 'DEV_UNKNOWN_AGENT_WEB',
    ocrContent: 'No readable text patterns found. Texture artifacts identified.',
    forensicAlerts: ['AI Generated Texture detected', 'Missing EXIF structure', 'Cloned pixel areas found']
  },
  {
    id: 'e-4',
    name: 'meter_feed_electric.csv',
    type: 'sensor',
    uploadedAt: '2026-06-22 12:00:00',
    uploadedBy: 'IOT_GATEWAY_NODE_88',
    size: '12 KB',
    status: 'Approved',
    authenticityScore: 99,
    aiGeneratedProb: 0,
    manipulationRisk: 0,
    locationMatched: true,
    gps: 'Grid Meter Box #4, Factory C',
    timestamp: '2026-06-22 12:00:00',
    deviceFingerprint: 'IOT_NODE_ESP32_M4',
    ocrContent: 'Readings: 5,400 MWh total cumulative active power, 84% power factor.'
  }
];

export const usePlatformStore = create<PlatformState>((set, get) => ({
  currentTab: 'overview',
  activeRole: 'Company Sustainability Manager',
  selectedTenantId: 'tvs-motors',
  tenants: mockTenants,
  notifications: initialNotifications,
  auditLogs: initialAuditLogs,
  evidenceList: initialEvidence,
  copilotMessages: [
    {
      id: 'c-1',
      sender: 'ai',
      text: 'Hello. I am the GreenCo Guardian AI Copilot. I analyze sustainability evidence, inspect for fraud patterns, and provide explainable certification insights. Ask me anything about your certification path.',
      timestamp: '21:30'
    }
  ],
  energyThreshold: 80,
  waterThreshold: 75,
  carbonThreshold: 85,
  activeControlPanelComponent: null,

  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  setActiveRole: (role) => {
    set({ activeRole: role });
    get().addAuditLog({
      user: 'System Controller',
      action: 'Role Switched',
      details: `Active role profile updated to: ${role}`,
      reason: 'User toggled dashboard profile perspective.',
      category: 'User'
    });
  },
  
  setSelectedTenantId: (id) => {
    set({ selectedTenantId: id });
    const tenant = get().tenants.find(t => t.id === id);
    get().addAuditLog({
      user: 'Tenant Manager',
      action: 'SaaS Tenant Changed',
      details: `Active organization shifted to: ${tenant?.name || id}`,
      reason: 'Multi-tenant switching requested.',
      category: 'User'
    });
  },
  
  resolveNotification: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, resolved: true } : n)
  })),

  addNotification: (notification) => set((state) => {
    const newN: Notification = {
      ...notification,
      id: `n-${state.notifications.length + 1}`,
      timestamp: 'Just Now',
      resolved: false
    };
    return { notifications: [newN, ...state.notifications] };
  }),

  addAuditLog: (log) => set((state) => {
    const newL: AuditLog = {
      ...log,
      id: `a-${state.auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return { auditLogs: [newL, ...state.auditLogs] };
  }),

  addEvidence: (evidence) => set((state) => {
    const newE: EvidenceItem = {
      ...evidence,
      id: `e-${state.evidenceList.length + 1}`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Pending'
    };
    
    // Auto audit log
    get().addAuditLog({
      user: evidence.uploadedBy,
      action: 'Evidence Uploaded',
      details: `File "${evidence.name}" added to evidence trust validation pipeline. Size: ${evidence.size}`,
      reason: 'Sustainability performance reporting.',
      category: 'Evidence'
    });

    // Run a mock AI trust assessment in the background
    setTimeout(() => {
      set((subState) => {
        const updated = subState.evidenceList.map((item) => {
          if (item.id === newE.id) {
            return {
              ...item,
              status: (item.authenticityScore >= 70 ? 'Verified' : 'Rejected') as EvidenceItem['status']
            };
          }
          return item;
        });



        // Log results
        const finalItem = updated.find(x => x.id === newE.id);
        if (finalItem) {
          get().addAuditLog({
            user: 'AI Trust Engine',
            action: 'Automated Forensic Complete',
            details: `Scanned "${finalItem.name}". Result: ${finalItem.status} (Authenticity: ${finalItem.authenticityScore}%, Generated: ${finalItem.aiGeneratedProb}%, Manipulation: ${finalItem.manipulationRisk}%)`,
            reason: 'Automated Image Forensics, Metadata checking, and GPS validations.',
            category: 'AI'
          });

          // Add notification if low authenticity
          if (finalItem.status === 'Rejected') {
            get().addNotification({
              title: `Forensic Alert: "${finalItem.name}" Rejected`,
              description: `Evidence trust score drops below threshold. Mismatched metadata or synthetic texture detected.`,
              severity: 'Critical',
              category: 'Evidence Trust'
            });
          }
        }

        return { evidenceList: updated };
      });
    }, 1200);

    return { evidenceList: [newE, ...state.evidenceList] };
  }),

  updateEvidenceStatus: (id, status) => set((state) => {
    const item = state.evidenceList.find(e => e.id === id);
    get().addAuditLog({
      user: state.activeRole,
      action: 'Evidence Status Override',
      details: `Changed "${item?.name}" status from ${item?.status} to ${status}.`,
      reason: 'Manual validation override by certified compliance officer.',
      category: 'Evidence'
    });
    return {
      evidenceList: state.evidenceList.map((e) => e.id === id ? { ...e, status } : e)
    };
  }),

  sendCopilotMessage: (text) => set((state) => {
    const userMsg: CopilotMessage = {
      id: `c-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // AI response logic
    let aiText = "I have analyzed your query. To formulate specific recommendations, please ensure all factory IoT meters are synchronized and EXIF details are valid.";
    let citations: string[] = [];
    let reasoningSteps: { label: string; desc: string }[] = [];

    const lowerText = text.toLowerCase();
    const tenant = state.tenants.find(t => t.id === state.selectedTenantId);

    if (lowerText.includes('why') && lowerText.includes('gold')) {
      aiText = `${tenant?.name} received a Gold rating because its Energy Efficiency (85%) and Waste Management (91%) scores are highly optimal. However, the final rating was bounded by Water Management (72%), which is currently below the platinum benchmark of 80%.`;
      citations = ['meter_feed_electric.csv', 'water_invoice_may.pdf'];
      reasoningSteps = [
        { label: 'Energy Scan', desc: 'IoT electric meter verified cumulative output of 5,400 MWh.' },
        { label: 'Water Audit', desc: 'Total volume computed at 2,300 KL, with active recycler only handling 15% of effluent.' },
        { label: 'Final Evaluation', desc: 'Score calculated: 84. Gold criteria met, Water recycling gap blocks Platinum status.' }
      ];
    } else if (lowerText.includes('improve') || lowerText.includes('platinum')) {
      aiText = `To upgrade ${tenant?.name} from Gold to Platinum, you must increase Water Efficiency by at least 12%. I recommend installing a reverse osmosis recycling system to reuse production wastewater. This is estimated to save 300 KL annually and reduce carbon emissions by 25 tons/year.`;
      citations = ['water_treatment_spec_v2.pdf', 'net_zero_targets.csv'];
      reasoningSteps = [
        { label: 'Identify Deficit', desc: 'Water efficiency score (72) sits 8 points below the Platinum baseline.' },
        { label: 'Simulate Upgrade', desc: 'Recycling plant integration raises score to 86, raising cumulative Sustainability score to 92.' },
        { label: 'Verify Feasibility', desc: 'Calculated capital expenditure savings of $4,500/month in utility bills.' }
      ];
    } else if (lowerText.includes('fraud') || lowerText.includes('fake')) {
      aiText = "My image forensics scan detected synthetic textures and deepfake characteristics in one of the files uploaded today (waste_flow_inconsistent.jpg). The image EXIF metadata timestamp was modified, and GPS coordinates indicate the picture was not captured at your verified factory location.";
      citations = ['waste_flow_inconsistent.jpg'];
      reasoningSteps = [
        { label: 'Texture Scan', desc: 'Identified 88% probability of synthetic generation via a latent diffusion model.' },
        { label: 'EXIF Metadata Analysis', desc: 'Mismatched geolocation detected (San Francisco coordinates instead of factory yard).' },
        { label: 'Flag Generation', desc: 'Added duplicate evidence flag to the Compliance risk queue.' }
      ];
    }

    const aiMsg: CopilotMessage = {
      id: `c-a-${Date.now()}`,
      sender: 'ai',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
      reasoningSteps
    };

    return {
      copilotMessages: [...state.copilotMessages, userMsg, aiMsg]
    };
  }),

  setEnergyThreshold: (val) => set({ energyThreshold: val }),
  setWaterThreshold: (val) => set({ waterThreshold: val }),
  setCarbonThreshold: (val) => set({ carbonThreshold: val }),
  setActiveControlPanelComponent: (comp) => set({ activeControlPanelComponent: comp }),
  
  resetTenantData: () => set({
    evidenceList: initialEvidence,
    notifications: initialNotifications
  })
}));

