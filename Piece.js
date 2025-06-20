export class Piece {
    constructor(color, rank, file) {
        this.color = color;
        this.rank = rank; // current row
        this.file = file; // current col
        this.evod = false;
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

        board[to.row][to.col] = this;
        board[from.row][from.col] = null;

        this.rank = to.row;
        this.file = to.col;

        return board;
    }

    captures(board, row, col, lmp = null) {
        return []
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
