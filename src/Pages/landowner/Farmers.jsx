// المسار: src/Pages/landowner/Farmers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../Components/DashboardWidgets";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Farmers() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [landFilter, setLandFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/farmers`);
      if (res.ok) {
        const data = await res.json();
        setFarmers(data);
      }
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleDeleteFarmer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove farmer ${name}?`))
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/farmers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFarmers((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Error deleting farmer:", err);
    }
  };

  // استخراج أسماء الأراضي الفريدة للفلتر
  const uniqueLands = Array.from(
    new Set(
      farmers
        .map((f) => f.land_name)
        .filter((name) => name && name !== "Unassigned")
    )
  );

  // فلترة المزارعين بالبحث أو بالأرض اللي شغالين فيها
  const filteredFarmers = farmers.filter((farmer) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      farmer.name?.toLowerCase().includes(q) ||
      farmer.email?.toLowerCase().includes(q) ||
      farmer.phone?.toLowerCase().includes(q) ||
      farmer.task_role?.toLowerCase().includes(q) ||
      farmer.land_name?.toLowerCase().includes(q) ||
      farmer.supervisor_engineer?.toLowerCase().includes(q);

    const matchesLand =
      landFilter === "All" ||
      (landFilter === "Unassigned" && farmer.land_name === "Unassigned") ||
      farmer.land_name === landFilter;

    return matchesSearch && matchesLand;
  });

  const activeLandsWithFarmers = new Set(
    farmers
      .filter((f) => f.land_name && f.land_name !== "Unassigned")
      .map((f) => f.land_name)
  ).size;

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
              / Farmers
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Farmers
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage and review your farmers and their assigned lands in one
              place.
            </p>
          </div>

          <button
            onClick={() => navigate("/farmers/add")}
            className="bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
          >
            <span className="text-sm font-normal">+</span>
            <span>Add farmer</span>
          </button>
        </div>

        {/* ================= SINGLE TOTAL FARMERS CARD ================= */}
        <div className="max-w-sm mb-6">
          <StatCard
            title="Total farmers"
            value={farmers.length}
            subtitle={`Across ${activeLandsWithFarmers} lands · All accounts active`}
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
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                />
              </svg>
            }
          />
        </div>

        {/* ================= FARMERS DIRECTORY TABLE ================= */}
        <div className="w-full bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs">
          {/* Table Header & Search/Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1B3B2B]">
                Registered field farmers
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {loading
                  ? "Loading farmers from database..."
                  : `Showing ${filteredFarmers.length} of ${farmers.length} farmers`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search farmer, land, phone, task..."
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1B3B2B] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 sm:w-64"
              />

              <select
                value={landFilter}
                onChange={(e) => setLandFilter(e.target.value)}
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1B3B2B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 cursor-pointer"
              >
                <option value="All">All lands</option>
                {uniqueLands.map((landName) => (
                  <option key={landName} value={landName}>
                    {landName}
                  </option>
                ))}
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            {filteredFarmers.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">
                No farmers found matching your criteria.
              </div>
            ) : (
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold text-start">FARMER</th>
                    <th className="pb-3 font-semibold text-start">
                      FIELD ROLE / TASK
                    </th>
                    <th className="pb-3 font-semibold text-start">CONTACT</th>
                    <th className="pb-3 font-semibold text-start">
                      ASSIGNED LAND
                    </th>
                    <th className="pb-3 font-semibold text-start">
                      SUPERVISING ENGINEER
                    </th>
                    <th className="pb-3 font-semibold text-start">STATUS</th>
                    <th className="pb-3 font-semibold text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFarmers.map((farmer) => (
                    <tr
                      key={farmer.id}
                      className="hover:bg-[#FAF6F0]/40 transition"
                    >
                      {/* Farmer Name & Avatar */}
                      <td className="py-4 pe-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#1B3B2B]/15 text-[#1B3B2B] font-extrabold text-xs flex items-center justify-center shrink-0">
                            {farmer.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1B3B2B] text-xs">
                              {farmer.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ID #{farmer.id} · Role: Farmer
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Field Task / Role */}
                      <td className="py-4 pe-4 text-gray-600 font-medium">
                        {farmer.task_role || "Field Operations"}
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 pe-4">
                        <p className="font-medium text-gray-700">
                          {farmer.phone}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {farmer.email}
                        </p>
                      </td>

                      {/* Assigned Land */}
                      <td className="py-4 pe-4">
                        {farmer.land_name &&
                        farmer.land_name !== "Unassigned" ? (
                          <div
                            onClick={() => navigate("/lands")}
                            className="inline-flex flex-col px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#1B3B2B]/15 hover:bg-[#E8F3EB] transition cursor-pointer"
                          >
                            <span className="font-bold text-[#1B3B2B] text-[11px] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              {farmer.land_name}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              {farmer.land_crop} · {farmer.land_location}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Supervising Engineer */}
                      <td className="py-4 pe-4 text-gray-600 font-medium">
                        {farmer.supervisor_engineer || "—"}
                      </td>

                      {/* Account Status */}
                      <td className="py-4 pe-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {farmer.status || "Active"}
                        </span>
                      </td>

                      {/* Remove Action */}
                      <td className="py-4 text-end">
                        <button
                          onClick={() =>
                            handleDeleteFarmer(farmer.id, farmer.name)
                          }
                          className="text-gray-400 hover:text-rose-600 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer text-[11px]"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}