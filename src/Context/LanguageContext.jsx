import React, { createContext, useContext, useState } from "react";

const translations = {
  ar: {
    loginTitle: "تسجيل الدخول - خضراوي",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    loginBtn: "دخول النظام",
    emailError: "البريد الإلكتروني مطلوب",
    invalidEmail: "بريد إلكتروني غير صالح (يجب أن يحتوي على @)",
    passwordError: "كلمة المرور مطلوبة",
    langSwitch: "English",
    serverError: "خطأ في الاتصال بالسيرفر",
    passwordStrength: "قوة كلمة المرور:",
    weak: "ضعيفة جداً",
    medium: "متوسطة",
    strong: "قوية جداً",
    reqLength: "8 أحرف على الأقل",
    reqNumber: "تحتوي على رقم",
    reqCapital: "تحتوي على حرف كبير (Capital)",
    reqSpecial: "تحتوي على رمز خاص (@, $, !)",
    passwordRuleError:
      "كلمة المرور ضعيفة! يجب أن تحتوي على 8 أحرف على الأقل، ورقم، وحرف كبير، ورمز خاص.",
    registerTitle: "إنشاء حساب جديد - خضراوي",
    nameLabel: "الاسم الكامل",
    registerBtn: "تسجيل الحساب",
    roleLabel: "اختر نوع الحساب:",
    engineerRole: "مهندس زراعي 🌾",
    gardenerRole: "هاوي منزلي 🌱",
    landownerRole: "صاحب أرض 🚜",
    haveAccount: "لديك حساب بالفعل؟ سجل الدخول",
    nav_doctor: "الفحص الذكي",
    nav_assist: "المساعد الذكي",
    nav_monitor: "المراقبة الذكية",
    nav_pricing: "الأسعار",
    nav_about: "من نحن",
    btn_login: "تسجيل الدخول",
    btn_signup: "ابدأ الآن",
    btn_logout: "تسجيل الخروج",
    forgotPasswordTitle: "استعادة كلمة المرور",
    forgotPasswordSub1: "أدخل حسابك لإرسال رمز إعادة التعيين",
    forgotPasswordSub2: "أدخل الرمز المرسل وكلمة المرور الجديدة",
    sendResetCode: "إرسال رمز التحقق",
    enterOtpLabel: "رمز التحقق المكون من 4 أرقام",
    newPasswordLabel: "كلمة المرور الجديدة",
    confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
    saveNewPassword: "حفظ كلمة المرور الجديدة",
    backToLogin: "العودة لصفحة تسجيل الدخول",
    otpError: "يرجى كتابة رمز التحقق المكون من 4 أرقام كاملاً",
    confirmPasswordMismatch: "كلمتا المرور غير متطابقتين",
    passwordResetSuccess: "تم تغيير كلمة المرور بنجاح!",
aiAssistantTitle: "المساعد الذكي (AI Assistant)",
aiAssistantSub: "إدارة ومراجعة المساعد الذكي الخاص بك في مكان واحد.",
newChat: "محادثة جديدة",
recentChats: "المحادثات السابقة (خاصة بك)",
assistantName: "مرشد خضراوي الذكي",
assistantRole: "إرشاد زراعي عام ومخصص",
inputPlaceholder: "اكتب سؤالاً أو استفساراً إضافياً...",
attachFile: "إرفاق ملفات",
attachedDiagnosis: "تشخيص مرفق",
deleteConversation: "حذف المحادثة",
hideSidebar: "إخفاء القائمة",
showChats: "عرض المحادثات",
openCamera: "التقاط صورة بالكاميرا",
uploadFiles: "رفع صور أو ملفات (أكثر من واحد)",
defaultGreeting: "أهلاً بك! كيف يمكنني مساعدتك في استفساراتك الزراعية اليوم؟",
receiveConfirmation: "تم استلام رسالتك والمرفقات بنجاح. جاري تحليل الصور وتقديم الإرشادات المناسبة...",
identifierLabel: "البريد الإلكتروني أو رقم الهاتف",  
forgotPassword: "نسيت كلمة المرور؟",
hero_eyebrow: "الزراعة المدعومة بالذكاء الاصطناعي، بطريقة عملية",
    hero_title_1: "ازرع بذكاء.",
    hero_title_2: "احمِ كل نبتة.",
    hero_desc: "يساعد خضراوي المزارعين في تحديد مشاكل النباتات، واتخاذ إجراءات بناءً على توصيات واضحة، وإدارة رعاية المحاصيل بثقة.",
    btn_start_free: "ابدأ مجاناً ←",
    btn_explore: "استكشف الزراعة الذكية",
    
    // Trust Badges
    badge_1_title: "توجيه بالذكاء الاصطناعي",
    badge_1_sub: "خطوات قادمة واضحة",
    badge_2_title: "رعاية النباتات",
    badge_2_sub: "مصممة خصيصاً لك",
    badge_3_title: "مزارع ذكية",
    badge_3_sub: "رؤى مترابطة",

    // Floating Cards
    soil_moisture: "رطوبة التربة",
    soil_status: "ضمن المعدل الطبيعي",
    health_check: "فحص صحة النبات",
    health_status: "الأوراق تبدو صحية",
    health_sub: "الإرشادات جاهزة للمراجعة",

    // Problem Section
    problem_eyebrow: "من الملاحظة إلى التنفيذ",
    problem_title_1: "تخبط أقل.",
    problem_title_2: "قرارات زراعية أفضل.",
    problem_desc: "قد يكون من الصعب تحديد أعراض النبات، والعلاج الخاطئ يهدر الوقت والموارد. يجمع خضراوي بين التشخيص، الإرشادات العملية، تاريخ المحاصيل، والمراقبة المتصلة في مساحة عمل واحدة هادئة.",

    // Features Section
    features_eyebrow: "نظام بيئي متكامل",
    features_main_title: "مصمم لكل طريقة تزرع بها",
    features_subtitle: "بسيط بما يكفي للعناية اليومية بالنباتات، وقوي بما يكفي لعمليات المزارع المعقدة.",
    
    feat_1_title: "طبيب النباتات الذكي",
    feat_1_desc: "ارفع صورة واحصل على إرشادات واضحة ومسؤولة لنباتك.",
    
    feat_2_title: "المساعد الزراعي",
    feat_2_desc: "اطرح أسئلة عمليّة وتابع المحادثات مع سياق التشخيص.",
    
    feat_3_title: "رعاية مخصصة",
    feat_3_desc: "أنشئ جداول رعاية وسقي مرنة لكل نبتة.",
    
    feat_4_title: "المراقبة الذكية",
    feat_4_desc: "تفهم ظروف المزرعة من خلال رؤى متصلة وجاهزة لاتخاذ القرار.",
    
    feat_5_title: "عمليات المزرعة",
    feat_5_desc: "نسق الأراضي، الفرق، الري، وصحة الأجهزة في مكان واحد.",
    
    feat_6_title: "السجلات والتقارير",
    feat_6_desc: "احتفظ بالسجلات الشهرية عبر مواسم الزراعة التي تمتد لأربعة أشهر.",

    // How It Works Section
    how_eyebrow: "كيف يعمل خضراوي",
    how_title_1: "ابدأ ببساطة.",
    how_title_2: "انمُ بشكل متصل.",
    how_desc: "خذ جولة سريعة في خضراوي وشاهد مدى سهولة إدارة ملاك الأراضي والمهندسين والمزارعين لرعاية النباتات والتشخيص في الوقت الفعلي.",

    step_1_title: "للمزارع",
    step_1_desc: "أنشئ نباتاتك، وحدد جدول رعاية، وشخص المشكلات، واحتفظ بخط زمني كامل للصحة.",
    step_1_flow: "تسجيل ← إضافة نبتة ← رعاية ← تشخيص",

    step_2_title: "للمزارع المتصلة والمهندس الزراعي",
    step_2_desc: "قم بإعداد الأراضي والفرق، وربط القراءات، وإدارة الري، والاحتفاظ بالتقارير الموسمية.",
    step_2_flow: "إعداد ← مراقبة ← اتخاذ قرار ← تقرير",
    gardenerWelcome: "أهلاً بك،",
    gardenerSubtitle: "إليك متابعة سريعة لنباتاتك وحديقتك الشخصية اليوم.",
    myPlantsOverview: "نباتاتي الحالية",
    viewAll: "عرض الكل",
    plantsHealth: "صحة النباتات",
    healthyCount: "سليم",
    healthReportText: "لديك متابعة نباتية مستحقة هذا الأسبوع.",
    viewHealthHistory: "عرض النباتات للمتابعة",
    
},
  en: {
    loginTitle: "Login - Khadrwy",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    loginBtn: "Login to System",
    emailError: "Email is required",
    invalidEmail: "Invalid email address (must contain @)",
    passwordError: "Password is required",
    langSwitch: "عربي",
    serverError: "Connection error with server",
    passwordStrength: "Password Strength:",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    reqLength: "At least 8 characters",
    reqNumber: "Contains a number",
    reqCapital: "Contains a capital letter",
    reqSpecial: "Contains a special character",
    passwordRuleError:"Password is too weak! Must contain at least 8 characters, a number, a capital letter, and a special character.",
    registerTitle: "Create Account - Khadrwy",
    nameLabel: "Full Name",
    registerBtn: "Register Account",
    roleLabel: "Select Role:",
    engineerRole: "Agricultural Engineer 🌾",
    gardenerRole: "Home Gardener 🌱",
    landownerRole: "Landowner 🚜",
    haveAccount: "Already have an account? Login",
    nav_doctor: "Plant Doctor",
    nav_assist: "AI Assistant",
    nav_monitor: "Smart Monitoring",
    nav_pricing: "Pricing",
    nav_about: "About",
    btn_login: "Log in",
    btn_signup: "Get started",
    btn_logout: "Logout",
    forgotPasswordTitle: "Reset Password",
    forgotPasswordSub1: "Enter your account to receive a reset code",
    forgotPasswordSub2: "Enter the code sent and your new password",
    sendResetCode: "Send Verification Code",
    enterOtpLabel: "4-Digit Verification Code",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    saveNewPassword: "Save New Password",
    backToLogin: "Back to Login",
    otpError: "Please enter the complete 4-digit code",
    confirmPasswordMismatch: "Passwords do not match",
    passwordResetSuccess: "Password reset successfully!",
    aiAssistantTitle: "AI Assistant",
aiAssistantSub: "Manage and review your AI assistant in one place.",
newChat: "New conversation",
recentChats: "Recent conversations",
assistantName: "Khadrawy Assistant",
assistantRole: "General agricultural guidance",
inputPlaceholder: "Ask a follow-up question....",
attachFile: "Attach file",
attachedDiagnosis: "ATTACHED DIAGNOSIS",
// aiAssistantTitle: "AI Assistant",
// aiAssistantSub: "Manage and review your AI assistant in one place.",
// newChat: "New conversation",
// recentChats: "Recent conversations",
// assistantName: "Khadrawy Assistant",
// assistantRole: "General agricultural guidance",
// inputPlaceholder: "Ask a follow-up question....",
// attachFile: "Attach files",
// attachedDiagnosis: "ATTACHED DIAGNOSIS",
// deleteConversation: "Delete conversation",
hideSidebar: "Hide Sidebar",
showChats: "Show Chats",
openCamera: "Open Camera / Take Photo",
uploadFiles: "Upload Images / Files",
defaultGreeting: "Hello! How can I help you with your agricultural queries today?",
receiveConfirmation: "I've received your message and attachments. Processing analysis...",
identifierLabel: "Email or Phone Number", 
forgotPassword: "Forgot Password?", 
hero_eyebrow: "AI-powered agriculture, made practical",
    hero_title_1: "Grow Smarter.",
    hero_title_2: "Protect Every Plant.",
    hero_desc: "Khadrawy helps farmers identify plant problems, act on clear recommendations, and manage crop care with confidence.",
    btn_start_free: "Start for free →",
    btn_explore: "Explore smart farming",
    
    // Trust Badges
    badge_1_title: "AI guidance",
    badge_1_sub: "Clear next steps",
    badge_2_title: "Plant care",
    badge_2_sub: "Built around you",
    badge_3_title: "Smart farms",
    badge_3_sub: "Connected insights",

    // Floating Cards
    soil_moisture: "SOIL MOISTURE",
    soil_status: "Within threshold",
    health_check: "PLANT HEALTH CHECK",
    health_status: "Leaves look healthy",
    health_sub: "Guidance ready to review",

    // Problem Section
    problem_eyebrow: "From observation to action",
    problem_title_1: "Less uncertainty.",
    problem_title_2: "Better agricultural decisions.",
    problem_desc: "Plant symptoms can be difficult to identify, and incorrect treatment wastes time and resources. Khadrawy brings diagnosis, practical guidance, crop history, and connected monitoring into one calm workspace.",

    // Features Section
    features_eyebrow: "ONE CONNECTED ECOSYSTEM",
    features_main_title: "Built for every way you grow",
    features_subtitle: "Simple enough for daily plant care, powerful enough for complex farm operations.",
    
    feat_1_title: "AI Plant Doctor",
    feat_1_desc: "Upload a photo and receive clear, responsible guidance for your plant.",
    
    feat_2_title: "Agricultural Assistant",
    feat_2_desc: "Ask practical questions and continue conversations with diagnosis context.",
    
    feat_3_title: "Personalized Care",
    feat_3_desc: "Build flexible watering and care schedules for every plant.",
    
    feat_4_title: "Smart Monitoring",
    feat_4_desc: "Understand farm conditions with connected, decision-ready insights.",
    
    feat_5_title: "Farm Operations",
    feat_5_desc: "Coordinate lands, teams, irrigation and device health in one place.",
    
    feat_6_title: "History & Reports",
    feat_6_desc: "Preserve monthly records across four-month agricultural seasons.",

    // How It Works Section
    how_eyebrow: "HOW KHADRAWY WORKS",
    how_title_1: "Start simple.",
    how_title_2: "Grow connected.",
    how_desc: "Take a quick tour of Khadrawy. See how easily landowners, engineers, and farmers manage plant care and diagnostics in real time.",

    step_1_title: "For Gardner",
    step_1_desc: "Create your plants, set a care schedule, diagnose issues, and keep a complete health timeline.",
    step_1_flow: "Register → Add plant → Care → Diagnose",

    step_2_title: "For connected farms and Agricultural Engineer",
    step_2_desc: "Configure lands and teams, connect readings, manage irrigation, and preserve seasonal reports.",
    step_2_flow: "Set up → Monitor → Decide → Report",
    gardenerWelcome: "Welcome back,",
    gardenerSubtitle: "Here's a quick overview of your personal plants and garden today.",
    myPlantsOverview: "My Plants Overview",
    viewAll: "View all",
    plantsHealth: "Plants Health",
    healthyCount: "healthy",
    healthReportText: "One saved diagnosis has a follow-up due this week.",
    viewHealthHistory: "Show plants to follow up ",
},
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");

  const toggleLang = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const t = translations[lang] || translations.ar;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
