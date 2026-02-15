import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function GallerySection() {
  const photos = Array.from(
    { length: 6 },
    (_, i) => `/photos/foto${i + 1}.jpg`
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-24 text-center">
      <h2 className="text-4xl sm:text-6xl font-semibold text-rose-100 mb-16">
        Our Journey
      </h2>

      <div className="max-w-6xl mx-auto px-6">

        <div className="relative mx-auto max-w-4xl rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={photos[activeIndex]}
              src={photos[activeIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-auto max-w-full max-h-[70vh] object-contain"
            />
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setActiveIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className={`w-20 h-32 rounded-xl overflow-hidden cursor-pointer ${
                activeIndex === index
                  ? "ring-4 ring-white"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={photo}
                className="w-full h-full object-cover"
                alt=""
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
