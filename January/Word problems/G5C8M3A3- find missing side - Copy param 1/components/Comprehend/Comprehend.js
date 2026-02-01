const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];

  if (step === 1) {
    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    const totalGiven = givenData.length;

    // substep 0 = section title only (no Given yet). substep 1+ = Given items, then To Find
    const showGivenSection = substep >= 1;
    const showGivenCount = showGivenSection ? Math.min(substep, totalGiven) : 0;
    const showToFind = substep > totalGiven;
    const toFindCount = showToFind ? Math.min(substep - totalGiven, toFindData.length) : 0;

    return React.createElement(
      "div",
      { className: "comprehend-panel" },
      // Section Title (always shown)
      React.createElement(
        "h3",
        { className: "comprehend-section-title" },
        comprehendData.sectionTitle
      ),
      // Given Section (only when substep >= 1)
      showGivenSection && React.createElement(
        "div",
        { className: "comprehend-section given-section" },
        React.createElement(
          "div",
          { className: "section-border given-border" }
        ),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement(
            "h4",
            { className: "section-title given-title" },
            comprehendData.given.title
          ),
          React.createElement(
            "ul",
            { className: "section-list" },
            givenData.slice(0, showGivenCount).map((item, index) => {
              const isCurrentItem = !showToFind && index === showGivenCount - 1;
              return React.createElement(
                "li",
                {
                  key: `given-${index}`,
                  className: "section-list-item" + (isCurrentItem ? " comprehend-item-current" : ""),
                  style: {
                    animation: isCurrentItem ? "fadeInUp 0.3s ease-out" : "none"
                  }
                },
                item
              );
            })
          )
        )
      ),
      showToFind && React.createElement(
        "div",
        { className: "comprehend-section tofind-section" },
        React.createElement(
          "div",
          { className: "section-border tofind-border" }
        ),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement(
            "h4",
            { className: "section-title tofind-title" },
            comprehendData.toFind.title
          ),
          React.createElement(
            "ul",
            { className: "section-list" },
            toFindData.slice(0, toFindCount).map((item, index) => {
              const isCurrentItem = index === toFindCount - 1;
              return React.createElement(
                "li",
                {
                  key: `tofind-${index}`,
                  className: "section-list-item tofind-item" + (isCurrentItem ? " comprehend-item-current" : ""),
                  style: {
                    animation: isCurrentItem ? "fadeInUp 0.3s ease-out" : "none"
                  }
                },
                item
              );
            })
          )
        )
      )
    );
  }

  return null;
};
