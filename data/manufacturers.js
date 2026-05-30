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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Holcim US – Atlanta Metro', lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
        { name: 'Holcim US – Charlotte', lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
        { name: 'Holcim US – Nashville', lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
        { name: 'Holcim US – Dallas-Fort Worth', lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' },
        { name: 'Holcim US – Houston', lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
        { name: 'Holcim US – Phoenix', lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
        { name: 'Holcim US – Denver', lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
        { name: 'Holcim US – Chicago', lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' },
        { name: 'Holcim US – Philadelphia', lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA' },
        { name: 'Holcim US – Seattle', lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' },
        { name: 'Holcim US – Los Angeles', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' },
        { name: 'Holcim US – Miami', lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'CEMEX USA – Houston Central', lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
        { name: 'CEMEX USA – Dallas', lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' },
        { name: 'CEMEX USA – San Antonio', lat: 29.4241, lng: -98.4936, city: 'San Antonio', state: 'TX' },
        { name: 'CEMEX USA – Phoenix', lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
        { name: 'CEMEX USA – Las Vegas', lat: 36.1699, lng: -115.1398, city: 'Las Vegas', state: 'NV' },
        { name: 'CEMEX USA – Los Angeles', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' },
        { name: 'CEMEX USA – Tampa', lat: 27.9506, lng: -82.4572, city: 'Tampa', state: 'FL' },
        { name: 'CEMEX USA – Atlanta', lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
        { name: 'CEMEX USA – Chicago', lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Heidelberg Materials – Irving, TX', lat: 32.8141, lng: -96.9489, city: 'Irving', state: 'TX' },
        { name: 'Heidelberg Materials – Seattle, WA', lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' },
        { name: 'Heidelberg Materials – Denver, CO', lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
        { name: 'Heidelberg Materials – Minneapolis, MN', lat: 44.9778, lng: -93.2650, city: 'Minneapolis', state: 'MN' },
        { name: 'Heidelberg Materials – Columbus, OH', lat: 39.9612, lng: -82.9988, city: 'Columbus', state: 'OH' },
        { name: 'Heidelberg Materials – Pittsburgh, PA', lat: 40.4406, lng: -79.9959, city: 'Pittsburgh', state: 'PA' },
        { name: 'Heidelberg Materials – Baltimore, MD', lat: 39.2904, lng: -76.6122, city: 'Baltimore', state: 'MD' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'CalPortland – Pleasanton, CA', lat: 37.6624, lng: -121.8747, city: 'Pleasanton', state: 'CA' },
        { name: 'CalPortland – Rancho Cucamonga, CA', lat: 34.1064, lng: -117.5931, city: 'Rancho Cucamonga', state: 'CA' },
        { name: 'CalPortland – Yucaipa, CA', lat: 34.0336, lng: -117.0431, city: 'Yucaipa', state: 'CA' },
        { name: 'CalPortland – Bakersfield, CA', lat: 35.3733, lng: -119.0187, city: 'Bakersfield', state: 'CA' },
        { name: 'CalPortland – Yakima, WA', lat: 46.6021, lng: -120.5059, city: 'Yakima', state: 'WA' },
        { name: 'CalPortland – Spokane, WA', lat: 47.6588, lng: -117.4260, city: 'Spokane', state: 'WA' },
        { name: 'CalPortland – Portland, OR', lat: 45.5231, lng: -122.6765, city: 'Portland', state: 'OR' },
        { name: 'CalPortland – Tucson, AZ', lat: 32.2226, lng: -110.9747, city: 'Tucson', state: 'AZ' },
        { name: 'CalPortland – Las Vegas, NV', lat: 36.1699, lng: -115.1398, city: 'Las Vegas', state: 'NV' },
        { name: 'CalPortland – Boise, ID', lat: 43.6150, lng: -116.2023, city: 'Boise', state: 'ID' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'CRH Americas – Atlanta, GA', lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
        { name: 'CRH Americas – Charlotte, NC', lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
        { name: 'CRH Americas – Dallas, TX', lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' },
        { name: 'CRH Americas – Orlando, FL', lat: 28.5383, lng: -81.3792, city: 'Orlando', state: 'FL' },
        { name: 'CRH Americas – Columbus, OH', lat: 39.9612, lng: -82.9988, city: 'Columbus', state: 'OH' },
        { name: 'CRH Americas – Indianapolis, IN', lat: 39.7684, lng: -86.1581, city: 'Indianapolis', state: 'IN' },
        { name: 'CRH Americas – Kansas City, MO', lat: 39.0997, lng: -94.5786, city: 'Kansas City', state: 'MO' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Argos USA – Alpharetta, GA (HQ)', lat: 34.0760, lng: -84.2947, city: 'Alpharetta', state: 'GA' },
        { name: 'Argos USA – Savannah, GA', lat: 32.0835, lng: -81.0998, city: 'Savannah', state: 'GA' },
        { name: 'Argos USA – Charlotte, NC', lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
        { name: 'Argos USA – Columbia, SC', lat: 33.9529, lng: -81.0662, city: 'Columbia', state: 'SC' },
        { name: 'Argos USA – Jacksonville, FL', lat: 30.3322, lng: -81.4355, city: 'Jacksonville', state: 'FL' },
        { name: 'Argos USA – Birmingham, AL', lat: 33.5186, lng: -86.8104, city: 'Birmingham', state: 'AL' },
        { name: 'Argos USA – Nashville, TN', lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
        { name: 'Argos USA – Baltimore, MD', lat: 39.2904, lng: -76.6122, city: 'Baltimore', state: 'MD' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Martin Marietta – Raleigh, NC', lat: 35.7796, lng: -78.6382, city: 'Raleigh', state: 'NC' },
        { name: 'Martin Marietta – Charlotte, NC', lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
        { name: 'Martin Marietta – Austin, TX', lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' },
        { name: 'Martin Marietta – Denver, CO', lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
        { name: 'Martin Marietta – Des Moines, IA', lat: 41.5868, lng: -93.6250, city: 'Des Moines', state: 'IA' },
        { name: 'Martin Marietta – Kansas City, MO', lat: 39.0997, lng: -94.5786, city: 'Kansas City', state: 'MO' },
        { name: 'Martin Marietta – Baltimore, MD', lat: 39.2904, lng: -76.6122, city: 'Baltimore', state: 'MD' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Thomas Concrete – Kennesaw, GA (HQ)', lat: 34.0234, lng: -84.6155, city: 'Kennesaw', state: 'GA' },
        { name: 'Thomas Concrete – Atlanta, GA', lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
        { name: 'Thomas Concrete – Birmingham, AL', lat: 33.5186, lng: -86.8104, city: 'Birmingham', state: 'AL' },
        { name: 'Thomas Concrete – Charlotte, NC', lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
        { name: 'Thomas Concrete – Jacksonville, FL', lat: 30.3322, lng: -81.4355, city: 'Jacksonville', state: 'FL' },
        { name: 'Thomas Concrete – Columbia, SC', lat: 33.9529, lng: -81.0662, city: 'Columbia', state: 'SC' }
      ]
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
    },

    /* ─── Global Concrete ───────────────────────────────────── */

    {
      id: 'holcim-ecopact-global',
      company: 'Holcim',
      productLine: 'ECOPact / ECOPlanet (Global)',
      type: 'concrete',
      coverage: 'national',
      country: 'CH',
      serviceStates: null,
      serviceRegion: 'Global — ECOPact in 30+ markets; ECOPlanet in 31 markets across Europe, Latin America, Asia-Pacific',
      plantCount: 'Global network (~350 ready-mix plants in North America alone)',
      hq: { lat: 47.166, lng: 8.515, label: 'Zug, Switzerland (Global HQ)' },
      plantLocatorUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete/ecopact',
      about: 'Holcim (Zug, Switzerland) is the world\'s largest building materials company. ECOPact is their low-carbon ready-mix concrete available in 30+ markets globally, offering tiered CO₂ reductions from 30% to net-zero. ECOPlanet is the low-carbon cement line with ≥30% CO₂ reduction vs. CEM I, available in 31 countries. Over 120 EPDs published for ECOPact in North America alone.',
      products: [
        {
          id: 'ecopact-global',
          name: 'ECOPact (Global — ≥30% CO₂ reduction)',
          description: 'Tiered low-carbon ready-mix: ECOPact ≥30%, ECOPact+ 50–70%, ECOPact Max ≥70% reduction vs. regional baseline',
          gwpVerified: 286,
          gwpLabel: '286 kg CO₂e/m³ (published EPD, example 50 MPa mix)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '30–100%+ reduction vs. regional ready-mix baseline (tiered: ECOPact/ECOPact+/ECOPact Max)',
          epdAvailable: true,
          epdNote: '120+ EPDs in North America; regional EPDs in Europe, Asia-Pacific via EPD International',
          epdUrl: null,
          epdInfoUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete/ecopact',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local Holcim plant for pricing'
        },
        {
          id: 'ecoplanet-cement',
          name: 'ECOPlanet Cement (≥30% CO₂ reduction)',
          description: 'Low-carbon cement with ≥30% fewer CO₂ emissions than standard CEM I — clinker reduction + SCMs',
          gwpVerified: null,
          gwpLabel: 'No data found (varies by plant and grade)',
          gwpEstimate: null,
          gwpEstimateNote: 'Company-wide cement net intensity: 502 kg CO₂/t cementitious (2025)',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '≥30% vs. CEM I (OPC); targeting 420 kg CO₂/t by 2030',
          epdAvailable: true,
          epdNote: 'Regional EPDs available; Holcim UK has plant-specific EPDs',
          epdUrl: null,
          epdInfoUrl: 'https://www.holcim.com/what-we-do/our-building-solutions/cement/ecoplanet',
          ec3Searchable: true,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local Holcim operation for pricing'
        }
      ],
      sources: [
        { label: 'Holcim ECOPact Global', url: 'https://www.holcim.com/what-we-do/our-building-solutions/ready-mix-concrete/ecopact' },
        { label: 'Holcim ECOPlanet', url: 'https://www.holcim.com/what-we-do/our-building-solutions/cement/ecoplanet' }
      ],
      contactUrl: 'https://www.holcim.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'heidelberg-evozero',
      company: 'Heidelberg Materials',
      productLine: 'evoZero® (Carbon Capture Cement)',
      type: 'concrete',
      coverage: 'national',
      country: 'DE',
      serviceStates: null,
      serviceRegion: 'Europe (initial deliveries 2025 from Brevik, Norway); global expansion planned',
      plantCount: '1 CCS plant operational (Brevik, Norway — 400,000 t CO₂/yr captured)',
      technologyStatus: 'commercial',
      hq: { lat: 59.026, lng: 9.706, label: 'Brevik, Norway (CCS Production Plant)' },
      plantLocatorUrl: 'https://www.evozero.com/en',
      about: 'Heidelberg Materials launched evoZero® in June 2025 — the world\'s first carbon-captured cement at commercial scale. The Brevik CCS plant in Norway captures 400,000 t CO₂/year from the cement production process. DNV-verified EPD confirms 46 kg CO₂e/t cement cradle-to-gate (A1–A3), a 90% reduction vs. the same plant\'s standard cement (451 kg CO₂e/t). Product available across Europe from mid-2025.',
      products: [
        {
          id: 'evozero-cement',
          name: 'evoZero® Carbon Captured Cement',
          description: 'World\'s first commercial CCS cement — 90% CO₂ reduction via carbon capture at Brevik, Norway',
          gwpVerified: 46,
          gwpLabel: '46 kg CO₂e/metric ton cement (DNV-verified EPD, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '90% reduction vs. standard Brevik cement (451 kg CO₂e/t reference)',
          epdAvailable: true,
          epdNote: 'DNV-verified third-party EPD; launched June 2025',
          epdUrl: null,
          epdInfoUrl: 'https://www.evozero.com/en',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'Significant premium (CCS cost embedded)',
          costNote: 'Contact Heidelberg Materials for pricing'
        },
        {
          id: 'evobuild-eu',
          name: 'evoBuild™ Low-Carbon Concrete (Europe)',
          description: 'GGBS-based low-carbon concrete — tiered at 30%, 50%, 60%, 70% CO₂ reduction vs. CEM I baseline',
          gwpVerified: null,
          gwpLabel: 'No data found (varies by grade and region)',
          gwpEstimate: 100,
          gwpEstimateNote: 'Est. ~90–100 kg CO₂e/m³ at evoBuild 70% grade (vs. GCCA UK reference ~300–330 kg CO₂e/m³ for C32/40)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '30–85% CO₂ reduction vs. standard CEM I concrete (tiered: 30/50/60/70%)',
          epdAvailable: true,
          epdNote: 'EPDs published via Heidelberg Materials UK (heidelbergmaterials.co.uk); One Click LCA integration',
          epdUrl: null,
          epdInfoUrl: 'https://www.heidelbergmaterials.co.uk/en/evobuild-low-carbon-concrete',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Heidelberg Materials for regional pricing'
        }
      ],
      sources: [
        { label: 'evoZero® — World\'s First CCS Cement', url: 'https://www.evozero.com/en' },
        { label: 'evoBuild UK', url: 'https://www.heidelbergmaterials.co.uk/en/evobuild-low-carbon-concrete' },
        { label: 'Heidelberg Materials Sustainability', url: 'https://www.heidelbergmaterials.com/en/sustainability' }
      ],
      contactUrl: 'https://www.heidelbergmaterials.com/en/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'cemex-vertua-global',
      company: 'CEMEX',
      productLine: 'Vertua® (Global)',
      type: 'concrete',
      coverage: 'national',
      country: 'MX',
      serviceStates: null,
      serviceRegion: 'Global — 50+ countries including Colombia, France, Germany, Mexico, Spain, UK, UAE, Philippines and more',
      plantCount: 'Global network across 50+ countries',
      hq: { lat: 25.650, lng: -100.333, label: 'San Pedro Garza García, Mexico (Global HQ)' },
      plantLocatorUrl: 'https://www.cemex.com/sustainability/climate-action/vertua',
      about: 'CEMEX\'s Vertua® low-carbon concrete is available in 50+ countries across Europe, Latin America, Asia, and the Middle East. The CEMEX UAE operation produces ready-mix averaging just 119 kg CO₂/m³ — among the lowest in the world for a large commercial producer. EPDs confirm CO₂ reductions at each tier and support LEED/BREEAM credits globally.',
      products: [
        {
          id: 'vertua-global-classic',
          name: 'Vertua® Classic (Global)',
          description: '20–35% CO₂ reduction vs. standard concrete — available across 50+ countries',
          gwpVerified: null,
          gwpLabel: 'No data found (region-specific EPDs)',
          gwpEstimate: 172,
          gwpEstimateNote: 'Est. ≈172 kg CO₂e/m³ (≥30% below standard baseline ~245 kg CO₂e/m³)',
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '20–35% CO₂ reduction vs. conventional concrete',
          epdAvailable: true,
          epdNote: 'Regional EPDs available; support LEED, BREEAM, HQE credits',
          epdUrl: null,
          epdInfoUrl: 'https://www.cemex.com/sustainability/climate-action/vertua',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local CEMEX operation for pricing'
        },
        {
          id: 'vertua-global-ultra',
          name: 'Vertua® Ultra (Global — UAE benchmark)',
          description: '≥70% CO₂ reduction; CEMEX UAE avg 119 kg CO₂/m³ — among world\'s lowest for commercial ready-mix',
          gwpVerified: 119,
          gwpLabel: '119 kg CO₂/m³ (CEMEX UAE average at 38 MPa — EPD confirmed)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/m³',
          reductionClaim: '≥70% CO₂ reduction vs. conventional concrete',
          epdAvailable: true,
          epdNote: 'EPD confirmed for UAE market; regional EPDs in other markets',
          epdUrl: null,
          epdInfoUrl: 'https://www.cemex.com/sustainability/climate-action/vertua',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact local CEMEX operation for pricing'
        }
      ],
      sources: [
        { label: 'CEMEX Vertua Global', url: 'https://www.cemex.com/sustainability/climate-action/vertua' }
      ],
      contactUrl: 'https://www.cemex.com/contact-us',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'buzzi-cgreen',
      company: 'Buzzi SpA',
      productLine: 'CGreen® Low-Carbon Cement',
      type: 'concrete',
      coverage: 'regional',
      country: 'IT',
      serviceStates: null,
      serviceRegion: 'Europe — Italy, Germany (Dyckerhoff), Netherlands, Luxembourg, Poland, Czech Republic',
      plantCount: 'Multiple plants across Europe',
      hq: { lat: 45.133, lng: 8.450, label: 'Casale Monferrato, Italy (Company HQ)' },
      plantLocatorUrl: 'https://www.buzzi.com/sustainability',
      about: 'Buzzi SpA (formerly Buzzi Unicem) is a major European cement producer. The CGreen® classification system certifies cements with GWP below 700 kg CO₂e/t (A1–A3) — all carrying independent EPDs. A carbon capture pilot using Nuada technology is underway at the Monselice, Italy plant (2024). German subsidiary Dyckerhoff also offers low-carbon cement products.',
      products: [
        {
          id: 'cgreen-cement',
          name: 'CGreen® Low-Carbon Cement',
          description: 'EPD-certified cements with GWP < 700 kg CO₂e/t — top tier cements below 600 kg CO₂e/t',
          gwpVerified: null,
          gwpLabel: 'No data found (varies by product; all CGreen < 700 kg CO₂e/t)',
          gwpEstimate: 650,
          gwpEstimateNote: 'All CGreen products certified below 700 kg CO₂e/t via EPD; standard cement baseline ~850 kg CO₂e/t',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~20% reduction vs. standard CEM I (EPD-certified; products above 700 kg CO₂e/t excluded from CGreen)',
          epdAvailable: true,
          epdNote: 'All CGreen cements carry EPDs via Italian EPD programme / IBU',
          epdUrl: null,
          epdInfoUrl: 'https://www.buzzi.com/sustainability',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Buzzi for pricing'
        }
      ],
      sources: [
        { label: 'Buzzi Sustainability', url: 'https://www.buzzi.com/sustainability' }
      ],
      contactUrl: 'https://www.buzzi.com/contacts',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'ultratech-cement',
      company: 'UltraTech Cement',
      productLine: 'Blended Cements (PPC / PSC / PCC)',
      type: 'concrete',
      coverage: 'regional',
      country: 'IN',
      serviceStates: null,
      serviceRegion: 'India (dominant — No. 1 cement producer), UAE, Bahrain, Sri Lanka, Bangladesh',
      plantCount: '23+ integrated plants across India',
      hq: { lat: 19.076, lng: 72.877, label: 'Mumbai, Maharashtra, India (Company HQ)' },
      plantLocatorUrl: 'https://www.ultratechcement.com/find-dealer',
      about: 'UltraTech Cement (Aditya Birla Group) is India\'s largest cement producer. Published EPDs on EPD International confirm GWP values for Portland Pozzolana Cement (PPC), Portland Slag Cement (PSC), Portland Composite Cement (PCC) and OPC. PSC (Portland Slag Cement) achieves below 440 kg CO₂/t Scope 1. ~70% of production is blended cement. SBTi-approved carbon targets.',
      products: [
        {
          id: 'ultratech-psc',
          name: 'Portland Slag Cement (PSC)',
          description: 'GGBS blended cement — 25–65% slag content; lowest GWP in UltraTech range',
          gwpVerified: null,
          gwpLabel: 'No data found (below 440 kg CO₂e/t Scope 1 per company)',
          gwpEstimate: 420,
          gwpEstimateNote: 'Company states PSC < 440 kg CO₂/t Scope 1; full cradle-to-gate in EPD-IES-0005019 on environdec.com',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~50% vs. OPC baseline (~850 kg CO₂e/t) via high slag substitution',
          epdAvailable: true,
          epdNote: 'EPD published on EPD International (EPD-IES-0005019) — verified per ISO 14025/EN 15804',
          epdUrl: null,
          epdInfoUrl: 'https://www.environdec.com/library/epd-4928',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact UltraTech for pricing'
        },
        {
          id: 'ultratech-ppc',
          name: 'Portland Pozzolana Cement (PPC)',
          description: 'Fly ash blended cement — 20–35% fly ash content; widely used across India',
          gwpVerified: null,
          gwpLabel: 'No data found (see EPD-IES-0005019)',
          gwpEstimate: 600,
          gwpEstimateNote: 'Company overall Scope 1 intensity 549 kg CO₂/t; PPC is mid-range. Full value in EPD.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~25–30% vs. OPC via fly ash substitution',
          epdAvailable: true,
          epdNote: 'EPD published on EPD International (EPD-IES-0005019)',
          epdUrl: null,
          epdInfoUrl: 'https://www.environdec.com/library/epd-4928',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact UltraTech for pricing'
        }
      ],
      sources: [
        { label: 'UltraTech EPD Announcement', url: 'https://www.ultratechcement.com/corporate/media/stories/ultratech-announces-grant-of-environmental-product-declaration-for-four-of-its-key-cement-products' },
        { label: 'UltraTech Sustainability', url: 'https://www.ultratechcement.com/sustainability' }
      ],
      contactUrl: 'https://www.ultratechcement.com/contact-us',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'votorantim-blenture',
      company: 'Votorantim Cimentos',
      productLine: 'Blenture® / Blended Cements',
      type: 'concrete',
      coverage: 'regional',
      country: 'BR',
      serviceStates: null,
      serviceRegion: 'Brazil (dominant), Spain, Portugal (Blenture), Canada, and 11 countries total',
      plantCount: '30+ plants across Brazil and international operations',
      hq: { lat: -23.548, lng: -46.634, label: 'São Paulo, Brazil (Company HQ)' },
      plantLocatorUrl: 'https://www.votorantimcimentos.com',
      about: 'Votorantim Cimentos is Latin America\'s largest cement producer and a pioneer in publishing Brazil\'s first cement and concrete EPDs. Their Blenture® brand (Spain/Portugal, launched October 2024) targets ≥30% CO₂ reduction vs. standard cement. Company-wide net CO₂ intensity reached 550 kg CO₂/t in 2024 — 27.9% below 1990 levels. SBTi-approved target of 475 kg CO₂/t by 2030.',
      products: [
        {
          id: 'votorantim-blenture-cement',
          name: 'Blenture® Low-Carbon Cement (Spain/Portugal)',
          description: '≥30% CO₂ reduction vs. standard cement — launched Iberian Peninsula Oct 2024',
          gwpVerified: null,
          gwpLabel: 'No data found',
          gwpEstimate: 385,
          gwpEstimateNote: 'Est. ~385 kg CO₂/t (30% below company avg 550 kg CO₂/t)',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '≥30% CO₂ reduction vs. standard cement; 27.9% global reduction vs. 1990',
          epdAvailable: true,
          epdNote: 'EPDs published on EPD International (EPD-895 for CP II E-40 cement)',
          epdUrl: null,
          epdInfoUrl: 'https://www.votorantimcimentos.com/sustainability',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Votorantim for pricing'
        }
      ],
      sources: [
        { label: 'Votorantim CO₂ Reduction 2024', url: 'https://www.votorantimcimentos.com/news/votorantim-cimentos-reduced-its-global-co2-emissions-by-27-9-between-1990-and-2024/' },
        { label: 'Votorantim Sustainability', url: 'https://www.votorantimcimentos.com/sustainability' }
      ],
      contactUrl: 'https://www.votorantimcimentos.com/contact',
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Nucor Steel Crawfordsville', lat: 39.9842, lng: -86.8997, city: 'Crawfordsville', state: 'IN', address: '4500 County Road 350 W' },
        { name: 'Nucor Steel Hickman', lat: 35.9093, lng: -89.9175, city: 'Blytheville', state: 'AR', address: '1901 Highway 18' },
        { name: 'Nucor Steel Berkeley', lat: 33.0618, lng: -79.8209, city: 'Huger', state: 'SC' },
        { name: 'Nucor Steel Gallatin', lat: 38.7284, lng: -85.0017, city: 'Ghent', state: 'KY' },
        { name: 'Nucor Steel Decatur', lat: 34.5952, lng: -86.9834, city: 'Decatur', state: 'AL' },
        { name: 'Nucor Steel Seattle', lat: 47.5612, lng: -122.3925, city: 'Seattle', state: 'WA', address: '2424 SW Andover St' },
        { name: 'Nucor Steel Jewett', lat: 31.3599, lng: -96.1486, city: 'Jewett', state: 'TX' },
        { name: 'Nucor Steel Norfolk', lat: 41.9852, lng: -97.4195, city: 'Norfolk', state: 'NE' },
        { name: 'Nucor Steel Marion', lat: 40.5893, lng: -83.1282, city: 'Marion', state: 'OH' },
        { name: 'Nucor Steel Darlington', lat: 34.2947, lng: -79.8923, city: 'Darlington', state: 'SC' },
        { name: 'Nucor Steel Connecticut', lat: 41.4570, lng: -72.8231, city: 'Wallingford', state: 'CT' },
        { name: 'Nucor Steel Auburn', lat: 42.9326, lng: -76.5682, city: 'Auburn', state: 'NY' },
        { name: 'Nucor Steel Kankakee', lat: 41.1628, lng: -87.8979, city: 'Bourbonnais', state: 'IL' },
        { name: 'Nucor Steel Plymouth', lat: 41.8802, lng: -112.1467, city: 'Plymouth', state: 'UT' },
        { name: 'Nucor Steel Brandenburg', lat: 37.9996, lng: -86.1703, city: 'Brandenburg', state: 'KY' },
        { name: 'Nucor Steel Tuscaloosa', lat: 33.2098, lng: -87.5698, city: 'Tuscaloosa', state: 'AL' },
        { name: 'Nucor Steel Hertford County', lat: 36.3029, lng: -76.9052, city: 'Cofield', state: 'NC' },
        { name: 'Nucor Steel Jackson', lat: 32.2988, lng: -90.1848, city: 'Flowood', state: 'MS' },
        { name: 'Nucor Steel Memphis', lat: 35.1495, lng: -90.0490, city: 'Memphis', state: 'TN' },
        { name: 'Nucor Steel Kingman', lat: 35.1895, lng: -114.0530, city: 'Kingman', state: 'AZ' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Big River Steel Flex Mill® – Osceola, AR', lat: 35.6918, lng: -89.9626, city: 'Osceola', state: 'AR', address: '1 Steel Drive' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'ArcelorMittal Burns Harbor', lat: 41.6220, lng: -87.1386, city: 'Burns Harbor', state: 'IN' },
        { name: 'ArcelorMittal Cleveland', lat: 41.4993, lng: -81.6944, city: 'Cleveland', state: 'OH' },
        { name: 'ArcelorMittal Indiana Harbor (East & West)', lat: 41.6567, lng: -87.4479, city: 'East Chicago', state: 'IN' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'SDI Flat Roll – Butler, IN', lat: 41.4259, lng: -85.0013, city: 'Butler', state: 'IN' },
        { name: 'SDI Flat Roll – Columbus, MS', lat: 33.4959, lng: -88.4278, city: 'Columbus', state: 'MS' },
        { name: 'SDI Flat Roll – Sinton, TX', lat: 28.0383, lng: -97.5089, city: 'Sinton', state: 'TX' },
        { name: 'SDI Structural & Rail – Columbia City, IN', lat: 41.3220, lng: -85.4891, city: 'Columbia City', state: 'IN' },
        { name: 'SDI Roanoke Bar Products – Pittsboro, IN', lat: 39.8635, lng: -86.4601, city: 'Pittsboro', state: 'IN' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'CMC Steel Texas – Seguin, TX', lat: 29.5688, lng: -97.9645, city: 'Seguin', state: 'TX' },
        { name: 'CMC Steel South Carolina – Cayce, SC', lat: 33.9529, lng: -81.0662, city: 'Cayce', state: 'SC' },
        { name: 'CMC Steel Arizona – Mesa, AZ', lat: 33.4152, lng: -111.8315, city: 'Mesa', state: 'AZ' },
        { name: 'CMC Steel Sayreville – Sayreville, NJ', lat: 40.4621, lng: -74.3410, city: 'Sayreville', state: 'NJ' },
        { name: 'CMC Steel Oklahoma – Durant, OK', lat: 33.9937, lng: -96.3708, city: 'Durant', state: 'OK' }
      ]
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
      ec3SearchUrl: 'https://www.buildingtransparency.org/',
      plants: [
        { name: 'Gerdau – Jacksonville, FL', lat: 30.3322, lng: -81.4355, city: 'Jacksonville', state: 'FL' },
        { name: 'Gerdau – Cartersville, GA', lat: 34.1651, lng: -84.7997, city: 'Cartersville', state: 'GA' },
        { name: 'Gerdau – Knoxville, TN', lat: 35.9606, lng: -83.9207, city: 'Knoxville', state: 'TN' },
        { name: 'Gerdau – Midlothian, TX', lat: 32.4776, lng: -96.9939, city: 'Midlothian', state: 'TX' },
        { name: 'Gerdau – Perth Amboy, NJ', lat: 40.5121, lng: -74.2637, city: 'Perth Amboy', state: 'NJ' },
        { name: 'Gerdau – Wilton, IA', lat: 41.5902, lng: -91.0193, city: 'Wilton', state: 'IA' }
      ]
    },

    /* ─── Global Steel ──────────────────────────────────────── */

    {
      id: 'ssab-zero',
      company: 'SSAB',
      productLine: 'SSAB Zero™ / SSAB Fossil-Free™',
      type: 'steel',
      coverage: 'national',
      country: 'SE',
      serviceStates: null,
      serviceRegion: 'Global — Nordic primary markets + North America; 50,000+ t SSAB Zero shipped 2024',
      plantCount: 'Multiple EAF mills (Sweden, Finland)',
      technologyStatus: 'commercial',
      hq: { lat: 59.334, lng: 18.063, label: 'Stockholm, Sweden (Company HQ)' },
      plantLocatorUrl: 'https://www.ssab.com/en/fossil-free-steel/ssab-zero',
      about: 'SSAB (Sweden) produces SSAB Zero™ using 97–100% recycled scrap in electric arc furnaces powered by Nordic renewable electricity. Published EPDs via IBU confirm 470 kg CO₂e/t cradle-to-gate (A1–A3) — a ~77% reduction vs. conventional BF-BOF steel. Available for flat products: hot-rolled, cold-rolled, metal-coated, color-coated sheet. SSAB Fossil-Free™ (HYBRIT — hydrogen-based DRI) completed pilot deliveries; commercial scale expected 2026.',
      products: [
        {
          id: 'ssab-zero-flat',
          name: 'SSAB Zero™ (Flat Products — EAF Scrap)',
          description: 'Hot-rolled, cold-rolled, metal-coated, color-coated flat steel — 97–100% recycled scrap + Nordic renewable electricity',
          gwpVerified: 470,
          gwpLabel: '470 kg CO₂e/metric ton (EPD confirmed via IBU, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~77% vs. conventional BF-BOF steel (~2,060 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'Multiple EPDs published via IBU for hot-rolled, cold-rolled, metal-coated, color-coated sheet',
          epdUrl: null,
          epdInfoUrl: 'https://www.ssab.com/en/fossil-free-steel/ssab-zero/epd',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact SSAB for pricing'
        },
        {
          id: 'ssab-fossil-free',
          name: 'SSAB Fossil-Free™ (HYBRIT — Hydrogen DRI)',
          description: 'Near-zero steel via green hydrogen direct reduction of iron (DRI) + EAF — pilot deliveries completed; commercial scale ~2026',
          gwpVerified: null,
          gwpLabel: 'No data found (no commercial EPD yet)',
          gwpEstimate: 50,
          gwpEstimateNote: 'Scope 1+2 claimed at ~0.05 kg CO₂e/kg steel (50 kg CO₂e/t) — pre-commercial; no verified commercial EPD published',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: 'Near-zero Scope 1+2 via green hydrogen + renewable electricity (HYBRIT process)',
          epdAvailable: false,
          epdNote: 'No commercial EPD yet — pilot stage. Commercial EPD expected with full-scale launch.',
          epdUrl: null,
          epdInfoUrl: 'https://www.ssab.com/en/fossil-free-steel/hybrit',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact SSAB for pricing'
        }
      ],
      sources: [
        { label: 'SSAB Zero EPDs (IBU)', url: 'https://www.ssab.com/en/fossil-free-steel/ssab-zero/epd' },
        { label: 'HYBRIT — Fossil-Free Steel', url: 'https://www.ssab.com/en/fossil-free-steel/hybrit' }
      ],
      contactUrl: 'https://www.ssab.com/en/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'thyssenkrupp-bluemint',
      company: 'thyssenkrupp Steel Europe',
      productLine: 'bluemint® Steel',
      type: 'steel',
      coverage: 'regional',
      country: 'DE',
      serviceStates: null,
      serviceRegion: 'Europe — primarily Germany and EU industrial customers; global delivery available',
      plantCount: 'Duisburg integrated steel complex (Germany)',
      technologyStatus: 'commercial',
      hq: { lat: 51.490, lng: 6.778, label: 'Duisburg, Germany (Company HQ)' },
      plantLocatorUrl: 'https://www.thyssenkrupp-steel.com/en/products/flat-carbon-steel/bluemint-steel/',
      about: 'thyssenkrupp Steel Europe (Duisburg, Germany) offers bluemint® Steel — an independently certified low-carbon flat steel product. bluemint® pure (~600 kg CO₂e/t, DNV-certified) uses natural gas-based DRI as a transitional route; bluemint® recycled (~750 kg CO₂e/t, TÜV Süd-certified) uses scrap-based EAF. EPDs published via IBU. Roadmap includes a hydrogen-based DRI plant (tkH2Steel project).',
      products: [
        {
          id: 'bluemint-pure',
          name: 'bluemint® pure (DRI — Natural Gas Transitional)',
          description: 'Flat steel via natural gas DRI + EAF — ~70% CO₂ reduction vs. conventional; DNV-certified',
          gwpVerified: 600,
          gwpLabel: '~600 kg CO₂e/metric ton (DNV-certified EPD, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~70% reduction vs. conventional BF-BOF (~2,100 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published via IBU; certified by DNV',
          epdUrl: null,
          epdInfoUrl: 'https://www.thyssenkrupp-steel.com/en/products/flat-carbon-steel/bluemint-steel/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact thyssenkrupp Steel for pricing'
        },
        {
          id: 'bluemint-recycled',
          name: 'bluemint® recycled (Scrap EAF)',
          description: 'Flat steel via 100% scrap EAF — ~64% CO₂ reduction vs. conventional; TÜV Süd-certified',
          gwpVerified: 750,
          gwpLabel: '~750 kg CO₂e/metric ton (TÜV Süd-certified EPD, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~64% reduction vs. conventional BF-BOF (~2,100 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published via IBU; certified by TÜV Süd',
          epdUrl: null,
          epdInfoUrl: 'https://www.thyssenkrupp-steel.com/en/products/flat-carbon-steel/bluemint-steel/',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact thyssenkrupp Steel for pricing'
        }
      ],
      sources: [
        { label: 'bluemint® Steel Product Page', url: 'https://www.thyssenkrupp-steel.com/en/products/flat-carbon-steel/bluemint-steel/' },
        { label: 'thyssenkrupp Steel Sustainability', url: 'https://www.thyssenkrupp-steel.com/en/company/sustainability/' }
      ],
      contactUrl: 'https://www.thyssenkrupp-steel.com/en/contact/',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'salzgitter-salcos',
      company: 'Salzgitter AG',
      productLine: 'SALCOS® (Salzgitter Low CO₂ Steelmaking)',
      type: 'steel',
      coverage: 'regional',
      country: 'DE',
      serviceStates: null,
      serviceRegion: 'Europe — primarily Germany and EU customers',
      plantCount: 'Salzgitter and Peine plants (Lower Saxony, Germany)',
      technologyStatus: 'commercial',
      hq: { lat: 52.162, lng: 10.409, label: 'Salzgitter, Lower Saxony, Germany' },
      plantLocatorUrl: 'https://salcos.salzgitter-ag.com/en/salcos.html',
      about: 'Salzgitter AG operates one of Europe\'s most advanced low-carbon steel programmes. The Peine EAF plant produces scrap-based heavy plate at 590.9 kg CO₂e/t (EPD-confirmed, ~75% reduction vs. BF-BOF). The SALCOS® hydrogen steelmaking route has also produced certified steel at 299 kg CO₂e/t — LESS A-grade certified. Roadmap to full hydrogen DRI (target: 95% CO₂ reduction).',
      products: [
        {
          id: 'salcos-eaf-plate',
          name: 'EAF Heavy Plate (Peine — Scrap Route)',
          description: 'Scrap-based EAF heavy plate — EPD confirms 75% reduction vs. BF-BOF',
          gwpVerified: 590.9,
          gwpLabel: '590.9 kg CO₂e/metric ton (EPD published, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~75% vs. conventional BF-BOF heavy plate (~2,360 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published — scrap-based EAF heavy plate, Salzgitter Flachstahl',
          epdUrl: null,
          epdInfoUrl: 'https://www.salzgitter-flachstahl.de/en/sustainability/environmental-product-declaration.html',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Salzgitter for pricing'
        },
        {
          id: 'salcos-green-hydrogen',
          name: 'SALCOS® Green Hydrogen Steel (LESS A-Grade)',
          description: 'Hydrogen DRI + EAF structural steel — LESS A-grade certified at 299 kg CO₂e/t',
          gwpVerified: 299,
          gwpLabel: '299 kg CO₂e/metric ton (PCF-certified, LESS A-grade)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~87% vs. conventional BF-BOF (~2,360 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'Product Carbon Footprint (PCF) certified; LESS (Low Emission Steel Standard) A-grade',
          epdUrl: null,
          epdInfoUrl: 'https://salcos.salzgitter-ag.com/en/salcos.html',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'Green premium applies',
          costNote: 'Contact Salzgitter for pricing'
        }
      ],
      sources: [
        { label: 'SALCOS® Programme', url: 'https://salcos.salzgitter-ag.com/en/salcos.html' },
        { label: 'EPD — 75% CO₂ reduction EAF plate', url: 'https://www.salzgitter-flachstahl.de/en/news/details/epd-21786.html' }
      ],
      contactUrl: 'https://www.salzgitter-ag.com/en/contact.html',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'arcelormittal-europe-xcarbr',
      company: 'ArcelorMittal Europe',
      productLine: 'XCarb® recycled and renewably produced (Europe)',
      type: 'steel',
      coverage: 'regional',
      country: 'LU',
      serviceStates: null,
      serviceRegion: 'Europe — Spain, France, Belgium, Poland, Luxembourg, Czech Republic and others; global customer delivery',
      plantCount: 'Multiple EAF mills across Europe (primary: Sestao, Spain)',
      technologyStatus: 'commercial',
      hq: { lat: 49.601, lng: 6.138, label: 'Luxembourg City, Luxembourg (Group HQ)' },
      plantLocatorUrl: 'https://europe.arcelormittal.com/sustainability/xcarb',
      about: 'ArcelorMittal Europe\'s XCarb® recycled and renewably produced steel is made using 100% scrap in electric arc furnaces powered by renewable electricity — primarily at Sestao, Spain. Full suite of EPDs published via IBU covers rebars (300 kg CO₂e/t), sections/merchant bars (333 kg CO₂e/t), hot-rolled coil (600 kg CO₂e/t), heavy plate (~914 kg CO₂e/t), and sheet piling (409 kg CO₂e/t). Rebars represent an 85% reduction vs. BF-BOF.',
      products: [
        {
          id: 'xcarbr-eu-rebars',
          name: 'XCarb® Rebars & Long Products (Europe)',
          description: 'Rebar, wire rod, merchant bars — 100% scrap EAF + renewable electricity; EPD confirmed',
          gwpVerified: 300,
          gwpLabel: '300 kg CO₂e/metric ton (EPD confirmed via IBU, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~85% vs. BF-BOF baseline (~2,000 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published via IBU (ibu-epd.com); also on EPD International (environdec.com)',
          epdUrl: null,
          epdInfoUrl: 'https://europe.arcelormittal.com/sustainability/xcarb/recycled-and-renewably-produced-flat-long-epd',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact ArcelorMittal Europe for pricing'
        },
        {
          id: 'xcarbr-eu-sections',
          name: 'XCarb® Structural Sections (Europe)',
          description: 'Wide-flange, beams, channels, angles — 100% scrap EAF + renewable electricity',
          gwpVerified: 333,
          gwpLabel: '333 kg CO₂e/metric ton (EPD confirmed via IBU, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~83% vs. BF-BOF baseline (~2,000 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published via IBU; available on EPD International',
          epdUrl: null,
          epdInfoUrl: 'https://europe.arcelormittal.com/sustainability/xcarb/recycled-and-renewably-produced-flat-long-epd',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact ArcelorMittal Europe for pricing'
        },
        {
          id: 'xcarbr-eu-hrc',
          name: 'XCarb® Hot-Rolled Coil / Flat Products (Europe)',
          description: 'Hot-rolled coil, cold-rolled, galvanized flat steel — 100% scrap EAF + renewable electricity',
          gwpVerified: 600,
          gwpLabel: '600 kg CO₂e/metric ton (EPD confirmed via IBU, A1–A3)',
          gwpEstimate: null,
          gwpEstimateNote: null,
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '~70% vs. conventional BF-BOF flat steel (~2,000 kg CO₂e/t)',
          epdAvailable: true,
          epdNote: 'EPD published via IBU; available on EPD International',
          epdUrl: null,
          epdInfoUrl: 'https://europe.arcelormittal.com/sustainability/xcarb/recycled-and-renewably-produced-flat-long-epd',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact ArcelorMittal Europe for pricing'
        }
      ],
      sources: [
        { label: 'XCarb® EPDs (IBU/EPD International)', url: 'https://europe.arcelormittal.com/sustainability/xcarb/recycled-and-renewably-produced-flat-long-epd' },
        { label: 'XCarb® Programme', url: 'https://europe.arcelormittal.com/sustainability/xcarb' }
      ],
      contactUrl: 'https://europe.arcelormittal.com/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'tata-steel-zeremis',
      company: 'Tata Steel',
      productLine: 'Zeremis® Carbon Lite (Europe)',
      type: 'steel',
      coverage: 'regional',
      country: 'NL',
      serviceStates: null,
      serviceRegion: 'UK and Europe (Netherlands, UK primary; broader European market)',
      plantCount: 'IJmuiden, Netherlands + Port Talbot, UK (transitioning to EAF)',
      technologyStatus: 'commercial',
      hq: { lat: 52.461, lng: 4.613, label: 'IJmuiden, Netherlands (European HQ & primary plant)' },
      plantLocatorUrl: 'https://www.tatasteelnederland.com/en/sustainability/zeremis',
      about: 'Tata Steel offers Zeremis® Carbon Lite (Netherlands) and Optemis® Carbon Lite (UK) — low-carbon flat steel products using mass-balance methodology. Zeremis Carbon Lite provides up to 100% CO₂ reduction allocation. Tata Steel UK is transitioning Port Talbot from BF-BOF to EAF, targeting 80% CO₂ reduction. EPDs available through Tata Steel\'s own programme.',
      products: [
        {
          id: 'zeremis-carbon-lite',
          name: 'Zeremis® Carbon Lite (Netherlands)',
          description: 'Low-carbon flat steel — 30% to 100% CO₂ reduction via mass-balance allocation; hot-rolled, cold-rolled, coated',
          gwpVerified: null,
          gwpLabel: 'No data found (mass-balance; product-specific calculation)',
          gwpEstimate: 1320,
          gwpEstimateNote: 'Est. ~1,320 kg CO₂/t at 30% reduction tier (EU avg ~1,880 kg CO₂/t → ×0.7). Up to 100% reduction available via carbon bank.',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '30–100% CO₂ reduction vs. EU average flat steel (mass-balance methodology)',
          epdAvailable: true,
          epdNote: 'EPDs available via Tata Steel\'s own EPD programme; type-III EPD basis',
          epdUrl: null,
          epdInfoUrl: 'https://www.tatasteelnederland.com/en/sustainability/zeremis',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Tata Steel for pricing'
        }
      ],
      sources: [
        { label: 'Zeremis® Carbon Lite', url: 'https://www.tatasteelnederland.com/en/sustainability/zeremis' },
        { label: 'Tata Steel UK — Optemis Carbon Lite', url: 'https://www.tatasteeluk.com/en-US/green-steel-solutions/optemis/optemis-carbon-lite' }
      ],
      contactUrl: 'https://www.tatasteelnederland.com/en/contact',
      ec3SearchUrl: 'https://www.buildingtransparency.org/'
    },

    {
      id: 'stegra-h2-green-steel',
      company: 'Stegra (formerly H2 Green Steel)',
      productLine: 'Green Hydrogen Steel',
      type: 'steel',
      coverage: 'regional',
      country: 'SE',
      serviceStates: null,
      serviceRegion: 'Europe (Boden, Sweden plant — commercial production targeted 2026; pre-sold to European customers)',
      plantCount: '1 plant under construction (Boden, Norrbotten, Sweden)',
      technologyStatus: 'precommercial',
      hq: { lat: 65.832, lng: 21.690, label: 'Boden, Norrbotten, Sweden (Plant Location)' },
      plantLocatorUrl: 'https://stegra.com/en/the-boden-plant',
      about: 'Stegra (rebranded from H2 Green Steel in 2024) is building a green hydrogen-based steel plant in Boden, Sweden targeting commercial production in 2026. Using 100% green hydrogen for direct reduction of iron ore (DRI) + electric arc furnace, powered by Nordic renewable electricity. Target: ≤0.5 t CO₂/t steel cradle-to-gate — over 90% reduction vs. conventional blast furnace. Over half of planned production pre-sold to European automotive and industrial customers.',
      products: [
        {
          id: 'stegra-green-hrc',
          name: 'Green Hydrogen Steel (Flat Products — Pre-Commercial)',
          description: 'Hot-rolled coil and flat products from 100% green hydrogen DRI + EAF — commercial production targeted 2026',
          gwpVerified: null,
          gwpLabel: 'No data found (pre-commercial; no EPD published)',
          gwpEstimate: 500,
          gwpEstimateNote: 'Target ≤500 kg CO₂e/t (≤0.5 t CO₂/t) cradle-to-gate; no commercial EPD published as of 2026',
          gwpUnit: 'kg CO₂e/metric ton',
          reductionClaim: '>90% vs. conventional BF-BOF baseline (~2,000 kg CO₂e/t)',
          epdAvailable: false,
          epdNote: 'No commercial EPD — plant not yet in production. EPD expected at commercial launch.',
          epdUrl: null,
          epdInfoUrl: 'https://stegra.com/en/the-boden-plant',
          ec3Searchable: false,
          costBase: 'No data found',
          costPremium: 'No data found',
          costNote: 'Contact Stegra for pre-commercial pricing'
        }
      ],
      sources: [
        { label: 'Stegra — Boden Plant', url: 'https://stegra.com/en/the-boden-plant' },
        { label: 'Stegra Company', url: 'https://stegra.com' }
      ],
      contactUrl: 'https://stegra.com/contact',
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
