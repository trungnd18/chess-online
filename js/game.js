$(function(){
    var count=15;
    var reconnect=0;
    var socket = io.connect('https://chat-nodejs-c9-nobody122.c9.io');
    var username;
    var roomname;
    var roomstatus="trống";
    $("#name").modal("show");
    $("#addname").click(function(){
        if($("#username").val().trim().length>4){
            username=$("#username").val();
            socket.emit("username",{name:username}) ;
            $("#barname").text($("#username").val());
            $("#name").modal("hide");
        }else{
            alert("Username không được nhỏ hơn 4 ký tự");
        }
    }) ;
    $("#createroom").click(function(){
        if($("#nameroom").val().trim().length>4){
            roomname=$("#nameroom").val();
            socket.emit("createroom",{room:roomname});
            updateRoom(roomname,username,roomstatus);
            $("#room").modal("hide");
        }else{
            alert("roomname không được nhỏ hơn 4");
        }
    }) ;

    function connect(){
    }
    $("tr a").click(function(){
         console.log("trung");
        return false;
    })
    $("tr a").click(function(){
        console.log("trung");
        return false;
    })
    function updateRoom(r,u,s){
        $("#listroom table").append("<tr reg='room'><td reg='name'>"+r+"</td><td>"+u+"</td><td>" +
            "<a>Xin chào</a></td></tr>");
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
                    var date= new Date().getTime();
                    var time= new Date(date);
                    console.log($("#username").val()+': '+$("#message").val());
                    socket.emit('message',{message:'<li><span class="label label-info" >'+username+'</span>: '+$("#message").val()+"<br></li>"});
                    updateMessage("<li><span class='label label-success' >"+$("#username").val()+"</span> : "+$("#message").val()+"<br></li>");
                    $("#message").val("");
                    }
                }
            }
        });
//            var socket=io.connect('127.0.0.1:8080');
    socket.on('user_online',function(data){
        console.log(data.id);
        $("span#count").text(data.count_user);
    })
    socket.on('message',function(data){
        updateMessage(data.message);
    })
    socket.on('updateroom',function(data){
        updateRoom(data.room,data.name,"trống");
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
    var canvas=document.getElementById("canvas");
    var stage = new createjs.Stage(canvas);
    var game= new  Game(canvas,stage,socket);
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
