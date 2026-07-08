export type Language = "en" | "hi" | "ta";

export interface Guide {
  title: string;
  steps: string[];
  warning: string;
}

export const survivalGuides: Record<string, Record<Language, Guide>> = {
  flood: {
    en: {
      title: "Flood Survival Protocol",
      steps: [
        "Move to the highest ground immediately.",
        "Turn off all electrical and water mains.",
        "Avoid driving through or walking in moving water.",
        "Listen to local radio or official apps for evacuation orders.",
        "Secure clean water and non-perishable food."
      ],
      warning: "Do not touch electrical equipment while standing in water."
    },
    hi: {
      title: "बाढ़ से बचाव के उपाय",
      steps: [
        "तुरंत ऊंचाई वाले स्थान पर चले जाएं।",
        "सभी बिजली और पानी के मुख्य स्विच बंद कर दें।",
        "बहते पानी में गाड़ी चलाने या पैदल चलने से बचें।",
        "निकासी के आदेशों के लिए स्थानीय रेडियो या आधिकारिक ऐप सुनें।",
        "साफ पानी और खराब न होने वाला खाना सुरक्षित रखें।"
      ],
      warning: "पानी में खड़े रहकर बिजली के उपकरणों को न छुएं।"
    },
    ta: {
      title: "வெள்ளப் பாதிப்பு பாதுகாப்பு முறைகள்",
      steps: [
        "உடனடியாக உயரமான இடத்திற்குச் செல்லுங்கள்.",
        "மின்சாரம் மற்றும் தண்ணீர் இணைப்புகளை அணைக்கவும்.",
        "நகரும் தண்ணீரில் வாகனங்களை ஓட்டவோ அல்லது நடக்கவோ வேண்டாம்.",
        "வெளியேற்ற உத்தரவுகளுக்கு உள்ளூர் வானொலி அல்லது அதிகாரப்பூர்வ செயலிகளைக் கவனிக்கவும்.",
        "சுத்தமான தண்ணீர் மற்றும் கெட்டுப்போகாத உணவைப் பாதுகாக்கவும்."
      ],
      warning: "தண்ணீரில் நிற்கும்போது மின் சாதனங்களைத் தொடாதீர்கள்."
    }
  },
  fire: {
    en: {
      title: "Fire Safety Protocol",
      steps: [
        "Stay low to the ground to avoid smoke inhalation.",
        "Test doors for heat using the back of your hand before opening.",
        "Use stairs, never elevators, during an evacuation.",
        "If trapped, signal for help from a window.",
        "Call emergency services immediately (112 / 101 in India)."
      ],
      warning: "Never use water on electrical or oil fires."
    },
    hi: {
      title: "आग से सुरक्षा के नियम",
      steps: [
        "धुआं अंदर जाने से बचने के लिए ज़मीन के पास रहें।",
        "दरवाज़ों को खोलने से पहले अपने हाथ के पिछले हिस्से से उसकी गर्मी की जांच करें।",
        "निकासी के दौरान सीढ़ियों का उपयोग करें, लिफ्ट का नहीं।",
        "अगर फंस गए हों, तो खिड़की से मदद का इशारा करें।",
        "तुरंत आपातकालीन सेवाओं (112 / 101) को कॉल करें।"
      ],
      warning: "बिजली या तेल की आग पर कभी भी पानी का प्रयोग न करें।"
    },
    ta: {
      title: "தீ விபத்து பாதுகாப்பு முறைகள்",
      steps: [
        "புகையை சுவாசிப்பதைத் தவிர்க்க தரைக்கு அருகில் தங்குங்கள்.",
        "கதவுகளைத் திறப்பதற்கு முன் உங்கள் கையின் பின்புறத்தைப் பயன்படுத்தி கதவின் வெப்பத்தைச் சோதிக்கவும்.",
        "வெளியேற்றத்தின் போது படிக்கட்டுகளைப் பயன்படுத்துங்கள், மின்தூக்கிகளை வேண்டாம்.",
        "சிக்கிக்கொண்டால், ஜன்னலில் இருந்து உதவிக்கு சமிக்ஞை செய்யுங்கள்.",
        "அவசர சேவைகளை உடனடியாக அழைக்கவும் (112 / 101)."
      ],
      warning: "மின்சார அல்லது எண்ணெய் தீ விபத்துகளுக்கு ஒருபோதும் தண்ணீரைப் பயன்படுத்த வேண்டாம்."
    }
  },
  cyclone: {
    en: {
      title: "Cyclone Preparedness",
      steps: [
        "Stay indoors and move to the safest room (away from windows).",
        "Keep your phone charged and emergency lights ready.",
        "Secure loose objects outside that could fly.",
        "Store sandbags for low-lying entrances.",
        "Stay tuned to meteorological updates."
      ],
      warning: "Do not go outside until official confirmation that the 'eye' has passed."
    },
    hi: {
      title: "चक्रवात से सुरक्षा",
      steps: [
        "अंदर रहें और सबसे सुरक्षित कमरे (खिड़कियों से दूर) में चले जाएं।",
        "अपना फोन चार्ज रखें और आपातकालीन लाइटें तैयार रखें।",
        "बाहर की उन खुली वस्तुओं को सुरक्षित रखें जो उड़ सकती हैं।",
        "निचले प्रवेश द्वारों के लिए रेत की थैलियां जमा करें।",
        "मौसम संबंधी अपडेट के लिए जुड़े रहें।"
      ],
      warning: "चक्रवात की 'आंख' के गुजर जाने की आधिकारिक पुष्टि होने तक बाहर न निकलें।"
    },
    ta: {
      title: "புயல் பாதுகாப்பு முறைகள்",
      steps: [
        "வீட்டிற்குள்ளேயே இருங்கள் மற்றும் பாதுகாப்பான அறைக்குச் செல்லுங்கள்.",
        "உங்கள் தொலைபேசியைச் சார்ஜ் செய்து, அவசர விளக்குகளைத் தயாராக வைத்திருங்கள்.",
        "வெளியே பறக்கக்கூடிய பொருட்களைப் பாதுகாக்கவும்.",
        "தாழ்வான நுழைவாயில்களுக்கு மணல் மூட்டைகளைச் சேமித்து வைக்கவும்.",
        "வானிலை அறிவிப்புகளுக்குத் தயாராக இருங்கள்."
      ],
      warning: "புயலின் 'கண்' கடந்துவிட்டதாக அதிகாரப்பூர்வமாக அறிவிக்கப்படும் வரை வெளியே செல்ல வேண்டாம்."
    }
  }
};
