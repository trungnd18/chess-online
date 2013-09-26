(function (window) {

    function Game(canvas,stage,socket) {
        var socket=socket;
        socket.on('online',function(data){
            console.log(data);
        })
        socket.on('callback',function(data){
            if(data.checkmate==1){
                self.item_checkmate=new Item(self._images.checkmate,0,0);
                self.stage.addChild(self.item_checkmate);
                var refreshIntervalId=setInterval(function(){
                    if(self.item_checkmate.alpha<0){
                        clearInterval(refreshIntervalId);
                    }else{
                        self.item_checkmate.alpha-=0.1;
                    }
                },100);
            }
            if(data.move==1){
                console.log(data);
            }
        })
        var countpress=0;
        var chessArray;
        var chessBitmap=[];
        var self=this;
        this.canvas=canvas;
        this.stage = stage;
        this.domelement= new createjs.Container();
        this.tablechess=new createjs.Container();
        this.ease =  createjs.Ease;
        this._sound={};
        this._images={};
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
            this.text_board = new Text("Cờ tướng online",10,10," 40px Patrick Hand ","black");
            this.stage.addChild(this.text_board);
            socket.on('room',function(data){
                var text = new Text(data,100,100,"46px Patrick Hand ","black");
                stage.addChild(text);
            })
            this.dom_listroom= this.dom('listroom',100,-380);
            this.domelement.addChild(this.dom_listroom);
            this.dom_add = this.dom('add',100,-50);
            this.domelement.addChild(this.dom_add);
            this.dom_auto = this.dom('auto',220,-50);
            this.domelement.addChild(this.dom_auto);
            this.dom_type = this.dom('type',380,-50);
            this.domelement.addChild(this.dom_type);
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
        this.chess=function(){
            this._sound.theme.pause();
            this._sound.theme1.play();
            chessBitmap=[];
            chessArray=
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
            var item = new Item(this._images.table,100,50);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.tablechess.addChild(item);
            var item = new Item(this._images.table_frame,80,30);
            item.scaleX=0.8 ;
            item.scaleY=0.8;
            this.tablechess.addChild(item);
            this.loadChess(chessArray);
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
                this._sound[src].onload = function() {
                    if (++loadedSounds >= numSounds) {
                        console.log("LoadComplete");
                    }else{
                    }
                };
                this._sound[src].src = res2[src];
            }
            for (var src in res) {

                this._images[src] = new Image();
                this._images[src].onload = function() {
                    if (++loadedImages >= numImages) {
                        $("#loading").modal('hide');
                        callback();
                    }else{
                        $("#loading").modal('show');
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
            if(1){
                if(!jQuery.isEmptyObject( self.chessrush)){
                    for(var i=0;i< self.chessrush.length;i++){
                        self.tablechess.removeChild(self.chessrush[i]);
                    }
                    self.chessrush=new Array();
                }
                this.scaleX=0.5;
                this.scaleY=0.5;
               if(!this.ispress){
                   self._sound.click.play();
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
        function KnightMove(chess,isKing){
            for(var i=0;i<10;i++){
                for(var j=0;j<9;j++){
                    if((chess.page.x-j)*(chess.page.x-j)+(chess.page.y-i)*(chess.page.y-i)==5){
                        for(var ik=0;ik<10;ik++){
                            for(var jk=0;jk<9;jk++){
                                if(isKing!=1){
                                    var temp=Math.pow(jk-chess.page.x,2)+Math.pow(ik-chess.page.y,2);
                                    var temp1=Math.pow(4*jk-3*chess.page.x-j,2)+Math.pow(4*ik-3*chess.page.y-i,2);
                                }else if(isKing==1){
                                    var temp=Math.pow(jk-j,2)+Math.pow(ik-i,2);
                                    var temp1=Math.pow(4*jk-3*j-chess.page.x,2)+Math.pow(4*ik-3*i-chess.page.y,2);
                                }
                                if(temp==1&&temp1==5){
                                    if(chessArray[ik][jk]==0){
                                        if(chessArray[i][j]==0||chessArray[i][j]/chess.count<0)   {
                                           if(isKing==1&&Math.abs(chessArray[i][j])==4){
                                                return 1;
                                           }else{
                                               if(isKing!=1) vitualchess(chess,i,j);
                                           }
                                        }

                                    }
                                }

                            }
                        }
                    }
                }
            }
            return 0;
        }
        function RookMove(chess,isKing){
            for(var k=chess.page.y+1;k<10;k++){
                if(chessArray[k][chess.page.x]==0){
                    if(isKing!=1)vitualchess(chess,k,chess.page.x);
                }else{
                    if(chessArray[k][chess.page.x]/chess.count<0) {
                         if(isKing==1&&Math.abs(chessArray[k][chess.page.x])==6)
                              return 1;
                         else   {
                             if(isKing!=1) vitualchess(chess,k,chess.page.x);
                                 }

                    }
                    break;
                }
            }
            for(var k=chess.page.y-1;k>-1;k--){
                if(chessArray[k][chess.page.x]==0){
                    if(isKing!=1)vitualchess(chess,k,chess.page.x);
                }else{
                    if(chessArray[k][chess.page.x]/chess.count<0)   {
                        if(isKing==1&&Math.abs(chessArray[k][chess.page.x])==6)
                            return 1;
                        else   {
                            if(isKing!=1)  vitualchess(chess,k,chess.page.x);
                        }

                    }
                    break ;
                }
            }
            for(var k=chess.page.x+1;k<9;k++){
                if(chessArray[chess.page.y][k]==0){
                    if(isKing!=1)  vitualchess(chess,chess.page.y,k);
                }else{
                    if(chessArray[chess.page.y][k]/chess.count<0)  {
                        if(isKing==1&&Math.abs(chessArray[chess.page.y][k])==6)
                              return 1;
                        else  {
                            if(isKing!=1) vitualchess(chess,chess.page.y,k);
                        }

                    }
                    break;
                }
            }
            for(var k=chess.page.x-1;k>-1;k--){
                if(chessArray[chess.page.y][k]==0){
                    if(isKing!=1) vitualchess(chess,chess.page.y,k);
                }else{
                    if(chessArray[chess.page.y][k]/chess.count<0){
                        if(isKing==1&&Math.abs(chessArray[chess.page.y][k])==6)
                            return 1;
                        else {
                            if(isKing!=1) vitualchess(chess,chess.page.y,k);
                        }
                    }
                    break;
                }
            }
            return 0;
        }
        function CannonMove(chess,isKing){
            for(var k=chess.page.y+1;k<10;k++){
                if(chessArray[k][chess.page.x]==0){
                    if(isKing!=1) vitualchess(chess,k,chess.page.x);
                }else{
                    for(var m=k+1;m<10;m++){
                        if(chessArray[m][chess.page.x]*chess.count>0) break;
                        else if(chessArray[m][chess.page.x]*chess.count<0){
                            if(Math.abs(chessArray[m][chess.page.x])==5&&isKing==1) return 1;
                            else
                            if(isKing!=1) vitualchess(chess,m,chess.page.x);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.y-1;k>-1;k--){
                if(chessArray[k][chess.page.x]==0){
                    if(isKing!=1) vitualchess(chess,k,chess.page.x);
                }else{
                    for(var m=k-1;m>-1;m--){
                        if(chessArray[m][chess.page.x]*chess.count>0) break;
                        else if(chessArray[m][chess.page.x]*chess.count<0){
                            if(Math.abs(chessArray[m][chess.page.x])==5&&isKing==1) return 1;
                            else
                                if(isKing!=1) vitualchess(chess,m,chess.page.x);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.x+1;k<9;k++){
                if(chessArray[chess.page.y][k]==0){
                    if(isKing!=1) vitualchess(chess,chess.page.y,k);
                }else{
                    for(var m=k+1;m<9;m++){
                        if(chessArray[chess.page.y][m]*chess.count>0) break;
                        else if(chessArray[chess.page.y][m]*chess.count<0){
                            if(Math.abs(chessArray[chess.page.y][m])==5&&isKing==1) return 1;
                            else
                            if(isKing!=1) vitualchess(chess,chess.page.y,m);
                            break;
                        }
                    }
                    break;
                }
            }
            for(var k=chess.page.x-1;k>-1;k--){
                if(chessArray[chess.page.y][k]==0){
                    if(isKing!=1) vitualchess(chess,chess.page.y,k);
                }else{
                    for(var m=k-1;m>-1;m--){
                        if(chessArray[chess.page.y][m]*chess.count>0) break;
                        else if(chessArray[chess.page.y][m]*chess.count<0){
                            if(Math.abs(chessArray[chess.page.y][m])==5&&isKing==1) return 1;
                            else
                            if(isKing!=1) vitualchess(chess,chess.page.y,m);
                            break;
                        }
                    }
                    break;
                }
            }
            return 0;
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
        function KingMove(chess,isKing){
            if(chess.count<0){
                for(var i=7;i<10;i++){
                    for(var j=3;j<6;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                            if(chessArray[i][j]>=0){
                                for(var k=i;k>0;k--){
                                    if(chessArray[k][j]!=10&&chessArray[k][j]!=0){
                                      if(isKing!=1)
                                          vitualchess(chess,i,j);
                                          break;
                                    }else if(chessArray[k][j]==10){
                                        return 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }else if(chess.count>0){
                for(var i=0;i<3;i++){
                    for(var j=3;j<6;j++){
                        if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                            if(chessArray[i][j]<=0){
                                for(var k=i;k<10;k++){
                                    if(chessArray[k][j]!=-10&&chessArray[k][j]!=0){
                                        if(isKing!=1) vitualchess(chess,i,j);
                                        break;
                                    }else if(chessArray[k][j]==-10){
                                        return 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return 0;
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
        function PawnMove(chess,isKing,array){
            if(chess.count<0){
                for(var i=chess.page.y;i>-1;i--){
                    for(var j=0;j<9;j++){
                            if(Math.pow(i-chess.page.y,2)+Math.pow(j-chess.page.x,2)==1){
                                if(chessArray[i][j]>=0){
                                    if(i<=4)   {
                                            if(isKing!=1) vitualchess(chess,i,j);
                                    }
                                    else{
                                        if(isKing==1&&Math.abs(chessArray[i][j])==1) return 1;
                                        if(chess.page.y-i==1){
                                            if(isKing!=1) vitualchess(chess,i,j);
                                        }
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
                                    if(i>=5) {
                                            if(isKing!=1) vitualchess(chess,i,j);
                                    } else{
                                        if(isKing==1&&Math.abs(chessArray[i][j])==1) return 1;
                                        if(i-chess.page.y==1){
                                            if(isKing!=1) vitualchess(chess,i,j);
                                        }
                                    }
                                }
                            }
                    }
                }
            }
           return 0;
        }
        function FuckKing(array,bitmap){
             for(var i=0;i<10;i++){
                 for(var j=0;j<9;j++){
                         if(Math.abs(array[i][j])==10){
                             if(KnightMove(bitmap[i+"|"+j],1)||RookMove(bitmap[i+"|"+j],1)
                                 ||CannonMove(bitmap[i+"|"+j],1)||PawnMove(bitmap[i+"|"+j],1)) {
                                 return array[i][j]/10;
                             }
                         }
                 }
             }
            return 0;
        }
        function vitualArray(from,to){
            var vitual = chessArray.slice(0);
            var bitmap =[];
            for( var x in chessBitmap){
                bitmap[x]=chessBitmap[x];
            }
            var temp=vitual[from.y][from.x];
            vitual[from.y][from.x]=0;
            vitual[to.y][to.x]=temp;
            var temm= bitmap[from.y+"|"+from.x];
            bitmap[from.y+"|"+from.x]=null;
            bitmap[to.y+"|"+to.x]=temm;
            return FuckKing(vitual,bitmap);
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
                self._sound.move.play();
                var future= vitualArray({x:this.main.page.x,y:this.main.page.y},{x:this.page.x,y:this.page.y}) ;
                if(this.count*future>0){
                    alert("Không thể đi");
                }
                if(this.count*future<0){
                   socket.emit("chess",{checkmate:1});
                }
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
                chessBitmap[this.main.page.y+"|"+this.main.page.x]=null;
                this.main.page=this.page;
                chessArray[this.main.page.y][this.main.page.x]=this.main.count;
                chessBitmap[this.page.y+"|"+this.page.x]=this.main;
                if(!jQuery.isEmptyObject( self.chessrush)){
                    for(var i=0;i< self.chessrush.length;i++){
                        this.selfmain.tablechess.removeChild(self.chessrush[i]);
                    }
                    this.selfmain.chessrush=new Array();
                }

            }
            self.chessrush.push(myObjTwo);
            self.tablechess.addChild(myObjTwo);
            return myObjTwo;
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
        board:"images/bang_go.png",
        checkmate:"images/chieu.png"


    };
    var res2 = {
        theme:"sound/kingdom.ogg",
        theme1:"sound/CoTuong.ogg",
        move:"sound/ChessMove.ogg",
        cannon:"sound/Cannon.ogg",
        cavalry:"sound/Cavalry.ogg",
        elephan:"sound/Elephant.ogg",
        general:"sound/General.ogg",
        click:"sound/Click.ogg"

    };
    window.Game = Game;
}(window)) ;