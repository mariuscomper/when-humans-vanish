/* VII. Closer to home: Romania rewilding. */
(function () {
  const W = window.WHV;
  const S = W.smooth;

  const MARKERS = [
    { id: 'chernobyl', lon: 30.1, lat: 51.39, name: { en: 'Chornobyl', ro: 'Cernobîl' } },
    { id: 'carpathians', lon: 25.75, lat: 46.45, name: { en: 'Carpathians', ro: 'Carpații' } },
    { id: 'transfagarasan', lon: 24.62, lat: 45.6, name: { en: 'Transfăgărășan', ro: 'Transfăgărășan' }, dy: 16 },
    { id: 'delta', lon: 29.2, lat: 45.12, name: { en: 'Danube Delta', ro: 'Delta Dunării' } },
    { id: 'baragan', lon: 27.3, lat: 44.62, name: { en: 'Bărăgan', ro: 'Bărăgan' } },
    { id: 'irongates', lon: 22.53, lat: 44.67, name: { en: 'Iron Gates', ro: 'Porțile de Fier' } },
    { id: 'bucharest', lon: 26.09, lat: 44.43, name: { en: 'Bucharest', ro: 'București' }, dy: 16 },
  ];
  const RIDGE = [[22.3, 47.9], [24.3, 47.8], [25.3, 47.3], [26.0, 46.6], [26.3, 45.9], [25.8, 45.5], [24.5, 45.5], [23.2, 45.3], [22.4, 45.4], [22.0, 45.0]];
  const APUSENI = [22.8, 46.5];

  function distToRidge(lon, lat) {
    let best = Math.hypot(lon - APUSENI[0], lat - APUSENI[1]) * 1.3;
    for (let i = 1; i < RIDGE.length; i++) {
      const [ax, ay] = RIDGE[i - 1], [bx, by] = RIDGE[i];
      const dx = bx - ax, dy = by - ay;
      const k = W.clamp(((lon - ax) * dx + (lat - ay) * dy) / (dx * dx + dy * dy));
      best = Math.min(best, Math.hypot(lon - ax - k * dx, lat - ay - k * dy));
    }
    return best;
  }

  W.register('romania', (el, sc) => {
    const cv = el.querySelector('.ro-forest');
    const hud = el.querySelector('#ro-forest');
    const proj = d3.geoMercator();
    let D = null, pts = [], markerEls = [], active = '', lastKey = '';
    const o = W.canvas(cv, () => { if (D) build(); });

    // loaded and sampled only once the reader gets near this chapter
    let asked = false;
    const start = () => {
      if (asked) return; asked = true;
      Promise.all([W.load('region-ro.json'), W.load('rivers-ro.json')]).then(([region, rivers]) => {
        D = { region, rivers, ro: region.features.find((f) => f.properties.n === 'Romania') };
        build();
      }).catch((e) => console.error(e));
    };

    function build() {
      const mobile = o.w < 860;
      const gauge = mobile ? 0 : 92;
      const box = { type: 'MultiPoint', coordinates: [[20.2, 43.5], [31.2, 51.7], [20.2, 51.7], [31.2, 43.5]] };
      if (mobile) proj.fitExtent([[16, 70], [o.w - 60, o.h * 0.5]], box);
      else proj.fitExtent([[gauge + 30, 80], [o.w * 0.56, o.h - 40]], box);
      const path = d3.geoPath(proj);
      const node = el.querySelector('#ro-svg');
      node.setAttribute('viewBox', `0 0 ${o.w} ${o.h}`);
      const ring = d3.geoCircle().center([30.1, 51.39]).radius(0.3)();
      node.innerHTML = `
        <g>${D.region.features.filter((f) => f !== D.ro).map((f) => `<path d="${path(f)}" fill="rgba(236,230,214,0.035)" stroke="rgba(236,230,214,0.14)" stroke-width="0.7"/>`).join('')}</g>
        <path d="${path(D.ro)}" fill="none" stroke="rgba(236,230,214,0.55)" stroke-width="1.2"/>
        <g>${D.rivers.features.map((f) => {
          const big = /Danube|Donau|Bratul|Borcea|Dnipro/.test(f.properties.n);
          return `<path d="${path(f)}" fill="none" stroke="#3B8FDB" stroke-opacity="${big ? 0.8 : 0.45}" stroke-width="${big ? 2 : 0.9}" stroke-linecap="round"/>`;
        }).join('')}</g>
        <path d="${path(ring)}" fill="rgba(214,69,111,0.12)" stroke="#D6456F" stroke-dasharray="3 3"/>
        <g id="ro-markers" font-family="IBM Plex Mono, monospace" font-size="12"></g>`;
      const mg = node.querySelector('#ro-markers');
      markerEls = MARKERS.map((m) => {
        const [x, y] = proj([m.lon, m.lat]);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'ro-marker'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        const flip = x > o.w - 120;
        g.innerHTML = `<circle class="halo" r="14" fill="rgba(242,165,65,0.15)"/><circle class="ring" r="6" fill="#06080d" stroke="#f2a541" stroke-width="1.5"/><circle r="2.2" fill="#f2a541"/><text x="${flip ? -12 : 12}" y="${4 + (m.dy || 0)}" text-anchor="${flip ? 'end' : 'start'}" fill="#ece6d6" stroke="#080b0a" stroke-width="3" paint-order="stroke"></text>`;
        const go = () => {
          const step = sc.steps.find((s) => s.dataset.marker === m.id);
          if (step) step.scrollIntoView({ behavior: W.reduced ? 'auto' : 'smooth', block: 'start' });
        };
        g.addEventListener('click', go);
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        mg.appendChild(g);
        return { m, g };
      });
      lang();
      // forest sample points inside Romania
      pts = [];
      const r = W.rng(5);
      const step = Math.max(4, o.w / 260);
      const bb = path.bounds(D.ro);
      for (let y = bb[0][1]; y < bb[1][1]; y += step) {
        for (let x = bb[0][0]; x < bb[1][0]; x += step) {
          const jx = x + (r() - 0.5) * step, jy = y + (r() - 0.5) * step;
          const ll = proj.invert([jx, jy]);
          if (!d3.geoContains(D.ro, ll)) continue;
          const [lon, lat] = ll;
          const delta = lon > 28.65 && lat > 44.75 && lat < 45.5;
          const steppe = !delta && ((lon > 26.2 && lat < 45.1) || (lon > 27.6 && lat < 45.6) || (lon > 27 && lat < 44.9) || (lon > 20.9 && lon < 21.6 && lat > 45.6 && lat < 46.3));
          const d = distToRidge(lon, lat);
          pts.push({ x: jx, y: jy, rank: d / 1.3 + r() * 0.5, delta, steppe, s: r() });
        }
      }
      const forestable = pts.filter((p) => !p.delta && !p.steppe).sort((a, b) => a.rank - b.rank);
      forestable.forEach((p, i) => { p.q = i / pts.length; });
      pts.forEach((p) => { if (p.q === undefined) p.q = 2; });
      lastKey = '';
    }

    function lang() {
      markerEls.forEach(({ m, g }) => { g.querySelector('text').textContent = W.tr(m.name); g.setAttribute('aria-label', W.tr(m.name)); });
      lastKey = '';
    }

    function render({ s, t, now }) {
      start();
      if (!D || !pts.length) return;
      const idx = Math.max(0, Math.min(sc.steps.length - 1, Math.round(s)));
      const want = sc.steps[idx] ? sc.steps[idx].dataset.marker || '' : '';
      if (want !== active) {
        active = want;
        markerEls.forEach(({ m, g }) => {
          const on = m.id === active;
          g.style.opacity = !active || on ? 1 : 0.55;
          g.querySelector('text').setAttribute('font-weight', on ? '600' : '400');
          g.querySelector('.halo').setAttribute('r', on ? 22 : 12);
        });
      }
      const pulse = W.reduced ? 0.5 : 0.5 + 0.5 * Math.sin(now / 350);
      const cur = markerEls.find(({ m }) => m.id === active);
      if (cur) cur.g.querySelector('.halo').setAttribute('fill', `rgba(242,165,65,${0.12 + pulse * 0.2})`);

      const cov = 0.29 + 0.43 * S(3, 300, t);
      const key = cov.toFixed(3) + o.w;
      if (key === lastKey) return;
      lastKey = key;
      const ctx = o.ctx;
      ctx.clearRect(0, 0, o.w, o.h);
      const grass = S(5, 60, t), reeds = S(10, 80, t);
      const rr = Math.max(1.6, o.w / 520);
      for (const p of pts) {
        if (p.q < cov) {
          const young = p.q > 0.29;
          ctx.fillStyle = young ? `rgba(120,170,90,${0.55 + p.s * 0.3})` : `rgba(60,110,62,${0.7 + p.s * 0.3})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, rr * (0.8 + p.s * 0.5), 0, 7); ctx.fill();
        } else if (p.steppe) {
          ctx.fillStyle = `rgba(190,170,90,${0.12 + 0.4 * grass * p.s})`;
          ctx.fillRect(p.x, p.y, rr, rr);
        } else if (p.delta) {
          ctx.fillStyle = `rgba(80,160,150,${0.2 + 0.6 * reeds * p.s})`;
          ctx.fillRect(p.x, p.y, rr * 1.2, rr * 1.2);
        } else {
          ctx.fillStyle = 'rgba(170,150,110,0.14)';
          ctx.fillRect(p.x, p.y, rr * 0.8, rr * 0.8);
        }
      }
      hud.textContent = Math.round(cov * 100) + '%';
    }
    return { render, lang };
  });

})();
