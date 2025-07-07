import { Rook } from './Rook.js';

export class EvoRook extends Rook {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.hasMoved = false;
        this.evod = true;
        this.isEvoRook = true; // To avoid circular imports
        this.canPinCard = true;
    }

    boom(board) {
        const directions = [
            [1, 0],   // up
            [-1, 0],  // down
            [0, 1],  // right
            [0, -1]  // left
        ];
        for (const [dr, dc] of directions) {
            const r = this.rank + dr;
            const c = this.file + dc;
            if (inBounds(r, c)) {
                board[r][c] = null;
            }
        }

        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}