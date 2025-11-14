export interface AfricanHairstyle {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  price: number; // in credits
  tags: string[];
  gender: 'unisex' | 'male' | 'female';
  description: string;
  culturalOrigin?: string;
}

export const africanHairstyles: AfricanHairstyle[] = [
  // Braids
  {
    id: 'box-braids',
    name: 'Box Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop',
    price: 1,
    tags: ['protective', 'long-lasting', 'versatile'],
    gender: 'female',
    description: 'Classic protective style with square-shaped parts',
    culturalOrigin: 'Ancient Egypt/West Africa'
  },
  {
    id: 'cornrows',
    name: 'Cornrows',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
    price: 1,
    tags: ['traditional', 'protective', 'geometric'],
    gender: 'unisex',
    description: 'Traditional braided style close to the scalp',
    culturalOrigin: 'West Africa'
  },
  {
    id: 'fulani-braids',
    name: 'Fulani Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop',
    price: 2,
    tags: ['cultural', 'decorative', 'elegant'],
    gender: 'female',
    description: 'Traditional Fulani style with beads and accessories',
    culturalOrigin: 'Fulani People of West Africa'
  },
  {
    id: 'ghana-braids',
    name: 'Ghana Braids',
    category: 'Braids',
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop',
    price: 2,
    tags: ['feed-in', 'gradual', 'artistic'],
    gender: 'female',
    description: 'Feed-in braids that start small and get thicker',
    culturalOrigin: 'Ghana'
  },

  // Locs
  {
    id: 'traditional-locs',
    name: 'Traditional Locs',
    category: 'Locs',
    thumbnail: 'https://images.unsplash.com/photo-1595475038665-8de2559af9b3?w=300&h=300&fit=crop',
    price: 1,
    tags: ['natural', 'spiritual', 'low-maintenance'],
    gender: 'unisex',
    description: 'Natural locked hair formation',
    culturalOrigin: 'Various African cultures'
  },
  {
    id: 'sisterlocks',
    name: 'Sisterlocks',
    category: 'Locs',
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
    price: 2,
    tags: ['micro', 'versatile', 'professional'],
    gender: 'female',
    description: 'Micro-sized locs for maximum versatility',
    culturalOrigin: 'Modern African-American innovation'
  },

  // Twists
  {
    id: 'two-strand-twists',
    name: 'Two-Strand Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop',
    price: 1,
    tags: ['simple', 'protective', 'versatile'],
    gender: 'unisex',
    description: 'Simple two-strand twisted style',
    culturalOrigin: 'Pan-African'
  },
  {
    id: 'senegalese-twists',
    name: 'Senegalese Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    price: 2,
    tags: ['rope-like', 'elegant', 'protective'],
    gender: 'female',
    description: 'Rope-like twists with synthetic hair',
    culturalOrigin: 'Senegal'
  },
  {
    id: 'havana-twists',
    name: 'Havana Twists',
    category: 'Twists',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop',
    price: 2,
    tags: ['chunky', 'bold', 'statement'],
    gender: 'female',
    description: 'Thick, chunky twists for a bold look',
    culturalOrigin: 'Caribbean/African diaspora'
  },

  // Natural Styles
  {
    id: 'afro',
    name: 'Natural Afro',
    category: 'Natural',
    thumbnail: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
    price: 1,
    tags: ['natural', 'voluminous', 'iconic'],
    gender: 'unisex',
    description: 'Natural hair in its full glory',
    culturalOrigin: 'Pan-African'
  },
  {
    id: 'twist-out',
    name: 'Twist-Out',
    category: 'Natural',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop',
    price: 1,
    tags: ['textured', 'defined', 'natural'],
    gender: 'unisex',
    description: 'Defined curls from unraveled twists',
    culturalOrigin: 'Modern natural hair movement'
  },
  {
    id: 'bantu-knots',
    name: 'Bantu Knots',
    category: 'Natural',
    thumbnail: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=300&fit=crop',
    price: 1,
    tags: ['traditional', 'sculptural', 'cultural'],
    gender: 'unisex',
    description: 'Traditional knotted style from Southern Africa',
    culturalOrigin: 'Bantu peoples of Southern Africa'
  },

  // Premium/Complex Styles
  {
    id: 'goddess-locs',
    name: 'Goddess Locs',
    category: 'Premium',
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop',
    price: 3,
    tags: ['bohemian', 'textured', 'goddess'],
    gender: 'female',
    description: 'Bohemian locs with loose, curly ends',
    culturalOrigin: 'Modern fusion style'
  },
  {
    id: 'knotless-braids',
    name: 'Knotless Braids',
    category: 'Premium',
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
    price: 3,
    tags: ['seamless', 'natural-looking', 'comfortable'],
    gender: 'female',
    description: 'Braids that start with natural hair, no knots',
    culturalOrigin: 'Modern braiding innovation'
  },

  // Male-specific styles
  {
    id: 'fade-with-twists',
    name: 'Fade with Twists',
    category: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    price: 1,
    tags: ['modern', 'fade', 'clean'],
    gender: 'male',
    description: 'Clean fade with twisted top section',
    culturalOrigin: 'Modern barbering'
  },
  {
    id: 'high-top-fade',
    name: 'High Top Fade',
    category: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    price: 1,
    tags: ['classic', 'retro', 'bold'],
    gender: 'male',
    description: 'Classic high-top with faded sides',
    culturalOrigin: '1980s Hip-Hop culture'
  }
];

export const categories = ['All', 'Braids', 'Locs', 'Twists', 'Natural', 'Premium', 'Modern'];

export const genders = ['All', 'Male', 'Female', 'Unisex'];

export const culturalOrigins = [
  'All',
  'West Africa',
  'East Africa', 
  'Southern Africa',
  'North Africa',
  'Caribbean',
  'African Diaspora'
];