import type { RestaurantSwapItem } from '../types';

export const SWIGGY_SWAP_DATABASE: RestaurantSwapItem[] = [
  {
    id: 'sw_1',
    cuisine: 'north_indian',
    unhealthyChoice: 'Butter Naan + Paneer Butter Masala',
    unhealthyCalories: 850,
    healthySwap: '2 Tandoori Rotis + Tandoori Paneer Tikka / Paneer Bhurji',
    healthyCalories: 480,
    proteinSavedGrams: 12,
    reason: 'Eliminates heavy cream & maida flour while boosting protein density.'
  },
  {
    id: 'sw_2',
    cuisine: 'north_indian',
    unhealthyChoice: 'Dal Makhani + Jeera Rice',
    unhealthyCalories: 720,
    healthySwap: 'Yellow Moong Dal Tadka + Steamed Plain Rice / Roti',
    healthyCalories: 420,
    proteinSavedGrams: 4,
    reason: 'Cuts heavy butter/cream overload while preserving essential lentil proteins.'
  },
  {
    id: 'sw_3',
    cuisine: 'south_indian',
    unhealthyChoice: 'Ghee Paper Masala Dosa + Medu Vada (2)',
    unhealthyCalories: 780,
    healthySwap: '3 Steamed Idlis + Toor Dal Sambar & Mint Chutney',
    healthyCalories: 380,
    proteinSavedGrams: 8,
    reason: 'Deep-fried vada absorbs oil; steamed idlis with sambar provide clean fermented amino acids.'
  },
  {
    id: 'sw_4',
    cuisine: 'chinese',
    unhealthyChoice: 'Hakha Noodles + Veg Manchurian Gravy',
    unhealthyCalories: 890,
    healthySwap: 'Steamed Chicken/Tofu Momos + Hot & Sour Soup',
    healthyCalories: 390,
    proteinSavedGrams: 18,
    reason: 'Replaces deep-fried cornflour batter with steamed lean protein.'
  },
  {
    id: 'sw_5',
    cuisine: 'mughlai',
    unhealthyChoice: 'Mutton Galouti Kebab + Roomali Roti',
    unhealthyCalories: 820,
    healthySwap: 'Grilled Chicken Tikka + Green Salad + 1 Tandoori Roti',
    healthyCalories: 440,
    proteinSavedGrams: 22,
    reason: 'Lean chicken breast tikka provides 42g protein with zero hidden fat pastes.'
  }
];
