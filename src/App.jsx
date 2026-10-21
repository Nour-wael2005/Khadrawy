// المسار: src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { LanguageProvider } from "./Context/LanguageContext";

// Layout
import MainLayout from "./Components/MainLayout";

// Auth Pages (مستقلة بدون الناف والفوتر)
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import Farmers from "./Pages/landowner/Farmers";
import AddFarmer from "./Pages/landowner/AddFarmer";

// Dashboards & AI Pages
import EngineerDashboard from "./Pages/engineer/EngineerDashboard";
import GardenerDashboard from "./Pages/gardener/GardenerDashboard";
import LandownerDashboard from "./Pages/landowner/LandownerDashboard";
import AIAssistant from "./Pages/AIAssistant";
import Lands from "./Pages/landowner/Lands";
import AddLand from "./Pages/landowner/AddLand";
import Engineers from "./Pages/landowner/Engineers";
import AddEngineer from "./Pages/landowner/AddEngineer";
// كومبوننت مؤقت للصفحات الفرعية (Lands, Engineers, Farmers, Reports, Notifications)
// عشان لما تضغطي على أي كارد في الداشبورد يفتح الصفحة وميرجعكيش للـ Login
function SubPagePlaceholder({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] bg-[#FAF6F0] px-6 sm:px-10 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/landowner-dashboard")}
          className="text-xs font-bold text-[#1B3B2B] mb-4 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>←</span> Back to Landowner Overview
        </button>
        <div className="bg-white p-8 rounded-3xl border border-gray-200/70 shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#1B3B2B]">{title}</h1>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* 1️⃣ صفحات المصادقة (مستقلة وبدون Navbar/Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 2️⃣ باقي الصفحات (مع Navbar و Footer داخل MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
            <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
            <Route path="/lands" element={<Lands />} />
            <Route path="/engineers" element={<Engineers />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/engineers/add" element={<AddEngineer />} />
            <Route path="/farmers/add" element={<AddFarmer />} />
            <Route path="/lands/add" element={<AddLand />} />
            <Route
              path="/landowner-dashboard"
              element={<LandownerDashboard />}
            />

            {/* مسارات الشات و Plant Doctor */}
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/plant-doctor" element={<AIAssistant />} />

            <Route
              path="/engineers"
              element={
                <SubPagePlaceholder
                  title="Agricultural Engineers"
                  subtitle="Manage engineers assigned across your lands."
                />
              }
            />
            <Route
              path="/farmers"
              element={
                <SubPagePlaceholder
                  title="Farmers Directory"
                  subtitle="View and manage all farmers across your lands."
                />
              }
            />
            <Route
              path="/reports"
              element={
                <SubPagePlaceholder
                  title="Agricultural Reports"
                  subtitle="Detailed seasonal and greenhouse reports."
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <SubPagePlaceholder
                  title="Monitoring & Alerts"
                  subtitle="Real-time sensor alerts and diagnosis follow-ups."
                />
              }
            />
          </Route>

          {/* أي مسار خاطئ يرجع للـ Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}