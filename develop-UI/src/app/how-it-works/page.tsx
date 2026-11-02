"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  Lightbulb,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Dán link GitHub repo bạn thích",
      shortDesc: "Chẳng cần cài cắm phức tạp hay tải code về máy.",
      desc: "Bạn vừa tìm thấy một dự án hay ho trên mạng nhưng mở code ra thì thấy hoa mắt chóng mặt? Chỉ cần copy đường dẫn (URL) GitHub và dán vào SimpliFey. Hệ thống sẽ đọc lướt toàn bộ dự án trong 1.5 giây mà không làm phiền bạn bất kỳ lệnh Terminal nào.",
      highlights: ["Không cần biết Git CLI", "Quét tự động trong 1.5s", "Hỗ trợ mọi ngôn ngữ phổ biến"],
    },
    {
      step: "02",
      title: "Nhận bản đồ học tập chia nhỏ",
      shortDesc: "Không học dồn dập, chia thành từng 'miếng bánh' vừa ăn.",
      desc: "Thay vì đọc hàng nghìn dòng code cùng lúc, SimpliFey tự động chia dự án thành các phần việc thực tế: từ luồng Đăng nhập, Giỏ hàng, cho đến Cổng thanh toán. Bạn chỉ cần chọn một phần mình tò mò nhất để bắt đầu.",
      highlights: ["Chia theo tính năng thực tế", "Có thanh tiến trình rõ ràng", "Biết chính xác mình đang ở đâu"],
    },
    {
      step: "03",
      title: "Học cùng người bạn đồng hành AI (Feynman)",
      shortDesc: "Bạn đóng vai người hướng dẫn, AI sẽ giả vờ 'ngây ngô' để hỏi bạn.",
      desc: "Cách nhớ lâu nhất không phải là đọc tài liệu, mà là giải thích lại cho người khác! Trợ lý SimpliFey sẽ đặt những câu hỏi đời thường, gợi ý bằng sơ đồ và hình vẽ để bạn giải thích lại. Sai cũng không sao, AI luôn động viên và giải thích nhẹ nhàng.",
      highlights: ["Phương pháp học Feynman đỉnh cao", "Không dùng thuật ngữ cao siêu", "Được khen ngợi và cộng điểm"],
    },
    {
      step: "04",
      title: "Tự tin hiểu code, vững vàng phỏng vấn",
      shortDesc: "Biến code của người khác thành kiến thức thật của mình.",
      desc: "Sau vài vòng trò chuyện, hệ thống đo lường kiến thức (Bayesian Knowledge Tracing) sẽ đánh dấu xanh cho bạn. Bạn có thể tự tin nói về kiến trúc dự án khi phỏng vấn, làm đồ án tốt nghiệp hoặc khoe với bạn bè.",
      highlights: ["Đánh giá năng lực chuẩn xác", "Tự tin bảo vệ đồ án", "Hiểu bản chất, không học vẹt"],
    },
  ];

  const faqs = [
    {
      question: "Mình là 'Vibe Coder', chỉ biết dùng AI prompt code thì có hiểu được không?",
      answer:
        "Hoàn toàn được! SimpliFey sinh ra chính là để giúp bạn. Chúng mình không bắt bạn đọc hàng trăm dòng cú pháp phức tạp, mà giải thích theo tư duy logic đời thường giống như cách bạn xem một bức tranh hay một trò chơi xếp hình LEGO.",
    },
    {
      question: "Mình có cần tải Node.js, Java hay Docker về máy không?",
      answer:
        "Không cần tải bất cứ thứ gì! Toàn bộ quá trình quét mã và tương tác đều diễn ra trực tiếp trên trình duyệt của bạn.",
    },
    {
      question: "Phương pháp Feynman ở đây là gì vậy?",
      answer:
        "Đây là bí quyết học nổi tiếng của nhà vật lý Richard Feynman: 'Nếu bạn không thể giải thích điều gì đó cho một đứa trẻ 10 tuổi hiểu, thì bạn chưa thực sự hiểu nó'. SimpliFey sẽ giúp bạn tập giải thích code một cách mộc mạc nhất.",
    },
    {
      question: "Nó có miễn phí không?",
      answer:
        "SimpliFey là dự án mã nguồn mở phi thương mại phục vụ sinh viên và cộng đồng học lập trình.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header activePage="how-it-works" />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-gray-100">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-linear-to-r from-[#ffdcc5]/40 via-[#fff7ed]/50 to-[#e2e7ff]/35 rounded-[60px] blur-3xl pointer-events-none -z-10" />

          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-[38px] sm:text-[50px] lg:text-[60px] font-extrabold text-[#131b2e] tracking-tight leading-[1.15] max-w-[900px] mx-auto">
              Biến đống code xa lạ thành{" "}
              <span className="italic text-[#ff9640] text-3d-subtle inline-block hover:scale-[1.02] transition-transform duration-300">
                kiến thức dễ ợt
              </span>
            </h1>

            <p className="mt-5 text-[17px] sm:text-[20px] text-[#625e56] font-normal leading-relaxed max-w-[680px] mx-auto">
              Không cần đọc hàng ngàn dòng file hay nhớ cú pháp đau đầu. Cùng SimpliFey “dạo chơi” qua từng tính năng của dự án giống như đọc truyện tranh.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[15px] rounded-[14px] shadow-[0px_6px_16px_rgba(255,150,64,0.35)] hover:shadow-[0px_8px_20px_rgba(255,150,64,0.45)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Thử ngay với 1 Repo tùy thích</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <span className="text-[13px] font-bold text-[#944b00] tracking-wider uppercase font-sans">
              4 bước siêu đơn giản
            </span>
            <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#131b2e] tracking-tight mt-1">
              Bạn chỉ cần mang sự thích thú, việc còn lại để SimpliFey lo
            </h2>
          </div>

          <div className="max-w-[1040px] mx-auto space-y-8">
            {steps.map((item) => {
              return (
                <div
                  key={item.step}
                  className="group relative bg-white border-2 border-gray-100 hover:border-[#ff9640] rounded-[20px] p-6 sm:p-9 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0px_16px_40px_rgba(255,150,64,0.12)] transition-all duration-300 ease-out hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-[32px] sm:text-[40px] font-extrabold text-[#ff9640]/40 group-hover:text-[#ff9640] transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[22px] sm:text-[24px] font-extrabold text-[#131b2e] tracking-tight group-hover:text-[#ff9640] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[15px] font-semibold text-[#ff8624] mt-1">
                        {item.shortDesc}
                      </p>
                      <p className="text-[15px] sm:text-[16px] text-[#625e56] font-normal leading-relaxed mt-2.5">
                        {item.desc}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        {item.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[13px] font-medium text-[#131b2e]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#fff7ed]/50 border-y border-[#fed7aa]/40 py-16 lg:py-20">
          <div className="max-w-[1040px] mx-auto px-6 lg:px-12">
            <div className="text-center max-w-[620px] mx-auto mb-12">
              <span className="text-[13px] font-bold text-[#944b00] tracking-wider uppercase font-sans">
                Khác biệt rõ rệt
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#131b2e] tracking-tight mt-1">
                Tại sao cách này hợp với bạn hơn?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                    ✕
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-500">
                    Cách đọc code thông thường
                  </h3>
                </div>
                <ul className="space-y-3.5 text-[15px] text-[#625e56]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Tải hàng trăm MB thư viện, cấu hình môi trường mệt mỏi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Lạc lối giữa hàng trăm file `controller`, `service`, `dto`.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Tài liệu toàn chữ chuyên ngành khó hiểu như tiếng sao Hỏa.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>Học vẹt thuộc lòng xong ngày mai quên sạch.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-7 border-2 border-[#ff9640] shadow-[0px_8px_24px_rgba(255,150,64,0.12)] relative overflow-hidden">
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#ff9640] text-white text-[11px] font-bold uppercase tracking-wider">
                  Khuyên dùng
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fff0e6] border border-[#fed7aa] flex items-center justify-center text-[#ff9640] font-bold">
                    ✓
                  </div>
                  <h3 className="text-[18px] font-extrabold text-[#131b2e]">
                    Đồng hành cùng SimpliFey
                  </h3>
                </div>
                <ul className="space-y-3.5 text-[15px] text-[#131b2e] font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#ff9640] font-bold shrink-0 mt-0.5">✔</span>
                    <span>Mở web dán link là chạy ngay, 0 giây cài đặt.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#ff9640] font-bold shrink-0 mt-0.5">✔</span>
                    <span>Tập trung vào 1 câu chuyện cụ thể: Người dùng bấm mua hàng thì code chạy đâu?</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#ff9640] font-bold shrink-0 mt-0.5">✔</span>
                    <span>Giải thích bằng ví dụ đời thực, ví von dễ liên tưởng.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#ff9640] font-bold shrink-0 mt-0.5">✔</span>
                    <span>Hiểu sâu kiến trúc và tự tin làm chủ dự án trọn vẹn.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[960px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="text-center mb-12">
            <span className="text-[13px] font-bold text-[#944b00] tracking-wider uppercase font-sans">
              Câu hỏi thường gặp
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#131b2e] tracking-tight mt-1">
              Bạn vẫn còn thắc mắc?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#ff9640]/60 transition-colors"
              >
                <h3 className="text-[17px] font-bold text-[#131b2e] flex items-center gap-2.5">
                  <Lightbulb className="w-4 h-4 text-[#ff9640] shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="mt-2.5 text-[15px] text-[#625e56] leading-relaxed pl-6.5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-linear-to-r from-[#131b2e] to-[#25324d] rounded-[24px] p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ff9640]/20 rounded-full blur-2xl" />
            <h3 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight relative z-10">
              Sẵn sàng thử tài hiểu code ngay hôm nay?
            </h3>
            <p className="text-[16px] text-gray-300 max-w-[540px] mx-auto mt-2.5 relative z-10">
              Bắt đầu với bất kỳ repo nào bạn thấy thích. Hoàn toàn miễn phí và không cần kiến thức lập trình chuyên sâu.
            </p>
            <div className="mt-8 flex justify-center relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[15px] rounded-[14px] shadow-[0px_8px_20px_rgba(255,150,64,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Bắt đầu trải nghiệm ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
