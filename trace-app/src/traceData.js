export const TRACE_CLIENTS = [
  {
    id: "client-a",
    callSign: "A",
    name: "Anika Raman",
    age: 19,
    condition: "Domestic violence escalation",
    language: "Tamil / English",
    primaryLanguage: "ta",
    behavior: "Likely to avoid crowds and move toward lit transit corridors.",
    medicalRisk: 68,
    mobilityRisk: 42,
    threatRisk: 91,
    address: "Kattankulathur, Tamil Nadu 603203, India",
    zone: "Kattankulathur education corridor",
    coords: { lat: 12.8231, lng: 80.0453 },
    trustedContacts: [
      { id: "contact-a1", name: "Raman Family Bridge", relation: "Family", channel: "Voice + SMS" },
      { id: "contact-a2", name: "Campus Safety Ally", relation: "Trusted contact", channel: "Secure app ping" },
    ],
    familyRouting: [
      "Family stabilization callback within 15 minutes",
      "Trauma referral for one guardian and one sibling",
    ],
    situation:
      "Threat escalation reported near hostels after repeated unwanted contact.",
  },
  {
    id: "client-b",
    callSign: "B",
    name: "Meera Das",
    age: 24,
    condition: "Acute panic with disorientation",
    language: "Tamil / English / Hindi",
    primaryLanguage: "en",
    behavior: "May freeze in bright public areas and avoid direct questions.",
    medicalRisk: 79,
    mobilityRisk: 35,
    threatRisk: 63,
    address: "Thyagaraya Nagar, Chennai, Tamil Nadu 600017, India",
    zone: "T. Nagar retail district",
    coords: { lat: 13.0418, lng: 80.2341 },
    trustedContacts: [
      { id: "contact-b1", name: "Das Family Desk", relation: "Family", channel: "Voice + WhatsApp" },
      { id: "contact-b2", name: "Workplace Guardian", relation: "Trusted contact", channel: "Secure app ping" },
    ],
    familyRouting: [
      "Counselor introduction for family point person",
      "Trauma debrief for workplace contact",
    ],
    situation:
      "Rapid disorientation reported after a stalking incident in a crowded retail block.",
  },
  {
    id: "client-c",
    callSign: "C",
    name: "Sara Khan",
    age: 31,
    condition: "High-risk missing person alert",
    language: "Hindi / English",
    primaryLanguage: "hi",
    behavior: "May avoid police sirens and prefer enclosed commercial spaces.",
    medicalRisk: 58,
    mobilityRisk: 47,
    threatRisk: 88,
    address: "Connaught Place, New Delhi, Delhi 110001, India",
    zone: "Connaught Place central district",
    coords: { lat: 28.6315, lng: 77.2167 },
    trustedContacts: [
      { id: "contact-c1", name: "Khan Family Line", relation: "Family", channel: "Voice + SMS" },
      { id: "contact-c2", name: "Safe House Liaison", relation: "Trusted contact", channel: "Secure app ping" },
    ],
    familyRouting: [
      "Immediate post-recovery counseling handoff",
      "Safe housing follow-up for family escort",
    ],
    situation:
      "Protected client missed a safe check-in after leaving a verified support location.",
  },
];

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "ENG", name: "English" },
  { code: "hi", label: "HIN", name: "Hindi" },
  { code: "ta", label: "TAMIL", name: "Tamil" },
];

export const CLIENT_COPY_BY_LANGUAGE = {
  en: {
    title: "Personal Safety Dashboard",
    subtitle:
      "One-touch SOS, built-in safety guidance, and a live status bridge for the active case.",
    incidentIdle: "No active SOS. TRACE is monitoring quietly in the background.",
    incidentActive:
      "SOS is active. Verified responders, trusted contacts, and authorities have the same briefing.",
    triggerLabel: "Trigger SOS",
    triggerBusy: "Activating TRACE",
    languageTitle: "Multi-language support",
    languageBody:
      "Switch the client dashboard instantly between English, Hindi, and Tamil.",
    languageNote: "Built-in language pack active. No live translation request needed.",
    aiTitle: "AI condition guide",
    aiBody:
      "Gemini explains the current SOS condition, risks, and immediate stabilizing measures.",
    checklistTitle: "Immediate steps",
    checklistOne: "Move toward a visible, lit, and populated safe point if possible.",
    checklistTwo: "Keep your phone unlocked and volume low so TRACE can stay silent.",
    checklistThree: "Wait for verified responders and avoid re-telling the story repeatedly.",
    dashboardTag: "Client view",
    profileTitle: "Protected client",
    mapTitle: "Shared live map",
    statusStandbyLabel: "Standby",
    statusResolvedLabel: "Last case resolved",
    resolvedMessage:
      "The client was located, stabilized, and handed to the recovery workflow.",
    incidentActiveLabelPrefix: "Incident",
  },
  hi: {
    title: "व्यक्तिगत सुरक्षा डैशबोर्ड",
    subtitle:
      "एक-टच एसओएस, अंतर्निहित सुरक्षा मार्गदर्शन, और सक्रिय केस के लिए लाइव स्टेटस ब्रिज।",
    incidentIdle:
      "कोई सक्रिय एसओएस नहीं है। TRACE पृष्ठभूमि में शांत रूप से निगरानी कर रहा है।",
    incidentActive:
      "एसओएस सक्रिय है। सत्यापित रिस्पॉन्डर, विश्वसनीय संपर्क और प्राधिकरण एक ही ब्रीफिंग देख रहे हैं।",
    triggerLabel: "एसओएस ट्रिगर करें",
    triggerBusy: "TRACE सक्रिय हो रहा है",
    languageTitle: "बहुभाषी सहायता",
    languageBody:
      "क्लाइंट डैशबोर्ड को तुरंत English, Hindi और Tamil के बीच बदलें।",
    languageNote: "अंतर्निहित भाषा पैक सक्रिय है। किसी लाइव अनुवाद अनुरोध की जरूरत नहीं है।",
    aiTitle: "एआई स्थिति मार्गदर्शिका",
    aiBody:
      "Gemini वर्तमान एसओएस स्थिति, जोखिम और तुरंत उठाए जाने वाले स्थिरता कदम समझाता है।",
    checklistTitle: "तुरंत कदम",
    checklistOne:
      "यदि संभव हो तो दिखने वाली, रोशनी वाली और लोगों से भरी सुरक्षित जगह की ओर जाएं।",
    checklistTwo:
      "फोन अनलॉक रखें और आवाज कम रखें ताकि TRACE चुपचाप काम कर सके।",
    checklistThree:
      "सत्यापित रिस्पॉन्डर का इंतजार करें और कहानी बार-बार दोहराने से बचें।",
    dashboardTag: "क्लाइंट दृश्य",
    profileTitle: "सुरक्षित क्लाइंट",
    mapTitle: "साझा लाइव मैप",
    statusStandbyLabel: "स्टैंडबाय",
    statusResolvedLabel: "पिछला केस हल हुआ",
    resolvedMessage:
      "क्लाइंट मिल गया, स्थिर किया गया और रिकवरी वर्कफ़्लो को सौंप दिया गया।",
    incidentActiveLabelPrefix: "घटना",
  },
  ta: {
    title: "தனிப்பட்ட பாதுகாப்பு டாஷ்போர்டு",
    subtitle:
      "ஒரே தொடுதலில் SOS, உட்பொதிக்கப்பட்ட பாதுகாப்பு வழிகாட்டல், மற்றும் செயலில் உள்ள வழக்குக்கான நேரடி நிலை இணைப்பு.",
    incidentIdle:
      "செயலில் உள்ள SOS எதுவும் இல்லை. TRACE பின்னணியில் அமைதியாக கண்காணிக்கிறது.",
    incidentActive:
      "SOS செயலில் உள்ளது. சரிபார்க்கப்பட்ட பதிலளிப்பவர்கள், நம்பகமான தொடர்புகள் மற்றும் அதிகாரிகள் ஒரே விளக்கத்தைப் பார்க்கிறார்கள்.",
    triggerLabel: "SOS இயக்கவும்",
    triggerBusy: "TRACE செயல்படுகிறது",
    languageTitle: "பல்மொழி ஆதரவு",
    languageBody:
      "கிளையண்ட் டாஷ்போர்டை English, Hindi, Tamil ஆகிய மொழிகளுக்கு உடனடியாக மாற்றுங்கள்.",
    languageNote:
      "உட்பொதிக்கப்பட்ட மொழி தொகுப்பு செயல்பாட்டில் உள்ளது. நேரடி மொழிபெயர்ப்பு கோரிக்கை தேவையில்லை.",
    aiTitle: "AI நிலை விளக்கம்",
    aiBody:
      "Gemini தற்போதைய SOS நிலை, ஆபத்துகள் மற்றும் உடனடி நிலைநிறுத்தும் நடவடிக்கைகளை விளக்குகிறது.",
    checklistTitle: "உடனடி படிகள்",
    checklistOne:
      "சாத்தியமானால், தெரியும், ஒளி நிறைந்த மற்றும் மக்கள் இருக்கும் பாதுகாப்பான இடத்திற்கு செல்லுங்கள்.",
    checklistTwo:
      "TRACE அமைதியாக செயல்பட உங்கள் தொலைபேசியை திறந்த நிலையில் வைத்து ஒலியை குறைவாக வைத்திருங்கள்.",
    checklistThree:
      "சரிபார்க்கப்பட்ட பதிலளிப்பவர்களை காத்திருந்து அதே சம்பவத்தை மீண்டும் மீண்டும் சொல்ல வேண்டாம்.",
    dashboardTag: "கிளையண்ட் காட்சி",
    profileTitle: "பாதுகாக்கப்பட்ட கிளையண்ட்",
    mapTitle: "பகிரப்பட்ட நேரடி வரைபடம்",
    statusStandbyLabel: "ஸ்டாண்ட்பை",
    statusResolvedLabel: "முந்தைய வழக்கு முடிந்தது",
    resolvedMessage:
      "கிளையண்ட் கண்டுபிடிக்கப்பட்டார், நிலைநிறுத்தப்பட்டார் மற்றும் மீட்பு செயல்முறைக்கு ஒப்படைக்கப்பட்டார்.",
    incidentActiveLabelPrefix: "சம்பவம்",
  },
};

export const CLIENT_PROFILE_COPY = {
  "client-a": {
    hi: {
      condition: "घरेलू हिंसा में बढ़ती गंभीरता",
      situation:
        "बार-बार अनचाहे संपर्क के बाद हॉस्टल क्षेत्र के पास खतरे की स्थिति रिपोर्ट हुई।",
    },
    ta: {
      condition: "குடும்ப வன்முறை சூழல் தீவிரமடைதல்",
      situation:
        "மீண்டும் மீண்டும் தேவையற்ற தொடர்புகளுக்குப் பிறகு விடுதி பகுதி அருகே அச்சுறுத்தல் அதிகரித்ததாக தகவல் வந்துள்ளது.",
    },
  },
  "client-b": {
    hi: {
      condition: "तीव्र घबराहट और दिशाभ्रम",
      situation:
        "भीड़भाड़ वाले खुदरा क्षेत्र में पीछा किए जाने की घटना के बाद तेजी से दिशाभ्रम रिपोर्ट हुआ।",
    },
    ta: {
      condition: "கடுமையான பதட்டம் மற்றும் திசைத் தவறுதல்",
      situation:
        "அதிரடியான பின்தொடர்பு சம்பவத்திற்கு பிறகு கூட்டம் நிறைந்த வணிகப்பகுதியில் வேகமான திசைத் தவறுதல் பதிவாகியுள்ளது.",
    },
  },
  "client-c": {
    hi: {
      condition: "उच्च-जोखिम गुमशुदगी अलर्ट",
      situation:
        "सुरक्षित सहायता स्थान से निकलने के बाद संरक्षित क्लाइंट निर्धारित चेक-इन से चूक गई।",
    },
    ta: {
      condition: "அதிக ஆபத்து காணாமல் போன நபர் எச்சரிக்கை",
      situation:
        "சரிபார்க்கப்பட்ட ஆதரவு இடத்தை விட்டு வெளியேறிய பிறகு பாதுகாக்கப்பட்ட கிளையண்ட் பாதுகாப்பு சரிபார்ப்பை தவறவிட்டார்.",
    },
  },
};

export const SOS_LOG_SEQUENCE = [
  { delay: 0, message: "SOS received by TRACE command relay", tone: "critical" },
  { delay: 650, message: "Client coordinates locked for the active case", tone: "normal" },
  { delay: 1450, message: "Simultaneous alert package compiled", tone: "normal" },
  { delay: 2200, message: "Verified responders and trusted contacts notified", tone: "critical" },
  { delay: 3000, message: "Evidence vault started with encrypted timestamps", tone: "success" },
];

export const CROSS_MATCH_SYSTEMS = [
  {
    id: "hospital",
    label: "Hospital admissions",
    stack: "BigQuery + Pub/Sub",
    cadence: "90 sec",
    description: "Silent check across nearby hospital intake systems.",
  },
  {
    id: "shelter",
    label: "Shelter check-ins",
    stack: "BigQuery + Pub/Sub",
    cadence: "90 sec",
    description: "Silent sweep of partner shelter admissions and nightly check-ins.",
  },
  {
    id: "transit",
    label: "Transit lost-and-found",
    stack: "BigQuery + Pub/Sub",
    cadence: "90 sec",
    description: "Silent scan of nearby metro and bus lost-and-found records.",
  },
];

export const TRAUMA_RESOURCES = [
  {
    id: "trauma-1",
    name: "Victim mental health route",
    owner: "TRACE Care Network",
    action: "Reserve same-day counseling and follow-up safety planning.",
  },
  {
    id: "trauma-2",
    name: "Family support route",
    owner: "Family stabilization desk",
    action: "Open a family debrief form and assign grief-informed support.",
  },
];

function offset(center, latDelta, lngDelta) {
  return {
    lat: center.lat + latDelta,
    lng: center.lng + lngDelta,
  };
}

export function getDemoHelpServices(profile) {
  const center = profile.coords;

  return [
    {
      id: `${profile.id}-resp-police`,
      name: "Verified Responder Alpha",
      type: "police",
      category: "responder",
      coords: offset(center, 0.0052, -0.0065),
      distanceLabel: "0.8 km",
      etaMinutes: 4,
      lane: "North approach",
      description: "Silent approach patrol with domestic violence response training.",
      briefingTarget: "responders",
      verified: true,
      canResolve: true,
    },
    {
      id: `${profile.id}-resp-medical`,
      name: "Rapid Care Unit 12",
      type: "medical",
      category: "responder",
      coords: offset(center, -0.0047, 0.0059),
      distanceLabel: "1.1 km",
      etaMinutes: 6,
      lane: "East fallback",
      description: "Medical support team staged for panic, injury, or trauma response.",
      briefingTarget: "responders",
      verified: true,
      canResolve: true,
    },
    {
      id: `${profile.id}-resp-community`,
      name: "Local Safety Volunteer",
      type: "community",
      category: "responder",
      coords: offset(center, 0.0036, 0.0072),
      distanceLabel: "0.6 km",
      etaMinutes: 3,
      lane: "South corridor",
      description: "Community responder who can hold scene support until police arrive.",
      briefingTarget: "responders",
      verified: true,
      canResolve: false,
    },
    {
      id: `${profile.id}-authority`,
      name: "City Authority Control Desk",
      type: "authority",
      category: "authority",
      coords: offset(center, -0.006, -0.0073),
      distanceLabel: "1.4 km",
      etaMinutes: 7,
      lane: "Control room",
      description: "Authority desk receiving the legal briefing package and case record.",
      briefingTarget: "authorities",
      verified: true,
      canResolve: false,
    },
    {
      id: `${profile.id}-hospital`,
      name: "Partner Hospital Intake",
      type: "hospital",
      category: "service",
      coords: offset(center, 0.0071, -0.0015),
      distanceLabel: "1.8 km",
      etaMinutes: 8,
      lane: "Medical intake",
      description: "Admissions node included in the silent cross-match sweep.",
      briefingTarget: "crossmatch",
      verified: true,
      canResolve: false,
    },
    {
      id: `${profile.id}-shelter`,
      name: "Safe Shelter Route",
      type: "shelter",
      category: "service",
      coords: offset(center, -0.0024, 0.0082),
      distanceLabel: "1.3 km",
      etaMinutes: 5,
      lane: "Safe housing",
      description: "Short-term shelter placement and escort route for the active client.",
      briefingTarget: "crossmatch",
      verified: true,
      canResolve: false,
    },
    {
      id: `${profile.id}-transit`,
      name: "Transit Lost-and-Found Desk",
      type: "transit",
      category: "service",
      coords: offset(center, -0.0078, 0.0023),
      distanceLabel: "1.6 km",
      etaMinutes: 9,
      lane: "Transit desk",
      description: "Transit desk synced into the silent recovery sweep.",
      briefingTarget: "crossmatch",
      verified: true,
      canResolve: false,
    },
  ];
}

export function getActivationGroups(profile) {
  return [
    {
      id: `${profile.id}-group-responders`,
      label: "Verified local responders",
      tone: "responders",
      channel: "Secure dispatch",
      members: [
        "Verified Responder Alpha",
        "Rapid Care Unit 12",
        "Local Safety Volunteer",
      ],
    },
    {
      id: `${profile.id}-group-trusted`,
      label: "Nearby trusted contacts",
      tone: "trusted",
      channel: "Voice + secure app",
      members: profile.trustedContacts.map(contact => contact.name),
    },
    {
      id: `${profile.id}-group-authorities`,
      label: "Authorities",
      tone: "authorities",
      channel: "Control room bridge",
      members: ["City Authority Control Desk", "Women safety desk"],
    },
  ];
}

export function createIncident(profile) {
  return {
    id: `TR-${Date.now().toString().slice(-6)}`,
    profileId: profile.id,
    status: "active",
    startTime: Date.now(),
    triggeredAt: new Date().toISOString(),
    address: profile.address,
    zone: profile.zone,
    coords: profile.coords,
    locationSource: profile.locationSource ?? "demo",
    locationAccuracy: profile.locationAccuracy ?? null,
    resolvedAt: null,
    resolutionNotes: "",
  };
}

export function formatElapsed(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function formatClock(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value);
}

export function getServiceTone(type) {
  switch (type) {
    case "police":
      return "blue";
    case "medical":
    case "hospital":
      return "green";
    case "authority":
      return "amber";
    case "shelter":
      return "violet";
    case "transit":
      return "cyan";
    default:
      return "red";
  }
}
