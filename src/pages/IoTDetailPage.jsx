import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Activity, 
  Droplets, 
  Thermometer, 
  Sun, 
  Zap, 
  Clock, 
  Gauge, 
  Compass,
  Layers
} from 'lucide-react';
import WeatherWidget from '../components/widgets/WeatherWidget';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

export default function IoTDetailPage({ meterId, onNavigate }) {
  const { gpkm, showToast } = useData();

  const meter = gpkm.find(m => m.id === meterId) || gpkm[0];

  const [activeParam, setActiveParam] = useState('solarVoltage');
  const [timeRange, setTimeRange] = useState('Daily');
  const [dateRange, setDateRange] = useState('June 01, 2026 - Aug 01, 2026');

  // Complete Parameter Metadata covering all parameters from Image 1
  const parameterMeta = {
    // --- System Parameters ---
    solarCurrent: { label: 'Solar Current', unit: 'A', color: '#E5A62A', icon: Sun, category: 'System', data: [4.2, 5.1, 8.4, 9.2, 7.8, 3.5, 0.1] },
    solarVoltage: { label: 'Solar Voltage', unit: 'V', color: '#EAB308', icon: Zap, category: 'System', data: [32, 36, 48, 52, 46, 38, 12] },
    head: { label: 'Head', unit: 'm', color: '#006B4F', icon: Compass, category: 'System', data: [15, 18, 22, 25, 22, 18, 15] },
    power: { label: 'Power', unit: 'kW', color: '#35D59F', icon: Activity, category: 'System', data: [1.2, 2.4, 3.8, 4.5, 3.2, 1.1, 0.2] },
    runTime: { label: 'RunTime', unit: 'hrs', color: '#64748B', icon: Clock, category: 'System', data: [2, 4, 8, 12, 10, 6, 2] },
    acVoltage: { label: 'AC Voltage', unit: 'V', color: '#006B4F', icon: Zap, category: 'System', data: [220, 224, 221, 218, 222, 225, 220] },
    acCurrent: { label: 'AC Current', unit: 'A', color: '#00B074', icon: Zap, category: 'System', data: [8, 9, 12, 14, 11, 7, 2] },
    flow: { label: 'Flow', unit: 'L/m', color: '#21A9DF', icon: Droplets, category: 'System', data: [45, 60, 90, 110, 95, 50, 10] },
    discharge: { label: 'Discharge', unit: 'm³/h', color: '#168FC2', icon: Gauge, category: 'System', data: [12, 18, 28, 34, 29, 15, 4] },

    // --- Environmental Parameters ---
    temperature: { label: 'Temperature', unit: '°C', color: '#EF4444', icon: Thermometer, category: 'Environmental', data: [22, 24, 28, 30, 27, 25, 23] },
    humidity: { label: 'Humidity', unit: '%', color: '#3B82F6', icon: Sun, category: 'Environmental', data: [75, 78, 82, 85, 83, 80, 77] },
    ecSensorTemp: { label: 'EC Sensor Temperature', unit: '°C', color: '#F97316', icon: Thermometer, category: 'Environmental', data: [19, 20, 21, 23, 22, 21, 20] },
    ecSensorHumidity: { label: 'EC Sensor Humidity', unit: '%', color: '#0EA5E9', icon: Droplets, category: 'Environmental', data: [60, 62, 65, 68, 64, 61, 59] },
    ecSensorMoisture: { label: 'EC Sensor Moisture', unit: '%', color: '#10B981', icon: Droplets, category: 'Environmental', data: [42, 45, 48, 44, 46, 50, 47] },
    ecConductivity: { label: 'EC Conductivity', unit: 'mS/cm', color: '#006B4F', icon: Layers, category: 'Environmental', data: [1.2, 1.4, 1.5, 1.3, 1.6, 1.5, 1.3] }
  };

  const currentParam = parameterMeta[activeParam] || parameterMeta.solarVoltage;

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: `${currentParam.label} (${currentParam.unit})`,
        data: currentParam.data,
        borderColor: currentParam.color,
        backgroundColor: `${currentParam.color}22`,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: currentParam.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const systemParamList = Object.entries(parameterMeta).filter(([_, item]) => item.category === 'System');
  const envParamList = Object.entries(parameterMeta).filter(([_, item]) => item.category === 'Environmental');

  const handleExportCSV = () => {
    const csvContent = `Timestamp,${currentParam.label} (${currentParam.unit})\n` +
      chartData.labels.map((l, i) => `${l},${currentParam.data[i]}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${meter.aepcId}_${activeParam}_telemetry.csv`;
    link.click();
    showToast(`Telemetry logs exported for ${meter.aepcId}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => onNavigate('gpkm')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-blue transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Telemetry Fleet</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4 text-brand-blue" />
          <span>Export CSV Stream</span>
        </button>
      </div>

      {/* Meter Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900">{meter.name}</h1>
            <span className="px-3 py-1 bg-blue-50 text-brand-blue rounded-lg text-xs font-mono font-bold border border-blue-100">
              {meter.aepcId}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
            <span>Hardware Status: <strong className="text-green-600">Online & Transmitting</strong></span>
            <span>•</span>
            <span>Firmware: <strong className="text-gray-800">v2.4.1</strong></span>
          </p>
        </div>
      </div>


      {/* PARAMETERS SELECTOR (IMAGE 2 STYLE) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
        
        {/* System Parameters Group */}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
            System Parameters
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {systemParamList.map(([key, item]) => {
              const Icon = item.icon;
              const isActive = activeParam === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveParam(key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Environmental Parameters Group */}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
            Environmental Parameters
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {envParamList.map(([key, item]) => {
              const Icon = item.icon;
              const isActive = activeParam === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveParam(key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>{currentParam.label} Dynamic Telemetry</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time 15-minute telemetry stream captures.</p>
          </div>

          {/* Date Range Picker & Range Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-48 font-medium text-gray-700"
              />
            </div>

            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
              {['Daily', 'Monthly', 'Yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all text-xs ${
                    timeRange === range
                      ? 'bg-white text-gray-900 shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: '#F1F5F9' } },
                x: { grid: { display: false } }
              }
            }} 
          />
        </div>
      </div>
      {/* Weather Forecast Widget */}
      <WeatherWidget />
    </div>
  );
}