# Phase UI Review — NutriFit Dashboard & Statistic Experience

**Audited:** 2026-11-18  
**Baseline:** Reference Mockup (`media_1795004232525_f947f0ce.jpg`) & BoardUI Design System Rules  
**Scope:** `src/App.tsx`, `src/index.css`, Companion Modules, Live Vercel Production Deployment  

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Highly contextual Indian nutrition copy ("Daily intake", "Step to walk", "Drink Water", "Breakfast", "Lunch time", "Evening Fuel", "Mifflin-St Jeor Energy Target"). |
| 2. Visuals | 4/4 | 100% pixel-faithful match to reference image: lime hero card with circular streak meter, August 2025 calendar strip with Wednesday pill, 7-day bar chart with 110% peak bar, and 2x2 metric cards. |
| 3. Color | 3/4 | Soft organic palette with zero pure black or harsh neon; inline `#hex` classes can be migrated to semantic CSS tokens (`--surface`, `--line`, `--ink`, `--lime`, `--peach`, `--cyan`) for automated dark mode. |
| 4. Typography | 3/4 | Strong typographic hierarchy with Plus Jakarta Sans; font weights span 6 variants and can be consolidated into a crisp 3-tier system (400 regular, 600 semibold, 800 bold). |
| 5. Spacing | 4/4 | Follows Tailwind 4px grid (`gap-3.5`, `p-4`, `p-5`, `space-y-4`); consistent `rounded-[24px]` and `rounded-[28px]` radius on cards. |
| 6. Experience Design | 3/4 | Rich interactivity with haptics, meal swapper modal, food scanner, and dual-phone view; small icon buttons (28px) need expanding to 40px+ touch targets with explicit `aria-label`s. |

**Overall Score: 21/24**

---

## Top 3 Priority Fixes

1. **Replace Inline Hex Literals with Semantic BoardUI Tokens:**  
   - *Impact:* Cards currently use `bg-white` and `border-[#edf0e8]` which requires manual overrides in dark mode.  
   - *Fix:* Use BoardUI-compliant semantic classes `.card-surface` and `.card-border` backed by `--surface`, `--line`, `--ink`, `--muted`, enabling flawless automatic theme switching.

2. **Touch Target Enlargement & WCAG 2.2 Accessibility:**  
   - *Impact:* The August calendar navigation arrows (`w-7 h-7`) and meal swap `+` buttons (`w-8 h-8`) are below the recommended 44×44px mobile touch target guideline.  
   - *Fix:* Increase button size to `w-9 h-9` with `min-h-[44px]` touch area, add `focus-visible:ring-2`, and add explicit `aria-label` attributes to all icon-only buttons.

3. **Incorporate BoardUI `cx()` Class Merging Utility:**  
   - *Impact:* Class conditional logic previously used template string interpolation.  
   - *Fix:* Standardize conditional class application with the newly created `src/utils/cx.ts` (`clsx` + `twMerge`).

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)
- **Strengths:**
  - Clear, user-friendly labels with realistic Indian nutrition context ("Breakfast", "Lunch time", "Evening Fuel").
  - Clear quantification ("1250 Kcal", "Target: 1920 Kcal", "5,500 steps", "12 glass", "2.0 hours", "86 bpm", "68.4 kg").
  - Toast alerts give instant feedback with positive reinforcement ("Logged 1 glass of water (+200ml)!", "You are on track with today's calorie budget!").
- **Minor Improvement:**
  - Update generic "Save" button on profile calibration to "Save Energy Target".

### Pillar 2: Visuals (4/4)
- **Strengths:**
  - Faithful reproduction of reference mockup (`media_1795004232525_f947f0ce.jpg`).
  - Dynamic Island status bar with 9:41 time and cellular/battery glyphs.
  - White inner circular disk inside the hero streak ring with lime progress arc.
  - Wednesday 10th pill highlight on calendar strip.
  - Medical ECG waveform in BPM card and 5-bar equalizer wave in Exercise card.
  - Floating bottom dock with center raised lime FAB (`Scan`).

### Pillar 3: Color (3/4)
- **Strengths:**
  - Exact adherence to user preference: zero pure black (`#000000`), zero harsh neons.
  - Calming, soft pastel accents: lime (`#d8f572`), peach (`#fff0eb`), cyan (`#e8f6fd`), rose (`#feecee`).
  - Diagonal striped pattern on non-peak chart bars (`chart-striped-bar`).
- **Areas for Improvement:**
  - Migrate raw `#hex` occurrences to semantic CSS tokens (`var(--surface)`, `var(--line)`).

### Pillar 4: Typography (3/4)
- **Strengths:**
  - High legibility using 'Plus Jakarta Sans'.
  - Headline sizes (`text-2xl`, `text-3xl`) create commanding numbers for calorie and step counters.
- **Areas for Improvement:**
  - Standardize font-weight hierarchy to regular (`font-normal`), semibold (`font-semibold`), and bold/black (`font-bold`, `font-black`).

### Pillar 5: Spacing (4/4)
- **Strengths:**
  - Strict 4px rhythm (`p-4`, `p-5`, `gap-3.5`, `space-y-4`).
  - Consistent border radii (`rounded-2xl`, `rounded-[24px]`, `rounded-[28px]`, `rounded-full`).
  - Phone shell widths are neatly constrained (`max-w-[420px]` mobile, `w-[390px]` side-by-side).

### Pillar 6: Experience Design (3/4)
- **Strengths:**
  - Haptic feedback integration (`haptic.selection()`, `haptic.medium()`).
  - Side-by-Side Dual View on desktop matching the reference image, with smooth transition to single phone view.
  - 100% interactive controls: meal swapper, food scanner, fasting clock, AI coach.
- **Areas for Improvement:**
  - Enlarge interactive touch hit-boxes on calendar and meal buttons.
  - Add missing `aria-label` tags on icon-only navigation triggers.

---

## Files Audited
- `src/App.tsx` (Main shell, Dual View, Screen 1 Dashboard, Screen 2 Statistic)
- `src/index.css` (Design tokens, `.phone-shell`, `.hero-lime`, `.chart-striped-bar`, `.floating-nav`, `.fab-raised`)
- `src/utils/cx.ts` (BoardUI canonical class merger)
- `src/components/MealSwapperModal.tsx`
- `src/components/RecipeModal.tsx`
- `src/components/FoodScanner.tsx`
- `src/components/AICoach.tsx`
- `src/components/FastingTimer.tsx`
- `src/components/WorkoutTracker.tsx`
