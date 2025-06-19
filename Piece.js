export class Piece {
    constructor(color, rank, file) {
        this.color = color;
        this.rank = rank; // starting row
        this.file = file; // starting col
        this.evod = false;
    }

    getSymbol() {
        return '?';
    }

    getMoves(board, row, col) {
        // GENERAL USE
        return [];
    }

    isPossibleMove(board, row, col, targets) {
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
