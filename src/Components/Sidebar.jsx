import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 🟢 تم إضافة useNavigate هنا
import { useLanguage } from "../Context/LanguageContext"; // 🟢 استيراد الـ Context الخاص باللغة
import logoImage from "../assets/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate(); // 🟢 تعريف الـ navigate بصحيح
  const { t, lang } = useLanguage(); // 🟢 جلب الترجمة واللغة الحالية

  // 🟢 تحديد الرول بناءً على المسار الحالي أو الـ localStorage
  const getActiveRole = () => {
    const path = location.pathname;
    if (path.includes("landowner")) return "landowner";
    if (path.includes("engineer")) return "engineer";
    if (path.includes("farmer")) return "farmer";
    if (path.includes("gardener")) return "gardener";

    return (localStorage.getItem("user_role") || "landowner").toLowerCase();
  };

  const userRole = getActiveRole();
  const userName = localStorage.getItem("user_name") || "Ahmed";

  // تصفية اسم الرول بناءً على اللغة
  const getRoleLabel = () => {
    switch (userRole) {
      case "landowner":
        return lang === "ar" ? "مالك أراضي" : "Landowner";
      case "engineer":
      case "agricultural engineer":
        return lang === "ar" ? "مهندس زراعي" : "Agricultural Engineer";
      case "farmer":
        return lang === "ar" ? "مزارع" : "Farmer";
      default:
        return lang === "ar" ? "بستاني" : "Gardener";
    }
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  // 1. تحديد عناصر القائمة الرئيسية مربوطة بالـ LanguageContext (`t`)
  const getMenuItems = () => {
    switch (userRole) {
      case "landowner":
        return [
          {
            name: t.overview || (lang === "ar" ? "نظرة عامة" : "Overview"),
            path: "/landowner-dashboard",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <rect
                  width="37"
                  height="37"
                  x="5.5"
                  y="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="4"
                  ry="4"
                />
                <rect
                  width="12.4"
                  height="12.4"
                  x="10.66"
                  y="10.19"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.34"
                  ry="1.34"
                />
                <rect
                  width="4.45"
                  height="4.45"
                  x="14.63"
                  y="14.17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx=".48"
                  ry=".48"
                />
                <circle
                  cx="32.42"
                  cy="32.31"
                  r="5.27"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="32.42"
                  cy="30.76"
                  r="1.55"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.47 35.92c.65-.93 1.73-1.53 2.95-1.53s2.22.56 2.88 1.43"
                />
                <rect
                  width="2.61"
                  height="11.52"
                  x="20.45"
                  y="26.56"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="7.44"
                  x="15.55"
                  y="30.63"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="4.81"
                  x="10.66"
                  y="33.26"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.61 10.19h5.66a2.46 2.46 0 0 1 0 4.92h-5.66a2.46 2.46 0 0 1 0-4.92"
                />
                <circle cx="35.09" cy="12.65" r=".75" fill="currentColor" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M35.26 22.6H29.6a2.46 2.46 0 0 1 0-4.92h5.66a2.46 2.46 0 0 1 0 4.92"
                />
                <circle cx="29.78" cy="20.14" r=".75" fill="currentColor" />
              </svg>
            ),
          },
          {
            name: t.lands || (lang === "ar" ? "الأراضي" : "Lands"),
            path: "/lands",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M2.793 1.02c3.36.153 6.775 1.294 9.625 3.767C13.508 5.733 14 7.166 14 8.61a5.37 5.37 0 0 1-1.066 3.216l.94 1.69a1 1 0 0 1-1.749.97l-.708-1.275c-.817.5-1.78.79-2.808.79h-.243c-3.03 0-5.379-2.396-5.232-5.421c.113-2.303.077-4.58-.818-6.852c-.135-.342.11-.726.476-.709m1.905 1.52a.5.5 0 0 0-.395.92c1.635.701 3.155 2.164 4.36 3.777c1.202 1.61 2.044 3.307 2.357 4.401a.5.5 0 0 0 .96-.275c-.353-1.24-1.262-3.043-2.517-4.724c-1.253-1.678-2.9-3.299-4.765-4.098"
                />
              </svg>
            ),
          },
          {
            name: t.farmers || (lang === "ar" ? "المزارعين" : "Farmers"),
            path: "/farmers",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M0 0h512v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="m379.42 24.066l-28.059 87.407l28.268 5.941l-3.098 15.352l-52.25 47.843l-51.5-43.125l-23.404-4.093c8.217-14.33 14.683-32.77 16.404-49.594c10.02-2.28 34.92-5.675 46.094-10.059c-4.997-10.285-30.197-16.906-48.7-16.316c-1.733-20.713-8.88-29.054-34.155-27.902c-25.276 1.151-32.972 6.601-30.16 36.423c-18.866 4.127-38.097 12.616-39.74 27.084c7.87-.307 32.96-2.896 40.724-3.011c.66 14.1 4.4 27.847 9.97 36.375l-35.158-6.125L106 195.922l77.344 55.875l1.625 16.844l-34.19 215.75h38.375l38.315-169.25l47.873 169.25h37.47l-3.564-16.407l17.094 16.407l63.062-322.532c5.01-4.54 9.265-8.481 12.094-11.312c.177-10.537-2.537-18.942-5.094-24.5l.971-4.902l27.238 5.724l8.444-93.117l-22.846 68.781l-10.848-2.256l6.635-72.658l-21.568 69.55l-11.217-2.333zm26.578 3.553l.002-.01h-.002zM182.844 153.39l.344 64.095l-31.5-23.75zm88.031 21.252l50.875 45.937s22.993-19.456 44.875-38.531L309.187 467.61l-42.812-197.529z"
                />
              </svg>
            ),
          },
          {
            name: t.monitoring || (lang === "ar" ? "المراقبة" : "Monitoring"),
            path: "/monitoring",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M6 9.45L8.51 7.6c.84-.62 1.26-.93 1.74-1.01a2 2 0 0 1 .67 0c.47.08.89.4 1.73 1.02c.94.71 1.42 1.06 1.94 1.13a2 2 0 0 0 .74-.05c.51-.12.94-.53 1.8-1.35l2-1.91M6.5 13.29v4.18m8.33-4.18v4.18m-4.17-6v6m8.34-6v6" />
                  <path d="M21.24 21.33H10.76c-3.77 0-5.66 0-6.83-1.17s-1.17-3.06-1.17-6.83V2.63" />
                </g>
              </svg>
            ),
          },
          {
            name:
              t.plantDoctor || (lang === "ar" ? "طبيب النبات" : "Plant Doctor"),
            path: "/plant-doctor",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.88em"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M0 0h448v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48"
                />
              </svg>
            ),
          },
          {
            name: t.reports || (lang === "ar" ? "التقارير" : "Reports"),
            path: "/reports",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <g fill="currentColor">
                  <path d="M7 4a3 3 0 0 0 3 3h3v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h2zm-2.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0-2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm6 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm-6-2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                  <path d="M13 6h-3a2 2 0 0 1-2-2V1z" />
                </g>
              </svg>
            ),
          },
          {
            name:
              t.aiAssistant ||
              (lang === "ar" ? "المساعد الذكي" : "AI Assistant"),
            path: "/ai-assistant",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <path d="M0 0h32v32H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M16 19a6.99 6.99 0 0 1-5.833-3.129l1.666-1.107a5 5 0 0 0 8.334 0l1.666 1.107A6.99 6.99 0 0 1 16 19m4-11a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2m-8 0a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2"
                />
                <path
                  fill="currentColor"
                  d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V6a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v14a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4.835Z"
                />
              </svg>
            ),
          },
        ];
      case "agricultural engineer":
      case "engineer":
        return [
          {
            name: t.overview || (lang === "ar" ? "نظرة عامة" : "Overview"),
            path: "/engineer-dashboard",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <rect
                  width="37"
                  height="37"
                  x="5.5"
                  y="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="4"
                  ry="4"
                />
                <rect
                  width="12.4"
                  height="12.4"
                  x="10.66"
                  y="10.19"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.34"
                  ry="1.34"
                />
                <rect
                  width="4.45"
                  height="4.45"
                  x="14.63"
                  y="14.17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx=".48"
                  ry=".48"
                />
                <circle
                  cx="32.42"
                  cy="32.31"
                  r="5.27"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="32.42"
                  cy="30.76"
                  r="1.55"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.47 35.92c.65-.93 1.73-1.53 2.95-1.53s2.22.56 2.88 1.43"
                />
                <rect
                  width="2.61"
                  height="11.52"
                  x="20.45"
                  y="26.56"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="7.44"
                  x="15.55"
                  y="30.63"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="4.81"
                  x="10.66"
                  y="33.26"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.61 10.19h5.66a2.46 2.46 0 0 1 0 4.92h-5.66a2.46 2.46 0 0 1 0-4.92"
                />
                <circle cx="35.09" cy="12.65" r=".75" fill="currentColor" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M35.26 22.6H29.6a2.46 2.46 0 0 1 0-4.92h5.66a2.46 2.46 0 0 1 0 4.92"
                />
                <circle cx="29.78" cy="20.14" r=".75" fill="currentColor" />
              </svg>
            ),
          },
          {
            name:
              t.assignedLands ||
              (lang === "ar" ? "الأراضي المعينة" : "Assigned Lands"),
            path: "/assigned-lands",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M2.793 1.02c3.36.153 6.775 1.294 9.625 3.767C13.508 5.733 14 7.166 14 8.61a5.37 5.37 0 0 1-1.066 3.216l.94 1.69a1 1 0 0 1-1.749.97l-.708-1.275c-.817.5-1.78.79-2.808.79h-.243c-3.03 0-5.379-2.396-5.232-5.421c.113-2.303.077-4.58-.818-6.852c-.135-.342.11-.726.476-.709m1.905 1.52a.5.5 0 0 0-.395.92c1.635.701 3.155 2.164 4.36 3.777c1.202 1.61 2.044 3.307 2.357 4.401a.5.5 0 0 0 .96-.275c-.353-1.24-1.262-3.043-2.517-4.724c-1.253-1.678-2.9-3.299-4.765-4.098"
                />
              </svg>
            ),
          },
          {
            name: t.farmers || (lang === "ar" ? "المزارعين" : "Farmers"),
            path: "/farmers",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M0 0h512v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="m379.42 24.066l-28.059 87.407l28.268 5.941l-3.098 15.352l-52.25 47.843l-51.5-43.125l-23.404-4.093c8.217-14.33 14.683-32.77 16.404-49.594c10.02-2.28 34.92-5.675 46.094-10.059c-4.997-10.285-30.197-16.906-48.7-16.316c-1.733-20.713-8.88-29.054-34.155-27.902c-25.276 1.151-32.972 6.601-30.16 36.423c-18.866 4.127-38.097 12.616-39.74 27.084c7.87-.307 32.96-2.896 40.724-3.011c.66 14.1 4.4 27.847 9.97 36.375l-35.158-6.125L106 195.922l77.344 55.875l1.625 16.844l-34.19 215.75h38.375l38.315-169.25l47.873 169.25h37.47l-3.564-16.407l17.094 16.407l63.062-322.532c5.01-4.54 9.265-8.481 12.094-11.312c.177-10.537-2.537-18.942-5.094-24.5l.971-4.902l27.238 5.724l8.444-93.117l-22.846 68.781l-10.848-2.256l6.635-72.658l-21.568 69.55l-11.217-2.333zm26.578 3.553l.002-.01h-.002zM182.844 153.39l.344 64.095l-31.5-23.75zm88.031 21.252l50.875 45.937s22.993-19.456 44.875-38.531L309.187 467.61l-42.812-197.529z"
                />
              </svg>
            ),
          },
          {
            name: t.monitoring || (lang === "ar" ? "المراقبة" : "Monitoring"),
            path: "/monitoring",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M6 9.45L8.51 7.6c.84-.62 1.26-.93 1.74-1.01a2 2 0 0 1 .67 0c.47.08.89.4 1.73 1.02c.94.71 1.42 1.06 1.94 1.13a2 2 0 0 0 .74-.05c.51-.12.94-.53 1.8-1.35l2-1.91M6.5 13.29v4.18m8.33-4.18v4.18m-4.17-6v6m8.34-6v6" />
                  <path d="M21.24 21.33H10.76c-3.77 0-5.66 0-6.83-1.17s-1.17-3.06-1.17-6.83V2.63" />
                </g>
              </svg>
            ),
          },
          {
            name:
              t.plantDoctor || (lang === "ar" ? "طبيب النبات" : "Plant Doctor"),
            path: "/plant-doctor",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.88em"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M0 0h448v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48"
                />
              </svg>
            ),
          },
          {
            name: t.reports || (lang === "ar" ? "التقارير" : "Reports"),
            path: "/reports",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <g fill="currentColor">
                  <path d="M7 4a3 3 0 0 0 3 3h3v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h2zm-2.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0-2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm6 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm-6-2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                  <path d="M13 6h-3a2 2 0 0 1-2-2V1z" />
                </g>
              </svg>
            ),
          },
          {
            name:
              t.aiAssistant ||
              (lang === "ar" ? "المساعد الذكي" : "AI Assistant"),
            path: "/ai-assistant",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <path d="M0 0h32v32H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M16 19a6.99 6.99 0 0 1-5.833-3.129l1.666-1.107a5 5 0 0 0 8.334 0l1.666 1.107A6.99 6.99 0 0 1 16 19m4-11a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2m-8 0a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2"
                />
                <path
                  fill="currentColor"
                  d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V6a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v14a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4.835Z"
                />
              </svg>
            ),
          },
        ];
      case "farmer":
        return [
          {
            name: t.overview || (lang === "ar" ? "نظرة عامة" : "Overview"),
            path: "/farmer-dashboard",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <rect
                  width="37"
                  height="37"
                  x="5.5"
                  y="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="4"
                  ry="4"
                />
                <rect
                  width="12.4"
                  height="12.4"
                  x="10.66"
                  y="10.19"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.34"
                  ry="1.34"
                />
                <rect
                  width="4.45"
                  height="4.45"
                  x="14.63"
                  y="14.17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx=".48"
                  ry=".48"
                />
                <circle
                  cx="32.42"
                  cy="32.31"
                  r="5.27"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="32.42"
                  cy="30.76"
                  r="1.55"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.47 35.92c.65-.93 1.73-1.53 2.95-1.53s2.22.56 2.88 1.43"
                />
                <rect
                  width="2.61"
                  height="11.52"
                  x="20.45"
                  y="26.56"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="7.44"
                  x="15.55"
                  y="30.63"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="4.81"
                  x="10.66"
                  y="33.26"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.61 10.19h5.66a2.46 2.46 0 0 1 0 4.92h-5.66a2.46 2.46 0 0 1 0-4.92"
                />
                <circle cx="35.09" cy="12.65" r=".75" fill="currentColor" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M35.26 22.6H29.6a2.46 2.46 0 0 1 0-4.92h5.66a2.46 2.46 0 0 1 0 4.92"
                />
                <circle cx="29.78" cy="20.14" r=".75" fill="currentColor" />
              </svg>
            ),
          },
          {
            name:
              t.assignedLands ||
              (lang === "ar" ? "الأراضي المعينة" : "Assigned Lands"),
            path: "/assigned-lands",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M2.793 1.02c3.36.153 6.775 1.294 9.625 3.767C13.508 5.733 14 7.166 14 8.61a5.37 5.37 0 0 1-1.066 3.216l.94 1.69a1 1 0 0 1-1.749.97l-.708-1.275c-.817.5-1.78.79-2.808.79h-.243c-3.03 0-5.379-2.396-5.232-5.421c.113-2.303.077-4.58-.818-6.852c-.135-.342.11-.726.476-.709m1.905 1.52a.5.5 0 0 0-.395.92c1.635.701 3.155 2.164 4.36 3.777c1.202 1.61 2.044 3.307 2.357 4.401a.5.5 0 0 0 .96-.275c-.353-1.24-1.262-3.043-2.517-4.724c-1.253-1.678-2.9-3.299-4.765-4.098"
                />
              </svg>
            ),
          },
          {
            name: t.monitoring || (lang === "ar" ? "المراقبة" : "Monitoring"),
            path: "/monitoring",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M6 9.45L8.51 7.6c.84-.62 1.26-.93 1.74-1.01a2 2 0 0 1 .67 0c.47.08.89.4 1.73 1.02c.94.71 1.42 1.06 1.94 1.13a2 2 0 0 0 .74-.05c.51-.12.94-.53 1.8-1.35l2-1.91M6.5 13.29v4.18m8.33-4.18v4.18m-4.17-6v6m8.34-6v6" />
                  <path d="M21.24 21.33H10.76c-3.77 0-5.66 0-6.83-1.17s-1.17-3.06-1.17-6.83V2.63" />
                </g>
              </svg>
            ),
          },
          {
            name:
              t.plantDoctor || (lang === "ar" ? "طبيب النبات" : "Plant Doctor"),
            path: "/plant-doctor",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.88em"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M0 0h448v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48"
                />
              </svg>
            ),
          },
          {
            name:
              t.aiAssistant ||
              (lang === "ar" ? "المساعد الذكي" : "AI Assistant"),
            path: "/ai-assistant",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <path d="M0 0h32v32H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M16 19a6.99 6.99 0 0 1-5.833-3.129l1.666-1.107a5 5 0 0 0 8.334 0l1.666 1.107A6.99 6.99 0 0 1 16 19m4-11a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2m-8 0a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2"
                />
                <path
                  fill="currentColor"
                  d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V6a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v14a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4.835Z"
                />
              </svg>
            ),
          },
        ];
      case "gardener":
      default:
        return [
          {
            name: t.home || (lang === "ar" ? "الرئيسية" : "Home"),
            path: "/gardener-dashboard",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <rect
                  width="37"
                  height="37"
                  x="5.5"
                  y="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="4"
                  ry="4"
                />
                <rect
                  width="12.4"
                  height="12.4"
                  x="10.66"
                  y="10.19"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.34"
                  ry="1.34"
                />
                <rect
                  width="4.45"
                  height="4.45"
                  x="14.63"
                  y="14.17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx=".48"
                  ry=".48"
                />
                <circle
                  cx="32.42"
                  cy="32.31"
                  r="5.27"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="32.42"
                  cy="30.76"
                  r="1.55"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.47 35.92c.65-.93 1.73-1.53 2.95-1.53s2.22.56 2.88 1.43"
                />
                <rect
                  width="2.61"
                  height="11.52"
                  x="20.45"
                  y="26.56"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="7.44"
                  x="15.55"
                  y="30.63"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <rect
                  width="2.61"
                  height="4.81"
                  x="10.66"
                  y="33.26"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="1.09"
                  ry="1.09"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M29.61 10.19h5.66a2.46 2.46 0 0 1 0 4.92h-5.66a2.46 2.46 0 0 1 0-4.92"
                />
                <circle cx="35.09" cy="12.65" r=".75" fill="currentColor" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M35.26 22.6H29.6a2.46 2.46 0 0 1 0-4.92h5.66a2.46 2.46 0 0 1 0 4.92"
                />
                <circle cx="29.78" cy="20.14" r=".75" fill="currentColor" />
              </svg>
            ),
          },
          {
            name: t.myPlants || (lang === "ar" ? "نباتاتي" : "My Plants"),
            path: "/my-plants",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path d="M0 0h16v16H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M2.793 1.02c3.36.153 6.775 1.294 9.625 3.767C13.508 5.733 14 7.166 14 8.61a5.37 5.37 0 0 1-1.066 3.216l.94 1.69a1 1 0 0 1-1.749.97l-.708-1.275c-.817.5-1.78.79-2.808.79h-.243c-3.03 0-5.379-2.396-5.232-5.421c.113-2.303.077-4.58-.818-6.852c-.135-.342.11-.726.476-.709m1.905 1.52a.5.5 0 0 0-.395.92c1.635.701 3.155 2.164 4.36 3.777c1.202 1.61 2.044 3.307 2.357 4.401a.5.5 0 0 0 .96-.275c-.353-1.24-1.262-3.043-2.517-4.724c-1.253-1.678-2.9-3.299-4.765-4.098"
                />
              </svg>
            ),
          },
          {
            name:
              t.plantDoctor || (lang === "ar" ? "طبيب النبات" : "Plant Doctor"),
            path: "/plant-doctor",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.88em"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M0 0h448v512H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48"
                />
              </svg>
            ),
          },
          {
            name:
              t.aiAssistant ||
              (lang === "ar" ? "المساعد الذكي" : "AI Assistant"),
            path: "/ai-assistant",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <path d="M0 0h32v32H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M16 19a6.99 6.99 0 0 1-5.833-3.129l1.666-1.107a5 5 0 0 0 8.334 0l1.666 1.107A6.99 6.99 0 0 1 16 19m4-11a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2m-8 0a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2"
                />
                <path
                  fill="currentColor"
                  d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V6a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v14a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4.835Z"
                />
              </svg>
            ),
          },
          // {
          //   name:
          //     t.careSchedule ||
          //     (lang === "ar" ? "جدول العناية" : "Care Schedule"),
          //   path: "/care-schedule",
          //   icon: (
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       width="1em"
          //       height="1em"
          //       viewBox="0 0 24 24"
          //     >
          //       <path d="M0 0h24v24H0z" fill="none" />
          //       <path
          //         fill="currentColor"
          //         d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zM9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"
          //       />
          //     </svg>
          //   ),
          // },
          // {
          //   name:
          //     t.diagnosisHistory ||
          //     (lang === "ar" ? "سجل التشخيصات" : "Diagnosis History"),
          //   path: "/diagnosis-history",
          //   icon: (
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       width="1em"
          //       height="1em"
          //       viewBox="0 0 24 24"
          //     >
          //       <path d="M0 0h24v24H0z" fill="none" />
          //       <path
          //         fill="currentColor"
          //         d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"
          //       />
          //     </svg>
          //   ),
          // },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40  backdrop-blur-xs"
        />
      )}

<aside
  className={`fixed inset-y-0 ${
    lang === "ar" ? "right-0" : "left-0"
  } z-50 w-64 bg-[#133828] text-white flex flex-col justify-between ${
    isOpen
      ? "translate-x-0"
      : lang === "ar"
      ? "translate-x-full"
      : "-translate-x-full"
  }`}
  dir={lang === "ar" ? "rtl" : "ltr"}
>
      
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          {/* LOGO AREA */}
          <Link
            to="/"
            className="flex items-center gap-2.5 px-2 py-2 mb-4 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1 overflow-hidden shadow-xs group-hover:scale-105 transition">
              <img
                src={logoImage}
                alt="Khadrawy"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Khadrwy
            </span>
          </Link>

          {/* WORKSPACE SECTION HEADER */}
          <div className="mt-2 mb-2 px-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-200/50 uppercase">
              {lang === "ar" ? "أهلاً بك،" : "Hello,"}
            </span>
          </div>

          {/* WORKSPACE USER SELECTOR BOX */}
          <div className="bg-[#1c4734] border border-emerald-800/40 rounded-2xl p-2.5 mb-5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#e3cbaf] text-[#133828] font-bold text-xs flex items-center justify-center">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-tight">
                  {userName}
                </span>
                <span className="text-xs text-white/50 leading-tight mt-0.5">
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* NAV MENU ITEMS */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#f5f0eb] text-[#133828] font-bold shadow-xs"
                      : "text-emerald-100/80 hover:bg-[#1a4431] hover:text-white"
                  }`}
                >
                  <span
                    className={`${isActive ? "text-[#133828]" : "text-emerald-200/70"}`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 🔴 زر تسجيل الخروج في الأسفل خالص */}
        <div className="p-4 border-t border-emerald-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600/20 text-rose-300 hover:bg-amber-100/10 hover:text-white transition shadow-xs cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>{lang === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
