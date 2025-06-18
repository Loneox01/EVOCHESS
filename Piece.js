export class Piece {
    constructor(color) {
        this.color = color;
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

    movePiece(board, to, from) {
        board[to.row][to.col] = this;
        board[from.row][from.col] = null;

        return board;
    }
}
