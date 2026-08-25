import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import L from 'leaflet';
import InfoTooltip from '../components/common/InfoTooltip';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const PALETTE = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#FB7185', '#38BDF8', '#4ADE80'];
const LANDS_ADDITION_DATA = [2, 5, 3, 8, 15, 10, 25, 30, 18, 12, 40, 35, 28, 50, 45, 30, 55, 48, 60];
const LANDS_LABELS = [
    'Aug 2023', 'Oct 2023', 'Dec 2023', 'Feb 2024', 'Apr 2024',
    'Jun 2024', 'Aug 2024', 'Oct 2024', 'Dec 2024', 'Feb 2025',
    'Apr 2025', 'Jun 2025', 'Aug 2025', 'Oct 2025', 'Dec 2025',
    'Feb 2026', 'Apr 2026', 'Jun 2026', 'Aug 2026'
];

export default function FieldInsightsPage({ onNavigate, onSelectField }) {
    const { fields, farmers } = useData();
    const [activeTimeTab, setActiveTimeTab] = useState('Daily');
    const geoMapRef = useRef(null);
    const geoMapInstance = useRef(null);

    const cropCounts = fields.reduce((acc, f) => {
        acc[f.crop] = (acc[f.crop] || 0) + 1;
        return acc;
    }, {});
    const totalArea = fields.reduce((s, f) => s + (f.area || 0), 0).toFixed(2);

    useEffect(() => {
        if (!geoMapRef.current || geoMapInstance.current) return;
        const map = L.map(geoMapRef.current, { zoomControl: true }).setView([28.1, 84.1], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        farmers.forEach(farmer => {
            if (farmer.coords) {
                L.circleMarker(farmer.coords, {
                    radius: 9, fillColor: '#3B82F6', color: '#fff', weight: 1.5, fillOpacity: 0.75
                }).addTo(map).bindPopup(`<strong>${farmer.name}</strong>`);
            }
        });
        geoMapInstance.current = map;
        return () => {
            if (geoMapInstance.current) { geoMapInstance.current.remove(); geoMapInstance.current = null; }
        };
    }, [farmers]);

    const donutData = {
        labels: Object.keys(cropCounts).length > 0 ? Object.keys(cropCounts) : ['No Crops'],
        datasets: [{
            data: Object.values(cropCounts).length > 0 ? Object.values(cropCounts) : [1],
            backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 4
        }]
    };

    const additionChartData = {
        labels: LANDS_LABELS,
        datasets: [{
            data: LANDS_ADDITION_DATA,
            borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5, pointHoverRadius: 4
        }]
    };

    const additionOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 0, maxTicksLimit: 6 } },
            y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { font: { size: 9 } } }
        }
    };

    return (
        <div className="space-y-5 animate-fadeIn">

            {/* Geo Distribution Map */}
            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span>Geo Distribution</span>
                        <InfoTooltip className="absolute top-1 right-1" text="The map shows the geographic locations associated with farmers in the field network." />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Enter address"
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-52 outline-none focus:border-blue-400" />
                        {/* <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm">✕</button> */}
                    </div>
                </div>
                <div ref={geoMapRef} style={{ height: '280px', width: '100%' }} />
            </div>

            {/* Middle Row: Donut + Total HA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-4">
                        <span>Lands Plotted by Crop</span>
                        <InfoTooltip className="absolute top-1 right-1" text="The chart shows how many registered plots belong to each crop type." />
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
                            <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-gray-900">{fields.length}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 min-w-0">
                            {Object.entries(cropCounts).map(([crop, count], i) => (
                                <div key={crop} className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                                    <span className="text-gray-600 truncate">{crop}</span>
                                    <span className="font-bold text-gray-800 ml-auto pl-2">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <span>Total Lands Plotted</span>
                            <InfoTooltip className="absolute top-1 right-1" text="The total recorded area of all registered plots, measured in hectares (HA)." />
                        </div>
                        <select className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 outline-none cursor-pointer">
                            <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Yearly</option>
                        </select>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-6xl font-black text-gray-900 tracking-tighter">
                            {totalArea} <span className="text-3xl font-black">HA</span>
                        </p>
                        <p className="text-lg font-semibold text-gray-500 mt-1">0.00 M</p>
                    </div>
                    <div />
                </div>
            </div>

            {/* Lands Addition Timeline */}
            <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <span>Lands Addition</span>
                        <InfoTooltip className="absolute top-1 right-1" text="The timeline shows how much new land area was added to the registry over time." />
                    </div>
                    <div className="flex gap-1">
                        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(tab => (
                            <button key={tab} onClick={() => setActiveTimeTab(tab)}
                                className={`px-3 py-1 rounded text-xs font-semibold transition ${activeTimeTab === tab ? 'bg-[#3894db] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: 160 }}>
                    <Line data={additionChartData} options={additionOptions} />
                </div>
            </div>

            {/* Farms List */}
            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[18px] font-bold text-gray-800">Lands plotted</h2>
                        <InfoTooltip className="absolute top-1 right-1" text="This table lists the individual plots included in the field registry." />
                    </div>
                    {/* <button className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xl leading-none">×</button> */}
                </div>

                <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 bg-gray-50">
                    {/* <select className="border border-gray-200 bg-white rounded px-2 py-1.5 text-sm text-gray-700 outline-none">
                        <option>Order by: Time Stamp</option>
                    </select>
                    <select className="border border-gray-200 bg-white rounded px-2 py-1.5 text-sm text-gray-700 outline-none">
                        <option>Select Timeframe:</option>
                    </select> */}
                    <div className="ml-auto flex items-center gap-2">
                        <input type="text" placeholder="Start date" className="border border-gray-200 bg-white rounded px-2 py-1.5 text-sm w-28 outline-none" />
                        <span className="text-gray-500">→</span>
                        <input type="text" placeholder="End date" className="border border-gray-200 bg-white rounded px-2 py-1.5 text-sm w-28 outline-none" />
                    </div>
                </div>

                <div className="px-3 py-3 border-b border-gray-200 bg-gray-50">
                    <input type="text" placeholder="Search..." className="w-full border border-gray-200 bg-white rounded px-3 py-2 text-sm outline-none" />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Time Stamp</th>
                                <th className="px-4 py-3 font-semibold">User Name</th>
                                <th className="px-4 py-3 font-semibold">Area</th>
                                <th className="px-4 py-3 font-semibold">Plot Name</th>
                                <th className="px-4 py-3 font-semibold">Crop Type</th>
                                <th className="px-4 py-3 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field) => {
                                const farmer = farmers.find(f => f.id === field.farmerId);
                                return (
                                    <tr key={field.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700">{field.date}</td>
                                        <td className="px-4 py-3 text-gray-700">{farmer?.name ?? 'Unknown'}</td>
                                        <td className="px-4 py-3 text-gray-700">{field.area}</td>
                                        <td className="px-4 py-3 text-gray-700">{field.plotName}</td>
                                        <td className="px-4 py-3 text-gray-700">{field.crop}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => { onSelectField(field.id); onNavigate('field_monitor'); }}
                                                className="border border-blue-400 text-blue-500 rounded px-3 py-1.5 font-medium hover:bg-blue-50"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
