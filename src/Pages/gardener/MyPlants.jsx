import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

export default function MyPlants() {
  const { lang } = useLanguage();
  
  // 1. جلب بيانات المستخدم والتوكن
  const currentUserName = localStorage.getItem("user_name") || "Gardener";
  const token = localStorage.getItem("access_token");

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. طلب جلب النباتات الخاصة باليوزر من السيرفر مباشرة
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setLoading(true);
        setError(null);

        // طلب الـ API بالـ Token الحقيقي
        const response = await fetch("http://localhost:8000/api/plants/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            lang === "ar"
              ? "فشل في جلب قائمة النباتات من السيرفر"
              : "Failed to fetch plants from server"
          );
        }

        const data = await response.json();
        setPlants(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserPlants();
    } else {
      setLoading(false);
    }
  }, [token, lang]);

  return (
    <div
      className="p-6 md:p-8 space-y-6 bg-[#FAF6F0] min-h-screen text-[#133828]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* 🟢 HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-900/10 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#133828]">
            {lang === "ar" ? "مجموعة نباتاتي" : "My Plant Collection"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {lang === "ar"
              ? `إجمالي النباتات المسجلة: ${plants.length}`
              : `Total registered plants: ${plants.length}`}
          </p>
        </div>

        {/* زر إضافة نبتة جديدة */}
        <button
          onClick={() => alert(lang === "ar" ? "سيتم التوجيه لفروم Add Plant" : "Navigating to Add Plant Form")}
          className="bg-[#133828] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-[#1a4734] transition cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          <span>{lang === "ar" ? "إضافة نبتة جديدة" : "Add New Plant"}</span>
        </button>
      </div>

      {/* 🟢 STATES & PLANTS GRID SECTION */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400">
          {lang === "ar" ? "جاري جلب نباتاتك من السيرفر..." : "Fetching your plants from server..."}
        </div>
      ) : error ? (
        <div className="py-12 text-center text-xs text-red-500 bg-red-50 rounded-2xl border border-red-200">
          {error}
        </div>
      ) : plants.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-300 rounded-3xl bg-white">
          <p className="text-xs text-gray-500">
            {lang === "ar"
              ? "لم تقم بإضافة أي نباتات في حسابك حتى الآن."
              : "No plants registered under your account yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => {
            const reportsCount = plant.reports ? plant.reports.length : 0;

            return (
              <div
                key={plant.id || plant._id}
                className="bg-white border border-emerald-900/10 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* صورة النبتة */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={plant.image || "https://images.unsplash.com/photo-1592841200222-a6ca18f0f669?w=500&q=80"}
                      alt={plant.name}
                      className="w-full h-full object-cover transition transform hover:scale-105 duration-300"
                    />
                    <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#133828]/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                      {plant.category || (lang === "ar" ? "نبات منزلي" : "Home plant")}
                    </span>
                  </div>

                  {/* تفاصيل النبتة */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-[#133828]">
                      {plant.name}
                    </h3>

                    <div className="space-y-1.5 text-xs text-gray-600 bg-[#FAF6F0] p-3 rounded-2xl border border-emerald-900/5">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-400">
                          {lang === "ar" ? "درجة حموضة التربة (pH):" : "Soil pH:"}
                        </span>
                        <span className="font-bold text-[#133828]">{plant.soil_ph || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-400">
                          {lang === "ar" ? "جدول الري:" : "Watering:"}
                        </span>
                        <span className="font-bold text-[#133828]">{plant.watering_schedule || "-"}</span>
                      </div>
                    </div>

                    {/* عدد تقارير الـ Plant Doctor */}
                    <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold pt-1">
                      <span>🩺</span>
                      <span>
                        {lang === "ar"
                          ? `سجل التشخيصات: ${reportsCount} تقارير`
                          : `Diagnosis record: ${reportsCount} reports`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* زر عرض التقارير والتفاصيل */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/my-plants/${plant.id || plant._id}`}
                    className="w-full bg-[#133828] text-white hover:bg-[#1a4734] transition py-2.5 rounded-xl text-xs font-bold block text-center shadow-xs"
                  >
                    {lang === "ar" ? "عرض التفاصيل وسجل التقارير" : "View Details & Reports"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}