import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import logoImage from "../../assets/logo.png";
import kd from "../../assets/kd.png";

export default function Login() {
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // يقبل الإيميل أو التليفون
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // شروط كلمة المرور
  // const hasMinLength = password.length >= 8;
  // const hasNumber = /\d/.test(password);
  // const hasCapital = /[A-Z]/.test(password);
  // const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // // حساب درجة قوة كلمة المرور (من 0 إلى 4)
  // const calculateStrength = () => {
  //   let score = 0;
  //   if (hasMinLength) score++;
  //   if (hasNumber) score++;
  //   if (hasCapital) score++;
  //   if (hasSpecial) score++;
  //   return score;
  // };

  // const strengthScore = calculateStrength();

  // // تحديد ألوان ومستوى القوة بحسب الهوية
  // const getStrengthMeta = () => {
  //   if (strengthScore <= 1)
  //     return {
  //       label: t.weak || "ضعيف",
  //       color: "bg-rose-500",
  //       textColor: "text-rose-600",
  //       width: "w-1/4",
  //     };
  //   if (strengthScore === 2 || strengthScore === 3)
  //     return {
  //       label: t.medium || "متوسط",
  //       color: "bg-amber-500",
  //       textColor: "text-amber-600",
  //       width: "w-3/4",
  //     };
  //   return {
  //     label: t.strong || "قوي جداً",
  //     color: "bg-forest",
  //     textColor: "text-forest",
  //     width: "w-full",
  //   };
  // };

  // const strengthMeta = getStrengthMeta();

  // التحقق الذكي من الإيميل أو رقم الهاتف
  const validateForm = () => {
    let newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier =
        t.identifierError || "يرجى إدخال البريد الإلكتروني أو رقم الهاتف";
    } else {
      const isEmail = identifier.includes("@");
      const phoneRegex = /^[0-9+\s-]{10,15}$/;

      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
          newErrors.identifier = t.invalidEmail || "البريد الإلكتروني غير صحيح";
        }
      } else {
        if (!phoneRegex.test(identifier.replace(/\s+/g, ""))) {
          newErrors.identifier =
            t.invalidPhone || "رقم الهاتف غير صحيح (أدخل أرقاماً فقط)";
        }
      }
    }

    if (!password) {
      newErrors.password = t.passwordError || "كلمة المرور مطلوبة";
    } else if (strengthScore < 4) {
      newErrors.password =
        t.passwordRuleError || "يرجى استيفاء جميع شروط كلمة المرور";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // شلنا الشرط المعقد لقوة الباسورد في اللوجين عشان ميعطلش المستخدم لو الباسورد قديم
    let newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "يرجى إدخال البريد الإلكتروني";
    }
    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier, // بنبعت الإيميل المدخل للباك إند
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        );
      }

      // حفظ التوكن والبيانات في الـ LocalStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_name", data.name);

      setIsLoading(false);

      // التوجيه للوحة التحكم حسب الرول القادم من الداتا بيز
      if (data.role === "engineer" || data.role === "agricultural engineer") {
        navigate("/engineer-dashboard");
      } else if (data.role === "gardener") {
        navigate("/gardener-dashboard");
      } else if (data.role === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/landowner-dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("خطأ في الاتصال أو السيرفر:", err.message); // طبع الخطأ بالكامل في الكونسول
      alert(
        err.message ||
          "حدث خطأ في الاتصال بالسيرفر. تأكد أن الـ Backend شغّال!",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9F5] via-[#E8F3EB] to-[#DCECE0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* زر تبديل اللغة الأنيق في زاوية الشاشة */}
      <button
        type="button"
        onClick={toggleLang}
        className="absolute top-6 left-6 bg-white border border-forest/20 text-forest px-4 py-2 rounded-xl shadow-xs hover:bg-[cream] transition text-sm font-semibold flex items-center gap-2"
      >
        <span></span>
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

          {/* شروط وقوة كلمة المرور (تظهر فور بدء الكتابة) */}
          {/* {password.length > 0 && (
            <div className="bg-[cream]/40 p-4 rounded-2xl border border-forest/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-forest">
                  {t.passwordStrength || "مستوى الأمان:"}
                </span>
                <span className={strengthMeta.textColor}>
                  {strengthMeta.label}
                </span>
              </div> */}

          {/* شروط التقدم */}
          {/* <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`}
                ></div>
              </div> */}

          {/* القواعد المطلوبة */}
          {/* <ul className="grid grid-cols-2 gap-2 text-xs pt-1">
                <li
                  className={
                    hasMinLength ? "text-forest font-bold" : "text-gray-400"
                  }
                >
                  {hasMinLength ? "✓" : "○"} {t.reqLength || "8 حروف فأكثر"}
                </li>
                <li
                  className={
                    hasNumber ? "text-forest font-bold" : "text-gray-400"
                  }
                >
                  {hasNumber ? "✓" : "○"} {t.reqNumber || "رقم واحد على الأقل"}
                </li>
                <li
                  className={
                    hasCapital ? "text-forest font-bold" : "text-gray-400"
                  } */}
          {/* >
                  {hasCapital ? "✓" : "○"}{" "}
                  {t.reqCapital || "حرف كبير (Capital)"}
                </li>
                <li
                  className={
                    hasSpecial ? "text-forest font-bold" : "text-gray-400"
                  }
                >
                  {hasSpecial ? "✓" : "○"} {t.reqSpecial || "رمز خاص (@#$)"}
                </li>
              </ul>
            </div>
          )} */}

          {/* زر تسجيل الدخول الرئيسي */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-forest text-white font-bold text-sm rounded-xl hover:bg-forest/90 transition shadow-lg shadow-forest/20 flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <span>{t.loginBtn || "تسجيل الدخول"}</span>
            )}
          </button>
        </form>

        {/* التوجيه لصفحة التسجيل الجديد */}
        {/* <div className="mt-8 text-center text-xs text-gray-600">
          <span>{t.noAccount || "ليس لديك حساب؟"} </span>
          <Link
            to="/register"
            className="font-bold text-forest hover:text-[earthy] transition underline"
          >
            {t.createAccount || "إنشاء حساب جديد"}
          </Link>
        </div> */}
      </div>
    </div>
  );
}
