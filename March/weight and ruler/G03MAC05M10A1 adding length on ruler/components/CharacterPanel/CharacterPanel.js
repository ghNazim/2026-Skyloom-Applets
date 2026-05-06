const CharacterPanel = ({ characterImage, characterText }) => {
  const textBoxRef = React.useRef(null);
  const [resolvedImage, setResolvedImage] = React.useState(characterImage || null);

  React.useEffect(() => {
    setResolvedImage(characterImage || null);
  }, [characterImage]);

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
    resolvedImage
      ? React.createElement("img", {
          src: `assets/${resolvedImage}`,
          alt: "Character",
          className: "character-image",
          onError: () => {
            if (resolvedImage !== "character.svg") {
              setResolvedImage("character.svg");
            }
          },
        })
      : null,
    React.createElement(
      "div",
      { ref: textBoxRef, className: "character-text-box" },
      characterText
    )
  );
};
