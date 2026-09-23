import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import logoImg from '../../data/images/frame1.png'; // Adjust path/filename to match your project
import { useAuth } from "../../context/AuthContext";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Sidebar({ currentRoute, onNavigate }) {
  const { role, logout } = useAuth();
  const { t } = useTranslation();

  // Sidebar collapse/expand state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    {
      id: "dashboard",
      name: t("Dashboard"),
      icon: LayoutDashboard,
      roles: ["ADMIN", "ORG", "SUBORG"],
    },
    {
      id: "organizations",
      name: t("Organizations"),
      icon: Building2,
      roles: ["ADMIN"],
    },
    {
      id: "sub-organizations",
      name: t("Sub-Organizations"),
      icon: GitMerge,
      roles: ["ADMIN"],
    },
    {
      id: "farmers",
      name: t("Farmers Network"),
      icon: Users,
      roles: ["ADMIN", "ORG", "SUBORG"],
    },
    {
      id: "fields",
      name: t("Farms"),
      icon: MapPin,
      roles: ["ADMIN", "ORG", "SUBORG"],
    },
    {
      id: "gpkm",
      name: t("Krishi Meter"),
      icon: Cpu,
      roles: ["ADMIN", "ORG", "SUBORG"],
    },
    {
      id: "messages",
      name: t("Communication"),
      icon: MessageSquare,
      roles: ["ADMIN", "ORG", "SUBORG"],
    },
    {
      id: "access",
      name: t("Access Control"),
      icon: ShieldCheck,
      roles: ["ADMIN"],
    },
  ];

  // Filter routes based on user role
  const visibleRoutes = routes.filter((r) => r.roles.includes(role));
  const dashboardRoute = visibleRoutes.find((r) => r.id === "dashboard");
  const sections = [
    { label: t("NETWORK"), routeIds: ["organizations", "sub-organizations", "farmers"] },
    { label: t("FIELD OPS"), routeIds: ["fields", "gpkm"] },
    { label: t("SYSTEM"), routeIds: ["messages", "access"] },
  ];

  const renderNavItem = (r) => {
    const Icon = r.icon;
    const isActive = currentRoute === r.id;

    return (
      <button
        key={r.id}
        onClick={() => onNavigate(r.id)}
        title={isCollapsed ? r.name : undefined}
        className={`w-auto lg:w-full flex flex-shrink-0 items-center ${
          isCollapsed ? "justify-center px-2 py-3" : "gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3"
        } text-xs lg:text-sm font-semibold transition-all ${
          isActive
            ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text-active)] border-l-[3px] border-[var(--sidebar-active-border)] rounded-r-lg font-bold shadow-xs"
            : "text-[var(--sidebar-text)] rounded-xl hover:bg-[rgba(255,255,255,0.04)]"
        }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            isActive ? "text-[var(--color-secondary)]" : "opacity-70"
          }`}
        />
        {!isCollapsed && <span className="truncate">{r.name}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`w-full ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      } bg-[linear-gradient(180deg,var(--sidebar-gradient-start)_0%,var(--sidebar-gradient-end)_100%)] border-b lg:border-b-0 lg:border-r border-[#123847] flex flex-col flex-shrink-0 z-20 shadow-[0_4px_18px_rgba(11,37,51,0.12)] lg:shadow-[4px_0_24px_rgba(11,37,51,0.12)] transition-all duration-300`}
    >
      {/* Brand Header with Toggle Button on the Right Side */}
      <div
        className={`h-[60px] lg:h-[72px] flex items-center ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4 lg:px-5"
        } border-b border-[#123847]`}
      >
        {/* Logo Image */}
        {!isCollapsed && (
          <img
            src={logoImg}
            alt="Super Krishak"
            className="h-10 lg:h-12 w-auto max-w-[calc(100%-2.5rem)] object-contain transition-all duration-300"
          />
        )}

        {/* Toggle Collapse/Expand Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? t("Expand Sidebar") : t("Collapse Sidebar")}
          className="p-1.5 rounded-lg text-[#A9BDC4] hover:text-white hover:bg-[#123847] transition cursor-pointer flex-shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-1 overflow-x-auto lg:overflow-y-auto lg:flex-col py-2 lg:py-5 px-3 gap-1.5 lg:space-y-1.5">
        {dashboardRoute && renderNavItem(dashboardRoute)}
        {sections.map((section) => {
          const sectionRoutes = visibleRoutes.filter((r) =>
            section.routeIds.includes(r.id)
          );
          if (sectionRoutes.length === 0) return null;

          return (
            <div
              key={section.label}
              className="flex flex-col flex-shrink-0 mt-4 mb-1 gap-1.5"
            >
              {!isCollapsed ? (
                <p className="px-3 text-[11px] uppercase tracking-[0.05em] text-[var(--sidebar-section-label)]">
                  {section.label}
                </p>
              ) : (
                <div className="h-px bg-[#123847] my-1 mx-2" />
              )}
              {sectionRoutes.map(renderNavItem)}
            </div>
          );
        })}
      </nav>

      {/* Disconnect / Logout */}
      <div className="hidden lg:block p-4 border-t border-[#123847] bg-[#123847]">
        <button
          onClick={logout}
          title={isCollapsed ? t("Logout") : undefined}
          className={`flex items-center ${
            isCollapsed ? "justify-center px-2" : "justify-center gap-2 px-4"
          } text-[#A9BDC4] hover:text-white hover:bg-[#0B2533] font-semibold text-sm w-full py-2.5 rounded-lg transition-all border border-transparent cursor-pointer`}
        >
          <Power className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>{t("Logout")}</span>}
        </button>
      </div>
    </aside>
  );
}