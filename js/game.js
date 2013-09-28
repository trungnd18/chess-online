var socket = io.connect('https://chat-nodejs-c9-nobody122.c9.io');
//            var socket=io.connect('127.0.0.1:8080');
var roomid;
function addRoom(id){
    if(id==null)
        alert("Không thể vào phòng ");
    else{
        roomid=id;
        socket.emit('joinroom',{id:id});
    }
}
$(function(){
    var count=15;
    var reconnect=0;
    var username;
    var roomname;
    var roomstatus="trống";
    var canvas=document.getElementById("canvas");
    var stage = new createjs.Stage(canvas);
    var game= new Game(canvas,stage,socket);
    $("#register").click(function(){
        if($("#username").val().trim().length>3&&$("#password").val().trim().length>3){
            username=$("#username").val().trim();
            var password= hex_md5($("#password").val().trim());
            socket.emit('register',{username:username,password:password});
        }else{
            alert("Tài khoản hoặc mật khẩu không được nhỏ hơn 4 ký tự");
        }
    })
    $("#login").click(function(){
        if($("#username").val().trim().length>3&&$("#password").val().trim().length>3){
            $("#name").modal("hide");
            $("#loading").modal("show");
            username=$("#username").val().trim();
            var password= hex_md5($("#password").val().trim());
            socket.emit('login',{username:username,password:password});
        }else{
            alert("Tài khoản hoặc mật khẩu không được nhỏ hơn 4 ký tự");
        }
    }) ;
    $("#createroom").click(function(){
        if($("#nameroom").val().trim().length>=4){
            $("#room").modal("hide");
            $("#loading").modal("show");
            roomname=$("#nameroom").val();
            socket.emit("createroom",{room:roomname});
        }else{
            alert("Tên phòng không được nhỏ hơn 4 ký tự");
        }
    }) ;
    function updateRoom(r,u,s,id){
        if(id!=null)
        $("<tr reg='room' id=\""+id+"\"><td reg='name'>"+r+"</td><td>"+u+"</td><td>" +
            "<a class='btn' onclick=\"addRoom('"+id+"')\">Vào phòng</a></td></tr>").hide().appendTo("#listroom table").fadeIn(1000);
        else
            $("<tr reg='room'><td reg='name'>"+r+"</td><td>"+u+"</td><td>" +
                "<a class='btn' onclick=\"addRoom()\">Vào phòng</a></td></tr>").hide().appendTo("#listroom table").fadeIn(1000);
    }
    function updateMessage(m){
        $("#content ul").append(m);
    }
        $("#message").keydown(function(e){
            if(e.keyCode==13&& !e.shiftKey){
                if($("#message").val().trim()=="-clear"){
                    $("#content ul").html("");
                }else{
                    if($("#message").val().trim().length>0){
                        socket.emit('message',{message:'<li><span class="label label-info" >'+username+'</span>: '+$("#message").val()+"<br></li>"});
                        updateMessage("<li><span class='label label-success' >"+$("#username").val()+"</span> : "+$("#message").val()+"<br></li>");
                        $("#message").val("");
                    }
                }
            }
        });
    socket.on('callback',function(data){
        if(data.login){
//            game._sound.theme.loop=true;
//            game._sound.theme.play();
            $("#loading").modal("hide");
            $("#barname").text($("#username").val());
        }else if(data.login==0){
            $("#loading").modal("hide");
            $("#name").modal("show");
        }
        if(data.room){
            game.tablechess.visible=1;
            game.domelement.visible=0;
            game.item_board.visible=1;
            $("#loading").modal("hide");
            $("#room").modal("hide");
            game.text_board.text="Vui lòng chờ ..."
        } else if(data.room==0) {
            $("#loading").modal("hide");
            $("#room").modal("show");
        }
        if(data.joinroom){
            $("#"+roomid).remove();
            game.tablechess.visible=1;
            game.item_board.visible=1;
            game.domelement.visible=0;
            var s=10;
            var refreshIntervalId=setInterval(function(){
                if(s>=0){
                    game.text_board.text="Bắt đầu trong "+s+" giây";
                    s--;
                }else{
                    game.item_board.visible=0;
                    game.text_board.visible=0;
                    stage.removeChild(game.tablechess);
                    game.chess();
                    game.player.color=-1;
                    clearInterval(refreshIntervalId);
                }
            },1000);

        } else if(data.joinroom==0){
        }
        if(data.register ){
            $("#barname").text($("#username").val());
            $("#name").modal("hide");
        }else if(data.register==0){
        }
        if(data.userin){
            var s=10;
            var refreshIntervalId = setInterval(function(){
                if(s>=0){
                    game.text_board.text="Bắt đầu trong "+s+" giây";
                    game._sound.time.play();
                    s--;
                }else{
                    game.item_board.visible=0;
                    game.text_board.visible=0;
                    stage.removeChild(game.tablechess);
                    game.chess();
                    game.waitTurn();
                    clearInterval(refreshIntervalId);
                }
            },1000);
        }else if(data.userin==0){
        }
        if(data.userout){
            socket.emit("message",{userout:1});
            game.tablechess.visible=0;
            stage.removeChild(game.tablechess);
            game.item_board.visible=1;
            game.text_board.visible=1;
            game.text_board.text="Cờ tướng online";
            game.domelement.visible=1;
        }else if(data.userout==0){
        }
        if(data.checkmate){
            console.log("Chiếu");
            if(game.item_checkmate!=null){
                game.stage.removeChild(game.item_checkmate);
            }
            game.item_checkmate=new Item(game._images.checkmate,0,0);
            game.stage.addChild(game.item_checkmate);

            var refreshIntervalId=setInterval(function(){
                if(game.item_checkmate.alpha<0){
                    clearInterval(refreshIntervalId);
                }else{
                    game.item_checkmate.alpha-=0.1;
                }
            },100);
        }
        if(data.move){
            console.log(data);
            game.chessMove(data.game.from,data.game.to);
        }
        if(data.message!=null) console.log(data.message);
        if(data.nextTurn){
               game.player.isPlay=0;
               game.waitTurn();
        }
    })
    socket.on('user_online',function(data){
        $("span#count").text(data.count_user);
    })
    socket.on('message',function(data){
        updateMessage(data.message);
    })
    socket.on('updateroom',function(data){
        updateRoom(data.room,data.name,"trống",data.id);
    })
    socket.on('connect_failed', function () {
        alert("Can't connect");
    })
    socket.on('disconnect', function () {
        console.log("Server is disconnect");
    })
    socket.on('reconnect_failed', function () {
        console.log("Reconnect failed");
    })
    socket.on('reconnect', function () {
        console.log("Reconnect success");
        reconnect=0;
    })
    socket.on('reconnecting', function (data) {
        reconnect=1;
        count=data/1000;
    })
    setInterval(function(){
        if(reconnect){
            console.log("Xin chờ "+count+" giây để kết nối");
            count--;
        }
    },1000);

    window.addEventListener('resize',resize, false);
    resize();
    game.onLoad(function(){
        game.onStart();
    });

    function resize(){
        stage.canvas.width = 800;
        stage.canvas.height = 480;
        var gameWidth = window.innerWidth;
        var gameHeight = window.innerHeight;
        var scaleToFitX = gameWidth / 800;
        var scaleToFitY = gameHeight / 480;
        var currentScreenRatio = gameWidth / gameHeight;
        var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
        if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
            canvas.style.width = gameWidth + "px";
            canvas.style.height = gameHeight + "px";

        } else {
            canvas.style.width = 800 * optimalRatio + "px";
            canvas.style.height = 480 * optimalRatio + "px";
        }
    }
})
