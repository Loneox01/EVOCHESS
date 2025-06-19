import { Knight } from './Knight.js';

export class EvoKnight extends Knight {
    constructor(color, rank, file) {
        super(color, rank, file);
        this.evod = true;
    }
}

function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
