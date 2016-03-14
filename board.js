'use strict';

var Board = function(M, N, K) {
    this.meta = {
        numRows: M,
        numCols: N,
        numMines: K,
    }

    this.symbol = { MINE: 'M' };

    this.reset();
}

Board.prototype.toCoord = function(idx) {
    return { m: Math.floor(idx / this.meta.numCols), n: idx % this.meta.numCols }
}

Board.prototype.toIdx = function(m, n) {
    return m * this.meta.numCols + n;
}

Board.prototype.get = function(idx) {
    return this.board[idx];
}

Board.prototype.findAdjacent = function(idx, callback) {
    let coord = this.toCoord(idx);
    let m = coord.m;
    let n = coord.n;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let adj = this.toIdx(m + i, n + j);
            if (!(i == 0 && j == 0) &&
                (m + i) >= 0 && (m + i) < this.meta.numRows &&
                (n + j) >= 0 && (n + j) < this.meta.numCols) {
                callback(adj);
            };
        }
    }
};

Board.prototype.reset = function() {
    this.board = new Array(this.meta.numRows * this.meta.numCols);
    this.generateMines();
    this.generateNumbers();
}

Board.prototype.generateMines = function() {
    this.mines = new Set();
    while (this.mines.size < this.meta.numMines) {
        this.mines.add(Math.floor((Math.random() * this.meta.numRows * this.meta.numCols)));
    }
    for (let mine of this.mines) {
        this.board[mine] = this.symbol.MINE;
    }
}

Board.prototype.generateNumbers = function() {
    var self = this;

    this.mines.forEach(function(idx) {
        self.findAdjacent(idx, function(idx) {
            if (self.board[idx] != self.symbol.MINE) {
                self.board[idx] = (self.board[idx] != null) ? self.board[idx] + 1 : 1;
            }
        });
    });
}

Board.prototype.print = function() {
    for (let m = 0; m < this.meta.numRows; m++) {
        var row = [];
        for (let n = 0; n < this.meta.numCols; n++) {
            row.push(String(this.board[this.toIdx(m, n)] || " "));
        }
        console.log(row);
    };
};

Board.prototype.forEach = function(callback) {
    for (let i = 0; i < this.meta.numRows * this.meta.numCols; i++) {
        callback(this.get(i), i);
    }
}

Board.prototype.findUnmarked = function(idx, callback, visited) {
    var self = this;

    //adjacent items to the undefined are also expanded
    if (this.board[idx] != undefined) {
        callback(idx);
        return;
    };

    var visited = visited || new Set();
    if (!visited.has(idx)) {
        callback(idx);
        visited.add(idx);
    }
    
    this.findAdjacent(idx, function(idx) {
        if (!visited.has(idx)) {
            callback(idx);
            self.findUnmarked(idx, callback, visited);
        }
    });
};