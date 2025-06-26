import { EvoKnight } from '../KnightFiles/EvoKnight.js';
import { Bishop } from './Bishop.js';

export class EvoBishop extends Bishop {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = true;
        this.isEvoRook = false;
        this.canPinDiag = true;
    }

    getMoves(board, row, col) {
        const moves = [];
        const directions = [
            [1, 1],   // down-right
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [-1, -1]  // up-left
        ];


        for (let [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let bounceCount = 0;

            if (!inBounds(r, c)) {
                if ((r < 0 || r > 7)) {
                    // row out of bounds, bounce
                    if (!(c < 0 || c > 7)) {
                        r -= dr * 2;
                        dr *= -1;
                    }
                    else {
                        // corner
                        continue;
                    }
                }
                else {
                    c -= dc * 2;
                    dc *= -1;
                }
                bounceCount++;
                if (bounceCount > 4) {
                    console.log('Evo Bishop bounce error');
                    break;
                }
            }

            while (!(r === this.rank && c === this.file)) {
                // This same loop is run over and over, close all else while (inBounds...)
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

                if (!inBounds(r, c)) {
                    if ((r < 0 || r > 7)) {
                        // row out of bounds, bounce
                        if (!(c < 0 || c > 7)) {
                            r -= dr * 2;
                            dr *= -1;
                        }
                        else {
                            // corner
                            break;
                        }
                    }
                    else {
                        c -= dc * 2;
                        dc *= -1;
                    }
                    bounceCount++;
                    if (bounceCount > 4) {
                        console.log('Evo Bishop bounce error');
                        break;
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
            [-1, -1]  // up-left
        ];

        for (let [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let bounceCount = 0;

            if (!inBounds(r, c)) {
                if ((r < 0 || r > 7)) {
                    // row out of bounds, bounce
                    if (!(c < 0 || c > 7)) {
                        r -= dr * 2;
                        dr *= -1;
                    }
                    else {
                        // corner
                        break;
                    }
                }
                else {
                    c -= dc * 2;
                    dc *= -1;
                }
                bounceCount++;
                if (bounceCount > 4) {
                    console.log('Evo Bishop bounce error');
                    break;
                }
            }


            while (!(r === this.rank && c === this.file)) {
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

                if (!inBounds(r, c)) {
                    if ((r < 0 || r > 7)) {
                        // row out of bounds, bounce
                        if (!(c < 0 || c > 7)) {
                            r -= dr * 2;
                            dr *= -1;
                        }
                        else {
                            // corner
                            break;
                        }
                    }
                    else {
                        c -= dc * 2;
                        dc *= -1;
                    }
                    bounceCount++;
                    if (bounceCount > 4) {
                        console.log('Evo Bishop bounce error');
                        break;
                    }
                }
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

        for (let [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let bounceCount = 0;

            if (!inBounds(r, c)) {
                if ((r < 0 || r > 7)) {
                    // row out of bounds, bounce
                    if (!(c < 0 || c > 7)) {
                        r -= dr * 2;
                        dr *= -1;
                    }
                    else {
                        // corner
                        break;
                    }
                }
                else {
                    c -= dc * 2;
                    dc *= -1;
                }
                bounceCount++;
                if (bounceCount > 4) {
                    console.log('Evo Bishop bounce error');
                    break;
                }
            }

            while (!(r === this.rank && c === this.file)) {
                const target = board[r][c];
                if (target === null) {
                    if (`${r},${c}` in targets) {
                        return true;
                    }

                } else if (target.color != this.color && target === piece) {
                    if (`${r},${c}` in targets || `${r + dr},${c + dc}` in targets) {
                        return true;
                    }
                    else if (!inBounds(r + dr, c + dc)) {
                        // account for bounce for King move
                        if ((r + dr < 0 || r + dr > 7)) {
                            // row out of bounds, bounce
                            if (!(c + dc < 0 || c + dc > 7)) {
                                r -= dr;
                                c += dc;
                            }
                            else {
                                // corner
                                break;
                            }
                        }
                        else {
                            c -= dc;
                            r += dr;
                        }
                        if (`${r},${c}` in targets) {
                            return true;
                        }
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

                if (!inBounds(r, c)) {
                    if ((r < 0 || r > 7)) {
                        // row out of bounds, bounce
                        if (!(c < 0 || c > 7)) {
                            r -= dr * 2;
                            dr *= -1;
                        }
                        else {
                            // corner
                            break;
                        }
                    }
                    else {
                        c -= dc * 2;
                        dc *= -1;
                    }
                    bounceCount++;
                    if (bounceCount > 4) {
                        console.log('Evo Bishop bounce error');
                        break;
                    }
                }
            }

        }
        return false;
    }

    movePiece(board, to, from) {
        const b = new Bishop(this.color, this.rank, this.file);
        const t = {};
        const victim = board[to.row][to.col];

        t[`${to.row},${to.col}`] = true;
        if (!b.isPossibleMove(board, this.rank, this.file, t, null) && (board[to.row][to.col] != null)) {
            // Not a possible regular bishop move, transforms to regular bishop
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
