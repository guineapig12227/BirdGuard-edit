"use client";

import { useLayoutEffect, useRef } from "react";

export function useScrollReveal(screenKey: string) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (motion.matches || targets.length === 0) return;

    const pending = new Set(targets);
    const inView = new Set<HTMLElement>();
    const startY = window.scrollY;

    const canScroll = () =>
      document.documentElement.scrollHeight > window.innerHeight + 2;

    let scrollUnlocked = !canScroll();
    let disposed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed) return;

        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            inView.add(element);

            if (element.dataset.reveal !== "scroll" || scrollUnlocked) {
              reveal(element);
            }
          } else {
            inView.delete(element);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    function reveal(element: HTMLElement) {
      if (!pending.delete(element)) return;

      element.dataset.revealState = "visible";
      inView.delete(element);
      observer.unobserve(element);
    }

    // 아래로 스크롤한 뒤 사진 등록 영역을 표시합니다.
    function unlockScroll() {
      if (scrollUnlocked) return;
      if (window.scrollY <= startY + 8 && canScroll()) return;

      scrollUnlocked = true;
      inView.forEach(reveal);

      window.removeEventListener("scroll", unlockScroll);
      window.removeEventListener("resize", unlockScroll);
    }

    // 키보드로 접근하는 입력창과 버튼은 바로 표시합니다.
    function handleFocus(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest<HTMLElement>("[data-reveal]");
      if (element) reveal(element);
    }

    function cleanup() {
      disposed = true;
      observer.disconnect();

      window.removeEventListener("scroll", unlockScroll);
      window.removeEventListener("resize", unlockScroll);
      root?.removeEventListener("focusin", handleFocus);
      motion.removeEventListener("change", handleMotionChange);

      targets.forEach((element) => {
        element.removeAttribute("data-reveal-state");
      });
    }

    function handleMotionChange() {
      if (motion.matches) cleanup();
    }

    targets.forEach((element) => {
      element.dataset.revealState = "pending";
      observer.observe(element);
    });

    if (
      !scrollUnlocked &&
      targets.some((element) => element.dataset.reveal === "scroll")
    ) {
      window.addEventListener("scroll", unlockScroll, { passive: true });
      window.addEventListener("resize", unlockScroll);
    }

    root.addEventListener("focusin", handleFocus);
    motion.addEventListener("change", handleMotionChange);

    return cleanup;
  }, [screenKey]);

  return rootRef;
}