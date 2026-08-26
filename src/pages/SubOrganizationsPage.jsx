import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  MapPin, 
  AlertTriangle,
  GitMerge,
  Building2
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

export default function SubOrganizationsPage() {
  const { isAdmin } = useAuth();
  const { 
    organizations, 
    subOrganizations, 
    addSubOrganization, 
    updateSubOrganization, 
    deleteSubOrganization 
  } = useData();

  // "All Sub Organizations" table state & 4 filters
  const [filterName, setFilterName] = useState('');
  const [filterParentOrg, setFilterParentOrg] = useState('ALL');
  const [filterShortName, setFilterShortName] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pageSize = 10;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editSub, setEditSub] = useState(null);
  const [deleteSubTarget, setDeleteSubTarget] = useState(null);

  // Form states for new sub-org
  const [newSubForm, setNewSubForm] = useState({
    orgId: organizations[0]?.id || '',
    name: '',
    shortName: '',
    code: '',
    skAdminId: '',
    address: '',
    email: '',
    password: ''
  });

  // Filter & Sort logic for All Sub Organizations
  let filteredSubs = [...subOrganizations];

  if (filterName.trim()) {
    const q = filterName.toLowerCase().trim();
    filteredSubs = filteredSubs.filter(s => s.name.toLowerCase().includes(q));
  }

  if (filterParentOrg !== 'ALL') {
    const parentNum = parseInt(filterParentOrg, 10);
    filteredSubs = filteredSubs.filter(s => {
      if (!isNaN(parentNum) && s.parentOrgNum !== undefined) {
        return s.parentOrgNum === parentNum;
      }
      return s.orgId === filterParentOrg;
    });
  }

  if (filterShortName.trim()) {
    const q = filterShortName.toLowerCase().trim();
    filteredSubs = filteredSubs.filter(s => (s.shortName || '').toLowerCase().includes(q));
  }

  if (sortBy === 'name_asc') {
    filteredSubs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name_desc') {
    filteredSubs.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'code_asc') {
    filteredSubs.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  } else if (sortBy === 'code_desc') {
    filteredSubs.sort((a, b) => (b.code || '').localeCompare(a.code || ''));
  }

  const totalPages = Math.max(1, Math.ceil(filteredSubs.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedSubs = filteredSubs.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);

  const getParentOrgName = (sub) => {
    if (sub.orgId) {
      const org = organizations.find(o => o.id === sub.orgId);
      if (org) return org.name;
    }
    if (sub.parentOrgNum !== undefined) {
      const org = organizations.find(o => o.parentOrgNum === sub.parentOrgNum);
      if (org) return org.name;
    }
    return `Parent Org #${sub.parentOrgNum || 1}`;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addSubOrganization({
      orgId: newSubForm.orgId || organizations[0]?.id,
      name: newSubForm.name,
      shortName: newSubForm.shortName || newSubForm.name,
      code: newSubForm.code || Math.floor(1000 + Math.random() * 9000).toString(),
      skAdminId: newSubForm.skAdminId,
      address: newSubForm.address,
      status: 'Active'
    });
    setIsAddModalOpen(false);
    setNewSubForm({ orgId: organizations[0]?.id || '', name: '', shortName: '', code: '', skAdminId: '', address: '', email: '', password: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editSub) return;
    updateSubOrganization(editSub.id, {
      name: editSub.name,
      shortName: editSub.shortName,
      code: editSub.code,
      skAdminId: editSub.skAdminId,
      orgId: editSub.orgId,
      address: editSub.address,
      status: editSub.status
    });
    setEditSub(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteSubTarget) return;
    deleteSubOrganization(deleteSubTarget.id);
    setDeleteSubTarget(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Sub-Organizations Top Section */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sub-Organizations</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Ward-level and regional operational units.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Map New Sub-Org</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Unit Identity</th>
                <th className="px-6 py-4">Parent Link</th>
                <th className="px-6 py-4">SK Sync ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subOrganizations.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-purple-50/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-base">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{s.address}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                      <GitMerge className="w-3.5 h-3.5" />
                      {getParentOrgName(s)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-brand-blue border border-blue-100 rounded-lg font-mono text-xs font-bold">
                      {s.skAdminId || `SK-SUB-${s.code}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditSub({ ...s })}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition text-xs font-bold inline-flex items-center gap-1.5 bg-white shadow-xs"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. All Sub Organizations Section (Matching Screenshot 3) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header with Collapse Toggle */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center cursor-pointer select-none"
        >
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">All Sub Organizations</h2>
          <button type="button" className="text-gray-400 hover:text-gray-600 transition">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* 4 Filters Row */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              {/* Filter 1: Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[40px]">Name</label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs"
                />
              </div>

              {/* Filter 2: Parent Organization */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[70px]">Parent Org</label>
                <select
                  value={filterParentOrg}
                  onChange={(e) => {
                    setFilterParentOrg(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs cursor-pointer truncate"
                >
                  <option value="ALL">Select parent organization</option>
                  {organizations.map(o => (
                    <option key={o.id} value={o.parentOrgNum || o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Short Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[75px]">Short Name</label>
                <input
                  type="text"
                  value={filterShortName}
                  onChange={(e) => {
                    setFilterShortName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by short name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs"
                />
              </div>

              {/* Filter 4: Sort By */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[55px]">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs cursor-pointer"
                >
                  <option value="default">Select sort</option>
                  <option value="name_asc">Name (A - Z)</option>
                  <option value="name_desc">Name (Z - A)</option>
                  <option value="code_asc">Unique Code (Asc)</option>
                  <option value="code_desc">Unique Code (Desc)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/60 border-b border-gray-100 text-xs font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Parent Organization</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Unique Code</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedSubs.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 text-gray-800 text-sm font-medium">{s.name}</td>
                      <td className="px-6 py-4 text-gray-700 text-sm font-semibold">
                        {s.parentOrgNum !== undefined ? s.parentOrgNum : (organizations.findIndex(o => o.id === s.orgId) + 1 || 1)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-mono">{s.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setEditSub({ ...s })}
                            className="px-4 py-1.5 bg-[#3894db] hover:bg-[#2b7bb8] text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteSubTarget(s)}
                              className="px-4 py-1.5 bg-white border border-[#3894db] text-[#3894db] hover:bg-blue-50 rounded-lg text-xs font-semibold shadow-xs transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedSubs.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-medium">
                        No sub-organizations found matching filter criteria.
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
          </>
        )}
      </div>

      {/* Modal: Map New Sub-Organization */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Map Sub-Organization"
        subtitle="Create ward or sub-unit mapped to a parent organization."
      >
        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="p-2 bg-blue-100 rounded-lg text-brand-blue flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">
                SK Admin Portal Integration ID *
              </label>
              <input
                type="text"
                required
                value={newSubForm.skAdminId}
                onChange={(e) => setNewSubForm({ ...newSubForm, skAdminId: e.target.value })}
                placeholder="SK-SUB-XXXX"
                className="w-full border border-blue-300 rounded-lg p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-xs bg-white"
              />
              <p className="text-[10px] text-blue-600 mt-1 font-medium">
                This ID hooks into the central database to automatically import and synchronize farmer records.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Parent Organization *</label>
            <select
              required
              value={newSubForm.orgId}
              onChange={(e) => setNewSubForm({ ...newSubForm, orgId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
            >
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Sub-Org Full Name *</label>
              <input
                type="text"
                required
                value={newSubForm.name}
                onChange={(e) => setNewSubForm({ ...newSubForm, name: e.target.value })}
                placeholder="e.g. Bhakhanje Tea Estate"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Unique Code *</label>
              <input
                type="text"
                required
                value={newSubForm.code}
                onChange={(e) => setNewSubForm({ ...newSubForm, code: e.target.value })}
                placeholder="e.g. 9795"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Name</label>
              <input
                type="text"
                value={newSubForm.shortName}
                onChange={(e) => setNewSubForm({ ...newSubForm, shortName: e.target.value })}
                placeholder="e.g. Bhakhanje"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                required
                value={newSubForm.address}
                onChange={(e) => setNewSubForm({ ...newSubForm, address: e.target.value })}
                placeholder="e.g. Solukhumbu"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 relative mt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Sub-Org Unit Access Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Unit Email</label>
                <input
                  type="email"
                  required
                  value={newSubForm.email}
                  onChange={(e) => setNewSubForm({ ...newSubForm, email: e.target.value })}
                  placeholder="suborg@superkrishak"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Secure Password</label>
                <input
                  type="password"
                  required
                  value={newSubForm.password}
                  onChange={(e) => setNewSubForm({ ...newSubForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600 bg-white"
                />
              </div>
            </div>
          </div>

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
              className="px-6 py-2.5 bg-brand-blue hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              Save Sub-Organization
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Sub-Organization */}
      {editSub && (
        <Modal
          isOpen={!!editSub}
          onClose={() => setEditSub(null)}
          title="Edit Sub-Organization"
          subtitle="Update unit parameters."
        >
          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3.5 items-start">
              <div className="p-2 bg-blue-100 rounded-lg text-brand-blue flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">
                  SK Admin Portal Integration ID *
                </label>
                <input
                  type="text"
                  required
                  value={editSub.skAdminId || ''}
                  onChange={(e) => setEditSub({ ...editSub, skAdminId: e.target.value })}
                  placeholder="SK-SUB-XXXX"
                  className="w-full border border-blue-300 rounded-lg p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-xs bg-white"
                />
                <p className="text-[10px] text-blue-600 mt-1 font-medium">
                  Update the ID used to synchronize this sub-organization with the central database.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Parent Organization</label>
              <select
                value={editSub.orgId || ''}
                onChange={(e) => setEditSub({ ...editSub, orgId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Sub-Org Full Name</label>
              <input
                type="text"
                required
                value={editSub.name}
                onChange={(e) => setEditSub({ ...editSub, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Unique Code</label>
                <input
                  type="text"
                  required
                  value={editSub.code || ''}
                  onChange={(e) => setEditSub({ ...editSub, code: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Name</label>
                <input
                  type="text"
                  value={editSub.shortName || ''}
                  onChange={(e) => setEditSub({ ...editSub, shortName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                required
                value={editSub.address || ''}
                onChange={(e) => setEditSub({ ...editSub, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditSub(null)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3894db] hover:bg-[#2b7bb8] text-white font-bold rounded-xl shadow-md transition text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteSubTarget && (
        <Modal
          isOpen={!!deleteSubTarget}
          onClose={() => setDeleteSubTarget(null)}
          title="Delete Sub-Organization"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="p-6 space-y-4">
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">
                Are you sure you want to delete <strong>{deleteSubTarget.name}</strong> (Code: <span className="font-mono font-bold">{deleteSubTarget.code}</span>)?
              </p>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteSubTarget(null)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition text-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
