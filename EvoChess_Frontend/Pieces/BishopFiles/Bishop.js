import { EvoKnight } from '../KnightFiles/EvoKnight.js';
import { Piece } from '../Piece.js';

export class Bishop extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = false;
        this.isEvoRook = false;
        this.canPinDiag = true;
    }

    getSymbol() {
        return this.color === 'white' ? '♗' : '♝';
    }

    getMoves(board, row, col) {
        const moves = [];
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1]  // up-left
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

        return moves;
    }

    captures(board, row, col) {
        const moves = [];
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1]  // up-left
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

        return moves;
    }

    isPossibleMove(board, row, col, targets, piece) {
        // Going to be the same as getMoves but all .push replaced with conditions

        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1]  // up-left
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

    getPath(board, piece) {
        const row = this.rank;
        const col = this.file;

        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1]  // up-left
        ];

        for (const [dr, dc] of directions) {
            const moves = [];
            let r = row + dr;
            let c = col + dc;

            while (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    moves.push({ row: r, col: c });
                } else {
                    if (target === piece) {
                        return moves;
                    }
                    break;
                }
                r += dr;
                c += dc;
            }
        }

        return null;
    }

    // movePiece(board, to, from) {

    // }

    // USE DEFAULT movePiece FROM Piece.js
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
