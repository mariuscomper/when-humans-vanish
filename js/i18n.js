/* Language: English lives in the HTML; Romanian lives here. */
(function () {
  const WHV = (window.WHV = window.WHV || {});
  WHV.lang = 'en';

  /** Pick the current language from an {en, ro} pair (or return a plain string). */
  WHV.tr = (o) => (o && typeof o === 'object' ? o[WHV.lang] || o.en : o);

  const META = {
    en: { title: 'When Humans Vanish', desc: 'Tomorrow morning, nobody wakes up. A scrolling journey through what happens to Earth in the hours, years and millions of years after humans disappear.' },
    ro: { title: 'Când oamenii dispar', desc: 'Mâine dimineață nu se mai trezește nimeni. O călătorie despre ce se întâmplă cu Pământul în orele, anii și milioanele de ani de după dispariția oamenilor.' },
  };

  const RO = {
    'ui.skip': 'Sari peste introducere',
    'ui.wordmark': 'Când oamenii dispar',

    'hero.kicker': 'Un experiment de imaginație, la scara timpului geologic',
    'hero.title': 'Când oamenii dispar',
    'hero.lede': 'Mâine dimineață nu se mai trezește nimeni. Fără război, fără molimă, fără asteroid. Opt miliarde de oameni pur și simplu nu mai sunt, iar tot ce am construit rămâne exact acolo unde se află. Derulează ca să vezi cum observă planeta.',
    'hero.cue': 'Derulează ca să începi',
    'm1.stamp': 'Clipa',
    'm1.p': 'Se întâmplă între o secundă și următoarea. În acel moment, la București e ora micului dejun, la Tokyo e după-amiază, iar la Los Angeles e seară târziu. În aer sunt aproximativ zece mii de avioane. Pe mări, zeci de mii de nave. Pe aragazuri, ceainice care stau să fiarbă.',
    'm2.p': 'La început, mașinăriile nu observă nimic. Piloții automați își țin cursul. Motoarele merg în gol în mașini goale. Semafoarele trec mai departe prin roșu, galben și verde pentru străzi pe care nu mai e nimeni. Câteva ore, lumea noastră merge din inerție, ca un cântec care continuă într-o cameră goală.',
    'm3.p': 'Apoi se termină combustibilul. Unul câte unul, avioanele de linie își golesc rezervoarele și planează în jos, în oceane, păduri și câmpuri. Pentru multe locuri, e ultimul zgomot omenesc pe care îl vor mai auzi pentru foarte mult timp.',

    'lights.hud': 'Capacitate de producție conectată',
    'lights.h': 'Se sting luminile',
    'lights.p0': 'Fiecare punct de pe această hartă e o centrală electrică, preluată dintr-o bază de date cu toate centralele mari de pe Pământ. Chiar acum, împreună, alimentează o lume care nu mai folosește nimic.',
    'lights.p1': 'O rețea electrică e un exercițiu de echilibru. Curentul produs trebuie să fie egal cu cel consumat, secundă de secundă, iar oamenii veghează asupra acestui echilibru zi și noapte. În spatele lor sunt trenuri cu cărbune, contracte de gaz și livrări de combustibil. Scoate-i pe oameni din ecuație și echilibrul începe să se clatine.',
    'lights.p2': 'Centralele pe combustibili fosili cedează primele. O fluctuație de frecvență, o alarmă la care nu răspunde nimeni, o alimentare cu combustibil care se oprește: sistemele automate de siguranță le deconectează. Fiecare avarie își aruncă sarcina pe următoarea centrală, care cade și ea.',
    'lights.p3': 'Avariile se propagă în cascadă peste granițe și continente. În una-două zile, aproape toate rețelele de pe Pământ s-au stins. Treci cu mouse-ul peste hartă sau pornește și oprește tipurile de combustibil din legendă ca să vezi ce a mai rămas.',
    'lights.p4': 'Câteva rezistă. Unele hidrocentrale funcționează cu gravitație, nu cu combustibil, iar în sistemele izolate turbinele lor se pot învârti până când resturile și scoicile le înfundă prizele de apă. Un panou solar de pe un acoperiș încarcă mai departe o baterie pentru nimeni.',
    'lights.p5': 'Văzută din spațiu, fața întunecată a Pământului e acum la fel de neagră ca în 1800. Singurele lumini sunt fulgerele, lava, aurora și incendiile pe care nu mai vine nimeni să le stingă.',

    'subway.hud': 'Apă pe care pompele n-au mai scos-o',
    'subway.h': 'Apa din tuneluri',
    'subway.p0': 'New Yorkul se luptă cu apa din subteran de peste un secol. Insula era cândva numai pâraie și mlaștini, iar apa n-a plecat niciodată cu adevărat. În fiecare zi, 753 de pompe scot din metrou aproximativ 50 de milioane de litri.',
    'subway.p1': 'Când se oprește curentul, se opresc și pompele. Apa se adună întâi în punctele cele mai joase, în tunelurile de sub râuri. În aproximativ 36 de ore, părți din rețea sunt inundate.',
    'subway.p2': 'Acum apa își începe munca lentă. Stâlpii de oțel care susțin străzile stau în ea și încep să ruginească. Londra, Parisul și Tokyo au sub trotuare aceeași inundație răbdătoare.',
    'subway.p3': 'În câteva decenii, stâlpii cedează. Bulevardele se prăbușesc deasupra tunelurilor, iar străzile construite peste pâraie uitate devin din nou pâraie.',

    'animals.h': 'Animalele observă',
    'animals.p': 'Împărțim planeta cu aproximativ 25 de miliarde de găini, 1,5 miliarde de vite și aproape un miliard de câini, cei mai mulți modelați de noi, pentru noi. Unii ne vor urma. Alții doar au așteptat.',
    'animals.all': 'Toate',
    'animals.thrive': 'Prosperă',
    'animals.adapt': 'Se adaptează',
    'animals.gone': 'Dispar',

    'nuke.hud': 'Centrale nucleare, de la pana de curent',
    'nuke.h': 'Bazinele de răcire',
    'nuke.p0': 'În lume există peste 400 de reactoare nucleare. Când rețeaua se prăbușește, fac exact ce au fost proiectate să facă. Barele de control coboară, iar în câteva secunde reacția în lanț se oprește.',
    'nuke.p1': 'Combustibilul continuă totuși să producă căldură. Lângă fiecare reactor, în bazine adânci, stă combustibil uzat din mulți ani, care trebuie ținut sub apă în circulație. Generatoarele diesel de rezervă preiau pompele. Rezervoarele lor ajung, de obicei, pentru aproximativ o săptămână.',
    'nuke.p2': 'Apoi motorina se termină. Bazinele se încălzesc, apoi fierb. Săptămână după săptămână nivelul apei scade, iar odată ce barele de combustibil ies din apă, tecile lor de zirconiu pot lua foc, eliberând fum radioactiv în vânt.',
    'nuke.p3': 'Norii radioactivi sunt purtați spre est de vânturile dominante. În jurul a câteva sute de amplasamente, inclusiv cele două reactoare ale României de la Cernavodă, lângă Dunăre, se așază petice de pământ contaminat, asemănătoare celui din jurul Cernobîlului.',
    'nuke.p4': 'Și totuși, Cernobîl arată și ce urmează. La trei decenii după evacuare, zona de excludere era plină de lupi, elani, mistreți, râși și zimbri. Pentru majoritatea animalelor sălbatice, radiația s-a dovedit mult mai puțin periculoasă decât oamenii.',

    'sky.slider': 'Poluare luminoasă',
    'sky.h': 'Cerul se limpezește',
    'sky.p0': 'În câteva zile se destramă ultimele dâre de condens. În câteva săptămâni, ploaia spală funinginea și ceața de sulfați din aer. Cerul de deasupra Delhiului, Beijingului și Bucureștiului capătă un albastru pe care nimeni în viață nu l-a mai văzut acolo.',
    'sky.p1': 'Aici vine o ironie crudă. Ceața aceea ne umbrea, reflectând lumina soarelui înapoi în spațiu. Fără ea, planeta se încălzește cu câteva zecimi de grad în câțiva ani, o factură ascunsă care sosește dintr-odată.',
    'sky.p2': 'Și se întoarce noaptea. Astăzi, peste o treime din omenire nu poate vedea Calea Lactee de acasă. Acum ea răsare din nou deasupra fiecărui oraș de pe Pământ, pentru nimeni. Trage de cursor ca să compari.',

    'city.year': 'Anul',
    'city.h': 'Pădurea se mută în oraș',
    'city.p0': 'În prima primăvară, buruienile găsesc crăpăturile din asfalt. Fiecare crăpătură e un răsad și, pentru prima dată, nu mai vine nimeni să smulgă ce crește acolo. În orașele reci, prima iarnă îngheață apa din țevi, iar țevile crapă.',
    'city.p1': 'Înghețul și dezghețul sunt cel mai vechi dușman al unui oraș. Apa se strecoară într-o fisură, îngheață, crește cu nouă la sută și lărgește fisura. Acoperișurile încep să curgă. Odată ce ploaia intră într-o clădire, numărătoarea inversă a început.',
    'city.p2': 'Un fulger lovește un acoperiș uscat și nu mai există pompieri. Incendiile străbat cartierele de lemn, hrănite de un deceniu de frunze moarte din jgheaburi. Cenușa lor îmbogățește solul. Primii copaci sunt acum mai înalți decât stâlpii de iluminat.',
    'city.p3': 'În interiorul betonului, armăturile de oțel ruginesc. Rugina ocupă de câteva ori mai mult loc decât oțelul, așa că barele sparg betonul din interior. Balcoanele cad. Fațadele se desprind în plăci întregi.',
    'city.p4': 'Până acum, cele mai multe case de lemn s-au prăbușit. Suburbiile dispar primele, pentru că locuințele noastre n-au fost construite niciodată să reziste fără noi. Coșurile de cărămidă rămân în picioare printre copaci, ca niște semne de carte.',
    'city.p5': 'Fără ferestre și cu ploaia intrând înăuntru, turnurile cu schelet de oțel încep să se îndoaie. Unele cad. Altele rămân ca niște faleze goale în care își fac cuib șoimii călători, cum fac deja și azi. Străzile de dedesubt sunt o pădure.',
    'city.p6': 'Marile poduri suspendate, nevopsite de trei secole, cad în râurile peste care treceau. În Panama, canalul s-a colmatat de mult, iar cele două Americi sunt din nou unite.',
    'city.p7': 'După o mie de ani, un oraș e un grup de dealuri împădurite, ciudat de drepte pe margini, cu moloz sub mușchi. Doar ce a fost făcut din piatră, sticlă și beton foarte gros mai iese la iveală.',

    'ro.hud': 'Suprafața împădurită a României',
    'ro.h': 'Aproape de casă',
    'ro.p0': 'România e un loc bun din care să privești lumea vindecându-se. Are deja unii dintre cei mai sălbatici munți ai Europei, una dintre marile delte ale continentului și, chiar dincolo de graniță, o imagine a ce se întâmplă când oamenii pleacă. Atinge un marcaj sau derulează mai departe.',
    'ro.carp.h': 'Carpații',
    'ro.carp.p': 'România are cea mai mare populație de urși bruni din Europa, în afara Rusiei, în jur de 8.000 de animale, alături de lupi și râși. Cu armele tăcute și cu livezile satelor părăsite pline de fructe căzute, urșii coboară. Deja vizitează marginile Brașovului. În câteva decenii, străzile lui sunt ale lor.',
    'ro.transf.h': 'Transfăgărășanul',
    'ro.transf.p': 'Nimeni nu mai deszăpezește drumul primăvara. În câteva ierni, căderile de pietre și avalanșele îl taie. Într-un secol, cele mai faimoase serpentine din Europa sunt doar un zigzag șters de pădure tânără pe coasta muntelui.',
    'ro.delta.h': 'Delta Dunării',
    'ro.delta.p': 'Între anii ’60 și ’80, digurile au transformat mari părți din deltă în terenuri agricole și amenajări piscicole. Neîntreținute, digurile cedează, o viitură după alta, iar fluviul își ia înapoi mlaștinile. Cea mai mare întindere de stuf din Europa se extinde, iar pelicanii, alături de peste 300 de specii de păsări, revin să cuibărească în ea.',
    'ro.iron.h': 'Porțile de Fier',
    'ro.iron.p': 'Barajul de la Porțile de Fier, una dintre cele mai mari hidrocentrale ale Europei, ar putea ține câteva lumini aprinse mai mult decât aproape oriunde în Balcani. Barajul în sine ar trebui să reziste secole, în timp ce lacul său se umple încet cu mâlul a jumătate de continent.',
    'ro.baragan.h': 'Bărăganul',
    'ro.baragan.p': 'Nu totul devine pădure. Câmpiile din sud-est erau stepă cu mult înainte de plug și se întorc la iarbă. Cai sălbăticiți, scăpați din ferme părăsite, pasc acolo unde era grâul.',
    'ro.buc.h': 'București',
    'ro.buc.p': 'Palatul Parlamentului cântărește în jur de patru milioane de tone, una dintre cele mai grele clădiri de pe Pământ. Mult după ce blocurile din jur se vor fi prăbușit, el va fi încă acolo. Peste o mie de ani, va fi un deal mare și împădurit în mijlocul unei păduri, cu marmură dedesubt.',
    'ro.chern.h': 'Cernobîl, repetiția generală',
    'ro.chern.p': 'Aproximativ 2.600 de kilometri pătrați din Ucraina sunt aproape goi de oameni din 1986. Cercetătorii care au numărat animalele de acolo au găsit de până la șapte ori mai mulți lupi decât în rezervațiile naturale din apropiere. E cel mai apropiat lucru pe care îl avem de o avanpremieră a acestei povești.',

    'lasts.h': 'Ce rămâne',
    'lasts.p': 'Tot ce facem se întoarce încet în pământ. Doar că unele lucruri durează mult mai mult. Trage de cursor ca să călătorești în timp și să vezi ce mai stă în picioare. Barele arată intervalul aproximativ al estimărilor, pentru că nimeni n-a putut verifica.',
    'lasts.slider': 'Ani după noi',

    'co2.title': 'Dioxid de carbon în aer, părți per milion',
    'co2.note': 'Model ilustrativ: o sumă de procese lente (absorbția în ocean, dizolvarea carbonaților și alterarea rocilor), calibrată pe estimări publicate. Valorile reale ar putea varia cu zeci de ppm.',
    'co2.h': 'Aerul își amintește',
    'co2.p0': 'În ziua în care dispărem, aerul conține aproximativ 427 de părți per milion de dioxid de carbon, față de 280 înainte de epoca industrială. Coșurile de fum se răcesc, dar carbonul e deja acolo sus.',
    'co2.p1': 'Oceanele și pădurile noi încep să-l absoarbă înapoi. Repede la început, apoi încet. După un secol, nivelul e încă mai mare decât în oricare moment din cele două milioane de ani dinaintea noastră.',
    'co2.p2': 'După ce oceanele s-au săturat, rămâne cam un sfert din carbonul nostru, iar planeta rămâne mai caldă decât în 1850. Calotele glaciare continuă să se topească secole la rând, iar mările continuă să crească mii de ani.',
    'co2.p3': 'Ultima parte e îndepărtată de ploaie, care dizolvă încet rocile și duce carbonul în mare, unde devine calcar. Asta durează câteva sute de mii de ani. Fumul nostru, se pare, e unul dintre cele mai durabile lucruri pe care le-am lăsat în urmă.',

    'ice.hud': 'Orașe sub gheață',
    'ice.h': 'Piatră și gheață',
    'ice.p0': 'Zece mii de ani înseamnă cam timpul scurs de la primii agricultori. E destul ca să șteargă aproape tot ce am construit. Marea Piramidă e încă în picioare, puțin mai tocită. Porțiuni din Marele Zid supraviețuiesc ca un șir de coame joase peste dealuri.',
    'ice.p1': 'Jumătate din tot plutoniul pe care l-am produs s-a dezintegrat. Cealaltă jumătate va avea nevoie de încă 24.100 de ani ca să se înjumătățească din nou.',
    'ice.p2': 'Apoi se întoarce gheața. Orbita Pământului se modifică, verile nordice se răcesc, iar calotele de gheață cresc. Dacă glaciațiunea aceasta o egalează pe ultima, va rade Chicago, Toronto, Stockholm și Berlin, prefăcându-le în pietriș. Bucureștiul, departe în sud, scapă. Carbonul nostru rămas în aer ar fi putut-o amâna cu zeci de mii de ani.',
    'ice.p3': 'După un milion de ani, fețele de pe Muntele Rushmore, erodate cu aproximativ 2,5 cm la fiecare zece mii de ani, încă se pot recunoaște. Majoritatea speciilor de azi încă există. Pe insule apar specii noi.',

    'strata.h': 'O linie în piatră',
    'strata.p0': 'Tot betonul, asfaltul, cărămida, metalul, sticla și plasticul pe care le-am produs cântăresc în jur de 1.100 de miliarde de tone. Pe la 2020, masa lor a depășit-o pe a tuturor ființelor vii de pe Pământ.',
    'strata.p1': 'Îngropate și presate, devin rocă. Betonul se transformă într-un conglomerat ciudat. Aluminiul, pe care natura aproape niciodată nu-l produce pur, rămâne ca niște fulgi strălucitori. Materialele plastice se subțiază în pelicule negre de carbon, ca amprentele fosile ale frunzelor.',
    'strata.p2': 'Un geolog din viitorul îndepărtat ar găsi o bandă groasă de câțiva centimetri. E plină de minerale ciudate, carbon cu izotopii greșiți și oase, miliarde și miliarde de oase de pui. Treci cu mouse-ul peste rocă pentru a citi straturile.',
    'strata.p3': 'Până atunci, varietatea vieții își va fi revenit după extincțiile pe care le-am declanșat, cum s-a întâmplat și după asteroid, în aproximativ zece milioane de ani. Creaturile acelei lumi vor călca peste linie fără să știe ce înseamnă.',

    'voy.h': 'Ultimul mesaj',
    'voy.p0': 'Un lucru făcut de noi va trăi mai mult decât Pământul însuși. Două nave spațiale mici, Voyager 1 și 2, sunt acum la peste 20 de miliarde de kilometri depărtare și merg mai departe. Pe fiecare e prins un disc placat cu aur care poartă Pământul: ploaie, bătăi de inimă, un sărut, salutări în 55 de limbi, Bach și Chuck Berry.',
    'voy.p1': 'Creatorii lui se așteptau ca discul să reziste un miliard de ani. Până atunci, Soarele, tot mai strălucitor, va fi început să fiarbă oceanele Pământului. Discul va pluti în continuare printre stele, cântând pentru nimeni, o scrisoare fără adresa expeditorului.',
    'voy.p2': 'Pământul nu are nevoie de noi. S-a refăcut după asteroid și după gheață și se va reface și după noi. Dar își va aminti de noi multă vreme: într-o linie în piatră, în aer, timp de o sută de mii de ani, într-un disc de aur printre stele.',
    'voy.p3': 'Așa că experimentul acesta lasă în urmă o singură întrebare, și ea e despre acum. Ce am vrea să spună linia aceea din piatră?',

    'foot.h': 'Surse și note',
    'foot.p': 'Acesta e un experiment de imaginație, așa că momentele sunt estimări bazate pe studii de inginerie, ecologie și pe registrul fosil. Multe dintre idei au fost adunate pentru prima dată de Alan Weisman în <i>The World Without Us</i> (Lumea fără noi, 2007).',
  };

  function apply(lang) {
    WHV.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const key = el.dataset.i18n;
      el.innerHTML = lang === 'ro' && RO[key] ? RO[key] : el.dataset.en;
    });
    document.title = META[lang].title;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', META[lang].desc);
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    WHV.onLang && WHV.onLang();
  }

  WHV.setLang = (lang, persist = true) => {
    apply(lang);
    if (persist) {
      try { localStorage.setItem('whv-lang', lang); } catch (e) { /* storage blocked */ }
      if (location.hash === '#ro' || location.hash === '#en' || location.hash === '') {
        history.replaceState(null, '', lang === 'ro' ? '#ro' : location.pathname + location.search);
      }
    }
  };

  WHV.initLang = () => {
    let lang = null;
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ro' || q === 'en') lang = q;
    if (!lang && (location.hash === '#ro' || location.hash === '#en')) lang = location.hash.slice(1);
    if (!lang) { try { lang = localStorage.getItem('whv-lang'); } catch (e) { /* ignore */ } }
    if (!lang) lang = (navigator.languages || [navigator.language || 'en']).some((l) => /^ro\b/i.test(l)) ? 'ro' : 'en';
    apply(lang === 'ro' ? 'ro' : 'en');
    document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => WHV.setLang(b.dataset.lang)));
  };
})();
