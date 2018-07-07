"use strict";

$(document).ready(function() {
  let difficulty_list = [
    { val: [9, 9, 10], text: "Easy 9x9" },
    { val: [16, 16, 40], text: "Medium 16x16" },
    { val: [30, 16, 60], text: "Expert 30x16" }
  ];

  let reset = function() {
    let difficulty = difficulty_list.find(function(el) {
      return el.text === $("select option:selected").text();
    });

    let model = new Board(...difficulty.val);
    let view = new View(model);
    new Controller(model, view);
  };

  let sel = $("<select>").appendTo("#difficulty-selection");
  $(difficulty_list).each(function() {
    sel.append(
      $("<option>")
        .attr("value", this.val)
        .text(this.text)
    );
  });

  sel.change(reset).change();

  $("#reset").click(reset);
});
