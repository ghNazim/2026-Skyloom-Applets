const Comprehend = ({ step, step1Part, onAnimationDone }) => {
  const { useState, useEffect } = React;
  const data = APP_DATA.comprehend;

  const s1Pre = step >= 2;
  const [showGivenTitle, setShowGivenTitle] = useState(s1Pre);
  const [highlightYellow, setHighlightYellow] = useState(s1Pre);
  const [highlightChanceYellow, setHighlightChanceYellow] = useState(false);
  const [showGivenItem1, setShowGivenItem1] = useState(s1Pre);
  const [highlightScale, setHighlightScale] = useState(s1Pre);
  const [animStep1Part1Done, setAnimStep1Part1Done] = useState(s1Pre);
  const [animStep1Part2Done, setAnimStep1Part2Done] = useState(s1Pre);

  const [showToFindTitle, setShowToFindTitle] = useState(false);
  const [highlightBlue, setHighlightBlue] = useState(false);
  const [showToFindItem1, setShowToFindItem1] = useState(false);

  useEffect(() => {
    if (step === 1 && step1Part === 0 && !animStep1Part1Done) {
      const timers = [];
      timers.push(setTimeout(() => { setShowGivenTitle(true); playSound("click"); }, 500));
      timers.push(setTimeout(() => { setHighlightYellow(true); playSound("click"); }, 1500));
      timers.push(
        setTimeout(() => {
          setShowGivenItem1(true);
          setAnimStep1Part1Done(true);
          playSound("click");
          onAnimationDone("comprehend_step1_part1");
        }, 2500)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step, step1Part, animStep1Part1Done]);

  useEffect(() => {
    if (step === 1 && step1Part === 2 && !animStep1Part2Done) {
      const timers = [];
      timers.push(
        setTimeout(() => {
          setHighlightYellow(false);
          setHighlightChanceYellow(true);
          playSound("click");
        }, 500)
      );
      timers.push(
        setTimeout(() => {
          setHighlightScale(true);
          setAnimStep1Part2Done(true);
          playSound("click");
          onAnimationDone("comprehend_step1_part2");
        }, 1500)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step, step1Part, animStep1Part2Done]);

  useEffect(() => {
    if (step === 2) {
      const timers = [];
      setHighlightChanceYellow(false);
      timers.push(setTimeout(() => { setShowToFindTitle(true); playSound("click"); }, 500));
      timers.push(setTimeout(() => { setHighlightBlue(true); playSound("click"); }, 1500));
      timers.push(
        setTimeout(() => {
          setShowToFindItem1(true);
          playSound("click");
          onAnimationDone(2);
        }, 2500)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  const questionClasses =
    "comprehend-question-text" +
    (highlightYellow ? " highlight-yellow" : "") +
    (highlightChanceYellow ? " highlight-chance-yellow" : "") +
    (highlightBlue ? " highlight-blue" : "");

  return React.createElement(
    "div",
    { className: "comprehend-container" },

    React.createElement(
      "div",
      { className: "comprehend-question-col" },
      React.createElement("div", {
        className: questionClasses,
        dangerouslySetInnerHTML: { __html: data.questionText },
      }),
      React.createElement(
        "div",
        { className: "comprehend-scale-wrapper" },
        React.createElement(Scale, {
          allVisible: true,
          customImages: APP_DATA.scaleImages,
          highlighted: highlightScale,
        })
      )
    ),

    React.createElement(
      "div",
      { className: "comprehend-info-col" },

      showGivenTitle
        ? React.createElement(
            "div",
            { className: "info-section given-section" },
            React.createElement(
              "h3",
              { className: "info-title given-title" },
              data.givenTitle
            ),
            showGivenItem1
              ? React.createElement(
                  "div",
                  { className: "info-item" },
                  "\u2022 " + data.givenItems[0]
                )
              : null,
            null
          )
        : null,

      showToFindTitle
        ? React.createElement(
            "div",
            { className: "info-section tofind-section" },
            React.createElement(
              "h3",
              { className: "info-title tofind-title" },
              data.toFindTitle
            ),
            showToFindItem1
              ? React.createElement(
                  "div",
                  { className: "info-item" },
                  "\u2022 " + data.toFindItems[0]
                )
              : null
          )
        : null
    )
  );
};
