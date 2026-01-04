/* =========================================================
   IMC11203 CRISP-DM Site JS (vanilla)
   - Mobile nav toggle
   - Active nav highlighting
   - Breadcrumb hints (static per page via data-page)
   - Demo Mode: toggles callouts for a guided walkthrough
   - Visuals page: highlight flow nodes
   ========================================================= */

(function () {
  const body = document.body;
  const page = body.getAttribute("data-page");

  // ---- Set year in footer
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle
  const toggleBtn = document.querySelector("[data-nav-toggle]");
  const navList = document.querySelector("#navList");
  if (toggleBtn && navList) {
    toggleBtn.addEventListener("click", () => {
      const open = navList.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(open));
    });

    // Close menu when clicking a link (mobile)
    navList.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") {
        navList.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---- Active nav highlighting
  const activeLink = document.querySelector(`[data-nav="${page}"]`);
  if (activeLink) activeLink.classList.add("is-active");

  // ---- Demo Mode (persistent during session)
  const demoBtn = document.querySelector("[data-demo-toggle]");
  const demoLabel = document.querySelector("[data-demo-label]");

  const DEMO_KEY = "imc11203_demo_mode";
  const stored = sessionStorage.getItem(DEMO_KEY);
  if (stored === "on") enableDemoMode(true);

  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      const isOn = body.classList.toggle("demo-mode");
      sessionStorage.setItem(DEMO_KEY, isOn ? "on" : "off");
      updateDemoLabel(isOn);
    });
  }

  function enableDemoMode(on) {
    if (on) body.classList.add("demo-mode");
    updateDemoLabel(on);
  }

  function updateDemoLabel(on) {
    if (demoLabel) demoLabel.textContent = on ? "On" : "Off";
  }

  // ---- Visuals page: flowchart highlight buttons
  const flowchart = document.querySelector("[data-flowchart]");
  if (flowchart) {
    const nodes = Array.from(flowchart.querySelectorAll(".flow-node"));
    const buttons = Array.from(document.querySelectorAll("[data-highlight]"));

    function clearHighlight() {
      nodes.forEach((n) => n.classList.remove("is-highlight"));
    }

    function highlight(phaseCode) {
      clearHighlight();
      if (phaseCode === "all") return;
      const match = nodes.find((n) => n.getAttribute("data-phase") === phaseCode);
      if (match) match.classList.add("is-highlight");
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-highlight");
        highlight(code);
      });
    });

    // Optional: highlight clicked node
    nodes.forEach((n) => {
      n.addEventListener("click", () => {
        clearHighlight();
        n.classList.add("is-highlight");
      });
    });
  }

  // ---- Small accessibility enhancement: ESC closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navList && navList.classList.contains("is-open")) {
      navList.classList.remove("is-open");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      if (toggleBtn) toggleBtn.focus();
    }
  });
})();
