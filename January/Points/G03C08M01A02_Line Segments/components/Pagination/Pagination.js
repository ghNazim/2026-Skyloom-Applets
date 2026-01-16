const Pagination = ({ totalDots, currentDot }) => {
  const dots = [];
  for (let i = 1; i <= totalDots; i++) {
    dots.push(
      React.createElement("div", {
        key: i,
        // Apply 'active' class if the current dot matches the loop index
        className: `pagination-dot ${i === currentDot ? "active" : ""}`,
      })
    );
  }

  // Render the container with all the generated dots
  return React.createElement("div", { className: "pagination-dots" }, ...dots);
};
