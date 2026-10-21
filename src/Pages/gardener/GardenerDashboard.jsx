import React, { useState, useEffect } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { Link } from "react-router-dom";

export default function GardenerDashboard() {
  const { t, lang } = useLanguage();
  
  // 1. جلب بيانات المستخدم الحالي من الـ localStorage
  const userName = localStorage.getItem("user_name" || "Gardener");
  const token = localStorage.getItem("access_token");

  // 2. حالات ديناميكية لجلب بيانات النباتات والسجل الصحي من الـ Backend
  const [gardenerPlants, setGardenerPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. جلب بيانات النباتات الحقيقية الخاصة باليوزر من الـ API
  useEffect(() => {
    const fetchGardenerData = async () => {
      try {
        setLoading(true);
        // استبدلي الـ URL ده بالـ Endpoint الحقيقي اللي التيم معاكي عمله لجلب نباتات المستخدم
        const response = await fetch("http://localhost:8000/api/plants/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // ربط الطلب بتوكن اليوزر المسجل
          }
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات النباتات من السيرفر");
        }

        const data = await response.json();
        // نفترض إن الراجع عبارة عن لستة النباتات الخاصة باليوزر ده في الداتا بيز
        setGardenerPlants(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGardenerData();
  }, [token]);

  return (
    <div
      className="p-6 md:p-8 space-y-6 bg-[#FAF6F0] min-h-screen text-[#133828]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* 🟢 HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* زر إضافة نبتة اللي بيروح لفروم التيم */}
        <Link
          to="/my-plants"
          className="bg-[#133828] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-[#1a4734] transition cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          <span>{lang === "ar" ? "إضافة نبتة" : "Add plant"}</span>
        </Link>
      </div>

      {/* 🟢 1. HERO BANNER: عناية اليوم الديناميكية */}
      <div className="bg-[#133828] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
            {lang === "ar" ? "عناية اليوم" : "TODAY'S CARE"}
          </span>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            {gardenerPlants.length > 0 
              ? `${gardenerPlants[0].name} ${lang === "ar" ? "جاهز للري بناءً على إعداداتك" : "is ready for watering based on your settings"}`
              : (lang === "ar" ? "لا توجد نباتات مضافة بعد، أضف نبتتك الأولى!" : "No plants added yet, add your first plant!")}
          </h2>
          <p className="text-xs text-emerald-100/85">
            {lang === "ar"
              ? "متابعة دقيقة لدرجة حموضة التربة وحالة الهواء ومواعيد الري المسجلة في سجلك."
              : "Precise tracking of soil pH, air condition, and watering schedules saved in your profile."}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button className="bg-[#f5f0eb] text-[#133828] font-bold px-4 py-2 rounded-xl text-xs hover:bg-white transition cursor-pointer shadow-xs">
              {lang === "ar" ? "تحديد كـ مكتمل" : "Mark completed"}
            </button>
            <button className="border border-white/30 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-white/10 transition cursor-pointer">
              {lang === "ar" ? "تأجيل" : "Snooze"}
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 2. ACTION CARDS: كروت الإجراءات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/my-plants"
          className="bg-white border border-emerald-900/10 rounded-2xl p-4 flex items-center gap-3.5 hover:shadow-md transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#133828] flex items-center justify-center font-bold text-lg group-hover:bg-[#133828] group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none" />
  <path fill="#4ea880" fill-rule="evenodd" d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75" clip-rule="evenodd" />
</svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#133828]">
              {lang === "ar" ? "إضافة نبتة" : "Add a plant"}
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {lang === "ar" ? "سجل حموضة التربة والري" : "Log soil pH & watering"}
            </p>
          </div>
        </Link>

        <Link
          to="/plant-doctor"
          className="bg-white border border-emerald-900/10 rounded-2xl p-4 flex items-center gap-3.5 hover:shadow-md transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#133828] flex items-center justify-center text-base group-hover:bg-[#133828] group-hover:text-white transition">
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48">
  <path d="M0 0h48v48H0z" fill="none" />
  <g fill="#4ea880">
    <path d="m24.433 28.279l-1.867-.707c.5-1.32 1.35-2.752 2.69-4.241l1.487 1.338c-1.183 1.315-1.901 2.53-2.31 3.61" />
    <path fill-rule="evenodd" d="M15.563 7C10.035 7 6 12.64 6 18.724C6 32.304 24 41 24 41s18-9.256 18-22.276C42 12.642 37.965 7 32.438 7C28.602 7 25.755 9.531 24 13.121C22.243 9.531 19.398 7 15.563 7M17 24.959c0 2.807 3.142 3.703 5.441 2.957c-1.098 3.251-.078 5.784.83 6.764l1.467-1.36c-.364-.392-1.2-2.014-.509-4.422c1.207 2.237 6.771 2.519 6.771-1.7V16c-2.882 2.439-5.961 3.403-8.495 4.197C19.323 21.193 17 21.92 17 24.959" clip-rule="evenodd" />
  </g>
</svg>          </div>
          <div>
            <h4 className="text-xs font-bold text-[#133828]">
              {lang === "ar" ? "فحص صحة النبات" : "Check plant health"}
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {lang === "ar" ? "ارفع صورة للتشخيص" : "Upload photo for diagnosis"}
            </p>
          </div>
        </Link>

        <Link
          to="/ai-assistant"
          className="bg-white border border-emerald-900/10 rounded-2xl p-4 flex items-center gap-3.5 hover:shadow-md transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#133828] flex items-center justify-center text-base group-hover:bg-[#133828] group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none" />
  <g fill="none" stroke="#4ea880" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
    <path d="M1.996 8.737q0-.976.033-1.895c.071-1.998.107-2.998.928-3.817c.82-.819 1.857-.863 3.932-.95A86 86 0 0 1 10.496 2c1.257 0 2.47.026 3.607.074c2.075.088 3.112.132 3.932.951c.821.82.857 1.819.928 3.817a54 54 0 0 1 0 3.79c-.071 1.998-.107 2.997-.928 3.816c-.82.82-1.857.864-3.932.951q-.937.04-1.933.06c-.63.01-.945.017-1.222.121c-.277.105-.51.303-.975.698L8.12 17.852a.62.62 0 0 1-.403.148a.62.62 0 0 1-.62-.615v-1.977l-.208-.009c-2.075-.087-3.112-.131-3.932-.95c-.82-.82-.857-1.819-.928-3.818a53 53 0 0 1-.033-1.894" />
    <path d="M13.044 19.58c.277.105.51.303.975.698l1.853 1.574a.62.62 0 0 0 .404.148c.342 0 .62-.275.62-.615v-1.977l.207-.009c2.075-.088 3.112-.132 3.932-.95c.821-.82.857-1.819.928-3.818a54 54 0 0 0 0-3.789c-.026-.736-.048-1.336-.105-1.842" />
  </g>
</svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#133828]">
              {lang === "ar" ? "اسأل خضراوي AI" : "Ask Khadrawy AI"}
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {lang === "ar" ? "استفسر عن جدولك الزراعي" : "Inquire about your schedule"}
            </p>
          </div>
        </Link>
      </div>

      {/* 🟢 3. MAIN SECTION: عرض نباتات اليوزر الحقيقية من الداتا بيز */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* قائمة النباتات الديناميكية */}
        {/* قائمة النباتات (أحدث 3 نباتات فقط) */}
<div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col justify-between">
  <div>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-sm font-bold text-[#133828]">
          {t.myPlantsOverview}
        </h3>
        <span className="text-[11px] text-gray-400 block mt-0.5">
          {gardenerPlants.length}{" "}
          {lang === "ar" ? "نباتات مسجلة في حسابك" : "plants registered in your account"}
        </span>
      </div>

      {/* زرار View all ينقل المستخدم لصفحة نباتاتي الكاملة */}
      <Link
        to="/my-plants"
        className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
      >
        {t.viewAll}
      </Link>
    </div>

    {/* حالة التحميل أو عدم وجود بيانات */}
    {loading ? (
      <div className="py-12 text-center text-xs text-gray-400">
        {lang === "ar" ? "جاري تحميل نباتاتك..." : "Loading your plants..."}
      </div>
    ) : gardenerPlants.length === 0 ? (
      <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
        {lang === "ar" ? "لم تقم بإضافة أي نباتات بعد." : "You haven't added any plants yet."}
      </div>
    ) : (
      /* عرض أحدث 3 نباتات فقط باستخدام slice(0, 3) */
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {gardenerPlants
          .slice(-3) // ياخد أحدث 3 عناصر تم إضافتها
          .reverse() // يعرض الأحدث أولاً من اليمين للشمال
          .map((plant) => (
            <div
              key={plant.id || plant._id}
              className="bg-[#FAF6F0]/50 border border-emerald-900/10 rounded-2xl overflow-hidden p-3 flex flex-col justify-between hover:shadow-xs transition"
            >
              <div>
                <img
                  src={
                    plant.image ||
                    "https://images.unsplash.com/photo-1592841200222-a6ca18f0f669?w=400&q=80"
                  }
                  alt={plant.name}
                  className="w-full h-32 object-cover rounded-xl mb-2.5"
                />
                <span className="text-[10px] text-gray-400 block font-medium">
                  {plant.category || (lang === "ar" ? "نبات منزلي" : "Home plant")}
                </span>
                <h4 className="text-xs font-bold text-[#133828] mt-0.5">
                  {plant.name}
                </h4>

                {/* عرض درجة حموضة التربة لو راجعة من الباك إند */}
                {plant.soil_ph && (
                  <p className="text-[10px] text-emerald-800 mt-1 font-medium">
                    {lang === "ar" ? `حموضة التربة: ${plant.soil_ph}` : `Soil pH: ${plant.soil_ph}`}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                <span>💧</span>
                <span>
                  {plant.watering_schedule ||
                    (lang === "ar" ? "مجدول بانتظام" : "Regularly scheduled")}
                </span>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
</div>

        {/* كارت ملخص الصحة والتشخيصات */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col justify-between text-center">
          <div>
            <div className="text-start mb-4">
              <h3 className="text-sm font-bold text-[#133828]">
                {lang === "ar" ? "السجل الصحي الأخير" : "Recent health"}
              </h3>
              <span className="text-[10px] text-gray-400">
                {lang === "ar" ? "نشاط التشخيص" : "Diagnosis activity"}
              </span>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-[#133828] flex flex-col items-center justify-center mx-auto my-6 shadow-inner">
              <span className="z-10 text-2xl font-black text-[#133828]">{gardenerPlants.length}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                {t.healthyCount}
              </span>
            </div>

            <p className="text-xs text-gray-500 px-2 leading-relaxed">
              {t.healthReportText}
            </p>
          </div>

          <Link
            to="/diagnosis-history"
            className="w-full mt-6 bg-white border border-[#133828] text-[#133828] hover:bg-[#133828] hover:text-white transition py-2.5 rounded-xl text-xs font-bold block text-center shadow-xs"
          >
            {t.viewHealthHistory}
          </Link>
        </div>

      </div>
    </div>
  );
}