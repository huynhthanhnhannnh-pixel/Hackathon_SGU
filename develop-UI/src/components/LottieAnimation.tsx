"use client";

import React, { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieAnimation({
  animationPath,
  className = "",
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      path: animationPath,
    });

    return () => {
      anim.destroy();
    };
  }, [animationPath, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={`flex items-center justify-center select-none ${className}`}
    />
  );
}
