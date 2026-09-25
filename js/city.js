/* VI. The forest moves in: a procedural city decaying over a thousand years. */
(function () {
  const W = window.WHV;
  const S = W.smooth;

  // [start, end] of collapse, in years, per building type
  const LIFE = {
    house: [25, 70], brick: [140, 420], block: [70, 260], tower: [110, 320], stone: [700, 3000],
  };

  function mix(a, b, k) {
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
  }

  W.register('city', (el) => {
    const cv = el.querySelector('canvas');
    const yearEl = el.querySelector('#city-year');
    let L = null; // layout
    const o = W.canvas(cv, () => { L = layout(); });
    let lastYear = '';

    function layout() {
      const r = W.rng(1234);
      const u = o.h / 900;
      const gy = o.h * 0.84;
      const riverX = o.w * 0.8;
      const B = [];
      let x = -20 * u;
      const types = ['house', 'house', 'block', 'tower', 'brick', 'house', 'stone', 'block', 'tower', 'brick', 'house', 'tower', 'block', 'house', 'brick', 'tower', 'block'];
      let i = 0;
      while (x < riverX - 60 * u) {
        const type = types[i++ % types.length];
        const dims = {
          house: [70, 90, 60, 80], brick: [90, 120, 120, 170], block: [130, 170, 190, 250],
          tower: [90, 120, 330, 470], stone: [110, 130, 150, 170],
        }[type];
        const w = (dims[0] + r() * (dims[1] - dims[0])) * u;
        const h = (dims[2] + r() * (dims[3] - dims[2])) * u;
        const [c0, c1] = LIFE[type];
        const start = c0 + r() * (c1 - c0) * 0.6;
        const b = { type, x, w, h, start, end: start + (c1 - c0) * (0.3 + r() * 0.4), fire: type === 'house' && r() < 0.7, seed: r() * 1e6 | 0, tilt: (r() - 0.5) * 2 };
        // windows
        b.win = [];
        const fw = type === 'tower' ? 12 * u : 14 * u, fh = type === 'tower' ? 16 * u : 22 * u;
        const cols = Math.max(1, Math.floor((w - 16 * u) / (fw + 8 * u)));
        const rows = Math.max(1, Math.floor((h - (type === 'house' ? 20 : 24) * u) / (fh + 10 * u)));
        for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
          b.win.push({ x: 8 * u + cx * ((w - 16 * u) / cols) + ((w - 16 * u) / cols - fw) / 2, y: 14 * u + cy * (fh + 10 * u), w: fw, h: fh, k: r() });
        }
        // vines
        b.vine = Array.from({ length: Math.round(w * h / (220 * u * u)) + 10 }, () => {
          const yy = Math.pow(r(), 0.7);
          return { x: r() * w, y: yy, s: (3 + r() * 6) * u, k: r() };
        });
        B.push(b);
        x += w + (4 + r() * 16) * u;
      }
      // distant skyline
      const far = [];
      for (let fx = -10; fx < o.w + 40; ) {
        const w = (40 + r() * 70) * u;
        far.push({ x: fx, w, h: (120 + r() * 360) * u, end: 150 + r() * 500 });
        fx += w + 2 * u;
      }
      // trees
      const trees = [];
      for (let k = 0; k < 110; k++) {
        const born = k < 40 ? r() * 8 : 5 + Math.pow(r(), 1.5) * 300;
        const conifer = r() < 0.25;
        trees.push({ x: r() * o.w, born, max: (60 + r() * (born > 40 ? 260 : 150)) * u, conifer, z: r(), hue: r(), lean: (r() - 0.5) * 0.1 });
      }
      trees.sort((a, b) => a.z - b.z);
      const cars = [0.12, 0.33, 0.52, 0.68].map((k) => ({ x: o.w * k * 0.8 + r() * 40, c: [[120, 30, 40], [40, 70, 120], [200, 200, 205], [30, 30, 32]][Math.floor(r() * 4)] }));
      const lamps = [0.08, 0.28, 0.48, 0.68].map((k) => ({ x: o.w * 0.8 * k + 30 * u, dir: r() < 0.5 ? -1 : 1, at: 40 + r() * 80 }));
      const tufts = Array.from({ length: 160 }, () => ({ x: r() * o.w, h: (4 + r() * 14) * u, k: r() }));
      const birds = Array.from({ length: 16 }, () => ({ x: r(), y: 0.1 + r() * 0.35, v: 0.01 + r() * 0.02, ph: r() * 6, k: r() }));
      return { u, gy, riverX, B, far, trees, cars, lamps, tufts, birds };
    }

    function drawTree(ctx, t, x, gy, h, green) {
      const u = L.u;
      ctx.strokeStyle = '#2a211a'; ctx.lineWidth = Math.max(1, h * 0.05);
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + t.lean * h, gy - h * 0.6); ctx.stroke();
      ctx.fillStyle = green;
      if (t.conifer) {
        ctx.beginPath(); ctx.moveTo(x + t.lean * h, gy - h); ctx.lineTo(x - h * 0.22, gy - h * 0.18); ctx.lineTo(x + h * 0.22, gy - h * 0.18); ctx.closePath(); ctx.fill();
      } else {
        const cx = x + t.lean * h, cy = gy - h * 0.68, rr = h * 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, 7);
        ctx.arc(cx - rr * 0.6, cy + rr * 0.25, rr * 0.7, 0, 7);
        ctx.arc(cx + rr * 0.65, cy + rr * 0.2, rr * 0.72, 0, 7);
        ctx.arc(cx + rr * 0.1, cy - rr * 0.55, rr * 0.6, 0, 7);
        ctx.fill();
        if (u) {
          ctx.fillStyle = 'rgba(200,230,170,0.08)';
          ctx.beginPath(); ctx.arc(cx - rr * 0.25, cy - rr * 0.3, rr * 0.45, 0, 7); ctx.fill();
        }
      }
    }

    function render({ t, now }) {
      if (!L || !o.w) return;
      const Y = Math.max(0.5, t);
      const ctx = o.ctx, u = L.u;
      const gy = L.gy - 14 * u * S(100, 1000, Y);
      const green = S(1, 40, Y);
      const ytxt = W.nf(Y < 20 ? Math.round(Y) : +Y.toPrecision(2));
      if (ytxt !== lastYear) { yearEl.textContent = ytxt; lastYear = ytxt; }

      // sky: smoggy dusk clearing to clean twilight
      const clear = S(0.5, 5, Y);
      const sky = ctx.createLinearGradient(0, 0, 0, gy);
      sky.addColorStop(0, mix([16, 18, 26], [8, 16, 30], clear));
      sky.addColorStop(0.7, mix([58, 50, 48], [34, 58, 74], clear));
      sky.addColorStop(1, mix([96, 76, 60], [120, 136, 128], clear));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, o.w, o.h);
      // moon
      const mx = o.w * 0.64, my = o.h * 0.17;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 90 * u);
      mg.addColorStop(0, 'rgba(240,236,220,0.35)'); mg.addColorStop(1, 'rgba(240,236,220,0)');
      ctx.fillStyle = mg; ctx.fillRect(mx - 90 * u, my - 90 * u, 180 * u, 180 * u);
      ctx.fillStyle = '#ece6d6'; ctx.beginPath(); ctx.arc(mx, my, 18 * u, 0, 7); ctx.fill();

      // distant skyline -> wooded hills
      ctx.fillStyle = mix([34, 42, 56], [30, 44, 40], S(100, 600, Y));
      for (const f of L.far) {
        const k = S(f.end * 0.4, f.end, Y);
        const h = f.h * (1 - k * 0.85);
        ctx.fillRect(f.x, gy - h - 40 * u, f.w, h + 40 * u);
      }
      // hills of forest over the far ruins
      const hillA = S(80, 700, Y);
      if (hillA > 0) {
        ctx.fillStyle = `rgba(28,46,36,${hillA})`;
        ctx.beginPath(); ctx.moveTo(0, gy);
        for (let x = 0; x <= o.w; x += 12) ctx.lineTo(x, gy - 60 * u - 40 * u * Math.sin(x / (140 * u)) - 25 * u * Math.sin(x / (47 * u)) - 90 * u * hillA);
        ctx.lineTo(o.w, gy); ctx.fill();
      }

      // river + suspension bridge on the right
      const rx = L.riverX;
      ctx.fillStyle = mix([20, 30, 40], [26, 48, 58], clear);
      ctx.fillRect(rx, gy - 4 * u, o.w - rx, o.h - gy + 4 * u);
      const deck = gy - 70 * u;
      const fall = S(260, 320, Y), towerFall = S(700, 1100, Y);
      const bt1 = rx + (o.w - rx) * 0.25, bt2 = rx + (o.w - rx) * 0.8;
      const towerH = 210 * u * (1 - towerFall);
      ctx.fillStyle = mix([150, 60, 40], [90, 50, 38], S(10, 200, Y));
      if (towerH > 2) for (const bx of [bt1, bt2]) { ctx.fillRect(bx - 6 * u, deck - towerH, 12 * u, towerH + 70 * u); }
      if (fall < 1) {
        ctx.strokeStyle = mix([180, 80, 55], [110, 60, 45], S(10, 200, Y)); ctx.lineWidth = 2 * u;
        ctx.globalAlpha = 1 - fall;
        ctx.beginPath(); ctx.moveTo(rx - 40 * u, deck); ctx.quadraticCurveTo((bt1 + bt2) / 2, deck + 40 * u - towerH * 0.8, o.w + 40, deck - towerH * 0.3); ctx.stroke();
        ctx.moveTo(bt1, deck - towerH); ctx.quadraticCurveTo((bt1 + bt2) / 2, deck - 20 * u, bt2, deck - towerH); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.save();
      ctx.translate((bt1 + bt2) / 2, deck);
      ctx.rotate(fall * 0.25);
      ctx.fillStyle = '#2b2a2a';
      ctx.fillRect(-(bt2 - bt1) / 2 - (bt1 - rx) - 20, fall * 60 * u, o.w, 9 * u);
      ctx.restore();

      // buildings
      for (const b of L.B) {
        const k = S(b.start, b.end, Y);
        const hh = b.h * (1 - k * 0.88);
        const top = gy - hh;
        const burnt = b.fire ? S(9, 13, Y) : 0;
        const base = {
          house: [92, 74, 58], brick: [110, 60, 46], block: [118, 116, 108], tower: [52, 70, 88], stone: [132, 124, 108],
        }[b.type];
        const aged = mix(base, burnt ? [30, 26, 24] : [70, 72, 60], Math.max(burnt, S(5, 200, Y) * 0.6));
        ctx.save();
        if (b.type === 'tower' && k > 0.02 && k < 0.99) {
          ctx.translate(b.x + b.w / 2, gy); ctx.rotate(b.tilt * k * 0.12); ctx.translate(-(b.x + b.w / 2), -gy);
        }
        ctx.fillStyle = aged;
        ctx.fillRect(b.x, top, b.w, hh);
        if (b.type === 'house' && k < 0.6) {
          ctx.fillStyle = mix([70, 40, 34], [40, 36, 30], Math.max(burnt, S(5, 40, Y)));
          ctx.beginPath(); ctx.moveTo(b.x - 5 * u, top); ctx.lineTo(b.x + b.w / 2, top - 30 * u * (1 - k)); ctx.lineTo(b.x + b.w + 5 * u, top); ctx.fill();
        }
        if (b.type === 'stone') {
          ctx.fillStyle = aged;
          ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, top); ctx.lineTo(b.x + b.w * 0.5, top - 70 * u * (1 - S(300, 900, Y))); ctx.lineTo(b.x + b.w * 0.7, top); ctx.fill();
        }
        // windows: glass breaks over the years
        const breakK = S(1, b.type === 'tower' ? 60 : 120, Y);
        for (const wn of b.win) {
          if (wn.y + wn.h > hh - 4 * u) continue;
          const broken = wn.k < breakK;
          ctx.fillStyle = broken ? '#07090c' : (b.type === 'tower' ? 'rgba(150,180,200,0.35)' : 'rgba(40,50,60,0.9)');
          ctx.fillRect(b.x + wn.x, top + wn.y, wn.w, wn.h);
        }
        // skeleton lines once the glass is gone
        if (b.type === 'tower' && breakK > 0.5) {
          ctx.strokeStyle = `rgba(140,90,60,${(breakK - 0.5) * 0.8})`; ctx.lineWidth = 1;
          for (let yy = top; yy < gy; yy += 26 * u) { ctx.beginPath(); ctx.moveTo(b.x, yy); ctx.lineTo(b.x + b.w, yy); ctx.stroke(); }
        }
        // fire
        if (b.fire && Y > 8.5 && Y < 14) {
          const f = S(8.5, 10, Y) * (1 - S(12, 14, Y));
          const fl = 0.6 + 0.4 * Math.sin(now / 90 + b.seed);
          const fg = ctx.createRadialGradient(b.x + b.w / 2, top, 0, b.x + b.w / 2, top, b.w * 1.3);
          fg.addColorStop(0, `rgba(255,170,60,${0.9 * f * fl})`); fg.addColorStop(1, 'rgba(255,90,30,0)');
          ctx.fillStyle = fg; ctx.fillRect(b.x - b.w, top - b.w * 1.3, b.w * 3, b.w * 2.6);
        }
        // vines
        const cover = S(1.5, 90, Y);
        if (cover > 0) {
          for (const v of b.vine) {
            if (v.k > cover * 1.2) continue;
            const vy = gy - (1 - v.y) * hh;
            if (1 - v.y > cover * 1.3) continue;
            ctx.fillStyle = v.k < 0.5 ? '#3f6b3a' : '#5c8a45';
            ctx.beginPath(); ctx.arc(b.x + v.x, vy, v.s, 0, 7); ctx.fill();
          }
        }
        ctx.restore();
        // chimney that outlives the house
        if (b.type === 'house' && k > 0.6 && Y < 400) {
          ctx.fillStyle = '#6e3f31';
          ctx.fillRect(b.x + b.w * 0.7, gy - 70 * u * (1 - S(200, 400, Y)), 12 * u, 70 * u * (1 - S(200, 400, Y)));
        }
        // rubble mound
        if (k > 0.05) {
          ctx.fillStyle = mix([80, 76, 70], [40, 60, 40], S(b.end, b.end + 200, Y));
          ctx.beginPath(); ctx.moveTo(b.x - 10 * u, gy);
          ctx.quadraticCurveTo(b.x + b.w / 2, gy - b.h * 0.3 * k, b.x + b.w + 10 * u, gy); ctx.fill();
        }
      }

      // street, then soil and moss over it
      const soil = S(2, 60, Y);
      ctx.fillStyle = mix([34, 36, 40], [36, 44, 30], soil);
      ctx.fillRect(0, gy, L.riverX, o.h - gy);
      ctx.fillStyle = mix([60, 62, 66], [52, 72, 44], soil);
      ctx.fillRect(0, gy, L.riverX, 5 * u);
      if (Y < 30) {
        ctx.strokeStyle = `rgba(236,230,214,${0.35 * (1 - S(3, 30, Y))})`; ctx.setLineDash([30 * u, 26 * u]); ctx.lineWidth = 3 * u;
        ctx.beginPath(); ctx.moveTo(0, gy + (o.h - gy) * 0.55); ctx.lineTo(L.riverX, gy + (o.h - gy) * 0.55); ctx.stroke(); ctx.setLineDash([]);
      }
      // lamp posts
      for (const lp of L.lamps) {
        const lean = S(lp.at, lp.at + 30, Y) * 1.45 * lp.dir;
        if (Y > lp.at + 200) continue;
        ctx.save(); ctx.translate(lp.x, gy); ctx.rotate(lean);
        ctx.fillStyle = mix([70, 76, 84], [110, 70, 40], S(5, 60, Y));
        ctx.fillRect(-2 * u, -120 * u, 4 * u, 120 * u);
        ctx.fillRect(-2 * u, -120 * u, 22 * u, 4 * u);
        ctx.restore();
      }
      // cars rusting into mounds
      for (const c of L.cars) {
        const rust = S(1, 40, Y), gone = S(60, 200, Y);
        if (gone >= 1) continue;
        ctx.fillStyle = mix(c.c, [110, 58, 32], rust);
        const ch = 26 * u * (1 - gone * 0.7);
        ctx.fillRect(c.x, gy + 18 * u - ch, 70 * u, ch);
        ctx.fillRect(c.x + 14 * u, gy + 18 * u - ch - 14 * u * (1 - gone), 40 * u, 14 * u * (1 - gone));
        ctx.fillStyle = '#0b0b0b';
        ctx.beginPath(); ctx.arc(c.x + 14 * u, gy + 18 * u, 7 * u * (1 - gone), 0, 7); ctx.arc(c.x + 56 * u, gy + 18 * u, 7 * u * (1 - gone), 0, 7); ctx.fill();
      }
      // grass tufts
      if (Y > 0.6) {
        ctx.strokeStyle = '#6f9a55'; ctx.lineWidth = 1.4 * u;
        const g = S(0.6, 20, Y);
        for (const tf of L.tufts) {
          if (tf.k > g || tf.x > L.riverX) continue;
          const ty = gy + 4 * u + tf.k * (o.h - gy) * 0.8;
          ctx.beginPath(); ctx.moveTo(tf.x, ty); ctx.lineTo(tf.x - 3 * u, ty - tf.h); ctx.moveTo(tf.x, ty); ctx.lineTo(tf.x + 3 * u, ty - tf.h * 0.8); ctx.stroke();
        }
      }
      // trees
      for (const tr of L.trees) {
        if (Y < tr.born || tr.x > L.riverX + 20) continue;
        const h = tr.max * (1 - Math.exp(-(Y - tr.born) / 30));
        if (h < 3 * u) continue;
        const shade = 0.55 + tr.z * 0.45;
        const gcol = mix([30, 52, 34], [92, 138, 70], shade * (0.4 + 0.6 * green));
        drawTree(ctx, tr, tr.x, gy + tr.z * (o.h - gy) * 0.5, h, gcol);
      }
      // birds
      const birdN = Math.round(4 + 12 * S(1, 100, Y));
      ctx.strokeStyle = 'rgba(20,24,28,0.9)'; ctx.lineWidth = 1.5 * u;
      for (let i = 0; i < birdN; i++) {
        const bd = L.birds[i];
        const bx = ((bd.x + (W.reduced ? 0 : now / 1000 * bd.v)) % 1.1) * o.w;
        const by = bd.y * o.h + Math.sin(now / 700 + bd.ph) * 6 * u;
        const flap = W.reduced ? 3 : Math.sin(now / 120 + bd.ph) * 4;
        ctx.beginPath(); ctx.moveTo(bx - 7 * u, by - flap * u); ctx.lineTo(bx, by); ctx.lineTo(bx + 7 * u, by - flap * u); ctx.stroke();
      }
      // a deer crossing the old street
      if (Y > 3) {
        const dx = (((W.reduced ? 0.4 : now / 60000) + 0.2) % 1) * L.riverX;
        const dy = gy + (o.h - gy) * 0.45;
        const s = 1.2 * u;
        ctx.fillStyle = '#3a2a1e';
        ctx.fillRect(dx, dy - 30 * s, 34 * s, 14 * s);
        ctx.fillRect(dx + 30 * s, dy - 44 * s, 6 * s, 18 * s);
        ctx.fillRect(dx + 30 * s, dy - 48 * s, 12 * s, 7 * s);
        ctx.fillRect(dx + 2 * s, dy - 16 * s, 3 * s, 16 * s); ctx.fillRect(dx + 28 * s, dy - 16 * s, 3 * s, 16 * s);
        ctx.strokeStyle = '#3a2a1e'; ctx.lineWidth = 1.2 * s;
        ctx.beginPath(); ctx.moveTo(dx + 33 * s, dy - 48 * s); ctx.lineTo(dx + 30 * s, dy - 58 * s); ctx.lineTo(dx + 26 * s, dy - 62 * s); ctx.moveTo(dx + 30 * s, dy - 58 * s); ctx.lineTo(dx + 34 * s, dy - 64 * s); ctx.stroke();
      }
      // foreground shade for card legibility
      const fg = ctx.createLinearGradient(0, 0, o.w * 0.5, 0);
      fg.addColorStop(0, 'rgba(4,6,8,0.35)'); fg.addColorStop(1, 'rgba(4,6,8,0)');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, o.w * 0.5, o.h);
    }
    return { render, lang: () => { lastYear = ''; } };
  });
})();
