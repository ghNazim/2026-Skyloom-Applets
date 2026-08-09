const Navigation = ({ onNext, onBack, showNext, showBack, children, nextButtonRef, backButtonRef, hidden }) => {
    if (hidden) return null;
    return React.createElement(
        'div',
        { className: 'navigation' },
        React.createElement(
            'button',
            { ref: backButtonRef, className: 'nav-chevron back', onClick: onBack, disabled: !showBack },
            T.ui.backButton
        ),
        children,
        React.createElement(
            'button',
            { ref: nextButtonRef, className: 'nav-chevron next', onClick: onNext, disabled: !showNext },
            T.ui.nextButton
        )
    );
};
