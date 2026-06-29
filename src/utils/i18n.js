// All 22 Scheduled Languages of India + English
export const LANGUAGES = [
  'English',
  'हिन्दी (Hindi)',
  'বাংলা (Bengali)',
  'తెలుగు (Telugu)',
  'मराठी (Marathi)',
  'தமிழ் (Tamil)',
  'ગુજરાતી (Gujarati)',
  'ಕನ್ನಡ (Kannada)',
  'ଓଡ଼ିଆ (Odia)',
  'മലയാളം (Malayalam)',
  'ਪੰਜਾਬੀ (Punjabi)',
  'অસમীয়া (Assamese)',
  'मैथिली (Maithili)',
  'سنڌي (Sindhi)',
  'संस्कृतम् (Sanskrit)',
  'اردو (Urdu)',
  'नेपाली (Nepali)',
  'कोंकणी (Konkani)',
  'मणिपुरी (Manipuri)',
  'বোড়ো (Bodo)',
  'डोगरी (Dogri)',
  'سنتالی (Santali)',
  'ಕಾಶ್ਮੀರಿ (Kashmiri)',
];

// Get the language name for Gemini API (just the language name in English)
export const getLangForAI = (displayLang) => {
  if (!displayLang || displayLang === 'English') return 'English';
  const match = displayLang.match(/\(([^)]+)\)/);
  return match ? match[1] : displayLang;
};

// UI translations dictionary - covers all UI strings
const translations = {
  'हिन्दी (Hindi)': {
    "Welcome to Kisan Alert": "किसान अलर्ट में आपका स्वागत है",
    "Welcome to Kissan Alert": "किसान अलर्ट में आपका स्वागत है",
    "Welcome to FarmBuddy": "किसान अलर्ट में आपका स्वागत है",
    "Overall Health": "समग्र स्वास्थ्य",
    "Total Scans": "कुल स्कैन",
    "Issues Picked": "समस्याएं",
    "Recent AI Insight": "हालिया जानकारी",
    "Recent": "हाल ही में",
    "Crops": "फसलें",
    "Livestock": "पशुधन",
    "Recent Scans": "हालिया स्कैन",
    "Good": "अच्छा",
    "Fair": "ठीक है",
    "Critical": "गंभीर",
    "Settings": "सेटिंग्स",
    "Configure your app preferences": "ऐप प्राथमिकताएं सेट करें",
    "Save Key": "सेव करें",
    "Saved!": "सेव हो गया!",
    "Dashboard": "डैशबोर्ड",
    "Predictive Health & Yield Analytics": "स्वास्थ्य और उपज विश्लेषण",
    "Weather": "मौसम",
    "Current Weather": "वर्तमान मौसम",
    "7-Day Forecast": "7 दिन का पूर्वानुमान",
    "AI Smart Alerts": "AI स्मार्ट अलर्ट",
    "Ask FarmBuddy": "किसान एआई से पूछें",
    "Ask Kisan AI": "किसान एआई से पूछें",
    "AI-powered farming assistant": "एआई-संचालित जल और कृषि परामर्श",
    "AI-powered water & farming advisory": "एआई-संचालित जल और कृषि परामर्श",
    "Ask me anything about farming...": "खेती के बारे में कुछ भी पूछें...",
    "Farm Map": "स्मार्ट खेत का नक्शा",
    "Smart Farm Map": "स्मार्ट खेत का नक्शा",
    "fields mapped": "खेत मैप किए गए",
    "markers active": "सक्रिय मार्कर",
    "Your Fields": "आपके खेत",
    "Your Fields & Water Sources": "आपके खेत और जल स्रोत",
    "Dark Mode": "डार्क मोड",
    "Toggle dark/light theme": "डार्क/लाइट थीम बदलें",
    "Fetching weather data...": "मौसम डेटा लोड हो रहा...",
    "Loading map...": "नक्शा लोड हो रहा...",
    "No scans yet": "अभी तक कोई स्कैन नहीं",
    "No scans found.": "कोई स्कैन नहीं मिला।",
    "Clear All": "सब हटाएं",
    "Are you sure you want to delete all scans?": "क्या आप सभी स्कैन हटाना चाहते हैं?",
    "Scan Details": "स्कैन विवरण",
    "Identified": "पहचाना गया",
    "Crop": "फसल",
    "Diagnosis": "निदान",
    "Severity": "गंभीरता",
    "Affected Area": "प्रभावित क्षेत्र",
    "Possible Conditions": "संभावित स्थितियां",
    "Immediate Care": "तत्काल देखभाल",
    "Precaution & Action Plan": "सावधानी और कार्य योजना",
    "Your Name": "आपका नाम",
    "Primary Language": "प्राथमिक भाषा",
    "Get Started": "शुरू करें",
    "Water Advisory": "जल परामर्श",
    "Check Weather tab for smart irrigation advice": "स्मार्ट सिंचाई सलाह के लिए मौसम टैब देखें",
    "Scan your crops to get personalized water advice": "व्यक्तिगत जल सलाह प्राप्त करने के लिए अपनी फसलों को स्कैन करें",
    "Map your fields, track crops and locate water sources": "अपने खेतों का नक्शा बनाएं, फसलों को ट्रैक करें और जल स्रोतों का पता लगाएं",
    "Hi! I'm Kisan AI 🌾💧": "नमस्ते! मैं किसान एआई हूँ 🌾💧",
    "Ask me anything about irrigation, crop diseases, livestock, or farm planning!": "सिंचाई, फसल रोगों, पशुधन, या खेत योजना के बारे में मुझसे कुछ भी पूछें!",
    "Farm & Irrigation Profile": "खेत और सिंचाई प्रोफ़ाइल",
    "Water and crop setup": "जल और फसल सेटअप",
    "Farm Type": "खेत का प्रकार",
    "Primary Water Source": "प्राथमिक जल स्रोत",
    "Irrigated": "सिंचित",
    "Rainfed": "वर्षा सिंचित",
    "Mixed": "मिश्रित",
    "Well": "कुआं",
    "Canal": "नहर",
    "River": "नदी",
    "Borewell": "बोरवेल",
    "Pond": "तालाब",
    "Other": "अन्य",
    "Water Source": "जल स्रोत",
    "Field": "खेत",
    "Nearest Water": "निकटतम जल स्रोत",
    "Personal Info": "व्यक्तिगत जानकारी",
    "Update your details": "अपनी जानकारी अपडेट करें",
    "Phone Number": "फ़ोन नंबर",
    "Save Preferences": "प्राथमिकताएं सहेजें",
    "Kisan Alert Dashboard": "किसान अलर्ट डैशबोर्ड",
    "Kissan Alert Dashboard": "किसान अलर्ट डैशबोर्ड",
    "Crop Health": "फसल स्वास्थ्य",
    "Livestock Health": "पशुधन स्वास्थ्य",
    "Scans": "स्कैन",
    "Total Water": "कुल जल",
    "Alerts": "अलर्ट",
    "Water": "पानी",
    "Yield Logs & AI Planners": "उपज लॉग और एआई योजनाकार",
    "Log crop yields, livestock health trends, and optimize water and soil resources": "फसल की उपज, पशुधन स्वास्थ्य प्रवृत्तियों को दर्ज करें, और जल और मिट्टी के संसाधनों को अनुकूलित करें",
    "Kisan Alert Analytics": "किसान अलर्ट विश्लेषण",
    "Analytics": "विश्लेषण",
    "Water Usage": "जल उपयोग",
    "Irrigation Log": "सिंचाई लॉग",
    "Drip": "टपक सिंचाई (ड्रिप)",
    "Flood": "बाढ़ सिंचाई",
    "Sprinkler": "छिड़काव सिंचाई",
    "Furrow": "नाली सिंचाई",
    "Manual": "हाथ से",
  },
  'ଓଡ଼ିଆ (Odia)': {
    "Welcome to Kisan Alert": "କିସାନ ଆଲର୍ଟ କୁ ସ୍ୱାଗତ",
    "Welcome to Kissan Alert": "କିସାନ ଆଲର୍ଟ କୁ ସ୍ୱାଗତ",
    "Welcome to FarmBuddy": "କିସାନ ଆଲର୍ଟ କୁ ସ୍ୱାଗତ",
    "Overall Health": "ମୋଟ ସ୍ୱାସ୍ଥ୍ୟ",
    "Total Scans": "ମୋଟ ସ୍କାନ",
    "Issues Picked": "ସମସ୍ୟା",
    "Recent": "ସାମ୍ପ୍ରତିକ",
    "Crops": "ଫସଲ",
    "Livestock": "ପଶୁଧନ",
    "Good": "ଭଲ",
    "Fair": "ମଧ୍ୟମ",
    "Critical": "ସଙ୍କଟପୂର୍ଣ୍ଣ",
    "Settings": "ସେଟିଂସ",
    "Save Key": "ସେଭ୍ କରନ୍ତୁ",
    "Saved!": "ସେଭ୍ ହେଲା!",
    "Dashboard": "ଡ୍ୟାସବୋର୍ଡ",
    "Weather": "ପାଣିପାଗ",
    "Ask FarmBuddy": "ଫାର୍ମବଡ଼ିଙ୍କୁ ପଚାରନ୍ତୁ",
    "Farm Map": "ଜମି ମ୍ୟାପ୍",
    "Dark Mode": "ଡାର୍କ ମୋଡ୍",
    "Clear All": "ସବୁ ହଟାନ୍ତୁ",
    "Your Name": "ଆପଣଙ୍କ ନାମ",
    "Get Started": "ଆରମ୍ଭ କରନ୍ତୁ",
    "Farm & Irrigation Profile": "ଖେତ ଏବଂ ଜଳସେଚନ ପ୍ରୋଫାଇଲ",
    "Water and crop setup": "ଜଳ ଏବଂ ଫସଲ ସେଟଅପ",
    "Farm Type": "ଖେତର ପ୍ରକାର",
    "Primary Water Source": "ପ୍ରାଥମିକ ଜଳ ଉତ୍ସ",
    "Irrigated": "ଜଳସେଚିତ",
    "Rainfed": "ବର୍ଷା ଆଧାରିତ",
    "Mixed": "ମିଶ୍ରିତ",
    "Well": "କୂଅ",
    "Canal": "ନହର",
    "River": "ନଦୀ",
    "Borewell": "ବୋରୱେଲ",
    "Pond": "ପୋଖରୀ",
    "Other": "ଅନ୍ୟାନ୍ୟ",
    "Gemini API Key": "ଜେମିନି ଏପିଆଇ କି",
    "From Google AI Studio": "ଗୁଗଲ୍ ଏଆଇ ଷ୍ଟୁଡିଓରୁ",
    "Primary Language": "ପ୍ରାଥମିକ ଭାଷା",
    "Toggle dark/light theme": "ଡାର୍କ/ଲାଇଟ୍ ଥିମ୍ ବଦଳାନ୍ତୁ",
    "Save Preferences": "ସେଭ୍ କରନ୍ତୁ",
    "Personal Info": "ବ୍ୟକ୍ତିଗତ ସୂଚନା",
    "Update your details": "ଆପଣଙ୍କର ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ",
    "Phone Number": "ଫୋନ୍ ନମ୍ବର",
    "Configure your app preferences": "ଆପଣଙ୍କର ପସନ୍ଦ ସେଟ୍ କରନ୍ତୁ",
    "Kisan Alert Dashboard": "କିସାନ ଆଲର୍ଟ ଡ୍ୟାସବୋର୍ଡ",
    "Kissan Alert Dashboard": "କିସାନ ଆଲର୍ଟ ଡ୍ୟାସବୋର୍ଡ",
    "Crop Health": "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ",
    "Livestock Health": "ପଶୁ ସ୍ୱାସ୍ଥ୍ୟ",
    "Scans": "ସ୍କାନ ଗୁଡ଼ିକ",
    "Total Water": "ମୋଟ ଜଳ",
    "Alerts": "ଆଲର୍ଟ",
    "Water": "ଜଳ",
    "Yield Logs & AI Planners": "ଫସଲ ଲଗ୍ ଏବଂ AI ପ୍ଲାନର୍",
    "Log crop yields, livestock health trends, and optimize water and soil resources": "ଫସଲ ଅମଳ, ପଶୁ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରବୃତ୍ତି ଏବଂ ଜଳ ଓ ମୃତ୍ତିକା ଉତ୍ସକୁ ଅପ୍ଟିମାଇଜ୍ କରନ୍ତୁ",
    "Kisan Alert Analytics": "କିସାନ ଆଲର୍ଟ ଆନାଲିଟିକ୍ସ",
    "Analytics": "ଆନାଲିଟିକ୍ସ",
    "Water Usage": "ଜଳ ବ୍ୟବହାର",
    "Irrigation Log": "ଜଳସେଚନ ଲଗ୍",
    "Drip": "ବୁନ୍ଦା ଜଳସେଚନ (ଡ୍ରିପ୍)",
    "Flood": "ବନ୍ୟା ଜଳସେଚନ",
    "Sprinkler": "ସ୍ପ୍ରିଙ୍କଲର",
    "Furrow": "ଫୁରୋ",
    "Manual": "ହସ୍ତକୃତ",
  },
  'বাংলা (Bengali)': {
    "Welcome to Kisan Alert": "কিসান অ্যালার্টে স্বাগতম",
    "Welcome to FarmBuddy": "কিসান অ্যালার্টে স্বাগতম",
    "Overall Health": "সামগ্রিক স্বাস্থ্য",
    "Total Scans": "মোট স্ক্যান",
    "Issues Picked": "সমস্যা",
    "Recent AI Insight": "সাম্প্রতিক তথ্য",
    "Recent": "সাম্প্রতিক",
    "Crops": "ফসল",
    "Livestock": "গবাদি পশু",
    "Recent Scans": "সাম্প্রতিক স্ক্যান",
    "Good": "ভালো",
    "Fair": "মোটামুটি",
    "Critical": "গুরুতর",
    "Settings": "সেটিংস",
    "Configure your app preferences": "অ্যাপ পছন্দ সেট করুন",
    "Save Key": "সেভ করুন",
    "Saved!": "সেভ হয়েছে!",
    "Dashboard": "ড্যাশবোর্ড",
    "Weather": "আবহাওয়া",
    "Ask FarmBuddy": "ফার্মবাডিকে জিজ্ঞাসা করুন",
    "Farm Map": "খামারের মানচিত্র",
    "Dark Mode": "ডার্ক মোড",
    "Clear All": "সব মুছুন",
    "Scan Details": "স্ক্যান বিবরণ",
    "Your Name": "আপনার নাম",
    "Primary Language": "প্রাথমিক ভাষা",
    "Get Started": "শুরু করুন",
  },
  'తెలుగు (Telugu)': {
    "Welcome to Kisan Alert": "కిసాన్ అలర్ట్‌కు స్వాగతం",
    "Welcome to FarmBuddy": "కిసాన్ అలర్ట్‌కు స్వాగతం",
    "Overall Health": "మొత్తం ఆరోగ్యం",
    "Total Scans": "మొత్తం స్కాన్లు",
    "Issues Picked": "సమస్యలు",
    "Recent AI Insight": "ఇటీవలి సమాచారం",
    "Recent": "ఇటీవల",
    "Crops": "పంటలు",
    "Livestock": "పశువులు",
    "Recent Scans": "ఇటీవలి స్కాన్లు",
    "Good": "మంచిది",
    "Fair": "సహేతుకం",
    "Critical": "తీవ్రమైన",
    "Settings": "సెట్టింగులు",
    "Configure your app preferences": "యాప్ ప్రాధాన్యతలు సెట్ చేయండి",
    "Save Key": "సేవ్ చేయండి",
    "Saved!": "సేవ్ అయింది!",
    "Dashboard": "డాష్‌బోర్డ్",
    "Weather": "వాతావరణం",
    "Ask FarmBuddy": "ఫార్మ్‌బడ్డీని అడగండి",
    "Farm Map": "పొలం మ్యాప్",
    "Dark Mode": "డార్క్ మోడ్",
    "Clear All": "అన్నీ తొలగించు",
    "Scan Details": "స్కాన్ వివరాలు",
    "Your Name": "మీ పేరు",
    "Primary Language": "ప్రాథమిక భాష",
    "Get Started": "ప్రారంభించండి",
  },
  'मराठी (Marathi)': {
    "Welcome to Kisan Alert": "किसान अलर्ट मध्ये आपले स्वागत",
    "Welcome to FarmBuddy": "किसान अलर्ट मध्ये आपले स्वागत",
    "Overall Health": "एकूण आरोग्य",
    "Total Scans": "एकूण स्कॅन",
    "Issues Picked": "समस्या",
    "Recent": "अलीकडील",
    "Crops": "पिके",
    "Livestock": "पशुधन",
    "Good": "चांगले",
    "Fair": "बरे",
    "Critical": "गंभीर",
    "Settings": "सेटिंग्ज",
    "Save Key": "सेव्ह करा",
    "Saved!": "सेव्ह झाले!",
    "Dashboard": "डॅशबोर्ड",
    "Weather": "हवामान",
    "Ask FarmBuddy": "फार्मबडीला विचारा",
    "Farm Map": "शेताचा नकाशा",
    "Dark Mode": "डार्क मोड",
    "Clear All": "सर्व हटवा",
    "Your Name": "तुमचे नाव",
    "Get Started": "सुरू करा",
  },
  'தமிழ் (Tamil)': {
    "Welcome to Kisan Alert": "கிசான் அலர்ட்டிற்கு வரவேற்கிறோம்",
    "Welcome to FarmBuddy": "கிசான் அலர்ட்டிற்கு வரவேற்கிறோம்",
    "Overall Health": "மொத்த ஆரோக்கியம்",
    "Total Scans": "மொத்த ஸ்கேன்",
    "Issues Picked": "சிக்கல்கள்",
    "Recent AI Insight": "சமீபத்திய தகவல்",
    "Recent": "சமீபத்திய",
    "Crops": "பயிர்கள்",
    "Livestock": "கால்நடைகள்",
    "Recent Scans": "சமீபத்திய ஸ்கேன்",
    "Good": "நல்லது",
    "Fair": "சுமாரான",
    "Critical": "ஆபத்தான",
    "Settings": "அமைப்புகள்",
    "Configure your app preferences": "பயன்பாட்டு அமைப்புகளை உள்ளமைக்கவும்",
    "Save Key": "சேமி",
    "Saved!": "சேமிக்கப்பட்டது!",
    "Dashboard": "டாஷ்போர்டு",
    "Weather": "வானிலை",
    "Ask FarmBuddy": "ஃபார்ம்படியிடம் கேள்",
    "Farm Map": "நில வரைபடம்",
    "Dark Mode": "இருண்ட பயன்முறை",
    "Clear All": "அனைத்தும் நீக்கு",
    "Scan Details": "ஸ்கேன் விவரங்கள்",
    "Your Name": "உங்கள் பெயர்",
    "Get Started": "தொடங்குங்கள்",
  },
  'ગુજરાતી (Gujarati)': {
    "Welcome to Kisan Alert": "કિસાન એલર્ટમાં આપનું સ્વાગત છે",
    "Welcome to FarmBuddy": "કિસાન એલર્ટમાં આપનું સ્વાગત છે",
    "Crops": "પાક",
    "Livestock": "પશુધન",
    "Settings": "સેટિંગ્સ",
    "Dashboard": "ડેશબોર્ড",
    "Weather": "હવામાન",
    "Farm Map": "ખેતરનો નકશો",
    "Dark Mode": "ડાર્ક મોડ",
    "Your Name": "તમારું નામ",
    "Get Started": "શરૂ કરો",
  },
  'ಕನ್ನಡ (Kannada)': {
    "Welcome to Kisan Alert": "ಕಿಸಾನ್ ಅಲರ್ಟ್‌ಗೆ ಸ್ವಾಗತ",
    "Welcome to FarmBuddy": "ಕಿಸಾನ್ ಅಲರ್ಟ್‌ಗೆ ಸ್ವಾಗತ",
    "Crops": "ಬೆಳೆಗಳು",
    "Livestock": "ಜಾನುವಾರುಗಳು",
    "Settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Weather": "ಹವಾಮಾನ",
    "Farm Map": "ಕೃಷಿ ನಕ್ಷೆ",
    "Dark Mode": "ಡಾರ್ಕ್ ಮೋഡ്",
    "Your Name": "ನಿಮ್ಮ ಹೆಸರು",
    "Get Started": "ಪ್ರಾರಂಭಿಸಿ",
  },
  'മലയാളം (Malayalam)': {
    "Welcome to Kisan Alert": "കിസാൻ അലർട്ടിലേക്ക് സ്വാഗതം",
    "Welcome to FarmBuddy": "കിസാൻ അലർട്ടിലേക്ക് സ്വാഗതം",
    "Crops": "വിളകൾ",
    "Livestock": "കന്നുകാലികൾ",
    "Settings": "ക്രമീകരണങ്ങൾ",
    "Dashboard": "ഡാഷ്‌ബോർഡ്",
    "Weather": "കാലാവസ്ഥ",
    "Farm Map": "കൃഷി ഭൂപടം",
    "Dark Mode": "ಡാർക്ക്‌ മോഡ്",
    "Your Name": "നിങ്ങളുടെ പേര്",
    "Get Started": "ആരംഭിക്കുക",
  },
  'ਪੰਜਾਬੀ (Punjabi)': {
    "Welcome to Kisan Alert": "ਕਿਸਾਨ ਅਲਰਟ ਵਿੱਚ ਸੁਆਗਤ ਹੈ",
    "Welcome to FarmBuddy": "ਕਿਸਾਨ ਅਲਰਟ ਵਿੱਚ ਸੁਆਗਤ ਹੈ",
    "Crops": "ਫ਼ਸਲਾਂ",
    "Livestock": "ਪਸ਼ੂ ਧਨ",
    "Settings": "ਸੈਟਿੰਗਜ਼",
    "Dashboard": "ਡੈਸ਼ਬੋਰڈ",
    "Weather": "ਮੌਸਮ",
    "Farm Map": "ਖੇਤ ਦਾ ਨਕਸ਼ਾ",
    "Dark Mode": "ਡਾਰਕ ਮੋଡ",
    "Your Name": "ਤੁਹਾਡਾ ਨਾਂ",
    "Get Started": "ਸ਼ੁਰੂ ਕਰੋ",
  },
  'اردو (Urdu)': {
    "Welcome to Kisan Alert": "کیسان الرٹ میں خوش آمدید",
    "Welcome to FarmBuddy": "کیسان الرٹ میں خوش آمدید",
    "Crops": "فصلیں",
    "Livestock": "مویشی",
    "Settings": "ترتیبات",
    "Dashboard": "ڈیش بورڈ",
    "Weather": "موسم",
    "Farm Map": "کھیت کا نقشہ",
    "Dark Mode": "ڈارک موڈ",
    "Your Name": "آپ کا نام",
    "Get Started": "شروع کریں",
  },
};

// Map to track in-progress background translations to avoid duplicates
let isTranslating = {};

const translateWithGemini = async (text, userLang, apiKey) => {
  const cacheKey = `kisanalert_translations_${userLang}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  if (cache[text]) return;

  const cacheId = `${userLang}:${text}`;
  if (isTranslating[cacheId]) return;
  isTranslating[cacheId] = true;

  try {
    const prompt = `You are a professional agricultural translator. Translate the following short English user interface text into the Indian language "${userLang}". Keep the tone professional, friendly, and natural for Indian farmers. Do not write any explanations, code, or quotes. Just output the direct translation.
English text: "${text}"`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (res.ok) {
      const resData = await res.json();
      const translatedText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      if (translatedText) {
        // Clean translation if it returned double quotes
        const cleaned = translatedText.replace(/^["']|["']$/g, '');
        cache[text] = cleaned;
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        // Dispatch event to trigger state updates in pages
        window.dispatchEvent(new Event('kisanalert_translation_updated'));
      }
    }
  } catch (e) {
    console.error('Gemini translate error:', e);
  } finally {
    delete isTranslating[cacheId];
  }
};

export const getTranslation = (enString) => {
  if (!enString) return '';
  const userLang = localStorage.getItem('SMART_AG_LANG') || 'English';
  if (userLang === 'English') return enString;

  // 1. Check static translations
  const staticTranslation = translations[userLang]?.[enString];
  if (staticTranslation) return staticTranslation;

  // 2. Check dynamic translations cache
  const cacheKey = `kisanalert_translations_${userLang}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  if (cache[enString]) return cache[enString];

  // 3. Fallback to Gemini if key exists
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  if (apiKey && apiKey.startsWith('AIza')) {
    translateWithGemini(enString, userLang, apiKey);
  }

  return enString;
};
