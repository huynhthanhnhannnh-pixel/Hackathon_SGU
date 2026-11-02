"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  BookOpen,
  Sliders,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface HeaderProps {
  activePage?: "home" | "login" | "register" | "roadmap" | "other";
  userName?: string;
}

export function Header({ userName }: HeaderProps = {}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Đóng panel cài đặt khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center group">
            <span className="font-extrabold text-[32px] tracking-tight text-[#ff9640] font-sans text-3d-subtle inline-block transition-transform duration-200 group-hover:scale-[1.03]">
              SIMPLIFEY
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="group relative inline-flex items-center text-[14px] font-medium text-[#554337] hover:text-[#131b2e] transition-transform duration-300 ease-out hover:scale-105 origin-center py-1"
            >
              <span className="transition-all duration-300 group-hover:font-semibold">
                Trang chủ
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#131b2e] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
            <Link
              href="/#how-it-works"
              className="group relative inline-flex items-center text-[14px] font-medium text-[#554337] hover:text-[#131b2e] transition-transform duration-300 ease-out hover:scale-105 origin-center py-1"
            >
              <span className="transition-all duration-300 group-hover:font-semibold">
                Cách học cùng SimpliFey
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#131b2e] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
            <Link
              href="/#explore"
              className="group relative inline-flex items-center text-[14px] font-medium text-[#554337] hover:text-[#131b2e] transition-transform duration-300 ease-out hover:scale-105 origin-center py-1"
            >
              <span className="transition-all duration-300 group-hover:font-semibold">
                Tìm kiếm repo yêu thích của bạn
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#131b2e] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[#131b2e]">
                Xin chào {userName}!
              </span>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="group relative inline-flex items-center text-[14px] font-medium text-[#554337] hover:text-[#131b2e] px-2.5 py-1 transition-transform duration-300 ease-out hover:scale-105 origin-center"
              >
                <span className="transition-all duration-300 group-hover:font-semibold">
                  Đăng nhập
                </span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#131b2e] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
              </Link>

              <Link
                href="/register"
                className="text-[14px] font-bold px-6 py-2.5 rounded-[12px] shadow-sm hover:shadow-md bg-[#ff9640] hover:bg-[#ff8624] text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              >
                Đăng ký
              </Link>
            </>
          )}

          {/* Button Cài đặt (Không viền, không background) + Dropdown Panel */}
          <div className="relative flex items-center" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-1 text-black hover:text-[#ff9640] transition-colors duration-200 cursor-pointer focus:outline-none group"
              title="Cài đặt hệ thống"
              aria-label="Cài đặt hệ thống"
              aria-expanded={isSettingsOpen}
            >
              {/* Icon bánh răng: khi hover xoay tròn 1 vòng (360 độ), không phóng to, không in đậm */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-700 ease-in-out group-hover:rotate-360"
              >
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Panel xổ xuống (Dropdown Panel) */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[260px] bg-white rounded-2xl shadow-[0px_16px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-[13px] font-bold text-[#131b2e]">
                    Cài đặt SimpliFey
                  </p>
                  <p className="text-[11px] text-[#625e56]">
                    Tùy chỉnh cá nhân và học tập
                  </p>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/roadmap"
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#131b2e] hover:bg-[#fff7ed] hover:text-[#ff9640] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#ff9640]" />
                      <span>Lộ trình của tôi</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Mở cài đặt tài khoản");
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#131b2e] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#625e56]" />
                      <span>Hồ sơ cá nhân</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Tùy chọn độ khó bài học Feynman");
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#131b2e] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-[#625e56]" />
                      <span>Chế độ học Feynman</span>
                    </div>
                    <span className="text-[11px] bg-orange-100 text-[#944b00] px-2 py-0.5 rounded-full font-bold">
                      BKT-v2
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Đổi giao diện Sáng / Tối");
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#131b2e] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-4 h-4 text-[#625e56]" />
                      <span>Chế độ nền tối</span>
                    </div>
                    <span className="text-[12px] text-gray-400 font-normal">
                      Tắt
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Trung tâm trợ giúp SimpliFey");
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#131b2e] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#625e56]" />
                      <span>Trợ giúp & Hướng dẫn</span>
                    </div>
                  </button>
                </div>

                <div className="border-t border-gray-100 mt-1.5 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Đăng xuất</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
