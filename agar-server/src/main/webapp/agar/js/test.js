var stage, label, credits, mouseX, mouseY;
var circle, triangle;

window.addEventListener('resize', resize, false);


function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;

    stage.removeAllChildren();

    for (var i = 0; i < 150; i++) {
        var circle = new createjs.Shape();
        circle.x = Math.random() * stage.canvas.width;
        circle.y = Math.random() * stage.canvas.height;
        circle.graphics.beginFill(getRandomColor2()).drawCircle(0, 0, (Math.random() * 30) + 150);
        stage.addChild(circle)
    }


    stage.update();
}

function getRandomColor2() {
    var colors = [ 'red', 'green', 'blue', 'magenta', 'yellow' ];
    return colors[Math.floor(Math.random() * 5)];
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function init() {
    stage = new createjs.Stage("gameCanvas");
    resize();

    createjs.Ticker.framerate = 1;
    createjs.Ticker.addEventListener("tick", function () {
        resize();
    });
}