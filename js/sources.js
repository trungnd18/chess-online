
var res = {

    background:"images/background.png"
};

var res2 = {

};

var _images = {};
var _sound = {};

function loadSources(callback) {

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
        _sound[src] = new Audio();
        _sound[src].src = res2[src];
    }
    for (var src in res) {

        _images[src] = new Image();
        _images[src].onload = function() {
            if (++loadedImages >= numImages) {
                    callback();
            }else{
            }
        };
        _images[src].src = res[src];
    }
}