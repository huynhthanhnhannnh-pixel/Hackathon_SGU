"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, ArrowRight, Lock, ArrowLeft } from "lucide-react";

interface LessonSlice {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "locked";
  progress?: number;
  actionLabel?: string;
}

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  const courseTitle =
    courseId === "react-frontend"
      ? "React Frontend"
      : courseId === "sql-server"
      ? "SQL Server"
      : courseId === "postgresql"
      ? "Postgresql"
      : "Java Backend";

  const slices: LessonSlice[] = [
    {
      id: "auth-flow",
      stepNumber: 1,
      title: "1. Đăng Nhập & Phân Quyền (Auth Flow)",
      description: "Luồng tiếp nhận JWT token từ Controller sang AuthService.",
      status: "completed",
      actionLabel: "Xem lại bài",
    },
    {
      id: "order-checkout",
      stepNumber: 2,
      title: "2. Đặt Hàng & Trừ Kho (Order Checkout Flow)",
      description:
        "Phát hiện lỗi N+1 Query lặp trong for-of làm nghẽn Database.",
      status: "in_progress",
      progress: 75,
      actionLabel: "Bắt đầu học",
    },
    {
      id: "vnpay-integration",
      stepNumber: 3,
      title: "3. Tích Hợp Cổng Thanh Toán VNPay (Webhook & Idempotency)",
      description: "Đồng bộ giao dịch phân tán và chống double-spending.",
      status: "locked",
      actionLabel: "Hoàn thành bài trước để mở khóa",
    },
    {
      id: "rabbitmq-events",
      stepNumber: 4,
      title:
        "4. Kiến Trúc Sự Kiện & Hàng Đợi (RabbitMQ Event-Driven)",
      description:
        "Bắn sự kiện OrderCreated và xử lý worker gửi email thông báo.",
      status: "locked",
      actionLabel: "Hoàn thành bài trước để mở khóa",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header userName="User" activePage="roadmap" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-6">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#554337] hover:text-[#ff9640] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Quay lại danh sách lộ trình</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3.5 mb-10">
            <div className="w-[48px] h-[48px] rounded-[16px] bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center shadow-xs shrink-0">
              <Image
                src="/assets/f6c78.svg"
                alt="Module Icon"
                width={32}
                height={32}
                className="w-7 h-7"
              />
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#131b2e] tracking-tight">
              {courseTitle}
            </h1>
          </div>

          <div className="bg-white border border-[#c0c0c0] rounded-[18px] p-5 sm:p-7 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] space-y-4">
            {slices.map((slice) => {
              if (slice.status === "completed") {
                return (
                  <div
                    key={slice.id}
                    className="group bg-[#047857] border-2 border-[#004f1a] rounded-[16px] p-5 sm:p-6 text-white shadow-xs transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-[#007025]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="w-[48px] h-[48px] rounded-[10px] bg-white border border-[#047857] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src="/assets/9edd6.svg"
                            alt="Star"
                            width={22}
                            height={22}
                            className="w-[20px] h-[20px]"
                          />
                        </div>
                        <div>
                          <h3 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight transition-colors">
                            {slice.title}
                          </h3>
                          <p className="text-[14px] text-white/90 font-normal mt-0.5">
                            {slice.description}
                          </p>

                          <div className="mt-3.5 inline-flex items-center gap-2 bg-white text-[#047857] px-3.5 py-1.5 rounded-[6px] font-bold text-[13px] shadow-xs">
                            <span>Đã hoàn thành</span>
                            <Check className="w-3.5 h-3.5 text-[#047857] stroke-[3]" />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 sm:self-center">
                        <button
                          type="button"
                          className="w-full sm:w-auto px-6 py-2.5 bg-white text-[#131b2e] font-bold text-[13px] rounded-[12px] shadow-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          {slice.actionLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (slice.status === "in_progress") {
                return (
                  <div
                    key={slice.id}
                    className="group relative overflow-hidden bg-[#fff7ed] border-2 border-[#ff9640] rounded-[16px] p-5 sm:p-6 shadow-[0px_4px_12px_rgba(255,150,64,0.12)] transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-[#ff7e14]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-[48px] h-[48px] rounded-[10px] bg-[#ff9640] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src="/assets/51d7e.svg"
                            alt="Ribbon Icon"
                            width={18}
                            height={22}
                            className="w-[16px] h-[20px]"
                          />
                        </div>
                        <div>
                          <h3 className="text-[17px] sm:text-[18px] font-extrabold text-[#131b2e] tracking-tight transition-colors group-hover:text-[#ff9640]">
                            {slice.title}
                          </h3>
                          <p className="text-[14px] text-[#554337] font-medium mt-0.5">
                            {slice.description}
                          </p>

                          <div className="mt-4 flex items-center gap-3">
                            <div className="w-[180px] sm:w-[240px] h-[8px] bg-[#ffe4d1] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-[#ff9640] to-[#ff7e14] rounded-full transition-all duration-500 ease-out shadow-xs"
                                style={{ width: `${slice.progress}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[18px] text-[#ff9640]">
                              {slice.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 sm:self-center">
                        <button
                          type="button"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[13px] rounded-[12px] shadow-[0px_4px_10px_rgba(255,150,64,0.3)] hover:shadow-[0px_6px_16px_rgba(255,150,64,0.4)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <span>{slice.actionLabel}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={slice.id}
                  className="group bg-[#f2f3ff]/60 border border-[#eaedff]/80 hover:border-[#ccd4ff] hover:bg-[#f2f3ff] rounded-[16px] p-5 sm:p-6 opacity-85 transition-all duration-300 ease-out hover:shadow-sm hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-[48px] h-[48px] rounded-[10px] bg-[#eaedff] group-hover:bg-[#e0e5ff] flex items-center justify-center shrink-0 transition-colors">
                        <Lock className="w-5 h-5 text-[#887365]/70 group-hover:text-[#625e56] transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#625e56] group-hover:text-[#131b2e] tracking-tight transition-colors">
                          {slice.title}
                        </h3>
                        <p className="text-[14px] text-[#887365] font-normal mt-0.5">
                          {slice.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 sm:self-center">
                      <span className="inline-block w-full sm:w-auto text-center px-4 py-2 bg-[#eaedff] group-hover:bg-[#e0e5ff] text-[#887365] group-hover:text-[#625e56] font-semibold text-[12px] rounded-[12px] transition-colors">
                        {slice.actionLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
