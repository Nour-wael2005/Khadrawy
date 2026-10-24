// المسار: src/Pages/engineer/Monitoring.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function Monitoring() {
  const navigate = useNavigate();
  const location = useLocation();
  const { landId } = useParams();

  // توليد أرقام قراءات مختلفة ومقنعة بناءً على رقم أو اسم الأرض لضمان تنوع الأرقام في كل كارد
  const getDynamicValues = (stateData, id) => {
    if (stateData && stateData.soil_moisture) {
      return stateData;
    }
    
    // أرقام عشوائية مقنعة ومخصصة لكل أرض بناءً على الـ ID
    const seed = Number(id) || 101;
    return {
      name: seed === 102 ? "Olive Field East Block A" : seed === 103 ? "Orchard Block C" : "North Greenhouse Alpha",
      location: seed === 102 ? "Minya, Egypt" : "Giza, Egypt",
      crop: seed === 102 ? "Olives" : seed === 103 ? "Citrus" : "Tomato",
      soil_moisture: 30 + (seed % 25), // تتراوح بين 30 و 55
      air_temp: 22 + (seed % 10) + 0.4, // تتراوح بين 22 و 32
      air_humidity: 50 + (seed % 30), // تتراوح بين 50 و 80
      light: 15 + (seed % 12) + 0.3, // شدة الإضاءة
    };
  };

  const landInfo = getDynamicValues(location.state, landId);

  // حالة مضخة الري (تشغيل يدوياً أو إيقاف)
  const [pumpStatus, setPumpStatus] = useState("PUMP OFF");
  const [isPumpRunning, setIsPumpRunning] = useState(false);
  const [lastIrrigation, setLastIrrigation] = useState("Today, 8:10 AM");

  const handleTogglePump = () => {
    if (isPumpRunning) {
      setPumpStatus("PUMP OFF");
      setIsPumpRunning(false);
    } else {
      setPumpStatus("PUMP RUNNING (Manual)");
      setIsPumpRunning(true);
      setLastIrrigation("Just now");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 sm:px-10 py-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-1">
              <span
                onClick={() => navigate("/assigned-lands")}
                className="hover:text-[#1B3B2B] cursor-pointer transition"
              >
                Khadrwy
              </span>{" "}
              / Monitoring
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Monitoring
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage and review your real-time IoT sensor telemetry in one place.
            </p>
          </div>

          {/* <button
            onClick={() => navigate("/plant-doctor")}
            className="bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
          >
            <span className="text-sm font-normal">+</span>
            <span>New diagnosis</span>
          </button> */}
        </div>

        {/* ================= SELECTED LAND BAR ================= */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/70 shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
              SELECTED LAND
            </p>
            <h2 className="text-lg font-extrabold text-[#1B3B2B]">
              {landInfo.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {landInfo.location} · Crop: {landInfo.crop}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-800">
              Device online · Synced 2 minutes ago
            </span>
          </div>
        </div>

        {/* ================= 4 SENSORS CARDS GRID (أرقام ديناميكية لكل أرض) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* 1. Air Temperature */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500 font-medium">Air temperature</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  Normal
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#1B3B2B] mb-2">
                {landInfo.air_temp}°C
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 pt-3 border-t border-gray-100">
              Stable over the last 6 hours
            </p>
          </div>

          {/* 2. Air Humidity */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500 font-medium">Air humidity</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  Healthy
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#1B3B2B] mb-2">
                {landInfo.air_humidity}%
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 pt-3 border-t border-gray-100">
              Stable over the last 6 hours
            </p>
          </div>

          {/* 3. Soil Moisture */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500 font-medium">Soil moisture</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/60">
                  Check status
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#1B3B2B] mb-2">
                {landInfo.soil_moisture}%
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 pt-3 border-t border-gray-100">
              Within optimal crop range
            </p>
          </div>

          {/* 4. Light Intensity */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500 font-medium">Light intensity</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  Optimal
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#1B3B2B] mb-2">
                {landInfo.light} klx
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 pt-3 border-t border-gray-100">
              Stable over the last 6 hours
            </p>
          </div>
        </div>

        {/* ================= BOTTOM SECTION (CHART & PUMP CONTROL) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Environmental Readings Chart Simulation */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#1B3B2B]">
                    Environmental readings
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Recent sample telemetry - Last 24 hours
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-500 bg-[#FAF6F0] px-3 py-1 rounded-xl border border-gray-200">
                  24 hours ▾
                </span>
              </div>

              {/* محاكاة الرسم البياني بالـ SVG */}
              <div className="h-48 w-full flex items-end pt-4 pb-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <path
                    d="M 0 100 Q 125 60 250 90 T 500 40"
                    fill="none"
                    stroke="#1B3B2B"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 120 Q 125 100 250 110 T 500 80"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* Irrigation Control Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1B3B2B]">
                    Irrigation control
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Automatic mode enabled
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    isPumpRunning
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isPumpRunning ? "Running" : "Stopped"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-gray-200/70 my-4 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                  CONFIGURED PUMP STATUS
                </p>
                <h4
                  className={`text-xl font-extrabold ${
                    isPumpRunning ? "text-emerald-700" : "text-[#1B3B2B]"
                  }`}
                >
                  {pumpStatus}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1">
                  Last irrigation: {lastIrrigation}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
                <span>Soil moisture threshold</span>
                <span className="font-extrabold text-[#1B3B2B]">35%</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleTogglePump}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs transition shadow-xs cursor-pointer ${
                  isPumpRunning
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white"
                }`}
              >
                {isPumpRunning ? "Stop pump immediately" : "Turn pump on manually"}
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-2.5">
                Commands update only after confirmation from the connected device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}