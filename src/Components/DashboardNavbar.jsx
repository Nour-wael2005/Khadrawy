import React from "react";
import { useLanguage } from "../Context/LanguageContext";
import { useState } from "react";

export default function DashboardNavbar({ onToggleSidebar, isSidebarOpen }) {
  const { t, toggleLang, lang } = useLanguage();

  // 🟢 جلب اسم اليوزر والرول باستخدام نفس المفاتيح المضبوطة
  const userName =
    localStorage.getItem("user_name") ||
    (lang === "ar" ? "مستخدم خضراوي" : "Khadrwy User");
  const userRole = localStorage.getItem("user_role") || "gardener";

  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // دالة لاستخراج أول حرفين من اسم اليوزر
  const getInitials = (name) => {
    if (!name) return "K";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* 🔍 1. شريط البحث (Search Bar) */}
      <div className="flex items-center w-full max-w-md bg-gray-50  border-b-gray-500 rounded-xl px-4 py-2.5 shadow-2xs">
        <svg
          className="w-5 h-5 text-gray-400 ltr:mr-3 rtl:ml-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={
            t.search_placeholder || "Search lands, plants or reports"
          }
          className="bg-transparent w-full text-sm text-gray-700 focus:outline-none"
        />
      </div>

      {/* 👤 2. الجزء الأيمن: زر اللغة + كارت البروفايل */}
      <div className="flex items-center gap-4">
        {/* زر تبديل اللغة */}
        <button
          onClick={toggleLang}
          className="text-[#1b3b2b] text-sm font-semibold hover:text-emerald-700 py-1 px-2 transition-colors focus:outline-none cursor-pointer"
        >
          {lang === "ar" ? "English" : "العربية"}
        </button>

        {/* كارت البروفايل */}
        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
          {/* مربع الحروف الأولى */}
          <div className="w-10 h-10 rounded-xl bg-[#f5ece4] text-[#7c533e] font-bold flex items-center justify-center text-sm shadow-2xs border border-[#e8d8cc]">
            {getInitials(userName)}
          </div>

          {/* الاسم والرول الحقيقيين */}
          <div className="block text-left rtl:text-right">
            <h4 className="text-sm font-bold text-[#1b3b2b] leading-tight whitespace-nowrap">
              {userName}
            </h4>
            <span className="text-xs text-gray-500 font-medium capitalize">
              {userRole}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition focus:outline-none cursor-pointer flex items-center justify-center"
          aria-label="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
  <path d="M0 0h512v512H0z" fill="none" />
  <path fill="none" stroke="#1d4533" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48" d="M88 152h336M88 256h336M88 360h336" />
</svg>
        </button>
      </div>
    </header>
  );
}
