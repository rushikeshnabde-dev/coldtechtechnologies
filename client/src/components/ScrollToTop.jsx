import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(null);

  useEffect(() => {
    // Fire on initial mount (refresh) AND on every route change
    scrollToTop();
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]);

  // Extra: fire once on first mount regardless of pathname change
  useEffect(() => {
    scrollToTop();
    const t = setTimeout(scrollToTop, 300);
    return () => clearTimeout(t);
  }, []);

  return null;
}
