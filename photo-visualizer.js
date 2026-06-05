
(() => {
  const canvas = document.querySelector(".photo-visualizer");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, dpr, t = 0;

  const BAR_COUNT = 36;
  const BAR_WIDTH = 2.5;
  const MIN_HEIGHT = 6;
  const MAX_HEIGHT = 22;
  const RADIUS = 58;
  const SPEED = 1.5;

  function sz() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  sz();
  window.addEventListener("resize", sz, { passive: true });

  function noise(x) {
    return Math.sin(x * 1.2) * 0.4 + Math.sin(x * 2.7) * 0.3 + Math.sin(x * 4.1) * 0.3;
  }

  function draw() {
    t += SPEED * 0.016;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const angleStep = (Math.PI * 2) / BAR_COUNT;

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = i * angleStep - Math.PI / 2;

      const noiseVal = noise(i * 0.5 + t * 2);
      const barHeight = MIN_HEIGHT + (noiseVal + 1) * 0.5 * (MAX_HEIGHT - MIN_HEIGHT);

      const x1 = cx + Math.cos(angle) * RADIUS;
      const y1 = cy + Math.sin(angle) * RADIUS;
      const x2 = cx + Math.cos(angle) * (RADIUS + barHeight);
      const y2 = cy + Math.sin(angle) * (RADIUS + barHeight);

      ctx.strokeStyle = "rgba(212, 112, 58, 0.5)";
      ctx.lineWidth = BAR_WIDTH;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
