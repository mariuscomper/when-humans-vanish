/* Night globe (hero + the moment) and the ice-age globe. */
(function () {
  const W = window.WHV;

  const landP = Promise.all([W.load('land-110m.json'), W.load('cities.json')]).then(([topo, c]) => {
    const land = topojson.feature(topo, topo.objects.land);
    const cities = [];
    for (let i = 0; i < c.length; i += 3) cities.push({ lon: c[i] / 10, lat: c[i + 1] / 10, pop: c[i + 2] });
    cities.sort((a, b) => b.pop - a.pop);
    return { land, cities };
  });

  function orthoGeometry(o, mobile) {
    const r = mobile ? Math.min(o.w * 0.46, o.h * 0.3) : Math.min(o.h * 0.42, o.w * 0.3);
    const cx = mobile ? o.w / 2 : o.w * 0.66;
    const cy = mobile ? o.h * 0.3 : o.h * 0.5;
    return { r, cx, cy };
  }

  /* ------------------------------------------------------------ hero globe */
  W.register('globe', (el) => {
    const cv = el.querySelector('canvas');
    const cap = el.querySelector('#globe-caption');
    let D = null;
    const mq = matchMedia('(max-width: 860px)');
    const proj = d3.geoOrthographic().clipAngle(90).precision(0.4);
    const o = W.canvas(cv);
    const path = d3.geoPath(proj, o.ctx);
    const grat = d3.geoGraticule10();
    const rand = W.rng(7);
    let planes = [];
    let rot = 0;

    landP.then((d) => {
      D = d;
      const big = d.cities.slice(0, 260);
      for (let i = 0; i < 240; i++) {
        let a, b, dist;
        do {
          a = big[(rand() * big.length) | 0]; b = big[(rand() * big.length) | 0];
          dist = d3.geoDistance([a.lon, a.lat], [b.lon, b.lat]);
        } while (dist < 0.25 || dist > 1.9);
        planes.push({
          interp: d3.geoInterpolate([a.lon, a.lat], [b.lon, b.lat]),
          k: rand(), speed: (0.018 + rand() * 0.02) / dist * 0.35,
          fuel: W.HOUR * (1.2 + Math.pow(rand(), 0.8) * 10), // hours of fuel left
        });
      }
      lang();
    }).catch((e) => console.error(e));

    function lang() {
      if (!D) return;
      cap.textContent = W.lang === 'ro'
        ? `Luminile a ${W.nf(D.cities.length)} de orașe · avioane în zbor`
        : `Night lights of ${W.nf(D.cities.length)} cities · flights in the air`;
    }

    function render({ t, dt, now }) {
      if (!D || !o.w) return;
      const ctx = o.ctx;
      const { r, cx, cy } = orthoGeometry(o, mq.matches);
      if (!W.reduced) rot += dt * 2.2;
      const lon0 = -26 + rot; // start centred on Europe / Africa
      proj.scale(r).translate([cx, cy]).rotate([-lon0 - 0, -28, 0]);
      const center = [lon0, 28];

      ctx.clearRect(0, 0, o.w, o.h);
      // atmosphere
      const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35);
      halo.addColorStop(0, 'rgba(90,130,200,0.20)');
      halo.addColorStop(0.35, 'rgba(60,90,160,0.07)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, o.w, o.h);
      // ocean
      const oc = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      oc.addColorStop(0, '#0e1626'); oc.addColorStop(1, '#060911');
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = oc; ctx.fill();
      ctx.beginPath(); path(grat); ctx.strokeStyle = 'rgba(236,230,214,0.035)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.beginPath(); path(D.land); ctx.fillStyle = '#101722'; ctx.fill();
      ctx.strokeStyle = 'rgba(236,230,214,0.07)'; ctx.lineWidth = 0.6; ctx.stroke();

      // city lights: sodium amber
      const level = 1 - 0.35 * W.smooth(0.0004, 0.0014, t);
      const spr = W.glow('rgba(255,170,70,0.9)', 48, 0.12);
      const scale = r / 380;
      ctx.globalCompositeOperation = 'lighter';
      for (const c of D.cities) {
        const dd = d3.geoDistance([c.lon, c.lat], center);
        if (dd > 1.52) continue;
        const p = proj([c.lon, c.lat]);
        const limb = Math.cos(dd);
        const s = (2.2 + Math.sqrt(c.pop) * 0.42) * scale * (0.55 + 0.45 * limb);
        ctx.globalAlpha = Math.min(1, 0.35 + c.pop / 3000) * level * (0.3 + 0.7 * limb);
        ctx.drawImage(spr, p[0] - s, p[1] - s, s * 2, s * 2);
      }
      // planes
      ctx.globalAlpha = 1;
      for (const pl of planes) {
        if (!W.reduced) pl.k = (pl.k + pl.speed * dt) % 1;
        const alive = 1 - W.smooth(pl.fuel * 0.9, pl.fuel * 1.1, t);
        if (alive <= 0.01) continue;
        const pos = pl.interp(pl.k);
        if (d3.geoDistance(pos, center) > 1.5) continue;
        const a = proj(pos), b = proj(pl.interp(Math.max(0, pl.k - 0.03)));
        const g = ctx.createLinearGradient(b[0], b[1], a[0], a[1]);
        g.addColorStop(0, 'rgba(236,230,214,0)'); g.addColorStop(1, `rgba(236,230,214,${0.55 * alive})`);
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(a[0], a[1]); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.9 * alive})`;
        ctx.fillRect(a[0] - 1, a[1] - 1, 2, 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      // terminator-ish rim shading
      const rim = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r);
      rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = rim; ctx.fill();
      ctx.strokeStyle = 'rgba(140,170,230,0.25)'; ctx.lineWidth = 1; ctx.stroke();
    }

    return { render, lang };
  });

  /* ------------------------------------------------------------ ice globe */
  // Rough southern limit of the Last Glacial Maximum ice sheets (lon, lat)
  const LGM = [[-180, 62], [-165, 63], [-150, 61], [-140, 58], [-130, 51], [-122, 46.8], [-115, 48], [-105, 48], [-97, 43],
    [-90, 38.5], [-85, 39], [-80, 40.5], [-74, 40.4], [-70, 41.2], [-65, 43], [-60, 45], [-52, 50], [-45, 58], [-30, 64],
    [-20, 63], [-13, 55], [-8, 51.4], [-5, 51.2], [-1, 52.4], [4, 53.4], [9, 53.2], [13, 52.1], [20, 51.4], [28, 53.3],
    [34, 55.2], [40, 58], [50, 61], [60, 63], [70, 66.5], [80, 72], [100, 74], [120, 74], [140, 70], [160, 64], [180, 62]];
  const lgmLat = (lon) => {
    for (let i = 1; i < LGM.length; i++) {
      if (lon <= LGM[i][0]) {
        const [x0, y0] = LGM[i - 1], [x1, y1] = LGM[i];
        return y0 + (y1 - y0) * (lon - x0) / (x1 - x0);
      }
    }
    return LGM[LGM.length - 1][1];
  };
  const NAMED = [
    ['Chicago', -87.63, 41.88], ['Toronto', -79.38, 43.65], ['Montreal', -73.57, 45.5], ['New York', -74.0, 40.71],
    ['Boston', -71.06, 42.36], ['Seattle', -122.33, 47.61], ['Stockholm', 18.07, 59.33], ['Oslo', 10.75, 59.91],
    ['Helsinki', 24.94, 60.17], ['Copenhagen', 12.57, 55.68], ['Berlin', 13.4, 52.52], ['Warsaw', 21.01, 52.23],
    ['Dublin', -6.26, 53.35], ['Edinburgh', -3.19, 55.95], ['Hamburg', 9.99, 53.55], ['St Petersburg', 30.3, 59.94],
    ['Riga', 24.1, 56.95], ['Minsk', 27.56, 53.9], ['Detroit', -83.05, 42.33], ['Winnipeg', -97.14, 49.9],
  ];
  const NAMED_RO = { 'New York': 'New York', Copenhagen: 'Copenhaga', Warsaw: 'Varșovia', 'St Petersburg': 'Sankt Petersburg', Montreal: 'Montréal' };

  W.register('ice', (el) => {
    const cv = el.querySelector('canvas');
    const countEl = el.querySelector('#ice-count');
    const namesEl = el.querySelector('#ice-names');
    let D = null;
    const mq = matchMedia('(max-width: 860px)');
    const proj = d3.geoOrthographic().clipAngle(90).precision(0.5);
    const o = W.canvas(cv);
    const path = d3.geoPath(proj, o.ctx);
    const grat = d3.geoGraticule10();
    let cities = [];
    let drift = 0;
    let lastKey = '';

    landP.then((d) => { D = d; cities = d.cities.filter((c) => c.pop >= 150); }).catch((e) => console.error(e));

    function iceShape(g) {
      const ring = [];
      for (let lon = 180; lon >= -180; lon -= 2) ring.push([lon, 90 - (90 - lgmLat(lon)) * g]);
      const f = { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] } };
      if (d3.geoArea(f) > 2 * Math.PI) ring.reverse();
      return f;
    }

    function iceAmount(t) {
      let g = W.smooth(22e3, 62e3, t);
      if (t > 90e3) g *= 0.55 + 0.45 * Math.cos((2 * Math.PI * (t - 62e3)) / 100e3);
      return g;
    }

    function render({ t, dt }) {
      if (!D || !o.w) return;
      const ctx = o.ctx;
      const { r, cx, cy } = orthoGeometry(o, mq.matches);
      const rr = mq.matches ? r : r * 1.05;
      const ccx = mq.matches ? cx : o.w * 0.4;
      if (!W.reduced) drift += dt;
      const lon0 = -35 + Math.sin(drift * 0.08) * 22;
      proj.scale(rr).translate([ccx, cy]).rotate([-lon0, -52, 0]);
      const g = iceAmount(t);

      ctx.clearRect(0, 0, o.w, o.h);
      const halo = ctx.createRadialGradient(ccx, cy, rr * 0.9, ccx, cy, rr * 1.3);
      halo.addColorStop(0, 'rgba(170,200,230,0.16)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, o.w, o.h);
      const oc = ctx.createRadialGradient(ccx - rr * 0.3, cy - rr * 0.4, rr * 0.1, ccx, cy, rr);
      oc.addColorStop(0, '#152234'); oc.addColorStop(1, '#070b13');
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = oc; ctx.fill();
      ctx.beginPath(); path(grat); ctx.strokeStyle = 'rgba(236,230,214,0.04)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.beginPath(); path(D.land); ctx.fillStyle = '#26302a'; ctx.fill();
      ctx.strokeStyle = 'rgba(236,230,214,0.09)'; ctx.stroke();

      // ice sheets (Greenland is always there)
      const ice = iceShape(Math.max(g, 0.0001));
      const gr = ctx.createLinearGradient(ccx, cy - rr, ccx, cy + rr);
      gr.addColorStop(0, 'rgba(240,247,252,0.97)'); gr.addColorStop(1, 'rgba(196,216,232,0.92)');
      // Greenland and the Alps: ice clipped to the land it sits on
      ctx.save();
      ctx.beginPath(); path(D.land); ctx.clip();
      ctx.fillStyle = gr;
      ctx.beginPath(); path(d3.geoCircle().center([-42, 72]).radius(11)()); ctx.fill();
      if (g > 0.05) { ctx.beginPath(); path(d3.geoCircle().center([10, 46.4]).radius(2.6 * g)()); ctx.fill(); }
      ctx.restore();
      if (g > 0.01) {
        ctx.beginPath(); path(ice); ctx.fillStyle = gr; ctx.fill();
        ctx.strokeStyle = 'rgba(160,200,235,0.9)'; ctx.lineWidth = 1.4; ctx.stroke();
      }

      // cities: those under the ice are gone
      const center = [lon0, 52];
      let n = 0;
      for (const c of cities) {
        const under = g > 0.01 && c.lat > 90 - (90 - lgmLat(c.lon)) * g;
        if (under) n++;
        if (d3.geoDistance([c.lon, c.lat], center) > 1.5) continue;
        const p = proj([c.lon, c.lat]);
        if (under) {
          ctx.strokeStyle = 'rgba(90,120,150,0.55)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p[0] - 2, p[1] - 2); ctx.lineTo(p[0] + 2, p[1] + 2); ctx.moveTo(p[0] + 2, p[1] - 2); ctx.lineTo(p[0] - 2, p[1] + 2); ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(236,230,214,0.55)';
          ctx.beginPath(); ctx.arc(p[0], p[1], 1.1 + Math.sqrt(c.pop) * 0.02, 0, 7); ctx.fill();
        }
      }
      // Bucharest, spared
      const b = [26.1, 44.43];
      if (d3.geoDistance(b, center) < 1.5) {
        const p = proj(b);
        ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 7); ctx.stroke();
        ctx.fillStyle = '#ece6d6'; ctx.font = '500 11px "IBM Plex Mono", monospace';
        ctx.fillText(W.lang === 'ro' ? 'București' : 'Bucharest', p[0] + 9, p[1] + 4);
      }
      const rim = ctx.createRadialGradient(ccx, cy, rr * 0.7, ccx, cy, rr);
      rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = rim; ctx.fill();

      const names = NAMED.filter(([, lon, lat]) => g > 0.01 && lat > 90 - (90 - lgmLat(lon)) * g).map(([nm]) => (W.lang === 'ro' && NAMED_RO[nm]) || nm);
      const key = n + '|' + names.join(',') + W.lang;
      if (key !== lastKey) {
        lastKey = key;
        countEl.textContent = W.nf(n);
        namesEl.textContent = names.slice(0, 6).join(' · ') + (names.length > 6 ? ' …' : '');
      }
    }
    return { render, lang: () => { lastKey = ''; } };
  });
})();
