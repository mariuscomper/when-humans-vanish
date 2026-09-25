/* Language. English is written in index.html; Romanian lives here.
   ro/index.html is generated from both by tools/build-ro.js (run it after editing either). */
(function () {
  const WHV = (window.WHV = window.WHV || {});
  const root = document.documentElement;
  const PAGE_LANG = root.lang === 'ro' ? 'ro' : 'en';
  WHV.lang = PAGE_LANG;

  /** Pick the current language from an {en, ro} pair (or return a plain string). */
  WHV.tr = (o) => (o && typeof o === 'object' ? o[WHV.lang] || o.en : o);

  const META = {
    en: {
      title: 'When Humans Vanish: What Would Happen If Humans Disappeared?',
      desc: 'An interactive, evidence-based timeline of Earth after humans disappear: the first hours as the grids fail, the centuries as cities turn to forest, and the millions of years that follow.',
      locale: 'en_GB',
    },
    ro: {
      title: 'Când oamenii dispar: ce s-ar întâmpla dacă oamenii ar dispărea?',
      desc: 'O cronologie interactivă, bazată pe dovezi, a Pământului după dispariția oamenilor: primele ore, când cad rețelele electrice, secolele în care orașele devin pădure și milioanele de ani care urmează.',
      locale: 'ro_RO',
    },
  };

  const RO = {
    "ui.skip": "Sari peste introducere",
    "ui.wordmark": "Când oamenii dispar",
    "aria.legend": "Centrale electrice după combustibil",
    "aria.filters": "Filtrează speciile",
    "aria.romap": "Harta României. Marcajele duc la povestea fiecărui loc.",
    "aria.strata": "Straturi, de sus în jos",
    "globe.alt": "Un Pământ nocturn care se rotește încet, luminat de aproximativ 5.500 de orașe și traversat de avioane până li se termină combustibilul.",
    "hero.kicker": "Un experiment de imaginație, la scara timpului geologic",
    "hero.title": "Când oamenii dispar",
    "hero.lede": "Mâine dimineață nu se mai trezește nimeni. Fără război, fără molimă, fără asteroid. Opt miliarde de oameni pur și simplu nu mai sunt, iar tot ce am construit rămâne exact acolo unde se află. Derulează ca să vezi cum observă planeta.",
    "hero.cue": "Derulează ca să începi",
    "m1.stamp": "Clipa",
    "m1.p": "Se întâmplă între o secundă și următoarea. În acel moment, la București e ora micului dejun, la Tokyo e după-amiază, iar la Los Angeles e seară târziu. În aer sunt aproximativ zece mii de avioane. Pe mări, zeci de mii de nave. Pe aragazuri, ceainice care stau să fiarbă.",
    "m2.stamp": "+ câteva minute",
    "m2.p": "La început, mașinăriile nu observă nimic. Piloții automați își țin cursul. Motoarele merg în gol în mașini goale. Semafoarele trec mai departe prin roșu, galben și verde pentru străzi pe care nu mai e nimeni. Câteva ore, lumea noastră merge din inerție, ca un cântec care continuă într-o cameră goală.",
    "m3.p": "Apoi se termină combustibilul. Unul câte unul, în orele care urmează, avioanele de linie își golesc rezervoarele și planează în jos, în oceane, păduri și câmpuri. Pentru multe locuri, e ultimul zgomot omenesc pe care îl vor mai auzi pentru foarte mult timp.",
    "lights.alt": "Harta lumii cu 16.679 de centrale electrice mari, colorate după combustibil. Pe măsură ce trece timpul, rețelele regionale se prăbușesc în momente diferite, iar centralele și luminile orașelor se sting, până când rămân doar câteva hidrocentrale și instalații solare izolate.",
    "lights.hud": "Capacitate de producție încă conectată",
    "lights.src": "Date: WRI Global Power Plant Database v1.3 (2021), centrale de cel puțin 20 MW. Momentele sunt ilustrative.",
    "lights.h": "Se sting luminile",
    "lights.p0": "Fiecare punct e o centrală electrică mare, înregistrată de World Resources Institute: aproape 35.000 de centrale din 167 de țări, un instantaneu amplu, dar incomplet, actualizat ultima dată în 2021.<sup class=\"ref\"><a href=\"#src-1\" aria-label=\"Sursa 1\">1</a></sup> Acum funcționează toate. Lumea pe care o alimentează e goală, dar încă flămândă: pompe, congelatoare, servere, aer condiționat și linii de producție torc mai departe, fără ca nimeni să le supravegheze.",
    "lights.s1": "+ prima oră",
    "lights.p1": "O rețea modernă merge în mare parte singură. Automatele echilibrează producția și consumul secundă de secundă și pot face asta o vreme. Ce nu pot face e să comande cărbune, să ridice o linie căzută, să răspundă la o alarmă sau să repornească o centrală care s-a decuplat.",
    "lights.p2": "Așa că avariile vin pe rând. O conductă de gaz pierde presiune. O furtună doboară o linie. Un transformator se supraîncălzește. Un releu de protecție scoate o centrală din rețea și nimeni n-o mai pornește. Fiecare pierdere împinge restul rețelei ceva mai aproape de margine.",
    "lights.s3": "+ ore până la zile",
    "lights.p3": "Undeva, o avarie în plus declanșează o cascadă, iar o regiune întreagă se stinge în câteva secunde. Se întâmplă la momente diferite, în locuri diferite: unele rețele cad în câteva ore, altele se mai târăsc zile întregi. Treci cu mouse-ul sau atinge harta, ori pornește și oprește combustibilii din legendă, ca să vezi ce a mai rămas.",
    "lights.s4": "+ zile până la săptămâni",
    "lights.p4": "Câteva rezistă. O hidrocentrală care alimentează o rețea mică și izolată și-ar putea învârti turbinele săptămâni la rând sau mai mult, până când resturile ori scoicile îi înfundă prizele de apă sau o defecțiune o oprește definitiv. Un panou solar de pe un acoperiș încarcă mai departe o baterie pentru nimeni.",
    "lights.s5": "+ săptămâni",
    "lights.p5": "Fața întunecată a Pământului e acum mai neagră decât a fost vreodată de la apariția luminii electrice. Strălucesc doar fulgerele, lava, aurora și incendiile pe care nu mai vine nimeni să le stingă.",
    "subway.alt": "Secțiune printr-o stradă din New York și tunelul de metrou de dedesubt. După ce pompele se opresc, apa urcă în tunel; ani mai târziu, stâlpii ruginiți se îndoaie, iar strada se lasă în gol.",
    "subway.hud": "Apă pe care pompele n-au mai scos-o",
    "subway.s0": "Într-o zi obișnuită",
    "subway.h": "Apa din tuneluri",
    "subway.p0": "New Yorkul se luptă cu apa din subteran de peste un secol. Insula era cândva numai pâraie și mlaștini, iar apa n-a plecat niciodată cu adevărat. Într-o zi fără ploaie, pompele din 286 de camere de pompare scot din metrou aproape 50 de milioane de litri.<sup class=\"ref\"><a href=\"#src-2\" aria-label=\"Sursa 2\">2</a></sup>",
    "subway.p1": "Când se oprește curentul, se opresc și pompele. Apa se adună întâi în punctele cele mai joase, în tunelurile de sub râuri. Unul dintre inginerii care țineau metroul uscat i-a spus-o scriitorului Alan Weisman fără ocolișuri: „În 36 de ore, totul s-ar putea umple.”<sup class=\"ref\"><a href=\"#src-3\" aria-label=\"Sursa 3\">3</a></sup>",
    "subway.s2": "+ luni până la ani",
    "subway.p2": "Acum apa își începe munca lentă. Stâlpii de oțel care susțin străzile stau în ea și încep să ruginească. Londra, Parisul și Tokyo au sub trotuare aceeași inundație răbdătoare.",
    "subway.p3": "În câteva decenii, stâlpii ar putea ceda. Bulevardele s-ar prăbuși deasupra tunelurilor, iar străzile construite peste pâraie uitate ar redeveni pâraie.",
    "animals.s": "+ zile până la decenii",
    "animals.h": "Animalele observă",
    "animals.p": "Împărțim planeta cu aproximativ 25 de miliarde de găini, 1,5 miliarde de vite și aproape un miliard de câini, cei mai mulți modelați de noi, pentru noi. Unii ne vor urma. Alții doar au așteptat.",
    "animals.all": "Toate",
    "animals.thrive": "Prosperă",
    "animals.adapt": "Se adaptează",
    "animals.gone": "Dispar",
    "nuke.alt": "Harta lumii cu centralele nucleare. La început, toate funcționează pe generatoare diesel. Cele mai multe se încălzesc apoi încet și rămân liniștite; o minoritate ilustrativă, cu combustibil scos de curând din reactor, se înroșește, pentru că bazinele lor ar putea seca prin fierbere.",
    "nuke.hud": "Centrale nucleare, de la pana de curent",
    "nuke.src": "Ce amplasament intră în ce grup depinde de vechimea combustibilului, de proiect și de sistemele de rezervă. Împărțirea de pe hartă e ilustrativă.",
    "nuke.s0": "+ câteva secunde",
    "nuke.h": "Bazinele de răcire",
    "nuke.p0": "În lume există peste 400 de reactoare nucleare. Când rețeaua se prăbușește, fac exact ce au fost proiectate să facă. Barele de control coboară, iar în câteva secunde reacția în lanț se oprește.",
    "nuke.p1": "Combustibilul continuă totuși să producă căldură. Lângă fiecare reactor, în bazine adânci, stau barele de combustibil uzat din mai mulți ani, ținute sub apă în circulație. Generatoarele diesel de rezervă preiau pompele. Rezervoarele lor sunt de obicei dimensionate pentru aproximativ o săptămână.",
    "nuke.s2": "+ săptămâni până la luni",
    "nuke.p2": "Ce urmează depinde de cât de proaspăt e combustibilul. Barele scoase din reactor cu ani în urmă s-au răcit atât de mult încât doar aerul le-ar putea ține în siguranță.<sup class=\"ref\"><a href=\"#src-6\" aria-label=\"Sursa 6\">6</a></sup> Cele descărcate în ultimele luni sunt altă poveste. Fără pompe, bazinul lor ar putea seca încet prin fierbere, iar dacă barele rămân descoperite, teaca lor de zirconiu ar putea lua foc.",
    "nuke.s3": "+ luni",
    "nuke.p3": "Așa că harta nu se înroșește toată. Multe amplasamente pur și simplu amuțesc. O minoritate, cele cu combustibil fierbinte, descărcat de curând, ar putea deveni accidente grave, fără nimeni care să le oprească. La Cernavodă, combustibilul stă în bazine între șase și zece ani, apoi e mutat în module de beton pentru depozitare uscată, care n-au nevoie deloc de electricitate.<sup class=\"ref\"><a href=\"#src-7\" aria-label=\"Sursa 7\">7</a></sup>",
    "nuke.s4": "Cernobîl, din 1986",
    "nuke.p4": "Acolo unde lucrurile o iau razna, Cernobîlul arată ce urmează. La trei decenii după evacuare, zona de excludere era plină de elani, mistreți, râși, zimbri și lupi. Radiația e încă scrisă în sângele și în sistemul imunitar al acelor lupi.<sup class=\"ref\"><a href=\"#src-8\" aria-label=\"Sursa 8\">8</a></sup> Doar că absența noastră a contat mai mult.",
    "sky.alt": "Cer de noapte deasupra unui oraș. Pe măsură ce strălucirea portocalie a felinarelor se stinge, apar mii de stele și banda Căii Lactee. Un cursor compară nivelurile de poluare luminoasă pe scara Bortle.",
    "sky.slider": "Poluare luminoasă",
    "sky.s0": "+ zile până la săptămâni",
    "sky.h": "Cerul se limpezește",
    "sky.p0": "În câteva zile se destramă ultimele dâre de condens. În câteva săptămâni, ploaia spală funinginea și ceața de sulfați din aer, iar orizonturile se îndepărtează. În primăvara lui 2020, când lumea a încetinit pentru scurt timp, oamenii din Punjab au văzut Himalaya de pe acoperișuri pentru prima dată după zeci de ani. De data asta, munții rămân.",
    "sky.s1": "+ săptămâni",
    "sky.p1": "Și se întoarce noaptea. Astăzi, peste o treime din omenire nu poate vedea Calea Lactee de acasă.<sup class=\"ref\"><a href=\"#src-9\" aria-label=\"Sursa 9\">9</a></sup> Acum ea răsare din nou deasupra fiecărui oraș de pe Pământ, pentru nimeni. Trage de cursor ca să compari.",
    "sky.p2": "Aici vine o ironie crudă. Ceața aceea ne umbrea, trimițând lumina soarelui înapoi în spațiu. Fără ea, planeta se mai încălzește cu câteva zecimi de grad în aproximativ un deceniu,<sup class=\"ref\"><a href=\"#src-10\" aria-label=\"Sursa 10\">10</a></sup> o factură ascunsă care devine scadentă când nu mai e nimeni s-o plătească.",
    "city.alt": "O stradă ilustrată, văzută de-a lungul a o mie de ani: buruieni, apoi geamuri sparte și plante agățătoare, incendii în casele de lemn, mașini ruginite și turnuri înclinate, un pod prăbușit și, în final, dealuri împădurite din care se mai vede o singură biserică de piatră.",
    "city.year": "Anul",
    "city.h": "Pădurea se mută în oraș",
    "city.p0": "În prima primăvară, buruienile găsesc crăpăturile din asfalt. Fiecare crăpătură e un răsad și, pentru prima dată, nu mai vine nimeni să smulgă ce crește acolo. În orașele reci, prima iarnă îngheață apa din țevi, iar țevile crapă.",
    "city.p1": "Înghețul și dezghețul sunt cel mai vechi dușman al unui oraș. Apa se strecoară într-o fisură, îngheață, crește cu nouă la sută și lărgește fisura. Acoperișurile încep să curgă. Odată ce ploaia intră într-o clădire, numărătoarea inversă a început.",
    "city.p2": "Un fulger lovește un acoperiș uscat și nu mai există pompieri. Incendiile străbat cartierele de lemn, hrănite de ani întregi de frunze moarte din jgheaburi. Cenușa lor îmbogățește solul. Primii copaci sunt acum mai înalți decât stâlpii de iluminat.",
    "city.p3": "În interiorul betonului, armăturile de oțel ruginesc. Rugina ocupă de câteva ori mai mult loc decât oțelul, așa că barele sparg betonul din interior. Balcoanele cad. Fațadele se desprind în plăci întregi.",
    "city.p4": "Până acum, cele mai multe case de lemn s-au prăbușit. Suburbiile dispar primele, pentru că locuințele noastre n-au fost construite niciodată să reziste fără noi. Coșurile de cărămidă rămân în picioare printre copaci, ca niște semne de carte.",
    "city.p5": "Fără ferestre și cu ploaia intrând înăuntru, turnurile cu schelet de oțel încep să se îndoaie. Unele cad. Altele rămân ca niște faleze goale în care își fac cuib șoimii călători, cum fac deja și azi. Străzile de dedesubt sunt o pădure.",
    "city.p6": "Marile poduri suspendate, nevopsite de secole, cad în râurile peste care treceau. În Panama, canalul s-a colmatat de mult, iar cele două Americi sunt din nou unite.",
    "city.p7": "După o mie de ani, un oraș e un grup de dealuri împădurite, ciudat de drepte pe margini, cu moloz sub mușchi. Doar ce a fost făcut din piatră, sticlă și beton foarte gros mai iese la iveală.",
    "ro.alt": "Harta României și a vecinilor ei. Pădurea se extinde din Carpați, câmpiile din sud-est redevin stepă, iar în Delta Dunării se întind stufărișurile.",
    "ro.hud": "Suprafața împădurită a României (ilustrativ)",
    "ro.h": "Aproape de casă",
    "ro.p0": "România e un loc bun din care să privești lumea vindecându-se. Are deja unii dintre cei mai sălbatici munți ai Europei, una dintre marile delte ale continentului și, chiar dincolo de graniță, o imagine a ce se întâmplă când oamenii pleacă. Atinge un marcaj sau derulează mai departe.",
    "ro.chern.s": "Din 1986",
    "ro.chern.h": "Cernobîl, repetiția generală",
    "ro.chern.p": "Zona de excludere se întinde peste Ucraina și Belarus: peste 4.000 de kilometri pătrați aproape goi de oameni de patru decenii. În partea belarusă, cercetătorii care au numărat animalele au găsit elani, căprioare și mistreți la fel de numeroși ca în rezervațiile naturale, iar lupi de peste șapte ori mai mulți.<sup class=\"ref\"><a href=\"#src-11\" aria-label=\"Sursa 11\">11</a></sup> E cel mai apropiat lucru pe care îl avem de o avanpremieră a acestei povești.",
    "ro.carp.h": "Carpații",
    "ro.carp.p": "Un studiu genetic pe aproximativ 24.000 de probe a estimat în 2025 că în România trăiesc între circa 10.650 și 12.800 de urși bruni, cea mai mare populație din Europa în afara Rusiei.<sup class=\"ref\"><a href=\"#src-12\" aria-label=\"Sursa 12\">12</a></sup> Lupii și râșii împart pădurea cu ei. Cu armele tăcute și cu livezile satelor părăsite pline de fructe căzute, urșii coboară. Deja vizitează marginile Brașovului. În câteva decenii, străzile lui sunt ale lor.",
    "ro.transf.h": "Transfăgărășanul",
    "ro.transf.p": "Nimeni nu mai deszăpezește drumul primăvara. În câteva ierni, căderile de pietre și avalanșele îl taie. Într-un secol, cele mai faimoase serpentine din Europa sunt doar un zigzag șters de pădure tânără pe coasta muntelui.",
    "ro.delta.h": "Delta Dunării",
    "ro.delta.p": "Între anii ’60 și ’80, digurile au transformat mari părți din deltă în terenuri agricole și amenajări piscicole. Neîntreținute, digurile cedează, o viitură după alta, iar fluviul își ia înapoi mlaștinile. Cea mai mare întindere de stuf din Europa se extinde, iar pelicanii, alături de peste 300 de specii de păsări, revin să cuibărească în ea.",
    "ro.baragan.h": "Bărăganul",
    "ro.baragan.p": "Nu totul devine pădure. Câmpiile din sud-est erau stepă cu mult înainte de plug și se întorc la iarbă. Caii scăpați din fermele părăsite, sălbăticiți, pasc acolo unde era grâul.",
    "ro.iron.h": "Porțile de Fier",
    "ro.iron.p": "Barajul de la Porțile de Fier, una dintre cele mai mari hidrocentrale ale Europei, ar putea ține câteva lumini aprinse mai mult decât aproape oriunde în Balcani. Barajul în sine ar trebui să reziste secole, în timp ce lacul său se umple încet cu mâlul a jumătate de continent.",
    "ro.buc.h": "București",
    "ro.buc.p": "Palatul Parlamentului cântărește în jur de patru milioane de tone, una dintre cele mai grele clădiri de pe Pământ. Mult după ce blocurile din jur se vor fi prăbușit, el va fi încă acolo. După o mie de ani, e un deal mare și împădurit în mijlocul unei păduri, cu marmură dedesubt.",
    "lasts.h": "Ce rămâne",
    "lasts.p": "Tot ce facem se întoarce încet în pământ. Doar că unele lucruri durează mult mai mult. Trage de cursor ca să călătorești în timp și să vezi ce mai stă în picioare. Barele arată cât de mult diferă estimările, pentru că nimeni n-a putut verifica.",
    "lasts.slider": "Ani după noi",
    "lasts.table": "Arată estimările ca tabel",
    "lasts.c1": "Lucrul",
    "lasts.c2": "Durată aproximativă",
    "lasts.c3": "De ce",
    "co2.title": "Dioxid de carbon în aer, părți per milion · model ilustrativ",
    "co2.alt": "Grafic pe o scară logaritmică a timpului. Dioxidul de carbon pornește de la aproximativ 428 ppm, scade la circa 390 după un secol și la circa 360 după o mie de ani, apoi coboară încet până la 280 ppm, nivelul preindustrial, în câteva sute de mii de ani. O bandă umbrită arată incertitudinea.",
    "co2.note": "Nu e o prognoză. Curba însumează procese lente (preluarea de către ocean, dizolvarea carbonaților, alterarea rocilor), cu forma și scările de timp descrise de Archer și colaboratorii (2009); banda arată cât de mult variază între modele partea care rămâne în aer.",
    "co2.s0": "Ziua în care dispărem",
    "co2.h": "Aerul își amintește",
    "co2.p0": "În ziua în care dispărem, aerul conține aproximativ 428 de părți per milion de dioxid de carbon, estimarea globală NOAA pentru septembrie 2026,<sup class=\"ref\"><a href=\"#src-13\" aria-label=\"Sursa 13\">13</a></sup> față de 280 înainte de epoca industrială. Coșurile de fum se răcesc, dar carbonul e deja acolo sus.",
    "co2.p1": "Oceanele și pădurile noi încep să-l absoarbă înapoi, repede la început, apoi tot mai încet. După un secol, nivelul e probabil încă mai mare decât în oricare moment din cele două milioane de ani dinaintea noastră.",
    "co2.p2": "După ce oceanele s-au săturat, între o cincime și o treime din carbonul nostru e încă în aer,<sup class=\"ref\"><a href=\"#src-14\" aria-label=\"Sursa 14\">14</a></sup> iar planeta rămâne mai caldă decât în 1850. Calotele glaciare continuă să se topească secole la rând, iar mările continuă să crească mii de ani.",
    "co2.p3": "Ultima parte e îndepărtată de ploaie, care dizolvă încet rocile și duce carbonul în mare, unde devine calcar. Asta durează sute de mii de ani. Fumul nostru, se pare, e unul dintre cele mai durabile lucruri pe care le-am lăsat în urmă.",
    "ice.alt": "Un glob centrat pe Atlanticul de Nord. Într-un scenariu pentru următoarea glaciațiune, calotele de gheață se întind din Arctica peste nordul Americii de Nord și al Europei, acoperind aproximativ 160 de orașe mari, în timp ce Bucureștiul rămâne la sud de gheață.",
    "ice.hud": "Orașe sub gheață · scenariu",
    "ice.h": "Piatră și gheață",
    "ice.p0": "Zece mii de ani înseamnă cam timpul scurs de la primii agricultori. E destul ca să șteargă aproape tot ce am construit. Marea Piramidă probabil stă încă în picioare, puțin mai tocită. Porțiuni din Marele Zid supraviețuiesc ca un șir de coame joase peste dealuri.",
    "ice.p1": "Până acum, jumătate din plutoniul-239 care exista în ziua dispariției noastre s-a transformat în uraniu. Mai așteaptă 24.100 de ani și jumătate din ce a rămas o ia pe același drum. Planeta scapă de el pe calea cea lentă, câte o înjumătățire pe rând.",
    "ice.p2": "Fără noi, perioada caldă de acum ar fi durat probabil oricum încă vreo 50.000 de ani. Carbonul nostru o prelungește: într-un model, 1.000 până la 1.500 de miliarde de tone de carbon emis amână următoarea glaciațiune cu cel puțin 100.000 de ani.<sup class=\"ref\"><a href=\"#src-15\" aria-label=\"Sursa 15\">15</a></sup> În ziua în care am dispărut, eliberaserăm în jur de 740.<sup class=\"ref\"><a href=\"#src-16\" aria-label=\"Sursa 16\">16</a></sup> Dar gheața are răbdare. Dacă va crește ca ultima dată, va rade Chicago, Toronto, Stockholm și Berlin, prefăcându-le în pietriș. Bucureștiul, departe în sud, scapă.",
    "ice.p3": "Administrația parcului estimează că granitul de pe Muntele Rushmore se erodează cu aproximativ 2,5 cm la fiecare zece mii de ani.<sup class=\"ref\"><a href=\"#src-17\" aria-label=\"Sursa 17\">17</a></sup> În ritmul acesta, fețele s-ar recunoaște și după un milion de ani, dacă înghețul nu intră mai devreme în fisurile pe care nu le mai sigilează nimeni. Majoritatea speciilor de azi probabil încă există. Pe insule apar specii noi.",
    "strata.h": "O linie în piatră",
    "strata.k1": "Rocă depusă după noi",
    "strata.k2": "Stratul nostru",
    "strata.k3": "Epoca agricultorilor",
    "strata.k4": "Pietrișuri glaciare",
    "strata.k5": "Lumea de dinainte",
    "strata.p0": "Materia primă a acelei roci e deja aici. Pe la 2020, betonul, asfaltul, cărămida, metalul, sticla și plasticul pe care le produseserăm ajunseseră la aproximativ 1.100 de miliarde de tone, adică, după o socoteală atentă, mai mult decât toată viața de pe Pământ.<sup class=\"ref\"><a href=\"#src-18\" aria-label=\"Sursa 18\">18</a></sup> Și adăugam cam 30 de miliarde de tone în fiecare an.",
    "strata.p1": "Îngropate și presate, devin rocă. Betonul ar arăta ca un conglomerat ciudat. Aluminiul, pe care natura aproape niciodată nu-l produce pur, ar putea supraviețui ca niște fulgi strălucitori. Unele materiale plastice s-ar putea turti în pelicule subțiri de carbon, așa cum se întâmplă cu frunzele fosile.<sup class=\"ref\"><a href=\"#src-19\" aria-label=\"Sursa 19\">19</a></sup>",
    "strata.p2": "Un geolog din viitorul îndepărtat ar putea găsi o bandă groasă de doar câțiva centimetri în câmp deschis și de câțiva metri sub vechile orașe și gropi de gunoi. Ar conține minerale ciudate, carbon cu o amprentă izotopică inconfundabilă și oase, un număr uriaș de oase de pui.<sup class=\"ref\"><a href=\"#src-20\" aria-label=\"Sursa 20\">20</a></sup> Treci cu mouse-ul sau atinge roca pentru a citi straturile.",
    "strata.p3": "Viața își va fi refăcut de mult varietatea. După marile extincții din trecut, inclusiv cea a asteroidului, asta a durat în jur de zece milioane de ani.<sup class=\"ref\"><a href=\"#src-21\" aria-label=\"Sursa 21\">21</a></sup> Creaturile acelei lumi vor călca peste linie fără să știe ce înseamnă.",
    "voy.s0": "Deja pe drum",
    "voy.h": "Ultimul mesaj",
    "voy.p0": "Un lucru făcut de noi ar putea trăi mai mult decât viața de pe Pământ. Două nave spațiale mici, Voyager 1 și 2, sunt la peste 20 de miliarde de kilometri depărtare și merg mai departe. Pe fiecare e prins un disc placat cu aur care poartă Pământul: ploaie, bătăi de inimă, un sărut, salutări în 55 de limbi, Bach și Chuck Berry.",
    "voy.p1": "Creatorii lui se așteptau ca discul să reziste mai mult de un miliard de ani.<sup class=\"ref\"><a href=\"#src-22\" aria-label=\"Sursa 22\">22</a></sup> Cam atunci, Soarele, tot mai strălucitor, ar trebui să înceapă să fiarbă oceanele Pământului. Discul va pluti în continuare printre stele, cântând pentru nimeni, o scrisoare fără adresa expeditorului.",
    "voy.p2": "Pământul nu are nevoie de noi. S-a refăcut după asteroid și după gheață și se va reface și după noi. Dar își va aminti de noi multă vreme: într-o linie în piatră, în aer, timp de o sută de mii de ani, într-un disc de aur printre stele.",
    "voy.p3": "Așa că experimentul acesta lasă în urmă o singură întrebare, și ea e despre acum. Ce am vrea să spună linia aceea din piatră?",
    "foot.h0": "Despre această cronologie",
    "foot.p0": "Ce s-ar întâmpla cu Pământul dacă oamenii ar dispărea mâine? Pagina aceasta urmărește întrebarea din primele ore, când cad avioanele și rețelele electrice, prin secolele de care au nevoie orașele ca să devină pădure, până la milioanele de ani în care lumea noastră devine un strat de rocă. E un experiment de imaginație sprijinit pe studii de inginerie, ecologie și pe registrul fosil. Multe dintre idei au fost adunate pentru prima dată de Alan Weisman în <i>The World Without Us</i> (Lumea fără noi, 2007).",
    "foot.p1": "Cum citești momentele: un interval precum 10–50 de ani arată cât de mult diferă estimările serioase, iar <b>~</b> marchează o valoare aproximativă. <b>Scenariu</b> înseamnă un viitor modelat dintre mai multe posibile, nu o prognoză. Hărțile și animațiile ilustrează aceste estimări; nu le măsoară.",
    "foot.h": "Surse",
    "sp1.n": "Păduchele de cap",
    "sp1.s": "Gazdă: doar oamenii",
    "sp1.d": "Trăiește pe scalpul oamenilor și nicăieri altundeva. Când plecăm noi, pleacă și el, împreună cu păduchii de corp și câțiva viermi intestinali care n-au cunoscut altă casă.",
    "sp2.n": "Câinele",
    "sp2.s": "≈ 900 de milioane în viață",
    "sp2.d": "Majoritatea câinilor de pe Pământ trăiesc deja liberi. Rasele mici nu rezistă. După câteva generații, supraviețuitorii ajung să arate la fel: talie medie, blană roșcată, urechi ridicate, coadă încârligată, câinele clasic de sat.",
    "sp3.n": "Pisica de casă",
    "sp3.s": "Niciodată complet domesticită",
    "sp3.d": "O vânătoare eficientă și independentă, care a acceptat doar pe jumătate să trăiască cu noi. Se descurcă foarte bine. Păsările cântătoare plătesc prețul.",
    "sp4.n": "Găina",
    "sp4.s": "≈ 25 de miliarde în viață",
    "sp4.d": "Împreună cântăresc de peste două ori mai mult decât toate păsările sălbatice.<sup class=\"ref\"><a href=\"#src-4\" aria-label=\"Sursa 4\">4</a></sup> Cele mai multe trăiesc în hale și mor în câteva zile, când se opresc hrana și ventilația. Câteva cârduri din satele calde se sălbăticesc, ca strămoșii lor din junglă.",
    "sp5.n": "Vita",
    "sp5.s": "≈ 1,5 miliarde de capete",
    "sp5.d": "Vacile de lapte, crescute ca să fie mulse, suferă primele. Rasele rezistente se sălbăticesc în turme și redevin prada lupilor, cum era odinioară bourul.",
    "sp6.n": "Oaia",
    "sp6.s": "Lâna nu se oprește din crescut",
    "sp6.d": "Majoritatea raselor depind de tuns. În 2004, în Noua Zeelandă, a fost găsit un berbec merinos fugar, pe nume Shrek, după șase ani de ascunziș, cu 27 kg de lână pe el.",
    "sp7.n": "Gândacul de bucătărie",
    "sp7.s": "De origine tropicală",
    "sp7.d": "A cucerit nordul rece trăind în clădirile noastre încălzite. Prima iarnă fără căldură îl șterge de pe jumătatea mai rece a lumii.",
    "sp8.n": "Șobolanul cenușiu",
    "sp8.s": "Trăiește din gunoiul nostru",
    "sp8.d": "Tomberoanele nu se mai umplu. Numărul lor se prăbușește, apoi se stabilizează, iar șobolanii redevin o pradă obișnuită pentru bufnițele, vulpile și ulii care se mută în oraș.",
    "sp9.n": "Grâul",
    "sp9.s": "≈ 220 de milioane de hectare",
    "sp9.d": "L-am selectat astfel încât spicele să-și țină boabele până la recoltare, așa că abia se mai poate semăna singur. După câteva sezoane fără arat, pierde în fața buruienilor.",
    "sp10.n": "Lupul",
    "sp10.s": "Deja revine în Europa",
    "sp10.d": "Fără vânătoare și cu cerbi, mistreți și vite sălbăticite peste tot, lupii se răspândesc pe continente întregi în câteva decenii.",
    "sp11.n": "Codul de Atlantic",
    "sp11.s": "≈ 90 de milioane de tone de pește sălbatic pescuit pe an",
    "sp11.d": "Plasele ies goale pentru ultima dată. Multe populații de pești se refac în câteva decenii, iar marile bancuri din Atlanticul de Nord ar putea umple din nou marea.",
    "sp12.n": "Păsările cântătoare migratoare",
    "sp12.s": "Până la 1 miliard de morți în geamuri pe an, doar în SUA<sup class=\"ref\"><a href=\"#src-5\" aria-label=\"Sursa 5\">5</a></sup>",
    "sp12.d": "Cele mai multe migrează noaptea, iar ferestrele noastre luminate le atrag în sticlă. Cu luminile stinse, migrația de noapte zboară din nou în siguranță.",
    "sp13.n": "Albina meliferă",
    "sp13.s": "≈ 100 de milioane de stupi îngrijiți",
    "sp13.d": "Fără apicultori, mulți stupi cad pradă acarienilor paraziți. Dar mii de specii de albine sălbatice înfloresc pe măsură ce pesticidele se descompun și pajiștile revin.",
    "sp14.n": "Elefantul african",
    "sp14.s": "≈ 415.000 rămași (estimare din 2016)",
    "sp14.d": "Nu mai există braconaj, iar terenurile agricole redevin savană și pădure. Se înmulțesc încet, așa că le trebuie câteva secole ca să-și recâștige vechiul teritoriu.",
    "v.thrive": "▲ Prosperă",
    "v.adapt": "◆ Se adaptează",
    "v.gone": "✕ Dispare",
    "lt1.n": "Cărțile dintr-o bibliotecă părăsită",
    "lt1.x": "Acoperișurile curg, mucegaiul și insectele fac restul.",
    "lt1.r": "5–60 de ani",
    "lt2.n": "Drumurile asfaltate",
    "lt2.x": "Crăpate de îngheț și rădăcini, apoi îngropate sub pământ.",
    "lt2.r": "20–150 de ani",
    "lt3.n": "Casele de lemn",
    "lt3.x": "Putregai, termite și foc. Suburbiile dispar primele.",
    "lt3.r": "40–150 de ani",
    "lt4.n": "Mașinile",
    "lt4.x": "Ruginite până la grămezi, apoi până la pete roșii în pământ.",
    "lt4.r": "50–300 de ani",
    "lt5.n": "Zgârie-norii cu schelet de oțel",
    "lt5.x": "Apa intră, oțelul ruginește, îmbinările cedează.",
    "lt5.r": "100–500 de ani",
    "lt6.n": "Dozele de aluminiu",
    "lt6.x": "Oxidate încet, mai repede în sol sărat sau acid.",
    "lt6.r": "100–500 de ani",
    "lt7.n": "Podurile suspendate",
    "lt7.x": "Cablurile și șuruburile nevopsite ruginesc până când tablierul cade.",
    "lt7.r": "150–600 de ani",
    "lt8.n": "Sticlele de plastic",
    "lt8.x": "Lumina le rupe în fragmente tot mai mici, care rămân.",
    "lt8.r": "400–2.000 de ani",
    "lt9.n": "Marile baraje de beton",
    "lt9.x": "Destul de masive încât să reziste milenii, în timp ce lacurile lor se umplu cu mâl.",
    "lt9.r": "1.000–10.000 de ani",
    "lt10.n": "Sticlele de sticlă",
    "lt10.x": "Rezistente chimic. Îngropate, pot dura aproape la nesfârșit.",
    "lt10.r": "10.000–1 mil. de ani",
    "lt11.n": "Plutoniul-239",
    "lt11.x": "Jumătate dispare în 24.100 de ani, o miime rămâne după zece timpi de înjumătățire.",
    "lt11.r": "24.100–241.000 de ani",
    "lt12.n": "Ultimul surplus de CO₂",
    "lt12.x": "Îndepărtat de alterarea rocilor, cel mai lent „curățitor” care există.",
    "lt12.r": "100.000–500.000 de ani",
    "lt13.n": "Marea Piramidă",
    "lt13.x": "Climă uscată, blocuri uriașe de piatră. Nisipul o tocește încet.",
    "lt13.r": "100.000–1 mil. de ani",
    "lt14.n": "Fețele de pe Muntele Rushmore",
    "lt14.x": "După estimarea administrației parcului, 2,5 cm la 10.000 de ani. Înghețul în fisurile nesigilate ar putea grăbi totul.",
    "lt14.r": "100.000–2 mil. de ani",
    "lt15.n": "Statuile de bronz",
    "lt15.x": "O patină verde le protejează. În sedimente ar putea dura milioane de ani.",
    "lt15.r": "100.000–10 mil. de ani",
    "lt16.n": "Urmele de pași de pe Lună",
    "lt16.x": "Fără vânt, fără ploaie. Doar micrometeoriții le estompează încet.",
    "lt16.r": "1 mil.–100 mil. de ani",
    "lt17.n": "Sateliții de pe orbite înalte",
    "lt17.x": "Sateliții geostaționari rămân pe orbită milioane de ani.",
    "lt17.r": "1 mil.–100 mil. de ani",
    "lt18.n": "Stratul nostru din rocă",
    "lt18.x": "Beton, aluminiu, pelicule de plastic, izotopi ciudați: o semnătură permanentă.",
    "lt18.r": "1 mil.–1 mld. de ani",
    "lt19.n": "Discul de aur al sondei Voyager",
    "lt19.x": "Proiectat să reziste un miliard de ani în spațiul interstelar.",
    "lt19.r": "500 mil.–5 mld. de ani",
  };
  WHV.RO = RO;

  // Each language has its own URL when the page is served from its real home.
  const alt = (l) => document.querySelector('link[rel=alternate][hreflang=' + l + ']');
  const sameSite = () => { const a = alt('en'); return !!a && new URL(a.href).origin === location.origin; };

  function setMeta(sel, attr, val) { const m = document.querySelector(sel); if (m) m.setAttribute(attr, val); }

  function apply(lang) {
    WHV.lang = lang;
    root.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const key = el.dataset.i18n;
      const html = lang === 'ro' && RO[key] ? RO[key] : el.dataset.en;
      if (el.innerHTML !== html) el.innerHTML = html;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute('aria-label') || '';
      const key = el.dataset.i18nAria;
      el.setAttribute('aria-label', lang === 'ro' && RO[key] ? RO[key] : el.dataset.enAria);
    });
    // source markers: the English page says Source, the Romanian one Sursa
    document.querySelectorAll('.ref a').forEach((a) => a.setAttribute('aria-label', (lang === 'ro' ? 'Sursa ' : 'Source ') + a.textContent));
    document.title = META[lang].title;
    setMeta('meta[name=description]', 'content', META[lang].desc);
    setMeta('meta[property="og:locale"]', 'content', META[lang].locale);
    const url = alt(lang) && alt(lang).href;
    if (url) { setMeta('link[rel=canonical]', 'href', url); setMeta('meta[property="og:url"]', 'content', url); }
    document.querySelectorAll('.lang [data-lang]').forEach((b) => {
      if (b.dataset.lang === lang) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    WHV.onLang && WHV.onLang();
  }

  WHV.setLang = (lang, persist = true) => {
    apply(lang);
    if (!persist) return;
    try { localStorage.setItem('whv-lang', lang); } catch (e) { /* storage blocked */ }
    const hash = /^#(ro|en)?$/.test(location.hash) ? '' : location.hash;
    if (sameSite()) history.replaceState(null, '', new URL(alt(lang).href).pathname + location.search + hash);
    else if (!hash) history.replaceState(null, '', lang === PAGE_LANG ? location.pathname + location.search : '#' + lang);
  };

  WHV.initLang = () => {
    let lang = null;
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ro' || q === 'en') lang = q;
    if (!lang && (location.hash === '#ro' || location.hash === '#en')) lang = location.hash.slice(1);
    // an explicit /ro/ address always wins; on the English address, remember the reader's choice
    if (!lang && PAGE_LANG === 'ro') lang = 'ro';
    if (!lang) { try { lang = localStorage.getItem('whv-lang'); } catch (e) { /* ignore */ } }
    if (!lang) lang = (navigator.languages || [navigator.language || 'en']).some((l) => /^ro\b/i.test(l)) ? 'ro' : 'en';
    lang = lang === 'ro' ? 'ro' : 'en';
    apply(lang);
    if (lang !== PAGE_LANG && sameSite()) history.replaceState(null, '', new URL(alt(lang).href).pathname + location.search + location.hash);
    document.querySelectorAll('.lang [data-lang]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      WHV.setLang(b.dataset.lang);
    }));
  };
})();
