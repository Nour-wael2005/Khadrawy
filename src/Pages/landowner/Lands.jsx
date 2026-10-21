// المسار: src/Pages/landowner/Lands.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard, LandHealthTable } from "../../Components/DashboardWidgets";
//import { fetchMockLands } from "../../services/khadrawyApi";
const API_BASE_URL = "http://127.0.0.1:8000";

export default function Lands() {
  const navigate = useNavigate();

  const [lands, setLands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

const fetchAllLands = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/lands`);

    if (!res.ok) {
      throw new Error(`Failed to fetch lands: ${res.status}`);
    }

    const data = await res.json();

    console.log("Lands fetched from database:", data);

    setLands(data);
  } catch (err) {
    console.error("Failed to fetch lands:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchAllLands();
  }, []);

  const handleDeleteLand = async (landId) => {
    if (!window.confirm("Are you sure you want to remove this land?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/lands/${landId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLands((prev) => prev.filter((item) => item.id !== landId));
      }
    } catch (err) {
      console.error("Error deleting land:", err);
    }
  };

// داخل src/Pages/landowner/Lands.jsx
  const filteredLands = lands.filter((land) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      land.name?.toLowerCase().includes(q) ||
      land.location?.toLowerCase().includes(q) ||
      land.engineer?.toLowerCase().includes(q) ||
      land.crop_type?.toLowerCase().includes(q) ||
      land.soil_type?.toLowerCase().includes(q) ||
      land.operation_mode?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "All" ||
      land.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const healthyCount = lands.filter(
    (l) => l.status?.toLowerCase() === "healthy"
  ).length;
  const onlineSensorsCount = lands.filter(
    (l) => l.device?.toLowerCase() === "online"
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 sm:px-10 py-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-1">
              <span
                onClick={() => navigate("/landowner-dashboard")}
                className="hover:text-[#1B3B2B] cursor-pointer transition"
              >
                Khadrwy
              </span>{" "}
              / Lands
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Lands
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage and review your lands in one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/lands/add")}
            className="bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
          >
            <span className="text-sm font-normal">+</span>
            <span>Add land</span>
          </button>
        </div>

        {/* ================= SINGLE TOTAL LANDS CARD ================= */}
        <div className="max-w-sm mb-6">
          <StatCard
            title="Total lands"
            value={lands.length}
            subtitle={`${healthyCount} healthy · ${onlineSensorsCount} sensors online`}
            showArrow={false}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 17l6-6 4 4 8-8M14 7h7v7"
                />
              </svg>
            }
          />
        </div>

        {/* ================= ALL LANDS TABLE (Full Width, No 'View all lands') ================= */}
        <LandHealthTable
          className="w-full"
          lands={filteredLands}
          limit={null} // يعرض كل الأراضي اللي في الداتابيز بدون حد أقصى
          title="All registered lands"
          subtitle={
            loading
              ? "Loading lands from database..."
              : `Showing ${filteredLands.length} of ${lands.length} registered plots`
          }
          onViewAll={null} // إخفاء كلمة View all lands
          showExtendedColumns={true}
          onDeleteLand={handleDeleteLand}
          headerControls={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {/* البحث باسم الأرض أو المحصول أو المهندس */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search land, crop, engineer..."
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1B3B2B] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 sm:w-60"
              />

              {/* فلتر حسب حالة الأرض */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1B3B2B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 cursor-pointer"
              >
                <option value="All">All statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Attention">Attention</option>
                <option value="Setup required">Setup required</option>
              </select>
            </div>
          }
        />
      </div>
    </div>
  );
}