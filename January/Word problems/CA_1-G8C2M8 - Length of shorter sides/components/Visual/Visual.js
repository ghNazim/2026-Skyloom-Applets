const Visual = ({ imageSrc, showAreaLabel, step, substep = 0, isAnswered = false }) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  console.log(isSvgInline);
  
  // Determine area label visibility and opacity
  const getAreaLabelStyle = () => {
    // Step 0: full opacity
    if (step === 0) {
      return { opacity: 1, display: 'block' };
    }
    
    // Step 1: substep 0 = low opacity, other substeps = full opacity
    if (step === 1) {
      if (substep === 0) {
        return { opacity: 0.2, display: 'block' };
      } else {
        return { opacity: 1, display: 'block' };
      }
    }
    
    // Step 3: low opacity, but hide when answered
    if (step === 3) {
      
      return { opacity: 0.2, display: 'block' };
    }
    
    // Step 4: full opacity, but hide when answered
    if (step === 4) {
      if (isAnswered) {
        return { opacity: 0, display: 'none' };
      }
      return { opacity: 1, display: 'block' };
    }
    
    // All other steps: don't show
    return { opacity: 0, display: 'none' };
  };
  
  const areaLabelStyle = getAreaLabelStyle();
  const shouldShowLabel = showAreaLabel && areaLabelStyle.display !== 'none';
  
  return React.createElement(
    "div",
    { className: "visual-panel" },
    shouldShowLabel && React.createElement("span", {
      className: "area-label",
      style: areaLabelStyle
    }, APP_DATA.label),
    isSvgInline ? React.createElement("div", {className: "svg-inline-wrapper", dangerouslySetInnerHTML: { __html: imageSrc } }) : React.createElement("img", {
      src: imageSrc,
      alt: "Visual representation",
      className: "visual-image",
    })
  );
};
