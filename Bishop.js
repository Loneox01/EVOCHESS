import { Piece } from '../Piece.js';

export class Bishop extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = false;
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
                        moves.push({ row: r, col: c });
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
                        moves.push({ row: r, col: c });
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }

        return moves;
    }

    isPossibleMove(board, row, col, targets) {
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

                } else {
                    if (target.color !== this.color) {
                        if (`${r},${c}` in targets) {
                            return true;
                        }
                    }
                    break; // stop on first piece, whether captured or blocked
                }
                r += dr;
                c += dc;
            }
        }
        return false;
    }

    // movePiece(board, to, from) {

    // }

    // USE DEFAULT movePiece FROM Piece.js
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
