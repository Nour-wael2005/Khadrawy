import React, { useState, useEffect } from "react";
import { useLanguage } from "../Context/LanguageContext";

export default function PlantDoctor() {
  const { lang } = useLanguage();
  const token = localStorage.getItem("access_token");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // نباتات وأراضي اليوزر الحقيقية
  const [userPlants, setUserPlants] = useState([]);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [savingStatus, setSavingStatus] = useState("idle"); // idle | saving | success | error
  const [fetchingPlants, setFetchingPlants] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. جلب نباتات اليوزر الحالي ديناميكياً
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setFetchingPlants(true);
        const response = await fetch("http://localhost:8000/api/plants/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserPlants(data);
        }
      } catch (err) {
        console.error("Error fetching user plants:", err);
      } finally {
        setFetchingPlants(false);
      }
    };

    if (token) {
      fetchUserPlants();
    }
  }, [token]);

  // 2. اختيار الصورة وإعادة تعيين الحالة لتشخيص جديد
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionResult(null);
      setSavingStatus("idle");
      setSelectedTargetId("");
      window.speechSynthesis?.cancel(); // إيقاف أي نطق سابق
      setIsSpeaking(false);
    }
  };

  // 3. تحليل الـ AI (محاكاة أو ربط حقيقي)
  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setSavingStatus("idle");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    setTimeout(() => {
      const mockResult = {
        plant: lang === "ar" ? "طماطم (Tomato)" : "Tomato",
        condition: "Tomato___Early_blight",
        health_status: lang === "ar" ? "تحتاج عناية (ندوة مبكرة)" : "Needs Care (Early Blight)",
        recommendation: {
          message: lang === "ar"
            ? "تم اكتشاف إصابة بمرض الندوة المبكرة. يُنصح بإزالة الأوراق السفلى المصابة وتنظيم الري."
            : "Early blight infection detected. Recommended to remove lower infected leaves.",
          actions: [
            lang === "ar" ? "إزالة الأوراق المصابة" : "Remove infected leaves",
            lang === "ar" ? "تجنب البلل المباشر للأوراق" : "Avoid direct foliage wetting"
          ]
        }
      };

      setPredictionResult(mockResult);
      setLoading(false);
    }, 1500);
  };

  // 🔊 وظيفة نطق الإجابة بصوت الـ AI (Text-to-Speech)
  const handleSpeakResponse = () => {
    if (!predictionResult || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${predictionResult.plant}. ${predictionResult.health_status}. ${predictionResult.recommendation.message}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === "ar" ? "ar-EG" : "en-US";
    utterance.rate = 0.95; // سرعة الكلام تكون مريحة للاستماع

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // 4. حفظ التقرير في السجل مع وقت التوثيق تلقائياً
  const handleSaveToPlantHistory = async () => {
    if (!selectedTargetId || savingStatus === "success") return;

    try {
      setSavingStatus("saving");
      const currentTime = new Date().toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

      const response = await fetch(`http://localhost:8000/api/plants/${selectedTargetId}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          image_url: previewUrl,
          condition: predictionResult.condition,
          health_status: predictionResult.health_status,
          ai_response: predictionResult.recommendation.message,
          actions: predictionResult.recommendation.actions,
          date: currentTime // إرسال التاريخ والوقت مع التقرير
        })
      });

      if (response.ok) {
        setSavingStatus("success");
      } else {
        setSavingStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSavingStatus("error");
    }
  };

  return (
    <div
      className="p-6 md:p-8 space-y-6 bg-[#FAF6F0] min-h-screen text-[#133828]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* 🟢 HEADER */}
      <div className="border-b border-emerald-900/10 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#133828]">
          {lang === "ar" ? "طبيب النبات الذكي (AI Plant Doctor)" : "AI Plant Doctor"}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {lang === "ar"
            ? "ارفع صورة ورقة النبات لتشخيص حالتها، الاستماع للرد الصوتي، وربط التقرير بسجلك."
            : "Upload leaf photo to diagnose, listen to audio response, and link to your timeline."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🟢 1. رفع الصورة */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#133828]">
            {lang === "ar" ? "1. رفع صورة الورقة" : "1. Upload Leaf Photo"}
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-[#FAF6F0]/50 relative hover:border-emerald-700 transition">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto h-48 rounded-xl object-cover shadow-xs"
                />
              ) : (
                <div className="space-y-2 py-8">
                  <span className="text-4xl">🍃</span>
                  <p className="text-xs text-gray-500 font-medium">
                    {lang === "ar" ? "اضغط هنا لاختيار صورة ورقة النبات" : "Click here to choose photo"}
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full bg-[#133828] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#1a4734] transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loading
                ? (lang === "ar" ? "⏳ جاري الفحص والتحليل..." : "⏳ Analyzing...")
                : (lang === "ar" ? "بدء التشخيص الذكي" : "Start Diagnosis")}
            </button>
          </form>
        </div>

        {/* 🟢 2. النتيجة، زر النطق الصوتي، والقائمة المنسدلة */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#133828]">
                {lang === "ar" ? "2. نتيجة التشخيص والاستماع الصوتي" : "2. Diagnosis & Audio Response"}
              </h2>

              {/* 🎙️ زرار المايكروفون / الصوت لقراءة الإجابة */}
              {predictionResult && (
                <button
                  type="button"
                  onClick={handleSpeakResponse}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isSpeaking
                      ? "bg-amber-600 text-white animate-pulse"
                      : "bg-[#133828] text-white hover:bg-[#1a4734]"
                  }`}
                  title={lang === "ar" ? "قراءة الإجابة صوتياً" : "Read response aloud"}
                >
                  <span className="text-sm">🎙️</span>
                  <span>
                    {isSpeaking
                      ? (lang === "ar" ? "إيقاف القراءة..." : "Stop Reading...")
                      : (lang === "ar" ? "استمع للإجابة" : "Listen")}
                  </span>
                </button>
              )}
            </div>

            {!predictionResult ? (
              <div className="py-20 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                {lang === "ar" ? "قم بررفع صورة وتشخيصها لتظهر النتيجة وقائمة نباتاتك هنا." : "Upload and analyze to see results."}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* كارت نتيجة الفحص */}
                <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-emerald-900/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[#133828] text-sm">
                      🌱 {predictionResult.plant}
                    </span>
                    <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                      {predictionResult.health_status}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed pt-1">
                    {predictionResult.recommendation.message}
                  </p>
                </div>

                {/* Drop-down List ديناميكية تعرض نباتات اليوزر المسجل فقط */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-[#133828] block">
                    {lang === "ar" ? "اختر النبتة أو الأرض لحفظ التقرير في سجلها:" : "Select plant or land to save report:"}
                  </label>
                  {fetchingPlants ? (
                    <p className="text-gray-400 text-[11px]">
                      {lang === "ar" ? "جاري تحميل قائمة نباتاتك..." : "Loading your plants..."}
                    </p>
                  ) : userPlants.length === 0 ? (
                    <p className="text-amber-600 text-[11px]">
                      {lang === "ar" ? "لا توجد نباتات مسجلة في حسابك حالياً. أضف نبتة أولاً!" : "No plants found in your account."}
                    </p>
                  ) : (
                    <select
                      value={selectedTargetId}
                      onChange={(e) => setSelectedTargetId(e.target.value)}
                      disabled={savingStatus === "success"}
                      className="w-full p-3 rounded-xl border border-emerald-900/15 bg-[#FAF6F0] text-xs font-semibold text-[#133828] focus:outline-none disabled:opacity-50"
                    >
                      <option value="">
                        {lang === "ar" ? "-- اختر نبتة من حسابك --" : "-- Choose from your plants --"}
                      </option>
                      {userPlants.map((plant) => (
                        <option key={plant.id || plant._id} value={plant.id || plant._id}>
                          {plant.name} ({plant.category || (lang === "ar" ? "نبتة" : "Plant")})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* زر حفظ التقرير (يُعطل بعد الحفظ مرة واحدة لعدم التكرار) */}
                <button
                  onClick={handleSaveToPlantHistory}
                  disabled={savingStatus === "saving" || savingStatus === "success" || !selectedTargetId}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    savingStatus === "success"
                      ? "bg-emerald-800 text-white opacity-90 cursor-not-allowed"
                      : "bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40"
                  }`}
                >
                  {savingStatus === "saving"
                    ? (lang === "ar" ? "جاري الحفظ في سجل النبتة والتاريخ..." : "Saving to timeline...")
                    : savingStatus === "success"
                    ? (lang === "ar" ? "✅ تم حفظ التقرير في السجل والتاريخ بنجاح" : "✅ Report Saved Successfully")
                    : (lang === "ar" ? "حفظ التقرير في الخط الزمني للنبتة" : "Save report to plant timeline")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}