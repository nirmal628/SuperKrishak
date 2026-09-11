export const INITIAL_CREDENTIALS = [
  { email: 'admin@superkrishak', pass: 'superkrishak', role: 'ADMIN', entityId: 'GLOBAL', name: 'System Admin', title: 'Master Access' },
  { email: 'org@superkrishak', pass: 'superkrishak', role: 'ORG', entityId: 'org_1', name: 'Kirtipur Municipality', title: 'Parent Level' },
  { email: 'suborg@superkrishak', pass: 'superkrishak', role: 'SUBORG', entityId: 'sub_ktp_1', name: 'Kirtipur Municipality 1', title: 'Ward Level' }
];

export const INITIAL_ORGANIZATIONS = [
  { id: 'org_1', name: 'Kirtipur Municipality (Kirtipur)', shortName: 'Kirtipur', code: '5006', skAdminId: 'SK-ORG-5006', address: 'Kathmandu, Bagmati', status: 'Active', parentOrgNum: 1, totalUsers: 21, subOrgCount: 3 },
  { id: 'org_2', name: 'Food and Agriculture Organization (FAO)', shortName: 'FAO', code: '0524', skAdminId: 'SK-ORG-0524', address: 'Lalitpur, Bagmati', status: 'Active', parentOrgNum: 2, totalUsers: 24, subOrgCount: 2 },
  { id: 'org_3', name: 'Bethanchowk Rural Municipality (Bethanchowk RM)', shortName: 'Bethanchowk RM', code: '5004', skAdminId: 'SK-ORG-5004', address: 'Kavrepalanchok, Bagmati', status: 'Active', parentOrgNum: 3, totalUsers: 13, subOrgCount: 2 },
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

export const INITIAL_SUB_ORGANIZATIONS = [
  { id: 'sub_ktp_1', orgId: 'org_1', parentOrgNum: 1, name: 'Kirtipur Municipality 1', shortName: 'Kirtipur 1', code: '5006-1', skAdminId: 'SK-SUB-5006-1', address: 'Kirtipur Ward 1, Kathmandu', status: 'Active' },
  { id: 'sub_ktp_2', orgId: 'org_1', parentOrgNum: 1, name: 'Kirtipur Municipality 2', shortName: 'Kirtipur 2', code: '5006-2', skAdminId: 'SK-SUB-5006-2', address: 'Kirtipur Ward 2, Kathmandu', status: 'Active' },
  { id: 'sub_ktp_3', orgId: 'org_1', parentOrgNum: 1, name: 'Kirtipur Municipality 3', shortName: 'Kirtipur 3', code: '5006-3', skAdminId: 'SK-SUB-5006-3', address: 'Kirtipur Ward 3, Kathmandu', status: 'Active' },
  { id: 'sub_2', orgId: 'org_1', parentOrgNum: 1, name: 'Chhinnamasta Rural Municipality (Chhinnamasta RM)', shortName: 'Chhinnamasta RM', code: '4611', skAdminId: 'SK-SUB-4611', address: 'Saptari', status: 'Active' },
  { id: 'sub_3', orgId: 'org_1', parentOrgNum: 1, name: 'Kalinchowk Rural Municipality (Kalinchowk RM)', shortName: 'Kalinchowk RM', code: '4750', skAdminId: 'SK-SUB-4750', address: 'Dolakha', status: 'Active' },
  { id: 'sub_4', orgId: 'org_2', parentOrgNum: 2, name: 'Kanchanjunga Tea Estate (Kanchanjunga Tea Estate)', shortName: 'Kanchanjunga Tea Estate', code: '7138', skAdminId: 'SK-SUB-7138', address: 'Panchthar', status: 'Active' },
  { id: 'sub_5', orgId: 'org_8', parentOrgNum: 8, name: 'NEPAL KRISHAK KATHMANDU (NKK)', shortName: 'NKK', code: '1234', skAdminId: 'SK-SUB-1234', address: 'Kathmandu', status: 'Active' },
  { id: 'sub_6', orgId: 'org_1', parentOrgNum: 1, name: 'RONG RURAL MUNICIPALITY (Rong RM)', shortName: 'Rong RM', code: '9736', skAdminId: 'SK-SUB-9736', address: 'Ilam', status: 'Active' },
  { id: 'sub_7', orgId: 'org_3', parentOrgNum: 3, name: 'Tatopani Rural Municipality (Tatopani RM)', shortName: 'Tatopani RM', code: '6516', skAdminId: 'SK-SUB-6516', address: 'Sindhupalchok', status: 'Active' },
  { id: 'sub_8', orgId: 'org_6', parentOrgNum: 6, name: 'कबिलास शाखा (कबिलास शाखा)', shortName: 'कबिलास शाखा', code: '3468', skAdminId: 'SK-SUB-3468', address: 'Chitwan', status: 'Active' },
  { id: 'sub_9', orgId: 'org_6', parentOrgNum: 6, name: 'काकौरा शाखा (काकौरा शाखा)', shortName: 'काकौरा शाखा', code: '4183', skAdminId: 'SK-SUB-4183', address: 'Bardiya', status: 'Active' },
  { id: 'sub_10', orgId: 'org_6', parentOrgNum: 6, name: 'कालोनी शाखा (कालोनी शाखा)', shortName: 'कालोनी शाखा', code: '5641', skAdminId: 'SK-SUB-5641', address: 'Banke', status: 'Active' },
  { id: 'sub_1', orgId: 'org_2', parentOrgNum: 2, name: 'Bhakhanje Tea Estate (Bhakhanje Tea Estate)', shortName: 'Bhakhanje Tea Estate', code: '9795', skAdminId: 'SK-SUB-9795', address: 'Solukhumbu', status: 'Active' },
  { id: 'sub_12', orgId: 'org_1', parentOrgNum: 1, name: 'Chandragiri Farmers Unit', shortName: 'Chandragiri', code: '0012', skAdminId: 'SK-SUB-002', address: 'Chandragiri', status: 'Active' },
  { id: 'sub_13', orgId: 'org_2', parentOrgNum: 2, name: 'Lalitpur Agro Dept', shortName: 'Lalitpur Agro', code: '0013', skAdminId: 'SK-SUB-003', address: 'Patan', status: 'Active' }
];

export const INITIAL_GPKM = [
  { id: 'MTR-5001', name: 'Kirtipur Municipality 1', aepcId: 'GPA5006-1', farmerId: 'f10', farmerName: 'Ram Kumar Shrestha', phone: '9841234567', locationName: 'Kirtipur 1', orgId: 'org_1', subOrgId: 'sub_ktp_1', status: 'Active', lastActiveTime: '5 mins ago', location: [27.6792, 85.2750], installedDate: '2026-08-10' },
  { id: 'MTR-5002', name: 'Kirtipur Municipality 2', aepcId: 'GPA5006-2', farmerId: 'f11', farmerName: 'Saraswati Maharjan', phone: '9841234568', locationName: 'Kirtipur 2', orgId: 'org_1', subOrgId: 'sub_ktp_2', status: 'Active', lastActiveTime: '15 mins ago', location: [27.6782, 85.2780], installedDate: '2026-08-12' },
  { id: 'MTR-5003', name: 'Kirtipur Municipality 3', aepcId: 'GPA5006-3', farmerId: 'f12', farmerName: 'Narayan Joshi', phone: '9841234569', locationName: 'Kirtipur 3', orgId: 'org_1', subOrgId: 'sub_ktp_3', status: 'Active', lastActiveTime: '1 hour ago', location: [27.6750, 85.2810], installedDate: '2026-08-15' },
  { id: 'MTR-001', name: 'GPA0123', aepcId: 'GPA0123', farmerId: 'f5', farmerName: 'Pashupati Renewables', phone: '9802300739', locationName: 'Rupandehi', orgId: 'org_3', subOrgId: 'sub_7', status: 'Active', lastActiveTime: '10 mins ago', location: [27.6866, 83.4323], installedDate: '2026-05-12' },
  { id: 'MTR-002', name: 'GPA4011', aepcId: 'GPA4011', farmerId: 'f6', farmerName: 'Gita Maya Gurung', phone: '9802392755', locationName: 'Kathmandu', orgId: 'org_3', subOrgId: 'sub_7', status: 'Inactive', lastActiveTime: '2d 8h', location: [27.6782, 85.2780], installedDate: '2026-06-01' },
  { id: 'MTR-003', name: 'GPA4012', aepcId: 'GPA4012', farmerId: 'f2', farmerName: 'Madan Kumar Mandal', phone: '9802300745', locationName: 'Kathmandu', orgId: 'org_1', subOrgId: 'sub_2', status: 'Active', lastActiveTime: '1 hour ago', location: [27.7172, 85.3240], installedDate: '2026-07-15' },
  { id: 'MTR-004', name: 'GPA0099', aepcId: 'GPA0099', farmerId: 'f4', farmerName: 'Rina Acharya', phone: '9866562364', locationName: 'Lalitpur', orgId: 'org_2', subOrgId: 'sub_1', status: 'Active', lastActiveTime: 'Just now', location: [27.6588, 85.3247], installedDate: '2026-08-01' }
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
  { id: 'ou_13', orgId: 'org_1', name: 'Deepak Thapa', email: 'deepak.thapa@gmail.com', phone: '9851098765', subOrgId: 'None' },
  { id: 'ou_14', orgId: 'org_1', name: 'Anish Maharjan', email: 'anish.m@superkrishak.com', phone: '9841112233', subOrgId: 'sub_ktp_1' },
  { id: 'ou_15', orgId: 'org_1', name: 'Sunita Maharjan', email: 'sunita.m@superkrishak.com', phone: '9841112244', subOrgId: 'sub_ktp_2' },
  { id: 'ou_16', orgId: 'org_1', name: 'Prakash Shrestha', email: 'prakash.s@superkrishak.com', phone: '9841112255', subOrgId: 'sub_ktp_3' }
];

export const INITIAL_FARMERS = [
  { id: 'f10', name: 'Ram Kumar Shrestha', mobile: '9841234567', ageGroup: '35-45', email: 'ram.k@gmail.com', gender: 'M', address: 'Kirtipur 1, Kathmandu', location: 'Kirtipur', coords: [27.6792, 85.2750], orgId: 'org_1', subOrgId: 'sub_ktp_1', occupation: 'Vegetable Farming', coins: 1400, rating: 88, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-01', lastActiveDate: '2026-09-05' },
  { id: 'f11', name: 'Saraswati Maharjan', mobile: '9841234568', ageGroup: '30-40', email: 'saraswati.m@gmail.com', gender: 'F', address: 'Kirtipur 2, Kathmandu', location: 'Kirtipur', coords: [27.6782, 85.2780], orgId: 'org_1', subOrgId: 'sub_ktp_2', occupation: 'Organic Cultivation', coins: 1150, rating: 82, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-02', lastActiveDate: '2026-09-05' },
  { id: 'f12', name: 'Narayan Joshi', mobile: '9841234569', ageGroup: '40-50', email: 'narayan.j@gmail.com', gender: 'M', address: 'Kirtipur 3, Kathmandu', location: 'Kirtipur', coords: [27.6750, 85.2810], orgId: 'org_1', subOrgId: 'sub_ktp_3', occupation: 'Poultry & Crops', coins: 980, rating: 79, farmingType: 'Mixed', status: 'Active', registeredDate: '2026-09-03', lastActiveDate: '2026-09-05' },
  { id: 'f1', name: 'Swarup Sen', mobile: '9819971119', ageGroup: '30-40', email: 'swarupsen@gmail.com', gender: 'M', address: 'Sakarpura, Saptari - 3, Madhesh', location: 'Saptari', coords: [26.540447, 86.749886], orgId: 'org_1', subOrgId: 'sub_2', occupation: 'Vegetable Cultivation', coins: 1250, rating: 92, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-01', lastActiveDate: '2026-09-05' },
  { id: 'f2', name: 'Madan Kumar Mandal', mobile: '9802300745', ageGroup: '30-40', email: 'madan@gmail.com', gender: 'M', address: 'Kathmandu Metropolitan City - 1', location: 'Kathmandu', coords: [27.7172, 85.3240], orgId: 'org_1', subOrgId: 'sub_2', occupation: 'Urban Farming', coins: 1030, rating: 65, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-01', lastActiveDate: '2026-09-04' },
  { id: 'f3', name: 'Balen Sarkar', mobile: '9846285319', ageGroup: '20-35', email: 'sarkarbalen@gmail.com', gender: 'M', address: 'Pokhara, Kaski - 5, Gandaki', location: 'Kaski', coords: [27.7362, 85.3352], orgId: 'org_1', subOrgId: 'sub_3', occupation: 'Coffee Research', coins: 850, rating: 35, farmingType: 'Livestock', status: 'Inactive', registeredDate: '2026-09-02', lastActiveDate: '2026-09-02' },
  { id: 'f4', name: 'Rina Acharya', mobile: '9866562364', ageGroup: '20-30', email: 'rina.agro@mail.com', gender: 'F', address: 'Lalitpur Metropolitan City - 4', location: 'Lalitpur', coords: [27.6588, 85.3247], orgId: 'org_2', subOrgId: 'sub_1', occupation: 'Commercial Fisheries', coins: 1200, rating: 96, farmingType: 'Fisheries', status: 'Active', registeredDate: '2026-09-02', lastActiveDate: '2026-09-05' },
  { id: 'f5', name: 'Pashupati Renewables', mobile: '9802300739', ageGroup: '40-50', email: 'pashupati@renew.np', gender: 'M', address: 'Rupandehi, Lumbini', location: 'Rupandehi', coords: [27.6866, 83.4323], orgId: 'org_3', subOrgId: 'sub_7', occupation: 'Solar Irrigation', coins: 2100, rating: 88, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-03', lastActiveDate: '2026-09-05' },
  { id: 'f6', name: 'Gita Maya Gurung', mobile: '9802392755', ageGroup: '35-45', email: 'gita.gurung@gmail.com', gender: 'F', address: 'Kirtipur Ward 2, Kathmandu', location: 'Kathmandu', coords: [27.6782, 85.2780], orgId: 'org_3', subOrgId: 'sub_7', occupation: 'Cereal Farming', coins: 940, rating: 74, farmingType: 'Crops', status: 'Inactive', registeredDate: '2026-09-03', lastActiveDate: '2026-09-03' },
  { id: 'f7', name: 'Bikram Khadka', mobile: '9841001122', ageGroup: '25-35', email: 'bikram.k@gmail.com', gender: 'M', address: 'Chandragiri - 5, Kathmandu', location: 'Chandragiri', coords: [27.6912, 85.2201], orgId: 'org_1', subOrgId: 'sub_12', occupation: 'Paddy & Wheat Farming', coins: 1540, rating: 82, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-04', lastActiveDate: '2026-09-05' },
  { id: 'f8', name: 'Sunita Rai', mobile: '9811223344', ageGroup: '30-40', email: 'sunita.rai@gmail.com', gender: 'F', address: 'Ilam Municipality - 3, Koshi', location: 'Ilam', coords: [26.9083, 87.9306], orgId: 'org_4', subOrgId: 'sub_6', occupation: 'Tea Plantation', coins: 1890, rating: 91, farmingType: 'Crops', status: 'Active', registeredDate: '2026-09-04', lastActiveDate: '2026-09-05' },
  { id: 'f9', name: 'Ramesh Karki', mobile: '9851098765', ageGroup: '45-55', email: 'karki.ramesh@gmail.com', gender: 'M', address: 'Chitwan, Bagmati', location: 'Chitwan', coords: [27.8011, 84.4210], orgId: 'org_6', subOrgId: 'sub_8', occupation: 'Maize Cultivation', coins: 1120, rating: 78, farmingType: 'Livestock', status: 'Active', registeredDate: '2026-09-05', lastActiveDate: '2026-09-05' }
];

export const INITIAL_FIELDS = [
  { id: 'field_8', farmerId: 'f10', plotName: 'Kirtipur Green Farm', crop: 'Tomato', area: 1.20, fieldScore: '0.70', status: 'Above', date: '2026-08-16 10:00 AM', sowingDate: '2024-02-15', orgId: 'org_1', subOrgId: 'sub_ktp_1' },
  { id: 'field_9', farmerId: 'f11', plotName: 'Taudaha Vegetable Plot', crop: 'Cabbage', area: 0.85, fieldScore: '0.64', status: 'Average', date: '2026-08-17 02:30 PM', sowingDate: '2024-03-01', orgId: 'org_1', subOrgId: 'sub_ktp_2' },
  { id: 'field_10', farmerId: 'f12', plotName: 'Champadevi Terrace Field', crop: 'Maize', area: 1.50, fieldScore: '0.75', status: 'Above', date: '2026-08-18 11:15 AM', sowingDate: '2024-01-20', orgId: 'org_1', subOrgId: 'sub_ktp_3' },
  { id: 'field_1', farmerId: 'f1', plotName: 'Pentagon Farm', crop: 'Rice', area: 1.05, fieldScore: '0.65', status: 'Above', date: '2026-08-08 08:54 AM', sowingDate: '2023-12-17', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'field_2', farmerId: 'f1', plotName: 'Birgha ko khet', crop: 'Wheat', area: 0.61, fieldScore: '0.58', status: 'Below', date: '2026-08-08 08:55 AM', sowingDate: '2023-12-17', orgId: 'org_1', subOrgId: 'sub_2', hasPdfData: true },
  { id: 'field_3', farmerId: 'f1', plotName: 'Tomato Hub', crop: 'Tomato', area: 2.15, fieldScore: '0.72', status: 'Average', date: '2026-08-10 10:15 AM', sowingDate: '2024-01-10', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'field_4', farmerId: 'f1', plotName: 'Physical Farm', crop: 'Corn', area: 1.80, fieldScore: '0.68', status: 'Above', date: '2026-08-11 02:20 PM', sowingDate: '2024-02-01', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'field_5', farmerId: 'f2', plotName: 'Green Valley Plot', crop: 'Apple', area: 3.40, fieldScore: '0.55', status: 'Above', date: '2026-08-12 11:30 AM', sowingDate: '2023-11-15', orgId: 'org_1', subOrgId: 'sub_2' },
  { id: 'field_6', farmerId: 'f3', plotName: 'Pokhara Coffee Estate', crop: 'Coffee', area: 1.20, fieldScore: '0.60', status: 'Below', date: '2026-08-14 09:10 AM', sowingDate: '2023-05-20', orgId: 'org_1', subOrgId: 'sub_3' },
  { id: 'field_7', farmerId: 'f4', plotName: 'Fishery Basin 1', crop: 'Fisheries', area: 2.50, fieldScore: '0.82', status: 'Above', date: '2026-08-15 04:45 PM', sowingDate: '2024-03-01', orgId: 'org_2', subOrgId: 'sub_1' }
];

export const INITIAL_MESSAGES = [
  { id: 'msg1', datetime: '2026-08-17T10:00', message: 'Heavy rain expected. Secure crops.', status: 'Delivered', target: 'Kirtipur Municipality 1', orgId: 'org_1' },
  { id: 'msg2', datetime: '2026-08-18T14:00', message: 'Subsidized seeds available for autumn planting.', status: 'Scheduled', target: 'All Organizations', orgId: 'GLOBAL' },
  { id: 'msg3', datetime: '2026-08-19T09:30', message: 'Pest control advisory broadcast for Tomato cultivators.', status: 'Scheduled', target: 'Bethanchowk Rural Municipality', orgId: 'org_3' }
];

export const INITIAL_WARNINGS = [
  { id: 'w1', type: 'Critical', message: 'High Pest Infestation Risk (Tomato)', source: 'Satellite / Krishi Doctor', time: '10 mins ago', orgId: 'org_1', subOrgId: 'sub_ktp_1' },
  { id: 'w2', type: 'Warning', message: 'Low Soil Moisture (Stress Level Alert)', source: 'Meter MTR-5001', time: '1 hour ago', orgId: 'org_1', subOrgId: 'sub_ktp_1' },
  { id: 'w3', type: 'Alert', message: 'Heavy Rain Forecast (Erosion Risk)', source: 'Weather API', time: '2 hours ago', orgId: 'org_1', subOrgId: 'sub_ktp_2' }
];

export const INITIAL_ACCESS_CONTROL = {
  sendMessage: { 'org_1': true, 'org_2': false, 'org_3': true, 'sub_ktp_1': true, 'sub_ktp_2': true, 'sub_ktp_3': true, 'sub_1': true, 'sub_2': true, 'sub_3': false },
  addFarmers: { 'org_1': true, 'org_2': false, 'org_3': true, 'sub_ktp_1': true, 'sub_ktp_2': true, 'sub_ktp_3': true, 'sub_1': true, 'sub_2': false, 'sub_3': false }
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