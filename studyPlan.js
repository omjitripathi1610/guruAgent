const STORAGE_KEY = "chanakya-marg-study-plan";

const defaultState = {
  week: 2,

  days: [
    {
      day: "Monday",
      subject: "Operating Systems",
      topic: "Process Scheduling",
      minutes: 60,
      progress: 100,
      status: "Completed",
      type: "completed",
      tag: "AI"
    },
    {
      day: "Tuesday",
      subject: "DBMS",
      topic: "Normalization",
      minutes: 50,
      progress: 62,
      status: "In Progress",
      type: "progress",
      tag: ""
    },
    {
      day: "Wednesday",
      subject: "Java",
      topic: "OOP & Collections",
      minutes: 60,
      progress: 0,
      status: "Upcoming",
      type: "next",
      tag: "Reasoning"
    },
    {
      day: "Thursday",
      subject: "Operating Systems",
      topic: "Process Scheduling — Reinforcement",
      minutes: 75,
      progress: 70,
      status: "AI Adjusted",
      type: "ai-adjusted",
      tag: "AD"
    },
    {
      day: "Friday",
      subject: "Mock Test",
      topic: "OS + DBMS + Java",
      minutes: 90,
      progress: 0,
      status: "Upcoming",
      type: "next",
      tag: "Upcoming"
    }
  ],

  tasks: [
    {
      id: 1,
      title: "Revise FCFS and SJF scheduling",
      meta: "20 min • Operating Systems",
      completed: true
    },
    {
      id: 2,
      title: "Complete 10 DBMS normalization questions",
      meta: "25 min • DBMS",
      completed: true
    },
    {
      id: 3,
      title: "Practice Round Robin problems",
      meta: "25 min • OS reinforcement",
      completed: false
    },
    {
      id: 4,
      title: "Review OOP collection concepts",
      meta: "30 min • Java",
      completed: false
    }
  ],

  agent: {
    observed:
      "OS quiz accuracy dropped to 42%.",
    decision:
      "Increase reinforcement for Process Scheduling.",
    action:
      "Added 25 minutes of targeted practice before the next mock test.",
    review:
      "Thursday, 7:30 PM",
    strategy:
      "GuruAgent selected this strategy because repeated practice can reinforce the identified weak area."
  },

  adapted: false
};

let state = loadState();

/* =========================================================
   HELPERS
========================================================= */

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return {
        ...defaultState,
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.warn("Could not load saved state.", error);
  }

  return structuredClone(defaultState);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save state.", error);
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const existing = document.querySelector(".toast");

  if (existing) {
    existing.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = `
    <span class="toast-dot"></span>
    <span>${escapeHTML(message)}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 2200);
}

/* =========================================================
   RENDER TIMELINE
========================================================= */

function renderTimeline() {
  const timeline = document.getElementById("timeline");

  timeline.innerHTML = "";

  state.days.forEach((day, index) => {

    const card = document.createElement("article");

    card.className = `day-card ${day.type}`;

    card.innerHTML = `
      <div class="day-top">

        <span class="day-name">
          ${escapeHTML(day.day)}
        </span>

        <span class="day-status">
          ${day.type === "completed" ? "✓" : ""}
          ${day.type === "ai-adjusted" ? "✓" : ""}
        </span>

      </div>

      ${
        day.tag
          ? `<div class="card-tag">${escapeHTML(day.tag)}</div>`
          : ""
      }

      <div class="subject-label">
        ${escapeHTML(day.subject)}
      </div>

      <div class="subject-title">
        <strong>${escapeHTML(day.topic)}</strong>
      </div>

      <div class="card-progress">
        <span style="width:${day.progress}%"></span>
      </div>

      <div class="card-meta">
        <span>◷</span>
        <span>${day.minutes} min</span>
      </div>

      <div class="card-divider"></div>

      <div class="card-status">
        Status: ${escapeHTML(day.status)}
      </div>
    `;

    timeline.appendChild(card);

    setTimeout(() => {
      card.style.animationDelay = `${index * 60}ms`;
    }, 0);
  });
}

/* =========================================================
   SUMMARY
========================================================= */

function renderSummary() {

  const plannedMinutes = state.days.reduce(
    (total, day) => total + day.minutes,
    0
  );

  const completedMinutes = state.days.reduce((total, day) => {

    return (
      total +
      Math.round((day.minutes * day.progress) / 100)
    );

  }, 0);

  const progress =
    plannedMinutes === 0
      ? 0
      : Math.round((completedMinutes / plannedMinutes) * 100);

  document.getElementById("plannedHours").textContent =
    `${(plannedMinutes / 60).toFixed(1)} hrs`;

  document.getElementById("completedHours").textContent =
    `${(completedMinutes / 60).toFixed(1)} hrs`;

  document.getElementById("weeklyProgress").textContent =
    `${progress}%`;
}

/* =========================================================
   AGENT
========================================================= */

function renderAgent() {

  document.getElementById("decisionObserved").innerHTML =
    state.agent.observed;

  document.getElementById("decisionText").innerHTML =
    state.agent.decision;

  document.getElementById("decisionAction").innerHTML =
    state.agent.action;

  document.getElementById("decisionReview").innerHTML =
    state.agent.review;

  document.getElementById("strategyText").textContent =
    state.agent.strategy;
}

/* =========================================================
   TASKS
========================================================= */

function renderTasks() {

  const list = document.getElementById("taskList");

  list.innerHTML = "";

  state.tasks.forEach((task) => {

    const item = document.createElement("article");

    item.className =
      `task-item ${task.completed ? "completed" : ""}`;

    item.innerHTML = `
      <div class="task-main">

        <button
          class="task-check"
          data-task-id="${task.id}"
          aria-label="Toggle task"
        >
          ${task.completed ? "✓" : ""}
        </button>

        <div>
          <div class="task-title">
            ${escapeHTML(task.title)}
          </div>

          <div class="task-meta">
            ${escapeHTML(task.meta)}
          </div>
        </div>

      </div>
    `;

    list.appendChild(item);
  });

  const completedCount =
    state.tasks.filter(task => task.completed).length;

  document.getElementById("taskStatusText").textContent =
    `${completedCount} of ${state.tasks.length} tasks completed`;
}

/* =========================================================
   ADAPT PLAN
========================================================= */

function adaptPlan() {

  if (!state.adapted) {

    const thursday = state.days.find(
      day => day.day === "Thursday"
    );

    if (thursday) {
      thursday.minutes = 90;
      thursday.progress = 75;
      thursday.status = "AI Adjusted";
      thursday.type = "ai-adjusted";
      thursday.tag = "AD";
    }

    state.agent.observed =
      "Your Process Scheduling practice score is below the 60% confidence threshold.";

    state.agent.decision =
      "Increase targeted reinforcement and move the mock test after the reinforcement block.";

    state.agent.action =
      "Added 25 minutes of scheduling practice and moved the review checkpoint forward.";

    state.agent.review =
      "Thursday, 7:30 PM";

    state.agent.strategy =
      "Abhyāsa — repeated practice was selected because the weak area benefits from deliberate repetition.";

    state.adapted = true;

    showToast(
      "Plan adapted: extra Process Scheduling practice added."
    );

  } else {

    const thursday = state.days.find(
      day => day.day === "Thursday"
    );

    if (thursday) {
      thursday.minutes = 75;
      thursday.progress = 90;
      thursday.status = "AI Adjusted";
      thursday.type = "ai-adjusted";
      thursday.tag = "AD";
    }

    state.agent.observed =
      "Your recent reinforcement result improved significantly.";

    state.agent.decision =
      "Reduce repeated scheduling practice and shift time toward mixed mock preparation.";

    state.agent.action =
      "Reduced reinforcement by 15 minutes and returned the saved time to mock-test preparation.";

    state.agent.review =
      "Friday, 6:30 PM";

    state.agent.strategy =
      "Spaced practice — the plan is shifting from intense reinforcement toward distributed review.";

    state.adapted = false;

    showToast(
      "Plan rebalanced: reinforcement reduced."
    );
  }

  saveState();

  renderAll();
}

/* =========================================================
   MODAL
========================================================= */

function openModal() {
  const backdrop = document.getElementById("modalBackdrop");

  document.getElementById("modalObserved").textContent =
    state.agent.observed;

  document.getElementById("modalDecision").textContent =
    state.agent.decision;

  backdrop.classList.add("open");

  document.body.style.overflow = "hidden";
}

function closeModal() {
  document
    .getElementById("modalBackdrop")
    .classList.remove("open");

  document.body.style.overflow = "";
}

/* =========================================================
   WEEK
========================================================= */

function updateWeek() {

  const selectedWeek =
    document.getElementById("weekSelect").value;

  state.week = Number(selectedWeek);

  const messages = {
    1: "Foundation week — building core concepts.",
    2: "Adaptive reinforcement week — fixing weak areas.",
    3: "Application week — practicing with projects and tests.",
    4: "Revision week — consolidating everything before exam."
  };

  document.getElementById("pageNotice").querySelector("span")
    .textContent =
    messages[state.week];

  showToast(`Week ${state.week} loaded.`);

  saveState();
}

/* =========================================================
   NAVIGATION DEMO
========================================================= */

function setupNavigation() {

  document.querySelectorAll(".nav-item")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".nav-item")
          .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        const section =
          button.dataset.section;

        const labels = {
          dashboard: "Dashboard",
          study: "Study Plan",
          practice: "Practice",
          progress: "Progress",
          iks: "IKS Insights",
          profile: "Profile"
        };

        if (section !== "study") {

          showToast(
            `${labels[section]} preview selected — Study Plan remains the active demo.`
          );

        }

        closeSidebar();
      });
    });
}

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function openSidebar() {
  document
    .getElementById("sidebar")
    .classList.add("open");

  document
    .getElementById("mobileOverlay")
    .classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  document
    .getElementById("sidebar")
    .classList.remove("open");

  document
    .getElementById("mobileOverlay")
    .classList.remove("show");

  document.body.style.overflow = "";
}

/* =========================================================
   DATE
========================================================= */

function setupDate() {

  const now = new Date();

  const formatted = now.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric"
    }
  );

  document.getElementById("currentDate")
    .textContent = formatted;
}

/* =========================================================
   COUNTDOWN DEMO
========================================================= */

function setupCountdown() {

  let days = 15;

  document.getElementById("countdown")
    .textContent =
    `${days} Days Remaining`;
}

/* =========================================================
   WEEK NAVIGATION
========================================================= */

function moveWeek(direction) {

  const select =
    document.getElementById("weekSelect");

  let current =
    Number(select.value);

  current += direction;

  if (current < 1) current = 1;
  if (current > 4) current = 4;

  select.value = String(current);

  updateWeek();
}

/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  document
    .getElementById("adaptPlanBtn")
    .addEventListener("click", adaptPlan);

  document
    .getElementById("viewDecisionBtn")
    .addEventListener("click", openModal);

  document
    .getElementById("modalClose")
    .addEventListener("click", closeModal);

  document
    .getElementById("modalDoneBtn")
    .addEventListener("click", closeModal);

  document
    .getElementById("modalBackdrop")
    .addEventListener("click", (event) => {

      if (event.target.id === "modalBackdrop") {
        closeModal();
      }
    });

  document
    .getElementById("weekSelect")
    .addEventListener("change", updateWeek);

  document
    .getElementById("prevWeekBtn")
    .addEventListener("click", () => moveWeek(-1));

  document
    .getElementById("nextWeekBtn")
    .addEventListener("click", () => moveWeek(1));

  document
    .getElementById("viewProgressBtn")
    .addEventListener("click", () => {

      showToast(
        "Progress view: 66% weekly completion with OS as the current focus."
      );

    });

  document
    .getElementById("mobileMenuBtn")
    .addEventListener("click", openSidebar);

  document
    .getElementById("mobileOverlay")
    .addEventListener("click", closeSidebar);

  document
    .getElementById("taskList")
    .addEventListener("click", (event) => {

      const button =
        event.target.closest(".task-check");

      if (!button) return;

      const id =
        Number(button.dataset.taskId);

      const task =
        state.tasks.find(item => item.id === id);

      if (!task) return;

      task.completed = !task.completed;

      saveState();

      renderTasks();

      showToast(
        task.completed
          ? "Task completed."
          : "Task reopened."
      );
    });

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeModal();
      closeSidebar();
    }

  });
}

/* =========================================================
   RESET
========================================================= */

function setupResetShortcut() {

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "r"
      ) {

        event.preventDefault();

        localStorage.removeItem(STORAGE_KEY);

        location.reload();
      }

    }
  );
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

  renderTimeline();
  renderSummary();
  renderAgent();
  renderTasks();

  document.getElementById("weekSelect").value =
    String(state.week);
}

/* =========================================================
   TOAST CSS IN JS
========================================================= */

function injectToastStyles() {

  const style = document.createElement("style");

  style.textContent = `
    .toast {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 11px 14px;
      border-radius: 11px;
      background: #12182f;
      color: white;
      font-size: 11px;
      box-shadow: 0 18px 38px rgba(18,24,47,.22);
      animation: toastIn .22s ease;
    }

    .toast-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #59d99a;
    }

    .toast.hide {
      animation: toastOut .22s ease forwards;
    }

    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes toastOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(10px);
      }
    }
  `;

  document.head.appendChild(style);
}

/* =========================================================
   INIT
========================================================= */

function init() {

  setupDate();
  setupCountdown();
  setupNavigation();
  setupEvents();
  setupResetShortcut();
  injectToastStyles();

  renderAll();
}

init();