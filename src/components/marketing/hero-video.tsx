"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying, looping, muted background video for the hero.
 * `muted` is forced via the ref because React/SSR doesn't always emit the
 * muted attribute, and browsers block autoplay for non-muted video.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const play = video.play();
    if (play) play.catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/videos/hero-trading.mp4" type="video/mp4" />
    </video>
  );
}
