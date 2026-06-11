const MainCanvas = function (props) {
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNav = props.onUpdateNav;
  var onAllComplete = props.onAllComplete;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useCallback = React.useCallback;

  var questions = APP_DATA.questions;
  var totalCards = questions.length;

  var _cardIndex = useState(0);
  var currentCardIndex = _cardIndex[0];
  var setCurrentCardIndex = _cardIndex[1];

  var _exiting = useState(false);
  var cardExiting = _exiting[0];
  var setCardExiting = _exiting[1];

  var _wrongIds = useState(new Set());
  var wrongIds = _wrongIds[0];
  var setWrongIds = _wrongIds[1];

  var _correctId = useState(null);
  var correctId = _correctId[0];
  var setCorrectId = _correctId[1];

  var _shakingId = useState(null);
  var shakingId = _shakingId[0];
  var setShakingId = _shakingId[1];

  useEffect(
    function () {
      window.__cardDeckNext = function () {
        if (correctId === null) return;
        handleNextCard();
      };
      return function () {
        delete window.__cardDeckNext;
      };
    },
    [correctId, currentCardIndex]
  );

  var handleNextCard = function () {
    if (currentCardIndex >= totalCards - 1) return;
    setCardExiting(true);
    setTimeout(function () {
      setCardExiting(false);
      setCurrentCardIndex(function (prev) {
        return prev + 1;
      });
      resetInteraction();
    }, 400);
  };

  var resetInteraction = function () {
    setWrongIds(new Set());
    setCorrectId(null);
    setShakingId(null);
    onSetNextEnabled(false);
    onUpdateNav(APP_DATA.steps[1].navText, "neutral");
  };

  var handleOptionSelect = function (option) {
    if (correctId !== null) return;
    if (wrongIds.has(option.id)) return;

    var q = questions[currentCardIndex];
    var isCorrect = option.id === q.correctIndex;

    if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");
      setCorrectId(option.id);

      var solutionHtml = renderLatex(q.solutionLatex);
      var feedbackHtml = q.correctFeedback.replace(
        "{{solution}}",
        solutionHtml
      );

      var isLast = currentCardIndex >= totalCards - 1;
      onSetNextEnabled(true);
      onUpdateNav(feedbackHtml, "correct");

      if (isLast) {
        onAllComplete();
      }
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setWrongIds(function (prev) {
        var next = new Set(prev);
        next.add(option.id);
        return next;
      });
      setShakingId(option.id);
      onUpdateNav(q.wrongFeedback, "incorrect");

      setTimeout(function () {
        setShakingId(null);
      }, 500);
    }
  };

  var q = questions[currentCardIndex];
  var optionsData = q.options.map(function (latex, idx) {
    var result = null;
    if (correctId === idx) result = "correct";
    else if (wrongIds.has(idx)) result = "incorrect";

    return {
      id: idx,
      latex: latex,
      result: result,
      shaking: shakingId === idx,
    };
  });

  var disabledIds = new Set();
  if (correctId !== null) {
    q.options.forEach(function (_, idx) {
      disabledIds.add(idx);
    });
  } else {
    wrongIds.forEach(function (id) {
      disabledIds.add(id);
    });
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "canvas-two-col" },
      React.createElement(
        "div",
        { className: "left-panel" },
        React.createElement(CardDeck, {
          questions: questions,
          currentCardIndex: currentCardIndex,
          cardExiting: cardExiting,
        })
      ),
      React.createElement(
        "div",
        { className: "right-panel" },
        React.createElement(McqGrid, {
          options: optionsData,
          disabledIds: disabledIds,
          onSelect: handleOptionSelect,
        })
      )
    )
  );
};
