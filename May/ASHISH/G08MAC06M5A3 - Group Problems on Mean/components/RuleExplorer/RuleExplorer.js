const RuleExplorer = ({ onComplete, onInstruction, playSfx }) => {
  const h = React.createElement;
  const { useEffect, useState } = React;
  const [groups, setGroups] = useState(2);
  const [changes, setChanges] = useState(0);
  const activeGroups = Array.from({ length: groups }, (_, index) => index + 1);
  const signs = activeGroups.map((_, index) => index === 0 ? "" : (index % 3 === 2 ? "\u2212" : "+"));
  const toSub = (n) => n.toString().replace(/1/g, "₁").replace(/2/g, "₂").replace(/3/g, "₃").replace(/4/g, "₄").replace(/5/g, "₅").replace(/6/g, "₆").replace(/7/g, "₇").replace(/8/g, "₈");
  const symbolicSum = (label) => activeGroups.map((group, index) => `${index ? ` ${signs[index]} ` : ""}${label}${toSub(group)}`).join("");
  useEffect(() => { const ready = changes >= 2; onComplete(ready); onInstruction(ready ? T.ui.sliderReady : T.ui.ruleInstruction); }, [changes]);
  return h("section", { className: "lesson-screen rule-explorer fade-in" },
    h("h2", { className: "rule-title" }, T.ui.ruleTitle),
    h("div", { className: `rule-cards rule-cards--${groups}`, style: { "--group-count": groups } },
      h("div", { className: "rule-groups-wrap" }, activeGroups.map((groupNumber, index) => h("div", { className: "rule-group-item", key: index },
        index > 0 && h("span", { className: "small-operator" }, signs[index]),
        h("div", { className: "mini-group" }, h("strong", null, `${T.ui.groupA.replace("1", "")} ${groupNumber}`), h("span", null, `${T.ui.count}${toSub(groupNumber)}`), h("span", null, `${T.ui.total}${toSub(groupNumber)}`), h("span", null, `${T.ui.mean}${toSub(groupNumber)}`))
      ))), h("span", { className: "small-operator rule-final-operator" }, "="),
      h("div", { className: "mini-group mini-group--result" }, h("strong", null, T.ui.finalGroup), h("span", null, `${T.ui.count} = ${symbolicSum(T.ui.count)}`), h("span", null, `${T.ui.total} = ${symbolicSum(T.ui.total)}`), h("span", null, `${T.ui.mean} = ${T.ui.total} \u00f7 ${T.ui.count}`))
    ),
    h("label", { className: "group-slider-label" }, `${T.ui.groupsLabel}: ${groups}`,
      h("input", { className: "group-slider ftue-target", type: "range", min: 2, max: 8, value: groups, onInput: (event) => { playSfx("click"); setGroups(Number(event.target.value)); setChanges((value) => value + 1); } })
    ),
    h("div", { className: "rule-notes" }, h("span", null, T.ui.ruleAdd), h("span", null, T.ui.ruleSubtract))
  );
};
