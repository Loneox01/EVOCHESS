import { Piece } from '../Piece.js';
import { Rook } from '../RookFiles/Rook.js';

export class King extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.hasMoved = false;
        this.evod = false;
    }

    getSymbol() {
        return this.color === 'white' ? '♔' : '♚';
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

            if (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    moves.push({ row: r, col: c });
                } else if (target.color !== this.color) {
                    moves.push({ row: r, col: c });
                }

            }
        }
        if (this.hasMoved === false) {
            // Castle check
            let castleBlocked = false;
            if (board[row][col + 1] === null && board[row][col + 2] === null && board[row][col + 3] instanceof Rook) {
                if (board[row][col + 3].hasMoved === false) {
                    // Loop through opposing pieces and check if any target current square or
                    // adjacent square in casteling target direction
                    // Allow casteling INTO check, not IN or THROUGH
                    // Generational family reunion of if statements
                    const otherColor = this.color === 'white' ? 'black' : 'white';
                    for (let r = 0; r < board.length; r++) {
                        for (let c = 0; c < board[0].length; c++) {
                            const obj = board[r][c];
                            if (obj instanceof Piece && obj.color === otherColor) {
                                const checkedTiles = {};
                                checkedTiles[`${row},${col}`] = true;
                                checkedTiles[`${row},${col + 1}`] = true;
                                if (obj.isPossibleMove(board, r, c, checkedTiles, this)) {
                                    castleBlocked = true;
                                }
                            }
                        }
                    }

                    if (!castleBlocked) {
                        moves.push({ row: row, col: col + 2 });
                    }

                }
            }
            if (board[row][col - 1] === null && board[row][col - 2] === null && board[row][col - 3] === null && board[row][col - 4] instanceof Rook) {
                if (board[row][col - 4].hasMoved === false) {

                    for (let r = 0; r < board.length; r++) {
                        for (let c = 0; c < board[0].length; c++) {
                            const obj = board[r][c];
                            const otherColor = this.color === 'white' ? 'black' : 'white';
                            if (obj instanceof Piece && obj.color === otherColor) {
                                const checkedTiles = {}
                                checkedTiles[`${row},${col}`] = true;
                                checkedTiles[`${row},${col - 1}`] = true;
                                if (obj.isPossibleMove(board, r, c, checkedTiles, this)) {
                                    castleBlocked = true;
                                }
                            }
                        }
                    }
                    if (!castleBlocked) {
                        moves.push({ row: row, col: col - 2 });
                    }
                }
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
            [-1, -1],  // up-left
            [1, 0],   // up
            [-1, 0],  // down
            [0, 1],  // right
            [0, -1]  // left
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;

            if (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    // do nothing
                } else if (target.color !== this.color) {
                    moves.push({ row: r, col: c });
                }

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

            if (inBounds(r, c)) {
                const target = board[r][c];
                if (target === null) {
                    if (`${r},${c}` in targets) {
                        return true;
                    }
                }
                if (`${r},${c}` in targets) {
                    return true;
                }

            }
        }
    }

    movePiece(board, to, from, move = null) {

        this.rank = to.row;
        this.file = to.col;

        if (this.hasMoved === false && Math.abs(to.col - from.col) === 2) {

            if (to.col < from.col) {
                const r = board[from.row][0];
                board[from.row][0] = null;
                board[from.row][to.col + 1] = r; // Move rook
            } else {
                const r = board[from.row][7];
                board[from.row][7] = null;
                board[from.row][to.col - 1] = r; // Move rook
            }
        }

        board[to.row][to.col] = this; // Move king
        board[from.row][from.col] = null;

        this.hasMoved = true;
        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
