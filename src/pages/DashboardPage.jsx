import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Building2, 
  GitMerge, 
  Users, 
  Radio, 
  AlertTriangle, 
  Send, 
  Printer, 
  MapPin, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import LeafletMap from '../components/widgets/LeafletMap';

export default function DashboardPage({ onNavigate }) {
  const { role, isAdmin, isOrg, isSubOrg, entityId } = useAuth();
  const { 
    organizations, 
    subOrganizations, 
    farmers, 
    gpkm, 
    fields, 
    warnings 
  } = useData();

  const [selectedOrgFilter, setSelectedOrgFilter] = useState('ALL');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');

  // Filter scoped data
  let scopedFarmers = [...farmers];
  let scopedMeters = [...gpkm];
  let scopedWarnings = [...warnings];

  if (isOrg) {
    scopedFarmers = scopedFarmers.filter(f => f.orgId === entityId);
    scopedMeters = scopedMeters.filter(m => m.orgId === entityId);
    scopedWarnings = scopedWarnings.filter(w => w.orgId === entityId);
  } else if (isSubOrg) {
    scopedFarmers = scopedFarmers.filter(f => f.subOrgId === entityId);
    scopedMeters = scopedMeters.filter(m => m.subOrgId === entityId);
    scopedWarnings = scopedWarnings.filter(w => w.subOrgId === entityId);
  }

  // Apply map filter
  let mapFilteredFarmers = [...scopedFarmers];
  let mapFilteredMeters = [...scopedMeters];

  if (isAdmin && selectedOrgFilter !== 'ALL') {
    mapFilteredFarmers = mapFilteredFarmers.filter(f => f.orgId === selectedOrgFilter);
    mapFilteredMeters = mapFilteredMeters.filter(m => m.orgId === selectedOrgFilter);
  } else if (isOrg && selectedSubFilter !== 'ALL') {
    mapFilteredFarmers = mapFilteredFarmers.filter(f => f.subOrgId === selectedSubFilter);
    mapFilteredMeters = mapFilteredMeters.filter(m => m.subOrgId === selectedSubFilter);
  }

  const activeFarmersCount = mapFilteredFarmers.filter(f => f.status === 'Active').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Unified view of your agricultural network & telemetry data.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-brand-blue outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white shadow-sm cursor-pointer"
            >
              <option value="ALL">All Organizations</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          )}

          {isOrg && (
            <select
              value={selectedSubFilter}
              onChange={(e) => setSelectedSubFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-brand-blue outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white shadow-sm cursor-pointer"
            >
              <option value="ALL">All Wards / Units</option>
              {subOrganizations.filter(s => s.orgId === entityId).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow-xs hover:bg-gray-50 transition flex items-center gap-2 font-semibold text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isAdmin && (
          <div className="glass-panel p-6 rounded-2xl shadow-xs border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Organizations</p>
              <p className="text-3xl font-black text-brand-blue mt-1">{organizations.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        )}

        {!isSubOrg && (
          <div className="glass-panel p-6 rounded-2xl shadow-xs border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sub-Orgs / Wards</p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {isOrg ? subOrganizations.filter(s => s.orgId === entityId).length : subOrganizations.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <GitMerge className="w-6 h-6" />
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-brand-green to-teal-700 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-green-100 uppercase tracking-wider">Farmers Network</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-black">{mapFilteredFarmers.length}</p>
                <p className="text-xs font-medium text-green-100">Total</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-green-50 flex justify-between items-center border-t border-white/20 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-300"></span>
              {activeFarmersCount} Active
            </span>
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[11px]">
              {fields.length} Plots
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-blue to-indigo-800 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">IoT Telemetry (GPKM)</p>
              <p className="text-3xl font-black mt-1">{mapFilteredMeters.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Radio className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-blue-50 flex items-center gap-1.5 border-t border-white/20 pt-3">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Live Syncing</span>
          </div>
        </div>
      </div>

      {/* Live Warnings Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-red-50/70 flex justify-between items-center">
          <h3 className="font-bold text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Live Actionable Warnings ({scopedWarnings.length})</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {scopedWarnings.length > 0 ? (
            scopedWarnings.map((w) => (
              <div key={w.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50/80 transition gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                    w.type === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{w.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Source: <span className="font-bold text-gray-700">{w.source}</span> • {w.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('messages')}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Advisory SMS</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400 font-medium text-sm">
              No active actionable warnings in your network.
            </div>
          )}
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-blue" />
            <span>Geographic Distribution</span>
          </h3>
          <div className="flex gap-4 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-green"></span> Farms ({mapFilteredFarmers.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-blue"></span> GPKM Meters ({mapFilteredMeters.length})
            </span>
          </div>
        </div>
        <div className="p-2">
          <LeafletMap meters={mapFilteredMeters} farmers={mapFilteredFarmers} height="400px" />
        </div>
      </div>
    </div>
  );
}
