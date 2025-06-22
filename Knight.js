import { Piece } from '../Piece.js';

export class Knight extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = false;
        this.isEvoRook = false;
    }

    getSymbol() {
        return this.color === 'white' ? '♘' : '♞';
    }

    getMoves(board, row, col) {
        const moves = [];
        const deltas = [
            [-2, -1], [-2, 1],
            [-1, -2], [-1, 2],
            [1, -2], [1, 2],
            [2, -1], [2, 1]
        ];

        for (const [dr, dc] of deltas) {
            const r = row + dr;
            const c = col + dc;

            if (inBounds(r, c)) {
                const target = board[r][c];
                if (!target || target.color !== this.color) {
                    moves.push({ row: r, col: c });
                }
            }
        }

        return moves;
    }

    captures(board, row, col) {
        const moves = [];
        const deltas = [
            [-2, -1], [-2, 1],
            [-1, -2], [-1, 2],
            [1, -2], [1, 2],
            [2, -1], [2, 1]
        ];

        for (const [dr, dc] of deltas) {
            const r = row + dr;
            const c = col + dc;

            if (inBounds(r, c)) {
                const target = board[r][c];
                if (target != null && target.color !== this.color) {
                    moves.push({ row: r, col: c });
                }
            }
        }

        return moves;
    }

    isPossibleMove(board, row, col, targets, piece) {

        // Same as getMoves, with push replaced with conditional returns
        const deltas = [
            [-2, -1], [-2, 1],
            [-1, -2], [-1, 2],
            [1, -2], [1, 2],
            [2, -1], [2, 1]
        ];

        for (const [dr, dc] of deltas) {
            const r = row + dr;
            const c = col + dc;

            if (inBounds(r, c)) {
                if (`${r},${c}` in targets) {
                    return true;
                }
            }
        }
        return false;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
