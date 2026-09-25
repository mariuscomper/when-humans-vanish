/* V. The sky clears: skyglow fades, the Milky Way returns. */
(function () {
  const W = window.WHV;

  const BORTLE = [
    null,
    { en: 'Excellent dark-sky site', ro: 'Cer întunecat excelent' },
    { en: 'Truly dark site', ro: 'Cer cu adevărat întunecat' },
    { en: 'Rural sky', ro: 'Cer rural' },
    { en: 'Rural–suburban transition', ro: 'Tranziție rural–suburban' },
    { en: 'Suburban sky', ro: 'Cer suburban' },
    { en: 'Bright suburban sky', ro: 'Cer suburban luminos' },
    { en: 'Suburban–urban transition', ro: 'Tranziție suburban–urban' },
    { en: 'City sky', ro: 'Cer de oraș' },
    { en: 'Inner-city sky', ro: 'Cer de centru de oraș' },
  ];

  W.register('sky', (el) => {
    const cv = el.querySelector('canvas');
    const slider = el.querySelector('#bortle');
    const label = el.querySelector('#bortle-label');
    const rand = W.rng(3);
    const stars = Array.from({ length: 2800 }, () => ({
      x: rand(), y: rand() * 0.9, m: Math.max(-1, 7.5 + 2 * Math.log10(rand() + 1e-6)), tw: rand() * 6.28,
      hue: rand() < 0.15 ? '255,210,170' : rand() < 0.3 ? '190,210,255' : '255,250,240',
    }));
    const trails = Array.from({ length: 6 }, () => ({ x0: rand(), y0: rand() * 0.5, a: -0.4 + rand() * 0.8, len: 0.3 + rand() * 0.5 }));
    let mw = null, skyline = null;
    let userB = null, userS = 0, lastLabel = '';

    const o = W.canvas(cv, () => { mw = buildMilkyWay(); skyline = buildSkyline(); });

    function bandY(x) { return o.h * (0.95 - 0.8 * x) + Math.sin(x * 3) * o.h * 0.05; }

    function buildMilkyWay() {
      const c = document.createElement('canvas');
      c.width = o.cv.width; c.height = o.cv.height;
      const g = c.getContext('2d');
      g.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
      const r = W.rng(9);
      const width = Math.max(o.w, o.h) * 0.12;
      // nebulous glow
      for (let i = 0; i < 260; i++) {
        const x = r() * o.w, y = bandY(x / o.w) + (r() - 0.5) * width * 1.3;
        const s = width * (0.25 + r() * 0.6);
        const gr = g.createRadialGradient(x, y, 0, x, y, s);
        const warm = r() < 0.5;
        gr.addColorStop(0, warm ? 'rgba(255,225,190,0.05)' : 'rgba(190,205,255,0.045)');
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2);
      }
      // star dust
      for (let i = 0; i < 9000; i++) {
        const x = r() * o.w;
        const gauss = (r() + r() + r() - 1.5) / 1.5;
        const y = bandY(x / o.w) + gauss * width;
        g.fillStyle = `rgba(255,248,235,${(0.15 + r() * 0.45).toFixed(2)})`;
        const s = r() < 0.9 ? 0.6 : 1.1;
        g.fillRect(x, y, s, s);
      }
      // dust lanes
      g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 70; i++) {
        const x = r() * o.w, y = bandY(x / o.w) + (r() - 0.5) * width * 0.35;
        const s = width * (0.1 + r() * 0.25);
        const gr = g.createRadialGradient(x, y, 0, x, y, s);
        gr.addColorStop(0, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2);
      }
      return c;
    }

    function buildSkyline() {
      const c = document.createElement('canvas');
      c.width = o.cv.width; c.height = o.cv.height;
      const g = c.getContext('2d');
      g.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
      const r = W.rng(21);
      const base = o.h;
      g.fillStyle = '#020305';
      let x = -10;
      const dome = o.w * 0.28;
      while (x < o.w + 10) {
        const w = 30 + r() * 70, h = o.h * (0.06 + r() * 0.2);
        g.fillRect(x, base - h, w - 3, h);
        x += w;
      }
      // a church with a dome and a cross
      const dh = o.h * 0.24, dw = o.w * 0.05 + 30;
      g.fillRect(dome - dw / 2, base - dh, dw, dh);
      g.beginPath(); g.ellipse(dome, base - dh, dw * 0.42, dw * 0.5, 0, Math.PI, 0); g.fill();
      g.fillRect(dome - 1.5, base - dh - dw * 0.5 - 26, 3, 26);
      g.fillRect(dome - 9, base - dh - dw * 0.5 - 18, 18, 3);
      // a tower block with a mast
      const tx = o.w * 0.74;
      g.fillRect(tx, base - o.h * 0.36, 60, o.h * 0.36);
      g.fillRect(tx + 29, base - o.h * 0.36 - 40, 2, 40);
      return c;
    }

    slider.addEventListener('input', () => { userB = +slider.value; userS = curS; });
    let curS = 0;

    function render({ s, now }) {
      if (!mw || !o.w) return;
      curS = s;
      const auto = 9 - 8 * W.smooth(0.6, 2, s);
      if (userB !== null && Math.abs(s - userS) > 0.6) userB = null;
      const B = userB !== null ? userB : auto;
      if (userB === null) slider.value = B.toFixed(2);
      const haze = 1 - W.smooth(-0.2, 1, s);
      const glow = (B - 1) / 8;
      const ctx = o.ctx;
      const limit = 8 - 0.5 * B - haze * 1.2;

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, o.h);
      sky.addColorStop(0, `rgb(${Math.round(3 + 22 * glow)},${Math.round(5 + 14 * glow)},${Math.round(11 + 8 * glow)})`);
      sky.addColorStop(1, `rgb(${Math.round(8 + 80 * glow)},${Math.round(10 + 45 * glow)},${Math.round(18 + 12 * glow)})`);
      ctx.fillStyle = sky; ctx.fillRect(0, 0, o.w, o.h);

      // milky way
      const mwA = W.smooth(5.2, 1.6, B) * (1 - haze * 0.8);
      if (mwA > 0.01) { ctx.globalAlpha = mwA; ctx.drawImage(mw, 0, 0, o.w, o.h); ctx.globalAlpha = 1; }

      // stars
      ctx.globalCompositeOperation = 'lighter';
      for (const st of stars) {
        const a = W.clamp((limit - st.m) / 1.4);
        if (a <= 0.01) continue;
        const tw = W.reduced ? 1 : 0.8 + 0.2 * Math.sin(now / 400 + st.tw);
        const size = Math.max(0.5, (6.5 - st.m) * 0.33);
        ctx.fillStyle = `rgba(${st.hue},${(a * tw).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(st.x * o.w, st.y * o.h, size, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // contrails
      if (haze > 0.01) {
        ctx.lineWidth = 3;
        for (const tr of trails) {
          const x0 = tr.x0 * o.w, y0 = tr.y0 * o.h;
          const x1 = x0 + Math.cos(tr.a) * tr.len * o.w, y1 = y0 + Math.sin(tr.a) * tr.len * o.w;
          const gr = ctx.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, 'rgba(220,200,180,0)'); gr.addColorStop(1, `rgba(220,200,180,${0.22 * haze})`);
          ctx.strokeStyle = gr;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        }
      }
      // skyglow + haze near the horizon
      const hz = ctx.createLinearGradient(0, o.h * 0.35, 0, o.h);
      hz.addColorStop(0, 'rgba(242,150,60,0)');
      hz.addColorStop(1, `rgba(242,150,60,${(0.5 * glow + 0.15 * haze).toFixed(3)})`);
      ctx.fillStyle = hz; ctx.fillRect(0, 0, o.w, o.h);
      ctx.drawImage(skyline, 0, 0, o.w, o.h);

      const b = Math.round(B);
      const txt = `Bortle ${b} · ${W.tr(BORTLE[b])}`;
      if (txt !== lastLabel) { label.textContent = txt; lastLabel = txt; slider.setAttribute('aria-valuetext', txt); }
    }
    return { render, lang: () => { lastLabel = ''; } };
  });
})();
