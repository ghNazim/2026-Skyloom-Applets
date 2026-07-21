(function () {
  function addFeedbackButton() {
    // Avoid duplicate buttons
    if (document.getElementById("cr-feedback-btn")) {
      return;
    }

    // Extract applet ID from URL
    const match = window.location.pathname.match(/\/developer\/tasks\/([^/]+)/);

    if (!match) {
      return;
    }

    const appletId = match[1];

    // Find the "Applet Code:" heading
    const heading = [...document.querySelectorAll("h1")].find(
      (el) =>
        el.classList.contains("MuiTypography-root") &&
        el.textContent.trim().startsWith("Applet Code:"),
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
        "_blank",
      );
    });

    // Display heading and button in one row
    heading.style.display = "flex";
    heading.style.alignItems = "center";
    heading.style.gap = "12px";

    heading.appendChild(button);
    addUploaderBadge(appletId, heading);
  }

  function addAppletButton() {
    // Avoid duplicate buttons
    if (document.getElementById("cr-applet-btn")) {
      return;
    }

    // Extract applet ID from URL
    const match = window.location.pathname.match(
      /\/developer\/applets\/([^/]+)\/feedback/,
    );

    if (!match) {
      return;
    }

    const appletId = match[1];

    // Find the "Feedback" heading
    const heading = [...document.querySelectorAll("h1")].find(
      (el) =>
        el.classList.contains("MuiTypography-h4") &&
        el.textContent.trim() === "Feedback",
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
        "_blank",
      );
    });

    // Display heading and button in one row
    heading.style.display = "flex";
    heading.style.alignItems = "center";
    heading.style.gap = "12px";

    heading.appendChild(button);
  }

  async function addUploaderBadge(appletId, heading) {
    if (document.getElementById("cr-uploader-badge")) return;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `/developer/tasks/${appletId}/versions`;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      const maxWait = 10000; // 10 seconds
      const start = Date.now();

      const observer = new MutationObserver(() => {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Search every element for "By:"
        const elements = [...doc.querySelectorAll("*")];

        const byElement = elements.find((el) => {
          const text = el.textContent.trim();
          return text.startsWith("By:");
        });

        if (!byElement) {
          // Give up after 10 seconds
          if (Date.now() - start > maxWait) {
            observer.disconnect();
            iframe.remove();
          }
          return;
        }

        observer.disconnect();

        const uploader = byElement.textContent.replace(/^By:\s*/, "").trim();

        const badge = document.createElement("span");
        badge.id = "cr-uploader-badge";
        badge.textContent = uploader;

        Object.assign(badge.style, {
          marginLeft: "10px",
          padding: "4px 10px",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "600",
          background:
            uploader.trim().toLowerCase() === "skyloom interactives"
              ? "#2e7d32"
              : "#d32f2f",
        });

        heading.appendChild(badge);

        iframe.remove();
      });

      observer.observe(iframe.contentDocument.body, {
        childList: true,
        subtree: true,
      });

      // Run once immediately in case it's already rendered
      observer.takeRecords();
    };
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
    subtree: true,
  });

  updateButtons();
})();
