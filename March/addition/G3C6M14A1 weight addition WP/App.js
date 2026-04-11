/** Gram box display: pad to 3 digits while typing (1–3 chars); show 4 digits as-is. */
const formatGmDisplay = (raw) => {
  if (raw === "" || raw == null) return "";
  const s = String(raw);
  if (s.length >= 4) return s;
  return s.padStart(3, "0");
};

/**
 * Gram stored value: strip leading zeros; all-zero input → "0".
 * e.g. 0000→0, 007→7, 075→75, 4000→4000
 */
const normalizeGmRaw = (s) => {
  if (s === "") return "";
  const t = String(s).replace(/^0+/, "");
  return t === "" ? "0" : t;
};

const App = () => {
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [row1Kg, setRow1Kg] = useState("");
  const [row1Gm, setRow1Gm] = useState("");
  const [row2Kg, setRow2Kg] = useState("");
  const [row2Gm, setRow2Gm] = useState("");
  const [activeBox, setActiveBox] = useState("r1kg");
  const [currentRow, setCurrentRow] = useState(1);
  const [row1KgStatus, setRow1KgStatus] = useState("");
  const [row1GmStatus, setRow1GmStatus] = useState("");
  const [row2KgStatus, setRow2KgStatus] = useState("");
  const [row2GmStatus, setRow2GmStatus] = useState("");
  const [step3Done, setStep3Done] = useState(false);

  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(null);
  const [step4Done, setStep4Done] = useState(false);
  const [showHintHighlight, setShowHintHighlight] = useState(false);

  const [resultGm, setResultGm] = useState("");
  const [resultKg, setResultKg] = useState("");
  const [resultGmStatus, setResultGmStatus] = useState("");
  const [resultKgStatus, setResultKgStatus] = useState("");
  const [step5GmDone, setStep5GmDone] = useState(false);
  const [step6Done, setStep6Done] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [charImage, setCharImage] = useState("normal.png");
  const [numpadDisabled, setNumpadDisabled] = useState(false);

  const wrongTimerRef = useRef(null);

  const q = questions[questionIndex];
  const isLastQuestion = questionIndex >= totalQuestions - 1;

  const resetQuestionState = () => {
    setRow1Kg(""); setRow1Gm(""); setRow2Kg(""); setRow2Gm("");
    setActiveBox("r1kg"); setCurrentRow(1);
    setRow1KgStatus(""); setRow1GmStatus(""); setRow2KgStatus(""); setRow2GmStatus("");
    setStep3Done(false);
    setMcqSelected(null); setMcqCorrect(null);
    setStep4Done(false); setShowHintHighlight(false);
    setResultGm(""); setResultKg(""); setResultGmStatus(""); setResultKgStatus("");
    setStep5GmDone(false); setStep6Done(false);
    setFeedbackText(""); setFeedbackType(""); setShowFeedback(false);
    setCharImage("normal.png"); setNumpadDisabled(false);
  };

  const resetAll = () => { setCurrentStep(0); setQuestionIndex(0); resetQuestionState(); };

  const clearFeedback = () => {
    setFeedbackText(""); setFeedbackType(""); setShowFeedback(false); setCharImage("normal.png");
  };

  const doWrongFeedback = (text) => {
    setFeedbackText(text); setFeedbackType("incorrect"); setShowFeedback(true);
    setCharImage("sad.png"); playSound("wrong");
  };

  const doCorrectFeedback = (text) => {
    setFeedbackText(text); setFeedbackType("correct"); setShowFeedback(true);
    setCharImage("happy.png"); playSound("correct");
  };

  // ===== ACTIVE VALUE HELPERS =====
  const getActiveValue = () => {
    if (currentStep === 3) {
      if (activeBox === "r1kg") return row1Kg;
      if (activeBox === "r1gm") return row1Gm;
      if (activeBox === "r2kg") return row2Kg;
      if (activeBox === "r2gm") return row2Gm;
    }
    if (currentStep === 5) return resultGm;
    if (currentStep === 6) return resultKg;
    return "";
  };

  const setActiveValue = (val) => {
    if (currentStep === 3) {
      if (activeBox === "r1kg") setRow1Kg(val);
      else if (activeBox === "r1gm") setRow1Gm(val);
      else if (activeBox === "r2kg") setRow2Kg(val);
      else if (activeBox === "r2gm") setRow2Gm(val);
    }
    if (currentStep === 5) setResultGm(val);
    if (currentStep === 6) setResultKg(val);
  };

  const getActiveMaxLen = () => {
    if (currentStep === 3) return activeBox.includes("kg") ? 2 : 4;
    if (currentStep === 5) return 4;
    if (currentStep === 6) return 2;
    return 4;
  };

  const isActiveGramBox = () =>
    currentStep === 5 || (currentStep === 3 && (activeBox === "r1gm" || activeBox === "r2gm"));

  const handleNumberClick = (num) => {
    if (showFeedback) clearFeedback();
    const cur = getActiveValue();
    const maxLen = getActiveMaxLen();
    if (isActiveGramBox()) {
      const next = normalizeGmRaw(cur + num);
      if (next.length > maxLen) return;
      setActiveValue(next);
      return;
    }
    if (cur.length >= maxLen) return;
    setActiveValue(cur + num);
  };

  const handleClear = () => {
    if (showFeedback) clearFeedback();
    const cur = getActiveValue();
    if (isActiveGramBox()) {
      const sliced = cur.slice(0, -1);
      setActiveValue(sliced === "" ? "" : normalizeGmRaw(sliced));
      return;
    }
    setActiveValue(cur.slice(0, -1));
  };

  // ===== STEP 3 SUBMIT =====
  const handleStep3Submit = () => {
    const isR1 = currentRow === 1;
    const kg = isR1 ? row1Kg : row2Kg;
    const gm = isR1 ? row1Gm : row2Gm;
    const kgSt = isR1 ? row1KgStatus : row2KgStatus;
    const gmSt = isR1 ? row1GmStatus : row2GmStatus;
    const kgAns = isR1 ? q.kgAns1 : q.kgAns2;
    const gmAns = isR1 ? q.gmAns1 : q.gmAns2;
    const kgBoxId = isR1 ? "r1kg" : "r2kg";
    const gmBoxId = isR1 ? "r1gm" : "r2gm";
    const setKgSt = isR1 ? setRow1KgStatus : setRow2KgStatus;
    const setGmSt = isR1 ? setRow1GmStatus : setRow2GmStatus;
    const setKgVal = isR1 ? setRow1Kg : setRow2Kg;
    const setGmVal = isR1 ? setRow1Gm : setRow2Gm;
    const wrongFb = isR1 ? q.step3WrongFeedbackRow1 : q.step3WrongFeedbackRow2;

    if (getActiveValue() === "") return;

    if (kgSt === "correct") {
      const gmVal = parseInt(gm || "-1", 10);
      if (gmVal === gmAns) {
        setGmSt("correct");
        setGmVal(String(gmAns));
        handleRowDone(isR1);
      } else {
        setGmSt("wrong");
        doWrongFeedback(wrongFb);
        if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
        wrongTimerRef.current = setTimeout(() => { setGmSt(""); setGmVal(""); setActiveBox(gmBoxId); }, 500);
      }
      return;
    }
    if (gmSt === "correct") {
      const kgVal = parseInt(kg || "-1", 10);
      if (kgVal === kgAns) {
        setKgSt("correct");
        setKgVal(String(kgAns));
        handleRowDone(isR1);
      } else {
        setKgSt("wrong");
        doWrongFeedback(wrongFb);
        if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
        wrongTimerRef.current = setTimeout(() => { setKgSt(""); setKgVal(""); setActiveBox(kgBoxId); }, 500);
      }
      return;
    }

    const otherBoxId = activeBox === kgBoxId ? gmBoxId : kgBoxId;
    const otherVal = activeBox === kgBoxId ? gm : kg;
    if (otherVal === "") {
      // Move focus to the other (still empty) box with a gentle cue
      playSound("tick");
      setActiveBox(otherBoxId);
      return;
    }

    const kgVal = parseInt(kg || "-1", 10);
    const gmVal = parseInt(gm || "-1", 10);
    const kgOk = kgVal === kgAns;
    const gmOk = gmVal === gmAns;

    if (kgOk && gmOk) {
      setKgSt("correct"); setGmSt("correct");
      setKgVal(String(kgAns)); setGmVal(String(gmAns));
      handleRowDone(isR1);
    } else if (!kgOk && !gmOk) {
      setKgSt("wrong"); setGmSt("wrong");
      doWrongFeedback(wrongFb);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        setKgSt(""); setGmSt(""); setKgVal(""); setGmVal(""); setActiveBox(kgBoxId);
      }, 500);
    } else {
      if (kgOk) { setKgSt("correct"); setKgVal(String(kgAns)); } else setKgSt("wrong");
      if (gmOk) { setGmSt("correct"); setGmVal(String(gmAns)); } else setGmSt("wrong");
      doWrongFeedback(wrongFb);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        if (!kgOk) { setKgSt(""); setKgVal(""); }
        if (!gmOk) { setGmSt(""); setGmVal(""); }
        setActiveBox(!kgOk ? kgBoxId : gmBoxId);
      }, 500);
    }
  };

  const handleRowDone = (wasRow1) => {
    if (wasRow1) {
      playSound("correct");
      clearFeedback();
      setCurrentRow(2);
      setActiveBox("r2kg");
    } else {
      doCorrectFeedback(q.step3CorrectFeedback);
      setStep3Done(true);
      setNumpadDisabled(true);
      setActiveBox("");
    }
  };

  // ===== STEP 5 SUBMIT (gram) =====
  const handleStep5Submit = () => {
    if (resultGm === "") return;
    const gmVal = parseInt(resultGm, 10);
    if (gmVal === q.gmResult) {
      setResultGmStatus("correct");
      doCorrectFeedback(q.step5CorrectFeedback);
      setResultGm(String(q.gmResult));
      setStep5GmDone(true);
      setNumpadDisabled(true);
    } else {
      setResultGmStatus("wrong");
      doWrongFeedback(q.step5WrongFeedback);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => { setResultGmStatus(""); setResultGm(""); }, 500);
    }
  };

  // ===== STEP 6 SUBMIT (kg) =====
  const handleStep6Submit = () => {
    if (resultKg === "") return;
    const kgVal = parseInt(resultKg, 10);
    if (kgVal === q.kgResult) {
      setResultKgStatus("correct");
      doCorrectFeedback(q.step6CorrectFeedback);
      setResultKg(String(q.kgResult));
      setStep6Done(true);
      setNumpadDisabled(true);
    } else {
      setResultKgStatus("wrong");
      doWrongFeedback(q.step6WrongFeedback);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => { setResultKgStatus(""); setResultKg(""); }, 500);
    }
  };

  const handleNumpadSubmit = () => {
    if (currentStep === 3) handleStep3Submit();
    else if (currentStep === 5) handleStep5Submit();
    else if (currentStep === 6) handleStep6Submit();
  };

  // ===== MCQ HANDLER =====
  const handleMcqClick = (option) => {
    if (step4Done) return;
    const correctOp = q.operation === "add" ? APP_DATA.mcqOptions.add : APP_DATA.mcqOptions.subtract;
    const isCorrect = option === correctOp;
    setMcqSelected(option);
    setMcqCorrect(isCorrect);
    setShowHintHighlight(true);
    if (isCorrect) {
      doCorrectFeedback(q.step4CorrectFeedback);
      setStep4Done(true);
    } else {
      doWrongFeedback(q.step4WrongFeedback);
      // Keep wrong feedback visible; allow user to change selection without auto-clearing
    }
  };

  // ===== NAVIGATION =====
  const handleNext = () => {
    playSound("click");
    if (currentStep === 0) setCurrentStep(1);
    else if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) { setCurrentStep(3); setNumpadDisabled(false); setActiveBox("r1kg"); }
    else if (currentStep === 3) { setCurrentStep(4); clearFeedback(); setNumpadDisabled(true); }
    else if (currentStep === 4) { setCurrentStep(5); clearFeedback(); setNumpadDisabled(false); }
    else if (currentStep === 5) { setCurrentStep(6); clearFeedback(); setNumpadDisabled(false); }
    else if (currentStep === 6) {
      if (!isLastQuestion) {
        const nxt = questionIndex + 1;
        setQuestionIndex(nxt);
        resetQuestionState();
        setCurrentStep(2);
      } else {
        setCurrentStep(7);
      }
    }
  };

  const handlePrev = () => { playSound("click"); };

  const handleBoxClick = (boxId) => {
    if (currentStep !== 3) return;
    if (currentRow === 1) {
      if (boxId === "r1kg" && row1KgStatus !== "correct") setActiveBox("r1kg");
      if (boxId === "r1gm" && row1GmStatus !== "correct") setActiveBox("r1gm");
    } else {
      if (boxId === "r2kg" && row2KgStatus !== "correct") setActiveBox("r2kg");
      if (boxId === "r2gm" && row2GmStatus !== "correct") setActiveBox("r2gm");
    }
  };

  useEffect(() => { return () => { if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current); }; }, []);

  // ===== NAV TEXT & NEXT DISABLED =====
  let navText = APP_DATA.common.tapNextToContinue;
  let nextDisabled = false;

  if (currentStep === 3) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step3Done;
    if (step3Done) navText = APP_DATA.common.tapNextToContinue;
  } else if (currentStep === 4) {
    navText = q.operation === "add" ? APP_DATA.common.tapNextToAddWeights : APP_DATA.common.tapNextToSubtract;
    nextDisabled = !step4Done;
  } else if (currentStep === 5) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step5GmDone;
    if (step5GmDone) navText = q.operation === "add" ? APP_DATA.common.tapNextToAddKg : APP_DATA.common.tapNextToSubtractKg;
  } else if (currentStep === 6) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step6Done;
    if (step6Done) navText = isLastQuestion ? APP_DATA.common.tapNextToSummarise : APP_DATA.common.tapNextForAnother;
  }

  // ===== CHARACTER TEXT & IMAGE =====
  let characterText = "";
  let characterImage = charImage;

  if (currentStep === 1) {
    characterText = APP_DATA.steps[1].characterText;
    characterImage = APP_DATA.steps[1].characterImage;
  } else if (currentStep === 2) characterText = APP_DATA.steps[2].characterText;
  else if (currentStep === 3) characterText = APP_DATA.steps[3].characterText;
  else if (currentStep === 4) characterText = APP_DATA.steps[4].characterText;
  else if (currentStep === 5) characterText = step5GmDone ? q.step5CtAfterGm : q.step5CharacterText;
  else if (currentStep === 6) characterText = step6Done ? (isLastQuestion ? q.step6FinalCtLast : q.step6FinalCt) : q.step5CtAfterGm;

  // ===== HELPERS =====
  const getStatementHtml = () => {
    if (!q) return "";
    let text = q.statement;
    if (showHintHighlight && q.hintWord) {
      const regex = new RegExp("(" + q.hintWord + ")", "gi");
      text = text.replace(regex, '<span class="hint-highlight">$1</span>');
    }
    return text;
  };

  const renderNumberBox = (value, status, isActive, boxType, onClick, displayOverride) => {
    const shown = displayOverride !== undefined ? displayOverride : value;
    let cls = "number-box " + boxType;
    if (status === "correct") cls += " correct";
    else if (status === "wrong") cls += " wrong";
    else if (isActive) cls += " active";
    if (value !== "") cls += " filled";
    return e("div", { className: cls, onClick: onClick || undefined }, shown);
  };

  const renderCalcRow = (opts) => {
    const { label, kgVal, gmVal, kgStatus, gmStatus, kgActive, gmActive, kgClick, gmClick, showLabel, operator } = opts;
    return e("div", { className: "calc-row" },
      e("div", { className: "calc-cell " + (showLabel ? "item-name" : "operator-sign") }, showLabel ? label : (operator || "")),
      e("div", { className: "calc-cell equal-sign" }, showLabel ? "=" : ""),
      renderNumberBox(kgVal, kgStatus, kgActive, "kg-num", kgClick),
      e("div", { className: "calc-cell kg-label" }, q.kgLabel),
      renderNumberBox(gmVal, gmStatus, gmActive, "gm-num", gmClick, formatGmDisplay(gmVal)),
      e("div", { className: "calc-cell gm-label" }, q.gmLabel)
    );
  };

  const renderFeedbackBox = () => {
    let cls = "feedback-box";
    if (showFeedback) cls += " visible";
    if (feedbackType) cls += " " + feedbackType;
    return e("div", { className: cls }, feedbackText);
  };

  // ===== STEP 0: FULLSCREEN START =====
  if (currentStep === 0) {
    return e("div", { className: "applet-container" },
      e("div", { className: "app-main-content", style: { position: "relative" } },
        e(Fullscreen, { heading: APP_DATA.start.heading, text: APP_DATA.start.text, buttonText: APP_DATA.start.buttonText, onButtonClick: handleNext })
      )
    );
  }

  // ===== STEP 7: FULLSCREEN SUMMARY =====
  if (currentStep === 7) {
    return e("div", { className: "applet-container" },
      e("div", { className: "app-main-content", style: { position: "relative" } },
        e(Fullscreen, { heading: APP_DATA.summary.heading, text: APP_DATA.summary.text, buttonText: APP_DATA.summary.buttonText, onButtonClick: resetAll })
      )
    );
  }

  // ===== STEPS 1-6: WITH CHARACTER LAYOUT =====
  const showQuestion = currentStep >= 2;
  const showCalcTable = currentStep >= 3;
  const showOperatorQ = currentStep === 4;
  const showResultRow = currentStep >= 5;
  const showMcq = currentStep === 4;
  const showNumpad = currentStep === 3 || currentStep === 5 || currentStep === 6;
  const inCalcMode = currentStep >= 5;
  const opSymbol = q.operation === "add" ? "+" : "−";

  const getRowVal = (val, ans, status) => {
    if (inCalcMode) return String(ans);
    if (status === "correct") return val || String(ans);
    return val;
  };

  const leftChildren = [];

  if (showQuestion) {
    leftChildren.push(e("div", { key: "qs", className: "question-statement", dangerouslySetInnerHTML: { __html: getStatementHtml() } }));
  }

  if (showCalcTable) {
    const rows = [];

    rows.push(e("div", { key: "r1" }, renderCalcRow({
      label: q.itemName1, showLabel: !inCalcMode, operator: null,
      kgVal: getRowVal(row1Kg, q.kgAns1, row1KgStatus), gmVal: getRowVal(row1Gm, q.gmAns1, row1GmStatus),
      kgStatus: inCalcMode ? "" : row1KgStatus, gmStatus: inCalcMode ? "" : row1GmStatus,
      kgActive: currentStep === 3 && activeBox === "r1kg", gmActive: currentStep === 3 && activeBox === "r1gm",
      kgClick: currentStep === 3 ? () => handleBoxClick("r1kg") : undefined,
      gmClick: currentStep === 3 ? () => handleBoxClick("r1gm") : undefined,
    })));

    rows.push(e("div", { key: "r2" }, renderCalcRow({
      label: q.itemName2, showLabel: !inCalcMode, operator: inCalcMode ? opSymbol : null,
      kgVal: getRowVal(row2Kg, q.kgAns2, row2KgStatus), gmVal: getRowVal(row2Gm, q.gmAns2, row2GmStatus),
      kgStatus: inCalcMode ? "" : row2KgStatus, gmStatus: inCalcMode ? "" : row2GmStatus,
      kgActive: currentStep === 3 && activeBox === "r2kg", gmActive: currentStep === 3 && activeBox === "r2gm",
      kgClick: currentStep === 3 ? () => handleBoxClick("r2kg") : undefined,
      gmClick: currentStep === 3 ? () => handleBoxClick("r2gm") : undefined,
    })));

    if (showResultRow) {
      rows.push(e("div", { key: "bar", className: "addition-bar" }));

      const rKgActive = currentStep === 6 && resultKgStatus !== "correct";
      const rGmActive = currentStep === 5 && resultGmStatus !== "correct";

      rows.push(e("div", { key: "rr" }, renderCalcRow({
        label: "", showLabel: false, operator: null,
        kgVal: resultKg, gmVal: resultGm,
        kgStatus: resultKgStatus, gmStatus: resultGmStatus,
        kgActive: rKgActive, gmActive: rGmActive,
        kgClick: undefined, gmClick: undefined,
      })));
    }

    leftChildren.push(e("div", { key: "ct", className: "calc-table" }, ...rows));
  }

  if (showOperatorQ) {
    leftChildren.push(e("div", { key: "oq", className: "operator-question", dangerouslySetInnerHTML: { __html: APP_DATA.operatorQuestion } }));
  }

  let rightContent = null;

  if (showNumpad) {
    rightContent = e("div", { className: "right-panel-content" },
      renderFeedbackBox(),
      e(Numpad, { disabled: numpadDisabled, onNumberClick: handleNumberClick, onClear: handleClear, onSubmit: handleNumpadSubmit })
    );
  } else if (showMcq) {
    rightContent = e("div", { className: "right-panel-content" },
      renderFeedbackBox(),
      e(MCQPanel, {
        mcqData: { options: [APP_DATA.mcqOptions.add, APP_DATA.mcqOptions.subtract] },
        selectedOption: mcqSelected, isCorrect: mcqCorrect, onOptionClick: handleMcqClick, showFeedback: false,
      })
    );
  }

  const leftCls = "content-left-column" + (leftChildren.length === 0 ? " empty-col" : "");
  const rightCls = "content-right-column" + (!rightContent ? " empty-col" : "");

  return e("div", { className: "applet-container" },
    e("div", { className: "with-character-layout" },
      e(CharacterPanel, { characterImage: characterImage, characterText: characterText }),
      e("div", { className: "content-columns" },
        e("div", { className: leftCls }, ...leftChildren),
        e("div", { className: rightCls }, rightContent)
      )
    ),
    e(Navigation, {
      onNav: (dir) => dir === "next" ? handleNext() : handlePrev(),
      isNextDisabled: nextDisabled, isPrevDisabled: true, navText: navText,
    })
  );
};
