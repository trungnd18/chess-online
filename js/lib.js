(function (window) {
    /*
     Lớp khởi tạo các item cho game
     */
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
        this.width=this.image.width;
        this.height=this.image.height;

    }
    Item.prototype.setSourceRect= function(x,y,width,height){
        this.sourceRect=new createjs.Rectangle(x,y,width,height);
    }
    Item.prototype.onPress=function(e){
        if(this.mousepress!=null)
        this.mousepress();
    }
    Item.prototype.onMouseOver=function(e){
        if(this.mouseover!=null)
        this.mouseover();
    }
    Item.prototype.onMouseOut=function(e){
        if(this.mouseout!=null)
        this.mouseout();
    }
    window.Item = Item;
}(window)) ;