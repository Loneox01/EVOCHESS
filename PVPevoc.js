import { Knight } from '../Pieces/KnightFiles/Knight.js';
import { Bishop } from '../Pieces/BishopFiles/Bishop.js';
import { Rook } from '../Pieces/RookFiles/Rook.js';
import { Queen } from '../Pieces/QueenFiles/Queen.js';
import { King } from '../Pieces/KingFiles/King.js';
import { Pawn } from '../Pieces/PawnFiles/Pawn.js';
import { EvoPawn } from '../Pieces/PawnFiles/EvoPawn.js';
import { EvoKnight } from '../Pieces/KnightFiles/EvoKnight.js';
import { EvoBishop } from '../Pieces/BishopFiles/EvoBishop.js';
import { EvoRook } from '../Pieces/RookFiles/EvoRook.js';
import { EvoQueen } from '../Pieces/QueenFiles/EvoQueen.js';
import { EvoKing } from '../Pieces/KingFiles/EvoKing.js';



const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const tileLen = canvas.width / 8;

const LIGHT = '#f0d9b5'; // Light tileLens
const DARK = '#b58863'; // Dark tileLens

let evoSelectionMade = false;
let evo1 = null;
let evo2 = null;
let evo1Black = null;
let evo2Black = null;

let activePromotion = false; // True if promotion menu is present
let turn = "white"; // Turn tracker, either "white" or "black"

// Initial setup of the board
let board = Array(8).fill(null).map(() => Array(8).fill(null));
let selectedTile = null;
let moves = [];
let lastMovedPiece = null; // For tracking, i.e. the Goated en passant

function drawBoard() {
    // Base board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const color = (row + col) % 2 === 0 ? LIGHT : DARK;
            ctx.fillStyle = color;
            ctx.fillRect(col * tileLen, row * tileLen, tileLen, tileLen);
        }
    }

}

function showPromotionMenu(onSelectCallback) {
    const menu = document.getElementById("promotionMenu");
    menu.style.display = "block";
    activePromotion = true;

    menu.onchange = function () {
        const choice = menu.value;
        menu.style.display = "none"; // hide again after choice
        menu.value = ""; // reset

        activePromotion = false;
        onSelectCallback(choice); // pass choice back to main logic
    };
}

function createPromotedPiece(choice, color, rank, file) {
    if (choice === 'Queen') {
        return new Queen(color, rank, file);
    }
    if (choice === 'Knight') {
        return new Knight(color, rank, file);
    }
    if (choice === 'Bishop') {
        return new Bishop(color, rank, file);
    }
    if (choice === 'Rook') {
        return new Rook(color, rank, file);
    }
    if (choice === 'King') {
        return new King(color, rank, file);
    }

    return null;
}

function initializeBoard() {
    // Default board
    board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Black pieces
    if (evo1Black === 'Rook' || evo2Black === 'Rook') {
        board[0][0] = new EvoRook('black', 0, 0);
        board[0][7] = new EvoRook('black', 0, 7);
    }
    else {
        board[0][0] = new Rook('black', 0, 0);
        board[0][7] = new Rook('black', 0, 7);
    }
    if (evo1Black === 'Knight' || evo2Black === 'Knight') {
        board[0][1] = new EvoKnight('black', 0, 1);
        board[0][6] = new EvoKnight('black', 0, 6);
    }
    else {
        board[0][1] = new Knight('black', 0, 1);
        board[0][6] = new Knight('black', 0, 6);
    }
    if (evo1Black === 'Bishop' || evo2Black === 'Bishop') {
        board[0][2] = new EvoBishop('black', 0, 2);
        board[0][5] = new EvoBishop('black', 0, 5);
    }
    else {
        board[0][2] = new Bishop('black', 0, 2);
        board[0][5] = new Bishop('black', 0, 5);
    }

    if (evo1Black === 'Queen' || evo2Black === 'Queen') {
        board[0][3] = new EvoQueen('black', 0, 3);
    }
    else {
        board[0][3] = new Queen('black', 0, 3);
    }
    if (evo1Black === 'King' || evo2Black === 'King') {
        board[0][4] = new EvoKing('black', 0, 4);
    }
    else {
        board[0][4] = new King('black', 0, 4);
    }

    if (evo1Black === 'Pawn' || evo2Black === 'Pawn') {
        for (let i = 0; i < 8; i++) {
            board[1][i] = new EvoPawn('black', 1, i);

        }
    }
    else {
        for (let i = 0; i < 8; i++) {
            board[1][i] = new Pawn('black', 1, i);
        }
    }


    // White pieces
    if (evo1 === 'Rook' || evo2 === 'Rook') {
        board[7][0] = new EvoRook('white', 7, 0);
        board[7][7] = new EvoRook('white', 7, 7);
    }
    else {
        board[7][0] = new Rook('white', 7, 0);
        board[7][7] = new Rook('white', 7, 7);
    }
    if (evo1 === 'Knight' || evo2 === 'Knight') {
        board[7][1] = new EvoKnight('white', 7, 1);
        board[7][6] = new EvoKnight('white', 7, 6);
    }
    else {
        board[7][1] = new Knight('white', 7, 1);
        board[7][6] = new Knight('white', 7, 6);
    }
    if (evo1 === 'Bishop' || evo2 === 'Bishop') {
        board[7][2] = new EvoBishop('white', 7, 2);
        board[7][5] = new EvoBishop('white', 7, 5);
    }
    else {
        board[7][2] = new Bishop('white', 7, 2);
        board[7][5] = new Bishop('white', 7, 5);
    }

    if (evo1 === 'Queen' || evo2 === 'Queen') {
        board[7][3] = new EvoQueen('white', 7, 3);
    }
    else {
        board[7][3] = new Queen('white', 7, 3);
    }
    if (evo1 === 'King' || evo2 === 'King') {
        board[7][4] = new EvoKing('white', 7, 4);
    }
    else {
        board[7][4] = new King('white', 7, 4);
    }

    if (evo1 === 'Pawn' || evo2 === 'Pawn') {
        for (let i = 0; i < 8; i++) {
            board[6][i] = new EvoPawn('white', 6, i);

        }
    }
    else {
        for (let i = 0; i < 8; i++) {
            board[6][i] = new Pawn('white', 6, i);
        }
    }

    getMinions(board);
}

function drawPieces() {
    ctx.font = `${tileLen * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece != null) {
                const symbol = piece.getSymbol();
                const x = col * tileLen + tileLen / 2; // x Location
                const y = row * tileLen + tileLen / 2; // y Location
                ctx.fillStyle = (piece.color === 'white' ? 'white' : 'black');
                ctx.fillText(symbol, x, y);

                if (piece.evod) {
                    ctx.fillStyle = 'rgba(90, 0, 150, 0.25)'; // Highlight
                    ctx.fillRect(col * tileLen, row * tileLen, tileLen, tileLen);
                }
            }

            if (selectedTile && selectedTile.row === row && selectedTile.col === col) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; // Highlight
                ctx.fillRect(col * tileLen, row * tileLen, tileLen, tileLen);
            }
        }
    }
}

function drawMoves() {
    // Gray circle for possible moves
    for (const move of moves) {
        const centerX = move.col * tileLen + tileLen / 2;
        const centerY = move.row * tileLen + tileLen / 2;

        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)'; // gray with transparency
        ctx.beginPath();
        ctx.arc(centerX, centerY, tileLen / 6, 0, 2 * Math.PI);
        ctx.fill();
    }
}
function redraw() {
    drawBoard(); // Bottom layer
    drawPieces(); // Middle layer
    drawMoves(); // Top layer
}

function handleClick(row, col) {
    if (activePromotion || !evoSelectionMade) {
        return;
    }
    const clickedPiece = board[row][col];
    const originalTurn = turn; // Used later, niche but necessary

    if (selectedTile != null) {
        const from = selectedTile; // row, col for original tile
        const to = { row, col }; // row, col for target tile

        const move = moves.find(m => m.row === row && m.col === col);
        if (move != null) {
            // if clicked move exists in possible moves
            const movedPiece = board[from.row][from.col];
            if (movedPiece instanceof Pawn) {
                let output = movedPiece.movePiece(board, to, from, move);
                if (output === "PROMOTE") {
                    showPromotionMenu(choice => {
                        board[to.row][to.col] = createPromotedPiece(choice, movedPiece.color, to.row, to.col);
                        board[from.row][from.col] = null;

                        // Update state
                        lastMovedPiece = movedPiece;
                        turn = (turn === "white") ? "black" : "white";
                        moves = [];
                        selectedTile = null;
                        getMinions(board);

                        redraw();

                        let gameStatus = gameOver(board);
                        if (gameStatus != null) {
                            triggerReset(gameStatus);
                            document.getElementById('gameOverOverlay').addEventListener('click', () => {
                                document.getElementById('gameOverOverlay').style.display = 'none';
                                restartGame();
                            });
                        }
                    });

                    return; // prevents further logic from running until promotion completes
                } else {
                    board = output;
                    getMinions(board);
                }
            }
            else {
                board = movedPiece.movePiece(board, to, from);
                getMinions(board);
            }
            lastMovedPiece = movedPiece; // Update LMP
            if (turn === "white") {
                turn = "black";
            }
            else {
                turn = "white";
            }
            // Switch turns

        }
        moves = []; // Clear possible moves
        selectedTile = null; // Clear selection

        let gameStatus = gameOver(board);
        if (gameStatus != null) {
            triggerReset(gameStatus);
            document.getElementById('gameOverOverlay').addEventListener('click', () => {
                document.getElementById('gameOverOverlay').style.display = 'none';
                restartGame();
            });
        }

    } if (clickedPiece != null && originalTurn === clickedPiece.color) {
        // Select this
        selectedTile = { row, col };
        if (clickedPiece instanceof Pawn) {
            moves = clickedPiece.getMoves(board, row, col, lastMovedPiece);
        }
        else {
            moves = clickedPiece.getMoves(board, row, col);
        }

    }

    redraw();


}

function gameOver(board) {
    let bk = false;
    let wk = false;

    board.forEach((row, index) => {
        row.forEach((value, index) => {
            if (value != null && value instanceof King) {
                if (value.color === 'white') {
                    wk = true;
                }
                else {
                    bk = true;
                }
            }
        });
    });
    if (!wk && !bk) {
        return 'Draw.';
    }
    if (!wk && bk) {
        return 'Winner - Black.';
    }
    if (wk && !bk) {
        return 'Winner - White.';
    }
    return null;
}

async function restartGame() {
    evo1 = null;
    evo2 = null;

    const e1 = document.getElementById('evo1');
    const e2 = document.getElementById('evo2');
    const e1b = document.getElementById('evo1Black');
    const e2b = document.getElementById('evo2Black');

    e1.selectedIndex = 0;
    e2.selectedIndex = 0;
    e1.disabled = false;
    e2.disabled = false;

    e1b.selectedIndex = 0;
    e2b.selectedIndex = 0;
    e1b.disabled = false;
    e2b.disabled = false;

    const { selection1, selection2, selection1Black, selection2Black } = await processEvoSelections();

    evo1 = selection1;
    evo2 = selection2;
    evo1Black = selection1Black;
    evo2Black = selection2Black;

    initializeBoard();
    selectedTile = null;
    moves = [];
    turn = "white";
    lastMovedPiece = null;
    redraw();
}

function triggerReset(winner) {
    const overlay = document.getElementById('gameOverOverlay');
    const winnerText = document.getElementById('winnerText');

    winnerText.textContent = `Game Over – ${winner}`;
    overlay.style.display = 'flex';
}


export function setup() {
    initializeBoard();
    drawBoard();
    drawPieces();
}

export function startGame() {
    canvas.onclick = null; // reset
    canvas.onclick = (e) => {

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / tileLen);
        const row = Math.floor(y / tileLen);

        handleClick(row, col);
    }; // set

    restartGame();
}

canvas.addEventListener('click', (e) => {

    // interactive
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / tileLen);
    const row = Math.floor(y / tileLen);

    handleClick(row, col);
});


async function processEvoSelections() {
    evoSelectionMade = false;

    return new Promise((resolve) => {
        function trySetup() {
            const e1 = document.getElementById('evo1');
            const e2 = document.getElementById('evo2');
            const e1b = document.getElementById('evo1Black');
            const e2b = document.getElementById('evo2Black');
            if (e1 && e2 && e1b && e2b) {
                setupListeners(e1, e2, e1b, e2b, resolve);
                return true;
            }
            return false;
        }

        if (!trySetup()) {
            const observer = new MutationObserver(() => {
                if (trySetup()) {
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
}

function setupListeners(e1, e2, e1b, e2b, resolve) {
    function tryResolve() {
        if (e1.value && e2.value && e1b.value && e2b.value) {
            e1.disabled = true;
            e2.disabled = true;
            e1b.disabled = true;
            e2b.disabled = true;
            evoSelectionMade = true;
            resolve({
                selection1: e1.value,
                selection2: e2.value,
                selection1Black: e1b.value,
                selection2Black: e2b.value
            });
        }
    }

    e1.addEventListener('change', tryResolve);
    e2.addEventListener('change', tryResolve);
    e1b.addEventListener('change', tryResolve);
    e2b.addEventListener('change', tryResolve);
}

async function firstStart() {
    const { selection1, selection2, selection1Black, selection2Black } = await processEvoSelections();
    evo1 = selection1;
    evo2 = selection2;
    evo1Black = selection1Black;
    evo2Black = selection2Black;
    initializeBoard();
    drawBoard();
    drawPieces();
}

function getMinions(board) {

    const white = [];
    const black = [];

    for (const row of board) {
        for (const piece of row) {
            if (piece !== null && (piece instanceof Bishop || piece instanceof Rook)) {
                if (piece.color === 'white') {
                    white.push(piece);
                }
                else {
                    black.push(piece);
                }
            }
        }
    }

    for (const row of board) {
        for (const piece of row) {
            if (piece !== null && piece instanceof EvoQueen) {
                if (piece.color === 'white') {
                    piece.minions = white;
                }
                else {
                    piece.minions = black;
                }
            }
        }
    }
    return board;
}

firstStart();