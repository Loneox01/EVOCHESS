let currentGameModule = null;

export async function loadGame(mode) {
    document.getElementById('wrapper').style.display = 'block';

    // Clear canvas before loading new game
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Remove all click listeners
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);

    // Hide any lingering menus
    document.getElementById("promotionMenu").style.display = "none";
    document.getElementById("gameOverOverlay").style.display = "none";

    // Load new module with cache-busting
    const modulePath = `./${mode}.js?t=${Date.now()}`;

    try {
        const module = await import(modulePath);
        currentGameModule = module.startGame();
    } catch (err) {
        console.error("Error loading module:", err);
    }
}
// Make loadGame globally available
window.loadGame = loadGame;
