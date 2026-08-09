const WelcomeScreen = ({ onStart, startButtonRef }) => {
    return React.createElement(
        "div",
        { className: "welcome-screen" },
        React.createElement("h1", { className: "welcome-title" }, T.ui.welcomeTitle),
        React.createElement("p", {
            className: "welcome-message",
            dangerouslySetInnerHTML: { __html: T.ui.welcomeMessage },
        }),
        React.createElement(
            "button",
            { ref: startButtonRef, className: "start-button", onClick: onStart },
            T.ui.startButton
        )
    );
};
