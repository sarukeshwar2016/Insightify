// -------------------------------
// Create sidebar
// -------------------------------
function createSidebar() {
    if (document.getElementById("deepreader-sidebar")) return;

    const sidebar = document.createElement("div");
    sidebar.id = "deepreader-sidebar";

    sidebar.innerHTML = `
        <div class="dr-header">
            <h2>📖 DeepReader</h2>
            <button id="dr-close">✖</button>
        </div>
        <div class="dr-section">
            <h3>📝 Simplified Meaning</h3>
            <p id="dr-meaning">Select some text to analyze...</p>
        </div>
        <div class="dr-section">
            <h3>🌌 Metaphors</h3>
            <p id="dr-metaphor">---</p>
        </div>
        <div class="dr-section">
            <h3>🖤 Dark Theme</h3>
            <p id="dr-theme">---</p>
        </div>
    `;

    document.body.appendChild(sidebar);

    const closeBtn = document.getElementById("dr-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.remove();
        });
    }
}

// -------------------------------
// Analyze selected text (async)
// -------------------------------
async function analyzeText(selectedText) {
    const meaningEl = document.getElementById("dr-meaning");
    const metaphorEl = document.getElementById("dr-metaphor");
    const themeEl = document.getElementById("dr-theme");

    if (meaningEl) meaningEl.innerText = "Analyzing...";
    if (metaphorEl) metaphorEl.innerText = "Analyzing...";
    if (themeEl) themeEl.innerText = "Analyzing...";

    try {
        const response = await fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText })
        });

        const data = await response.json();

        const analyzed = data.analyzed || "";
        const error = data.error || "";

        // Regex for 3 sections
        const meaningMatch = analyzed.match(/1\. Simplified Meaning:\s*([\s\S]*?)2\./);
        const metaphorsMatch = analyzed.match(/2\. Metaphors(?:\/Symbols)?:\s*([\s\S]*?)3\./);
        const themeMatch = analyzed.match(/3\. Dark\/Philosophical Themes:\s*([\s\S]*)/);

        if (meaningEl) meaningEl.innerText = meaningMatch ? meaningMatch[1].trim() : "No data";
        if (metaphorEl) metaphorEl.innerText = metaphorsMatch ? metaphorsMatch[1].trim() : "---";
        if (themeEl) themeEl.innerText = themeMatch ? themeMatch[1].trim() : "---";

        if (error && meaningEl) meaningEl.innerText = "Error: " + error;

    } catch (err) {
        if (meaningEl) meaningEl.innerText = "Server error: " + err;
        if (metaphorEl) metaphorEl.innerText = "---";
        if (themeEl) themeEl.innerText = "---";
        console.error(err);
    }
}

// -------------------------------
// Listen for text selection
// -------------------------------
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 5) {
        createSidebar();
        analyzeText(selectedText);
    }
});
