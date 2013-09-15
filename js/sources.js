
var res = {

};

var res2 = {

};

var _Images = {};
var _Sound = {};

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
        _Sound[src] = new Audio();
        _Sound[src].src = res2[src];
    }
    for (var src in res) {

        _Images[src] = new Image();
        _Images[src].onload = function() {
            if (++loadedImages >= numImages) {
                    callback();
            }else{
            }
        };
        _Images[src].src = res[src];
    }
}