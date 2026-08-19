import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Home, ChevronRight, Bell, Building, Shield } from 'lucide-react';

export default function Header({ currentRoute, detailParam, onNavigate }) {
  const { role, currentUser, isAdmin, switchDemoRole } = useAuth();
  const { organizations, subOrganizations, warnings } = useData();

  // Find entity name if restricted view
  let entityScopeName = 'Global';
  if (role === 'ORG') {
    entityScopeName = organizations.find(o => o.id === currentUser?.entityId)?.name || 'Parent Organization';
  } else if (role === 'SUBORG') {
    entityScopeName = subOrganizations.find(s => s.id === currentUser?.entityId)?.name || 'Ward Unit';
  }

  // Format breadcrumb title
  const getBreadcrumbTitle = (route) => {
    switch(route) {
      case 'dashboard': return 'Dashboard';
      case 'organizations': return 'Organizations';
      case 'organization_detail': return 'Organization Breakdown & Users';
      case 'sub-organizations': return 'Sub-Organizations';
      case 'farmers': return 'Farmers Network';
      case 'farmer_detail': return 'Farmer Detail';
      case 'fields': return 'Field Insights';
      case 'field_monitor': return 'Satellite Monitoring (PRO)';
      case 'gpkm': return 'IoT Telemetry (GPKM)';
      case 'gpkm_detail': return 'Live Telemetry Dashboard';
      case 'messages': return 'Communication';
      case 'access': return 'Access Control';
      default: return 'Dashboard';
    }
  };

  const isDetailPage = currentRoute.includes('_detail') || currentRoute.includes('_monitor');
  const baseRoute = currentRoute.split('_')[0];

  return (
    <header className="h-[72px] bg-white/85 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="hover:text-brand-blue flex items-center gap-1.5 transition-colors text-gray-500"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {currentRoute !== 'dashboard' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <button 
              onClick={() => onNavigate(baseRoute === 'farmer' ? 'farmers' : (baseRoute === 'field' ? 'fields' : baseRoute))}
              className={`hover:text-brand-blue transition-colors ${!isDetailPage ? 'text-brand-blue font-bold' : 'text-gray-500'}`}
            >
              {getBreadcrumbTitle(baseRoute === 'farmer' ? 'farmers' : (baseRoute === 'field' ? 'fields' : currentRoute))}
            </button>
          </>
        )}

        {isDetailPage && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-brand-green font-bold flex items-center gap-1">
              {getBreadcrumbTitle(currentRoute)}
            </span>
          </>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Scoped Entity Badge (For non-admin) */}
        {!isAdmin && (
          <span className="px-3 py-1.5 bg-blue-50 text-brand-blue rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5 max-w-[200px] truncate">
            <Building className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{entityScopeName}</span>
          </span>
        )}

        {/* Notifications */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition border border-gray-200 shadow-xs"
          title="Actionable Warnings"
        >
          <Bell className="w-5 h-5" />
          {warnings.length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>
    </header>
  );
}
