// المسار: src/Pages/engineer/AssignedLands.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard, LandHealthTable } from "../../Components/DashboardWidgets";

const API_BASE_URL = "http://127.0.0.1:8000";

// 🌿 داتا فيك متكاملة وشاملة لأراضي المهندس الميدانية
const MOCK_ASSIGNED_LANDS = [
  {
    id: 101,
    name: "North Greenhouse Alpha",
    location: "Giza, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Healthy",
    crop_type: "Tomato",
    growth_stage: "Vegetative",
    soil_type: "Loamy",
    turn_on_below: 35,
    turn_off_above: 70,
    high_temp_override: true,
    override_temp: 32,
    operation_mode: "Auto",
    max_run_time: 20,
    cooldown_period: 2,
  },
  {
    id: 102,
    name: "Olive Field East Block A",
    location: "Minya, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Attention",
    crop_type: "Olives",
    growth_stage: "Flowering",
    soil_type: "Clay Loam",
    turn_on_below: 28,
    turn_off_above: 60,
    high_temp_override: true,
    override_temp: 35,
    operation_mode: "Timer",
    max_run_time: 15,
    cooldown_period: 4,
  },
  {
    id: 103,
    name: "Orchard Block C (Citrus)",
    location: "Sadat City, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Not connected",
    status: "Setup required",
    crop_type: "Citrus",
    growth_stage: "Fruiting",
    soil_type: "Sandy",
    turn_on_below: 30,
    turn_off_above: 65,
    high_temp_override: false,
    override_temp: 34,
    operation_mode: "Manual",
    max_run_time: 30,
    cooldown_period: 3,
  },
  {
    id: 104,
    name: "Wheat Sector West 04",
    location: "Fayoum, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Healthy",
    crop_type: "Wheat",
    growth_stage: "Tillering",
    soil_type: "Silt Loam",
    turn_on_below: 32,
    turn_off_above: 68,
    high_temp_override: false,
    override_temp: 33,
    operation_mode: "Auto",
    max_run_time: 25,
    cooldown_period: 2,
  },
  {
    id: 105,
    name: "Potato Plot South 12",
    location: "Ismailia, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Attention",
    crop_type: "Potato",
    growth_stage: "Tuber Initiation",
    soil_type: "Sandy Loam",
    turn_on_below: 40,
    turn_off_above: 75,
    high_temp_override: true,
    override_temp: 30,
    operation_mode: "Auto",
    max_run_time: 15,
    cooldown_period: 1,
  },
  {
    id: 106,
    name: "Greenhouse Beta (Strawberry)",
    location: "Giza, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Healthy",
    crop_type: "Strawberry",
    growth_stage: "Harvesting",
    soil_type: "Peat Moss",
    turn_on_below: 42,
    turn_off_above: 80,
    high_temp_override: true,
    override_temp: 28,
    operation_mode: "Auto",
    max_run_time: 10,
    cooldown_period: 1,
  },
  {
    id: 107,
    name: "Palm Grove Valley 02",
    location: "New Valley, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Not connected",
    status: "Setup required",
    crop_type: "Dates Palm",
    growth_stage: "Pollination",
    soil_type: "Sandy",
    turn_on_below: 25,
    turn_off_above: 55,
    high_temp_override: true,
    override_temp: 38,
    operation_mode: "Manual",
    max_run_time: 45,
    cooldown_period: 5,
  },
  {
    id: 108,
    name: "Corn Field Center",
    location: "Beni Suef, Egypt",
    engineer: "Eng. Omar El-Sayed",
    device: "Online",
    status: "Healthy",
    crop_type: "Maize",
    growth_stage: "Silking",
    soil_type: "Clay",
    turn_on_below: 35,
    turn_off_above: 70,
    high_temp_override: false,
    override_temp: 34,
    operation_mode: "Timer",
    max_run_time: 20,
    cooldown_period: 3,
  },
];

export default function AssignedLands() {
  const navigate = useNavigate();
  const [assignedLands, setAssignedLands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // قراءة إيميل المهندس المسجل
  const engineerEmail =
    localStorage.getItem("khadrwy_email") || "omar@khadrwy.com";

  const fetchAssignedLands = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("khadrwy_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // طلب الأراضي المخصصة من الباك إند
      const res = await fetch(
        `${API_BASE_URL}/lands?engineer_email=${engineerEmail}&t=${Date.now()}`,
        { headers, cache: "no-store" }
      );

      if (res.ok) {
        const data = await res.json();
        // لو الباك إند رجّع داتا نستخدمها، ولو فاضية نستخدم الداتا الفيك المليانة فوراً
        if (Array.isArray(data) && data.length > 0) {
          setAssignedLands(data);
        } else {
          setAssignedLands(MOCK_ASSIGNED_LANDS);
        }
      } else {
        setAssignedLands(MOCK_ASSIGNED_LANDS);
      }
    } catch (err) {
      console.log("Using rich mock assigned lands data.");
      setAssignedLands(MOCK_ASSIGNED_LANDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedLands();
  }, [engineerEmail]);

  // فلترة الأراضي المسندة بالبحث والحالة
  const filteredLands = assignedLands.filter((land) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      land.name?.toLowerCase().includes(q) ||
      land.location?.toLowerCase().includes(q) ||
      land.crop_type?.toLowerCase().includes(q) ||
      land.soil_type?.toLowerCase().includes(q) ||
      land.operation_mode?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "All" ||
      land.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const healthyCount = assignedLands.filter(
    (l) => l.status?.toLowerCase() === "healthy"
  ).length;

  const onlineSensorsCount = assignedLands.filter(
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
                onClick={() => navigate("/engineer-dashboard")}
                className="hover:text-[#1B3B2B] cursor-pointer transition"
              >
                Khadrwy
              </span>{" "}
              / Assigned Lands
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Assigned Lands
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage and review your assigned agricultural plots and IoT parameters in one place.
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

        {/* ================= SINGLE STAT CARD (ASSIGNED LANDS ONLY) ================= */}
        <div className="max-w-sm mb-6">
          <StatCard
            title="Total assigned lands"
            value={assignedLands.length}
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

        {/* ================= ALL ASSIGNED LANDS TABLE ================= */}
        <LandHealthTable
          className="w-full"
          lands={filteredLands}
          limit={null} // يعرض كل الأراضي الخاصة بالمهندس بدون حد أقصى
          title="Assigned agricultural plots"
          subtitle={
            loading
              ? "Loading assigned lands..."
              : `Showing ${filteredLands.length} of ${assignedLands.length} supervised plots`
          }
          onViewAll={null} // إخفاء View all lands
          showExtendedColumns={true} // إظهار التفاصيل الفنية لأتمتة الري الذكي (المحصول، التربة، حدود الرطوبة، ووضع المضخة)
          headerControls={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {/* البحث باسم الأرض أو المحصول أو نوع التربة */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plot, crop, soil..."
                className="bg-[#FAF6F0]/70 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1B3B2B] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/20 sm:w-60"
              />

              {/* فلتر حالة الأرض */}
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