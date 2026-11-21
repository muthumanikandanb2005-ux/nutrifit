import type { FoodItem, MealSlot } from '../types';

/**
 * Authentic Indian Dish Photo Registry
 * Maps each Indian dish ID directly to its verified authentic photo in `/food-images/`.
 * Fallback semantic matching ensures custom or scanned foods also receive authentic imagery.
 */
export const EXACT_INDIAN_DISH_IMAGES: Record<string, string> = {
  // Early Morning
  em_1: '/food-images/em_1.jpg', // Warm Lemon Honey Water & Soaked Almonds
  em_2: '/food-images/em_2.jpg', // Sattu Protein Drink (Salted)
  em_3: '/food-images/em_3.jpg', // Methi Water & Soaked Walnuts

  // Breakfast
  bf_1: '/food-images/bf_1.jpg', // Sprouted Moong & Paneer Salad
  bf_2: '/food-images/bf_2.jpg', // Egg Bhurji + Whole Wheat Rotis
  bf_3: '/food-images/bf_3.jpg', // High-Protein Oats Besan Cheela
  bf_4: '/food-images/bf_4.jpg', // South Indian Steamed Idli + Sambar & Chutney
  bf_5: '/food-images/bf_5.jpg', // Paneer Stuffed Multigrain Paratha + Curd

  // Lunch
  lc_1: '/food-images/lc_1.jpg', // High Protein Chicken Curry + Rotis + Salad
  lc_2: '/food-images/lc_2.jpg', // Soya Chunks Masala Curry + Rice/Roti + Dal
  lc_3: '/food-images/lc_3.jpg', // Rajma Masala + Steamed Brown Rice
  lc_4: '/food-images/lc_4.jpg', // South Indian Fish Curry (Meen Kuzhambu)
  lc_5: '/food-images/lc_5.jpg', // Paneer Bhurji Gravy + Rotis + Salad

  // Evening Snacks
  sn_1: '/food-images/sn_1.jpg', // Roasted Makhana + Kulhad Masala Chai
  sn_2: '/food-images/sn_2.jpg', // Boiled Chana / Peanut Chaat
  sn_3: '/food-images/sn_3.jpg', // 3 Boiled Egg Whites + Black Pepper
  sn_4: '/food-images/sn_4.jpg', // Desi Whey Protein Shake with Milk/Water

  // Dinner
  dn_1: '/food-images/dn_1.jpg', // Grilled Tandoori Paneer Tikka + Mint Chutney
  dn_2: '/food-images/dn_2.jpg', // Grilled Tandoori Chicken Tikka + Salad
  dn_3: '/food-images/dn_3.jpg', // Yellow Moong Dal Khichdi + Ghee + Curd
  dn_4: '/food-images/dn_4.jpg', // Steamed Fish Fillet + Sautéed Veggies

  // Fresh Fruits
  fruit_1: '/food-images/fruit_1.jpg', // Fresh Papaya Bowl
  fruit_2: '/food-images/fruit_2.jpg', // Fresh Pink Guava with Chaat Masala
  fruit_3: '/food-images/fruit_3.jpg', // Alphonso Mango Slices
  fruit_4: '/food-images/fruit_4.jpg', // Fresh Pomegranate Seeds
  fruit_5: '/food-images/fruit_5.jpg', // Red Apple Slices with Cinnamon
  fruit_6: '/food-images/fruit_6.jpg', // Sweet Lime / Mosambi Slices
  fruit_7: '/food-images/fruit_7.jpg', // Fresh Watermelon Cubes
  fruit_8: '/food-images/fruit_8.jpg'  // Fresh Chiku (Sapodilla) Slices
};

/**
 * Returns the verified authentic Indian photo URL for any food item.
 */
export function getIndianFoodImage(food: FoodItem): string {
  // 1. Direct food image if explicitly assigned
  if (food.image) {
    return food.image;
  }

  // 2. Exact dish ID lookup
  if (food.id && EXACT_INDIAN_DISH_IMAGES[food.id]) {
    return EXACT_INDIAN_DISH_IMAGES[food.id];
  }

  const name = (food.name || '').toLowerCase();

  // 3. Precise Semantic Matching for custom/scanned foods
  if (name.includes('khichdi')) {
    return EXACT_INDIAN_DISH_IMAGES.dn_3;
  }

  if (name.includes('bhurji') && name.includes('egg')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_2;
  }

  if (name.includes('paratha')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_5;
  }

  if (name.includes('idli') || name.includes('dosa') || name.includes('sambar')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_4;
  }

  if (name.includes('cheela') || name.includes('chilla') || name.includes('uttapam')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_3;
  }

  if (name.includes('paneer tikka')) {
    return EXACT_INDIAN_DISH_IMAGES.dn_1;
  }

  if (name.includes('chicken tikka') || name.includes('tandoori chicken')) {
    return EXACT_INDIAN_DISH_IMAGES.dn_2;
  }

  if (name.includes('chicken')) {
    return EXACT_INDIAN_DISH_IMAGES.lc_1;
  }

  if (name.includes('fish') && (name.includes('curry') || name.includes('kuzhambu'))) {
    return EXACT_INDIAN_DISH_IMAGES.lc_4;
  }

  if (name.includes('fish')) {
    return EXACT_INDIAN_DISH_IMAGES.dn_4;
  }

  if (name.includes('rajma')) {
    return EXACT_INDIAN_DISH_IMAGES.lc_3;
  }

  if (name.includes('paneer')) {
    return EXACT_INDIAN_DISH_IMAGES.lc_5;
  }

  if (name.includes('sprout')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_1;
  }

  if (name.includes('boiled egg') || name.includes('egg white')) {
    return EXACT_INDIAN_DISH_IMAGES.sn_3;
  }

  if (name.includes('egg')) {
    return EXACT_INDIAN_DISH_IMAGES.bf_2;
  }

  if (name.includes('sattu') || name.includes('lassi') || name.includes('chaas')) {
    return EXACT_INDIAN_DISH_IMAGES.em_2;
  }

  if (name.includes('chai') || name.includes('tea')) {
    return EXACT_INDIAN_DISH_IMAGES.sn_1;
  }

  if (name.includes('chana') || name.includes('chaat')) {
    return EXACT_INDIAN_DISH_IMAGES.sn_2;
  }

  if (name.includes('shake') || name.includes('smoothie') || name.includes('protein drink')) {
    return EXACT_INDIAN_DISH_IMAGES.sn_4;
  }

  if (name.includes('almond')) {
    return EXACT_INDIAN_DISH_IMAGES.em_1;
  }

  if (name.includes('walnut')) {
    return EXACT_INDIAN_DISH_IMAGES.em_3;
  }

  // Fruit matches
  if (name.includes('papaya')) return EXACT_INDIAN_DISH_IMAGES.fruit_1;
  if (name.includes('guava')) return EXACT_INDIAN_DISH_IMAGES.fruit_2;
  if (name.includes('mango')) return EXACT_INDIAN_DISH_IMAGES.fruit_3;
  if (name.includes('pomegranate') || name.includes('anar')) return EXACT_INDIAN_DISH_IMAGES.fruit_4;
  if (name.includes('apple')) return EXACT_INDIAN_DISH_IMAGES.fruit_5;
  if (name.includes('lime') || name.includes('mosambi') || name.includes('orange')) return EXACT_INDIAN_DISH_IMAGES.fruit_6;
  if (name.includes('watermelon')) return EXACT_INDIAN_DISH_IMAGES.fruit_7;
  if (name.includes('chiku') || name.includes('sapodilla')) return EXACT_INDIAN_DISH_IMAGES.fruit_8;

  // 4. Authentic slot-based fallbacks
  const slotFallbacks: Record<MealSlot, string> = {
    early_morning: EXACT_INDIAN_DISH_IMAGES.em_1,
    breakfast: EXACT_INDIAN_DISH_IMAGES.bf_4,
    lunch: EXACT_INDIAN_DISH_IMAGES.lc_2,
    snack: EXACT_INDIAN_DISH_IMAGES.sn_1,
    dinner: EXACT_INDIAN_DISH_IMAGES.dn_3
  };

  return slotFallbacks[food.slot] || EXACT_INDIAN_DISH_IMAGES.lc_2;
}
