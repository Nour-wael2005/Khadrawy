import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

export default function PlantDetails() {
  const { plantId } = useParams();
  const { lang } = useLanguage();
  const token = localStorage.getItem("access_token");

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/plants/${plantId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب تفاصيل النبتة من السيرفر");
        }

        const data = await response.json();
        setPlant(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && plantId) {
      fetchPlantDetails();
    }
  }, [plantId, token]);

  if (loading) {
    return (
      <div className="p-8 text-center min-h-screen bg-[#FAF6F0] flex items-center justify-center text-xs text-gray-500">
        {lang === "ar" ? "جاري تحميل تفاصيل النبتة والتقارير..." : "Loading details..."}
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="p-8 text-center min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center">
        <h2 className="text-sm font-bold text-[#133828] mb-2">
          {lang === "ar" ? "تعذر جلب تفاصيل النبتة من السيرفر" : "Plant not found"}
        </h2>
        <Link to="/my-plants" className="text-xs text-emerald-700 underline font-semibold">
          {lang === "ar" ? "العودة إلى قائمة نباتاتي" : "Back to my plants"}
        </Link>
      </div>
    );
  }

  const reports = plant.reports || [];

  return (
    <div
      className="p-6 md:p-8 space-y-6 bg-[#FAF6F0] min-h-screen text-[#133828]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div>
        <Link
          to="/my-plants"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-[#133828] bg-white px-4 py-2 rounded-xl border border-emerald-900/10 shadow-2xs transition"
        >
          <span>←</span>
          <span>{lang === "ar" ? "العودة لنباتاتي" : "Back to My Plants"}</span>
        </Link>
      </div>

      <div className="bg-white border border-emerald-900/10 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-center">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-[#EEF5F0] flex flex-col items-center justify-center border border-emerald-900/10 text-4xl">
          <span>🌿</span>
          <span className="text-[10px] font-bold bg-[#133828] text-white px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wider">
            {plant.growth_stage || "Vegetative"}
          </span>
        </div>

        <div className="space-y-3 flex-1 text-start rtl:text-right w-full">
          <h1 className="text-xl md:text-2xl font-extrabold text-[#133828]">
            {plant.name}
          </h1>

          <div className="space-y-2 text-xs text-gray-600 bg-[#FAF6F0] p-4 rounded-2xl border border-emerald-900/5">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">
                {lang === "ar" ? "نوع المحصول:" : "Crop Type:"}
              </span>
              <span className="font-bold text-[#133828]">{plant.crop_type || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">
                {lang === "ar" ? "نوع التربة:" : "Soil Type:"}
              </span>
              <span className="font-bold text-[#133828]">{plant.soil_type || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">
                {lang === "ar" ? "جدول الري:" : "Watering:"}
              </span>
              <span className="font-bold text-[#133828]">{plant.watering_schedule || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-[#133828]">
            {lang === "ar" ? "سجل التشخيصات والتقارير (Plant Doctor History)" : "Diagnosis & Reports Timeline"}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {reports.length} {lang === "ar" ? "تقارير مسجلة" : "reports recorded"}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center text-xs text-gray-400">
            {lang === "ar"
              ? "لا توجد تقارير فحص مسجلة لهذه النبتة حتى الآن."
              : "No diagnosis reports recorded for this plant yet."}
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <div
                key={report.id || idx}
                className="bg-white border border-emerald-900/10 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start"
              >
                <img
                  src={report.image || report.image_url}
                  alt="Diagnosis"
                  className="w-full md:w-36 h-36 rounded-2xl object-cover border border-emerald-900/10"
                />

                <div className="space-y-3 flex-1 w-full text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg">
                      {report.health_status || report.condition}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      📅 {report.date || report.created_at}
                    </span>
                  </div>

                  {/* رد طبيب النبات */}
                  {report.ai_response && (
                    <p className="text-gray-700 leading-relaxed bg-[#FAF6F0] p-3.5 rounded-2xl border border-emerald-900/5">
                      <strong className="text-[#133828] block mb-1">
                        {lang === "ar" ? "رد طبيب النبات الذكي:" : "AI Plant Doctor Response:"}
                      </strong>
                      {report.ai_response}
                    </p>
                  )}

                  {/* الأعراض */}
                  {report.symptoms && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 space-y-1">
                      <h4 className="font-extrabold text-amber-900">
                        {lang === "ar" ? "🌿 الأعراض:" : "Symptoms:"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{report.symptoms}</p>
                    </div>
                  )}

                  {/* الإجراءات المقترحة */}
                  {report.actions && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 space-y-1">
                      <h4 className="font-extrabold text-emerald-900">
                        {lang === "ar" ? "🌿 الإجراءات المقترحة:" : "Recommended Actions:"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{report.actions}</p>
                    </div>
                  )}

                  {/* الوقاية */}
                  {report.prevention && (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3.5 space-y-1">
                      <h4 className="font-extrabold text-sky-900">
                        {lang === "ar" ? "🛡️ الوقاية:" : "Prevention:"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{report.prevention}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}