'use strict';

/* ══════════════════════════════════════════════════════════════
   Low-Carbon Material Finder — app.js
   Requires: Leaflet 1.9+, data/manufacturers.js
══════════════════════════════════════════════════════════════ */

const App = (() => {

  /* ── State ─────────────────────────────────────────────────── */
  const S = {
    map: null,
    radiusCircle: null,
    markers: [],
    cityLayer: null,
    center: null,
    userState: null,
    material: 'concrete',
    mode: 'finder',        // 'finder' | 'gwp-target'
    radiusMiles: 100,
    productFilter: 'all',
    sortBy: 'name',
    gwpTarget: 250,
    results: [],
    comparison: [],
    ec3ApiKey: null,
    communityData: [],
    manufacturers: null,   // populated from API; falls back to window.MANUFACTURERS
    projectPin: null,
    isMobile: false
  };

  let dom = {};

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    S.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', () => { S.isMobile = window.innerWidth <= 768; });

    dom = {
      map:               document.getElementById('map'),
      zipInput:          document.getElementById('zip-input'),
      zipInputM:         document.getElementById('zip-input-m'),
      searchBtn:         document.getElementById('search-btn'),
      searchBtnM:        document.getElementById('search-btn-m'),
      materialBtns:      document.querySelectorAll('.mat-btn'),
      modeBtns:          document.querySelectorAll('.mode-btn:not([data-mobile])'),
      modeBtnsM:         document.querySelectorAll('.mode-btn[data-mobile]'),
      radiusSlider:      document.getElementById('radius-slider'),
      radiusSliderM:     document.getElementById('radius-slider-m'),
      radiusLabel:       document.getElementById('radius-label'),
      radiusLabelM:      document.getElementById('radius-label-m'),
      productSel:        document.getElementById('product-sel'),
      productSelM:       document.getElementById('product-sel-m'),
      finderControls:    document.getElementById('finder-controls'),
      finderControlsM:   document.getElementById('finder-controls-m'),
      gwpControls:       document.getElementById('gwp-controls'),
      gwpControlsM:      document.getElementById('gwp-controls-m'),
      gwpTargetSlider:   document.getElementById('gwp-target-slider'),
      gwpTargetSliderM:  document.getElementById('gwp-target-slider-m'),
      gwpTargetLabel:    document.getElementById('gwp-target-label'),
      gwpTargetLabelM:   document.getElementById('gwp-target-label-m'),
      resultCount:       document.getElementById('result-count'),
      resultList:        document.getElementById('result-list'),
      sortSel:           document.getElementById('sort-sel'),
      statusBar:         document.getElementById('status-bar'),
      comparePanel:      document.getElementById('compare-panel'),
      compareClear:      document.getElementById('compare-clear'),
      compareTable:      document.getElementById('compare-table'),
      ec3Btn:            document.getElementById('ec3-btn'),
      ec3Modal:          document.getElementById('ec3-modal'),
      ec3KeyInput:       document.getElementById('ec3-key-input'),
      ec3SaveBtn:        document.getElementById('ec3-save-btn'),
      ec3CloseBtn:       document.getElementById('ec3-close-btn'),
      legend:            document.getElementById('gwp-legend'),
      sidebar:           document.getElementById('sidebar'),
      sidebarToggle:     document.getElementById('sidebar-toggle')
    };

    initMap();
    bindEvents();
    renderLegend();
    loadManufacturers();
    setStatus('Tap the map to set a project location, or enter a ZIP code to search nearby manufacturers.');
  }

  /* ── Map setup ─────────────────────────────────────────────── */
  function initMap() {
    S.map = L.map('map', { zoomControl: false }).setView([20, 10], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(S.map);

    L.control.zoom({ position: 'bottomright' }).addTo(S.map);

    initCityLabels();
    S.map.on('click', onMapClick);
  }

  /* ── City Labels ───────────────────────────────────────────── */
  const MAJOR_CITIES = [
    { name: 'New York',      lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles',   lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago',       lat: 41.8781, lng: -87.6298 },
    { name: 'Houston',       lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix',       lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia',  lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio',   lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego',     lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas',        lat: 32.7767, lng: -96.7970 },
    { name: 'Austin',        lat: 30.2672, lng: -97.7431 },
    { name: 'Denver',        lat: 39.7392, lng: -104.9903 },
    { name: 'Seattle',       lat: 47.6062, lng: -122.3321 },
    { name: 'Nashville',     lat: 36.1627, lng: -86.7816 },
    { name: 'Washington DC', lat: 38.9072, lng: -77.0369 },
    { name: 'Boston',        lat: 42.3601, lng: -71.0589 },
    { name: 'Atlanta',       lat: 33.7490, lng: -84.3880 },
    { name: 'Miami',         lat: 25.7617, lng: -80.1918 },
    { name: 'Minneapolis',   lat: 44.9778, lng: -93.2650 },
    { name: 'Portland',      lat: 45.5051, lng: -122.6750 },
    { name: 'Las Vegas',     lat: 36.1699, lng: -115.1398 },
    { name: 'Detroit',       lat: 42.3314, lng: -83.0458 },
    { name: 'Charlotte',     lat: 35.2271, lng: -80.8431 },
    { name: 'Indianapolis',  lat: 39.7684, lng: -86.1581 },
    { name: 'Columbus',      lat: 39.9612, lng: -82.9988 },
    { name: 'Kansas City',   lat: 39.0997, lng: -94.5786 },
    { name: 'Salt Lake City',lat: 40.7608, lng: -111.8910 },
    { name: 'New Orleans',   lat: 29.9511, lng: -90.0715 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { name: 'Memphis',       lat: 35.1495, lng: -90.0490 },
    { name: 'Albuquerque',   lat: 35.0844, lng: -106.6504 }
  ];

  function initCityLabels() {
    S.cityLayer = L.layerGroup();
    MAJOR_CITIES.forEach(c => {
      const icon = L.divIcon({
        html: `<div class="city-label">${c.name}</div>`,
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
      L.marker([c.lat, c.lng], { icon, interactive: false, keyboard: false })
        .addTo(S.cityLayer);
    });

    const updateCityVis = () => {
      const show = S.map.getZoom() >= 5;
      if (show && !S.map.hasLayer(S.cityLayer)) S.cityLayer.addTo(S.map);
      else if (!show && S.map.hasLayer(S.cityLayer)) S.map.removeLayer(S.cityLayer);
    };
    S.map.on('zoomend', updateCityVis);
    updateCityVis();
  }

  /* ── Map click → set project location ─────────────────────── */
  async function onMapClick(e) {
    const { lat, lng } = e.latlng;
    setStatus('Looking up location…');
    try {
      const result = await reverseGeocode(lat, lng);
      setProjectLocation(lat, lng, result.state, result.displayName);
    } catch {
      setProjectLocation(lat, lng, null, `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
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
    const city = addr.city || addr.town || addr.village || addr.county || '';
    return {
      state,
      displayName: [city, addr.state].filter(Boolean).join(', ') || `${lat.toFixed(3)}, ${lng.toFixed(3)}`
    };
  }

  function setProjectLocation(lat, lng, state, displayName) {
    S.center = { lat, lng };
    S.userState = state;

    if (S.projectPin) S.map.removeLayer(S.projectPin);
    S.projectPin = L.marker([lat, lng], { icon: projectIcon(), zIndexOffset: 1000 })
      .bindTooltip(`<strong>Project location</strong><br>${displayName}`, { permanent: false })
      .addTo(S.map);

    setStatus(`Project: ${displayName}. Searching…`);

    if (S.mode === 'finder') {
      S.map.setView([lat, lng], getZoomForRadius(S.radiusMiles));
      drawRadiusCircle();
      runFilter();
      if (S.ec3ApiKey) fetchEC3Data();
    } else {
      runGwpTargetFilter();
    }

    // Open sidebar on mobile after search
    if (S.isMobile) {
      setTimeout(() => dom.sidebar.classList.remove('collapsed'), 600);
    }
  }

  /* ── Events ────────────────────────────────────────────────── */
  function bindEvents() {
    // Search buttons (desktop + mobile)
    dom.searchBtn.addEventListener('click', onSearch);
    dom.zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') onSearch(); });
    if (dom.searchBtnM) dom.searchBtnM.addEventListener('click', onSearchMobile);
    if (dom.zipInputM) dom.zipInputM.addEventListener('keydown', e => { if (e.key === 'Enter') onSearchMobile(); });

    // Material toggle
    dom.materialBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.materialBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        S.material = btn.dataset.mat;
        updateProductDropdown();
        renderLegend();
        updateGwpSliderRange();
        dispatch();
      });
    });

    // Mode toggle (desktop)
    dom.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setMode(btn.dataset.mode);
      });
    });

    // Mode toggle (mobile)
    dom.modeBtnsM.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.modeBtnsM.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Sync desktop
        dom.modeBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.mode === btn.dataset.mode);
        });
        setMode(btn.dataset.mode);
      });
    });

    // Radius sliders (desktop + mobile)
    [
      [dom.radiusSlider, dom.radiusLabel],
      [dom.radiusSliderM, dom.radiusLabelM]
    ].forEach(([slider, label]) => {
      if (!slider) return;
      slider.addEventListener('input', () => {
        S.radiusMiles = +slider.value;
        // Sync both
        if (dom.radiusSlider) dom.radiusSlider.value = S.radiusMiles;
        if (dom.radiusSliderM) dom.radiusSliderM.value = S.radiusMiles;
        if (dom.radiusLabel) dom.radiusLabel.textContent = S.radiusMiles + ' mi';
        if (dom.radiusLabelM) dom.radiusLabelM.textContent = S.radiusMiles + ' mi';
        if (S.center && S.mode === 'finder') { drawRadiusCircle(); runFilter(); }
      });
    });

    // Product filters (desktop + mobile)
    [dom.productSel, dom.productSelM].forEach(sel => {
      if (!sel) return;
      sel.addEventListener('change', () => {
        S.productFilter = sel.value;
        if (dom.productSel) dom.productSel.value = S.productFilter;
        if (dom.productSelM) dom.productSelM.value = S.productFilter;
        if (S.center) runFilter();
      });
    });

    // Sort
    dom.sortSel.addEventListener('change', () => {
      S.sortBy = dom.sortSel.value;
      if (S.mode === 'finder' && S.center) runFilter();
    });

    // GWP target sliders (desktop + mobile)
    [
      [dom.gwpTargetSlider, dom.gwpTargetLabel],
      [dom.gwpTargetSliderM, dom.gwpTargetLabelM]
    ].forEach(([slider, label]) => {
      if (!slider) return;
      slider.addEventListener('input', () => {
        S.gwpTarget = +slider.value;
        const cfg = GWP_CONFIG[S.material];
        const txt = `${S.gwpTarget} ${cfg.unit}`;
        if (dom.gwpTargetSlider) dom.gwpTargetSlider.value = S.gwpTarget;
        if (dom.gwpTargetSliderM) dom.gwpTargetSliderM.value = S.gwpTarget;
        if (dom.gwpTargetLabel) dom.gwpTargetLabel.textContent = txt;
        if (dom.gwpTargetLabelM) dom.gwpTargetLabelM.textContent = txt;
        renderLegend();
        runGwpTargetFilter();
      });
    });

    // Comparison
    dom.compareClear.addEventListener('click', clearComparison);

    // EC3
    dom.ec3Btn.addEventListener('click', () => dom.ec3Modal.classList.add('show'));
    dom.ec3CloseBtn.addEventListener('click', () => dom.ec3Modal.classList.remove('show'));
    dom.ec3SaveBtn.addEventListener('click', saveEc3Key);
    dom.ec3Modal.addEventListener('click', e => {
      if (e.target === dom.ec3Modal) dom.ec3Modal.classList.remove('show');
    });

    // Sidebar toggle (desktop)
    dom.sidebarToggle.addEventListener('click', () => dom.sidebar.classList.toggle('collapsed'));
  }

  function setMode(mode) {
    S.mode = mode;
    toggleModeControls();
    if (mode === 'gwp-target') {
      if (S.radiusCircle) { S.map.removeLayer(S.radiusCircle); S.radiusCircle = null; }
      runGwpTargetFilter();
    } else {
      if (S.center) { drawRadiusCircle(); runFilter(); }
      else setStatus('Enter a ZIP code or tap the map to set a project location.');
    }
  }

  function toggleModeControls() {
    const isFinder = S.mode === 'finder';
    // Desktop
    if (dom.finderControls) dom.finderControls.style.display = isFinder ? '' : 'none';
    if (dom.gwpControls) dom.gwpControls.style.display = isFinder ? 'none' : '';
    // Mobile
    if (dom.finderControlsM) dom.finderControlsM.style.display = isFinder ? '' : 'none';
    if (dom.gwpControlsM) dom.gwpControlsM.style.display = isFinder ? 'none' : '';
  }

  function updateGwpSliderRange() {
    const isConcrete = S.material === 'concrete';
    const maxVal = isConcrete ? 500 : 2000;
    const defVal = isConcrete ? 250 : 800;
    const cfg = GWP_CONFIG[S.material];
    S.gwpTarget = defVal;
    [dom.gwpTargetSlider, dom.gwpTargetSliderM].forEach(s => { if (s) { s.max = maxVal; s.value = defVal; } });
    const txt = `${defVal} ${cfg.unit}`;
    if (dom.gwpTargetLabel) dom.gwpTargetLabel.textContent = txt;
    if (dom.gwpTargetLabelM) dom.gwpTargetLabelM.textContent = txt;
  }

  function dispatch() {
    if (S.mode === 'finder') { if (S.center) runFilter(); }
    else runGwpTargetFilter();
  }

  /* ══════════════════════════════════════════════════════════
     SEARCH & GEOCODING
  ══════════════════════════════════════════════════════════ */
  async function onSearch() {
    const zip = (dom.zipInput.value || '').trim();
    await searchZip(zip, dom.searchBtn);
  }

  async function onSearchMobile() {
    const zip = (dom.zipInputM.value || '').trim();
    await searchZip(zip, dom.searchBtnM);
  }

  async function searchZip(zip, btn) {
    if (!/^\d{5}$/.test(zip)) {
      setStatus('Please enter a valid 5-digit US ZIP code.', 'error');
      return;
    }
    setStatus('Geocoding ZIP code…');
    if (btn) btn.disabled = true;
    try {
      const result = await geocodeZip(zip);
      setProjectLocation(result.lat, result.lng, result.state, result.displayName);
    } catch (err) {
      setStatus(err.message || 'Failed to geocode ZIP code.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function geocodeZip(zip) {
    const url = 'https://nominatim.openstreetmap.org/search?' +
      new URLSearchParams({ postalcode: zip, country: 'US', format: 'json', addressdetails: 1, limit: 1 });
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error('Geocoding failed. Check your connection.');
    const data = await res.json();
    if (!data.length) throw new Error(`ZIP code ${zip} not found.`);
    const item = data[0];
    const addr = item.address || {};
    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      state: addr.state ? stateNameToAbbr(addr.state) : null,
      displayName: [addr.city || addr.town || addr.village || addr.county, addr.state].filter(Boolean).join(', ')
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
    const db = S.manufacturers || (typeof MANUFACTURERS !== 'undefined' ? MANUFACTURERS : {});
    const curated = db[S.material] || [];
    // communityData only used when API not available (static fallback mode)
    const community = S.manufacturers ? [] : S.communityData.filter(m => m.type === S.material);
    return [...curated, ...community];
  }

  function runFilter() {
    if (!S.center) return;
    S.results = getAllManufacturers()
      .filter(m => matchesRegion(m) && matchesProduct(m))
      .map(m => ({ ...m, distanceMi: haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng) }))
      .sort(sorter());
    renderMarkers();
    renderSidebar();
    setStatus(`${S.results.length} ${S.material} manufacturer${S.results.length !== 1 ? 's' : ''} within ${S.radiusMiles} mi.`);
  }

  function runGwpTargetFilter() {
    const cfg = GWP_CONFIG[S.material];
    const db = S.manufacturers || (typeof MANUFACTURERS !== 'undefined' ? MANUFACTURERS : {});
    const communityFallback = S.manufacturers ? [] : S.communityData.filter(m => m.type === S.material);
    S.results = (db[S.material] || [])
      .concat(communityFallback)
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
    setStatus(`${S.results.length} manufacturer${S.results.length !== 1 ? 's' : ''} can produce ${S.material} at ≤ ${S.gwpTarget} ${cfg.unit}.`);
  }

  function matchesRegion(m) {
    if (m.coverage === 'national') return true;
    if (!S.userState) return true;
    if (m.serviceStates && m.serviceStates.includes(S.userState)) return true;
    return haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng) <= S.radiusMiles * 2;
  }

  function matchesProduct(m) {
    if (S.productFilter === 'all') return true;
    return m.products.some(p => p.id === S.productFilter);
  }

  function sorter() {
    return (a, b) => {
      if (S.sortBy === 'gwp') return (bestGwp(a) ?? Infinity) - (bestGwp(b) ?? Infinity);
      if (S.sortBy === 'distance') return (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity);
      return a.company.localeCompare(b.company);
    };
  }

  /* ══════════════════════════════════════════════════════════
     MAP RENDERING
  ══════════════════════════════════════════════════════════ */
  function renderMarkers() {
    S.markers.forEach(({ layer }) => S.map.removeLayer(layer));
    S.markers = [];

    S.results.forEach(m => {
      const gwp = bestGwp(m);
      const color = gwpColor(gwp, S.material);
      const icon = mfrIcon(color, m.coverage === 'national', m.technologyStatus);

      const layer = L.marker([m.hq.lat, m.hq.lng], { icon })
        .bindPopup(buildPopupHtml(m), { maxWidth: 420, minWidth: 300, className: 'lcmf-popup' })
        .addTo(S.map);

      layer.on('popupopen', () => {
        const btn = document.getElementById(`cmp-${m.id}`);
        if (btn) btn.addEventListener('click', () => toggleComparison(m));
      });

      S.markers.push({ id: m.id, layer });
    });

    dom.resultCount.textContent = `${S.results.length} found`;
  }

  function drawRadiusCircle() {
    if (S.radiusCircle) S.map.removeLayer(S.radiusCircle);
    S.radiusCircle = L.circle([S.center.lat, S.center.lng], {
      radius: S.radiusMiles * 1609.34,
      color: '#4a6fa5', weight: 1.5, fillColor: '#4a6fa5', fillOpacity: 0.06
    }).addTo(S.map);
  }

  /* ── Icons ─────────────────────────────────────────────── */
  function mfrIcon(color, isNational, techStatus) {
    const size = isNational ? 32 : 26;
    const sw = isNational ? 'stroke-width="2.5"' : 'stroke-width="1.5"';
    let inner = '';
    if (techStatus === 'precommercial') {
      inner = `<path d="M16 9l2.5 5 5.5.8-4 3.9.9 5.5L16 22l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" fill="white" fill-opacity="0.6"/>`;
    } else if (techStatus === 'licensed') {
      inner = `<circle cx="16" cy="16" r="7" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    } else if (isNational) {
      inner = `<circle cx="16" cy="16" r="3.5" fill="white"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size+8}" viewBox="0 0 32 40">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 10 16 24 16 24s16-14 16-24C32 7.2 24.8 0 16 0z" fill="${color}" ${sw} stroke="white"/>
      <circle cx="16" cy="16" r="7.5" fill="white" fill-opacity="0.3"/>
      ${inner}
    </svg>`;
    return L.divIcon({
      html: svg, className: '',
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
      popupAnchor: [0, -(size + 8)]
    });
  }

  function projectIcon() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 9 14 22 14 22S28 23 28 14C28 6.3 21.7 0 14 0z" fill="#1e3a5f" stroke="white" stroke-width="1.5"/>
      <path d="M14 8l1.8 3.6 4 .6-2.9 2.8.7 4L14 17.1l-3.6 1.9.7-4L8.2 12.2l4-.6z" fill="white"/>
    </svg>`;
    return L.divIcon({
      html: svg, className: '',
      iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -36]
    });
  }

  /* ── Popup HTML ────────────────────────────────────────── */
  function buildPopupHtml(m) {
    const gwp = bestGwp(m);
    const color = gwpColor(gwp, S.material);

    const covBadge = m.coverage === 'national'
      ? `<span class="badge national">National</span>`
      : `<span class="badge regional">${m.serviceRegion || 'Regional'}</span>`;
    const techBadge = m.technologyStatus
      ? `<span class="badge tech-${m.technologyStatus}">${techLabel(m.technologyStatus)}</span>` : '';
    const distHtml = m.distanceMi != null
      ? `<span style="font-size:10px;color:#9ca3af;margin-left:6px">${Math.round(m.distanceMi)} mi</span>` : '';

    const hqNote = m.coverage !== 'national'
      ? `<div class="popup-note">&#9733; Map pin: ${m.hq.label}</div>`
      : `<div class="popup-note">Map pin: company HQ/primary location &mdash; contact manufacturer for nearest plant</div>`;

    const rows = m.products.map(p => {
      const pGwp = p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate;
      const pColor = gwpColor(pGwp, m.type);
      const gwpTag = p.gwpVerified != null
        ? `<span class="gwp-tag" style="background:${pColor}20;color:${pColor};border:1px solid ${pColor}40">${p.gwpLabel}</span>`
        : pGwp != null
          ? `<span class="gwp-tag estimate" style="background:${pColor}15;color:${pColor};border:1px dashed ${pColor}60" title="${p.gwpEstimateNote || ''}">~${pGwp} ${p.gwpUnit} (est.)</span>`
          : `<span class="gwp-tag nodata">No GWP data found</span>`;

      const epdBtn = p.epdUrl
        ? `<a href="${p.epdUrl}" target="_blank" rel="noopener" class="epd-btn view">View EPD</a>`
        : p.epdInfoUrl
          ? `<a href="${p.epdInfoUrl}" target="_blank" rel="noopener" class="epd-btn info">${p.epdAvailable ? 'EPD Info' : 'Mfr Info'}</a>`
          : '';
      const redBadge = p.reductionClaim && p.reductionClaim !== 'No data found'
        ? `<span class="reduction-badge">${p.reductionClaim}</span>` : '';
      const costInfo = p.costPremium && p.costPremium !== 'No data found'
        ? `<div class="cost-tag">+${p.costPremium}</div>` : '';
      const ec3Lnk = p.ec3Searchable
        ? `<a href="https://www.buildingtransparency.org/" target="_blank" rel="noopener" class="epd-btn ec3">EC3</a>` : '';

      return `<tr>
        <td class="p-name"><strong>${p.name}</strong><br><small>${p.description || ''}</small></td>
        <td>${gwpTag}</td>
        <td>${redBadge}</td>
        <td class="p-actions">${epdBtn}${ec3Lnk}${costInfo}</td>
      </tr>`;
    }).join('');

    const inCmp = S.comparison.some(c => c.id === m.id);
    const srcs = (m.sources || []).map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join(' &middot; ');

    return `<div class="popup-inner">
      <div class="popup-header" style="border-left:4px solid ${color}">
        <div>
          <div class="popup-company">${m.company}${distHtml}</div>
          <div class="popup-line">${m.productLine}</div>
          ${covBadge}${techBadge}
        </div>
        <button id="cmp-${m.id}" class="cmp-btn ${inCmp ? 'active' : ''}">
          ${inCmp ? '&#10003; In Compare' : '+ Compare'}
        </button>
      </div>
      <div class="popup-scroll">
        <p class="popup-about">${m.about}</p>
        ${hqNote}
        <table class="popup-products">
          <thead><tr>
            <th>Product</th><th>GWP (A1-A3)</th><th>CO&#8322; Reduction</th><th>Resources</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="popup-footer">
        <div class="popup-sources">Sources: ${srcs}</div>
        <div class="popup-links">
          <a href="${m.contactUrl}" target="_blank" rel="noopener">Contact</a>
          ${m.plantLocatorUrl ? `&middot; <a href="${m.plantLocatorUrl}" target="_blank" rel="noopener">Find Plant</a>` : ''}
          &middot; <a href="${m.ec3SearchUrl}" target="_blank" rel="noopener">EC3</a>
          &middot; <a href="https://www.nrmca.org/association-resources/sustainability/environmental-product-declarations/epd-ready-mix-usa-materials-lookup/" target="_blank" rel="noopener">NRMCA</a>
        </div>
      </div>
    </div>`;
  }

  function techLabel(s) {
    if (s === 'precommercial') return '&#9879; Pre-Commercial';
    if (s === 'licensed') return '&#8853; Licensed Tech';
    if (s === 'emerging') return '&#9711; Emerging';
    return s;
  }

  /* ══════════════════════════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════════════════════════ */
  function renderSidebar() {
    if (!S.results.length) {
      const msg = S.mode === 'gwp-target'
        ? `No manufacturers found that can produce ${S.material} at &le;&nbsp;${S.gwpTarget}&nbsp;${GWP_CONFIG[S.material].unit}. Try raising the GWP target.`
        : `No manufacturers found. Try increasing the radius or switching materials.`;
      dom.resultList.innerHTML = `<div class="empty-state">${msg}</div>`;
      return;
    }

    dom.resultList.innerHTML = S.results.map(m => {
      const gwp = bestGwp(m);
      const color = gwpColor(gwp, S.material);
      const unit = GWP_CONFIG[S.material].unit;
      const isEst = gwp != null && bestGwpVerified(m) == null;
      const epdCnt = m.products.filter(p => p.epdAvailable).length;
      const inCmp = S.comparison.some(c => c.id === m.id);

      const covBadge = m.coverage === 'national'
        ? '<span class="sbadge nat">National</span>'
        : `<span class="sbadge reg">${(m.serviceStates || []).slice(0, 3).join(', ')}${(m.serviceStates || []).length > 3 ? '&hellip;' : ''}</span>`;
      const techBadge = m.technologyStatus
        ? `<span class="sbadge tech-${m.technologyStatus}">${techLabel(m.technologyStatus)}</span>` : '';
      const distBadge = m.distanceMi != null
        ? `<span class="sbadge dist">${Math.round(m.distanceMi)} mi</span>` : '';

      return `<div class="result-card" data-id="${m.id}">
        <div class="rc-left" style="border-left:3px solid ${color}">
          <div class="rc-company">${m.company}</div>
          <div class="rc-line">${m.productLine}</div>
          <div>${covBadge}${techBadge}${distBadge}</div>
        </div>
        <div class="rc-right">
          <div class="rc-gwp" style="color:${color}">
            ${gwp != null
              ? `<strong>${gwp}</strong><small>&nbsp;${unit.replace('kg CO₂e/', '')}${isEst ? ' est.' : ''}</small>`
              : '<span class="nd">&mdash;</span>'}
          </div>
          <div class="rc-epd">${epdCnt} EPD${epdCnt !== 1 ? 's' : ''}</div>
          <div class="rc-actions">
            <button class="rc-view" data-id="${m.id}">Details</button>
            <button class="rc-cmp ${inCmp ? 'active' : ''}" data-id="${m.id}">${inCmp ? '&#10003;' : '+'}</button>
          </div>
        </div>
      </div>`;
    }).join('');

    dom.resultList.querySelectorAll('.rc-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = S.results.find(r => r.id === btn.dataset.id);
        if (!m) return;
        const mk = S.markers.find(x => x.id === m.id);
        if (mk) {
          S.map.setView([m.hq.lat, m.hq.lng], Math.max(S.map.getZoom(), 8));
          mk.layer.openPopup();
          // Collapse sidebar on mobile to show map
          if (S.isMobile) dom.sidebar.classList.add('collapsed');
        }
      });
    });

    dom.resultList.querySelectorAll('.rc-cmp').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = S.results.find(r => r.id === btn.dataset.id);
        if (m) toggleComparison(m);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     PRODUCT DROPDOWN
  ══════════════════════════════════════════════════════════ */
  function updateProductDropdown() {
    const all = getAllManufacturers();
    const products = [...new Map(
      all.flatMap(m => m.products).map(p => [p.id, p])
    ).values()];
    const opts = `<option value="all">All Products</option>` +
      products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    if (dom.productSel) dom.productSel.innerHTML = opts;
    if (dom.productSelM) dom.productSelM.innerHTML = opts;
    S.productFilter = 'all';
  }

  /* ══════════════════════════════════════════════════════════
     COMPARISON PANEL
  ══════════════════════════════════════════════════════════ */
  function toggleComparison(m) {
    const idx = S.comparison.findIndex(c => c.id === m.id);
    if (idx >= 0) {
      S.comparison.splice(idx, 1);
    } else {
      if (S.comparison.length >= 4) {
        setStatus('Comparison limited to 4. Remove one first.', 'warn');
        return;
      }
      S.comparison.push(m);
    }
    renderComparison();
    renderMarkers();
    renderSidebar();
  }

  function clearComparison() {
    S.comparison = [];
    renderComparison();
    renderMarkers();
    renderSidebar();
  }

  function renderComparison() {
    if (!S.comparison.length) { dom.comparePanel.classList.remove('open'); return; }
    dom.comparePanel.classList.add('open');

    const cfg = GWP_CONFIG[S.material];
    const hdrs = S.comparison.map(m => {
      const c = gwpColor(bestGwp(m), S.material);
      return `<th style="border-top:3px solid ${c}"><div class="cth-co">${m.company}</div><div class="cth-pl">${m.productLine}</div></th>`;
    }).join('');

    const rows = [
      { label: 'Coverage',   fn: m => m.coverage === 'national' ? 'National' : (m.serviceRegion || '&mdash;') },
      { label: 'Tech Status',fn: m => m.technologyStatus ? techLabel(m.technologyStatus) : 'Commercial' },
      { label: `Best GWP`,   fn: m => { const g = bestGwp(m); const v = bestGwpVerified(m);
          return g != null ? `<strong>${g}</strong> <small>${cfg.unit}</small>${v == null ? ' <small>(est.)</small>' : ''}` : '<span class="nd">No data</span>'; }},
      { label: `vs Benchmark (${cfg.benchmarkValue})`, fn: m => {
          const g = bestGwp(m); if (!g) return '<span class="nd">&mdash;</span>';
          const p = Math.round((1 - g / cfg.benchmarkValue) * 100);
          return `<span style="color:${p >= 0 ? '#16a34a' : '#dc2626'}">${p >= 0 ? '&#8595;' : '&#8593;'}${Math.abs(p)}%</span>`; }},
      { label: 'EPDs', fn: m => { const n = m.products.filter(p => p.epdAvailable).length;
          return n ? `<span style="color:#16a34a">Yes (${n})</span>` : '<span class="nd">No data</span>'; }},
      { label: 'Plant Count', fn: m => m.plantCount || '&mdash;' },
      { label: 'Plant Locator', fn: m => m.plantLocatorUrl
          ? `<a href="${m.plantLocatorUrl}" target="_blank" rel="noopener">Find &rarr;</a>` : '&mdash;' }
    ].map(r =>
      `<tr><td class="ctr-label">${r.label}</td>${S.comparison.map(m => `<td>${r.fn(m)}</td>`).join('')}</tr>`
    ).join('');

    const prods = [...new Set(S.comparison.flatMap(m => m.products.map(p => p.name)))];
    const prodRows = prods.map(pname => {
      const cells = S.comparison.map(m => {
        const p = m.products.find(x => x.name === pname);
        if (!p) return '<td class="nd">&mdash;</td>';
        const g = p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate;
        const c = gwpColor(g, S.material);
        return `<td>${g != null ? `<span style="color:${c};font-weight:600">${g}</span><small>${p.gwpVerified != null ? '' : ' est.'}</small>` : '<span class="nd">—</span>'}
          ${p.epdUrl ? `<br><a href="${p.epdUrl}" target="_blank" rel="noopener" style="font-size:10px">View EPD</a>` : ''}
          ${p.epdAvailable && !p.epdUrl ? `<br><a href="${p.epdInfoUrl || m.ec3SearchUrl}" target="_blank" rel="noopener" style="font-size:10px">EPD Info</a>` : ''}
        </td>`;
      }).join('');
      return `<tr><td class="ctr-label">${pname}</td>${cells}</tr>`;
    }).join('');

    dom.compareTable.innerHTML = `
      <colgroup><col style="width:150px">${S.comparison.map(() => '<col>').join('')}</colgroup>
      <thead><tr><th>Criteria</th>${hdrs}</tr></thead>
      <tbody>
        ${rows}
        <tr class="section-head"><td colspan="${S.comparison.length + 1}">GWP by Product — ${cfg.unit}</td></tr>
        ${prodRows}
      </tbody>`;
  }

  /* ══════════════════════════════════════════════════════════
     LEGEND
  ══════════════════════════════════════════════════════════ */
  function renderLegend() {
    const cfg = GWP_CONFIG[S.material];
    const targetRow = S.mode === 'gwp-target'
      ? `<div class="leg-target">Target: &le; ${S.gwpTarget} ${cfg.unit}</div>` : '';
    dom.legend.innerHTML = `
      <div class="leg-title">GWP (A1&ndash;A3) &middot; ${cfg.unit}</div>
      ${cfg.colorScale.map(cs =>
        `<div class="leg-row"><span class="leg-swatch" style="background:${cs.color}"></span><span>${cs.label}</span></div>`
      ).join('')}
      ${targetRow}
      <div class="leg-est">&#9675; dashed = estimate &nbsp;&#9879; = pre-commercial</div>
      <div class="leg-bench">Benchmark: ${cfg.benchmarkValue} (${cfg.benchmarkLabel})</div>`;
  }

  /* ══════════════════════════════════════════════════════════
     COMMUNITY DATABASE
  ══════════════════════════════════════════════════════════ */
  async function loadManufacturers() {
    try {
      const res = await fetch('/api/manufacturers');
      if (res.ok) {
        const payload = await res.json();
        if (payload && Array.isArray(payload.manufacturers) && payload.manufacturers.length > 0) {
          // Split by type and store in S.manufacturers, replacing the static file
          S.manufacturers = { concrete: [], steel: [] };
          for (const m of payload.manufacturers) {
            if (S.manufacturers[m.type]) S.manufacturers[m.type].push(m);
          }
          updateProductDropdown();
          return;
        }
      }
    } catch { /* API not available — fall through to static fallback */ }

    // Fallback: static data/manufacturers.js + data/database.json
    S.manufacturers = null;
    try {
      const res = await fetch('data/database.json');
      if (res.ok) {
        const db = await res.json();
        if (db && Array.isArray(db.manufacturers)) {
          S.communityData = db.manufacturers.filter(m => m.status === 'approved');
        }
      }
    } catch { /* database.json missing — fine */ }
    updateProductDropdown();
  }

  /* ══════════════════════════════════════════════════════════
     EC3 INTEGRATION
  ══════════════════════════════════════════════════════════ */
  function saveEc3Key() {
    S.ec3ApiKey = dom.ec3KeyInput.value.trim();
    dom.ec3Modal.classList.remove('show');
    if (S.ec3ApiKey) {
      dom.ec3Btn.classList.add('active');
      setStatus('EC3 API key saved. Live data will be included on next search.');
    } else {
      dom.ec3Btn.classList.remove('active');
    }
  }

  async function fetchEC3Data() {
    if (!S.ec3ApiKey || !S.center) return;
    setStatus('Fetching live data from EC3…');
    try {
      const category = S.material === 'concrete' ? 'ReadyMixConcrete' : 'StructuralSteel';
      const url = `https://buildingtransparency.org/api/materials/plants/public?` +
        new URLSearchParams({ category, page_size: 100 });
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${S.ec3ApiKey}`, 'Accept': 'application/json' }
      });
      if (!res.ok) { setStatus(`EC3 API error ${res.status}. Using curated data only.`, 'warn'); return; }
      const data = await res.json();
      if (data && data.results) {
        mergeEC3Results(data.results);
        setStatus(`Showing ${S.results.length} results (curated + EC3 live data).`);
      }
    } catch {
      setStatus('EC3 fetch failed. Using curated data only.', 'warn');
    }
  }

  function mergeEC3Results(plants) {
    const cfg = GWP_CONFIG[S.material];
    plants.forEach(plant => {
      if (!plant.latitude || !plant.longitude) return;
      const dist = haversine(S.center.lat, S.center.lng, plant.latitude, plant.longitude);
      if (dist > S.radiusMiles * 1.5) return;
      const exists = S.results.some(r => r.company.toLowerCase().includes((plant.plant_name || '').toLowerCase().slice(0, 6)));
      if (exists) return;
      const gwpVal = plant.gwp_A1A3 ?? null;
      S.results.push({
        id: `ec3-${plant.id || Math.random()}`,
        company: plant.plant_name || 'Unknown Plant (EC3)',
        productLine: plant.category || S.material,
        type: S.material,
        coverage: 'local',
        serviceRegion: plant.address || 'No data found',
        plantCount: '1',
        hq: { lat: plant.latitude, lng: plant.longitude, label: plant.address || 'See EC3' },
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
          ec3Searchable: true, costBase: 'No data found', costPremium: 'No data found', costNote: 'Contact plant'
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
    const vals = m.products.map(p => p.gwpVerified != null ? p.gwpVerified : p.gwpEstimate).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
  }

  function bestGwpVerified(m) {
    const vals = m.products.map(p => p.gwpVerified).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
  }

  function gwpColor(gwp, material) {
    if (gwp == null) return '#9ca3af';
    if (gwp <= 0) return '#15803d';
    const scale = GWP_CONFIG[material].colorScale;
    for (const s of scale) { if (gwp <= s.max) return s.color; }
    return '#ef4444';
  }

  function setStatus(msg, type = 'info') {
    dom.statusBar.textContent = msg;
    dom.statusBar.className = `status-bar ${type}`;
  }

  function getZoomForRadius(miles) {
    if (miles <= 25) return 10;
    if (miles <= 50) return 9;
    if (miles <= 100) return 8;
    if (miles <= 200) return 7;
    return 6;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
