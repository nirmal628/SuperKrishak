import React from 'react';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const ACTIVITY_CONFIG = {
  trainings: {
    title: 'Total Number of Training Attended',
    columns: ['SN', 'Training title', 'Registered Date', 'Attendance (Y/N)', 'Time Spent (Minutes)'],
    rows: [
      ['तककारी खेतीमा कटिङ्ग प्रविधि', '2026-08-15', 'No', '0'],
      ['कृषि जैविक विविधता व्यवस्थापन', '2026-07-15', 'No', '0'],
      ['अकबरे खुर्सानी खेती प्रविधि', '2026-07-04', 'No', '0'],
      ['नेपालमा अग्र्यानिक कृषिको अभ्यास र सम्भावनाहरू', '2025-08-15', 'Yes', '0'],
      ['कृषि नीति २०८२/८३: किसानको हितमा के-के छ?', '2025-05-21', 'Yes', '0'],
      ['नेपालमा रैथाने कृषिको उद्यम: सम्भावना र चुनौती', '2025-03-28', 'No', '0'],
      ['कृषि बजार र कृषि मूल्य शृङ्खला: नेपाल परिवेश', '2025-03-22', 'Yes', '0'],
      ['कृषि क्षेत्रमा स्थापना तथा व्यवस्थापन', '2024-08-25', 'Yes', '0'],
    ],
  },
  articles: {
    title: 'Total Number Articles Read',
    columns: ['SN', 'Article title', 'Article published date', 'Viewed date', 'Reactions', 'Time Spent (Minutes)'],
    rows: [
      ['माटोमा मल: भ्रम कि वास्तविकता?', '2026/08/06', '2026/08/14', '3', '12'],
      ['सपोटा खेती: स्वादिलो फलको राम्रो आम्दानीको सम्भावना', '2026/07/30', '2026/08/04', '3', '8'],
      ['पानी जमेको धानमा च्याउ रोपेर', '2026/07/29', '2026/08/21', '1', '5'],
      ['अकबरे खुर्सानी खेती प्रविधि | PDF and Video Available', '2026/07/13', '2026/08/19', '2', '16'],
      ['असार २४-२६ सम्मको मौसम पूर्वानुमान - Weather Podcast', '2026/07/08', '2026/07/18', '3', '9'],
      ['अकबरे खुर्सानी खेती: हावापानी र व्यवस्थापन', '2026/07/01', '2026/08/03', '3', '11'],
      ['माछामा लाग्ने रोगहरू | Fish diseases', '2026/02/09', '2026/06/11', '3', '7'],
      ['पाँचऔंले | Dactylorhiza hatagirea', '2026/02/08', '2026/04/23', '3', '4'],
    ],
  },
  disease: {
    title: 'Total Disease Detection',
    columns: ['SN', 'Crop / livestock', 'Detected disease', 'Detected date', 'Status'],
    rows: [
      ['Rice', 'Rice blast', '2026-07-12', 'Resolved'],
      ['Tomato', 'Late blight', '2026-06-28', 'Monitoring'],
      ['Coffee', 'Coffee leaf rust', '2026-05-16', 'Resolved'],
    ],
  },
  community: {
    title: 'Total Community Post',
    columns: ['SN', 'Post title', 'Posted date', 'Reactions', 'Comments'],
    rows: [
      ['सिँचाइको नयाँ विधिबारे अनुभव', '2026-08-10', '8', '2'],
      ['कफीको बिरुवा संरक्षण गर्ने उपाय', '2026-07-19', '12', '4'],
      ['स्थानीय बीउ आदानप्रदान', '2026-06-07', '5', '1'],
    ],
  },
};

export default function FarmerActivityPage({ farmerId, activityType, onNavigate }) {
  const { farmers } = useData();
  const farmer = farmers.find(item => item.id === farmerId) || farmers[0];
  const activity = ACTIVITY_CONFIG[activityType] || ACTIVITY_CONFIG.trainings;

  if (!farmer) return null;

  return (
    <div className="min-h-full bg-[#f3f4f6] -m-4 sm:-m-8 p-4 sm:p-8 animate-fadeIn">
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">All Farmers</h1>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        <div className="px-5 py-5 flex items-center gap-3 text-sm font-bold text-gray-800">
          <button
            type="button"
            onClick={() => onNavigate('farmer_detail')}
            aria-label="Back to farmer details"
            className="w-8 h-8 rounded-full bg-sky-50 text-sky-400 flex items-center justify-center hover:bg-sky-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span>{farmer.name} User activities Information</span>
        </div>

        <div className="mx-4 sm:mx-5 mb-5 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-xs sm:text-sm font-bold text-gray-800 mb-4">{activity.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {activity.columns.map(column => <th key={column} className="px-3 py-3 font-semibold">{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {activity.rows.map((row, index) => (
                  <tr key={`${activityType}-${index}`} className="border-t border-gray-100">
                    <td className="px-3 py-3">{index + 1}</td>
                    {row.map((value, valueIndex) => <td key={`${index}-${valueIndex}`} className="px-3 py-3">{value}</td>)}
                  </tr>
                ))}
                {activity.rows.length === 0 && (
                  <tr><td colSpan={activity.columns.length} className="px-3 py-10 text-center text-gray-400">No activity records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 text-xs text-gray-500">
            <button type="button" aria-label="Previous page" className="p-1 text-gray-300"><ChevronLeft className="w-4 h-4" /></button>
            <button type="button" className="w-7 h-7 rounded-md border border-sky-400 text-sky-500">1</button>
            <button type="button" aria-label="Next page" className="p-1 text-gray-500"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
