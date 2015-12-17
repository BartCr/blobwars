var GRID_SIZE = 100;
var SPEED = 3;

var stage, label, credits, mouseX, mouseY;
var circle, triangle;
var xOffset = 0;
var yOffset = 0;

var bullets;
var hLineNr, vLineNr;
var hLines, vLines;

var mouseDown = false;
var mouseDownCounter = 0;

window.addEventListener('resize', resize, false);

function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;

    triangle.x = stage.canvas.width / 2;
    triangle.y = stage.canvas.height / 2;

    circle.x = stage.canvas.width / 2;
    circle.y = stage.canvas.height / 2;

    hLineNr = stage.canvas.height / GRID_SIZE;
    vLineNr = stage.canvas.width / GRID_SIZE;

    hLines = [];
    vLines = [];
    bullets = [];

    stage.removeAllChildren();

    for (var i = -1; i <= hLineNr; i++) {
        hLines[i + 1] = new createjs.Shape();
        hLines[i + 1].graphics.beginStroke(i == 1000 ? "red" : "gray").moveTo(0, i * GRID_SIZE).lineTo(stage.canvas.width, i * GRID_SIZE);
        stage.addChild(hLines[i + 1]);
    }

    for (var j = -1; j <= vLineNr; j++) {
        vLines[j + 1] = new createjs.Shape();

        vLines[j + 1].graphics.beginStroke(j == 1000 ? "red" : "gray").moveTo(j * GRID_SIZE, 0).lineTo(j * GRID_SIZE, stage.canvas.height);
        stage.addChild(vLines[j + 1]);
    }

    credits.x = 10;
    credits.y = stage.canvas.height - 50;

    stage.addChild(circle, label, credits);
}

function init() {
    stage = new createjs.Stage("gameCanvas");
    stage.mouseEventsEnabled = true;

    triangle = new createjs.Shape();
    triangle.graphics.beginFill("#00FFAA").drawPolyStar(0, 0, 40, 3, 0, -90);

    circle = new createjs.Shape();
    circle.graphics.beginFill("blue").drawCircle(0, 0, 50);
    circle.graphics.beginFill("#444444").drawRect(-5, -25, 10, -30);

    label = new createjs.Text("", "24px Arial");
    label.x = label.y = 10;

    credits = new createjs.Text("Graphics by Kieran Cremers            Lead programmer Bart Cremers", "10px Arial");

    resize();

    stage.on("stagemousemove", function (evt) {
        mouseX = evt.stageX;
        mouseY = evt.stageY;
    });

    stage.on("stagemousedown", function (evt) {
        mouseDown = true;
    });

    stage.on("stagemouseup", function (evt) {
        mouseDown = false;
    });

    bullets = [];

    createjs.Ticker.framerate = 50;
    createjs.Ticker.addEventListener("tick", function () {
        if (mouseX) {

            var mouseOffsetX = mouseX - triangle.x;
            var mouseOffsetY = mouseY - triangle.y;
            var angle = Math.atan2(mouseOffsetX, -mouseOffsetY) * 180 / Math.PI;

            triangle.rotation = angle;
            circle.rotation = angle;

            // Update vertical lines
            if (Math.abs(mouseOffsetX) > 5) {
                var xDif = -Math.sin(angle * Math.PI / 180) * SPEED;
                xOffset += xDif;
                if (xOffset > GRID_SIZE) {
                    xDif -= GRID_SIZE;
                    xOffset -= GRID_SIZE;
                } else if (xOffset < 0) {
                    xDif += GRID_SIZE;
                    xOffset += GRID_SIZE;
                }

                vLines.forEach(function (vLine) {
                    vLine.x += xDif;
                });
            }

            // Update horizontal lines
            if (Math.abs(mouseOffsetY) > 5) {
                var yDif = Math.cos(angle * Math.PI / 180) * SPEED;
                yOffset += yDif;
                if (yOffset > GRID_SIZE) {
                    yDif -= GRID_SIZE;
                    yOffset -= GRID_SIZE;
                } else if (yOffset < 0) {
                    yDif += GRID_SIZE;
                    yOffset += GRID_SIZE;
                }
                hLines.forEach(function (hLine) {
                    hLine.y += yDif;
                });
            }

            //label.text = "x: " + mouseX + "  y: " + mouseY + "  rot:" + angle + "  xOffset:" + xOffset + "  yOffset:" + yOffset;

            // Update bullets:
            for (var i = 0; i < bullets.length; ++i) {
                var currentBullet = bullets[i];

                // TODO: Cool bug
                //currentBullet.shape.x += (Math.sin(angle * Math.PI / 180) * currentBullet.speed);
                //currentBullet.shape.y -= (Math.cos(angle * Math.PI / 180) * currentBullet.speed);

                currentBullet.shape.x += (Math.sin(currentBullet.angle * Math.PI / 180) * currentBullet.speed);
                currentBullet.shape.y -= (Math.cos(currentBullet.angle * Math.PI / 180) * currentBullet.speed);

                var a = Math.abs(currentBullet.shape.x);
                var b = Math.abs(currentBullet.shape.y);
                var distanceTravelled = Math.sqrt(a * a + b * b);


                if (distanceTravelled > currentBullet.maxDistance) {
                    bullets.splice(i--, 1);
                    stage.removeChild(currentBullet.shape);
                }
            }

            // Add bullets
            if (mouseDown) {
                if (bullets.length < 10) {
                    mouseDownCounter++;
                    if (mouseDownCounter == 1) {
                        var bullet = new createjs.Shape();
                        bullet.graphics.beginFill("#22222").drawCircle(circle.x + (Math.sin(angle * Math.PI / 180) * 50), circle.y - (Math.cos(angle * Math.PI / 180) * 50), 4);
                        stage.addChild(bullet);
                        bullets.push({shape: bullet, angle: angle, speed: 5, maxDistance: 200});
                    } else {
                        if (mouseDownCounter > 10) {
                            mouseDownCounter = 0;
                        }
                    }
                }
            } else {
                mouseDownCounter = 0;
            }

            stage.update();
        }
    });

    stage.update();
}