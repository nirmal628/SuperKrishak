import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Home, ChevronRight, User, ChevronDown, Globe } from 'lucide-react';

export default function Header({ currentRoute, detailParam, onNavigate }) {
  const { role, currentUser, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();

  const getBreadcrumbTitle = (route) => {
    const titles = {
      dashboard: t('Dashboard'), organizations: t('Organizations'), organization_detail: t('Organization Breakdown & Users'),
      'sub-organizations': t('Sub-Organizations'), farmers: t('Farmers Network'), farmer_detail: t('Farmer Detail'),
      farmer_leaderboard: t('User Rankings'), farmer_activity: t('Farmer Activity'), fields: t('Field Insights'),
      field_monitor: t('Satellite Monitoring (PRO)'), field_data: t('Field Data'), gpkm: t('IoT Telemetry (GPKM)'),
      gpkm_detail: t('Live Telemetry Dashboard'), messages: t('Communication'), access: t('Access Control'),
    };
    return titles[route] || t('Dashboard');
  };
  const isSubPage = ['_detail', '_monitor', '_leaderboard', '_activity', '_data'].some((suffix) => currentRoute.includes(suffix));
  const baseRoute = currentRoute.split('_')[0];
  const getParentRoute = () => ({ farmer: 'farmers', field: 'fields', gpkm: 'gpkm', organization: 'organizations' }[baseRoute] || 'dashboard');

  return (
    <header className="min-h-[60px] lg:h-[72px] bg-[var(--color-background)] border-b border-[var(--color-border)] flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-2 z-10 sticky top-0">
      <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]">
        <button onClick={() => onNavigate('dashboard')} className={`hover:text-[var(--color-text)] flex items-center gap-1.5 transition-colors ${currentRoute === 'dashboard' ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-muted)]'}`}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t('Dashboard')}</span>
        </button>
        {currentRoute !== 'dashboard' && !isSubPage && <><ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" /><span className="text-[var(--color-primary)] font-bold">{getBreadcrumbTitle(currentRoute)}</span></>}
        {isSubPage && <><ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" /><button onClick={() => onNavigate(getParentRoute())} className="hover:text-[var(--color-text)] transition-colors text-[var(--color-muted)]">{getBreadcrumbTitle(getParentRoute())}</button><ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" /><span className="text-[var(--color-primary)] font-bold">{getBreadcrumbTitle(currentRoute)}</span></>}
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[var(--color-text)] transition-colors hover:bg-[var(--color-mint)]" aria-label={t('User menu')}>
          <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-sm ring-2 ring-[var(--color-border)] flex-shrink-0"><User className="w-4 h-4" /></span>
          <div className="hidden sm:flex flex-col text-left max-w-[180px]"><span className="truncate text-sm font-bold leading-tight">{currentUser?.name || t('System User')}</span><span className="truncate text-[10px] text-[var(--color-muted)] font-semibold">{currentUser?.title || (isAdmin ? t('System Admin') : role)}</span></div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-[var(--color-muted)]" />
        </button>
        <span className="w-px h-6 bg-[var(--color-border)]" aria-hidden="true" />
        <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ne' : 'en')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-mint)] text-[var(--color-primary)] transition border border-[var(--color-border)] text-xs font-bold shadow-xs" title={t('Switch language')}>
          <Globe className="w-4 h-4 text-[var(--color-primary)]" />
          <span>{i18n.language === 'en' ? t('English') : t('Nepali')}</span>
        </button>
      </div>
    </header>
  );
}
