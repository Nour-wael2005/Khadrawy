// المسار: src/Pages/engineer/EngineerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StatCard,
  LandHealthTable,
  NeedsAttentionCard,
} from "../../Components/DashboardWidgets";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function EngineerDashboard() {
  const navigate = useNavigate();

  const engineerName = localStorage.getItem("khadrwy_name") || "Omar";
  const engineerEmail = localStorage.getItem("khadrwy_email") || "omar@khadrwy.com";

  const [stats, setStats] = useState({
    assignedLands: 4,
    landsSub: "1 needs configuration",
    totalFarmers: 11,
    farmersSub: "Across your lands",
    needsSetup: 1,
    setupSub: "Complete before monitoring",
  });

  const [assignedLandsList, setAssignedLandsList] = useState([
    {
      id: 1,
      name: "North Greenhouse",
      location: "Giza, Egypt",
      engineer: "Omar El-Sayed",
      device: "Online",
      status: "Healthy",
    },
    {
      id: 2,
      name: "Olive Field East",
      location: "Giza, Egypt",
      engineer: "Nour Hassan",
      device: "Online",
      status: "Attention",
    },
    {
      id: 3,
      name: "Orchard Block C",
      location: "Giza, Egypt",
      engineer: "Salma Amin",
      device: "Not connected",
      status: "Setup required",
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "moisture",
      title: "Low soil moisture",
      location: "Olive Field East",
      time: "18 min ago",
    },
    {
      id: 2,
      type: "sensor",
      title: "Sensor needs attention",
      location: "North field",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "diagnosis",
      title: "Diagnosis follow-up",
      location: "Tomato crop",
      time: "Yesterday",
    },
  ]);

  const [recentDiagnosis, setRecentDiagnosis] = useState({
    title: "Possible early blight",
    cropAndLand: "Tomato · North Greenhouse",
    severityAndTime: "Moderate severity · Today, 9:42 AM",
    imageUrl:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&auto=format&fit=crop&q=80",
  });

  const [latestReport, setLatestReport] = useState({
    periodAndLand: "May 2025 · North Greenhouse",
    completeness: 84,
    summary: "12 diagnoses · 18 irrigation events · 4 notes",
  });

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("khadrwy_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const loadDiagnosisFromChatHistory = () => {
      try {
        const storageKey = `khadrwy_chat_history_${
          localStorage.getItem("khadrwy_name") || "guest_user"
        }`;
        const savedChats = localStorage.getItem(storageKey);
        if (savedChats) {
          const parsedChats = JSON.parse(savedChats);
          if (Array.isArray(parsedChats) && parsedChats.length > 0) {
            const latestChat = parsedChats[0];
            const userMsgsWithImg = (latestChat.messages || []).filter(
              (m) => m.attachments && m.attachments.length > 0
            );
            const lastImgUrl =
              userMsgsWithImg.length > 0
                ? userMsgsWithImg[userMsgsWithImg.length - 1].attachments[0].url
                : null;

            setRecentDiagnosis((prev) => ({
              ...prev,
              title: latestChat.title || prev.title,
              imageUrl: lastImgUrl || prev.imageUrl,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to read chat history:", err);
      }
    };

    const fetchEngineerData = async () => {
      try {
        const landsRes = await fetch(
          `${API_BASE_URL}/lands?engineer_email=${engineerEmail}`,
          { headers }
        );
        if (landsRes.ok) {
          const landsData = await landsRes.json();
          if (Array.isArray(landsData) && landsData.length > 0) {
            setAssignedLandsList(landsData);

            const setupCount = landsData.filter(
              (l) =>
                (l.status || "").toLowerCase().includes("setup") ||
                (l.device || "").toLowerCase().includes("not connected")
            ).length;

            setStats((prev) => ({
              ...prev,
              assignedLands: landsData.length,
              needsSetup: setupCount,
              landsSub: `${setupCount} needs configuration`,
            }));
          }
        }

        const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
          headers,
        });
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          if (Array.isArray(notifData) && notifData.length > 0) {
            setAlerts(notifData.slice(0, 3));
          }
        }
      } catch (error) {
        console.log("Using preview engineer operational data.");
      }
    };

    loadDiagnosisFromChatHistory();
    fetchEngineerData();
  }, [engineerEmail]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 sm:px-10 py-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-1">
              Khadrwy / Engineer Overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
              Good morning, {engineerName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Here&apos;s what&apos;s happening across your agricultural workspace.
            </p>
          </div>

          <button
            onClick={() => navigate("/plant-doctor")}
            className="bg-[#1B3B2B] hover:bg-[#1B3B2B]/90 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
          >
            <span className="text-sm font-normal">+</span>
            <span>New diagnosis</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatCard
            title="Assigned lands"
            value={stats.assignedLands}
            subtitle={stats.landsSub}
            onClick={() => navigate("/assigned-lands")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M14 7h7v7" />
              </svg>
            }
          />
          
          <StatCard
            title="Farmers"
            value={stats.totalFarmers}
            subtitle={stats.farmersSub}
            onClick={() => navigate("/engineer-farmers")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />

          <StatCard
            title="Needs setup"
            value={stats.needsSetup}
            subtitle={stats.setupSub}
            onClick={() => navigate("/assigned-lands")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <LandHealthTable
            lands={assignedLandsList}
            onViewAll={() => navigate("/assigned-lands")}
            onRowAction={() => navigate("/assigned-lands")}
          />

          <NeedsAttentionCard
            alerts={alerts}
            onViewAll={() => navigate("/notifications")}
            onAlertClick={() => navigate("/notifications")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#1B3B2B]">
                    Recent diagnoses
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    AI results require review
                  </p>
                </div>
                <button
                  onClick={() => navigate("/plant-doctor")}
                  className="text-xs font-bold text-[#1B3B2B] hover:underline cursor-pointer"
                >
                  Open Plant Doctor
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-100 bg-[#FAF6F0]/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={recentDiagnosis.imageUrl}
                    alt="Plant diagnosis"
                    className="w-16 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3B2B]">
                      {recentDiagnosis.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {recentDiagnosis.cropAndLand}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {recentDiagnosis.severityAndTime}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/plant-doctor")}
                  className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-[11px] font-bold hover:bg-amber-100 transition cursor-pointer shrink-0"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#1B3B2B]">
                    Latest report
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {latestReport.periodAndLand}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/reports")}
                  className="text-xs font-bold text-[#1B3B2B] hover:underline cursor-pointer"
                >
                  View report
                </button>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-500 font-medium">
                    Report completeness
                  </span>
                  <span className="font-extrabold text-[#1B3B2B]">
                    {latestReport.completeness}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B3B2B] rounded-full transition-all duration-500"
                    style={{ width: `${latestReport.completeness}%` }}
                  ></div>
                </div>

                <p className="text-[10px] text-gray-400 mt-4">
                  {latestReport.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}