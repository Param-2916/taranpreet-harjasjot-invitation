// All wedding data lives here. Card wording is copied exactly from the printed invitation.
const CONFIG = {
  siteUrl: "http://param-2916.github.io/taranpreet-harjasjot-invitation/", // TODO: your final GitHub Pages URL (needed for the WhatsApp preview image)
  assets: {
    monogram: "assets/monogram.png",
    song: "assets/song.mp3",
    ogImage: "assets/monogram.png",
  },
  couple: { en: ["Taranpreet", "Harjasjot"], pa: ["ਤਰਨਪ੍ਰੀਤ", "ਹਰਜਸਜੋਤ"] },
  ceremony: {
    start: "2027-01-24T10:00:00+05:30",
    nowUntil: "2027-01-24T12:00:00+05:30",
  },
  events: [
    {
      id: "jaggo",
      date: "2027-01-22",
      time: "18:30",
      end: "21:30",
      venue: "COMMUNITY CENTRE EMAAR",
      addr: "EMAAR MOHALI HILLS, SECTOR-109, MOHALI (PB.)",
      note: ["Followed by cocktail & dinner"],
      map: "Community Centre Emaar, Emaar Mohali Hills, Sector 109, Mohali",
    },
    {
      id: "anand",
      date: "2027-01-24",
      time: "09:30",
      end: "12:00",
      venue: "GURUDWARA SHRI SAHIBWARA",
      addr: "PHASE - 5, MOHALI (PB.)",
      schedule: [
        ["Reception of Barat", "9:30 AM"],
        ["Anand Karaj", "10:00 AM"],
      ],
      map: "Gurudwara Shri Sahibwara, Phase 5, Mohali",
      etiquette: true,
    },
    {
      id: "lunch",
      date: "2027-01-24",
      time: "14:00",
      end: "16:00",
      venue: "THE GRAND ROMANIA",
      addr: "LANDRAN - BANUR ROAD, NEAR IT CHOWK, MOHALI (PB.)",
      schedule: [
        ["Lunch", "2:00 PM"],
        ["Doli", "4:00 PM"],
      ],
      map: "The Grand Romania, Landran Banur Road, near IT Chowk, Mohali",
    },
  ],
  card: {
    verse: [
      "॥ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
      "ਸਤਿਗੁਰ ਦਾਤੇ ਕਾਜ ਰਚਾਇਆ ਆਪਣੀ ਮਿਹਰ ਕਰਾਈ ।",
      "ਦਾਸਾਂ ਕਾਰਜ ਆਪ ਸਵਾਰੇ ਇਹੁ ਉਸਦੀ ਵਡਿਆਈ ॥",
    ],
    quote: [
      "“Marriages are settled in Heaven",
      "but celebrated on earth",
      "Sacred unity of two unknown souls",
      "are written right from birth”",
    ],
    host: ["Sdn. Kamaljit Kaur", "(W/o Late S. Chamanjit Singh)"],
    bride: ["Taranpreet Kaur", "(D/O SDN. PARAMJIT KAUR & S. BALJINDER SINGH)"],
    groom: ["Harjasjot Singh", "(S/O SDN. PARAMJIT KAUR & S. SATWINDER SINGH)"],
    p1: [
      "CORDIALLY INVITES YOU ON THE OCCASION OF",
      "JAGGO & SANGEET",
      "TO CELEBRATE THE FORTHCOMING WEDDING OF HER LOVING GRAND DAUGHTER",
    ],
    p2: [
      "REQUESTS THE PLEASURE OF YOUR GRACIOUS PRESENCE ON THE AUSPICIOUS OCCASION OF THE WEDDING OF HER LOVING GRAND DAUGHTER",
    ],
    compliments: [
      "WITH BEST COMPLIMENTS FROM:",
      "ALL RELATIVES",
      "&",
      "FRIENDS",
    ],
  },
  rsvp: {
    names: ["BALJINDER SINGH", "RAMAN KUMAR", "JOGINDER SINGH"],
    phones: ["9417003816", "9041805492"],
  },
};
