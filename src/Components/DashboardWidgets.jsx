// المسار: src/Components/DashboardWidgets.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export function StatCard({ icon, title, value, subtitle, onClick, showArrow = true }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs transition-all flex items-center justify-between group ${
        onClick ? "hover:shadow-md hover:border-[#1B3B2B]/30 cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-[#FAF6F0] border border-gray-200/60 flex items-center justify-center text-[#1B3B2B] shrink-0 mt-1">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-extrabold text-[#1B3B2B] my-1">
            {value}
          </h3>
          {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {showArrow && onClick && (
        <span className="text-gray-400 group-hover:text-[#1B3B2B] group-hover:translate-x-1 transition-all text-lg font-medium">
          →
        </span>
      )}
    </div>
  );
}

export function LandHealthTable({
  lands = [],
  limit = 3,
  title = "Land health overview",
  subtitle = "Sample operational data · Updated 12 minutes ago",
  onViewAll = null,
  showExtendedColumns = false,
  onDeleteLand = null,
  headerControls = null,
  className = "lg:col-span-2",
}) {
  const navigate = useNavigate(); // تم تعريف الـ navigate هنا داخل الكومبوننت بشكل صحيح
  const displayedLands = limit ? lands.slice(0, limit) : lands;

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("healthy")) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    }
    if (s.includes("attention")) {
      return "bg-amber-50 text-amber-700 border border-amber-200/60";
    }
    return "bg-gray-100 text-gray-600 border border-gray-200/60";
  };

  const getModeBadge = (mode) => {
    const m = (mode || "Auto").toLowerCase();
    if (m === "auto") return "bg-[#EBF5EE] text-[#1E6B3B]";
    if (m === "timer") return "bg-blue-50 text-blue-700";
    return "bg-amber-50 text-amber-800";
  };

  return (
    <div
      className={`${className} bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between`}
    >
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#1B3B2B]">{title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-[#1B3B2B] hover:underline cursor-pointer"
            >
              View all lands
            </button>
          )}

          {headerControls}
        </div>

        <div className="overflow-x-auto">
          {displayedLands.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              No lands found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold text-start">LAND</th>
                  {showExtendedColumns ? (
                    <>
                      <th className="pb-3 font-semibold text-start">CROP & STAGE</th>
                      <th className="pb-3 font-semibold text-start">SOIL TYPE</th>
                      <th className="pb-3 font-semibold text-start">MOISTURE THRESHOLDS</th>
                      <th className="pb-3 font-semibold text-start">PUMP MODE</th>
                    </>
                  ) : (
                    <th className="pb-3 font-semibold text-start">RESPONSIBLE ENGINEER</th>
                  )}
                  <th className="pb-3 font-semibold text-start">DEVICE</th>
                  <th className="pb-3 font-semibold text-start">STATUS</th>
                  <th className="pb-3 font-semibold text-end"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedLands.map((land, idx) => {
                  const isOnline =
                    (land.device || land.device_status || "").toLowerCase() ===
                    "online";
                  return (
                    <tr
                      key={land.id || idx}
                      className="hover:bg-[#FAF6F0]/40 transition"
                    >
                      <td className="py-4 pe-3">
                        {/* الضغطة هنا تنقل المستخدم مباشرة لصفحة الـ Monitoring الخاصة بالأرض */}
                        <p
                          onClick={() => navigate(`/monitoring/${land.id || 1}`, { state: land })}
                          className="font-bold text-[#1B3B2B] text-xs hover:underline cursor-pointer"
                        >
                          {land.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {land.location || "Giza, Egypt"}
                        </p>
                      </td>

                      {showExtendedColumns ? (
                        <>
                          <td className="py-4 pe-3">
                            <p className="font-bold text-[#1B3B2B]">
                              {land.crop_type || "Tomato"}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {land.growth_stage || "Vegetative"}
                            </p>
                          </td>
                          <td className="py-4 pe-3 text-gray-600 font-medium">
                            {land.soil_type || "Loamy"}
                          </td>
                          <td className="py-4 pe-3">
                            <span className="font-bold text-[#1E6B3B] bg-[#EBF5EE] px-2.5 py-1 rounded-lg text-[11px]">
                              {land.turn_on_below ?? 35}% –{" "}
                              {land.turn_off_above ?? 70}%
                            </span>
                            {land.high_temp_override && (
                              <p className="text-[10px] text-amber-700 mt-1">
                                Cooling &gt; {land.override_temp || 32}°C
                              </p>
                            )}
                          </td>
                          <td className="py-4 pe-3">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getModeBadge(
                                land.operation_mode
                              )}`}
                            >
                              {land.operation_mode || "Auto"}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-1">
                              Max {land.max_run_time ?? 15}m · Cool{" "}
                              {land.cooldown_period ?? 2}h
                            </p>
                          </td>
                        </>
                      ) : (
                        <td className="py-4 pe-3 text-gray-600 font-medium">
                          {land.engineer || land.responsible_engineer}
                        </td>
                      )}

                      <td className="py-4 pe-3">
                        <span className="inline-flex items-center gap-1.5 text-gray-600 font-medium">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOnline ? "bg-emerald-600" : "bg-gray-400"
                            }`}
                          ></span>
                          {land.device || land.device_status || "Not connected"}
                        </span>
                      </td>
                      <td className="py-4 pe-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(
                            land.status
                          )}`}
                        >
                          {land.status}
                        </span>
                      </td>
                      <td className="py-4 text-end">
                        {onDeleteLand ? (
                          <button
                            onClick={() => onDeleteLand(land.id)}
                            title="Delete land"
                            className="text-gray-400 hover:text-rose-600 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer text-[11px]"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-gray-400 font-bold px-2 py-1">
                            •••
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export function NeedsAttentionCard({ alerts = [], onViewAll, onAlertClick }) {
  const getAlertIcon = (type) => {
    if (type === "moisture") {
      return (
        <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    }
    if (type === "sensor") {
      return (
        <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-base font-bold text-[#1B3B2B]">
              Needs attention
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {alerts.length} open alerts
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-[#1B3B2B] hover:underline cursor-pointer"
            >
              View all
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {alerts.slice(0, 3).map((alert, idx) => (
            <div
              key={alert.id || idx}
              onClick={() => onAlertClick && onAlertClick(alert)}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-[#FAF6F0]/40 px-2 -mx-2 rounded-xl transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-amber-200/50 flex items-center justify-center shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B3B2B]">
                    {alert.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {alert.location} · {alert.time}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-[#1B3B2B] group-hover:translate-x-0.5 transition text-sm">
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}