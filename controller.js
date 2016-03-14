'use strict';

//logically bind the representation of the board with the view
var Controller = function(board, view) {
    this.board = board;
    this.binding = {};
    this.running = true;
        
    let jView = view.getView();
    view.setListener(this);
     
    for (let i = 0; i < board.meta.numRows * board.meta.numCols; i++) {
        this.binding[i] = { model: board.get(i), 
            view: jView[i],
            visited: false,
            marked: false,
        }
    }
}

Controller.prototype.onLeftClick = function(idx) {
    if (!this.running) return;
    
    let item = this.binding[idx];

    if (item.marked){
        return;
    }
    
    //reset currently clicked item state
    item.marked = false;
    item.visited = true;
    
    //game over
    if (item.model == this.board.symbol.MINE) {
        this.GameOver(item);
        $('#result').text("You Lose");
    }
    
    item.view.textContent = item.model;

    var self = this;
    //reveal the connected elements that are undefined
    this.board.findUnmarked(idx, function(idx) {
        self.binding[idx].view.textContent = self.binding[idx].model || " ";
        self.binding[idx].view.classList.add('visited');
        self.binding[idx].view.classList.add("_"+self.binding[idx].model);  //color classes
        self.binding[idx].visited = true;
    })
    
    // test win condition
    // all the numbers including undefined have been visited
    // TODO: improve naive approach, save this elsewhere instead of recalc'ing every time
    var visitCount = 0;
    for (let k in this.binding) if (this.binding[k].visited) visitCount++;
    if (this.board.meta.numCols * this.board.meta.numRows - this.board.meta.numMines === visitCount){
        this.GameOver();
        $('#result').text("You Win");
    }
}

Controller.prototype.onRightClick = function(idx) {
    if (!this.running) return;

    let item = this.binding[idx];
    
    if (item.marked){
        item.marked = false;
        item.view.textContent = " ";
        return;        
    }
    
    if (!item.visited){
        item.view.textContent = "?";
        item.marked = true;
    }
}

Controller.prototype.GameOver = function(clickedItem){
    //reveal board
    for (let id in this.binding) {
        let item = this.binding[id];
        //mark the flags that player set wrongly
        if (item.marked && item.model != this.board.symbol.MINE) {
            item.view.classList.add('wrong');
        }

        //reveal the rest of the unvisited board
        if (!item.visited) {
            item.view.textContent = item.model || " ";
            item.view.classList.add('revealed');
            item.view.classList.add("_"+item.model);
        }
    };

    if (clickedItem!=null){
        clickedItem.view.classList.add('wrong');
    }
    
    this.running = false;
}
