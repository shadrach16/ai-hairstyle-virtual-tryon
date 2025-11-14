export interface Hairstyle {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  price: string;
  credits: number;
  tags: string[];
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  isHighValue?: boolean; // For 2-3 credit premium styles
}

export const categories = [
  'All',
  'Braids',
  'Locs',
  'Twists',
  'Natural',
  'Protective',
  'Traditional',
  'Modern'
];

export const hairstyles: Hairstyle[] = [
  // Braids
  {
    id: 'braid-1',
    name: 'Box Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'long-lasting', 'versatile'],
    description: 'Classic protective style with square-parted sections',
    difficulty: 'Medium',
    duration: '4-6 hours'
  },
  {
    id: 'braid-2',
    name: 'Knotless Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'natural', 'comfortable'],
    description: 'Gentle braiding technique that reduces tension on scalp',
    difficulty: 'Hard',
    duration: '6-8 hours'
  },
  {
    id: 'braid-3',
    name: 'Fulani Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop',
    price: '2 Credits',
    credits: 2,
    tags: ['traditional', 'cultural', 'decorative'],
    description: 'Traditional West African style with beads and accessories',
    difficulty: 'Hard',
    duration: '5-7 hours',
    isHighValue: true
  },
  {
    id: 'braid-4',
    name: 'Ghana Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'cornrows', 'geometric'],
    description: 'Cornrow braids that gradually increase in size',
    difficulty: 'Medium',
    duration: '3-5 hours'
  },

  // Locs
  {
    id: 'locs-1',
    name: 'Freeform Locs',
    category: 'Locs',
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['natural', 'organic', 'low-maintenance'],
    description: 'Natural locs formed without manipulation',
    difficulty: 'Easy',
    duration: 'Ongoing process'
  },
  {
    id: 'locs-2',
    name: 'Sisterlocks',
    category: 'Locs',
    thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop',
    price: '2 Credits',
    credits: 2,
    tags: ['precision', 'versatile', 'professional'],
    description: 'Micro-sized locs created with precise parting',
    difficulty: 'Hard',
    duration: '8-12 hours',
    isHighValue: true
  },
  {
    id: 'locs-3',
    name: 'Interlocks',
    category: 'Locs',
    thumbnail: 'https://images.unsplash.com/photo-1595475038665-8de2559af9b3?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['structured', 'neat', 'maintained'],
    description: 'Locs maintained through interlocking technique',
    difficulty: 'Medium',
    duration: '2-4 hours'
  },

  // Twists
  {
    id: 'twist-1',
    name: 'Two-Strand Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'simple', 'versatile'],
    description: 'Simple protective style using two strands of hair',
    difficulty: 'Easy',
    duration: '2-3 hours'
  },
  {
    id: 'twist-2',
    name: 'Senegalese Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'long-lasting', 'sleek'],
    description: 'Rope-like twists using synthetic hair extensions',
    difficulty: 'Medium',
    duration: '4-6 hours'
  },
  {
    id: 'twist-3',
    name: 'Passion Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['bohemian', 'textured', 'trendy'],
    description: 'Textured twists with a bohemian flair',
    difficulty: 'Medium',
    duration: '3-5 hours'
  },

  // Natural Styles
  {
    id: 'natural-1',
    name: 'Wash and Go',
    category: 'Natural',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['natural', 'curls', 'quick'],
    description: 'Enhanced natural curl pattern with styling products',
    difficulty: 'Easy',
    duration: '30 minutes'
  },
  {
    id: 'natural-2',
    name: 'Twist Out',
    category: 'Natural',
    thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['natural', 'defined', 'volume'],
    description: 'Defined curls created by unraveling twists',
    difficulty: 'Easy',
    duration: '1 hour + overnight'
  },
  {
    id: 'natural-3',
    name: 'Bantu Knots',
    category: 'Traditional',
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop',
    price: '2 Credits',
    credits: 2,
    tags: ['traditional', 'cultural', 'sculptural'],
    description: 'Traditional African hairstyle with small coiled knots',
    difficulty: 'Medium',
    duration: '2-3 hours',
    isHighValue: true
  },

  // Protective Styles
  {
    id: 'protective-1',
    name: 'Flat Twists',
    category: 'Protective',
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'sleek', 'professional'],
    description: 'Two-strand twists that lay flat against the scalp',
    difficulty: 'Medium',
    duration: '2-3 hours'
  },
  {
    id: 'protective-2',
    name: 'Halo Braid',
    category: 'Protective',
    thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['protective', 'elegant', 'updo'],
    description: 'Crown braid that encircles the head like a halo',
    difficulty: 'Hard',
    duration: '1-2 hours'
  },

  // Modern Styles
  {
    id: 'modern-1',
    name: 'Undercut with Twists',
    category: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1595475038665-8de2559af9b3?w=300&h=300&fit=crop',
    price: '2 Credits',
    credits: 2,
    tags: ['modern', 'edgy', 'contrast'],
    description: 'Contemporary style combining undercut with twisted top',
    difficulty: 'Hard',
    duration: '2-3 hours',
    isHighValue: true
  },
  {
    id: 'modern-2',
    name: 'Faux Hawk Braids',
    category: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    price: '1 Credit',
    credits: 1,
    tags: ['modern', 'bold', 'statement'],
    description: 'Braided mohawk-inspired style',
    difficulty: 'Medium',
    duration: '3-4 hours'
  }
];

// Simulate AI processing with African hairstyle focus
export async function processHairstyleTransfer(photo: File, hairstyle: Hairstyle): Promise<string> {
  // Simulate processing time based on hairstyle complexity
  const processingTime = hairstyle.isHighValue ? 3000 : 2000;
  
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Return a mock processed image (in real app, this would be the AI result)
  return hairstyle.thumbnail;
}