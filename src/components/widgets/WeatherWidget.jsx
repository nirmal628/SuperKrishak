import React from 'react';
import { 
  Thermometer, 
  Wind, 
  Umbrella, 
  Cloud, 
  CloudRain, 
  Clock, 
  ArrowDown, 
  ArrowUp 
} from 'lucide-react';

export default function WeatherWidget({
  temp = "25.18°C",
  humidity = "83 %",
  wind = "7 m/s",
  clouds = "96.09 %",
  rain = "0 mm"
}) {
  // Hourly forecast data (13:00 to 23:00 matrix)
  const hourlyData = [
    { time: '13:00', temp: '25.12°', wind: '7.4 m/s', humidity: '84%', clouds: '04.53%', rain: '0 mm' },
    { time: '14:00', temp: '25.18°', wind: '7 m/s', humidity: '83%', clouds: '06.09%', rain: '0 mm' },
    { time: '15:00', temp: '25.25°', wind: '7 m/s', humidity: '83%', clouds: '97.66%', rain: '0 mm' },
    { time: '16:00', temp: '25.27°', wind: '7.5 m/s', humidity: '83%', clouds: '55.47%', rain: '0 mm' },
    { time: '17:00', temp: '25.31°', wind: '7.3 m/s', humidity: '82%', clouds: '48.44%', rain: '0 mm' },
    { time: '18:00', temp: '25.33°', wind: '7.5 m/s', humidity: '81%', clouds: '28.91%', rain: '0 mm' },
    { time: '19:00', temp: '25.3°', wind: '7.4 m/s', humidity: '82%', clouds: '7.81%', rain: '0 mm' },
    { time: '20:00', temp: '25.37°', wind: '7.2 m/s', humidity: '81%', clouds: '12.5%', rain: '0 mm' },
    { time: '21:00', temp: '25.41°', wind: '6.7 m/s', humidity: '81%', clouds: '34.38%', rain: '0 mm' },
    { time: '22:00', temp: '25.33°', wind: '6.7 m/s', humidity: '81%', clouds: '44.53%', rain: '0 mm' },
    { time: '23:00', temp: '25.26°', wind: '6.8 m/s', humidity: '81%', clouds: '11.72%', rain: '0 mm' },
  ];

  // 6-day daily forecast data
  const dailyData = [
    { date: '10 September', temp: '25.15°C', minTemp: '24.76°C', maxTemp: '25.41°C', wind: '6.7m/s', humidity: '82%', clouds: '68.6%', rain: '1.7mm' },
    { date: '11 September', temp: '25.16°C', minTemp: '24.43°C', maxTemp: '25.42°C', wind: '6.3m/s', humidity: '81%', clouds: '90.89%', rain: '0.1mm' },
    { date: '12 September', temp: '25.12°C', minTemp: '24.69°C', maxTemp: '25.38°C', wind: '5.3m/s', humidity: '82%', clouds: '49.28%', rain: '0mm' },
    { date: '13 September', temp: '25.19°C', minTemp: '24.91°C', maxTemp: '25.46°C', wind: '6m/s', humidity: '88%', clouds: '67.29%', rain: '1.7mm' },
    { date: '14 September', temp: '25.23°C', minTemp: '24.94°C', maxTemp: '25.46°C', wind: '6m/s', humidity: '88%', clouds: '63.44%', rain: '3.1mm' },
    { date: '15 September', temp: '25.48°C', minTemp: '24.94°C', maxTemp: '25.79°C', wind: '5.7m/s', humidity: '82%', clouds: '50.03%', rain: '2.8mm' },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop')" }}>
      {/* Sky Blue Backdrop Overlay */}
      <div className="absolute inset-0 bg-sky-900/50 backdrop-blur-md -z-0" />

      <div className="relative z-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h2 className="text-lg font-extrabold text-white tracking-wide">Live Weather Update</h2>
        </div>

        {/* Current Live Temperature Header */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-400/40 shadow-inner">
              <Thermometer className="w-9 h-9 text-rose-500" />
            </div>
          </div>
          <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">{temp}</span>

          {/* 4 Primary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
            {[
              { icon: Wind, val: wind, label: 'Wind Speed' },
              { icon: Umbrella, val: humidity, label: 'Humidity' },
              { icon: Cloud, val: clouds, label: 'Cloud Cover' },
              { icon: CloudRain, val: rain, label: 'Rainfall' }
            ].map(({ icon: Icon, val, label }, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl p-3 text-center flex flex-col items-center justify-center shadow-xs">
                <Icon className="w-5 h-5 text-sky-200 mb-1" />
                <span className="text-sm font-bold text-white">{val}</span>
                <span className="text-[10px] text-sky-100 uppercase tracking-wider mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Hourly Forecast Matrix */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 overflow-x-auto">
          <div className="min-w-[650px] space-y-3">
            
            {/* Time Row */}
            <div className="flex items-center text-xs font-semibold text-sky-100">
              <div className="w-10 shrink-0 flex justify-center"><Clock className="w-4 h-4" /></div>
              <div className="grid grid-cols-11 flex-1 text-center font-bold">
                {hourlyData.map((h, i) => (
                  <div key={i}>
                    <p className="text-[10px] opacity-80">{h.time}</p>
                    <p className="text-xs font-black text-white">{h.temp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wind Row */}
            <div className="flex items-center text-xs text-white border-t border-white/10 pt-2">
              <div className="w-10 shrink-0 flex justify-center"><Wind className="w-4 h-4 text-sky-200" /></div>
              <div className="grid grid-cols-11 flex-1 text-center text-[11px] font-medium text-sky-100">
                {hourlyData.map((h, i) => <span key={i}>{h.wind}</span>)}
              </div>
            </div>

            {/* Humidity Row */}
            <div className="flex items-center text-xs text-white border-t border-white/10 pt-2">
              <div className="w-10 shrink-0 flex justify-center"><Umbrella className="w-4 h-4 text-sky-200" /></div>
              <div className="grid grid-cols-11 flex-1 text-center text-[11px] font-medium text-sky-100">
                {hourlyData.map((h, i) => <span key={i}>{h.humidity}</span>)}
              </div>
            </div>

            {/* Cloud Coverage Row */}
            <div className="flex items-center text-xs text-white border-t border-white/10 pt-2">
              <div className="w-10 shrink-0 flex justify-center"><Cloud className="w-4 h-4 text-sky-200" /></div>
              <div className="grid grid-cols-11 flex-1 text-center text-[11px] font-medium text-sky-100">
                {hourlyData.map((h, i) => <span key={i}>{h.clouds}</span>)}
              </div>
            </div>

            {/* Rain Volume Row */}
            <div className="flex items-center text-xs text-white border-t border-white/10 pt-2">
              <div className="w-10 shrink-0 flex justify-center"><CloudRain className="w-4 h-4 text-sky-200" /></div>
              <div className="grid grid-cols-11 flex-1 text-center text-[11px] font-medium text-sky-100">
                {hourlyData.map((h, i) => <span key={i}>{h.rain}</span>)}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: 6-Day Forecast Cards */}
        <div className="space-y-3">
          <div className="inline-block bg-white text-gray-800 text-xs font-extrabold px-3 py-1 rounded-md shadow-xs">
            6-Day Forecast (मौसम पूर्वानुमान)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {dailyData.map((d, i) => (
              <div key={i} className="bg-white text-gray-800 rounded-xl p-3 shadow-md flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-gray-500">{d.date}</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">{d.temp}</p>
                  <p className="text-[9px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                    <span><ArrowDown className="w-2.5 h-2.5 inline text-blue-500" />{d.minTemp}</span>
                    <span><ArrowUp className="w-2.5 h-2.5 inline text-red-500" />{d.maxTemp}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[9px] text-gray-600 border-t border-gray-100 pt-2">
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-gray-400" /> {d.wind}</span>
                  <span className="flex items-center gap-1"><Umbrella className="w-3 h-3 text-blue-400" /> {d.humidity}</span>
                  <span className="flex items-center gap-1"><Cloud className="w-3 h-3 text-gray-400" /> {d.clouds}</span>
                  <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-cyan-500" /> {d.rain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}