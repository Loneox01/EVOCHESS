import { Pawn } from './Pawn.js';


export class EvoPawn extends Pawn {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.moved2 = false;
        this.homeSquare = true;
        this.evod = true;
        this.isEvoRook = false;
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
                        moves.push({ row: row - 1, col: col + 1, type: "passantable" });
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
                        moves.push({ row: row - 1, col: col - 1, type: "passantable" });
                    }
                }
            }

            // Added real En Croissant
            if (inBounds(row - 2, col) && board[row - 2][col] == null) {
                if (board[row - 1][col] != null && board[row - 1][col].color != this.color) {
                    moves.push({ row: row - 2, col: col, type: "croissantable" });
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (board[row][col + 1] != null && board[row][col + 1].color != this.color) {
                    moves.push({ row: row, col: col + 2, type: "croissantable" });
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (board[row][col - 1] != null && board[row][col - 1].color != this.color) {
                    moves.push({ row: row, col: col - 2, type: "croissantable" });
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
                        moves.push({ row: row + 1, col: col + 1, type: "passantable" }); // New key
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
                        moves.push({ row: row + 1, col: col - 1, type: "passantable" });
                    }
                }
            }

            // Added real En Croissant
            if (inBounds(row + 2, col) && board[row + 2][col] == null) {
                if (board[row + 1][col] != null && board[row + 1][col].color != this.color) {
                    moves.push({ row: row + 2, col: col, type: "croissantable" });
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (board[row][col + 1] != null && board[row][col + 1].color != this.color) {
                    moves.push({ row: row, col: col + 2, type: "croissantable" });
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (board[row][col - 1] != null && board[row][col - 1].color != this.color) {
                    moves.push({ row: row, col: col - 2, type: "croissantable" });
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

            if (inBounds(row - 2, col) && board[row - 2][col] == null) {
                if (`${row - 1},${col}` in targets) {
                    return true;
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (`${row},${col + 1}` in targets) {
                    return true;
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (`${row},${col - 1}` in targets) {
                    return true;
                }
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

            if (inBounds(row + 2, col) && board[row + 2][col] == null) {
                if (`${row + 1},${col}` in targets) {
                    return true;
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (`${row},${col + 1}` in targets) {
                    return true;
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (`${row},${col - 1}` in targets) {
                    return true;
                }
            }
        }

        return false;

    }

    movePiece(board, to, from, move = null) {
        let croissanted = false;
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
            if (move.type === 'croissantable') {
                croissanted = true;
                board[to.row][to.col] = this;
                if (to.row === from.row + 2) {
                    this.moved2 = true; // This should already be covered by the if at the beginning, but just in case
                    const victim = board[from.row + 1][from.col];
                    board[from.row + 1][from.col] = null;
                    if (victim != null && victim.isEvoRook) {
                        board = victim.boom(board);
                    }
                }
                else if (to.row === from.row - 2) {
                    this.moved2 = true; // Same with this
                    const victim = board[from.row - 1][from.col];
                    board[from.row - 1][from.col] = null;
                    if (victim != null && victim.isEvoRook) {
                        board = victim.boom(board);
                    }
                }
                else if (to.col === from.col + 2) {
                    const victim = board[from.row][from.col + 1];
                    board[from.row][from.col + 1] = null;
                    if (victim != null && victim.isEvoRook) {
                        board = victim.boom(board);
                    }
                }
                else if (to.col === from.col - 2) {
                    const victim = board[from.row][from.col - 1];
                    board[from.row][from.col - 1] = null;
                    if (victim != null && victim.isEvoRook) {
                        board = victim.boom(board);
                    }
                }
                else {
                    console.log("croissant error");

                }
            }
        }

        if (this.homeSquare) {
            this.homeSquare = false;
        }
        if ((this.color === 'black' && to.row === 7) || (this.color === 'white' && to.row === 0)) {
            const victim = board[to.row][to.col];
            if (victim != null && victim.isEvoRook) {
                board = victim.boom(board);
            }
            return 'PROMOTE';
        }
        const victim = board[to.row][to.col];
        if (!croissanted) {
            board[to.row][to.col] = this;
        }
        board[from.row][from.col] = null;
        if (victim != null && victim.isEvoRook) {
            board = victim.boom(board);
        }

        return board;
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
                        moves.push({ row: row - 1, col: col + 1, type: "passantable" });
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
                        moves.push({ row: row - 1, col: col - 1, type: "passantable" });
                    }
                }
            }

            // Added real En Croissant
            if (inBounds(row - 2, col) && board[row - 2][col] == null) {
                if (board[row - 1][col] != null && board[row - 1][col].color != this.color) {
                    moves.push({ row: row - 2, col: col, type: "croissantable" });
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (board[row][col + 1] != null && board[row][col + 1].color != this.color) {
                    moves.push({ row: row, col: col + 2, type: "croissantable" });
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (board[row][col - 1] != null && board[row][col - 1].color != this.color) {
                    moves.push({ row: row, col: col - 2, type: "croissantable" });
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
                        moves.push({ row: row + 1, col: col + 1, type: "passantable" }); // New key
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
                        moves.push({ row: row + 1, col: col - 1, type: "passantable" });
                    }
                }
            }

            // Added real En Croissant
            if (inBounds(row + 2, col) && board[row + 2][col] == null) {
                if (board[row + 1][col] != null && board[row + 1][col].color != this.color) {
                    moves.push({ row: row + 2, col: col, type: "croissantable" });
                }
            }
            if (inBounds(row, col + 2) && board[row][col + 2] == null) {
                if (board[row][col + 1] != null && board[row][col + 1].color != this.color) {
                    moves.push({ row: row, col: col + 2, type: "croissantable" });
                }
            }
            if (inBounds(row, col - 2) && board[row][col - 2] == null) {
                if (board[row][col - 1] != null && board[row][col - 1].color != this.color) {
                    moves.push({ row: row, col: col - 2, type: "croissantable" });
                }
            }


        }

        return moves;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}