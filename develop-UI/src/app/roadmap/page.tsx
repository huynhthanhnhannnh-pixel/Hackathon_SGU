"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, ArrowRight } from "lucide-react";

interface RoadmapCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  iconSrc: string;
  category?: string;
  totalLessons?: number;
  completedLessons?: number;
}

export default function RoadmapPage() {
  const [courses] = useState<RoadmapCourse[]>([
    {
      id: "java-backend",
      title: "Java Backend",
      description: "Hệ thống quản lý xuất nhập hàng",
      progress: 75,
      isCompleted: false,
      iconSrc: "/assets/2b5ee.svg",
      category: "Backend Architecture",
      totalLessons: 12,
      completedLessons: 9,
    },
    {
      id: "react-frontend",
      title: "React Frontend",
      description: "Giao diện nhanh, đẹp cùng React",
      progress: 75,
      isCompleted: false,
      iconSrc: "/assets/2b5ee.svg",
      category: "Frontend UI/UX",
      totalLessons: 8,
      completedLessons: 6,
    },
    {
      id: "sql-server",
      title: "SQL Server",
      description: "Làm chủ cơ sở dữ liệu quan hệ",
      progress: 100,
      isCompleted: true,
      iconSrc: "/assets/8ce5b.svg",
      category: "Database Design",
      totalLessons: 10,
      completedLessons: 10,
    },
    {
      id: "postgresql",
      title: "Postgresql",
      description: "Cơ sở về database thông dụng nhất",
      progress: 100,
      isCompleted: true,
      iconSrc: "/assets/8ce5b.svg",
      category: "Database Architecture",
      totalLessons: 14,
      completedLessons: 14,
    },
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header userName="User" activePage="roadmap" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-center gap-3.5 mb-10">
            <div className="w-[48px] h-[48px] rounded-[16px] bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center shadow-xs shrink-0">
              <Image
                src="/assets/25b2e.svg"
                alt="Cap Icon"
                width={28}
                height={24}
                className="w-7 h-6"
              />
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#131b2e] tracking-tight">
              Tiếp tục học repo của bạn
            </h1>
          </div>

          <div className="bg-white border border-[#c0c0c0] rounded-[18px] p-5 sm:p-7 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] space-y-4">
            {courses.map((course) => {
              if (course.isCompleted) {
                return (
                  <div
                    key={course.id}
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
                          <h2 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight transition-colors">
                            {course.title}
                          </h2>
                          <p className="text-[14px] text-white/90 font-normal mt-0.5">
                            {course.description}
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
                          Xem lại bài
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={course.id}
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
                        <h2 className="text-[17px] sm:text-[18px] font-extrabold text-[#131b2e] tracking-tight transition-colors group-hover:text-[#ff9640]">
                          {course.title}
                        </h2>
                        <p className="text-[14px] text-[#554337] font-medium mt-0.5">
                          {course.description}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="w-[180px] sm:w-[240px] h-[8px] bg-[#ffe4d1] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-[#ff9640] to-[#ff7e14] rounded-full transition-all duration-500 ease-out shadow-xs"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-[18px] text-[#ff9640]">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 sm:self-center">
                      <Link
                        href={`/roadmap/${course.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[13px] rounded-[12px] shadow-[0px_4px_10px_rgba(255,150,64,0.3)] hover:shadow-[0px_6px_16px_rgba(255,150,64,0.4)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                      >
                        <span>Tiếp tục học</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
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
