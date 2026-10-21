// Chennai Suburban Train Timetable & Station Database
// Dedicated to Southern Railway AC EMU Services (Chengalpattu <-> Chennai Egmore / Beach)

const TRAIN_DATABASE = {
  // 49007: Evening AC Local Fast (Chennai Beach -> Egmore -> Chengalpattu)
  "49007": {
    trainNumber: "49007",
    name: "Chennai Beach - Chengalpattu AC EMU Fast",
    type: "AC Local (EMU)",
    direction: "down", // Towards Chengalpattu
    source: "MSB",
    destination: "CGL",
    keyCommuterHalt: "MS", // Chennai Egmore
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalDistanceKm: 60,
    rakeType: "12-Car Medha AC EMU (Southern Railway)",
    schedule: [
      {
        code: "MSB",
        name: "Chennai Beach",
        nameTa: "சென்னை கடற்கரை",
        distanceKm: 0,
        arr: "18:17",
        dep: "18:17",
        platform: "2",
        notes: "Source Station. Rake originates from Beach car shed."
      },
      {
        code: "MSF",
        name: "Chennai Fort",
        nameTa: "சென்னை கோட்டை",
        distanceKm: 4,
        arr: "18:21",
        dep: "18:22",
        platform: "2",
        notes: "High Court & Madras Medical College exit."
      },
      {
        code: "MPK",
        name: "Chennai Park",
        nameTa: "பூங்கா",
        distanceKm: 5,
        arr: "18:24",
        dep: "18:25",
        platform: "2",
        notes: "Interchange for Chennai Central (MAS) via subway."
      },
      {
        code: "MS",
        name: "Chennai Egmore",
        nameTa: "சென்னை எழும்பூர்",
        distanceKm: 6,
        arr: "18:27",
        dep: "18:28",
        platform: "10",
        notes: "Major suburban halt. Gandhi Irwin Rd & Metro Green Line interchange.",
        isPrimaryCommuterStop: true
      },
      {
        code: "MBM",
        name: "Mambalam",
        nameTa: "மாம்பலம்",
        distanceKm: 12,
        arr: "18:37",
        dep: "18:38",
        platform: "4",
        notes: "T. Nagar Ranganathan St pedestrian footbridge side."
      },
      {
        code: "GDY",
        name: "Guindy",
        nameTa: "கிண்டி",
        distanceKm: 16,
        arr: "18:42",
        dep: "18:43",
        platform: "4",
        notes: "Metro Blue Line & Race Course interchange."
      },
      {
        code: "STM",
        name: "St. Thomas Mount",
        nameTa: "பரங்கிமலை",
        distanceKm: 19,
        arr: "18:45",
        dep: "18:46",
        platform: "4",
        notes: "Multi-modal hub (Suburban + Metro + MRTS)."
      },
      {
        code: "CMP",
        name: "Chromepet",
        nameTa: "குரோம்பேட்டை",
        distanceKm: 27,
        arr: "18:54",
        dep: "18:55",
        platform: "4",
        notes: "MIT campus & GST Road flyover junction."
      },
      {
        code: "TBM",
        name: "Tambaram",
        nameTa: "தாம்பரம்",
        distanceKm: 31,
        arr: "19:04",
        dep: "19:05",
        platform: "7",
        notes: "Major terminal junction. Footbridge with escalators.",
        isPrimaryCommuterStop: true
      },
      {
        code: "PRGL",
        name: "Perungalathur",
        nameTa: "பெருங்களத்தூர்",
        distanceKm: 34,
        arr: "19:10",
        dep: "19:11",
        platform: "3",
        notes: "GST road southern departure hub."
      },
      {
        code: "UPM",
        name: "Urappakkam",
        nameTa: "ஊரப்பாக்கம்",
        distanceKm: 40,
        arr: "19:16",
        dep: "19:17",
        platform: "1",
        notes: "Karanai Puducherry side."
      },
      {
        code: "GI",
        name: "Guduvancheri",
        nameTa: "கூடுவாஞ்சேரி",
        distanceKm: 43,
        arr: "19:20",
        dep: "19:21",
        platform: "1",
        notes: "Nellikuppam road access."
      },
      {
        code: "POTI",
        name: "Potheri",
        nameTa: "பொத்தேரி",
        distanceKm: 46,
        arr: "19:24",
        dep: "19:25",
        platform: "1",
        notes: "SRM Institute of Science & Technology main gate."
      },
      {
        code: "SKL",
        name: "Singaperumal Koil",
        nameTa: "சிங்கபெருமாள்கோவில்",
        distanceKm: 53,
        arr: "19:32",
        dep: "19:33",
        platform: "2",
        notes: "Historic Narasimha temple & Oragadam auto corridor."
      },
      {
        code: "PWU",
        name: "Paranur",
        nameTa: "பரனூர்",
        distanceKm: 57,
        arr: "19:37",
        dep: "19:38",
        platform: "1",
        notes: "Mahindra World City direct passenger skywalk."
      },
      {
        code: "CGL",
        name: "Chengalpattu Jn",
        nameTa: "செங்கல்பட்டு சந்திப்பு",
        distanceKm: 60,
        arr: "19:50",
        dep: "19:50",
        platform: "5",
        notes: "Destination. Platform 4/5 main terminal bay.",
        isPrimaryCommuterStop: true
      }
    ]
  },

  // 49002: Morning AC Local Fast (Chengalpattu -> Egmore -> Chennai Beach)
  "49002": {
    trainNumber: "49002",
    name: "Chengalpattu - Chennai Beach AC EMU Fast",
    type: "AC Local (EMU)",
    direction: "up", // Towards Chennai Egmore / Beach
    source: "CGL",
    destination: "MSB",
    keyCommuterHalt: "MS", // Chennai Egmore
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    totalDistanceKm: 60,
    rakeType: "12-Car Medha AC EMU (Southern Railway)",
    schedule: [
      {
        code: "CGL",
        name: "Chengalpattu Jn",
        nameTa: "செங்கல்பட்டு சந்திப்பு",
        distanceKm: 0,
        arr: "07:50",
        dep: "07:50",
        platform: "4",
        notes: "Source Station. Commuters board from Platform 4.",
        isPrimaryCommuterStop: true
      },
      {
        code: "PWU",
        name: "Paranur",
        nameTa: "பரனூர்",
        distanceKm: 3,
        arr: "07:56",
        dep: "07:57",
        platform: "2",
        notes: "Mahindra World City passenger board."
      },
      {
        code: "SKL",
        name: "Singaperumal Koil",
        nameTa: "சிங்கபெருமாள்கோவில்",
        distanceKm: 7,
        arr: "08:01",
        dep: "08:02",
        platform: "1",
        notes: "Industrial commuters."
      },
      {
        code: "POTI",
        name: "Potheri",
        nameTa: "பொத்தேரி",
        distanceKm: 14,
        arr: "08:07",
        dep: "08:08",
        platform: "2",
        notes: "SRM University students & faculty boarding."
      },
      {
        code: "GI",
        name: "Guduvancheri",
        nameTa: "கூடுவாஞ்சேரி",
        distanceKm: 17,
        arr: "08:12",
        dep: "08:13",
        platform: "2",
        notes: "Fast boarders."
      },
      {
        code: "UPM",
        name: "Urappakkam",
        nameTa: "ஊரப்பாக்கம்",
        distanceKm: 20,
        arr: "08:17",
        dep: "08:18",
        platform: "2",
        notes: "Suburban residential belt."
      },
      {
        code: "PRGL",
        name: "Perungalathur",
        nameTa: "பெருங்களத்தூர்",
        distanceKm: 26,
        arr: "08:23",
        dep: "08:24",
        platform: "2",
        notes: "South Chennai commuter pickup."
      },
      {
        code: "TBM",
        name: "Tambaram",
        nameTa: "தாம்பரம்",
        distanceKm: 29,
        arr: "08:33",
        dep: "08:35",
        platform: "8",
        notes: "Major junction. Reaches Tambaram in ~43 mins.",
        isPrimaryCommuterStop: true
      },
      {
        code: "CMP",
        name: "Chromepet",
        nameTa: "குரோம்பேட்டை",
        distanceKm: 33,
        arr: "08:41",
        dep: "08:42",
        platform: "3",
        notes: "Fast track to city."
      },
      {
        code: "STM",
        name: "St. Thomas Mount",
        nameTa: "பரங்கிமலை",
        distanceKm: 41,
        arr: "08:50",
        dep: "08:51",
        platform: "3",
        notes: "Metro line connections."
      },
      {
        code: "GDY",
        name: "Guindy",
        nameTa: "கிண்டி",
        distanceKm: 44,
        arr: "08:54",
        dep: "08:55",
        platform: "3",
        notes: "Tech park & metro interchange."
      },
      {
        code: "MBM",
        name: "Mambalam",
        nameTa: "மாம்பலம்",
        distanceKm: 48,
        arr: "08:59",
        dep: "09:00",
        platform: "3",
        notes: "T. Nagar commercial junction."
      },
      {
        code: "MS",
        name: "Chennai Egmore",
        nameTa: "சென்னை எழும்பூர்",
        distanceKm: 54,
        arr: "09:14",
        dep: "09:15",
        platform: "11",
        notes: "Primary office commuter destination! Gandhi Irwin Rd exit.",
        isPrimaryCommuterStop: true
      },
      {
        code: "MPK",
        name: "Chennai Park",
        nameTa: "பூங்கா",
        distanceKm: 55,
        arr: "09:18",
        dep: "09:19",
        platform: "1",
        notes: "Subway for Central station."
      },
      {
        code: "MSF",
        name: "Chennai Fort",
        nameTa: "சென்னை கோட்டை",
        distanceKm: 56,
        arr: "09:22",
        dep: "09:23",
        platform: "1",
        notes: "High Court side."
      },
      {
        code: "MSB",
        name: "Chennai Beach",
        nameTa: "சென்னை கடற்கரை",
        distanceKm: 60,
        arr: "09:30",
        dep: "09:30",
        platform: "1",
        notes: "Destination. Port terminal.",
        isPrimaryCommuterStop: true
      }
    ]
  }
};

// All key stations along the corridor with coordinate offsets for map & distances
const CORRIDOR_STATIONS = {
  MSB: { name: "Chennai Beach", code: "MSB", lat: 13.0924, lng: 80.2934 },
  MSF: { name: "Chennai Fort", code: "MSF", lat: 13.0805, lng: 80.2829 },
  MPK: { name: "Chennai Park", code: "MPK", lat: 13.0818, lng: 80.2737 },
  MS: { name: "Chennai Egmore", code: "MS", lat: 13.0792, lng: 80.2608 },
  MBM: { name: "Mambalam", code: "MBM", lat: 13.0336, lng: 80.2289 },
  GDY: { name: "Guindy", code: "GDY", lat: 13.0076, lng: 80.2131 },
  STM: { name: "St. Thomas Mount", code: "STM", lat: 12.9942, lng: 80.1983 },
  CMP: { name: "Chromepet", code: "CMP", lat: 12.9515, lng: 80.1412 },
  TBM: { name: "Tambaram", code: "TBM", lat: 12.9249, lng: 80.1205 },
  PRGL: { name: "Perungalathur", code: "PRGL", lat: 12.9038, lng: 80.0911 },
  UPM: { name: "Urappakkam", code: "UPM", lat: 12.8687, lng: 80.0712 },
  GI: { name: "Guduvancheri", code: "GI", lat: 12.8456, lng: 80.0579 },
  POTI: { name: "Potheri", code: "POTI", lat: 12.8227, lng: 80.0385 },
  SKL: { name: "Singaperumal Koil", code: "SKL", lat: 12.7634, lng: 79.9934 },
  PWU: { name: "Paranur", code: "PWU", lat: 12.7229, lng: 79.9876 },
  CGL: { name: "Chengalpattu Jn", code: "CGL", lat: 12.6841, lng: 79.9836 }
};

if (typeof window !== "undefined") {
  window.TRAIN_DATABASE = TRAIN_DATABASE;
  window.CORRIDOR_STATIONS = CORRIDOR_STATIONS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TRAIN_DATABASE, CORRIDOR_STATIONS };
}
