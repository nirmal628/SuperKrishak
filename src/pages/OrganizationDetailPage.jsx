import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Users, 
  Activity, 
  Check,
  Search,
  Download
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrganizationDetailPage({ orgId, onNavigate }) {
  const { 
    organizations, 
    orgUsers,
    farmers,
    subOrganizations, 
    addFarmer
  } = useData();

  const org = organizations.find(o => o.id === orgId) || organizations[0];
  const [selectedSubFilter, setSelectedSubFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const pageSize = 10;

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    subOrgId: 'None'
  });

  // Filter users for this org
  let usersList = orgUsers.filter(u => u.orgId === org?.id);
  if (selectedSubFilter !== 'All') {
    usersList = usersList.filter(u => u.subOrgId === selectedSubFilter);
  }

  const mappedSubOrgs = subOrganizations.filter(
    s => s.orgId === org?.id || s.parentOrgNum === org?.parentOrgNum
  );

  let farmerList = farmers.filter(f => f.orgId === org?.id);
  if (selectedSubFilter !== 'All') farmerList = farmerList.filter(f => f.subOrgId === selectedSubFilter);
  if (searchTerm.trim()) farmerList = farmerList.filter(f => `${f.name} ${f.mobile}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(farmerList.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedFarmers = farmerList.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);
  const occupationGroups = [
    ['Farming in the Village', farmerList.filter(f => /village|गाउँ/i.test(f.occupation || '')).length],
    ['Studying Agriculture', farmerList.filter(f => /stud|research|अध्ययन/i.test(f.occupation || '')).length],
    ['Farming in the City', farmerList.filter(f => /urban|city|शहर/i.test(f.occupation || '')).length],
    ['Agriculture Service Provider', farmerList.filter(f => /service/i.test(f.occupation || '')).length],
    ['Unknown / Other', farmerList.filter(f => !f.occupation).length],
  ];
  const profileChart = { labels: occupationGroups.map(([label]) => label), datasets: [{ data: occupationGroups.map(([, value]) => value || 0.1), backgroundColor: ['#08B989', '#087F63', '#35D59F', '#0A9B75', '#D8D8D8'], borderWidth: 0 }] };
  const profileOptions = { cutout: '65%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } } };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addFarmer({
      orgId: org?.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.phone,
      subOrgId: newUser.subOrgId || 'None'
    });
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', subOrgId: 'None' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Main Title & Meta Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            {org?.name?.split('(')[0]?.trim() || org?.name}
          </h1>
          <select value={selectedSubFilter} onChange={(e) => { setSelectedSubFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white outline-none focus:border-brand-blue shadow-xs cursor-pointer sm:min-w-[150px]">
            <option value="All">All sub organizations</option>
            {mappedSubOrgs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2 text-[11px] font-semibold text-gray-600">
          <div className="flex items-center gap-4 sm:gap-6 self-stretch sm:self-auto justify-between sm:justify-end">
            <div>
              <span className="text-gray-500 font-medium">Unique Code: </span>
              <span className="font-mono font-bold text-gray-900">{org?.code || '5004'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards and profile overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ['TOTAL FARMERS', farmerList.length, 'bg-[#EAF8F3] text-[#087F63]'],
          ['TOTAL SUB ORGANIZATIONS', mappedSubOrgs.length, 'bg-[#F1EEFF] text-[#6546B8]'],
          ['TOTAL FIELDS PLOTTED', '45', 'bg-[#FFF4DD] text-[#A66B00]'],
        ].map(([label, value, style]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style}`}><Users className="w-5 h-5" /></div>
            <div><p className="text-[10px] text-gray-500 tracking-wide">{label}</p><p className="text-xl font-extrabold text-gray-900">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Organizational Profile Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900">Farmers Profile</h2>
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center mt-5">
            
            {/* Doughnut Chart with Centered Total Overlay */}
            <div className="relative h-28 flex items-center justify-center">
              <Doughnut data={profileChart} options={profileOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] font-medium text-gray-400 leading-none mb-0.5">Total Farmers</span>
                <span className="text-sm font-bold text-gray-900 leading-tight">{farmerList.length}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] text-gray-600">
              <p className="text-[10px] uppercase text-gray-400 mb-2">CURRENT OCCUPATION (USERS)</p>
              {occupationGroups.map(([label, value], index) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <i className="w-2 h-2 rounded-full" style={{ backgroundColor: profileChart.datasets[0].backgroundColor[index] }} />
                    {label}
                  </span>
                  <b className="font-medium">{value}</b>
                </div>
              ))}
              <p className="text-[10px] uppercase text-gray-400 pt-2">LEARNING INTERESTS (USERS)</p>
              <div className="flex justify-between"><span>Crop Farming</span><b>{farmerList.filter(f => f.farmingType === 'Crops').length}</b></div>
              <div className="flex justify-between"><span>Livestock Farming</span><b>{farmerList.filter(f => f.farmingType === 'Livestock').length}</b></div>
            </div>
          </div>
        </div>

        {/* Right Card: User Activities Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-gray-900 mb-4">User Activities Overview</h2>

          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="flex justify-between">
              <span>Total Number Of Trainings Attended:</span>
              <span className="font-bold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Number Of Reactions:</span>
              <span className="font-bold text-gray-900">3</span>
            </div>
            <div className="flex justify-between">
              <span>Total Number Of Articles Read:</span>
              <span className="font-bold text-gray-900">40</span>
            </div>
            <div className="flex justify-between">
              <span>Total Quiz Participation:</span>
              <span className="font-bold text-gray-900">104</span>
            </div>
            <div className="flex justify-between">
              <span>Total Comments:</span>
              <span className="font-bold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Lands Plotted:</span>
              <span className="font-bold text-gray-900">10</span>
            </div>
            <div className="flex justify-between">
              <span>Total Disease Detection:</span>
              <span className="font-bold text-gray-900">4</span>
            </div>
            <div className="flex justify-between">
              <span>Total Community Post:</span>
              <span className="font-bold text-gray-900">1</span>
            </div>
            <div className="flex justify-between">
              <span>Total Community Comments:</span>
              <span className="font-bold text-gray-900">4</span>
            </div>
            <div className="flex justify-between">
              <span>Total Refers:</span>
              <span className="font-bold text-gray-900">9</span>
            </div>
            <div className="flex justify-between">
              <span>Total Soil Report:</span>
              <span className="font-bold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Calculator Use:</span>
              <span className="font-bold text-gray-900">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Farmers in Sub-Organization */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-white">
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Farmers in Sub-Organization</h2>
          <div className="flex flex-wrap gap-2">
            <label className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
              <input value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search Farmer..." className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-brand-blue" />
            </label>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />Export CSV</button>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3 py-1.5 bg-[#079B74] hover:bg-[#057D5F] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Farmer</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50/60 border-b border-gray-100 font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Assign Organization</th>
                <th className="px-6 py-3.5">Assign Sub-Organization</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedFarmers.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/20 transition">
                  <td className="px-6 py-3.5 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-3.5 text-gray-500 font-mono">{u.email || '-'}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-700">{u.mobile}</td>
                  <td className="px-6 py-3.5">
                    <select
                      value={u.orgId}
                      onChange={() => {}}
                      className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 bg-white outline-none focus:border-brand-blue cursor-pointer max-w-[180px] truncate"
                    >
                      {organizations.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                      value={u.subOrgId}
                      onChange={() => {}}
                      className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 bg-white outline-none focus:border-brand-blue cursor-pointer max-w-[140px] truncate"
                    >
                      <option value="None">None</option>
                      {mappedSubOrgs.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-[#008F83] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#00756C] transition-colors focus:outline-none"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        aria-label="Delete"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedFarmers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 font-medium">
                    No users registered under this organization unit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 border-t border-gray-100 bg-white">
          <Pagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add Farmer to Organization"
        subtitle={`Assign user to ${org?.name}`}
      >
        <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Farmer Full Name *</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Ramesh Thapa"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number *</label>
              <input
                type="tel"
                required
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="98XXXXXXXX"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email (Optional)</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@superkrishak.com"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Assign Sub-Organization</label>
            <select
              value={newUser.subOrgId}
              onChange={(e) => setNewUser({ ...newUser, subOrgId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
            >
              <option value="None">None</option>
              {mappedSubOrgs.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#21A9DF] hover:bg-[#168FC2] text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              Add Farmer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}