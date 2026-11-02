"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Đăng nhập thành công với tài khoản: ${email}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header activePage="login" />

      <main className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Nền decor hữu cơ nhẹ nhàng phía sau khung đăng nhập */}
        <div className="absolute w-[500px] h-[440px] bg-[#ffdcc5] opacity-50 rounded-[48px] rotate-2 pointer-events-none -z-10" />
        <div className="absolute w-[460px] h-[400px] bg-[#e2e7ff] opacity-40 rounded-[40px] -rotate-3 pointer-events-none -z-10" />

        {/* Khung đăng nhập căn giữa */}
        <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 sm:p-10 shadow-[0px_16px_40px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="text-center mb-8">
            <span className="text-[13px] font-bold text-[#944b00] tracking-wider uppercase font-sans">
              Chào mừng trở lại
            </span>
            <h1 className="text-[32px] sm:text-[36px] font-extrabold text-[#131b2e] tracking-tight mt-1">
              Đăng nhập tài khoản
            </h1>
            <p className="text-[15px] text-[#625e56] mt-2">
              Tiếp tục hành trình học kiến trúc mã nguồn và luyện kỹ năng cùng SimpliFey.
            </p>
          </div>

          {/* Form Email / Mật khẩu */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[14px] font-semibold text-[#131b2e] mb-1.5">
                Email học tập
              </label>
              <div className="relative flex items-center bg-[#f2f3ff] rounded-lg border border-transparent focus-within:border-[#ff9640] transition-colors">
                <div className="absolute left-3.5 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@sinhvien.edu.vn"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-[14px] font-sans text-[#131b2e] placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[14px] font-semibold text-[#131b2e]">
                  Mật khẩu
                </label>
                <Link
                  href="#forgot-password"
                  className="text-[13px] font-medium text-[#ff9640] hover:text-[#ff8624] transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative flex items-center bg-[#f2f3ff] rounded-lg border border-transparent focus-within:border-[#ff9640] transition-colors">
                <div className="absolute left-3.5 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-10 pr-10 py-3 text-[14px] font-sans text-[#131b2e] placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 accent-[#ff9640] rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[13px] text-[#625e56] cursor-pointer select-none">
                Duy trì trạng thái đăng nhập trên thiết bị này
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#ff9640] hover:bg-[#ff8624] text-[#301400] font-bold text-[16px] py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] hover:scale-[1.01] cursor-pointer disabled:opacity-70"
            >
              <span>{isLoading ? "Đang xử lý..." : "Đăng Nhập"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <span className="text-[14px] text-[#625e56]">
              Chưa có tài khoản SimpliFey?{" "}
            </span>
            <Link
              href="/register"
              className="text-[14px] font-bold text-[#ff9640] hover:text-[#ff8624] transition-colors ml-1"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
