const TranslationNumpadPanel = ({ onComplete }) => {
  const { useState } = React;
  const p = APP_DATA.practice;
  const correct = { x: "+6", y: "+2" };
  const [values, setValues] = useState({ x: "", y: "" });
  const [status, setStatus] = useState({ x: null, y: null });
  const [active, setActive] = useState("x");
  const [clearingWrong, setClearingWrong] = useState(false);

  const normalize = (value) => {
    if (!value) return "";
    if (value[0] === "+" || value[0] === "-") return value;
    return "+" + value;
  };

  const setActiveValue = (updater) => {
    setValues((prev) => ({ ...prev, [active]: updater(prev[active]) }));
    setStatus((prev) => ({ ...prev, [active]: null }));
  };

  const handleNumber = (key) => {
    if (clearingWrong) return;
    setActiveValue((current) => {
      if (key === "+" || key === "-") {
        const unsigned = current.replace(/^[+-]/, "");
        return key + unsigned;
      }
      const sign = current[0] === "+" || current[0] === "-" ? current[0] : "";
      const digits = current.replace(/^[+-]/, "");
      if (digits.length >= 2) return current;
      return sign + digits + key;
    });
  };

  const handleBackspace = () => {
    if (clearingWrong) return;
    setActiveValue((current) => current.slice(0, -1));
  };

  const shakeAndClearWrong = (nextStatus) => {
    const wrongKeys = Object.keys(nextStatus).filter((key) => nextStatus[key] === "wrong");
    setClearingWrong(true);
    setTimeout(() => {
      setValues((prev) => {
        const next = { ...prev };
        wrongKeys.forEach((key) => {
          next[key] = "";
        });
        return next;
      });
      setStatus((prev) => {
        const next = { ...prev };
        wrongKeys.forEach((key) => {
          next[key] = null;
        });
        return next;
      });
      if (wrongKeys.length) setActive(wrongKeys[0]);
      setClearingWrong(false);
    }, 500);
  };

  const handleSubmit = () => {
    if (clearingWrong) return;
    const key = active;
    if (status[key] === "correct") {
      if (key === "x" && status.y !== "correct") setActive("y");
      return;
    }
    if (!normalize(values[key])) return;

    if (normalize(values[key]) === correct[key]) {
      const nextStatus = { ...status, [key]: "correct" };
      setStatus(nextStatus);
      if (key === "x") {
        if (typeof playSound === "function") playSound("correct");
        setActive("y");
      } else if (nextStatus.x === "correct" && nextStatus.y === "correct") {
        if (typeof playSound === "function") playSound("congrats");
        if (typeof onComplete === "function") onComplete();
      }
      return;
    }

    const nextStatus = { ...status, [key]: "wrong" };
    setStatus(nextStatus);
    if (typeof playSound === "function") playSound("wrong");
    shakeAndClearWrong(nextStatus);
  };

  const renderBox = (key) => {
    const cls =
      "translation-input-box" +
      (active === key ? " is-active" : "") +
      (status[key] === "correct" ? " is-correct" : "") +
      (status[key] === "wrong" ? " is-wrong" : "");
    return React.createElement("span", { className: cls }, normalize(values[key]));
  };

  return React.createElement(
    "div",
    { className: "translation-numpad-panel" },
    React.createElement(
      "div",
      { className: "translation-input-row" },
      React.createElement(
        "span",
        { className: "translation-input-label" },
        p.translationLabel,
      ),
      React.createElement("span", { className: "translation-paren" }, "("),
      renderBox("x"),
      React.createElement("span", { className: "translation-comma" }, ","),
      renderBox("y"),
      React.createElement("span", { className: "translation-paren" }, ")"),
    ),
    React.createElement(Numpad, {
      disabled: clearingWrong,
      submitLabel: "✔",
      onNumberClick: handleNumber,
      onBackspace: handleBackspace,
      onSubmit: handleSubmit,
    }),
  );
};
