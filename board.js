"use strict";

class Board {
  constructor(M, N, K) {
    this.meta = {
      numRows: M,
      numCols: N,
      numMines: K
    };
    this.symbol = { MINE: "M" };
    this.reset();
  }

  toCoord(idx) {
    return {
      m: Math.floor(idx / this.meta.numCols),
      n: idx % this.meta.numCols
    };
  }

  toIdx(m, n) {
    return m * this.meta.numCols + n;
  }

  get(idx) {
    return this.board[idx];
  }

  findAdjacent(idx, callback) {
    let coord = this.toCoord(idx);
    let m = coord.m;
    let n = coord.n;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let adj = this.toIdx(m + i, n + j);
        if (
          !(i == 0 && j == 0) &&
          m + i >= 0 &&
          m + i < this.meta.numRows &&
          n + j >= 0 &&
          n + j < this.meta.numCols
        ) {
          callback(adj);
        }
      }
    }
  }

  reset() {
    this.board = new Array(this.meta.numRows * this.meta.numCols);
    this.generateMines();
    this.generateNumbers();
  }

  generateMines() {
    this.mines = new Set();
    while (this.mines.size < this.meta.numMines) {
      this.mines.add(
        Math.floor(Math.random() * this.meta.numRows * this.meta.numCols)
      );
    }
    for (let mine of this.mines) {
      this.board[mine] = this.symbol.MINE;
    }
  }

  generateNumbers() {
    this.mines.forEach(idx => {
      this.findAdjacent(idx, idx => {
        if (this.board[idx] != this.symbol.MINE) {
          this.board[idx] = this.board[idx] != null ? this.board[idx] + 1 : 1;
        }
      });
    });
  }

  print() {
    for (let m = 0; m < this.meta.numRows; m++) {
      let row = [];
      for (let n = 0; n < this.meta.numCols; n++) {
        row.push(String(this.board[this.toIdx(m, n)] || " "));
      }
    }
  }

  forEach(callback) {
    for (let i = 0; i < this.meta.numRows * this.meta.numCols; i++) {
      callback(this.get(i), i);
    }
  }

  findUnmarked(idx, callback, visited) {
    //adjacent items to the undefined are also expanded
    if (this.board[idx] != undefined) {
      callback(idx);
      return;
    }

    visited = visited || new Set();
    if (!visited.has(idx)) {
      callback(idx);
      visited.add(idx);
    }

    this.findAdjacent(idx, idx => {
      if (!visited.has(idx)) {
        callback(idx);
        this.findUnmarked(idx, callback, visited);
      }
    });
  }
}
