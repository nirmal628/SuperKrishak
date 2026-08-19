import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Radio, 
  Download, 
  Calendar, 
  Activity, 
  Droplets, 
  Thermometer, 
  Sun, 
  Sprout 
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

  const [activeParam, setActiveParam] = useState('soilMoisture');
  const [timeRange, setTimeRange] = useState('Daily');

  const parameterMeta = {
    airTemp: { label: 'Air Temperature', unit: '°C', color: '#EF4444', data: [22, 24, 28, 30, 27, 25, 23] },
    humidity: { label: 'Relative Humidity', unit: '%', color: '#3B82F6', data: [75, 78, 82, 85, 83, 80, 77] },
    soilTemp: { label: 'Soil Temperature', unit: '°C', color: '#F59E0B', data: [19, 20, 21, 23, 22, 21, 20] },
    soilMoisture: { label: 'Soil Moisture', unit: '%', color: '#2DA86E', data: [42, 45, 48, 44, 46, 50, 47] },
    soilNutrients: { label: 'Soil NPK (Nitrogen)', unit: 'mg/kg', color: '#8B5CF6', data: [110, 115, 112, 118, 120, 119, 115] }
  };

  const currentParam = parameterMeta[activeParam];

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
      {/* Header */}
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
            <span>Hardware Status: <strong className="text-brand-green">Online & Transmitting</strong></span>
            <span>•</span>
            <span>Firmware: <strong className="text-gray-800">v2.4.1</strong></span>
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold">
          {['Daily', 'Monthly', 'Yearly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Forecast Widget */}
      <WeatherWidget />

      {/* Sensor telemetry selector pills */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'soilMoisture', label: 'Soil Moisture (%)', icon: Droplets },
          { key: 'airTemp', label: 'Air Temp (°C)', icon: Thermometer },
          { key: 'humidity', label: 'Relative Humidity (%)', icon: Sun },
          { key: 'soilTemp', label: 'Soil Temp (°C)', icon: Thermometer },
          { key: 'soilNutrients', label: 'Soil NPK (mg/kg)', icon: Sprout }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeParam === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveParam(item.key)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-brand-blue text-white shadow-md ring-2 ring-brand-blue/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              <span>{currentParam.label} Dynamic Telemetry</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">High frequency 15-minute sensor stream captures.</p>
          </div>
          <span className="text-lg font-black text-gray-900">
            {currentParam.data[currentParam.data.length - 1]} {currentParam.unit} (Latest)
          </span>
        </div>

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
    </div>
  );
}
