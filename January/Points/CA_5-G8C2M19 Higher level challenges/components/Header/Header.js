// components/Header/Header.js
const Header = ({
  question,
  tabs,
  activeTab,
  onTabClick,
  maxStep,
  subStep,
  step,
  stageType,
  stageData,
}) => {
  const h = React.createElement;

  let processedQuestion = question;

  // Apply dynamic highlighting based on current stage highlights
  if (stageData) {
    if (stageData.highlights && Array.isArray(stageData.highlights)) {
      // Comprehend stage - highlights is an array
      stageData.highlights.forEach(({ text, color }) => {
        const highlightClass = `highlight-${color}`;
        // Use case-insensitive replacement with word boundaries to avoid partial matches
        const regex = new RegExp(
          `(${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi"
        );
        processedQuestion = processedQuestion.replace(
          regex,
          `<span class='${highlightClass}'>$1</span>`
        );
      });
    } else if (stageData.highlight && typeof stageData.highlight === "object") {
      // Connect or Compute stage - highlight is a single object
      const { text, color } = stageData.highlight;
      const highlightClass = `highlight-${color}`;
      // Use case-insensitive replacement with word boundaries to avoid partial matches
      const regex = new RegExp(
        `(${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      processedQuestion = processedQuestion.replace(
        regex,
        `<span class='${highlightClass}'>$1</span>`
      );
    }
  }

  return h(
    "div",
    { className: "header" },
    h(
      "div",
      { className: "question-container" },
      h("p", {
        className: "question-text",
        dangerouslySetInnerHTML: { __html: processedQuestion },
      })
    ),
    h(
      "div",
      { className: "header-tabs" },
      ...tabs.map((tab, index) =>
        h(
          "div",
          {
            key: index,
            className: `header-tab ${index === activeTab ? "active" : ""} ${
              index > maxStep ? "disabled" : ""
            }`,
            onClick: () => onTabClick(index),
          },
          tab
        )
      )
    )
  );
};
