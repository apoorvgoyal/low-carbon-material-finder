// data/manufacturers.js
// Curated low-carbon material manufacturer database — USA
//
// Data sourced exclusively from publicly available manufacturer websites,
// published EPDs, NRMCA EPD lookup, EC3, and peer-reviewed benchmarks.
// "No data found" = public information is not available for that field.
// GWP estimates (marked gwpEstimate) are calculated from manufacturer
// reduction claims vs. NRMCA industry-average baseline — NOT verified EPD values.
//
// References:
//   Concrete baseline: NRMCA Industry-Average EPD v3.2 (Mar 2022)
//     ~232 kg CO₂e/m³ @ 3000 psi  ·  ~265 kg CO₂e/m³ @ 4000 psi
//   Steel baseline: World Steel Association, avg BOF ~1,800 kg CO₂e/t
//
// Last reviewed: May 2025

'use strict';

window.MANUFACTURERS = {

  /* ══════════════════════════ CONCRETE ══════════════════════════ */
  concrete: [

    {
      id: 'holcim-ecopact',
      company: 'Holcim US',
      productLine: 'ECOPact',
      type: 'concrete',
      coverage: 'national',        // 'national' | 'regional' | 'local'
      serviceStates: null,         // null = all 50 states
      serviceRegion: 'National — ~350 ready-mix plants across North America',
      plantCount: '~350 in North America',
      hq: { lat: 34.0754, lng: -84.2941, label: 'Alpharetta, GA (Company HQ)' },
      plantLocatorUrl: 'https://www.holcim.com/en-us/find-a-plant',
      logoColor: '#e31837',
      about: 'Holcim US operates one of the largest ready-mix concrete networks in the US. ECOPact is their branded low-carbon concrete with three CO₂ reduction tiers. Carbon reduction is measured against an equivalent-strength NRMCA industry-average mix. EPDs are plant-specific and available on request.',
      products: [
        {
          id: 'ecopact-silver',
          name: 'ECOPact Silver',
          description: '≥30% CO₂ reduction vs NRMCA industry average',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 172,
          gwpEstimateNote: 'Est. max ≈172 kg CO₂e/m³ (≥30% below NRMCA ~245 kg CO₂e/m³ @ 4000 psi)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥30% vs NRMCA industry average',
          epdAvailable: true,
          epdNote: 'Plant-specific EPDs available on request from local Holcim plant',
          epdUrl: null,
          epdInfoUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local Holcim plant for pricing'
        },
        {
          id: 'ecopact-gold',
          name: 'ECOPact Gold',
          description: '≥50% CO₂ reduction vs NRMCA industry average',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 122,
          gwpEstimateNote: 'Est. max ≈122 kg CO₂e/m³ (≥50% below NRMCA ~245 kg CO₂e/m³ @ 4000 psi)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥50% vs NRMCA industry average',
          epdAvailable: true,
          epdNote: 'Plant-specific EPDs available on request from local Holcim plant',
          epdUrl: null,
          epdInfoUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local Holcim plant for pricing'
        },
        {
          id: 'ecopact-platinum',
          name: 'ECOPact Platinum',
          description: '≥70% CO₂ reduction vs NRMCA industry average',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 74,
          gwpEstimateNote: 'Est. max ≈74 kg CO₂e/m³ (≥70% below NRMCA ~245 kg CO₂e/m³ @ 4000 psi)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥70% vs NRMCA industry average',
          epdAvailable: true,
          epdNote: 'Plant-specific EPDs available on request from local Holcim plant',
          epdUrl: null,
          epdInfoUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local Holcim plant for pricing'
        }
      ],
      sources: [
        { label: 'Holcim ECOPact Product Page', url: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete' }
      ],
      contactUrl: 'https://www.holcim.com/en-us/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'cemex-vertua',
      company: 'CEMEX USA',
      productLine: 'Vertua',
      type: 'concrete',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National',
      plantCount: 'No data found',
      hq: { lat: 29.7604, lng: -95.3698, label: 'Houston, TX (Company HQ)' },
      plantLocatorUrl: 'https://www.cemexusa.com/find-us',
      logoColor: '#0055a5',
      about: 'CEMEX USA offers Vertua, a family of low-carbon concrete products. Vertua achieves CO₂ reduction through clinker substitution, SCM blending, and admixture optimization. EPDs are available through EC3 and the CEMEX website.',
      products: [
        {
          id: 'vertua-classic',
          name: 'Vertua Classic',
          description: '≥30% CO₂ reduction',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 172,
          gwpEstimateNote: 'Est. max ≈172 kg CO₂e/m³ (≥30% CO₂ reduction per CEMEX)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥30% CO₂ reduction vs conventional',
          epdAvailable: true,
          epdNote: 'EPDs available via EC3 and CEMEX website',
          epdUrl: null,
          epdInfoUrl: 'https://www.cemexusa.com/products-and-services/ready-mix-concrete/vertua',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CEMEX for pricing'
        },
        {
          id: 'vertua-plus',
          name: 'Vertua Plus',
          description: '≥50% CO₂ reduction',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 122,
          gwpEstimateNote: 'Est. max ≈122 kg CO₂e/m³ (≥50% CO₂ reduction per CEMEX)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥50% CO₂ reduction vs conventional',
          epdAvailable: true,
          epdNote: 'EPDs available via EC3 and CEMEX website',
          epdUrl: null,
          epdInfoUrl: 'https://www.cemexusa.com/products-and-services/ready-mix-concrete/vertua',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CEMEX for pricing'
        },
        {
          id: 'vertua-ultra',
          name: 'Vertua Ultra',
          description: '≥70% CO₂ reduction',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 74,
          gwpEstimateNote: 'Est. max ≈74 kg CO₂e/m³ (≥70% CO₂ reduction per CEMEX)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥70% CO₂ reduction vs conventional',
          epdAvailable: true,
          epdNote: 'EPDs available via EC3 and CEMEX website',
          epdUrl: null,
          epdInfoUrl: 'https://www.cemexusa.com/products-and-services/ready-mix-concrete/vertua',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CEMEX for pricing'
        }
      ],
      sources: [
        { label: 'CEMEX Vertua Product Page', url: 'https://www.cemexusa.com/products-and-services/ready-mix-concrete/vertua' }
      ],
      contactUrl: 'https://www.cemexusa.com/contact-us',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'heidelberg-evobuild',
      company: 'Heidelberg Materials North America',
      productLine: 'EvoBuild / EcoCemPLC',
      type: 'concrete',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National (formerly Lehigh Hanson)',
      plantCount: 'No data found',
      hq: { lat: 32.8141, lng: -96.9489, label: 'Irving, TX (Company HQ)' },
      plantLocatorUrl: 'https://www.heidelbergmaterials.us/home/contact',
      logoColor: '#005baa',
      about: 'Heidelberg Materials North America (formerly Lehigh Hanson) is one of the largest integrated cement and ready-mix producers in North America. They publish plant-specific EPDs using the North American PCR. EvoBuild is their low-carbon ready-mix line; EcoCemPLC is a Portland Limestone Cement (ASTM C595) reducing clinker content.',
      products: [
        {
          id: 'evobuild',
          name: 'EvoBuild Low Carbon Concrete',
          description: '10–40% CO₂ reduction below OPC baseline',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 185,
          gwpEstimateNote: 'Est. range ≈147–221 kg CO₂e/m³ (10–40% below OPC baseline of ~245 kg CO₂e/m³)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '10–40% below OPC baseline',
          epdAvailable: true,
          epdNote: 'Plant-specific EPDs published using North American PCR',
          epdUrl: null,
          epdInfoUrl: 'https://www.heidelbergmaterials.us/home/sustainability/epds',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Heidelberg Materials for pricing'
        },
        {
          id: 'ecocemplc',
          name: 'EcoCemPLC (Portland Limestone Cement)',
          description: '~10% CO₂ reduction vs standard OPC — drop-in replacement',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 221,
          gwpEstimateNote: 'Est. ≈221 kg CO₂e/m³ (~10% below OPC baseline of ~245 kg CO₂e/m³)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '~10% below standard OPC (inter-ground limestone, ASTM C595)',
          epdAvailable: true,
          epdNote: 'EPDs available through heidelbergmaterials.us/sustainability/epds',
          epdUrl: null,
          epdInfoUrl: 'https://www.heidelbergmaterials.us/home/sustainability/epds',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Heidelberg Materials for pricing'
        }
      ],
      sources: [
        { label: 'Heidelberg Materials EPD Portal', url: 'https://www.heidelbergmaterials.us/home/sustainability/epds' },
        { label: 'Heidelberg Sustainability', url: 'https://www.heidelbergmaterials.us/home/sustainability' }
      ],
      contactUrl: 'https://www.heidelbergmaterials.us/home/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'calportland-advancement',
      company: 'CalPortland',
      productLine: 'ADVANCEMENT™ PLC',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['CA', 'WA', 'OR', 'AZ', 'NV', 'ID'],
      serviceRegion: 'Western US — CA, WA, OR, AZ, NV, ID',
      plantCount: '12 facilities with published EPDs',
      hq: { lat: 34.1425, lng: -118.2551, label: 'Glendale, CA (Company HQ)' },
      plantLocatorUrl: 'https://www.calportland.com/contact-us',
      logoColor: '#003087',
      about: 'CalPortland is one of the largest cement and ready-mix producers in the Western US. They publish EPDs for 30 ready-mixed concrete products across 12 facilities. ADVANCEMENT PLC uses inter-ground Portland Limestone Cement per ASTM C595, reducing clinker content 5–15%.',
      products: [
        {
          id: 'advancement-plc',
          name: 'ADVANCEMENT™ PLC',
          description: 'Portland Limestone Cement — 5–15% CO₂ reduction vs standard OPC',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 215,
          gwpEstimateNote: 'Est. 5–15% below OPC baseline; specific values in published EPDs (see WA EPD link)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '5–15% below standard OPC (inter-ground limestone, ASTM C595)',
          epdAvailable: true,
          epdNote: 'Published EPDs — 30 products across 12 Western US facilities',
          epdUrl: 'https://www.calportland.com/wp-content/uploads/2019/07/Calportland-WA-EPD-06172019.pdf',
          epdInfoUrl: 'https://www.calportland.com/sustainability',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CalPortland for pricing'
        }
      ],
      sources: [
        { label: 'CalPortland WA EPD (PDF)', url: 'https://www.calportland.com/wp-content/uploads/2019/07/Calportland-WA-EPD-06172019.pdf' },
        { label: 'NRMCA EPD Lookup', url: 'https://www.nrmca.org/association-resources/sustainability/environmental-product-declarations/epd-ready-mix-usa-materials-lookup/' }
      ],
      contactUrl: 'https://www.calportland.com/contact-us',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'crh-americas',
      company: 'CRH Americas Materials',
      productLine: 'Low-Carbon Ready Mix (SCM-optimized)',
      type: 'concrete',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National',
      plantCount: 'No data found',
      hq: { lat: 33.7490, lng: -84.3880, label: 'Atlanta, GA (Company HQ)' },
      plantLocatorUrl: 'https://www.crhamericasmaterials.com/contact',
      logoColor: '#00833e',
      about: 'CRH Americas is one of the two largest ready-mix producers in North America. Their low-carbon approach focuses on optimized SCM substitution rates using fly ash, slag, and silica fume to minimize GWP per cubic yard.',
      products: [
        {
          id: 'crh-low-carbon',
          name: 'Low-Carbon Ready Mix (SCM-optimized)',
          description: 'Mix designs optimized with supplementary cementitious materials',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'No data found',
          epdAvailable: false,
          epdNote: 'No data found — contact CRH plant for EPD availability',
          epdUrl: null,
          epdInfoUrl: 'https://www.crhamericasmaterials.com/products-and-services/ready-mixed-concrete',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CRH Americas for pricing'
        }
      ],
      sources: [
        { label: 'CRH Americas Ready Mix', url: 'https://www.crhamericasmaterials.com/products-and-services/ready-mixed-concrete' }
      ],
      contactUrl: 'https://www.crhamericasmaterials.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'argos-usa',
      company: 'Argos USA',
      productLine: 'Low-Carbon Concrete',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['GA', 'FL', 'SC', 'NC', 'VA', 'MD', 'DC', 'PA', 'AL', 'MS', 'TN', 'TX'],
      serviceRegion: 'Southeast, Mid-Atlantic, parts of South',
      plantCount: 'No data found',
      hq: { lat: 34.0760, lng: -84.2947, label: 'Alpharetta, GA (US HQ)' },
      plantLocatorUrl: 'https://www.argosusa.com/contact/',
      logoColor: '#d4232b',
      about: 'Argos USA (subsidiary of Cementos Argos, Colombia) operates cement plants and ready-mix operations primarily in the Southeast and Mid-Atlantic US. They participate in the NRMCA EPD program and publish plant-specific EPDs.',
      products: [
        {
          id: 'argos-low-carbon',
          name: 'Argos Low-Carbon Ready Mix',
          description: 'SCM-optimized mix designs; EPD status varies by plant',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'No data found',
          epdAvailable: false,
          epdNote: 'No data found — check EC3 or contact Argos for EPD availability',
          epdUrl: null,
          epdInfoUrl: 'https://www.argosusa.com/sustainability/',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Argos USA for pricing'
        }
      ],
      sources: [
        { label: 'Argos USA Sustainability', url: 'https://www.argosusa.com/sustainability/' }
      ],
      contactUrl: 'https://www.argosusa.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'martin-marietta',
      company: 'Martin Marietta',
      productLine: 'Ready Mix Concrete',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['TX', 'CO', 'NC', 'SC', 'GA', 'FL', 'MD', 'IA', 'SD', 'NE', 'KS', 'MO', 'OK', 'LA'],
      serviceRegion: 'Southeast, South-Central, Mid-Atlantic, Midwest',
      plantCount: 'No data found',
      hq: { lat: 35.7796, lng: -78.6382, label: 'Raleigh, NC (Company HQ)' },
      plantLocatorUrl: 'https://www.martinmarietta.com/contact/',
      logoColor: '#1f4e79',
      about: 'Martin Marietta is a leading US producer of aggregates, cement, ready mix, and asphalt. Ready-mix operations span Southeast, South-Central, and Midwest states. Low-carbon concrete options may be available — contact local plant for EPD status.',
      products: [
        {
          id: 'mm-ready-mix',
          name: 'Ready Mix Concrete',
          description: 'Standard and custom mix designs; contact plant for low-carbon options',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'No data found',
          epdAvailable: false,
          epdNote: 'No data found — contact Martin Marietta plant for EPD availability',
          epdUrl: null,
          epdInfoUrl: 'https://www.martinmarietta.com/products/ready-mixed-concrete/',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Martin Marietta for pricing'
        }
      ],
      sources: [
        { label: 'Martin Marietta Ready Mix', url: 'https://www.martinmarietta.com/products/ready-mixed-concrete/' }
      ],
      contactUrl: 'https://www.martinmarietta.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'thomas-concrete',
      company: 'Thomas Concrete',
      productLine: 'Thomas Green™',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['GA', 'SC', 'NC', 'FL', 'AL'],
      serviceRegion: 'Southeast US',
      plantCount: 'No data found',
      hq: { lat: 34.0234, lng: -84.6155, label: 'Kennesaw, GA (Company HQ)' },
      plantLocatorUrl: 'https://thomasconcrete.com/contact/',
      logoColor: '#2d6a2d',
      about: 'Thomas Concrete is a ready-mix producer serving the Southeast US with a focus on sustainable concrete. Their Thomas Green™ initiative offers reduced-carbon concrete through supplementary cementitious material (SCM) substitution.',
      products: [
        {
          id: 'thomas-green',
          name: 'Thomas Green™ (Low-Carbon SCM Mix)',
          description: 'Low-carbon mix using supplementary cementitious materials',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'No data found',
          epdAvailable: false,
          epdNote: 'No data found — contact Thomas Concrete for EPD availability',
          epdUrl: null,
          epdInfoUrl: 'https://thomasconcrete.com/sustainability/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Thomas Concrete for pricing'
        }
      ],
      sources: [
        { label: 'Thomas Concrete Sustainability', url: 'https://thomasconcrete.com/sustainability/' }
      ],
      contactUrl: 'https://thomasconcrete.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    /* ─── Emerging & Licensed Technologies ─────────────────── */

    {
      id: 'carboncure',
      company: 'CarbonCure Technologies',
      productLine: 'CO₂ Mineralization (Licensed)',
      type: 'concrete',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National — 400+ licensed ready-mix plants in North America',
      plantCount: '400+ licensed plants in NA',
      technologyStatus: 'licensed',
      hq: { lat: 44.6488, lng: -63.5752, label: 'Halifax, NS (HQ) · Licensed plants nationwide — see Carbon Map' },
      plantLocatorUrl: 'https://carbonmap.carboncure.com/',
      logoColor: '#2d9e3a',
      about: 'CarbonCure licenses CO₂ mineralization technology to 400+ ready-mix plants across North America. Recycled industrial CO₂ is injected during mixing and permanently mineralizes as calcium carbonate (CaCO₃), reducing carbon footprint 4–8% per batch while improving strength. Use the CarbonCure Carbon Map to find a licensed plant near you.',
      products: [
        {
          id: 'carboncure-mix',
          name: 'CarbonCure Ready Mix (Licensed Technology)',
          description: '4–8% CO₂ reduction per batch via CO₂ mineralization injection',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 225,
          gwpEstimateNote: 'Est. ~225 kg CO₂e/m³ based on 4–8% reduction from ~245 NRMCA baseline. Actual GWP depends on mix design — contact licensed plant for EPD.',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '4–8% CO₂ reduction via permanent CO₂ mineralization',
          epdAvailable: true,
          epdNote: 'Plant-specific EPDs available from licensed plants via EC3',
          epdUrl: null,
          epdInfoUrl: 'https://www.carboncure.com/product-epdx',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact licensed plant for pricing'
        }
      ],
      sources: [
        { label: 'CarbonCure Carbon Map', url: 'https://carbonmap.carboncure.com/' },
        { label: 'CarbonCure EPD Program', url: 'https://www.carboncure.com/product-epdx' }
      ],
      contactUrl: 'https://www.carboncure.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'solidia',
      company: 'Solidia Technologies',
      productLine: 'Solidia Cement and Concrete',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['NJ', 'NY', 'PA', 'CT', 'MA', 'DE', 'MD', 'VA', 'NC', 'OH', 'IN', 'IL', 'TX', 'GA', 'FL'],
      serviceRegion: 'Northeast, Southeast, Midwest — licensed precast partners',
      plantCount: 'Licensed precast partners (contact for locations)',
      technologyStatus: 'licensed',
      hq: { lat: 40.5532, lng: -74.4653, label: 'Piscataway, NJ (Company HQ)' },
      plantLocatorUrl: 'https://solidiatech.com/contact/',
      logoColor: '#0099cc',
      about: 'Solidia Technologies (Piscataway, NJ) produces calcium silicate cement requiring 30% less energy than OPC, generating 30% fewer CO₂ emissions. Cured with captured CO₂ instead of water, the concrete absorbs additional CO₂ during curing, achieving up to 70% total lifecycle reduction. Precast products only — CO₂ curing chambers required.',
      products: [
        {
          id: 'solidia-concrete',
          name: 'Solidia Concrete (CO2-cured precast)',
          description: 'Precast panels, pavers, pipe — CO₂-cured calcium silicate binder',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 74,
          gwpEstimateNote: 'Est. 74 kg CO2e/m3 based on Solidia published 70%+ reduction claim vs NRMCA ~245 kg CO2e/m3',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'Up to 70% CO₂ reduction vs OPC (cement manufacturing + CO₂ curing)',
          epdAvailable: false,
          epdNote: 'No publicly available EPD found — contact Solidia for EPD data',
          epdUrl: null,
          epdInfoUrl: 'https://solidiatech.com/sustainability/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Solidia for pricing; precast only'
        }
      ],
      sources: [
        { label: 'Solidia Technologies', url: 'https://solidiatech.com/' },
        { label: 'Solidia Sustainability', url: 'https://solidiatech.com/sustainability/' }
      ],
      contactUrl: 'https://solidiatech.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'carbonbuilt',
      company: 'CarbonBuilt',
      productLine: 'Reversa CO2-Cured CMU Blocks',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['AL', 'CT', 'GA', 'FL', 'TN', 'MS', 'SC', 'NC', 'NY', 'NJ', 'MA'],
      serviceRegion: 'Southeast US + Connecticut',
      plantCount: '2 commercial plants (Tuscaloosa, AL and Danielson, CT)',
      technologyStatus: 'commercial',
      hq: { lat: 33.2098, lng: -87.5692, label: 'Tuscaloosa, AL (Commercial Plant)' },
      plantLocatorUrl: 'https://carbonbuilt.com/contact/',
      logoColor: '#5c2d91',
      about: 'CarbonBuilt (LA, CA HQ) operates CO₂-cured concrete masonry unit plants. Their Reversa technology uses low-calcium binder (10x less cement) cured with industrial CO₂ emissions. Commercial plants in Tuscaloosa, AL and Danielson, CT produce ASTM C90 CMU blocks with carbon-neutral to carbon-negative lifecycle emissions per measured EPDs.',
      products: [
        {
          id: 'carbonbuilt-cmu',
          name: 'Reversa CMU Block (CO2-cured)',
          description: 'ASTM C90 concrete masonry units — low-cement binder + industrial CO₂ curing',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: -50,
          gwpEstimateNote: 'CarbonBuilt measured EPDs show net-negative GWP (net CO2 sequestration). Specific values not publicly available — contact CarbonBuilt.',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'Carbon-neutral to carbon-negative (net CO₂ sequestration per measured EPDs)',
          epdAvailable: true,
          epdNote: 'Measured EPDs available — contact CarbonBuilt for documentation',
          epdUrl: null,
          epdInfoUrl: 'https://carbonbuilt.com/technology/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CarbonBuilt for pricing'
        }
      ],
      sources: [
        { label: 'CarbonBuilt Technology', url: 'https://carbonbuilt.com/technology/' },
        { label: 'CarbonBuilt Projects', url: 'https://carbonbuilt.com/projects/' }
      ],
      contactUrl: 'https://carbonbuilt.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'carbicrete',
      company: 'CarbiCrete',
      productLine: 'Steel Slag + CO2 CMU (Zero Cement)',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['PA', 'OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'NY', 'NJ', 'MA', 'MD', 'VA', 'WV'],
      serviceRegion: 'Northeast & Midwest — US licensing in progress near steel mills',
      plantCount: 'US licensing in progress — contact for locations',
      technologyStatus: 'licensed',
      hq: { lat: 45.5017, lng: -73.5673, label: 'Montreal, QC (HQ) — US licensing underway' },
      plantLocatorUrl: 'https://carbicrete.com/contact/',
      logoColor: '#2563eb',
      about: 'CarbiCrete (Montreal) replaces cement with steel slag binder and cures CMU blocks with captured CO₂, permanently sequestering it. No cement is used — slag (a steel industry byproduct) is the sole binder. Published EPD shows negative GWP. 90%+ carbon reduction vs OPC CMU. US licensing to precast/CMU producers near steel mills is underway.',
      products: [
        {
          id: 'carbicrete-cmu',
          name: 'CarbiCrete CMU Block (slag + CO2, zero cement)',
          description: 'ASTM C90 CMU blocks — zero-cement steel slag binder + CO₂ curing',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: -100,
          gwpEstimateNote: 'Published EPD shows negative GWP (net CO2 sequestration). Specific value varies by plant. 90%+ reduction vs OPC concrete.',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '90%+ vs OPC concrete + net CO₂ sequestration (published EPD)',
          epdAvailable: true,
          epdNote: 'Published EPD available — contact CarbiCrete',
          epdUrl: null,
          epdInfoUrl: 'https://carbicrete.com/sustainability/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CarbiCrete for US licensing / pricing'
        }
      ],
      sources: [
        { label: 'CarbiCrete Technology', url: 'https://carbicrete.com/technology/' },
        { label: 'CarbiCrete Sustainability', url: 'https://carbicrete.com/sustainability/' }
      ],
      contactUrl: 'https://carbicrete.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'brimstone',
      company: 'Brimstone',
      productLine: 'Carbon-Neutral Portland Cement (Pre-Commercial)',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['CA', 'NV', 'OR', 'WA', 'AZ'],
      serviceRegion: 'Western US (Oakland, CA — pilot stage)',
      plantCount: 'Pilot scale — not yet commercially available',
      technologyStatus: 'precommercial',
      hq: { lat: 37.8044, lng: -122.2711, label: 'Oakland, CA (Company HQ — pilot stage)' },
      plantLocatorUrl: 'https://www.brimstone.com/',
      logoColor: '#f59e0b',
      about: 'Brimstone (Oakland, CA) produces Portland cement from calcium silicate rocks instead of limestone, eliminating process CO₂ emissions. The resulting cement meets ASTM C150 specs with claimed net-zero carbon. A byproduct magnesium silicate can further sequester CO₂. Currently at pilot scale; commercial production expected 2026-2027. Not yet commercially available.',
      products: [
        {
          id: 'brimstone-cement',
          name: 'Carbon-Neutral Portland Cement (ASTM C150)',
          description: 'Net-zero Portland cement from calcium silicate rocks — pilot scale 2025',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 0,
          gwpEstimateNote: 'Brimstone claims net-zero carbon Portland cement per ASTM C150. No published EPD yet — pilot stage. Not commercially available as of 2025.',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: 'Net-zero carbon Portland cement (zero process CO₂ + renewable energy)',
          epdAvailable: false,
          epdNote: 'No EPD available — pilot stage. Commercial launch expected 2026-2027.',
          epdUrl: null,
          epdInfoUrl: 'https://www.brimstone.com/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Not commercially available yet — contact for updates'
        }
      ],
      sources: [
        { label: 'Brimstone Website', url: 'https://www.brimstone.com/' }
      ],
      contactUrl: 'https://www.brimstone.com/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'sublime-systems',
      company: 'Sublime Systems',
      productLine: 'Electrochemical Low-Carbon Cement (Pre-Commercial)',
      type: 'concrete',
      coverage: 'regional',
      serviceStates: ['MA', 'CT', 'RI', 'NH', 'VT', 'ME', 'NY', 'NJ'],
      serviceRegion: 'Northeast US (Somerville, MA — demo scale)',
      plantCount: 'Demo scale — Somerville, MA facility',
      technologyStatus: 'precommercial',
      hq: { lat: 42.3876, lng: -71.0995, label: 'Somerville, MA (Company HQ — demo scale)' },
      plantLocatorUrl: 'https://www.sublime.systems/',
      logoColor: '#7c3aed',
      about: 'Sublime Systems (Somerville, MA) uses an electrochemical process to produce low-carbon cement without burning fossil fuels. Only electricity and common minerals required. Claims 90%+ CO₂ reduction vs OPC. Currently at demo scale; commercial production targeted 2026+. Backed by ARPA-E, DOE, and private investors.',
      products: [
        {
          id: 'sublime-cement',
          name: 'Sublime Cement (Electrochemical)',
          description: 'Electrochemical cement — 90%+ CO₂ reduction vs OPC — demo scale',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 25,
          gwpEstimateNote: 'Est. ~25 kg CO2e/m3 based on 90%+ reduction vs ~245 NRMCA baseline. No published EPD — demo stage.',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '90%+ CO₂ reduction vs OPC (electrochemical process + renewable electricity)',
          epdAvailable: false,
          epdNote: 'No EPD available — demo scale. Commercial launch expected 2026+.',
          epdUrl: null,
          epdInfoUrl: 'https://www.sublime.systems/technology',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Not commercially available yet — contact for updates'
        }
      ],
      sources: [
        { label: 'Sublime Systems Technology', url: 'https://www.sublime.systems/technology' },
        { label: 'Sublime Systems', url: 'https://www.sublime.systems/' }
      ],
      contactUrl: 'https://www.sublime.systems/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    }

  ],

  /* ══════════════════════════ STEEL ══════════════════════════ */
  steel: [

    {
      id: 'nucor',
      company: 'Nucor Corporation',
      productLine: 'Econiq™ / Standard EAF Steel',
      type: 'steel',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National — 28 steel mills + fabrication across US',
      plantCount: '28 steel mills across US',
      hq: { lat: 35.2271, lng: -80.8431, label: 'Charlotte, NC (Company HQ)' },
      plantLocatorUrl: 'https://nucor.com/locations',
      logoColor: '#009f4d',
      about: 'Nucor is the largest steel producer in the US by volume. All steel is produced via Electric Arc Furnace (EAF) using an average of 75%+ recycled scrap. Nucor publishes 20+ plant-specific EPDs covering nearly 100% of steelmaking facilities. Econiq™ is their net-zero carbon steel using 100% renewable energy.',
      products: [
        {
          id: 'nucor-econiq',
          name: 'Econiq™ (Net-Zero Carbon Steel)',
          description: 'EAF + 100% renewable electricity = net-zero Scope 1+2 CO₂',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 0,
          gwpEstimateNote: 'Marketed as net-zero CO₂e Scope 1+2; Scope 3 not included in net-zero claim. Contact Nucor for EPD.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: 'Net-zero Scope 1+2 emissions (100% renewable electricity)',
          epdAvailable: true,
          epdNote: 'Contact Nucor for Econiq-specific EPD',
          epdUrl: null,
          epdInfoUrl: 'https://nucor.com/econiq',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Nucor for Econiq pricing'
        },
        {
          id: 'nucor-standard-eaf',
          name: 'Standard EAF Steel (Structural, Rebar, Sheet, Plate)',
          description: '75%+ recycled scrap; 20+ plant EPDs published',
          gwpVerified: 770,
          gwpLabel: '~770 kg CO₂e/metric ton (Scopes 1+2+3)',
          gwpEstimate: 770,
          gwpEstimateNote: 'Source: Nucor 2023 Sustainability Report — includes Scopes 1, 2, and 3 combined',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~57% below BOF global avg (~1,800 kg CO₂e/t) — all scopes',
          epdAvailable: true,
          epdNote: '20+ published plant-specific EPDs; Hot-rolled sheet EPD linked',
          epdUrl: 'https://pcr-epd.s3.us-east-2.amazonaws.com/921.Nucor_EPD_Hot_Rolled_Sheet_sv3.00.pdf',
          epdInfoUrl: 'https://nucor.com/sustainability',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Nucor for pricing'
        }
      ],
      sources: [
        { label: 'Nucor Econiq™', url: 'https://nucor.com/econiq' },
        { label: 'Nucor Hot-Rolled Sheet EPD', url: 'https://pcr-epd.s3.us-east-2.amazonaws.com/921.Nucor_EPD_Hot_Rolled_Sheet_sv3.00.pdf' },
        { label: 'Nucor Sustainability 2023', url: 'https://nucor.com/sustainability' }
      ],
      contactUrl: 'https://nucor.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'big-river-steel',
      company: 'Big River Steel (U.S. Steel)',
      productLine: 'Flex Mill® EAF Steel',
      type: 'steel',
      coverage: 'regional',
      serviceStates: ['AR', 'TN', 'MS', 'MO', 'KY', 'IL', 'IN', 'OH', 'MI', 'TX', 'OK', 'LA', 'AL'],
      serviceRegion: 'Southeast, Midwest, South-Central US',
      plantCount: '1 Flex Mill® plant (Osceola, AR)',
      hq: { lat: 35.6918, lng: -89.9626, label: 'Osceola, AR (Flex Mill® Plant — specific location)' },
      plantLocatorUrl: 'https://www.bigriversteel.com/contact/',
      logoColor: '#e63c2f',
      about: 'Big River Steel (acquired by U.S. Steel 2021) operates a state-of-the-art Flex Mill® Electric Arc Furnace facility in Osceola, Arkansas. The plant uses up to 90% recycled scrap per heat and has published an EPD for hot-rolled steel coil per ASTM standards. This marker reflects the actual plant location.',
      products: [
        {
          id: 'brs-hot-rolled-coil',
          name: 'Hot-Rolled Steel Coil (EAF)',
          description: 'Up to 90% recycled scrap; ASTM-grade flat-rolled, AHSS available',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 500,
          gwpEstimateNote: 'EPD published for A1-A3; specific GWP value is in the EPD document. EAF typical range: 400–700 kg CO₂e/t.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~60–75% below BOF global avg (~1,800 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'Published EPD — Hot-Rolled Steel Coil, ASTM basis, modules A1-A3',
          epdUrl: 'https://pcr-epd.s3.us-east-2.amazonaws.com/982.Hot_Rolled_Steel_Coil_EPD_ASTM_v4.0.pdf',
          epdInfoUrl: 'https://www.bigriversteel.com/sustainability/',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Big River Steel / U.S. Steel for pricing'
        }
      ],
      sources: [
        { label: 'Big River Steel Hot-Rolled Coil EPD (PDF)', url: 'https://pcr-epd.s3.us-east-2.amazonaws.com/982.Hot_Rolled_Steel_Coil_EPD_ASTM_v4.0.pdf' },
        { label: 'Big River Steel Sustainability', url: 'https://www.bigriversteel.com/sustainability/' }
      ],
      contactUrl: 'https://www.bigriversteel.com/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'arcelormittal-xcarbr',
      company: 'ArcelorMittal USA',
      productLine: 'XCarb®',
      type: 'steel',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National (primary mills: Burns Harbor IN, Cleveland OH, Indiana Harbor IN)',
      plantCount: 'Multiple US facilities',
      hq: { lat: 41.6220, lng: -87.1386, label: 'Burns Harbor, IN (Primary US mill)' },
      plantLocatorUrl: 'https://constructalia.arcelormittal.com/en/contact',
      logoColor: '#003087',
      about: 'ArcelorMittal is one of the world\'s largest steel producers. XCarb® covers steel produced with increasing proportions of recycled content and renewable energy. North American sections are supplied from EAF mills using recycled scrap. Multiple EPDs published through their EPD library.',
      products: [
        {
          id: 'xcarbr-sections',
          name: 'XCarb® Structural Sections & Beams',
          description: 'Wide-flange, channels, angles — ASTM A992, A36; EAF + renewable energy',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 450,
          gwpEstimateNote: 'ArcelorMittal claims "up to 75% less CO₂" vs BOF avg ~1,800 kg CO₂e/t → est. ≤450 kg CO₂e/t for XCarb',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: 'Up to 75% vs conventional BOF steel',
          epdAvailable: true,
          epdNote: 'Multiple EPDs through ArcelorMittal EPD library',
          epdUrl: null,
          epdInfoUrl: 'https://industry.arcelormittal.com/sustainability/sustainable-steel/EPDs',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact ArcelorMittal for pricing'
        },
        {
          id: 'xcarbr-plate',
          name: 'XCarb® Plate & Flat-Rolled',
          description: 'Plate, hot-rolled coil; structural and industrial applications',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 450,
          gwpEstimateNote: 'Same XCarb claim (up to 75% below BOF); specific values in published EPDs',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: 'Up to 75% vs conventional BOF steel',
          epdAvailable: true,
          epdNote: 'EPDs available in ArcelorMittal library',
          epdUrl: null,
          epdInfoUrl: 'https://industry.arcelormittal.com/sustainability/sustainable-steel/EPDs',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact ArcelorMittal for pricing'
        }
      ],
      sources: [
        { label: 'ArcelorMittal EPD Library', url: 'https://industry.arcelormittal.com/sustainability/sustainable-steel/EPDs' },
        { label: 'XCarb® Program', url: 'https://corporate.arcelormittal.com/climate-action/low-carbon-emissions-steel-standard/' }
      ],
      contactUrl: 'https://constructalia.arcelormittal.com/en/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'steel-dynamics',
      company: 'Steel Dynamics (SDI)',
      productLine: 'EAF Long & Flat Products',
      type: 'steel',
      coverage: 'regional',
      serviceStates: ['IN', 'OH', 'MI', 'IL', 'WI', 'MN', 'TX', 'AZ', 'CO', 'UT', 'NM', 'OK', 'KS'],
      serviceRegion: 'Midwest, Southwest',
      plantCount: 'Multiple US EAF facilities',
      hq: { lat: 41.1306, lng: -85.1285, label: 'Fort Wayne, IN (Company HQ)' },
      plantLocatorUrl: 'https://www.steeldynamics.com/contact',
      logoColor: '#1e3a8a',
      about: 'Steel Dynamics is one of the largest domestic EAF steel producers in the US. All production uses 100% recycled scrap feedstock, resulting in significantly lower embodied carbon than BOF steel. They operate multiple flat-roll and long-product divisions.',
      products: [
        {
          id: 'sdi-eaf-steel',
          name: 'EAF Structural Steel, Flat Roll & Long Products',
          description: '100% recycled scrap; structural shapes, flat-roll, merchant bar, SBQ',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 600,
          gwpEstimateNote: 'EAF with 100% scrap typical range estimate: 400–700 kg CO₂e/t. EPD status: No data found.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~55–75% below BOF global avg (~1,800 kg CO₂e/t) — estimate',
          epdAvailable: false,
          epdNote: 'No data found',
          epdUrl: null,
          epdInfoUrl: 'https://www.steeldynamics.com/sustainability',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Steel Dynamics for pricing'
        }
      ],
      sources: [
        { label: 'Steel Dynamics Sustainability', url: 'https://www.steeldynamics.com/sustainability' }
      ],
      contactUrl: 'https://www.steeldynamics.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'commercial-metals',
      company: 'Commercial Metals Company (CMC)',
      productLine: 'EAF Rebar & Long Products',
      type: 'steel',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National — multiple EAF mills',
      plantCount: 'Multiple US EAF mills',
      hq: { lat: 32.8141, lng: -96.9489, label: 'Irving, TX (Company HQ)' },
      plantLocatorUrl: 'https://www.cmc.com/contact',
      logoColor: '#c8102e',
      about: 'CMC is a major US EAF steel producer specializing in rebar, merchant bar, and long products for construction. All US production uses 100% recycled scrap feedstock via EAF.',
      products: [
        {
          id: 'cmc-rebar-long',
          name: 'EAF Rebar & Merchant Bar',
          description: 'Rebar (ASTM A615, A706), merchant bar, angles — 100% recycled scrap',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 600,
          gwpEstimateNote: 'EAF typical range estimate: 400–700 kg CO₂e/t. EPD status: No data found.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~55–75% below BOF global avg — estimate',
          epdAvailable: false,
          epdNote: 'No data found',
          epdUrl: null,
          epdInfoUrl: 'https://www.cmc.com/sustainability',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact CMC for pricing'
        }
      ],
      sources: [
        { label: 'CMC Sustainability', url: 'https://www.cmc.com/sustainability' }
      ],
      contactUrl: 'https://www.cmc.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'gerdau-na',
      company: 'Gerdau Long Steel North America',
      productLine: 'EAF Long Products',
      type: 'steel',
      coverage: 'national',
      serviceStates: null,
      serviceRegion: 'National — multiple EAF mills across US',
      plantCount: 'Multiple US EAF facilities',
      hq: { lat: 27.9506, lng: -82.4572, label: 'Tampa, FL (North America HQ)' },
      plantLocatorUrl: 'https://www.gerdau.com/en/contact',
      logoColor: '#f77f00',
      about: 'Gerdau is a major global EAF steel producer with multiple US operations focused on long products. All US production uses EAF technology with recycled scrap. They serve construction markets with rebar, structural shapes, and special bar quality steel.',
      products: [
        {
          id: 'gerdau-long-products',
          name: 'EAF Long Products (Rebar, Structural, SBQ)',
          description: 'Rebar, structural shapes, special bar quality — EAF + recycled scrap',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 600,
          gwpEstimateNote: 'EAF typical range estimate: 400–700 kg CO₂e/t. EPD status: No data found.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~55–75% below BOF global avg — estimate',
          epdAvailable: false,
          epdNote: 'No data found',
          epdUrl: null,
          epdInfoUrl: 'https://www.gerdau.com/en/sustainability',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Gerdau for pricing'
        }
      ],
      sources: [
        { label: 'Gerdau Sustainability', url: 'https://www.gerdau.com/en/sustainability' }
      ],
      contactUrl: 'https://www.gerdau.com/en/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    }

  ]
};

/* ── GWP color scales & benchmarks ──────────────────────────────────── */
window.GWP_CONFIG = {
  concrete: {
    unit: 'kg CO₂e/m³',
    benchmarkLabel: 'NRMCA Industry Avg (4000 psi)',
    benchmarkValue: 265,
    benchmarkSource: 'NRMCA Industry-Average EPD v3.2 (March 2022)',
    colorScale: [
      { max: 100,      label: '< 100',      color: '#15803d' },
      { max: 150,      label: '100 – 150',  color: '#22c55e' },
      { max: 200,      label: '150 – 200',  color: '#84cc16' },
      { max: 250,      label: '200 – 250',  color: '#facc15' },
      { max: 300,      label: '250 – 300',  color: '#f97316' },
      { max: Infinity, label: '> 300',      color: '#ef4444' }
    ]
  },
  steel: {
    unit: 'kg CO₂e/metric ton',
    benchmarkLabel: 'BOF Global Avg (World Steel Assoc.)',
    benchmarkValue: 1800,
    benchmarkSource: 'World Steel Association average BOF steel ~1,800 kg CO₂e/t',
    colorScale: [
      { max: 200,      label: '< 200',          color: '#15803d' },
      { max: 500,      label: '200 – 500',      color: '#22c55e' },
      { max: 800,      label: '500 – 800',      color: '#84cc16' },
      { max: 1100,     label: '800 – 1,100',    color: '#facc15' },
      { max: 1500,     label: '1,100 – 1,500',  color: '#f97316' },
      { max: Infinity, label: '> 1,500',        color: '#ef4444' }
    ]
  }
};

/* ── US state centroids for regional filtering ───────────────────────── */
window.STATE_CENTROIDS = {
  AL:{lat:32.81,lng:-86.79},AK:{lat:61.37,lng:-152.40},AZ:{lat:33.73,lng:-111.43},
  AR:{lat:34.97,lng:-92.37},CA:{lat:36.12,lng:-119.68},CO:{lat:39.06,lng:-105.31},
  CT:{lat:41.60,lng:-72.76},DE:{lat:39.32,lng:-75.51},FL:{lat:27.77,lng:-81.69},
  GA:{lat:32.16,lng:-82.91},HI:{lat:19.90,lng:-155.67},ID:{lat:44.24,lng:-114.48},
  IL:{lat:40.35,lng:-88.99},IN:{lat:39.85,lng:-86.26},IA:{lat:42.01,lng:-93.21},
  KS:{lat:38.53,lng:-96.73},KY:{lat:37.67,lng:-84.67},LA:{lat:31.17,lng:-91.87},
  ME:{lat:44.69,lng:-69.38},MD:{lat:39.06,lng:-76.80},MA:{lat:42.23,lng:-71.53},
  MI:{lat:43.33,lng:-84.54},MN:{lat:45.69,lng:-93.90},MS:{lat:32.74,lng:-89.68},
  MO:{lat:38.46,lng:-92.29},MT:{lat:46.92,lng:-110.45},NE:{lat:41.13,lng:-98.27},
  NV:{lat:38.31,lng:-117.06},NH:{lat:43.45,lng:-71.56},NJ:{lat:40.30,lng:-74.52},
  NM:{lat:34.84,lng:-106.25},NY:{lat:42.17,lng:-74.95},NC:{lat:35.63,lng:-79.81},
  ND:{lat:47.53,lng:-99.78},OH:{lat:40.39,lng:-82.76},OK:{lat:35.57,lng:-96.93},
  OR:{lat:44.57,lng:-122.07},PA:{lat:40.59,lng:-77.21},RI:{lat:41.68,lng:-71.51},
  SC:{lat:33.86,lng:-80.95},SD:{lat:44.30,lng:-99.44},TN:{lat:35.75,lng:-86.69},
  TX:{lat:31.05,lng:-97.56},UT:{lat:40.15,lng:-111.86},VT:{lat:44.05,lng:-72.71},
  VA:{lat:37.77,lng:-78.17},WA:{lat:47.40,lng:-121.49},WV:{lat:38.49,lng:-80.95},
  WI:{lat:44.27,lng:-89.62},WY:{lat:42.76,lng:-107.30},DC:{lat:38.90,lng:-77.03}
};
