import { King } from './King.js'
import { Pawn } from '../PawnFiles/Pawn.js';
import { Knight } from '../KnightFiles/Knight.js';
import { Bishop } from '../BishopFiles/Bishop.js';
import { Rook } from '../RookFiles/Rook.js';
import { Queen } from '../QueenFiles/Queen.js';
import { EvoPawn } from '../PawnFiles/EvoPawn.js';
import { EvoKnight } from '../KnightFiles/EvoKnight.js';
import { EvoBishop } from '../BishopFiles/EvoBishop.js';
import { EvoRook } from '../RookFiles/EvoRook.js';
import { EvoQueen } from '../QueenFiles/EvoQueen.js';

export class EvoKing extends King {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.hasMoved = false;
        this.evod = true;
        this.isEvoRook = false;
        this.isKing = true;
    }

    movePiece(board, to, from, move = null) {
        // First, perform the standard King move (including castling and EvoRook handling)
        const victim = board[to.row][to.col];
        this.rank = to.row;
        this.file = to.col;

        // Handle castling if applicable
        if (this.hasMoved === false && Math.abs(to.col - from.col) === 2) {
            if (to.col < from.col) {
                const r = board[from.row][0];
                if (r instanceof Rook) {
                    board[from.row][0] = null;
                    board[from.row][to.col + 1] = r;
                    r.file = to.col + 1;
                }
            } else {
                const r = board[from.row][7];
                if (r instanceof Rook) {
                    board[from.row][7] = null;
                    board[from.row][to.col - 1] = r;
                    r.file = to.col - 1;
                }
            }
        }

        // Move the EvoKing to the target square
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;
        this.hasMoved = true;

        // Handle EvoRook boom if the victim is an EvoRook (regardless of color, per base King logic)
        if (victim != null && victim.isEvoRook) {
            board = victim.boom(board);
        }

        // EvoKing special ability: If capturing an opposing piece, spawn an evolved version
        // of the captured piece in the original square with EvoKing's color
        if (victim != null && victim.color !== this.color) {
            let spawned = null;
            if (victim instanceof Pawn) {
                spawned = new EvoPawn(this.color, from.row, from.col);
            } else if (victim instanceof Knight) {
                spawned = new EvoKnight(this.color, from.row, from.col);
            } else if (victim instanceof Bishop) {
                spawned = new EvoBishop(this.color, from.row, from.col);
            } else if (victim instanceof Rook) {
                spawned = new EvoRook(this.color, from.row, from.col);
            } else if (victim instanceof Queen) {
                spawned = new EvoQueen(this.color, from.row, from.col);
            } else if (victim instanceof King) {
                spawned = new EvoKing(this.color, from.row, from.col);
            }

            // Place the spawned piece in the original square
            if (spawned) {
                board[from.row][from.col] = spawned;
            }
        }

        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
