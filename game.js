'use strict';

$(document).ready(function() {
    var difficulty_list = [
        { val: [9, 9, 10], text: 'Easy 9x9' },
        { val: [16, 16, 40], text: 'Medium 16x16' },
        { val: [30, 16, 60], text: 'Expert 30x16' }
    ];
    
    var reset = function() {
        var val;
        var text = $("select option:selected").text()
        for (var difficulty of difficulty_list) {
            if (difficulty.text === text) {
                val = difficulty.val;
                break;
            }
        }
        var model = new Board(val[0], val[1], val[2]);
        var view = new View(model);
        var controller = new Controller(model, view);
        model.print();
    }
    
    var sel = $('<select>').appendTo('#difficulty-selection');
    $(difficulty_list).each(function() {
        sel.append($("<option>").attr('value', this.val).text(this.text));
    });

    sel.change(reset).change();
    
    var reset = $('#reset').click(reset);
});
