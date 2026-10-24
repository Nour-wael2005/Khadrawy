import path from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  // 1. جلب البيانات المخزنة من الـ localStorage
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

  // 2. لو مش مسجل دخول أصلاً، ارجع لصفحة تسجيل الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. لو مسجل دخول بس الرول بتاعته مش مسموحة للصفحة دي، منعه ويرجعه للوجين
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // 4. لو كل حاجة تمام، افتح له الصفحة
  return children;
}