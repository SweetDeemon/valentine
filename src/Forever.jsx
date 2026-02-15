import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Forever({ audioRef }) {

  const [showText, setShowText] = useState(false);
  const canvasRef = useRef(null);

  /* ================= ENTRY ================= */
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 2000);

    if (audioRef?.current) {
      audioRef.current.volume = 0.6;
    }

    return () => clearTimeout(timer);
  }, []);

  /* ================= SOFT GLITTER ================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-white text-center px-6"
    >

      {/* Background */}
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500" />

      {/* Glitter */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-40 pointer-events-none"
      />

      {/* Ambient Glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-[600px] h-[600px] bg-white/30 blur-[180px] rounded-full"
      />

      <div className="relative z-10">

        {/* Animated Heart */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="relative mb-16 flex justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="heart-glow"
          />
        </motion.div>

        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]">
                I Always Choose You
              </h1>

              <p className="max-w-2xl mx-auto mb-14 text-lg sm:text-xl leading-relaxed text-rose-100">
                In every lifetime.  
                In every universe.  
                Through every version of reality —  
                my heart still finds yours.
              </p>

              {/* Luxury CTA */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-block"
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 blur-xl rounded-full bg-white/40"
                />

                <Link
                  to="/"
                  state={{ fromForever: true }}
                  className="relative px-10 py-4 rounded-full
                             bg-white text-rose-600 font-semibold shadow-xl"
                >
                  Back To Our Story 🤍
                </Link>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .heart-glow {
          width: 200px;
          height: 200px;
          background: linear-gradient(145deg, #ff9ac8, #d1004f);
          transform: rotate(-45deg);
          position: relative;
          box-shadow: 0 0 120px rgba(255,105,180,0.8);
        }

        .heart-glow::before,
        .heart-glow::after {
          content: "";
          position: absolute;
          width: 200px;
          height: 200px;
          background: inherit;
          border-radius: 50%;
        }

        .heart-glow::before { top: -100px; left: 0; }
        .heart-glow::after { left: 100px; top: 0; }
      `}</style>

    </motion.div>
  );
}
