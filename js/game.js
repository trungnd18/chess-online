var socket = io.connect('https://chat-nodejs-c9-nobody122.c9.io');
function addRoom(id){
    if(id==null) alert("Gặp lỗi, không thể vào phòng ");
    else{
        socket.emit('joinroom',{id:id});
    }
}
$(function(){
    var count=15;
    var reconnect=0;
    var username;
    var roomname;
    var roomstatus="trống";
    $("#name").modal("show");
    $("#register").click(function(){
        if($("#username").val().trim().length>3&&$("#password").val().trim().length>3){
            username=$("#username").val().trim();
            var password= hex_md5($("#password").val().trim());
            socket.emit('register',{username:username,password:password});
        }
    })
    $("#login").click(function(){
        if($("#username").val().trim().length>3&&$("#password").val().trim().length>3){
            username=$("#username").val().trim();
            var password= hex_md5($("#password").val().trim());
            socket.emit('login',{username:username,password:password});

        }else{
            alert("Tài khoản hoặc mật khẩu không được nhỏ hơn 4 ký tự");
        }
    }) ;
    $("#createroom").click(function(){
        if($("#nameroom").val().trim().length>=4){
            roomname=$("#nameroom").val();
            socket.emit("createroom",{room:roomname});
        }else{
            alert("Tên phòng không được nhỏ hơn 4 ký tự");
        }
    }) ;
    function updateRoom(r,u,s,id){
        if(id!=null)
        $("<tr reg='room'><td reg='name'>"+r+"</td><td>"+u+"</td><td>" +
            "<a onclick=\"addRoom('"+id+"')\">Vào phòng</a></td></tr>").hide().appendTo("#listroom table").fadeIn(1000);
        else
            $("<tr reg='room'><td reg='name'>"+r+"</td><td>"+u+"</td><td>" +
                "<a onclick=\"addRoom()\">Vào phòng</a></td></tr>").hide().appendTo("#listroom table").fadeIn(1000);
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
//            var socket=io.connect('127.0.0.1:8080');
    socket.on('callback',function(data){
       if(data.message!=null) alert(data.message);
        if(data.login==1){
            $("#barname").text($("#username").val());
            $("#name").modal("hide");
        }
        if(data.room==1){
            updateRoom(roomname,username,roomstatus);
            $("#room").modal("hide");
        }
        if(data.joinroom==1){

        }
        if(data.register ==1 ){
            $("#barname").text($("#username").val());
            $("#name").modal("hide");
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
