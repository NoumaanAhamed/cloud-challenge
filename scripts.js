// Navbar functionality
function initializeNavbar() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navItems = document.querySelectorAll(".nav-item");

  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Handle nav item clicks
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      navItems.forEach((i) => i.classList.remove("active"));
      // Add active class to clicked item
      item.classList.add("active");
      // Close mobile menu
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// Toggle week content
function toggleWeek(header) {
  const content = header.nextElementSibling;
  const isExpanding = !content.classList.contains("active");

  // Close other weeks
  document.querySelectorAll(".week-content.active").forEach((activeContent) => {
    if (activeContent !== content) {
      activeContent.classList.remove("active");
    }
  });

  content.classList.toggle("active");

  if (isExpanding) {
    requestAnimationFrame(() => {
      header.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

// Initialize note sections
function initializeNotes() {
  const listItems = document.querySelectorAll("li");

  listItems.forEach((item) => {
    const oldInput = item.querySelector(".note-input");
    const noteId = oldInput.getAttribute("data-note-id");

    // Create toggle button with icon
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "note-toggle";
    toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // Create note editor
    const noteEditor = document.createElement("div");
    noteEditor.className = "note-editor";

    const textarea = document.createElement("textarea");
    textarea.className = "note-textarea";
    textarea.placeholder = "Write your notes here...";
    textarea.value = localStorage.getItem(noteId) || "";

    // Handle note toggle
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasExpanded = noteEditor.classList.contains("expanded");

      // Close all other open notes
      document.querySelectorAll(".note-editor.expanded").forEach((editor) => {
        if (editor !== noteEditor) {
          editor.classList.remove("expanded");
        }
      });

      noteEditor.classList.toggle("expanded");
      if (!wasExpanded) {
        textarea.focus();
      }
    });

    // Close note when clicking outside
    document.addEventListener("click", (e) => {
      if (!noteEditor.contains(e.target) && !toggleBtn.contains(e.target)) {
        noteEditor.classList.remove("expanded");
      }
    });

    // Save notes
    textarea.addEventListener("input", () => {
      localStorage.setItem(noteId, textarea.value);
    });

    noteEditor.appendChild(textarea);
    item.appendChild(noteEditor);
    oldInput.parentNode.replaceChild(toggleBtn, oldInput);
  });
}

function updateProgress() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const totalTasks = checkboxes.length;
  const completedTasks = Array.from(checkboxes).filter(
    (cb) => cb.checked
  ).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = `${progressPercentage}%`;

  const progressText = document.querySelector(".progress-text");
  progressText.textContent = `Progress: ${Math.round(progressPercentage)}%`;
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const id = checkbox.getAttribute("data-id");
    checkbox.checked = localStorage.getItem(id) === "true";
    checkbox.addEventListener("change", () => {
      localStorage.setItem(id, checkbox.checked);
      updateProgress();
    });
  });

  initializeNotes();

  const weeks = document.querySelectorAll(".week");
  weeks.forEach((week, index) => {
    week.style.opacity = "0";
    week.style.transform = "translateY(20px)";
    setTimeout(() => {
      week.style.opacity = "1";
      week.style.transform = "translateY(0)";
    }, index * 100);
  });

  updateProgress();
});
