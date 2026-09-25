/* XI. A line in the rock: zooming into a future cliff face. */
(function () {
  const W = window.WHV;
  const S = W.smooth;
  const HUMAN = 245; // depth of our layer, metres below the future surface
  const THICK = 0.08;

  const NAMES = {
    future: { en: 'Rock laid down after us: 100 million years of mud, sand and shells', ro: 'Rocă depusă după noi: 100 de milioane de ani de mâl, nisip și scoici' },
    human: { en: 'Our layer: concrete, aluminium, plastic films, odd isotopes, chicken bones', ro: 'Stratul nostru: beton, aluminiu, pelicule de plastic, izotopi ciudați, oase de pui' },
    holocene: { en: 'The age of farmers: 11,700 years of soil', ro: 'Epoca agricultorilor: 11.700 de ani de sol' },
    pleisto: { en: 'Ice-age gravels', ro: 'Pietrișuri din epoca glaciară' },
    older: { en: 'Older rock: the world before us', ro: 'Roci mai vechi: lumea de dinaintea noastră' },
  };
  const FOSSILS = [
    { k: 'can', en: 'Flattened aluminium can', ro: 'Doză de aluminiu turtită' },
    { k: 'bone', en: 'Chicken bone', ro: 'Os de pui' },
    { k: 'bottle', en: 'Glass bottle', ro: 'Sticlă' },
    { k: 'phone', en: 'Phone: glass, lithium, gold, silicon', ro: 'Telefon: sticlă, litiu, aur, siliciu' },
    { k: 'rebar', en: 'Rusted rebar from concrete', ro: 'Armătură ruginită din beton' },
    { k: 'film', en: 'Plastic, now a black carbon film', ro: 'Plastic, acum o peliculă neagră de carbon' },
    { k: 'dino', en: 'A plastic toy dinosaur, fossilised', ro: 'Un dinozaur de jucărie din plastic, fosilizat' },
    { k: 'coin', en: 'Copper coin', ro: 'Monedă de cupru' },
    { k: 'brick', en: 'Brick fragment', ro: 'Fragment de cărămidă' },
  ];

  W.register('strata', (el) => {
    const cv = el.querySelector('canvas');
    const tip = el.querySelector('#strata-tip');
    const scaleEl = el.querySelector('#strata-scale');
    const r = W.rng(77);
    // layers: [top, bottom, colour, kind]
    const layers = [];
    let d = -5;
    const futureCols = [[106, 90, 69], [74, 64, 56], [138, 125, 104], [92, 80, 66], [120, 104, 82], [66, 58, 52]];
    while (d < HUMAN - 0.5) {
      const th = Math.min(HUMAN - 0.4 - d, 2 + r() * 16);
      layers.push({ a: d, b: d + th, c: futureCols[(r() * futureCols.length) | 0], kind: 'future', ph: r() * 10 });
      d += th;
    }
    layers.push({ a: d, b: HUMAN, c: [84, 74, 62], kind: 'future', ph: 1 });
    layers.push({ a: HUMAN, b: HUMAN + THICK, c: [30, 27, 30], kind: 'human', ph: 2 });
    layers.push({ a: HUMAN + THICK, b: HUMAN + 1.6, c: [70, 52, 38], kind: 'holocene', ph: 3 });
    layers.push({ a: HUMAN + 1.6, b: HUMAN + 26, c: [112, 106, 96], kind: 'pleisto', ph: 4 });
    d = HUMAN + 26;
    while (d < 900) { const th = 6 + r() * 30; layers.push({ a: d, b: d + th, c: futureCols[(r() * futureCols.length) | 0].map((v) => v * 0.8), kind: 'older', ph: r() * 10 }); d += th; }
    const grains = Array.from({ length: 1400 }, () => ({ x: r(), d: -5 + r() * 900, s: r() }));
    const fine = Array.from({ length: 900 }, () => ({ x: r(), d: HUMAN - 0.3 + r() * 2.2, s: r() }));
    const fossils = Array.from({ length: 16 }, (_, i) => ({ ...FOSSILS[i % FOSSILS.length], x: 0.06 + (i / 16) * 0.9 + (r() - 0.5) * 0.04, d: HUMAN + 0.015 + r() * 0.05, rot: (r() - 0.5) * 0.7, s: 0.8 + r() * 0.5 }));
    const glints = Array.from({ length: 300 }, () => ({ x: r(), d: HUMAN + r() * THICK, s: r() }));
    let view = { c: 0, z: 1 };
    let hover = null;
    const o = W.canvas(cv);

    cv.addEventListener('pointermove', (e) => {
      const b = cv.getBoundingClientRect();
      hover = { x: e.clientX - b.left, y: e.clientY - b.top };
    });
    cv.addEventListener('pointerleave', () => { hover = null; tip.hidden = true; });

    function drawFossil(ctx, f, x, y, k) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(f.rot); ctx.scale(k * f.s, k * f.s);
      ctx.lineWidth = 1.2 / (k * f.s);
      switch (f.k) {
        case 'can': ctx.fillStyle = '#b9c0c8'; ctx.beginPath(); ctx.ellipse(0, 0, 14, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c0392b'; ctx.fillRect(-6, -2, 8, 4); break;
        case 'bone': ctx.strokeStyle = '#efe6cf'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.stroke(); ctx.fillStyle = '#efe6cf'; [[-13, -2], [-13, 2], [13, -2], [13, 2]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 2.4, 0, 7); ctx.fill(); }); break;
        case 'bottle': ctx.strokeStyle = 'rgba(120,200,150,0.9)'; ctx.fillStyle = 'rgba(80,160,110,0.35)'; ctx.beginPath(); ctx.roundRect(-14, -5, 20, 10, 4); ctx.fill(); ctx.stroke(); ctx.fillRect(6, -2, 8, 4); break;
        case 'phone': ctx.fillStyle = '#0c0d10'; ctx.strokeStyle = '#8a8f99'; ctx.beginPath(); ctx.roundRect(-10, -5, 20, 10, 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d4af37'; ctx.fillRect(-7, -1, 3, 2); break;
        case 'rebar': ctx.strokeStyle = '#8e4a28'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, 1); for (let i = -18; i <= 18; i += 4) ctx.lineTo(i, i % 8 === 0 ? -1 : 1); ctx.stroke(); break;
        case 'film': ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.bezierCurveTo(-8, -3, 4, 3, 20, -1); ctx.stroke(); break;
        case 'dino': ctx.fillStyle = '#6f8f3a'; ctx.beginPath(); ctx.ellipse(0, 0, 10, 4, 0, 0, 7); ctx.fill(); ctx.fillRect(7, -9, 3, 8); ctx.beginPath(); ctx.ellipse(11, -9, 4, 2.4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-20, 4); ctx.lineTo(-9, 2); ctx.fill(); ctx.fillRect(-5, 3, 2, 4); ctx.fillRect(4, 3, 2, 4); break;
        case 'coin': ctx.fillStyle = '#b06a3b'; ctx.beginPath(); ctx.ellipse(0, 0, 5, 2, 0, 0, 7); ctx.fill(); break;
        case 'brick': ctx.fillStyle = '#8d3f2c'; ctx.fillRect(-9, -3, 18, 6); break;
      }
      ctx.restore();
    }

    function render({ s, now }) {
      if (!o.w) return;
      const ctx = o.ctx;
      const zk = S(0.1, 2.3, s);
      const z = Math.pow(10, W.lerp(Math.log10(480), Math.log10(0.22), zk));
      const c = W.lerp(200, HUMAN + THICK / 2, S(0, 1.4, s));
      view = { c, z };
      const pxm = o.h / z;
      const Y = (dd) => o.h / 2 + (dd - c) * pxm;
      ctx.fillStyle = '#0e0c0a'; ctx.fillRect(0, 0, o.w, o.h);
      const wav = (x, L) => Math.sin(x / 90 + L.ph) * Math.min(6, 0.6 * pxm) + Math.sin(x / 31 + L.ph * 2) * Math.min(2, 0.2 * pxm);
      for (const L of layers) {
        const ya = Y(L.a), yb = Y(L.b);
        if (yb < -10 || ya > o.h + 10) continue;
        ctx.fillStyle = `rgb(${L.c[0] | 0},${L.c[1] | 0},${L.c[2] | 0})`;
        ctx.beginPath(); ctx.moveTo(0, ya + wav(0, L));
        for (let x = 0; x <= o.w + 20; x += 20) ctx.lineTo(x, ya + wav(x, L));
        for (let x = o.w + 20; x >= 0; x -= 20) ctx.lineTo(x, Math.max(ya + 0.5, yb + wav(x, L)));
        ctx.closePath(); ctx.fill();
      }
      // the future forest on the surface
      const sy = Y(0);
      if (sy > -40 && sy < o.h) {
        const tr = W.rng(4);
        ctx.fillStyle = '#1d2a1f';
        for (let x = -10; x < o.w + 10; x += 9 + tr() * 14) {
          const th = 10 + tr() * 22;
          ctx.beginPath(); ctx.moveTo(x - th * 0.3, sy + 2); ctx.lineTo(x, sy - th); ctx.lineTo(x + th * 0.3, sy + 2); ctx.fill();
        }
      }
      // grains
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (const g of grains) { const y = Y(g.d); if (y < 0 || y > o.h) continue; ctx.fillRect(g.x * o.w, y, 1 + g.s * 2, 1 + g.s); }
      if (pxm > 20) {
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        for (const g of fine) { const y = Y(g.d); if (y < 0 || y > o.h) continue; const sz = Math.min(8, g.s * pxm * 0.01 + 1); ctx.fillRect(g.x * o.w, y, sz, sz * 0.7); }
      }
      // our layer: glints and technofossils
      const hy = Y(HUMAN), hb = Y(HUMAN + THICK);
      if (hb - hy < 3) {
        ctx.strokeStyle = 'rgba(242,165,65,0.8)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(o.w, hy); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      for (const g of glints) {
        const y = Y(g.d); if (y < -5 || y > o.h + 5) continue;
        const tw = W.reduced ? 0.6 : 0.5 + 0.5 * Math.sin(now / 300 + g.s * 40);
        ctx.fillStyle = `rgba(220,230,240,${0.6 * tw * g.s})`;
        ctx.fillRect(g.x * o.w, y, 1.5, 1.5);
      }
      ctx.globalCompositeOperation = 'source-over';
      const fk = W.clamp((pxm - 40) / 400);
      let near = null;
      if (fk > 0) {
        const k = Math.min(2.6, pxm / 700) * 1.6;
        ctx.globalAlpha = Math.min(1, fk * 2);
        for (const f of fossils) {
          const fx = f.x * o.w, fy = Y(f.d);
          drawFossil(ctx, f, fx, fy, k);
          if (hover && Math.hypot(hover.x - fx, hover.y - fy) < 22 * k) near = f;
        }
        ctx.globalAlpha = 1;
      }
      // labels at the layer edge
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      if (hb - hy < 60) {
        ctx.fillStyle = '#f2a541';
        const label = W.lang === 'ro' ? '← NOI' : '← US';
        ctx.fillText(label, o.w - (o.w < 860 ? 60 : 110), hy - 6);
      }
      // tooltip
      if (hover) {
        const dd = c + (hover.y - o.h / 2) / pxm;
        const L = layers.find((l) => dd >= l.a && dd < l.b);
        if (L || near) {
          tip.hidden = false;
          tip.style.left = hover.x + 'px'; tip.style.top = hover.y + 'px';
          tip.style.transform = hover.x > o.w - 320 ? 'translate(calc(-100% - 12px), -50%)' : '';
          tip.innerHTML = near ? `<b>${W.tr(near)}</b>` : `<b>${W.tr(NAMES[L.kind])}</b>`;
        } else tip.hidden = true;
      }
      const fov = z >= 10 ? W.nf(z) + ' m' : z >= 1 ? W.nf(z, 1) + ' m' : W.nf(z * 100) + ' cm';
      scaleEl.textContent = (W.lang === 'ro' ? 'Câmp vizual: ' : 'Field of view: ') + fov;
    }
    return { render };
  });
})();
