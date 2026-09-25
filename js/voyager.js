/* XII. The last message: Voyager drifting through the stars. */
(function () {
  const W = window.WHV;

  W.register('voyager', (el) => {
    const cv = el.querySelector('canvas');
    const r = W.rng(99);
    const stars = Array.from({ length: 900 }, () => ({ x: r(), y: r(), z: 0.2 + r() * 0.8, m: r() }));
    const o = W.canvas(cv);

    function probe(ctx, x, y, k, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
      ctx.strokeStyle = '#bdb7a8'; ctx.fillStyle = '#d9d2c0'; ctx.lineWidth = 1.2 / k;
      // dish
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 6, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#9b958a'; ctx.beginPath(); ctx.ellipse(0, 1, 16, 4, 0, 0, 7); ctx.fill();
      // bus + record
      ctx.fillStyle = '#6b6760'; ctx.fillRect(-6, 5, 12, 7);
      ctx.fillStyle = '#d4af37'; ctx.beginPath(); ctx.arc(0, 9, 3, 0, 7); ctx.fill();
      // booms
      ctx.beginPath(); ctx.moveTo(5, 9); ctx.lineTo(40, 20); ctx.moveTo(-5, 9); ctx.lineTo(-26, 26); ctx.moveTo(0, 12); ctx.lineTo(4, 44); ctx.stroke();
      ctx.fillStyle = '#6b6760'; ctx.fillRect(-30, 24, 7, 7);
      ctx.restore();
    }

    function render({ p, now }) {
      if (!o.w) return;
      const ctx = o.ctx;
      ctx.fillStyle = '#020306'; ctx.fillRect(0, 0, o.w, o.h);
      const drift = W.reduced ? 0 : now / 1000;
      for (const s of stars) {
        const x = ((s.x + drift * 0.002 * s.z + p * 0.08 * s.z) % 1) * o.w;
        const y = s.y * o.h;
        ctx.fillStyle = `rgba(236,230,214,${(0.2 + s.m * 0.7) * s.z})`;
        ctx.fillRect(x, y, s.z * 1.6, s.z * 1.6);
      }
      // the pale blue dot, receding
      const ex = o.w * (0.15 + p * 0.1), ey = o.h * 0.72;
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 14);
      eg.addColorStop(0, 'rgba(140,190,255,0.9)'); eg.addColorStop(1, 'rgba(140,190,255,0)');
      ctx.fillStyle = eg; ctx.fillRect(ex - 14, ey - 14, 28, 28);
      ctx.fillStyle = '#cfe3ff'; ctx.beginPath(); ctx.arc(ex, ey, 1.4 * (1 - p * 0.6), 0, 7); ctx.fill();
      // probe
      const k = Math.min(o.w, o.h) / 520 * (1.4 - p * 0.9);
      const px = o.w * (0.8 - p * 0.3), py = o.h * (0.2 + p * 0.08);
      probe(ctx, px, py, Math.max(0.25, k), -0.35 + Math.sin(drift * 0.1) * 0.05);
    }
    return { render };
  });
})();
