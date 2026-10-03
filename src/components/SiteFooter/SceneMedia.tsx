// Copied verbatim from esy.com, src/components/FooterWorld/SceneMedia.tsx (main at a26c26d1, 2026-10-03),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
'use client';

/* A scene that loops, or doesn't.
 *
 * Two rules, handled here so no caller has to remember them:
 * 1. Reduced motion gets the still and no <video> at all — the page-wide CSS
 *    block cannot stop a looping video, so this is decided in JS, the same
 *    way RunConsole already decides it.
 * 2. A clip that is off-screen should not be decoding frames: it plays only
 *    while in view, via the site's observer idiom.
 * 3. A scene can name a viewport floor below which it stays a still — phones
 *    keep the picture and skip the download entirely.
 */

import { useEffect, useRef, useState } from 'react';

export default function SceneMedia({
  name,
  alt,
  className,
  width = 1024,
  height = 768,
  priority = false,
  motion = true,
  minWidth = 0,
}: {
  name: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /* Set false while a scene has no clip yet: a <video> whose sources 404
     falls back to its raw attribute size and drags the layout with it. */
  motion?: boolean;
  /* Viewport width (px) below which the still is served instead of the clip. */
  minWidth?: number;
}) {
  const [motionOk, setMotionOk] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!motion) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Decided once at mount, like the scrubber's frame tier: a rotation
    // mid-visit is not worth swapping media for.
    if (minWidth && window.innerWidth < minWidth) return;
    setMotionOk(true);
  }, [motion, minWidth]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Not disconnected on first hit: this keeps working in both
        // directions for the life of the page.
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motionOk]);

  const poster = `/brand/scenes/${name}.webp`;

  if (!motionOk) {
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? 'metadata' : 'none'}
      aria-label={alt}
    >
      <source src={`/brand/scenes/${name}.webm`} type="video/webm" />
      <source src={`/brand/scenes/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
