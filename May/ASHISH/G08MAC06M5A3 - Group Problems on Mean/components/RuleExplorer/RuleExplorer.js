const getRuleExplorerFinalState = () => ({
  groups: 2,
  changes: 2,
  stepTwoSettled: true,
});

const RuleExplorer = ({ onComplete, onInstruction, playSfx, initialState }) => {
  const h = React.createElement;
  const { useEffect, useState } = React;
  const resume = initialState || {};
  const [groups, setGroups] = useState(resume.groups ?? 2);
  const [changes, setChanges] = useState(resume.changes ?? 0);
  const [stepTwoSettled, setStepTwoSettled] = useState(!!resume.stepTwoSettled);
  const activeGroups = Array.from({ length: groups }, (_, index) => index + 1);
  const columns = Math.min(groups, 4);
  const rows = Math.ceil(groups / 4);
  const isTwoGroupLayout = groups === 2;
  const densityScale = groups <= 2 ? 1 : groups <= 4 ? 0.82 : groups <= 6 ? 0.66 : 0.58;
  const tileScale = groups <= 2 ? 1 : groups <= 4 ? 0.9 : groups <= 6 ? 0.72 : 0.64;
  const tileGapScale = groups <= 2 ? 1 : groups <= 4 ? 0.82 : groups <= 6 ? 0.62 : 0.54;
  const signs = activeGroups.map((_, index) => {
    if (index === 0) return "";
    if (groups === 2 && index === 1) return "\u2212";
    return index % 3 === 2 ? "\u2212" : "+";
  });
  const toSub = (n) => n.toString().replace(/1/g, "₁").replace(/2/g, "₂").replace(/3/g, "₃").replace(/4/g, "₄").replace(/5/g, "₅").replace(/6/g, "₆").replace(/7/g, "₇").replace(/8/g, "₈");
  const symbolicSum = (label) => activeGroups.map((group, index) => `${index ? ` ${signs[index]} ` : ""}${label}${toSub(group)}`).join("");
  const renderRuleGroup = (groupNumber) => h("section", { className: "formula-group formula-group--open rule-formula-group" },
    h("h3", { className: "group-section-title" }, `${T.ui.groupA.replace("1", "").trim()} ${groupNumber}`),
    h("div", { className: "formula-stack" },
      h("span", { className: "metric-tile metric-tile--n" }, T.ui.count, h("sub", null, toSub(groupNumber))),
      h("span", { className: "metric-tile metric-tile--total" }, T.ui.total, h("sub", null, toSub(groupNumber))),
      h("span", { className: "metric-tile metric-tile--mean" }, T.ui.mean, h("sub", null, toSub(groupNumber)))
    )
  );
  const renderResultGroup = () => h("section", { className: "formula-group formula-group--open formula-group--result rule-formula-group rule-formula-group--result" },
    h("h3", { className: "group-section-title" }, T.ui.finalGroup),
    h("div", { className: "formula-stack" },
      h("span", { className: "metric-tile metric-tile--n" }, `${T.ui.count} = ${symbolicSum(T.ui.count)}`),
      h("span", { className: "metric-tile metric-tile--total" }, `${T.ui.total} = ${symbolicSum(T.ui.total)}`),
      h("span", { className: "metric-tile metric-tile--mean" }, `${T.ui.mean} = ${T.ui.total} \u00f7 ${T.ui.count}`)
    )
  );
  useEffect(() => { const ready = changes >= 2; onComplete(ready); onInstruction(ready ? T.ui.sliderReady : T.ui.ruleInstruction); }, [changes]);
  useEffect(() => {
    if (resume.stepTwoSettled) return undefined;
    setStepTwoSettled(false);
    let frameOne = 0;
    let frameTwo = 0;
    frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(() => setStepTwoSettled(true));
    });
    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
    };
  }, []);

  return h("section", { className: `lesson-screen rule-explorer ${stepTwoSettled ? "rule-explorer--settled" : ""} fade-in` },
    h("div", { className: "rule-title" }, T.ui.ruleTitle),
    h("div", {
      className: `rule-cards rule-cards--${groups}`,
      style: {
        "--group-count": groups,
        "--rule-cols": columns,
        "--rule-rows": rows,
        "--rule-card-density-scale": densityScale,
        "--rule-tile-scale": tileScale,
        "--rule-tile-gap-scale": tileGapScale,
      },
    },
      isTwoGroupLayout
        ? h(React.Fragment, null,
          renderRuleGroup(1),
          h("span", { className: "math-operator" }, signs[1]),
          renderRuleGroup(2),
          h("span", { className: "math-operator" }, "="),
          renderResultGroup()
        )
        : h(React.Fragment, null,
          h("div", { className: "rule-groups-wrap" }, activeGroups.map((groupNumber, index) => h("div", { className: "rule-group-item", key: index },
            index > 0 && h("span", { className: "small-operator" }, signs[index]),
            renderRuleGroup(groupNumber)
          ))),
          h("span", { className: "small-operator rule-final-operator" }, "="),
          renderResultGroup()
        )
    ),
    h("label", { className: "group-slider-label" }, `${T.ui.groupsLabel}: ${groups}`,
      h("input", { className: "group-slider ftue-target", type: "range", min: 2, max: 8, value: groups, onInput: (event) => { playSfx("click"); setGroups(Number(event.target.value)); setChanges((value) => value + 1); } })
    ),
    h("div", { className: "rule-notes" }, h("span", null, T.ui.ruleAdd), h("span", null, T.ui.ruleSubtract))
  );
};
