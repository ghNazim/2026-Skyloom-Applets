const Nudge = (props) => {
  var targetRef = props.targetRef;
  var show = props.show !== false;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var _pos = useState(null);
  var position = _pos[0];
  var setPosition = _pos[1];
  var _dismissed = useState(false);
  var dismissed = _dismissed[0];
  var setDismissed = _dismissed[1];

  useEffect(function () {
    if (!show) setDismissed(false);
  }, [show]);

  useEffect(function () {
    if (!show || dismissed || !targetRef) return undefined;
    var el = targetRef.current;
    if (!el) return undefined;

    function handleTargetClick() {
      setDismissed(true);
    }

    el.addEventListener("click", handleTargetClick);
    return function () {
      el.removeEventListener("click", handleTargetClick);
    };
  }, [show, dismissed, targetRef]);

  useEffect(function () {
    if (!show || dismissed || !targetRef) {
      setPosition(null);
      return undefined;
    }

    function updatePosition() {
      var el = targetRef.current;
      if (!el) {
        setPosition(null);
        return;
      }
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPosition(null);
        return;
      }
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
      });
    }

    updatePosition();
    var intervalId = setInterval(updatePosition, 150);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return function () {
      clearInterval(intervalId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [show, dismissed, targetRef]);

  if (!show || dismissed || !position) return null;

  return React.createElement(
    "div",
    {
      className: "nudge-overlay",
      style: {
        position: "fixed",
        left: position.left,
        top: position.top,
        transform: "translate(30%, 0%)",
        pointerEvents: "none",
        zIndex: 10000,
      },
    },
    React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      className: "nudge-tap-gif",
    })
  );
};
