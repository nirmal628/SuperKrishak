import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Gauge, 
  AlertTriangle, 
  Plus, 
  Eye, 
  List, 
  Map, 
  Search, 
  Filter,
  Phone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import LeafletMap from '../components/widgets/LeafletMap';
import 'leaflet/dist/leaflet.css';

export default function IoTTelemetryPage({ onNavigate, onSelectMeter }) {
  const { isAdmin, isOrg, isSubOrg, entityId } = useAuth();
  const { 
    gpkm = [], 
    organizations = [], 
    subOrganizations = [], 
    farmers = [],
    addMeter, 
    showToast 
  } = useData();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [configMeter, setConfigMeter] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');

  // Form State
  const [newMeter, setNewMeter] = useState({
    aepcId: '',
    name: '',
    farmerName: '',
    orgId: organizations[0]?.id || '',
    subOrgId: ''
  });

  // Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Cascading Sub-Org Filtering based on Parent Org
  const filteredSubOrgs = subOrganizations.filter(s => s.orgId === newMeter.orgId);

  // Set default subOrgId when modal opens or parent org changes
  useEffect(() => {
    if (!newMeter.subOrgId && filteredSubOrgs.length > 0) {
      setNewMeter(prev => ({ ...prev, subOrgId: filteredSubOrgs[0].id }));
    }
  }, [newMeter.orgId, subOrganizations]);

  // Handle input change & reset verification state on edit
  const handleAepcIdChange = (e) => {
    setNewMeter(prev => ({
      ...prev,
      aepcId: e.target.value,
      name: isVerified ? '' : prev.name,
      farmerName: isVerified ? '' : prev.farmerName
    }));
    setIsVerified(false);
    setVerificationError('');
  };

  // Explicit Connect / Verification Action
  const handleVerifyMeter = (e) => {
    e.preventDefault();
    const inputId = newMeter.aepcId.trim();

    if (!inputId) {
      setVerificationError('Please enter an AEPC Meter ID.');
      setIsVerified(false);
      return;
    }

    // Search database for matching AEPC ID or Meter ID
    const match = gpkm.find(
      m => m.aepcId?.toLowerCase() === inputId.toLowerCase() ||
           m.id?.toLowerCase() === inputId.toLowerCase()
    );

    if (match) {
      const associatedFarmer = farmers.find(f => f.id === match.farmerId);
      const matchedOrgId = match.orgId || newMeter.orgId;
      const availableSubOrgs = subOrganizations.filter(s => s.orgId === matchedOrgId);

      setNewMeter(prev => ({
        ...prev,
        name: match.name || match.aepcId || 'GPKM Smart Meter',
        farmerName: associatedFarmer?.name || match.farmerName || 'Unassigned Farmer',
        orgId: matchedOrgId,
        subOrgId: match.subOrgId || availableSubOrgs[0]?.id || prev.subOrgId
      }));

      setIsVerified(true);
      setVerificationError('');
    } else {
      setIsVerified(false);
      setVerificationError('Invalid AEPC ID. Please input correct ID.');
    }
  };

  // Handle Parent Org change and cascade sub-org selection
  const handleOrgChange = (e) => {
    const selectedOrgId = e.target.value;
    const availableSubOrgs = subOrganizations.filter(s => s.orgId === selectedOrgId);
    setNewMeter(prev => ({
      ...prev,
      orgId: selectedOrgId,
      subOrgId: availableSubOrgs[0]?.id || ''
    }));
  };

  // Scoped meters calculation
  let scopedMeters = [...gpkm];
  if (isOrg) scopedMeters = scopedMeters.filter(m => m.orgId === entityId);
  if (isSubOrg) scopedMeters = scopedMeters.filter(m => m.subOrgId === entityId);

  const filteredMeters = scopedMeters.filter(m => 
    `${m.name || ''} ${m.aepcId || ''} ${m.farmerName || ''}`.toLowerCase().includes(search.toLowerCase())
  );
  const activeMeters = scopedMeters.filter(m => m.status === 'Active').length;
  const attentionMeters = scopedMeters.filter(m => m.status !== 'Active').length;

  const stats = [
    {
      label: 'TOTAL METERS',
      value: scopedMeters.length,
      textColor: 'text-gray-900',
      Icon: Cpu,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-700'
    },
    {
      label: 'ACTIVE DEVICES',
      value: activeMeters,
      textColor: 'text-green-500',
      Icon: Gauge,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-700'
    },
    {
      label: 'ATTENTION REQUIRED',
      value: attentionMeters,
      textColor: 'text-gray-400',
      Icon: AlertTriangle,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-amber-600'
    }
  ];

  const resetForm = () => {
    setIsConnectModalOpen(false);
    setIsVerified(false);
    setVerificationError('');
    setNewMeter({ 
      aepcId: '', 
      name: '', 
      farmerName: '',
      orgId: organizations[0]?.id || '', 
      subOrgId: '' 
    });
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) return; // Guard clause

    addMeter({
      ...newMeter,
      orgId: isOrg ? entityId : newMeter.orgId,
      subOrgId: isSubOrg ? entityId : newMeter.subOrgId
    });
    resetForm();
  };

  const handleConfigSave = (e) => {
    e.preventDefault();
    showToast(`Telemetry calibration saved for ${configMeter.aepcId}`);
    setConfigMeter(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Krishi Meter</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Live Tracking of Sensor and Weather from your Field.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="bg-brand-blue hover:bg-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Meter</span>
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-gray-200 py-7">
        {stats.map(({ label, value, textColor, Icon, iconBg, iconColor }) => (
          <div 
            key={label} 
            className="flex items-center gap-4 px-5 sm:px-8 border-b sm:border-b-0 sm:border-r last:border-0 border-gray-200 py-3 sm:py-0"
          >
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-500">{label}</p>
              <p className={`text-2xl font-black mt-1 ${textColor}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map/List Workspace */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row gap-3 justify-between">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              ['map', Map, 'Map View'],
              ['list', List, 'List View']
            ].map(([mode, Icon, label]) => (
              <button 
                key={mode} 
                onClick={() => setViewMode(mode)} 
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${viewMode === mode ? 'bg-brand-green text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by Meter ID or Name..." 
                className="w-full sm:w-72 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-brand-blue" 
              />
            </div>
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />Filters
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="relative">
            <LeafletMap
              meters={filteredMeters}
              height="520px"
              center={[27.7, 85.3]}
              zoom={7}
              onMeterClick={(meterId) => {
                onSelectMeter(meterId);
                onNavigate('gpkm_detail');
              }}
            />
            <div className="absolute left-5 bottom-5 z-[400] bg-white/95 border border-gray-200 rounded-lg p-3 text-[11px] shadow-md">
              <p className="font-bold text-gray-700 mb-2">Map View Controls</p>
              <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-blue" />Active Device</p>
              <p className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-gray-300" />Offline / Inactive</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">List No.</th>
                  <th className="px-6 py-4">Farmer Details</th>
                  <th className="px-6 py-4">Meter Details</th>
                  <th className="px-6 py-4">Activity Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMeters.map((meter, index) => {
                  const farmer = farmers.find(f => f.id === meter.farmerId);

                  const farmerName = farmer?.name || meter.farmerName || 'Unassigned';
                  const location = meter.locationName || farmer?.location || farmer?.address || 'N/A';
                  const phone = meter.phone || farmer?.mobile || farmer?.phone || 'N/A';
                  const isActive = meter.status === 'Active';

                  return (
                    <tr key={meter.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-extrabold text-gray-900 text-sm">{farmerName}</div>
                        <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 font-medium mt-0.5">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{phone}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-gray-900 text-sm">{meter.aepcId || meter.id}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="font-bold text-gray-900 text-sm">
                            {meter.status || 'Inactive'}
                          </span>
                        </div>
                        {meter.lastActiveTime && (
                          <div className="text-gray-400 text-[11px] font-medium mt-0.5 pl-4">
                            {meter.lastActiveTime}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                          title="View meter details" 
                          onClick={() => { onSelectMeter(meter.id); onNavigate('gpkm_detail'); }} 
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMeters.length === 0 && (
              <div className="p-12 text-center text-gray-400">No telemetry meters connected to your profile yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Connect New Meter */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={resetForm}
        title="Connect GPKM Smart Meter"
        subtitle="Provision hardware node and integrate AEPC credentials."
      >
        <form onSubmit={handleConnectSubmit} className="p-6 space-y-4">
          
          {/* AEPC Meter ID Input with Connect Button */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              AEPC Meter ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newMeter.aepcId}
                onChange={handleAepcIdChange}
                placeholder="e.g. GPA5006-1, GPA0123"
                className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
              />
              <button
                type="button"
                onClick={handleVerifyMeter}
                className="px-4 py-2.5 bg-brand-blue hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition whitespace-nowrap shadow-sm cursor-pointer"
              >
                Connect
              </button>
            </div>

            {/* Verification Status Feedback */}
            {isVerified && (
              <div className="mt-2.5 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Meter Found & Connected!</strong> Device details auto-filled. You can now provision this sensor.</span>
              </div>
            )}

            {verificationError && (
              <div className="mt-2.5 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}
          </div>

          {/* Meter Type / Label (Locked when verified) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Meter Type / Label *
            </label>
            <input
              type="text"
              required
              disabled={isVerified}
              value={newMeter.name}
              onChange={(e) => setNewMeter({ ...newMeter, name: e.target.value })}
              placeholder="e.g. Kirtipur Municipality 1"
              className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none ${
                isVerified ? 'bg-gray-100 text-gray-600 cursor-not-allowed font-medium' : 'bg-white focus:border-brand-blue'
              }`}
            />
          </div>

          {/* Farmer Details (Locked when verified) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Farmer Details *
            </label>
            <input
              type="text"
              required
              disabled={isVerified}
              value={newMeter.farmerName}
              onChange={(e) => setNewMeter({ ...newMeter, farmerName: e.target.value })}
              placeholder="e.g. Ram Kumar Shrestha"
              className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none ${
                isVerified ? 'bg-gray-100 text-gray-600 cursor-not-allowed font-medium' : 'bg-white focus:border-brand-blue'
              }`}
            />
          </div>

          {/* Parent Org & Cascading Sub-Org Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Assign Parent Org
              </label>
              <select
                value={newMeter.orgId}
                onChange={handleOrgChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Assign Sub-Org
              </label>
              <select
                value={newMeter.subOrgId}
                onChange={(e) => setNewMeter({ ...newMeter, subOrgId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600 bg-white cursor-pointer"
              >
                {filteredSubOrgs.length > 0 ? (
                  filteredSubOrgs.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
                ) : (
                  <option value="">No sub-organizations available</option>
                )}
              </select>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
            >
              Cancel
            </button>

            {/* Blocked / Dynamic Submit Button */}
            <button
              type="submit"
              disabled={!isVerified}
              title={!isVerified ? 'Please connect a valid meter ID first' : ''}
              className={`px-6 py-2.5 font-bold rounded-xl transition text-sm ${
                isVerified
                  ? 'bg-brand-blue hover:bg-blue-800 text-white shadow-md cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Provision Sensor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Configure Meter */}
      {configMeter && (
        <Modal
          isOpen={!!configMeter}
          onClose={() => setConfigMeter(null)}
          title={`Configure ${configMeter.aepcId}`}
          subtitle="Telemetry frequency, pulse calibrations & alert thresholds."
        >
          <form onSubmit={handleConfigSave} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Sampling Rate (Mins)</label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Alert Threshold (Moisture %)</label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white font-bold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfigMeter(null)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-blue hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition text-sm"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}