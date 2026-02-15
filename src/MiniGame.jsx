import { motion } from "framer-motion";
import { useState } from "react";

export default function MiniGame({ onAccept }) {
  const [noStyle, setNoStyle] = useState({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  });

  const [chaosText, setChaosText] = useState("");

  const handleNo = () => {
    setNoStyle({
      x: Math.random() * 300 - 150,
      y: Math.random() * 200 - 100,
      rotate: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.7,
    });

    const texts = [
      "Yakin ga sayang? 😏",
      "Coba jawab yang jujur 🤨",
      "Masa sih tidak? 🙄",
      "Aku tau kamu sayang 😌",
    ];

    setChaosText(texts[Math.floor(Math.random() * texts.length)]);
  };

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 relative">
      
      {/* Glow Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-[0_0_80px_rgba(255,182,193,0.6)] border border-white/20"
      >
        <h1 className="text-4xl sm:text-6xl font-bold mb-10 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent">
          Kamu Sayang Aku Ga? 🤍
        </h1>

        <div className="relative h-32 flex items-center justify-center gap-12">

          {/* YES BUTTON */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAccept}
            className="px-10 py-4 bg-white text-rose-600 rounded-full font-bold text-lg shadow-xl"
          >
            Iya 🤍
          </motion.button>

          {/* NO BUTTON */}
          <motion.button
            animate={noStyle}
            transition={{ type: "spring", stiffness: 200 }}
            onMouseEnter={handleNo}
            onClick={handleNo}
            className="px-10 py-4 bg-rose-800 text-white rounded-full font-bold text-lg shadow-xl"
          >
            Tidak 🙈
          </motion.button>
        </div>

        {chaosText && (
          <p className="mt-6 text-rose-100">{chaosText}</p>
        )}
      </motion.div>
    </section>
  );
}
