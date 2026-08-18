const CompareScreen = ({ screen, onComplete, onInstruction, playSfx, onAnimationBusy, onStartOver, startOverButtonRef, initialState }) => {
  const h = React.createElement;
  const title = screen.type === "builder" ? (screen.mode === "add" ? T.ui.phaseBuild : T.ui.buildSubtractTitle)
    : screen.type === "rules" ? T.ui.phaseRules
    : screen.type === "problem" ? formatText(T.ui.progress, { current: screen.problemIndex + 1, total: T.lesson.problems.length })
    : "";
  let content;
  if (screen.type === "builder") content = h(GroupBuilder, { mode: screen.mode, onComplete, onInstruction, onAnimationBusy, playSfx, initialState });
  if (screen.type === "rules") content = h(RuleExplorer, { onComplete, onInstruction, playSfx, initialState });
  if (screen.type === "problem") content = h(ProblemSolver, { problem: screen.problem, onComplete, onInstruction, playSfx, initialState });
  if (screen.type === "end") content = h(EndScreen, { onStartOver, startOverButtonRef });
  return h("main", { className: "compare-screen", "aria-label": T.ui.screenReaderWorkspace },
    title && h("div", { className: "phase-kicker" }, title),
    h("div", { className: "work-area" }, content)
  );
};
