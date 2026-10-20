import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBMR, getActivityMultiplier, calculateMacroGoals } from './nutritionCalculator.ts';
import { filterCompatibleFoods, generateDailyMealPlan } from './mealPlanGenerator.ts';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoodDatabase.ts';
import type { UserProfile } from '../types/index.ts';

const baseProfile: UserProfile = {
  name: 'Test Athlete',
  age: 25,
  gender: 'male',
  weightKg: 70,
  heightCm: 175,
  activityLevel: 'moderately_active',
  goal: 'muscle_gain',
  dietType: 'pure_veg',
  region: 'all',
  budget: 'moderate',
  medicalConditions: []
};

test('calculateBMR: verifies Mifflin-St Jeor equation for male and female', () => {
  // Male: 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
  const bmrMale = calculateBMR(70, 175, 25, 'male');
  assert.equal(bmrMale, 1674);

  // Female: 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
  const bmrFemale = calculateBMR(60, 165, 30, 'female');
  assert.equal(bmrFemale, 1320);
});

test('getActivityMultiplier: covers all activity levels', () => {
  assert.equal(getActivityMultiplier('sedentary'), 1.2);
  assert.equal(getActivityMultiplier('lightly_active'), 1.375);
  assert.equal(getActivityMultiplier('moderately_active'), 1.55);
  assert.equal(getActivityMultiplier('very_active'), 1.725);
  assert.equal(getActivityMultiplier('extra_active'), 1.9);
});

test('calculateMacroGoals: generates balanced macros and valid calorie sum', () => {
  const goals = calculateMacroGoals(baseProfile);
  assert.ok(goals.calories > 0);
  assert.ok(goals.proteinGrams > 0);
  assert.ok(goals.carbsGrams > 0);
  assert.ok(goals.fatsGrams > 0);
  assert.equal(goals.fiberGrams, 35); // Male fiber standard

  // Sum check: P*4 + F*9 + C*4 must equal calculated calories
  const sum = (goals.proteinGrams * 4) + (goals.fatsGrams * 9) + (goals.carbsGrams * 4);
  assert.equal(goals.calories, sum);
});

test('calculateMacroGoals: handles fat loss, recomp, and maintenance goals', () => {
  const fatLossGoals = calculateMacroGoals({ ...baseProfile, goal: 'fat_loss' });
  const maintGoals = calculateMacroGoals({ ...baseProfile, goal: 'maintenance' });
  const surplusGoals = calculateMacroGoals({ ...baseProfile, goal: 'muscle_gain' });

  assert.ok(fatLossGoals.calories < maintGoals.calories);
  assert.ok(surplusGoals.calories > maintGoals.calories);
});

test('filterCompatibleFoods: high_protein_veg NEVER includes non_veg or eggetarian dishes', () => {
  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;
  const highProteinVegProfile = { ...baseProfile, dietType: 'high_protein_veg' as const };

  for (const slot of slots) {
    const foods = filterCompatibleFoods(slot, highProteinVegProfile);
    for (const food of foods) {
      const isMeatOrPoultry = food.dietType.includes('non_veg') && !food.dietType.includes('pure_veg');
      const isEgg = food.dietType.includes('eggetarian') && !food.dietType.includes('pure_veg');
      assert.equal(isMeatOrPoultry, false, `${food.name} must not be meat`);
      assert.equal(isEgg, false, `${food.name} must not be egg`);
      assert.equal(food.dietType.includes('high_protein_veg'), true, `${food.name} must be tagged high_protein_veg`);
    }
  }
});

test('filterCompatibleFoods: sattvic diet NEVER includes non-sattvic dishes', () => {
  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;
  const sattvicProfile = { ...baseProfile, dietType: 'sattvic' as const };

  for (const slot of slots) {
    const foods = filterCompatibleFoods(slot, sattvicProfile);
    for (const food of foods) {
      assert.equal(food.dietType.includes('sattvic'), true, `${food.name} must be sattvic`);
    }
  }
});

test('filterCompatibleFoods: jain diet NEVER includes non-jain dishes', () => {
  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;
  const jainProfile = { ...baseProfile, dietType: 'jain' as const };

  for (const slot of slots) {
    const foods = filterCompatibleFoods(slot, jainProfile);
    for (const food of foods) {
      assert.equal(food.dietType.includes('jain'), true, `${food.name} must be jain`);
    }
  }
});

test('generateDailyMealPlan: produces all 5 slots and rotates meals with variationIndex', () => {
  const planDay1 = generateDailyMealPlan(baseProfile, 2200, 0);
  const planDay2 = generateDailyMealPlan(baseProfile, 2200, 1);

  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;
  for (const slot of slots) {
    assert.ok(planDay1.meals[slot], `Missing meal for ${slot}`);
    assert.ok(planDay2.meals[slot], `Missing meal for ${slot}`);
  }

  // Verify that varying variationIndex creates dish variety in candidate pools
  const hasAnyDifference = slots.some(slot => planDay1.meals[slot].id !== planDay2.meals[slot].id);
  assert.equal(hasAnyDifference, true, 'VariationIndex should rotate dishes for daily variety');
});

test('generateDailyMealPlan: produces 100% compliant meals for all 7 diet types across all slots', () => {
  const diets: UserProfile['dietType'][] = [
    'pure_veg', 'eggetarian', 'non_veg', 'high_protein_veg', 'jain', 'sattvic', 'vegan'
  ];
  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;

  for (const diet of diets) {
    const prof = { ...baseProfile, dietType: diet };
    for (let day = 0; day < 7; day++) {
      const plan = generateDailyMealPlan(prof, 2000, day);
      for (const slot of slots) {
        const meal = plan.meals[slot];
        assert.ok(meal, `Missing meal for diet ${diet} on slot ${slot} day ${day}`);

        if (diet === 'pure_veg' || diet === 'jain' || diet === 'sattvic' || diet === 'vegan' || diet === 'high_protein_veg') {
          // Must NEVER be meat or egg
          const isMeat = meal.dietType.includes('non_veg') && !meal.dietType.includes('pure_veg');
          const isEgg = meal.dietType.includes('eggetarian') && !meal.dietType.includes('pure_veg');
          assert.equal(isMeat, false, `Diet ${diet} received meat meal ${meal.name} in slot ${slot}`);
          assert.equal(isEgg, false, `Diet ${diet} received egg meal ${meal.name} in slot ${slot}`);
        }

        if (diet === 'jain') {
          assert.equal(meal.dietType.includes('jain'), true, `Jain diet received non-jain meal ${meal.name} in slot ${slot}`);
        }
        if (diet === 'sattvic') {
          assert.equal(meal.dietType.includes('sattvic'), true, `Sattvic diet received non-sattvic meal ${meal.name} in slot ${slot}`);
        }
        if (diet === 'vegan') {
          assert.equal(meal.dietType.includes('vegan'), true, `Vegan diet received non-vegan meal ${meal.name} in slot ${slot}`);
        }
        if (diet === 'eggetarian') {
          const isMeat = meal.dietType.includes('non_veg') && !meal.dietType.includes('eggetarian') && !meal.dietType.includes('pure_veg');
          assert.equal(isMeat, false, `Eggetarian received meat ${meal.name} in slot ${slot}`);
        }
      }
    }
  }
});

test('mealPlanGenerator fallback: verify fallback condition correctly selects vegetarian foods for veg diets', () => {
  // Check if foods in the database are returned by the safe vegetarian fallback condition: f.dietType.includes('pure_veg')
  const matched = INDIAN_FOOD_DATABASE.filter((f) => f.dietType.includes('pure_veg'));
  assert.ok(matched.length > 0, `Database must have vegetarian foods matching fallback condition!`);
  // Ensure NONE of the matched items are meat
  for (const food of matched) {
    const isMeat = food.dietType.includes('non_veg') && !food.dietType.includes('pure_veg');
    assert.equal(isMeat, false, `${food.name} in fallback must not be meat`);
  }
});

test('calculateMacroGoals: enforces metabolic minimum floor for extreme low-weight/high-age profiles', () => {
  // Extreme low calorie profile (elderly low weight female, sedentary, fat loss)
  const extremeLowCalProfile: UserProfile = {
    ...baseProfile,
    gender: 'female',
    weightKg: 42,
    heightCm: 145,
    age: 72,
    activityLevel: 'sedentary',
    goal: 'fat_loss'
  };

  const femaleGoals = calculateMacroGoals(extremeLowCalProfile);
  assert.ok(femaleGoals.calories >= 1200, `Female calories (${femaleGoals.calories}) must not breach 1200 kcal floor`);

  const maleLowProfile: UserProfile = {
    ...baseProfile,
    gender: 'male',
    weightKg: 45,
    heightCm: 150,
    age: 75,
    activityLevel: 'sedentary',
    goal: 'fat_loss'
  };

  const maleGoals = calculateMacroGoals(maleLowProfile);
  assert.ok(maleGoals.calories >= 1400, `Male calories (${maleGoals.calories}) must not breach 1400 kcal floor`);
});

test('filterCompatibleFoods: pure_veg NEVER includes non_veg or eggetarian foods', () => {
  const slots = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'] as const;
  const pureVegProfile = { ...baseProfile, dietType: 'pure_veg' as const };

  for (const slot of slots) {
    const foods = filterCompatibleFoods(slot, pureVegProfile);
    for (const food of foods) {
      assert.equal(food.dietType.includes('pure_veg'), true, `${food.name} must be pure_veg`);
      const isMeat = food.dietType.includes('non_veg') && !food.dietType.includes('pure_veg');
      const isEgg = food.dietType.includes('eggetarian') && !food.dietType.includes('pure_veg');
      assert.equal(isMeat, false, `${food.name} must not be meat`);
      assert.equal(isEgg, false, `${food.name} must not be egg`);
    }
  }
});



