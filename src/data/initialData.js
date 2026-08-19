export const INITIAL_CREDENTIALS = [
  { email: 'admin@superkrishak', pass: 'superkrishak', role: 'ADMIN', entityId: 'GLOBAL', name: 'System Admin', title: 'Master Access' },
  { email: 'org@superkrishak', pass: 'superkrishak', role: 'ORG', entityId: 'org_1', name: 'Bethanchowk RM Officer', title: 'Parent Level' },
  { email: 'suborg@superkrishak', pass: 'superkrishak', role: 'SUBORG', entityId: 'sub_1', name: 'Bhakhanje Unit Officer', title: 'Ward Level' }
];

export const INITIAL_ORGANIZATIONS = [
  { id: 'org_1', name: 'Bethanchowk Rural Municipality (Bethanchowk RM)', shortName: 'Bethanchowk RM', code: '5004', skAdminId: 'SK-ORG-5004', address: 'Kavrepalanchok, Bagmati', status: 'Active', parentOrgNum: 1, totalUsers: 13, subOrgCount: 0 },
  { id: 'org_2', name: 'Food and Agriculture Organization (FAO)', shortName: 'FAO', code: '0524', skAdminId: 'SK-ORG-0524', address: 'Lalitpur, Bagmati', status: 'Active', parentOrgNum: 2, totalUsers: 24, subOrgCount: 2 },
  { id: 'org_3', name: 'Kirtipur Municipality (Kirtipur)', shortName: 'Kirtipur', code: '5006', skAdminId: 'SK-ORG-5006', address: 'Kathmandu, Bagmati', status: 'Active', parentOrgNum: 3, totalUsers: 18, subOrgCount: 2 },
  { id: 'org_4', name: 'Nepal Tea Collective (NTC)', shortName: 'NTC', code: '2963', skAdminId: 'SK-ORG-2963', address: 'Jhapa, Koshi', status: 'Active', parentOrgNum: 4, totalUsers: 15, subOrgCount: 1 },
  { id: 'org_5', name: 'Pollinate Group (Pollinate Group)', shortName: 'Pollinate Group', code: '9169', skAdminId: 'SK-ORG-9169', address: 'Kathmandu, Bagmati', status: 'Active', parentOrgNum: 5, totalUsers: 8, subOrgCount: 0 },
  { id: 'org_6', name: 'SAPPROS (SAPPROS)', shortName: 'SAPPROS', code: '0027', skAdminId: 'SK-ORG-0027', address: 'Lalitpur, Bagmati', status: 'Active', parentOrgNum: 6, totalUsers: 32, subOrgCount: 3 },
  { id: 'org_7', name: 'United Nations Development Programme (UNDP)', shortName: 'UNDP', code: '1589', skAdminId: 'SK-ORG-1589', address: 'Pulchowk, Lalitpur', status: 'Active', parentOrgNum: 7, totalUsers: 19, subOrgCount: 1 },
  { id: 'org_8', name: 'कर्जन्हा नगरपालिका (कर्जन्हा)', shortName: 'कर्जन्हा', code: '5011', skAdminId: 'SK-ORG-5011', address: 'Siraha, Madhesh', status: 'Active', parentOrgNum: 8, totalUsers: 11, subOrgCount: 1 },
  { id: 'org_9', name: 'छिन्नमस्ता गाउँपालिका (छिन्नमस्ता)', shortName: 'छिन्नमस्ता', code: '5009', skAdminId: 'SK-ORG-5009', address: 'Saptari, Madhesh', status: 'Active', parentOrgNum: 9, totalUsers: 14, subOrgCount: 1 },
  { id: 'org_10', name: 'जनउत्थान लघुवित्त (JSLBSL)', shortName: 'JSLBSL', code: '2356', skAdminId: 'SK-ORG-2356', address: 'Rupandehi, Lumbini', status: 'Active', parentOrgNum: 10, totalUsers: 22, subOrgCount: 0 },
  { id: 'org_11', name: 'Kathmandu Rural Municipality', shortName: 'KRM', code: '1011', skAdminId: 'SK-ORG-1011', address: 'Kathmandu, Bagmati', status: 'Active', parentOrgNum: 11, totalUsers: 9, subOrgCount: 0 },
  { id: 'org_12', name: 'Rong Rural Municipality (Rong RM)', shortName: 'Rong RM', code: '9736', skAdminId: 'SK-ORG-9736', address: 'Ilam, Koshi', status: 'Active', parentOrgNum: 12, totalUsers: 16, subOrgCount: 1 }
];

export const INITIAL_ORG_USERS = [
  { id: 'ou_1', orgId: 'org_1', name: 'binod Shrestha', email: '', phone: '9863622870', subOrgId: 'None' },
  { id: 'ou_2', orgId: 'org_1', name: 'Dabaki Timalsina', email: '2694854810905538@superkrishak.com', phone: '9841565631', subOrgId: 'None' },
  { id: 'ou_3', orgId: 'org_1', name: 'Jwala Timalsina', email: '', phone: '9841543485', subOrgId: 'None' },
  { id: 'ou_4', orgId: 'org_1', name: 'krishna prasad', email: '122170510454290662@superkrishak.com', phone: '9849012444', subOrgId: 'None' },
  { id: 'ou_5', orgId: 'org_1', name: 'Manish Timalsina', email: '', phone: '9767368201', subOrgId: 'None' },
  { id: 'ou_6', orgId: 'org_1', name: 'Prashant Shrestha', email: '', phone: '9821489417', subOrgId: 'None' },
  { id: 'ou_7', orgId: 'org_1', name: 'Ramesh Timalsina', email: '', phone: '9849570727', subOrgId: 'None' },
  { id: 'ou_8', orgId: 'org_1', name: 'saurab Sapkota', email: '', phone: '9767971258', subOrgId: 'None' },
  { id: 'ou_9', orgId: 'org_1', name: 'Sujan Timalsina', email: '', phone: '9824877033', subOrgId: 'None' },
  { id: 'ou_10', orgId: 'org_1', name: 'Suman Waiba', email: '', phone: '9841966073', subOrgId: 'None' },
  { id: 'ou_11', orgId: 'org_1', name: 'Aashish Neupane', email: 'aashish@superkrishak.com', phone: '9841001122', subOrgId: 'None' },
  { id: 'ou_12', orgId: 'org_1', name: 'Gita Adhikari', email: '', phone: '9801239874', subOrgId: 'None' },
  { id: 'ou_13', orgId: 'org_1', name: 'Deepak Thapa', email: 'deepak.thapa@gmail.com', phone: '9851098765', subOrgId: 'None' }
];

export const INITIAL_SUB_ORGANIZATIONS = [
  { id: 'sub_1', orgId: 'org_2', parentOrgNum: 2, name: 'Bhakhanje Tea Estate (Bhakhanje Tea Estate)', shortName: 'Bhakhanje Tea Estate', code: '9795', skAdminId: 'SK-SUB-9795', address: 'Solukhumbu', status: 'Active' },
  { id: 'sub_2', orgId: 'org_1', parentOrgNum: 1, name: 'Chhinnamasta Rural Municipality (Chhinnamasta RM)', shortName: 'Chhinnamasta RM', code: '4611', skAdminId: 'SK-SUB-4611', address: 'Saptari', status: 'Active' },
  { id: 'sub_3', orgId: 'org_1', parentOrgNum: 1, name: 'Kalinchowk Rural Municipality (Kalinchowk RM)', shortName: 'Kalinchowk RM', code: '4750', skAdminId: 'SK-SUB-4750', address: 'Dolakha', status: 'Active' },
  { id: 'sub_4', orgId: 'org_2', parentOrgNum: 2, name: 'Kanchanjunga Tea Estate (Kanchanjunga Tea Estate)', shortName: 'Kanchanjunga Tea Estate', code: '7138', skAdminId: 'SK-SUB-7138', address: 'Panchthar', status: 'Active' },
  { id: 'sub_5', orgId: 'org_8', parentOrgNum: 8, name: 'NEPAL KRISHAK KATHMANDU (NKK)', shortName: 'NKK', code: '1234', skAdminId: 'SK-SUB-1234', address: 'Kathmandu', status: 'Active' },
  { id: 'sub_6', orgId: 'org_1', parentOrgNum: 1, name: 'RONG RURAL MUNICIPALITY (Rong RM)', shortName: 'Rong RM', code: '9736', skAdminId: 'SK-SUB-9736', address: 'Ilam', status: 'Active' },
  { id: 'sub_7', orgId: 'org_3', parentOrgNum: 3, name: 'Tatopani Rural Municipality (Tatopani RM)', shortName: 'Tatopani RM', code: '6516', skAdminId: 'SK-SUB-6516', address: 'Sindhupalchok', status: 'Active' },
  { id: 'sub_8', orgId: 'org_6', parentOrgNum: 6, name: 'कबिलास शाखा (कबिलास शाखा)', shortName: 'कबिलास शाखा', code: '3468', skAdminId: 'SK-SUB-3468', address: 'Chitwan', status: 'Active' },
  { id: 'sub_9', orgId: 'org_6', parentOrgNum: 6, name: 'काकौरा शाखा (काकौरा शाखा)', shortName: 'काकौरा शाखा', code: '4183', skAdminId: 'SK-SUB-4183', address: 'Bardiya', status: 'Active' },
  { id: 'sub_10', orgId: 'org_6', parentOrgNum: 6, name: 'कालोनी शाखा (कालोनी शाखा)', shortName: 'कालोनी शाखा', code: '5641', skAdminId: 'SK-SUB-5641', address: 'Banke', status: 'Active' },
  { id: 'sub_11', orgId: 'org_3', parentOrgNum: 3, name: 'Kirtipur Municipality Ward 2', shortName: 'Ward 2', code: '0011', skAdminId: 'SK-SUB-001', address: 'Kirtipur', status: 'Active' },
  { id: 'sub_12', orgId: 'org_1', parentOrgNum: 1, name: 'Chandragiri Farmers Unit', shortName: 'Chandragiri', code: '0012', skAdminId: 'SK-SUB-002', address: 'Chandragiri', status: 'Active' },
  { id: 'sub_13', orgId: 'org_2', parentOrgNum: 2, name: 'Lalitpur Agro Dept', shortName: 'Lalitpur Agro', code: '0013', skAdminId: 'SK-SUB-003', address: 'Patan', status: 'Active' }
];

export const INITIAL_FARMERS = [
  { 
    id: 'f1', 
    name: 'Madan kumar Mandal', 
    mobile: '9819971119', 
    ageGroup: '30-40', 
    email: '', 
    gender: 'M',
    address: 'Sakarpura, Saptari - 3 , Madhesh, Tilathi Koiladi Rural Municipality',
    location: 'Saptari', 
    coords: [26.540447, 86.749886], 
    orgId: 'org_9', 
    subOrgId: 'sub_2', 
    occupation: 'गाउँमा बसेर कृषि',
    generalInfo: {
      statusDesc: 'गाउँमा बसेर कृषि',
      learningInterest: 'तरकारी खेती'
    },
    activities: {
      trainingsAttended: 0,
      reactions: 0,
      articlesRead: 0,
      quizParticipation: 3,
      comments: 0,
      landsPlotted: 0,
      diseaseDetection: 0,
      communityPost: 0,
      communityComments: 0,
      refers: 0,
      soilReport: 0,
      calculatorUse: 0
    },
    coins: 0, 
    rating: 92, 
    farmingType: 'Crops', 
    status: 'Active' 
  },
  { 
    id: 'f2', 
    name: 'Balen Sarkar', 
    mobile: '9802300745', 
    ageGroup: '30-40', 
    email: 'sarkarbalen@gmail.com', 
    gender: 'M',
    address: 'Kathmandu Metropolitan City - 1, Bagmati',
    location: 'Kathmandu', 
    coords: [27.7172, 85.3240], 
    orgId: 'org_1', 
    subOrgId: 'sub_2', 
    occupation: 'Urban Farming / Rooftop',
    generalInfo: {
      statusDesc: 'सहरमा प्राङ्गारिक खेती',
      learningInterest: 'कौशी खेती प्रविधि'
    },
    activities: {
      trainingsAttended: 2,
      reactions: 14,
      articlesRead: 32,
      quizParticipation: 45,
      comments: 6,
      landsPlotted: 3,
      diseaseDetection: 2,
      communityPost: 3,
      communityComments: 8,
      refers: 4,
      soilReport: 1,
      calculatorUse: 7
    },
    coins: 1030, 
    rating: 95, 
    farmingType: 'Crops', 
    status: 'Active' 
  },
  { 
    id: 'f3', 
    name: 'Coffee Kisan', 
    mobile: '9846285319', 
    ageGroup: '20-35', 
    email: 'kiranfreedom13@gmail.com', 
    gender: 'M',
    address: 'Pokhara, Kaski - 5, Gandaki',
    location: 'Kaski', 
    coords: [27.7362, 85.3352], 
    orgId: 'org_1', 
    subOrgId: 'sub_3', 
    occupation: 'Agricultural Studies',
    generalInfo: {
      statusDesc: 'कफी खेती अनुसन्धान',
      learningInterest: 'अर्गानिक कफी प्रशोधन'
    },
    activities: {
      trainingsAttended: 1,
      reactions: 8,
      articlesRead: 19,
      quizParticipation: 28,
      comments: 3,
      landsPlotted: 1,
      diseaseDetection: 1,
      communityPost: 1,
      communityComments: 2,
      refers: 2,
      soilReport: 0,
      calculatorUse: 5
    },
    coins: 850, 
    rating: 88, 
    farmingType: 'Livestock', 
    status: 'Active' 
  },
  { 
    id: 'f4', 
    name: 'Rina Acharya', 
    mobile: '9866562364', 
    ageGroup: '20-30', 
    email: 'rina.agro@mail.com', 
    gender: 'F',
    address: 'Lalitpur Metropolitan City - 4, Bagmati',
    location: 'Lalitpur', 
    coords: [27.6588, 85.3247], 
    orgId: 'org_2', 
    subOrgId: 'sub_1', 
    occupation: 'Commercial Aquaculture',
    generalInfo: {
      statusDesc: 'व्यावसायिक मत्स्यपालन',
      learningInterest: 'रेन्बो ट्राउट प्रविधि'
    },
    activities: {
      trainingsAttended: 3,
      reactions: 25,
      articlesRead: 56,
      quizParticipation: 80,
      comments: 12,
      landsPlotted: 2,
      diseaseDetection: 5,
      communityPost: 4,
      communityComments: 15,
      refers: 6,
      soilReport: 2,
      calculatorUse: 18
    },
    coins: 1200, 
    rating: 96, 
    farmingType: 'Fisheries', 
    status: 'Active' 
  }
];

export const INITIAL_GPKM = [
  { id: 'MTR-001', name: 'Residential Zone Meter', aepcId: 'AEPC-001', orgId: 'org_1', subOrgId: 'sub_2', status: 'Active', location: [27.6756, 85.2773], installedDate: '2026-05-12' },
  { id: 'MTR-002', name: 'Commercial Plot Meter', aepcId: 'AEPC-002', orgId: 'org_2', subOrgId: 'sub_1', status: 'Active', location: [27.6588, 85.3247], installedDate: '2026-06-01' },
  { id: 'MTR-003', name: 'Valley Tea Sensor Unit', aepcId: 'AEPC-003', orgId: 'org_3', subOrgId: 'sub_7', status: 'Active', location: [27.7300, 85.3400], installedDate: '2026-07-15' }
];

export const INITIAL_FIELDS = [
  { id: 'field_1', farmerId: 'f1', plotName: 'Pentagon Farm', crop: 'Rice', area: 1.05, date: '2026-08-08 08:54 AM', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'field_2', farmerId: 'f2', plotName: 'Birgha ko khet', crop: 'Coffee', area: 0.61, date: '2026-08-08 08:55 AM', orgId: 'org_1', subOrgId: 'sub_3', hasPdfData: true },
  { id: 'field_3', farmerId: 'f3', plotName: 'Tomato Hub', crop: 'Tomato', area: 2.15, date: '2026-08-10 10:15 AM', orgId: 'org_2', subOrgId: 'sub_1' },
  { id: 'field_4', farmerId: 'f5', plotName: 'Green Valley Plot', crop: 'Apple', area: 3.40, date: '2026-08-12 11:30 AM', orgId: 'org_3', subOrgId: 'sub_7' }
];

export const INITIAL_MESSAGES = [
  { id: 'msg1', datetime: '2026-08-17T10:00', message: 'Heavy rain expected. Secure crops.', status: 'Delivered', target: 'Kirtipur Municipality Ward 2', orgId: 'org_3' },
  { id: 'msg2', datetime: '2026-08-18T14:00', message: 'Subsidized seeds available for autumn planting.', status: 'Scheduled', target: 'All Organizations', orgId: 'GLOBAL' },
  { id: 'msg3', datetime: '2026-08-19T09:30', message: 'Pest control advisory broadcast for Tomato cultivators.', status: 'Scheduled', target: 'Bethanchowk Rural Municipality', orgId: 'org_1' }
];

export const INITIAL_WARNINGS = [
  { id: 'w1', type: 'Critical', message: 'High Pest Infestation Risk (Tomato)', source: 'Satellite / Krishi Doctor', time: '10 mins ago', orgId: 'org_2', subOrgId: 'sub_1' },
  { id: 'w2', type: 'Warning', message: 'Low Soil Moisture (Stress Level Alert)', source: 'Meter MTR-001', time: '1 hour ago', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'w3', type: 'Alert', message: 'Heavy Rain Forecast (Erosion Risk)', source: 'Weather API', time: '2 hours ago', orgId: 'org_1', subOrgId: 'sub_3' }
];

export const INITIAL_ACCESS_CONTROL = {
  sendMessage: { 'org_1': true, 'org_2': false, 'org_3': true, 'sub_1': true, 'sub_2': true, 'sub_3': false },
  addFarmers: { 'org_1': true, 'org_2': false, 'org_3': true, 'sub_1': false, 'sub_2': false, 'sub_3': false }
};

export const PDF_MOCK_DATA = {
  coords: "[(83.5444, 27.9577)], [(83.5445, 27.9579)], [(83.5447, 27.9579)]...",
  area: "0.6128 HA",
  crop: "Coffee",
  sowingDate: "2023-04-21",
  clicks: 7,
  healthTimeline: [
    { date: '2023-09-23', value: 0.48 },
    { date: '2023-10-15', value: 0.55 },
    { date: '2023-11-20', value: 0.47 },
    { date: '2023-12-31', value: 0.36 },
    { date: '2024-01-12', value: 0.35 }
  ]
};
