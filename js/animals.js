/* III. The animals notice: specimen labels with a filter. */
(function () {
  const W = window.WHV;

  const SPECIES = [
    { v: 'gone', latin: 'Pediculus humanus capitis',
      name: { en: 'Head louse', ro: 'Păduchele de cap' },
      stat: { en: 'Host: humans only', ro: 'Gazdă: doar oamenii' },
      desc: { en: 'It lives on human scalps and nowhere else. When we go, it goes, along with our body lice and a few gut worms that have never known another home.', ro: 'Trăiește pe scalpul oamenilor și nicăieri altundeva. Când plecăm noi, pleacă și el, împreună cu păduchii de corp și câțiva viermi intestinali care n-au cunoscut altă casă.' } },
    { v: 'adapt', latin: 'Canis familiaris',
      name: { en: 'Dog', ro: 'Câinele' },
      stat: { en: '≈ 900 million alive', ro: '≈ 900 de milioane în viață' },
      desc: { en: 'Most dogs on Earth already roam free. The toy breeds don’t last. After a few generations the survivors converge on one look: medium-sized, tan, prick-eared, curly-tailed, the classic village dog.', ro: 'Majoritatea câinilor de pe Pământ trăiesc deja liberi. Rasele mici nu rezistă. După câteva generații, supraviețuitorii ajung să arate la fel: talie medie, blană roșcată, urechi ridicate, coadă încârligată, câinele clasic de sat.' } },
    { v: 'thrive', latin: 'Felis catus',
      name: { en: 'House cat', ro: 'Pisica de casă' },
      stat: { en: 'Never fully domesticated', ro: 'Niciodată complet domesticită' },
      desc: { en: 'An efficient, independent hunter that only half signed up to living with us. It does just fine. Songbirds pay the price.', ro: 'O vânătoare eficientă și independentă, care a acceptat doar pe jumătate să trăiască cu noi. Se descurcă foarte bine. Păsările cântătoare plătesc prețul.' } },
    { v: 'gone', latin: 'Gallus gallus domesticus',
      name: { en: 'Chicken', ro: 'Găina' },
      stat: { en: '≈ 25 billion alive', ro: '≈ 25 de miliarde în viață' },
      desc: { en: 'Together they weigh more than twice as much as all wild birds. Most live indoors and die within days when feed and ventilation stop. A few village flocks in warm places go feral, like their jungle ancestors.', ro: 'Împreună cântăresc de peste două ori mai mult decât toate păsările sălbatice. Cele mai multe trăiesc în hale și mor în câteva zile, când se opresc hrana și ventilația. Câteva cârduri din satele calde se sălbăticesc, ca strămoșii lor din junglă.' } },
    { v: 'adapt', latin: 'Bos taurus',
      name: { en: 'Cattle', ro: 'Vita' },
      stat: { en: '≈ 1.5 billion head', ro: '≈ 1,5 miliarde de capete' },
      desc: { en: 'Dairy cows, bred to be milked, suffer first. Hardy breeds go wild in herds and become prey for wolves again, as the aurochs once were.', ro: 'Vacile de lapte, crescute ca să fie mulse, suferă primele. Rasele rezistente se sălbăticesc în turme și redevin prada lupilor, cum era odinioară bourul.' } },
    { v: 'adapt', latin: 'Ovis aries',
      name: { en: 'Sheep', ro: 'Oaia' },
      stat: { en: 'Wool never stops growing', ro: 'Lâna nu se oprește din crescut' },
      desc: { en: 'Most breeds depend on shearing. In 2004 a runaway merino called Shrek was found in New Zealand after six years in hiding, carrying 27 kg of fleece.', ro: 'Majoritatea raselor depind de tuns. În 2004, în Noua Zeelandă, a fost găsit un berbec merinos fugar, pe nume Shrek, după șase ani de ascunziș, cu 27 kg de lână pe el.' } },
    { v: 'gone', latin: 'Blattella germanica',
      name: { en: 'German cockroach', ro: 'Gândacul de bucătărie' },
      stat: { en: 'Tropical by origin', ro: 'De origine tropicală' },
      desc: { en: 'It conquered the cold north by living inside our heated buildings. The first winter without heating wipes it out across the colder half of the world.', ro: 'A cucerit nordul rece trăind în clădirile noastre încălzite. Prima iarnă fără căldură îl șterge de pe jumătatea mai rece a lumii.' } },
    { v: 'adapt', latin: 'Rattus norvegicus',
      name: { en: 'Brown rat', ro: 'Șobolanul cenușiu' },
      stat: { en: 'Lives on our garbage', ro: 'Trăiește din gunoiul nostru' },
      desc: { en: 'The bins stop filling. Numbers crash, then settle, as rats become ordinary prey again for owls, foxes and hawks moving into the city.', ro: 'Tomberoanele nu se mai umplu. Numărul lor se prăbușește, apoi se stabilizează, iar șobolanii redevin o pradă obișnuită pentru bufnițele, vulpile și ulii care se mută în oraș.' } },
    { v: 'gone', latin: 'Triticum aestivum',
      name: { en: 'Bread wheat', ro: 'Grâul' },
      stat: { en: '≈ 220 million hectares', ro: '≈ 220 de milioane de hectare' },
      desc: { en: 'We bred its ears to hold on to their grain until harvest, so it can barely sow itself. After a few seasons without ploughing, it loses to the weeds.', ro: 'L-am selectat astfel încât spicele să-și țină boabele până la recoltare, așa că abia se mai poate semăna singur. După câteva sezoane fără arat, pierde în fața buruienilor.' } },
    { v: 'thrive', latin: 'Canis lupus',
      name: { en: 'Grey wolf', ro: 'Lupul' },
      stat: { en: 'Already returning to Europe', ro: 'Deja revine în Europa' },
      desc: { en: 'With hunting over and deer, boar and feral cattle everywhere, wolves spread across whole continents within decades.', ro: 'Fără vânătoare și cu cerbi, mistreți și vite sălbăticite peste tot, lupii se răspândesc pe continente întregi în câteva decenii.' } },
    { v: 'thrive', latin: 'Gadus morhua',
      name: { en: 'Atlantic cod', ro: 'Codul de Atlantic' },
      stat: { en: '≈ 90 million t of wild fish caught a year', ro: '≈ 90 de milioane de tone de pește sălbatic pescuit pe an' },
      desc: { en: 'The nets come up empty for the last time. Many fish stocks rebuild within decades, and the great shoals of the North Atlantic may fill the sea again.', ro: 'Plasele ies goale pentru ultima dată. Multe populații de pești se refac în câteva decenii, iar marile bancuri din Atlanticul de Nord ar putea umple din nou marea.' } },
    { v: 'thrive', latin: 'Passeriformes',
      name: { en: 'Migrating songbirds', ro: 'Păsările cântătoare migratoare' },
      stat: { en: 'Up to 1 billion window deaths a year, US alone', ro: 'Până la 1 miliard de morți în geamuri pe an, doar în SUA' },
      desc: { en: 'Most migrate at night, and our lit windows lure them into glass. With the lights out, the night migration flies safely again.', ro: 'Cele mai multe migrează noaptea, iar ferestrele noastre luminate le atrag în sticlă. Cu luminile stinse, migrația de noapte zboară din nou în siguranță.' } },
    { v: 'adapt', latin: 'Apis mellifera',
      name: { en: 'Honeybee', ro: 'Albina meliferă' },
      stat: { en: '≈ 100 million managed hives', ro: '≈ 100 de milioane de stupi îngrijiți' },
      desc: { en: 'Without beekeepers, many hives fall to parasitic mites. But thousands of wild bee species boom as the pesticides break down and meadows return.', ro: 'Fără apicultori, mulți stupi cad pradă acarienilor paraziți. Dar mii de specii de albine sălbatice înfloresc pe măsură ce pesticidele se descompun și pajiștile revin.' } },
    { v: 'thrive', latin: 'Loxodonta africana',
      name: { en: 'African elephant', ro: 'Elefantul african' },
      stat: { en: '≈ 415,000 left', ro: '≈ 415.000 rămași' },
      desc: { en: 'No more poaching, and farmland turning back into savanna and forest. They breed slowly, so reclaiming their old range takes a few centuries.', ro: 'Nu mai există braconaj, iar terenurile agricole redevin savană și pădure. Se înmulțesc încet, așa că le trebuie câteva secole ca să-și recâștige vechiul teritoriu.' } },
  ];

  const VERDICT = {
    thrive: { en: '▲ Thrives', ro: '▲ Prosperă' },
    adapt: { en: '◆ Adapts', ro: '◆ Se adaptează' },
    gone: { en: '✕ Vanishes', ro: '✕ Dispare' },
  };

  W.register('flow:animals', () => {
    const root = document.getElementById('specimens');
    const chips = [...document.querySelectorAll('.filters .chip')];
    let filter = 'all';
    function draw() {
      root.innerHTML = SPECIES.map((s, i) => `
        <article class="specimen" data-v="${s.v}"${filter !== 'all' && filter !== s.v ? ' hidden' : ''}>
          <div class="sp-top"><h3>${W.tr(s.name)}</h3><span class="sp-no">No. ${String(i + 1).padStart(3, '0')}</span></div>
          <p class="latin">${s.latin}</p>
          <p class="stat">${W.tr(s.stat)}</p>
          <p class="desc">${W.tr(s.desc)}</p>
          <span class="verdict ${s.v}">${W.tr(VERDICT[s.v])}</span>
        </article>`).join('');
    }
    chips.forEach((c) => c.addEventListener('click', () => {
      filter = c.dataset.filter;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      root.querySelectorAll('.specimen').forEach((s) => { s.hidden = filter !== 'all' && s.dataset.v !== filter; });
    }));
    draw();
    return { lang: draw };
  });
})();
