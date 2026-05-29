import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { api } from "../services/api";
import { assetUrl } from "../utils/imageUrl";

const INTERVAL = 5000;

export function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex]     = useState(0);
  const [dir, setDir]         = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef(null);

  useEffect(() => {
    api.get("/banners")
      .then(r => setBanners(r.data.banners || []))
      .catch(() => setBanners([]));
  }, []);

  const go = useCallback((next, direction) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = useCallback(() => {
    go((index - 1 + banners.length) % banners.length, -1);
  }, [index, banners.length, go]);

  const next = useCallback(() => {
    go((index + 1) % banners.length, 1);
  }, [index, banners.length, go]);

  // auto-advance
  useEffect(() => {
    if (banners.length < 2) return;
    timerRef.current = setInterval(() => {
      setDir(1);
      setIndex(i => (i + 1) % banners.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  if (!banners.length) return (
    <div className="rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500"
      style={{ aspectRatio: "16/7", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
      <span className="text-2xl">🖼️</span>
      <span className="text-xs">No banners yet</span>
    </div>
  );

  const banner = banners[index];

  const variants = {
    enter:  d => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   d => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: "16/7" }}>

      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* image */}
          <img
            src={assetUrl(banner.image)}
            alt={banner.title || "Banner"}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />

          {/* text */}
          {(banner.title || banner.description) && (
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 max-w-xl">
              {banner.title && (
                <p className="text-white font-black text-xl md:text-3xl leading-tight drop-shadow mb-2">
                  {banner.title}
                </p>
              )}
              {banner.description && (
                <p className="text-slate-200 text-sm md:text-base leading-relaxed drop-shadow">
                  {banner.description}
                </p>
              )}
              {banner.link && (
                <a href={banner.link}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white w-fit"
                  style={{ background: "rgba(14,165,233,0.85)", backdropFilter: "blur(6px)" }}>
                  Learn More
                </a>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            aria-label="Previous banner">
            <FiChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            aria-label="Next banner">
            <FiChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {banners.map((_, i) => (
            <button key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Go to banner ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 20 : 8,
                height: 8,
                background: i === index ? "#0EA5E9" : "rgba(255,255,255,0.45)",
              }} />
          ))}
        </div>
      )}
    </section>
  );
}
