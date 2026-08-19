import React from 'react';
import { useData } from '../context/DataContext';

export default function FieldMonitorPage({ onNavigate }) {
  const { fields, farmers } = useData();

  return (
    <div className="bg-[#e2e4e7] min-h-screen p-8 text-[#5c656e]">
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#666c72]">Farms</h1>
        <button className="bg-[#4aa3df] hover:bg-[#3d91c9] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">
          Download PDF Report
        </button>
      </div>

      {/* Fields List */}
      <div className="space-y-10">
        {fields.map((field) => {
          const farmer = farmers.find((f) => f.id === field?.farmerId);

          // Handle array of coordinates or string coordinates fallback
          const coordinates = Array.isArray(field.coordinates)
            ? field.coordinates
            : [
                '83.9800225943327 28.221516715985214',
                '83.97974364459515 28.220558958464267',
                '83.98058284074068 28.220559253887394',
                '83.98055367171764 28.22124049747078',
                '83.9800225943327 28.221516715985214',
              ];

          return (
            <div key={field.id} className="space-y-4">
              {/* Plot Header Name */}
              <h2 className="text-2xl font-bold text-[#575d63]">{field.plotName}</h2>

              {/* Data Grid */}
              <div className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-2.5 text-[15px] leading-relaxed">
                <span className="font-normal text-[#6c747d]">User Name:</span>
                <span className="text-[#5c656e]">{farmer?.name ?? 'Akashh11111'}</span>

                <span className="font-normal text-[#6c747d]">Date Created:</span>
                <span className="text-[#5c656e]">
                  {field.date ?? '2023-12-17T22:42:40.629806+05:45'}
                </span>

                <span className="font-normal text-[#6c747d]">Farm Name:</span>
                <span className="text-[#5c656e]">{field.plotName}</span>

                <span className="font-normal text-[#6c747d]">Plots:</span>
                <div className="space-y-0.5 text-[#5c656e]">
                  {coordinates.map((coord, index) => (
                    <div key={index}>{coord}</div>
                  ))}
                </div>

                <span className="font-normal text-[#6c747d]">Area:</span>
                <span className="text-[#5c656e]">{field.area ?? '2.264983851323257'}</span>

                <span className="font-normal text-[#6c747d]">Crop Type:</span>
                <span className="text-[#5c656e]">{field.crop ?? 'Wheat'}</span>

                <span className="font-normal text-[#6c747d]">Sowing Date:</span>
                <span className="text-[#5c656e]">{field.sowingDate ?? '2023-12-17'}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigate('field_data', field.id)}
                className="mt-2 border-2 border-[#4aa3df] text-[#4aa3df] hover:bg-[#4aa3df] hover:text-white rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}