import { Piece } from '../Piece.js';
import { EvoKnight } from '../KnightFiles/EvoKnight.js';
import { Queen } from './Queen.js'

export class EvoQueen extends Queen {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = true;
        this.isEvoRook = false;
        this.canPinCard = true;
        this.canPinDiag = true;
        this.minions = []; // Rook/Bishops
    }

    getSymbol() {
        return this.color === 'white' ? '♕' : '♛';
    }

    getMoves(board, row, col) {
        const moves = [];
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1],  // up-left
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
                        if (!((Math.abs(row - r) + Math.abs(col - c) >= 3) && (target instanceof EvoKnight))) {
                            moves.push({ row: r, col: c });
                        }
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }

        for (let piece of this.minions) {
            const m = piece.getMoves(board, piece.rank, piece.file);
            for (let movar in m) {
                moves.push(m[movar]);
            }
        }

        return moves;
    }

    isPossibleMove(board, row, col, targets, piece = null) {
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1],  // up-left
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

                } else if (target.color != this.color && target == piece) {
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

        for (let p of this.minions) {
            if (p.isPossibleMove(board, p.rank, p.file, targets, piece)) {
                return true;
            }
        }
        return false;
    }

    captures(board, row, col) {
        const moves = [];
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1],  // up-left
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
                        if (!((Math.abs(row - r) + Math.abs(col - c) >= 3) && (target instanceof EvoKnight))) {
                            moves.push({ row: r, col: c });
                        }
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }

        for (let piece of this.minions) {
            const m = piece.captures(board, piece.rank, piece.file);
            for (let movar in m) {
                moves.push(m[movar]);
            }
        }

        return moves;
    }

    movePiece(board, to, from, move = null) {
        const b = new Queen(this.color, this.rank, this.file);
        const t = {};
        const victim = board[to.row][to.col];

        t[`${to.row},${to.col}`] = true;
        if (!b.isPossibleMove(board, this.rank, this.file, t, null) && (board[to.row][to.col] != null)) {
            // Not a possible regular queen move, transforms to regular queen
            b.rank = to.row;
            b.file = to.col;
            board[to.row][to.col] = b;
        }
        else {
            board[to.row][to.col] = this;
        }
        board[from.row][from.col] = null;
        if (victim != null && victim.isEvoRook) {
            board = victim.boom(board);
        }

        this.rank = to.row;
        this.file = to.col;

        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
