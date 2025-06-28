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
        this.allyCaptures = 3;
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
                } else if (target.color === this.color && this.allyCaptures > 0) {
                    // Allow moving to allied piece squares if we haven't used all 3 takes
                    moves.push({ row: r, col: c });
                }
            }
        }

        if (this.hasMoved === false) {
            // Castle check
            let castleBlocked = false;
            if (board[row][col + 1] === null && board[row][col + 2] === null && board[row][col + 3] instanceof Rook) {
                if (board[row][col + 3].hasMoved === false) {
                    const otherColor = this.color === 'white' ? 'black' : 'white';
                    for (let r = 0; r < board.length; r++) {
                        for (let c = 0; c < board[0].length; c++) {
                            const obj = board[r][c];
                            if (obj !== null && obj.color === otherColor) {
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
                            if (obj !== null && obj.color === otherColor) {
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

    movePiece(board, to, from, move = null) {

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

        board[to.row][to.col] = this;
        board[from.row][from.col] = null;
        this.hasMoved = true;

        if (victim != null && victim.isEvoRook) {
            board = victim.boom(board);
        }


        // Spawn a piece
        if (victim != null) {
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

            if (victim.color === this.color) {
                this.allyCaptures--;
            }

            // Cover promotion by King move
            if (this.color === 'white') {
                if (victim instanceof Pawn && from.row === 0) {
                    return 'PROMOTE';
                }
            }
            else {
                if (victim instanceof Pawn && from.row === 7) {
                    return 'PROMOTE';
                }
            }
            if (spawned) {
                // Place the spawned piece in the original square
                board[from.row][from.col] = spawned;
            }


        }

        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}