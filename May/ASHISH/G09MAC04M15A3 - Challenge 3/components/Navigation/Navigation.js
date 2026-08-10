const Navigation = ({ onNext, onBack, showNext, showBack, showTeeter, children, nextButtonRef, backButtonRef, nextLabel, nextClassName }) => {
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
            {
                ref: nextButtonRef,
                className: [
                    nextClassName || 'nav-chevron next',
                    showNext && showTeeter ? 'teeter-anim' : '',
                ].filter(Boolean).join(' '),
                onClick: onNext,
                disabled: !showNext,
            },
            nextLabel || T.ui.nextButton
        )
    );
};
