"""Builds the compact data files in /data from public datasets.

Sources (download into SRC first):
  - WRI Global Power Plant Database v1.3  (global_power_plant_database.csv -> gppd.csv)
  - Natural Earth 10m populated places simple (places.geojson)
  - Natural Earth 10m rivers + lake centerlines (rivers.geojson)
  - world-atlas@2 countries-50m.json / land-110m.json (npm)
"""
import csv, json, sys, os

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'data')

# ---- power plants: [lon*10, lat*10, fuel, MW] flat -------------------------
FUEL = {'Coal': 0, 'Gas': 0, 'Oil': 0, 'Petcoke': 0, 'Cogeneration': 0,
        'Nuclear': 1, 'Hydro': 2, 'Wind': 3, 'Solar': 4}
flat = []
for r in csv.DictReader(open(os.path.join(SRC, 'gppd.csv'))):
    mw = float(r['capacity_mw'] or 0)
    if mw < 20:
        continue
    f = FUEL.get(r['primary_fuel'], 5)
    flat += [round(float(r['longitude']) * 10), round(float(r['latitude']) * 10), f, round(mw)]
json.dump(flat, open(os.path.join(OUT, 'plants.json'), 'w'), separators=(',', ':'))
print('plants', len(flat) // 4)

# ---- cities: [lon*10, lat*10, pop/1000] --------------------------------------
g = json.load(open(os.path.join(SRC, 'places.geojson')))
flat = []
for ft in g['features']:
    p = ft['properties']
    pop = p['pop_max'] or 0
    if pop < 20000:
        continue
    flat += [round(p['longitude'] * 10), round(p['latitude'] * 10), round(pop / 1000)]
json.dump(flat, open(os.path.join(OUT, 'cities.json'), 'w'), separators=(',', ':'))
print('cities', len(flat) // 3)

# ---- rivers around Romania ----------------------------------------------------
KEEP = {'Danube', 'Donau', 'Borcea', 'Bratul Chillia', 'Bratul Sfintu Gheorghe', 'Bratul Sulina',
        'Prut', 'Olt', 'Mures', 'Tisa', 'Dniester', 'Pripyat', 'Dnipro', 'Ialomita', 'Sava', 'Morava', 'Southern Bug', 'Desna'}
def rnd(x):
    if isinstance(x[0], (int, float)):
        return [round(x[0], 3), round(x[1], 3)]
    return [rnd(y) for y in x if y]
g = json.load(open(os.path.join(SRC, 'rivers.geojson')))
feats = []
for ft in g['features']:
    n = ft['properties'].get('name')
    if n in KEEP and ft['geometry']:
        feats.append({'type': 'Feature', 'properties': {'n': n}, 'geometry': {
            'type': ft['geometry']['type'], 'coordinates': rnd(ft['geometry']['coordinates'])}})
json.dump({'type': 'FeatureCollection', 'features': feats}, open(os.path.join(OUT, 'rivers-ro.json'), 'w'), separators=(',', ':'))
print('rivers', len(feats))
