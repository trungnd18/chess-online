(function (window) {

    function Game(canvas,stage,socket) {
        var socket=socket;
        socket.on('online',function(data){
            console.log(data);
        })
        var countpress=0;
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
        var vichess=[];
        var self=this;
        this.canvas=canvas;
        this.stage = stage;
        this.domelement= new createjs.Container();
        this.tablechess=new createjs.Container();
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
            this.player= new Player();
            this.player.color=1;
            this.nowplayer=this.player;
            this.stage.enableMouseOver(10);
            this.stage.mouseMoveOutside = true;
            this.item_background = new Item(this._images.background,0,0);
            this.stage.addChild(this.item_background);
            this.item_board = new Item(this._images.board,0,0);
            this.item_board.scaleX=1.5;
            this.item_board.scaleY=0.8;
            this.stage.addChild( this.item_board);
            this.text_board = new Text("Cờ tướng online",10,10," 46px Patrick Hand ","black");
            this.stage.addChild(this.text_board);
            socket.on('room',function(data){
                var text = new Text(data,100,100,"46px Patrick Hand ","black");
                stage.addChild(text);
            })
            this.dom_listroom= this.dom('listroom',100,-380);
            this.domelement.addChild(this.dom_listroom);
            this.dom_add = this.dom('add',100,-50);
            this.domelement.addChild(this.dom_add);
            this.dom_auto = this.dom('auto',250,-50);
            this.domelement.addChild(this.dom_auto);
            stage.addChild(this.domelement);
            this.dom_chatroom = this.dom('chatroom',600,-480);
            stage.addChild(this.dom_chatroom) ;
//            this.chess();
            createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
            createjs.Ticker.addListener(this);
            createjs.Ticker.useRAF = true;
            createjs.Ticker.setFPS(60);
        }
        this.dom=function(id,x,y){
            var form = document.getElementById(id);
            var add = new createjs.DOMElement(form);
            add.x=x;
            add.y=y;
            return add;
        }
        this.tick=function(){
            this.stage.update();
            if(this.isSelect){
                this.isSelect=0;
            }
        }
        this.chess=function(array){
            if(array==null) array=chessArray;
            var item = new Item(this._images.table,100,50);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.tablechess.addChild(item);
            var item = new Item(this._images.table_frame,80,30);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.tablechess.addChild(item);
            this.loadChess(array);
        }
        this.loadChess=function(chessArr){
            for(var i=0;i<10;i++){
                for(var j=0;j<9;j++){
                    var imagechess;
//                    chessBitmap[i][j]=null;
                    if(chessArr[i][j]!=0){
                        switch (chessArr[i][j]) {
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
                        item.count= chessArr[i][j];
                        item.page={x:j,y:i};
                        this.tablechess.addChild(item);
                        chessBitmap[i+"|"+j]=item;
                    }
                }
            }
            stage.addChild(this.tablechess);
        }
        this.onLoad=function(callback){
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
                       callback();
                        console.log("Load complete");
                    }else{
                    }
                };
                this._images[src].src = res[src];
            }
        }
        this.createMove=function(chess){
            KnightMove(chess);
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
            if(self.nowplayer.color/this.count>0){
                if(!jQuery.isEmptyObject( self.chessrush)){
                    for(var i=0;i< self.chessrush.length;i++){
                        self.stage.removeChild(self.chessrush[i]);
                    }
                    self.chessrush=new Array();
                }
                this.scaleX=0.5;
                this.scaleY=0.5;
               if(!this.ispress){
                   self.isSelect=1;
                   self.movefrom=this.page;
                   self.dfchess=this;
                   switch(Math.abs(this.count)){
                       case 10: KingMove(this);break;
                       case 1: PawnMove(this);break;
                       case 2: ElephanMove(this);break;
                       case 3: BishopMove(this);break;
                       case 4: KnightMove(this);break;
                       case 5: CannonMove(this);break;
                       case 6: RookMove(this);break;
                   }
                   this.ispress=1;
               }else{
                   self.isSelect=0;
                   this.ispress=0;
               }
            }else{
                alert("Không thể");
            }
       }
        function KnightMove(chess){
            for(var i=0;i<10;i++){
                for(var j=0;j<9;j++){
                    if((chess.page.x-j)*(chess.page.x-j)+(chess.page.y-i)*(chess.page.y-i)==5){
                        for(var ik=0;ik<10;ik++){
                            for(var jk=0;jk<9;jk++){
                                var temp=(jk-chess.page.x)*(jk-chess.page.x)+(ik-chess.page.y)*(ik-chess.page.y);
                                var temp1=(4*jk-3*chess.page.x-j)*(4*jk-3*chess.page.x-j)
                                    +(4*ik-3*chess.page.y-i)*(4*ik-3*chess.page.y-i);
                                if(temp==1&&temp1==5){
                                    if(chessArray[ik][jk]==0){
                                        if(chessArray[i][j]==0||chessArray[i][j]/chess.count<0)
                                        vitualchess(chess,i,j);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        function RookMove(chess){
            for(var k=chess.page.y+1;k<10;k++){
                if(chessArray[k][chess.page.x]==0){
                    vitualchess(chess,k,chess.page.x);
                }else{
                    if(chessArray[k][chess.page.x]/chess.count<0)
                    vitualchess(chess,k,chess.page.x);
                    break;
                }
            }
            for(var k=chess.page.y-1;k>-1;k--){
                if(chessArray[k][chess.page.x]==0){
                    vitualchess(chess,k,chess.page.x);
                }else{
                    if(chessArray[k][chess.page.x]/chess.count<0)
                    vitualchess(chess,k,chess.page.x);
                    break;
                }
            }
            for(var k=chess.page.x+1;k<9;k++){
                if(chessArray[chess.page.y][k]==0){
                    vitualchess(chess,chess.page.y,k);
                }else{
                    if(chessArray[chess.page.y][k]/chess.count<0)
                    vitualchess(chess,chess.page.y,k);
                    break;
                }
            }
            for(var k=chess.page.x-1;k>-1;k--){
                if(chessArray[chess.page.y][k]==0){
                    vitualchess(chess,chess.page.y,k);
                }else{
                    if(chessArray[chess.page.y][k]/chess.count<0)
                    vitualchess(chess,chess.page.y,k);
                    break;
                }
            }
        }
        function CannonMove(chess){
            for(var k=chess.page.y+1;k<10;k++){
                if(chessArray[k][chess.page.x]==0){
                    vitualchess(chess,k,chess.page.x);
                }else{
                    for(var m=k+1;m<10;m++){
                        if(chessArray[m][chess.page.x]!=0&&chessArray[m][chess.page.x]/chess.count<0){
                            vitualchess(chess,m,chess.page.x);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.y-1;k>-1;k--){
                if(chessArray[k][chess.page.x]==0){
                    vitualchess(chess,k,chess.page.x);
                }else{
                    for(var m=k-1;m>-1;m--){
                        if(chessArray[m][chess.page.x]!=0&&chessArray[m][chess.page.x]/chess.count<0){
                            vitualchess(chess,m,chess.page.x);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.x+1;k<9;k++){
                if(chessArray[chess.page.y][k]==0){
                    vitualchess(chess,chess.page.y,k);
                }else{
                    for(var m=k+1;m<9;m++){
                        if(chessArray[chess.page.y][m]!=0&&chessArray[chess.page.y][m]/chess.count<0){
                            vitualchess(chess,chess.page.y,m);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.x-1;k>-1;k--){
                if(chessArray[chess.page.y][k]==0){
                    vitualchess(chess,chess.page.y,k);
                }else{
                    for(var m=k-1;m>-1;m--){
                        if(chessArray[chess.page.y][m]!=0&&chessArray[chess.page.y][m]/chess.count<0){
                            vitualchess(chess,chess.page.y,m);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        function BishopMove(chess){
           if(chess.count<0){
               if(Math.pow(4-chess.page.x,2)+Math.pow(8-chess.page.y,2)!=1){
                   for(var i=7;i<10;i++){
                       for(var j=3;j<6;j++){
                               if(chessArray[i][j]>=0) {
                                   if(Math.pow(j-chess.page.x,2)+Math.pow(i-chess.page.y,2)==2)
                                       vitualchess(chess,i,j);
                               }
                            }
                       }
               }
           }else if(chess.count>0){
               if(Math.pow(4-chess.page.x,2)+Math.pow(1-chess.page.y,2)!=1)
               for(var i=0;i<3;i++){
                   for(var j=3;j<6;j++){
                           if(chessArray[i][j]<=0) {
                               if(Math.pow(j-chess.page.x,2)+Math.pow(i-chess.page.y,2)==2)
                                   vitualchess(chess,i,j);
                           }
                    }
               }
           }
        }
        function KingMove(chess){
            if(chess.count<0){
                for(var i=7;i<10;i++){
                    for(var j=3;j<6;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                            if(chessArray[i][j]>=0){
                                vitualchess(chess,i,j);
                            }
                        }
                    }
                }
            }else if(chess.count>0){
                for(var i=0;i<3;i++){
                    for(var j=3;j<6;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                            if(chessArray[i][j]<=0){
                                vitualchess(chess,i,j);
                            }
                        }
                    }
                }
            }
        }
        function ElephanMove(chess){
            if(chess.count<0){
                for(var i=5;i<10;i++){
                    for(var j=0;j<9;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==8){
                            if(chessArray[i][j]>=0
                                &&chessArray[(i+chess.page.y)/2][(j+chess.page.x)/2]==0){
                                    vitualchess(chess,i,j);
                            }
                        }
                    }
                }
            }else if(chess.count>0){
                for(var i=0;i<5;i++){
                    for(var j=0;j<9;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==8){
                            if(chessArray[i][j]>=0
                                &&chessArray[(i+chess.page.y)/2][(j+chess.page.x)/2]==0){
                                vitualchess(chess,i,j);
                            }
                        }
                    }
                }
            }
        }
        function PawnMove(chess){
            if(chess.count<0){
                for(var i=chess.page.y;i>-1;i--){
                    for(var j=0;j<9;j++){

                            if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                                if(chessArray[i][j]>=0){
                                    if(i<=4)
                                    vitualchess(chess,i,j);
                                    else if(chess.page.y-i==1){
                                        vitualchess(chess,i,j);
                                    }

                                }
                            }
                    }
                }
            }else if(chess.count>0){
                for(var i=chess.page.y;i<10;i++){
                    for(var j=0;j<9;j++){

                            if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                                if(chessArray[i][j]<=0){
                                    if(i>=5)
                                    vitualchess(chess,i,j);
                                    else if(i-chess.page.y==1){
                                        vitualchess(chess,i,j);
                                    }
                                }
                            }
                    }
                }
            }
        }
        function vitualchess(chess,i,j){
            var myObjTwo = jQuery.extend(true, {}, chess);
            myObjTwo.main=chess;
            myObjTwo.x= 43*j+85;
            myObjTwo.y= 44*i+38;
            myObjTwo.scaleX=0.5;
            myObjTwo.scaleY=0.5;
            myObjTwo.alpha=0.4;
            myObjTwo.page={x:j,y:i};
            myObjTwo.selfmain=self;
            myObjTwo.mousepress=function(){
                socket.emit("chess",{
                    from:{x:this.main.x,y:this.main.y,count:this.main.count,page:this.main.page},
                    to:{x:this.x,y:this.y,count:this.count,page:this.page}
                });
                if(chessArray[this.page.y][this.page.x]!=0){
                    var tem= chessBitmap[this.page.y+"|"+this.page.x];
                    this.selfmain.tablechess.removeChild(tem);
                    chessBitmap[this.page.y+"|"+this.page.x]=null;
                }
                this.main.ispress=0;
                this.main.x=this.x;
                this.main.y=this.y;
                chessArray[this.main.page.y][this.main.page.x]=0;
                this.main.page=this.page;
                chessArray[this.main.page.y][this.main.page.x]=this.main.count;
                if(!jQuery.isEmptyObject( self.chessrush)){
                    for(var i=0;i< self.chessrush.length;i++){
                        self.tablechess.removeChild(self.chessrush[i]);
                    }
                    self.chessrush=new Array();
                }
            }
            self.chessrush.push(myObjTwo);
            self.tablechess.addChild(myObjTwo);
        }
    }
    var res = {
        background:"images/background.png",
        table:"images/ban1.jpg",
        table_frame:"images/ban1_khung.png",
        bishop_dark:"images/bishop_dark.png" ,
        bishop_red:"images/bishop_red.png",
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
        rook_dark:"images/rook_dark.png",
        board:"images/bang_go.png"


    };
    var res2 = {

    };
    window.Game = Game;
}(window)) ;