// المسار: src/Pages/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import logoImage from "../../assets/logo.png";
import kd from "../../assets/kd.png";

export default function Login() {
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "يرجى إدخال البريد الإلكتروني أو رقم الهاتف";
    }
    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const cleanId = identifier.trim();

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: cleanId, // بيقبل الإيميل أو رقم الهاتف المسجل في الـ seed
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          errorMsg = data.detail[0]?.msg || "تأكد من صحة البيانات المدخلة";
        }
        throw new Error(errorMsg);
      }

      // حفظ التوكن وبيانات المستخدم بكافة المفاتيح المستخدمة في المشروع
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("khadrwy_token", data.access_token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("khadrwy_role", data.role);
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("khadrwy_name", data.name);
      localStorage.setItem("khadrwy_email", data.email);

      setIsLoading(false);

      // التوجيه للداشبورد المناسبة حسب الدور (Role) الوارد من الداتابيز
      if (
        data.role === "engineer" ||
        data.role === "agricultural_engineer" ||
        data.role === "agricultural engineer"
      ) {
        navigate("/engineer-dashboard");
      } else if (data.role === "gardener") {
        navigate("/gardener-dashboard");
      } else if (data.role === "farmer") {
        navigate("/farmer-dashboard"); // <--- التوجيه المباشر لداشبورد الفارمر
      } else {
        navigate("/landowner-dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("خطأ في الاتصال أو السيرفر:", err);
      alert(
        err.message ||
          "حدث خطأ في الاتصال بالسيرفر. تأكد أن الـ Backend شغّال!"
      );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9F5] via-[#E8F3EB] to-[#DCECE0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* زر تبديل اللغة الأنيق في زاوية الشاشة */}
      <button
        type="button"
        onClick={toggleLang}
        className="absolute top-6 left-6 bg-white border border-forest/20 text-forest px-4 py-2 rounded-xl shadow-xs hover:bg-[cream] transition text-sm font-semibold flex items-center gap-2 cursor-pointer"
      >
        <span>{lang === "ar" ? "English" : "العربية"}</span>
      </button>

      {/* كارت نموذج تسجيل الدخول */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-forest/10">
        {/* الشعار براند خضراوي */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className="flex items-center gap-2 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center p-1.5 overflow-hidden shadow-md group-hover:scale-105 transition">
              <img
                src={logoImage}
                alt="Khadrawy Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={kd}
              alt="Khadrawy Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h2 className="text-2xl font-bold text-forest">
            {t.loginTitle || "تسجيل الدخول"}
          </h2>
          <p className="text-xs text-[earthy] mt-1 font-medium">
            {t.loginSubtitle || "مرحباً بك مجدداً في منصة خضراوي الذكية"}
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          {/* حقل البريد الإلكتروني أو رقم الهاتف */}
          <div>
            <label className="block text-forest font-semibold text-sm mb-2">
              {t.identifierLabel || "البريد الإلكتروني أو رقم الهاتف"}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-forest bg-[cream]/10 focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.identifier
                  ? "border-rose-500 focus:ring-rose-200"
                  : "border-forest/20 focus:ring-forest/20 focus:border-forest"
              }`}
              placeholder={
                t.identifierPlaceholder ||
                "e.g. user@example.com or 01012345678"
              }
            />
            {errors.identifier && (
              <p className="text-rose-500 text-xs mt-1.5 font-medium">
                {errors.identifier}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-forest font-semibold text-sm">
                {t.passwordLabel || "كلمة المرور"}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[earthy] hover:underline"
              >
                {t.forgotPassword || "نسيت كلمة المرور؟"}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-forest bg-[cream]/10 focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-rose-500 focus:ring-rose-200"
                  : "border-forest/20 focus:ring-forest/20 focus:border-forest"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1.5 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* زر تسجيل الدخول الرئيسي */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-forest text-white font-bold text-sm rounded-xl hover:bg-forest/90 transition shadow-lg shadow-forest/20 flex justify-center items-center gap-2 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <span>{t.loginBtn || "تسجيل الدخول"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}