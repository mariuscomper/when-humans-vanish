/* VIII. What lasts (longevity ranges) and IX. The air remembers (CO2 decay). */
(function () {
  const W = window.WHV;
  const NS = 'http://www.w3.org/2000/svg';

  // The table in the page is the source of truth (it works without JavaScript and is translated
  // like everything else); the chart only draws it.
  const ITEMS = [...document.querySelectorAll('#lasts-data tbody tr')].map((tr) => ({
    min: +tr.dataset.min, max: +tr.dataset.max,
    name: () => tr.cells[0].textContent, range: () => tr.cells[1].textContent, note: () => tr.cells[2].textContent,
  }));

  const TICKS = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
  const tickLabel = (v) => {
    const ro = W.lang === 'ro';
    if (v < 1e6) return W.nf(v);
    if (v < 1e9) return W.nf(v / 1e6) + (ro ? ' mil.' : 'M');
    return W.nf(v / 1e9) + (ro ? ' mld.' : 'B');
  };

  /* ------------------------------------------------------------ what lasts */
  W.register('flow:lasts', () => {
    const root = document.getElementById('lasts-chart');
    const slider = document.getElementById('lasts-year');
    const out = document.getElementById('lasts-out');
    const summary = document.getElementById('lasts-summary');
    const tip = document.createElement('div');
    tip.className = 'tooltip'; tip.hidden = true;
    root.style.position = 'relative';
    root.appendChild(tip);

    const Wd = 1000, labelW = 270, rowH = 30, top = 34, right = 20;
    const H = top + ITEMS.length * rowH + 16;
    const x = (v) => labelW + (Math.log10(v) / 9.7) * (Wd - labelW - right);
    let svg;

    function draw() {
      root.querySelector('svg') && root.querySelector('svg').remove();
      svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${Wd} ${H}`);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', W.lang === 'ro' ? 'Cât durează lucrurile făcute de oameni, pe o scară logaritmică de la 1 la un miliard de ani' : 'How long human-made things last, on a logarithmic scale from 1 to a billion years');
      let s = '';
      TICKS.forEach((v) => {
        s += `<line x1="${x(v)}" x2="${x(v)}" y1="${top - 8}" y2="${H - 10}" stroke="rgba(236,230,214,0.08)"/>`;
        s += `<text x="${x(v)}" y="${top - 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="#858b96">${tickLabel(v)}</text>`;
      });
      ITEMS.forEach((it, i) => {
        const y = top + i * rowH;
        s += `<g class="row" data-i="${i}">
          <rect x="0" y="${y}" width="${Wd}" height="${rowH}" fill="transparent"/>
          <text class="lbl" x="${labelW - 16}" y="${y + rowH / 2 + 5}" text-anchor="end" font-family="Newsreader, Georgia, serif" font-size="16" fill="#ece6d6">${it.name()}</text>
          <rect class="bar" x="${x(it.min)}" y="${y + rowH / 2 - 4}" width="${Math.max(8, x(it.max) - x(it.min))}" height="8" rx="4" fill="#ece6d6"/>
        </g>`;
      });
      s += `<g id="lasts-cursor"><line y1="${top - 8}" y2="${H - 10}" stroke="#f2a541" stroke-width="1.5"/><circle r="4" cy="${top - 8}" fill="#f2a541"/></g>`;
      svg.innerHTML = s;
      root.insertBefore(svg, tip);
      svg.querySelectorAll('.row').forEach((g) => {
        g.addEventListener('pointerenter', (e) => {
          const it = ITEMS[+g.dataset.i];
          tip.hidden = false;
          tip.innerHTML = `<b>${it.name()}</b><br>${it.range()}<br><span style="white-space:normal;display:inline-block;max-width:260px">${it.note()}</span>`;
          move(e);
        });
        g.addEventListener('pointermove', move);
        g.addEventListener('pointerleave', () => { tip.hidden = true; });
      });
      update();
    }
    function move(e) {
      const r = root.getBoundingClientRect();
      tip.style.left = Math.min(e.clientX - r.left + root.scrollLeft, r.width - 300) + 'px';
      tip.style.top = e.clientY - r.top + 'px';
    }

    function update() {
      const year = Math.pow(10, +slider.value);
      const yr = year < 20 ? Math.round(year) : +year.toPrecision(2);
      out.textContent = tickLabel(yr);
      slider.setAttribute('aria-valuetext', `${W.nf(yr)} ${W.lang === 'ro' ? 'ani' : 'years'}`);
      svg.querySelector('#lasts-cursor').setAttribute('transform', `translate(${x(Math.max(1, year))},0)`);
      let standing = 0;
      svg.querySelectorAll('.row').forEach((g) => {
        const it = ITEMS[+g.dataset.i];
        const state = year < it.min ? 0 : year < it.max ? 1 : 2;
        if (state < 2) standing++;
        const bar = g.querySelector('.bar'), lbl = g.querySelector('.lbl');
        bar.setAttribute('fill', ['#ece6d6', '#f2a541', '#4a4f58'][state]);
        lbl.setAttribute('fill', ['#ece6d6', '#f2a541', '#6b717c'][state]);
        lbl.setAttribute('text-decoration', state === 2 ? 'line-through' : 'none');
      });
      summary.textContent = W.lang === 'ro'
        ? `După ${W.nf(yr)} ${yr === 1 ? 'an' : (yr % 100 >= 20 || (yr >= 100 && yr % 100 === 0) ? 'de ani' : 'ani')}: ${standing} din ${ITEMS.length} lucruri se mai recunosc. Alb: intacte. Portocaliu: în curs de dispariție. Tăiate: dispărute.`
        : `After ${W.nf(yr)} year${yr === 1 ? '' : 's'}: ${standing} of ${ITEMS.length} things are still recognisable. White: intact. Amber: crumbling. Struck through: gone.`;
    }
    slider.addEventListener('input', update);
    draw();
    return { lang: draw };
  });

  /* ------------------------------------------------------------ CO2 */
  // Illustrative: 148 ppm of excess CO2 split between slow terms (carbonate and silicate weathering,
  // ~6,000 and ~150,000 years) and fast ones (deep and upper ocean, ~300 and ~30 years), shaped after
  // Archer et al. (2009). k scales the slow share: 0.7 and 1.3 give the band, keeping 428 ppm at t = 0.
  const co2 = (t, k = 1) => {
    const slow = 46 * Math.exp(-t / 150000) + 40 * Math.exp(-t / 6000);
    const fast = 37 * Math.exp(-t / 300) + 25 * Math.exp(-t / 30);
    return 280 + k * slow + ((148 - 86 * k) / 62) * fast;
  };
  const r5 = (v) => Math.round(v / 5) * 5;

  W.register('co2', (el) => {
    const box = el.querySelector('#co2-chart');
    const svg = document.createElementNS(NS, 'svg');
    box.appendChild(svg);
    const tip = document.createElement('div');
    tip.className = 'tooltip'; tip.hidden = true;
    box.appendChild(tip);
    let w = 0, h = 0, hoverX = null, lastKey = '';
    const m = { l: 44, r: 16, t: 20, b: 34 };
    const X0 = 1, X1 = 1e6, Y0 = 160, Y1 = 440;
    const x = (t) => m.l + (Math.log10(Math.max(X0, t)) / 6) * (w - m.l - m.r);
    const y = (v) => m.t + (1 - (v - Y0) / (Y1 - Y0)) * (h - m.t - m.b);
    const tOfX = (px) => Math.pow(10, ((px - m.l) / (w - m.l - m.r)) * 6);

    function build() {
      const r = box.getBoundingClientRect();
      w = r.width; h = r.height;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const ro = W.lang === 'ro';
      let s = '';
      // ice-core range
      s += `<rect x="${m.l}" y="${y(300)}" width="${w - m.l - m.r}" height="${y(180) - y(300)}" fill="rgba(163,209,138,0.07)"/>`;
      s += `<text x="${w - m.r - 6}" y="${y(180) - 8}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="11" fill="#a3d18a">${ro ? 'Interval natural în ultimii 800.000 de ani' : 'Natural range, last 800,000 years'}</text>`;
      [200, 280, 360, 440].forEach((v) => {
        s += `<line x1="${m.l}" x2="${w - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(236,230,214,${v === 280 ? 0.3 : 0.07})" ${v === 280 ? 'stroke-dasharray="4 4"' : ''}/>`;
        s += `<text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="11" fill="#858b96">${v}</text>`;
      });
      s += `<text x="${m.l + 6}" y="${y(280) - 6}" font-family="IBM Plex Mono, monospace" font-size="11" fill="#bdb7a8">${ro ? 'Preindustrial: 280 ppm' : 'Pre-industrial: 280 ppm'}</text>`;
      (w < 520 ? [1, 100, 1e4, 1e6] : [1, 10, 100, 1e3, 1e4, 1e5, 1e6]).forEach((v) => {
        s += `<text x="${x(v)}" y="${h - 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#858b96">${tickLabel(v)}</text>`;
      });
      s += `<text x="${w - m.r}" y="${h - 24}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#858b96">${ro ? 'ani după noi →' : 'years after us →'}</text>`;
      let d = '';
      for (let i = 0; i <= 240; i++) { const t = Math.pow(10, (i / 240) * 6); d += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(co2(t)).toFixed(1); }
      let band = '';
      for (let i = 0; i <= 240; i++) { const t = Math.pow(10, (i / 240) * 6); band += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(co2(t, 1.3)).toFixed(1); }
      for (let i = 240; i >= 0; i--) { const t = Math.pow(10, (i / 240) * 6); band += 'L' + x(t).toFixed(1) + ' ' + y(co2(t, 0.7)).toFixed(1); }
      s += `<path d="${band}Z" fill="rgba(242,165,65,0.12)"/>`;
      s += `<path d="${d}" fill="none" stroke="rgba(236,230,214,0.18)" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>`;
      s += `<clipPath id="co2-clip"><rect id="co2-cliprect" x="0" y="0" width="0" height="${h}"/></clipPath>`;
      s += `<path d="${d}" fill="none" stroke="#f2a541" stroke-width="2.5" clip-path="url(#co2-clip)"/>`;
      s += `<g id="co2-hover" opacity="0"><line y1="${m.t}" y2="${h - m.b}" stroke="rgba(236,230,214,0.4)"/><circle r="5" fill="#06080d" stroke="#ece6d6" stroke-width="2"/></g>`;
      s += `<g id="co2-dot"><circle r="6" fill="#f2a541" stroke="#06080d" stroke-width="2"/><text x="10" y="-10" font-family="IBM Plex Mono, monospace" font-size="13" fill="#ece6d6"></text></g>`;
      s += `<rect id="co2-hit" x="${m.l}" y="${m.t}" width="${w - m.l - m.r}" height="${h - m.t - m.b}" fill="transparent"/>`;
      svg.innerHTML = s;
      svg.querySelector('#co2-hit').addEventListener('pointermove', (e) => {
        const r2 = svg.getBoundingClientRect();
        hoverX = e.clientX - r2.left; lastKey = '';
      });
      svg.querySelector('#co2-hit').addEventListener('pointerleave', () => { hoverX = null; tip.hidden = true; lastKey = ''; });
      lastKey = '';
    }
    new ResizeObserver(build).observe(box);

    function render({ t }) {
      if (!w) { build(); if (!w) return; }
      const tt = W.clamp(t, 1, 1e6);
      const key = tt.toFixed(3) + '|' + hoverX;
      if (key === lastKey) return;
      lastKey = key;
      svg.querySelector('#co2-cliprect').setAttribute('width', x(tt));
      const dot = svg.querySelector('#co2-dot');
      const v = co2(tt);
      dot.setAttribute('transform', `translate(${x(tt)},${y(v)})`);
      const lbl = dot.querySelector('text');
      lbl.textContent = tt <= 1.01 ? `${Math.round(v)} ppm` : `~${r5(v)} ppm (${r5(co2(tt, 0.7))}–${r5(co2(tt, 1.3))})`;
      lbl.setAttribute('text-anchor', x(tt) > w - 220 ? 'end' : 'start');
      lbl.setAttribute('x', x(tt) > w - 220 ? -10 : 10);
      const hv = svg.querySelector('#co2-hover');
      if (hoverX !== null) {
        const ht = W.clamp(tOfX(hoverX), 1, 1e6), hvv = co2(ht);
        hv.setAttribute('opacity', 1);
        hv.querySelector('line').setAttribute('x1', x(ht)); hv.querySelector('line').setAttribute('x2', x(ht));
        hv.querySelector('circle').setAttribute('cx', x(ht)); hv.querySelector('circle').setAttribute('cy', y(hvv));
        tip.hidden = false;
        tip.style.left = Math.min(x(ht), w - 170) + 'px'; tip.style.top = y(hvv) - 30 + 'px';
        tip.innerHTML = `+ ${W.fmtT(ht)}<br><b>~${r5(hvv)} ppm</b> (${r5(co2(ht, 0.7))}–${r5(co2(ht, 1.3))})`;
      } else hv.setAttribute('opacity', 0);
    }
    return { render, lang: build };
  });
})();
