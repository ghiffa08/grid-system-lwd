// Navigation Tabs
document.querySelectorAll("#main-nav button").forEach((button) => {
  button.addEventListener("click", function () {
    // Hide all sections
    document.querySelectorAll("main section").forEach((section) => {
      section.classList.add("hidden");
    });

    // Remove active class from all tabs
    document.querySelectorAll("#main-nav button").forEach((tab) => {
      tab.classList.remove("tab-active");
    });

    // Show selected section
    const targetId = this.getAttribute("data-target");
    document.getElementById(targetId).classList.remove("hidden");

    // Set active class to clicked tab
    this.classList.add("tab-active");
  });
});

// Interaktif Builder
let selectedItem = null;

// Function to update preview grid
function updateGridPreview() {
  const columns = parseInt(document.getElementById("colCount").textContent);
  const rows = parseInt(document.getElementById("rowCount").textContent);
  const gap = document.getElementById("gapSize").value;

  const gridPreview = document.getElementById("gridPreview");
  gridPreview.innerHTML = "";

  // Set column layout
  let columnTemplate;
  const columnLayout = document.getElementById("columnLayout").value;

  if (columnLayout === "custom") {
    columnTemplate =
      document.getElementById("customColumns").value ||
      `repeat(${columns}, 1fr)`;
  } else {
    switch (columnLayout) {
      case "leftWide":
        columnTemplate =
          columns >= 3
            ? "2fr 1fr" + " 1fr".repeat(columns - 2)
            : `repeat(${columns}, 1fr)`;
        break;
      case "rightWide":
        columnTemplate =
          columns >= 3
            ? "1fr".repeat(columns - 2) + " 1fr 2fr"
            : `repeat(${columns}, 1fr)`;
        break;
      case "centerWide":
        if (columns >= 3) {
          const midpoint = Math.floor(columns / 2);
          columnTemplate =
            "1fr".repeat(midpoint) +
            " 2fr " +
            "1fr".repeat(columns - midpoint - 1);
        } else {
          columnTemplate = `repeat(${columns}, 1fr)`;
        }
        break;
      default: // equal
        columnTemplate = `repeat(${columns}, 1fr)`;
    }
  }

  // Set grid properties
  gridPreview.style.gridTemplateColumns = columnTemplate;
  gridPreview.style.gridTemplateRows = `repeat(${rows}, auto)`;
  gridPreview.style.gap = `${gap}px`;

  // Create grid items
  const totalItems = columns * rows;
  for (let i = 1; i <= totalItems; i++) {
    const item = document.createElement("div");
    item.className = "grid-item";
    item.textContent = i;
    item.dataset.id = i;

    item.addEventListener("click", function () {
      selectItem(this);
    });

    gridPreview.appendChild(item);
  }

  // Update CSS output
  updateCSSOutput();
}

// Function to select grid item
function selectItem(item) {
  // Remove selection from previously selected item
  if (selectedItem) {
    selectedItem.style.border = "";
  }

  // Mark new item as selected
  selectedItem = item;
  selectedItem.style.border = "2px solid #333";

  // Get current span values
  const computedStyle = window.getComputedStyle(selectedItem);
  const gridColumn = computedStyle.getPropertyValue("grid-column");
  const gridRow = computedStyle.getPropertyValue("grid-row");

  let colSpan = 1;
  let rowSpan = 1;

  // Parse current span values if they exist
  if (gridColumn.includes("span")) {
    colSpan = parseInt(gridColumn.split("span ")[1]) || 1;
  }

  if (gridRow.includes("span")) {
    rowSpan = parseInt(gridRow.split("span ")[1]) || 1;
  }

  // Update span controls
  document.getElementById("selectedItemId").textContent =
    selectedItem.dataset.id;
  document.getElementById("colSpanCount").textContent = colSpan;
  document.getElementById("rowSpanCount").textContent = rowSpan;

  // Show item controls
  document.getElementById("itemControls").classList.remove("hidden");
}

// Function to update item span
function updateItemSpan() {
  if (!selectedItem) return;

  const colSpan = parseInt(document.getElementById("colSpanCount").textContent);
  const rowSpan = parseInt(document.getElementById("rowSpanCount").textContent);

  selectedItem.style.gridColumn = colSpan > 1 ? `span ${colSpan}` : "";
  selectedItem.style.gridRow = rowSpan > 1 ? `span ${rowSpan}` : "";

  updateCSSOutput();
}

// Function to update CSS output
function updateCSSOutput() {
  const columns = parseInt(document.getElementById("colCount").textContent);
  const rows = parseInt(document.getElementById("rowCount").textContent);
  const gap = document.getElementById("gapSize").value;

  const columnLayout = document.getElementById("columnLayout").value;
  let columnTemplate;

  if (columnLayout === "custom") {
    columnTemplate =
      document.getElementById("customColumns").value ||
      `repeat(${columns}, 1fr)`;
  } else {
    switch (columnLayout) {
      case "leftWide":
        columnTemplate =
          columns >= 3
            ? "2fr 1fr" + " 1fr".repeat(columns - 2)
            : `repeat(${columns}, 1fr)`;
        break;
      case "rightWide":
        columnTemplate =
          columns >= 3
            ? "1fr".repeat(columns - 2) + " 1fr 2fr"
            : `repeat(${columns}, 1fr)`;
        break;
      case "centerWide":
        if (columns >= 3) {
          const midpoint = Math.floor(columns / 2);
          columnTemplate =
            "1fr".repeat(midpoint) +
            " 2fr " +
            "1fr".repeat(columns - midpoint - 1);
        } else {
          columnTemplate = `repeat(${columns}, 1fr)`;
        }
        break;
      default: // equal
        columnTemplate = `repeat(${columns}, 1fr)`;
    }
  }

  let cssCode = `.grid-container {
  display: grid;
  grid-template-columns: ${columnTemplate};
  grid-template-rows: repeat(${rows}, auto);
  gap: ${gap}px;
  padding: 20px;
}

.grid-item {
  background-color: #5DBCD2;
  color: white;
  padding: 20px;
  text-align: center;
}\n`;

  // Add CSS for items with spans
  const gridItems = document.querySelectorAll("#gridPreview .grid-item");
  gridItems.forEach((item) => {
    const computedStyle = window.getComputedStyle(item);
    const gridColumn = computedStyle.getPropertyValue("grid-column");
    const gridRow = computedStyle.getPropertyValue("grid-row");

    if (gridColumn !== "auto / auto" || gridRow !== "auto / auto") {
      cssCode += `
.grid-item:nth-child(${item.dataset.id}) {`;

      if (gridColumn !== "auto / auto") {
        cssCode += `
  grid-column: ${gridColumn};`;
      }

      if (gridRow !== "auto / auto") {
        cssCode += `
  grid-row: ${gridRow};`;
      }

      cssCode += `
}\n`;
    }
  });

  document.getElementById("cssOutput").textContent = cssCode;
}

// Event listeners for controls
document.addEventListener("DOMContentLoaded", function () {
  // Initialize interactive builder
  updateGridPreview();

  // Column count controls
  document.getElementById("colIncrease").addEventListener("click", function () {
    const colCount = document.getElementById("colCount");
    const currentCount = parseInt(colCount.textContent);
    colCount.textContent = Math.min(currentCount + 1, 12);
    updateGridPreview();
  });

  document.getElementById("colDecrease").addEventListener("click", function () {
    const colCount = document.getElementById("colCount");
    const currentCount = parseInt(colCount.textContent);
    colCount.textContent = Math.max(currentCount - 1, 1);
    updateGridPreview();
  });

  // Row count controls
  document.getElementById("rowIncrease").addEventListener("click", function () {
    const rowCount = document.getElementById("rowCount");
    const currentCount = parseInt(rowCount.textContent);
    rowCount.textContent = Math.min(currentCount + 1, 8);
    updateGridPreview();
  });

  document.getElementById("rowDecrease").addEventListener("click", function () {
    const rowCount = document.getElementById("rowCount");
    const currentCount = parseInt(rowCount.textContent);
    rowCount.textContent = Math.max(currentCount - 1, 1);
    updateGridPreview();
  });

  // Gap size slider
  document.getElementById("gapSize").addEventListener("input", function () {
    updateGridPreview();
  });

  // Column layout selector
  document
    .getElementById("columnLayout")
    .addEventListener("change", function () {
      if (this.value === "custom") {
        document
          .getElementById("customColumnsContainer")
          .classList.remove("hidden");
      } else {
        document
          .getElementById("customColumnsContainer")
          .classList.add("hidden");
      }
      updateGridPreview();
    });

  // Custom columns input
  document
    .getElementById("customColumns")
    .addEventListener("input", function () {
      updateGridPreview();
    });

  // Item span controls
  document
    .getElementById("colSpanIncrease")
    .addEventListener("click", function () {
      const colSpanCount = document.getElementById("colSpanCount");
      const maxCols = parseInt(document.getElementById("colCount").textContent);
      const currentSpan = parseInt(colSpanCount.textContent);
      colSpanCount.textContent = Math.min(currentSpan + 1, maxCols);
      updateItemSpan();
    });

  document
    .getElementById("colSpanDecrease")
    .addEventListener("click", function () {
      const colSpanCount = document.getElementById("colSpanCount");
      const currentSpan = parseInt(colSpanCount.textContent);
      colSpanCount.textContent = Math.max(currentSpan - 1, 1);
      updateItemSpan();
    });

  document
    .getElementById("rowSpanIncrease")
    .addEventListener("click", function () {
      const rowSpanCount = document.getElementById("rowSpanCount");
      const maxRows = parseInt(document.getElementById("rowCount").textContent);
      const currentSpan = parseInt(rowSpanCount.textContent);
      rowSpanCount.textContent = Math.min(currentSpan + 1, maxRows);
      updateItemSpan();
    });

  document
    .getElementById("rowSpanDecrease")
    .addEventListener("click", function () {
      const rowSpanCount = document.getElementById("rowSpanCount");
      const currentSpan = parseInt(rowSpanCount.textContent);
      rowSpanCount.textContent = Math.max(currentSpan - 1, 1);
      updateItemSpan();
    });

  // Copy CSS button
  document.getElementById("copyCSS").addEventListener("click", function () {
    const cssText = document.getElementById("cssOutput").textContent;
    navigator.clipboard.writeText(cssText).then(() => {
      this.textContent = "Copied!";
      setTimeout(() => {
        this.textContent = "Copy to Clipboard";
      }, 2000);
    });
  });

  // Challenge solution buttons
  document.querySelectorAll(".see-solution").forEach((btn) => {
    btn.addEventListener("click", function () {
      const solutionId = this.getAttribute("data-solution");
      const solutionBox = document.getElementById(`${solutionId}-solution`);

      if (solutionBox.classList.contains("hidden")) {
        solutionBox.classList.remove("hidden");
        this.textContent = "Sembunyikan Solusi";
      } else {
        solutionBox.classList.add("hidden");
        this.textContent = "Lihat Solusi";
      }
    });
  });

  // Initialize Ace Editor for Playground
  const htmlEditor = ace.edit("htmlEditor");
  htmlEditor.setTheme("ace/theme/tomorrow");
  htmlEditor.session.setMode("ace/mode/html");
  htmlEditor.setFontSize(14);

  const cssEditor = ace.edit("cssEditor");
  cssEditor.setTheme("ace/theme/tomorrow");
  cssEditor.session.setMode("ace/mode/css");
  cssEditor.setFontSize(14);

  // Initial code for editors
  htmlEditor.setValue(
    `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
    -1
  );

  cssEditor.setValue(
    `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.grid-item {
  background-color: #5DBCD2;
  color: white;
  padding: 20px;
  text-align: center;
}`,
    -1
  );

  // Run code button
  document.getElementById("runCode").addEventListener("click", function () {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();

    const resultFrame = document.getElementById("codeResult");
    resultFrame.innerHTML = `
          <style>${css}</style>
          ${html}
        `;
  });

  // Load template buttons
  document.querySelectorAll(".load-template").forEach((btn) => {
    btn.addEventListener("click", function () {
      const template = this.getAttribute("data-template");

      switch (template) {
        case "basic":
          htmlEditor.setValue(
            `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
            -1
          );

          cssEditor.setValue(
            `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.grid-item {
  background-color: #5DBCD2;
  color: white;
  padding: 20px;
  text-align: center;
}`,
            -1
          );
          break;

        case "responsive":
          htmlEditor.setValue(
            `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
            -1
          );

          cssEditor.setValue(
            `.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.grid-item {
  background-color: #5DBCD2;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Tablet */
@media (min-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
            -1
          );
          break;

        case "areas":
          htmlEditor.setValue(
            `<div class="grid-container">
  <header class="grid-item">Header</header>
  <nav class="grid-item">Navigation</nav>
  <main class="grid-item">Main Content</main>
  <aside class="grid-item">Sidebar</aside>
  <footer class="grid-item">Footer</footer>
</div>`,
            -1
          );

          cssEditor.setValue(
            `.grid-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "nav main"
    "sidebar main"
    "footer footer";
  gap: 10px;
  min-height: 400px;
}

.grid-item {
  background-color: #5DBCD2;
  color: white;
  padding: 20px;
  text-align: center;
}

header {
  grid-area: header;
}

nav {
  grid-area: nav;
}

main {
  grid-area: main;
}

aside {
  grid-area: sidebar;
}

footer {
  grid-area: footer;
}`,
            -1
          );
          break;
      }

      // Run the code
      document.getElementById("runCode").click();
    });
  });

  // Quiz functionality
  const quizQuestions = [
    {
      type: "multiple",
      question:
        "Properti CSS apa yang digunakan untuk mendefinisikan sebuah elemen sebagai grid container?",
      options: [
        "display: flex",
        "display: grid",
        "position: grid",
        "grid: enable",
      ],
      correctAnswer: 1,
    },
    {
      type: "fillBlank",
      question:
        'Untuk mendefinisikan jumlah dan ukuran kolom dalam grid, kita menggunakan properti: <input type="text" class="border rounded px-2 py-1 w-64">',
      correctAnswer: "grid-template-columns",
    },
    {
      type: "multiple",
      question: "Unit fr dalam CSS Grid digunakan untuk:",
      options: [
        "Frame rate animation",
        "Framing element borders",
        "Fractional unit - membagi ruang yang tersedia",
        "Fixed ratio untuk ukuran kolom",
      ],
      correctAnswer: 2,
    },
    {
      type: "matching",
      question: "Cocokan properti grid dengan fungsinya:",
      pairs: [
        {
          term: "grid-gap",
          definition: "Mengatur jarak antar grid item",
        },
        {
          term: "grid-column",
          definition: "Menentukan posisi item dalam kolom",
        },
        {
          term: "grid-template-areas",
          definition: "Mendefinisikan area dalam grid",
        },
        {
          term: "justify-items",
          definition: "Menyelaraskan item secara horizontal",
        },
      ],
    },
    {
      type: "multiple",
      question:
        "Untuk membuat item grid menempati 2 kolom, kita dapat menggunakan:",
      options: [
        "grid-column: span 2",
        "grid-width: 2",
        "column-span: 2",
        "column-width: double",
      ],
      correctAnswer: 0,
    },
  ];

  let currentQuestionIndex = 0;
  const userAnswers = [];

  // Function to render current question
  function renderQuestion() {
    const quizContainer = document.getElementById("quizContainer");
    const question = quizQuestions[currentQuestionIndex];

    quizContainer.innerHTML = "";
    const questionElement = document.createElement("div");
    questionElement.className = "quiz-question";

    // Question number and text
    questionElement.innerHTML = `<h3 class="font-bold mb-3">Soal ${
      currentQuestionIndex + 1
    } dari ${quizQuestions.length}</h3>
                                    <p class="mb-4">${question.question}</p>`;

    // Different question types
    switch (question.type) {
      case "multiple":
        const optionsHtml = question.options
          .map(
            (option, index) =>
              `<div class="option" data-index="${index}">${option}</div>`
          )
          .join("");

        questionElement.innerHTML += `<div class="options-container mt-3">${optionsHtml}</div>`;
        break;

      case "fillBlank":
        // Already included in the question text with input field
        break;

      case "matching":
        let matchingHtml = `<div class="matching-container grid grid-cols-2 gap-4 mt-3">`;

        // Shuffle definitions
        const shuffledDefinitions = [...question.pairs]
          .map((p) => p.definition)
          .sort(() => Math.random() - 0.5);

        // Create terms
        matchingHtml += `<div class="terms-column">`;
        question.pairs.forEach((pair, index) => {
          matchingHtml += `<div class="term p-2 border rounded mb-2" data-term="${pair.term}">${pair.term}</div>`;
        });
        matchingHtml += `</div>`;

        // Create definitions
        matchingHtml += `<div class="definitions-column">`;
        shuffledDefinitions.forEach((definition, index) => {
          matchingHtml += `<div class="definition p-2 border rounded mb-2" data-definition="${definition}">${definition}</div>`;
        });
        matchingHtml += `</div>`;

        matchingHtml += `</div>`;
        questionElement.innerHTML += matchingHtml;
        break;
    }

    quizContainer.appendChild(questionElement);

    // Attach event listeners based on question type
    if (question.type === "multiple") {
      document.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function () {
          document
            .querySelectorAll(".option")
            .forEach((opt) => opt.classList.remove("selected"));
          this.classList.add("selected");

          const selectedIndex = parseInt(this.getAttribute("data-index"));
          userAnswers[currentQuestionIndex] = selectedIndex;

          updateProgressBar();
        });
      });
    }

    if (question.type === "fillBlank") {
      document
        .querySelector(".quiz-question input")
        .addEventListener("input", function () {
          userAnswers[currentQuestionIndex] = this.value;
          updateProgressBar();
        });
    }

    if (question.type === "matching") {
      // Make terms draggable and definitions droppable
      let selectedTerm = null;

      document.querySelectorAll(".term").forEach((term) => {
        term.addEventListener("click", function () {
          if (selectedTerm) {
            selectedTerm.classList.remove("bg-pbk-blue", "text-white");
          }
          selectedTerm = this;
          this.classList.add("bg-pbk-blue", "text-white");
        });
      });

      document.querySelectorAll(".definition").forEach((definition) => {
        definition.addEventListener("click", function () {
          if (selectedTerm) {
            const termValue = selectedTerm.getAttribute("data-term");
            const definitionValue = this.getAttribute("data-definition");

            // Store the mapping
            if (!userAnswers[currentQuestionIndex]) {
              userAnswers[currentQuestionIndex] = {};
            }

            userAnswers[currentQuestionIndex][termValue] = definitionValue;

            // Visual indication of matching
            selectedTerm.classList.add("bg-gray-200");
            this.classList.add("bg-gray-200");

            // Reset selection
            selectedTerm.classList.remove("bg-pbk-blue", "text-white");
            selectedTerm = null;

            updateProgressBar();
          }
        });
      });
    }

    // If there's a previous answer, mark it
    if (userAnswers[currentQuestionIndex] !== undefined) {
      if (question.type === "multiple") {
        const selectedOption = document.querySelector(
          `.option[data-index="${userAnswers[currentQuestionIndex]}"]`
        );
        if (selectedOption) {
          selectedOption.classList.add("selected");
        }
      } else if (question.type === "fillBlank") {
        const input = document.querySelector(".quiz-question input");
        if (input) {
          input.value = userAnswers[currentQuestionIndex];
        }
      } else if (question.type === "matching") {
        // Restore previous matchings
        const matchings = userAnswers[currentQuestionIndex];
        if (matchings) {
          Object.keys(matchings).forEach((term) => {
            const termElement = document.querySelector(
              `.term[data-term="${term}"]`
            );
            const definitionElement = document.querySelector(
              `.definition[data-definition="${matchings[term]}"]`
            );

            if (termElement && definitionElement) {
              termElement.classList.add("bg-gray-200");
              definitionElement.classList.add("bg-gray-200");
            }
          });
        }
      }
    }
  }

  // Function to update progress bar
  function updateProgressBar() {
    const answeredCount = userAnswers.filter(
      (answer) => answer !== undefined
    ).length;
    const progressPercent = (answeredCount / quizQuestions.length) * 100;

    document.getElementById(
      "quizProgress"
    ).textContent = `${answeredCount}/${quizQuestions.length} Soal Terjawab`;
    document.getElementById(
      "quizProgressBar"
    ).style.width = `${progressPercent}%`;
  }

  // Function to check quiz answers
  function checkAnswers() {
    let score = 0;

    quizQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];

      if (question.type === "multiple") {
        if (userAnswer === question.correctAnswer) {
          score++;
        }
      } else if (question.type === "fillBlank") {
        // Case insensitive comparison and trim whitespace
        const normalizedUserAnswer = userAnswer?.trim().toLowerCase();
        const normalizedCorrectAnswer = question.correctAnswer.toLowerCase();

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
          score++;
        }
      } else if (question.type === "matching") {
        let allCorrect = true;

        if (userAnswer) {
          question.pairs.forEach((pair) => {
            if (
              !userAnswer[pair.term] ||
              userAnswer[pair.term] !== pair.definition
            ) {
              allCorrect = false;
            }
          });

          if (allCorrect) {
            score++;
          }
        } else {
          allCorrect = false;
        }
      }
    });

    return score;
  }

  // Next and previous button handlers
  document
    .getElementById("nextQuestion")
    .addEventListener("click", function () {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();

        // Enable/disable navigation buttons
        document.getElementById("prevQuestion").disabled = false;
        document
          .getElementById("prevQuestion")
          .classList.remove("opacity-50", "cursor-not-allowed");

        if (currentQuestionIndex === quizQuestions.length - 1) {
          this.textContent = "Selesai Quiz";
        }
      } else {
        // Show results
        const score = checkAnswers();

        document.getElementById("scoreValue").textContent = score;

        // Set score message
        let scoreMessage = "";
        if (score === quizQuestions.length) {
          scoreMessage = "Sempurna! Anda menguasai CSS Grid dengan baik.";
        } else if (score >= Math.floor(quizQuestions.length * 0.7)) {
          scoreMessage = "Bagus! Anda memahami konsep dasar CSS Grid.";
        } else {
          scoreMessage =
            "Terus berlatih! Mari pelajari kembali konsep CSS Grid.";
        }

        document.getElementById("scoreMessage").textContent = scoreMessage;

        // Hide quiz, show results
        document.getElementById("quizContainer").classList.add("hidden");
        document.getElementById("prevQuestion").classList.add("hidden");
        document.getElementById("nextQuestion").classList.add("hidden");
        document.getElementById("quizResults").classList.remove("hidden");
      }
    });

  document
    .getElementById("prevQuestion")
    .addEventListener("click", function () {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();

        // Enable/disable navigation buttons
        document.getElementById("nextQuestion").textContent = "Selanjutnya";

        if (currentQuestionIndex === 0) {
          this.disabled = true;
          this.classList.add("opacity-50", "cursor-not-allowed");
        }
      }
    });

  // Retake quiz button
  document.getElementById("retakeQuiz").addEventListener("click", function () {
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers.length = 0;

    // Reset navigation
    document.getElementById("prevQuestion").disabled = true;
    document
      .getElementById("prevQuestion")
      .classList.add("opacity-50", "cursor-not-allowed");
    document.getElementById("prevQuestion").classList.remove("hidden");

    document.getElementById("nextQuestion").textContent = "Selanjutnya";
    document.getElementById("nextQuestion").classList.remove("hidden");

    // Hide results, show quiz
    document.getElementById("quizResults").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");

    updateProgressBar();
    renderQuestion();
  });

  // Initialize first question
  renderQuestion();

  // Run initial code example
  document.getElementById("runCode").click();
});
