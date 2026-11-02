"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { LottieAnimation } from "@/components/LottieAnimation";
import {
  ArrowLeft,
  Copy,
  Check,
  FileCode,
  Send,
  RotateCcw,
  CheckCircle2,
  GitFork,
  X,
  TrendingUp,
  Award,
} from "lucide-react";

export default function LearnPage() {
  const [copied, setCopied] = useState(false);
  const [answerText, setAnswerText] = useState(
    "Tưởng tượng 1 bàn gọi 10 món. Thay vì ghi hết 10 món vào phiếu rồi đưa đầu bếp làm 1 lần, người bồi bàn lại chạy vào bếp xin 1 đĩa rồi chạy ra, xong lại chạy vào xin đĩa thứ 2. Chạy đi chạy lại 10 lần làm kẹt cứng lối đi trong bếp! 100 người mua thì có 100 bồi bàn chạy 1,000 chuyến làm sập tiệm."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    status: "idle" | "evaluating" | "passed" | "needs_improvement";
    feedback?: string;
    bktDelta?: { from: number; to: number; skill: string };
  }>({ status: "idle" });

  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFullFileModalOpen, setIsFullFileModalOpen] = useState(false);

  // Đếm số từ
  const wordCount = answerText.trim() === "" ? 0 : answerText.trim().split(/\s+/).length;

  const handleCopyCode = () => {
    const codeSnippet = `async processCheckout(dto: CheckoutDto): Promise<OrderResult> {
  const order = await this.orderRepo.create(dto);
  // ⚠️ Dòng 22 - N+1 Query
  for (const item of dto.items) {
    await this.inventoryRepo.updateStock(item.id, item.qty);
  }
  const payment = await this.paymentGateway.charge(order.id, dto.amount);
  await this.auditLog.record('ORDER_CREATED', order.id);
  return { orderId: order.id, status: 'SUCCESS' };
}`;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    setEvaluationResult({ status: "evaluating" });

    setTimeout(() => {
      setIsSubmitting(false);
      setEvaluationResult({
        status: "passed",
        feedback:
          "Xuất sắc! Phép so sánh người bồi bàn chạy lắt nhắt từng món ăn thể hiện trực quan bản chất thắt cổ chai I/O của lỗi N+1 Query. Bạn đã đạt tiêu chí giải thích Feynman.",
        bktDelta: {
          skill: "DB_OPTIMIZATION & QUERY_EFFICIENCY",
          from: 0.25,
          to: 0.725,
        },
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f2f3ff] flex flex-col font-sans text-[#131b2e] selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      {/* ── HEADER CHÍNH SIMPLIFEY (ĐỒNG BỘ VỚI TOÀN HỆ THỐNG) ── */}
      <Header userName="Quý" activePage="other" />

      {/* ── 1. TOP WORKSPACE BAR (HEADER CHUYÊN BIỆT CHO TRANG HỌC TẬP) ── */}
      <div className="sticky top-[72px] z-40 bg-[#ff9640] border-b border-[#000000]/10 shadow-[0px_2px_8px_rgba(0,0,0,0.08)] h-[64px] flex items-center justify-between px-4 sm:px-6 lg:px-[3%]">
        <div className="flex items-center gap-3 sm:gap-5 overflow-hidden">
          {/* Nút quay lại Lộ trình */}
          <Link
            href="/roadmap/java-backend"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-all duration-200 shrink-0"
            title="Quay lại danh sách chặng bài"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Breadcrumb & Context Chips */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-white overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="w-[28px] h-[20px] shrink-0 opacity-90 flex items-center justify-center">
              <Image
                src="/assets/workbench/96112.svg"
                alt="Repo Icon"
                width={28}
                height={20}
                className="w-[28px] h-[19px] object-contain"
              />
            </div>
            <span className="text-white font-medium text-[16px] sm:text-[18px]">
              shop-vibecode
            </span>
            <span className="text-white text-[16px] sm:text-[18px]">/</span>
            <span className="text-white font-medium text-[16px] sm:text-[18px] hidden sm:inline">
              src
            </span>
            <span className="text-white text-[16px] sm:text-[18px] hidden sm:inline">
              /
            </span>
            <span className="text-white font-medium text-[16px] sm:text-[18px] hidden md:inline">
              services
            </span>
            <span className="text-white text-[16px] sm:text-[18px] hidden md:inline">
              /
            </span>
            <span className="text-white font-bold text-[16px] sm:text-[18px] underline decoration-white/70 decoration-2 underline-offset-4">
              order.service.ts
            </span>
          </div>

          {/* Badge phân loại bài học */}
          <div className="hidden lg:inline-flex items-center ml-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full border border-white/25 text-white font-bold text-[20px]">
            Java Backend
          </div>
        </div>

        {/* Nút Báo cáo phiên học bên phải (Chuyển sang trang báo cáo /report) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/report"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-[#8b4600] hover:bg-[#733a00] text-white font-bold text-[13px] sm:text-[14px] rounded-[10px] shadow-[0px_4px_10px_rgba(139,70,0,0.3)] hover:shadow-[0px_6px_16px_rgba(139,70,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Image
              src="/assets/workbench/482ba.svg"
              alt="Report Icon"
              width={16}
              height={16}
              className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="xs:inline">Báo cáo phiên học</span>
          </Link>
        </div>
      </div>

      {/* ── 2. KHÔNG GIAN HỌC TẬP: NÚT ĐỒ THỊ SÁT MÉP TRÁI, Ô CODE CÁCH NÚT 5PX & TĂNG CHIỀU NGANG ── */}
      <div className="flex-1 w-full pl-4 sm:pl-6 lg:pl-[101px] pr-4 sm:pr-6 lg:pr-[3%] py-4 sm:py-6 relative flex flex-col lg:flex-row gap-4 xl:gap-5 items-stretch">
        {/* Nút Tab Đồ thị bài học: Dán sát mép trái (w: 96px, cách ô code đúng 5px qua pl-[101px]) */}
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={() => setIsGraphDrawerOpen(true)}
            className="fixed left-0 top-[156px] z-30 w-[96px] h-[148px] bg-white border-y border-r border-[#ff9640]/30 shadow-[4px_6px_20px_rgba(255,150,64,0.38)] rounded-r-[20px] rounded-l-none p-2 flex flex-col items-center justify-center gap-3 group transition-all duration-300 hover:translate-x-1 cursor-pointer"
            title="Mở sơ đồ đồ thị các bài học"
          >
            <LottieAnimation
              animationPath="/assets/graph.json"
              width={42}
              height={42}
              className="group-hover:scale-110 transition-transform"
            />
            <div className="font-bold text-[14px] text-[#131b2e] group-hover:text-[#ff9640] leading-snug text-center tracking-tight transition-colors">
              Đồ thị
              <br />
              bài học
            </div>
          </button>
        </div>

        {/* Nút mở đồ thị bài học cho mobile / tablet */}
        <div className="lg:hidden flex justify-between items-center bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#131b2e]">
            <GitFork className="w-4 h-4 text-[#ff9640]" />
            <span>Chặng 2: Đặt Hàng & Trừ Kho (Order Checkout Flow)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsGraphDrawerOpen(true)}
            className="text-[13px] font-bold text-[#ff9640] hover:text-[#ff8624] px-2.5 py-1 rounded-md bg-[#fff7ed]"
          >
            Xem đồ thị
          </button>
        </div>

        {/* ── CỘT TRÁI: Ô HIỂN THỊ CODE (TĂNG CHIỀU NGANG ĐỂ KHÔNG BỊ MẤT NỘI DUNG, CÁCH NÚT ĐỒ THỊ ĐÚNG 5PX) ── */}
        <section className="w-full lg:w-[45%] xl:w-[43%] shrink-0 flex flex-col bg-white rounded-2xl shadow-[0px_8px_24px_rgba(148,75,0,0.08)] border border-gray-200/80 overflow-hidden">
          {/* Header trình soi mã nguồn */}
          <div className="px-4 py-3.5 border-b border-[#eaedff] bg-gradient-to-r from-white to-[#faf8ff] flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center shrink-0 mt-0.5">
                <FileCode className="w-4 h-4 text-[#004cff]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-[#004cff] leading-snug truncate" title="order.service.ts — Hàm processCheckout">
                  order.service.ts
                </h2>
                <p className="text-[12px] text-[#554337] mt-0.5 font-medium truncate">
                  Scope: OrderService.processCheckout
                </p>
              </div>
            </div>
          </div>

          {/* Vùng hiển thị mã nguồn với các đường kẻ dòng ngang màu xám nhạt */}
          <div
            className="flex-1 bg-[#faf8ff] overflow-x-auto relative flex flex-col justify-between min-h-[380px]"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 31px, #e5e7eb 32px)",
              backgroundSize: "100% 32px",
            }}
          >
            <div className="flex font-mono text-[13px] select-text min-w-full w-fit">
              {/* Nội dung Code theo từng dòng kẻ ngang đồng bộ */}
              <div className="flex-1 font-normal min-w-0">
                {/* Dòng 20 */}
                <div className="h-[32px] flex items-center px-4 sm:px-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">async</span>{" "}
                  <span className="text-[#944b00]">processCheckout</span>
                  (dto: <span className="text-[#625e56]">CheckoutDto</span>):{" "}
                  <span className="text-[#006780]">Promise</span>&lt;
                  <span className="text-[#625e56]">OrderResult</span>&gt; &#123;
                </div>

                {/* Dòng 21 */}
                <div className="h-[32px] flex items-center pl-8 sm:pl-10 pr-4 sm:pr-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">const</span> order ={" "}
                  <span className="text-[#006780]">await</span>{" "}
                  <span className="text-[#625e56]">this</span>.orderRepo.create(dto);
                </div>

                {/* Dòng trống phân tách */}
                <div className="h-[32px] border-b border-[#e5e7eb] hover:bg-black/[0.02] transition-colors" />

                {/* DÒNG 22: Loop & N+1 Query */}
                <div className="h-[32px] flex items-center px-4 sm:px-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span>for</span> (<span>const</span> item <span>of</span> dto.items) &#123;
                </div>
                <div className="h-[32px] flex items-center pl-8 sm:pl-10 pr-4 sm:pr-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">await</span>{" "}
                  <span className="text-[#625e56]">this</span>.inventoryRepo.updateStock(item.id, item.qty);
                </div>
                <div className="h-[32px] flex items-center px-4 sm:px-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  &#125;
                </div>

                {/* Dòng trống phân tách */}
                <div className="h-[32px] border-b border-[#e5e7eb] hover:bg-black/[0.02] transition-colors" />

                {/* Dòng 23 */}
                <div className="h-[32px] flex items-center pl-8 sm:pl-10 pr-4 sm:pr-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">const</span> payment ={" "}
                  <span className="text-[#006780]">await</span>{" "}
                  <span className="text-[#625e56]">this</span>.paymentGateway.charge(order.id, dto.amount);
                </div>

                {/* Dòng 24 */}
                <div className="h-[32px] flex items-center pl-8 sm:pl-10 pr-4 sm:pr-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">await</span>{" "}
                  <span className="text-[#625e56]">this</span>.auditLog.record(
                  <span className="text-[#944b00]">{"'ORDER_CREATED'"}</span>, order.id);
                </div>

                {/* Dòng 25 */}
                <div className="h-[32px] flex items-center pl-8 sm:pl-10 pr-4 sm:pr-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  <span className="text-[#006780]">return</span> &#123; orderId: order.id, status:{" "}
                  <span className="text-[#944b00]">{"'SUCCESS'"}</span> &#125;;
                </div>

                {/* Dòng trống phân tách */}
                <div className="h-[32px] border-b border-[#e5e7eb] hover:bg-black/[0.02] transition-colors" />

                {/* Dòng 26 */}
                <div className="h-[32px] flex items-center px-4 sm:px-5 border-b border-[#e5e7eb] text-[#131b2e] whitespace-pre hover:bg-black/[0.02] transition-colors">
                  &#125;
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-[#944b00] border-t border-[#eaedff] px-4 py-2.5 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#131b2e] hover:bg-gray-100 active:scale-95 text-[12px] font-bold rounded-md shadow-xs transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullFileModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#131b2e] hover:bg-gray-100 active:scale-95 text-[12px] font-bold rounded-md shadow-xs transition-all cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Xem toàn bộ file</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CỘT 3: PHẦN DÀNH ĐỂ CHAT VỚI AI (CHIẾM 65%) ── */}
        <section className="flex-1 w-full min-w-0 flex flex-col bg-white rounded-2xl shadow-[0px_8px_24px_rgba(148,75,0,0.08)] border border-gray-200/80 p-5 sm:p-6 justify-between">
          <div className="space-y-6">
            {/* 1. HỘP ĐỀ BÀI AI (AI PROMPT BOX) */}
            <div className="relative">
              {/* Avatar AI (Nhân vật animation Lottie đi bộ to hơn 50% nữa: 120px, không viền cam) */}
              <div className="flex items-center gap-3 mb-1">
                <CharacterAvatar size={120} className="-my-5 -ml-3" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[16px] text-[#131b2e]">
                      Người bạn đồng hành SimpliFey
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Khung nội dung câu hỏi */}
              <div className="bg-[rgba(255,220,197,0.25)] border border-[rgba(255,150,64,0.45)] rounded-xl p-4 sm:p-5 shadow-[0px_4px_12px_rgba(255,150,64,0.08)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-extrabold tracking-wider text-[#944b00] uppercase font-sans">
                    CÂU HỎI
                  </span>
                </div>
                <p className="text-[15px] sm:text-[17px] text-[#131b2e] font-medium leading-relaxed">
                  Bằng lời bình dân như chuyện gọi món ở quán ăn, bạn hãy giải thích:{" "}
                    Tại sao cách trừ kho lắt nhắt ở dòng 22
                  lại làm máy chủ bị đơ khi có 100 người cùng mua một lúc?
                </p>
              </div>
            </div>

            {/* 2. FORM NHẬP LỜI GIẢI THÍCH CỦA HỌC VIÊN */}
            <form onSubmit={handleSubmitAnswer} className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="student-explanation"
                  className="font-extrabold text-[13px] sm:text-[14px] text-[#554337] tracking-wider uppercase font-sans flex items-center gap-2"
                >
                  <span>LỜI GIẢI THÍCH CỦA BẠN</span>
                </label>
                <span className="font-mono text-[13px] font-medium text-[#625e56]">
                  {wordCount}/300 từ
                </span>
              </div>

              <div className="relative">
                <textarea
                  id="student-explanation"
                  rows={6}
                  required
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Hãy dùng hình ảnh quen thuộc (quán ăn, siêu thị, giao hàng...) để giải thích logic code này..."
                  className="w-full bg-[#faf8ff] border border-[#eaedff] focus:border-[#ff9640] rounded-xl p-4 text-[15px] sm:text-[16px] text-[#131b2e] leading-relaxed placeholder-gray-400 shadow-inner focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Nút nộp bài */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[12px] text-[#625e56]">
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !answerText.trim()}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[15px] rounded-[12px] shadow-[0px_4px_10px_rgba(255,150,64,0.3)] hover:shadow-[0px_6px_16px_rgba(255,150,64,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>AI đang chấm bài...</span>
                    </>
                  ) : (
                    <>
                      <span>Nộp Bài Chấm Điểm</span>
                      <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 3. KẾT QUẢ CHẤM ĐIỂM FEYNMAN (KHI ĐÃ NỘP) */}
            {evaluationResult.status === "passed" && (
              <div className="bg-[#ecfdf5] border-2 border-emerald-500 rounded-xl p-4 sm:p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[16px] text-emerald-900">
                        Đánh giá của AI: Đạt xuất sắc!
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[11px]">
                        BKT-v2 +47%
                      </span>
                    </div>
                    <p className="text-[14px] text-emerald-800 leading-relaxed mt-1.5">
                      {evaluationResult.feedback}
                    </p>

                    {/* Chi tiết tăng kỹ năng BKT */}
                    {evaluationResult.bktDelta && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                        <span className="font-mono text-emerald-800 font-semibold">
                          {evaluationResult.bktDelta.skill}
                        </span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="font-mono font-bold text-emerald-900">
                            {evaluationResult.bktDelta.from} → {evaluationResult.bktDelta.to}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2.5">
                  <Link
                    href="/roadmap/java-backend"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[13px] rounded-lg shadow-xs transition-colors"
                  >
                    <span>Mở khóa bài tiếp theo</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── MODAL 1: ĐỒ THỊ BÀI HỌC THEO THIẾT KẾ FIGMA CHUẨN (HIỆU ỨNG TRƯỢT MƯỢT MÀ) ── */}
      <div
        className={`fixed inset-0 z-50 flex transition-all duration-300 ${
          isGraphDrawerOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Lớp nền tối phía sau (Backdrop Overlay) chuyển mờ dần mượt mà */}
        <div
          className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-350 ease-out cursor-pointer ${
            isGraphDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsGraphDrawerOpen(false)}
          aria-label="Đóng đồ thị bài học"
        />

        {/* Panel Đồ thị bài học trượt êm ái từ lề trái ra với cubic-bezier spring */}
        <div
          className={`relative z-10 w-full max-w-[960px] bg-white border-r border-[#c0c0c0] shadow-[0px_10px_60px_rgba(0,0,0,0.5)] flex flex-col h-full transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isGraphDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
            {/* Header của Panel Đồ thị */}
            <div className="h-[72px] px-6 sm:px-8 border-b border-[#eaedff] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <LottieAnimation
                  animationPath="/assets/graph.json"
                  width={32}
                  height={32}
                  className="shrink-0"
                />
                <h3 className="font-extrabold text-[24px] text-black font-sans tracking-tight">
                  Đồ thị bài học
                </h3>
              </div>

              {/* Nút đóng */}
              <button
                type="button"
                onClick={() => setIsGraphDrawerOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                title="Đóng đồ thị"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Vùng Canvas mạng đồ thị (DAG Lesson Graph) - Luồng Top-Down từ trên xuống dưới */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 bg-white flex flex-col items-center">
              <div className="w-full max-w-[820px] flex flex-col items-center relative py-4">
                
                {/* ═════════════════════════════════════════════════════════════ */}
                {/* ── HÀNG 1 (TRÊN CÙNG - BÀI ĐÃ HOÀN THÀNH - MÀU XANH LÁ) ── */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="relative z-20">
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#00b380] shadow-[0px_4px_16px_3px_#00b380] flex flex-col items-center justify-center relative cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái xanh lá */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-[#047857] text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>
                </div>

                {/* ── ĐƯỜNG NỐI TỪ HÀNG 1 XUỐNG HÀNG 2 ── */}
                <div className="w-[820px] h-[64px] relative z-10 pointer-events-none -my-1">
                  <svg width="100%" height="100%" viewBox="0 0 820 64" fill="none">
                    {/* Nhánh rẽ sang trái */}
                    <path
                      d="M 410 16 C 410 42, 205 32, 205 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Nhánh rẽ sang phải */}
                    <path
                      d="M 410 16 C 410 42, 615 32, 615 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Trục dọc trung tâm */}
                    <path
                      d="M 410 16 V 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* ── HÀNG 2 (HAI NODE: TRÁI XANH LÁ, PHẢI CAM ĐANG HỌC) ── */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="w-full flex items-center justify-between px-2 relative z-20">
                  {/* Node Trái: ĐÃ HOÀN THÀNH (XANH LÁ) */}
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#00b380] shadow-[0px_4px_16px_3px_#00b380] flex flex-col items-center justify-center relative cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm lấy danh sách khách hàng
                    </span>

                    {/* Pill trạng thái xanh lá */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-[#047857] text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>

                  {/* Node Phải: BÀI ĐANG HỌC (MÀU CAM RỰC RỠ) */}
                  <div
                    onClick={() => setIsGraphDrawerOpen(false)}
                    className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#ff9640] shadow-[0px_4px_20px_3px_#ff9640] flex flex-col items-center justify-center relative cursor-pointer hover:scale-[1.03] transition-transform ring-4 ring-[#ff9640]/25"
                    title="Bấm để tiếp tục học chặng này"
                  >
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm xử lý mua hàng
                    </span>

                    {/* Pill trạng thái cam */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-[#ff9640] text-white px-3.5 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>
                </div>

                {/* ── ĐƯỜNG NỐI TỪ HÀNG 2 XUỐNG HÀNG 3 ── */}
                <div className="w-[820px] h-[64px] relative z-10 pointer-events-none -my-1">
                  <svg width="100%" height="100%" viewBox="0 0 820 64" fill="none">
                    {/* Nhánh cong trái */}
                    <path
                      d="M 205 16 C 190 38, 220 42, 205 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Nhánh cong phải */}
                    <path
                      d="M 615 16 C 600 38, 630 42, 615 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Trục dọc trung tâm */}
                    <path
                      d="M 410 0 V 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* ── HÀNG 3 (HAI NODE: CHƯA HỌC / ĐANG KHÓA - VIỀN XÁM, PILL ĐEN) ── */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="w-full flex items-center justify-between px-2 relative z-20">
                  {/* Node Trái */}
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#c0c0c0] shadow-[0px_4px_10px_2px_#c0c0c0] flex flex-col items-center justify-center relative cursor-not-allowed opacity-90">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái đen */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-black text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>

                  {/* Node Phải */}
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#c0c0c0] shadow-[0px_4px_10px_2px_#c0c0c0] flex flex-col items-center justify-center relative cursor-not-allowed opacity-90">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái đen */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-black text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>
                </div>

                {/* ── ĐƯỜNG NỐI TỪ HÀNG 3 XUỐNG HÀNG 4 ── */}
                <div className="w-[820px] h-[64px] relative z-10 pointer-events-none -my-1">
                  <svg width="100%" height="100%" viewBox="0 0 820 64" fill="none">
                    {/* Nhánh cong trái */}
                    <path
                      d="M 205 16 C 190 38, 220 42, 205 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Nhánh cong phải */}
                    <path
                      d="M 615 16 C 600 38, 630 42, 615 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Trục dọc trung tâm */}
                    <path
                      d="M 410 0 V 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* ── HÀNG 4 (HAI NODE: CHƯA HỌC / ĐANG KHÓA - VIỀN XÁM, PILL ĐEN) ── */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="w-full flex items-center justify-between px-2 relative z-20">
                  {/* Node Trái */}
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#c0c0c0] shadow-[0px_4px_10px_2px_#c0c0c0] flex flex-col items-center justify-center relative cursor-not-allowed opacity-90">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái đen */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-black text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>

                  {/* Node Phải */}
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#c0c0c0] shadow-[0px_4px_10px_2px_#c0c0c0] flex flex-col items-center justify-center relative cursor-not-allowed opacity-90">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái đen */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-black text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>
                </div>

                {/* ── ĐƯỜNG NỐI TỪ HÀNG 4 HỘI TỤ VỀ HÀNG 5 ── */}
                <div className="w-[820px] h-[64px] relative z-10 pointer-events-none -my-1">
                  <svg width="100%" height="100%" viewBox="0 0 820 64" fill="none">
                    {/* Nhánh từ trái hội tụ vào giữa */}
                    <path
                      d="M 205 16 C 205 48, 410 38, 410 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Nhánh từ phải hội tụ vào giữa */}
                    <path
                      d="M 615 16 C 615 48, 410 38, 410 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                    {/* Trục dọc trung tâm */}
                    <path
                      d="M 410 0 V 64"
                      stroke="#131b2e"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* ── HÀNG 5 (DƯỚI CÙNG - HỘI TỤ - CHƯA HỌC: VIỀN XÁM, PILL ĐEN) ── */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="relative z-20 pb-4">
                  <div className="w-[340px] sm:w-[370px] h-[95px] rounded-[55px] bg-white border-2 border-[#c0c0c0] shadow-[0px_4px_10px_2px_#c0c0c0] flex flex-col items-center justify-center relative cursor-not-allowed opacity-90">
                    <span className="font-extrabold text-[16px] text-black tracking-tight leading-tight">
                      src/services/order.service.ts
                    </span>
                    <span className="font-medium text-[13px] text-black leading-tight mt-0.5">
                      Hàm kiểm tra tồn kho
                    </span>

                    {/* Pill trạng thái đen */}
                    <div className="absolute -bottom-[16px] h-[36px] w-[240px] rounded-[55px] bg-black text-white px-3.5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        <span className="text-[13px] font-bold">Mức độ hiểu bài</span>
                      </div>
                      <span className="text-[13px] font-bold">100/100</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      {/* ── MODAL 2: BÁO CÁO PHIÊN HỌC (SESSION REPORT MODAL) ── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-[540px] w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/workbench/482ba.svg"
                  alt="Report Icon"
                  width={20}
                  height={20}
                  className="w-5 h-5 text-[#8b4600]"
                />
                <h3 className="font-extrabold text-[18px] text-[#131b2e]">
                  Báo cáo phiên học SimpliFey
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff]">
                  <span className="text-[12px] text-[#625e56]">Thời gian học:</span>
                  <p className="text-[16px] font-bold text-[#131b2e]">18 phút</p>
                </div>
                <div className="p-3 bg-[#fff7ed] rounded-xl border border-[#fed7aa]">
                  <span className="text-[12px] text-[#944b00]">Số token AI:</span>
                  <p className="text-[16px] font-bold text-[#944b00]">380 / 10,000</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[12px] font-bold text-[#131b2e]">
                  Kỹ năng được ghi nhận (BKT):
                </span>
                <div className="flex items-center justify-between text-[13px]">
                  <span>DB_OPTIMIZATION</span>
                  <span className="font-bold text-emerald-600">0.7250 (Vững vàng)</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span>NESTJS_ARCHITECTURE</span>
                  <span className="font-bold text-emerald-600">0.6500 (Khá)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[13px] rounded-lg transition-colors cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: XEM TOÀN BỘ FILE (FULL FILE MODAL) ── */}
      {isFullFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-[800px] w-full p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#004cff]" />
                <h3 className="font-bold text-[16px] text-[#131b2e]">
                  src/services/order.service.ts (Toàn bộ file)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullFileModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="flex-1 overflow-auto bg-[#faf8ff] p-4 rounded-xl mt-3 text-[12px] font-mono leading-relaxed text-[#131b2e] border border-[#eaedff]">
{`import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { InventoryRepository } from '../repositories/inventory.repository';
import { PaymentGateway } from '../gateways/payment.gateway';
import { AuditLogService } from './audit-log.service';
import { CheckoutDto, OrderResult } from '../dtos/checkout.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly auditLog: AuditLogService,
  ) {}

  async processCheckout(dto: CheckoutDto): Promise<OrderResult> {
    const order = await this.orderRepo.create(dto);

    // ⚠️ CRITICAL BOTTLENECK: N+1 Database Queries
    for (const item of dto.items) {
      await this.inventoryRepo.updateStock(item.id, item.qty);
    }

    const payment = await this.paymentGateway.charge(order.id, dto.amount);
    await this.auditLog.record('ORDER_CREATED', order.id);

    return { orderId: order.id, status: 'SUCCESS' };
  }
}`}
            </pre>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsFullFileModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#131b2e] font-bold text-[13px] rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
