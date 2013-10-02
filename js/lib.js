(function (window) {
    function Item(img, x, y,sourceRect,mouseover,mouseout,mousepress) {
        this.initialize(img, x, y);
        if(sourceRect!=null){
            this.sourceRect=new createjs.Rectangle(sourceRect[0],sourceRect[1],sourceRect[2],sourceRect[3]);
        }
        this.mouseover=mouseover;
        this.mouseout=mouseout;
        this.mousepress=mousepress;
    }
    Item.prototype = new createjs.Bitmap();
    Item.prototype.Bitmap_initialize = Item.prototype.initialize;
    Item.prototype.initialize = function(img, x, y) {
        this.Bitmap_initialize(img);
        this.snapToPixel = true;
        this.x = x;
        this.y = y;
        this.point={x:x,y:y};
        this.width=this.image.width;
        this.height=this.image.height;
        this.ispress=0;

    }
    Item.prototype.setSourceRect= function(x,y,width,height){
        this.sourceRect=new createjs.Rectangle(x,y,width,height);
    }
    Item.prototype.onPress=function(e){

        if(this.mousepress!=null)
        this.mousepress(e);
    }
    Item.prototype.onMouseOver=function(e){
        this.isover=1;
        if(this.mouseover!=null)
        this.mouseover(e);
    }
    Item.prototype.onMouseOut=function(e){
        this.isout=1;
        if(this.mouseout!=null)
        this.mouseout(e);
    }
    window.Item = Item;
}(window)) ;
(function (window) {

    function Text(text, x, y,font,color,mouseover,mouseout,mousepress) {
        this.initialize(text, x, y,font,color);
        this.mouseover=mouseover;
        this.mouseout=mouseout;
        this.mousepress=mousepress;
    }
    Text.prototype = new createjs.Text();
    Text.prototype.Text_initialize = Text.prototype.initialize;
    Text.prototype.initialize = function(text, x, y,font,color) {
        this.Text_initialize(text, font,color);
        this.x = x;
        this.y = y;
        this.ispress=0;
    }
    Text.prototype.onPress=function(e){

        if(this.mousepress!=null)
            this.mousepress(e);
    }
    Text.prototype.onMouseOver=function(e){
        this.isover=1;
        if(this.mouseover!=null)
            this.mouseover(e);
    }
    Text.prototype.onMouseOut=function(e){
        this.isout=1;
        if(this.mouseout!=null)
            this.mouseout(e);
    }
    window.Text = Text;
}(window)) ;
$(function() {
    var email = $("#email"), password = $("#password"),username=$("#username"), allFields = $([]).add(
        email).add(password).add(username);
    function updateTip(s) {
        console.log(s);
    }
    // Hàm check độ dài của chuỗi
    function checkLength(o, n, min, max) {
        if ($.trim(o.val()).length > max || $.trim(o.val()).length < min) {
            updateTip("Độ dài của  " + n + " phải nằm trong khoảng " + min
                + " - " + max + ".");
            return false;
        } else {
            return true;
        }
    }
    // Hàm kiểm tra tính hợp lệ của chuỗi
    function checkRegexp(o, regexp, n) {
        if (!(regexp.test($.trim(o.val())))) {
            updateTip(n);
            return false;
        } else {
            return true;
        }
    }
    // Hàm kiểm tra chuỗi có để trống
    function checkEmpty(o, n) {
        if ($.trim(o.val()).length <= 0) {
            updateTip(n + " không được bỏ trống ");
            return false;
        }
        return true;
    }

    $("#register")
        .click(
        function() {
            var bValid = true;
//            bValid = bValid && checkEmpty(email, "Email");
//            bValid = bValid && checkLength(email, "Email", 6, 80);
//            bValid = bValid
//                && checkRegexp(
//                email,
//                /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
//                "Email không đúng định dạng");
            bValid = bValid && checkEmpty(username, "Tài khoản ");
            bValid = bValid && checkLength(username, "Tài khoản", 4, 8);
            bValid = bValid && checkRegexp(username, /^([0-9a-zA-Z])+$/,"Tài khoản chỉ bao gồm chữ và số");
            bValid = bValid && checkEmpty(password, "Mật khẩu");
            bValid = bValid
                && checkLength(password, "Mật khẩu ", 4, 16);
            bValid = bValid
                && checkRegexp(password, /^([0-9a-zA-Z])+$/,"Mật khẩu chỉ chửa chữ và số");

            if (bValid) {
                        var user=username.val().trim();
                        var pass= hex_md5(password.val().trim());
                        socket.emit('register',{username:user,password:pass});
            }
        });
    $("#login")
        .click(
        function() {
            var bValid = true;
//            bValid = bValid && checkEmpty(email, "Email");
//            bValid = bValid && checkLength(email, "Email", 6, 80);
//            bValid = bValid
//                && checkRegexp(
//                email,
//                /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
//                "Email không đúng định dạng");
            bValid = bValid && checkEmpty(username, "Tài khoản ");
            bValid = bValid && checkLength(username, "Tài khoản", 4, 8);
            bValid = bValid && checkRegexp(username, /^([0-9a-zA-Z])+$/,"Tài khoản chỉ bao gồm chữ và số");
            bValid = bValid && checkEmpty(password, "Mật khẩu");
            bValid = bValid
                && checkLength(password, "Mật khẩu ", 4, 16);
            if (bValid) {
                $("#name").modal("hide");
                $("#loading").modal("show");
                var user=username.val().trim();
                var pass= hex_md5(password.val().trim());
                socket.emit('login',{username:user,password:pass});
            }
        });

});
