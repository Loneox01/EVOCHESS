export class Piece {
    constructor(color, rank, file) {
        this.color = color;
        this.rank = rank; // starting row
        this.file = file; // starting col
    }

    getSymbol() {
        return '?';
    }

    getMoves(board, row, col) {
        return [];
    }

    isPossibleMove(board, row, col, targets) {
        return false;
    }

    movePiece(board, to, from, move = null) {
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;

        return board;
    }

    captures(board, row, col, lmp = null) {
        return []
    }
}
