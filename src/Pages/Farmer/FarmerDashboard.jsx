// المسار: src/Pages/Farmer/FarmerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const farmerName = localStorage.getItem("khadrwy_name") || (lang === "ar" ? "مزارع" : "Farmer");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200/70 shadow-xs mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">
            {lang === "ar" ? "لوحة تحكم المزارع" : "Farmer Portal"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B]">
            {lang === "ar" ? `أهلاً بك، ${farmerName} ` : `Welcome back, ${farmerName} `}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {lang === "ar"
              ? "اختر الأداة المطلوبة لمساعدتك في التشخيص الزراعي الفوري أو استشارة المساعد الذكي."
              : "Select a tool below for instant crop diagnosis or AI-powered agricultural consultation."}
          </p>
        </div>
      </div>

      {/* Cards Grid: PlantDoctor & AI Assistant Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plant Doctor Card */}
        <div
          onClick={() => navigate("/plant-doctor")}
          className="bg-white p-8 rounded-3xl border border-gray-200/70 shadow-xs hover:shadow-md hover:border-[#1B3B2B]/40 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 text-2xl mb-5 group-hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 448 512">
  <path d="M0 0h448v512H0z" fill="none" />
  <path fill="#1d4533" d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48" />
</svg>
            </div>
            <h3 className="text-xl font-extrabold text-[#1B3B2B] mb-2">
              {lang === "ar" ? "طبيب النبات (Plant Doctor)" : "Plant Doctor"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {lang === "ar"
                ? "قم برفع صورة للنبتة أو المحصول المصاب للحصول على تحليل فوري بالأمراض وطرق العلاج المقترحة بدقة عالية."
                : "Upload a photo of your crop or plant to get instant disease detection and expert treatment recommendations."}
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#1B3B2B] group-hover:translate-x-1 transition-transform">
            <span>{lang === "ar" ? "بدء التشخيص الآن" : "Start diagnosis"}</span>
            <span>→</span>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div
          onClick={() => navigate("/ai-assistant")}
          className="bg-white p-8 rounded-3xl border border-gray-200/70 shadow-xs hover:shadow-md hover:border-[#1B3B2B]/40 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800 text-2xl mb-5 group-hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32">
  <path d="M0 0h32v32H0z" fill="none" />
  <g fill="#1d4533">
    <path d="M13.472 26h5.056C19.34 26 20 25.326 20 24.5s-.66-1.5-1.472-1.5h-5.056C12.66 23 12 23.674 12 24.5s.66 1.5 1.472 1.5M10.5 10a4.5 4.5 0 1 0 0 9h11a4.5 4.5 0 1 0 0-9zm.75 2c.69 0 1.25.56 1.25 1.25v2.5a1.25 1.25 0 1 1-2.5 0v-2.5c0-.69.56-1.25 1.25-1.25m8.25 1.25a1.25 1.25 0 1 1 2.5 0v2.5a1.25 1.25 0 1 1-2.5 0z" />
    <path d="M4 4.915a1.5 1.5 0 1 0-1 0v7.355a2 2 0 0 0-1 1.728v7.004c0 .736.403 1.382 1 1.729v1.319A6.945 6.945 0 0 0 9.95 31h12.1A6.943 6.943 0 0 0 29 24.06v-1.39c.597-.347 1-.994 1-1.73v-7.01c0-.736-.403-1.383-1-1.73V5.018a1.55 1.55 0 1 0-1 0v3.396A7.02 7.02 0 0 0 21.98 5h-1.065q.084-.236.085-.5A1.5 1.5 0 0 0 19.5 3h-7a1.5 1.5 0 0 0-1.415 2H10.03C7.47 5 5.23 6.369 4 8.414zm1 7.115A5.03 5.03 0 0 1 10.03 7h11.95A5.03 5.03 0 0 1 27 12.03v12.03A4.943 4.943 0 0 1 22.05 29H9.95A4.945 4.945 0 0 1 5 24.05z" />
  </g>
</svg>
            </div>
            <h3 className="text-xl font-extrabold text-[#1B3B2B] mb-2">
              {lang === "ar" ? "المساعد الذكي (AI Assistant)" : "AI Assistant"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {lang === "ar"
                ? "استشر المساعد الذكي في أي استفسارات زراعية، مواعيد الري، التسميد، أو الإدارة العامة للحقول والمحاصيل."
                : "Chat with your AI agricultural expert for guidance on irrigation schedules, fertilizers, and crop management."}
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#1B3B2B] group-hover:translate-x-1 transition-transform">
            <span>{lang === "ar" ? "بدء المحادثة" : "Start chat"}</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}