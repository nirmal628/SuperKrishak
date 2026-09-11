import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Download, 
  User, 
  Calendar, 
  MapPin, 
  Sprout, 
  Ruler, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Map,
  Sprout as FarmIcon
} from 'lucide-react';

export default function FieldMonitorPage({ fieldId, onNavigate, onSelectField }) {
  const { fields, farmers } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // 1. Identify selected plot (or default to the first plot)
  const selectedField = fields.find((f) => f.id === fieldId) || fields[0];

  // 2. Identify owner farmer
  const farmer = farmers.find((f) => f.id === selectedField?.farmerId) || farmers[0];

  // 3. Filter all farms belonging to this specific farmer
  const farmerFields = fields.filter((f) => f.farmerId === farmer?.id);

  // Separate the primary clicked plot from the farmer's remaining plots
  const primaryField = selectedField;
  const otherFields = farmerFields.filter((f) => f.id !== primaryField?.id);

  // Helper card renderer to keep design uniform
  const renderFarmCard = (field, isPrimary = false) => {
    const coordinates = Array.isArray(field.coordinates)
      ? field.coordinates
      : [
          '83.9800225943327, 28.221516715985214',
          '47.5369271456789, 63.2147859123471',
          '92.8413579346753, 14.7856239874567',
          '12.4798123456789, 77.8921345678902',
          '65.2389475612345, 42.1098765432109',
          '31.9876543210987, 59.8765432109876',
        ];

    return (
      <div 
        key={field.id} 
        className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 transition ${
          isPrimary ? 'border-[#00B074]/40 ring-2 ring-[#00B074]/10' : 'border-gray-200/80'
        }`}
      >
        {/* Plot Card Title Badge */}
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <span>{field.plotName}</span>
            {isPrimary && (
              <span className="text-[10px] uppercase font-bold bg-[#E3F6EC] text-[#00B074] px-2 py-0.5 rounded-full border border-[#00B074]/20">
                Selected Plot
              </span>
            )}
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Icon Avatar + Meta Details */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E3F6EC] text-[#00B074] flex items-center justify-center shrink-0">
              <Map className="w-8 h-8 text-[#00B074]" />
            </div>

            {/* Metadata Rows */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="w-24 text-gray-400 font-medium">Username</span>
                <span className="font-bold text-gray-900">{farmer?.name ?? 'Swarup Sen'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="w-24 text-gray-400 font-medium">Date Created</span>
                <span className="font-bold text-gray-900">{field.date ?? '2026-08-08 08:54 AM'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="w-24 text-gray-400 font-medium">Farm Name</span>
                <span className="font-bold text-gray-900">{field.plotName}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Plots Coordinate List */}
          <div className="lg:col-span-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>Plots ({coordinates.length})</span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono text-gray-600 max-h-32 overflow-y-auto pr-2">
              {coordinates.map((coord, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] shrink-0"></span>
                  <span className="truncate">{coord}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar & View Button */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-1 text-gray-400 font-medium mb-0.5">
                <Ruler className="w-3.5 h-3.5 text-gray-400" />
                <span>Area</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">{field.area ?? '1.05'}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-400 font-medium mb-0.5">
                <Sprout className="w-3.5 h-3.5 text-gray-400" />
                <span>Crop Type</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">{field.crop ?? 'Rice'}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-400 font-medium mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Sowing Date</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">{field.sowingDate ?? '2023-12-17'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectField) onSelectField(field.id);
              if (onNavigate) onNavigate('field_data', field.id);
            }}
            className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-xs transition shadow-2xs"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {farmer?.name ?? 'Swarup Sen'} Farms
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">
            Overview of the farms under {farmer?.name ?? 'Swarup Sen'}
          </p>
        </div>
        <button 
          onClick={() => {}}
          className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-white shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Primary Selected Plot (e.g. Pentagon Farm) */}
      {primaryField && (
        <div className="space-y-2">
          {renderFarmCard(primaryField, true)}
        </div>
      )}

      {/* Other Farms Section for the Same Farmer */}
      {otherFields.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3">
            <FarmIcon className="w-4 h-4 text-[#00B074]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              Other farms of {farmer?.name ?? 'Swarup Sen'} ({otherFields.length})
            </h2>
          </div>

          <div className="space-y-4">
            {otherFields.map((field) => renderFarmCard(field, false))}
          </div>
        </div>
      )}

      {/* Fallback if farmer has no other fields */}
      {otherFields.length === 0 && (
        <div className="text-center py-6 text-xs text-gray-400 font-medium">
          No additional farm plots registered under {farmer?.name}.
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex justify-end items-center gap-2 text-xs font-medium text-gray-500 pt-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="flex items-center gap-1 hover:text-gray-900 transition ml-1"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}