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
import PublicLayout from "./Components/PublicLayout";
// Public Page
import PublicHome from "./Pages/PublicHome";

// Auth Pages
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
// Dashboards
import EngineerDashboard from "./Pages/engineer/EngineerDashboard";
import GardenerDashboard from "./Pages/gardener/GardenerDashboard";
import LandownerDashboard from "./Pages/landowner/LandownerDashboard";
import FarmerDashboard from "./Pages/Farmer/FarmerDashboard";
import AIAssistant from "./Pages/AIAssistant";
import MyPlants from "./Pages/gardener/MyPlants";
import PlantDetails from "./Pages/gardener/PlantDetails";
import PlantDoctor from "./Pages/PlantDoctor";
export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* 1️⃣ صفحات المصادقة (مستقلة وبدون Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/home" element={<PublicHome />} />
          </Route>

          {/* 2️⃣ الصفحات اللي تحت الـ MainLayout (بتظهر جواها الناف والفوتر) */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<PublicHome />} />
            <Route
              path="/engineer-dashboard"
              element={
                <ProtectedRoute allowedRole="engineer">
                  <EngineerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gardener-dashboard"
              element={
                <ProtectedRoute allowedRole="gardener">
                  <GardenerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landowner-dashboard"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <LandownerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route
              path="/farmer-dashboard"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/my-plants" element={<MyPlants />} />
            <Route path="/my-plants/:plantId" element={<PlantDetails />} />
              <Route path="/plant-doctor" element={<PlantDoctor />} />
          </Route>

          {/* 3️⃣ أي مسار خاطئ يرجع لصفحة الهوم */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
