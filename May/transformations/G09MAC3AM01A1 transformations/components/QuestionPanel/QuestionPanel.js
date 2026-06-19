const QuestionPanel = ({ text, step }) => {
  const { useState, useEffect, useRef } = React;

  const [displayText, setDisplayText] = useState(text || "");
  const h2Ref = useRef(null);
  const tweenRef = useRef(null);
  const isFirstRender = useRef(true);
  const displayTextRef = useRef(displayText);

  displayTextRef.current = displayText;

  useEffect(function () {
    var nextText = text || "";
    var el = h2Ref.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayText(nextText);
      if (el && typeof gsap !== "undefined") {
        gsap.set(el, { opacity: nextText ? 1 : 0 });
      }
      return;
    }

    if (nextText === displayTextRef.current) return;

    if (!el || typeof gsap === "undefined") {
      setDisplayText(nextText);
      return;
    }

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    var fadeIn = function () {
      setDisplayText(nextText);
      requestAnimationFrame(function () {
        if (!h2Ref.current) return;
        tweenRef.current = gsap.to(h2Ref.current, {
          opacity: nextText ? 1 : 0,
          duration: 0.35,
          ease: "power1.inOut",
        });
      });
    };

    if (!displayTextRef.current) {
      fadeIn();
      return;
    }

    tweenRef.current = gsap.to(el, {
      opacity: 0,
      duration: 0.25,
      ease: "power1.inOut",
      onComplete: fadeIn,
    });

    return function () {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [text]);

  return React.createElement(
    "div",
    { className: "question-panel" },
    React.createElement("h2", {
      ref: h2Ref,
      className: "question-panel__text",
      dangerouslySetInnerHTML: { __html: displayText },
    })
  );
};
