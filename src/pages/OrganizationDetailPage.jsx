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
  Check 
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

export default function OrganizationDetailPage({ orgId, onNavigate }) {
  const { 
    organizations, 
    orgUsers, 
    subOrganizations, 
    addOrgUser, 
    removeOrgUser, 
    updateOrgUser 
  } = useData();

  const org = organizations.find(o => o.id === orgId) || organizations[0];
  const [selectedSubFilter, setSelectedSubFilter] = useState('All');
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

  const totalPages = Math.max(1, Math.ceil(usersList.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = usersList.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);

  const mappedSubOrgs = subOrganizations.filter(
    s => s.orgId === org?.id || s.parentOrgNum === org?.parentOrgNum
  );

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addOrgUser({
      orgId: org?.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      subOrgId: newUser.subOrgId || 'None'
    });
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', subOrgId: 'None' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('organizations')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-blue transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizations</span>
        </button>
      </div>

      {/* Main Title & Meta Bar (Matching Screenshot 2) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {org?.name?.split('(')[0]?.trim() || org?.name}
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 text-xs font-semibold text-gray-600">
          <div className="space-y-1">
            <p>No of Sub Organization: <span className="font-bold text-gray-900">{mappedSubOrgs.length}</span></p>
            <p>Total Users: <span className="font-bold text-gray-900">{usersList.length}</span></p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Select Sub-Organization:</span>
              <select
                value={selectedSubFilter}
                onChange={(e) => {
                  setSelectedSubFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white outline-none focus:border-brand-blue shadow-xs cursor-pointer min-w-[100px]"
              >
                <option value="All">All</option>
                {mappedSubOrgs.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Unique Code: </span>
              <span className="font-mono font-bold text-gray-900">{org?.code || '5004'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 2 Breakdown Cards (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Organizational Profile Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-gray-800">Organizational Profile Breakdown</h2>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              CURRENT OCCUPATION (USERS)
            </p>
            <div className="space-y-1.5 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Farming in the village:</span>
                <span className="font-bold text-gray-900">1 (7.69%)</span>
              </div>
              <div className="flex justify-between">
                <span>Studying agriculture:</span>
                <span className="font-bold text-gray-900">1 (7.69%)</span>
              </div>
              <div className="flex justify-between">
                <span>Farming in the city:</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span>Agriculture service provider:</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span>Unknown / Other:</span>
                <span className="font-bold text-gray-900">11 (84.62%)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              LEARNING INTERESTS (USERS)
            </p>
            <div className="space-y-1.5 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Crop farming:</span>
                <span className="font-bold text-gray-900">1 (7.69%)</span>
              </div>
              <div className="flex justify-between">
                <span>Fish farming:</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between">
                <span>Livestock farming:</span>
                <span className="font-bold text-gray-900">1 (7.69%)</span>
              </div>
              <div className="flex justify-between">
                <span>Unknown / Other:</span>
                <span className="font-bold text-gray-900">11 (84.62%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: User Activities Information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-gray-800 mb-4">User Activities Information</h2>

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

      {/* Section 3: Users in Sub-Organization (Matching Screenshot 2 Table) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Users in Sub-Organization</h2>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 bg-[#3894db] hover:bg-[#2b7bb8] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>
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
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/20 transition">
                  <td className="px-6 py-3.5 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-3.5 text-gray-500 font-mono">{u.email || '-'}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-700">{u.phone}</td>
                  <td className="px-6 py-3.5">
                    <select
                      value={u.orgId}
                      onChange={(e) => updateOrgUser(u.id, { orgId: e.target.value })}
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
                      onChange={(e) => updateOrgUser(u.id, { subOrgId: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 bg-white outline-none focus:border-brand-blue cursor-pointer max-w-[140px] truncate"
                    >
                      <option value="None">None</option>
                      {mappedSubOrgs.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => removeOrgUser(u.id)}
                      className="px-3.5 py-1 border border-[#3894db] text-[#3894db] hover:bg-blue-50 rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
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
        title="Add User to Organization"
        subtitle={`Assign user to ${org?.name}`}
      >
        <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">User Full Name *</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Ramesh Timalsina"
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
              className="px-6 py-2.5 bg-[#3894db] hover:bg-[#2b7bb8] text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
