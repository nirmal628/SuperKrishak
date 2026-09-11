import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Trophy,
  Network,
  UserCheck,
  ChevronRight,
  Info,
  ChevronLeft
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Filler, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function FarmersNetworkPage({ onNavigate, onSelectFarmer }) {
  const { isAdmin, isOrg, isSubOrg, entityId } = useAuth();
  const { 
    farmers, 
    organizations, 
    subOrganizations, 
    addFarmer, 
    accessControl 
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedSubOrg, setSelectedSubOrg] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination & Trend Timeframe States
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;
  const [trendTimeframe, setTrendTimeframe] = useState('Weekly');

  const availableSubOrganizations = isSubOrg
    ? subOrganizations.filter(s => s.id === entityId)
    : isOrg
      ? subOrganizations.filter(s => s.orgId === entityId)
      : subOrganizations;

  const [newFarmer, setNewFarmer] = useState({
    name: '',
    mobile: '',
    ageGroup: '30-40',
    email: '',
    occupation: 'Commercial Farmer',
    location: 'Kathmandu',
    orgId: organizations[0]?.id || '',
    subOrgId: availableSubOrganizations[0]?.id || '',
    gender: 'Male',
    farmingType: 'Crops'
  });

  const canAddFarmer = isAdmin || (isOrg && accessControl.addFarmers[entityId]) || (isSubOrg && accessControl.addFarmers[entityId]);

  let scopedFarmers = [...farmers];
  if (isOrg) scopedFarmers = scopedFarmers.filter(f => f.orgId === entityId);
  if (isSubOrg) scopedFarmers = scopedFarmers.filter(f => f.subOrgId === entityId);

  if (selectedSubOrg !== 'ALL') {
    scopedFarmers = scopedFarmers.filter(f => f.subOrgId === selectedSubOrg);
  }

  const dashboardFarmers = [...scopedFarmers];

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    scopedFarmers = scopedFarmers.filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.mobile.includes(q) ||
      f.location.toLowerCase().includes(q)
    );
  }

  if (filterType !== 'ALL') {
    scopedFarmers = scopedFarmers.filter(f => f.farmingType === filterType);
  }

  const totalFarmersCount = dashboardFarmers.length || 145;
  const activeCount = dashboardFarmers.filter(f => f.status === 'Active' || f.status === 'Highly Active').length || 86;

  const villageCount = Math.round(totalFarmersCount * 0.50);
  const studyingCount = Math.round(totalFarmersCount * 0.32);
  const proCount = totalFarmersCount - villageCount - studyingCount;

  // High contrast Green-Domain palette (matching Image 2)
  const occupationData = {
    labels: ['Farming in Village', 'Studying Agriculture', 'Agriculture Professional'],
    datasets: [{
      data: [villageCount, studyingCount, proCount],
      backgroundColor: ['#00C88C', '#0A5C43', '#76E5BC'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const trendDatasets = {
    Weekly: {
      labels: ['Jun 01', 'Jun 08', 'Jun 15', 'Jun 22', 'Jun 29', 'Jul 06', 'Jul 13', 'Jul 20', 'Jul 27', 'Aug 01'],
      data: [40, 50, 45, 68, 60, 86, 60, 55, 75, 85],
      score: 74,
      interactions: '18,450',
      growth: '+2%'
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [320, 410, 480, 520, 610, 750, 890, 940, 1020, 1150, 1280, 1420],
      score: 82,
      interactions: '78,200',
      growth: '+12%'
    },
    Yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
      data: [12, 28, 45, 62, 80, 95],
      score: 89,
      interactions: '345,000',
      growth: '+28%'
    }
  };

  const currentTrend = trendDatasets[trendTimeframe] || trendDatasets.Weekly;

  const engagementData = { 
    labels: currentTrend.labels, 
    datasets: [{ 
      data: currentTrend.data, 
      borderColor: '#008F83', 
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(0, 143, 131, 0.18)');
        gradient.addColorStop(1, 'rgba(0, 143, 131, 0.0)');
        return gradient;
      },
      fill: true, 
      tension: 0.4, 
      pointRadius: 4, 
      pointBackgroundColor: '#008F83',
      pointHoverRadius: 6
    }] 
  };

  const lineOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { legend: { display: false } }, 
    scales: { 
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9CA3AF' } }, 
      y: { beginAtZero: true, grid: { color: '#F3F4F6' }, ticks: { font: { size: 10 }, color: '#9CA3AF' } } 
    } 
  };

  const donutOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    cutout: '72%', 
    plugins: { legend: { display: false }, tooltip: { enabled: true } } 
  };

  const renderStatusBadge = (status, rating = 50) => {
    let type = status;
    if (!['Highly Active', 'Moderate', 'Low Active'].includes(status)) {
      if (rating >= 70) type = 'Highly Active';
      else if (rating >= 40) type = 'Moderate';
      else type = 'Low Active';
    }

    switch (type) {
      case 'Highly Active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#D3EEDD] text-[#0B6651] inline-block">
            Highly Active
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ECE3C8] text-[#8C6422] inline-block">
            Moderate
          </span>
        );
      case 'Low Active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5D8D8] text-[#B83232] inline-block">
            Low Active
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
            {type}
          </span>
        );
    }
  };

  const exportFarmers = () => {
    const csv = ['Name,Mobile,Location,Farming Class,Status', ...scopedFarmers.map(f => [f.name, f.mobile, f.location, f.farmingType, f.status].join(','))].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'farmers.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleAddFarmerSubmit = (e) => {
    e.preventDefault();
    addFarmer({
      ...newFarmer,
      orgId: isOrg ? entityId : newFarmer.orgId,
      subOrgId: isSubOrg ? entityId : newFarmer.subOrgId
    });
    setIsAddModalOpen(false);
    setNewFarmer({
      name: '',
      mobile: '',
      ageGroup: '30-40',
      email: '',
      occupation: 'Commercial Farmer',
      location: 'Kathmandu',
      orgId: organizations[0]?.id || '',
      subOrgId: availableSubOrganizations[0]?.id || '',
      gender: 'Male',
      farmingType: 'Crops'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-1000 tracking-tight">Farmers</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Track and analyze user engagement across your organization.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedSubOrg} 
            onChange={e => setSelectedSubOrg(e.target.value)} 
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 bg-white shadow-xs outline-none cursor-pointer"
          >
            <option value="ALL">All sub organizations</option>
            {availableSubOrganizations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {canAddFarmer && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#008F83] hover:bg-[#00756C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Farmer</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 border border-gray-100">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sub Organizations</p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">
              {selectedSubOrg === 'ALL' ? availableSubOrganizations.length || 4 : 1}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 border border-gray-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Farmers</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-gray-900">{totalFarmersCount}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">+2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 border border-gray-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Active</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-gray-900">{activeCount}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">+2%</span>
              </div>
            </div>
          </div>

          <div className="relative group self-start">
            <button className="text-gray-400 hover:text-gray-600 transition">
              <Info className="w-4 h-4" />
            </button>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 bg-[#0B2533] text-white text-[11px] p-2.5 rounded-lg shadow-lg z-20 leading-snug">
              This represents the number of users who have at least used the app since last week..
              <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-[#0B2533]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Leaderboard</p>
            <button 
              onClick={() => onNavigate && onNavigate('farmer_leaderboard')}
              className="text-xs font-bold text-gray-900 hover:text-[#008F83] transition flex items-center gap-1 mt-1 group"
            >
              <span>View all user rankings</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#008F83] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-white border border-gray-100 rounded-xl shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900">Engagement Trend</h2>
              <div className="flex gap-1 text-[11px] bg-gray-100/80 p-0.5 rounded-lg font-medium text-gray-500">
                {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTrendTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md transition ${
                      trendTimeframe === tf
                        ? 'bg-white shadow-xs text-gray-900 font-bold'
                        : 'hover:text-gray-900 text-gray-500'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-52 mt-4">
              <Line data={engagementData} options={lineOptions} />
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-2">
            <div>
              <p className="text-[11px] font-medium text-gray-500">Engagement Score (Avg)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{currentTrend.score}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {currentTrend.growth}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-500">Total Interactions</p>
              <div className="flex items-baseline justify-end gap-2 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{currentTrend.interactions}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {currentTrend.growth}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-xl shadow-xs p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Occupation Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center min-h-[220px]">
            <div className="sm:col-span-7 relative h-56 flex items-center justify-center">
              <Doughnut data={occupationData} options={donutOptions} redraw={true} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-900 leading-none">{totalFarmersCount}</span>
                <span className="text-xs font-semibold text-gray-400 mt-1">Total Farmers</span>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-3 pl-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C88C] shrink-0"></span>
                <span className="text-gray-700 font-medium truncate">Farming in Village</span>
                <span className="text-gray-400 font-normal ml-auto shrink-0">50% ({villageCount})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A5C43] shrink-0"></span>
                <span className="text-gray-700 font-medium truncate">Studying Agriculture</span>
                <span className="text-gray-400 font-normal ml-auto shrink-0">32% ({studyingCount})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#76E5BC] shrink-0"></span>
                <span className="text-gray-700 font-medium truncate">Agriculture Professional</span>
                <span className="text-gray-400 font-normal ml-auto shrink-0">18% ({proCount})</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search farmers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#008F83] bg-white shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none bg-white shadow-xs cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Crops">Crops</option>
              <option value="Livestock">Livestock</option>
              <option value="Fisheries">Fisheries</option>
              <option value="Others">Others</option>
            </select>
            <button onClick={exportFarmers} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Sub Organization</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Training Attended</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scopedFarmers.map((f) => (
                <tr key={f.id} className="hover:bg-emerald-50/20 transition">
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-800">{f.name}</p>
                    <p className="text-[10px] text-gray-500">{f.mobile}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {subOrganizations.find(s => s.id === f.subOrgId)?.name || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#16A66A] h-full rounded-full"
                          style={{ width: `${f.rating || 50}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{f.rating || 50}/100</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{f.activities?.trainingsAttended || 0}</td>
                  
                  <td className="px-4 py-3">
                    {renderStatusBadge(f.status, f.rating)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        onSelectFarmer(f.id);
                        onNavigate('farmer_detail');
                      }}
                      className="px-3 py-1.5 bg-[#E8F4F3] hover:bg-[#008F83] text-[#008F83] hover:text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
              {scopedFarmers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 font-medium">
                    No farmer records found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-2 text-xs font-medium text-gray-500">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 hover:text-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition font-semibold ${
                currentPage === page 
                  ? 'bg-[#00875A] text-white' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <span className="px-1 text-gray-400 font-bold">...</span>
          
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition font-semibold ${
              currentPage === totalPages 
                ? 'bg-[#00875A] text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {totalPages}
          </button>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 hover:text-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Farmer"
        subtitle="Register farmer to the intelligence hub and map organization."
      >
        <form onSubmit={handleAddFarmerSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Farmer Full Name *</label>
              <input
                type="text"
                required
                value={newFarmer.name}
                onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                placeholder="e.g. Ramesh Karki"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Mobile Number *</label>
              <input
                type="tel"
                required
                value={newFarmer.mobile}
                onChange={(e) => setNewFarmer({ ...newFarmer, mobile: e.target.value })}
                placeholder="98XXXXXXXX"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={newFarmer.gender}
                onChange={(e) => setNewFarmer({ ...newFarmer, gender: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Age Group</label>
              <select
                value={newFarmer.ageGroup}
                onChange={(e) => setNewFarmer({ ...newFarmer, ageGroup: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white cursor-pointer"
              >
                <option value="20-30">20-30</option>
                <option value="30-40">30-40</option>
                <option value="40-50">40-50</option>
                <option value="50+">50+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Farming Class</label>
              <select
                value={newFarmer.farmingType}
                onChange={(e) => setNewFarmer({ ...newFarmer, farmingType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white cursor-pointer"
              >
                <option value="Crops">Crops</option>
                <option value="Livestock">Livestock</option>
                <option value="Fisheries">Fisheries</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Location / District *</label>
              <input
                type="text"
                required
                value={newFarmer.location}
                onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
                placeholder="e.g. Kavre"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Occupation</label>
              <input
                type="text"
                value={newFarmer.occupation}
                onChange={(e) => setNewFarmer({ ...newFarmer, occupation: e.target.value })}
                placeholder="e.g. Commercial Horticulture"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#00B074] bg-white"
              />
            </div>
          </div>

          {(isAdmin || isOrg) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isAdmin && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Assign Parent Org</label>
                  <select
                    value={newFarmer.orgId}
                    onChange={(e) => setNewFarmer({ ...newFarmer, orgId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-600 bg-white cursor-pointer"
                  >
                    {organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Assign Sub-Org</label>
                <select
                  value={newFarmer.subOrgId}
                  onChange={(e) => setNewFarmer({ ...newFarmer, subOrgId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600 bg-white cursor-pointer"
                >
                  <option value="">None / Unassigned</option>
                  {availableSubOrganizations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#008F83] hover:bg-[#00756C] text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              Add Farmer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}