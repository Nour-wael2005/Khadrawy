// المسار: src/Pages/landowner/Engineers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../Components/DashboardWidgets";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Engineers() {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/engineers`);
      if (res.ok) {
        const data = await res.json();
        setEngineers(data);
      }
    } catch (err) {
      console.error("Failed to fetch engineers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const handleDeleteEngineer = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to remove Eng. ${name}? Their assigned lands will become Unassigned.`
      )
    )
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/engineers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEngineers((prev) => prev.filter((eng) => eng.id !== id));
      }
    } catch (err) {
      console.error("Error deleting engineer:", err);
    }
  };

  // فلترة المهندسين بالاسم أو الإيميل أو التخصص أو اسم الأرض اللي شغال عليها
  const filteredEngineers = engineers.filter((eng) => {
    const q = searchQuery.toLowerCase();
    const matchesLand = (eng.assigned_lands || []).some((l) =>
      l.name?.toLowerCase().includes(q)
    );
    const matchesSearch =
      eng.name?.toLowerCase().includes(q) ||
      eng.email?.toLowerCase().includes(q) ||
      eng.phone?.toLowerCase().includes(q) ||
      eng.specialization?.toLowerCase().includes(q) ||
      matchesLand;

    const hasLands = (eng.assigned_lands || []).length > 0;
    const matchesAssignment =
      assignmentFilter === "All" ||
      (assignmentFilter === "Assigned" && hasLands) ||
      (assignmentFilter === "Unassigned" && !hasLands);

    return matchesSearch && matchesAssignment;
  });

  const totalAssignedPlots = engineers.reduce(
    (sum, eng) => sum + (eng.assigned_lands?.length || 0),
    0
  );

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
              / Engineers
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Engineers
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage agricultural engineers and their assigned lands in one
              place.
            </p>
          </div>

          <button
            onClick={() => navigate("/engineers/add")}
            className="bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
          >
            <span className="text-sm font-normal">+</span>
            <span>Add engineer</span>
          </button>
        </div>

        {/* ================= SINGLE AGRICULTURAL ENGINEERS CARD ================= */}
        <div className="max-w-sm mb-6">
          <StatCard
            title="Agricultural engineers"
            value={engineers.length}
            subtitle={`All accounts active · Supervising ${totalAssignedPlots} lands`}
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
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                />
              </svg>
            }
          />
        </div>

        {/* ================= ENGINEERS DIRECTORY TABLE ================= */}
        <div className="w-full bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs">
          {/* Table Header & Search/Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1B3B2B]">
                Registered agricultural engineers
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {loading
                  ? "Loading engineers from database..."
                  : `Showing ${filteredEngineers.length} of ${engineers.length} engineers`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search engineer, land, specialty..."
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1B3B2B] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 sm:w-64"
              />

              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1B3B2B] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 cursor-pointer"
              >
                <option value="All">All engineers</option>
                <option value="Assigned">Assigned to lands</option>
                <option value="Unassigned">No lands assigned</option>
              </select>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            {filteredEngineers.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">
                No engineers found matching your criteria.
              </div>
            ) : (
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold text-start">ENGINEER</th>
                    <th className="pb-3 font-semibold text-start">
                      SPECIALIZATION
                    </th>
                    <th className="pb-3 font-semibold text-start">CONTACT</th>
                    <th className="pb-3 font-semibold text-start">
                      ASSIGNED LANDS
                    </th>
                    <th className="pb-3 font-semibold text-start">STATUS</th>
                    <th className="pb-3 font-semibold text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEngineers.map((eng) => (
                    <tr
                      key={eng.id}
                      className="hover:bg-[#FAF6F0]/40 transition"
                    >
                      {/* Engineer Name & Avatar */}
                      <td className="py-4 pe-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] border border-[#1B3B2B]/10 text-[#1B3B2B] font-extrabold text-xs flex items-center justify-center shrink-0">
                            {eng.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1B3B2B] text-xs">
                              {eng.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ID #{eng.id} · Role: Engineer
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="py-4 pe-4 text-gray-600 font-medium">
                        {eng.specialization || "Crop & Soil Management"}
                      </td>

                      {/* Contact (Email & Phone) */}
                      <td className="py-4 pe-4">
                        <p className="font-medium text-gray-700">{eng.email}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {eng.phone || "No phone"}
                        </p>
                      </td>

                      {/* Assigned Lands Badges */}
                      <td className="py-4 pe-4">
                        {eng.assigned_lands && eng.assigned_lands.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {eng.assigned_lands.map((land) => (
                              <span
                                key={land.id}
                                onClick={() => navigate("/lands")}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#1B3B2B]/15 text-[#1B3B2B] font-bold text-[11px] hover:bg-[#E8F3EB] transition cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                {land.name}
                                <span className="text-[10px] text-gray-400 font-normal">
                                  ({land.crop_type})
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            No lands assigned yet
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-4 pe-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {eng.status || "Active"}
                        </span>
                      </td>

                      {/* Delete Action */}
                      <td className="py-4 text-end">
                        <button
                          onClick={() => handleDeleteEngineer(eng.id, eng.name)}
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