const WelcomeScreen = ({ onStart, startButtonRef }) => {
    return React.createElement(
        "div",
        { className: "welcome-screen" },
        React.createElement("h1", { className: "welcome-title" }, T.ui.welcomeTitle),
        React.createElement("p", {
            className: "welcome-message",
            dangerouslySetInnerHTML: { __html: T.ui.welcomeMessage },
        }),
        React.createElement("div", {
            className: "welcome-formula",
            dangerouslySetInnerHTML: { __html: T.ui.formulaGeneral },
        }),
        React.createElement("p", { className: "tap-start-text" }, T.ui.tapStartToBegin),
        React.createElement(
            "button",
            { ref: startButtonRef, className: "start-button", onClick: onStart },
            T.ui.startButton
        )
    );
};
