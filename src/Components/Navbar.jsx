import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";
import logoImage from "../assets/logo.png";
import kd from "../assets/kd.png";


export default function Navbar() {
  const { t, toggleLang, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token =
    localStorage.getItem("khadrwy_access_token") ||
    localStorage.getItem("access_token");

  const username = localStorage.getItem("khadrwy_username") || "مستخدم خضراوي";

  const handleLogout = () => {
    localStorage.removeItem("khadrwy_access_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("khadrwy_username");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-900/10 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🟢 الشعار الرئيسي (دائماً جهة اليمين أو الشمال حسب اللغة) */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#1b3b2b] flex items-center justify-center p-1 overflow-hidden shadow-md group-hover:scale-105 transition">
              <img
                src={logoImage}
                alt="Khadrawy Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={kd}
              alt="Khadrawy Logo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* 💻 روابط التنقل (تظهر فقط للشاشات العريضة lg أكبر من 1024px) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-[#1b3b2b] text-sm whitespace-nowrap">
            <a href="#doctor" className="hover:text-emerald-700 transition-colors">
              {t.nav_doctor}
            </a>
            <Link to="/ai-assistant" className="hover:text-emerald-700 transition-colors">
              {t.nav_assist}
            </Link>
            <a href="#monitoring" className="hover:text-emerald-700 transition-colors">
              {t.nav_monitor}
            </a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">
              {t.nav_pricing}
            </a>
            <a href="#about" className="hover:text-emerald-700 transition-colors">
              {t.nav_about}
            </a>
          </nav>

          {/* 💻 أزرار الحساب واللغة (تظهر فقط للشاشات العريضة lg أكبر من 1024px) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 whitespace-nowrap">
            <button
              onClick={toggleLang}
              className="text-[#1b3b2b] text-sm font-semibold hover:text-emerald-700 transition-colors focus:outline-none cursor-pointer"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>

            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#1b3b2b] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  👤 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  {t.btn_logout}
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#1b3b2b] hover:text-emerald-700 transition-colors px-2 py-1"
                >
                  {t.btn_login}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1b3b2b] text-white text-sm font-semibold rounded-xl hover:bg-[#132a1e] transition-all shadow-md group"
                >
                  <span>{t.btn_signup}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform rtl:rotate-180">
                    →
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* 📱 زر الهامبرجر (يظهر في الموبايل والتابلت الشاشات الأقل من 1024px) */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-[#1b3b2b] text-sm font-semibold hover:text-emerald-700 py-1 transition-colors focus:outline-none cursor-pointer"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1b3b2b] p-2 text-2xl focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>
      </div>

      {/* 📱 القائمة المنسدلة عند الضغط على الهامبرجر (للموبايل والتابلت) */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-900/10 px-6 py-4 space-y-3 shadow-lg">
          <a
            href="#doctor"
            onClick={() => setIsOpen(false)}
            className="block text-[#1b3b2b] font-medium py-1.5 hover:text-emerald-700"
          >
            {t.nav_doctor}
          </a>
          <Link to="/ai-assistant"
            onClick={() => setIsOpen(false)}
            className="block text-[#1b3b2b] font-medium py-1.5 hover:text-emerald-700"
          >
            {t.nav_assist}
          </Link>
          <a
            href="#monitoring"
            onClick={() => setIsOpen(false)}
            className="block text-[#1b3b2b] font-medium py-1.5 hover:text-emerald-700"
          >
            {t.nav_monitor}
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="block text-[#1b3b2b] font-medium py-1.5 hover:text-emerald-700"
          >
            {t.nav_pricing}
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block text-[#1b3b2b] font-medium py-1.5 hover:text-emerald-700"
          >
            {t.nav_about}
          </a>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-center font-semibold"
              >
                {t.btn_logout}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-center text-[#1b3b2b] font-semibold"
                >
                  {t.btn_login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 bg-[#1b3b2b] text-white rounded-xl text-center font-semibold flex items-center justify-center gap-2"
                >
                  <span>{t.btn_signup}</span>
                  <span className="rtl:rotate-180">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}