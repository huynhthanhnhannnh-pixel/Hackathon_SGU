import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#ff9640]/20 selection:text-[#944b00]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="font-mono text-[72px] sm:text-[96px] font-extrabold text-[#ff9640]/50 leading-none">
          404
        </span>
        <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#131b2e] tracking-tight mt-4">
          Trang bạn tìm không tồn tại
        </h1>
        <p className="text-[16px] text-[#625e56] mt-2 max-w-[460px]">
          Có vẻ như đường dẫn này chưa sẵn sàng hoặc đã được chuyển sang nơi khác.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff9640] hover:bg-[#ff8624] text-white font-bold text-[14px] rounded-[12px] shadow-sm hover:shadow transition-all"
          >
            Quay lại Trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
