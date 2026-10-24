import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-forest font-sans">
      {/* الناف بار يظهر فقط للصفحات المندرجة تحت هذا التخطيط */}
      <Navbar />

      {/* المحتوى الديناميكي للصفحات */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* الفوتر يظهر فقط للصفحات المندرجة تحت هذا التخطيط */}
      <Footer />
    </div>
  );
}
