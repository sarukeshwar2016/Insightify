document.getElementById("openSidebar").addEventListener("click", () => {
    const mode = document.getElementById("modeSelect").value;

    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (selectedMode) => {
                if (!document.getElementById("deepreader-sidebar")) {
                    const sidebar = document.createElement("div");
                    sidebar.id = "deepreader-sidebar";

                    sidebar.innerHTML = `
                        <div class="dr-header">
                            <h2>📖 DeepReader</h2>
                            <button id="dr-close">✖</button>
                        </div>
                        <div class="dr-section">
                            <h3>Mode: ${selectedMode === "literary" ? "Literary Mode" : "Article Mode"}</h3>
                        </div>
                        <div class="dr-section">
                            <h3>🔍 ${selectedMode === "literary" ? "Literary Lens" : "Article Summary"}</h3>
                            <p id="dr-meaning">Select some text to analyze...</p>
                        </div>
                        <div class="dr-section">
                            <h3>🌌 ${selectedMode === "literary" ? "Symbolic Insights" : "Key Ideas"}</h3>
                            <p id="dr-metaphor">---</p>
                        </div>
                        <div class="dr-section">
                            <h3>🖤 ${selectedMode === "literary" ? "Thematic Depth" : "Main Themes"}</h3>
                            <p id="dr-theme">---</p>
                        </div>
                    `;
                    document.body.appendChild(sidebar);

                    document.getElementById("dr-close").addEventListener("click", () => {
                        sidebar.remove();
                    });

                    // Listen for text selection
                    document.addEventListener("mouseup", () => {
                        const selectedText = window.getSelection().toString().trim();
                        if (selectedText.length > 5) {
                            const meaningEl = document.getElementById("dr-meaning");
                            const metaphorEl = document.getElementById("dr-metaphor");
                            const themeEl = document.getElementById("dr-theme");

                            meaningEl.innerText = `Analyzing ${selectedMode === "literary" ? "Literary" : "Article"} text...`;
                            metaphorEl.innerText = "Analyzing...";
                            themeEl.innerText = "Analyzing...";

                            // Mock analysis
                            setTimeout(() => {
                                meaningEl.innerText = selectedText.slice(0, 200);
                                metaphorEl.innerText = "[Insights here]";
                                themeEl.innerText = "[Themes here]";
                            }, 800);
                        }
                    });
                }
            },
            args: [mode]
        });

        // Close the popup immediately after injecting the sidebar
        window.close();
    });
});
