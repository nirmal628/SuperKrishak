import React from 'react';
import { Thermometer, Wind, Droplets, Cloud, CloudRain } from 'lucide-react';

export default function WeatherWidget({ temp = "27°C", humidity = "83%", wind = "2.6 m/s", clouds = "87%", rain = "25 mm" }) {
  const forecast = [
    { day: '17 Aug', temp: '20° / 27°', rainProb: '95%', rainVol: '14mm' },
    { day: '18 Aug', temp: '21° / 28°', rainProb: '80%', rainVol: '10mm' },
    { day: '19 Aug', temp: '19° / 26°', rainProb: '70%', rainVol: '8mm' },
    { day: '20 Aug', temp: '20° / 27°', rainProb: '90%', rainVol: '18mm' },
    { day: '21 Aug', temp: '22° / 29°', rainProb: '45%', rainVol: '3mm' },
    { day: '22 Aug', temp: '21° / 28°', rainProb: '60%', rainVol: '5mm' },
  ];

  return (
    <div className="weather-bg rounded-2xl shadow-lg p-6 text-white animate-fadeIn">
      {/* Current Temp */}
      <div className="text-center mb-6">
        <div className="text-6xl font-light tracking-tighter flex items-center justify-center gap-2 drop-shadow-md">
          <Thermometer className="w-12 h-12 text-rose-300" />
          <span>{temp}</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-blue-100 font-semibold mt-1">Live Atmospheric Telemetry</p>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8 border-b border-white/20 pb-6">
        <div className="text-center weather-glass px-4 py-3 rounded-xl flex flex-col items-center">
          <Wind className="w-6 h-6 mb-1 text-sky-200" />
          <p className="font-bold text-sm sm:text-base">{wind}</p>
          <p className="text-[10px] uppercase tracking-wider text-blue-100">Wind</p>
        </div>
        <div className="text-center weather-glass px-4 py-3 rounded-xl flex flex-col items-center">
          <Droplets className="w-6 h-6 mb-1 text-sky-300" />
          <p className="font-bold text-sm sm:text-base">{humidity}</p>
          <p className="text-[10px] uppercase tracking-wider text-blue-100">Humidity</p>
        </div>
        <div className="text-center weather-glass px-4 py-3 rounded-xl flex flex-col items-center">
          <Cloud className="w-6 h-6 mb-1 text-gray-200" />
          <p className="font-bold text-sm sm:text-base">{clouds}</p>
          <p className="text-[10px] uppercase tracking-wider text-blue-100">Clouds</p>
        </div>
        <div className="text-center weather-glass px-4 py-3 rounded-xl flex flex-col items-center">
          <CloudRain className="w-6 h-6 mb-1 text-cyan-200" />
          <p className="font-bold text-sm sm:text-base">{rain}</p>
          <p className="text-[10px] uppercase tracking-wider text-blue-100">Rainfall</p>
        </div>
      </div>

      {/* 6-Day Forecast */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-100">6-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {forecast.map((f, i) => (
            <div key={i} className="weather-glass p-3 rounded-xl text-center">
              <p className="text-xs font-bold mb-1">{f.day}</p>
              <p className="text-[11px] text-blue-100 font-medium mb-2">{f.temp}</p>
              <div className="flex justify-center items-center gap-2 text-[10px] text-blue-50">
                <span className="flex items-center gap-0.5"><Droplets className="w-3 h-3 text-sky-300" /> {f.rainProb}</span>
                <span className="flex items-center gap-0.5"><CloudRain className="w-3 h-3 text-cyan-300" /> {f.rainVol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
