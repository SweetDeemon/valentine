import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Valentine({ audioRef }) {

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const photos = Array.from(
    { length: 14 },
    (_, i) => `/photos/foto${i + 1}.jpg`
  );

  const [stage, setStage] = useState("game");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroFade, setHeroFade] = useState(false);
  const [noText, setNoText] = useState("Tidak 🙈");
  
  const galleryRef = useRef(null);

  /* ================= ENTRY CONTROL ================= */
  useEffect(() => {
    if (location.state?.fromForever) {
      setStage("main");

      setTimeout(() => {
        galleryRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 600);

      // Reset router state supaya tidak kebawa refresh
      navigate("/", { replace: true, state: null });
    } else {
      setStage("game");
    }
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (stage !== "main" || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [stage, isPaused, photos.length]);

  /* ================= HERO → GALLERY ================= */
  useEffect(() => {
    if (stage === "main" && !location.state?.fromForever) {

      const fadeTimer = setTimeout(() => {
        setHeroFade(true);
      }, 1800);

      const scrollTimer = setTimeout(() => {
        galleryRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 2200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [stage]);

  /* ================= YES ================= */
  const handleYes = async () => {
    setStage("popup1");

    if (audioRef?.current) {
      try {
        audioRef.current.volume = 0;
        await audioRef.current.play();

        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.6) {
            vol = 0.6;
            clearInterval(fade);
          }
          audioRef.current.volume = vol;
        }, 150);
      } catch {}
    }

    setTimeout(() => setStage("popup2"), 2000);
    setTimeout(() => setStage("main"), 4000);
  };

  /* ================= NO (FUNNY TEXT) ================= */
  const handleNo = () => {
    const texts = [
      "Yakin? 🥺",
      "Masa sih? 😭",
      "Aku sedih loh 😢",
      "Coba klik iya aja 🤍",
      "Jangan gitu dong 🙈"
    ];

    setNoText(texts[Math.floor(Math.random() * texts.length)]);
  };

  const handleVideoPlay = () => {
    audioRef?.current?.pause();
  };

  const handleVideoPause = () => {
    audioRef?.current?.play().catch(() => {});
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700" />

      {/* ================= MINI GAME ================= */}
      <AnimatePresence>
        {stage === "game" && (
          <motion.section
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-xl p-14 rounded-3xl text-center shadow-xl border border-white/20">
              <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent">
                Kamu Sayang Aku Ga? 🤍
              </h1>

              <div className="flex justify-center gap-8">
                <button
                  onClick={handleYes}
                  className="px-10 py-4 bg-white text-rose-600 rounded-full font-bold shadow-lg"
                >
                  Iya 🤍
                </button>

                <button
                  onClick={handleNo}
                  className="px-10 py-4 bg-rose-800 text-white rounded-full font-bold shadow-lg"
                >
                  {noText}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= POPUPS ================= */}
      <AnimatePresence>
        {(stage === "popup1" || stage === "popup2") && (
          <motion.div
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-white/20 backdrop-blur-2xl rounded-3xl px-14 py-12 text-center shadow-xl border border-white/30"
            >
              <h2 className="text-3xl font-bold">
                {stage === "popup1"
                  ? "Aku juga sayang sama kamu 🤍"
                  : "Happy Valentine Sayang 🤍"}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN ================= */}
      {stage === "main" && (
        <>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{
              opacity: heroFade ? 0 : 1,
              scale: heroFade ? 1.05 : 1,
            }}
            transition={{ duration: 1.2 }}
            className="min-h-screen flex items-center justify-center text-center px-6"
          >
            <h1 className="text-5xl sm:text-8xl font-bold bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent">
              With you, forever feels real 🤍
            </h1>
          </motion.section>

          {/* ================= MAGICAL OUR JOURNEY ================= */}
<motion.section
  ref={galleryRef}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
  className="py-32 text-center relative overflow-hidden"
>

  {/* Ambient Glow */}
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ repeat: Infinity, duration: 6 }}
    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
               bg-white/20 blur-[160px] rounded-full -z-10"
  />

  {/* Floating Title */}
  <motion.h2
    initial={{ y: -40, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    className="text-4xl sm:text-6xl mb-20 text-rose-100"
  >
    <motion.span
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 5 }}
      className="inline-block"
    >
      Our Journey ✨
    </motion.span>
  </motion.h2>

  {/* MAIN IMAGE CINEMATIC CROSSFADE */}
  <div className="relative mx-auto max-w-5xl">
    <AnimatePresence mode="wait">
      <motion.img
        key={photos[activeIndex]}
        src={photos[activeIndex]}
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8 }}
        className="w-auto max-w-full max-h-[75vh] object-contain 
                   rounded-3xl shadow-[0_30px_120px_rgba(255,255,255,0.25)] mx-auto"
      />
    </AnimatePresence>
  </div>

  {/* THUMBNAILS POLAROID STYLE */}
  <div className="mt-20 flex gap-6 overflow-x-auto px-6 justify-start">

    {photos.map((photo, index) => (
      <motion.div
        key={index}
        initial={{
          opacity: 0,
          y: 80,
          rotate: Math.random() * 20 - 10
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotate: Math.random() * 4 - 2
        }}
        transition={{
          duration: 0.8,
          delay: index * 0.05
        }}
        viewport={{ once: true }}
        whileHover={{
          scale: 1.15,
          rotate: 0,
          boxShadow: "0px 20px 40px rgba(255,255,255,0.3)"
        }}
        onClick={() => {
          setActiveIndex(index);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
        className={`relative w-28 h-40 bg-white rounded-xl p-2 flex-shrink-0 cursor-pointer transition-all ${
          activeIndex === index
            ? "ring-4 ring-rose-300 scale-110"
            : ""
        }`}
      >
        <img
          src={photo}
          className="w-full h-full object-cover rounded-lg"
          alt=""
        />

        {/* Soft floating effect */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: index * 0.2 }}
          className="absolute inset-0 rounded-xl"
        />
      </motion.div>
    ))}

  </div>

</motion.section>



          {/* ================= CINEMATIC VIDEO SECTION ================= */}
<motion.section
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
  className="py-32 text-center relative overflow-hidden"
>

  {/* Ambient Glow Background */}
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ repeat: Infinity, duration: 6 }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               w-[500px] h-[500px] bg-white/20 blur-[140px] rounded-full -z-10"
  />

  {/* Animated Title */}
  <motion.h2
    initial={{ y: -40, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    className="text-4xl sm:text-6xl mb-16 text-rose-100"
  >
    <motion.span
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 5 }}
      className="inline-block"
    >
      A Special Moment 🎬
    </motion.span>
  </motion.h2>

  {/* Video Frame */}
  <motion.div
    initial={{ scale: 0.9, rotate: -1 }}
    whileInView={{ scale: 1, rotate: 0 }}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative max-w-md mx-auto rounded-3xl overflow-hidden
               shadow-[0_40px_120px_rgba(255,255,255,0.25)]
               border border-white/30 backdrop-blur-md"
  >

    {/* Soft Moving Shine Effect */}
    <motion.div
      animate={{ x: ["-100%", "100%"] }}
      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    />

    <div className="aspect-[9/16] bg-black relative">
      <video
        controls
        playsInline
        className="w-full h-full object-cover relative z-10"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
      </video>
    </div>
  </motion.div>

</motion.section>


          {/* ROMANTIC MESSAGE */}
          <section className="py-28 px-6 text-center">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-xl">
              <h3 className="text-3xl sm:text-4xl mb-6">
                You Are My Always
              </h3>

              <p className="mb-8 text-rose-100">
                Loving you isn’t just a feeling —
                it’s the forever I choose every single day.
              </p>

              <Link
                to="/forever"
                className="px-6 py-3 bg-white text-rose-600 rounded-full text-sm font-semibold"
              >
                Forever 🤍
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
