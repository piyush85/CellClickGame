(function($, window){
    "use strict"
    var GridView = function(canvas, userConfig) {
        var self = this;
        var config = {
            size: 10,
            scale: 10,
            gridStyle: "#eee",
            borderStyle: "#bbb"
        };

        $.extend(config, userConfig);

        this.config = config;
        this.canvas = canvas;

        this.length = config.size * config.scale;
        canvas[0].width = this.length + 1;
        canvas[0].height = this.length + 1;

        canvas.off("click").on("click", canvasClick);

        function canvasClick(e) {
            if (self.onCellClickHandler)
                self.onCellClickHandler(getClickedCell(e));
        }

        function getClickedCell(e) {
            var x;
            var y;
            if (e.pageX !== undefined && e.pageY !== undefined) {
                x = e.pageX;
                y = e.pageY;
            }
            x -= canvas[0].offsetLeft;
            y -= canvas[0].offsetTop;

            var cellX = Math.floor(x / config.scale);
            var cellY = Math.floor(y / config.scale);
            if (cellX < config.size)
                cellX += 1;
            if (cellY < config.size)
                cellY += 1;
            return {x: cellX, y: cellY};
        }
    };

    GridView.prototype.onCellClick = function(handler) {
        this.onCellClickHandler = handler;
    };

    GridView.prototype.fillCell = function(cell) {
        var context = this.canvas[0].getContext("2d");
        var s = this.config.scale;
        cell.pristine = false;
        context.fillRect(cell.x * s - s + 1, cell.y * s - s + 1, s - 1, s - 1);

    };

    GridView.prototype.clearCell = function(cell) {
        var context = this.canvas[0].getContext("2d");
        var s = this.config.scale;
        cell.pristine = true;
        context.clearRect(cell.x * s - s + 1, cell.y * s - s + 1, s - 1, s - 1);
    };


    GridView.prototype.paintGrid = function(style) {
        var context = this.canvas[0].getContext("2d");

        context.beginPath();
        // vertical
        for (var x = this.config.scale; x <= this.length - this.config.scale; x += this.config.scale) {
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, this.length);
        }

        // horisontal
        for (var y = this.config.scale; y <= this.length - this.config.scale; y += this.config.scale) {
            context.moveTo(0, y + 0.5);
            context.lineTo(this.length, y + 0.5);
        }

        context.strokeStyle = style || this.config.gridStyle;
        context.stroke();

        // border
        this.paintBorder(style || this.config.gridStyle);
    };

    GridView.prototype.paintBorder = function(style){
        var context = this.canvas[0].getContext("2d");

        context.beginPath();
        context.moveTo(0.5, 0);
        context.lineTo(0.5, this.length);
        context.moveTo(this.length + 0.5, 0);
        context.lineTo(this.length + 0.5, this.length);

        context.moveTo(0, 0.5);
        context.lineTo(this.length, 0.5);
        context.moveTo(0, this.length + 0.5);
        context.lineTo(this.length, this.length + 0.5);


        context.strokeStyle = style || this.config.borderStyle;
        context.stroke();

    };

    window.gridGame.GridView = GridView;

})(jQuery, window);
