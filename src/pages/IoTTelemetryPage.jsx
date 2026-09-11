import React, { useState } from 'react';
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
  MapPin
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

  // New meter form state
  const [newMeter, setNewMeter] = useState({
    aepcId: '',
    name: '',
    orgId: organizations[0]?.id || '',
    subOrgId: subOrganizations[0]?.id || ''
  });

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

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    addMeter({
      ...newMeter,
      orgId: isOrg ? entityId : newMeter.orgId,
      subOrgId: isSubOrg ? entityId : newMeter.subOrgId
    });
    setIsConnectModalOpen(false);
    setNewMeter({ 
      aepcId: '', 
      name: '', 
      orgId: organizations[0]?.id || '', 
      subOrgId: subOrganizations[0]?.id || '' 
    });
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
            className="bg-brand-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 hover:-translate-y-0.5"
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

                  // Extracting farmer name, location, and phone with fallback to meter properties
                  const farmerName = farmer?.name || meter.farmerName || 'Unassigned';
                  const location = meter.locationName || farmer?.location || farmer?.address || 'N/A';
                  const phone = meter.phone || farmer?.mobile || farmer?.phone || 'N/A';
                  const isActive = meter.status === 'Active';

                  return (
                    <tr key={meter.id} className="hover:bg-gray-50/60 transition">
                      {/* List No. */}
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        {index + 1}
                      </td>

                      {/* Farmer Details (Name + Location + Phone) */}
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

                      {/* Meter Details */}
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-gray-900 text-sm">{meter.aepcId || meter.id}</div>
                      </td>

                      {/* Activity Status */}
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

                      {/* Actions */}
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
        onClose={() => setIsConnectModalOpen(false)}
        title="Connect GPKM Smart Meter"
        subtitle="Provision hardware node and integrate AEPC credentials."
      >
        <form onSubmit={handleConnectSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">AEPC Meter ID *</label>
            <input
              type="text"
              required
              value={newMeter.aepcId}
              onChange={(e) => setNewMeter({ ...newMeter, aepcId: e.target.value })}
              placeholder="e.g. AEPC-009"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Meter Label / Node Name *</label>
            <input
              type="text"
              required
              value={newMeter.name}
              onChange={(e) => setNewMeter({ ...newMeter, name: e.target.value })}
              placeholder="e.g. South Valley Solar Irrigation Pump"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Assign Parent Org</label>
              <select
                value={newMeter.orgId}
                onChange={(e) => setNewMeter({ ...newMeter, orgId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Assign Sub-Org</label>
              <select
                value={newMeter.subOrgId}
                onChange={(e) => setNewMeter({ ...newMeter, subOrgId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-600 bg-white cursor-pointer"
              >
                {subOrganizations.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(false)}
              className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-blue hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition text-sm"
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