import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import logoImage from "../../assets/logo.png";
import kd from "../../assets/kd.png";

export default function Register() {
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // شروط قوة كلمة المرور
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const calculateStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasCapital) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = calculateStrength();

  const getStrengthMeta = () => {
    if (strengthScore <= 1)
      return { label: t.weak || "ضعيف", color: "bg-red-500", width: "w-1/4" };
    if (strengthScore === 2 || strengthScore === 3)
      return { label: t.medium || "متوسط", color: "bg-yellow-500", width: "w-3/4" };
    return { label: t.strong || "قوي جداً", color: "bg-forest", width: "w-full" };
  };

  const strengthMeta = getStrengthMeta();

  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = t.nameError || "الاسم الكامل مطلوب";
    if (!email) {
      newErrors.email = t.emailError || "البريد الإلكتروني مطلوب";
    } else if (!email.includes("@")) {
      newErrors.email = t.invalidEmail || "بريد إلكتروني غير صحيح";
    }

    if (!password) {
      newErrors.password = t.passwordError || "كلمة المرور مطلوبة";
    } else if (strengthScore < 4) {
      newErrors.password = t.passwordRuleError || "يرجى استيفاء شروط كلمة المرور";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: "gardener",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "حدث خطأ أثناء التسجيل");
      }

      setIsLoading(false);

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_role", data.role || "gardener");
        localStorage.setItem("user_name", data.name || name);
      } else {
        localStorage.setItem("user_role", "gardener");
        localStorage.setItem("user_name", name);
      }

      navigate("/gardener-dashboard");
    } catch (err) {
      setIsLoading(false);
      alert(err.message || "فشل الاتصال بالخادم");
    }
  };

  return (
    /* نفس الخلفية المتدرجة النعناعية الهادئة الخاصة بالصورة */
    <div className="min-h-screen bg-gradient-to-br from-[#EBF4EE] via-[#E2EFE7] to-[#D8ECE0] flex flex-col justify-center items-center px-4 py-10 relative">
      {/* زر تبديل اللغة الأنيق */}
      <button
        type="button"
        onClick={toggleLang}
        className="absolute top-6 left-6 bg-white border border-forest/20 text-forest px-4 py-2 rounded-xl shadow-xs hover:bg-forest/5 transition font-bold"
      >
        {t.langSwitch || "English"}
      </button>

      {/* الكارت الأبيض الناصع مع الظل الناعم والزوايا المنحنية */}
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-forest/10 w-full max-w-md border border-forest/5 relative z-10"
      >
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
            {t.createAccount || "إنشاء حساب جديد"}
          </h2>
          <p className="text-xs text-earthy mt-1 font-medium">
            {t.loginSubtitle || "مرحباً بك في منصة خضراوي الذكية"}
          </p>
        </div>

        {/* حقل الاسم الكامل */}
        <div className="mb-4">
          <label className="block text-forest font-semibold text-sm mb-2">
            {t.nameLabel || "الاسم الكامل"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
              errors.name
                ? "border-red-500 focus:ring-red-200"
                : "border-forest/20 focus:ring-forest/20 focus:border-forest"
            }`}
            placeholder={t.namePlaceholder || "أدخل اسمك الكامل"}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        {/* حقل البريد الإلكتروني */}
        <div className="mb-4">
          <label className="block text-forest font-semibold text-sm mb-2">
            {t.emailLabel || "البريد الإلكتروني"}
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-forest/20 focus:ring-forest/20 focus:border-forest"
            }`}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
          )}
        </div>

        {/* حقل كلمة المرور */}
        <div className="mb-4">
          <label className="block text-forest font-semibold text-sm mb-2">
            {t.passwordLabel || "كلمة المرور"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-forest/20 focus:ring-forest/20 focus:border-forest"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        {/* شريط قوة كلمة المرور */}
        {password.length > 0 && (
          <div className="mb-4 bg-[#F5F9F6] p-3.5 rounded-xl border border-forest/10">
            <div className="flex justify-between items-center mb-1 text-xs font-bold">
              <span className="text-forest">{t.passwordStrength || "مستوى الأمان:"}</span>
              <span className={strengthMeta.color.replace("bg-", "text-")}>
                {strengthMeta.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`}
              ></div>
            </div>
            <ul className="mt-2 text-xs space-y-1">
              <li className={hasMinLength ? "text-forest font-bold" : "text-gray-400"}>
                {hasMinLength ? "✓" : "○"} {t.reqLength || "8 حروف فأكثر"}
              </li>
              <li className={hasNumber ? "text-forest font-bold" : "text-gray-400"}>
                {hasNumber ? "✓" : "○"} {t.reqNumber || "رقم واحد على الأقل"}
              </li>
              <li className={hasCapital ? "text-forest font-bold" : "text-gray-400"}>
                {hasCapital ? "✓" : "○"} {t.reqCapital || "حرف كبير (Capital)"}
              </li>
              <li className={hasSpecial ? "text-forest font-bold" : "text-gray-400"}>
                {hasSpecial ? "✓" : "○"} {t.reqSpecial || "رمز خاص (@#$)"}
              </li>
            </ul>
          </div>
        )}

        {/* زر التسجيل */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-forest text-white font-bold text-sm rounded-xl hover:bg-forest/90 transition shadow-lg shadow-forest/20 flex justify-center items-center gap-2 mt-4"
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            <span>{t.registerBtn || "إنشاء حساب"}</span>
          )}
        </button>

        {/* رابط الانتقال لصفحة تسجيل الدخول */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-xs text-forest hover:underline font-semibold"
          >
            {t.haveAccount || "لديك حساب بالفعل؟ سجل الدخول"}
          </Link>
        </div>
      </form>
    </div>
  );
}