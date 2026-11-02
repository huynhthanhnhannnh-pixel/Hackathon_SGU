"use client";

import React, { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";

interface CharacterAvatarProps {
  className?: string;
  size?: number;
}

export function CharacterAvatar({
  className = "",
  size = 120,
}: CharacterAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/character-walking.json",
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`flex items-center justify-center shrink-0 select-none ${className}`}
      title="Người bạn đồng hành"
    />
  );
}
