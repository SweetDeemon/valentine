import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export default function Valentine({ audioRef }) {
  const photos = Array.from(
    { length: 10 },
    (_, i) => `/photos/foto${i + 1}.jpg`
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);

  /* ===== STABLE GLITTER (NO RE-RENDER LAG) ===== */
  const glitter = useRef(
    Array.from({ length: 25 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 6,
    }))
  );

  /* AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  /* MUSIC CONTROL */
  const toggleMusic = async () => {
    if (!audioRef?.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        audio.volume = 0.9;
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("User interaction required.");
      }
    }
  };

  /* VIDEO SYNC */
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

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">

      {/* ===== LIGHTWEIGHT BACKGROUND ===== */}
      <motion.div
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="fixed inset-0 -z-50 bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500"
      />

      {/* SOFT LIGHT (REDUCED BLUR FOR IOS) */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-white/30 blur-[120px] rounded-full -z-40" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[700px] h-[700px] bg-rose-400/30 blur-[120px] rounded-full -z-40" />

      {/* ===== SMOOTH GLITTER ===== */}
      {glitter.current.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -10, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className="fixed rounded-full bg-white will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}

      {/* ===== MUSIC BUTTON ===== */}
      <div className="fixed top-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="px-5 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.5)] text-white font-semibold"
        >
          {isPlaying ? "Pause 🎵" : "Play 🎵"}
        </motion.button>
      </div>

      {/* ===== HERO ===== */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-5xl sm:text-8xl font-extrabold bg-gradient-to-r from-white via-pink-100 to-rose-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] will-change-transform">
          Happy Valentine 💖
        </h1>

        <p className="mt-8 text-lg sm:text-2xl max-w-xl text-white/95">
          Every moment with you feels like a blooming rose.
        </p>
      </motion.section>

      {/* ===== OUR JOURNEY ===== */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-28 text-center px-6"
      >
        <h2 className="text-4xl sm:text-6xl font-semibold mb-14">
          Our Journey
        </h2>

        <div
          onClick={() => setSelectedIndex(activeIndex)}
          className="mx-auto max-w-4xl aspect-[16/9] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(255,105,180,0.5)] cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={photos[activeIndex]}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
              style={{ backfaceVisibility: "hidden" }}
            />
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ===== VIDEO OPTIMIZED ===== */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-32 text-center px-6"
      >
        <h2 className="text-4xl sm:text-6xl font-semibold mb-14">
          A Special Moment 🎥
        </h2>

        <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(255,105,180,0.5)] backdrop-blur-md border border-white/30">
          <div className="aspect-[9/16] bg-black">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              style={{ transform: "translateZ(0)" }}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoPause}
            >
              <source src="/videos/video1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </motion.section>

      {/* ===== CTA ===== */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 text-center"
      >
        <Link
          to="/forever"
          className="px-16 py-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_0_60px_rgba(255,105,180,0.8)] text-lg font-semibold"
        >
          Continue Our Forever 💍
        </Link>
      </motion.section>

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.img
              src={photos[selectedIndex]}
              className="max-h-[90vh] max-w-[90vw] rounded-3xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
