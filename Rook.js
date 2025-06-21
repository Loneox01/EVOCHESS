import { Piece } from '../Piece.js';
import { EvoKnight } from '../KnightFiles/EvoKnight.js';
import { King } from '../KingFiles/King.js';


export class Rook extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.hasMoved = false;
        this.evod = false;
    }

    getSymbol() {
        return this.color === 'white' ? '♖' : '♜';
    }

    getMoves(board, row, col) {
        const moves = [];
        const directions = [
            [1, 0],   // up
            [-1, 0],  // down
            [0, 1],  // right
            [0, -1]  // left
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;

            while (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    moves.push({ row: r, col: c });
                } else {
                    if (target.color !== this.color) {
                        if (!((Math.abs(row - r) + Math.abs(col - c) > 3) && (target instanceof EvoKnight))) {
                            moves.push({ row: r, col: c });
                        }
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    captures(board, row, col) {
        const moves = [];
        const directions = [
            [1, 0],   // up
            [-1, 0],  // down
            [0, 1],  // right
            [0, -1]  // left
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;

            while (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    // do nothing
                } else {
                    if (target.color !== this.color) {
                        if (!((Math.abs(row - r) + Math.abs(col - c) > 3) && (target instanceof EvoKnight))) {
                            moves.push({ row: r, col: c });
                        }
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    isPossibleMove(board, row, col, targets, piece) {
        const directions = [
            [1, 0],   // up
            [-1, 0],  // down
            [0, 1],  // right
            [0, -1]  // left
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;

            while (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    if (`${r},${c}` in targets) {
                        return true;
                    }

                } else if (target.color != this.color && target === piece) {
                    if (`${r},${c}` in targets || `${r + dr},${c + dc}` in targets) {
                        return true;
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                else {
                    if (`${r},${c}` in targets) {
                        return true;
                    }
                    break; // stop on first piece, whether captured or blocked
                }

                r += dr;
                c += dc;
            }

        }

        return false;
    }

    movePiece(board, to, from, move = null) {
        this.rank = to.row;
        this.file = to.col;
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;

        if (this.hasMoved === false) {
            this.hasMoved = true;
        }



        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
