


const audioCache = {};
const OBJECT_COLOR = "#fb9b5b";
const IMAGE_COLOR = "#46c5ce";
const OBJECT_COLOR_LIGHT = "rgba(251, 155, 91, 0.3)";
const IMAGE_COLOR_LIGHT = "rgba(70, 197, 206, 0.22)";
const sounds = ["correct", "wrong", "click", "congrats","tick"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load(); // Preloads the audio
  audioCache[name] = audio;
});
function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode(); // Clone so it can overlap itself
  sound.play();
}


function createSummaryElement(summary) {
  if (!summary) return null;
  if (summary.text) {
    return React.createElement("p", {
      dangerouslySetInnerHTML: { __html: summary.text },
    });
  }
  return React.createElement(
    "p",
    null,
    summary.line1,
    (summary.lines || []).reduce(function (acc, line, i) {
      acc.push(
        React.createElement("br", { key: "summary-br-" + i }),
        line.indexOf("-") === 0
          ? React.createElement(
              "span",
              { key: "summary-ln-" + i, className: "summary-highlight" },
              line
            )
          : line
      );
      return acc;
    }, [])
  );
}

function getNextTypedHtmlIndex(html, index) {
  if (html.charAt(index) !== "<") return index + 1;
  var closeIndex = html.indexOf(">", index);
  return closeIndex === -1 ? index + 1 : closeIndex + 1;
}

function AnimatedSummaryElement(props) {
  var summary = props.summary;
  var className = props.className || "";
  var onComplete = props.onComplete;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;

  var typedState = useState("");
  var typed = typedState[0];
  var setTyped = typedState[1];
  var visibleLinesState = useState(0);
  var visibleLines = visibleLinesState[0];
  var setVisibleLines = visibleLinesState[1];
  var doneRef = useRef(false);
  var onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(
    function () {
      var timers = [];
      doneRef.current = false;
      setTyped("");
      setVisibleLines(0);

      function finish() {
        if (doneRef.current) return;
        doneRef.current = true;
        if (onCompleteRef.current) onCompleteRef.current();
      }

      if (!summary) {
        finish();
        return function () {};
      }

      if (summary.text) {
        var full = summary.text;
        var index = 0;

        function typeNext() {
          if (index >= full.length) {
            setTyped(full);
            finish();
            return;
          }
          index = getNextTypedHtmlIndex(full, index);
          setTyped(full.slice(0, index));
          timers.push(setTimeout(typeNext, 30));
        }

        typeNext();
        return function () {
          timers.forEach(clearTimeout);
        };
      }

      var lines = summary.lines || [];
      if (!lines.length) {
        finish();
        return function () {};
      }

      lines.forEach(function (_line, i) {
        timers.push(
          setTimeout(function () {
            setVisibleLines(i + 1);
          }, (i + 1) * 1000)
        );
      });
      timers.push(
        setTimeout(function () {
          finish();
        }, lines.length * 1000 + 1500)
      );

      return function () {
        timers.forEach(clearTimeout);
      };
    },
    [summary]
  );

  if (!summary) return null;

  if (summary.text) {
    return React.createElement("p", {
      className: className,
      dangerouslySetInnerHTML: { __html: typed },
    });
  }

  return React.createElement(
    "p",
    { className: className },
    summary.line1,
    (summary.lines || []).reduce(function (acc, line, i) {
      acc.push(
        React.createElement("br", { key: "summary-br-" + i }),
        React.createElement(
          "span",
          {
            key: "summary-ln-" + i,
            className:
              "summary-line-fade" +
              (i < visibleLines ? " summary-line-fade--visible" : "") +
              (line.indexOf("-") === 0 ? " summary-highlight" : ""),
          },
          line
        )
      );
      return acc;
    }, [])
  );
}


function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  
  return sentence.replace(/,/g, "<cm>,</cm>");
}

function confettiBurst() {
  const duration = 1 * 600;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
