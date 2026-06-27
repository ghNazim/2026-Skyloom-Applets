const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];
  
  if (step === 1) {
    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    const totalGiven = givenData.length;
    const showGivenCount = substep >= 1 ? Math.min(substep, totalGiven) : 0;
    const showToFind = substep > totalGiven;
    const toFindCount = showToFind ? Math.min(substep - totalGiven, toFindData.length) : 0;
    
    return React.createElement(
      "div",
      { className: "comprehend-panel" },
      React.createElement(
        "h3",
        { className: "comprehend-section-title" },
        comprehendData.sectionTitle
      ),
      React.createElement(
        "div",
        { className: "comprehend-section given-section" },
        React.createElement("div", { className: "section-border given-border" }),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement("h4", { className: "section-title given-title" }, comprehendData.given.title),
          React.createElement(
            "ul",
            { className: "section-list" },
            givenData.slice(0, showGivenCount).map((item, index) => {
              const isLastAddedGiven = substep >= 1 && substep <= totalGiven && index === showGivenCount - 1;
              return React.createElement(
                "li",
                {
                  key: `given-${index}`,
                  className: "section-list-item" + (isLastAddedGiven ? " yellow" : ""),
                  style: { animation: index === showGivenCount - 1 ? "fadeInUp 0.3s ease-out" : "none" }
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
        React.createElement("div", { className: "section-border tofind-border" }),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement("h4", { className: "section-title tofind-title" }, comprehendData.toFind.title),
          React.createElement(
            "ul",
            { className: "section-list" },
            toFindData.slice(0, toFindCount).map((item, index) => {
              const isLastAddedToFind = index === toFindCount - 1;
              return React.createElement(
                "li",
                {
                  key: `tofind-${index}`,
                  className: "section-list-item tofind-item" + (isLastAddedToFind ? " yellow" : ""),
                  style: { animation: index === toFindCount - 1 ? "fadeInUp 0.3s ease-out" : "none" }
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
