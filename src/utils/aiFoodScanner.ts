import type { ScannedFoodResult, FoodState } from '../types';

export const SCANNED_FOOD_DATABASE: ScannedFoodResult[] = [
  // --- COOKED INDIAN FOODS ---
  {
    id: 'scan_c1',
    foodName: 'Grilled Paneer Tikka',
    hindiName: 'तंदूरी पनीर टिक्का',
    foodState: 'cooked',
    estimatedServing: '150g (6 Pieces + Mint Chutney)',
    calories: 320,
    protein: 24,
    carbs: 10,
    fats: 20,
    fiber: 3,
    confidence: 96,
    recommendedSlot: 'dinner',
    healthRating: 'Excellent',
    benefits: ['High Whey & Casein Protein', 'Low Carbohydrate', 'Satiating Evening Meal'],
    cookingImpactNote: 'Grilling reduces excess moisture and locks in protein density while burning off excess fats.'
  },
  {
    id: 'scan_c2',
    foodName: 'High-Protein Chicken Biryani',
    hindiName: 'चिकन बिरयानी',
    foodState: 'cooked',
    estimatedServing: '1 Plate (300g with 120g Chicken Breast)',
    calories: 510,
    protein: 38,
    carbs: 58,
    fats: 14,
    fiber: 4,
    confidence: 94,
    recommendedSlot: 'lunch',
    healthRating: 'Good',
    benefits: ['Complex Carbohydrates from Basmati', 'High Bioavailable Muscle Protein', 'Rich Spices for Digestion'],
    cookingImpactNote: 'Dum cooking retains chicken moisture and infuses antioxidant whole spices (cloves, cardamom, cinnamon).'
  },
  {
    id: 'scan_c3',
    foodName: 'Moong Dal Khichdi with Ghee',
    hindiName: 'मूंग दाल खिचड़ी',
    foodState: 'cooked',
    estimatedServing: '1 Bowl (250g)',
    calories: 340,
    protein: 14,
    carbs: 52,
    fats: 8,
    fiber: 6,
    confidence: 98,
    recommendedSlot: 'dinner',
    healthRating: 'Excellent',
    benefits: ['Ayurvedic Complete Amino Profile', 'Ultra Gentle on Stomach', 'Sustained Glycemic Release'],
    cookingImpactNote: 'Pressure cooking gelatinizes starches for effortless digestion and fast gastric emptying.'
  },
  {
    id: 'scan_c4',
    foodName: 'Egg Bhurji (3 Eggs Scramble)',
    hindiName: 'अंडा भुर्जी',
    foodState: 'cooked',
    estimatedServing: '1 Plate (180g cooked with onions & tomatoes)',
    calories: 280,
    protein: 22,
    carbs: 6,
    fats: 18,
    fiber: 2,
    confidence: 95,
    recommendedSlot: 'breakfast',
    healthRating: 'Excellent',
    benefits: ['100% Bioavailable Protein', 'Rich in Choline & Vitamin B12', 'Zero Glycemic Impact'],
    cookingImpactNote: 'Pan scrambling in 1 tsp oil heats proteins for rapid intestinal absorption.'
  },
  {
    id: 'scan_c5',
    foodName: 'Masala Dosa with Sambar',
    hindiName: 'मसाला डोसा और सांभर',
    foodState: 'cooked',
    estimatedServing: '1 Medium Dosa + 1 Bowl Sambar',
    calories: 420,
    protein: 12,
    carbs: 68,
    fats: 12,
    fiber: 7,
    confidence: 92,
    recommendedSlot: 'breakfast',
    healthRating: 'Moderate',
    benefits: ['Probiotic Fermented Batter', 'Energy Dense Complex Carbs', 'Rich in Potassium'],
    cookingImpactNote: 'Fermentation breaks down phytic acid, making iron and zinc significantly more absorbable.'
  },

  // --- RAW & UNCOOKED FOODS ---
  {
    id: 'scan_r1',
    foodName: 'Raw Whole Eggs (3 Large)',
    hindiName: 'कच्चे अंडे (3)',
    foodState: 'raw',
    estimatedServing: '3 Whole Eggs (150g raw without shell)',
    calories: 215,
    protein: 19,
    carbs: 1.5,
    fats: 15,
    fiber: 0,
    confidence: 99,
    recommendedSlot: 'breakfast',
    healthRating: 'Excellent',
    benefits: ['Natural Whole Food Protein', 'Omega-3 Fatty Acids', 'Choline for Brain Function'],
    cookingImpactNote: 'Note: Cooking eggs doubles protein digestibility from 51% (raw) to 91% (cooked).'
  },
  {
    id: 'scan_r2',
    foodName: 'Raw Soaked Green Moong Sprouts',
    hindiName: 'अंकुरित हरा मूंग',
    foodState: 'raw',
    estimatedServing: '1 Cup (100g raw sprouts)',
    calories: 140,
    protein: 12,
    carbs: 24,
    fats: 0.8,
    fiber: 8,
    confidence: 97,
    recommendedSlot: 'breakfast',
    healthRating: 'Excellent',
    benefits: ['Living Enzymes & Vitamin C Booster', 'High Dietary Soluble Fiber', 'Zero Fat'],
    cookingImpactNote: 'Sprouting increases Vitamin C content by 300% compared to dry unsoaked moong seeds.'
  },
  {
    id: 'scan_r3',
    foodName: 'Raw Almonds (Badam)',
    hindiName: 'कच्चे बादाम',
    foodState: 'raw',
    estimatedServing: '15 Pieces (18g raw nuts)',
    calories: 104,
    protein: 3.8,
    carbs: 3.8,
    fats: 9.0,
    fiber: 2.2,
    confidence: 99,
    recommendedSlot: 'early_morning',
    healthRating: 'Excellent',
    benefits: ['Rich in Vitamin E Antioxidants', 'Heart-Healthy Monounsaturated Fats', 'Brain Health'],
    cookingImpactNote: 'Soaking in water overnight softens outer skin (tannins), improving nutrient absorption.'
  },
  {
    id: 'scan_r4',
    foodName: 'Raw Skinless Chicken Breast',
    hindiName: 'कच्चा चिकन ब्रेस्ट',
    foodState: 'raw',
    estimatedServing: '150g Raw Uncooked Breast',
    calories: 165,
    protein: 34,
    carbs: 0,
    fats: 3.2,
    fiber: 0,
    confidence: 96,
    recommendedSlot: 'lunch',
    healthRating: 'Excellent',
    benefits: ['Pure Lean Muscle Protein', 'High Phosphorous & Niacin (B3)', 'Minimal Fat'],
    cookingImpactNote: 'Will yield ~115g cooked weight after water evaporation. Protein density per gram increases after cooking.'
  },
  {
    id: 'scan_r5',
    foodName: 'Raw Roasted Chana Sattu Powder',
    hindiName: 'सत्तू पाउडर',
    foodState: 'raw',
    estimatedServing: '50g (3 tbsp Powder)',
    calories: 205,
    protein: 13,
    carbs: 32,
    fats: 3.5,
    fiber: 9,
    confidence: 98,
    recommendedSlot: 'early_morning',
    healthRating: 'Excellent',
    benefits: ['Natural Indian Whey Alternative', 'Low Glycemic Index', 'Prevents Heat Stroke'],
    cookingImpactNote: 'Dry roasting before grinding locks in fiber and extends shelf-life naturally without preservatives.'
  },
  {
    id: 'scan_r6',
    foodName: 'Fresh Raw Apple / Fruit',
    hindiName: 'ताज़ा सेब',
    foodState: 'raw',
    estimatedServing: '1 Medium Apple (150g)',
    calories: 78,
    protein: 0.5,
    carbs: 20,
    fats: 0.3,
    fiber: 4.5,
    confidence: 99,
    recommendedSlot: 'snack',
    healthRating: 'Excellent',
    benefits: ['Pectin Fiber for Gut Health', 'Antioxidant Quercetin', 'Natural Sustained Energy'],
    cookingImpactNote: 'Best consumed raw with peel intact for maximum fiber and micronutrient retention.'
  },
  {
    id: 'scan_r7',
    foodName: 'Fresh Papaya Bowl (Papiha)',
    hindiName: 'ताज़ा पपीता',
    foodState: 'raw',
    estimatedServing: '1 Bowl (250g Cubes)',
    calories: 120,
    protein: 1.5,
    carbs: 30,
    fats: 0.4,
    fiber: 5,
    confidence: 98,
    recommendedSlot: 'snack',
    healthRating: 'Excellent',
    benefits: ['High Papain Enzyme', 'Proteolytic Protein Breakdown', 'Low Glycemic Load'],
    cookingImpactNote: 'Papain enzyme naturally breaks down proteins into absorbable amino acids.'
  },
  {
    id: 'scan_r8',
    foodName: 'Fresh Guava (Amrood)',
    hindiName: 'ताज़ा अमरूद',
    foodState: 'raw',
    estimatedServing: '2 Medium Guavas (160g)',
    calories: 110,
    protein: 4.2,
    carbs: 23,
    fats: 1.5,
    fiber: 9,
    confidence: 97,
    recommendedSlot: 'snack',
    healthRating: 'Excellent',
    benefits: ['Ultra High Fiber', '4x Vitamin C of Oranges', 'Low Insulin Spike'],
    cookingImpactNote: 'Consuming seeds intact boosts intestinal peristalsis and gastrointestinal health.'
  },
  {
    id: 'scan_r9',
    foodName: 'Alphonso Mango Slices (Aam)',
    hindiName: 'ताज़ा आम',
    foodState: 'raw',
    estimatedServing: '1 Medium Mango (200g Slices)',
    calories: 150,
    protein: 1.8,
    carbs: 38,
    fats: 0.6,
    fiber: 3.5,
    confidence: 96,
    recommendedSlot: 'snack',
    healthRating: 'Good',
    benefits: ['Fast Glycogen Replenishment', 'Rich Beta-Carotene', 'Pre-Workout Fuel'],
    cookingImpactNote: 'Natural fructose rapidly restores liver glycogen during intense athletic training.'
  },
  {
    id: 'scan_r10',
    foodName: 'Fresh Pomegranate Seeds (Anar)',
    hindiName: 'अनार दाने',
    foodState: 'raw',
    estimatedServing: '1 Cup Arils (150g)',
    calories: 130,
    protein: 2.5,
    carbs: 29,
    fats: 1.8,
    fiber: 6,
    confidence: 98,
    recommendedSlot: 'snack',
    healthRating: 'Excellent',
    benefits: ['Nitric Oxide Precursor', 'Vascular Muscle Pump', 'Punicalagin Antioxidants'],
    cookingImpactNote: 'Potent polyphenols enhance nitric oxide bioactivity for superior gym pumps.'
  }
];

/**
 * Simulates AI Scanning on image input or selection
 */
export function analyzeFoodImage(
  _imageSource: string | File | null,
  detectedName?: string,
  forcedState?: FoodState
): Promise<ScannedFoodResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (detectedName) {
        const found = SCANNED_FOOD_DATABASE.find(
          (f) => f.foodName.toLowerCase().includes(detectedName.toLowerCase())
        );
        if (found) {
          resolve(found);
          return;
        }
      }

      // Default random smart pick or state matching pick
      const filtered = forcedState
        ? SCANNED_FOOD_DATABASE.filter((f) => f.foodState === forcedState)
        : SCANNED_FOOD_DATABASE;

      const randomIndex = Math.floor(Math.random() * filtered.length);
      resolve(filtered[randomIndex] || SCANNED_FOOD_DATABASE[0]);
    }, 1200); // 1.2s realistic scanner animation
  });
}
