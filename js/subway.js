/* II. Water in the tunnels: a cross-section of a New York street and subway. */
(function () {
  const W = window.WHV;
  const NS = 'http://www.w3.org/2000/svg';

  W.register('subway', (el) => {
    const svg = el.querySelector('#subway-svg');
    const litresEl = el.querySelector('#subway-litres');
    const levelEl = el.querySelector('#subway-level');
    const rand = W.rng(11);

    const T = { x0: 180, x1: 1440, top: 500, bot: 730 }; // tunnel interior
    const STREET = 330;

    // skyline
    let sky = '';
    let x = 0;
    while (x < 1600) {
      const w = 60 + rand() * 110, h = 90 + rand() * 230;
      sky += `<rect x="${x.toFixed(0)}" y="${(STREET - h).toFixed(0)}" width="${(w - 6).toFixed(0)}" height="${h.toFixed(0)}" fill="#0c1018"/>`;
      for (let wy = STREET - h + 14; wy < STREET - 16; wy += 18) {
        for (let wx = x + 8; wx < x + w - 16; wx += 14) {
          if (rand() < 0.3) sky += `<rect class="win" x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="7" fill="#f2a541" opacity="0"/>`;
        }
      }
      x += w;
    }
    // soil strata
    let soil = '';
    for (let i = 0; i < 260; i++) {
      const sx = rand() * 1600, sy = STREET + 30 + rand() * 560;
      if (sy > T.top - 30 && sy < T.bot + 30 && sx > T.x0 - 40 && sx < T.x1 + 40) continue;
      soil += `<ellipse cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" rx="${(3 + rand() * 12).toFixed(1)}" ry="${(2 + rand() * 5).toFixed(1)}" fill="#1b1a17" opacity="${(0.4 + rand() * 0.5).toFixed(2)}"/>`;
    }
    // columns
    let cols = '';
    for (let cx = T.x0 + 90; cx < T.x1 - 40; cx += 110) {
      cols += `<g class="col" data-x="${cx}"><rect x="${cx - 7}" y="${T.top}" width="14" height="${T.bot - T.top}" fill="#58616e"/><rect x="${cx - 13}" y="${T.top}" width="26" height="6" fill="#58616e"/><rect x="${cx - 13}" y="${T.bot - 6}" width="26" height="6" fill="#58616e"/></g>`;
    }
    // train
    let train = '';
    for (let i = 0; i < 3; i++) {
      const tx = 470 + i * 250;
      train += `<rect x="${tx}" y="${T.bot - 118}" width="236" height="96" rx="8" fill="#232a33" stroke="#39424e"/>`;
      for (let j = 0; j < 5; j++) train += `<rect class="twin" x="${tx + 16 + j * 44}" y="${T.bot - 100}" width="28" height="30" rx="3" fill="#f2e2b0" opacity="0.8"/>`;
    }

    svg.insertAdjacentHTML('beforeend', `
      <defs>
        <linearGradient id="sw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070c"/><stop offset="1" stop-color="#0d1320"/></linearGradient>
        <linearGradient id="sw-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2620"/><stop offset="1" stop-color="#15130f"/></linearGradient>
        <linearGradient id="sw-watergrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b8fdb" stop-opacity="0.75"/><stop offset="1" stop-color="#0c2a4a" stop-opacity="0.95"/></linearGradient>
        <clipPath id="sw-clip"><rect x="${T.x0}" y="${T.top}" width="${T.x1 - T.x0}" height="${T.bot - T.top}"/></clipPath>
      </defs>
      <rect width="1600" height="900" fill="url(#sw-sky)"/>
      <g>${sky}</g>
      <rect y="${STREET}" width="1600" height="${900 - STREET}" fill="url(#sw-soil)"/>
      <g>${soil}</g>
      <path id="sw-gw" d="" fill="#3b8fdb" opacity="0.10"/>
      <line id="sw-gwline" x1="0" x2="1600" y1="0" y2="0" stroke="#3b8fdb" stroke-dasharray="6 8" stroke-width="2" opacity="0.6"/>
      <rect x="${T.x0 - 22}" y="${T.top - 22}" width="${T.x1 - T.x0 + 44}" height="${T.bot - T.top + 44}" fill="#3a3a38"/>
      <rect x="${T.x0}" y="${T.top}" width="${T.x1 - T.x0}" height="${T.bot - T.top}" fill="#0b0d11"/>
      <g id="sw-lights">${Array.from({ length: 11 }, (_, i) => `<rect x="${T.x0 + 40 + i * 115}" y="${T.top + 10}" width="40" height="4" fill="#fff4d6"/>`).join('')}</g>
      <g id="sw-inside">
        ${train}
        <rect x="${T.x0}" y="${T.bot - 16}" width="${T.x1 - T.x0}" height="16" fill="#2b2b2b"/>
        <rect x="${T.x0}" y="${T.bot - 20}" width="${T.x1 - T.x0}" height="4" fill="#6b6f75"/>
        ${cols}
      </g>
      <g clip-path="url(#sw-clip)">
        <path id="sw-water" d="" fill="url(#sw-watergrad)"/>
        <path id="sw-surf" d="" fill="none" stroke="#9cd0ff" stroke-width="2" opacity="0.7"/>
      </g>
      <g id="sw-pump">
        <rect x="${T.x0 + 18}" y="${T.bot - 70}" width="50" height="50" rx="4" fill="#1d2430" stroke="#58616e"/>
        <circle cx="${T.x0 + 43}" cy="${T.bot - 45}" r="14" fill="none" stroke="#58616e" stroke-width="3"/>
        <circle id="sw-pumplamp" cx="${T.x0 + 60}" cy="${T.bot - 62}" r="4" fill="#259c7e"/>
      </g>
      <rect id="sw-street" x="0" y="${STREET}" width="1600" height="22" fill="#23262b"/>
      <path id="sw-void" d="" fill="#050608"/>
      <path id="sw-hole" d="" fill="#23262b"/>
      <path id="sw-crack" d="" fill="none" stroke="#000" stroke-width="3"/>
      <g id="sw-plants"></g>
      <g font-family="IBM Plex Mono, monospace" font-size="17" fill="#bdb7a8" letter-spacing="1">
        <text id="sw-l-street" x="${T.x1 - 10}" y="${STREET + 50}" text-anchor="end"></text>
        <text id="sw-l-tunnel" x="${T.x1 - 20}" y="${T.top + 42}" text-anchor="end"></text>
        <text id="sw-l-pump" x="${T.x0 + 80}" y="${T.bot - 40}"></text>
        <text id="sw-l-gw" x="${T.x0}" y="0" fill="#7fb6ea"></text>
      </g>
    `);
    const $ = (id) => svg.querySelector('#' + id);
    const water = $('sw-water'), surf = $('sw-surf'), gw = $('sw-gw'), gwline = $('sw-gwline');
    const lamp = $('sw-pumplamp'), lights = $('sw-lights'), hole = $('sw-hole'), voidEl = $('sw-void'), crack = $('sw-crack'), street = $('sw-street');
    const wins = [...svg.querySelectorAll('.win')], twins = [...svg.querySelectorAll('.twin')], colsEl = [...svg.querySelectorAll('.col')];
    const lGw = $('sw-l-gw'), plantsG = $('sw-plants');

    // weeds along the street
    let weeds = '';
    for (let i = 0; i < 40; i++) {
      const wx = rand() * 1600, hgt = 8 + rand() * 26;
      weeds += `<path data-h="${hgt.toFixed(1)}" d="M${wx.toFixed(0)} ${STREET} q ${(rand() * 10 - 5).toFixed(1)} -${hgt.toFixed(0)} ${(rand() * 16 - 8).toFixed(1)} -${hgt.toFixed(0)}" stroke="#6f9a55" stroke-width="2" fill="none"/>`;
    }
    plantsG.innerHTML = weeds;

    const narrow = matchMedia('(max-width: 860px)');
    const fit = () => svg.setAttribute('preserveAspectRatio', narrow.matches ? 'xMinYMid slice' : 'xMidYMid slice');
    narrow.addEventListener('change', fit);
    fit();

    function lang() {
      const ro = W.lang === 'ro';
      $('sw-l-street').textContent = ro ? 'STRADA' : 'STREET';
      $('sw-l-tunnel').textContent = ro ? 'TUNEL DE METROU' : 'SUBWAY TUNNEL';
      $('sw-l-pump').textContent = ro ? 'POMPĂ' : 'PUMP';
      lGw.textContent = ro ? 'PÂNZA FREATICĂ' : 'WATER TABLE';
      last = -1;
    }
    let last = -1;
    lang();

    function render({ t, now }) {
      const h = t * 8766;
      const phase = W.reduced ? 0 : now / 900;
      if (Math.abs(h - last) < 0.002 && W.reduced) return;
      last = h;
      const power = h < 0.8 ? 1 : 0;
      const f = Math.min(1, W.smooth(0.8, 36, h) * 0.78 + W.smooth(36, 400, h) * 0.22);
      const level = T.bot - (T.bot - T.top + 10) * f;
      let d = `M${T.x0} ${T.bot + 10} L${T.x0} ${level}`;
      let sd = `M${T.x0} ${level}`;
      for (let xx = T.x0; xx <= T.x1; xx += 20) {
        const y = level + Math.sin(xx / 60 + phase) * 3 + Math.sin(xx / 23 - phase * 1.4) * 1.5;
        d += ` L${xx} ${y.toFixed(1)}`; sd += ` L${xx} ${y.toFixed(1)}`;
      }
      d += ` L${T.x1} ${T.bot + 10} Z`;
      water.setAttribute('d', f > 0.001 ? d : '');
      surf.setAttribute('d', f > 0.001 ? sd : '');
      // groundwater rises toward the street
      const gwy = W.lerp(800, STREET + 40, Math.min(1, W.smooth(0, 60, h) * 0.8 + W.smooth(60, 2000, h) * 0.2));
      gw.setAttribute('d', `M0 ${gwy} L1600 ${gwy} L1600 900 L0 900 Z`);
      gwline.setAttribute('y1', gwy); gwline.setAttribute('y2', gwy);
      lGw.setAttribute('y', gwy - 10);
      lamp.setAttribute('fill', power ? '#259c7e' : '#d6456f');
      lights.setAttribute('opacity', power ? 1 : 0);
      const winA = power ? 0.85 : 0;
      wins.forEach((w, i) => w.setAttribute('opacity', i % 7 === 0 && h < 30 ? 0.3 * (1 - W.smooth(10, 30, h)) : winA));
      twins.forEach((w) => w.setAttribute('opacity', power ? 0.8 : 0.05));
      // years: rust, collapse, weeds
      const rust = W.smooth(0.08, 15, t);
      const fall = W.smooth(12, 22, t);
      colsEl.forEach((c, i) => {
        const col = `rgb(${Math.round(W.lerp(88, 140, rust))},${Math.round(W.lerp(97, 70, rust))},${Math.round(W.lerp(110, 40, rust))})`;
        c.querySelectorAll('rect').forEach((r) => r.setAttribute('fill', col));
        const bend = (i === 5 || i === 6) ? fall : (i === 4 || i === 7) ? fall * 0.4 : 0;
        c.setAttribute('transform', bend ? `rotate(${(i % 2 ? 1 : -1) * bend * 14} ${c.dataset.x} ${T.bot}) translate(0 ${bend * 30})` : '');
        c.setAttribute('opacity', 1 - (i === 5 ? fall * 0.9 : 0));
      });
      const cx0 = T.x0 + 90 + 110 * 4.4, cx1 = T.x0 + 90 + 110 * 6.6, sag = fall * 180;
      hole.setAttribute('d', fall > 0.01 ? `M${cx0} ${STREET} Q ${(cx0 + cx1) / 2} ${STREET + sag * 1.4} ${cx1} ${STREET} L${cx1} ${STREET + 22} Q ${(cx0 + cx1) / 2} ${STREET + 22 + sag * 1.4} ${cx0} ${STREET + 22} Z` : '');
      voidEl.setAttribute('d', fall > 0.01 ? `M${cx0 - 4} ${STREET - 1} L${cx1 + 4} ${STREET - 1} L${cx1 + 4} ${STREET + 22} Q ${(cx0 + cx1) / 2} ${STREET + 30 + sag * 1.5} ${cx0 - 4} ${STREET + 22} Z` : '');
      crack.setAttribute('d', rust > 0.05 ? `M${cx0 - 30} ${STREET + 2} l 20 6 l 18 -4 l 30 9 l 24 -3 M${cx1 - 40} ${STREET + 3} l 26 8 l 30 -6` : '');
      crack.setAttribute('opacity', Math.min(1, rust * 2));
      const grow = W.smooth(0.3, 25, t);
      plantsG.setAttribute('transform', `translate(0 ${STREET}) scale(1 ${Math.max(0.001, grow)}) translate(0 ${-STREET})`);

      const litres = Math.max(0, h) * 2.08e6;
      const ro = W.lang === 'ro';
      litresEl.textContent = litres < 1e6 ? W.nf(litres) + ' L'
        : litres < 1e9 ? W.nf(litres / 1e6, litres < 1e8 ? 1 : 0) + (ro ? ' mil. L' : ' million L')
          : W.nf(litres / 1e9, litres < 1e11 ? 1 : 0) + (ro ? ' mld. L' : ' billion L');
      levelEl.textContent = '+ ' + W.fmtT(t) + ' · ' + (W.lang === 'ro' ? 'tunel inundat ' : 'tunnel flooded ') + Math.round(f * 100) + '%';
    }
    return { render, lang };
  });
})();
