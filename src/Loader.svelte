<script>
    const dots = Array.from({ length: 8 }, (_, index) => index);
</script>

<style>
    .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #333;
        margin: 0 4px;
        animation: scale 1s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
    }

    @keyframes scale {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
    }
</style>

<div class="loader">
    {#each dots as dot (dot)}
        <div class="dot" style="transform: rotate({(dot / dots.length) * 360}deg) translateY(-40px)"></div>
    {/each}
</div>
