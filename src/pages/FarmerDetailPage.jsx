import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Coins, 
  Calendar, 
  Satellite, 
  Sprout 
} from 'lucide-react';

export default function FarmerDetailPage({ farmerId, onNavigate, onSelectField, onOpenActivity }) {
  const { farmers, fields } = useData();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const farmer = farmers.find(f => f.id === farmerId) || farmers[0];
  const farmerFields = fields.filter(f => f.farmerId === farmer?.id);

  if (!farmer) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p>Farmer profile not found.</p>
        <button 
          onClick={() => onNavigate('farmers')}
          className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold"
        >
          Back to Farmers Network
        </button>
      </div>
    );
  }

  const activities = farmer.activities || {
    trainingsAttended: 0,
    reactions: 0,
    articlesRead: 0,
    quizParticipation: 3,
    comments: 0,
    landsPlotted: 0,
    diseaseDetection: 0,
    communityPost: 0,
    communityComments: 0,
    refers: 0,
    soilReport: 0,
    calculatorUse: 0
  };

  const generalInfo = farmer.generalInfo || {
    statusDesc: farmer.occupation || 'गाउँमा बसेर कृषि',
    learningInterest: 'तरकारी खेती'
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Collapsible Card Container (Matching Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Header with Title & Chevron */}
        <div 
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          className="px-6 py-5 border-b border-gray-100 flex justify-between items-center cursor-pointer select-none bg-white"
        >
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">All Farmers</h1>
          <button type="button" className="text-gray-400 hover:text-gray-600 transition">
            {isHeaderCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isHeaderCollapsed && (
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <div>
              <button
                onClick={() => onNavigate('farmers')}
                className="w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 text-brand-blue flex items-center justify-center transition shadow-xs"
                title="Back to All Farmers"
              >
                <ArrowLeft className="w-4 h-4 text-[#3894db]" />
              </button>
            </div>

            {/* Profile Overview Card (Matching Screenshot 3) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col md:flex-row items-start gap-6">
              {/* Avatar Icon with Green Ring */}
              <div className="w-20 h-20 rounded-full border-2 border-brand-green/40 bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 shadow-xs">
                <User className="w-10 h-10 text-gray-400" />
              </div>

              {/* Farmer Info Columns */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
                {/* Left Column */}
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Name</span>
                    <span className="font-bold text-gray-900 text-sm">{farmer.name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Gender</span>
                    <span className="font-semibold text-gray-800">{farmer.gender || 'M'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Address</span>
                    <span className="font-semibold text-gray-800 leading-relaxed">
                      {farmer.address || `${farmer.location}, Nepal`}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Mobile Number</span>
                    <a 
                      href={`tel:${farmer.mobile}`} 
                      className="font-black text-gray-900 hover:text-brand-blue transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-green" />
                      <span>{farmer.mobile}</span>
                    </a>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Location</span>
                    <span className="font-medium text-gray-700">
                      Latitude <strong className="text-gray-900">{farmer.coords ? farmer.coords[0] : '26.540447'}</strong>
                      <br />
                      Longitude <strong className="text-gray-900">{farmer.coords ? farmer.coords[1] : '86.749886'}</strong>
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-32 text-gray-500 font-medium">Coins Collected</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {farmer.coins || 0}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <span className="w-28 text-gray-500 font-medium">Age Group</span>
                    <span className="font-semibold text-gray-800">{farmer.ageGroup || '30-40'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-gray-500 font-medium">Email</span>
                    <span className="font-medium text-gray-700 font-mono">{farmer.email || '-'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-gray-500 font-medium">Occupation</span>
                    <span className="font-bold text-gray-900">{farmer.occupation || 'गाउँमा बसेर कृषि'}</span>
                  </div>
                </div>
              </div>

              {/* Performance score */}
              <div className="w-full md:w-44 flex-shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Performance Index</p>
                <p className="mt-1 text-4xl font-black leading-none text-emerald-600">
                  {farmer.performanceIndex || 92}<span className="text-base font-bold">/100</span>
                </p>
              </div>
            </div>

            {/* Bottom 2 Cards (Matching Screenshot 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Card: General Information */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-gray-800">General Information</h2>

                <div className="space-y-3 text-xs font-semibold text-gray-700">
                  <p>
                    अहिले म - <span className="text-brand-green font-bold">{generalInfo.statusDesc}</span> - गर्छु ।
                  </p>
                  <p>
                    मलाई बुझ्नु छ - <span className="text-brand-green font-bold">{generalInfo.learningInterest}</span>
                  </p>
                </div>
              </div>

              {/* Right Card: User Activities Information */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-2.5">
                <h2 className="text-sm font-bold text-gray-800 mb-3">User Activities Information</h2>

                <div className="space-y-2 text-xs font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Total Number of Training Attended:</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      {activities.trainingsAttended}
                      <button type="button" onClick={() => onOpenActivity('trainings')} aria-label="View training records" className="text-gray-400 hover:text-brand-blue transition">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Number of Reactions:</span>
                    <span className="font-bold text-gray-900">{activities.reactions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Number Articles Read:</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      {activities.articlesRead}
                      <button type="button" onClick={() => onOpenActivity('articles')} aria-label="View article records" className="text-gray-400 hover:text-brand-blue transition">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Number of Quiz Participation:</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      {activities.quizParticipation}
                      {/* <Eye className="w-3.5 h-3.5 text-gray-400" /> */}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Comments:</span>
                    <span className="font-bold text-gray-900">{activities.comments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Lands Plotted:</span>
                    <span className="font-bold text-gray-900">{activities.landsPlotted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Disease Detection:</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      {activities.diseaseDetection}
                      <button type="button" onClick={() => onOpenActivity('disease')} aria-label="View disease detection records" className="text-gray-400 hover:text-brand-blue transition">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Community Post:</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      {activities.communityPost}
                      <button type="button" onClick={() => onOpenActivity('community')} aria-label="View community post records" className="text-gray-400 hover:text-brand-blue transition">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Community Comments:</span>
                    <span className="font-bold text-gray-900">{activities.communityComments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Refers:</span>
                    <span className="font-bold text-gray-900">{activities.refers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Soil Report:</span>
                    <span className="font-bold text-gray-900">{activities.soilReport}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Calculator Use:</span>
                    <span className="font-bold text-gray-900">{activities.calculatorUse}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered Field Plots & Remote Sensing */}
            {farmerFields.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-brand-green" />
                  <span>Registered Field Plots ({farmerFields.length})</span>
                </h3>

                <div className="divide-y divide-gray-100">
                  {farmerFields.map((field) => (
                    <div key={field.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{field.plotName} ({field.crop})</p>
                        <p className="text-xs text-gray-500">Area: {field.area} HA • Date: {field.date}</p>
                      </div>
                      <button
                        onClick={() => {
                          onSelectField(field.id);
                          onNavigate('field_data');
                        }}
                        className="px-4 py-2 bg-brand-green hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Satellite className="w-3.5 h-3.5" />
                        <span>Launch Satellite Insights</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
