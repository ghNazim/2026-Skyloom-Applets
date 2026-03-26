const CharacterPanel = ({ characterImage, characterText }) => {
  const textBoxRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!textBoxRef.current) return;
    gsap.set(textBoxRef.current, {
      opacity: 0,
      scale: 0.5,
      transformOrigin: "center center",
    });
  }, [characterText]);

  React.useEffect(() => {
    if (!textBoxRef.current) return;
    gsap.to(textBoxRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  }, [characterText]);

  return React.createElement(
    "div",
    { className: "character-panel" },
    React.createElement("img", {
      src: `assets/${characterImage}`,
      alt: "Character",
      className: "character-image",
    }),
    React.createElement("div", {
      ref: textBoxRef,
      className: "character-text-box",
      dangerouslySetInnerHTML: { __html: characterText || "" },
    }),
  );
};
