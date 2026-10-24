import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import logoImage from "../../assets/logo.png";
import kd from "../../assets/kd.png";

export default function ForgotPassword() {
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: إدخال البريد أو الهاتف, 2: OTP وتغيير الباسورد
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // حالات إظهار/إخفاء كلمة المرور
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // شروط قوة كلمة المرور
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasCapital = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

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
      return {
        label: t.weak || "ضعيف",
        color: "bg-rose-500",
        textColor: "text-rose-600",
        width: "w-1/4",
      };
    if (strengthScore === 2 || strengthScore === 3)
      return {
        label: t.medium || "متوسط",
        color: "bg-amber-500",
        textColor: "text-amber-600",
        width: "w-3/4",
      };
    return {
      label: t.strong || "قوي جداً",
      color: "bg-forest",
      textColor: "text-forest",
      width: "w-full",
    };
  };

  const strengthMeta = getStrengthMeta();

  // الخطوة الأولى: التحقق وإرسال الكود
  const handleSendCode = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier =
        t.identifierError || "يرجى إدخال البريد الإلكتروني أو رقم الهاتف";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  // الخطوة الثانية: ربط الباك إند الحقيقي لتحديث كلمة المرور في الداتا بيز
  const handleResetPassword = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (otp.join("").length < 4) {
      newErrors.otp = t.otpError || "يرجى كتابة رمز التحقق المكون من 4 أرقام";
    }

    if (!newPassword) {
      newErrors.newPassword = t.passwordError || "كلمة المرور مطلوبة";
    } else if (strengthScore < 4) {
      newErrors.newPassword =
        t.passwordRuleError || "يرجى استيفاء كافة شروط الأمان";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        t.confirmPasswordMismatch || "كلمتا المرور غير متطابقتين";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "فشل تحديث كلمة المرور");
      }

      setIsLoading(false);
      alert(t.passwordResetSuccess || "تم تغيير كلمة المرور بنجاح في قاعدة البيانات!");
      navigate("/login");
    } catch (err) {
      setIsLoading(false);
      alert(err.message || "حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
// خلفية الصفحة الرئيسية
<div className="min-h-screen bg-gradient-to-br from-[#F4F9F5] via-[#E8F3EB] to-[#DCECE0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">      <button
        type="button"
        onClick={toggleLang}
        className="absolute top-6 left-6 bg-white border border-forest/20 text-forest px-4 py-2 rounded-xl shadow-xs hover:bg-[cream] transition text-sm font-semibold flex items-center gap-2"
      >
        <span></span>
        <span>{lang === "ar" ? "English" : "العربية"}</span>
      </button>

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-forest/10">
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
            {t.forgotPasswordTitle || "استعادة كلمة المرور"}
          </h2>
          <p className="text-xs text-[earthy] mt-1 font-medium">
            {step === 1 ? (
              t.forgotPasswordSub1 ||
              "أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز التحقق"
            ) : (
              <span className="text-green-700 font-semibold">
                {t.codeSentTo || "تم إرسال رمز التحقق إلى: "}
                <span className="underline">{identifier}</span>
              </span>
            )}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode} noValidate className="space-y-5">
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
                placeholder="user@example.com / 01012345678"
              />
              {errors.identifier && (
                <p className="text-rose-500 text-xs mt-1.5 font-medium">
                  {errors.identifier}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-forest text-white font-bold text-sm rounded-xl hover:bg-forest/90 transition shadow-lg shadow-forest/20 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <span>{t.sendResetCode || "إرسال رمز التحقق"}</span>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate className="space-y-5">
            <div>
              <label className="block text-forest font-semibold text-sm mb-2 text-center">
                {t.enterOtpLabel || "أدخل رمز التحقق المكون من 4 أرقام"}
              </label>
              <div className="flex justify-center gap-3 dir-ltr" dir="ltr">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-12 text-center text-lg font-bold text-forest border border-forest/20 rounded-xl bg-[cream]/20 focus:bg-white focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-rose-500 text-xs mt-1.5 text-center font-medium">
                  {errors.otp}
                </p>
              )}
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label className="block text-forest font-semibold text-sm mb-2">
                {t.newPasswordLabel || "كلمة المرور الجديدة"}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 ps-4 pe-12 rounded-xl border text-sm text-forest bg-[cream]/10 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.newPassword
                      ? "border-rose-500 focus:ring-rose-200"
                      : "border-forest/20 focus:ring-forest/20 focus:border-forest"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-forest/60 hover:text-forest transition focus:outline-none"
                >
                  {/* تم تعديل العيون لتكون منطقية: المفتوحة تظهر النص والمشطوبة تخفيه */}
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-rose-500 text-xs mt-1.5 font-medium">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {newPassword.length > 0 && (
              <div className="bg-[cream]/40 p-3.5 rounded-2xl border border-forest/10 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-forest">
                    {t.passwordStrength || "مستوى الأمان:"}
                  </span>
                  <span className={strengthMeta.textColor}>
                    {strengthMeta.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`}
                  ></div>
                </div>
              </div>
            )}

            {/* تأكيد كلمة المرور الجديدة */}
            <div>
              <label className="block text-forest font-semibold text-sm mb-2">
                {t.confirmPasswordLabel || "تأكيد كلمة المرور الجديدة"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 ps-4 pe-12 rounded-xl border text-sm text-forest bg-[cream]/10 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.confirmPassword
                      ? "border-rose-500 focus:ring-rose-200"
                      : "border-forest/20 focus:ring-forest/20 focus:border-forest"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-forest/60 hover:text-forest transition focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-xs mt-1.5 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-forest text-white font-bold text-sm rounded-xl hover:bg-forest/90 transition shadow-lg shadow-forest/20 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <span>{t.saveNewPassword || "حفظ كلمة المرور الجديدة"}</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-xs">
          <Link
            to="/login"
            className="font-bold text-forest hover:text-[earthy] transition underline flex items-center justify-center gap-1"
          >
            <span>←</span>
            <span>{t.backToLogin || "العودة لصفحة تسجيل الدخول"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}