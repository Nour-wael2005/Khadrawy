// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { LanguageProvider } from "./Context/LanguageContext";

// Layouts
import MainLayout from "./Components/MainLayout";
import PublicLayout from "./Components/PublicLayout";

// Public pages
import PublicHome from "./Pages/PublicHome";

// Authentication pages
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ForgotPassword from "./Pages/auth/ForgotPassword";

// Route protection
import ProtectedRoute from "./ProtectedRoute";

// Dashboards
import EngineerDashboard from "./Pages/engineer/EngineerDashboard";
import GardenerDashboard from "./Pages/gardener/GardenerDashboard";
import LandownerDashboard from "./Pages/landowner/LandownerDashboard";
import FarmerDashboard from "./Pages/Farmer/FarmerDashboard";

// Landowner management pages
import Lands from "./Pages/landowner/Lands";
import AddLand from "./Pages/landowner/AddLand";
import Engineers from "./Pages/landowner/Engineers";
import AddEngineer from "./Pages/landowner/AddEngineer";
import Farmers from "./Pages/landowner/Farmers";
import AddFarmer from "./Pages/landowner/AddFarmer";

// Gardener pages
import MyPlants from "./Pages/gardener/MyPlants";
import PlantDetails from "./Pages/gardener/PlantDetails";

// AI pages
import AIAssistant from "./Pages/AIAssistant";
import PlantDoctor from "./Pages/PlantDoctor";

// Temporary placeholders for pages not implemented yet.
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
          {/* Authentication pages: no application layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Public website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/home" element={<PublicHome />} />
          </Route>

          {/* Application pages: shared navbar/footer layout */}
          <Route element={<MainLayout />}>
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

            <Route
              path="/farmer-dashboard"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Landowner management: use real pages, not placeholders */}
            <Route
              path="/lands"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <Lands />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lands/add"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <AddLand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/engineers"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <Engineers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/engineers/add"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <AddEngineer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmers"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <Farmers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmers/add"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <AddFarmer />
                </ProtectedRoute>
              }
            />

            {/* Gardener pages */}
            <Route
              path="/my-plants"
              element={
                <ProtectedRoute allowedRole="gardener">
                  <MyPlants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-plants/:plantId"
              element={
                <ProtectedRoute allowedRole="gardener">
                  <PlantDetails />
                </ProtectedRoute>
              }
            />

            {/* AI pages */}
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/plant-doctor" element={<PlantDoctor />} />

            {/* Temporary pages until dedicated screens are implemented */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <SubPagePlaceholder
                    title="Agricultural Reports"
                    subtitle="Detailed seasonal and greenhouse reports."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <SubPagePlaceholder
                    title="Monitoring & Alerts"
                    subtitle="Real-time sensor alerts and diagnosis follow-ups."
                  />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Unknown routes return to the public home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
