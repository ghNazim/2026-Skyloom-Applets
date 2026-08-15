# G09MAC04M15A3 - Challenge 3

Interactive applet for identifying which relative-frequency graph contains an impossible coin-toss outcome.

## Files

- `index.html` - Indonesian entry point (`APP_LANGUAGE = "id"`)
- `index-en.html` - English entry point (`APP_LANGUAGE = "en"`)
- `data.js` - all user-facing text, translations, graph data, table data, and lesson steps
- `App.js` - step state, navigation gating, sounds, and FTUE targeting
- `screens/ChallengeScreen/ChallengeScreen.js` - PPT-matched challenge layouts and interactions
- `components/NumPad/NumPad.js` - change-entry keypad

## Flow

1. Compare Putu and Sondang's relative-frequency graphs.
2. Record Putu's graph readings by tapping highlighted points.
3. Choose the formula for finding `f(H)`, reveal values, and enter changes with the numpad.
4. Decide that Putu made no mistake.
5. Repeat the graph-record, reveal, and change-entry flow for Sondang.
6. Decide that Sondang made a mistake.
7. Highlight trial 5, where `f(H)` has a negative change, which is impossible.
