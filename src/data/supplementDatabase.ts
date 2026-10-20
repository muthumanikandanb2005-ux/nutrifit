import type { SupplementInfo } from '../types';

export const INDIAN_SUPPLEMENT_DATABASE: SupplementInfo[] = [
  {
    id: 'supp_1',
    name: 'Whey Protein Isolate / Concentrate',
    hindiName: 'वे प्रोटीन',
    category: 'protein',
    dosage: '1 Scoop (24g - 27g protein)',
    bestTime: 'Immediately Post-Workout or Breakfast',
    benefits: ['Fast Muscle Recovery', 'Prevents Muscle Breakdown', 'Highest Biological Value'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Extracted from milk curd during cheese production. 100% vegetarian, rapidly digested within 30-45 minutes after strength training.'
  },
  {
    id: 'supp_2',
    name: 'Creatine Monohydrate',
    hindiName: 'क्रिएटिन',
    category: 'performance',
    dosage: '3g - 5g daily (unflavored with water)',
    bestTime: 'Post-Workout with Carbs or Daily Morning',
    benefits: ['Increases Muscle Strength & Power', 'Boosts ATP Cellular Energy', 'Improves Muscle Hydration & Volume'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'The most thoroughly researched fitness supplement in the world. Synthesizes phosphocreatine in muscle tissue for explosive lift power.'
  },
  {
    id: 'supp_3',
    name: 'KSM-66 Ashwagandha Root Extract',
    hindiName: 'अश्वगंधा',
    category: 'herbal',
    dosage: '300mg - 600mg standardized extract',
    bestTime: 'At Bedtime with Warm Milk / Water',
    benefits: ['Lowers Stress & Cortisol Levels', 'Supports Natural Testosterone', 'Enhances Deep Sleep & Recovery'],
    isVegetarian: true,
    scientificRating: 'A',
    description: 'Traditional Ayurvedic adaptogen proven in modern clinical trials to reduce serum cortisol levels and accelerate recovery from intense weight training.'
  },
  {
    id: 'supp_4',
    name: 'Vitamin D3 (Cholecalciferol) + K2',
    hindiName: 'विटामिन D3',
    category: 'vitamins',
    dosage: '2000 IU - 60000 IU (as per doctor lab test)',
    bestTime: 'With a Fat-Containing Meal (Lunch)',
    benefits: ['Bone Mineral Density', 'Optimal Hormone Balance', 'Immunity Boost'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Over 70% of urban Indians are Vitamin D deficient due to indoor office jobs. Fat-soluble vitamin essential for calcium absorption and muscle strength.'
  },
  {
    id: 'supp_5',
    name: 'Vitamin B12 (Methylcobalamin)',
    hindiName: 'विटामिन B12',
    category: 'vitamins',
    dosage: '1000mcg Sublingual / Tablet',
    bestTime: 'Morning with Breakfast',
    benefits: ['Nerve System Health', 'Reduces Fatigue & Lethargy', 'Red Blood Cell Synthesis'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Essential nutrient missing in strict vegetarian and vegan diets. Prevents nerve numbness and chronic workout fatigue.'
  },
  {
    id: 'supp_6',
    name: 'Omega-3 Fish Oil / Algal Oil',
    hindiName: 'ओमेगा-3 फ़िश/एल्गल ऑयल',
    category: 'performance',
    dosage: '1000mg (with 180mg EPA / 120mg DHA)',
    bestTime: 'With Main Meals (Lunch or Dinner)',
    benefits: ['Reduces Workout Joint Inflammation', 'Heart & Lipid Profile Support', 'Brain Cognitive Function'],
    isVegetarian: false,
    scientificRating: 'A',
    description: 'Rich in essential fatty acids (EPA & DHA) that reduce delayed onset muscle soreness (DOMS) and cushion joints under heavy squatting.'
  }
];
