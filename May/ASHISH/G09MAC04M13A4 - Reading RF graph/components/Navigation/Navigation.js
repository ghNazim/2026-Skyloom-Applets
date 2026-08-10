const Navigation = ({ onNext, onBack, showNext, showBack, showTeeter, children, nextButtonRef, backButtonRef }) => {
    const nextClasses = [
        'nav-chevron',
        'next',
        'ftue-target',
        showNext && showTeeter ? 'teeter-anim' : '',
    ].filter(Boolean).join(' ');

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
                className: nextClasses,
                onClick: onNext,
                disabled: !showNext,
            },
            T.ui.nextButton
        )
    );
};
