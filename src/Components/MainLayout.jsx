import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import DashboardNavbar from "../Components/DashboardNavbar";
import { useLanguage } from "../Context/LanguageContext";

export default function MainLayout() {
  // ممكن تخليه يبدأ مفتوح (true) أو مقفول (false) حسب رغبتك في الشاشات الكبيرة
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const { lang } = useLanguage();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#FAF6F0] overflow-hidden relative" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* الـ Sidebar: هيظهر ويختفي بناءً على الـ State بتاعتك وبس */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* منطقة المحتوى */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-[#FAF6F0]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}