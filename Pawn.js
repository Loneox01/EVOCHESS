import { Piece } from '../Piece.js';

export class Pawn extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.moved2 = false;
        this.homeSquare = true;
        this.evod = false;

    }

    getSymbol() {
        return this.color === 'white' ? '♙' : '♟';
    }

    getMoves(board, row, col, lmp = null) {
        const moves = [];
        if (this.color === 'white') {
            // PUSHING P
            if (this.homeSquare) {
                // Setting up devious pawn spawning locations here
                if (board[row - 1][col] === null) {
                    moves.push({ row: row - 1, col: col });
                    if (board[row - 2][col] === null) {
                        moves.push({ row: row - 2, col: col });
                    }
                }
            }
            else if (row > 0) {
                if (board[row - 1][col] === null) {
                    moves.push({ row: row - 1, col: col });
                }
            }
            else {
                // Should be unreachable... unless something is spiced up
                return [];
            }

            // Capturing

            if (inBounds(row - 1, col + 1)) {
                if (board[row - 1][col + 1] !== null && board[row - 1][col + 1].color !== this.color) {
                    moves.push({ row: row - 1, col: col + 1 });
                }
                else if (board[row][col + 1] != null && board[row][col + 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col + 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row - 1, col: col + 1, passantable: true });
                    }
                }
            }
            if (inBounds(row - 1, col - 1)) {
                if (board[row - 1][col - 1] !== null && board[row - 1][col - 1].color !== this.color) {
                    moves.push({ row: row - 1, col: col - 1 });
                }
                else if (board[row][col - 1] != null && board[row][col - 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col - 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row - 1, col: col - 1, passantable: true });
                    }
                }
            }

        }
        else {
            // PUSHING P
            if (this.homeSquare) {
                // Setting up devious pawn spawning locations here
                if (board[row + 1][col] === null) {
                    moves.push({ row: row + 1, col: col });
                    if (board[row + 2][col] === null) {
                        moves.push({ row: row + 2, col: col });
                    }
                }
            }
            else if (row < 7) {
                if (board[row + 1][col] === null) {
                    moves.push({ row: row + 1, col: col });
                }
            }
            else {
                // Should be unreachable... unless something is spiced up
                return [];
            }

            // Capturing

            if (inBounds(row + 1, col + 1)) {
                if (board[row + 1][col + 1] !== null && board[row + 1][col + 1].color !== this.color) {
                    moves.push({ row: row + 1, col: col + 1 });
                }
                else if (board[row][col + 1] != null && board[row][col + 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col + 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row + 1, col: col + 1, passantable: true }); // New key
                    }
                }
            }
            if (inBounds(row + 1, col - 1)) {
                if (board[row + 1][col - 1] !== null && board[row + 1][col - 1].color !== this.color) {
                    moves.push({ row: row + 1, col: col - 1 });
                }
                else if (board[row][col - 1] != null && board[row][col - 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col - 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row + 1, col: col - 1 });
                    }
                }
            }
        }

        return moves;
    }

    captures(board, row, col, lmp = null) {
        const moves = [];
        if (this.color === 'white') {

            // Capturing

            if (inBounds(row - 1, col + 1)) {
                if (board[row - 1][col + 1] !== null && board[row - 1][col + 1].color !== this.color) {
                    moves.push({ row: row - 1, col: col + 1 });
                }
                else if (board[row][col + 1] != null && board[row][col + 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col + 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row - 1, col: col + 1, passantable: true });
                    }
                }
            }
            if (inBounds(row - 1, col - 1)) {
                if (board[row - 1][col - 1] !== null && board[row - 1][col - 1].color !== this.color) {
                    moves.push({ row: row - 1, col: col - 1 });
                }
                else if (board[row][col - 1] != null && board[row][col - 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col - 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row - 1, col: col - 1, passantable: true });
                    }
                }
            }

        }
        else {

            // Capturing

            if (inBounds(row + 1, col + 1)) {
                if (board[row + 1][col + 1] !== null && board[row + 1][col + 1].color !== this.color) {
                    moves.push({ row: row + 1, col: col + 1 });
                }
                else if (board[row][col + 1] != null && board[row][col + 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col + 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row + 1, col: col + 1, passantable: true }); // New key
                    }
                }
            }
            if (inBounds(row + 1, col - 1)) {
                if (board[row + 1][col - 1] !== null && board[row + 1][col - 1].color !== this.color) {
                    moves.push({ row: row + 1, col: col - 1 });
                }
                else if (board[row][col - 1] != null && board[row][col - 1] instanceof Pawn) {
                    // EN CROISSANT
                    let theVictim = board[row][col - 1]
                    if (theVictim === lmp && theVictim.moved2) {
                        moves.push({ row: row + 1, col: col - 1 });
                    }
                }
            }
        }

        return moves;
    }

    isPossibleMove(board, row, col, targets, piece = null) {
        if (this.color === 'white') {
            // Capturing
            if (`${row - 1},${col + 1}` in targets) {
                return true;
            }
            if (`${row - 1},${col - 1}` in targets) {
                return true;
            }

        }
        else {
            // Capturing
            if (`${row + 1},${col + 1}` in targets) {
                return true;
            }
            if (`${row + 1},${col - 1}` in targets) {
                return true;
            }
        }

        return false;

    }

    movePiece(board, to, from, move = null) {
        this.rank = to.row;
        this.file = to.col;

        if (Math.abs(from.row - to.row) >= 2) {
            this.homeSquare = false;
            this.moved2 = true;
        } else {
            this.moved2 = false;
        }

        if (move != null) {
            if (move.type === 'passantable') {
                if (this.color === 'white') {
                    board[to.row + 1][to.col] = null;
                }
                else {
                    board[to.row - 1][to.col] = null;
                }
            }
        }

        if (this.homeSquare) {
            this.homeSquare = false;
        }

        if ((this.color === 'black' && to.row === 7) || (this.color === 'white' && to.row === 0)) {
            return 'PROMOTE';
        }
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;

        return board;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}


