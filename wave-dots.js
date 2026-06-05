
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

  const GAP   = 9;
  const R     = 1.4;
  const SPEED = 0.4;

  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263 + 1274126177) | 0;
    h = ((h ^ (h >> 13)) * 1274126177) | 0;
    return (h & 0x7fffffff) / 0x7fffffff;
  }

  function noise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);

    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }

  function fbm(x, y, t) {
    let v = 0, amp = 1, freq = 1, total = 0;
    for (let i = 0; i < 4; i++) {
      v += amp * (noise(x * freq + t * 0.3, y * freq + t * 0.2) - 0.5);
      total += amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    return v / total;
  }

  const ripples = [
    { cx: 0.3, cy: 0.4, phase: 0 },
    { cx: 0.7, cy: 0.6, phase: 2.1 },
    { cx: 0.5, cy: 0.3, phase: 4.2 }
  ];

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

  function draw() {
    t += SPEED * 0.016;
    ctx.clearRect(0, 0, W, H);

    const cols = (W / GAP + 2) | 0;
    const rows = (H / GAP + 2) | 0;
    const nx   = W / 300;
    const ny   = H / 200;

    for (let r = 0; r < rows; r++) {
      for (let c2 = 0; c2 < cols; c2++) {
        const baseX = c2 * GAP;
        const baseY = r * GAP;

        const ux = c2 / cols;
        const uy = r / rows;

        const dx = fbm(ux * nx + 0.5, uy * ny, t) * 18;
        const dy = fbm(ux * nx, uy * ny + 0.5, t + 100) * 18;

        let rx = 0, ry = 0;
        for (const rp of ripples) {
          const rpX = rp.cx + Math.sin(t * 0.15 + rp.phase) * 0.15;
          const rpY = rp.cy + Math.cos(t * 0.12 + rp.phase) * 0.1;
          const dist = Math.sqrt((ux - rpX) ** 2 + (uy - rpY) ** 2);
          const wave = Math.sin(dist * 28 - t * 2.5 + rp.phase) * 6;
          const falloff = Math.exp(-dist * 3.5);
          rx += wave * falloff * (ux - rpX);
          ry += wave * falloff * (uy - rpY);
        }

        const px = baseX + dx + rx;
        const py = baseY + dy + ry;

        let alpha = 0.35;
        for (const rp of ripples) {
          const rpX = rp.cx + Math.sin(t * 0.15 + rp.phase) * 0.15;
          const rpY = rp.cy + Math.cos(t * 0.12 + rp.phase) * 0.1;
          const dist = Math.sqrt((ux - rpX) ** 2 + (uy - rpY) ** 2);
          alpha += 0.25 * Math.exp(-dist * 4) * (0.5 + 0.5 * Math.sin(dist * 28 - t * 2.5));
        }

        const edgeX = Math.min(ux, 1 - ux) * 8;
        const edgeY = Math.min(uy, 1 - uy) * 8;
        const edgeFade = Math.min(1, Math.min(edgeX, edgeY));

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * edgeFade));
        ctx.beginPath();
        ctx.arc(px, py, R, 0, 6.2832);
        ctx.fillStyle = "rgba(23, 23, 23, 1)";
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
