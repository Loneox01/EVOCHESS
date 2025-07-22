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
const blackPieces = [];

// Game pausers
let gameFinished = false;
let evoSelectionMade = false;

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

let evo1 = null;
let evo2 = null;

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

    let q = new EvoQueen('black', 0, 3);
    board[0][3] = q;
    blackPieces.push(q);

    q = new EvoQueen('black', 1, 3);
    board[1][3] = q;
    blackPieces.push(q);

    q = new EvoQueen('black', 1, 4);
    board[1][4] = q;
    blackPieces.push(q);

    for (let i = 0; i < 4; i++) {
        if (i === 3) {
            let p = new Pawn('black', i - 1, i);
            board[i - 1][i] = p;
            blackPieces.push(p);
            let p2 = new Pawn('black', i - 1, 7 - i);
            board[i - 1][7 - i] = p2;
            blackPieces.push(p2);
        }
        else {
            let p = new Pawn('black', 3 - i, i);
            board[3 - i][i] = p;
            blackPieces.push(p);
            let p2 = new Pawn('black', 3 - i, 7 - i);
            board[3 - i][7 - i] = p2;
            blackPieces.push(p2);
        }
    }

    let b = new Bishop('black', 2, 0);
    board[2][0] = b;
    blackPieces.push(b);
    b = new Bishop('black', 2, 7);
    board[2][7] = b;
    blackPieces.push(b);
    b = new Bishop('black', 1, 0);
    board[1][0] = b;
    blackPieces.push(b);
    b = new Bishop('black', 1, 7);
    board[1][7] = b;
    blackPieces.push(b);
    b = new Bishop('black', 1, 1);
    board[1][1] = b;
    blackPieces.push(b);
    b = new Bishop('black', 1, 6);
    board[1][6] = b;
    blackPieces.push(b);

    for (let i = 0; i < 3; i++) {
        let r = new Rook('black', 0, i);
        board[0][i] = r;
        blackPieces.push(r);
        r = new Rook('black', 0, 7 - i);
        board[0][7 - i] = r;
        blackPieces.push(r);
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

    board[7][3] = new Queen('white', 7, 3);
    whiteKing = new King('white', 7, 4);
    board[7][4] = whiteKing;
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

async function handleClick(row, col) {

    if (gameFinished || !evoSelectionMade) {
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
                        let victim = board[to.row][to.col];
                        board[to.row][to.col] = createPromotedPiece(choice, movedPiece.color, to.row, to.col);
                        board[from.row][from.col] = null;
                        if (victim != null && victim.isEvoRook) {
                            board = victim.boom(board);
                        }

                        // Update state
                        lastMovedPiece = movedPiece;
                        moves = [];
                        selectedTile = null;
                        getMinions(board);

                        if (!blackMove) {
                            turn = 'black';
                            blackMove = true;
                        }
                        redraw();

                        let gameStatus = gameOver(board);
                        if (gameStatus != null) {
                            gameFinished = true;
                            triggerReset(gameStatus);
                            document.getElementById('gameOverOverlay').addEventListener('click', () => {
                                document.getElementById('gameOverOverlay').style.display = 'none';
                                restartGame();
                            });
                        }
                        saveGameState(board, null, turn, 'queenLevel');
                        handleClick(null, null);
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
            let gameStatus = gameOver(board);


            if (gameStatus != null) {
                gameFinished = true;
                triggerReset(gameStatus);
                document.getElementById('gameOverOverlay').addEventListener('click', () => {
                    document.getElementById('gameOverOverlay').style.display = 'none';
                    restartGame();
                });
            }
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
    await saveGameState(board, clickedPiece, turn, 'queenLevel');
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
    evo1 = null;
    evo2 = null;

    const e1 = document.getElementById('evo1');
    const e2 = document.getElementById('evo2');

    e1.selectedIndex = 0;
    e2.selectedIndex = 0;
    e1.disabled = false;
    e2.disabled = false;

    const { selection1, selection2 } = await processEvoSelections();
    evo1 = selection1;
    evo2 = selection2;
    initializeBoard();
    selectedTile = null;
    moves = [];
    turn = "white";
    lastMovedPiece = null;
    redraw();
    gameFinished = false;
    await saveGameState(board, null, 'white', 'queenLevel');
}

function triggerReset(winner) {
    const overlay = document.getElementById('gameOverOverlay');
    const winnerText = document.getElementById('winnerText');

    winnerText.textContent = `Game Over – ${winner}`;
    overlay.style.display = 'flex';
}

async function blackBot() {
    await saveGameState(board, null, 'black', 'queenLevel');

    let gameStatus = gameOver(board);
    if (gameStatus != null) {
        gameFinished = true;
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
    if (opps) {
        let opp = opps[0];
        // Instead of assuming to is the king's position, find the actual move that captures the king
        let captureMoves = opp.captures(board, opp.rank, opp.file);
        let kingCaptureMove = captureMoves.find(move => {
            // For normal captures, move.row and move.col should match king's position
            // For En Croissant, we need to check if the captured position matches
            if (move.type === 'croissantable') {
                // For En Croissant, check if the intermediate square has the king
                if (move.row === opp.rank + 2 && move.col === opp.file && board[opp.rank + 1][opp.file] === whiteKing) return true;
                if (move.row === opp.rank - 2 && move.col === opp.file && board[opp.rank - 1][opp.file] === whiteKing) return true;
                if (move.row === opp.rank && move.col === opp.file + 2 && board[opp.rank][opp.file + 1] === whiteKing) return true;
                if (move.row === opp.rank && move.col === opp.file - 2 && board[opp.rank][opp.file - 1] === whiteKing) return true;
            }

            return move.row === whiteKing.rank && move.col === whiteKing.file;
        });

        if (kingCaptureMove) {
            selectedTile = { row: opp.rank, col: opp.file };
            redraw();
            await delay(300);
            const pr = opp.rank;
            const pc = opp.file;
            const to = { row: kingCaptureMove.row, col: kingCaptureMove.col };
            const from = { row: opp.rank, col: opp.file };
            let output = opp.movePiece(board, to, from, kingCaptureMove);

            // Handle output based on piece type
            if (output === 'PROMOTE') {
                if (opp instanceof Pawn) {
                    board[pr][pc] = null;
                    let q = new Queen('black', to.row, to.col);
                    board[to.row][to.col] = q;
                    blackPieces.push(q);
                }
            } else if (output !== 'PROMOTE') {
                board = output;
            }
            // For EvoKing, if output was 'PROMOTE', we skip special handling since the board is already correctly set

            const spawned = board[pr][pc];
            if (spawned && spawned.color === 'black') {
                blackPieces.push(spawned);
            }
            selectedTile = null;
            getMinions(board);

            let gameStatus = gameOver(board);
            if (gameStatus != null) {
                gameFinished = true;
                triggerReset(gameStatus);
                document.getElementById('gameOverOverlay').addEventListener('click', () => {
                    document.getElementById('gameOverOverlay').style.display = 'none';
                    restartGame();
                });
            }
            await saveGameState(board, null, 'white', 'queenLevel');
            return;
        }
    }

    let opp2 = attackedPiece(board, blackKing);
    if (opp2) {
        // Black king in check
        if (opp2.length === 1) {
            // Capture sole attacking piece
            let theOpp = opp2[0];
            for (let i = 0; i < blackPieces.length; i++) {
                let bp = blackPieces[i];
                if (bp === blackKing || bp.isPinnedPiece(board)) {
                    continue;
                }
                const t = {};

                t[`${theOpp.rank},${theOpp.file}`] = true;
                if (bp.isPossibleMove(board, bp.rank, bp.file, t, blackKing)) {
                    selectedTile = { row: bp.rank, col: bp.file };
                    redraw();
                    await delay(300);
                    const pr = bp.rank;
                    const pc = bp.file;
                    const output = bp.movePiece(board, { row: theOpp.rank, col: theOpp.file }, selectedTile);

                    if (output === 'PROMOTE') {
                        board[pr][pc] = null;
                        let q = new Queen('black', theOpp.rank, theOpp.file);
                        board[theOpp.rank][theOpp.file] = q;
                        blackPieces.push(q);
                    }
                    else {
                        board = output;
                        const to = board[theOpp.rank][theOpp.file];
                        if (to !== null && to.color === 'black' && to !== bp) {
                            blackPieces.push(to);
                        }
                        const spawned = board[pr][pc];
                        if (spawned && spawned.color === 'black') {
                            blackPieces.push(spawned);
                        }
                    }

                    selectedTile = null;
                    getMinions(board);
                    await saveGameState(board, null, 'white', 'queenLevel');
                    return;
                }
            }
        }
        let ms = blackKing.getMoves(board, blackKing.rank, blackKing.file);
        // Move king
        for (let i = 0; i < ms.length; i++) {
            const m = ms[i];

            if (!(attackedPiece(board, blackKing, m.row, m.col, 'white'))) {
                // Safe square to move
                selectedTile = { row: blackKing.rank, col: blackKing.file };
                redraw();
                await delay(300);
                const pr = blackKing.rank;
                const pc = blackKing.file;
                selectedTile = null;
                blackKing.movePiece(board, m, { row: blackKing.rank, col: blackKing.file });
                const spawned = board[pr][pc];
                if (spawned && spawned.color === 'black') {
                    blackPieces.push(spawned);
                }
                getMinions(board);
                await saveGameState(board, null, 'white', 'queenLevel');
                return;
            }

        }
    }

    const randomOrder = shuffledIndices(blackPieces.length - 1);

    for (let index of randomOrder) {
        const piece = blackPieces[index];
        if (piece.isPinnedPiece(board)) {
            continue;
        }
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

            if (output === 'PROMOTE') {
                board[pr][pc] = null;
                let q = new Queen('black', rCr, rCc);
                board[rCr][rCc] = q;
                blackPieces.push(q);
            }

            else {

                const to2 = board[rCr][rCc];
                if (to2 !== null && to2.color === 'black' && to2 !== piece) {
                    blackPieces.push(to2);
                }

                board = output;


                const spawned = board[pr][pc];
                if (spawned && spawned.color === 'black') {
                    blackPieces.push(spawned);
                }

            }

            lastMovedPiece = piece;
            getMinions(board);
            await saveGameState(board, null, 'white', 'queenLevel');
            return;
        }

    }

    // Left to play a non capture/out-of-check move

    let rO2 = shuffledIndices(blackPieces.length - 1); // randomOrder2
    let rP = null;
    let shmoves = [];
    for (let index of rO2) {
        rP = blackPieces[index];
        if (rP.isPinnedPiece(board)) {
            continue;
        }
        shmoves = rP.getMoves(board, rP.rank, rP.file); // all moves of randomPiece
        if (shmoves.length > 0) {
            break;
        }
    }
    if (shmoves.length <= 0) {
        // No move found, pass
        lastMovedPiece = null;
        // No need to getMinions, no move made
        await saveGameState(board, null, 'white', 'queenLevel');
        return;
    }

    let rM = null;
    let broken = false;

    if (rP === blackKing) {
        let rO3 = shuffledIndices(shmoves.length - 1);
        for (let index of rO3) {
            rM = shmoves[index];
            if (!attackedPiece(board, rP, rM.row, rM.col, 'white')) {
                // safe square to move
                broken = true;
                break;
            }
        }
    }
    else {
        rM = shmoves[Math.floor(Math.random() * shmoves.length)]; // randomMove
    }

    if (rP === blackKing && !broken) {
        for (let piece of blackPieces) {
            if (piece != blackKing && piece.isPinnedPiece(board) === false) {
                let shm2 = piece.getMoves(board, piece.rank, piece.file);
                if (shm2.length > 0) {
                    rP = piece;
                    rM = shm2[Math.floor(Math.random() * shm2.length)];
                    break;
                }

            }
        }
    }

    // If all pieces pinned, no other pieces left, no other legal moves,
    // play the chosen king move (that may move into check) from earlier

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

    getMinions(board);
    await saveGameState(board, null, 'white', 'queenLevel');

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
        `Evo Queen: Active Ability: Omniscient Seer.   
        Scope is extended by allied Bishops and Rooks,  
        After capturing a piece in the extended scope,  
        this piece transforms to Queen.`;

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

function attackedPiece(board, piece = null, row = null, col = null, color = null) {

    let opps = []

    let r, c, otherColor = null;
    if (row !== null && col !== null && color !== null) {
        // provided target square
        r = row;
        c = col;
        otherColor = color;
    }
    else {
        // Use the pieces square
        r = piece.rank;
        c = piece.file;
        otherColor = piece.color === 'white' ? 'black' : 'white';
    }
    for (let ro = 0; ro < board.length; ro++) {
        for (let co = 0; co < board[0].length; co++) {
            const obj = board[ro][co];

            if (obj instanceof Piece && obj.color === otherColor) {
                const checkedTiles = {};
                checkedTiles[`${r},${c}`] = true;
                if (obj.isPossibleMove(board, obj.rank, obj.file, checkedTiles, piece)) {
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

async function processEvoSelections() {
    evoSelectionMade = false;

    return new Promise((resolve) => {
        function trySetup() {
            const e1 = document.getElementById('evo1');
            const e2 = document.getElementById('evo2');
            if (e1 && e2) {
                setupListeners(e1, e2, resolve);
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

function setupListeners(e1, e2, resolve) {
    function tryResolve() {
        if (e1.value && e2.value) {
            e1.disabled = true;
            e2.disabled = true;
            evoSelectionMade = true;
            resolve({ selection1: e1.value, selection2: e2.value });
        }
    }

    e1.addEventListener('change', tryResolve);
    e2.addEventListener('change', tryResolve);
}

async function firstStart() {
    const { selection1, selection2 } = await processEvoSelections();
    evo1 = selection1;
    evo2 = selection2;
    initializeBoard();
    drawBoard();
    drawPieces();
    await saveGameState(board, null, 'white', 'queenLevel');
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

firstStart();

