(() => {
    const { useState } = React;

    /**
     * Hook to manage a list of dynamic flying "ghosts".
     * Spawns a clone element that flies from source to target.
     */
    const useGhostFlight = (containerRef) => {
        const [ghosts, setGhosts] = useState([]);

        const triggerGhost = ({
            sourceEl,
            targetEl,
            text,
            colorClass,
            duration = 720,
            onArrive,
            onComplete,
            cloneFromEl,
            preserveSourceOpacity = false,
            contentCloneOnly = false,
        }) => {
            const container = containerRef.current;
            if (!container || !sourceEl || !targetEl) {
                if (onComplete) onComplete();
                return;
            }

            const containerRect = container.getBoundingClientRect();
            const sourceRect = sourceEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();
            const sourceStyle = window.getComputedStyle(sourceEl);
            const targetStyle = window.getComputedStyle(targetEl);

            const startCenterX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            const startCenterY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            const dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
            const dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);

            const useClone = Boolean(cloneFromEl);
            const isContentClone = useClone && contentCloneOnly;
            const sourceFontPx = Math.max(sourceRect.height * 0.9, parseFloat(sourceStyle.fontSize) || 18, 14);
            const targetFontPx = Math.max(targetRect.height * 0.7, parseFloat(targetStyle.fontSize) || 18, 14);
            const scale = useClone
                ? Math.min(targetRect.width / sourceRect.width, targetRect.height / sourceRect.height)
                : targetFontPx / sourceFontPx;

            const isSvgSource =
                sourceEl.namespaceURI === "http://www.w3.org/2000/svg" || Boolean(sourceEl.ownerSVGElement);
            let fillColor = "#ffe814";
            if (!useClone) {
                if (isSvgSource) {
                    const svgFill = sourceStyle.fill;
                    if (svgFill && svgFill !== "none" && svgFill !== "rgba(0, 0, 0, 0)") {
                        fillColor = svgFill;
                    }
                } else {
                    const textColor = sourceStyle.color;
                    if (textColor && textColor !== "rgba(0, 0, 0, 0)") {
                        fillColor = textColor;
                    }
                }
            }

            const ghostId = `${Date.now()}-${Math.random()}`;
            const prevOpacity = sourceEl.style.opacity;
            if (!preserveSourceOpacity) {
                sourceEl.style.opacity = useClone ? "0.28" : "0.25";
            }

            const newGhost = {
                id: ghostId,
                text,
                left: startCenterX,
                top: startCenterY,
                fontSize: `${sourceFontPx}px`,
                fontWeight: sourceStyle.fontWeight || "700",
                fillColor,
                dx,
                dy,
                scale,
                colorClass: isContentClone ? "ghost-clone-quiz-content" : useClone ? "ghost-clone-quiz" : colorClass,
                active: false,
                useClone,
                contentCloneOnly: isContentClone,
                cloneHtml: useClone ? cloneFromEl.innerHTML : null,
                cloneWidth: sourceRect.width,
                cloneHeight: sourceRect.height,
                durationMs: duration,
            };

            setGhosts((prev) => [...prev, newGhost]);

            let arrived = false;
            const fireArrive = () => {
                if (arrived) return;
                arrived = true;
                setGhosts((prev) => prev.filter((g) => g.id !== ghostId));
                if (onArrive) onArrive();
            };

            let arriveTimer;
            let cleanupTimer;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setGhosts((prev) => prev.map((g) => (g.id === ghostId ? { ...g, active: true } : g)));
                    arriveTimer = setTimeout(fireArrive, duration);
                    cleanupTimer = setTimeout(() => {
                        if (!preserveSourceOpacity) {
                            sourceEl.style.opacity = prevOpacity || "";
                        }
                        if (onComplete) onComplete();
                    }, duration + 60);
                });
            });

            return () => {
                clearTimeout(arriveTimer);
                clearTimeout(cleanupTimer);
                if (!preserveSourceOpacity) {
                    sourceEl.style.opacity = prevOpacity || "";
                }
            };
        };

        const clearGhosts = () => setGhosts([]);

        return { ghosts, triggerGhost, clearGhosts };
    };

    /**
     * Hook to coordinate multi-element staggered merges into a single target element.
     */
    const useMergeAnimation = (stageRef, targetRef) => {
        const [mergeChips, setMergeChips] = useState(null);
        const [isMergeActive, setIsMergeActive] = useState(false);

        const startMerge = ({ sourceSelector, leftCount, stagger = 38, groupDelay = 160 }) => {
            const stage = stageRef.current;
            const target = targetRef.current;
            if (!stage || !target) return;

            const stageRect = stage.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const units = stage.querySelectorAll(sourceSelector);

            const chips = Array.from(units).map((unitEl) => {
                const chipEl = unitEl.querySelector(".factor-chip") || unitEl;
                const chipRect = chipEl.getBoundingClientRect();
                const targetCenterX = targetRect.left + targetRect.width / 2;
                const targetCenterY = targetRect.top + targetRect.height / 2;
                const chipCenterX = chipRect.left + chipRect.width / 2;
                const chipCenterY = chipRect.top + chipRect.height / 2;
                const idx = parseInt(unitEl.getAttribute("data-factor-idx") || "0", 10);

                return {
                    idx,
                    left: chipRect.left - stageRect.left,
                    top: chipRect.top - stageRect.top,
                    width: chipRect.width,
                    height: chipRect.height,
                    dx: targetCenterX - chipCenterX,
                    dy: targetCenterY - chipCenterY,
                    isRightGroup: idx >= leftCount,
                    useWhite: unitEl.classList.contains("merge-unit-white") || unitEl.classList.contains("count-merge-unit")
                };
            });

            setMergeChips(chips);
            setIsMergeActive(false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsMergeActive(true);
                });
            });
        };

        const resetMerge = () => {
            setMergeChips(null);
            setIsMergeActive(false);
        };

        return { mergeChips, isMergeActive, startMerge, resetMerge };
    };

    /**
     * Declarative Component to render flying ghost elements.
     */
    const GhostFlightLayer = ({ ghosts }) => {
        if (!ghosts || !ghosts.length) return null;

        return ghosts.map((ghost) => {
            const durationStyle = { "--ghost-duration": `${ghost.durationMs || 720}ms` };
            if (ghost.useClone) {
                const cloneClass = ghost.contentCloneOnly
                    ? "ghost-base-element ghost-clone-quiz-content"
                    : "ghost-base-element ghost-clone-quiz quiz-option";
                return React.createElement("span", {
                    key: ghost.id,
                    className: `${cloneClass} ${ghost.active ? "ghost-active" : ""}`,
                    style: {
                        left: `${ghost.left}px`,
                        top: `${ghost.top}px`,
                        width: `${ghost.cloneWidth}px`,
                        height: `${ghost.cloneHeight}px`,
                        "--dx": `${ghost.dx}px`,
                        "--dy": `${ghost.dy}px`,
                        "--scale": ghost.scale,
                        ...durationStyle,
                    },
                    dangerouslySetInnerHTML: { __html: ghost.cloneHtml },
                });
            }

            return React.createElement(
                "span",
                {
                    key: ghost.id,
                    className: `ghost-base-element ${ghost.colorClass || ""} ${ghost.active ? "ghost-active" : ""}`,
                    style: {
                        left: `${ghost.left}px`,
                        top: `${ghost.top}px`,
                        fontSize: ghost.fontSize,
                        fontWeight: ghost.fontWeight,
                        color: ghost.fillColor,
                        "--dx": `${ghost.dx}px`,
                        "--dy": `${ghost.dy}px`,
                        "--scale": ghost.scale,
                        ...durationStyle,
                    },
                },
                ghost.text
            );
        });
    };

    /**
     * Declarative Component to render multi-element merge layers.
     */
    const AbsoluteMergeLayer = ({ chips, mergeActive, keyPrefix, leftCount }) => {
        if (!chips || !chips.length) return null;

        return chips.map((chip) =>
            React.createElement(
                "span",
                {
                    key: `${keyPrefix}-${chip.idx}`,
                    className: `abs-merge-chip ${mergeActive ? "abs-merge-active" : ""} ${keyPrefix === "count" ? "to-center" : ""}`,
                    style: {
                        left: `${chip.left}px`,
                        top: `${chip.top}px`,
                        width: `${chip.width}px`,
                        height: `${chip.height}px`,
                        "--dx": `${chip.dx}px`,
                        "--dy": `${chip.dy}px`,
                        "--stagger": chip.isRightGroup ? chip.idx - leftCount : chip.idx,
                        "--group-delay": chip.isRightGroup ? 160 : 0,
                    },
                },
                React.createElement(
                    "span",
                    {
                        className: `factor-chip visible ${
                            chip.useWhite ? "white-color" : chip.isRightGroup ? "right-color" : "left-color"
                        }`,
                    },
                    "(2)"
                )
            )
        );
    };

    const calculateSimplifyShift = ({ index, groupStartIndex, groupLength, pivotIndex, pitchVw }) => {
        const targetGroupIndex = groupStartIndex + pivotIndex;
        return (targetGroupIndex - index) * pitchVw;
    };

    window.AppletAnimator = {
        useGhostFlight,
        useMergeAnimation,
        GhostFlightLayer,
        AbsoluteMergeLayer,
        calculateSimplifyShift,
    };
})();
