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
        this.point={x:x,y:y};
        this.width=this.image.width;
        this.height=this.image.height;

    }
    Item.prototype.setSourceRect= function(x,y,width,height){
        this.sourceRect=new createjs.Rectangle(x,y,width,height);
    }
    Item.prototype.onPress=function(e){
        this.ispress=1;
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