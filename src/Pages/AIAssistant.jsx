import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../Context/LanguageContext";
import logoImage from "../assets/logo.png";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AIAssistant() {
  const { t, lang } = useLanguage();

  const currentUser = localStorage.getItem("khadrwy_name") || "guest_user";
  const storageKey = `khadrwy_chat_history_${currentUser}`;

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Could not read saved chat history:", error);
      }
    }

    return [
      {
        id: 1,
        title:
          lang === "en"
            ? "Yellow leaves on tomatoes"
            : "أوراق صفراء على الطماطم",
        messages: [
          {
            id: 101,
            sender: "assistant",
            text:
              lang === "en"
                ? "Before deciding on treatment, verify three things:\n• Check whether the spots appear first on older, lower leaves.\n• Look for concentric rings within the brown areas."
                : "قبل اتخاذ قرار بشأن العلاج، تحقق من ثلاثة أمور:\n• تتبع ما إذا كانت البقع تظهر أولاً على الأوراق القديمة.\n• ابحث عن حلقات مركزية داخل المناطق البنية.",
            hasDiagnosisCard: true,
          },
        ],
      },
    ];
  });

  const [isSending, setIsSending] = useState(false);
  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (error) {
        console.error("Could not restore active chat:", error);
      }
    }
    return 1;
  });

  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, storageKey]);

  const currentChat =
    conversations.find((conversation) => conversation.id === activeChatId) ||
    conversations[0];

  const handleNewConversation = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: t.newChat || (lang === "en" ? "New conversation" : "محادثة جديدة"),
      messages: [
        {
          id: newId + 1,
          sender: "assistant",
          text:
            t.defaultGreeting ||
            (lang === "en"
              ? "Hello! How can I help you with your agricultural queries today?"
              : "أهلاً بك! كيف يمكنني مساعدتك في استفساراتك الزراعية اليوم؟"),
        },
      ],
    };

    setConversations((previous) => [newChat, ...previous]);
    setActiveChatId(newId);
    setShowMenu(false);
    setSelectedAttachments([]);
  };

  const handleDeleteCurrentChat = () => {
    const updated = conversations.filter(
      (conversation) => conversation.id !== activeChatId
    );

    if (updated.length === 0) {
      const fallbackId = Date.now();
      const fallbackChat = {
        id: fallbackId,
        title: t.newChat || (lang === "en" ? "New conversation" : "محادثة جديدة"),
        messages: [
          {
            id: fallbackId + 1,
            sender: "assistant",
            text: lang === "en" ? "Hello!" : "أهلاً بك!",
          },
        ],
      };

      setConversations([fallbackChat]);
      setActiveChatId(fallbackId);
    } else {
      setConversations(updated);
      setActiveChatId(updated[0].id);
    }

    setShowMenu(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0) {
      setShowAttachMenu(false);

      const newAttachments = files.map((file) => ({
        file,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
      }));

      setSelectedAttachments((previous) => [
        ...previous,
        ...newAttachments,
      ]);
    }

    event.target.value = null;
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setShowAttachMenu(false);

      const newAttachment = {
        file,
        url: URL.createObjectURL(file),
        type: "image",
        name: file.name,
      };

      setSelectedAttachments((previous) => [
        ...previous,
        newAttachment,
      ]);
    }

    event.target.value = null;
  };

  const removeAttachment = (indexToRemove) => {
    setSelectedAttachments((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const messageText = inputValue.trim();
    const chatId = activeChatId;
    const attachments = [...selectedAttachments];

    if ((!messageText && attachments.length === 0) || isSending) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      attachments,
    };

    const loadingId = Date.now() + 1;

    const isNewChat =
      !currentChat ||
      currentChat.title === t.newChat ||
      currentChat.title === "New conversation" ||
      currentChat.title === "محادثة جديدة";

    const updatedTitle = isNewChat
      ? messageText.length > 25
        ? `${messageText.substring(0, 25)}...`
        : messageText
      : currentChat.title;

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === chatId
          ? {
              ...conversation,
              title: updatedTitle,
              messages: [
                ...conversation.messages,
                newMessage,
                {
                  id: loadingId,
                  sender: "assistant",
                  text: lang === "en" ? "Thinking..." : "جاري التفكير...",
                  isLoading: true,
                },
              ],
            }
          : conversation
      )
    );

    setInputValue("");
    setSelectedAttachments([]);
    setIsSending(true);

    try {
      const formData = new FormData();

      formData.append(
        "message",
        messageText ||
          "حلل صورة النبات وحدد المرض المحتمل والأعراض الظاهرة وطرق التعامل المناسبة."
      );

      attachments.forEach((attachment) => {
        if (attachment.type === "image" && attachment.file) {
          formData.append("images", attachment.file);
        }
      });

      // جلب التوكن الحقيقي من الـ localStorage وقت تسجيل الدخول
      const token = localStorage.getItem("access_token") || localStorage.getItem("khadrwy_token") || "mock-token-123";

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          // إرسال التوكن في رأس الطلب لتجنب خطأ 401
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || `Request failed (${response.status})`
        );
      }

      const answer = data.answer ?? data.response ?? data.reply;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("The server returned no answer.");
      }

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === chatId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages.filter(
                    (message) => message.id !== loadingId
                  ),
                  {
                    id: Date.now() + 2,
                    sender: "assistant",
                    text: answer,
                    sources: Array.isArray(data.sources) ? data.sources : [],
                  },
                ],
              }
            : conversation
        )
      );
    } catch (error) {
      console.error("AI Assistant error:", error);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === chatId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages.filter(
                    (message) => message.id !== loadingId
                  ),
                  {
                    id: Date.now() + 3,
                    sender: "assistant",
                    text:
                      lang === "en"
                        ? `Couldn't get an answer: ${error.message}`
                        : `حصلت مشكلة: ${error.message}`,
                  },
                ],
              }
            : conversation
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-[#FAF6F0] p-4 sm:p-6 min-h-[85vh]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
        multiple
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleCameraCapture}
        className="hidden"
        accept="image/*"
        capture="environment"
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {t.aiAssistantTitle || "AI Assistant"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.aiAssistantSub || "Manage assistant"}
          </p>
        </div>

        <div className="sm:hidden w-full">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full bg-white border border-forest/20 text-forest text-xs font-bold px-3 py-2.5 rounded-xl shadow-xs"
          >
            {isSidebarOpen
              ? t.hideSidebar || "Hide Sidebar"
              : t.showChats || "Show Chats"}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row bg-white rounded-3xl border border-forest/10 shadow-sm overflow-hidden flex-1 h-[72vh]">
        <div
          className={`${
            isSidebarOpen ? "flex" : "hidden"
          } sm:flex w-full sm:w-80 border-e border-gray-100 flex-col p-4 bg-white shrink-0 transition-all duration-300`}
        >
          <button
            type="button"
            onClick={handleNewConversation}
            className="w-full bg-forest text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-forest/90 transition mb-6"
          >
            <span className="text-sm">+</span>
            <span>{t.newChat || "New conversation"}</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-2">
              {t.recentChats || "Recent"}
            </span>

            {conversations.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => {
                  setActiveChatId(chat.id);
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
                className={`w-full text-start p-3 rounded-xl text-xs font-medium transition flex items-center gap-2.5 ${
                  activeChatId === chat.id
                    ? "bg-[cream] text-forest font-bold border border-forest/20"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>💬</span>
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between bg-white h-full overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center text-xs overflow-hidden">
                <img src={logoImage} alt="" className="w-7 h-7 object-cover" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-forest">
                  {t.assistantName || "Khadrawy Assistant"}
                </h3>
                <p className="text-[10px] text-gray-400">
                  {t.assistantRole || "Agricultural guidance"}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-2 focus:outline-none"
                aria-label={t.conversationOptions || "Conversation options"}
              >
                •••
              </button>

              {showMenu && (
                <div className="absolute end-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-20 text-xs">
                  <button
                    type="button"
                    onClick={handleDeleteCurrentChat}
                    className="w-full text-start px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-medium transition flex items-center gap-2"
                  >
                    <span>🗑️</span>
                    <span>
                      {t.deleteConversation ||
                        (lang === "en"
                          ? "Delete conversation"
                          : "حذف المحادثة")}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {currentChat?.messages?.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.hasDiagnosisCard && (
                  <div className="mb-3 max-w-md w-full bg-[#FAF6F0]/60 border border-forest/15 rounded-2xl p-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center text-sm">
                        🛡️
                      </div>
                      <div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                          {t.attachedDiagnosis || "ATTACHED DIAGNOSIS"}
                        </span>
                        <h4 className="text-xs font-bold text-forest mt-1">
                          {lang === "en"
                            ? "Tomato - Possible early blight"
                            : "طماطم - إصابة محتملة باللفحة المبكرة"}
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          North Greenhouse · Today
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    message.sender === "user"
                      ? "bg-forest text-white rounded-br-xs"
                      : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-xs"
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div
                      className={`mb-2 grid ${
                        message.attachments.length > 1
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      } gap-2`}
                    >
                      {message.attachments.map((attachment, index) =>
                        attachment.type === "image" ? (
                          <div
                            key={index}
                            className="overflow-hidden rounded-xl border border-white/20"
                          >
                            <img
                              src={attachment.url}
                              alt="attachment"
                              className="max-h-48 w-full object-cover rounded-xl"
                            />
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="p-2 bg-white/10 rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <span>📁</span>
                            <span className="truncate">{attachment.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {message.text && <span>{message.text}</span>}
                </div>

                {message.sources?.length > 0 && (
                  <div className="mt-2 max-w-xs sm:max-w-md text-[10px] text-gray-500">
                    <p className="font-semibold mb-1">
                      {lang === "en" ? "Sources" : "المصادر"}
                    </p>
                    <ul className="list-disc ps-4 space-y-1">
                      {message.sources.map((source, index) => (
                        <li key={index}>
                          {typeof source === "string"
                            ? source
                            : source.title || source.source_name || source.name || JSON.stringify(source)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white relative">
            {selectedAttachments.length > 0 && (
              <div className="mb-3 flex items-center gap-2 overflow-x-auto p-2.5 bg-[#FAF6F0] rounded-2xl border border-gray-200">
                {selectedAttachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-gray-300 bg-white shadow-xs"
                  >
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] p-1 text-gray-600">
                        <span>📁</span>
                        <span className="truncate w-full text-center">
                          {attachment.name}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-700 shadow-sm"
                      title="إزالة"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAttachMenu && (
              <div className="absolute bottom-20 start-4 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full text-start px-4 py-2.5 hover:bg-gray-50 text-forest font-medium flex items-center gap-2.5 transition"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 56 56"
                    >
                      <path d="M0 0h56v56H0z" fill="none" />
                      <path
                        fill="currentColor"
                        d="M7.715 49.574h40.57c4.899 0 7.36-2.437 7.36-7.265V13.69c0-4.828-2.461-7.265-7.36-7.265H7.715C2.84 6.426.355 8.84.355 13.69v28.62c0 4.851 2.485 7.265 7.36 7.265m31.57-21.633c-1.055-.937-2.25-1.43-3.515-1.43c-1.313 0-2.462.446-3.54 1.407l-10.593 9.469l-4.336-3.938c-.985-.867-2.04-1.336-3.164-1.336-1.032 0-2.04.446-3 1.313L4.129 39.73V13.88c0-2.438 1.312-3.68 3.656-3.68h40.43c2.32 0 3.656 1.242 3.656 3.68v25.875Zm-21.469.258c3.024 0 5.508-2.484 5.508-5.531c0-3.023-2.484-5.531-5.508-5.531c-3.046 0-5.53 2.508-5.53 5.531a5.54 5.54 0 0 0 5.53 5.531"
                      />
                    </svg>
                  </span>
                  <span>
                    {t.openCamera ||
                      (lang === "en"
                        ? "Open Camera / Take Photo"
                        : "التقاط صورة بالكاميرا")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-start px-4 py-2.5 hover:bg-gray-50 text-forest font-medium flex items-center gap-2.5 transition border-t border-gray-100"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path fill="currentColor" d="M11 15h2V9h3l-4-5l-4 5h3z" />
                      <path
                        fill="currentColor"
                        d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2z"
                      />
                    </svg>
                  </span>
                  <span>
                    {t.uploadFiles ||
                      (lang === "en"
                        ? "Upload Images / Files"
                        : "رفع صور أو ملفات")}
                  </span>
                </button>
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={
                  t.inputPlaceholder || "Ask a follow-up question...."
                }
                className="w-full bg-[#FAF6F0]/50 border border-gray-200 rounded-2xl py-3.5 px-4 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition ps-4 pe-12"
              />

              <div className="absolute inset-y-0 end-0 pe-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="text-gray-400 hover:text-gray-600 text-sm p-1 focus:outline-none"
                  title={t.attachFile || "Attach"}
                  aria-label={t.attachFile || "Attach"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="m2.861 13.625l9.342-9.342a5.235 5.235 0 1 1 7.403 7.403L10.88 20.41a2.867 2.867 0 0 1-4.054-4.054l8.372-8.373"
                    />
                  </svg>
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center hover:bg-forest/90 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label={lang === "en" ? "Send message" : "إرسال الرسالة"}
                  title={lang === "en" ? "Send message" : "إرسال الرسالة"}
                >
                  ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}