import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend, Filler);

export default function FieldDataPage({ fieldId, onNavigate }) {
  const { fields, farmers } = useData();
  const field = fields.find(f => f.id === fieldId) || fields[0];
  const [activeLayer, setActiveLayer] = useState('NDVI');
  const [selectedDate, setSelectedDate] = useState('2024-05-03');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const fieldPolygon = useRef(null);

  const labels = ['2024-06-03', '2024-03-31', '2024-01-27', '2023-11-24', '2023-09-22'];
  const dates = ['2024-05-03', '2024-05-14', '2024-05-24', '2024-05-29', '2024-06-03'];
  const layerData = {
    NDVI: [0.42, 0.53, 0.48, 0.41, 0.35],
    SAVI: [0.38, 0.46, 0.44, 0.39, 0.31],
    NDMI: [0.33, 0.41, 0.36, 0.34, 0.29],
  };

  const chartData = {
    labels,
    datasets: [{
      data: layerData[activeLayer],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      fill: true,
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { min: 0.2, max: 0.7, grid: { color: '#e5e7eb' } },
    },
  };

  const weatherData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Temp', data: [18, 20, 26, 28, 30], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: false },
      { label: 'Humidity', data: [55, 60, 58, 62, 65], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: false },
      { label: 'PPT', data: [12, 15, 18, 14, 10], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: false },
    ],
  };

  const farmer = farmers.find(item => item.id === field?.farmerId);
  const center = field?.coords || farmer?.coords || [27.7, 85.3];
  const dateIndex = Math.max(dates.indexOf(selectedDate), 0);
  const polygonSize = 0.001 + dateIndex * 0.00012;
  const polygonPoints = [
    [center[0] - polygonSize, center[1] - polygonSize * 1.2],
    [center[0] + polygonSize * 0.8, center[1] - polygonSize],
    [center[0] + polygonSize * 1.2, center[1] + polygonSize * 0.75],
    [center[0] - polygonSize * 0.7, center[1] + polygonSize * 1.2],
  ];

  useEffect(() => {
    if (!mapRef.current || !field) return;
    const map = L.map(mapRef.current, { zoomControl: true }).setView(center, 17);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);
    map.fitBounds(polygonPoints, { padding: [35, 35] });
    fieldPolygon.current = L.polygon(polygonPoints, {
      color: '#16803c', fillColor: '#22c55e', fillOpacity: 0.62, weight: 3
    }).addTo(map);
    fieldPolygon.current.bindPopup(`<strong>${field.plotName}</strong><br/>${selectedDate}<br/>${activeLayer}`);
    fieldPolygon.current.openPopup();
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; fieldPolygon.current = null; };
  }, [field, selectedDate]);

  useEffect(() => {
    if (!fieldPolygon.current) return;
    const color = activeLayer === 'NDVI' ? ['#16803c', '#22c55e'] : activeLayer === 'NDMI' ? ['#2563eb', '#60a5fa'] : ['#d97706', '#fbbf24'];
    fieldPolygon.current.setStyle({ color: color[0], fillColor: color[1] });
    fieldPolygon.current.getPopup()?.setContent(`<strong>${field.plotName}</strong><br/>${selectedDate}<br/>${activeLayer}`);
  }, [activeLayer, selectedDate, field]);

  if (!field) return null;

  return (
    <div className="space-y-5 bg-[#eef1f3] p-0 text-gray-700">
      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-lg font-semibold">Data Observation</div>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Index Value</span>
            <div className="flex gap-2">
              {['NDVI', 'NDMI', 'SAVI'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveLayer(item)}
                  className={`px-3 py-1 rounded text-xs ${activeLayer === item ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 170 }}>
            <Line data={chartData} options={{ ...chartOptions, onClick: (_, elements) => {
              if (elements[0]) setSelectedDate(dates[Math.min(elements[0].index, dates.length - 1)]);
            } }} />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-xl font-bold">Remote Monitoring</div>
          <button className="text-gray-500">⌄</button>
        </div>
        <div className="p-4">
          <div className="flex justify-end mb-3">
            <div className="flex gap-2">
              {['NDVI', 'SAVI', 'NDMI'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveLayer(item)}
                  className={`px-3 py-1 rounded text-xs ${activeLayer === item ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={mapRef}
            className="rounded-lg overflow-hidden border border-gray-200"
            style={{ height: 360, minHeight: 360, background: '#dbe4ea' }}
          />

          <div className="mt-3 flex overflow-hidden border border-gray-300 rounded-md bg-white">
            {dates.map(date => (
              <button key={date} onClick={() => setSelectedDate(date)} className={`px-2 py-1 text-[10px] border-r border-gray-200 ${selectedDate === date ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>
                {date}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-xl font-bold">Weather Monitoring</div>
          <button className="text-gray-500">⌄</button>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Index Value</span>
            <div className="flex gap-2">
              {['Temp', 'Humidity', 'PPT', 'Cloud'].map(item => (
                <button key={item} className={`px-3 py-1 rounded text-xs ${item === 'Temp' ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 150 }}>
            <Line data={weatherData} options={{ ...chartOptions, scales: { x: { display: true, grid: { display: false } }, y: { min: 0, max: 80, grid: { color: '#e5e7eb' } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
