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

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const tileLen = canvas.width / 8;

const LIGHT = '#f0d9b5'; // Light tileLens
const DARK = '#b58863'; // Dark tileLens
const blackPieces = [];

let blackMove = false;
let activePromotion = false; // True if promotion menu is present
let turn = "white"; // Turn tracker, either "white" or "black"

// Initial setup of the board
let board = Array(8).fill(null).map(() => Array(8).fill(null));
let selectedTile = null;
let moves = [];
let lastMovedPiece = null; // For tracking, i.e. the Goated en passant
let whiteKing = null; // For bot tracking
let blackKing = null; // Same as above

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
    blackKing = k;
    board[0][4] = k;
    blackPieces.push(k);

    // X1
    for (let i = 0; i < 4; i++) {
        const n = new EvoBishop('black', i, 0 + i);
        const x = new EvoBishop('black', i, 3 - i);
        board[i][0 + i] = n;
        board[i][3 - i] = x;
        blackPieces.push(n);
        blackPieces.push(x);
    }
    let x = new EvoBishop('black', 0, 7);
    board[0][7] = x;
    blackPieces.push(x);
    for (let i = 1; i < 4; i++) {
        const n = new EvoBishop('black', i, 4 + i);
        const x = new EvoBishop('black', i, 7 - i);
        board[i][4 + i] = n;
        board[i][7 - i] = x;
        blackPieces.push(n);
        blackPieces.push(x);
    }

    // White pieces
    board[7][0] = new Rook('white', 7, 0);
    board[7][7] = new Rook('white', 7, 7);
    board[7][1] = new EvoKnight('white', 7, 1);
    board[7][6] = new EvoKnight('white', 7, 6);
    board[7][2] = new Bishop('white', 7, 2);
    board[7][5] = new Bishop('white', 7, 5);
    board[7][3] = new Queen('white', 7, 3);
    whiteKing = new King('white', 7, 4);
    board[7][4] = whiteKing;
    for (let i = 0; i < 8; i++) {
        board[6][i] = new EvoPawn('white', 6, i);
    }

    board[5][2] = new EvoPawn('white', 5, 2);
    board[5][4] = new EvoPawn('white', 5, 4);
    board[5][6] = new EvoPawn('white', 5, 6);
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

                        if (!blackMove) {
                            turn = 'black';
                            blackMove = true;
                        }

                        redraw();

                        let gameStatus = gameOver(board);
                        if (gameStatus != null) {
                            triggerReset(gameStatus);
                            document.getElementById('gameOverOverlay').addEventListener('click', () => {
                                document.getElementById('gameOverOverlay').style.display = 'none';
                                restartGame();
                            });
                        }

                        handleClick(null, null);
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

async function blackBot() {

    let gameStatus = gameOver(board);
    if (gameStatus != null) {
        triggerReset(gameStatus);
        document.getElementById('gameOverOverlay').addEventListener('click', () => {
            document.getElementById('gameOverOverlay').style.display = 'none';
            restartGame();
        });
        return; // shouldn't get here.
    }

    // Remove taken/removed pieces from list

    for (let i = blackPieces.length - 1; i >= 0; i--) {
        let piece = blackPieces[i];

        if (board[piece.rank][piece.file] !== piece) {
            blackPieces.splice(i, 1);
        }
    }

    await delay(500);

    let opps = attackedPiece(board, whiteKing);
    let opp = null;
    if (opps) {
        opp = opps[0];
    }

    if (opps) {
        // Capture white king
        selectedTile = { row: opp.rank, col: opp.file };
        redraw();
        await delay(300);
        selectedTile = null;
        opp.movePiece(board, { row: whiteKing.rank, col: whiteKing.file }, { row: opp.rank, col: opp.file });
        return;
    }

    let opp2 = attackedPiece(board, blackKing);
    if (opp2) {
        // Black king in check
        if (opp2.length === 1) {
            let theOpp = opp2[0];
            for (let i = 0; i < blackPieces.length; i++) {
                let bp = blackPieces[i];
                if (bp === blackKing) {
                    continue;
                }
                const t = {};

                t[`${theOpp.rank},${theOpp.file}`] = true;
                if (bp.isPossibleMove(board, bp.rank, bp.file, t)) {
                    selectedTile = { row: bp.rank, col: bp.file };
                    redraw();
                    await delay(300);
                    bp.movePiece(board, { row: theOpp.rank, col: theOpp.file }, selectedTile);
                    selectedTile = null;
                    return;
                }
            }
        }
        let ms = blackKing.getMoves(board, blackKing.rank, blackKing.file);
        for (let i = 0; i < ms.length; i++) {
            const m = ms[i];

            if (!(attackedPiece(board, null, m.row, m.col, 'white'))) {
                // Safe square to move
                selectedTile = { row: blackKing.rank, col: blackKing.file };
                redraw();
                await delay(300);
                selectedTile = null;
                blackKing.movePiece(board, m, { row: blackKing.rank, col: blackKing.file });
                return;
            }

        }
    }

    const randomOrder = shuffledIndices(blackPieces.length - 1);

    for (let index of randomOrder) {
        const piece = blackPieces[index];
        const c = piece.captures(board, piece.rank, piece.file); // Capture list
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

            board = output;
            lastMovedPiece = piece;
            return;
        }

    }

    // Left to play a non capture/out-of-check move

    let rO2 = shuffledIndices(blackPieces.length - 1); // randomOrder2
    let rP = null;
    let shmoves = [];
    for (let index of rO2) {
        rP = blackPieces[index];
        shmoves = rP.getMoves(board, rP.rank, rP.file); // all moves of randomPiece
        if (shmoves.length > 0) {
            break;
        }
    }
    if (shmoves.length <= 0) {
        lastMovedPiece = null;
        return;
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

    board = output;

    lastMovedPiece = rP;
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
        `Evo Bishop: Active Ability: Ricochet.    
        Scope is extended to bounce 90 degrees on walls.   
        After capturing a piece in the extended scope,  
        this piece transforms to Bishop.` ;

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

function attackedPiece(board, piece, row = null, col = null, color = null) {

    let opps = []

    let r, c, otherColor = null;
    if (piece) {
        r = piece.rank;
        c = piece.file;
        otherColor = piece.color === 'white' ? 'black' : 'white';
    }
    else {
        r = row;
        c = col;
        otherColor = color;
    }
    for (let ro = 0; ro < board.length; ro++) {
        for (let co = 0; co < board[0].length; co++) {
            const obj = board[ro][co];

            if (obj instanceof Piece && obj.color === otherColor) {
                const checkedTiles = {};
                checkedTiles[`${r},${c}`] = true;
                if (obj.isPossibleMove(board, obj.rank, obj.file, checkedTiles)) {
                    opps.push(obj);
                }
            }
        }
    }

    if (opps.length > 0) {
        return opps;
    }

    return null;
}

function shuffledIndices(n) {
    // randomizes indices
    const indices = Array.from({ length: n + 1 }, (_, i) => i); // [0, 1, 2, ..., n]

    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]; // swap
    }

    return indices;
}


initializeBoard();
drawBoard();
drawPieces();