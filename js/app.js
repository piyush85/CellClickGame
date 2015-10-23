"use strict"
var gridGame = window["gridGame"] || {};

(function(gridGame){
    var game = function(userConfig){
        var oThis = this,
            conf = {
                gameCount:10,
                timer:5
            };
        this.attemptCount = 0;
        this.conf = $.extend(conf,userConfig);
        this.timeout = false;
        this.view = new gridGame.GridView(this.conf.canvas, {size: this.conf.gridSize, scale: this.conf.gridScale});
        this.gridCtrl = new gridGame.GridCtrl(this.conf.gameCount,this.conf.gridSize);

        this.view.paintGrid();
        this.conf.buttonEl.off("click").on("click", function(){
            oThis.setGame();
            this.disabled = true;
        }).prop("disabled",false);
        this.view.onCellClick(function(cell){
            if(!oThis.timeout && oThis.gridCtrl.cols[cell.x][cell.y].pristine === false){
                oThis.view.clearCell(oThis.gridCtrl.cols[cell.x][cell.y]);
                oThis.gameWin.call(oThis);
            }

       });
    };
    game.prototype.gameWin = function(){
        if(this.gridCtrl.getDirtyCellCount() === 0){
            window.clearTimeout(this.counter);
            this.resetGame();
            this.notify("You Won!","success")
        }
    }
    game.prototype.gameCounter = function(){
        var oThis = this;
        oThis.counter = window.setTimeout(function(){
            oThis.timeout = true;
            if(oThis.conf.attempt === oThis.attemptCount){
                oThis.notify("Game Over! You Lose","danger");
                oThis.resetGame.call(oThis);
            }else{
                oThis.notify("Time Over for attempt #"+oThis.attemptCount+", your have #"+(oThis.conf.attempt - oThis.attemptCount)+" remaining tries.","warning");
                oThis.setGame.call(oThis);
            }
        },oThis.conf.timer*1000)
    };
    game.prototype.notify = function(Msg,type){
        $.notify({
            message: Msg
        },{
            element: 'body',
            position: null,
            newest_on_top: true,
            type: type,
            placement: {
                from: "top",
                align: "center"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 1000,
            timer: 1000,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="message">{2}</span>' +
            '</div>'
        });
    };
    game.prototype.resetGame = function(){
        this.attemptCount = 0;
        this.timeout = false;
        this.gridCtrl.resetCells(this.view.clearCell, this.view);
        this.conf.buttonEl.prop("disabled",false);
    };
    game.prototype.setGame = function(){
        var oThis = this,
            count = oThis.conf.gameCount - oThis.gridCtrl.getDirtyCellCount();

        oThis.timeout = false;
        oThis.gridCtrl.setCells(count, oThis.view.fillCell, oThis.view);
        oThis.attemptCount++;
        oThis.gameCounter();
    };
    game.prototype.destroy = function(){
        this.conf.canvas[0].getContext('2d').clearRect(0, 0, 251, 251);
        gameConfig = null;
        delete this;
    }
    var gameConfig;

    $("#gameConfigButton").on("click", function(){
        if(gameConfig){
            gameConfig.destroy();
            $("#gameGridContainer").remove("#gameGrid").html('<canvas id="gameGrid"></canvas>');
            $("#gameButtonContainer").remove("#gameButton").html('<button class="btn btn-primary" id="gameButton" type="button" disabled>Start Game</button>');
        }
        gameConfig = new game({
            gridSize:parseInt($("#gridSize").val(),10)||5,
            gridScale:parseInt($("#gridScale").val(),10)||50,
            gameCount:parseInt($("#count").val(),10)||4,
            timer:parseInt($("#timer").val(),10)||4,
            attempt:parseInt($("#attempts").val(),10)|| 3,
            buttonEl:$("#gameButton"),
            canvas:$("#gameGrid")
        });
    })

})(gridGame)

