<script>
    import Loader from './Loader.svelte';

    let visitedArticlesCount = null;
    let wikipediaArticleCount = null;
    let percentage = null;

    async function fetchVisitedArticlesCount() {
        try {
            const response = await new Promise((resolve, reject) => {
                if (typeof browser !== "undefined") {
                    // Firefox or other WebExtensions browser
                    browser.runtime.sendMessage({ type: "GET_VISITED_COUNT" }, (response) => {
                        resolve(response);
                    });
                } else if (typeof chrome !== "undefined") {
                    // Chrome or Chromium-based browser
                    chrome.runtime.sendMessage({ type: "GET_VISITED_COUNT" }, (response) => {
                        resolve(response);
                    });
                } else {
                    console.error("Unsupported Browser")
                    resolve({ count: 0 });
                }
            });

            visitedArticlesCount = response?.count ?? 0;
        } catch (error) {
            console.error("Error fetching visited articles count:", error);
            visitedArticlesCount = 0;
        }
    }

    async function fetchWikipediaData() {
        try {
            const response = await fetch("https://wikimeterapi.azurewebsites.net/api/wikipedia"); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error("Failed to fetch Wikipedia data");
            }
            const data = await response.json();
            wikipediaArticleCount = data.query.statistics.articles;

            // Calculate the percentage
            percentage = (visitedArticlesCount / wikipediaArticleCount) * 100;
        } catch (error) {
            console.error("Error fetching Wikipedia data:", error);
            wikipediaArticleCount = 0;
            percentage = 0;
        }
    }

    async function loadData() {
        await fetchWikipediaData();
    }

    //on mount
    fetchVisitedArticlesCount();
    loadData();
</script>

<style>
    /* Styling for the popup container */
    .popup-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 300px;
        padding: 20px;
        background: linear-gradient(135deg, #a8e6cf, #dcedc1); /* Pastel gradient */
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        color: #333; /* Text color */
    }

    /* Styling for the title */
    .title {
        font-size: 28px;
        margin-bottom: 10px;
        font-family: 'Segoe UI', sans-serif; /* Use your preferred font */
    }

    /* Styling for the logo */
    .logo {
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
    }

    /* Styling for the text content */
    .content {
        font-size: 18px;
    }
</style>

<div class="popup-container">
    <img src="/icon512.png" alt="Logo" class="logo">
    <h1 class="title">WikiMeter</h1>
    {#if visitedArticlesCount !== null && wikipediaArticleCount !== null}
        {#if wikipediaArticleCount > 0}
            <p class="content">You've visited {visitedArticlesCount} out of {wikipediaArticleCount} Wikipedia articles.</p>
            <p class="content">This is approximately {percentage.toFixed(6)}% of all articles.</p>
        {:else}
            <p class="content">No Wikipedia article count available.</p>
        {/if}
    {:else}
        <Loader />
    {/if}
</div>
