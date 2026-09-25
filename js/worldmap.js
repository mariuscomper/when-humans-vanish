/* World maps: I. the grid failing, IV. the nuclear cooling pools. */
(function () {
  const W = window.WHV;

  const FUELS = [
    { id: 0, color: '#D27A25', rgb: '210,122,37', name: { en: 'Coal, gas & oil', ro: 'Cărbune, gaz și petrol' } },
    { id: 1, color: '#D6456F', rgb: '214,69,111', name: { en: 'Nuclear', ro: 'Nuclear' } },
    { id: 2, color: '#3B8FDB', rgb: '59,143,219', name: { en: 'Hydro', ro: 'Hidro' } },
    { id: 3, color: '#259C7E', rgb: '37,156,126', name: { en: 'Wind', ro: 'Eolian' } },
    { id: 4, color: '#A99420', rgb: '169,148,32', name: { en: 'Solar', ro: 'Solar' } },
    { id: 5, color: '#8A8F99', rgb: '138,143,153', name: { en: 'Other', ro: 'Altele' } },
  ];

  const baseP = Promise.all([W.load('land-110m.json'), W.load('plants.json'), W.load('cities.json')]).then(([topo, pl, c]) => {
    const land = topojson.feature(topo, topo.objects.land);
    const rand = W.rng(42);
    const plants = [];
    for (let i = 0; i < pl.length; i += 4) {
      const f = pl[i + 2], r = rand();
      // hours until each plant drops off the grid
      let off;
      if (f === 0 || f === 5) off = 2 + 22 * Math.pow(r, 1.4) + (rand() < 0.1 ? 20 : 0);
      else if (f === 1) off = 0.5 + 4 * r;
      else if (f === 2) off = rand() < 0.35 ? 200 + 2000 * r : 12 + 36 * r;
      else if (f === 3) off = rand() < 0.25 ? 150 + 1000 * r : 6 + 34 * r;
      else off = rand() < 0.15 ? 400 + 3000 * r : 10 + 38 * r;
      plants.push({ lon: pl[i] / 10, lat: pl[i + 1] / 10, f, mw: pl[i + 3], off, x: 0, y: 0,
        // nuclear timeline, in days
        diesel: 5 + 9 * rand(), boil: 5 + 15 * rand(), expose: 20 + 60 * rand() });
    }
    const cities = [];
    for (let i = 0; i < c.length; i += 3) cities.push({ lon: c[i] / 10, lat: c[i + 1] / 10, pop: c[i + 2], off: 8 + 34 * rand(), hold: rand() < 0.03, x: 0, y: 0 });
    return { land, plants, cities };
  });

  function makeBase(o, D, proj, landFill, edge) {
    const pad = Math.max(16, o.w * 0.03);
    const top = o.w < 860 ? 150 : 90;
    proj.fitExtent([[pad, top], [o.w - pad, o.h - (o.w < 860 ? 120 : 80)]], { type: 'Sphere' });
    const base = document.createElement('canvas');
    base.width = o.cv.width; base.height = o.cv.height;
    const b = base.getContext('2d');
    b.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
    const path = d3.geoPath(proj, b);
    b.beginPath(); path({ type: 'Sphere' }); b.fillStyle = 'rgba(255,255,255,0.012)'; b.fill();
    b.strokeStyle = 'rgba(236,230,214,0.08)'; b.lineWidth = 1; b.stroke();
    b.beginPath(); path(d3.geoGraticule10()); b.strokeStyle = 'rgba(236,230,214,0.03)'; b.lineWidth = 0.5; b.stroke();
    b.beginPath(); path(D.land); b.fillStyle = landFill; b.fill();
    b.strokeStyle = edge; b.lineWidth = 0.6; b.stroke();
    for (const p of D.plants) { const q = proj([p.lon, p.lat]); p.x = q[0]; p.y = q[1]; }
    for (const c of D.cities) { const q = proj([c.lon, c.lat]); c.x = q[0]; c.y = q[1]; }
    return base;
  }

  /* ------------------------------------------------------------ I. lights */
  W.register('lights', (el) => {
    const cv = el.querySelector('canvas');
    const gwEl = el.querySelector('#lights-gw');
    const timeEl = el.querySelector('#lights-time');
    const legend = el.querySelector('#lights-legend');
    const tip = el.querySelector('#lights-tip');
    const proj = d3.geoNaturalEarth1();
    let D = null, base = null, grid = null;
    const on = [true, true, true, true, true, true];
    let lastKey = '', hover = null, lastT = 0;
    const o = W.canvas(cv, () => { if (D) { base = makeBase(o, D, proj, '#0d131c', 'rgba(236,230,214,0.06)'); buildGrid(); lastKey = ''; } });

    const buttons = FUELS.map((f) => {
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'fuel-' + f.id; b.setAttribute('aria-pressed', 'true');
      b.innerHTML = `<span class="sw" style="background:${f.color};color:${f.color}"></span><span class="nm"></span><span class="n"></span>`;
      b.addEventListener('click', () => { on[f.id] = !on[f.id]; b.setAttribute('aria-pressed', String(on[f.id])); lastKey = ''; });
      legend.appendChild(b);
      return b;
    });

    function buildGrid() {
      grid = new Map();
      D.plants.forEach((p, i) => {
        const k = ((p.x / 12) | 0) + ',' + ((p.y / 12) | 0);
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(i);
      });
    }

    baseP.then((d) => {
      D = d;
      base = makeBase(o, D, proj, '#0d131c', 'rgba(236,230,214,0.06)');
      buildGrid();
    }).catch((e) => console.error(e));

    cv.addEventListener('pointermove', (e) => {
      if (!grid) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let best = null, bd = 100;
      const gx = (x / 12) | 0, gy = (y / 12) | 0;
      for (let i = gx - 1; i <= gx + 1; i++) for (let j = gy - 1; j <= gy + 1; j++) {
        const cell = grid.get(i + ',' + j);
        if (!cell) continue;
        for (const idx of cell) {
          const p = D.plants[idx];
          if (!on[p.f]) continue;
          const d = (p.x - x) ** 2 + (p.y - y) ** 2;
          if (d < bd) { bd = d; best = p; }
        }
      }
      hover = best;
      if (!best) { tip.hidden = true; return; }
      tip.hidden = false;
      tip.style.left = best.x + 'px'; tip.style.top = best.y + 'px';
      showTip();
    });
    cv.addEventListener('pointerleave', () => { hover = null; tip.hidden = true; });

    function showTip() {
      if (!hover) return;
      const h = lastT * 8766;
      const ro = W.lang === 'ro';
      const online = h < hover.off;
      const state = online ? (ro ? 'în funcțiune' : 'online') : (ro ? 'oprită după ' : 'offline after ') + W.fmtT(hover.off / 8766);
      tip.innerHTML = `<b>${W.tr(FUELS[hover.f].name)}</b> · ${W.nf(hover.mw)} MW<br>${state}`;
    }

    function lang() {
      FUELS.forEach((f, i) => { buttons[i].querySelector('.nm').textContent = W.tr(f.name); });
      lastKey = '';
    }
    lang();

    function render({ t }) {
      if (!D || !base) return;
      const h = t * 8766;
      const key = h.toFixed(2) + on.join('');
      if (key === lastKey) return;
      lastKey = key; lastT = t;
      const ctx = o.ctx;
      ctx.clearRect(0, 0, o.w, o.h);
      ctx.drawImage(base, 0, 0, o.w, o.h);
      const s = o.w / 1400;

      // city lights, sodium amber
      const spr = W.glow('rgba(255,170,70,0.9)', 48, 0.12);
      ctx.globalCompositeOperation = 'lighter';
      for (const c of D.cities) {
        let a = c.hold ? 1 - W.smooth(40, 110, h) * 0.8 : 1 - W.smooth(c.off - 1.5, c.off, h);
        if (a <= 0.01) continue;
        if (h > c.off - 3 && h < c.off && !c.hold) a *= 0.4 + 0.6 * ((Math.sin(h * 40 + c.x) > 0) ? 1 : 0.2);
        const r = (1.2 + Math.sqrt(c.pop) * 0.17) * s;
        ctx.globalAlpha = Math.min(0.8, 0.22 + c.pop / 6000) * a;
        ctx.drawImage(spr, c.x - r, c.y - r, r * 2, r * 2);
      }
      // plants
      let gw = 0;
      const counts = [0, 0, 0, 0, 0, 0], online = [0, 0, 0, 0, 0, 0];
      const sprites = FUELS.map((f) => W.glow(`rgba(${f.rgb},0.95)`, 32, 0.15));
      for (const p of D.plants) {
        counts[p.f]++;
        const alive = h < p.off;
        if (alive) { online[p.f]++; gw += p.mw; }
        if (!on[p.f]) continue;
        if (alive) {
          const r = (1.1 + Math.sqrt(p.mw) * 0.055) * s * 2;
          ctx.globalAlpha = 0.75;
          ctx.drawImage(sprites[p.f], p.x - r, p.y - r, r * 2, r * 2);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = '#5a606b';
      for (const p of D.plants) {
        if (!on[p.f] || h < p.off) continue;
        ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
      if (hover) {
        ctx.strokeStyle = '#ece6d6'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(hover.x, hover.y, 6, 0, 7); ctx.stroke();
        showTip();
      }
      gwEl.textContent = W.nf(gw / 1000) + ' GW';
      timeEl.textContent = '+ ' + W.fmtT(t);
      FUELS.forEach((f, i) => {
        buttons[i].querySelector('.n').textContent = W.nf(online[i]) + '/' + W.nf(counts[i]);
        buttons[i].setAttribute('aria-label', `${W.tr(f.name)}: ${online[i]} ${W.lang === 'ro' ? 'din' : 'of'} ${counts[i]} ${W.lang === 'ro' ? 'în funcțiune' : 'online'}`);
      });
    }
    return { render, lang };
  });

  /* ------------------------------------------------------------ IV. nuclear */
  const NUKE_STATES = [
    { c: '#C9A23A', en: 'Cooling on backup diesel', ro: 'Răcire pe generatoare diesel' },
    { c: '#E0703A', en: 'Pools heating and boiling', ro: 'Bazine care se încălzesc și fierb' },
    { c: '#D6456F', en: 'Spent fuel exposed', ro: 'Combustibil uzat expus' },
  ];

  W.register('nuclear', (el) => {
    const cv = el.querySelector('canvas');
    const timeEl = el.querySelector('#nuke-time');
    const statsEl = el.querySelector('#nuke-stats');
    const proj = d3.geoNaturalEarth1();
    let D = null, base = null, nukes = [];
    let lastKey = '';
    const o = W.canvas(cv, () => { if (D) { base = makeBase(o, D, proj, '#15101a', 'rgba(236,230,214,0.06)'); lastKey = ''; } });
    const plumeSpr = W.glow('rgba(214,69,111,0.55)', 64, 0.05);

    baseP.then((d) => {
      D = d;
      nukes = d.plants.filter((p) => p.f === 1);
      base = makeBase(o, D, proj, '#15101a', 'rgba(236,230,214,0.06)');
    }).catch((e) => console.error(e));

    statsEl.innerHTML = NUKE_STATES.map((s, i) => `<li><span class="lb"></span><i style="background:${s.c}"></i><b id="nk-${i}">0</b></li>`).join('');
    const lang = () => { statsEl.querySelectorAll('.lb').forEach((e, i) => { e.textContent = W.tr(NUKE_STATES[i]); }); lastKey = ''; };
    lang();

    function render({ t, now }) {
      if (!D || !base) return;
      const days = t * 365.25;
      const key = days.toFixed(2) + ((now / 120) | 0);
      if (key === lastKey) return;
      lastKey = key;
      const ctx = o.ctx;
      ctx.clearRect(0, 0, o.w, o.h);
      ctx.drawImage(base, 0, 0, o.w, o.h);
      const s = o.w / 1400;
      const n = [0, 0, 0];

      // Chernobyl, 1986
      const ch = proj([30.1, 51.39]);
      ctx.strokeStyle = 'rgba(236,230,214,0.35)'; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(ch[0], ch[1], 9 * s + 4, 0, 7); ctx.stroke(); ctx.setLineDash([]);

      for (const p of nukes) {
        const since = days - p.diesel - p.boil - p.expose;
        if (since > 0) {
          const k = Math.min(1, since / 150);
          const len = (10 + 50 * k) * s * 2, wid = (4 + 12 * k) * s * 2;
          ctx.globalAlpha = 0.22;
          ctx.drawImage(plumeSpr, p.x - wid * 0.4, p.y - wid, len, wid * 2);
        }
      }
      const pulse = 0.5 + 0.5 * Math.sin(now / 300);
      for (const p of nukes) {
        let st = 0;
        if (days > p.diesel) st = 1;
        if (days > p.diesel + p.boil + p.expose) st = 2;
        n[st]++;
        const r = (2.2 + Math.sqrt(p.mw) * 0.04) * s * 1.5;
        ctx.globalAlpha = 1;
        ctx.fillStyle = NUKE_STATES[st].c;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x + r, p.y); ctx.lineTo(p.x, p.y + r); ctx.lineTo(p.x - r, p.y); ctx.closePath(); ctx.fill();
        if (st >= 1 && !W.reduced) {
          ctx.globalAlpha = 0.5 * (1 - pulse);
          ctx.strokeStyle = NUKE_STATES[st].c;
          ctx.beginPath(); ctx.arc(p.x, p.y, r + 2 + pulse * 7 * s * 2, 0, 7); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // labels
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#ece6d6';
      const cer = proj([28.06, 44.32]);
      ctx.beginPath(); ctx.moveTo(cer[0] + 3, cer[1] + 3); ctx.lineTo(cer[0] + 14, cer[1] + 22); ctx.strokeStyle = 'rgba(236,230,214,0.6)'; ctx.stroke();
      ctx.fillText('Cernavodă', cer[0] + 16, cer[1] + 32);
      ctx.fillStyle = 'rgba(236,230,214,0.7)';
      ctx.fillText(W.lang === 'ro' ? 'Cernobîl, 1986' : 'Chernobyl, 1986', ch[0] + 12, ch[1] - 10);

      timeEl.textContent = '+ ' + W.fmtT(t);
      n.forEach((v, i) => { const e = document.getElementById('nk-' + i); if (e) e.textContent = W.nf(v); });
    }
    return { render, lang };
  });
})();
