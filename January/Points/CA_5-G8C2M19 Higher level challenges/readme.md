# Quick Start Guide

## What Changed

Your applet has been transformed to a **ladder floor problem**.

### New Problem

"For safety reasons, stairs should be placed at a 75° angle. The height of one floor in a building is 3.2 meters. If a ladder needs to be provided to the start of 3rd floor, how long should the ladder be?"

### Answer

**10 m** (calculated using sin 75° = 0.96, height = 9.6 m for 3 floors)

## How to Test

1. **Open the applet**: Open `index.html` in your browser

2. **Stage 1: Comprehend**

   - Click "Bring in the building" → Building appears on left
   - Click "Bring in the ladder" → Ladder appears leaning at 75° against left edge
   - Click "Make right triangle" → Triangle overlays the scene
   - Click the vertical side → Marks as "h" (height - unknown yet)
   - Click the hypotenuse → Marks as "L" (ladder length)

3. **Stage 2: Connect**

   - **Step 1 - Calculate height:** Answer MCQ: "3 floors × 3.2 m = 9.6 m"
   - **Step 2 - Select ratio:** Click "sin θ" (correct ratio)
   - **Step 3 - Drag ratio:** Click boxes to place "9.6 m" (numerator) and "L" (denominator)
   - **Step 4 - Final equation:** View equation: sin 75° = 9.6 m / L

4. **Stage 3: Compute**
   - Tap denominator → Multiplies both sides by L
   - Tap common terms → Cancels L
   - Tap sin 75° → Substitutes 0.96
   - Tap 0.96 → Divides both sides
   - Tap ÷ → Calculates 9.6 m / 0.96
   - Tap = → Shows L = 10 m
   - View summary → Shows complete solution

## Detailed Step-by-Step Breakdown

### Step 0: Comprehend (5 substeps)

**SubStep 0** - `bringMan` - "Comprehend: Visualise the scene"

- **What happens:** User clicks "Bring in the building" button
- **Visual changes:** Building image appears on the left side of the visualization
- **State changes:** `buildingBrought` is set to `true`
- **Auto-progression:** Automatically advances to SubStep 1 after 300ms
- **Instruction:** "Tap the button to bring in the building..."

**SubStep 1** - `manBrought` - "Comprehend: Visualise the scene"

- **What happens:** User clicks "Bring in the ladder" button
- **Visual changes:** Ladder image appears, leaning at 75° angle against the left edge of the building
- **State changes:** `observerBrought` is set to `true`
- **Auto-progression:** Automatically advances to SubStep 2 after 300ms
- **Instruction:** "Tap the button to bring in the ladder..."

**SubStep 2** - `makeTriangle` - "Comprehend: Visualise the scene"

- **What happens:** User clicks "Make right triangle" button
- **Visual changes:** Triangle overlay appears with:
  - Height line (vertical, blue) along the building edge
  - Base line (horizontal, orange) along the ground
  - Hypotenuse line (diagonal, orange) representing the ladder
  - 75° angle marker at the ladder base
  - Right angle marker at the building base
- **State changes:** `triangleMade` is set to `true`
- **No auto-progression:** User must manually proceed to next step
- **Instruction:** "Tap the button to make the required right triangle to solve this challenge..."
- **Feedback:** "Good going! You've captured the scene in the question correctly, with the angle marked as 75°..."

**SubStep 3** - `markShadow` - "Comprehend: Construct right triangle and mark given measures"

- **What happens:** User clicks on the vertical height side of the triangle
- **Visual changes:**
  - Height line changes from light blue (`#64B5F6`) to darker blue (`#4A90E2`)
  - Line thickness increases from 12px to 14px
  - Clickable circle disappears
  - Height line becomes non-interactive
- **State changes:** `distanceMarked` is set to `true`
- **No auto-progression:** User must manually proceed to next step
- **Instruction:** "Tap the side of the right triangle that corresponds to the building height to mark it..."
- **Note:** Height label ("h") will appear later when `subStep >= 3` and `distanceMarked` is true

**SubStep 4** - `markHeight` - "Comprehend: Construct right triangle and mark given measures"

- **What happens:** User clicks on the hypotenuse (ladder) side of the triangle
- **Visual changes:**
  - Hypotenuse line changes from orange (`#FFA500`) to darker orange (`#FF6B35`)
  - Line thickness increases from 12px to 14px
  - Clickable circle disappears
  - Hypotenuse line becomes non-interactive
  - "L" label appears on the hypotenuse
  - Height label "h" appears (will change to "9.6 m" after Connect stage)
- **State changes:** `heightMarked` is set to `true`
- **No auto-progression:** User must manually proceed to next step
- **Instruction:** "Tap the side of the right triangle that corresponds to the ladder length to mark 'to find'..."

---

### Step 1: Connect (4 substeps)

**SubStep 0** - `heightMCQ` - "Connect: Calculate the height to reach"

- **What happens:** User selects an answer from multiple choice options
- **Visual changes:** Selected button highlights (green if correct, red if wrong)
- **State changes:** `heightMCQSelected` is set to selected index
- **Audio feedback:** Plays "correct" sound if answer is right, "wrong" if incorrect
- **Instruction:** "If the ladder needs to reach the start of 3rd floor, and each floor is 3.2 m high, what is the total height we need to reach?"
- **Options:** ["6.4 m", "9.6 m", "12.8 m"]
- **Correct answer:** Index 1 ("9.6 m")
- **Feedback:** "Correct! Start of 3rd floor means 3 floors × 3.2 m = 9.6 m"
- **Hint:** "Count the number of floors from ground to start of 3rd floor, then multiply by height per floor."
- **Progression:** Next button enabled only when correct answer is selected

**SubStep 1** - `ratioSelection` - "Connect: Which trigonometric ratio will help us find the unknown ladder length?"

- **What happens:** User selects a trigonometric ratio button
- **Visual changes:**
  - Selected button highlights (green if correct, red if wrong)
  - Triangle visualization shows height marked as "9.6 m" (actual value) instead of "h"
- **State changes:** `ratioSelected` is set to selected index
- **Audio feedback:** Plays "correct" sound if answer is right, "wrong" if incorrect
- **Instruction:** "Tap the correct ratio button..."
- **Options:** ["sin θ", "cos θ", "tan θ"]
- **Correct answer:** Index 0 ("sin θ")
- **Feedback:** Shows formula: "sin θ = opp / hyp = height / ladder"
- **Hint:** "In a right triangle, sin θ = opposite/hypotenuse. Identify which sides are opposite and hypotenuse relative to the 75° angle."
- **Progression:** Next button enabled only when correct answer is selected

**SubStep 2** - `dragRatio` - "Connect: Which trigonometric ratio will help us find the unknown ladder length?"

- **What happens:** User clicks on numerator and denominator boxes to fill them with side values
- **Visual changes:**
  - Numerator box highlights when active (waiting for input)
  - Denominator box highlights when active (waiting for input)
  - Option buttons appear above/below the highlighted box
  - Selected values appear in the boxes with appropriate colors
- **State changes:** `draggedRatio` is updated with numerator and denominator values
- **Audio feedback:** Plays "correct" sound when correct values are placed
- **Instruction:** "Tap the side lengths to fill the term boxes to make the correct ratio..."
- **Available sides:** ["9.6 m", "L"]
- **Correct numerator:** "9.6 m"
- **Correct denominator:** "L"
- **Formula displayed:** "sin 75° ="
- **Hint:** "For sin 75°, the numerator should be the opposite side (height 9.6 m) and the denominator should be the hypotenuse (ladder L)."
- **Progression:** Next button enabled only when both boxes are filled correctly

**SubStep 3** - `finalEquation` - "Connect: Which trigonometric ratio will help us find the unknown ladder length?"

- **What happens:** Displays the final equation ready for computation
- **Visual changes:**
  - Equation displayed as a vertical fraction: sin 75° = 9.6 m / L
  - Success feedback message appears
- **State changes:** None (read-only display)
- **Instruction:** "Tap » to compute the required value..."
- **Feedback:** "Good going! We're almost done... Let's simplify this equation to find the value of the unknown ladder length..."
- **Equation:** "sin 75° = 9.6 m / L"
- **Progression:** Next button always enabled (proceeds to Compute stage)

---

### Step 2: Compute (7 substeps)

**SubStep 0** - `tapDenominator` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** User clicks on the denominator "L" in the fraction
- **Visual changes:** Denominator highlights when clicked
- **State changes:** `computeInteractions['tapDenominator']` is set to `true`
- **Audio feedback:** Plays "correct" sound
- **Instruction:** "Tap the denominator..."
- **Hint:** "Multiply both sides by L"
- **Equation:** "sin 75° = 9.6 m / L"
- **Highlight element:** "denominator"
- **Auto-progression:** Automatically advances to SubStep 1 after 300ms
- **Solved step added:** "sin 75° × L = (9.6 m / L) × L"

**SubStep 1** - `cancelTerms` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** User clicks on the common term "L" in the right-hand side to cancel it
- **Visual changes:** Common terms highlight when clicked
- **State changes:** `computeInteractions['cancelTerms']` is set to `true`
- **Audio feedback:** Plays "correct" sound
- **Instruction:** "Tap the common term in the RHS to cancel them out..."
- **Hint:** "Cancel the common terms from numerator and denominator"
- **Equation:** "sin 75° × L = (9.6 m / L) × L"
- **Highlight element:** "commonTerms"
- **Auto-progression:** Automatically advances to SubStep 2 after 300ms
- **Solved step added:** "sin 75° × L = 9.6 m"

**SubStep 2** - `substituteSin` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** User clicks on "sin 75°" to substitute its value
- **Visual changes:** "sin 75°" highlights when clicked
- **State changes:** `computeInteractions['substituteSin']` is set to `true`
- **Audio feedback:** Plays "correct" sound
- **Instruction:** "Tap sin 75° to reveal its value..."
- **Hint:** "Substitute given value for sin 75°"
- **Equation:** "sin 75° × L = 9.6 m"
- **Highlight element:** "sin75"
- **Auto-progression:** Automatically advances to SubStep 3 after 300ms
- **Solved step added:** "0.96 × L = 9.6 m"

**SubStep 3** - `divideSin` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** User clicks on "0.96" to divide both sides by it
- **Visual changes:** "0.96" highlights when clicked
- **State changes:** `computeInteractions['divideSin']` is set to `true`
- **Audio feedback:** Plays "correct" sound
- **Instruction:** "Tap sin 75° to divide both sides..."
- **Hint:** "Divide both sides by 0.96"
- **Equation:** "0.96 × L = 9.6 m"
- **Highlight element:** "sin75value"
- **Auto-progression:** Automatically advances to SubStep 4 after 300ms
- **Solved step added:** "L = 9.6 m / 0.96"

**SubStep 4** - `divideTerms` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** User clicks on the fraction to perform the division
- **Visual changes:** Entire fraction highlights when clicked
- **State changes:** `computeInteractions['divideTerms']` is set to `true`
- **Audio feedback:** Plays "correct" sound
- **Instruction:** "Tap the fraction to divide the terms..."
- **Hint:** "Find the quotient of terms"
- **Equation:** "L = 9.6 m / 0.96"
- **Highlight element:** "fraction"
- **Auto-progression:** Automatically advances to SubStep 5 after 300ms
- **Solved step added:** "L = 10 m"

**SubStep 5** - `finalAnswer` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** Displays the final answer
- **Visual changes:** Final answer equation displayed
- **State changes:** None (read-only display)
- **Instruction:** "Tap » to view the summary..."
- **Hint:** "Final ladder length"
- **Equation:** "L = 10 m"
- **Highlight element:** None
- **Progression:** Next button always enabled (proceeds to summary)

**SubStep 6** - `summary` - "Compute: Substitute values in ratio and solve for unknown"

- **What happens:** Displays summary screen with all steps completed
- **Visual changes:**
  - Summary box appears with list of completed steps
  - Triangle visualization shows final answer "10 m" on the ladder
- **State changes:** None (final screen)
- **Instruction:** "Activity Complete"
- **Summary steps displayed:**
  1. Visualise scene as given in question
  2. Comprehend: Construct Right Triangle
  3. Connect: Identify required ratios
  4. Compute: Use equation to find unknown
- **Progression:** No further progression (end of activity)

## Key Features

✅ Building positioned on left edge (3rd floor at ~60% height)  
✅ Ladder leaning at 75° angle against left edge  
✅ Interactive triangle construction  
✅ MCQ to calculate height before solving  
✅ Height transitions from "h" to "9.6 m" after MCQ  
✅ Correct trigonometric ratio selection (sin θ)  
✅ Step-by-step algebraic solution  
✅ Audio feedback for all interactions  
✅ Hints available at each stage

## Assets Required

The following assets should be in the `assets/` folder:

- ✅ `building.png` - Building image (cross-section showing floors)
- ✅ `ladder.png` - Ladder image (will be rotated and scaled)
- ✅ `ground.png` - Ground texture
- ✅ `hint_bulb.png` - Hint button icon
- ✅ All sound effects (click, correct, wrong, swoosh)

## File Changes Summary

| File                                | Status                           |
| ----------------------------------- | -------------------------------- |
| `data.js`                           | ✅ Updated problem & values      |
| `App.js`                            | ✅ No changes needed             |
| `components/ComprehendScreen/`      | ✅ Updated trig values to 75°    |
| `components/ConnectScreen/`         | ✅ Updated to sin ratio & values |
| `components/ComputeScreen/`         | ✅ Updated equation handling     |
| `components/TriangleDiv/`           | ✅ Updated labels & angle        |
| `components/TriangleVisualization/` | ✅ Complete rewrite for ladder   |
| `index.html`                        | ✅ Updated title                 |
| `readme.md`                         | ✅ Complete rewrite              |

## If You Need to Make Further Changes

### Change the floor height:

1. Update `data.js`: Search for "9.6 m" and replace
2. Update `components/TriangleVisualization/TriangleVisualization.js`: Replace "9.6 m" label
3. Update `components/TriangleDiv/TriangleDiv.js`: Replace "9.6 m" label
4. Recalculate final answer: L = height / sin(75°) = height / 0.96

### Change the angle:

1. Update `data.js`: Search for "75°" and replace
2. Update trig values in `data.js`: Update sin, cos, tan values
3. Update `components/TriangleVisualization/TriangleVisualization.js`: Update angle in arc rendering
4. Update `components/TriangleDiv/TriangleDiv.js`: Update angle label & conic-gradient in CSS
5. Recalculate final answer with new sin value

### Change the ladder appearance:

Edit `components/TriangleVisualization/TriangleVisualization.js` in the `renderLadder()` function to modify:

- Ladder thickness
- Number of rungs
- Colors
- Positioning
