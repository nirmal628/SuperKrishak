import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, 
  Building2, 
  GitMerge, 
  Users, 
  MapPin, 
  Cpu, 
  MessageSquare, 
  ShieldCheck, 
  Power,
  User
} from 'lucide-react';

export default function Sidebar({ currentRoute, onNavigate }) {
  const { currentUser, role, logout, isAdmin } = useAuth();
  const { accessControl } = useData();

  const routes = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ORG', 'SUBORG'] },
    { id: 'organizations', name: 'Organizations', icon: Building2, roles: ['ADMIN'] },
    { id: 'sub-organizations', name: 'Sub-Organizations', icon: GitMerge, roles: ['ADMIN'] },
    { id: 'farmers', name: 'Farmers Network', icon: Users, roles: ['ADMIN', 'ORG', 'SUBORG'] },
    { id: 'fields', name: 'Field Insights', icon: MapPin, roles: ['ADMIN', 'ORG', 'SUBORG'] },
    { id: 'gpkm', name: 'IoT Telemetry (GPKM)', icon: Cpu, roles: ['ADMIN', 'ORG', 'SUBORG'] },
    { id: 'messages', name: 'Communication', icon: MessageSquare, roles: ['ADMIN', 'ORG', 'SUBORG'] },
    { id: 'access', name: 'Access Control', icon: ShieldCheck, roles: ['ADMIN'] }
  ];

  // Filter routes based on user role and permissions
  const visibleRoutes = routes.filter(r => {
    if (!r.roles.includes(role)) return false;
    if (r.id === 'messages' && role !== 'ADMIN') {
      const allowed = accessControl.sendMessage[currentUser?.entityId];
      if (!allowed) return false;
    }
    return true;
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="h-[72px] flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-black shadow-sm text-xs tracking-wider">
            SK
          </div>
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">
            Super<span className="text-brand-green">Krishak</span>
          </span>
        </div>
      </div>

      {/* User Role Card */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50/80 to-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white shadow-sm ring-2 ring-white flex-shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 tracking-tight truncate">
            {currentUser?.name || 'System User'}
          </p>
          <p className="text-[10px] uppercase font-bold text-brand-green tracking-wider mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green pulse-dot"></span>
            {currentUser?.title || 'Active Access'}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        {visibleRoutes.map((r) => {
          const Icon = r.icon;
          const isActive = currentRoute === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onNavigate(r.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#F0F6FB] text-brand-blue border-r-4 border-brand-green font-bold shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-blue'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-blue' : 'text-gray-400'}`} />
              <span>{r.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Disconnect */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/60">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 font-semibold text-sm w-full px-4 py-2.5 rounded-xl transition-all border border-transparent hover:border-red-100"
        >
          <Power className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
