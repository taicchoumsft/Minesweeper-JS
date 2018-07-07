"use strict";

class View {
  constructor(board) {
    $("#board").empty();
    let table = $("<table/>");
    for (let i = 0; i < board.meta.numRows; i++) {
      let row = $("<tr/>");
      for (let j = 0; j < board.meta.numCols; j++) {
        let btn = $("<td/>").attr({ id: board.toIdx(i, j) });
        row.append(btn);
      }
      table.append(row);
    }
    $("#board").append(table);

    //unbind default right click context menu
    $("#board tbody").bind("contextmenu", function(e) {
      return false;
    });
  }

  getView() {
    return $("td");
  }

  setListener(controller) {
    //attach delegate listener to table
    $("#board tbody").on("mousedown", "td", function(evt) {
      switch (evt.which) {
        case 1: //left mouse button
          controller.onLeftClick(evt.target.id);
          break;
        case 3: //right mouse button
          controller.onRightClick(evt.target.id);
          break;
        default:
          break;
      }
    });
  }
}
