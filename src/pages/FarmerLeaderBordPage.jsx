import React, { useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function UserRankingsPage({ onNavigate }) {
  const [timeframe, setTimeframe] = useState('Weekly');

  // Timeframe-specific leaderboard data
  const leaderboardData = {
    Weekly: [
      { rank: 1, name: 'Ramesh Thapa', coins: '1,250', points: '8,450', avatarBg: 'bg-[#E3F6EC]' },
      { rank: 2, name: 'Sita Gurung', coins: '1,120', points: '7,890', avatarBg: 'bg-[#FEF3C7]' },
      { rank: 3, name: 'Kamal Budhathoki', coins: '980', points: '6,500', avatarBg: 'bg-[#FEE2E2]' },
      { rank: 4, name: 'Pema Lama', coins: '850', points: '5,200', avatarBg: 'bg-gray-100' },
      { rank: 5, name: 'Dipak Gaire', coins: '720', points: '4,800', avatarBg: 'bg-gray-100' },
      { rank: 6, name: 'Sarita Shrestha', coins: '640', points: '4,100', avatarBg: 'bg-gray-100' },
      { rank: 7, name: 'Bikram Poudel', coins: '580', points: '3,600', avatarBg: 'bg-gray-100' },
      { rank: 8, name: 'Apsara Rana', coins: '520', points: '3,200', avatarBg: 'bg-gray-100' },
      { rank: 9, name: 'Rohit KC', coins: '450', points: '2,900', avatarBg: 'bg-gray-100' },
      { rank: 10, name: 'Sujata Adhikari', coins: '380', points: '2,400', avatarBg: 'bg-gray-100' },
    ],
    Monthly: [
      { rank: 1, name: 'Ramesh Thapa', coins: '5,400', points: '34,200', avatarBg: 'bg-[#E3F6EC]' },
      { rank: 2, name: 'Kamal Budhathoki', coins: '4,890', points: '29,800', avatarBg: 'bg-[#FEF3C7]' },
      { rank: 3, name: 'Sita Gurung', coins: '4,250', points: '26,100', avatarBg: 'bg-[#FEE2E2]' },
      { rank: 4, name: 'Dipak Gaire', coins: '3,600', points: '21,500', avatarBg: 'bg-gray-100' },
      { rank: 5, name: 'Pema Lama', coins: '3,100', points: '19,200', avatarBg: 'bg-gray-100' },
      { rank: 6, name: 'Bikram Poudel', coins: '2,800', points: '17,400', avatarBg: 'bg-gray-100' },
      { rank: 7, name: 'Sarita Shrestha', coins: '2,450', points: '15,100', avatarBg: 'bg-gray-100' },
      { rank: 8, name: 'Apsara Rana', coins: '2,100', points: '13,800', avatarBg: 'bg-gray-100' },
      { rank: 9, name: 'Sujata Adhikari', coins: '1,900', points: '11,200', avatarBg: 'bg-gray-100' },
      { rank: 10, name: 'Rohit KC', coins: '1,650', points: '9,800', avatarBg: 'bg-gray-100' },
    ],
    Yearly: [
      { rank: 1, name: 'Kamal Budhathoki', coins: '62,000', points: '410,000', avatarBg: 'bg-[#E3F6EC]' },
      { rank: 2, name: 'Ramesh Thapa', coins: '58,400', points: '385,000', avatarBg: 'bg-[#FEF3C7]' },
      { rank: 3, name: 'Sita Gurung', coins: '51,200', points: '340,000', avatarBg: 'bg-[#FEE2E2]' },
      { rank: 4, name: 'Dipak Gaire', coins: '44,800', points: '290,000', avatarBg: 'bg-gray-100' },
      { rank: 5, name: 'Bikram Poudel', coins: '39,100', points: '255,000', avatarBg: 'bg-gray-100' },
      { rank: 6, name: 'Pema Lama', coins: '35,000', points: '220,000', avatarBg: 'bg-gray-100' },
      { rank: 7, name: 'Sarita Shrestha', coins: '29,400', points: '195,000', avatarBg: 'bg-gray-100' },
      { rank: 8, name: 'Rohit KC', coins: '24,200', points: '160,000', avatarBg: 'bg-gray-100' },
      { rank: 9, name: 'Apsara Rana', coins: '21,000', points: '142,000', avatarBg: 'bg-gray-100' },
      { rank: 10, name: 'Sujata Adhikari', coins: '18,500', points: '120,000', avatarBg: 'bg-gray-100' },
    ]
  };

  const currentRankings = leaderboardData[timeframe] || leaderboardData.Weekly;

  // Render top 3 rank trophy icons with specific colors
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-amber-500" />;
    if (rank === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-4 h-4 text-amber-700" />;
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        {onNavigate && (
          <button
            onClick={() => onNavigate('farmers')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition shadow-xs shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">User Rankings</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Track and analyze user rankings across your organization.</p>
        </div>
      </div>

      {/* Main Leaderboard Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Card Header & Timeframe Toggle */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-extrabold text-gray-900">Leaderboard</h2>

          {/* Timeframe Pill Buttons */}
          <div className="flex gap-1 text-[11px] bg-gray-100/80 p-1 rounded-xl font-medium text-gray-500">
            {['Weekly', 'Monthly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition ${
                  timeframe === tf
                    ? 'bg-white shadow-xs text-gray-900 font-bold'
                    : 'hover:text-gray-900 text-gray-500'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50/60 border-b border-gray-100 text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-3.5 w-24">Rank</th>
                <th className="px-4 py-3.5">User Name</th>
                <th className="px-6 py-3.5 text-right">Coins Earned</th>
                <th className="px-6 py-3.5 text-right">Points Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/70 text-gray-700 font-medium">
              {currentRankings.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-50/50 transition">
                  {/* Rank Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-4 font-bold text-gray-500">{user.rank}</span>
                      {renderRankBadge(user.rank)}
                    </div>
                  </td>

                  {/* User Name Column */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.avatarBg} shrink-0`} />
                      <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                  </td>

                  {/* Coins Earned */}
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {user.coins}
                  </td>

                  {/* Points Collected */}
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}