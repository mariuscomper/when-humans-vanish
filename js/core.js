/* Core: scroll engine, deep-time gauge, formatting, canvas helpers. */
(function () {
  // no-js -> js as early as possible (an inline script would be blocked by the site's CSP)
  document.documentElement.classList.replace('no-js', 'js');
  const WHV = (window.WHV = window.WHV || {});
  WHV.factories = WHV.factories || {};
  WHV.register = (name, factory) => { WHV.factories[name] = factory; };
  WHV.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TMIN = 1 / 525960; // one minute, in years
  const TMAX = 1e9;
  WHV.HOUR = 1 / 8766;
  WHV.t = 0;

  /* ---------------------------------------------------------- utilities */
  WHV.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  WHV.lerp = (a, b, k) => a + (b - a) * k;
  WHV.smooth = (e0, e1, x) => { const k = WHV.clamp((x - e0) / (e1 - e0)); return k * k * (3 - 2 * k); };
  WHV.rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // data/ sits next to js/, whichever page (/ or /ro/) loaded us
  const src = document.currentScript && document.currentScript.src;
  const ROOT = src ? new URL('../', src) : new URL('./', location.href);
  // the deploy stamps script URLs with ?v=<release>; data files get the same stamp
  const VERSION = src ? new URL(src).search : '';
  const cache = {};
  WHV.load = (name) => (cache[name] = cache[name] || fetch(new URL('data/' + name + VERSION, ROOT)).then((r) => {
    if (!r.ok) throw new Error(name + ' ' + r.status);
    return r.json();
  }));

  WHV.nf = (n, d = 0) => new Intl.NumberFormat(WHV.lang === 'ro' ? 'ro-RO' : 'en-GB', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

  // Romanian needs "de" before plural nouns when the last two digits are >= 20 (or a round hundred)
  const deRo = (n) => (n % 100 >= 20 || (n >= 100 && n % 100 === 0) ? 'de ' : '');
  const nice = (x) => {
    if (x < 20) return Math.round(x);
    const p = Math.pow(10, Math.floor(Math.log10(x)) - 1);
    return Math.round(x / p) * p;
  };
  const unit = (n, one, many) => {
    const ro = WHV.lang === 'ro';
    if (n === 1) return `1 ${one}`;
    return `${WHV.nf(n)} ${ro ? deRo(n) : ''}${many}`;
  };

  /** Human duration for a time in years. */
  WHV.fmtT = (t, exact) => {
    const ro = WHV.lang === 'ro';
    if (t <= TMIN * 1.5) return ro ? 'acum' : 'now';
    const h = t * 8766;
    if (h < 1) return unit(Math.max(1, Math.round(h * 60)), ro ? 'minut' : 'minute', ro ? 'minute' : 'minutes');
    if (h < 48) return unit(Math.round(h), ro ? 'oră' : 'hour', ro ? 'ore' : 'hours');
    const d = t * 365.25;
    if (d < 14) return unit(Math.round(d), ro ? 'zi' : 'day', ro ? 'zile' : 'days');
    if (d < 60) return unit(Math.round(d / 7), ro ? 'săptămână' : 'week', ro ? 'săptămâni' : 'weeks');
    if (t < 0.96) return unit(Math.max(2, Math.round(t * 12)), ro ? 'lună' : 'month', ro ? 'luni' : 'months');
    if (t < 1e6) return unit(Math.max(1, exact ? Math.round(t) : nice(t)), ro ? 'an' : 'year', ro ? 'ani' : 'years');
    if (t < 0.95e9) {
      const m = nice(t / 1e6);
      if (ro) return m === 1 ? '1 milion de ani' : `${WHV.nf(m)} ${deRo(m)}milioane de ani`;
      return `${WHV.nf(m)} million years`;
    }
    const b = Math.max(1, nice(t / 1e9));
    if (ro) return b === 1 ? '1 miliard de ani' : `${WHV.nf(b)} ${deRo(b)}miliarde de ani`;
    return `${WHV.nf(b)} billion years`;
  };

  /* ---------------------------------------------------------- canvas helper */
  WHV.canvas = (cv, onResize) => {
    const ctx = cv.getContext('2d');
    const o = { cv, ctx, w: 0, h: 0, dpr: 1 };
    let ready = false;
    o.resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width || !r.height) return;
      o.w = r.width; o.h = r.height; o.dpr = dpr;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ready && onResize && onResize(o);
    };
    o.resize();
    ready = true;
    new ResizeObserver(() => o.resize()).observe(cv);
    return o;
  };

  const sprites = {};
  /** Soft radial glow drawn once, reused with drawImage. */
  WHV.glow = (color, size = 64, core = 0.18) => {
    const key = color + size + core;
    if (sprites[key]) return sprites[key];
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(core, color);
    gr.addColorStop(0.45, color.replace(/[\d.]+\)$/, '0.25)'));
    gr.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
    return (sprites[key] = c);
  };

  /* ---------------------------------------------------------- gauge */
  const gTrack = document.getElementById('gauge-track');
  const gFill = document.getElementById('gauge-fill');
  const gMarker = document.getElementById('gauge-marker');
  const gValue = document.getElementById('gauge-value');
  const LMIN = Math.log10(TMIN), LMAX = Math.log10(TMAX);
  const pos = (t) => WHV.clamp((Math.log10(Math.max(t, TMIN)) - LMIN) / (LMAX - LMIN));
  const TICKS = [
    [WHV.HOUR, '1 h', '1 h'], [1 / 365.25, '1 day', '1 zi'], [1 / 12, '1 month', '1 lună'], [1, '1 yr', '1 an'],
    [10, '10', '10'], [100, '100', '100'], [1e3, '1k', '1k'], [1e4, '10k', '10k'], [1e5, '100k', '100k'],
    [1e6, '1M', '1 mil.'], [1e7, '10M', '10 mil.'], [1e8, '100M', '100 mil.'], [1e9, '1B', '1 mld.'],
  ];
  const tickEls = TICKS.map(([t]) => {
    const d = document.createElement('div');
    d.className = 'gauge-tick';
    d.style.top = pos(t) * 100 + '%';
    d.appendChild(document.createElement('span'));
    gTrack.appendChild(d);
    return d;
  });
  const labelTicks = () => tickEls.forEach((d, i) => { d.firstChild.textContent = TICKS[i][WHV.lang === 'ro' ? 2 : 1]; });
  const mobile = matchMedia('(max-width: 860px)');
  let lastGauge = '';
  function drawGauge(t) {
    const k = pos(t);
    if (mobile.matches) {
      gFill.style.width = k * 100 + '%'; gFill.style.height = '';
      gMarker.style.left = k * 100 + '%'; gMarker.style.top = '0';
    } else {
      gFill.style.height = k * 100 + '%'; gFill.style.width = '';
      gMarker.style.top = k * 100 + '%'; gMarker.style.left = '';
    }
    tickEls.forEach((d, i) => d.classList.toggle('passed', TICKS[i][0] <= t * 1.001));
    const txt = WHV.fmtT(t);
    if (txt !== lastGauge) { gValue.textContent = txt; lastGauge = txt; }
  }

  /* ---------------------------------------------------------- stamps */
  // the number that goes in front of a range's upper end, in that end's unit ("10–50 years", "1–12 hours")
  function lowInUnitOf(a, b) {
    const h = b * 8766, d = b * 365.25;
    if (h < 48) return Math.round(a * 8766);
    if (d < 14) return Math.round(a * 365.25);
    if (d < 60) return Math.round(a * 365.25 / 7);
    if (b < 0.96) return Math.round(a * 12);
    if (b < 1e6) return nice(a);
    if (b < 0.95e9) return nice(a / 1e6);
    return nice(a / 1e9);
  }
  const TAGS = { scenario: { en: 'scenario', ro: 'scenariu' } };

  /** Stamps say how sure we are: a range, "~" for a rough value, a tag for modelled futures. */
  WHV.fillStamps = () => {
    document.querySelectorAll('.step[data-t] .stamp:not([data-i18n])').forEach((el) => {
      const st = el.closest('.step'), t = +st.dataset.t;
      let txt;
      if (st.dataset.range) {
        const [a, b] = st.dataset.range.split(',').map(Number);
        txt = WHV.nf(lowInUnitOf(a, b)) + '–' + WHV.fmtT(b);
      } else {
        txt = (st.hasAttribute('data-approx') ? '~' : '') + WHV.fmtT(t, st.hasAttribute('data-exact'));
      }
      const tag = TAGS[st.dataset.tag];
      el.innerHTML = '+ ' + txt + (tag ? ` <span class="tag">${WHV.tr(tag)}</span>` : '');
    });
    document.querySelectorAll('.step[data-tag] .stamp[data-i18n]').forEach((el) => {
      const tag = TAGS[el.closest('.step').dataset.tag];
      if (tag && !el.querySelector('.tag')) el.insertAdjacentHTML('beforeend', ` <span class="tag">${WHV.tr(tag)}</span>`);
    });
  };

  /* ---------------------------------------------------------- scroll engine */
  const scenes = [];
  const timeEls = [...document.querySelectorAll('[data-t]')].filter((el) => !el.closest('.scene') || el.classList.contains('step'));
  const bgEls = [...document.querySelectorAll('[data-bg]')];
  let vh = innerHeight;
  // layout is only read when something moved, not on every animation frame
  let dirty = true;
  const touch = () => { dirty = true; };
  addEventListener('resize', () => { vh = innerHeight; dirty = true; });
  addEventListener('scroll', touch, { passive: true });
  new ResizeObserver(touch).observe(document.body);

  function measureTime() {
    const L = (t) => Math.log10(Math.max(+t, TMIN));
    let prev = null;
    for (const el of timeEls) {
      const r = el.getBoundingClientRect();
      const a = r.top + Math.min(r.height, vh) / 2 - vh / 2;
      const t = +el.dataset.t;
      if (a > 0) {
        if (!prev) return TMIN;
        // Chapters follow their own threads, so time can jump back at a chapter start.
        // Never slide backwards: hold the old time until the new chapter's first card arrives.
        if (t < prev.t) return Math.max(prev.t, TMIN);
        const k = WHV.clamp(-prev.a / (a - prev.a));
        return Math.pow(10, WHV.lerp(L(prev.t), L(t), k));
      }
      prev = { a, t };
    }
    return prev ? Math.max(prev.t, TMIN) : TMIN;
  }

  function measureScene(sc) {
    const r = sc.el.getBoundingClientRect();
    sc.p = WHV.clamp(-r.top / Math.max(1, r.height - vh));
    const steps = sc.steps;
    let s = -1;
    for (let i = 0; i < steps.length; i++) {
      const sr = steps[i].getBoundingClientRect();
      if (sr.top <= 0) s = i + WHV.clamp(-sr.top / Math.max(1, Math.min(sr.height, vh)));
      else { if (i === 0) s = -WHV.clamp(sr.top / vh); break; }
    }
    sc.s = s;
  }

  let lastBg = '';
  function measureBg() {
    for (const el of bgEls) {
      const r = el.getBoundingClientRect();
      if (r.top <= vh / 2 && r.bottom > vh / 2) {
        if (el.dataset.bg !== lastBg) { document.body.style.setProperty('--bg', el.dataset.bg); lastBg = el.dataset.bg; }
        return;
      }
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const measure = dirty;
    dirty = false;
    if (measure) {
      WHV.t = measureTime();
      drawGauge(WHV.t);
      measureBg();
    }
    for (const sc of scenes) {
      if (!sc.visible || !sc.api) continue;
      if (measure || sc.fresh) { measureScene(sc); sc.fresh = false; }
      try { sc.api.render({ p: sc.p, s: sc.s, t: WHV.clamp(WHV.t, sc.tMin, sc.tMax), now, dt }); } catch (e) { console.error(sc.name, e); sc.api = null; }
    }
    requestAnimationFrame(frame);
  }

  WHV.boot = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { const sc = scenes.find((s) => s.el === e.target); if (sc) { sc.visible = e.isIntersecting; sc.fresh = true; } });
    }, { rootMargin: '25% 0px 25% 0px' });
    document.querySelectorAll('[data-scene]').forEach((el) => {
      const name = el.dataset.scene;
      const sc = { name, el, steps: [...el.querySelectorAll('.step')], visible: false, p: 0, s: -1, api: null };
      // each scene only ever sees the time span its own steps cover
      const ts = sc.steps.map((st) => +st.dataset.t).filter((v) => !isNaN(v));
      sc.tMin = ts.length ? Math.min(...ts) : 0;
      sc.tMax = ts.length ? Math.max(...ts) : Infinity;
      scenes.push(sc);
      io.observe(el);
      const f = WHV.factories[name];
      if (f) {
        try { sc.api = f(el, sc); } catch (e) { console.error(name, e); }
      }
    });
    // flow sections (non-sticky) register themselves too, but only need lang updates
    Object.keys(WHV.factories).filter((n) => n.startsWith('flow:')).forEach((n) => {
      try { const api = WHV.factories[n](); scenes.push({ name: n, api, visible: false, steps: [] }); } catch (e) { console.error(n, e); }
    });
    WHV.onLang = () => {
      labelTicks(); lastGauge = ''; dirty = true; WHV.fillStamps();
      scenes.forEach((sc) => sc.api && sc.api.lang && sc.api.lang());
    };
    WHV.initLang();
    document.documentElement.classList.add('js-ready');
    requestAnimationFrame(frame);
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(WHV.boot, 0));
})();
