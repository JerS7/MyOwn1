
(() => {
  const btn = document.querySelector(".easter-egg-btn");
  const overlay = document.querySelector(".easter-overlay");
  const canvas = document.querySelector(".easter-canvas");
  if (!btn || !overlay || !canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, dpr;
  let active = false;
  let bars = [];
  let animId = null;
  let animStart = 0;

  const BAR_COUNT       = 24;
  const OPACITY         = 0.22;
  const HOLD_TIME       = 2000;
  const STAGGER_DELAY   = 80;
  const GAP             = 6;
  const GROW_DURATION   = 500;
  const SHRINK_DURATION = 400;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function sz() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  sz();
  window.addEventListener("resize", sz, { passive: true });

  function generateBars() {
    bars = [];
    const totalGap = GAP * (BAR_COUNT - 1);
    const barWidth = (W - totalGap) / BAR_COUNT;
    const maxHeight = H * 0.7;
    const peak = Math.floor(BAR_COUNT * 0.5);

    for (let i = 0; i < BAR_COUNT; i++) {

      let normalized;
      if (i <= peak) {
        normalized = i / peak;
      } else {
        normalized = 1 - (i - peak) / (BAR_COUNT - peak);
      }

      const randomFactor = 0.4 + Math.random() * 0.6;
      const targetHeight = normalized * randomFactor * maxHeight + 20;

      bars.push({
        x: i * (barWidth + GAP),
        width: barWidth,
        targetHeight: targetHeight,
        currentHeight: 0,
        opacity: 0,
        phase: 0,
        startTime: i * STAGGER_DELAY,
        holdStart: 0
      });
    }
  }

  function animate(timestamp) {
    if (!animStart) animStart = timestamp;
    const elapsed = timestamp - animStart;

    ctx.clearRect(0, 0, W, H);

    let allDone = true;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];

      if (elapsed < bar.startTime) {
        allDone = false;
        continue;
      }

      if (bar.phase === 0) {

        const growElapsed = elapsed - bar.startTime;
        const progress = Math.min(1, growElapsed / GROW_DURATION);
        const eased = easeOutCubic(progress);
        bar.currentHeight = bar.targetHeight * eased;
        bar.opacity = OPACITY * eased;

        if (progress >= 1) {
          bar.phase = 1;
          bar.holdStart = elapsed;
        }
        allDone = false;
      } else if (bar.phase === 1) {

        const leftDone = i === 0 || bars[i - 1].phase === 2;
        if (leftDone && elapsed - bar.holdStart > HOLD_TIME) {
          bar.phase = 2;
          bar.shrinkStart = elapsed;
        }
        allDone = false;
      } else if (bar.phase === 2) {

        const shrinkElapsed = elapsed - bar.shrinkStart;
        const progress = Math.min(1, shrinkElapsed / SHRINK_DURATION);
        const eased = easeInOutCubic(progress);
        bar.currentHeight = bar.targetHeight * (1 - eased);
        bar.opacity = OPACITY * (1 - eased);

        if (progress >= 1) {
          bar.currentHeight = 0;
          bar.opacity = 0;
          continue;
        }
        allDone = false;
      }

      ctx.fillStyle = `rgba(26, 122, 58, ${bar.opacity})`;
      ctx.fillRect(bar.x, H - bar.currentHeight, bar.width, bar.currentHeight);
    }

    if (!allDone) {
      animId = requestAnimationFrame(animate);
    } else {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      active = false;
      animStart = 0;
    }
  }

  btn.addEventListener("click", () => {
    if (active) return;
    active = true;
    animStart = 0;

    sz();
    generateBars();
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(animate);
  });

  overlay.addEventListener("click", () => {
    overlay.classList.remove("is-active");
    overlay.setAttribute("aria-hidden", "true");
    active = false;
    animStart = 0;
    if (animId) cancelAnimationFrame(animId);
  });
})();
