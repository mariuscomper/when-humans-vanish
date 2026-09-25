/* VIII. What lasts (longevity ranges) and IX. The air remembers (CO2 decay). */
(function () {
  const W = window.WHV;
  const NS = 'http://www.w3.org/2000/svg';

  const ITEMS = [
    { min: 5, max: 60, en: 'Books in an abandoned library', ro: 'Cărțile dintr-o bibliotecă părăsită', nen: 'Roofs leak, mould and insects do the rest.', nro: 'Acoperișurile curg, mucegaiul și insectele fac restul.' },
    { min: 20, max: 150, en: 'Asphalt roads', ro: 'Drumurile asfaltate', nen: 'Split by frost and roots, then buried under soil.', nro: 'Crăpate de îngheț și rădăcini, apoi îngropate sub pământ.' },
    { min: 40, max: 150, en: 'Wooden houses', ro: 'Casele de lemn', nen: 'Rot, termites and fire. The suburbs go first.', nro: 'Putregai, termite și foc. Suburbiile dispar primele.' },
    { min: 50, max: 300, en: 'Cars', ro: 'Mașinile', nen: 'Rusted to lumps, then to red stains in the soil.', nro: 'Ruginite până la grămezi, apoi până la pete roșii în pământ.' },
    { min: 100, max: 500, en: 'Steel-frame skyscrapers', ro: 'Zgârie-norii cu schelet de oțel', nen: 'Water gets in, the steel rusts, the joints fail.', nro: 'Apa intră, oțelul ruginește, îmbinările cedează.' },
    { min: 150, max: 600, en: 'Suspension bridges', ro: 'Podurile suspendate', nen: 'Unpainted cables and bolts corrode until the deck drops.', nro: 'Cablurile și șuruburile nevopsite ruginesc până când tablierul cade.' },
    { min: 100, max: 500, en: 'Aluminium cans', ro: 'Dozele de aluminiu', nen: 'Slowly oxidised, faster in salty or acidic soil.', nro: 'Oxidate încet, mai repede în sol sărat sau acid.' },
    { min: 400, max: 2000, en: 'Plastic bottles', ro: 'Sticlele de plastic', nen: 'Sunlight breaks them into ever smaller fragments that linger.', nro: 'Lumina le rupe în fragmente tot mai mici, care rămân.' },
    { min: 1000, max: 10000, en: 'Great concrete dams', ro: 'Marile baraje de beton', nen: 'Massive enough to stand for millennia as their lakes silt up.', nro: 'Destul de masive încât să reziste milenii, în timp ce lacurile lor se umplu cu mâl.' },
    { min: 10000, max: 1000000, en: 'Glass bottles', ro: 'Sticlele de sticlă', nen: 'Chemically tough. Buried, they can last almost indefinitely.', nro: 'Rezistente chimic. Îngropate, pot dura aproape la nesfârșit.' },
    { min: 24100, max: 241000, en: 'Plutonium-239', ro: 'Plutoniul-239', nen: 'Half gone after 24,100 years, a thousandth left after ten half-lives.', nro: 'Jumătate dispare în 24.100 de ani, o miime rămâne după zece timpi de înjumătățire.' },
    { min: 100000, max: 500000, en: 'The last of our extra CO₂', ro: 'Ultimul surplus de CO₂', nen: 'Removed by the weathering of rock, the slowest cleaner there is.', nro: 'Îndepărtat de alterarea rocilor, cel mai lent „curățitor” care există.' },
    { min: 100000, max: 1000000, en: 'The Great Pyramid', ro: 'Marea Piramidă', nen: 'Dry climate, huge stone blocks. Sand wears it down slowly.', nro: 'Climă uscată, blocuri uriașe de piatră. Nisipul o tocește încet.' },
    { min: 100000, max: 10000000, en: 'Bronze statues', ro: 'Statuile de bronz', nen: 'A green patina protects them. In sediment they could last millions of years.', nro: 'O patină verde le protejează. În sedimente ar putea dura milioane de ani.' },
    { min: 500000, max: 7000000, en: 'Faces of Mount Rushmore', ro: 'Fețele de pe Muntele Rushmore', nen: 'Granite erodes about 2.5 cm every ten thousand years.', nro: 'Granitul se erodează cu aproximativ 2,5 cm la fiecare zece mii de ani.' },
    { min: 1000000, max: 100000000, en: 'Footprints on the Moon', ro: 'Urmele de pași de pe Lună', nen: 'No wind, no rain. Only tiny meteorites slowly blur them.', nro: 'Fără vânt, fără ploaie. Doar micrometeoriții le estompează încet.' },
    { min: 1000000, max: 100000000, en: 'Satellites in high orbit', ro: 'Sateliții de pe orbite înalte', nen: 'Geostationary satellites stay up for millions of years.', nro: 'Sateliții geostaționari rămân pe orbită milioane de ani.' },
    { min: 1000000, max: 1000000000, en: 'Our layer in the rock', ro: 'Stratul nostru din rocă', nen: 'Concrete, aluminium, plastic films, odd isotopes: a permanent signature.', nro: 'Beton, aluminiu, pelicule de plastic, izotopi ciudați: o semnătură permanentă.' },
    { min: 500000000, max: 5000000000, en: 'Voyager’s golden record', ro: 'Discul de aur al sondei Voyager', nen: 'Designed to last a billion years in interstellar space.', nro: 'Proiectat să reziste un miliard de ani în spațiul interstelar.' },
  ].sort((a, b) => a.min - b.min || a.max - b.max);

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
          <text class="lbl" x="${labelW - 16}" y="${y + rowH / 2 + 5}" text-anchor="end" font-family="Newsreader, Georgia, serif" font-size="16" fill="#ece6d6">${W.tr(it)}</text>
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
          tip.innerHTML = `<b>${W.tr(it)}</b><br>${tickLabel(it.min)}–${tickLabel(it.max)} ${W.lang === 'ro' ? 'ani' : 'years'}<br><span style="white-space:normal;display:inline-block;max-width:260px">${W.lang === 'ro' ? it.nro : it.nen}</span>`;
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
  const co2 = (t) => 280 + 46 * Math.exp(-t / 150000) + 40 * Math.exp(-t / 6000) + 36 * Math.exp(-t / 300) + 25 * Math.exp(-t / 30);

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
      [1, 10, 100, 1e3, 1e4, 1e5, 1e6].forEach((v) => {
        s += `<text x="${x(v)}" y="${h - 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#858b96">${tickLabel(v)}</text>`;
      });
      s += `<text x="${w - m.r}" y="${h - 24}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#858b96">${ro ? 'ani după noi →' : 'years after us →'}</text>`;
      let d = '';
      for (let i = 0; i <= 240; i++) { const t = Math.pow(10, (i / 240) * 6); d += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(co2(t)).toFixed(1); }
      s += `<path d="${d}" fill="none" stroke="rgba(236,230,214,0.18)" stroke-width="2"/>`;
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
      lbl.textContent = `${Math.round(v)} ppm`;
      lbl.setAttribute('text-anchor', x(tt) > w - 120 ? 'end' : 'start');
      lbl.setAttribute('x', x(tt) > w - 120 ? -10 : 10);
      const hv = svg.querySelector('#co2-hover');
      if (hoverX !== null) {
        const ht = W.clamp(tOfX(hoverX), 1, 1e6), hvv = co2(ht);
        hv.setAttribute('opacity', 1);
        hv.querySelector('line').setAttribute('x1', x(ht)); hv.querySelector('line').setAttribute('x2', x(ht));
        hv.querySelector('circle').setAttribute('cx', x(ht)); hv.querySelector('circle').setAttribute('cy', y(hvv));
        tip.hidden = false;
        tip.style.left = Math.min(x(ht), w - 170) + 'px'; tip.style.top = y(hvv) - 30 + 'px';
        tip.innerHTML = `+ ${W.fmtT(ht)}<br><b>${Math.round(hvv)} ppm</b>`;
      } else hv.setAttribute('opacity', 0);
    }
    return { render, lang: build };
  });
})();
