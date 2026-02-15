import { Routes, Route } from "react-router-dom";
import { useRef } from "react";
import Valentine from "./Valentine";
import Forever from "./Forever";
import aboutYou from "./assets/about-you.mp3"; // ⬅️ WAJIB IMPORT

export default function App() {
  const audioRef = useRef(null);

  return (
    <>
      <Routes>
        <Route path="/" element={<Valentine audioRef={audioRef} />} />
        <Route path="/forever" element={<Forever audioRef={audioRef} />} />
      </Routes>

      {/* GLOBAL AUDIO */}
<audio
  ref={audioRef}
  src={aboutYou}
  loop
  preload="metadata"
  crossOrigin="anonymous"
/>
    </>
  );
}
