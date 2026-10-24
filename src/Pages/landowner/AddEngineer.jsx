// المسار: src/Pages/landowner/AddEngineer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function AddEngineer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "Greenhouse & Irrigation",
    status: "Active",
  });

  // قائمة الأراضي القادمة من الداتابيز للـ Checklist
  const [availableLands, setAvailableLands] = useState([]);
  const [selectedLandIds, setSelectedLandIds] = useState([]);
  const [loadingLands, setLoadingLands] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoadingLands(true);
        const res = await fetch(`${API_BASE_URL}/lands`);
        if (res.ok) {
          const data = await res.json();
          setAvailableLands(data);
        }
      } catch (err) {
        console.error("Failed to load lands:", err);
      } finally {
        setLoadingLands(false);
      }
    };
    fetchLands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // اختيار أو إلغاء اختيار أرض من الـ Checklist
  const toggleLandSelection = (landId) => {
    setSelectedLandIds((prev) =>
      prev.includes(landId)
        ? prev.filter((id) => id !== landId)
        : [...prev, landId]
    );
  };

  const handleSelectAllLands = () => {
    if (selectedLandIds.length === availableLands.length) {
      setSelectedLandIds([]);
    } else {
      setSelectedLandIds(availableLands.map((l) => l.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required registration fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/engineers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          specialization: formData.specialization,
          status: formData.status,
          land_ids: selectedLandIds,
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.detail || "Failed to register engineer.");
      }

      navigate("/engineers");
    } catch (err) {
      setError(err.message || "Error creating engineer account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-4 sm:px-8 py-10 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* ================= HEADER & BREADCRUMB ================= */}
        <div className="mb-7">
          <p className="text-[11px] text-gray-400 font-medium mb-2">
            <span
              onClick={() => navigate("/landowner-dashboard")}
              className="hover:text-[#1B3B2B] cursor-pointer"
            >
              Khadrwy
            </span>{" "}
            /{" "}
            <span
              onClick={() => navigate("/engineers")}
              className="hover:text-[#1B3B2B] cursor-pointer"
            >
              Engineers
            </span>{" "}
            / Add engineer
          </p>
          <div className="inline-flex items-center gap-1.5 bg-[#E8F3EB] text-[#1E6B3B] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <span>👨‍🌾</span>
            <span>TEAM ONBOARDING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#143622]">
            Register Agricultural Engineer
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Create an official engineer account and assign the agricultural
            lands they will supervise.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= CARD 1: ENGINEER REGISTRATION DETAILS ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                🪪
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Account &amp; Personal Information
                </h3>
                <p className="text-[11px] text-gray-400">
                  The engineer will use this email and password to log in to
                  their dashboard
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Eng. Karim Mahmoud"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="karim@khadrwy.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 01012345678"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  AGRICULTURAL SPECIALIZATION
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20 cursor-pointer"
                >
                  <option value="Greenhouse & Irrigation">
                    Greenhouse &amp; Irrigation
                  </option>
                  <option value="Plant Pathology & Soil">
                    Plant Pathology &amp; Soil
                  </option>
                  <option value="Orchard & Citrus Systems">
                    Orchard &amp; Citrus Systems
                  </option>
                  <option value="Crop & Soil Management">
                    Crop &amp; Soil Management
                  </option>
                  <option value="IoT & Smart Farming">
                    IoT &amp; Smart Farming
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  CONFIRM PASSWORD *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>
            </div>
          </div>

          {/* ================= CARD 2: ASSIGN LANDS CHECKLIST (FROM DATABASE) ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                  🌱
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#143622]">
                    Assign Supervised Lands (Checklist)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Select one or more lands from your database. Only selected
                    lands will appear in this engineer&apos;s workspace.
                  </p>
                </div>
              </div>

              {availableLands.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllLands}
                  className="text-xs font-bold text-[#1E6B3B] hover:underline cursor-pointer shrink-0"
                >
                  {selectedLandIds.length === availableLands.length
                    ? "Deselect all"
                    : "Select all lands"}
                </button>
              )}
            </div>

            {loadingLands ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Loading your lands from database...
              </div>
            ) : availableLands.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-gray-400 mb-3">
                  No lands found in the database yet.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/lands/add")}
                  className="text-xs font-bold text-[#1E6B3B] underline cursor-pointer"
                >
                  + Add a land first
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableLands.map((land) => {
                  const isChecked = selectedLandIds.includes(land.id);
                  return (
                    <label
                      key={land.id}
                      onClick={() => toggleLandSelection(land.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                        isChecked
                          ? "bg-[#E8F3EB]/60 border-[#236B38] shadow-2xs"
                          : "bg-[#FAFBF9] border-gray-200/80 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded accent-[#236B38] cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#143622]">
                            {land.name}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {land.crop_type} · {land.location}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Current engineer:{" "}
                            <span className="font-semibold text-gray-600">
                              {land.engineer || "Unassigned"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          land.status === "Healthy"
                            ? "bg-emerald-50 text-emerald-700"
                            : land.status === "Attention"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {land.status}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>
                Selected lands:{" "}
                <strong className="text-[#143622]">
                  {selectedLandIds.length}
                </strong>{" "}
                of {availableLands.length}
              </span>
              <span>Role: Agricultural Engineer</span>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/engineers")}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-xl shadow-2xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#236B38] hover:bg-[#174928] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <span>👨‍🌾</span>
              <span>
                {submitting
                  ? "Registering..."
                  : "Register & Assign Engineer"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}