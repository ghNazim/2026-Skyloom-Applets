const EndScreen = ({ onStartOver, startOverButtonRef }) => {
    const { useState } = React;
    const [leftExp, setLeftExp] = useState(3);
    const [rightExp, setRightExp] = useState(4);
    const total = leftExp + rightExp;

    const renderColoredSumExp = (left, right) =>
        React.createElement(
            "sup",
            { className: "end-exp-split" },
            React.createElement("span", { className: "end-exp-left" }, left),
            React.createElement("span", { className: "end-exp-plus" }, "+"),
            React.createElement("span", { className: "end-exp-right" }, right)
        );

    const renderFactors = () => {
        const nodes = [];
        for (let i = 0; i < leftExp + rightExp; i += 1) {
            if (i > 0) {
                nodes.push(React.createElement("span", { key: `mul-${i}`, className: "end-preview-mul" }, "×"));
            }
            const isLeft = i < leftExp;
            const groupIndex = isLeft ? i : i - leftExp;
            const groupSize = isLeft ? leftExp : rightExp;
            nodes.push(
                React.createElement(
                    "span",
                    {
                        key: `factor-${i}`,
                        className: `end-preview-factor ${isLeft ? "end-factor-left" : "end-factor-right"}`
                    },
                    React.createElement("span", { className: "end-preview-chip" }, "(2)"),
                    groupIndex === groupSize - 1 &&
                        React.createElement(
                            "span",
                            { className: `end-preview-mark ${isLeft ? "end-mark-left" : "end-mark-right"}` },
                            String(isLeft ? leftExp : rightExp)
                        )
                )
            );
        }
        return nodes;
    };

    return React.createElement(
        "div",
        { className: "end-screen" },
        React.createElement(
            "div",
            { className: "end-equations-panel end-glass-panel" },
            React.createElement("div", { className: "end-rule-callout" }, T.ui.ruleBoxText),
            React.createElement(
                "div",
                { className: "end-equations-block" },
                React.createElement(
                    "div",
                    { className: "end-eq-line end-eq-top" },
                    React.createElement(
                        "span",
                        { className: "end-power-term end-side-left" },
                        React.createElement("span", { className: "end-base end-color-left" }, "(2)"),
                        React.createElement("sup", { className: "end-exp end-color-left" }, leftExp)
                    ),
                    React.createElement("span", { className: "end-mul" }, "×"),
                    React.createElement(
                        "span",
                        { className: "end-power-term end-side-right" },
                        React.createElement("span", { className: "end-base end-color-right" }, "(2)"),
                        React.createElement("sup", { className: "end-exp end-color-right" }, rightExp)
                    )
                ),
                React.createElement(
                    "div",
                    { className: "end-eq-line end-eq-bottom" },
                    React.createElement("span", { className: "end-equals" }, "="),
                    React.createElement(
                        "span",
                        { className: "end-power-term" },
                        React.createElement("span", { className: "end-base end-color-left" }, "(2)"),
                        renderColoredSumExp(leftExp, rightExp)
                    ),
                    React.createElement("span", { className: "end-equals" }, "="),
                    React.createElement(
                        "span",
                        { className: "end-power-term end-result" },
                        React.createElement("span", { className: "end-base end-color-green" }, "(2)"),
                        React.createElement("sup", { className: "end-exp end-color-green" }, total)
                    )
                )
            )
        ),
        React.createElement(
            "div",
            { className: "end-interactive-panel end-glass-panel" },
            React.createElement(
                "div",
                { className: "end-interactive" },
                React.createElement("div", { className: "end-preview-row" }, renderFactors()),
                React.createElement(
                    "div",
                    { className: "end-sliders-row" },
                    React.createElement(
                        "div",
                        { className: "end-slider-track-wrap end-slider-left" },
                        React.createElement("input", {
                            type: "range",
                            min: 1,
                            max: 10,
                            step: 1,
                            value: leftExp,
                            className: "end-range",
                            onChange: (e) => setLeftExp(parseInt(e.target.value, 10))
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "end-slider-track-wrap end-slider-right" },
                        React.createElement("input", {
                            type: "range",
                            min: 1,
                            max: 10,
                            step: 1,
                            value: rightExp,
                            className: "end-range",
                            onChange: (e) => setRightExp(parseInt(e.target.value, 10))
                        })
                    )
                )
            )
        ),
        React.createElement("p", { className: "tap-start-text end-review-text" }, T.ui.endFooterText),
        React.createElement(
            "button",
            {
                ref: startOverButtonRef,
                className: "start-over-button",
                onClick: onStartOver
            },
            T.ui.startOverButton
        )
    );
};
