(function () {
function addFeedbackButton() {
  // Avoid duplicate buttons
  if (document.getElementById("cr-feedback-btn")) {
    return;
  }

  // Extract applet ID from URL
  const match = window.location.pathname.match(
    /\/developer\/tasks\/([^/]+)/
  );

  if (!match) {
    return;
  }

  const appletId = match[1];

  // Find the "Applet Code:" heading
  const heading = [...document.querySelectorAll("h1")].find(
    (el) =>
      el.classList.contains("MuiTypography-root") &&
      el.textContent.trim().startsWith("Applet Code:")
  );

  if (!heading) {
    return;
  }

  const button = document.createElement("button");
  button.id = "cr-feedback-btn";
  button.textContent = "Feedback";

  // Styling
  button.style.padding = "4px 10px";
  button.style.background = "#1976d2";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";
  button.style.fontSize = "13px";
  button.style.fontWeight = "600";

  button.addEventListener("click", () => {
    window.open(
      `https://content.classrootsedu.com/developer/applets/${appletId}/feedback`,
      "_blank"
    );
  });

  // Display heading and button in one row
  heading.style.display = "flex";
  heading.style.alignItems = "center";
  heading.style.gap = "12px";

  heading.appendChild(button);
}

function addAppletButton() {
  // Avoid duplicate buttons
  if (document.getElementById("cr-applet-btn")) {
    return;
  }

  // Extract applet ID from URL
  const match = window.location.pathname.match(
    /\/developer\/applets\/([^/]+)\/feedback/
  );

  if (!match) {
    return;
  }

  const appletId = match[1];

  // Find the "Feedback" heading
  const heading = [...document.querySelectorAll("h1")].find(
    (el) =>
      el.classList.contains("MuiTypography-h4") &&
      el.textContent.trim() === "Feedback"
  );

  if (!heading) {
    return;
  }

  const button = document.createElement("button");
  button.id = "cr-applet-btn";
  button.textContent = "Applet Page";

  // Styling
  button.style.padding = "4px 10px";
  button.style.background = "#2e7d32";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";
  button.style.fontSize = "13px";
  button.style.fontWeight = "600";

  button.addEventListener("click", () => {
    window.open(
      `https://content.classrootsedu.com/developer/tasks/${appletId}`,
      "_blank"
    );
  });

  // Display heading and button in one row
  heading.style.display = "flex";
  heading.style.alignItems = "center";
  heading.style.gap = "12px";

  heading.appendChild(button);
}

  function updateButtons() {
    const path = window.location.pathname;

    if (path.startsWith("/developer/tasks/")) {
      addFeedbackButton();
    } else if (/^\/developer\/applets\/[^/]+\/feedback$/.test(path)) {
      addAppletButton();
    }
  }

  // React/MUI pages often render after load
  const observer = new MutationObserver(() => {
    updateButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  updateButtons();
})();