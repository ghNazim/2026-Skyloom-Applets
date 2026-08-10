(() => {
    const { useState, useEffect, useRef, useLayoutEffect } = React;

    /**
     * Hook to manage a list of dynamic flying "ghosts".
     * Spawns a clone element that flies from source to target.
     */
    const useGhostFlight = (containerRef) => {
        const [ghosts, setGhosts] = useState([]);

        const triggerGhost = ({ sourceEl, targetEl, text, colorClass, duration = 600, onComplete }) => {
            const container = containerRef.current || document.querySelector('.compare-screen');
            if (!container || !sourceEl || !targetEl) {
                if (onComplete) onComplete();
                return;
            }

            const sourceRect = sourceEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const sourceStyle = window.getComputedStyle(sourceEl);
            const targetStyle = window.getComputedStyle(targetEl);

            const startLeft = sourceRect.left - containerRect.left;
            const startTop = sourceRect.top - containerRect.top;
            const dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
            const dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
            const sourceFontPx = parseFloat(sourceStyle.fontSize) || sourceRect.height;
            const targetFontPx = parseFloat(targetStyle.fontSize) || targetRect.height;
            const scale = targetFontPx / sourceFontPx;

            const ghostId = `${Date.now()}-${Math.random()}`;

            const newGhost = {
                id: ghostId,
                text,
                left: startLeft,
                top: startTop,
                width: sourceRect.width,
                height: sourceRect.height,
                dx,
                dy,
                scale,
                fontSize: sourceStyle.fontSize,
                fontWeight: sourceStyle.fontWeight,
                lineHeight: sourceStyle.lineHeight,
                colorClass,
                active: false
            };

            setGhosts(prev => [...prev, newGhost]);

            // Phase 1: Activate animation in the next paint cycle
            const raf1 = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setGhosts(prev => prev.map(g => g.id === ghostId ? { ...g, active: true } : g));
                });
            });

            // Phase 2: Cleanup and invoke callback after animation completes
            const timeout = setTimeout(() => {
                setGhosts(prev => prev.filter(g => g.id !== ghostId));
                if (onComplete) onComplete();
            }, duration + 30); // buffer for animation initialization

            return () => {
                cancelAnimationFrame(raf1);
                clearTimeout(timeout);
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

            // Activate transition after layout recalculation
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

        return ghosts.map(ghost =>
            React.createElement(
                'span',
                {
                    key: ghost.id,
                    className: `ghost-base-element ${ghost.colorClass || ''} ${ghost.active ? 'ghost-active' : ''}`,
                    style: {
                        left: `${ghost.left}px`,
                        top: `${ghost.top}px`,
                        width: `${ghost.width}px`,
                        height: `${ghost.height}px`,
                        fontSize: ghost.fontSize,
                        fontWeight: ghost.fontWeight,
                        lineHeight: ghost.lineHeight || 1,
                        '--dx': `${ghost.dx}px`,
                        '--dy': `${ghost.dy}px`,
                        '--scale': ghost.scale
                    }
                },
                ghost.text
            )
        );
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
                    className: `abs-merge-chip ${mergeActive ? "abs-merge-active" : ""} ${keyPrefix === 'count' ? 'to-center' : ''}`,
                    style: {
                        left: `${chip.left}px`,
                        top: `${chip.top}px`,
                        width: `${chip.width}px`,
                        height: `${chip.height}px`,
                        "--dx": `${chip.dx}px`,
                        "--dy": `${chip.dy}px`,
                        "--stagger": chip.isRightGroup ? chip.idx - leftCount : chip.idx,
                        "--group-delay": chip.isRightGroup ? 160 : 0
                    }
                },
                React.createElement(
                    "span",
                    {
                        className: `factor-chip visible ${
                            chip.useWhite ? "white-color" : chip.isRightGroup ? "right-color" : "left-color"
                        }`
                    },
                    "(2)"
                )
            )
        );
    };

    /**
     * Parameterized math formula for index-based group simplifies.
     * Computes translation offset cleanly without hardcoding pixel values.
     */
    const calculateSimplifyShift = ({ index, groupStartIndex, groupLength, pivotIndex, pitchVw }) => {
        // Offset is calculated relative to the pivot element in the group
        const targetGroupIndex = groupStartIndex + pivotIndex;
        return (targetGroupIndex - index) * pitchVw;
    };

    // Expose all items on global window namespace
    window.AppletAnimator = {
        useGhostFlight,
        useMergeAnimation,
        GhostFlightLayer,
        AbsoluteMergeLayer,
        calculateSimplifyShift
    };
})();
