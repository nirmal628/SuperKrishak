import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Phone, 
  Eye, 
  Coins, 
  Trophy,
  Sprout,
  Satellite,
  Compass,
  BookOpen
} from 'lucide-react';

export default function FarmerDetailPage({ farmerId, onNavigate, onSelectField, onOpenActivity }) {
  const { farmers, fields } = useData();

  const farmer = farmers.find(f => f.id === farmerId) || farmers[0];
  const farmerFields = fields.filter(f => f.farmerId === farmer?.id);

  if (!farmer) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p>Farmer profile not found.</p>
        <button 
          onClick={() => onNavigate('farmers')}
          className="mt-4 px-4 py-2 bg-[#00B074] text-white rounded-xl text-sm font-bold"
        >
          Back to Farmers Network
        </button>
      </div>
    );
  }

  const activities = farmer.activities || {
    trainingsAttended: 12,
    reactions: 3,
    articlesRead: 5,
    quizParticipation: 5,
    comments: 6,
    landsPlotted: 45,
    diseaseDetection: 3,
    communityPost: 34,
    communityComments: 9,
    refers: 0,
    soilReport: 7,
    calculatorUse: 67
  };

  const generalInfo = farmer.generalInfo || {
    statusDesc: farmer.occupation || 'गाउँमा बसेर कृषि',
    learningInterest: 'तरकारी खेती'
  };

  // Helper for Farmer Avatar Initials
  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header with Back Arrow */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('farmers')}
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition shadow-xs shrink-0"
          title="Back to Farmers"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{farmer.name}</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Track and analyze user engagement across your organization.</p>
        </div>
      </div>

      {/* Profile Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Farmer Profile Card */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar with Light Green Background */}
          <div className="w-20 h-20 rounded-full bg-[#E3F6EC] text-[#00B074] font-extrabold text-2xl flex items-center justify-center shrink-0">
            {getInitials(farmer.name)}
          </div>

          {/* Details Table Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs">
            {/* Column 1 */}
            <div className="space-y-2.5">
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Name</span>
                <span className="font-bold text-gray-900">{farmer.name}</span>
              </div>
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Gender</span>
                <span className="font-semibold text-gray-800">{farmer.gender === 'M' ? 'Male' : farmer.gender === 'F' ? 'Female' : farmer.gender || 'Male'}</span>
              </div>
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Address</span>
                <span className="font-semibold text-gray-800 leading-relaxed">
                  {farmer.address || `${farmer.location || 'Sakarpura, Saptari - 3'}, Madhesh, Nepal`}
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Mobile Number</span>
                <a 
                  href={`tel:${farmer.mobile}`} 
                  className="font-bold text-gray-900 hover:text-[#00B074] transition underline decoration-gray-300"
                >
                  {farmer.mobile}
                </a>
              </div>
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Location</span>
                <span className="font-medium text-gray-700">
                  Latitude <strong className="text-gray-900">{farmer.coords ? farmer.coords[0] : '26.540447'}</strong>
                  <br />
                  Longitude <strong className="text-gray-900">{farmer.coords ? farmer.coords[1] : '86.749886'}</strong>
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-28 text-gray-400 font-medium">Coins Collected</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  {farmer.coins || 0}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-2.5">
              <div className="flex items-start">
                <span className="w-24 text-gray-400 font-medium">Age Group</span>
                <span className="font-bold text-gray-800">{farmer.ageGroup || '30-40'}</span>
              </div>
              <div className="flex items-start">
                <span className="w-24 text-gray-400 font-medium">Email</span>
                <span className="font-medium text-gray-700 font-mono">{farmer.email || `${farmer.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</span>
              </div>
              <div className="flex items-start">
                <span className="w-24 text-gray-400 font-medium">Occupation</span>
                <span className="font-bold text-gray-900">{farmer.occupation || 'गाउँमा बसेर कृषि'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Engagement Score Card */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E3F6EC] text-[#00B074] flex items-center justify-center mb-3">
            <Trophy className="w-7 h-7" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">ENGAGEMENT SCORE</p>
          <p className="text-3xl font-black text-[#00B074] mt-1">
            {farmer.performanceIndex || 92}<span className="text-base font-bold text-[#00B074]">/100</span>
          </p>
        </div>
      </div>

      {/* Information Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Improved General Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-6">General Information</h2>

            <div className="space-y-4">
              {/* Status Context Block */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border border-emerald-100/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00B074]/10 text-[#00B074] flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Occupation / परिस्थिति</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    अहिले म <span className="text-[#00B074]">{generalInfo.statusDesc}</span> - गर्छु ।
                  </p>
                </div>
              </div>

              {/* Learning Interest Block */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border border-emerald-100/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00B074]/10 text-[#00B074] flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Learning Preference / चासो</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    मलाई बुझ्नु छ - <span className="text-[#00B074]">{generalInfo.learningInterest}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Activities Information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-gray-800 mb-4">User Activities Information</h2>

          <div className="divide-y divide-gray-100 text-xs font-medium text-gray-600">
            <div className="py-2 flex justify-between items-center">
              <span>Total Number of Training Attended:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                {activities.trainingsAttended}
                <button type="button" onClick={() => onOpenActivity && onOpenActivity('trainings')} className="text-gray-400 hover:text-[#00B074] transition">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Number Of Reactions:</span>
              <span className="font-bold text-gray-900">{activities.reactions}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Number Of Articles Read:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                {activities.articlesRead}
                <button type="button" onClick={() => onOpenActivity && onOpenActivity('articles')} className="text-gray-400 hover:text-[#00B074] transition">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Quiz Participation:</span>
              <span className="font-bold text-gray-900">{activities.quizParticipation}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Comments:</span>
              <span className="font-bold text-gray-900">{activities.comments}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Lands Plotted:</span>
              <span className="font-bold text-gray-900">{activities.landsPlotted}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Disease Detection:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                {activities.diseaseDetection}
                <button type="button" onClick={() => onOpenActivity && onOpenActivity('disease')} className="text-gray-400 hover:text-[#00B074] transition">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Community Post:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                {activities.communityPost}
                <button type="button" onClick={() => onOpenActivity && onOpenActivity('community')} className="text-gray-400 hover:text-[#00B074] transition">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Community Comments:</span>
              <span className="font-bold text-gray-900">{activities.communityComments}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Refers:</span>
              <span className="font-bold text-gray-900">{activities.refers}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Soil Report:</span>
              <span className="font-bold text-gray-900">{activities.soilReport}</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span>Total Calculator Use:</span>
              <span className="font-bold text-gray-900">{activities.calculatorUse}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Farms Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800">
          Registered Farms
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Farm Name</th>
                <th className="px-4 py-3">Field ID</th>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Area(ha)</th>
                <th className="px-4 py-3">VI</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {farmerFields.length > 0 ? (
                farmerFields.map((field, idx) => (
                  <tr key={field.id || idx} className="hover:bg-emerald-50/20 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">{field.plotName || 'Swarup Farm'}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{field.fieldId || `SF-202${idx + 4}`}</td>
                    <td className="px-4 py-3">{field.crop || 'Wheat'}</td>
                    <td className="px-4 py-3">{field.area || '50'}</td>
                    <td className="px-4 py-3 font-mono">{field.vi || '0.65'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block ${
                        (field.vi || 0.65) >= 0.6 
                          ? 'bg-emerald-50 text-[#00B074]' 
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {(field.vi || 0.65) >= 0.6 ? 'Above' : 'Below'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          onSelectField(field.id);
                          onNavigate('field_data');
                        }}
                        className="text-[#00B074] hover:underline font-bold text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-emerald-50/20 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">Swarup Farm</td>
                    <td className="px-4 py-3 font-mono text-gray-500">SF-2024</td>
                    <td className="px-4 py-3">Wheat</td>
                    <td className="px-4 py-3">50</td>
                    <td className="px-4 py-3 font-mono">0.65</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#00B074] inline-block">
                        Above
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => onNavigate('field_data')} className="text-[#00B074] hover:underline font-bold text-xs">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-emerald-50/20 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">Green Valley</td>
                    <td className="px-4 py-3 font-mono text-gray-500">GV-3030</td>
                    <td className="px-4 py-3">Corn</td>
                    <td className="px-4 py-3">75</td>
                    <td className="px-4 py-3 font-mono">0.58</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 inline-block">
                        Below
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => onNavigate('field_data')} className="text-[#00B074] hover:underline font-bold text-xs">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-emerald-50/20 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">Sunny Acres</td>
                    <td className="px-4 py-3 font-mono text-gray-500">SA-1101</td>
                    <td className="px-4 py-3">Barley</td>
                    <td className="px-4 py-3">60</td>
                    <td className="px-4 py-3 font-mono">0.72</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#00B074] inline-block">
                        Above
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => onNavigate('field_data')} className="text-[#00B074] hover:underline font-bold text-xs">
                        View
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}