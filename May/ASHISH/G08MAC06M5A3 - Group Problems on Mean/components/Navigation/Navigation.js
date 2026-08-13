const Navigation = ({ onNext, onBack, showNext, showBack, hideNext, hideInstruction, children, nextButtonRef, backButtonRef }) => {
    return React.createElement(
        'div',
        { className: 'navigation' },
        React.createElement(
            'button',
            { ref: backButtonRef, className: 'nav-chevron back', onClick: onBack, disabled: !showBack },
            T.ui.backButton
        ),
        React.createElement('div', { className: `navigation__instruction ${hideInstruction ? 'navigation__instruction--hidden' : ''}` }, children),
        React.createElement(
            'button',
            { ref: nextButtonRef, className: `nav-chevron next ${hideNext ? 'nav-chevron--hidden' : ''}`, onClick: onNext, disabled: !showNext || hideNext },
            T.ui.nextButton
        )
    );
};
