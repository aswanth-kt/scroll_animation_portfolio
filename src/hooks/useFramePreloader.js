import { useEffect, useMemo, useRef, useState } from "react";

const TOTAL_FRAMES = 270;
const PRIORITY_FRAMES = 28;

export function frameSrc(frame) {
  return `/animationAssets/ezgif-frame-${String(frame).padStart(3, "0")}.jpg`;
}

export function useFramePreloader() {
  const imagesRef = useRef(new Map());
  const [loaded, setLoaded] = useState(0);
  const [priorityReady, setPriorityReady] = useState(false);

  const frameOrder = useMemo(() => {
    const priority = Array.from({ length: PRIORITY_FRAMES }, (_, i) => i + 1);
    const rest = Array.from({ length: TOTAL_FRAMES - PRIORITY_FRAMES }, (_, i) => i + PRIORITY_FRAMES + 1);
    return [...priority, ...rest];
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    let priorityCount = 0;

    frameOrder.forEach((frame) => {
      const img = new Image();
      let counted = false;
      imagesRef.current.set(frame, img);

      const markLoaded = () => {
        if (cancelled || counted) return;
        counted = true;
        loadedCount += 1;
        if (frame <= PRIORITY_FRAMES) priorityCount += 1;
        setLoaded(loadedCount);
        if (priorityCount >= PRIORITY_FRAMES) setPriorityReady(true);
      };

      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.decoding = "async";
      img.src = frameSrc(frame);

      if (img.complete) queueMicrotask(markLoaded);
    });

    return () => {
      cancelled = true;
    };
  }, [frameOrder]);

  return {
    images: imagesRef,
    loaded,
    priorityReady,
    total: TOTAL_FRAMES,
  };
}
