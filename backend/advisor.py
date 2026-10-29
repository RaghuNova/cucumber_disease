"""
Agronomic Advisor Module for CucumberCare AI:
Provides authoritative plant pathology guidance with resilient multi-tier fallback:
Tier 1: Google Gemini (gemini-3.6-flash / gemini-3.5-flash-lite) via direct HTTP with 3.5s timeout
Tier 2: Groq API (llama-3.3-70b-versatile) fallback if configured with 3.5s timeout
Tier 3: Expert Static Botanical Pathology Knowledge Base (guaranteed instant response)

Includes:
- Condition-specific clinical knowledge for all 8 classes
- Distinct Section B: Nutritional & Physiological Assessment
- Kannada Voice Summary for agricultural voice support
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("advisor")

# Comprehensive static botanical repository for all 8 cucumber conditions
STATIC_PATHOLOGY_DATABASE: Dict[str, Dict[str, Any]] = {
    "Downy Mildew": {
        "scientific_name": "Pseudoperonospora cubensis (Oomycete)",
        "summary": "Downy mildew is a rapid and destructive water-mold disease affecting cucurbits in humid, temperate, and greenhouse environments.",
        "what_it_is": "A high-consequence water-mold (oomycete) pathogen that infects cucumber foliage, systematically destroying photosynthetic leaf area under humid or overhead-irrigated conditions.",
        "common_visible_symptoms": [
            "Angular, chlorotic yellow spots strictly bounded by leaf veins on the upper leaf surface",
            "Purplish-gray to dark felty spore growth on the underside directly beneath lesions during high humidity",
            "Rapid coalescence of lesions into brown necrotic patches, creating a scorched foliage appearance"
        ],
        "likely_causes": [
            "Prolonged leaf wetness (>6 hours) from overhead watering or heavy morning dew",
            "High relative humidity (85-100%) and moderate temperatures (15°C - 22°C)",
            "Dense canopy planting restricting internal air movement"
        ],
        "distinguishing_features": "Angular borders defined strictly by major leaf veins differentiate Downy Mildew from Anthracnose (circular lesions) and powdery mildew (superficial white talcum powder). Felt-like sporulation on the underside confirms the diagnosis.",
        "immediate_actions": [
            "Cease all overhead sprinkler irrigation immediately; transition to sub-canopy drip lines at soil level.",
            "Prune and safely bag heavily blighted lower leaves away from the field to reduce spore load.",
            "Apply approved protectant fungicides (e.g., copper hydroxide or mancozeb) to uninfected foliage according to label specifications."
        ],
        "prevention_checklist": [
            "Plant certified downy-mildew-tolerant cucumber cultivars.",
            "Ensure wide vine spacing (45-60 cm) to maximize air movement and rapid morning drying.",
            "Inspect leaf undersides twice weekly in early morning during humid or overcast spells."
        ],
        "when_to_seek_expert": "Consult a certified extension specialist or university plant clinic if lesions rapidly spread across 20% or more of the canopy within 48 hours, or if registered fungicides fail to arrest symptom progression.",
        "treatment_cautions": "Confirm active fungal sporulation before applying chemical fungicides. Avoid applying copper sprays during hot midday temperatures (>32°C) to prevent foliar phytotoxicity.",
        "kannada_summary": "ಸೌತೆಕಾಯಿ ಎಲೆಗಳಲ್ಲಿ ಡೌನಿ ಮಿಲ್ಡ್ಯೂ ರೋಗದ ಕೋನೀಯ ಹಳದಿ ಕಲೆಗಳು ಕಂಡುಬಂದಿವೆ. ನೀರನ್ನು ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸದೆ ಬುಡಕ್ಕೆ ಮಾತ್ರ ಹಾಯಿಸಿ ಮತ್ತು ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡಿ. ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ."
    },
    "Powdery Mildew": {
        "scientific_name": "Podosphaera xanthii / Golovinomyces cichoracearum (Fungi)",
        "summary": "A ubiquitous fungal pathogen characterized by powdery white talc-like patches on leaves and stems, reducing photosynthetic capacity.",
        "what_it_is": "An obligate biotrophic fungal pathogen that colonizes epidermal leaf cells, producing millions of powdery white conidia that coat cucumber leaves and petioles.",
        "common_visible_symptoms": [
            "White circular powdery spots appearing first on older lower leaves, petioles, and shaded stems",
            "Spots expand into a continuous flour-like white coating covering both leaf surfaces",
            "Infected leaves turn chlorotic, senesce prematurely, and leave developing cucumbers exposed to sunscald"
        ],
        "likely_causes": [
            "Warm dry weather (20°C - 27°C) combined with high relative humidity (>70%) at night",
            "Shaded, poorly ventilated canopies with low direct sunlight penetration",
            "Surplus nitrogen fertilization promoting tender, highly susceptible leaf tissue"
        ],
        "distinguishing_features": "White flour-like fungal growth rubs off easily with a fingertip. Unlike downy mildew, powdery mildew does not require free water or dew on the leaf to germinate and infect.",
        "immediate_actions": [
            "Improve sunlight exposure by pruning crowded, non-bearing interior runners.",
            "Apply potassium bicarbonate, cold-pressed neem oil formulation, or sulfur-based protectant in early morning.",
            "Avoid excessive overhead nitrogen feeding that stimulates soft, susceptible growth."
        ],
        "prevention_checklist": [
            "Select resistant or tolerant cucumber varieties.",
            "Maintain balanced fertilization, avoiding surplus soluble nitrogen.",
            "Rotate crops annually with non-cucurbit families."
        ],
        "when_to_seek_expert": "Contact an agricultural extension agent if powdery mildew appears early in the seedling/vegetative stage, or if standard organic controls (neem/potassium bicarbonate) fail to halt colony expansion.",
        "treatment_cautions": "Never apply sulfur within 14 days of an oil spray (e.g. neem oil), and avoid applying sulfur when ambient temperatures exceed 32°C to prevent severe foliar burn.",
        "kannada_summary": "ಸೌತೆ ಗಿಡದ ಎಲೆಗಳ ಮೇಲೆ ಬೂದಿ ರೋಗದ ಬಿಳಿ ಕಲೆಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆ. ಎಲೆಗಳಿಗೆ ಸಾಕಷ್ಟು ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಗಾಳಿ ಸಿಗುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಗಂಧಕದ ದ್ರಾವಣವನ್ನು ಸಿಂಪಡಿಸಿ."
    },
    "Healthy Leaves": {
        "scientific_name": "Cucumis sativus (Vigorous Baseline)",
        "summary": "The foliage displays healthy deep green pigmentation, intact cellular margins, and robust photosynthetic tissue with no visible target pathogen colonies.",
        "what_it_is": "Vigorous cucumber leaf tissue exhibiting balanced chlorophyll distribution, intact vascular veins, and full photosynthetic efficiency without detectable target disease symptoms.",
        "common_visible_symptoms": [
            "Uniform emerald to forest green lamina without chlorotic spotting or mosaic patterns",
            "Intact leaf margins and prominent, clean vascular leaf veins",
            "Clear abaxial (underside) surface with no fungal mycelium, sporulation, or bacterial crust"
        ],
        "likely_causes": [
            "Balanced soil macronutrients (N-P-K) and essential micronutrients",
            "Optimal soil moisture with well-draining soil and calibrated irrigation",
            "Adequate light levels (>6-8 hours daily) and steady canopy ventilation"
        ],
        "distinguishing_features": "Total absence of vein-bounded yellowing, circular necrotic craters, powdery white mycelia, or wilting runners.",
        "immediate_actions": [
            "Continue standard agronomic monitoring routines and clean irrigation practices.",
            "Maintain consistent drip irrigation schedules to prevent moisture stress.",
            "Scout leaf undersides weekly for early pest vectors (aphids, thrips, spider mites)."
        ],
        "prevention_checklist": [
            "Keep soil mulch clean and free of decaying organic debris.",
            "Sanitize pruning tools and harvesting shears between plant rows.",
            "Maintain balanced fertigation to support ongoing vegetative and flowering phases."
        ],
        "when_to_seek_expert": "Consult a plant health specialist if you observe sudden localized wilting, leaf cupping, or unexpected yield drops despite healthy-looking foliage.",
        "treatment_cautions": "Do not apply chemical pesticides or fungicides proactively to healthy leaves; unnecessary chemical treatments waste resources and harm beneficial predators.",
        "kannada_summary": "ನಿಮ್ಮ ಸೌತೆಕಾಯಿ ಗಿಡದ ಎಲೆಗಳು ಸಂಪೂರ್ಣ ಆರೋಗ್ಯಕರವಾಗಿವೆ. ಗಿಡಗಳಿಗೆ ಸರಿಯಾದ ಪ್ರಮಾಣದಲ್ಲಿ ನೀರು ಮತ್ತು ಪೋಷಕಾಂಶಗಳನ್ನು ನೀಡುವುದನ್ನು ಮುಂದುವರಿಸಿ. ವಾರಕ್ಕೊಮ್ಮೆ ಎಲೆಗಳ ಕೆಳಭಾಗವನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿರಿ."
    },
    "Angular Leaf Spot": {
        "scientific_name": "Pseudomonas syringae pv. lachrymans (Bacterium)",
        "summary": "A widespread bacterial disease causing water-soaked, strictly angular spots bounded by leaf veins that later dry out and tear, leaving ragged shot-holes.",
        "what_it_is": "A bacterial foliar disease that penetrates leaf stomata and hydathodes, causing vein-delimited water-soaked lesions that dry into characteristic ragged shot-holes.",
        "common_visible_symptoms": [
            "Small water-soaked lesions that conform tightly to the angular pattern of leaf veins",
            "White dried bacterial ooze or crust visible on leaf undersides in early morning",
            "Dead central tissue drops out, giving the leaf a shredded or shot-hole appearance"
        ],
        "likely_causes": [
            "Splashing rain, overhead sprinkler systems, or cultivating in wet fields",
            "Warm and wet weather (24°C - 28°C) with persistent leaf surface moisture",
            "Contaminated seed lots or infected plant debris from preceding seasons"
        ],
        "distinguishing_features": "Unlike Downy Mildew, Angular Leaf Spot lesions exhibit dried white bacterial crust on the underside rather than purplish-gray fungal felt, and older centers fall away leaving shot-holes.",
        "immediate_actions": [
            "Never harvest or cultivate while vines are wet with dew or rain to prevent bacterial transmission.",
            "Apply copper-based bactericides at the earliest sign of angular lesions.",
            "Remove and safely incinerate severely blighted runner foliage."
        ],
        "prevention_checklist": [
            "Plant only certified disease-free, warm-water treated seed.",
            "Implement a minimum 2-year crop rotation out of all cucurbit crops.",
            "Transition exclusively to sub-canopy drip irrigation."
        ],
        "when_to_seek_expert": "Consult an extension plant pathologist if angular leaf spot symptoms appear on fruit or stems, or if copper-resistant bacterial strains are suspected in your district.",
        "treatment_cautions": "Fungicides do not control bacterial pathogens. Only registered bactericides (e.g., fixed coppers) are effective against Pseudomonas.",
        "kannada_summary": "ಇದು ಬ್ಯಾಕ್ಟೀರಿಯಾದಿಂದ ಉಂಟಾಗುವ ಕೋನೀಯ ಎಲೆ ಚುಕ್ಕೆ ರೋಗವಾಗಿದೆ. ಗಿಡಗಳು ತೇವವಾಗಿದ್ದಾಗ ಅವುಗಳನ್ನು ಮುಟ್ಟಬೇಡಿ, ಇದರಿಂದ ರೋಗ ಇತರ ಗಿಡಗಳಿಗೆ ಹರಡುತ್ತದೆ. ತಾಮ್ರಯುಕ್ತ ಬ್ಯಾಕ್ಟೀರಿಯಾನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ."
    },
    "Anthracnose": {
        "scientific_name": "Colletotrichum orbiculare (Fungus)",
        "summary": "A fungal pathogen producing circular to irregular water-soaked spots on leaves that enlarge and turn dark brown, often developing salmon-pink gelatinous spore masses in humid weather.",
        "what_it_is": "A destructive fungal foliar and fruit pathogen that causes circular to oval necrotic lesions across leaves, stems, and cucumbers during warm, rainy weather.",
        "common_visible_symptoms": [
            "Circular to oval yellowish spots that expand and turn reddish-brown or blackish",
            "Shot-hole appearance as brittle dried lesion centers crack and fall away",
            "Sunken, dark circular craters on stems and fruit containing pinkish spore gelatin"
        ],
        "likely_causes": [
            "Frequent rainfall, overhead irrigation, and warm temperatures (20°C - 27°C)",
            "Poor air circulation within dense canopy trellises",
            "Survival of fungal conidia on infected crop residues from previous seasons"
        ],
        "distinguishing_features": "Circular to oval spots that cut across leaf veins, contrasting with Downy Mildew and Angular Leaf Spot which are strictly bounded by veins.",
        "immediate_actions": [
            "Remove diseased leaves and isolate affected planting rows.",
            "Apply registered protective fungicides (e.g., chlorothalonil or azoxystrobin) in accordance with label instructions.",
            "Transition away from sprinkler irrigation to minimize spore splash."
        ],
        "prevention_checklist": [
            "Ensure 2 to 3-year crop rotations with non-cucurbit crops.",
            "Deep plow or destroy infected vine residues immediately following harvest.",
            "Maintain clean trellising systems to elevate vines off moist ground."
        ],
        "when_to_seek_expert": "Seek agronomist advice if sunken anthracnose lesions appear on developing cucumbers, which can cause total post-harvest fruit decay.",
        "treatment_cautions": "Observe pre-harvest intervals (PHI) strictly when applying fungicides to fruiting cucumber vines.",
        "kannada_summary": "ಇದು ಆಂಥ್ರಾಕ್ನೋಸ್ ಶಿಲೀಂಧ್ರ ರೋಗದ ಲಕ್ಷಣವಾಗಿದೆ. ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಅಥವಾ ಕಪ್ಪು ಬಣ್ಣದ ದುಂಡಗಿನ ಕಲೆಗಳು ಉಂಟಾಗುತ್ತವೆ. ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ."
    },
    "Bacterial Wilt": {
        "scientific_name": "Erwinia tracheiphila (Bacterium)",
        "summary": "A fatal vascular bacterial infection transmitted by cucumber beetles that blocks xylem vessels, causing rapid, irreversible vine wilting.",
        "what_it_is": "A lethal vascular bacterial pathogen transmitted by cucumber beetles that multiplies inside the plant's water-conducting xylem vessels, cutting off water supply to runners.",
        "common_visible_symptoms": [
            "Individual leaves wilt during the heat of day and recover initially at night, followed by permanent wilting",
            "Rapid collapse of entire runner branches while leaves remain dull green",
            "Sticky, viscous bacterial threads form when cut stem ends are pressed together and slowly separated"
        ],
        "likely_causes": [
            "Feeding and transmission by striped or spotted cucumber beetles (Acalymma vittatum)",
            "Warm summer temperatures accelerating beetle activity and bacterial proliferation",
            "Mechanical beetle feeding wounds on young stems allowing bacterial entry"
        ],
        "distinguishing_features": "Sudden wilting of whole runners while leaves remain green, confirmed by the diagnostic sticky bacterial strand test between cut stems. Foliar leaf spots are absent.",
        "immediate_actions": [
            "Immediately rogue and incinerate infected wilted vines to prevent spread to neighboring healthy plants.",
            "Deploy yellow sticky traps or row covers to suppress beetle vector populations.",
            "Apply targeted insecticides or botanical pyrethrins when beetle counts exceed economic thresholds."
        ],
        "prevention_checklist": [
            "Deploy floating row covers over cucumber seedlings until flowering.",
            "Monitor beetles early in spring before egg laying begins.",
            "Rotate field locations away from prior year cucurbit plots."
        ],
        "when_to_seek_expert": "Contact an entomologist or extension specialist immediately upon first confirmation of bacterial wilt to establish an aggressive beetle management plan for the district.",
        "treatment_cautions": "There is no chemical cure for a plant once infected with bacterial wilt; systemic antibiotics cannot restore blocked xylem tissue.",
        "kannada_summary": "ಇದು ಸೌತೆ ಗಿಡದ ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಸೊರಗು ರೋಗವಾಗಿದೆ. ದುಂಬಿಗಳ ಕಡಿತದಿಂದ ಈ ರೋಗವು ಹರಡುತ್ತದೆ. ರೋಗಪೀಡಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣವೇ ಕಿತ್ತು ಸುಟ್ಟುಹಾಕಿ ಮತ್ತು ಜೀರುಂಡೆಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ."
    },
    "Gummy Stem Blight": {
        "scientific_name": "Stagonosporopsis cucurbitacearum / Didymella bryoniae (Fungus)",
        "summary": "A damaging fungal disease producing circular brown lesions on leaves and cracked, bleeding cankers on stems that exude an amber or gummy sap.",
        "what_it_is": "A fungal pathogen that causes leaf blighting, black rot on fruit, and cortical stem cankers that crack and exude a characteristic gummy amber resin.",
        "common_visible_symptoms": [
            "Brown wedge-shaped lesions advancing inward from leaf margins",
            "Stem cankers near leaf nodes that crack and ooze an amber-colored gummy resin",
            "Tiny black specks (pycnidia/perithecia) visible embedded in older bleached stem lesions"
        ],
        "likely_causes": [
            "High moisture, frequent precipitation, and temperatures between 18°C - 25°C",
            "Stem wounds caused by pruning shears, cucumber beetles, or trellis friction",
            "Infected seed lots or crop residues from prior cucurbit plantings"
        ],
        "distinguishing_features": "Amber or brown gummy resin oozing from stem cankers and distinct wedge-shaped marginal leaf blights with tiny black pycnidia specks.",
        "immediate_actions": [
            "Apply targeted fungicides with protectant and systemic action (e.g., chlorothalonil + tebuconazole).",
            "Avoid pruning or trellis training during wet weather to prevent opening fresh stem wounds.",
            "Disinfect pruning shears with 70% alcohol between cuts."
        ],
        "prevention_checklist": [
            "Use certified clean seed treated with appropriate fungicides.",
            "Maintain trellis training to keep main stems dry and clean.",
            "Rotate crops for at least 2 years without cucurbit hosts."
        ],
        "when_to_seek_expert": "Consult an extension agronomist if gummy stem cankers appear near the crown or soil line, which can rapidly strangle the entire plant.",
        "treatment_cautions": "Fungicide resistance has been documented in Stagonosporopsis strains; rotate chemical modes of action (FRAC groups) strictly.",
        "kannada_summary": "ಇದು ಅಂಟು ಕಾಂಡದ ರೋಗವಾಗಿದೆ. ಗಿಡದ ಕಾಂಡದ ಮೇಲೆ ಬಿರುಕು ಬಿಟ್ಟು ಅಂಟಿನಂತಹ ದ್ರವ ಸೋರುತ್ತದೆ. ತೇವಾಂಶವನ್ನು ನಿಯಂತ್ರಿಸಿ ಮತ್ತು ಕಾಂಡಗಳಿಗೆ ಗಾಯವಾಗದಂತೆ ಎಚ್ಚರವಹಿಸಿ."
    },
    "Nutrient Deficiency": {
        "scientific_name": "Abiotic Physiological Condition",
        "summary": "Non-pathogenic physiological chlorosis typically caused by imbalances in Nitrogen, Potassium, Iron, or Magnesium in the root zone.",
        "what_it_is": "An abiotic, non-infectious physiological disorder resulting from soil nutrient depletion, pH lockout, or root zone waterlogging that prevents adequate mineral translocation.",
        "common_visible_symptoms": [
            "Interveinal chlorosis (yellow tissue between dark green veins) on young upper leaves (Iron or Manganese deficiency)",
            "Uniform yellowing beginning on oldest lower foliage (Nitrogen deficiency)",
            "Marginal scorching or yellowing along leaf perimeters (Potassium deficiency)"
        ],
        "likely_causes": [
            "Incorrect soil or fertigation pH (<5.8 or >7.2) locking out micronutrient availability",
            "Waterlogged or compacted soil restricting root respiration and active uptake",
            "Surge in vegetative growth without adequate balanced fertilizer supplementation"
        ],
        "distinguishing_features": "Symmetrical patterns across leaves (such as uniform interveinal chlorosis or bilateral marginal yellowing) with clean undersides lacking fungal spores or bacterial ooze.",
        "immediate_actions": [
            "Test root zone soil pH and Electrical Conductivity (EC) immediately before applying treatments.",
            "Apply a foliar micronutrient spray containing chelated Iron, Magnesium, and Zinc for quick correction.",
            "Ensure proper root zone aeration, verify drainage, and avoid overwatering."
        ],
        "prevention_checklist": [
            "Perform regular soil nutrient testing before each planting cycle.",
            "Use balanced, buffered water-soluble fertilizers tailored to cucumber growth stages.",
            "Incorporate well-decomposed organic compost to improve cation exchange capacity."
        ],
        "when_to_seek_expert": "Consult a certified crop advisor or soil laboratory if symptoms worsen after nutrient correction, as root nematodes or vascular root rot may be impairing nutrient uptake.",
        "treatment_cautions": "Do not guess fertilizer rates or apply excessive nitrogen, which can burn roots and induce secondary calcium deficiency in developing fruit.",
        "kannada_summary": "ಎಲೆಗಳಲ್ಲಿ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಕಂಡುಬಂದಿದೆ. ಮಣ್ಣಿನ ಗುಣಮಟ್ಟ ಮತ್ತು ರಂಜಕ-ಸಾರಜನಕ ಪ್ರಮಾಣವನ್ನು ಪರೀಕ್ಷಿಸಿ. ಎಲೆಗಳ ಮೇಲೆ ಲಘು ಪೋಷಕಾಂಶಗಳ ಸಿಂಪಡಣೆ ಮಾಡುವುದರಿಂದ ಇದನ್ನು ತ್ವರಿತವಾಗಿ ಸರಿಪಡಿಸಬಹುದು."
    }
}

# Dedicated Nutritional & Physiological Assessment Database
NUTRITIONAL_PHYSIOLOGICAL_DATABASE: Dict[str, Any] = {
    "nutrients": [
        {
            "nutrient": "Nitrogen (N)",
            "category": "Macronutrient (Mobile)",
            "symptoms": "Uniform pale-green to chlorotic yellowing appearing first on oldest, lower leaves; runner elongation slows and foliage remains small.",
            "distinction": "Yellowing is uniform across the entire lamina, unlike Downy Mildew's angular vein-bounded yellow blocks.",
            "action": "Verify soil nitrate levels; provide balanced calcium nitrate or ammonium nitrate fertigation calibrated for vine stage."
        },
        {
            "nutrient": "Potassium (K)",
            "category": "Macronutrient (Mobile)",
            "symptoms": "Marginal chlorosis advancing to crisp necrosis and bronzing along outer leaf borders; fruits may develop tapered, bottle-shaped ends.",
            "distinction": "Symmetrical perimeter scorching differs from Gummy Stem Blight, which exhibits irregular brown wedge lesions and bleeding stem cankers.",
            "action": "Test soil available potassium; apply foliar potassium sulfate or adjust N:K fertigation ratio during heavy fruit set."
        },
        {
            "nutrient": "Magnesium (Mg)",
            "category": "Secondary Macronutrient (Mobile)",
            "symptoms": "Distinct interveinal chlorosis (yellowing between primary veins while main veins remain dark green) on mature, lower leaves.",
            "distinction": "Major veins remain dark green, unlike Powdery Mildew which coats the veins and leaf surface with white fungal talcum powder.",
            "action": "Check soil pH (often locked out in acidic soils < 5.8); apply foliar Epsom salt (magnesium sulfate) solution for quick response."
        },
        {
            "nutrient": "Iron (Fe)",
            "category": "Micronutrient (Immobile)",
            "symptoms": "Severe, vivid interveinal chlorosis appearing strictly on the youngest expanding top leaves; in severe cases leaves emerge ivory-white.",
            "distinction": "Restricted strictly to the newest terminal leaves, whereas nitrogen and magnesium deficiencies start on the oldest lower foliage.",
            "action": "Test soil pH (alkaline soils > 7.2 induce iron lockout); apply chelated iron (Fe-EDDHA for high pH, Fe-EDTA for neutral) to root zone."
        }
    ],
    "abiotic_stresses": [
        {
            "factor": "Soil / Fertigation pH Lockout",
            "impact": "Root zone pH outside 5.8 - 6.8 severely binds phosphorus and micronutrients, causing deficiency symptoms even in fertile soils."
        },
        {
            "factor": "Root Zone Waterlogging & Oxygen Depletion",
            "impact": "Excessive irrigation or poorly drained clay soils suffocate fine root hairs, inhibiting active nutrient uptake and mimicking starvation."
        },
        {
            "factor": "Temperature & Vapour Pressure Deficit (VPD)",
            "impact": "Extreme heat (>35°C) or cold root temperatures (<15°C) halt transpiration stream, disrupting calcium and potassium translocation."
        }
    ],
    "testing_recommendations": [
        "Perform a calibrated soil slurry pH and Electrical Conductivity (EC) test in the active root zone before applying corrective fertilizers.",
        "Submit a petiole sap or dried leaf tissue sample to a certified agricultural testing laboratory if symptoms persist.",
        "Inspect root tips for root-knot nematode galls or waterlogged black root rot before assuming a foliar fertilizer deficiency."
    ]
}

class AgronomicAdvisor:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.groq_key = os.getenv("GROQ_API_KEY", "")

    def get_advice(self, predicted_class: str, confidence: float, top_3: list) -> Dict[str, Any]:
        """
        Generates detailed agronomic advice for the predicted cucumber condition.
        Separates Section A (Primary Disease/Health Classification) from Section B (Nutritional Assessment).
        Resilient: Tries Gemini (3.5s timeout) -> Groq (3.5s timeout) -> Static botanical database.
        """
        canonical_class = predicted_class
        if canonical_class == "Healthy":
            canonical_class = "Healthy Leaves"

        static_data = STATIC_PATHOLOGY_DATABASE.get(
            canonical_class,
            STATIC_PATHOLOGY_DATABASE["Healthy Leaves"]
        )

        provider_used = "static_botanical"
        ai_narrative = None
        kannada_speech = static_data.get("kannada_summary", "")

        candidates_str = ", ".join([f"{c.get('class_name')} ({c.get('probability', 0):.1%})" for c in top_3])

        # 1. Attempt Gemini via REST Interactions API with strict 3.5s timeout
        if self.gemini_key:
            for model_name in ["gemini-3.6-flash", "gemini-3.5-flash-lite"]:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/interactions?key={self.gemini_key}"
                    prompt = (
                        f"You are a plant pathologist and cucurbit agronomist. "
                        f"A cucumber leaf screening found '{canonical_class}' with {confidence:.1%} confidence. "
                        f"Top candidates: {candidates_str}. "
                        f"Provide a 2-sentence description of the symptom pattern and 3 concise field action steps. "
                        f"Maintain a scientific, evidence-based tone without fabricating cure guarantees."
                    )
                    resp = requests.post(url, json={"model": model_name, "input": prompt}, timeout=3.5)
                    if resp.status_code == 200:
                        data = resp.json()
                        out_text = data.get("outputText", data.get("output_text", ""))
                        if out_text:
                            ai_narrative = out_text.strip()
                            provider_used = "gemini"
                            logger.info(f"Received advice from {model_name}.")
                            break
                    else:
                        logger.warning(f"Gemini {model_name} returned status {resp.status_code}")
                except Exception as e:
                    logger.warning(f"Gemini {model_name} failed or timed out: {e}")

        # 2. Attempt Groq fallback if configured and Gemini failed
        if not ai_narrative and self.groq_key:
            try:
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {self.groq_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a professional cucurbit pathologist providing clear agronomic guidance."
                        },
                        {
                            "role": "user",
                            "content": f"Explain '{canonical_class}' in cucumbers ({confidence:.1%} confidence). Provide 2 sentences on disease identity and 3 bullet actions."
                        }
                    ],
                    "temperature": 0.3
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=3.5)
                if resp.status_code == 200:
                    ai_narrative = resp.json()["choices"][0]["message"]["content"].strip()
                    provider_used = "groq"
                    logger.info("Successfully received Groq response.")
            except Exception as e:
                logger.warning(f"Groq API call failed: {e}")

        # 3. Static botanical fallback
        if not ai_narrative:
            provider_used = "static_botanical"
            ai_narrative = (
                f"{static_data['summary']}\n\n"
                f"Key Symptoms to Observe:\n" +
                "\n".join([f"• {s}" for s in static_data["common_visible_symptoms"]]) +
                f"\n\nRecommended Immediate Field Action:\n" +
                "\n".join([f"{idx+1}. {a}" for idx, a in enumerate(static_data["immediate_actions"])])
            )

        # Build Section B Nutritional Assessment object
        is_primary_nutrient = (canonical_class == "Nutrient Deficiency")
        nutrient_assessment = {
            "is_primary_prediction": is_primary_nutrient,
            "heading": "Section B: Nutritional & Physiological Assessment",
            "context_note": (
                "The image classifier identified Nutrient Deficiency as the primary condition. "
                "Below is the targeted assessment of possible nutritional and root-zone causes."
                if is_primary_nutrient else
                "The image classifier identified an infectious disease or healthy foliage as the primary condition. "
                "This nutritional assessment is provided as a secondary differential comparison, because visual yellowing "
                "or marginal scorch can sometimes co-exist with or mimic nutrient imbalances."
            ),
            "nutrients": NUTRITIONAL_PHYSIOLOGICAL_DATABASE["nutrients"],
            "abiotic_stresses": NUTRITIONAL_PHYSIOLOGICAL_DATABASE["abiotic_stresses"],
            "testing_recommendations": NUTRITIONAL_PHYSIOLOGICAL_DATABASE["testing_recommendations"]
        }

        return {
            # Section A: Primary Classification & Care
            "condition": canonical_class,
            "scientific_name": static_data.get("scientific_name", "Cucumis sativus condition"),
            "provider": provider_used,
            "narrative": ai_narrative,
            "what_it_is": static_data.get("what_it_is", static_data.get("summary", "")),
            "common_visible_symptoms": static_data.get("common_visible_symptoms", []),
            "likely_causes": static_data.get("likely_causes", []),
            "distinguishing_features": static_data.get("distinguishing_features", ""),
            "immediate_actions": static_data.get("immediate_actions", []),
            "prevention_checklist": static_data.get("prevention_checklist", []),
            "when_to_seek_expert": static_data.get("when_to_seek_expert", ""),
            "treatment_cautions": static_data.get("treatment_cautions", ""),
            "kannada_audio_text": kannada_speech,
            
            # Section B: Nutritional & Physiological Assessment
            "nutrient_assessment": nutrient_assessment,
            
            "disclaimer": (
                "Educational Screening Notice: This analysis is generated by an automated AI image classifier. "
                "Visual symptoms can mimic other physiological stresses. Verify with local agricultural extension "
                "or professional crop advisors prior to applying chemical treatments."
            )
        }

_advisor_instance = None

def get_advisor() -> AgronomicAdvisor:
    global _advisor_instance
    if _advisor_instance is None:
        _advisor_instance = AgronomicAdvisor()
    return _advisor_instance
