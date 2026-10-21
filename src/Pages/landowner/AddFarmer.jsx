// المسار: src/Pages/landowner/AddFarmer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function AddFarmer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "Irrigation & Pump Operator",
    status: "Active",
    assigned_land_id: null,
  });

  const [availableLands, setAvailableLands] = useState([]);
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
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, assigned_land_id: data[0].id }));
          }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError("Please fill in all required farmer details.");
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          specialization: formData.specialization,
          status: formData.status,
          assigned_land_id: formData.assigned_land_id
            ? Number(formData.assigned_land_id)
            : null,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.detail || "Failed to register farmer.");
      }

      // بعد الحفظ في الداتابيز يرجع لصفحة Farmers فيظهر بتفاصيله في الجدول فوراً
      navigate("/farmers");
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Server took too long to respond. Make sure backend (uvicorn) is running.");
      } else {
        setError(err.message || "Error registering farmer.");
      }
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
              onClick={() => navigate("/farmers")}
              className="hover:text-[#1B3B2B] cursor-pointer"
            >
              Farmers
            </span>{" "}
            / Add farmer
          </p>
          <div className="inline-flex items-center gap-1.5 bg-[#E8F3EB] text-[#1E6B3B] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <span>🌾</span>
            <span>FIELD TEAM ONBOARDING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#143622]">
            Register Field Farmer
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Create a farmer account, define their field task, and assign them to
            an agricultural plot.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= CARD 1: FARMER PERSONAL & ACCOUNT DETAILS ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Farmer Information &amp; Credentials
                </h3>
                <p className="text-[11px] text-gray-400">
                  Personal details and login credentials for the farmer&apos;s
                  workspace
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
                  placeholder="e.g., Mahmoud Ibrahim"
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
                  placeholder="e.g., 01098765432"
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
                  placeholder="mahmoud@khadrwy.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#143622] mb-2">
                  FIELD ROLE / PRIMARY TASK
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E6B3B]/20 cursor-pointer"
                >
                  <option value="Irrigation & Pump Operator">
                    Irrigation &amp; Pump Operator
                  </option>
                  <option value="Harvesting & Pruning">
                    Harvesting &amp; Pruning
                  </option>
                  <option value="Soil & Fertilizer Application">
                    Soil &amp; Fertilizer Application
                  </option>
                  <option value="Greenhouse Crop Care">
                    Greenhouse Crop Care
                  </option>
                  <option value="Pest & Disease Scouting">
                    Pest &amp; Disease Scouting
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

          {/* ================= CARD 2: ASSIGN WORKING LAND (FROM DATABASE) ================= */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/70 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] flex items-center justify-center text-lg">
                🌱
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#143622]">
                  Assign Working Land
                </h3>
                <p className="text-[11px] text-gray-400">
                  Select the agricultural land where this farmer works from your
                  registered plots
                </p>
              </div>
            </div>

            {loadingLands ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Loading lands from database...
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
                  const isSelected =
                    Number(formData.assigned_land_id) === Number(land.id);
                  return (
                    <label
                      key={land.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          assigned_land_id: land.id,
                        }))
                      }
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                        isSelected
                          ? "bg-[#E8F3EB]/60 border-[#236B38] shadow-2xs"
                          : "bg-[#FAFBF9] border-gray-200/80 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="assigned_land_id"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 accent-[#236B38] cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#143622]">
                            {land.name}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {land.crop_type} · {land.location}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Supervisor:{" "}
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
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/farmers")}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-xl shadow-2xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#236B38] hover:bg-[#174928] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <span>🌾</span>
              <span>{submitting ? "Saving..." : "Register Farmer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}