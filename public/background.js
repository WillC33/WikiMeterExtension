// background.js

// Define a function to fetch visited article count
function fetchVisitedCount(callback) {
    if (typeof browser !== "undefined") {
        // Firefox or other WebExtensions browser
        browser.history.search({ text: "wikipedia.org/wiki/" }, (historyItems) => {
            const visitedCount = historyItems.length;
            callback(visitedCount);
        });
    } else if (typeof chrome !== "undefined") {
        // Chrome or Chromium-based browser
        chrome.history.search({ text: "wikipedia.org/wiki/" }, (historyItems) => {
            const visitedCount = historyItems.length;
            callback(visitedCount);
        });
    } else {
        console.error("Unsupported Browser")
        callback(0);
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_VISITED_COUNT") {
        fetchVisitedCount((count) => {
            sendResponse({ count: count });
        });
        return true; // Indicate that the response will be sent asynchronously
    }
});
