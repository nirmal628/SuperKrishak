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
import { MapPin, Ruler, Users, Search, Download, Info, ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const PALETTE = ['#00C88C', '#0B6651', '#2DD4BF', '#008F83', '#16A66A', '#76E5BC', '#0A4233'];
const PERFORMANCE_PALETTE = ['#00C88C', '#0B6651', '#2DD4BF'];
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
    
    // Table states
    const [tableSearchTerm, setTableSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(2);
    const totalPages = 3;

    const geoMapRef = useRef(null);
    const geoMapInstance = useRef(null);

    const cropCounts = fields.reduce((acc, f) => {
        acc[f.crop] = (acc[f.crop] || 0) + 1;
        return acc;
    }, {});
    const totalArea = fields.reduce((s, f) => s + (f.area || 0), 0).toFixed(1);

    useEffect(() => {
        if (!geoMapRef.current || geoMapInstance.current) return;
        const map = L.map(geoMapRef.current, { zoomControl: true }).setView([28.1, 84.1], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        farmers.forEach(farmer => {
            if (farmer.coords) {
                L.circleMarker(farmer.coords, {
                    radius: 9, fillColor: '#21A9DF', color: '#fff', weight: 1.5, fillOpacity: 0.75
                }).addTo(map).bindPopup(`<strong>${farmer.name}</strong>`);
            }
        });
        geoMapInstance.current = map;
        return () => {
            if (geoMapInstance.current) { geoMapInstance.current.remove(); geoMapInstance.current = null; }
        };
    }, [farmers]);

    // Lands Plotted by Crop Data
    const donutData = {
        labels: Object.keys(cropCounts).length > 0 ? Object.keys(cropCounts) : ['Rice', 'Coffee', 'Tomato', 'Apple'],
        datasets: [{
            data: Object.values(cropCounts).length > 0 ? Object.values(cropCounts) : [1, 1, 1, 1],
            backgroundColor: PALETTE, 
            borderWidth: 0, 
            hoverOffset: 4
        }]
    };

    // Field Performance Data
    const performanceData = {
        labels: ['Above band 4 (57%)', 'Within band 2 (29%)', 'Below band 1 (14%)'],
        datasets: [{
            data: [57, 29, 14],
            backgroundColor: PERFORMANCE_PALETTE,
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } }
    };

    const additionChartData = {
        labels: LANDS_LABELS, 
        datasets: [{ 
            data: LANDS_ADDITION_DATA, 
            borderColor: '#008F83', 
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(0, 143, 131, 0.18)');
                gradient.addColorStop(1, 'rgba(0, 143, 131, 0.0)');
                return gradient;
            },
            fill: true, 
            tension: 0.4, 
            pointRadius: 4, 
            pointBackgroundColor: '#008F83',
            pointHoverRadius: 6
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

    // Status Badge Helper
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Above':
                return (
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#D3EEDD] text-[#0B6651] inline-block">
                        Above
                    </span>
                );
            case 'Below':
                return (
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F5D8D8] text-[#B83232] inline-block">
                        Below
                    </span>
                );
            case 'Average':
                return (
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#ECE3C8] text-[#8C6422] inline-block">
                        Average
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 inline-block">
                        {status}
                    </span>
                );
        }
    };

    const tableData = fields.length > 0 ? fields.map((field) => {
        const farmer = farmers.find(f => f.id === field.farmerId);
        return {
            id: field.id,
            farmName: farmer?.name || 'Swarup Farm',
            plotName: field.plotName || 'Birgha ko khet',
            crop: field.crop || 'Wheat',
            area: field.area || 50,
            fieldScore: field.fieldScore || '0.65',
            status: field.status || (field.area > 60 ? 'Above' : field.area > 40 ? 'Average' : 'Below')
        };
    }) : [
        { id: '1', farmName: 'Swarup Farm', plotName: 'Birgha ko khet', crop: 'Wheat', area: 50, fieldScore: '0.65', status: 'Above' },
        { id: '2', farmName: 'Swarup Farm', plotName: 'Pentagon Farm', crop: 'Rice', area: 30, fieldScore: '0.70', status: 'Average' },
        { id: '3', farmName: 'Swarup Farm', plotName: 'Tomato Hub', crop: 'Tomato', area: 25, fieldScore: '0.74', status: 'Above' },
        { id: '4', farmName: 'Green Valley', plotName: 'Green Valley Plot', crop: 'Corn', area: 75, fieldScore: '0.58', status: 'Below' },
        { id: '5', farmName: 'Green Valley', plotName: 'Plot B', crop: 'Coffee', area: 45, fieldScore: '0.68', status: 'Above' },
        { id: '6', farmName: 'Sunny Acres', plotName: 'Plot D', crop: 'Barley', area: 60, fieldScore: '0.72', status: 'Average' },
        { id: '7', farmName: 'Hilltop Ranch', plotName: 'Physical Farm', crop: 'Soybean', area: 80, fieldScore: '0.55', status: 'Above' },
        { id: '8', farmName: 'Hilltop Ranch', plotName: 'Plot F', crop: 'Rice', area: 40, fieldScore: '0.61', status: 'Above' },
        { id: '9', farmName: 'Blue River Farm', plotName: 'Riverside Plot', crop: 'Oats', area: 65, fieldScore: '0.60', status: 'Below' },
        { id: '10', farmName: 'Maple Grove', plotName: 'Plot H', crop: 'Rice', area: 70, fieldScore: '0.68', status: 'Above' }
    ];

    const filteredTableData = tableData.filter((row) => {
        const q = tableSearchTerm.toLowerCase();
        return (
            row.farmName.toLowerCase().includes(q) ||
            row.plotName.toLowerCase().includes(q) ||
            row.crop.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Top Header & Summary KPI Section */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Farms</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Fields */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-800">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">TOTAL FIELDS</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-2xl font-black text-gray-900">{fields.length || 5}</span>
                                <span className="text-[11px] font-bold text-emerald-800 bg-[#D3EEDD] px-2 py-0.5 rounded-md">+2%</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Area */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-800">
                            <Ruler className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">TOTAL AREA (HA)</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-2xl font-black text-gray-900">{totalArea || '64.0'}</span>
                                <span className="text-[11px] font-bold text-emerald-800 bg-[#D3EEDD] px-2 py-0.5 rounded-md">+4%</span>
                            </div>
                        </div>
                    </div>

                    {/* Farmers */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-800">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">FARMERS</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-2xl font-black text-gray-900">{farmers.length || 45}</span>
                                <span className="text-[11px] font-bold text-emerald-800 bg-[#D3EEDD] px-2 py-0.5 rounded-md">+12%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geo Distribution Map */}
            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span>Geo Distribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Enter address"
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-52 outline-none focus:border-blue-400" />
                    </div>
                </div>
                <div ref={geoMapRef} style={{ height: '280px', width: '100%' }} />
            </div>

            {/* Middle Row: Donut Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Lands Plotted by Crop */}
                <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-900">Lands Plotted by Crop</h2>
                        <InfoTooltip text="The chart shows how many registered plots belong to each crop type." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-6 relative h-44 flex items-center justify-center">
                            <Doughnut data={donutData} options={donutOptions} redraw={true} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold text-gray-900 leading-none">
                                    {Object.keys(cropCounts).length || 4}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 mt-1">
                                    crop types
                                </span>
                            </div>
                        </div>
                        <div className="sm:col-span-6 space-y-2.5 pl-2">
                            {Object.keys(cropCounts).length > 0 ? (
                                Object.entries(cropCounts).map(([crop, count], i) => (
                                    <div key={crop} className="flex items-center gap-2 text-xs">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                                        <span className="text-gray-700 font-medium truncate">{crop}</span>
                                        <span className="font-bold text-gray-900 ml-auto">{count}</span>
                                    </div>
                                ))
                            ) : (
                                [
                                    { name: 'Rice', count: 1, color: PALETTE[0] },
                                    { name: 'Coffee', count: 1, color: PALETTE[1] },
                                    { name: 'Tomato', count: 1, color: PALETTE[5] },
                                    { name: 'Apple', count: 1, color: PALETTE[3] }
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center gap-2 text-xs">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-700 font-medium truncate">{item.name}</span>
                                        <span className="font-bold text-gray-900 ml-auto">{item.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Field Performance Card */}
                <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-900">Field Performance</h2>
                        <InfoTooltip text="Distribution of field plots across performance vegetation index bands." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-6 relative h-44 flex items-center justify-center">
                            <Doughnut data={performanceData} options={donutOptions} />
                        </div>
                        <div className="sm:col-span-6 space-y-3 pl-2">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PERFORMANCE_PALETTE[0] }}></span>
                                <span className="text-gray-700 font-medium truncate">Above band 4 (57%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PERFORMANCE_PALETTE[1] }}></span>
                                <span className="text-gray-700 font-medium truncate">Within band 2 (29%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PERFORMANCE_PALETTE[2] }}></span>
                                <span className="text-gray-700 font-medium truncate">Below band 1 (14%)</span>
                            </div>
                        </div>
                    </div>
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
                                className={`px-3 py-1 rounded text-xs font-semibold transition ${activeTimeTab === tab ? 'bg-[#41af66] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: 160 }}>
                    <Line data={additionChartData} options={additionOptions} />
                </div>
            </div>

            {/* Farms Table Section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Farms</h2>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                        <select
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 bg-white shadow-2xs outline-none cursor-pointer"
                        >
                            <option value="ALL">All Organizations</option>
                            <option value="ORG_1">Ghami Power Org</option>
                            <option value="ORG_2">Ward Ag Unit</option>
                        </select>

                        <div className="relative flex-1 md:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={tableSearchTerm}
                                onChange={(e) => setTableSearchTerm(e.target.value)}
                                placeholder="Search Farm..."
                                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#00B074] bg-white shadow-2xs"
                            />
                        </div>

                        <button
                            onClick={() => {}}
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white shadow-2xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Report</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-gray-50/60 border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <tr>
                                <th className="px-5 py-3.5">Farm Name</th>
                                <th className="px-5 py-3.5">Plot Name</th>
                                <th className="px-5 py-3.5">Crop</th>
                                <th className="px-5 py-3.5">Area(ha)</th>
                                <th className="px-5 py-3.5">Field Score</th>
                                <th className="px-5 py-3.5">
                                    <div className="flex items-center gap-1">
                                        <span>Status</span>
                                        <Info className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                </th>
                                <th className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                            {filteredTableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/60 transition">
                                    <td className="px-5 py-4 font-semibold text-gray-900">{row.farmName}</td>
                                    <td className="px-5 py-4 font-bold text-gray-900">{row.plotName}</td>
                                    <td className="px-5 py-4 text-gray-600">{row.crop}</td>
                                    <td className="px-5 py-4 font-mono text-gray-800">{row.area}</td>
                                    <td className="px-5 py-4 font-mono text-gray-800">{row.fieldScore}</td>
                                    <td className="px-5 py-4">{getStatusBadge(row.status)}</td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                onSelectField(row.id);
                                                onNavigate('field_monitor', row.id);
                                            }}
                                            className="text-[#00B074] hover:underline font-bold text-xs"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTableData.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400 font-medium">
                                        No plot records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-2 text-xs font-medium text-gray-500">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="flex items-center gap-1 hover:text-gray-900 transition"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                    </button>

                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition font-semibold ${
                                currentPage === page
                                    ? 'border border-gray-300 bg-white text-gray-900 font-bold shadow-2xs'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <span className="px-1 text-gray-400 font-bold">...</span>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="flex items-center gap-1 hover:text-gray-900 transition ml-1"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}