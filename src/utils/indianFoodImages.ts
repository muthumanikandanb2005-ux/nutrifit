import type { FoodItem, MealSlot } from '../types';

/**
 * Authentic Indian Dish Photo Registry
 * Maps Indian dishes to curated, appetizing food photography of real Indian culinary items.
 */
export function getIndianFoodImage(food: FoodItem): string {
  const name = food.name.toLowerCase();
  const hindi = (food.hindiName || '').toLowerCase();
  const tags = (food.tags || []).map(t => t.toLowerCase());

  // 1. Paneer dishes
  if (name.includes('paneer') || hindi.includes('पनीर')) {
    if (name.includes('bhurji') || name.includes('paratha')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80'; // Palak/Kadai Paneer
  }

  // 2. Chana / Chole / Rajma
  if (name.includes('chana') || name.includes('chole') || name.includes('rajma') || hindi.includes('छोले') || hindi.includes('चना')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80'; // Chana masala
  }

  // 3. Dal / Lentils / Sambar
  if (name.includes('dal') || name.includes('sambar') || hindi.includes('दाल') || hindi.includes('सांभर')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80'; // Dal Tadka
  }

  // 4. Eggs / Omelette / Bhurji
  if (name.includes('egg') || name.includes('anda') || hindi.includes('अंडा')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=80'; // Egg dish
  }

  // 5. Chicken / Fish / Non-Veg
  if (name.includes('chicken') || name.includes('fish') || name.includes('tandoori') || hindi.includes('चिकन')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80'; // Indian Chicken Curry
  }

  // 6. Idli / Dosa / South Indian
  if (name.includes('idli') || name.includes('dosa') || name.includes('uttapam') || hindi.includes('इडली') || hindi.includes('डोसा')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'; // Idli Sambar
  }

  // 7. Sprouts / Moong / Cheela / Salad
  if (name.includes('sprout') || name.includes('moong') || name.includes('salad') || hindi.includes('अंकुरित') || hindi.includes('सलाद')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80'; // Sprouts Salad
  }

  // 8. Cheela / Oats / Poha
  if (name.includes('cheela') || name.includes('chilla') || name.includes('poha') || name.includes('upma') || hindi.includes('चीला') || hindi.includes('पोहा')) {
    return 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&auto=format&fit=crop&q=80'; // Poha / Cheela
  }

  // 9. Sattu / Drinks / Detox / Lassi
  if (name.includes('sattu') || name.includes('drink') || name.includes('water') || name.includes('lassi') || name.includes('tea') || name.includes('chaas')) {
    return 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80'; // Desi Refreshing Beverage
  }

  // 10. Roasted Snacks / Makhana / Nuts / Chana
  if (name.includes('roasted') || name.includes('makhana') || name.includes('peanut') || name.includes('nut') || tags.includes('snack')) {
    return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400&auto=format&fit=crop&q=80'; // Roasted chana / nuts
  }

  // 11. Rice / Khichdi / Biryani / Pulao
  if (name.includes('rice') || name.includes('khichdi') || name.includes('pulao') || name.includes('biryani') || hindi.includes('चावल') || hindi.includes('खिचड़ी')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'; // Pulao / Biryani
  }

  // 12. Roti / Paratha / Chapati
  if (name.includes('roti') || name.includes('paratha') || name.includes('phulka') || hindi.includes('रोटी') || hindi.includes('पराठा')) {
    return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80'; // Roti Thali
  }

  // Slot-based Indian defaults
  const slotFallbacks: Record<MealSlot, string> = {
    early_morning: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80',
    breakfast: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
    lunch: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    snack: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400&auto=format&fit=crop&q=80',
    dinner: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80'
  };

  return slotFallbacks[food.slot] || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80';
}
