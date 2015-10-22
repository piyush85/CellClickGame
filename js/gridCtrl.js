(function(){
    "use strict"
    var cellFactory = function(x,y,pristine){
        return{
            x:x,
            y:y,
            pristine:pristine || true
        }

    }

    function GridCtrl(count, gridSize){
        this.size = count;
        this.gridSize = gridSize;
        this.cells = [];
        this.cols = [];
        for(var i = 1; i <= count; i++){
            var col = [],
                rowInd = count>gridSize?(i%gridSize!==0?i%gridSize:gridSize):i;

            this.cols[rowInd] = col;
            for(var j = 1; j <= count; j++){
                var colInd = count>gridSize?(j%gridSize!==0?j%gridSize:gridSize):j;
                col[colInd] = cellFactory(rowInd,colInd);
                this.cells.push(col[colInd]);
            }
        }
    }

    GridCtrl.prototype.getCell = function(x,y){
        var cell = this.cols[x][y];
        return cell;
    };
    GridCtrl.prototype.getDirtyCellCount = function(){
        var i,
            oThis = this,
            count = 0;
        for(i in oThis.cells){
            if(oThis.cells[i].pristine === false){
                count++;
            }
        }
        return count;
    };
    GridCtrl.prototype.resetCells = function(viewCb, viewScope){
        var i,
            oThis = this;

        for(i in oThis.cells){
            oThis.cells[i].pristine === true;
            viewCb.call(viewScope,oThis.cells[i]);
        }
    };
    GridCtrl.prototype.getRandomCell = function(isValid){
        var self = this;
        function random(){
            var size = self.size>self.gridSize?self.gridSize:self.size;
            return Math.floor(Math.random() * size) + 1;
        }
        function generateRandomCell(){
            var x = random();
            var y = random();
            var cell = self.getCell(x,y);
            return isValid == null || isValid(cell) ? cell : generateRandomCell();
        }
        return generateRandomCell();
    };
    GridCtrl.prototype.setCells = function(count, viewFillCellFunc, viewScope){
        var i,
            oThis = this;

        for(i=0;i<count;i++){
            viewFillCellFunc.call(viewScope, oThis.getRandomCell(function(cell){
                console.log(cell);
                var size = oThis.size>oThis.gridSize?oThis.gridSize:oThis.size;;
                return (0 < cell.x <= size && 0 < cell.y <= size && cell.pristine===true);
            }));
        }
    };

    window.gridGame.GridCtrl = GridCtrl;

})();