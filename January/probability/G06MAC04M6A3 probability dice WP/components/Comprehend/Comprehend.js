const Comprehend = ({ step, onAnimationDone }) => {
  const { useState, useEffect } = React;
  const data = APP_DATA.comprehend;

  const s1Pre = step >= 2;
  const [showGivenTitle, setShowGivenTitle] = useState(s1Pre);
  const [highlightYellow, setHighlightYellow] = useState(s1Pre);
  const [showGivenItem1, setShowGivenItem1] = useState(s1Pre);
  const [highlightScale, setHighlightScale] = useState(s1Pre);
  const [showGivenItem2, setShowGivenItem2] = useState(s1Pre);
  const [animStep1Done, setAnimStep1Done] = useState(s1Pre);

  const [showToFindTitle, setShowToFindTitle] = useState(false);
  const [highlightBlue, setHighlightBlue] = useState(false);
  const [showToFindItem1, setShowToFindItem1] = useState(false);

  useEffect(() => {
    if (step === 1 && !animStep1Done) {
      const timers = [];
      timers.push(setTimeout(() => { setShowGivenTitle(true); playSound("click"); }, 500));
      timers.push(setTimeout(() => { setHighlightYellow(true); playSound("click"); }, 1500));
      timers.push(setTimeout(() => { setShowGivenItem1(true); playSound("click"); }, 2500));
      timers.push(setTimeout(() => { setHighlightScale(true); playSound("click"); }, 3500));
      timers.push(
        setTimeout(() => {
          setShowGivenItem2(true);
          setAnimStep1Done(true);
          playSound("click");
          onAnimationDone(1);
        }, 4500)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      const timers = [];
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
            showGivenItem2
              ? React.createElement(
                  "div",
                  { className: "info-item" },
                  "\u2022 " + data.givenItems[1]
                )
              : null
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
