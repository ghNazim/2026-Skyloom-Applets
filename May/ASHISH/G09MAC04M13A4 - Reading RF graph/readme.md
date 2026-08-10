# G09MAC04M13A4 - Reading RF Graph

Interactive applet for deducing coin-toss outcomes from a relative frequency line graph.

## Files

- `index-en.html` - English entry point (`APP_LANGUAGE = "en"`)
- `index.html` - Indonesian entry point (`APP_LANGUAGE = "id"`)
- `data.js` - all user-facing text, translations, trial data, and lesson steps
- `App.js` - step state, navigation gating, sounds, and FTUE targeting
- `components/ActivityScreen/ActivityScreen.js` - graph, table, quiz, and summary views

## Flow

1. Introduce the relative frequency line graph for 5 coin toss trials.
2. Fill the relative frequency table by tapping highlighted graph points.
3. Choose the correct formula to find f(H) from f_r(H).
4. Reveal f(H) row-by-row using the Reveal button.
5. Deduce each trial outcome using the » navigation.
6. Record the change in f(H) for each trial.
7. Summarize the +1 / 0 pattern and complete the activity.

## Notes

- Styling follows the G09MAC04M19A1 standard: vw-based typography (min 2vw), glass panels, story-action buttons, and feedback cards.
- Trial values are stored in `data.js` so the graph, table, and deductions stay aligned.
