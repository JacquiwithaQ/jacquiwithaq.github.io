svgNS = "http://www.w3.org/2000/svg";
var mainCanvas;
var drawingCanvas;
var canvasRect;
var strokeWeight = 18;

function clearCanvas() {
    drawingCanvas.strokes.forEach(function(stroke) {
        stroke.path.remove();
    });
    drawingCanvas.strokes = [];
    this.currentlyDrawing = false;
}

function onload() {
    mainCanvas = document.getElementById("mainCanvas");
    canvasRect = mainCanvas.getBoundingClientRect();
    pinkTool = new Tool("#E23571", StickyBrush, document.getElementById("pink-button"));
    orangeTool = new Tool("#FF7300", NoLeftBrush, document.getElementById("orange-button"));
    yellowTool = new Tool("#FDDE44", StartRotationBrush, document.getElementById("yellow-button"));
    greenTool = new Tool("#33722E", ErasableBrush, document.getElementById("green-button"));
    tealTool = new Tool("#44D6BF", new ColorRotationBrush(["#44D6BF", "#FFFFFF"]), document.getElementById("teal-button"));
    blueTool = new Tool("#287490", EraserBrush, document.getElementById("blue-button"));
    purpleTool = new Tool("#7030A0", GravityBrush, document.getElementById("purple-button"));
    brownTool = new Tool("#664F23", UnliftableBrush, document.getElementById("brown-button"));
    greyTool = new Tool("#D9D9D9", YMirrorBrush, document.getElementById("grey-button"));
    mainToolbar = new Toolbar([pinkTool, orangeTool, yellowTool, greenTool, tealTool, blueTool, purpleTool, brownTool, greyTool]);
    drawingCanvas = new DrawingCanvas(mainToolbar);
    drawingCanvas.drawCanvas();
    sandbox = new Level("url(./0-Sandbox.png)", document.getElementById("level-0-button"));
    level1 = new Level("url(./1-Flower-Guide.png)", document.getElementById("level-1-button"));
    level2 = new Level("url(./2-Fish-Guide.png)", document.getElementById("level-2-button"));
    level3 = new Level("url(./3-Boat-Guide.png)", document.getElementById("level-3-button"));
    sandbox.selectLevel();
    mainCanvas.addEventListener('mousedown', function(e) { drawingCanvas.startStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mousemove', function(e) { drawingCanvas.moveMouse(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mouseup', function(e) { drawingCanvas.endStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mouseleave', function(e) { drawingCanvas.endStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
}

window.addEventListener('scroll', function(e) { canvasRect = mainCanvas.getBoundingClientRect(); });

//BEGIN BRUSH DEFINTIONS

function NormalBrush() {}
//what the brush does when the user first begins drawing
NormalBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
NormalBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
NormalBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
NormalBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
NormalBrush.onStrokes  = function(currentStroke) {}
NormalBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function YMirrorBrush() {}
//what the brush does when the user first begins drawing
YMirrorBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + (canvasRect.height - mouseY) 
                                        + " L " + mouseX + " " + (canvasRect.height - mouseY));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
YMirrorBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + (canvasRect.height - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
YMirrorBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
YMirrorBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
YMirrorBrush.onStrokes  = function(currentStroke) {}
YMirrorBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function XMirrorBrush() {}
//what the brush does when the user first begins drawing
XMirrorBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + (canvasRect.width- mouseX) + " " + mouseY
                                     + " L " + (canvasRect.width- mouseX) + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
XMirrorBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + (canvasRect.width- mouseX) + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
XMirrorBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
XMirrorBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
XMirrorBrush.onStrokes  = function(currentStroke) {}
XMirrorBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function CenterRotationBrush() {}
//what the brush does when the user first begins drawing
CenterRotationBrush.onStart = function(mouseX, mouseY, currentStroke) {
    centerX = canvasRect.width / 2;
    centerY = canvasRect.height / 2;
    currentStroke.path.setAttributeNS(null, "d", "M " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY)
                                      + " L " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
CenterRotationBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    centerX = canvasRect.width / 2;
    centerY = canvasRect.height / 2;
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
CenterRotationBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
CenterRotationBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
CenterRotationBrush.onStrokes  = function(currentStroke) {}
CenterRotationBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function StartRotationBrush() {}
//what the brush does when the user first begins drawing
StartRotationBrush.onStart = function(mouseX, mouseY, currentStroke) {
    this.startX = mouseX;
    this.startY = mouseY;
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
StartRotationBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + ((2 * this.startX) - mouseX) + " " + ((2 * this.startY) - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
StartRotationBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
StartRotationBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
StartRotationBrush.onStrokes  = function(currentStroke) {}
StartRotationBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function ColorRotationBrush(colors) {
    this.colors = colors;
}
//what the brush does when the user first begins drawing
ColorRotationBrush.prototype.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", this.colors[0]);
    currentStroke.colorNum = 0;
}
//what the brush does when the user moves the mouse
ColorRotationBrush.prototype.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
ColorRotationBrush.prototype.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
ColorRotationBrush.prototype.onStrokeStarts  = function(currentStroke) {
    newNum = (currentStroke.colorNum + 1) % this.colors.length;
    currentStroke.colorNum = newNum;
    currentStroke.path.setAttributeNS(null, "stroke", this.colors[currentStroke.colorNum]);
}
//onStrokes is for brushes that change with every subsequent stroke movement
ColorRotationBrush.prototype.onStrokes  = function(currentStroke) {}
ColorRotationBrush.prototype.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function ErasableBrush() {}
//what the brush does when the user first begins drawing
ErasableBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.points = ["" + mouseX + " " + mouseY,
                            "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
ErasableBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentStroke.points.push("" + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
}
//for brushes that do something when the user lifts them up
ErasableBrush.onEnd = function(mouseX, mouseY, currentStroke) {
    currentStroke.eraseNow = false;
}
//onStrokeStarts is for brushes that change once per subsequent stroke
ErasableBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
ErasableBrush.onStrokes  = function(currentStroke) {
    if (currentStroke.eraseNow){
        currentStroke.points.shift();
        if (currentStroke.points.length <= 0){
            currentStroke.path.remove();
        } else {
            currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
        }
    }
    currentStroke.eraseNow = !currentStroke.eraseNow;
}
ErasableBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function DelayedBrush() {}
//what the brush does when the user first begins drawing
DelayedBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.pointsQueued = ["" + mouseX + " " + mouseY,
                                  "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "");
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
DelayedBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentStroke.pointsQueued.push("" + mouseX + " " + mouseY);
}
//for brushes that do something when the user lifts them up
DelayedBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
DelayedBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
DelayedBrush.onStrokes  = function(currentStroke) {
    if (currentStroke.pointsQueued.length > 0){
        newPoint = currentStroke.pointsQueued.shift();
        currentPath = currentStroke.path.getAttributeNS(null, "d");
        if (currentPath == ""){
            newPath = "M " + newPoint;
            currentStroke.path.setAttributeNS(null, "d", newPath);
        } else {
            newPath = currentPath + " L " + newPoint;
            currentStroke.path.setAttributeNS(null, "d", newPath);
        }
    }
}
DelayedBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function EraserBrush() {} //IN PROGRESS
//what the brush does when the user first begins drawing
EraserBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.eraseNow = false;
}
//what the brush does when the user moves the mouse
EraserBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    if (!currentStroke.eraseNow){
        currentStroke.eraseNow = true;
        return;
    }
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
    for (i = 0; i < drawingCanvas.strokes.length - 1; i++) {
        testStroke = drawingCanvas.strokes[i];
        //in some cases, we don't erase
        if (!((testStroke.brush == ErasableBrush) ||
            (testStroke.brush == DelayedBrush && testStroke.pointsQueued.length > 0) ||
            (testStroke.path.getAttributeNS(null, "d") == ""))){
            testPath = testStroke.path.getAttributeNS(null, "d");
            pathParts = testPath.split(" ");
            if (pathParts.length < 6) {
                testStroke.path.setAttributeNS(null, "d", "");
                testStroke.path.remove();
            } else {
                pathParts.splice(1, 3);
                testStroke.path.setAttributeNS(null, "d", pathParts.join(" "));
            }
            break;
        }
    }
    currentStroke.eraseNow = false;
}
//for brushes that do something when the user lifts them up
EraserBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
EraserBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
EraserBrush.onStrokes  = function(currentStroke) {}
EraserBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function GravityBrush() {}
//what the brush does when the user first begins drawing
GravityBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
GravityBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
GravityBrush.onEnd = function(mouseX, mouseY, currentStroke) {
     currentStroke.velocity = 1;
     gravity = setInterval(function() {
         touchingFloor = false;
         maxSubtract = 0;
         currentPath = currentStroke.path.getAttributeNS(null, "d");
         pathParts = currentPath.split(" ");
         for (i = 2; i < pathParts.length; i+=3){
             pathY = parseFloat(pathParts[i]);
             newY = pathY + currentStroke.velocity;
             if (newY >= canvasRect.height) {
                 touchingFloor = true;
                 if (newY - canvasRect.height + (strokeWeight/2)> maxSubtract) {
                     maxSubtract = newY - canvasRect.height + (strokeWeight/2);
                 }
             }
             pathParts[i] = "" + newY;
         }
         currentStroke.path.setAttributeNS(null, "d", pathParts.join(" "));
         if (touchingFloor){
            for (i = 2; i < pathParts.length; i+=3){
                pathY = parseFloat(pathParts[i]);
                newY = pathY - maxSubtract;
                pathParts[i] = "" + newY;
            }
            currentStroke.path.setAttributeNS(null, "d", pathParts.join(" "));
            clearInterval(gravity);
            return;
         }
         currentStroke.velocity = Math.min(currentStroke.velocity + 2, 70);
     }, 10);
}
//onStrokeStarts is for brushes that change once per subsequent stroke
GravityBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
GravityBrush.onStrokes  = function(currentStroke) {}
GravityBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function StickyBrush() {} //TODO: ADDRESS MOUSING OUT
//what the brush does when the user first begins drawing
StickyBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.points = ["" + mouseX + " " + mouseY,
                            "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.sticking = false;
    currentStroke.endX = 0;
    currentStroke.endY = 0;
}
//what the brush does when the user moves the mouse
StickyBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentStroke.points.push("" + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
}
//for brushes that do something when the user lifts them up
StickyBrush.onEnd = function(mouseX, mouseY, currentStroke) {
    currentStroke.endX = mouseX;
    currentStroke.endY = mouseY;
    currentStroke.sticking = true;
}
//onStrokeStarts is for brushes that change once per subsequent stroke
StickyBrush.onStrokeStarts  = function(currentStroke) {
    currentStroke.sticking = false;
}
//onStrokes is for brushes that change with every subsequent stroke movement
StickyBrush.onStrokes  = function(currentStroke) {}
StickyBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {
    if (currentStroke.sticking){
        newPoints = [];
        for (i = 0; i < currentStroke.points.length; i++){
            point = currentStroke.points[i];
            pointParts = point.split(" ");
            x = parseFloat(pointParts[0]);
            y = parseFloat(pointParts[1]);
            newPoints.push("" + (mouseX + x - currentStroke.endX) + " " + (mouseY + y - currentStroke.endY));
        }
    currentStroke.path.setAttributeNS(null, "d", "M " + newPoints.join(" L "));
    }
}


function DominatingBrush() {} //TODO: Address Cycling Color Brush
//what the brush does when the user first begins drawing
DominatingBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
DominatingBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
DominatingBrush.onEnd = function(mouseX, mouseY, currentStroke) {
    for (i = 0; i < drawingCanvas.strokes.length; i++) {
        testStroke = drawingCanvas.strokes[i];
        testStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    }
}
//onStrokeStarts is for brushes that change once per subsequent stroke
DominatingBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
DominatingBrush.onStrokes  = function(currentStroke) {}
DominatingBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


function UnliftableBrush() {}
//what the brush does when the user first begins drawing
UnliftableBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.down = true;
}
//what the brush does when the user moves the mouse
UnliftableBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
UnliftableBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
UnliftableBrush.onStrokeStarts  = function(currentStroke) {
    currentStroke.down = false;
}
//onStrokes is for brushes that change with every subsequent stroke movement
UnliftableBrush.onStrokes  = function(currentStroke) {}
UnliftableBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {
    if (currentStroke.down){
        currentPath = currentStroke.path.getAttributeNS(null, "d");
        newPath = currentPath + " L " + mouseX + " " + mouseY;
        currentStroke.path.setAttributeNS(null, "d", newPath);
    }
}


function NoLeftBrush() {}
//what the brush does when the user first begins drawing
NoLeftBrush.onStart = function(mouseX, mouseY, currentStroke) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.lastX = mouseX;
}
//what the brush does when the user moves the mouse
NoLeftBrush.onDraw = function(mouseX, mouseY, currentStroke) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newX = mouseX;
    if (mouseX <= currentStroke.lastX) {
        newX = currentStroke.lastX;
    }
    newPath = currentPath + " L " + newX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
    currentStroke.lastX = newX;
}
//for brushes that do something when the user lifts them up
NoLeftBrush.onEnd = function(mouseX, mouseY, currentStroke) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
NoLeftBrush.onStrokeStarts  = function(currentStroke) {}
//onStrokes is for brushes that change with every subsequent stroke movement
NoLeftBrush.onStrokes  = function(currentStroke) {}
NoLeftBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke) {}


//END BRUSH DEFINTIONS

function Level(image, button) {
    this.image = image;
    this.button = button;
    this.button.onclick = this.selectLevel.bind(this);
}
Level.prototype.selectLevel = function() {
    background = document.getElementById("level-background");
    background.style.backgroundImage = this.image;
}

function Stroke(color, brush, path) {
    this.color = color;
    this.brush = brush;
    this.path = path;
}

function Tool(color, brush, button) {
    this.color = color;
    this.brush = brush;
    this.button = button;
    this.button.onclick = this.selectTool.bind(this);
}
Tool.prototype.selectTool = function() {
    if (drawingCanvas.currentTool.brush == UnliftableBrush) {
        lastStroke = drawingCanvas.strokes[drawingCanvas.strokes.length - 1];
        if (lastStroke.down) {
            buttonX = this.button.getBoundingClientRect().left + (this.button.getBoundingClientRect().width / 2) + window.scrollX;
            buttonY = this.button.getBoundingClientRect().top + (this.button.getBoundingClientRect().height / 2) + window.scrollY;
            lastPath = lastStroke.path.getAttributeNS(null, "d");
            newPath = lastPath + " L " + buttonX + " " + buttonY;
            lastStroke.path.setAttributeNS(null, "d", newPath);
        }
    }
    drawingCanvas.currentTool.button.classList.remove('selected-tool-button');
    drawingCanvas.currentTool = this;
    this.button.classList.add('selected-tool-button');
}


function Toolbar(tools) {
    this.tools = tools;
}

function DrawingCanvas(toolbar) {
    this.toolbar = toolbar;
    this.strokes = [];
    this.currentTool = this.toolbar.tools[0]; //start with the first tool selected
    this.currentTool.button.classList.add('selected-tool-button');
    this.currentlyDrawing = false;
}
DrawingCanvas.prototype.drawCanvas = function(){
    this.rect = document.createElementNS(svgNS, 'rect'); //Create the rect.
    this.rect.setAttributeNS(null, "x", 0); //Set its attributes.
    this.rect.setAttributeNS(null, "y", 0);
    this.rect.setAttributeNS(null, "width", 640);
    this.rect.setAttributeNS(null, "height", 480);
    this.rect.setAttributeNS(null, "fill", "#fff");
    this.rect.setAttributeNS(null, "pointer-events", "bounding-box");
    this.rect.setAttributeNS(null, "fill-opacity", "0");
    mainCanvas.appendChild(this.rect);
}
DrawingCanvas.prototype.startStroke = function(mouseX, mouseY){
    if (!this.currentlyDrawing){
        this.strokes.forEach(function(stroke) { stroke.brush.onStrokeStarts(stroke) });
        if (drawingCanvas.strokes.length >= 1 &&
            drawingCanvas.strokes[drawingCanvas.strokes.length - 1].brush == UnliftableBrush) {
            lastStroke = drawingCanvas.strokes[drawingCanvas.strokes.length - 1];
            if (lastStroke.down) {
                lastPath = lastStroke.path.getAttributeNS(null, "d");
                newPath = lastPath + " L " + mouseX + " " + mouseY;
                lastStroke.path.setAttributeNS(null, "d", newPath);
            }
        }
        var newPath = document.createElementNS(svgNS, 'path');
        newPath.setAttributeNS(null, "stroke-linejoin", "round");
        newPath.setAttributeNS(null, "stroke-linecap", "round");
        newPath.setAttributeNS(null, "fill", "none");
        newPath.setAttributeNS(null, "stroke-width", "" + strokeWeight);
        this.currentlyDrawing = true;
        newStroke = new Stroke(this.currentTool.color, this.currentTool.brush, newPath);
        this.currentTool.brush.onStart(mouseX, mouseY, newStroke);
        this.strokes.push(newStroke);
        mainCanvas.appendChild(newStroke.path);
    }
}
DrawingCanvas.prototype.moveMouse = function(mouseX, mouseY){
    if (this.currentlyDrawing) {
        this.strokes.forEach(function(stroke) { 
            if (stroke != this.strokes[this.strokes.length - 1]) 
                { stroke.brush.onStrokes(stroke) }} .bind(this));
        this.currentTool.brush.onDraw(mouseX, mouseY, this.strokes[this.strokes.length - 1]);
    } else {
        this.strokes.forEach(function(stroke) { stroke.brush.onNonStrokeMove(mouseX, mouseY, stroke) });
    }
}
DrawingCanvas.prototype.endStroke = function(mouseX, mouseY){
    if (this.currentlyDrawing){
        this.currentlyDrawing = false;
        this.currentTool.brush.onEnd(mouseX, mouseY, this.strokes[this.strokes.length - 1]);
    }
}


onload();

// MainCanvas (draw events), Toolbar (current tool), Tool (color, brush)
// Brush (instructions on how to draw), Level, Stroke
// 