import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Forever() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">

      {/* Dreamy Background */}
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-rose-200 via-pink-300 to-fuchsia-400" />

      {/* Glow */}
      <div className="absolute w-[600px] h-[600px] bg-white/30 blur-[200px] rounded-full" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5 }}
        className="flex flex-col items-center text-center px-6"
      >
        <div className="heart-ultra" />

        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="mt-20"
          >
            <h1 className="text-4xl sm:text-7xl font-extrabold drop-shadow-[0_0_60px_rgba(255,255,255,0.9)]">
              I Always Choose You.
            </h1>
            <p className="mt-10 text-xl sm:text-2xl text-rose-100 max-w-3xl mx-auto leading-relaxed tracking-wide">
                            Not just for a moment.
                            Not just for a season.
                            But for every sunrise we will ever see together.
                            <br /><br />
                            In every lifetime.
                            In every version of reality.
                            My heart finds yours.
                        </p>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="mt-14"
            >
              <Link
                to="/"
                className="px-14 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600
                           shadow-[0_0_60px_rgba(255,105,180,0.9)]
                           text-lg font-semibold"
              >
                Back To Our Story 💖
              </Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        .heart-ultra {
          width: 250px;
          height: 250px;
          background: linear-gradient(145deg, #ff8fc1, #d1004f);
          transform: rotate(-45deg);
          position: relative;
          box-shadow: 0 0 200px rgba(255,105,180,0.9);
          animation: pulse 4s infinite ease-in-out;
        }

        .heart-ultra::before,
        .heart-ultra::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          background: inherit;
          border-radius: 50%;
        }

        .heart-ultra::before { top: -125px; left: 0; }
        .heart-ultra::after { left: 125px; top: 0; }

        @keyframes pulse {
          0% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.12); }
          100% { transform: rotate(-45deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
