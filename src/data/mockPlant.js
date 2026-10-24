// src/data/mockPlants.js

export const initialMockPlants = [
  {
    id: 1,
    name: "طماطم البلكونة",
    category: "خضروات",
    soil_ph: "6.5",
    watering_schedule: "ري يومياً الساعة 8:00 صباحاً",
    image: "https://images.unsplash.com/photo-1592841200222-a6ca18f0f669?w=500&q=80",
    createdAt: "2026-10-01",
    // 🟢 سجل الفحص والتقارير الخاص بـ Plant Doctor لهذه النبتة
    reports: [
      {
        id: "rep-101",
        date: "2026-10-05 10:30 AM",
        image: "https://images.unsplash.com/photo-1592841200222-a6ca18f0f669?w=500&q=80",
        condition: "Tomato___healthy",
        health_status: "سليمة",
        ai_response: "النبتة تبدو صحية للغاية، لا توجد أي علامات لإصابة حشرية أو فطرية. استمر في جدول الري المتبع ووفّر لها ضوء الشمس المباشر.",
        actions: [
          "الاستمرار في المراقبة الدورية",
          "الحفاظ على انتظام الري دون إفراط",
          "التأكد من جودة تصريف التربة"
        ]
      },
      {
        id: "rep-102",
        date: "2026-10-15 04:15 PM",
        image: "https://images.unsplash.com/photo-1592841200222-a6ca18f0f669?w=500&q=80",
        condition: "Tomato___Early_blight",
        health_status: "تحتاج عناية (بقع مبكرة)",
        ai_response: "تم كشف بقع بنية صغيرة على الأوراق السفلى، وهي علامة مبكرة لمرض الندوة المبكرة (Early Blight). يُنصح بإزالة الأوراق المصابة فوراً لتجنب انتشار الفطر.",
        actions: [
          "تليم وإزالة الأوراق المصابة القريبة من التربة",
          "تجنب رش المياه مباشر على الأوراق أثناء الري",
          "رش رشات وقائية خفيفة من مادة نحاسية إذا لزم الأمر"
        ]
      }
    ]
  },
  {
    id: 2,
    name: "ريحان المطبخ",
    category: "عشبيات",
    soil_ph: "7.0",
    watering_schedule: "ري كل يومين الساعة 10:00 صباحاً",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&q=80",
    createdAt: "2026-10-08",
    reports: [
      {
        id: "rep-201",
        date: "2026-10-10 09:00 AM",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&q=80",
        condition: "Basil___healthy",
        health_status: "سليمة",
        ai_response: "أوراق الريحان نضرة وخضراء، درجة رطوبة التربة ممتازة.",
        actions: ["تقليم القمم النامية لزيادة كثافة الأوراق"]
      }
    ]
  },
  {
    id: 3,
    name: "نعناع الحديقة",
    category: "عشبيات",
    soil_ph: "6.8",
    watering_schedule: "ري يومياً مساءً",
    image: "https://images.unsplash.com/photo-1628556270448-4d627604694e?w=500&q=80",
    createdAt: "2026-10-12",
    reports: []
  }
];