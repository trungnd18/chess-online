(function (window) {
    var countpress=0;
    function Game(canvas,stage) {
        var chessArray=
            [   [6,4,2,3,10,3,2,4,6],
                [0,0,0,0,0,0,0,0,0],
                [0,5,0,0,0,0,0,5,0],
                [1,0,1,0,1,0,1,0,1],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [-1,0,-1,0,-1,0,-1,0,-1],
                [0,-5,0,0,0,0,0,-5,0],
                [0,0,0,0,0,0,0,0,0],
                [-6,-4,-2,-3,-10,-3,-2,-4,-6]
            ];
        var chessBitmap=[];
        var self=this;
        this.canvas=canvas;
        this.stage = stage;
        this.ease =  createjs.Ease;
        this._sound={};
        this._images={};
        this.canvas.onmousemove = canvas_mousemove;
        this.canvas.onmousedown=canvas_mousedown;
        this.canvas.onmouseup=canvas_mouseup;
        function canvas_mousemove(e) {
            targetX = e.pageX - canvas.offsetLeft;
            targetY = e.pageY - canvas.offsetTop;
        }
        function canvas_mousedown(e){
            targetX = e.pageX - canvas.offsetLeft;
            targetY = e.pageY - canvas.offsetTop;
        }
        function canvas_mouseup(e){
            targetX = e.pageX - canvas.offsetLeft;
            targetY = e.pageY - canvas.offsetTop;
        }

        this.onStart=function(){
            this.isSelect=0;
            this.isMove=0;
            this.movefrom={};
            this.moveto={};
            this.dfchess={};
            this.chessrush=new Array();
            displayMenu = new createjs.Container();
            this.stage.enableMouseOver(10);
            this.stage.mouseMoveOutside = true;
            var item = new Item(this._images.background,0,0);
            this.stage.addChild(item);
            this.chess();
            createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
            createjs.Ticker.addListener(this);
            createjs.Ticker.useRAF = true;
            createjs.Ticker.setFPS(60);
        }
        this.tick=function(){
            this.stage.update();
            if(this.isSelect){

                this.isSelect=0;
            }
        }
       this.chess=function(){
            var item = new Item(this._images.table,100,50);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.stage.addChild(item);
            var item = new Item(this._images.table_frame,80,30);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.stage.addChild(item);
            for(var i=0;i<10;i++){
                for(var j=0;j<9;j++){
                    var imagechess;
                    if(chessArray[i][j]!=0){
                        switch (chessArray[i][j]) {
                            case 1: imagechess=this._images.pawn_dark;break;
                            case -1: imagechess=this._images.pawn_red;break;
                            case 2: imagechess=this._images.elephan_dark;break;
                            case -2: imagechess=this._images.elephan_red;break;
                            case 3: imagechess=this._images.bishop_dark;break;
                            case -3: imagechess=this._images.bishop_red;break;
                            case 4: imagechess=this._images.knight_dark;break;
                            case -4: imagechess=this._images.knight_red;break;
                            case 5: imagechess=this._images.cannon_dark;break;
                            case -5: imagechess=this._images.cannon_red;break;
                            case 6: imagechess=this._images.rook_dark;break;
                            case -6: imagechess=this._images.rook_red;break;
                            case 10: imagechess=this._images.king_dark;break;
                            case -10: imagechess=this._images.king_red;break;
                            default:
                        }
                        var item = new Item(imagechess,43*j+85,44*i+38,null,mouseover,mouseout,mousepress);
                        item.scaleX=0.5 ;
                        item.scaleY=0.5;
                        item.count= chessArray[i][j];
                        item.page={x:i,y:j};
                        this.stage.addChild(item);
                        chessBitmap[i][j]=item;
                    }
                }
            }
        }
       this.onLoad=function(){
            var i = 0, j = 0;
            var loadedImages = 0;
            var numImages = 0;
            var loadedSounds = 0;
            var numSounds = 0;
            for (var src in res) {
                numImages++;
            }
            for (var src in res2) {
                numSounds++;
            }

            for (var src in res2) {
                this._sound[src] = new Audio();
                this._sound[src].src = res2[src];
            }
            for (var src in res) {

                this._images[src] = new Image();
                var self=this;
                this._images[src].onload = function() {
                    if (++loadedImages >= numImages) {
                        self.onStart();
                        console.log("Load complete");
                    }else{
                    }
                };
                this._images[src].src = res[src];
            }
        }
       this.createMove=function(chess){

       }
       var mouseover=function(){
            this.scaleX=0.6;
            this.scaleY=0.6;
       }
       var mouseout=function(){
            this.scaleX=0.5;
            this.scaleY=0.5;
       }
       var mousepress=function (evt){
           this.scaleX=0.5;
           this.scaleY=0.5;
           self.isSelect=1;
           self.movefrom=this.page;
           self.dfchess=this;
           if(!jQuery.isEmptyObject( self.chessrush)){
               for(var i=0;i< self.chessrush.length;i++){
                   self.stage.removeChild(self.chessrush[i]);
               }
               self.chessrush=new Array();
           }
           var myObjTwo = jQuery.extend(true, {}, this);
           myObjTwo.x=100;
           myObjTwo.scaleX=0.5;
           myObjTwo.scaleY=0.5;
           myObjTwo.alpha=0.4;
           self.chessrush.push(myObjTwo);
           self.stage.addChild(myObjTwo);

       }
    }
    function KnightMove(chess){
        for(var i=0;i<10;i++){
            for(var j=0;j<9;j++){
            }
        }
    }

    var res = {

        background:"images/background.png",
        table:"images/ban1.jpg",
        table_frame:"images/ban1_khung.png",
        bishop_dark:"images/bishop_dark.png" ,  // Sỹ
        bishop_red:"images/bishop_red.png",   // Sỹ
        cannon_dark:"images/cannon_dark.png",
        cannon_red:"images/cannon_red.png",
        elephan_dark:"images/elephan_dark.png",
        elephan_red:"images/elephan_red.png",
        king_dark:"images/king_dark.png",
        king_red:"images/king_red.png",
        knight_red:"images/knight_red.png",
        knight_dark:"images/knight_dark.png",
        pawn_dark:"images/pawn_dark.png",
        pawn_red:"images/pawn_red.png",
        rook_red:"images/rook_red.png",
        rook_dark:"images/rook_dark.png"


    };
    var res2 = {

    };
    window.Game = Game;
}(window)) ;