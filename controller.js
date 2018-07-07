"use strict";

//logically bind the representation of the board with the view
class Controller {
  constructor(board, view) {
    this.board = board;
    this.binding = {};
    this.running = true;

    let jView = view.getView();
    view.setListener(this);

    for (let i = 0; i < board.meta.numRows * board.meta.numCols; i++) {
      this.binding[i] = {
        model: board.get(i),
        view: jView[i],
        visited: false,
        marked: false
      };
    }
  }

  onLeftClick(idx) {
    if (!this.running) return;

    let item = this.binding[idx];

    if (item.marked) {
      return;
    }

    //reset currently clicked item state
    item.marked = false;
    item.visited = true;

    //game over
    if (item.model == this.board.symbol.MINE) {
      this.GameOver(item);
      $("#result").text("You Lose");
    }

    item.view.textContent = item.model;

    //reveal the connected elements that are undefined
    this.board.findUnmarked(idx, idx => {
      this.binding[idx].view.textContent = this.binding[idx].model || " ";
      this.binding[idx].view.classList.add("visited");
      this.binding[idx].view.classList.add("_" + this.binding[idx].model); //color classes
      this.binding[idx].visited = true;
    });

    // test win condition
    // all the numbers including undefined have been visited
    // TODO: improve naive approach, save this elsewhere instead of recalc'ing every time
    let visitCount = 0;
    for (let k in this.binding) if (this.binding[k].visited) visitCount++;
    if (
      this.board.meta.numCols * this.board.meta.numRows -
        this.board.meta.numMines ===
      visitCount
    ) {
      this.GameOver();
      $("#result").text("You Win");
    }
  }

  onRightClick(idx) {
    if (!this.running) return;

    let item = this.binding[idx];

    if (item.marked) {
      item.marked = false;
      item.view.textContent = " ";
      return;
    }

    if (!item.visited) {
      item.view.textContent = "?";
      item.marked = true;
    }
  }

  GameOver(clickedItem) {
    //reveal board
    for (let id in this.binding) {
      let item = this.binding[id];
      //mark the flags that player set wrongly
      if (item.marked && item.model != this.board.symbol.MINE) {
        item.view.classList.add("wrong");
      }

      //reveal the rest of the unvisited board
      if (!item.visited) {
        item.view.textContent = item.model || " ";
        item.view.classList.add("revealed");
        item.view.classList.add("_" + item.model);
      }
    }

    if (clickedItem != null) {
      clickedItem.view.classList.add("wrong");
    }

    this.running = false;
  }
}
