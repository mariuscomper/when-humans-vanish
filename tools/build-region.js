// Extracts countries around Romania from world-atlas countries-50m into data/region-ro.json
// usage: node tools/build-region.js <path-to-countries-50m.json> <path-to-topojson-client.js>
const fs = require('fs');
const topojson = require(process.argv[3]);
const topo = JSON.parse(fs.readFileSync(process.argv[2]));
const fc = topojson.feature(topo, topo.objects.countries);
const box = [15, 40, 36, 54];
const rnd = (c) => typeof c[0] === 'number' ? [+c[0].toFixed(3), +c[1].toFixed(3)] : c.map(rnd);
const inBox = (c) => typeof c[0] === 'number' ? (c[0] > box[0] && c[0] < box[2] && c[1] > box[1] && c[1] < box[3]) : c.some(inBox);
const out = fc.features.filter(f => f.geometry && inBox(f.geometry.coordinates)).map(f => ({
  type: 'Feature', properties: { n: f.properties.name }, geometry: { type: f.geometry.type, coordinates: rnd(f.geometry.coordinates) }
}));
fs.writeFileSync(__dirname + '/../data/region-ro.json', JSON.stringify({ type: 'FeatureCollection', features: out }));
console.log(out.map(f => f.properties.n).join(', '));
