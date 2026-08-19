import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  Eye, 
  MapPin, 
  AlertTriangle,
  Building2,
  GitMerge,
  Users
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

export default function OrganizationsPage({ onNavigate, onSelectOrg }) {
  const { isAdmin } = useAuth();
  const { 
    organizations, 
    subOrganizations,
    farmers,
    addOrganization, 
    updateOrganization, 
    deleteOrganization 
  } = useData();

  // "All Organizations" table state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pageSize = 10;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState(null);
  const [deleteOrgTarget, setDeleteOrgTarget] = useState(null);

  // Form states for new org
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    shortName: '',
    code: '',
    skAdminId: '',
    address: '',
    email: '',
    password: ''
  });

  // Filter & Sort logic for All Organizations
  let filteredOrgs = [...organizations];
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase().trim();
    filteredOrgs = filteredOrgs.filter(o => 
      o.name.toLowerCase().includes(q) ||
      (o.code && o.code.toLowerCase().includes(q)) ||
      (o.shortName && o.shortName.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'name_asc') {
    filteredOrgs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name_desc') {
    filteredOrgs.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'code_asc') {
    filteredOrgs.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  } else if (sortBy === 'code_desc') {
    filteredOrgs.sort((a, b) => (b.code || '').localeCompare(a.code || ''));
  }

  const totalPages = Math.max(1, Math.ceil(filteredOrgs.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrgs = filteredOrgs.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addOrganization({
      name: newOrgForm.name,
      shortName: newOrgForm.shortName || newOrgForm.name,
      code: newOrgForm.code || Math.floor(1000 + Math.random() * 9000).toString(),
      skAdminId: newOrgForm.skAdminId,
      address: newOrgForm.address,
      status: 'Active'
    });
    setIsAddModalOpen(false);
    setNewOrgForm({ name: '', shortName: '', code: '', skAdminId: '', address: '', email: '', password: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editOrg) return;
    updateOrganization(editOrg.id, {
      name: editOrg.name,
      shortName: editOrg.shortName,
      code: editOrg.code,
      skAdminId: editOrg.skAdminId,
      address: editOrg.address,
      status: editOrg.status
    });
    setEditOrg(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteOrgTarget) return;
    deleteOrganization(deleteOrgTarget.id);
    setDeleteOrgTarget(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Parent Organizations Top Section (Matching Screenshot 1) */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Parent Organizations</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Institutions synchronized with SK Admin Portal.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Link New Organization</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Organization Identity</th>
                <th className="px-6 py-4">SK Sync ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {organizations.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-base">{o.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{o.address}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-brand-blue border border-blue-100 rounded-lg font-mono text-xs font-bold inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      {o.skAdminId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-50 text-brand-green border border-green-100 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green pulse-dot"></span>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditOrg({ ...o })}
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

      {/* 2. All Organizations Table Section (Matching Screenshot 2) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header with Collapse Toggle */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center cursor-pointer select-none"
        >
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">All Organizations</h2>
          <button type="button" className="text-gray-400 hover:text-gray-600 transition">
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Filter Row */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-sm">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search all fields"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs transition"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3.5 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white shadow-xs cursor-pointer min-w-[160px]"
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
                    <th className="px-6 py-4 font-semibold text-gray-600">Unique Code</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrgs.map((o) => (
                    <tr key={o.id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 text-gray-800 text-sm font-medium">{o.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-mono">{o.code || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setEditOrg({ ...o })}
                            className="px-4 py-1.5 bg-[#3894db] hover:bg-[#2b7bb8] text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteOrgTarget(o)}
                              className="px-4 py-1.5 bg-white border border-[#3894db] text-[#3894db] hover:bg-blue-50 rounded-lg text-xs font-semibold shadow-xs transition"
                            >
                              Delete
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onSelectOrg(o.id);
                              onNavigate('organization_detail');
                            }}
                            className="px-4 py-1.5 bg-[#3894db] hover:bg-[#2b7bb8] text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            View More
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedOrgs.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-400 font-medium">
                        No organizations found matching search criteria.
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

      {/* Modal: Link New Organization */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Link Organization"
        subtitle="Sync database and create master access credentials."
      >
        <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
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
                value={newOrgForm.skAdminId}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, skAdminId: e.target.value })}
                placeholder="SK-ORG-XXXX"
                className="w-full border border-blue-300 rounded-lg p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-xs bg-white"
              />
              <p className="text-[10px] text-blue-600 mt-1 font-medium">
                This ID hooks into the central database to automatically import and synchronize farmer records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Organization Full Name *</label>
              <input
                type="text"
                required
                value={newOrgForm.name}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                placeholder="e.g. Bethanchowk Rural Municipality"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Unique Code *</label>
              <input
                type="text"
                required
                value={newOrgForm.code}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, code: e.target.value })}
                placeholder="e.g. 5004"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Name</label>
              <input
                type="text"
                value={newOrgForm.shortName}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, shortName: e.target.value })}
                placeholder="e.g. Bethanchowk RM"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                required
                value={newOrgForm.address}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, address: e.target.value })}
                placeholder="e.g. Kavrepalanchok, Bagmati"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 relative mt-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Generate Access Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Login Email</label>
                <input
                  type="email"
                  required
                  value={newOrgForm.email}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, email: e.target.value })}
                  placeholder="org@superkrishak"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Secure Password</label>
                <input
                  type="password"
                  required
                  value={newOrgForm.password}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-green bg-white"
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
              Establish Link
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Organization */}
      {editOrg && (
        <Modal
          isOpen={!!editOrg}
          onClose={() => setEditOrg(null)}
          title="Edit Organization"
          subtitle="Update organization identity and operational parameters."
        >
          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Organization Full Name</label>
              <input
                type="text"
                required
                value={editOrg.name}
                onChange={(e) => setEditOrg({ ...editOrg, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Unique Code</label>
                <input
                  type="text"
                  required
                  value={editOrg.code || ''}
                  onChange={(e) => setEditOrg({ ...editOrg, code: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">SK Sync ID</label>
                <input
                  type="text"
                  required
                  value={editOrg.skAdminId || ''}
                  onChange={(e) => setEditOrg({ ...editOrg, skAdminId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Name</label>
                <input
                  type="text"
                  value={editOrg.shortName || ''}
                  onChange={(e) => setEditOrg({ ...editOrg, shortName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
                <input
                  type="text"
                  required
                  value={editOrg.address || ''}
                  onChange={(e) => setEditOrg({ ...editOrg, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={editOrg.status || 'Active'}
                onChange={(e) => setEditOrg({ ...editOrg, status: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditOrg(null)}
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
      {deleteOrgTarget && (
        <Modal
          isOpen={!!deleteOrgTarget}
          onClose={() => setDeleteOrgTarget(null)}
          title="Delete Organization"
          subtitle="This action cannot be undone."
          maxWidth="max-w-md"
        >
          <div className="p-6 space-y-4">
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">
                Are you sure you want to delete <strong>{deleteOrgTarget.name}</strong> (Code: <span className="font-mono font-bold">{deleteOrgTarget.code}</span>)?
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Deleting this parent organization will unlink all associated sub-organizations and telemetry meters.
            </p>
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteOrgTarget(null)}
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
