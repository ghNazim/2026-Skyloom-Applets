// components/HintOverlay/HintOverlay.js
const HintOverlay = ({ hint, onClose }) => {
    const h = React.createElement;
    
    if (!hint) return null;

    return h('div', { className: 'hint-overlay', onClick: onClose },
        h('div', { className: 'hint-content', onClick: (e) => e.stopPropagation() },
            h('button', { className: 'close-btn', onClick: onClose }, '×'),
            hint.type === 'image' 
                ? h('img', { src: hint.content, alt: 'Hint' })
                : h('div', { 
                    className: 'hint-text',
                    dangerouslySetInnerHTML: { __html: hint.content } 
                })
        )
    );
};

