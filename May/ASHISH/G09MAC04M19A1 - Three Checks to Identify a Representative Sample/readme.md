# G09MAC04M19A1 - Three Checks to Identify a Representative Sample!

Interactive applet for identifying a representative sample by checking three properties against the population:

- Shape: compare the pattern of the bar diagrams.
- Centre: compare the mean.
- Spread: compare the range.

## Files

- `index-en.html` - English entry point (`APP_LANGUAGE = "en"`)
- `index.html` - Indonesian entry point (`APP_LANGUAGE = "id"`)
- `data.js` - all user-facing text, translations, chart data, lesson steps, and pass/fail results
- `App.js` - step state, navigation gating, sounds, and FTUE targeting
- `components/CompareScreen/CompareScreen.js` - chart, test, formula, quiz, and final selection views

## Flow

1. Introduce the three checks for a representative sample.
2. Show the population and two sample bar diagrams.
3. Run the Shape test by drawing shape patterns and answering pass/fail for each sample.
4. Run the Centre test by completing inline mean equations and answering pass/fail.
5. Run the Spread test by completing inline range equations and answering pass/fail.
6. Choose the representative sample.
7. Summarize that a representative sample has shape, centre, and spread close to the population.

## Notes

- Equation taps are inline with the mean/range equations, not placed in a separate row.
- The app reuses the existing dark visual shell, navigation, lower prompt panel, sounds, and hand FTUE.
- The bar-chart values are stored in `data.js` so chart labels and calculations stay aligned.
