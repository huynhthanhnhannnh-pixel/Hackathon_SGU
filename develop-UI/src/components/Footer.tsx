import React from "react";

export function Footer() {
  return (
    <footer className="bg-[#fff0e4] border-t border-[#ffe0cc] py-6">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[18px] text-[#ff9640]">
            SIMPLIFEY
          </span>
          <span className="text-[13px] text-[#554337]">
            © 2025 SimpliFey by MeoMeo Team - Hackathon 2026
          </span>
        </div>
        <div className="text-[12px] text-[#625e56]">
          Học kiến trúc mã nguồn qua phương pháp Feynman
        </div>
      </div>
    </footer>
  );
}
