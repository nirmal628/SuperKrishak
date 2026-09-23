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
  Users,
  CheckCircle2
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

  // Verification state for Link New Organization Modal
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

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

  // Handle SK Admin ID input change and reset verification
  const handleSkAdminIdChange = (e) => {
    const value = e.target.value;
    setNewOrgForm(prev => ({
      ...prev,
      skAdminId: value,
      name: isVerified ? '' : prev.name,
      shortName: isVerified ? '' : prev.shortName,
      address: isVerified ? '' : prev.address
    }));
    setIsVerified(false);
    setVerificationError('');
  };

  // Explicit Connect / Verification Action
  const handleVerifyOrg = (e) => {
    e.preventDefault();
    const inputId = newOrgForm.skAdminId.trim();

    if (!inputId) {
      setVerificationError('Please enter an Integration ID.');
      setIsVerified(false);
      return;
    }

    // Search database for matching SK Admin ID, code, or ID
    const match = organizations.find(
      o => o.skAdminId?.toLowerCase() === inputId.toLowerCase() ||
           o.code?.toLowerCase() === inputId.toLowerCase() ||
           o.id?.toLowerCase() === inputId.toLowerCase()
    );

    if (match) {
      setNewOrgForm(prev => ({
        ...prev,
        name: match.name || '',
        shortName: match.shortName || match.name || '',
        code: match.code || inputId,
        address: match.address || 'N/A'
      }));
      setIsVerified(true);
      setVerificationError('');
    } else {
      setIsVerified(false);
      setVerificationError('Invalid Integration ID. Please input correct ID.');
    }
  };

  // Reset modal state
  const resetAddModal = () => {
    setIsAddModalOpen(false);
    setIsVerified(false);
    setVerificationError('');
    setNewOrgForm({ name: '', shortName: '', code: '', skAdminId: '', address: '', email: '', password: '' });
  };

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
    if (!isVerified) return; // Guard Clause

    addOrganization({
      name: newOrgForm.name,
      shortName: newOrgForm.shortName || newOrgForm.name,
      code: newOrgForm.code || Math.floor(1000 + Math.random() * 9000).toString(),
      skAdminId: newOrgForm.skAdminId,
      address: newOrgForm.address,
      status: 'Active'
    });
    resetAddModal();
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
      {/* 1. Parent Organizations Top Section */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Parent Organizations</h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link New Organization</span>
          </button>
        )}
      </div>

      {/* 2. All Organizations Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteOrgTarget(o)}
                              className="px-4 py-1.5 bg-white border border-[#21A9DF] text-[#168FC2] hover:bg-blue-50 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onSelectOrg(o.id);
                              onNavigate('organization_detail');
                            }}
                            className="px-4 py-1.5 bg-[#008F83] hover:bg-[#00756C] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
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
        onClose={resetAddModal}
        title="Link Organization"
        subtitle="Sync database and create master access credentials."
      >
        <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
          
          {/* SK Admin Portal Integration ID Field with Connect Button */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3 items-start mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-brand-blue flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">
                  SK Admin Portal Integration ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newOrgForm.skAdminId}
                    onChange={handleSkAdminIdChange}
                    placeholder="e.g. SK-ORG-5006, 5006"
                    className="flex-1 border border-blue-300 rounded-lg p-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOrg}
                    className="px-4 py-2.5 bg-brand-blue hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Verification Status Feedback */}
            {isVerified && (
              <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-3 py-2 rounded-lg text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Organization Found & Connected!</strong> Database records matched.</span>
              </div>
            )}

            {verificationError && (
              <div className="mt-3 flex items-center gap-2 text-red-700 bg-red-100/80 border border-red-300 px-3 py-2 rounded-lg text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}
          </div>

          {/* Locked Organization Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Organization Full Name *
              </label>
              <input
                type="text"
                required
                readOnly
                value={newOrgForm.name}
                placeholder="Connect ID to auto-fill"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Locked Short Name & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Name</label>
              <input
                type="text"
                readOnly
                value={newOrgForm.shortName}
                placeholder="Auto-filled short name"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
              <input
                type="text"
                readOnly
                value={newOrgForm.address}
                placeholder="Auto-filled address"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Login Email & Secure Password */}
          <div className="border border-gray-200 rounded-xl p-4 relative mt-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Generate Access Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Login Email *</label>
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
                <label className="block text-xs font-bold text-gray-600 mb-1">Secure Password *</label>
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

          {/* Modal Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={resetAddModal}
              className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm cursor-pointer"
            >
              Cancel
            </button>

            {/* Blocked / Dynamic Submit Button */}
            <button
              type="submit"
              disabled={!isVerified}
              title={!isVerified ? 'Please connect a valid Integration ID first' : ''}
              className={`px-6 py-2.5 font-bold rounded-xl transition text-sm ${
                isVerified
                  ? 'bg-brand-blue hover:bg-blue-800 text-white shadow-md cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
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

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditOrg(null)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#21A9DF] hover:bg-[#168FC2] text-white font-bold rounded-xl shadow-md transition text-sm cursor-pointer"
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
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition text-sm cursor-pointer"
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