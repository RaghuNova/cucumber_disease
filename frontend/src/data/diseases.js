export const DISEASES_DATA = [
  {
    id: "downy-mildew",
    name: "Downy Mildew",
    scientificName: "Pseudoperonospora cubensis (Oomycete)",
    isPrimary: true,
    tag: "Primary Target",
    shortDescription: "Rapidly spreading water-mold causing angular, vein-bounded chlorotic yellow patches on leaf surfaces.",
    symptoms: [
      "Angular yellow chlorotic lesions bounded strictly by leaf veins",
      "Purplish-gray felty spore growth on the underside during humid mornings",
      "Lesions rapidly coalesce into brown necrotic foliage scorch"
    ],
    causes: [
      "Prolonged leaf wetness (>6 hours) from overhead watering or heavy morning dew",
      "High relative humidity (85-100%) and moderate temperatures (15°C - 22°C)",
      "Dense canopy with poor ventilation"
    ],
    prevention: [
      "Switch immediately from overhead to sub-canopy drip irrigation",
      "Prune crowded lower foliage to maximize sun exposure and air circulation",
      "Apply preventative copper or mancozeb sprays during persistent cloudy weather"
    ],
    accentColor: "border-amber-500/40 text-amber-400 bg-amber-500/10"
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    scientificName: "Podosphaera xanthii / Golovinomyces cichoracearum",
    isPrimary: true,
    tag: "Primary Target",
    shortDescription: "Superficial white powdery talc-like patches covering leaves and petioles, impairing photosynthesis.",
    symptoms: [
      "Circular white powdery fungal spots appearing first on shaded lower leaves",
      "Rapid coalescing into a continuous flour-like coating across the blade",
      "Infected leaves turn yellow, crisp, and drop prematurely"
    ],
    causes: [
      "Warm dry days (20°C - 27°C) accompanied by high relative humidity at night",
      "Excessive nitrogen fertilization promoting lush, tender foliage",
      "Low light penetration and shaded plant canopies"
    ],
    prevention: [
      "Plant mildew-resistant cucumber varieties",
      "Apply potassium bicarbonate, neem oil, or micronized sulfur early in the season",
      "Ensure adequate vine trellising and spacing"
    ],
    accentColor: "border-teal-400/40 text-teal-300 bg-teal-500/10"
  },
  {
    id: "healthy-leaves",
    name: "Healthy Leaves",
    scientificName: "Cucumis sativus (Vigorous Foliage)",
    isPrimary: true,
    tag: "Benchmark Control",
    shortDescription: "Vibrant deep green foliage with uniform chlorophyll distribution, intact margins, and active photosynthesis.",
    symptoms: [
      "Uniform emerald to forest green lamina without chlorotic spotting",
      "Clean, well-defined vascular vein architecture with no necrotic edges",
      "Underside is completely free of fungal mats, webbing, or bacterial crust"
    ],
    causes: [
      "Balanced soil nutrients (N-P-K) and optimal micro-elements",
      "Consistent root zone soil moisture without waterlogging",
      "Abundant sunlight exposure and clean trellising"
    ],
    prevention: [
      "Maintain calibrated fertigation routines through drip lines",
      "Perform weekly scouting on leaf undersides for early signs of pests",
      "Sanitize pruning shears between plant rows"
    ],
    accentColor: "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
  },
  {
    id: "angular-leaf-spot",
    name: "Angular Leaf Spot",
    scientificName: "Pseudomonas syringae pv. lachrymans",
    isPrimary: false,
    tag: "Supported Category",
    shortDescription: "Bacterial infection forming water-soaked angular spots that dry into brittle shot-holes.",
    symptoms: [
      "Small water-soaked spots strictly delimited by veins",
      "White dried bacterial ooze or crust on undersides during dry periods",
      "Dead center tissue drops out, creating ragged shot-holes"
    ],
    causes: [
      "Rain splashing or overhead sprinkler irrigation",
      "Working in fields while vines are wet with dew",
      "Warm humid conditions (24°C - 28°C)"
    ],
    prevention: [
      "Avoid handling or cultivating wet cucumber vines",
      "Use certified pathogen-free seed stock",
      "Apply copper-based bactericides at the earliest sign of angular lesions"
    ],
    accentColor: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
  },
  {
    id: "anthracnose",
    name: "Anthracnose",
    scientificName: "Colletotrichum orbiculare",
    isPrimary: false,
    tag: "Supported Category",
    shortDescription: "Circular water-soaked brown lesions that expand rapidly and form pink gelatinous spore masses in moisture.",
    symptoms: [
      "Circular to oval yellowish spots enlarging into dark brown dead tissue",
      "Center of lesions dry, crack, and tear away",
      "Sunken circular lesions on fruit and stems with salmon-pink spores"
    ],
    causes: [
      "Warm, wet weather (21°C - 27°C) and persistent overhead wetting",
      "Fungal spores overwintering on infected crop debris",
      "Splashing water dispersing conidia across adjacent plants"
    ],
    prevention: [
      "Rotate crops with non-cucurbits for at least 2 years",
      "Incorporate or burn crop residue immediately after harvest",
      "Apply protective fungicides (e.g., chlorothalonil) during rain periods"
    ],
    accentColor: "border-orange-500/40 text-orange-400 bg-orange-500/10"
  },
  {
    id: "bacterial-wilt",
    name: "Bacterial Wilt",
    scientificName: "Erwinia tracheiphila",
    isPrimary: false,
    tag: "Supported Category",
    shortDescription: "Vascular bacterial blockage spread by cucumber beetles, causing rapid and irreversible vine collapse.",
    symptoms: [
      "Sudden daytime wilting of single leaves followed by permanent runner collapse",
      "Leaves retain a dull green color while drooping completely",
      "White sticky viscous bacterial strands form when cut stems are pulled apart"
    ],
    causes: [
      "Transmission by feeding striped or spotted cucumber beetles",
      "Bacteria multiplying inside xylem vessels, cutting off water flow",
      "High insect pressure during seedling and early vegetative stages"
    ],
    prevention: [
      "Rogue and destroy wilted vines immediately upon discovery",
      "Install floating row covers or sticky traps to suppress beetle populations",
      "Apply targeted insecticides at first sign of beetle infestation"
    ],
    accentColor: "border-rose-500/40 text-rose-400 bg-rose-500/10"
  },
  {
    id: "gummy-stem-blight",
    name: "Gummy Stem Blight",
    scientificName: "Stagonosporopsis cucurbitacearum",
    isPrimary: false,
    tag: "Supported Category",
    shortDescription: "Stem-cankering fungus producing brown leaf lesions and cracked stem cankers that exude amber gummy sap.",
    symptoms: [
      "Brown wedge-shaped lesions advancing inward from leaf margins",
      "Water-soaked stem lesions that crack and bleed sticky amber gum",
      "Small black speck-like fruiting bodies (pycnidia) on bleached stems"
    ],
    causes: [
      "High humidity and temperatures between 18°C - 25°C",
      "Stem wounds created by pruning shears, insects, or trellis rubbing",
      "Infected seeds or soil residues from past plantings"
    ],
    prevention: [
      "Disinfect pruning tools between cuts",
      "Avoid handling or pruning vines in humid or rainy conditions",
      "Apply registered systemic fungicides and maintain good airflow"
    ],
    accentColor: "border-amber-600/40 text-amber-300 bg-amber-600/10"
  },
  {
    id: "nutrient-deficiency",
    name: "Nutrient Deficiency",
    scientificName: "Abiotic Physiological Condition",
    isPrimary: false,
    tag: "Supported Category",
    shortDescription: "Physiological chlorosis from imbalanced soil pH or deficient Nitrogen, Potassium, Iron, or Magnesium.",
    symptoms: [
      "Interveinal chlorosis (yellow tissue between dark green veins) on young leaves (Iron/Manganese)",
      "Uniform yellowing beginning on oldest lower foliage (Nitrogen deficiency)",
      "Marginal scorching or yellowing around leaf perimeters (Potassium deficiency)"
    ],
    causes: [
      "Soil pH below 5.8 or above 7.2 locking out nutrient availability",
      "Overwatering, waterlogging, or root compaction inhibiting uptake",
      "Surge in vegetative growth without adequate balanced fertilizer"
    ],
    prevention: [
      "Test soil pH and electrical conductivity (EC) regularly",
      "Apply chelated micronutrient foliar sprays for rapid correction",
      "Maintain calibrated fertigation with balanced N-P-K ratios"
    ],
    accentColor: "border-lime-500/40 text-lime-400 bg-lime-500/10"
  }
];

export const LEAF_HOTSPOTS = [
  {
    id: "spot-1",
    title: "Angular Chlorotic Spots",
    x: "38%",
    y: "32%",
    observation: "Angular yellow patches strictly confined between major vascular veins.",
    possibleCauses: "Downy Mildew (Pseudoperonospora cubensis) or Angular Leaf Spot (bacterial).",
    symptomsToCheck: "Examine the underside during early morning for purplish-gray fuzzy spores (indicates Downy Mildew) or dried white bacterial crust (indicates Angular Leaf Spot).",
    screeningRole: "Screening this lesion pattern isolates early foliar water-mold before it coalesces into whole-leaf necrosis."
  },
  {
    id: "spot-2",
    title: "White Powdery Colony",
    x: "68%",
    y: "46%",
    observation: "Discrete, talcum-powder-like white circular colonies resting on the lamina surface.",
    possibleCauses: "Powdery Mildew (Podosphaera xanthii) fungal mycelia and conidiophores.",
    symptomsToCheck: "Check whether the white dust easily rubs off with a fingertip and inspect shaded lower petioles for early colonies.",
    screeningRole: "Early image screening distinguishes superficial powdery colonies from mineral spray residue."
  },
  {
    id: "spot-3",
    title: "Vascular Vein Margins",
    x: "24%",
    y: "65%",
    observation: "Prominent, structural vascular network channeling water and photosynthates throughout the blade.",
    possibleCauses: "Intact healthy vascular tissue, or vascular blockage if runner branch wilts suddenly.",
    symptomsToCheck: "Check for wilting despite moist soil or dark gummy lesions at the petiole junction.",
    screeningRole: "The classifier analyzes vascular demarcation to differentiate vein-bounded lesions from spreading fungal spots."
  },
  {
    id: "spot-4",
    title: "Marginal Necrosis & Scorching",
    x: "78%",
    y: "74%",
    observation: "Crisp brown or yellow tissue advancing along outer leaf margins.",
    possibleCauses: "Potassium deficiency, salt accumulation, or late-stage Gummy Stem Blight.",
    symptomsToCheck: "Inspect root zone salinity and check for amber gummy exudates along main runner stems.",
    screeningRole: "Provides differential probability between abiotic nutrient stress and pathogen attacks."
  }
];

export const SYMPTOM_EXPLORER_OPTIONS = [
  {
    id: "yellowing",
    label: "Yellowing or Pale Areas",
    possibleCauses: "Downy Mildew (angular yellow blocks), Nitrogen deficiency (uniform lower leaf yellowing), or Iron deficiency (interveinal yellowing with green veins).",
    whatToCheck: "Check whether yellowing is bounded by veins (Downy Mildew) or uniform across the entire lamina (Nitrogen).",
    whyPhotoHelps: "A high-resolution photograph reveals vein boundaries and spatial pattern that distinguish nutritional chlorosis from infectious pathogens."
  },
  {
    id: "angular-spots",
    label: "Angular or Vein-Bounded Spots",
    possibleCauses: "Downy Mildew or Angular Leaf Spot.",
    whatToCheck: "Inspect leaf undersides: fuzzy gray spore felt indicates Downy Mildew; dried white crust or shot-holes indicate Angular Leaf Spot.",
    whyPhotoHelps: "The ConvNeXt classifier captures micro-spatial features that separate bacterial angular lesions from oomycete structures."
  },
  {
    id: "brown-lesions",
    label: "Brown or Dark Lesions",
    possibleCauses: "Anthracnose, Gummy Stem Blight, or advanced Downy Mildew necrosis.",
    whatToCheck: "Look for concentric rings, brittle shot-hole tearing, or cracked stem cankers oozing amber resin.",
    whyPhotoHelps: "Classifier evaluates lesion margins, color gradients, and tissue texture to determine pathogen type."
  },
  {
    id: "white-powder",
    label: "White Powder-Like Patches",
    possibleCauses: "Powdery Mildew or chemical spray residues.",
    whatToCheck: "Check whether the white coating rubs off and whether spots appear first on shaded lower leaves and petioles.",
    whyPhotoHelps: "The model differentiates the circular mycelial growth pattern of powdery mildew from uniform spray residues."
  },
  {
    id: "wilting",
    label: "Sudden Vine Wilting",
    possibleCauses: "Bacterial Wilt (Erwinia tracheiphila), Fusarium root rot, or nematode damage.",
    whatToCheck: "Cut the stem near the base and slowly separate halves to check for viscous sticky bacterial threads.",
    whyPhotoHelps: "While wilt involves the vascular stem, leaf symptom screening helps rule out foliar blights as primary causes."
  },
  {
    id: "healthy",
    label: "No Obvious Symptoms (Vibrant Green)",
    possibleCauses: "Healthy vigorous cucumber leaf with balanced cellular vigor.",
    whatToCheck: "Check undersides periodically for early arrivals of aphids, whiteflies, or initial chlorotic flecks.",
    whyPhotoHelps: "Confirms optimal photosynthetic health and serves as a verified baseline for agricultural records."
  }
];
