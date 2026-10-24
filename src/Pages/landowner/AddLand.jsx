// المسار: src/Pages/landowner/AddLand.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

const DEFAULT_SETTINGS = {
  name: "",
  location: "Giza, Egypt",
  engineer: "Omar El-Sayed", // القيمة الافتراضية للاند أونر
  device: "Online",
  status: "Healthy",
  crop_type: "",
  growth_stage: "",
  soil_type: "",
  turn_on_below: 35,
  turn_off_above: 70,
  high_temp_override: false,
  override_temp: 32,
  operation_mode: "Auto",
  max_run_time: 15,
  cooldown_period: 2,
  do_not_water_start: "12:00",
  do_not_water_end: "15:00",
};

const SMART_PRESETS = {
  Tomato: {
    turn_on_below: 40,
    turn_off_above: 75,
    high_temp_override: true,
    override_temp: 32,
    max_run_time: 20,
    cooldown_period: 2,
    soil_type: "Loamy",
  },
  Olives: {
    turn_on_below: 28,
    turn_off_above: 60,
    high_temp_override: false,
    override_temp: 36,
    max_run_time: 15,
    cooldown_period: 4,
    soil_type: "Sandy Loam",
  },
  Citrus: {
    turn_on_below: 35,
    turn_off_above: 68,
    high_temp_override: true,
    override_temp: 34,
    max_run_time: 25,
    cooldown_period: 3,
    soil_type: "Sandy",
  },
  Wheat: {
    turn_on_below: 32,
    turn_off_above: 65,
    high_temp_override: false,
    override_temp: 33,
    max_run_time: 18,
    cooldown_period: 3,
    soil_type: "Clay Loam",
  },
  Potato: {
    turn_on_below: 45,
    turn_off_above: 78,
    high_temp_override: true,
    override_temp: 30,
    max_run_time: 15,
    cooldown_period: 2,
    soil_type: "Loamy",
  },
};

export default function AddLand() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [submitting, setSubmitting] = useState(false);
  const [presetMessage, setPresetMessage] = useState("");
  const [error, setError] = useState("");

  // 🟢 تحديد دور المستخدم الحالي (هل هو Gardener أو Landowner؟)
  // بنعرفه من الـ localStorage أو من عنوان الـ URL الحالي لضمان الدقة المطلقة
  const userRole = localStorage.getItem("role") || "";
  const isGardener = 
    userRole === "gardener" || 
    userRole === "farmer" || 
    window.location.pathname.includes("add-plant");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplySmartPresets = () => {
    const selectedCrop = formData.crop_type || "Tomato";
    const preset = SMART_PRESETS[selectedCrop] || SMART_PRESETS.Tomato;

    let stageBonus = 0;
    if (formData.growth_stage === "Seedling") stageBonus = 5;
    if (formData.growth_stage === "Fruiting") stageBonus = 3;

    setFormData((prev) => ({
      ...prev,
      crop_type: prev.crop_type || "Tomato",
      growth_stage: prev.growth_stage || "Vegetative",
      soil_type: prev.soil_type || preset.soil_type,
      turn_on_below: Math.min(90, preset.turn_on_below + stageBonus),
      turn_off_above: Math.min(95, preset.turn_off_above + stageBonus),
      high_temp_override: preset.high_temp_override,
      override_temp: preset.override_temp,
      operation_mode: "Auto",
      max_run_time: preset.max_run_time,
      cooldown_period: preset.cooldown_period,
      do_not_water_start: "12:00",
      do_not_water_end: "15:00",
    }));

    setPresetMessage(
      `✨ Optimal presets applied for ${selectedCrop} (${
        formData.growth_stage || "Vegetative"
      } stage)!`
    );
    setTimeout(() => setPresetMessage(""), 3500);
  };

  const handleReset = () => {
    setFormData(DEFAULT_SETTINGS);
    setPresetMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crop_type || !formData.growth_stage || !formData.soil_type) {
      setError("Please select Crop Type, Growth Stage, and Soil Type.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        ...formData,
        name:
          formData.name.trim() ||
          `${formData.crop_type} ${isGardener ? "Plant" : "Field"} (${formData.soil_type})`,
        turn_on_below: Number(formData.turn_on_below),
        turn_off_above: Number(formData.turn_off_above),
        override_temp: Number(formData.override_temp),
        max_run_time: Number(formData.max_run_time),
        cooldown_period: Number(formData.cooldown_period),
        // لو جاردنر بنثبت قيمة المهندس أو نتخلا عنها، ولو لاند أونر بياخد المدخل عادي
        engineer: isGardener ? "Assigned Gardener" : formData.engineer,
      };

      // 🟢 توجيه الـ API والـ Navigation ديناميكياً حسب الدور
      const endpoint = isGardener ? `${API_BASE_URL}/api/plants` : `${API_BASE_URL}/lands`;
      const token = localStorage.getItem("access_token");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save data to server.");
      }

      // التوجيه الناجح بناءً على الرول
      if (isGardener) {
        navigate("/my-plants"); // يوديه على نباتاتي وتظهر في الكارد مباشرة
      } else {
        navigate("/lands"); // يوديه على الأراضي للاند أونر
      }
    } catch (err) {
      setError(err.message || "Error saving settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-4 sm:px-8 py-10 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* ================= TOP BADGE & TITLE ================= */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F3EB] text-[#1E6B3B] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <span>🌿</span>
            <span>{isGardener ? "GARDENER PORTAL" : "IOT AUTOMATION"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#143622]">
            {isGardener ? "Add New Plant & Settings" : "Smart Automation Settings"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            {isGardener 
              ? "Register your plant and configure intelligent irrigation rules."
              : "Configure intelligent irrigation rules for your connected water pump based on real-time sensor data."}
          </p>
        </div>

        {/* ================= GREEN BANNER: APPLY SMART PRESETS ================= */}
        <div className="bg-gradient-to-r from-[#174928] to-[#236B38] text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-bold">
              Apply Smart Presets
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              Auto-fill optimal values based on selected crop &amp; growth stage
            </p>
          </div>
          <button
            type="button"
            onClick={handleApplySmartPresets}
            className="bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <span>✨</span>
            <span>Apply Smart Presets</span>
          </button>
        </div>

        {presetMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {presetMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= CARD 1: FIELD & CROP PROFILE ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                🌱
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Field &amp; Crop Profile
                </h3>
                <p className="text-[11px] text-gray-400">
                  Define the crop context for smart threshold calibration
                </p>
              </div>
            </div>

            {/* 🟢 الديناميكية هنا: إخفاء حقل المهندس تماماً للبستاني وإظهاره للاند أونر */}
            <div className={`grid grid-cols-1 ${isGardener ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-4 mb-5`}>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  {isGardener ? "PLANT / PLOT NAME *" : "LAND / PLOT NAME *"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isGardener ? "e.g., Balcony Tomato" : "e.g., North Greenhouse"}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              {/* يظهر فقط لو لم يكن جاردنر */}
              {!isGardener && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                    RESPONSIBLE ENGINEER *
                  </label>
                  <input
                    type="text"
                    name="engineer"
                    required
                    value={formData.engineer}
                    onChange={handleChange}
                    placeholder="e.g., Omar El-Sayed"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  LOCATION
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Giza, Egypt"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>
            </div>

            {/* Crop Type & Growth Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  CROP TYPE
                </label>
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20 cursor-pointer"
                >
                  <option value="">Select crop...</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Olives">Olives</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  GROWTH STAGE
                </label>
                <select
                  name="growth_stage"
                  value={formData.growth_stage}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20 cursor-pointer"
                >
                  <option value="">Select stage...</option>
                  <option value="Seedling">Seedling</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Harvest">Harvest</option>
                </select>
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                SOIL TYPE
              </label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20 cursor-pointer"
              >
                <option value="">Select soil type...</option>
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
                <option value="Clay">Clay</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>
          </div>

          {/* ================= CARD 2: AUTOMATION THRESHOLDS ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                📊
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Automation Thresholds
                </h3>
                <p className="text-[11px] text-gray-400">
                  Set the soil moisture levels that trigger pump ON/OFF cycles
                </p>
              </div>
            </div>

            {/* Turn On Below Slider */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                TURN ON BELOW{" "}
                <span className="text-gray-400 font-normal lowercase">
                  — soil moisture %
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="turn_on_below"
                  min="5"
                  max="90"
                  value={formData.turn_on_below}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#236B38]"
                />
                <span className="px-3 py-1.5 rounded-lg bg-[#E8F3EB] text-[#1E6B3B] font-bold text-xs min-w-[52px] text-center">
                  {formData.turn_on_below}%
                </span>
              </div>
            </div>

            {/* Turn Off Above Slider */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                TURN OFF ABOVE{" "}
                <span className="text-gray-400 font-normal lowercase">
                  — soil moisture %
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="turn_off_above"
                  min="10"
                  max="100"
                  value={formData.turn_off_above}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#236B38]"
                />
                <span className="px-3 py-1.5 rounded-lg bg-[#E8F3EB] text-[#1E6B3B] font-bold text-xs min-w-[52px] text-center">
                  {formData.turn_off_above}%
                </span>
              </div>
            </div>

            {/* High Temperature Override */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                HIGH TEMPERATURE OVERRIDE
              </label>
              <div className="p-4 rounded-xl border border-gray-200/80 bg-[#FAFBF9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#143622]">
                    High Temperature Override
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Briefly run the pump for cooling when air temperature exceeds the set threshold
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="high_temp_override"
                      checked={formData.high_temp_override}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#236B38]"></div>
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="number"
                      name="override_temp"
                      disabled={!formData.high_temp_override}
                      value={formData.override_temp}
                      onChange={handleChange}
                      className="w-16 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 bg-white disabled:opacity-50 focus:outline-none"
                    />
                    <span className="absolute right-2 text-[10px] text-gray-400">
                      °C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 3: PUMP & SAFETY SETTINGS ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                ⚙️
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Pump &amp; Safety Settings
                </h3>
                <p className="text-[11px] text-gray-400">
                  Protect equipment and prevent flooding with hard limits
                </p>
              </div>
            </div>

            {/* Operation Mode */}
            <div className="mb-5">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                OPERATION MODE
              </label>
              <div className="grid grid-cols-3 bg-[#EFF4F0] p-1.5 rounded-xl border border-gray-200/60">
                {[
                  { id: "Auto", icon: "🤖", label: "Auto" },
                  { id: "Timer", icon: "⏱️", label: "Timer" },
                  { id: "Manual", icon: "✋", label: "Manual" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        operation_mode: mode.id,
                      }))
                    }
                    className={`py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-bold transition cursor-pointer ${
                      formData.operation_mode === mode.id
                        ? "bg-white text-[#143622] shadow-xs"
                        : "text-gray-500 hover:text-[#143622]"
                    }`}
                  >
                    <span className="text-sm">{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Run Time & Cooldown Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  MAX RUN TIME
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    name="max_run_time"
                    min="1"
                    max="180"
                    value={formData.max_run_time}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                  />
                  <span className="absolute right-3.5 text-[11px] text-gray-400">
                    min
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  COOLDOWN PERIOD
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    name="cooldown_period"
                    min="0"
                    max="48"
                    value={formData.cooldown_period}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                  />
                  <span className="absolute right-3.5 text-[11px] text-gray-400">
                    hr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 4: TIME RESTRICTIONS ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                🕒
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Time Restrictions
                </h3>
                <p className="text-[11px] text-gray-400">
                  Prevent irrigation during peak-sun hours to reduce evaporation loss
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  DO NOT WATER — START
                </label>
                <input
                  type="time"
                  name="do_not_water_start"
                  value={formData.do_not_water_start}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  DO NOT WATER — END
                </label>
                <input
                  type="time"
                  name="do_not_water_end"
                  value={formData.do_not_water_end}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>
            </div>
          </div>

          {/* ================= BOTTOM ACTION BUTTONS ================= */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-xl shadow-2xs transition cursor-pointer"
            >
              Reset to Defaults
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#236B38] hover:bg-[#174928] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <span>💾</span>
              <span>
                {submitting ? "Saving..." : isGardener ? "Save Plant & Settings" : "Save Automation Settings"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}