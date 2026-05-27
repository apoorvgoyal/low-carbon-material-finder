'use strict';

/* ══════════════════════════════════════════════════════════════
   Stratum — Low-Carbon Material Finder — app.js
   Requires: Leaflet 1.9+, data/manufacturers.js
══════════════════════════════════════════════════════════════ */

const App = (() => {

  /* ── GWP Config ────────────────────────────────────────────── */
  const GWP_CONFIG = {
    concrete: {
      unit: 'kg CO₂e/m³',
      min: 100, max: 500, default: 250,
      benchmarkValue: 265, benchmarkLabel: 'NRMCA avg',
      buckets: [200, 260, 310, 350],
      colorVars: ['--gwp-1','--gwp-2','--gwp-3','--gwp-4','--gwp-5'],
      colorScale: [
        { max: 200, label: '< 200',   color: 'var(--gwp-1)' },
        { max: 260, label: '200–260', color: 'var(--gwp-2)' },
        { max: 310, label: '260–310', color: 'var(--gwp-3)' },
        { max: 350, label: '310–350', color: 'var(--gwp-4)' },
        { max: Infinity, label: '> 350', color: 'var(--gwp-5)' }
      ]
    },
    steel: {
      unit: 'kg CO₂e/t',
      min: 200, max: 2400, default: 950,
      benchmarkValue: 1800, benchmarkLabel: 'World Steel avg',
      buckets: [400, 700, 950, 1200],
      colorVars: ['--gwp-1','--gwp-2','--gwp-3','--gwp-4','--gwp-5'],
      colorScale: [
        { max: 400,  label: '< 400',    color: 'var(--gwp-1)' },
        { max: 700,  label: '400–700',  color: 'var(--gwp-2)' },
        { max: 950,  label: '700–950',  color: 'var(--gwp-3)' },
        { max: 1200, label: '950–1200', color: 'var(--gwp-4)' },
        { max: Infinity, label: '> 1200', color: 'var(--gwp-5)' }
      ]
    }
  };

  /* ── State ─────────────────────────────────────────────────── */
  const S = {
    map: null,
    radiusCircle: null,
    markers: [],
    cityLayer: null,
    center: null,
    userState: null,
    userCountry: null,
    material: 'concrete',
    mode: 'finder',        // 'finder' | 'gwp-target'
    radiusMiles: 100,
    useKm: false,
    productFilter: 'all',
    sortBy: 'name',
    gwpTarget: 250,
    results: [],
    comparison: [],
    ec3ApiKey: null,
    activeSheet: null,     // manufacturer shown in detail sheet
    manufacturers: null,
    projectPin: null,
    isMobile: false
  };

  let dom = {};

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    S.isMobile = window.innerWidth <= 920;
    window.addEventListener('resize', () => { S.isMobile = window.innerWidth <= 920; });

    dom = {
      map:               document.getElementById('map'),
      zipInput:          document.getElementById('zip-input'),
      searchBtn:         document.getElementById('search-btn'),
      modeFinder:        document.getElementById('mode-finder'),
      modeGwp:           document.getElementById('mode-gwp'),
      matConcrete:       document.getElementById('mat-concrete'),
      matSteel:          document.getElementById('mat-steel'),
      radiusSlider:      document.getElementById('radius-slider'),
      radiusLabel:       document.getElementById('radius-label'),
      finderSection:     document.getElementById('finder-section'),
      gwpSection:        document.getElementById('gwp-section'),
      gwpTargetSlider:   document.getElementById('gwp-target-slider'),
      gwpTargetLabel:    document.getElementById('gwp-target-label'),
      resultCount:       document.getElementById('result-count'),
      resultList:        document.getElementById('result-list'),
      sortSel:           document.getElementById('sort-sel'),
      rrMeta:            document.getElementById('rr-meta'),
      rrStats:           document.getElementById('rr-stats'),
      avgGwp:            document.getElementById('avg-gwp'),
      meetTarget:        document.getElementById('meet-target'),
      bestGwpStat:       document.getElementById('best-gwp'),
      histBars:          document.getElementById('hist-bars'),
      compareTray:       document.getElementById('compare-tray'),
      compareSlots:      document.getElementById('compare-slots'),
      compareClear:      document.getElementById('compare-clear'),
      mapHint:           document.getElementById('map-hint'),
      sheetBackdrop:     document.getElementById('sheet-backdrop'),
      detailSheet:       document.getElementById('detail-sheet'),
      sheetCompany:      document.getElementById('sheet-company'),
      sheetMeta:         document.getElementById('sheet-meta'),
      sheetBody:         document.getElementById('sheet-body'),
      sheetClose:        document.getElementById('sheet-close'),
      sheetCompareBtn:   document.getElementById('sheet-compare-btn'),
      ec3Btn:            document.getElementById('ec3-btn'),
      ec3Toggle:         document.getElementById('ec3-toggle'),
      ec3Modal:          document.getElementById('ec3-modal'),
      ec3KeyInput:       document.getElementById('ec3-key-input'),
      ec3SaveBtn:        document.getElementById('ec3-save-btn'),
      ec3CloseBtn:       document.getElementById('ec3-close-btn'),
      ec3ModalError:     document.getElementById('ec3-modal-error'),
      gwpLegend:         document.getElementById('gwp-legend'),
      concreteChips:     document.getElementById('concrete-chips'),
      steelChips:        document.getElementById('steel-chips')
    };

    initMap();
    bindEvents();
    renderHistogram();
    loadManufacturers();
    setMeta('Tap the map to set a project location, or enter a city / postal code.');
  }

  /* ── Map setup ─────────────────────────────────────────────── */
  function initMap() {
    S.map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(S.map);

    L.control.zoom({ position: 'bottomright' }).addTo(S.map);

    initCityLabels();
    S.map.on('click', onMapClick);
  }

  /* ── City labels ───────────────────────────────────────────── */
  const MAJOR_CITIES = [
    { name: 'New York',       lat: 40.7128,  lng: -74.0060  },
    { name: 'Los Angeles',    lat: 34.0522,  lng: -118.2437 },
    { name: 'Chicago',        lat: 41.8781,  lng: -87.6298  },
    { name: 'Toronto',        lat: 43.6532,  lng: -79.3832  },
    { name: 'Mexico City',    lat: 19.4326,  lng: -99.1332  },
    { name: 'Vancouver',      lat: 49.2827,  lng: -123.1207 },
    { name: 'Houston',        lat: 29.7604,  lng: -95.3698  },
    { name: 'São Paulo',      lat: -23.5505, lng: -46.6333  },
    { name: 'Buenos Aires',   lat: -34.6037, lng: -58.3816  },
    { name: 'Bogotá',         lat:  4.7110,  lng: -74.0721  },
    { name: 'Santiago',       lat: -33.4489, lng: -70.6693  },
    { name: 'London',         lat: 51.5074,  lng:  -0.1278  },
    { name: 'Paris',          lat: 48.8566,  lng:   2.3522  },
    { name: 'Berlin',         lat: 52.5200,  lng:  13.4050  },
    { name: 'Madrid',         lat: 40.4168,  lng:  -3.7038  },
    { name: 'Rome',           lat: 41.9028,  lng:  12.4964  },
    { name: 'Amsterdam',      lat: 52.3676,  lng:   4.9041  },
    { name: 'Stockholm',      lat: 59.3293,  lng:  18.0686  },
    { name: 'Warsaw',         lat: 52.2297,  lng:  21.0122  },
    { name: 'Cairo',          lat: 30.0444,  lng:  31.2357  },
    { name: 'Lagos',          lat:  6.5244,  lng:   3.3792  },
    { name: 'Johannesburg',   lat: -26.2041, lng:  28.0473  },
    { name: 'Dubai',          lat: 25.2048,  lng:  55.2708  },
    { name: 'Nairobi',        lat: -1.2921,  lng:  36.8219  },
    { name: 'Tokyo',          lat: 35.6762,  lng: 139.6503  },
    { name: 'Beijing',        lat: 39.9042,  lng: 116.4074  },
    { name: 'Shanghai',       lat: 31.2304,  lng: 121.4737  },
    { name: 'Mumbai',         lat: 19.0760,  lng:  72.8777  },
    { name: 'Seoul',          lat: 37.5665,  lng: 126.9780  },
    { name: 'Singapore',      lat:  1.3521,  lng: 103.8198  },
    { name: 'Sydney',         lat: -33.8688, lng: 151.2093  },
    { name: 'Jakarta',        lat: -6.2088,  lng: 106.8456  }
  ];

  function initCityLabels() {
    S.cityLayer = L.layerGroup();
    MAJOR_CITIES.forEach(c => {
      const icon = L.divIcon({
        html: `<div class="city-label">${c.name}</div>`,
        className: '', iconSize: [0, 0], iconAnchor: [0, 0]
      });
      L.marker([c.lat, c.lng], { icon, interactive: false, keyboard: false })
        .addTo(S.cityLayer);
    });
    const updateCityVis = () => {
      const show = S.map.getZoom() >= 4;
      if (show && !S.map.hasLayer(S.cityLayer)) S.cityLayer.addTo(S.map);
      else if (!show && S.map.hasLayer(S.cityLayer)) S.map.removeLayer(S.cityLayer);
    };
    S.map.on('zoomend', updateCityVis);
    updateCityVis();
  }

  /* ── Map click → project location ─────────────────────────── */
  async function onMapClick(e) {
    const { lat, lng } = e.latlng;
    setMeta('Looking up location…');
    try {
      const result = await reverseGeocode(lat, lng);
      setProjectLocation(lat, lng, result.state, result.country, result.displayName);
    } catch {
      setProjectLocation(lat, lng, null, null, `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
    }
  }

  async function reverseGeocode(lat, lng) {
    const url = 'https://nominatim.openstreetmap.org/reverse?' +
      new URLSearchParams({ lat, lon: lng, format: 'json', addressdetails: 1 });
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const addr = data.address || {};
    const state = addr.state ? stateNameToAbbr(addr.state) : null;
    const country = addr.country_code ? addr.country_code.toUpperCase() : null;
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const region = addr.state || addr.county || '';
    const displayParts = [city, region];
    if (country && country !== 'US') displayParts.push(addr.country || country);
    return {
      state, country,
      displayName: displayParts.filter(Boolean).join(', ') || `${lat.toFixed(3)}, ${lng.toFixed(3)}`
    };
  }

  function setProjectLocation(lat, lng, state, country, displayName) {
    S.center = { lat, lng };
    S.userState = state;
    S.userCountry = country;

    if (S.projectPin) S.map.removeLayer(S.projectPin);
    const projIcon = L.divIcon({
      html: '<div class="pin project-pin">&#9733;</div>',
      className: '',
      iconSize: [28, 33],
      iconAnchor: [14, 33],
      popupAnchor: [0, -33]
    });
    S.projectPin = L.marker([lat, lng], { icon: projIcon, zIndexOffset: 1000 })
      .bindTooltip(`<strong>Project location</strong><br>${displayName}`, { permanent: false })
      .addTo(S.map);

    // Hide hint after first location set
    if (dom.mapHint) dom.mapHint.classList.add('hidden');

    if (S.mode === 'finder') {
      S.map.setView([lat, lng], getZoomForRadius(S.radiusMiles));
      drawRadiusCircle();
      runFilter();
      if (S.ec3ApiKey) fetchEC3Data();
    } else {
      runGwpTargetFilter();
    }
  }

  /* ── Events ────────────────────────────────────────────────── */
  function bindEvents() {
    // Search
    dom.searchBtn.addEventListener('click', onSearch);
    dom.zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') onSearch(); });

    // Mode tabs
    dom.modeFinder.addEventListener('click', () => {
      dom.modeFinder.classList.add('active');
      dom.modeGwp.classList.remove('active');
      setMode('finder');
    });
    dom.modeGwp.addEventListener('click', () => {
      dom.modeGwp.classList.add('active');
      dom.modeFinder.classList.remove('active');
      setMode('gwp-target');
    });

    // Material tabs
    dom.matConcrete.addEventListener('click', () => {
      dom.matConcrete.classList.add('active');
      dom.matSteel.classList.remove('active');
      S.material = 'concrete';
      dom.concreteChips.style.display = '';
      dom.steelChips.style.display = 'none';
      updateGwpSliderRange();
      dispatch();
    });
    dom.matSteel.addEventListener('click', () => {
      dom.matSteel.classList.add('active');
      dom.matConcrete.classList.remove('active');
      S.material = 'steel';
      dom.concreteChips.style.display = 'none';
      dom.steelChips.style.display = '';
      updateGwpSliderRange();
      dispatch();
    });

    // Radius slider
    dom.radiusSlider.addEventListener('input', () => {
      S.radiusMiles = +dom.radiusSlider.value;
      updateRadiusLabel();
      if (S.center && S.mode === 'finder') { drawRadiusCircle(); runFilter(); }
    });

    // Sort
    dom.sortSel.addEventListener('change', () => {
      S.sortBy = dom.sortSel.value;
      if (S.mode === 'finder' && S.center) runFilter();
      else if (S.mode === 'gwp-target') runGwpTargetFilter();
    });

    // GWP target slider
    dom.gwpTargetSlider.addEventListener('input', () => {
      S.gwpTarget = +dom.gwpTargetSlider.value;
      updateGwpLabel();
      renderHistogram();
      runGwpTargetFilter();
    });

    // Benchmark presets
    document.querySelectorAll('.preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const gwpVal = S.material === 'steel' && btn.dataset.gwpSteel
          ? +btn.dataset.gwpSteel
          : +btn.dataset.gwp;
        const cfg = GWP_CONFIG[S.material];
        S.gwpTarget = Math.min(Math.max(gwpVal, cfg.min), cfg.max);
        dom.gwpTargetSlider.value = S.gwpTarget;
        updateGwpLabel();
        renderHistogram();
        runGwpTargetFilter();
      });
    });

    // Tech chips (toggle on/off visual only for now)
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => chip.classList.toggle('on'));
    });

    // Compare
    dom.compareClear.addEventListener('click', clearComparison);

    // EC3 btn (header) — opens modal
    dom.ec3Btn.addEventListener('click', () => { openEc3Modal(); });

    // EC3 toggle (rail) — opens modal to enable
    if (dom.ec3Toggle) {
      dom.ec3Toggle.addEventListener('click', () => {
        if (!S.ec3ApiKey) {
          openEc3Modal();
        } else {
          // Disconnect
          S.ec3ApiKey = null;
          dom.ec3Toggle.classList.remove('on');
          dom.ec3Btn.classList.remove('active');
          setMeta('EC3 disconnected. Using curated data only.');
        }
      });
    }

    // EC3 modal
    dom.ec3CloseBtn.addEventListener('click', () => dom.ec3Modal.classList.remove('show'));
    dom.ec3SaveBtn.addEventListener('click', saveEc3Key);
    dom.ec3Modal.addEventListener('click', e => {
      if (e.target === dom.ec3Modal) dom.ec3Modal.classList.remove('show');
    });
    dom.ec3KeyInput.addEventListener('input', () => showEc3Error(null)); // clear error on typing

    // Detail sheet close
    dom.sheetClose.addEventListener('click', closeSheet);
    dom.sheetBackdrop.addEventListener('click', closeSheet);

    // Sheet compare button
    dom.sheetCompareBtn.addEventListener('click', () => {
      if (S.activeSheet) toggleComparison(S.activeSheet);
    });

    // Map hint hide
    if (dom.mapHint) {
      setTimeout(() => dom.mapHint.classList.add('hidden'), 10000);
      dom.map.addEventListener('click', () => dom.mapHint.classList.add('hidden'), { once: true });
    }
  }

  /* ── Utilities ─────────────────────────────────────────────── */
  function kmFromMiles(mi) { return Math.round(mi * 1.60934); }
  function radiusDisplay() {
    return S.useKm ? `${kmFromMiles(S.radiusMiles)} km` : `${S.radiusMiles} mi`;
  }
  function distDisplay(distMi) {
    if (distMi == null) return null;
    return S.useKm ? `${Math.round(distMi * 1.60934)} km` : `${Math.round(distMi)} mi`;
  }
  function updateRadiusLabel() {
    if (dom.radiusLabel) dom.radiusLabel.textContent = radiusDisplay();
  }
  function updateGwpLabel() {
    if (dom.gwpTargetLabel) dom.gwpTargetLabel.textContent = S.gwpTarget;
    // Update unit text below
    const unitEl = dom.gwpSection && dom.gwpSection.querySelector('.gwp-target-unit');
    if (unitEl) unitEl.textContent = GWP_CONFIG[S.material].unit;
  }

  function setMode(mode) {
    S.mode = mode;
    const isFinder = mode === 'finder';
    if (dom.finderSection) dom.finderSection.style.display = isFinder ? '' : 'none';
    if (dom.gwpSection)    dom.gwpSection.style.display    = isFinder ? 'none' : '';
    if (mode === 'gwp-target') {
      if (S.radiusCircle) { S.map.removeLayer(S.radiusCircle); S.radiusCircle = null; }
      runGwpTargetFilter();
    } else {
      if (S.center) { drawRadiusCircle(); runFilter(); }
      else setMeta('Enter a city or click the map to set a project location.');
    }
  }

  function updateGwpSliderRange() {
    const cfg = GWP_CONFIG[S.material];
    dom.gwpTargetSlider.min = cfg.min;
    dom.gwpTargetSlider.max = cfg.max;
    S.gwpTarget = cfg.default;
    dom.gwpTargetSlider.value = S.gwpTarget;
    updateGwpLabel();
  }

  function dispatch() {
    if (S.mode === 'finder') { if (S.center) runFilter(); }
    else runGwpTargetFilter();
  }

  function setMeta(msg) {
    if (dom.rrMeta) dom.rrMeta.textContent = msg;
  }

  /* ══════════════════════════════════════════════════════════
     SEARCH & GEOCODING
  ══════════════════════════════════════════════════════════ */
  async function onSearch() {
    const q = (dom.zipInput.value || '').trim();
    if (!q) { setMeta('Please enter a city, address, or postal code.'); return; }
    setMeta('Searching location…');
    dom.searchBtn.disabled = true;
    try {
      const result = await geocodeLocation(q);
      setProjectLocation(result.lat, result.lng, result.state, result.country, result.displayName);
    } catch (err) {
      setMeta(err.message || 'Location not found. Try a city name or postal code.');
    } finally {
      dom.searchBtn.disabled = false;
    }
  }

  async function geocodeLocation(query) {
    const url = 'https://nominatim.openstreetmap.org/search?' +
      new URLSearchParams({ q: query, format: 'json', addressdetails: 1, limit: 1 });
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error('Geocoding failed. Check your connection.');
    const data = await res.json();
    if (!data.length) throw new Error(`Location "${query}" not found.`);
    const item = data[0];
    const addr = item.address || {};
    const country = addr.country_code ? addr.country_code.toUpperCase() : null;
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const region = addr.state || addr.county || '';
    const displayParts = [city, region];
    if (country && country !== 'US') displayParts.push(addr.country || country);
    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      state: addr.state ? stateNameToAbbr(addr.state) : null,
      country,
      displayName: displayParts.filter(Boolean).join(', ') || query
    };
  }

  const STATE_MAP = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
    'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
    'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
    'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
    'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
    'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
    'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
    'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
    'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI',
    'Wyoming':'WY','District of Columbia':'DC','Washington D.C.':'DC'
  };
  function stateNameToAbbr(n) { return STATE_MAP[n] || null; }

  /* ══════════════════════════════════════════════════════════
     FILTERING
  ══════════════════════════════════════════════════════════ */
  function getAllManufacturers() {
    const db = S.manufacturers || {};
    return db[S.material] || [];
  }

  function runFilter() {
    if (!S.center) return;
    S.results = getAllManufacturers()
      .filter(m => matchesRegion(m))
      .map(m => ({ ...m, distanceMi: haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng) }))
      .sort(sorter());

    renderMarkers();
    renderSidebar();
    renderHistogram();
    updateStats();

    const msg = S.results.length === 0
      ? `No ${S.material} manufacturers found. Try increasing the radius or switching to GWP Target mode.`
      : `${S.results.length} ${S.material} manufacturer${S.results.length !== 1 ? 's' : ''} within ${radiusDisplay()}.`;
    setMeta(msg);
  }

  function runGwpTargetFilter() {
    const cfg = GWP_CONFIG[S.material];
    const db = S.manufacturers || {};
    S.results = (db[S.material] || [])
      .filter(m => m.products.some(p => {
        const g = p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate;
        return g != null && g <= S.gwpTarget;
      }))
      .map(m => ({
        ...m,
        distanceMi: S.center ? haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng) : null
      }))
      .sort((a, b) => (bestGwp(a) ?? Infinity) - (bestGwp(b) ?? Infinity));

    renderMarkers();
    renderSidebar();
    renderHistogram();
    updateStats();
    setMeta(`${S.results.length} manufacturer${S.results.length !== 1 ? 's' : ''} can produce ${S.material} at ≤ ${S.gwpTarget} ${cfg.unit}.`);
  }

  function matchesRegion(m) {
    const dist = haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng);
    if (dist <= S.radiusMiles) return true;
    const mCountry = m.country || 'US';
    const uCountry = S.userCountry || 'US';
    if (m.coverage === 'national' && mCountry === uCountry) return true;
    if (S.userState && m.serviceStates && m.serviceStates.includes(S.userState)) return true;
    if (S.userCountry && m.serviceCountries && m.serviceCountries.includes(S.userCountry)) return true;
    return dist <= S.radiusMiles * 2;
  }

  function sorter() {
    return (a, b) => {
      if (S.sortBy === 'gwp') return (bestGwp(a) ?? Infinity) - (bestGwp(b) ?? Infinity);
      if (S.sortBy === 'distance') return (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity);
      return a.company.localeCompare(b.company);
    };
  }

  /* ══════════════════════════════════════════════════════════
     STATS BAR
  ══════════════════════════════════════════════════════════ */
  function updateStats() {
    const gwps = S.results.map(m => bestGwp(m)).filter(v => v != null);
    const avg = gwps.length ? Math.round(gwps.reduce((a, b) => a + b, 0) / gwps.length) : null;
    const best = gwps.length ? Math.min(...gwps) : null;
    const meeting = S.mode === 'gwp-target'
      ? S.results.length
      : gwps.filter(g => g <= S.gwpTarget).length;

    if (dom.avgGwp)     dom.avgGwp.textContent     = avg  != null ? avg  : '—';
    if (dom.bestGwpStat) dom.bestGwpStat.textContent = best != null ? best : '—';
    if (dom.meetTarget)  dom.meetTarget.textContent  = gwps.length ? `${meeting}/${S.results.length}` : '—';
  }

  /* ══════════════════════════════════════════════════════════
     MAP RENDERING
  ══════════════════════════════════════════════════════════ */
  function gwpBucket(gwp, material) {
    if (gwp == null) return 'nodata';
    const buckets = GWP_CONFIG[material].buckets;
    if (gwp < buckets[0]) return 'gwp-1';
    if (gwp < buckets[1]) return 'gwp-2';
    if (gwp < buckets[2]) return 'gwp-3';
    if (gwp < buckets[3]) return 'gwp-4';
    return 'gwp-5';
  }

  function renderMarkers() {
    S.markers.forEach(({ layer }) => S.map.removeLayer(layer));
    S.markers = [];

    S.results.forEach(m => {
      const gwp = bestGwp(m);
      const bucket = gwpBucket(gwp, S.material);
      const gwpText = gwp != null ? Math.round(gwp) : '—';
      const meetsTarget = S.mode === 'gwp-target'
        ? m.products.some(p => { const g = p.gwpVerified ?? p.gwpEstimate; return g != null && g <= S.gwpTarget; })
        : true;
      const dimmed = S.mode === 'gwp-target' && !meetsTarget ? ' dimmed' : '';
      const isSelected = S.activeSheet && S.activeSheet.id === m.id ? ' selected' : '';

      const icon = L.divIcon({
        html: `<div class="pin ${bucket}${dimmed}${isSelected}">${gwpText}</div>`,
        className: '',
        iconSize: [40, 31],
        iconAnchor: [20, 31],
        popupAnchor: [0, -31]
      });

      const layer = L.marker([m.hq.lat, m.hq.lng], { icon })
        .addTo(S.map);

      layer.on('click', () => openSheet(m));

      S.markers.push({ id: m.id, layer });
    });

    if (dom.resultCount) dom.resultCount.textContent = `${S.results.length} found`;
  }

  function drawRadiusCircle() {
    if (S.radiusCircle) S.map.removeLayer(S.radiusCircle);
    S.radiusCircle = L.circle([S.center.lat, S.center.lng], {
      radius: S.radiusMiles * 1609.34,
      color: 'var(--moss)', weight: 1.5,
      fillColor: 'var(--moss)', fillOpacity: 0.04
    }).addTo(S.map);
  }

  /* ══════════════════════════════════════════════════════════
     HISTOGRAM / LEGEND
  ══════════════════════════════════════════════════════════ */
  function renderHistogram() {
    const bars = [1, 2, 3, 4, 5];
    const counts = [0, 0, 0, 0, 0];
    const allMfrs = getAllManufacturers();

    allMfrs.forEach(m => {
      const gwp = bestGwp(m);
      const b = gwpBucket(gwp, S.material);
      if (b === 'nodata') return;
      const idx = parseInt(b.replace('gwp-', ''), 10) - 1;
      if (idx >= 0 && idx < 5) counts[idx]++;
    });

    const maxCount = Math.max(...counts, 1);

    bars.forEach(i => {
      const bar = document.getElementById(`hist-bar-${i}`);
      if (!bar) return;
      const count = counts[i - 1];
      const pct = Math.max(4, Math.round((count / maxCount) * 100));
      bar.style.height = `${pct}%`;
      const countEl = bar.querySelector('.hist-bar-count');
      if (countEl) countEl.textContent = count > 0 ? count : '';
    });
  }

  /* ══════════════════════════════════════════════════════════
     SIDEBAR (results rail)
  ══════════════════════════════════════════════════════════ */
  function renderSidebar() {
    if (!S.results.length) {
      const msg = S.mode === 'gwp-target'
        ? `No manufacturers found at ≤ ${S.gwpTarget} ${GWP_CONFIG[S.material].unit}. Try raising the GWP target.`
        : `No manufacturers found. Try increasing the radius or switching materials.`;
      dom.resultList.innerHTML = `<div class="empty-state">${msg}</div>`;
      return;
    }

    const cfg = GWP_CONFIG[S.material];
    const bench = cfg.benchmarkValue;

    dom.resultList.innerHTML = S.results.map(m => {
      const gwp = bestGwp(m);
      const bucket = gwpBucket(gwp, S.material);
      const isEst = gwp != null && bestGwpVerified(m) == null;
      const inCmp = S.comparison.some(c => c.id === m.id);
      const isSelected = S.activeSheet && S.activeSheet.id === m.id;

      // Core sample segments
      const segColors = ['var(--gwp-1)','var(--gwp-2)','var(--gwp-3)','var(--gwp-4)','var(--gwp-5)'];
      const coreSegs = segColors.map(c => `<div class="seg" style="background:${c}"></div>`).join('');

      // Meta line
      const parts = [];
      if (m.hq && m.hq.label) parts.push(m.hq.label.split(',')[0]);
      if (m.plantCount) parts.push(`${m.plantCount} plants`);
      if (m.distanceMi != null) parts.push(distDisplay(m.distanceMi));
      if (m.coverage === 'national') parts.push('National');
      const metaLine = parts.join(' · ');

      // Tech chips
      const techList = (m.technologies || []).slice(0, 3);
      const chipsHtml = [
        ...techList.map(t => `<span class="rcard-chip">${t}</span>`),
        m.fromEC3 ? '<span class="rcard-chip ec3">EC3</span>' : ''
      ].join('');

      // GWP bar
      let gwpHtml = '';
      if (gwp != null) {
        const fillPct = Math.min(100, Math.round((gwp / bench) * 80));
        const benchPct = Math.min(100, 80);
        const pctVsBench = Math.round((1 - gwp / bench) * 100);
        const pctClass = pctVsBench >= 0 ? '' : ' over';
        const pctText = pctVsBench >= 0 ? `↓${Math.abs(pctVsBench)}%` : `↑${Math.abs(pctVsBench)}%`;
        gwpHtml = `
          <div class="rcard-gwp-val">${Math.round(gwp)}</div>
          <div class="rcard-gwp-unit">${cfg.unit}${isEst ? ' est.' : ''}</div>
          <div class="rcard-gwp-bar-wrap">
            <div class="rcard-gwp-bar-fill" style="width:${fillPct}%;background:var(--${bucket.replace('-','')},var(--gwp-3))"></div>
            <div class="rcard-gwp-bench" style="left:${benchPct}%"></div>
          </div>
          <div class="rcard-gwp-pct${pctClass}">${pctText}</div>`;
      } else {
        gwpHtml = '<div class="rcard-gwp-nodata nd">— No GWP data</div>';
      }

      return `<div class="rcard${isSelected ? ' selected' : ''}" data-id="${m.id}">
        <div class="rcard-core"><div class="core-sample">${coreSegs}</div></div>
        <div class="rcard-body">
          <div class="rcard-main">
            <div class="rcard-company">
              ${m.company}
              ${m.products && m.products.some(p => p.epdAvailable)
                ? '<span class="rcard-verified" title="Has EPDs">✓</span>' : ''}
            </div>
            <div class="rcard-meta">${metaLine}</div>
            ${chipsHtml ? `<div class="rcard-chips">${chipsHtml}</div>` : ''}
          </div>
          <div class="rcard-gwp">${gwpHtml}</div>
        </div>
        <button class="rcard-compare${inCmp ? ' on' : ''}" data-id="${m.id}" title="${inCmp ? 'Remove from compare' : 'Add to compare'}">
          ${inCmp ? '✓' : '+'}
        </button>
      </div>`;
    }).join('');

    // Bind events
    dom.resultList.querySelectorAll('.rcard').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.classList.contains('rcard-compare')) return;
        const m = S.results.find(r => r.id === card.dataset.id);
        if (m) openSheet(m);
      });
    });

    dom.resultList.querySelectorAll('.rcard-compare').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const m = S.results.find(r => r.id === btn.dataset.id);
        if (m) toggleComparison(m);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     DETAIL SHEET
  ══════════════════════════════════════════════════════════ */
  function openSheet(m) {
    S.activeSheet = m;

    // Update header
    if (dom.sheetCompany) dom.sheetCompany.textContent = m.company;

    // Build meta
    const metaParts = [];
    if (m.hq && m.hq.label) metaParts.push(`<span class="sheet-meta-item">📍 ${m.hq.label}</span>`);
    if (m.plantCount) metaParts.push(`<span class="sheet-meta-item">🏭 ${m.plantCount} plants</span>`);
    const epdCount = (m.products || []).filter(p => p.epdAvailable).length;
    if (epdCount) metaParts.push(`<span class="sheet-meta-item">📋 ${epdCount} EPD${epdCount !== 1 ? 's' : ''}</span>`);
    if (dom.sheetMeta) dom.sheetMeta.innerHTML = metaParts.join('');

    // Update compare button
    const inCmp = S.comparison.some(c => c.id === m.id);
    if (dom.sheetCompareBtn) {
      dom.sheetCompareBtn.textContent = inCmp ? '✓ In Compare' : '+ Add to Compare';
      dom.sheetCompareBtn.classList.toggle('primary', inCmp);
    }

    // Build body
    const cfg = GWP_CONFIG[S.material];
    const gwp = bestGwp(m);
    const gwpVerified = bestGwpVerified(m);
    const bucket = gwpBucket(gwp, S.material);
    const benchVal = cfg.benchmarkValue;
    const pctVsBench = gwp != null ? Math.round((1 - gwp / benchVal) * 100) : null;

    // Hero stats
    const statsHtml = `
      <div class="sheet-stats">
        <div class="sheet-stat">
          <div class="sheet-stat-val" style="color:var(--${bucket})">${gwp != null ? Math.round(gwp) : '—'}</div>
          <div class="sheet-stat-label">Best GWP · ${cfg.unit}</div>
        </div>
        <div class="sheet-stat">
          <div class="sheet-stat-val">${m.plantCount || '—'}</div>
          <div class="sheet-stat-label">Plants</div>
        </div>
        <div class="sheet-stat">
          <div class="sheet-stat-val" style="color:${pctVsBench != null && pctVsBench >= 0 ? 'var(--good)' : 'var(--bad)'}">
            ${pctVsBench != null ? (pctVsBench >= 0 ? `↓${Math.abs(pctVsBench)}%` : `↑${Math.abs(pctVsBench)}%`) : '—'}
          </div>
          <div class="sheet-stat-label">vs Benchmark</div>
        </div>
      </div>`;

    // About
    const aboutHtml = m.about ? `
      <div class="sheet-section">
        <div class="sheet-section-title">About</div>
        <div class="sheet-about">${m.about}</div>
      </div>` : '';

    // Technology chips
    const techs = m.technologies || (m.technologyStatus ? [techLabel(m.technologyStatus)] : []);
    const techsHtml = techs.length ? `
      <div class="sheet-section">
        <div class="sheet-section-title">Technologies</div>
        <div class="sheet-chips">
          ${techs.map(t => `<span class="sheet-chip">${t}</span>`).join('')}
        </div>
      </div>` : '';

    // Products table
    const productRows = (m.products || []).map(p => {
      const pGwp = p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate;
      const pBucket = gwpBucket(pGwp, S.material);
      const gwpCell = pGwp != null
        ? `<span class="pt-gwp" style="background:var(--${pBucket}-soft,var(--gwp-3-soft));color:var(--${pBucket},var(--gwp-3))">${pGwp}${p.gwpVerified == null ? ' est.' : ''}</span>`
        : `<span class="nd">—</span>`;
      const epdCell = p.epdUrl
        ? `<a class="pt-epd view" href="${p.epdUrl}" target="_blank" rel="noopener">View EPD</a>`
        : p.epdInfoUrl
          ? `<a class="pt-epd info" href="${p.epdInfoUrl}" target="_blank" rel="noopener">${p.epdAvailable ? 'EPD Info' : 'Mfr Info'}</a>`
          : `<span class="nd">—</span>`;
      const reduction = p.reductionClaim && p.reductionClaim !== 'No data found'
        ? `<span style="color:var(--good);font-size:11px">${p.reductionClaim}</span>`
        : `<span class="nd">—</span>`;
      return `<tr>
        <td><strong>${p.name}</strong><br><small style="color:var(--ink-3)">${p.description || ''}</small></td>
        <td>${gwpCell}</td>
        <td>${reduction}</td>
        <td>${epdCell}</td>
      </tr>`;
    }).join('');

    const productsHtml = productRows ? `
      <div class="sheet-section">
        <div class="sheet-section-title">Products</div>
        <table class="products-table">
          <thead><tr>
            <th>Product</th><th>GWP A1-A3</th><th>Reduction</th><th>EPD</th>
          </tr></thead>
          <tbody>${productRows}</tbody>
        </table>
      </div>` : '';

    // Contact
    const links = [];
    if (m.contactUrl) links.push(`<a class="contact-btn primary" href="${m.contactUrl}" target="_blank" rel="noopener">Contact</a>`);
    if (m.plantLocatorUrl) links.push(`<a class="contact-btn" href="${m.plantLocatorUrl}" target="_blank" rel="noopener">Find Plant</a>`);
    if (m.ec3SearchUrl) links.push(`<a class="contact-btn" href="${m.ec3SearchUrl}" target="_blank" rel="noopener">EC3</a>`);
    const contactHtml = links.length ? `
      <div class="sheet-section">
        <div class="sheet-section-title">Contact &amp; Resources</div>
        <div class="sheet-contact">${links.join('')}</div>
      </div>` : '';

    // Sources
    const srcs = (m.sources || []);
    const sourcesHtml = srcs.length ? `
      <div class="sheet-section">
        <div class="sheet-section-title">Data Sources</div>
        <div style="font-size:11px;color:var(--ink-3);line-height:1.8">
          ${srcs.map(s => `<a href="${s.url}" target="_blank" rel="noopener" style="color:var(--moss)">${s.label}</a>`).join(' · ')}
        </div>
      </div>` : '';

    if (dom.sheetBody) {
      dom.sheetBody.innerHTML = statsHtml + aboutHtml + techsHtml + productsHtml + contactHtml + sourcesHtml;
    }

    // Show sheet
    dom.detailSheet.classList.add('open');
    dom.sheetBackdrop.classList.add('show');

    // Highlight marker
    renderMarkers();

    // Pan map to manufacturer
    if (S.map && m.hq) {
      S.map.panTo([m.hq.lat, m.hq.lng], { animate: true });
    }
  }

  function closeSheet() {
    dom.detailSheet.classList.remove('open');
    dom.sheetBackdrop.classList.remove('show');
    S.activeSheet = null;
    renderMarkers(); // remove selected state
  }

  function techLabel(s) {
    if (s === 'precommercial') return 'Pre-Commercial';
    if (s === 'licensed') return 'Licensed Tech';
    if (s === 'emerging') return 'Emerging';
    return s;
  }

  /* ══════════════════════════════════════════════════════════
     COMPARISON TRAY
  ══════════════════════════════════════════════════════════ */
  function toggleComparison(m) {
    const idx = S.comparison.findIndex(c => c.id === m.id);
    if (idx >= 0) {
      S.comparison.splice(idx, 1);
    } else {
      if (S.comparison.length >= 4) {
        setMeta('Comparison limited to 4. Remove one first.');
        return;
      }
      S.comparison.push(m);
    }
    renderCompareTray();
    renderSidebar();
    renderMarkers();
    // Update sheet compare button if open
    if (S.activeSheet && S.activeSheet.id === m.id) {
      const inCmp = S.comparison.some(c => c.id === m.id);
      if (dom.sheetCompareBtn) {
        dom.sheetCompareBtn.textContent = inCmp ? '✓ In Compare' : '+ Add to Compare';
        dom.sheetCompareBtn.classList.toggle('primary', inCmp);
      }
    }
  }

  function clearComparison() {
    S.comparison = [];
    renderCompareTray();
    renderSidebar();
    renderMarkers();
  }

  function renderCompareTray() {
    if (!S.comparison.length) {
      dom.compareTray.classList.remove('open');
      return;
    }
    dom.compareTray.classList.add('open');

    // Render slots (always 4 slots)
    const slots = [];
    for (let i = 0; i < 4; i++) {
      const m = S.comparison[i];
      if (m) {
        const gwp = bestGwp(m);
        const gwpText = gwp != null ? `${Math.round(gwp)}` : '—';
        slots.push(`
          <div class="compare-slot filled" data-id="${m.id}">
            <span style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${m.company.split(' ')[0]}<br>
              <span style="font-family:var(--f-mono);font-size:10px;opacity:.7">${gwpText}</span>
            </span>
            <button class="compare-slot-remove" data-id="${m.id}" title="Remove">×</button>
          </div>`);
      } else {
        slots.push('<div class="compare-slot">+ Add</div>');
      }
    }
    dom.compareSlots.innerHTML = slots.join('');

    // Bind remove buttons
    dom.compareSlots.querySelectorAll('.compare-slot-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const m = S.comparison.find(c => c.id === btn.dataset.id);
        if (m) toggleComparison(m);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     DATA LOADING
  ══════════════════════════════════════════════════════════ */
  async function loadManufacturers() {
    try {
      const res = await fetch('/api/manufacturers');
      if (res.ok) {
        const payload = await res.json();
        if (payload && Array.isArray(payload.manufacturers) && payload.manufacturers.length > 0) {
          S.manufacturers = { concrete: [], steel: [] };
          for (const m of payload.manufacturers) {
            if (S.manufacturers[m.type]) S.manufacturers[m.type].push(m);
          }
          return;
        }
      }
    } catch { /* API not available */ }

    // Fall back to static file
    if (window.MANUFACTURERS) {
      S.manufacturers = window.MANUFACTURERS;
    } else {
      S.manufacturers = { concrete: [], steel: [] };
    }
  }

  /* ══════════════════════════════════════════════════════════
     EC3 INTEGRATION
  ══════════════════════════════════════════════════════════ */
  function openEc3Modal() {
    showEc3Error(null);
    dom.ec3Modal.classList.add('show');
  }

  function showEc3Error(msg) {
    if (!dom.ec3ModalError) return;
    if (msg) {
      dom.ec3ModalError.textContent = msg;
      dom.ec3ModalError.style.display = 'block';
    } else {
      dom.ec3ModalError.style.display = 'none';
      dom.ec3ModalError.textContent = '';
    }
  }

  async function saveEc3Key() {
    const key = dom.ec3KeyInput.value.trim();
    if (!key) {
      S.ec3ApiKey = null;
      dom.ec3Btn.classList.remove('active');
      if (dom.ec3Toggle) dom.ec3Toggle.classList.remove('on');
      dom.ec3Modal.classList.remove('show');
      return;
    }
    dom.ec3SaveBtn.disabled = true;
    dom.ec3SaveBtn.textContent = 'Verifying…';
    try {
      const res = await fetch('/api/ec3-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, category: 'concrete', page_size: 1 })
      });
      if (res.ok) {
        S.ec3ApiKey = key;
        dom.ec3Btn.classList.add('active');
        if (dom.ec3Toggle) dom.ec3Toggle.classList.add('on');
        dom.ec3Modal.classList.remove('show');
        setMeta('EC3 connected. Live data will be included on next search.');
      } else if (res.status === 401 || res.status === 403) {
        showEc3Error('Key rejected by EC3 (invalid or expired). Get a fresh key at buildingtransparency.org → Account → API Tokens.');
      } else if (res.status === 400) {
        showEc3Error('Request error — check your key and try again.');
      } else {
        showEc3Error(`EC3 returned ${res.status}. Try again or proceed without EC3.`);
      }
    } catch {
      showEc3Error('Could not reach EC3. Check your internet connection.');
    } finally {
      dom.ec3SaveBtn.disabled = false;
      dom.ec3SaveBtn.textContent = 'Save & Enable';
    }
  }

  async function fetchEC3Data() {
    if (!S.ec3ApiKey || !S.center) return;
    setMeta('Fetching live data from EC3…');
    try {
      const category = S.material; // proxy maps 'concrete'→'Concrete >> ReadyMix', 'steel'→EC3 steel class
      const geocode = S.userCountry
        ? (S.userCountry === 'US' && S.userState ? `US-${S.userState}` : S.userCountry)
        : null;

      let allPlants = [];
      for (let page = 1; page <= 3; page++) {
        const res = await fetch('/api/ec3-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: S.ec3ApiKey, category,
            ...(geocode && { geocode }),
            page, page_size: 200
          })
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // Key is invalid — disconnect to stop future auto-calls
            S.ec3ApiKey = null;
            if (dom.ec3Toggle) dom.ec3Toggle.classList.remove('on');
            dom.ec3Btn.classList.remove('active');
            setMeta('EC3 key expired or invalid — disconnected. Re-enter your key in EC3 Live Data.');
            return;
          }
          if (page === 1) { setMeta(`EC3 API error ${res.status}. Using curated data only.`); return; }
          break;
        }
        const data = await res.json();
        const batch = Array.isArray(data) ? data : (data.results || []);
        allPlants = allPlants.concat(batch);
        if (!data.next || batch.length < 200) break;
      }

      if (allPlants.length > 0) {
        const before = S.results.length;
        mergeEC3Results(allPlants);
        const added = S.results.filter(r => r.fromEC3).length;
        setMeta(`${S.results.length} results — ${added} from EC3 live, ${before} curated.`);
      } else {
        setMeta('EC3 returned no plants here. Showing curated data only.');
      }
    } catch {
      setMeta('EC3 fetch failed. Using curated data only.');
    }
  }

  function mergeEC3Results(plants) {
    const cfg = GWP_CONFIG[S.material];
    plants.forEach(plant => {
      if (!plant.latitude || !plant.longitude) return;
      const dist = haversine(S.center.lat, S.center.lng, plant.latitude, plant.longitude);
      if (dist > S.radiusMiles) return;
      const plantKey = (plant.plant_name || '').toLowerCase().replace(/\s+/g, '').slice(0, 10);
      const exists = plantKey && S.results.some(r =>
        r.company.toLowerCase().replace(/\s+/g, '').startsWith(plantKey)
      );
      if (exists) return;
      const gwpVal = plant.gwp_A1A3 ?? null;
      const addr = [plant.address, plant.city, plant.country].filter(Boolean).join(', ') || 'See EC3';
      S.results.push({
        id: `ec3-${plant.id || Math.random()}`,
        company: plant.plant_name || 'Unknown Plant (EC3)',
        productLine: plant.category || S.material,
        type: S.material,
        coverage: 'local',
        serviceRegion: addr,
        country: plant.country || S.userCountry || null,
        plantCount: '1',
        hq: { lat: plant.latitude, lng: plant.longitude, label: addr },
        plantLocatorUrl: 'https://www.buildingtransparency.org/',
        about: `Live data from EC3. Declared GWP: ${gwpVal != null ? gwpVal + ' ' + cfg.unit : 'No data found'}.`,
        products: [{
          id: 'ec3-product',
          name: plant.product_name || 'See EC3 for details',
          description: '',
          gwpVerified: gwpVal, gwpLabel: gwpVal != null ? `${gwpVal} ${cfg.unit}` : 'No data found',
          gwpEstimate: null, gwpEstimateNote: null, gwpUnit: cfg.unit,
          reductionClaim: 'No data found', epdAvailable: !!plant.epd_url,
          epdUrl: plant.epd_url || null, epdInfoUrl: 'https://www.buildingtransparency.org/',
          ec3Searchable: true, costBase: 'No data found', costPremium: 'No data found'
        }],
        sources: [{ label: 'EC3 (Building Transparency)', url: 'https://www.buildingtransparency.org/' }],
        contactUrl: 'https://www.buildingtransparency.org/',
        ec3SearchUrl: 'https://www.buildingtransparency.org/',
        distanceMi: dist, fromEC3: true
      });
    });
    S.results.sort(sorter());
    renderMarkers();
    renderSidebar();
  }

  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 3958.8, d2r = Math.PI / 180;
    const dLat = (lat2 - lat1) * d2r, dLng = (lng2 - lng1) * d2r;
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  function bestGwp(m) {
    const vals = (m.products || []).map(p => p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
  }

  function bestGwpVerified(m) {
    const vals = (m.products || []).map(p => p.gwpVerified).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
  }

  function getZoomForRadius(miles) {
    if (miles <= 25)  return 10;
    if (miles <= 50)  return 9;
    if (miles <= 100) return 8;
    if (miles <= 200) return 7;
    if (miles <= 350) return 6;
    return 5;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
