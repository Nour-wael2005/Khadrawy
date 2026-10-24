// المسار: src/Components/FarmerLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";

export default function FarmerLayout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("khadrwy_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("khadrwy_name");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-gray-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Top Navbar مبسط خاص بالفارمر */}
      <header className="bg-white border-b border-gray-200/70 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/farmer-dashboard")}>
          <div className="w-10 h-10 rounded-2xl bg-[#1B3B2B] text-white flex items-center justify-center font-extrabold text-lg">
            🌾
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#1B3B2B]">Khadrwy Farmer Portal</h1>
            <p className="text-[11px] text-gray-400">Agricultural Field Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/farmer-dashboard")}
            className="text-xs font-bold text-[#1B3B2B] hover:bg-[#FAF6F0] px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            {lang === "ar" ? "الرئيسية" : "Home"}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-rose-200/60"
          >
            {lang === "ar" ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      </header>

      {/* محتوى الصفحات (FarmerDashboard أو PlantDoctor أو AIAssistant) بدون سايدبار */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}