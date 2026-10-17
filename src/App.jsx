import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./Context/LanguageContext";

// Layout
import MainLayout from "./Components/MainLayout";

// Auth Pages (مستقلة بدون الناف والفوتر)
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ForgotPassword from "./Pages/auth/ForgotPassword"; // 👈 تأكدي من استيراد الصفحة هنا

// Dashboards
import EngineerDashboard from "./Pages/engineer/EngineerDashboard";
import GardenerDashboard from "./Pages/gardener/GardenerDashboard";
import LandownerDashboard from "./Pages/landowner/LandownerDashboard";
import AIAssistant from "./Pages/AIAssistant";
export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* 1️⃣ صفحات المصادقة (مستقلة وبدون Navbar/Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
          <Route path="/ai-assistant" element={<AIAssistant />} />{" "}
          {/* 👈 هُنا المسار الرئيسي */}
          {/* 2️⃣ باقي الصفحات (مع Navbar و Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
            <Route path="/gardener-dashboard" element={<GardenerDashboard />} />
            <Route
              path="/landowner-dashboard"
              element={<LandownerDashboard />}
            />
          </Route>
          {/* أي مسار خاطئ يرجع للـ Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
