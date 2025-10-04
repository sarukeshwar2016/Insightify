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
            <h3>Mode</h3>
            <select id="dr-mode">
                <option value="literary">Literary Mode</option>
                <option value="article">Article Mode</option>
            </select>
        </div>
        <div class="dr-section">
            <h3>🔍 Literary Lens</h3>
            <p id="dr-meaning">Select some text to analyze...</p>
        </div>
        <div class="dr-section">
            <h3>🌌 Symbolic Insights</h3>
            <p id="dr-metaphor">---</p>
        </div>
        <div class="dr-section">
            <h3>🖤 Thematic Depth</h3>
            <p id="dr-theme">---</p>
        </div>
    `;

    document.body.appendChild(sidebar);

    const closeBtn = document.getElementById("dr-close");
    closeBtn.addEventListener("click", () => {
        sidebar.remove();
    });

    // Change headings dynamically when mode changes
    document.getElementById("dr-mode").addEventListener("change", () => {
        const mode = document.getElementById("dr-mode").value;
        document.querySelector("#dr-meaning").previousElementSibling.innerText =
            mode === "literary" ? "🔍 Literary Lens" : "📝 Article Summary";
        document.querySelector("#dr-metaphor").previousElementSibling.innerText =
            mode === "literary" ? "🌌 Symbolic Insights" : "💡 Key Ideas";
        document.querySelector("#dr-theme").previousElementSibling.innerText =
            mode === "literary" ? "🖤 Thematic Depth" : "📌 Main Themes";
    });
}

// -------------------------------
// Analyze selected text
// -------------------------------
async function analyzeText(selectedText) {
    const mode = document.getElementById("dr-mode").value;
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
            body: JSON.stringify({ text: selectedText, mode })
        });

        const data = await response.json();
        const analyzed = data.analyzed || "";

        // Split analysis into 3 sections
        const meaningMatch = analyzed.match(/1\. Simplified Meaning:\s*([\s\S]*?)2\./);
        const metaphorsMatch = analyzed.match(/2\. Metaphors(?:\/Symbols)?:\s*([\s\S]*?)3\./);
        const themeMatch = analyzed.match(/3\. Philosophical Themes:\s*([\s\S]*)/);

        if (mode === "literary") {
            meaningEl.innerText = meaningMatch ? meaningMatch[1].trim() : selectedText.slice(0, 100);
            metaphorEl.innerText = metaphorsMatch ? metaphorsMatch[1].trim() : "---";
            themeEl.innerText = themeMatch ? themeMatch[1].trim() : "---";
        } else if (mode === "article") {
            meaningEl.innerText = meaningMatch ? meaningMatch[1].trim() : selectedText.slice(0, 100);
            metaphorEl.innerText = metaphorsMatch ? metaphorsMatch[1].trim() : "---";
            themeEl.innerText = themeMatch ? themeMatch[1].trim() : "---";
        }

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

