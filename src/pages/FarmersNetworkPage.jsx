import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Users, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Eye, 
  Award, 
  Coins, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import InfoTooltip from '../components/common/InfoTooltip';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FarmersNetworkPage({ onNavigate, onSelectFarmer }) {
  const { isAdmin, isOrg, isSubOrg, entityId, role } = useAuth();
  const { 
    farmers, 
    organizations, 
    subOrganizations, 
    addFarmer, 
    accessControl 
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const availableSubOrganizations = isOrg
    ? subOrganizations.filter(s => s.orgId === entityId)
    : subOrganizations;

  // New farmer form state
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

  // Permission check
  const canAddFarmer = isAdmin || (isOrg && accessControl.addFarmers[entityId]) || (isSubOrg && accessControl.addFarmers[entityId]);

  // Scope dataset
  let scopedFarmers = [...farmers];
  if (isOrg) scopedFarmers = scopedFarmers.filter(f => f.orgId === entityId);
  if (isSubOrg) scopedFarmers = scopedFarmers.filter(f => f.subOrgId === entityId);

  // Filter
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

  // Demographics stats
  const maleCount = scopedFarmers.filter(f => f.gender === 'Male').length;
  const femaleCount = scopedFarmers.filter(f => f.gender === 'Female').length;
  const activeCount = scopedFarmers.filter(f => f.status === 'Active').length;

  const cropsCount = scopedFarmers.filter(f => f.farmingType === 'Crops').length;
  const livestockCount = scopedFarmers.filter(f => f.farmingType === 'Livestock').length;
  const fisheriesCount = scopedFarmers.filter(f => f.farmingType === 'Fisheries').length;
  const othersCount = scopedFarmers.filter(f => f.farmingType === 'Others').length;

  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#205B90', '#EC4899'],
      borderWidth: 0
    }]
  };

  const farmingTypeChartData = {
    labels: ['Crops', 'Livestock', 'Fisheries', 'Others'],
    datasets: [{
      data: [cropsCount, livestockCount, fisheriesCount, othersCount],
      backgroundColor: ['#2DA86E', '#F59E0B', '#3B82F6', '#8B5CF6'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }
    },
    cutout: '65%'
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farmers Network</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Digital Registry & Demographics Intelligence.</p>
        </div>
        {canAddFarmer && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-green hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Beneficiary</span>
          </button>
        )}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Box */}
        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Total Registered</span>
              <InfoTooltip className="absolute top-1 right-1" text="The total number of farmer records currently visible after applying your access scope and filters." />
            </div>
            <p className="text-4xl font-black text-gray-900 mt-2">{scopedFarmers.length}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Active Beneficiaries</span>
              <span className="font-bold text-gray-800">{activeCount}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-gray-400" /> Inactive</span>
              <span className="font-bold text-gray-800">{scopedFarmers.length - activeCount}</span>
            </div>
          </div>
        </div>

        {/* Gender Breakdown Chart */}
        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Gender Demographics</span>
            <InfoTooltip className="absolute top-1 right-1" text="The visible farmer records grouped by their recorded gender." />
          </div>
          <div className="h-44 relative">
            <Doughnut data={genderChartData} options={chartOptions} />
          </div>
        </div>

        {/* Farming Type Chart */}
        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Farming Class Distribution</span>
            <InfoTooltip className="absolute top-1 right-1" text="The visible farmer records grouped by farming class, such as crops, livestock, or fisheries." />
          </div>
          <div className="h-44 relative">
            <Pie data={farmingTypeChartData} options={{ ...chartOptions, cutout: '0%' }} />
          </div>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-blue bg-white shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none bg-white shadow-xs cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Crops">Crops</option>
              <option value="Livestock">Livestock</option>
              <option value="Fisheries">Fisheries</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4">Farmer Details</th>
                <th className="px-6 py-4">Occupation & Class</th>
                <th className="px-6 py-4">Rating Index</th>
                <th className="px-6 py-4">Rewards</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scopedFarmers.map((f) => (
                <tr key={f.id} className="hover:bg-blue-50/20 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-base">{f.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-blue" /> {f.mobile}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-green" /> {f.location}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{f.occupation}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-bold">
                      {f.farmingType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-brand-green h-full rounded-full" 
                          style={{ width: `${f.rating || 50}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{f.rating || 50}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      {f.coins || 0} Coins
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                      f.status === 'Active' ? 'bg-green-50 text-brand-green border border-green-100' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        onSelectFarmer(f.id);
                        onNavigate('farmer_detail');
                      }}
                      className="px-4 py-1.5 bg-blue-50 hover:bg-brand-blue text-brand-blue hover:text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
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
      </div>

      {/* Modal: Onboard Farmer */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Beneficiary"
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white"
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={newFarmer.gender}
                onChange={(e) => setNewFarmer({ ...newFarmer, gender: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white cursor-pointer"
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white cursor-pointer"
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white cursor-pointer"
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Occupation</label>
              <input
                type="text"
                value={newFarmer.occupation}
                onChange={(e) => setNewFarmer({ ...newFarmer, occupation: e.target.value })}
                placeholder="e.g. Commercial Horticulture"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white"
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
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
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
              className="px-6 py-2.5 bg-brand-green hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              Complete Onboarding
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
