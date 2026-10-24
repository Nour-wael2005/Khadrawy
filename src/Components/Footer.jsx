import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";
import logoImage from "../assets/logo.png";
import kd from "../assets/kd.png";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest text-white pt-16 pb-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* العمود الأول: الهوية ونبذة عن المنصة */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1 overflow-hidden shadow-sm group-hover:scale-105 transition">
                <img
                  src={logoImage}
                  alt="Khadrawy Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <img
                src={kd}
                alt="Khadrawy Logo"
                className="h-7 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-sm text-gray-200 leading-relaxed">
              {t.ftr_brand_desc ||
                "ذكاء زراعي دقيق للمزارعين الذين يطعمون العالم، يجمع بين الفحص بالذكاء الاصطناعي وإنترنت الأشياء."}
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h4 className="text-base font-bold text-[#F9D2BA] mb-4 uppercase tracking-wider">
              {t.ftr_quick_links || "روابط سريعة"}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-200">
              <li>
                <a href="#home" className="hover:text-[#F9D2BA] transition font-medium">
                  {t.ftr_home || "الرئيسية"}
                </a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-[#F9D2BA] transition font-medium">
                  {t.nav_doctor || "الفحص الذكي (Plant Doctor)"}
                </a>
              </li>
              <li>
                <a href="#monitoring" className="hover:text-[#F9D2BA] transition font-medium">
                  {t.nav_monitor || "المراقبة الذكية"}
                </a>
              </li>
              <li>
                <a href="#assistant" className="hover:text-[#F9D2BA] transition font-medium">
                  {t.nav_assist || "المساعد الذكي (AI Assistant)"}
                </a>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: المصادر والدعم */}
          <div>
            <h4 className="text-base font-bold text-[#F9D2BA] mb-4 uppercase tracking-wider">
              {t.ftr_resources || "المصادر والدعم"}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-200">
              <li>
                <a href="#about" className="hover:text-[#F9D2BA] transition font-medium">
                  {t.nav_about || "من نحن"}
                </a>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  {t.ftr_docs || "دليل الاستخدام (Documentation)"}
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  {t.ftr_privacy || "سياسة الخصوصية"}
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  {t.ftr_terms || "شروط الخدمة"}
                </span>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: النشرة البريدية */}
          <div>
            <h4 className="text-base font-bold text-[#F9D2BA] mb-4 uppercase tracking-wider">
              {t.ftr_newsletter || "النشرة البريدية"}
            </h4>
            <p className="text-sm text-gray-200 mb-3">
              {t.ftr_news_desc || "نصائح موسمية ورؤى زراعية دقيقة تصلك مباشرة."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("تم الاشتراك بنجاح في نشرة خضراوي البريدية!");
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9D2BA] text-sm"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#F9D2BA] text-forest font-bold rounded-xl hover:bg-[#F9D2BA]/90 transition text-sm shadow-sm"
              >
                {t.ftr_news_btn || "اشتراك"}
              </button>
            </form>
          </div>
        </div>

        {/* الجزء السفلي: حقوق النشر */}
        <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <p>
            {t.ftr_copyright || "© 2026 خضراوي — Khadrawy. جميع الحقوق محفوظة."}
          </p>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">
              {t.ftr_privacy || "سياسة الخصوصية"}
            </span>
            <span className="hover:underline cursor-pointer">
              {t.ftr_terms || "شروط الاستخدام"}
            </span>
            <span className="hover:underline cursor-pointer">
              {t.ftr_cookies || "ملفات الارتباط"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}