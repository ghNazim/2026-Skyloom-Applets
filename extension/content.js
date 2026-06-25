(function () {
  function addFeedbackButton() {
    // Avoid duplicate buttons
    if (document.getElementById("cr-feedback-btn")) {
      return;
    }

    const h1s = document.querySelectorAll("h1");

    const targetH1 = [...h1s].find(el =>
      el.textContent.trim().startsWith("Applet Code:")
    );

    if (!targetH1) {
      return;
    }

    // Extract applet id from URL
    const match = window.location.pathname.match(
      /\/developer\/tasks\/([^/]+)/
    );

    if (!match) {
      return;
    }

    const appletId = match[1];

    const button = document.createElement("button");
    button.id = "cr-feedback-btn";
    button.textContent = "Feedback";

    button.style.marginLeft = "12px";
    button.style.padding = "6px 12px";
    button.style.background = "#1976d2";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";

    button.addEventListener("click", () => {
      window.open(
        `https://content.classrootsedu.com/developer/applets/${appletId}/feedback`,
        "_blank"
      );
    });

    targetH1.insertAdjacentElement("afterend", button);
  }

  // React/MUI pages often render after load
  const observer = new MutationObserver(() => {
    addFeedbackButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  addFeedbackButton();
})();