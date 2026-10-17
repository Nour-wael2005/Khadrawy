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
    <header className="sticky top-0 z-50 bg-white border-b border-forest/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* الشعار المدمج */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center p-1 overflow-hidden shadow-md group-hover:scale-105 transition">
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

          {/* روابط التنقل (سطح المكتب) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-forest text-sm whitespace-nowrap">
            <a href="#doctor" className="hover:text-[earthy] transition">
              {t.nav_doctor}
            </a>
            <a href="#assistant" className="hover:text-[earthy] transition">
              {t.nav_assist}
            </a>
            <a href="#monitoring" className="hover:text-[earthy] transition">
              {t.nav_monitor}
            </a>
            <a href="#pricing" className="hover:text-[earthy] transition">
              {t.nav_pricing}
            </a>
            <a href="#about" className="hover:text-[earthy] transition">
              {t.nav_about}
            </a>
          </nav>

          {/* الجهة اليسرى (سطح المكتب): زر اللغة + الدخول والتسجيل */}
          <div className="hidden lg:flex items-center gap-5 shrink-0 whitespace-nowrap">
            <button
              onClick={toggleLang}
              className="text-forest text-sm font-semibold hover:text-[earthy] transition focus:outline-none"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>

            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-forest bg-[cream] px-3 py-1.5 rounded-xl">
                  👤 {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  {t.btn_logout}
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-forest hover:text-[earthy] transition"
                >
                  {t.btn_login}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest/90 transition shadow-md group"
                >
                  <span>{t.btn_signup}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* زر الموبايل والتابلت */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-forest text-sm font-semibold hover:text-[earthy] text-left py-1 transition focus:outline-none"
            >
              {lang === "ar" ? "English" : "العربيه"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-forest p-2 text-2xl focus:outline-none"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل المندلجة */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-forest/10 px-6 py-4 space-y-3">
          <a
            href="#doctor"
            onClick={() => setIsOpen(false)}
            className="block text-forest font-medium py-1"
          >
            {t.nav_doctor}
          </a>
          <a
            href="#assistant"
            onClick={() => setIsOpen(false)}
            className="block text-forest font-medium py-1"
          >
            {t.nav_assist}
          </a>
          <a
            href="#monitoring"
            onClick={() => setIsOpen(false)}
            className="block text-forest font-medium py-1"
          >
            {t.nav_monitor}
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="block text-forest font-medium py-1"
          >
            {t.nav_pricing}
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block text-forest font-medium py-1"
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
                  className="py-2 text-center text-forest font-semibold"
                >
                  {t.btn_login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 bg-forest text-white rounded-xl text-center font-semibold"
                >
                  {t.btn_signup} →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
