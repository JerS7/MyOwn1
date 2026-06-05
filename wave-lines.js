
(() => {
  const box = document.querySelector(".footer-wave");
  if (!box) return;

  const c = document.createElement("canvas");
  c.setAttribute("aria-hidden", "true");
  Object.assign(c.style, {
    position: "absolute", inset: 0,
    width: "100%", height: "100%", pointerEvents: "none"
  });
  box.prepend(c);
  const ctx = c.getContext("2d");

  let W, H, dpr, t = 0;

  const LINE_COUNT = 12;
  const SPEED      = 0.3;
  const AMPLITUDE  = 25;
  const FREQUENCY  = 0.015;

  function sz() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = box.clientWidth;
    H = box.clientHeight;
    c.width  = W * dpr;
    c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  sz();
  addEventListener("resize", sz, { passive: true });

  function noise(x) {
    return Math.sin(x * 0.7) * 0.5 + Math.sin(x * 1.3) * 0.3 + Math.sin(x * 2.1) * 0.2;
  }

  function draw() {
    t += SPEED * 0.016;
    ctx.clearRect(0, 0, W, H);

    const lineSpacing = H / (LINE_COUNT + 1);

    for (let i = 0; i < LINE_COUNT; i++) {
      const baseY = lineSpacing * (i + 1);
      const progress = i / LINE_COUNT;

      const edgeFade = Math.sin(progress * Math.PI);
      const alpha = 0.15 + 0.25 * edgeFade;

      ctx.strokeStyle = `rgba(212, 112, 58, ${alpha})`;
      ctx.lineWidth = 1.5 + edgeFade * 0.8;
      ctx.beginPath();

      for (let x = 0; x <= W; x += 3) {
        const wave1 = Math.sin(x * FREQUENCY + t * 2 + i * 0.5) * AMPLITUDE;
        const wave2 = Math.sin(x * FREQUENCY * 1.8 + t * 1.5 + i * 0.8) * AMPLITUDE * 0.5;
        const wave3 = noise(x * 0.01 + t + i * 0.3) * AMPLITUDE * 0.3;
        const y = baseY + wave1 + wave2 + wave3;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
