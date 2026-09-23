import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Building2,
  GitMerge,
  Users,
  Radio,
  Printer,
  MapPin,
} from "lucide-react";
import InfoTooltip from "../components/common/InfoTooltip";
import LeafletMap from "../components/widgets/LeafletMap";
import LiveWarningsBanner from "../components/widgets/LiveWarningsBanner";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

export default function DashboardPage({ onNavigate }) {
  const { t } = useTranslation();
  const { role, isAdmin, isOrg, isSubOrg, entityId } = useAuth();
  const { organizations, subOrganizations, farmers, gpkm, fields } = useData();

  const [selectedOrgFilter, setSelectedOrgFilter] = useState("ALL");
  const [selectedSubFilter, setSelectedSubFilter] = useState("ALL");

  // Filter scoped data
  let scopedFarmers = [...farmers];
  let scopedMeters = [...gpkm];

  if (isOrg) {
    scopedFarmers = scopedFarmers.filter((f) => f.orgId === entityId);
    scopedMeters = scopedMeters.filter((m) => m.orgId === entityId);
  } else if (isSubOrg) {
    scopedFarmers = scopedFarmers.filter((f) => f.subOrgId === entityId);
    scopedMeters = scopedMeters.filter((m) => m.subOrgId === entityId);
  }

  // Apply map & organization filter
  let mapFilteredFarmers = [...scopedFarmers];
  let mapFilteredMeters = [...scopedMeters];

  if (isAdmin && selectedOrgFilter !== "ALL") {
    mapFilteredFarmers = mapFilteredFarmers.filter(
      (f) => f.orgId === selectedOrgFilter,
    );
    mapFilteredMeters = mapFilteredMeters.filter(
      (m) => m.orgId === selectedOrgFilter,
    );
  } else if (isOrg && selectedSubFilter !== "ALL") {
    mapFilteredFarmers = mapFilteredFarmers.filter(
      (f) => f.subOrgId === selectedSubFilter,
    );
    mapFilteredMeters = mapFilteredMeters.filter(
      (m) => m.subOrgId === selectedSubFilter,
    );
  }

  const activeFarmersCount = mapFilteredFarmers.filter(
    (f) => f.status === "Active",
  ).length;

  const activeRate = mapFilteredFarmers.length
    ? ((activeFarmersCount / mapFilteredFarmers.length) * 100).toFixed(1)
    : "0.0";

  // Dynamic Date Extraction & Trend Calculations
  const dateRange = useMemo(() => {
    const defaultDates = [
      "2026-09-01",
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-05",
    ];

    const extracted = new Set();
    mapFilteredFarmers.forEach((f) => {
      if (f.registeredDate) extracted.add(f.registeredDate);
      if (f.lastActiveDate) extracted.add(f.lastActiveDate);
    });

    const dates =
      extracted.size > 0 ? Array.from(extracted).sort() : defaultDates;
    return dates;
  }, [mapFilteredFarmers]);

  const chartLabels = useMemo(() => {
    return dateRange.map((d) => {
      const parts = d.split("-");
      if (parts.length === 3) {
        const monthNames = [
          t("Jan"),
          t("Feb"),
          t("Mar"),
          t("Apr"),
          t("May"),
          t("Jun"),
          t("Jul"),
          t("Aug"),
          t("Sep"),
          t("Oct"),
          t("Nov"),
          t("Dec"),
        ];
        const monthIndex = parseInt(parts[1], 10) - 1;
        return `${monthNames[monthIndex] || t("Sep")} ${parts[2]}`;
      }
      return d;
    });
  }, [dateRange, t]);

  const farmerTrend = useMemo(() => {
    return dateRange.map((d) => {
      return mapFilteredFarmers.filter(
        (f) => (f.registeredDate || "2026-09-01") <= d,
      ).length;
    });
  }, [mapFilteredFarmers, dateRange]);

  const activeTrend = useMemo(() => {
    return dateRange.map((d) => {
      return mapFilteredFarmers.filter(
        (f) =>
          f.lastActiveDate === d ||
          (f.status === "Active" && (f.lastActiveDate || "2026-09-01") >= d),
      ).length;
    });
  }, [mapFilteredFarmers, dateRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 10 } } },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#EEF2F4" },
        ticks: { color: "#9CA3AF", font: { size: 10 }, stepSize: 1 },
      },
    },
  };

  const chartData = (values) => ({
    labels: chartLabels,
    datasets: [
      {
        data: values,
        borderColor: "#008F83",
        backgroundColor: "rgba(232, 244, 243, 0.75)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#008F83",
        tension: 0.35,
        fill: true,
      },
    ],
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("Dashboard")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-brand-blue outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white shadow-sm cursor-pointer"
            >
              <option value="ALL">{t("All Organizations")}</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}

          {isOrg && (
            <select
              value={selectedSubFilter}
              onChange={(e) => setSelectedSubFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-brand-blue outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white shadow-sm cursor-pointer"
            >
              <option value="ALL">{t("All Wards / Units")}</option>
              {subOrganizations
                .filter((s) => s.orgId === entityId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow-xs hover:bg-gray-50 transition flex items-center gap-2 font-semibold text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t("Report")}</span>
          </button>
        </div>
      </div>

      {/* Dynamic KPI Cards Section */}
      {(() => {
        const kpiCards = [
          isAdmin && [
            t("Total Organizations"),
            organizations.length,
            Building2,
            "bg-teal-50 text-teal-700 border-teal-200/60",
            "organizations",
          ],
          (isAdmin || isOrg) && [
            t("Total Sub-Organizations"),
            isOrg
              ? subOrganizations.filter((s) => s.orgId === entityId).length
              : subOrganizations.length,
            GitMerge,
            "bg-emerald-50 text-emerald-700 border-emerald-200/60",
            "sub-organizations",
          ],
          [
            t("Total Farmers"),
            mapFilteredFarmers.length,
            Users,
            "bg-sky-50 text-sky-700 border-sky-200/60",
            "farmers",
          ],
          [
            t("Krishi Meter (IoT)"),
            mapFilteredMeters.length,
            Radio,
            "bg-amber-50 text-amber-700 border-amber-200/60",
            "gpkm",
          ],
          [
            t("Fields Plotted"),
            fields.length,
            MapPin,
            "bg-slate-100 text-slate-700 border-slate-200",
            "fields",
          ],
        ].filter(Boolean);

        return (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              kpiCards.length >= 5
                ? "lg:grid-cols-3 xl:grid-cols-5"
                : "lg:grid-cols-4"
            } gap-3.5`}
          >
            {kpiCards.map(([label, value, Icon, badgeStyle, route]) => (
              <div
                key={label}
                onClick={() => onNavigate && onNavigate(route)}
                className="group relative bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <InfoTooltip
                  className="absolute top-3 right-3 text-gray-300 group-hover:text-gray-400 transition"
                  text={t("Current {{label}} in your scope.", {
                    label: label.toLowerCase(),
                  })}
                />
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${badgeStyle}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-4">
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider truncate">
                      {label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-0.5 tracking-tight">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Universal Live Warnings Banner */}
      <LiveWarningsBanner onNavigate={onNavigate} />

      {/* Trend Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">{t("Total Farmers")}</h3>
              <p className="text-4xl font-extrabold text-gray-950 mt-6">
                {mapFilteredFarmers.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("Total unique registrations")}
              </p>
            </div>
            <div className="text-xs text-right space-y-2 pt-1">
              <span className="block text-green-700 bg-green-100 rounded px-2 py-1 font-bold">
                +4%{" "}
                <span className="text-gray-600 font-medium">
                  {t("in last 24 hours")}
                </span>
              </span>
              <span className="block text-red-700 bg-red-100 rounded px-2 py-1 font-bold">
                -1%{" "}
                <span className="text-gray-600 font-medium">
                  {t("in last 30 days")}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 mb-3">
            {t("Total Farmers Trend")}
          </h3>
          <div className="h-36 sm:h-40">
            <Line data={chartData(farmerTrend)} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">{t("Active Farmers")}</h3>
              <p className="text-4xl font-extrabold text-gray-950 mt-6">
                {activeRate}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("App opened by farmers within selected period.")}
              </p>
            </div>
            <div className="text-xs text-right space-y-2 pt-1">
              <span className="block text-green-700 bg-green-100 rounded px-2 py-1 font-bold">
                +4%{" "}
                <span className="text-gray-600 font-medium">
                  {t("in last 24 hours")}
                </span>
              </span>
              <span className="block text-red-700 bg-red-100 rounded px-2 py-1 font-bold">
                -1%{" "}
                <span className="text-gray-600 font-medium">
                  {t("in last 30 days")}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 mb-3">
            {t("Active Farmers Trend")}
          </h3>
          <div className="h-36 sm:h-40">
            <Line data={chartData(activeTrend)} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-blue" />
            <span>{t("Farmer Distribution and IoT Devices Installed")}</span>
          </h3>
          <div className="flex gap-4 text-xs font-bold text-gray-600">
            <span>
              {t("Farms ({{count}})", { count: mapFilteredFarmers.length })}
            </span>
            <span>
              {t("GPKM Meters ({{count}})", { count: mapFilteredMeters.length })}
            </span>
          </div>
        </div>
        <div className="p-2">
          <LeafletMap
            meters={mapFilteredMeters}
            farmers={mapFilteredFarmers}
            height="400px"
          />
        </div>
      </div>
    </div>
  );
}