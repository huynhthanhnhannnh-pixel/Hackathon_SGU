"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function StudentReportPage() {
  const learningItems = [
    { name: "Hàm kiểm tra tồn kho", progress: 100, color: "#00b380", status: "Hoàn thành" },
    { name: "Hàm lấy danh sách khách hàng", progress: 100, color: "#00b380", status: "Hoàn thành" },
    { name: "Hàm xử lý mua hàng", progress: 72, color: "#ff9640", status: "Đang học" },
    { name: "Hàm cập nhật thông tin đơn", progress: 0, color: "#eaedff", status: "Chưa học" },
    { name: "Hàm hủy đơn hàng", progress: 0, color: "#eaedff", status: "Chưa học" },
    { name: "Hàm xuất hóa đơn VAT", progress: 0, color: "#eaedff", status: "Chưa học" },
  ];

  const reviewRecommendations = [
    {
      title: "Ôn lại cách gọi xử lý THANH TOÁN TỪ BÊN THỨ BA",
      priority: "QUAN TRỌNG",
      textColor: "text-red-600",
    },
    {
      title: "Ôn lại cách xử dụng HTTP STATUS",
      priority: "NÊN HỌC",
      textColor: "text-[#ff9640]",
    },
    {
      title: "Ôn lại cách gọi xử lý TRANSACTION",
      priority: "QUAN TRỌNG",
      textColor: "text-red-600",
    },
    {
      title: "Ôn lại cách gọi xử lý RACE CONDITION",
      priority: "BỔ ÍCH",
      textColor: "text-[#047857]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      {/* ── HEADER GIỐNG TRANG CHỦ ── */}
      <Header userName="Quý" activePage="other" />

      {/* ── TOP NAV BAR: NÚT QUAY VỀ TRANG HỌC ── */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <Link
          href="/learn"
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-semibold text-[15px] sm:text-[16px] rounded-[11px] shadow-[0px_4px_12px_rgba(255,150,64,0.3)] hover:shadow-[0px_6px_16px_rgba(255,150,64,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center transition-transform group-hover:-translate-x-1">
            <Image
              src="/assets/report/e1f93.svg"
              alt="Back Icon"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
          <span>Quay về trang học</span>
        </Link>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* ── 1. TOP GREETING & KPI SECTION ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Card 1: Student Profile Greeting (4 Cột) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 shadow-[0px_4px_16px_rgba(255,150,64,0.14)] border border-gray-100 flex items-center gap-4.5">
            {/* Avatar & Edit badge */}
            <div className="relative shrink-0">
              <div className="w-[78px] h-[78px] rounded-2xl bg-[#eaedff] overflow-hidden flex items-center justify-center shadow-inner">
                <Image
                  src="/assets/report/89b02.png"
                  alt="Student Avatar"
                  width={78}
                  height={78}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Greeting Text */}
            <div className="min-w-0">
              <h1 className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#131b2e] leading-tight truncate">
                Xin chào, Quý
              </h1>
              <p className="text-[13px] sm:text-[14px] text-[#554337] mt-1 font-normal">
                Hôm nay là một ngày học{" "}
                <span className="font-extrabold text-[#ff9640]">năng suất!</span>
              </p>
            </div>
          </div>

          {/* Card 2: 3 Quick KPI Cards (5 Cột) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 items-stretch">
            {/* KPI 1: Repo đang học */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0px_4px_14px_rgba(148,75,0,0.12)] border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[6px] bg-[#944b00] flex items-center justify-center text-white shadow-xs">
                  <Image
                    src="/assets/report/ec4c9.svg"
                    alt="Repo Icon"
                    width={18}
                    height={16}
                    className="w-4.5 h-4"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#554337] bg-[#faf8ff] px-1.5 py-0.5 rounded border border-[#eaedff]">
                  +1 tuần này
                </span>
              </div>
              <div className="mt-2">
                <div className="text-[24px] sm:text-[26px] font-bold text-[#131b2e] leading-none">
                  3
                </div>
                <div className="text-[12px] text-[#554337] font-normal mt-1 truncate">
                  Repo đang học
                </div>
              </div>
            </div>

            {/* KPI 2: Giờ đã học */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0px_4px_14px_rgba(148,75,0,0.12)] border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[6px] bg-[#944b00] flex items-center justify-center text-white shadow-xs">
                  <Image
                    src="/assets/report/3a9cd.svg"
                    alt="Clock Icon"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#554337] bg-[#faf8ff] px-1.5 py-0.5 rounded border border-[#eaedff]">
                  Top 5%
                </span>
              </div>
              <div className="mt-2">
                <div className="text-[24px] sm:text-[26px] font-bold text-[#131b2e] leading-none">
                  24.5
                </div>
                <div className="text-[12px] text-[#554337] font-normal mt-1 truncate">
                  Giờ đã học
                </div>
              </div>
            </div>

            {/* KPI 3: Ngày liên tiếp */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0px_4px_14px_rgba(148,75,0,0.12)] border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[6px] bg-[#944b00] flex items-center justify-center text-white shadow-xs">
                  <Image
                    src="/assets/report/4b417.svg"
                    alt="Streak Icon"
                    width={14}
                    height={16}
                    className="w-3.5 h-4"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#554337] bg-[#faf8ff] px-1.5 py-0.5 rounded border border-[#eaedff]">
                  Top 5%
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] sm:text-[26px] font-bold text-[#131b2e] leading-none">
                    14
                  </span>
                  <span className="text-[12px] font-semibold text-[#ff9640]">ngày</span>
                </div>
                <div className="text-[12px] text-[#554337] font-normal mt-1 truncate">
                  Ngày liên tiếp
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Weekly Goal Arc Card (3 Cột) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 shadow-[0px_4px_16px_rgba(4,120,87,0.14)] border border-emerald-100 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#554337] tracking-wider uppercase">
                TIẾN ĐỘ TUẦN NÀY
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9640] shrink-0" />
                  <span className="text-[12px] text-[#554337]">
                    Giờ học:{" "}
                    <strong className="text-[#131b2e] font-semibold">6.5 giờ</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e6dfd5] shrink-0" />
                  <span className="text-[12px] text-[#554337]">Mục tiêu: 8.0 giờ</span>
                </div>
              </div>
            </div>

            {/* Circular SVG Gauge 81% */}
            <div className="relative w-[76px] h-[76px] shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 -rotate-90">
                <Image
                  src="/assets/report/f0444.svg"
                  alt="Track"
                  width={76}
                  height={76}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute inset-0 -rotate-90">
                <Image
                  src="/assets/report/84a67.svg"
                  alt="Progress"
                  width={76}
                  height={76}
                  className="w-full h-full"
                />
              </div>
              <span className="font-bold text-[18px] text-[#131b2e] relative z-10">
                81%
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. CÁC KIẾN THỨC ĐÃ HỌC HÔM NAY ── */}
        <section className="space-y-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#131b2e]">
            Các kiến thức đã học hôm nay
          </h2>

          {/* Main Course Progress Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-gray-100">
            {/* Header Repo Tag */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-[18px] sm:text-[20px] font-extrabold text-[#944b00] uppercase tracking-wide">
                  REPO: JAVA BACKEND
                </span>
              </div>
            </div>

            {/* 2 Cột: Bảng tiến độ từng hàm & Tóm tắt tổng quan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Cột trái (7.5 cột): Danh sách các hàm */}
              <div className="lg:col-span-8 space-y-4">
                {learningItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl hover:bg-[#faf8ff] transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:w-[40%]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-[15px] sm:text-[16px] text-[#131b2e] truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 sm:w-[55%]">
                      <span className="text-[13px] text-[#554337] shrink-0 font-medium hidden sm:inline">
                        Mức độ hiểu bài:
                      </span>
                      <span
                        className="font-bold text-[14px] shrink-0 w-11 text-right"
                        style={{
                          color:
                            item.progress === 100
                              ? "#047857"
                              : item.progress > 0
                              ? "#ff9640"
                              : "#887365",
                        }}
                      >
                        {item.progress}%
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-[#eaedff] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cột phải (4 cột): Tổng quan & Nút Tiếp tục học */}
              <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-8 flex flex-col items-center lg:items-start justify-center py-4 space-y-5 text-center lg:text-left">
                <div className="w-full p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#554337]">
                      Mức độ hiểu bài trung bình
                    </span>
                    <span className="text-[16px] font-bold">72%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#eaedff] overflow-hidden">
                    <div className="h-full bg-[#047857] rounded-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-[#131b2e]">
                    Bạn đang làm rất tốt!
                  </h3>
                  <p className="text-[13px] text-[#554337] mt-1">
                    Đã hoàn thành 2/6 hàm chính trong lộ trình Java Backend.
                  </p>
                </div>

                <Link
                  href="/learn"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#944b00] hover:bg-[#7a3e00] text-white font-bold text-[15px] rounded-xl shadow-[0px_4px_12px_rgba(148,75,0,0.3)] hover:shadow-[0px_6px_16px_rgba(148,75,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Tiếp tục học</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. ĐIỂM CẦN CẢI THIỆN VÀ ÔN TẬP ── */}
        <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 space-y-5">
          <div className="text-center sm:text-left">
            <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#944b00] uppercase tracking-wide">
              ĐIỂM CẦN CẢI THIỆN VÀ ÔN TẬP
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {reviewRecommendations.map((item, index) => (
              <div
                key={index}
                className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group hover:bg-[#faf8ff] px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#ff9640] shrink-0" />
                  <span className="font-semibold text-[15px] sm:text-[16px] text-[#131b2e] group-hover:text-[#ff9640] transition-colors">
                    {item.title}
                  </span>
                </div>

                <div className="shrink-0 self-start sm:self-auto pl-5 sm:pl-0">
                  <span className={`font-bold text-[18px] tracking-tight uppercase ${item.textColor}`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER GIỐNG TRANG CHỦ ── */}
      <Footer />
    </div>
  );
}
