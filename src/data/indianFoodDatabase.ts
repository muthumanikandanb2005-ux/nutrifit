import type { FoodItem } from '../types';

export const INDIAN_FOOD_DATABASE: FoodItem[] = [
  // --- EARLY MORNING ---
  {
    id: 'em_1',
    name: 'Warm Lemon Honey Water & Soaked Almonds',
    hindiName: 'नींबू पानी और भीगे बादाम',
    slot: 'early_morning',
    calories: 85,
    protein: 3,
    carbs: 8,
    fats: 5,
    fiber: 2,
    servingSize: '1 Glass + 5 Almonds',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all', 'north_indian', 'south_indian', 'west_indian', 'east_indian'],
    budget: 'budget',
    prepTimeMins: 2,
    tags: ['Detox', 'Quick', 'Digestion'],
    ingredients: [
      { item: 'Lemon Juice', amount: '1 tbsp', category: 'vegetables' },
      { item: 'Honey', amount: '1 tsp', category: 'spices_pantry' },
      { item: 'Soaked Almonds', amount: '5 pieces', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Soak 5 almonds in water overnight and peel them in the morning.',
      'Squeeze half a lemon into lukewarm water with 1 tsp raw honey.',
      'Consume first thing in the morning.'
    ],
    tips: 'Aids metabolism and kickstarts morning hydration.'
  },
  {
    id: 'em_2',
    name: 'Sattu Protein Drink (Salted)',
    hindiName: 'सत्तू नमकीन शरबत',
    slot: 'early_morning',
    calories: 140,
    protein: 7,
    carbs: 20,
    fats: 2.5,
    fiber: 4,
    servingSize: '1 Glass (30g Sattu)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'vegan'],
    region: ['all', 'east_indian', 'north_indian'],
    budget: 'budget',
    prepTimeMins: 3,
    tags: ['Desi Protein', 'Desi Superfood', 'Cooling'],
    ingredients: [
      { item: 'Roasted Chana Sattu', amount: '30g', category: 'legumes' },
      { item: 'Jeera Powder & Black Salt', amount: '1/2 tsp', category: 'spices_pantry' },
      { item: 'Chilled Water', amount: '300ml', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Mix 2 tablespoons (30g) roasted chana sattu powder in cold water.',
      'Add roasted cumin (jeera) powder, pinch of black salt, and lemon juice.',
      'Stir well to avoid lumps and consume.'
    ],
    tips: 'The ultimate Indian natural protein powerhouse. High fiber & cooling for digestion.'
  },
  {
    id: 'em_3',
    name: 'Methi Water & Soaked Walnuts',
    hindiName: 'मेथी पानी और अखरोट',
    slot: 'early_morning',
    calories: 90,
    protein: 2.5,
    carbs: 4,
    fats: 7,
    fiber: 3,
    servingSize: '1 Glass + 2 Walnut Halves',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'moderate',
    prepTimeMins: 2,
    tags: ['Insulin Sensitivity', 'Heart Health'],
    ingredients: [
      { item: 'Methi (Fenugreek) Seeds', amount: '1 tsp', category: 'spices_pantry' },
      { item: 'Walnut Halves', amount: '2 pieces', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Soak 1 tsp fenugreek seeds in water overnight.',
      'Strain and drink the water. Eat soaked walnuts alongside.'
    ],
    tips: 'Great for blood sugar control and Omega-3 intake.'
  },

  // --- BREAKFAST ---
  {
    id: 'bf_1',
    name: 'Sprouted Moong & Paneer Salad',
    hindiName: 'अंकुरित मूंग और पनीर सलाद',
    slot: 'breakfast',
    calories: 320,
    protein: 22,
    carbs: 30,
    fats: 11,
    fiber: 9,
    servingSize: '1 Large Bowl (200g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'sattvic'],
    region: ['all', 'north_indian', 'west_indian'],
    budget: 'budget',
    prepTimeMins: 10,
    tags: ['High Protein', 'Raw/Light', 'Fiber Rich'],
    ingredients: [
      { item: 'Sprouted Green Moong', amount: '100g', category: 'legumes' },
      { item: 'Low-Fat Paneer (Diced)', amount: '75g', category: 'dairy_poultry' },
      { item: 'Cucumber & Tomato', amount: '1/2 cup', category: 'vegetables' },
      { item: 'Lemon & Chaat Masala', amount: 'To Taste', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Steam sprouted moong for 3 minutes (optional for easy digestion).',
      'Toss steamed moong with diced fresh paneer, chopped cucumber, tomato, and coriander.',
      'Season with lemon juice, black salt, and chaat masala.'
    ],
    tips: 'Low fat paneer packs 18g protein per 100g. Steam sprouts slightly to avoid bloating.'
  },
  {
    id: 'bf_2',
    name: 'Egg Bhurji (3 Eggs) + 2 Whole Wheat Rotis',
    hindiName: 'अंडा भूर्जी और 2 रोटी',
    slot: 'breakfast',
    calories: 410,
    protein: 26,
    carbs: 34,
    fats: 18,
    fiber: 5,
    servingSize: '3 Eggs + 2 Rotis',
    dietType: ['eggetarian', 'non_veg'],
    region: ['all', 'north_indian', 'west_indian'],
    budget: 'budget',
    prepTimeMins: 12,
    tags: ['High Protein', 'Lean Muscle', 'Quick Prep'],
    ingredients: [
      { item: 'Whole Eggs', amount: '2 Large', category: 'dairy_poultry' },
      { item: 'Egg Whites', amount: '2 Large', category: 'dairy_poultry' },
      { item: 'Onion, Tomato, Green Chili', amount: '1/2 cup', category: 'vegetables' },
      { item: 'Multigrain Atta Rotis', amount: '2 (60g)', category: 'grains' },
      { item: 'Mustard Oil / Ghee', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Sauté onions, tomatoes, and green chilies in 1 tsp oil with turmeric and salt.',
      'Whisk 2 whole eggs + 2 egg whites, pour into the pan, and scramble till cooked.',
      'Serve hot with 2 fresh multigrain rotis.'
    ],
    tips: 'Combining whole eggs with egg whites provides high bioavailability protein while controlling fats.'
  },
  {
    id: 'bf_3',
    name: 'High-Protein Oats Besan Chela (2 Pcs)',
    hindiName: 'ओट्स बेसन चीला (2)',
    slot: 'breakfast',
    calories: 330,
    protein: 16,
    carbs: 45,
    fats: 9,
    fiber: 8,
    servingSize: '2 Medium Chilas + Mint Chutney',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'vegan'],
    region: ['all', 'north_indian', 'west_indian'],
    budget: 'budget',
    prepTimeMins: 15,
    tags: ['Complex Carbs', 'Vegan Protein', 'Gluten-Free Option'],
    ingredients: [
      { item: 'Besan (Gram Flour)', amount: '40g', category: 'legumes' },
      { item: 'Rolled Oats Powder', amount: '30g', category: 'grains' },
      { item: 'Grated Paneer/Tofu', amount: '30g', category: 'dairy_poultry' },
      { item: 'Chopped Spinach & Carrots', amount: '1/2 cup', category: 'vegetables' }
    ],
    recipeInstructions: [
      'Mix besan, powdered oats, water, chopped veggies, ajwain, and spices to form batter.',
      'Pour batter onto a warm non-stick tawa using minimal ghee/oil spray.',
      'Cook both sides till golden brown. Stuff with grated paneer or tofu if desired.'
    ],
    tips: 'Besan + Oats has a low glycemic index, keeping full until lunch.'
  },
  {
    id: 'bf_4',
    name: 'South Indian Steamed Idli (3) + Sambar & Chutney',
    hindiName: 'इडली, सांभर और प्रोटीन नारियल चटनी',
    slot: 'breakfast',
    calories: 360,
    protein: 15,
    carbs: 58,
    fats: 7,
    fiber: 7,
    servingSize: '3 Oats/Urad Idlis + 1 Bowl Sambar',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all', 'south_indian'],
    budget: 'budget',
    prepTimeMins: 15,
    tags: ['Fermented Gut-Friendly', 'South Indian Classic'],
    ingredients: [
      { item: 'Idli Batter (Urad & Rice/Oats)', amount: '150g', category: 'grains' },
      { item: 'Toor Dal Sambar with Veggies', amount: '1 Bowl (200ml)', category: 'legumes' },
      { item: 'Roasted Chana Coconut Chutney', amount: '2 tbsp', category: 'legumes' }
    ],
    recipeInstructions: [
      'Steam idli batter in idli stand for 10-12 minutes.',
      'Prepare lentil sambar loaded with drumsticks, pumpkin, and tomatoes.',
      'Serve piping hot idlis dipped in sambar.'
    ],
    tips: 'Fermented urad dal and rice combination enhances amino acid availability and gut health.'
  },
  {
    id: 'bf_5',
    name: 'Paneer Stuffed Multigrain Paratha (1) + Curd',
    hindiName: 'पनीर पराठा और दही',
    slot: 'breakfast',
    calories: 390,
    protein: 20,
    carbs: 42,
    fats: 15,
    fiber: 6,
    servingSize: '1 Paratha + 100g Dahi',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'sattvic'],
    region: ['all', 'north_indian'],
    budget: 'budget',
    prepTimeMins: 15,
    tags: ['Punjabi Favorite', 'Satiating'],
    ingredients: [
      { item: 'Multigrain Dough', amount: '50g', category: 'grains' },
      { item: 'Low Fat Grated Paneer', amount: '80g', category: 'dairy_poultry' },
      { item: 'Fresh Plain Curd / Dahi', amount: '100g', category: 'dairy_poultry' },
      { item: 'Ghee', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Stuff multigrain dough with low fat paneer mixed with green chili, coriander, and ajwain.',
      'Roll gently and roast on tawa using 1 tsp ghee.',
      'Serve hot with fresh cold curd.'
    ],
    tips: 'Dry-roast on tawa and add ghee at the very end to save calories while retaining authentic taste.'
  },

  // --- LUNCH ---
  {
    id: 'lc_1',
    name: 'High Protein Chicken Curry + 2 Rotis + Salad',
    hindiName: 'चिकन करी, 2 रोटी और सलाद',
    slot: 'lunch',
    calories: 520,
    protein: 44,
    carbs: 42,
    fats: 16,
    fiber: 7,
    servingSize: '150g Chicken Breast + 2 Rotis + Salad',
    dietType: ['non_veg'],
    region: ['all', 'north_indian', 'west_indian', 'east_indian'],
    budget: 'moderate',
    prepTimeMins: 25,
    tags: ['Lean Muscle', 'High Protein', 'Classic Desi'],
    ingredients: [
      { item: 'Skinless Chicken Breast', amount: '150g', category: 'dairy_poultry' },
      { item: 'Onion-Tomato Masala Gravy', amount: '1 Cup', category: 'vegetables' },
      { item: 'Whole Wheat Rotis', amount: '2 (60g)', category: 'grains' },
      { item: 'Mixed Cucumber Tomato Salad', amount: '1 Bowl', category: 'vegetables' },
      { item: 'Mustard Oil / Ghee', amount: '1.5 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Sauté diced chicken breast with ginger-garlic paste, onion-tomato puree, and spices.',
      'Simmer for 15 minutes till tender and chicken absorbs flavors.',
      'Serve with 2 freshly puffed rotis and a large raw salad.'
    ],
    tips: 'Chicken breast gives ~31g protein per 100g with minimal fat.'
  },
  {
    id: 'lc_2',
    name: 'Soya Chunks Masala Curry + Brown Rice/Roti + Dal',
    hindiName: 'सोया चंक्स करी, ब्राउन राइस और दाल',
    slot: 'lunch',
    calories: 490,
    protein: 36,
    carbs: 62,
    fats: 10,
    fiber: 11,
    servingSize: '50g Raw Soya + 1 Bowl Brown Rice + 1 Bowl Dal',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'vegan'],
    region: ['all', 'north_indian', 'east_indian'],
    budget: 'budget',
    prepTimeMins: 20,
    tags: ['Plant Protein King', 'Budget Friendly', 'High Fiber'],
    ingredients: [
      { item: 'Soya Chunks (Nutrela)', amount: '50g (Dry)', category: 'legumes' },
      { item: 'Cooked Brown Rice / Multigrain Rotis', amount: '150g Rice or 2 Rotis', category: 'grains' },
      { item: 'Yellow Moong / Arhar Dal', amount: '1 Bowl (150ml)', category: 'legumes' },
      { item: 'Spices & Tomatoes', amount: '1/2 cup', category: 'vegetables' }
    ],
    recipeInstructions: [
      'Boil soya chunks in water with a pinch of salt, squeeze out excess water completely.',
      'Cook in onion-tomato gravy with garam masala, turmeric, and coriander powder.',
      'Serve alongside yellow moong dal and warm brown rice or rotis.'
    ],
    tips: 'Soya chunks contain over 52% protein by weight—the ultimate budget plant protein in India!'
  },
  {
    id: 'lc_3',
    name: 'Rajma Masala + Steamed Brown Rice + Sirka Onion',
    hindiName: 'राजमा चावल और सिरका प्याज',
    slot: 'lunch',
    calories: 460,
    protein: 21,
    carbs: 74,
    fats: 8,
    fiber: 12,
    servingSize: '1 Large Bowl Rajma + 1 Bowl Rice',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'sattvic', 'vegan'],
    region: ['all', 'north_indian'],
    budget: 'budget',
    prepTimeMins: 30,
    tags: ['Comfort Food', 'High Fiber', 'Complex Carbs'],
    ingredients: [
      { item: 'Raw Red Kidney Beans (Rajma)', amount: '60g', category: 'legumes' },
      { item: 'Cooked Steamed Brown/White Rice', amount: '150g', category: 'grains' },
      { item: 'Tomato Ginger Gravy', amount: '1 Cup', category: 'vegetables' },
      { item: 'Ghee Tadka', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Soak rajma overnight and pressure cook with whole spices for 6-7 whistles.',
      'Prepare gravy with tomatoes, ginger, heeng, and rajma masala. Temper with 1 tsp ghee.',
      'Serve with steamed rice and vinegar-soaked onions.'
    ],
    tips: 'Rajma + Rice provides a complete essential amino acid profile.'
  },
  {
    id: 'lc_4',
    name: 'South Indian Fish Curry (Meen Kuzhambu) + Matta Rice + Poriyal',
    hindiName: 'साउथ इंडियन फिश करी, मट्टा राइस और बीन्स पोरियल',
    slot: 'lunch',
    calories: 480,
    protein: 38,
    carbs: 52,
    fats: 12,
    fiber: 6,
    servingSize: '150g Rohu/Surmai Fish + 1 Bowl Matta Rice',
    dietType: ['non_veg'],
    region: ['all', 'south_indian', 'east_indian'],
    budget: 'moderate',
    prepTimeMins: 25,
    tags: ['Omega-3', 'Lean Fish', 'Traditional'],
    ingredients: [
      { item: 'Fresh Fish Fillet (Rohu/Kingfish/Surmai)', amount: '150g', category: 'dairy_poultry' },
      { item: 'Tamarind & Coconut Mustard Gravy', amount: '1 Cup', category: 'vegetables' },
      { item: 'Kerala Matta / Boiled Rice', amount: '150g Cooked', category: 'grains' },
      { item: 'Beans Carrot Poriyal', amount: '1 Bowl', category: 'vegetables' }
    ],
    recipeInstructions: [
      'Simmer fish pieces in tamarind, curry leaves, fenugreek, and coconut gravy.',
      'Serve hot over nutrient-rich Kerala red matta rice with side of coconut beans poriyal.'
    ],
    tips: 'Fish is easy to digest, rich in Omega-3 fatty acids and iodine.'
  },
  {
    id: 'lc_5',
    name: 'Paneer Bhurji Gravy + 2 Jowar/Multigrain Rotis + Green Salad',
    hindiName: 'पनीर भूर्जी ग्रेवी, 2 ज्वार रोटी और सलाद',
    slot: 'lunch',
    calories: 470,
    protein: 24,
    carbs: 45,
    fats: 20,
    fiber: 9,
    servingSize: '100g Low Fat Paneer + 2 Jowar Rotis',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain'],
    region: ['all', 'west_indian', 'north_indian'],
    budget: 'moderate',
    prepTimeMins: 20,
    tags: ['Low GI', 'Gluten Free Roti', 'High Protein Veg'],
    ingredients: [
      { item: 'Low Fat Crumbled Paneer', amount: '100g', category: 'dairy_poultry' },
      { item: 'Jowar (Sorghum) Flour Rotis', amount: '2 (70g)', category: 'grains' },
      { item: 'Capsicum Onion Masala', amount: '1 Cup', category: 'vegetables' },
      { item: 'Cold Pressed Oil', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Crumble paneer and sauté with chopped bell peppers, onions, tomatoes, and kasuri methi.',
      'Make gluten-free Jowar rotis by kneading with warm water.',
      'Enjoy with cucumber and beetroot salad.'
    ],
    tips: 'Jowar is rich in dietary fiber and magnesium, keeping blood sugar stable.'
  },

  // --- EVENING SNACK ---
  {
    id: 'sn_1',
    name: 'Roasted Makhana (Foxnuts) + 1 Cup Masala Chai (No Sugar)',
    hindiName: 'भुना मखाना और मसाला चाय',
    slot: 'snack',
    calories: 160,
    protein: 5,
    carbs: 26,
    fats: 4,
    fiber: 4,
    servingSize: '30g Roasted Makhana + 150ml Tea',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 5,
    tags: ['Crunchy', 'Low Calorie', 'Antioxidant Rich'],
    ingredients: [
      { item: 'Makhana (Phool Makhana)', amount: '30g', category: 'spices_pantry' },
      { item: 'Ghee', amount: '1/2 tsp', category: 'spices_pantry' },
      { item: 'Black Pepper & Mint Salt', amount: '1/2 tsp', category: 'spices_pantry' },
      { item: 'Low Fat Milk Chai', amount: '150ml (No Sugar)', category: 'dairy_poultry' }
    ],
    recipeInstructions: [
      'Dry roast makhana in a pan with 1/2 tsp ghee till crispy.',
      'Toss with black pepper, pink salt, and chaat masala.',
      'Pair with warm cardamom ginger tea sweetened with stevia or no sugar.'
    ],
    tips: 'Makhana is low in calories and packed with calcium and antioxidants.'
  },
  {
    id: 'sn_2',
    name: 'Boiled Chana / Peanut Chaat',
    hindiName: 'उबला काला चना / मूंगफली चाट',
    slot: 'snack',
    calories: 210,
    protein: 11,
    carbs: 28,
    fats: 6,
    fiber: 7,
    servingSize: '1 Bowl (120g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 8,
    tags: ['High Fiber', 'Street Food Style', 'Filling'],
    ingredients: [
      { item: 'Boiled Black Chana / Raw Peanuts', amount: '100g Cooked', category: 'legumes' },
      { item: 'Chopped Onion, Tomato, Green Chili', amount: '1/2 Cup', category: 'vegetables' },
      { item: 'Lemon Juice & Black Salt', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Boil soaked black chana (Kala Chana) till soft.',
      'Toss with finely diced onions, tomatoes, raw mango, coriander, green chili, and lemon juice.'
    ],
    tips: 'Kala Chana has a low glycemic index and provides steady energy for evening workouts.'
  },
  {
    id: 'sn_3',
    name: '3 Boiled Egg Whites + Black Pepper',
    hindiName: '3 उबले अंडे (सफेद भाग)',
    slot: 'snack',
    calories: 52,
    protein: 11,
    carbs: 1,
    fats: 0.2,
    fiber: 0,
    servingSize: '3 Egg Whites',
    dietType: ['eggetarian', 'non_veg'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 10,
    tags: ['Pure Lean Protein', 'Zero Fat', 'Post Workout'],
    ingredients: [
      { item: 'Egg Whites', amount: '3 Large', category: 'dairy_poultry' },
      { item: 'Black Pepper & Chaat Masala', amount: 'To Taste', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Boil eggs for 10 minutes, peel, cut in half and discard yolk (or consume 1 yolk).',
      'Sprinkle black pepper and lemon juice.'
    ],
    tips: '100% pure bioavailable protein ideal for fast muscle synthesis.'
  },
  {
    id: 'sn_4',
    name: 'Desi Whey Protein Shake with Cold Water/Milk',
    hindiName: 'वे प्रोटीन शेक',
    slot: 'snack',
    calories: 140,
    protein: 25,
    carbs: 3,
    fats: 2,
    fiber: 1,
    servingSize: '1 Scoop (33g) + 250ml Water',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg'],
    region: ['all'],
    budget: 'premium',
    prepTimeMins: 2,
    tags: ['Convenient', 'Post-Workout', 'Max Protein'],
    ingredients: [
      { item: 'Whey Protein Isolate/Concentrate', amount: '1 Scoop (30-33g)', category: 'dairy_poultry' },
      { item: 'Chilled Water or Skimmed Milk', amount: '250ml', category: 'dairy_poultry' }
    ],
    recipeInstructions: [
      'Add 1 scoop of whey protein to 250ml chilled water or skimmed milk in a shaker.',
      'Shake vigorously for 20 seconds and consume post workout.'
    ],
    tips: 'Easiest way to hit high daily protein targets without excess carbs or fats.'
  },

  // --- DINNER ---
  {
    id: 'dn_1',
    name: 'Grilled Tandoori Paneer / Tofu Tikka + Mint Chutney & Salad',
    hindiName: 'तंदूरी पनीर/टोफू टिक्का और हरी चटनी',
    slot: 'dinner',
    calories: 380,
    protein: 26,
    carbs: 16,
    fats: 22,
    fiber: 5,
    servingSize: '150g Paneer/Tofu Tikka + Green Salad',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'vegan', 'jain'],
    region: ['all', 'north_indian', 'west_indian'],
    budget: 'moderate',
    prepTimeMins: 20,
    tags: ['Low Carb Dinner', 'Tandoori Special', 'High Protein'],
    ingredients: [
      { item: 'Low Fat Paneer or Extra Firm Tofu', amount: '150g', category: 'dairy_poultry' },
      { item: 'Hung Curd / Dahi Marinade', amount: '3 tbsp', category: 'dairy_poultry' },
      { item: 'Diced Bell Peppers & Onions', amount: '1 Cup', category: 'vegetables' },
      { item: 'Mint Coriander Chutney', amount: '2 tbsp', category: 'vegetables' }
    ],
    recipeInstructions: [
      'Marinate paneer/tofu cubes and veggies in hung curd, ginger paste, kasuri methi, mustard oil, and tikka spices for 15 mins.',
      'Air-fry or grill on tawa till lightly charred.',
      'Serve hot with mint chutney and fresh lemon.'
    ],
    tips: 'Low carb high protein dinner supports fat loss during overnight sleep.'
  },
  {
    id: 'dn_2',
    name: 'Grilled Tandoori Chicken Tikka + Garlic Spinach Salad',
    hindiName: 'चिकन टिक्का और पालक सलाद',
    slot: 'dinner',
    calories: 360,
    protein: 42,
    carbs: 10,
    fats: 14,
    fiber: 4,
    servingSize: '180g Chicken Breast Tikka',
    dietType: ['non_veg'],
    region: ['all', 'north_indian'],
    budget: 'moderate',
    prepTimeMins: 20,
    tags: ['Keto-Friendly', 'High Lean Muscle', 'Low Carb'],
    ingredients: [
      { item: 'Boneless Chicken Breast Cubes', amount: '180g', category: 'dairy_poultry' },
      { item: 'Curd Spiced Marinade', amount: '3 tbsp', category: 'dairy_poultry' },
      { item: 'Sautéed Garlic Spinach', amount: '1 Bowl', category: 'vegetables' }
    ],
    recipeInstructions: [
      'Marinate chicken breast cubes in spiced curd marinade.',
      'Pan grill on non-stick pan with minimal oil spray for 10-12 mins.',
      'Serve alongside sautéed baby spinach in olive oil and garlic.'
    ],
    tips: 'High protein content prevents nocturnal muscle breakdown.'
  },
  {
    id: 'dn_3',
    name: 'Yellow Moong Dal Khichdi + Desi Ghee + Curd',
    hindiName: 'मूंग दाल खिचड़ी, घी और दही',
    slot: 'dinner',
    calories: 390,
    protein: 16,
    carbs: 60,
    fats: 9,
    fiber: 8,
    servingSize: '1 Large Bowl Khichdi + 100g Curd',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic'],
    region: ['all', 'north_indian', 'west_indian'],
    budget: 'budget',
    prepTimeMins: 20,
    tags: ['Easy Digestion', 'Ayurvedic Classic', 'Soothing'],
    ingredients: [
      { item: 'Yellow Split Moong Dal', amount: '40g', category: 'legumes' },
      { item: 'Rice or Quinoa', amount: '40g', category: 'grains' },
      { item: 'Desi Cow Ghee', amount: '1 tsp', category: 'spices_pantry' },
      { item: 'Plain Curd', amount: '100g', category: 'dairy_poultry' },
      { item: 'Cumin (Jeera) & Hing', amount: '1/2 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Pressure cook equal parts moong dal and rice with turmeric, salt, and water.',
      'Temper with 1 tsp ghee, jeera, hing, and curry leaves.',
      'Serve warm with cold fresh curd.'
    ],
    tips: 'Lightest dinner for effortless digestion and sound sleep.'
  },
  {
    id: 'dn_4',
    name: 'Steamed Fish Fillet + Sautéed Exotic Veggies',
    hindiName: 'स्टीम्ड फिश और टॉस की हुई सब्जियां',
    slot: 'dinner',
    calories: 330,
    protein: 36,
    carbs: 14,
    fats: 12,
    fiber: 5,
    servingSize: '160g Fish + 1 Bowl Veggies',
    dietType: ['non_veg'],
    region: ['all', 'east_indian', 'south_indian'],
    budget: 'premium',
    prepTimeMins: 15,
    tags: ['Clean Eating', 'Low Calorie', 'High Omega-3'],
    ingredients: [
      { item: 'Basa / Tilapia / Salmon Fillet', amount: '160g', category: 'dairy_poultry' },
      { item: 'Broccoli, Beans, Bell Peppers', amount: '1.5 Cups', category: 'vegetables' },
      { item: 'Lemon Butter Garlic Sauce', amount: '1 tsp', category: 'spices_pantry' }
    ],
    recipeInstructions: [
      'Season fish with lemon juice, crushed black pepper, garlic powder, and salt.',
      'Steam or bake for 10-12 minutes.',
      'Sauté broccoli, bell peppers, and zucchini in 1 tsp olive oil or butter.'
    ],
    tips: 'Extremely light on stomach with high nutrient density.'
  },

  // --- INDIAN FRUITS & NATURALLY SWEET SUPERFOODS ---
  {
    id: 'fruit_1',
    name: 'Fresh Papaya (Papiha) Bowl',
    hindiName: 'ताजा पपीता',
    slot: 'snack',
    calories: 120,
    protein: 1.5,
    carbs: 30,
    fats: 0.4,
    fiber: 5,
    servingSize: '1 Medium Bowl (250g Cubes)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 3,
    tags: ['Fruit', 'Digestion', 'Papain Enzyme', 'Low Calorie'],
    ingredients: [
      { item: 'Ripe Papaya Cubes', amount: '250g', category: 'vegetables' },
      { item: 'Black Salt & Lemon Juice', amount: '1 pinch', category: 'spices_pantry' }
    ],
    tips: 'Contains papain enzymes that drastically enhance protein breakdown and gut digestion.'
  },
  {
    id: 'fruit_2',
    name: 'Fresh Guava (Amrood) with Chaat Masala',
    hindiName: 'ताजा अमरूद',
    slot: 'snack',
    calories: 110,
    protein: 4.2,
    carbs: 23,
    fats: 1.5,
    fiber: 9,
    servingSize: '2 Medium Guavas (160g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 2,
    tags: ['Fruit', 'High Fiber', 'Vitamin C', 'Low GI'],
    ingredients: [
      { item: 'Fresh Pink/White Guava', amount: '2 pieces', category: 'vegetables' },
      { item: 'Chaat Masala & Black Pepper', amount: '1/2 tsp', category: 'spices_pantry' }
    ],
    tips: 'Packed with 4x more Vitamin C than oranges and exceptionally high dietary fiber.'
  },
  {
    id: 'fruit_3',
    name: 'Alphonso Mango Slices (Aam)',
    hindiName: 'ताजा आम',
    slot: 'snack',
    calories: 150,
    protein: 1.8,
    carbs: 38,
    fats: 0.6,
    fiber: 3.5,
    servingSize: '1 Medium Mango (200g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all', 'west_indian', 'north_indian'],
    budget: 'moderate',
    prepTimeMins: 2,
    tags: ['Fruit', 'Pre-Workout Energy', 'Rich Antioxidants'],
    ingredients: [
      { item: 'Ripe Mango Slices', amount: '200g', category: 'vegetables' }
    ],
    tips: 'Natural fast-acting glycogen replenishment, ideal 45 mins before heavy gym workouts.'
  },
  {
    id: 'fruit_4',
    name: 'Pomegranate (Anar) Seeds',
    hindiName: 'अनार के दाने',
    slot: 'snack',
    calories: 130,
    protein: 2.5,
    carbs: 29,
    fats: 1.8,
    fiber: 6,
    servingSize: '1 Cup Seeds (150g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'moderate',
    prepTimeMins: 5,
    tags: ['Fruit', 'Nitric Oxide Booster', 'Blood Flow', 'Heart Health'],
    ingredients: [
      { item: 'Pomegranate Arils', amount: '150g', category: 'vegetables' }
    ],
    tips: 'Rich in polyphenols and natural nitrates for vascular health and muscle pumps.'
  },
  {
    id: 'fruit_5',
    name: 'Red Apple (Seb) with Cinnamon',
    hindiName: 'सेब और दालचीनी',
    slot: 'snack',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
    fiber: 4.4,
    servingSize: '1 Large Apple (180g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'moderate',
    prepTimeMins: 2,
    tags: ['Fruit', 'Pectin Fiber', 'Fat Loss Satiety'],
    ingredients: [
      { item: 'Fresh Apple Slices', amount: '180g', category: 'vegetables' },
      { item: 'Ceylon Cinnamon Powder', amount: '1/4 tsp', category: 'spices_pantry' }
    ],
    tips: 'High in pectin fiber to curb hunger cravings between thali meals.'
  },
  {
    id: 'fruit_6',
    name: 'Sweet Lime / Mosambi Slices',
    hindiName: 'मौसमी फल',
    slot: 'snack',
    calories: 80,
    protein: 1.2,
    carbs: 20,
    fats: 0.3,
    fiber: 4,
    servingSize: '2 Medium Mosambi (200g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 3,
    tags: ['Fruit', 'Hydration', 'Electrolytes', 'Vitamin C'],
    ingredients: [
      { item: 'Fresh Mosambi Wedges', amount: '200g', category: 'vegetables' }
    ],
    tips: 'Refreshing post-workout hydration packed with bioflavonoids and electrolytes.'
  },
  {
    id: 'fruit_7',
    name: 'Fresh Watermelon (Tarbooz) Cubes',
    hindiName: 'तरबूज के टुकड़े',
    slot: 'snack',
    calories: 90,
    protein: 1.8,
    carbs: 22,
    fats: 0.4,
    fiber: 1.5,
    servingSize: '300g Cubes',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all'],
    budget: 'budget',
    prepTimeMins: 3,
    tags: ['Fruit', 'L-Citrulline', 'Hydration', 'Low Calorie Density'],
    ingredients: [
      { item: 'Watermelon Cubes', amount: '300g', category: 'vegetables' },
      { item: 'Mint Leaves & Black Salt', amount: '1 pinch', category: 'spices_pantry' }
    ],
    tips: 'Rich in natural L-Citrulline which enhances workout recovery and reduces muscle soreness.'
  },
  {
    id: 'fruit_8',
    name: 'Chiku (Sapodilla) Slices',
    hindiName: 'चीकू फल',
    slot: 'snack',
    calories: 140,
    protein: 0.8,
    carbs: 34,
    fats: 1.8,
    fiber: 9,
    servingSize: '2 Medium Chikus (150g)',
    dietType: ['pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'],
    region: ['all', 'west_indian', 'south_indian'],
    budget: 'budget',
    prepTimeMins: 2,
    tags: ['Fruit', 'High Fiber', 'Natural Energy'],
    ingredients: [
      { item: 'Fresh Chiku Slices', amount: '150g', category: 'vegetables' }
    ],
    tips: 'Extremely high dietary fiber content combined with soothing natural fructose energy.'
  }
];

