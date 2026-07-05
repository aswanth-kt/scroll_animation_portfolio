import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { frameSrc, useFramePreloader } from "../hooks/useFramePreloader";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 270;

function drawCover(ctx, img, canvas) {
  if (!img || !img.complete || !img.naturalWidth) return;

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}

export default function FrameSequenceCanvas() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const currentFrameRef = useRef(1);
  const { images, loaded, priorityReady, total } = useFramePreloader();

  useEffect(() => {
    if (!priorityReady) return undefined;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const triggerElement = wrapper?.closest("section");
    if (!canvas || !wrapper || !triggerElement) return undefined;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawCover(ctx, images.current.get(currentFrameRef.current), canvas);
    };

    const renderFrame = (frame) => {
      const mobileStep = isMobile ? 3 : 1;
      const stepped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frame / mobileStep) * mobileStep));
      if (stepped === currentFrameRef.current) return;
      currentFrameRef.current = stepped;
      drawCover(ctx, images.current.get(stepped), canvas);
    };

    const first = images.current.get(1) || new Image();
    if (!first.src) first.src = frameSrc(1);
    first.onload = () => {
      images.current.set(1, first);
      resize();
      drawCover(ctx, first, canvas);
    };
    resize();
    drawCover(ctx, first, canvas);

    window.addEventListener("resize", resize);

    if (reduceMotion) {
      return () => window.removeEventListener("resize", resize);
    }

    const trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top top",
      end: isMobile ? "+=1800" : "+=3000",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const frame = Math.round(self.progress * (TOTAL_FRAMES - 1)) + 1;
        renderFrame(frame);
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
    };
  }, [images, priorityReady]);

  const percent = Math.round((loaded / total) * 100);
  const showLoader = !priorityReady && percent < 100;

  return (
    <div ref={wrapperRef} className="absolute inset-0 -z-10 bg-ink">
      <canvas ref={canvasRef} className="block h-screen w-screen opacity-55" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,39,64,0.92),rgba(15,39,64,0.66),rgba(15,39,64,0.86))]" />
      {showLoader && (
        <div className="absolute inset-0 grid place-items-center bg-ink">
          <div className="w-64 font-display text-xs uppercase tracking-[0.18em] text-paper">
            <div className="mb-3 flex justify-between">
              <span>Loading survey frames</span>
              <span className="text-signal">{percent}%</span>
            </div>
            <div className="h-1 bg-line/40">
              <div className="h-full bg-signal" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
