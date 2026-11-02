"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpenCheck } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LottieAnimation } from "@/components/LottieAnimation";

export default function Home() {
  const [repoUrl] = useState("https://github.com/simplifey/nest-store-core");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert(`Đã nhận lệnh quét repo: ${repoUrl}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header activePage="home" />

      <main className="flex-1">
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center -translate-y-3 lg:-translate-y-2">
              <div className="space-y-4">
                <h1 className="text-[52px] xl:text-[62px] font-extrabold text-[#131b2e] leading-[1.12] tracking-tight">
                  <span>Học thú vị hơn</span>
                  <br />
                  <span>cùng </span>
                  <span className="italic text-[#ff9640] text-3d-subtle inline-block hover:scale-[1.02] transition-transform duration-300">
                    SimpliFey
                  </span>
                </h1>
                <p className="text-[20px] xl:text-[22px] text-[#625e56] font-normal leading-relaxed max-w-[540px]">
                  Người đồng hành, hỗ trợ phân tích và học tập từ chính mã nguồn của bạn.
                </p>
              </div>

              <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 max-w-[608px]">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-5 h-5 relative flex items-center justify-center">
                    <Image
                      src="/assets/6cf87.svg"
                      alt="Phân tích"
                      width={18}
                      height={18}
                    />
                  </div>
                  <span className="text-[17px] font-semibold text-[#131b2e]">
                    Phân tích mã nguồn tự động
                  </span>
                </div>

                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative flex-1 flex items-center bg-[#f2f3ff] rounded-lg border border-transparent focus-within:border-[#ff9640] transition-colors overflow-hidden py-3.5 px-3.5">
                    <div className="flex-shrink-0 mr-3 flex items-center justify-center z-10 bg-[#f2f3ff]">
                      <Image
                        src="/assets/2f0de.svg"
                        alt="URL"
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <span className="animate-marquee-scroll text-[14px] font-mono font-medium text-[#131b2e] cursor-default select-all inline-block">
                        {repoUrl}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isScanning}
                    className="bg-[#ff9640] hover:bg-[#ff8624] text-[#301400] font-bold text-[17px] px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap active:scale-[0.98] hover:scale-105 transform origin-center disabled:opacity-70 cursor-pointer"
                  >
                    <span>{isScanning ? "Đang quét..." : "Quét Dự Án"}</span>
                    <Image
                      src="/assets/4d3ba.svg"
                      alt="Arrow"
                      width={12}
                      height={12}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                </form>
              </div>

              {/* Animation Robot Lottie Companion: Căn giữa khối Hero, kích thước to thêm 30% (273px) */}
              <div className="mt-4 max-w-[608px] w-full flex items-center justify-center">
                <LottieAnimation
                  animationPath="/assets/animation-robot.json"
                  width={273}
                  height={273}
                  className="-my-4"
                />
              </div>
            </div>

            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px] -translate-y-[18px]">
              <div className="absolute w-[490px] h-[410px] bg-[#ffdcc5] opacity-80 rounded-[48px] rotate-2 pointer-events-none" />

              <div className="absolute w-[440px] h-[370px] bg-[#e2e7ff] opacity-70 rounded-[40px] -rotate-3 pointer-events-none" />

              <div className="relative z-10 w-full max-w-[500px] h-[370px] rounded-[24px] overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.12)]">
                <Image
                  src="/assets/bced1.png"
                  alt="Sinh viên SimpliFey học tập với laptop"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-7 -left-4 sm:-left-8 z-20 -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-[0px_12px_24px_rgba(0,0,0,0.12)] border border-gray-100 max-w-[340px]">
                  <div className="relative flex-shrink-0 w-12 h-14 bg-[#f2f2f2] rounded-xl flex items-center justify-center">
                    <Image
                      src="/assets/6c182.svg"
                      alt="Feynman Icon"
                      width={22}
                      height={20}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10b981] rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-[#131b2e] leading-snug">
                      Phương pháp học <span className="text-[#ff9640]">Feyman</span> trực tuyến, hiệu quả
                    </h4>
                    <p className="text-[13px] text-[#625e56] leading-tight mt-0.5">
                      Hỗ trợ bạn hiểu bất kỳ mã nguồn nào
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-6 sm:-left-12 z-20 rotate-4 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-4 shadow-[0px_16px_32px_rgba(0,0,0,0.12)] border border-gray-100 w-[310px] sm:w-[330px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#eaedff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/assets/bc245.svg"
                        alt="Progress Icon"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] text-[#131b2e] leading-tight">
                        Theo dõi tiến trình dễ dàng, trực quan
                      </h4>
                      <p className="text-[12px] text-[#625e56] leading-tight mt-0.5">
                        Học đúng mục tiêu, tiến bộ mỗi ngày
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[#625e56] text-[13px]">Mức độ nắm kiến thức</span>
                      <span className="font-mono font-bold text-[#944b00] text-[18px]">75%</span>
                    </div>
                    <div className="w-full bg-[#f2f3ff] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#00b17a] h-full rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 sm:-right-4 z-20 -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-[0px_8px_20px_rgba(0,0,0,0.1)] border border-gray-100">
                  <div className="w-4 h-4 relative flex-shrink-0">
                    <Image
                      src="/assets/55197.svg"
                      alt="Sparkle"
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <h5 className="font-mono font-bold text-[12px] text-[#131b2e] leading-tight">
                      Nâng cao sự tự tin về kiến thức
                    </h5>
                    <p className="text-[11px] text-[#625e56] leading-tight">
                      Nằm lòng kiến thức và ứng dụng ngay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-gray-100 py-14">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[15px] font-bold text-[#944b00] tracking-wider uppercase mb-1.5 font-sans">
                  KHUNG ĐÀO TẠO ĐA TẦNG
                </p>
                <h2 className="text-[26px] md:text-[30px] font-extrabold text-[#131b2e]">
                  Lộ trình được thiết kế chuẩn xác theo chính repo của bạn
                </h2>
              </div>

              <div className="flex items-center gap-3 text-[#31302d] text-[18px]">
                <div className="w-20 h-1.5 bg-[#ff9640] rounded-full" />
                <span className="font-medium italic">Đi cùng bạn qua từng dấu chấm phẩy</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-lg border-2 border-[#ff9640] flex items-center justify-center p-2 mb-4 bg-white">
                    <Image
                      src="/assets/2ecfc.svg"
                      alt="Nền móng"
                      width={24}
                      height={24}
                    />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#131b2e] mb-2.5">
                    Xây dựng nền móng
                  </h3>
                  <p className="text-[16px] text-[#625e56] leading-relaxed">
                    Phù hợp để bắt đầu và xây dựng nền tảng vững chắc với kiến thức cốt lõi, cú pháp chuẩn và tư duy giải thuật sơ cấp.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-lg border-2 border-[#ff9640] flex items-center justify-center p-2 mb-4 bg-white">
                    <BookOpenCheck className="w-6 h-6 text-[#ff9640]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#131b2e] mb-2.5">
                    Phong cách học trực tuyến mới lạ
                  </h3>
                  <p className="text-[16px] text-[#625e56] leading-relaxed">
                    Trải nghiệm học tập cùng AI bằng cách “đảo ngược vai trò sư phạm” mới lạ và hiệu quả theo Feyman.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-lg border-2 border-[#ff9640] flex items-center justify-center p-2 mb-4 bg-white">
                    <Image
                      src="/assets/76f4f.svg"
                      alt="Tracking & Improvement"
                      width={24}
                      height={24}
                    />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#131b2e] mb-2.5">
                    Theo dõi và cải thiện
                  </h3>
                  <p className="text-[16px] text-[#625e56] leading-relaxed">
                    Trải nghiệm học tập toàn diện với nhiều tính năng phân tích nâng cao, đánh giá độ phức tạp thuật toán và gợi ý nâng cấp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
