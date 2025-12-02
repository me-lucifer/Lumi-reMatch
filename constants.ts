import { Photographer } from './types';

export const MOCK_PHOTOGRAPHERS: Photographer[] = [
  {
    id: 'p1',
    name: "Elena Rossi",
    style: "Dark & Moody",
    description: "Capturing raw emotions with cinematic lighting and deep shadows. Perfect for intimate, romantic elopements.",
    priceRange: "$3,500 - $5,000",
    location: "Portland, OR",
    avatar: "https://picsum.photos/seed/elena_avatar/200/200",
    portfolio: [
      "https://picsum.photos/seed/elena1/600/800",
      "https://picsum.photos/seed/elena2/600/800",
      "https://picsum.photos/seed/elena3/600/800",
      "https://picsum.photos/seed/elena4/800/600"
    ],
    tags: ["Moody", "Cinematic", "Emotional", "Low Light"],
    rating: 4.9,
    reviewCount: 124
  },
  {
    id: 'p2',
    name: "James & Co.",
    style: "Bright & Airy",
    description: "Timeless, light-filled photography that feels effortless and joyful. We specialize in natural light and pastel tones.",
    priceRange: "$4,000 - $6,500",
    location: "Charleston, SC",
    avatar: "https://picsum.photos/seed/james_avatar/200/200",
    portfolio: [
      "https://picsum.photos/seed/james1/600/800",
      "https://picsum.photos/seed/james2/600/800",
      "https://picsum.photos/seed/james3/600/800",
      "https://picsum.photos/seed/james4/800/600"
    ],
    tags: ["Natural Light", "Pastel", "Soft", "Classic"],
    rating: 4.8,
    reviewCount: 203
  },
  {
    id: 'p3',
    name: "The Grain Collective",
    style: "Editorial & Film",
    description: "Fashion-forward wedding photography shot on 35mm film. For the modern couple who wants their wedding to look like Vogue.",
    priceRange: "$6,000+",
    location: "New York, NY",
    avatar: "https://picsum.photos/seed/grain_avatar/200/200",
    portfolio: [
      "https://picsum.photos/seed/grain1/600/800",
      "https://picsum.photos/seed/grain2/600/800",
      "https://picsum.photos/seed/grain3/600/800",
      "https://picsum.photos/seed/grain4/800/600"
    ],
    tags: ["Film", "Grainy", "High Fashion", "Black & White"],
    rating: 5.0,
    reviewCount: 89
  },
  {
    id: 'p4',
    name: "Wilder Hearts",
    style: "Documentary & Candid",
    description: "Storytelling without the posing. We capture the in-between moments, the laughter, and the tears exactly as they happen.",
    priceRange: "$2,800 - $4,200",
    location: "Austin, TX",
    avatar: "https://picsum.photos/seed/wilder_avatar/200/200",
    portfolio: [
      "https://picsum.photos/seed/wilder1/600/800",
      "https://picsum.photos/seed/wilder2/600/800",
      "https://picsum.photos/seed/wilder3/600/800",
      "https://picsum.photos/seed/wilder4/800/600"
    ],
    tags: ["Candid", "Journalistic", "Unposed", "Authentic"],
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: 'p5',
    name: "Golden Hour Studios",
    style: "Bohemian & Warm",
    description: "Sun-drenched imagery for the adventurous soul. We chase the best light to make you look glowing and radiant.",
    priceRange: "$3,200 - $4,800",
    location: "Joshua Tree, CA",
    avatar: "https://picsum.photos/seed/golden_avatar/200/200",
    portfolio: [
      "https://picsum.photos/seed/golden1/600/800",
      "https://picsum.photos/seed/golden2/600/800",
      "https://picsum.photos/seed/golden3/600/800",
      "https://picsum.photos/seed/golden4/800/600"
    ],
    tags: ["Warm", "Sunset", "Boho", "Adventure"],
    rating: 4.9,
    reviewCount: 92
  }
];

export const INITIAL_ANALYSIS_STEPS = [
  "Uploading image...",
  "Analyzing color palette...",
  "Detecting lighting patterns...",
  "Matching aesthetic style...",
  "Curating photographer list..."
];