const SWAP_CARD_IDS = ["card-step1", "card-step3"];
const CARD_RENDER_ORDER = ["card-step3", "card-step2", "card-step1"];

const StepCardsPanel = ({
  cards,
  showConnectors,
  titlePhase,
  rearrangePhase,
  onCardClick,
}) => {
  const { useState, useLayoutEffect, useRef } = React;

  const cardRefs = useRef({});
  const sourceRectsRef = useRef(null);
  const swapStartedRef = useRef(false);
  const [clones, setClones] = useState([]);
  const [hiddenCardIds, setHiddenCardIds] = useState([]);

  const renderCards = CARD_RENDER_ORDER
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean);

  const captureCardRects = () => {
    const rects = {};
    SWAP_CARD_IDS.forEach((id) => {
      const el = cardRefs.current[id];
      if (el) rects[id] = el.getBoundingClientRect();
    });
    return rects;
  };

  useLayoutEffect(() => {
    if (rearrangePhase === "prepare") {
      sourceRectsRef.current = captureCardRects();
      swapStartedRef.current = false;
      return;
    }

    if (rearrangePhase === "hiding") {
      const sourceRects = sourceRectsRef.current || captureCardRects();
      sourceRectsRef.current = sourceRects;

      const newClones = SWAP_CARD_IDS.map((cardId) => {
        const card = cards.find((c) => c.id === cardId);
        const rect = sourceRects[cardId];
        if (!card || !rect) return null;

        return {
          cardId,
          title: card.numberedTitle,
          content: card.content,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          deltaX: 0,
          deltaY: 0,
          animating: false,
        };
      }).filter(Boolean);

      setHiddenCardIds(SWAP_CARD_IDS);
      setClones(newClones);
      return;
    }

    if (
      rearrangePhase === "animating" &&
      sourceRectsRef.current &&
      !swapStartedRef.current
    ) {
      swapStartedRef.current = true;
      const sourceRects = sourceRectsRef.current;

      const deltas = {};
      SWAP_CARD_IDS.forEach((cardId) => {
        const el = cardRefs.current[cardId];
        const sourceRect = sourceRects[cardId];
        if (!el || !sourceRect) return;
        const targetRect = el.getBoundingClientRect();
        deltas[cardId] = {
          deltaX: targetRect.left - sourceRect.left,
          deltaY: targetRect.top - sourceRect.top,
        };
      });

      setClones((prev) =>
        prev.map((clone) => {
          const delta = deltas[clone.cardId];
          if (!delta) return clone;
          return {
            ...clone,
            deltaX: delta.deltaX,
            deltaY: delta.deltaY,
          };
        }),
      );

      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClones((prev) =>
            prev.map((clone) => ({ ...clone, animating: true })),
          );
        });
      });

      return () => cancelAnimationFrame(rafId);
    }

    if (rearrangePhase === "done" || rearrangePhase === "idle") {
      setClones([]);
      setHiddenCardIds([]);
      sourceRectsRef.current = null;
      swapStartedRef.current = false;
    }
  }, [rearrangePhase, cards.map((c) => c.id + "-" + c.order).join("|")]);

  const isSwapping =
    rearrangePhase === "hiding" ||
    rearrangePhase === "animating" ||
    clones.length > 0;

  const maxCardOrder = cards.reduce(
    (max, card) => Math.max(max, card.order),
    0,
  );

  return React.createElement(
    "div",
    {
      className:
        "step-cards-panel" +
        (showConnectors ? "" : " is-hiding-connectors") +
        (isSwapping ? " is-swapping" : ""),
    },
    renderCards.map((card) => {
      const hasConnectorBelow = isSwapping
        ? card.id !== "card-step1"
        : card.order < maxCardOrder;
      const title =
        titlePhase === "numbered" ? card.numberedTitle : card.initialTitle;
      const titleChanging = titlePhase === "changing";
      const titleVisible =
        titlePhase === "numbered" || titlePhase === "initial";
      const isHidden = hiddenCardIds.includes(card.id);

      return React.createElement(
        "div",
        {
          key: card.id,
          className:
            "step-card-unit" +
            (card.visible ? " is-visible" : "") +
            (rearrangePhase === "hiding" ||
            rearrangePhase === "animating" ||
            rearrangePhase === "done"
              ? " is-rearranging"
              : "") +
            (isHidden ? " is-swap-hidden" : ""),
          style: { order: card.order },
        },
        React.createElement(
          "div",
          {
            ref: (el) => {
              cardRefs.current[card.id] = el;
            },
            className: "step-card" + (card.clickable ? " is-clickable" : ""),
            onClick: card.clickable ? () => onCardClick(card.id) : undefined,
            id: card.clickable ? "step-card-clickable" : undefined,
          },
          React.createElement(
            "div",
            {
              className:
                "step-card-title" +
                (titleChanging ? " is-changing" : "") +
                (titleVisible ? " is-visible" : ""),
            },
            title,
          ),
          React.createElement(
            "div",
            { className: "step-card-content-box" },
            card.content,
          ),
        ),
        hasConnectorBelow
          ? React.createElement("div", {
              className:
                "step-card-connector" +
                (showConnectors && !isSwapping ? " is-visible" : ""),
            })
          : null,
      );
    }),
    clones.map((clone) =>
      React.createElement(
        "div",
        {
          key: "clone-" + clone.cardId,
          className:
            "step-card-clone" + (clone.animating ? " is-animating" : ""),
          style: {
            left: clone.left + "px",
            top: clone.top + "px",
            width: clone.width + "px",
            height: clone.height + "px",
            transform: clone.animating
              ? "translate(" + clone.deltaX + "px, " + clone.deltaY + "px)"
              : "translate(0, 0)",
          },
        },
        React.createElement(
          "div",
          { className: "step-card" },
          React.createElement(
            "div",
            { className: "step-card-title is-visible" },
            clone.title,
          ),
          React.createElement(
            "div",
            { className: "step-card-content-box" },
            clone.content,
          ),
        ),
      ),
    ),
  );
};
