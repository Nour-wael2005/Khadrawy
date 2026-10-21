import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";

export default function PublicHome() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const handleStart = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className="marketing bg-[#fcfbf9] min-h-screen font-sans text-gray-900"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <main>
        {/* 🔹 1. Hero Section */}
        <section className="hero relative px-6 md:px-12 pt-12 pb-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Copy */}
          <div className="hero-copy lg:col-span-6 space-y-6 z-10">
            <div className="eyebrow flex items-center gap-2 text-xs font-semibold tracking-wider text-[#7c533e] uppercase">
              <span className="w-8 h-[2px] bg-[#7c533e]"></span>
              {t.hero_eyebrow || "AI-powered agriculture, made practical"}
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[#1b3b2b] tracking-tight leading-[1.1]">
              {t.hero_title_1 || "Grow Smarter."}
              <br />
              <span className="italic font-normal text-[#7c533e]">
                {t.hero_title_2 || "Protect Every Plant."}
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
              {t.hero_desc ||
                "Khadrawy helps farmers identify plant problems, act on clear recommendations, and manage crop care with confidence."}
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions flex flex-wrap items-center gap-4 pt-2">
              <button
                className="bg-[#1b3b2b] hover:bg-[#132a1e] text-white px-7 py-3.5 rounded-xl font-medium text-base flex items-center gap-2 transition-all shadow-md cursor-pointer"
                onClick={handleRegister}
              >
                <span>{t.btn_start_free || "Start for free"}</span>
                <span className="rtl:rotate-180"></span>
              </button>
              <button
                className="bg-white hover:bg-gray-50 text-[#1b3b2b] border border-gray-300 px-7 py-3.5 rounded-xl font-medium text-base transition-all shadow-sm cursor-pointer"
                onClick={handleStart}
              >
                {t.btn_explore || "Explore smart farming"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-row grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="space-y-0.5">
                <b className="block text-sm font-bold text-[#1b3b2b]">
                  {t.badge_1_title || "AI guidance"}
                </b>
                <small className="text-gray-500 text-xs">
                  {t.badge_1_sub || "Clear next steps"}
                </small>
              </div>
              <div className="space-y-0.5">
                <b className="block text-sm font-bold text-[#1b3b2b]">
                  {t.badge_2_title || "Plant care"}
                </b>
                <small className="text-gray-500 text-xs">
                  {t.badge_2_sub || "Built around you"}
                </small>
              </div>
              <div className="space-y-0.5">
                <b className="block text-sm font-bold text-[#1b3b2b]">
                  {t.badge_3_title || "Smart farms"}
                </b>
                <small className="text-gray-500 text-xs">
                  {t.badge_3_sub || "Connected insights"}
                </small>
              </div>
            </div>
          </div>

          {/* Right Side: Greenhouse Image with Floating Cards */}
          <div className="hero-visual lg:col-span-6 relative">
            <div className="relative rounded-tl-[10px] rounded-tr-[60px] rounded-bl-[60px] rounded-br-[10px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&w=1200&q=85"
                alt="Greenhouse Tomato Plant Rows"
                className="w-full h-[460px] object-cover"
              />

              {/* Top Floating Card (Soil Moisture) */}
              <div className="absolute top-6 ltr:right-6 rtl:left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      fill="#1b3b2b"
                      d="M19 5c-1.11 0-2 .89-2 2v6.76c-.64.57-1 1.39-1 2.24c0 1.66 1.34 3 3 3s3-1.34 3-3c0-.85-.36-1.67-1-2.23V7c0-1.11-.89-2-2-2m0 1c.55 0 1 .45 1 1v1h-2V7c0-.55.45-1 1-1M8 20c-3.31 0-6-2.69-6-6C2 10 8 3.25 8 3.25S14 10 14 14c0 3.31-2.69 6-6 6"
                    />
                  </svg>
                </span>
                <div>
                  <small className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {t.soil_moisture || "SOIL MOISTURE"}
                  </small>
                  <b className="text-xs font-bold text-[#1b3b2b]">
                    {t.soil_status || "Within threshold"}
                  </b>
                </div>
              </div>

              {/* Bottom Floating Card (Plant Health Check) */}
              <div className="absolute bottom-6 ltr:left-6 rtl:right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 48 48"
                  >
                    <path d="M0 0h48v48H0z" fill="none" />
                    <path
                      fill="#1b3b2b"
                      fillRule="evenodd"
                      d="M21.671 6.8a5.54 5.54 0 0 1 5.737 0l2.037 1.246c2.858 1.747 6.113 2.136 9.383 2.528c1.057.127 2.115.253 3.162.426c0 0 .023 1.834-.001 2.666l-.209 7.151c-.18 6.133-2.907 11.948-7.585 16.174c-2.207 1.993-4.49 3.794-7.113 5.29a5.55 5.55 0 0 1-5.1.187c-3.029-1.44-5.711-3.266-8.16-5.477c-4.678-4.226-7.405-10.041-7.584-16.174l-.208-7.128c-.025-.844 0-2.689 0-2.689c.85-.1 1.716-.183 2.589-.266c3.853-.366 7.834-.744 11.1-2.74zM22 22v-7h4v7h7v4h-7v7h-4v-7h-7v-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  <small className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {t.health_check || "PLANT HEALTH CHECK"}
                  </small>
                  <b className="text-xs font-bold text-[#1b3b2b] block">
                    {t.health_status || "Leaves look healthy"}
                  </b>
                  <span className="text-[10px] text-gray-500">
                    {t.health_sub || "Guidance ready to review"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔹 2. Problem Section */}
        <section className="problem bg-[#1b3b2b] text-white py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="eyebrow light flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                <span className="w-8 h-[2px] bg-emerald-400"></span>
                {t.problem_eyebrow || "From observation to action"}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {t.problem_title_1 || "Less uncertainty."}
                <br />
                <span className="text-emerald-200/90 font-normal">
                  {t.problem_title_2 || "Better agricultural decisions."}
                </span>
              </h2>
            </div>

            <div className="lg:col-span-6">
              <p className="text-emerald-100/80 text-base md:text-lg leading-relaxed">
                {t.problem_desc ||
                  "Plant symptoms can be difficult to identify, and incorrect treatment wastes time and resources. Khadrawy brings diagnosis, practical guidance, crop history, and connected monitoring into one calm workspace."}
              </p>
            </div>
          </div>
        </section>

        {/* 🔹 3. Features Section */}
        <section className="py-24 px-6 md:px-12 bg-[#fcfbf9] font-sans">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/60 pb-10">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-semibold tracking-widest text-[#7c533e] uppercase">
                  {t.features_eyebrow || "ONE CONNECTED ECOSYSTEM"}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1b3b2b] tracking-tight leading-tight">
                  {t.features_main_title || "Built for every way you grow"}
                </h2>
              </div>
              <div>
                <p className="text-gray-600 text-base md:text-lg max-w-sm leading-relaxed">
                  {t.features_subtitle ||
                    "Simple enough for daily plant care, powerful enough for complex farm operations."}
                </p>
              </div>
            </div>

            {/* Grid 6 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 (Highlighted) */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-[#f5ece4] border-[#e8d8cc] shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                    >
                      <path d="M0 0h48v48H0z" fill="none" />
                      <path
                        fill="#1b3b2b"
                        fillRule="evenodd"
                        d="M21.671 6.8a5.54 5.54 0 0 1 5.737 0l2.037 1.246c2.858 1.747 6.113 2.136 9.383 2.528c1.057.127 2.115.253 3.162.426c0 0 .023 1.834-.001 2.666l-.209 7.151c-.18 6.133-2.907 11.948-7.585 16.174c-2.207 1.993-4.49 3.794-7.113 5.29a5.55 5.55 0 0 1-5.1.187c-3.029-1.44-5.711-3.266-8.16-5.477c-4.678-4.226-7.405-10.041-7.584-16.174l-.208-7.128c-.025-.844 0-2.689 0-2.689c.85-.1 1.716-.183 2.589-.266c3.853-.366 7.834-.744 11.1-2.74zM22 22v-7h4v7h7v4h-7v7h-4v-7h-7v-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_1_title || "AI Plant Doctor"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_1_desc ||
                      "Upload a photo and receive clear, responsible guidance for your plant."}
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-white border-gray-100 hover:shadow-md hover:border-gray-200">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        fill="#1b3b2b"
                        fillRule="evenodd"
                        d="M8.5 18.896V16H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-6l-3.073 3.073a.25.25 0 0 1-.427-.177M8 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M8.5 9a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_2_title || "Agricultural Assistant"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_2_desc ||
                      "Ask practical questions and continue conversations with diagnosis context."}
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-white border-gray-100 hover:shadow-md hover:border-gray-200">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 22a8 8 0 0 1-8-8c0-3.502 2.71-6.303 5.093-8.87L12 2l2.907 3.13C17.29 7.698 20 10.499 20 14a8 8 0 0 1-8 8"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_3_title || "Personalized Care"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_3_desc ||
                      "Build flexible watering and care schedules for every plant."}
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-white border-gray-100 hover:shadow-md hover:border-gray-200">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        fill="#1b3b2b"
                        d="M3.5 20.5v-1.288l1-1V20.5zm4 0v-5.288l1-1V20.5zm4 0v-6.288l1 1.025V20.5zm4 0v-5.263l1-1V20.5zm4 0v-9.288l1-1V20.5zm-16-5.886V13.21l6.5-6.5l4 4l6.5-6.5v1.403l-6.5 6.5l-4-4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_4_title || "Smart Monitoring"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_4_desc ||
                      "Understand farm conditions with connected, decision-ready insights."}
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-white border-gray-100 hover:shadow-md hover:border-gray-200">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                    >
                      <path d="M0 0h48v48H0z" fill="none" />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M23.657 19.59a1.453 1.453 0 1 1-2.906 0a1.453 1.453 0 0 1 2.906 0m-5.81 0a1.453 1.453 0 1 1-2.906 0a1.453 1.453 0 0 1 2.906 0m14.169-2.323s-1.726 11.196 5.146 11.372V17.267m5.145 0s1.726 11.196-5.145 11.372V17.267m-4.064 24.878s1.453-9.442-7.262-9.442c-2.318 1.546-4.304 2.614-6.537 2.61h.091c-2.232.004-4.218-1.064-6.536-2.61c-8.716 0-7.263 9.442-7.263 9.442"
                      />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.131 18.137a12.9 12.9 0 0 0-.123 4.133l-.343-.38s-3.38-4.976 1.854-10.089h13.228c5.234 5.113 1.855 10.089 1.855 10.089l-4.111-9.17s-1.074 2.765-4.106 2.538c0 0 .773-3.457-.206-3.457c0 0-3.765 4.516-8.042 6.337"
                      />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.297 18.137a13 13 0 0 0-.233 2.442c0 5.685 3.687 10.294 8.235 10.294c4.336 0 7.889-4.188 8.211-9.505M12.808 32.704l4.215 6.454l2.322-3.846m6.536-2.608l-4.215 6.454l-2.321-3.846"
                      />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.003 32.889v9.246l12.672-.01v-9.251M12.919 11.801V5.844l6.38 1.03l6.38-1.03v5.957M9.27 33.395v8.74m19.967-8.74v8.76M12.919 9.256h12.76M7.347 11.801H31m4.235 16.839h3.98v3.082h-3.98zm1.99 3.082v10.423m-11.55-.02l7.423.02m-27.508 0l7.413-.01m3.467-16.877c1.64 1.472 4.026 1.608 5.658 0"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_5_title || "Farm Operations"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_5_desc ||
                      "Coordinate lands, teams, irrigation and device health in one place."}
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-8 border bg-white border-gray-100 hover:shadow-md hover:border-gray-200">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-gray-200/50 flex items-center justify-center text-xl shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                    >
                      <path d="M0 0h48v48H0z" fill="none" />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 13.5h22v13h-22zm24 0h4v21h-4zm-22 15v6m3.6-6v6m3.6-6v6m3.6-6v6m3.6-6v6m3.6-6v6"
                      />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M38.5 13.5h5V35c0 1.385-1.115 2.5-2.5 2.5H7A2.495 2.495 0 0 1 4.5 35V10.5h34V35c0 1.385 1.115 2.5 2.5 2.5v-24"
                      />
                      <path
                        fill="none"
                        stroke="#1b3b2b"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m20.833 22.167l-4.5-4.5L7.5 26.5m22 0L23 20l-6.5 6.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1b3b2b]">
                    {t.feat_6_title || "History & Reports"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {t.feat_6_desc ||
                      "Preserve monthly records across four-month agricultural seasons."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔹 4. How Khadrawy Works Section */}
        <section className="py-24 px-6 md:px-12 bg-white font-sans border-t border-gray-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Title */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-semibold tracking-widest text-[#7c533e] uppercase block">
                  {t.how_eyebrow || "HOW KHADRAWY WORKS"}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1b3b2b] tracking-tight leading-tight">
                  {t.how_title_1 || "Start simple."}
                  <br />
                  <span className="text-[#7c533e] font-normal italic">
                    {t.how_title_2 || "Grow connected."}
                  </span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {t.how_desc ||
                    "Take a quick tour of Khadrawy. See how easily landowners, engineers, and farmers manage plant care and diagnostics in real time."}
                </p>
              </div>

              {/* Right Cards (01 & 02) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                {/* Step 01 */}
                <div className="p-8 rounded-3xl bg-[#fcfbf9] border border-gray-100 space-y-6 hover:shadow-md hover:border-gray-200/60">
                  <span className="text-2xl font-bold text-[#7c533e] block">
                    01
                  </span>
                  <h3 className="text-lg font-bold text-[#1b3b2b]">
                    {t.step_1_title || "For Gardner"}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.step_1_desc ||
                      "Create your plants, set a care schedule, diagnose issues, and keep a complete health timeline."}
                  </p>
                  <div className="text-xs font-bold text-[#1b3b2b] pt-2 border-t border-gray-200/60">
                    {t.step_1_flow || "Register → Add plant → Care → Diagnose"}
                  </div>
                </div>

                {/* Step 02 */}
                <div className="p-8 rounded-3xl bg-[#1b3b2b] text-white space-y-6 hover:shadow-md hover:border-gray-200 ">
                  <span className="text-2xl font-bold text-amber-400 block">
                    02
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {t.step_2_title ||
                      "For connected farms and Agricultural Engineer"}
                  </h3>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                    {t.step_2_desc ||
                      "Configure lands and teams, connect readings, manage irrigation, and preserve seasonal reports."}
                  </p>
                  <div className="text-xs font-bold text-emerald-300 pt-2 border-t border-emerald-800">
                    {t.step_2_flow || "Set up → Monitor → Decide → Report"}
                  </div>
                </div>
              </div>
            </div>

            {/* 🎥 Video Demo Player Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#1b3b2b] max-w-5xl mx-auto">
              <iframe
                className="w-full aspect-video rounded-2xl"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
                title="Khadrawy Platform Demo Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}