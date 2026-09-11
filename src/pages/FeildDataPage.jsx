import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import InfoTooltip from '../components/common/InfoTooltip';
import { 
  Info, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

/* ==========================================================================
   Vegetation Index Chart Sub-Component
   ========================================================================== */
function VegetationIndexChart({ fieldName = "Swarup Farm", dataPoints }) {
  const [showBand, setShowBand] = useState(true);

  const sampleLabels = [
    '06/03', '06/09', '06/15', '06/21', '06/27', 
    '07/03', '07/09', '07/15', '07/21', '07/27', 
    '08/02', '08/08', '08/14', '08/20', '08/26', '09/01', '09/07'
  ];

  const sampleValues = [
    0.55, 0.55, 0.54, 0.53, 0.56, 
    0.51, 0.51, 0.50, 0.50, 0.51, 
    0.52, 0.52, 0.52, 0.51, 0.50, 0.45, 0.48
  ];

  const labels = dataPoints?.labels || sampleLabels;
  const values = dataPoints?.values || sampleValues;

  const LOWER_LIMIT = 0.4;
  const UPPER_LIMIT = 0.7;

  const latestValue = values[values.length - 1];

  const getStatusInfo = (val) => {
    if (val >= LOWER_LIMIT && val <= UPPER_LIMIT) {
      return {
        label: 'Optimal / Within Band',
        badgeBg: 'bg-[#E8F4F3]',
        textColor: 'text-[#008F83]',
        borderColor: 'border-[#008F83]/30',
        icon: CheckCircle2
      };
    } else if (val > UPPER_LIMIT) {
      return {
        label: 'Above Band',
        badgeBg: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        icon: ArrowUpRight
      };
    } else {
      return {
        label: 'Below Band',
        badgeBg: 'bg-rose-50',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-200',
        icon: ArrowDownRight
      };
    }
  };

  const status = getStatusInfo(latestValue);
  const StatusIcon = status.icon;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Lower Limit (0.4)',
        data: Array(labels.length).fill(LOWER_LIMIT),
        borderColor: 'transparent',
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Optimal Band (0.4 - 0.7)',
        data: Array(labels.length).fill(UPPER_LIMIT),
        borderColor: 'transparent',
        backgroundColor: showBand ? 'rgba(0, 176, 116, 0.12)' : 'transparent',
        pointRadius: 0,
        fill: 0,
      },
      {
        label: 'Vegetation Index',
        data: values,
        borderColor: '#002B22',
        borderWidth: 2,
        tension: 0.2,
        pointStyle: 'triangle',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#008F83',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 2) {
              const val = context.parsed.y;
              let bandState = 'Optimal';
              if (val > UPPER_LIMIT) bandState = 'Above Band';
              if (val < LOWER_LIMIT) bandState = 'Below Band';
              return ` Vegetation Index: ${val} (${bandState})`;
            }
            return null;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#F3F4F6' },
        ticks: { font: { size: 10 }, color: '#9CA3AF' }
      },
      y: {
        min: 0,
        max: 1.0,
        ticks: { stepSize: 0.1, font: { size: 10 }, color: '#9CA3AF' },
        grid: { color: '#F3F4F6' }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">
              6G Vegetation Index
            </h2>
            <InfoTooltip text="Target Optimal Range is fixed between 0.4 and 0.7. Values inside this band indicate healthy crop growth." />
          </div>
          <p className="text-gray-400 text-xs mt-0.5">{fieldName}</p>
        </div>

        {/* Status Badge + Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${status.badgeBg} ${status.textColor} ${status.borderColor}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>Latest: {latestValue} — {status.label}</span>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-gray-500 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showBand}
              onChange={(e) => setShowBand(e.target.checked)}
              className="rounded border-gray-300 text-[#008F83] focus:ring-[#008F83] w-3.5 h-3.5"
            />
            <span>Show full band</span>
          </label>
        </div>
      </div>

      {/* Stage Timeline Flags */}
      <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#008F83]"></span>
          <span>Planting Date: <strong className="text-gray-800">07/03/2026</strong></span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Growth Stage: <strong className="text-gray-800">Transplanting & Establishment</strong></span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 relative w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#008F83]/20 border border-[#008F83] rounded-sm"></span>
            <span>Optimal Range (0.4 - 0.7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#002B22] rotate-45 inline-block"></span>
            <span>Current NDVI Reading</span>
          </div>
        </div>
        <div className="text-gray-400 font-mono text-[11px]">
          Lower: 0.40 | Upper: 0.70
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Main Field Data Page Component
   ========================================================================== */
export default function FieldDataPage({ fieldId }) {
  const { fields } = useData();
  const field = fields?.find(f => f.id === fieldId) || fields?.[0] || {};
  
  const [activeTab, setActiveTab] = useState('Crop Health');
  const [selectedDate, setSelectedDate] = useState('May 03, 2024');
  const [showBoundary, setShowBoundary] = useState(true);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlayLayer = useRef(null);
  const polygonLayer = useRef(null);

  const timelineDates = [
    'May 03, 2024',
    'May 14, 2024',
    'May 24, 2024',
    'Jun 03, 2024',
    'Jun 14, 2024',
  ];

  const polygonCoords = [
    [41.8785, -93.0985],
    [41.8788, -93.0915],
    [41.8728, -93.0918],
    [41.8725, -93.0982]
  ];

  const lats = polygonCoords.map(p => p[0]);
  const lngs = polygonCoords.map(p => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const bounds = [[minLat, minLng], [maxLat, maxLng]];

  const generateHeatmapImage = (type, dateStr) => {
    if (type === 'Satellite Image') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    polygonCoords.forEach(([lat, lng], idx) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * 400;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 400;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.clip();

    let seed = dateStr.charCodeAt(4) + dateStr.charCodeAt(8) + dateStr.charCodeAt(11);
    const random = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    ctx.fillStyle = type === 'Crop Health' ? 'rgba(34, 197, 94, 0.65)' : 'rgba(16, 185, 129, 0.7)';
    ctx.fillRect(0, 0, 400, 400);

    const numSpots = Math.floor(random() * 20) + 15;
    for (let i = 0; i < numSpots; i++) {
      const x = random() * 400;
      const y = random() * 400;
      const r = random() * 80 + 35;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);

      if (type === 'Crop Health') {
        const stress = random();
        if (stress > 0.72) {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        } else if (stress > 0.38) {
          grad.addColorStop(0, 'rgba(234, 179, 8, 0.85)');
        } else {
          grad.addColorStop(0, 'rgba(132, 204, 22, 0.5)');
        }
        grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else {
        const density = random();
        if (density > 0.6) {
          grad.addColorStop(0, 'rgba(234, 179, 8, 0.75)');
        } else {
          grad.addColorStop(0, 'rgba(6, 78, 59, 0.85)');
        }
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas.toDataURL();
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([32.8756, -82.0950], 16);

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);

      mapInstance.current = map;
    }

    const map = mapInstance.current;

    if (polygonLayer.current) map.removeLayer(polygonLayer.current);
    if (overlayLayer.current) map.removeLayer(overlayLayer.current);

    if (activeTab !== 'Satellite Image' && showBoundary) {
      const imageUrl = generateHeatmapImage(activeTab, selectedDate);
      if (imageUrl) {
        overlayLayer.current = L.imageOverlay(imageUrl, bounds, { opacity: 0.85 }).addTo(map);
      }
    }

    if (showBoundary) {
      polygonLayer.current = L.polygon(polygonCoords, {
        color: '#ffffff',
        weight: 2.5,
        fill: false,
        dashArray: '6, 6'
      }).addTo(map);
      
      map.fitBounds(polygonLayer.current.getBounds(), { padding: [40, 40] });
    }

  }, [activeTab, selectedDate, showBoundary]);

  const handleZoomIn = () => mapInstance.current?.zoomIn();
  const handleZoomOut = () => mapInstance.current?.zoomOut();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 text-gray-800 font-sans">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{field.plotName || 'Swarup Farm'}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 mt-1">
          <span><strong className="text-gray-700 font-medium">Farm ID:</strong> {field.id || 'SF-2024'}</span>
          <span><strong className="text-gray-700 font-medium">Crop:</strong> {field.crop || 'Wheat'}</span>
          <span><strong className="text-gray-700 font-medium">Area:</strong> {field.area || '50 Acres'}</span>
          <span><strong className="text-gray-700 font-medium">Sowing Date:</strong> {field.sowingDate || '2023-09-17'}</span>
        </div>
      </div>

      {/* 1. Remote Sensing / Sensor Monitoring Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Remote Sensing Header & Mode Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">Remote Sensing</h2>
          
          <div className="inline-flex bg-gray-100 p-1 rounded-lg text-xs font-medium text-gray-600">
            {['Crop Health', 'Crop Density', 'Satellite Image'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Map Display Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[420px] w-full bg-gray-200">
          <div ref={mapRef} className="w-full h-full z-0" />

          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden divide-y divide-gray-100 text-gray-600 text-sm">
            <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
            <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-bold">−</button>
          </div>

          {/* Legend Box Overlay */}
          {activeTab !== 'Satellite Image' && (
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3.5 w-64 text-xs transition-opacity duration-300">
              <div className="flex items-center justify-between font-bold text-gray-800 mb-2">
                <span>{activeTab === 'Crop Health' ? 'Crop Health Index (NDVI)' : 'Crop Density Index'}</span>
                <InfoTooltip text={activeTab === 'Crop Health' ? "NDVI vegetation index reflecting crop stress and vigor." : "Biomass index highlighting crop density distribution."} />
              </div>

              <div className={`h-2 rounded-full w-full my-1.5 ${
                activeTab === 'Crop Health' 
                  ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500'
                  : 'bg-gradient-to-r from-yellow-400 via-emerald-500 to-emerald-800'
              }`} />

              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0</span>
                <span>0.25</span>
                <span>0.50</span>
                <span>0.75</span>
                <span>1.00</span>
              </div>

              <div className="flex justify-between text-[11px] font-medium mt-1 mb-3">
                <span className={activeTab === 'Crop Health' ? 'text-red-600' : 'text-yellow-600'}>
                  {activeTab === 'Crop Health' ? 'Poor' : 'Sparse'}
                </span>
                <span className="text-emerald-600">
                  {activeTab === 'Crop Health' ? 'Good' : 'Dense'}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-gray-400">▢</span>
                  <span>Field Boundary</span>
                </div>
                <button
                  onClick={() => setShowBoundary(!showBoundary)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    showBoundary ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date Selector & Timeline Stepper */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Select Date</label>
            <div className="relative inline-block">
              <input
                type="text"
                readOnly
                value={selectedDate}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-medium bg-white shadow-sm focus:outline-none cursor-pointer pr-8"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">📅</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedDate(timelineDates[Math.max(0, timelineDates.indexOf(selectedDate) - 1)])}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs"
            >
              &lt;
            </button>

            <div className="flex-1 relative flex items-center justify-between py-4 px-2">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0" />

              {timelineDates.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    <div className={`w-3 h-3 rounded-full transition-all ${
                        isSelected ? 'bg-emerald-500 ring-4 ring-emerald-100 scale-125' : 'bg-gray-400 hover:bg-gray-600'
                      }`}
                    />
                    <span className={`text-[11px] mt-2 transition-colors ${
                        isSelected ? 'text-emerald-600 font-bold' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    >
                      {dateStr}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setSelectedDate(timelineDates[Math.min(timelineDates.length - 1, timelineDates.indexOf(selectedDate) + 1)])}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Active Observation Banner */}
        <div className="bg-emerald-100/70 rounded-xl p-3 flex items-center justify-between text-emerald-900">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">{selectedDate}</span>
            <span className="bg-white/80 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              Active Observation
            </span>
          </div>
          <span className="text-emerald-700 text-lg">🍃</span>
        </div>
      </div>

      {/* 2. 6G Vegetation Index Section (Placed directly below Remote Sensing) */}
      <VegetationIndexChart fieldName={field.plotName || 'Swarup Farm'} />
    </div>
  );
}