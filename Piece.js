export class Piece {
    constructor(color, rank, file) {
        this.color = color;
        this.rank = rank; // current row
        this.file = file; // current col
        this.evod = false;
        this.isEvoRook = false;
    }

    getSymbol() {
        return '?';
    }

    getMoves(board, row, col) {
        // GENERAL USE
        return [];
    }

    isPossibleMove(board, row, col, targets, piece) {
        // ONLY USE TO CHECK FOR KING MOVES
        return false;
    }

    movePiece(board, to, from, move = null) {

        const victim = board[to.row][to.col];
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;
        this.rank = to.row;
        this.file = to.col;
        if (victim != null && victim.isEvoRook) {
            board = victim.boom(board);
        }



        return board;
    }

    captures(board, row, col, lmp = null) {
        return []
    }

    isPinnedPiece(board) {
        debugger;
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, 0],   // up
            [0, 1],  // right
        ]

        for (const [dr, dc] of directions) {
            let r1 = this.rank + dr;
            let c1 = this.file + dc;

            let r2 = this.rank - dr;
            let c2 = this.file - dc;

            let kingFound = false;
            let pinnerFound = false;

            while (inBounds(r1, c1)) {
                if (board[r1][c1] != null) {
                    const p = board[r1][c1];
                    if (p.isKing) {
                        kingFound = true;
                    }
                    else if (p.color !== this.color) {
                        if (dr === 0 || dc === 0) {
                            // Left/Right/Up/Down pin
                            if (p.canPinCard) {
                                pinnerFound = true;
                            }
                        }
                        else {
                            // Diagonal Pin
                            if (p.canPinDiag) {
                                pinnerFound = true;
                            }
                        }
                    }
                    break;
                }
                r1 += dr;
                c1 += dc;
            }

            while (inBounds(r2, c2)) {
                if (board[r2][c2] != null) {
                    const p = board[r2][c2];
                    if (p.isKing) {
                        kingFound = true;
                    }
                    else if (p.color !== this.color) {
                        if (dr === 0 || dc === 0) {
                            // Left/Right/Up/Down pin
                            if (p.canPinCard) {
                                pinnerFound = true;
                            }
                        }
                        else {
                            // Diagonal Pin
                            if (p.canPinDiag) {
                                pinnerFound = true;
                            }
                        }
                    }
                    break;
                }
                r2 -= dr;
                c2 -= dc;
            }

            if (kingFound && pinnerFound) {
                return true;
            }
        }

        return false;

    }


}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
