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
    center: null,       // { lat, lng }
    userState: null,    // 2-letter state code
    material: 'concrete',
    radiusMiles: 100,
    productFilter: 'all',
    sortBy: 'name',
    results: [],        // filtered manufacturers
    comparison: [],     // selected for comparison (max 4)
    ec3ApiKey: null
  };

  /* ── DOM refs ──────────────────────────────────────────────── */
  let dom = {};

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    // Cache DOM
    dom = {
      map:           document.getElementById('map'),
      zipInput:      document.getElementById('zip-input'),
      searchBtn:     document.getElementById('search-btn'),
      materialBtns:  document.querySelectorAll('.mat-btn'),
      radiusSlider:  document.getElementById('radius-slider'),
      radiusLabel:   document.getElementById('radius-label'),
      productSel:    document.getElementById('product-sel'),
      resultCount:   document.getElementById('result-count'),
      resultList:    document.getElementById('result-list'),
      sortSel:       document.getElementById('sort-sel'),
      statusBar:     document.getElementById('status-bar'),
      comparePanel:  document.getElementById('compare-panel'),
      compareClear:  document.getElementById('compare-clear'),
      compareTable:  document.getElementById('compare-table'),
      ec3Btn:        document.getElementById('ec3-btn'),
      ec3Modal:      document.getElementById('ec3-modal'),
      ec3KeyInput:   document.getElementById('ec3-key-input'),
      ec3SaveBtn:    document.getElementById('ec3-save-btn'),
      ec3CloseBtn:   document.getElementById('ec3-close-btn'),
      legend:        document.getElementById('gwp-legend'),
      sidebar:       document.getElementById('sidebar'),
      sidebarToggle: document.getElementById('sidebar-toggle')
    };

    initMap();
    bindEvents();
    renderLegend();
    updateProductDropdown();
    setStatus('Enter a US ZIP code and click Search to find nearby manufacturers.');
  }

  /* ── Map setup ─────────────────────────────────────────────── */
  function initMap() {
    S.map = L.map('map', { zoomControl: false }).setView([38.5, -96.0], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(S.map);

    L.control.zoom({ position: 'bottomright' }).addTo(S.map);
  }

  /* ── Events ────────────────────────────────────────────────── */
  function bindEvents() {
    dom.searchBtn.addEventListener('click', onSearch);
    dom.zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') onSearch(); });

    dom.materialBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.materialBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        S.material = btn.dataset.mat;
        updateProductDropdown();
        renderLegend();
        if (S.center) runFilter();
      });
    });

    dom.radiusSlider.addEventListener('input', () => {
      S.radiusMiles = +dom.radiusSlider.value;
      dom.radiusLabel.textContent = S.radiusMiles + ' mi';
      if (S.center) { drawRadiusCircle(); runFilter(); }
    });

    dom.productSel.addEventListener('change', () => {
      S.productFilter = dom.productSel.value;
      if (S.center) runFilter();
    });

    dom.sortSel.addEventListener('change', () => {
      S.sortBy = dom.sortSel.value;
      if (S.center) runFilter();
    });

    dom.compareClear.addEventListener('click', clearComparison);

    dom.ec3Btn.addEventListener('click', () => dom.ec3Modal.classList.add('show'));
    dom.ec3CloseBtn.addEventListener('click', () => dom.ec3Modal.classList.remove('show'));
    dom.ec3SaveBtn.addEventListener('click', saveEc3Key);
    dom.ec3Modal.addEventListener('click', e => { if (e.target === dom.ec3Modal) dom.ec3Modal.classList.remove('show'); });

    dom.sidebarToggle.addEventListener('click', () => dom.sidebar.classList.toggle('collapsed'));
  }

  /* ══════════════════════════════════════════════════════════
     SEARCH & GEOCODING
  ══════════════════════════════════════════════════════════ */
  async function onSearch() {
    const zip = dom.zipInput.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      setStatus('Please enter a valid 5-digit US ZIP code.', 'error');
      return;
    }

    setStatus('Geocoding ZIP code…');
    dom.searchBtn.disabled = true;

    try {
      const { lat, lng, state, displayName } = await geocodeZip(zip);
      S.center = { lat, lng };
      S.userState = state;

      S.map.setView([lat, lng], getZoomForRadius(S.radiusMiles));
      drawRadiusCircle();

      // Drop project pin
      if (S.projectPin) S.map.removeLayer(S.projectPin);
      S.projectPin = L.marker([lat, lng], { icon: projectIcon(), zIndexOffset: 1000 })
        .bindTooltip(`<strong>Project location</strong><br>${displayName}`, { permanent: false })
        .addTo(S.map);

      setStatus(`Showing manufacturers for ${displayName}`);
      runFilter();

      // Optionally also fetch EC3 live data
      if (S.ec3ApiKey) fetchEC3Data();

    } catch (err) {
      setStatus(err.message || 'Failed to geocode ZIP code.', 'error');
    } finally {
      dom.searchBtn.disabled = false;
    }
  }

  async function geocodeZip(zip) {
    const url = `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({ postalcode: zip, country: 'US', format: 'json', addressdetails: 1, limit: 1 });

    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error('Nominatim geocoding failed. Check your connection.');
    const data = await res.json();
    if (!data.length) throw new Error(`ZIP code ${zip} not found.`);

    const item = data[0];
    const addr = item.address || {};
    const state = addr.state ? stateNameToAbbr(addr.state) : null;
    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      state,
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

  function stateNameToAbbr(name) { return STATE_MAP[name] || null; }

  /* ══════════════════════════════════════════════════════════
     FILTERING & SORTING
  ══════════════════════════════════════════════════════════ */
  function runFilter() {
    if (!S.center) return;
    const all = (MANUFACTURERS[S.material] || []);

    S.results = all
      .filter(m => matchesMaterial(m) && matchesRegion(m) && matchesProduct(m))
      .map(m => ({
        ...m,
        distanceMi: haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng)
      }))
      .sort(sorter());

    renderMarkers();
    renderSidebar();
  }

  function matchesMaterial(m) { return m.type === S.material; }

  function matchesRegion(m) {
    if (m.coverage === 'national') return true;
    if (!S.userState) return true; // no state info, include all
    if (m.serviceStates && m.serviceStates.includes(S.userState)) return true;
    // Also include if HQ is within 2× radius as fallback
    const d = haversine(S.center.lat, S.center.lng, m.hq.lat, m.hq.lng);
    return d <= S.radiusMiles * 2;
  }

  function matchesProduct(m) {
    if (S.productFilter === 'all') return true;
    return m.products.some(p => p.id === S.productFilter);
  }

  function sorter() {
    return (a, b) => {
      if (S.sortBy === 'gwp') {
        const ga = bestGwp(a) ?? Infinity;
        const gb = bestGwp(b) ?? Infinity;
        return ga - gb;
      }
      if (S.sortBy === 'distance') return a.distanceMi - b.distanceMi;
      if (S.sortBy === 'name') return a.company.localeCompare(b.company);
      return 0;
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
      const icon = mfrIcon(color, m.coverage === 'national');

      const layer = L.marker([m.hq.lat, m.hq.lng], { icon })
        .bindPopup(buildPopupHtml(m), {
          maxWidth: 420,
          minWidth: 320,
          className: 'lcmf-popup'
        })
        .addTo(S.map);

      layer.on('popupopen', () => {
        // Wire compare button inside popup
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
      color: '#4a6fa5',
      weight: 1.5,
      fillColor: '#4a6fa5',
      fillOpacity: 0.06
    }).addTo(S.map);
  }

  /* ── Icons ─────────────────────────────────────────────── */
  function mfrIcon(color, isNational) {
    const size = isNational ? 32 : 26;
    const ring = isNational ? 'stroke-width="2.5"' : 'stroke-width="1.5"';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size+8}" viewBox="0 0 32 40">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 10 16 24 16 24s16-14 16-24C32 7.2 24.8 0 16 0z" fill="${color}" ${ring} stroke="white"/>
      <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.35"/>
      ${isNational ? '<circle cx="16" cy="16" r="3" fill="white"/>' : ''}
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
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
      html: svg,
      className: '',
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -36]
    });
  }

  /* ── Popup HTML ────────────────────────────────────────── */
  function buildPopupHtml(m) {
    const gwp = bestGwp(m);
    const color = gwpColor(gwp, S.material);
    const distLabel = m.coverage === 'national'
      ? `<span class="badge national">National coverage</span>`
      : `<span class="badge regional">${m.serviceRegion}</span>`;

    const hqNote = m.coverage === 'regional' && m.plantCount !== 'No data found'
      ? `<div class="popup-note">★ Map pin shows ${m.hq.label}</div>`
      : `<div class="popup-note">Map pin shows company HQ — contact manufacturer for nearest plant</div>`;

    const productsHtml = m.products.map(p => {
      const pGwp = p.gwpVerified ?? p.gwpEstimate;
      const pColor = gwpColor(pGwp, m.type);
      const gwpDisplay = p.gwpLabel !== 'No data found' && p.gwpVerified != null
        ? `<span class="gwp-tag" style="background:${pColor}20;color:${pColor};border:1px solid ${pColor}40">${p.gwpLabel}</span>`
        : p.gwpEstimate != null
          ? `<span class="gwp-tag estimate" style="background:${pColor}15;color:${pColor};border:1px dashed ${pColor}60" title="${p.gwpEstimateNote}">~${p.gwpEstimate} ${p.gwpUnit} (est.)</span>`
          : `<span class="gwp-tag nodata">No GWP data found</span>`;

      const epdBtn = p.epdUrl
        ? `<a href="${p.epdUrl}" target="_blank" rel="noopener" class="epd-btn view">View EPD</a>`
        : p.epdInfoUrl
          ? `<a href="${p.epdInfoUrl}" target="_blank" rel="noopener" class="epd-btn info">${p.epdAvailable ? 'EPD Info' : 'Manufacturer Info'}</a>`
          : '';

      const reductionBadge = p.reductionClaim && p.reductionClaim !== 'No data found'
        ? `<span class="reduction-badge">${p.reductionClaim}</span>` : '';

      const costInfo = p.costPremium && p.costPremium !== 'No data found'
        ? `<span class="cost-tag">Cost premium: ${p.costPremium}</span>` : '';

      const ec3Link = p.ec3Searchable
        ? `<a href="https://www.buildingtransparency.org/" target="_blank" rel="noopener" class="epd-btn ec3">Search EC3</a>` : '';

      return `<tr>
        <td class="p-name"><strong>${p.name}</strong><br><small>${p.description || ''}</small></td>
        <td>${gwpDisplay}</td>
        <td>${reductionBadge}</td>
        <td class="p-actions">${epdBtn}${ec3Link}${costInfo ? `<br>${costInfo}` : ''}</td>
      </tr>`;
    }).join('');

    const inCmp = S.comparison.some(c => c.id === m.id);
    const sourceLinks = m.sources.map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`
    ).join(' · ');

    return `<div class="popup-inner">
      <div class="popup-header" style="border-left:4px solid ${color}">
        <div>
          <div class="popup-company">${m.company}</div>
          <div class="popup-line">${m.productLine}</div>
          ${distLabel}
        </div>
        <button id="cmp-${m.id}" class="cmp-btn ${inCmp ? 'active' : ''}" title="Add to comparison">
          ${inCmp ? '✓ In Comparison' : '+ Compare'}
        </button>
      </div>

      <p class="popup-about">${m.about}</p>
      ${hqNote}

      <table class="popup-products">
        <thead><tr>
          <th>Product</th><th>GWP (A1-A3)</th><th>CO₂ Reduction</th><th>Resources</th>
        </tr></thead>
        <tbody>${productsHtml}</tbody>
      </table>

      <div class="popup-footer">
        <div class="popup-sources">Sources: ${sourceLinks}</div>
        <div class="popup-links">
          <a href="${m.contactUrl}" target="_blank" rel="noopener">Contact Manufacturer</a>
          ${m.plantLocatorUrl ? `· <a href="${m.plantLocatorUrl}" target="_blank" rel="noopener">Find Plant</a>` : ''}
          · <a href="${m.ec3SearchUrl}" target="_blank" rel="noopener">Search EC3</a>
          · <a href="https://www.nrmca.org/association-resources/sustainability/environmental-product-declarations/epd-ready-mix-usa-materials-lookup/" target="_blank" rel="noopener">NRMCA EPD Lookup</a>
        </div>
      </div>
    </div>`;
  }

  /* ══════════════════════════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════════════════════════ */
  function renderSidebar() {
    if (!S.results.length) {
      dom.resultList.innerHTML = '<div class="empty-state">No manufacturers found for this region and material. Try increasing the radius or switching materials.</div>';
      return;
    }

    dom.resultList.innerHTML = S.results.map(m => {
      const gwp = bestGwp(m);
      const color = gwpColor(gwp, S.material);
      const gwpText = gwp != null ? `${gwp} ${GWP_CONFIG[S.material].unit}` : 'No GWP data';
      const gwpSub = gwp != null && bestGwpVerified(m) == null ? '(est.)' : '';
      const epdCount = m.products.filter(p => p.epdAvailable).length;
      const covBadge = m.coverage === 'national'
        ? '<span class="sbadge nat">National</span>'
        : `<span class="sbadge reg">${m.serviceStates ? m.serviceStates.slice(0, 4).join(', ') + (m.serviceStates.length > 4 ? '…' : '') : 'Regional'}</span>`;

      const inCmp = S.comparison.some(c => c.id === m.id);

      return `<div class="result-card" data-id="${m.id}">
        <div class="rc-left" style="border-left:3px solid ${color}">
          <div class="rc-company">${m.company}</div>
          <div class="rc-line">${m.productLine}</div>
          ${covBadge}
        </div>
        <div class="rc-right">
          <div class="rc-gwp" style="color:${color}">
            ${gwp != null ? `<strong>${gwp}</strong><small> ${GWP_CONFIG[S.material].unit.replace('kg CO₂e/', '')} ${gwpSub}</small>` : '<span class="nd">—</span>'}
          </div>
          <div class="rc-epd">${epdCount} EPD${epdCount !== 1 ? 's' : ''} avail.</div>
          <div class="rc-actions">
            <button class="rc-view" data-id="${m.id}">Details</button>
            <button class="rc-cmp ${inCmp ? 'active' : ''}" data-id="${m.id}">${inCmp ? '✓' : '+'}</button>
          </div>
        </div>
      </div>`;
    }).join('');

    // Bind sidebar card events
    dom.resultList.querySelectorAll('.rc-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = S.results.find(r => r.id === btn.dataset.id);
        if (m) {
          const marker = S.markers.find(mk => mk.id === m.id);
          if (marker) {
            S.map.setView([m.hq.lat, m.hq.lng], Math.max(S.map.getZoom(), 8));
            marker.layer.openPopup();
          }
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
     COMPARISON PANEL
  ══════════════════════════════════════════════════════════ */
  function toggleComparison(m) {
    const idx = S.comparison.findIndex(c => c.id === m.id);
    if (idx >= 0) {
      S.comparison.splice(idx, 1);
    } else {
      if (S.comparison.length >= 4) {
        setStatus('Comparison limited to 4 manufacturers. Remove one first.', 'warn');
        return;
      }
      S.comparison.push(m);
    }
    renderComparison();
    // Re-render markers + sidebar to update button states
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
    if (!S.comparison.length) {
      dom.comparePanel.classList.remove('open');
      return;
    }
    dom.comparePanel.classList.add('open');

    const cfg = GWP_CONFIG[S.material];
    const headers = S.comparison.map(m => {
      const gwp = bestGwp(m);
      const color = gwpColor(gwp, S.material);
      return `<th style="border-top:3px solid ${color}">
        <div class="cth-co">${m.company}</div>
        <div class="cth-pl">${m.productLine}</div>
      </th>`;
    }).join('');

    const rows = [
      {
        label: 'Coverage',
        fn: m => m.coverage === 'national' ? 'National' : (m.serviceRegion || '—')
      },
      {
        label: 'Best GWP (est.)',
        fn: m => {
          const g = bestGwp(m);
          const verified = bestGwpVerified(m);
          return g != null
            ? `<strong>${g}</strong> <small>${cfg.unit}</small>${verified == null ? ' <small>(est.)</small>' : ''}`
            : '<span class="nd">No data found</span>';
        }
      },
      {
        label: `vs Benchmark (${cfg.benchmarkValue} ${cfg.unit})`,
        fn: m => {
          const g = bestGwp(m);
          if (g == null) return '<span class="nd">—</span>';
          const pct = Math.round((1 - g / cfg.benchmarkValue) * 100);
          return `<span style="color:${pct >= 0 ? '#16a34a' : '#dc2626'}">${pct >= 0 ? '↓' : '↑'}${Math.abs(pct)}%</span>`;
        }
      },
      {
        label: 'EPDs Available',
        fn: m => {
          const cnt = m.products.filter(p => p.epdAvailable).length;
          return cnt > 0 ? `<span style="color:#16a34a">Yes (${cnt})</span>` : '<span class="nd">No data found</span>';
        }
      },
      {
        label: 'Plant Count',
        fn: m => m.plantCount || '—'
      },
      {
        label: 'Cost Premium',
        fn: m => {
          const cp = m.products.find(p => p.costPremium && p.costPremium !== 'No data found');
          return cp ? cp.costPremium : '<span class="nd">No data found</span>';
        }
      },
      {
        label: 'Plant Locator',
        fn: m => m.plantLocatorUrl
          ? `<a href="${m.plantLocatorUrl}" target="_blank" rel="noopener">Find Plant →</a>`
          : '—'
      }
    ];

    const rowsHtml = rows.map(r =>
      `<tr><td class="ctr-label">${r.label}</td>${S.comparison.map(m => `<td>${r.fn(m)}</td>`).join('')}</tr>`
    ).join('');

    // Per-product GWP rows
    const allProducts = [...new Set(S.comparison.flatMap(m => m.products.map(p => p.name)))];
    const productRowsHtml = allProducts.map(pname => {
      const cells = S.comparison.map(m => {
        const p = m.products.find(px => px.name === pname);
        if (!p) return '<td class="nd">—</td>';
        const g = p.gwpVerified ?? p.gwpEstimate;
        const color = gwpColor(g, S.material);
        return `<td>
          ${g != null ? `<span style="color:${color};font-weight:600">${g}</span> <small>${p.gwpVerified != null ? '' : '(est.)'}</small>` : '<span class="nd">No data</span>'}
          ${p.epdUrl ? `<br><a href="${p.epdUrl}" target="_blank" rel="noopener" style="font-size:10px">View EPD</a>` : ''}
          ${p.epdAvailable && !p.epdUrl ? `<br><a href="${p.epdInfoUrl||m.ec3SearchUrl}" target="_blank" rel="noopener" style="font-size:10px">EPD Info</a>` : ''}
        </td>`;
      }).join('');
      return `<tr><td class="ctr-label">${pname}</td>${cells}</tr>`;
    }).join('');

    dom.compareTable.innerHTML = `
      <colgroup><col style="width:160px">${S.comparison.map(() => '<col>').join('')}</colgroup>
      <thead>
        <tr><th>Criteria</th>${headers}</tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="section-head"><td colspan="${S.comparison.length + 1}">GWP by Product (A1-A3) — ${cfg.unit}</td></tr>
        ${productRowsHtml}
      </tbody>`;
  }

  /* ══════════════════════════════════════════════════════════
     LEGEND
  ══════════════════════════════════════════════════════════ */
  function renderLegend() {
    const cfg = GWP_CONFIG[S.material];
    dom.legend.innerHTML = `
      <div class="leg-title">GWP (A1–A3) · ${cfg.unit}</div>
      ${cfg.colorScale.map(cs =>
        `<div class="leg-row">
          <span class="leg-swatch" style="background:${cs.color}"></span>
          <span>${cs.label}</span>
        </div>`
      ).join('')}
      <div class="leg-est"><span>◌ dashed = estimate</span></div>
      <div class="leg-bench">Benchmark: ${cfg.benchmarkValue} (${cfg.benchmarkLabel})</div>`;
  }

  /* ══════════════════════════════════════════════════════════
     PRODUCT DROPDOWN
  ══════════════════════════════════════════════════════════ */
  function updateProductDropdown() {
    const all = MANUFACTURERS[S.material] || [];
    const products = [...new Map(
      all.flatMap(m => m.products).map(p => [p.id, p])
    ).values()];

    dom.productSel.innerHTML = `<option value="all">All Products</option>` +
      products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    S.productFilter = 'all';
  }

  /* ══════════════════════════════════════════════════════════
     EC3 INTEGRATION
  ══════════════════════════════════════════════════════════ */
  function saveEc3Key() {
    S.ec3ApiKey = dom.ec3KeyInput.value.trim();
    dom.ec3Modal.classList.remove('show');
    if (S.ec3ApiKey) {
      dom.ec3Btn.classList.add('active');
      dom.ec3Btn.title = 'EC3 API key saved — live data enabled';
      setStatus('EC3 API key saved. Results will include live plant data on next search.');
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

      if (!res.ok) {
        setStatus(`EC3 API error ${res.status}. Using curated data only.`, 'warn');
        return;
      }

      const data = await res.json();
      if (data && data.results) {
        mergeEC3Results(data.results);
        setStatus(`Showing ${S.results.length} results (curated + EC3 live data).`);
      }
    } catch (err) {
      setStatus('EC3 fetch failed. Using curated data only.', 'warn');
    }
  }

  function mergeEC3Results(ec3Plants) {
    const cfg = GWP_CONFIG[S.material];
    ec3Plants.forEach(plant => {
      if (!plant.latitude || !plant.longitude) return;
      const dist = haversine(S.center.lat, S.center.lng, plant.latitude, plant.longitude);
      if (dist > S.radiusMiles * 1.5) return;

      // Avoid duplicate if already in curated results
      const exists = S.results.some(r => r.company.toLowerCase().includes((plant.plant_name || '').toLowerCase().slice(0, 6)));
      if (exists) return;

      const gwpVal = plant.gwp_A1A3 ?? null;
      const mockM = {
        id: `ec3-${plant.id || Math.random()}`,
        company: plant.plant_name || 'Unknown Plant (EC3)',
        productLine: plant.category || S.material,
        type: S.material,
        coverage: 'local',
        serviceRegion: plant.address || 'No data found',
        plantCount: '1',
        hq: { lat: plant.latitude, lng: plant.longitude, label: plant.address || 'See EC3' },
        plantLocatorUrl: `https://www.buildingtransparency.org/`,
        logoColor: gwpColor(gwpVal, S.material),
        about: `Live data from EC3 (Building Transparency). Declared GWP: ${gwpVal != null ? gwpVal + ' ' + cfg.unit : 'No data found'}.`,
        products: [{
          id: 'ec3-product',
          name: plant.product_name || 'See EC3 for details',
          description: '',
          gwpVerified: gwpVal,
          gwpLabel: gwpVal != null ? `${gwpVal} ${cfg.unit}` : 'No data found',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: cfg.unit,
          reductionClaim: 'No data found',
          epdAvailable: !!plant.epd_url,
          epdNote: plant.epd_url ? 'EPD available via EC3' : 'No data found',
          epdUrl: plant.epd_url || null,
          epdInfoUrl: 'https://www.buildingtransparency.org/',
          ec3Searchable: true,
          costBase: 'No data found', costPremium: 'No data found', costNote: 'Contact plant'
        }],
        sources: [{ label: 'EC3 (Building Transparency)', url: 'https://www.buildingtransparency.org/' }],
        contactUrl: 'https://www.buildingtransparency.org/',
        ec3SearchUrl: 'https://www.buildingtransparency.org/',
        distanceMi: dist,
        fromEC3: true
      };
      S.results.push(mockM);
    });
    S.results.sort(sorter());
    renderMarkers();
    renderSidebar();
  }

  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 3958.8; // miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  function bestGwp(m) {
    // Return verified GWP first, then estimate; prefer lowest product value
    const vals = m.products
      .map(p => p.gwpVerified ?? p.gwpEstimate)
      .filter(v => v != null && v > 0);
    return vals.length ? Math.min(...vals) : (m.products.some(p => p.gwpEstimate === 0) ? 0 : null);
  }

  function bestGwpVerified(m) {
    const vals = m.products.map(p => p.gwpVerified).filter(v => v != null);
    return vals.length ? Math.min(...vals) : null;
  }

  function gwpColor(gwp, material) {
    if (gwp == null) return '#9ca3af';
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
