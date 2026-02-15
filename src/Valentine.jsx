import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Valentine({ audioRef }) {
  const photos = Array.from(
    { length: 10 },
    (_, i) => `/photos/foto${i + 1}.jpg`
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const startX = useRef(0);

  /* ================= CANVAS GLITTER ================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "white";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (previewIndex !== null) return; // pause when preview open

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [previewIndex]);

  /* ================= MUSIC ================= */
  const toggleMusic = async () => {
    if (!audioRef?.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {}
    }
  };

  /* ================= VIDEO SYNC ================= */
  const handleVideoPlay = () => {
    if (audioRef?.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const handleVideoPause = () => {
    if (audioRef?.current && isPlaying) {
      audioRef.current.play();
    }
  };

  /* ================= SWIPE ================= */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, isPreview = false) => {
    const diff = startX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) < 40) return; // prevent accidental swipe

    if (diff > 0) {
      isPreview
        ? setPreviewIndex((prev) =>
            prev === photos.length - 1 ? 0 : prev + 1
          )
        : setActiveIndex((prev) =>
            prev === photos.length - 1 ? 0 : prev + 1
          );
    } else {
      isPreview
        ? setPreviewIndex((prev) =>
            prev === 0 ? photos.length - 1 : prev - 1
          )
        : setActiveIndex((prev) =>
            prev === 0 ? photos.length - 1 : prev - 1
          );
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-40 pointer-events-none" />

      {/* MUSIC BUTTON */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50
                   w-14 h-14 rounded-full
                   bg-white/20 backdrop-blur-xl border border-white/40
                   shadow-[0_0_30px_rgba(255,255,255,0.7)]
                   flex items-center justify-center text-xl"
      >
        {isPlaying ? "🎵" : "🎶"}
      </button>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl sm:text-8xl font-extrabold
                       bg-gradient-to-r from-white via-pink-100 to-rose-200
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_80px_rgba(255,255,255,0.9)]">
          Happy Valentine ❤️
        </h1>

        <p className="mt-8 text-lg sm:text-2xl max-w-xl">
          With you, every moment feels like magic.
        </p>
      </section>

      {/* OUR JOURNEY */}
      <section className="py-28 text-center px-6">
        <h2 className="text-4xl sm:text-6xl font-semibold mb-16">
          Our Journey
        </h2>

        {/* MAIN IMAGE */}
        <div
          onClick={() => setPreviewIndex(activeIndex)}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, false)}
          className="mx-auto max-w-5xl aspect-[16/9]
                     rounded-[40px] overflow-hidden
                     shadow-[0_40px_120px_rgba(255,105,180,0.5)]
                     cursor-pointer"
        >
          <motion.img
            key={activeIndex}
            src={photos[activeIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* MINI THUMBNAILS */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-4 overflow-x-auto px-4 py-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-20 h-28 rounded-xl overflow-hidden cursor-pointer
                ${
                  activeIndex === index
                    ? "ring-4 ring-white scale-105"
                    : "opacity-60"
                }`}
              >
                <img src={photo} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl sm:text-6xl font-semibold mb-14">
          A Special Moment 🎥
        </h2>

        <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden
                        shadow-[0_50px_150px_rgba(255,105,180,0.6)]
                        backdrop-blur-xl border border-white/30">
          <div className="aspect-[9/16] bg-black">
            <video
              ref={videoRef}
              controls
              playsInline
              className="w-full h-full object-cover"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            >
              <source src="/videos/video1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <AnimatePresence>
        {previewIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={() => setPreviewIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, true)}
          >
            <motion.img
              key={previewIndex}
              src={photos[previewIndex]}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-h-[95vh] max-w-[95vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ROMANTIC MESSAGE */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3
            className="text-3xl sm:text-5xl font-semibold
                       bg-gradient-to-r from-white via-pink-100 to-rose-200
                       bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            You Are My Forever.
          </h3>

          <p
            className="mt-12 text-lg sm:text-xl leading-relaxed"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            In your presence, time feels softer.
            The world quiets, and my heart finds its rhythm.
            <br /><br />
            Love with you is not loud —
            it is steady, gentle, and endlessly certain.
            <br /><br />
            And in every lifetime,
            my heart will always return to you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <Link
          to="/forever"
          className="px-20 py-6 rounded-full
                     bg-gradient-to-r from-rose-500 to-pink-600
                     shadow-[0_0_100px_rgba(255,105,180,0.9)]
                     text-xl font-semibold"
        >
          Continue Our Forever 💍
        </Link>
      </section>

    </div>
  );
}
