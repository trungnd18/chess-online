(function (window) {
    /*
     L?p kh?i t?o các item cho game
     */
    function Chess(canvas,stage) {

        this.canvas=canvas;
        this.stage = stage;
        this.ease =  createjs.Ease;
        this._sound={};
        this._images={};
        this.onStart=function(){
            displayMenu = new createjs.Container();
            this.stage.enableMouseOver(10);
            this.stage.mouseMoveOutside = true;
            var item = new Item(this._images.background,0,0);

            displayMenu.addChild(item);

            this.stage.addChild( displayMenu);
            createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
            createjs.Ticker.addListener(this);
            createjs.Ticker.useRAF = true;
            createjs.Ticker.setFPS(60);
        }
        this.tick=function(){
            this.stage.update();
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
        this.resize=function(){
            this.width = 800;
            this.height = 480;
            this.stage.canvas.width = 800;
            this.stage.canvas.height = 480;
            var gameWidth = window.innerWidth;
            var gameHeight = window.innerHeight;
            var scaleToFitX = gameWidth / 800;
            var scaleToFitY = gameHeight / 480;
            var currentScreenRatio = gameWidth / gameHeight;
            var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
            if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
                this.canvas.style.width = gameWidth + "px";
                this.canvas.style.height = gameHeight + "px";
            } else {
                this.canvas.style.width = 800 * optimalRatio + "px";
                this.canvas.style.height = 480 * optimalRatio + "px";
            }

        }
    }

    var res = {

        background:"images/background.png",
        ba:"images/ban1.jpg"

    };

    var res2 = {

    };
    window.Chess = Chess;
}(window)) ;