import { Piece } from './Piece.js';

export class Queen extends Piece {
    constructor(color) {
        super(color);
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
