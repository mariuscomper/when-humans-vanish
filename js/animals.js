/* III. The animals notice: the specimen labels live in the page; this only filters them. */
(function () {
  const W = window.WHV;

  W.register('flow:animals', () => {
    const cards = [...document.querySelectorAll('#specimens .specimen')];
    const chips = [...document.querySelectorAll('.filters .chip')];
    chips.forEach((c) => c.addEventListener('click', () => {
      const filter = c.dataset.filter;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      cards.forEach((s) => { s.hidden = filter !== 'all' && s.dataset.v !== filter; });
    }));
    return {};
  });
})();
