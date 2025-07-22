import { Knight } from '../Pieces/KnightFiles/Knight.js';
import { Bishop } from '../Pieces/BishopFiles/Bishop.js';
import { Rook } from '../Pieces/RookFiles/Rook.js';
import { Queen } from '../Pieces/QueenFiles/Queen.js';
import { King } from '../Pieces/KingFiles/King.js';
import { Pawn } from '../Pieces/PawnFiles/Pawn.js';
import { EvoPawn } from '../Pieces/PawnFiles/EvoPawn.js';
import { Piece } from '../Pieces/Piece.js';
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
const blackPieces = Array(20).fill(null);

let blackMove = false;
let activePromotion = false; // True if promotion menu is present
let turn = "white"; // Turn tracker, either "white" or "black"

let gameFinished = false;

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

    const k = new King('black', 0, 4);
    board[0][4] = k;
    blackPieces[4] = k;
    for (let i = 0; i < 8; i++) {
        if (i != 4) {
            const p = new EvoPawn('black', 0, i);
            board[0][i] = p;
            blackPieces[i] = p;
        }
    }
    for (let i = 1; i < 7; i++) {
        const p = new EvoPawn('black', 1, i);
        board[1][i] = p;
        blackPieces[8 + i - 1] = p;
    }
    for (let i = 2; i < 6; i++) {
        const p = new EvoPawn('black', 2, i);
        board[2][i] = p;
        blackPieces[14 + i - 2] = p;
    }
    for (let i = 3; i < 5; i++) {
        const p = new EvoPawn('black', 3, i);
        board[3][i] = p;
        blackPieces[18 + i - 3] = p;
    }

    board[7][0] = new Rook('white');
    board[7][7] = new Rook('white');
    board[7][1] = new Knight('white');
    board[7][6] = new Knight('white');
    board[7][2] = new Bishop('white');
    board[7][5] = new Bishop('white');
    board[7][3] = new Queen('white', 7, 3);
    board[7][4] = new King('white');
    for (let i = 0; i < 8; i++) {
        board[6][i] = new Pawn('white');
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

async function handleClick(row, col) {

    if (gameFinished) {
        return;
    }
    if (activePromotion || blackMove || row === col === null) {
        if (turn !== 'black') {
            return;
        }
        else {
            turn = "white";
            await blackBot();
            blackMove = false;
            redraw();
            return;
        }

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
                        moves = [];
                        selectedTile = null;

                        redraw();

                        if (!blackMove) {
                            turn = 'black';
                            blackMove = true;
                        }

                        let gameStatus = gameOver(board);
                        if (gameStatus != null) {
                            gameFinished = true;
                            triggerReset(gameStatus);
                            document.getElementById('gameOverOverlay').addEventListener('click', () => {
                                document.getElementById('gameOverOverlay').style.display = 'none';
                                restartGame();
                            });
                        }
                        saveGameState(board, null, turn, 'pawnLevel');
                        handleClick(null, null);
                    });

                    return; // prevents further logic from running until promotion completes
                } else {
                    board = output;
                }
            }
            else {
                board = movedPiece.movePiece(board, to, from);
                let gameStatus = gameOver(board);
                if (gameStatus != null) {
                    gameFinished = true;
                    triggerReset(gameStatus);
                    document.getElementById('gameOverOverlay').addEventListener('click', () => {
                        document.getElementById('gameOverOverlay').style.display = 'none';
                        restartGame();
                    });
                }

            }
            lastMovedPiece = movedPiece; // Update LMP
            if (turn === "white") {
                moves = []; // Clear possible moves
                selectedTile = null; // Clear selection
                redraw();
                blackMove = true;
                await blackBot();
                blackMove = false;
            }
            else {
                console.log('Move error');
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
    await saveGameState(board, clickedPiece, turn, 'pawnLevel');

    let gameStatus = gameOver(board);
    if (gameStatus != null) {
        gameFinished = true;
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

async function restartGame() {
    initializeBoard();
    selectedTile = null;
    moves = [];
    turn = "white";
    lastMovedPiece = null;
    redraw();
    gameFinished = false;
    await saveGameState(board, null, 'white', 'pawnLevel');
}

function triggerReset(winner) {
    const overlay = document.getElementById('gameOverOverlay');
    const winnerText = document.getElementById('winnerText');

    winnerText.textContent = `Game Over – ${winner}`;
    overlay.style.display = 'flex';
}

async function blackBot() {
    saveGameState(board, null, 'black', 'pawnLevel');

    if (gameFinished) {
        return;
    }

    // Check game over

    let gameStatus = gameOver(board);
    if (gameStatus != null) {
        gameFinished = true;
        triggerReset(gameStatus);
        document.getElementById('gameOverOverlay').addEventListener('click', () => {
            document.getElementById('gameOverOverlay').style.display = 'none';
            restartGame();
            return; // shouldn't get here.
        });
    }
    // Remove taken/removed pieces from list


    for (let i = blackPieces.length - 1; i >= 0; i--) {
        let piece = blackPieces[i];

        if (board[piece.rank][piece.file] !== piece) {
            blackPieces.splice(i, 1);
        }
    }

    await delay(500);

    for (let piece of blackPieces) {

        const c = piece.captures(board, piece.rank, piece.file, lastMovedPiece); // Capture list
        if (c.length > 0) {
            // Has a capturable target
            const pr = piece.rank;
            const pc = piece.file;

            // Highlight moved piece, wait, unhighlight
            selectedTile = { row: pr, col: pc };
            redraw();

            await delay(300);

            selectedTile = null;
            redraw();

            const randomCapture = c[Math.floor(Math.random() * c.length)];
            const rCr = randomCapture.row;
            const rCc = randomCapture.col;
            const to = { row: rCr, col: rCc };

            const from = { row: pr, col: pc };
            let output = null;

            output = piece.movePiece(board, to, from, randomCapture);

            if (output === 'PROMOTE') {
                board[pr][pc] = null;
                let q = new Queen('black', randomCapture.row, randomCapture.col);
                board[randomCapture.row][randomCapture.col] = q;
                blackPieces.push(q);
            }
            else {
                board = output;
            }
            lastMovedPiece = piece;
            saveGameState(board, null, 'white', 'pawnLevel');
            return;
        }

    }

    // Left to push (Or move queen if applicable)
    let shmoves = []
    let rP = null;
    let iterations = 0;
    while (shmoves.length <= 0) {
        rP = blackPieces[Math.floor(Math.random() * blackPieces.length)]; // randomPiece
        shmoves = rP.getMoves(board, rP.rank, rP.file); // all moves of randomPiece
        iterations++;
        if (iterations >= 1000) {
            lastMovedPiece = null;
            saveGameState(board, null, 'white', 'pawnLevel');
            return;
        }
    }
    let rM = shmoves[Math.floor(Math.random() * shmoves.length)]; // randomMove

    const pr = rP.rank; // Piece row
    const pc = rP.file; // Piece col

    // Highlight moved piece, wait, unhighlight
    selectedTile = { row: pr, col: pc };
    redraw();

    await delay(300);

    selectedTile = null;
    redraw();

    const from = { row: pr, col: pc };
    const mr = rM.row; // Move row
    const mc = rM.col; // Move col
    const to = { row: mr, col: mc };
    let output = rP.movePiece(board, to, from, rM);

    if (output === 'PROMOTE') {
        board[pr][pc] = null;
        let q = new Queen('black', mr, mc);
        board[mr][mc] = q;
        blackPieces.push(q);
    }
    else {
        board = output;
    }

    lastMovedPiece = rP;
    saveGameState(board, null, 'white', 'pawnLevel');
    return;

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function setup() {
    initializeBoard();
    drawBoard();
    drawPieces();
}

export function startGame() {

    document.getElementById("levelMessage").textContent =
        `Evo Pawn: Active Ability: En Croissant (left, right, forward).    
        Can take adjacent opposing piece if space past it is a free space.   
        Move 2 spaces, capture opposing piece in intermediary square.   
        Pawns that En Croissant vertically are subject to En Passant.` ;

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

async function saveGameState(board, selectedPiece, curTurn, level) {
    const gameState = await updateGS(board, selectedPiece, curTurn, level);

    await fetch('http://localhost:8001/updateState', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState),
    });
}

async function updateGS(board, selectedPiece, curTurn, level = "finalLevel") {
    let boardJSON = null;
    let selecPieceJSON = null
    if (board !== null) {
        boardJSON = Array(8).fill(null).map(() => Array(8).fill(null));
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = board[row][col];
                if (square != null) {
                    const pieceJSON = piece2JSON(square);
                    boardJSON[row][col] = pieceJSON;
                }
            }
        }
    }
    if (selectedPiece !== null) {
        selecPieceJSON = piece2JSON(selectedPiece);
    }

    return {
        "board": boardJSON,
        "turn": curTurn,
        "selectedPiece": selecPieceJSON,
        "level": level
    };
}

function piece2JSON(piece) {
    if (!piece) {
        return null;
    }
    let data = {
        type: piece.constructor.name,  // e.g. "EvoKing", "Pawn", etc.
        color: piece.color,
        rank: piece.rank,
        file: piece.file,
        evod: piece.evod
    };
    if (piece instanceof Pawn) {
        data.moved2 = piece.moved2;
        data.onHomeSquare = piece.homeSquare; // boolean
    }
    else if (piece instanceof Rook) {
        data.hasMoved = piece.hasMoved;
    }
    else if (piece instanceof King) {
        data.hasMoved = piece.hasMoved;
        if (piece instanceof EvoKing) {
            data.remainingAllyCaptures = piece.allyCaptures;
        }
    }
    else if (piece instanceof EvoQueen) {
        const m = piece.minions || [];   // minions is undefined/null
        let minionsJSON = [];
        for (let minion of m) {
            const pieceJson = piece2JSON(minion);
            minionsJSON.push(pieceJson);
        }
        data.minions = minionsJSON;
    }

    return data;
}

initializeBoard();
drawBoard();
drawPieces();