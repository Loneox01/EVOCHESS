import { Knight } from '../Pieces/KnightFiles/Knight.js';
import { Bishop } from '../Pieces/BishopFiles/Bishop.js';
import { Rook } from '../Pieces/RookFiles/Rook.js';
import { Queen } from '../Pieces/QueenFiles/Queen.js';
import { King } from '../Pieces/KingFiles/King.js';
import { Pawn } from '../Pieces/PawnFiles/Pawn.js';
import { EvoPawn } from '../Pieces/PawnFiles/EvoPawn.js';
import { EvoKnight } from '../Pieces/KnightFiles/EvoKnight.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const tileLen = canvas.width / 8;

const LIGHT = '#f0d9b5'; // Light tileLens
const DARK = '#b58863'; // Dark tileLens

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

    board[0][4] = new King('black', 0, 4);
    // N1
    for (let i = 0; i < 4; i++) {
        const n = new EvoKnight('black', i, 0);
        const x = new EvoKnight('black', i, 3);
        board[i][0] = n;
        board[i][3] = x;
    }

    const n = new EvoKnight('black', 1, 1);
    const n1 = new EvoKnight('black', 2, 2);
    board[1][1] = n;
    board[2][2] = n1;

    for (let i = 0; i < 3; i++) {
        board[3 - i][5 + i] = new EvoKnight('black', 3 - i, 5 + i);
        board[1 + i][5 + i] = new EvoKnight('black', 1 + i, 5 + i);
    }


    board[7][0] = new Rook('white', 7, 0);
    board[7][7] = new Rook('white', 7, 7);
    board[7][1] = new Knight('white', 7, 1);
    board[7][6] = new Knight('white', 7, 6);
    board[7][2] = new Bishop('white', 7, 2);
    board[7][5] = new Bishop('white', 7, 5);
    board[7][3] = new Queen('white', 7, 3);
    board[7][4] = new King('white', 7, 4);
    for (let i = 0; i < 8; i++) {
        board[6][i] = new EvoPawn('white', 6, i);
    }
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
    if (activePromotion) {
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
                }
            }
            else {
                board = movedPiece.movePiece(board, to, from);
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

    let gameStatus = gameOver(board);
    if (gameStatus != null) {
        triggerReset(gameStatus);
        document.getElementById('gameOverOverlay').addEventListener('click', () => {
            document.getElementById('gameOverOverlay').style.display = 'none';
            restartGame(); // You define this to reinit the board
        });
    }
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

function restartGame() {
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

initializeBoard();
drawBoard();
drawPieces();