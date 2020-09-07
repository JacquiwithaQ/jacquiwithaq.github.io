svgNS = "http://www.w3.org/2000/svg";
var submitButton;
var requiredLevels;
var recordFilePath = "flowerSelections/record";
var fso;
var canvasesPerRow = 10;
var strokeWeight = 18;
var startCanvas = 0;
var numCanvases = 100;
var svgWidth = 640;
var svgHeight = 480;

buttonToPoint = {
    "undo" : {x : 385, y : 530},
    "submit" : {x : 545, y : 530},
    "#E23571" : {x : 25, y : 530},
    "#FF7300" : {x : 65, y : 530},
    "#FDDD44" : {x : 105, y : 530},
    "#33722E" : {x : 145, y : 530},
    "#44D6BF" : {x : 185, y : 530},
    "#287490" : {x : 225, y : 530},
    "#7030A0" : {x : 265, y : 530},
    "#664F23" : {x : 305, y : 530},
    "#D9D9D9" : {x : 345, y : 530},
}

colorToTool = {}

/*function CookieManager() {

};
CookieManager.setCookie = function(cname, cvalue) {
    var exdays = 365;
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
CookieManager.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};*/



function outerHTML(el) {
    var outer = document.createElement('div');
    outer.appendChild(el.cloneNode(true));
    return outer.innerHTML;
}

function setSvgAttributes(el) {
    el.setAttribute("version", "1.1");
    el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    el.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
}

function validateSvg(imgname, callbackFn) {
    if (imgname == null) {
        imgname = 'goal1.png';
    }
    setSvgAttributes(mainCanvas);
    var xml = outerHTML(mainCanvas);
    var svgimage = svgToImage(xml);
    svgimage.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = svgimage.width;
        canvas.height = svgimage.height;
        var context = canvas.getContext('2d');
        context.drawImage(svgimage, 0, 0);
        var svgimgdata = context.getImageData(0, 0, canvas.width, canvas.height);

        var goalimage = new Image();
        goalimage.src = imgname;
        goalimage.onload = function() {
            var canvas2 = document.createElement('canvas');
            canvas2.width = goalimage.width;
            canvas2.height = goalimage.height;
            var context2 = canvas2.getContext('2d');
            context2.drawImage(goalimage, 0, 0);
            var goalimgdata = context2.getImageData(0, 0, canvas.width, canvas.height);
            validateSvgData(svgimgdata, goalimgdata, callbackFn);
        }
       
        // var a = document.createElement('a');
        // a.download = "image.png";
        // a.href = canvas.toDataURL('image/png');
        // document.body.appendChild(a);
        // a.click();
    }
}

function validateSvgData(svgimgdata, goalimgdata, callbackFn) {
    var colors = ["FFFFFF", "FDDD44", "E23571", "33722E", "664F23", "D9D9D9", "287490", "44D6BF", "FF7300", "7030A0"]
    function getPixel(img, x, y) {
        var i = y * img.width * 4 + x * 4;
        if (img.data[i+3] == 0) {
            return "FFFFFF";
        }
        return rgbToHex(img.data[i], img.data[i+1], img.data[i+2]);
    }
    function get9Pixels(img, x, y) {
        var drs = [-5, 0, 5];
        var pixels = [];
        drs.forEach(function(dx) {
            drs.forEach(function(dy) {
                if (0 <= x + dx && x + dx < img.width && 0 <= y + dy && y + dy < img.height) {
                    pixels.push(getPixel(img, x+dx, y+dy));
                }
            });
        });
        return pixels;
    }
    function hasError(x, y) {
        var svgcolor = getPixel(svgimgdata, x, y);
        var goalcolor = getPixel(goalimgdata, x, y);
        if (colors.includes(goalcolor) && goalcolor != svgcolor) {
            if (goalcolor == "FFFFFF") {
                if (colors.includes(svgcolor)) {
                    return !get9Pixels(svgimgdata, x, y).includes(goalcolor);
                }
                else {
                    return false;
                }
            }
            else {
                return !get9Pixels(svgimgdata, x, y).includes(goalcolor);
            }
        }
        return false;
    }
    errors = [];
    for (var y = 0; y < goalimgdata.height; y++) {
        for (var x = 0; x < goalimgdata.width; x++) {
            var point = {};
            point.x = x;
            point.y = y;
            if (hasError(x, y)) {
                errors.push(point);
            }
        }
    }
    errors = sparsify(errors);
    if (callbackFn) {
        callbackFn(errors);
    }
}

function pointIsNotNear(p, L) {
    var d = 40;
    for (var i = 0; i < L.length; i++) {
        var p2 = L[i];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        if (dx * dx + dy * dy < d * d) {
            return false;
        }
    }
    return true;
}

function sparsify(errors) {
    var newErrors = [];
    shuffle(errors);
    errors.forEach(function(p) {
        if (pointIsNotNear(p, newErrors)) {
            newErrors.push(p);
        }
    });
    return newErrors;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    var res = "" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    return res.toUpperCase();
  }

function svgToImage(xml) {
    var image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(xml);
    return image;
}



function clearCanvas(drawingCanvas, undoManager) {
    clearFeedbackMarks();
    drawingCanvas.strokes.forEach(function(stroke) {
        stroke.remove();
    });
    drawingCanvas.strokes = [];
    drawingCanvas.currentlyDrawing = false;
    drawingCanvas.showingFeedback = false;
    undoManager.clear();
    mainToolbar.tools.forEach(function(tool) {
        tool.usageCnt = 0;
        tool.usagePattern = "";
    })
    //updateCounter();
    /*recorder.recordClear();
    recorder.sendRecording();
    recorder.clearRecording();*/
}

function clearFeedbackMarks() {
    //document.getElementById("counter-submit-region").style.color = "#0077E0";
    while (drawingCanvas.feedbackMarks.length > 0){
        mark = drawingCanvas.feedbackMarks.pop();
        mark.remove();
    }
}

function StateSnapshot(strokes, currentTool) {
    this.strokes = strokes;
    this.currentTool = currentTool;
    this.cnts = [];
    this.pats = [];
    mainToolbar.tools.forEach(function(tool) {
        this.cnts.push(tool.usageCnt);
        this.pats.push(tool.usagePattern);
    }.bind(this));
}

/*function updateCounter(){
    if (drawingCanvas.level.maxStrokes <= 0) {
        strokeCounter.innerHTML = "" + drawingCanvas.strokes.length;
    } else {
        strokeCounter.innerHTML = "" + drawingCanvas.strokes.length + "/" + drawingCanvas.level.maxStrokes;
    }
    if (drawingCanvas.level.maxStrokes < 0) {
        submitButton.classList.remove('active-submit-button');
        submitButton.classList.add('inactive-submit-button');
    } else {
        submitButton.classList.remove('inactive-submit-button');
        submitButton.classList.add('active-submit-button');
    }
}*/

/*
function submitDrawing() {
    //recorder.recordSubmit();
    //recorder.sendRecording();
    clearFeedbackMarks();
    if (drawingCanvas.level.maxStrokes == -1) return;
    point = buttonToPoint["submit"];
    drawUnliftableIfDown(point.x, point.y);
    validateSvg(drawingCanvas.level.goalimg, function (errors) {
        var cert = "";
        mainToolbar.tools.forEach(function(tool) {
            cert += tool.usageCnt;
        });
        for (var i = 0; i < mainToolbar.tools.length; i++) {
            if (drawingCanvas.level.usageFilter.includes("" + i)) {
                cert += mainToolbar.tools[i].usagePattern;
            }
        }
        var res = true;
        drawingCanvas.strokes.forEach(function(stroke) {
            res = res && (stroke.path.getAttributeNS(null, "stroke").toUpperCase() == stroke.color);
        });
        cert += res;

        errors.forEach(function(error) {
            cert += error.x;
            cert += error.y;
        });
        //alert(cert);

        if (Encryption.hasho(cert) == drawingCanvas.level.completionH && drawingCanvas.strokes.length <= drawingCanvas.level.maxStrokes){
            drawingCanvas.level.completionKey = Encryption.decrypto(drawingCanvas.level.completionEnc, cert);
            //alert(drawingCanvas.level.completionKey);
            CookieManager.setCookie(drawingCanvas.level.completionKeyName, drawingCanvas.level.completionKey);
            drawingCanvas.level.button.classList.add("completed-level");
            checkCompletion();
        } 
        showErrors(errors);
        /*if (drawingCanvas.strokes.length > drawingCanvas.level.maxStrokes) {
            document.getElementById("counter-submit-region").style.color = "#f00";
        }
    });
}*/

function checkCompletion() {
    var cert = "";
    var allDone = true;
    for(i = 0; i < requiredLevels.length; i++){
        cert += requiredLevels[i].completionKey;
        if (requiredLevels[i].completionKey == "") {
            allDone = false;
        }
    }
    if (allDone){
        if (Encryption.hasho(cert) == "3e555da31fb0fb45bcc7e55af26cd4c1") {
            //finalMessage = document.getElementById("final-message");
            finalMessage.innerHTML = Encryption.decrypto("U2FsdGVkX1/wNWiF1qRYIfNt0WHMugrmvX4lcixX84ktdLVegQXETmLrUrrDEV/MifLw1MlDsp85n4jeWtK9og==", cert);
        }
        else {
            alert("Decryption failure! Please don't change this puzzle's source code.");
        }
    }
}

function UndoManager(drawingCanvas) {
    this.snapshots = [];
    this.drawingCanvas = drawingCanvas;
}
UndoManager.prototype.pushCurrent = function() {
    if (this.drawingCanvas.currentlyDrawing) return;
    var strokesCopy = [];
    this.drawingCanvas.strokes.forEach(function(stroke) {
        strokesCopy.push(stroke.copy());
    })
    s = new StateSnapshot(strokesCopy, this.drawingCanvas.currentTool);
    this.snapshots.push(s);
}
UndoManager.prototype.undo = function() {
    clearFeedbackMarks();
    if (this.snapshots.length == 0) return;
    /*if (this.snapshots.length == 1) {
        recorder.recordUndo();
        recorder.sendRecording();
        recorder.clearRecording();
    } else {
        recorder.recordUndo();
    }*/
    s = this.snapshots.pop();
    this.drawingCanvas.strokes.forEach(function(s) {
        s.remove();
    });
    this.drawingCanvas.strokes = s.strokes;
    this.drawingCanvas.strokes.forEach(function(s) {
        s.show();
    });
    for (var i = 0; i < mainToolbar.tools.length; i++) {
        mainToolbar.tools[i].usageCnt = s.cnts[i];
        mainToolbar.tools[i].usagePattern = s.pats[i];
    }
    //drawingCanvas.currentTool = s.currentTool;
    point = buttonToPoint["undo"];
    drawUnliftableIfDown(point.x, point.y, this.drawingCanvas);
    //updateCounter();
}
UndoManager.prototype.clear = function() {
    this.snapshots = [];
}

function onload() {
    //canvasRect = mainCanvas.getBoundingClientRect();
    //strokeCounter = document.getElementById("stroke-counter");
    pinkTool = new Tool("#E23571", StickyBrush);//, document.getElementById("pink-button"));
    orangeTool = new Tool("#FF7300", NoLeftBrush);//, document.getElementById("orange-button"));
    yellowTool = new Tool("#FDDD44", StartDoubleRotationBrush);//, document.getElementById("yellow-button"));
    greenTool = new Tool("#33722E", ErasableBrush);//, document.getElementById("green-button"));
    tealTool = new Tool("#44D6BF", new ColorRotationBrush(["#44D6BF", "#FFFFFF"]));//, document.getElementById("teal-button"));
    blueTool = new Tool("#287490", EraserBrush);//, document.getElementById("blue-button"));
    purpleTool = new Tool("#7030A0", GravityBrush);//, document.getElementById("purple-button"));
    brownTool = new Tool("#664F23", UnliftableBrush);//, document.getElementById("brown-button"));
    greyTool = new Tool("#D9D9D9", YMirrorBrush);//, document.getElementById("grey-button"));
    colorToTool["#E23571"] = pinkTool;
    colorToTool["#FF7300"] = orangeTool;
    colorToTool["#FDDD44"] = yellowTool;
    colorToTool["#33722E"] = greenTool;
    colorToTool["#44D6BF"] = tealTool;
    colorToTool["#287490"] = blueTool;
    colorToTool["#7030A0"] = purpleTool;
    colorToTool["#664F23"] = brownTool;
    colorToTool["#D9D9D9"] = greyTool;
    /*sandbox = new Level("url(./0-Sandbox.png)", "", document.getElementById("level-0-button"), -1, null, null, null, null);
    level1 = new Level("url(./1-Flower-Guide.png)", "goal1n.png", document.getElementById("level-1-button"), 3, "l1prog", "721277572b14b85006efeb8a90716c7a", "U2FsdGVkX19B05DObvc/89rwjz5sZEaN8VJ21R4ubxU", "2468");
    level2 = new Level("url(./2-Fish-Guide.png)", "goal2n.png", document.getElementById("level-2-button"), 5, "l2prog", "6c28cf9cc37ca414dfe1b274a52e9198", "U2FsdGVkX1/Wk33zZBKJuLMTIMyjjBBfz03Tqp8HwbM=", "2348");
    level3 = new Level("url(./3-Boat-Guide.png)", "goal3n.png", document.getElementById("level-3-button"), 3, "l3prog", "0099629c1c6a14154ffe3561d2127b56", "U2FsdGVkX1+WJ+pJl07EymJQXXDnaLsFrnns8e3LEOM=", "012345678");*/
    //requiredLevels = [level1, level2, level3];
    //submitButton = document.getElementById("submit-button");
    canvasArea =  document.getElementById("canvas-area");
    for (i = startCanvas; i < startCanvas + numCanvases; i++){
        newHTML = ("<svg viewBox='0 0 640 480' width='120' height='90' id='canvas" + i + "'></svg>");
        canvasArea.innerHTML += newHTML; 
    }
    mainToolbar = new Toolbar([pinkTool, orangeTool, yellowTool, greenTool, tealTool, blueTool, purpleTool, brownTool, greyTool]);
    for (i = startCanvas; i < startCanvas + numCanvases; i++){
        canvas = document.getElementById("canvas"+i);
        drawingCanvas = new DrawingCanvas(mainToolbar, canvas);
        drawingCanvas.drawCanvas();
        undoManager = new UndoManager(drawingCanvas);
        drawingCanvas.undoManager = undoManager;
        playbackMachine = new PlaybackMachine(recordStrings[i], drawingCanvas, undoManager);
        playbackMachine.startPlayback(5);
        (function(machine) {
            machine.interval = setInterval(function() {
                machine.stepPlayback();
            }, 10);}) (playbackMachine);
    }
    //recorder = new Recorder();
    //sandbox.selectLevel();
    /*mainCanvas.addEventListener('mousedown', function(e) { drawingCanvas.startStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mousemove', function(e) { drawingCanvas.moveMouse(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mouseup', function(e) { drawingCanvas.endStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    mainCanvas.addEventListener('mouseleave', function(e) { drawingCanvas.endStroke(e.clientX - canvasRect.left, e.clientY - canvasRect.top) }.bind(this));
    checkCompletion();*/
}

//window.addEventListener('scroll', function(e) { canvasRect = mainCanvas.getBoundingClientRect(); });
//window.addEventListener('resize', function(e) { canvasRect = mainCanvas.getBoundingClientRect(); });

function showErrors(errs) {
    errors = [];
    point_hashes = ["abef00f320aeb121d06543cc410bfc17", "11dbcab322366d3b355e00a87fe4f40e", "271aa048ef896de63e47d938431f2b25"];
    errs.forEach(function(error) {
        if (!point_hashes.includes(Encryption.hasho("" + error.x + error.y))) {
            errors.push(error);
        }
    })
    if (errors.length != 0) {
        rect = document.createElementNS(svgNS, 'rect'); //Create the rect.
        rect.setAttributeNS(null, "x", 0); //Set its attributes.
        rect.setAttributeNS(null, "y", 0);
        rect.setAttributeNS(null, "width", 640);
        rect.setAttributeNS(null, "height", 480);
        rect.setAttributeNS(null, "fill", "#ffffff");
        rect.setAttributeNS(null, "fill-opacity", "0.4");
        mainCanvas.appendChild(rect);
        drawingCanvas.feedbackMarks.push(rect);
        errors.forEach(function (errorPoint) {
            circle = document.createElementNS(svgNS, 'ellipse'); //Create the rect.
            circle.setAttributeNS(null, "rx", "20"); //Set its attributes.
            circle.setAttributeNS(null, "ry", "20");
            circle.setAttributeNS(null, "cx", "" + errorPoint.x);
            circle.setAttributeNS(null, "cy", "" + errorPoint.y);
            circle.setAttributeNS(null, "fill-opacity", "0");
            circle.setAttributeNS(null, "stroke-width", "6");
            circle.setAttributeNS(null, "stroke", "#FF1111");
            mainCanvas.appendChild(circle);
            drawingCanvas.feedbackMarks.push(circle);
        });
        drawingCanvas.showingFeedback = true;
    }
}

//BEGIN BRUSH DEFINTIONS

function NormalBrush() {}
//what the brush does when the user first begins drawing
NormalBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
NormalBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
NormalBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
NormalBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
NormalBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
NormalBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function YMirrorBrush() {}
//what the brush does when the user first begins drawing
YMirrorBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + (svgHeight - mouseY) 
                                        + " L " + mouseX + " " + (svgHeight - mouseY));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
YMirrorBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + (svgHeight - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
YMirrorBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
YMirrorBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
YMirrorBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
YMirrorBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}

function Encryption() {

}
Encryption.encrypto = function(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}
Encryption.decrypto = function(data, key) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
Encryption.hasho = function(data) {
    return CryptoJS.MD5(data).toString();
}

function XMirrorBrush() {}
//what the brush does when the user first begins drawing
XMirrorBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + (svgWidth - mouseX) + " " + mouseY
                                     + " L " + (svgWidth - mouseX) + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
XMirrorBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + (svgWidth - mouseX) + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
XMirrorBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
XMirrorBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
XMirrorBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
XMirrorBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function CenterRotationBrush() {}
//what the brush does when the user first begins drawing
CenterRotationBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    centerX = svgWidth / 2;
    centerY = svgHeight / 2;
    currentStroke.path.setAttributeNS(null, "d", "M " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY)
                                      + " L " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
CenterRotationBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    centerX = svgWidth / 2;
    centerY = svgHeight / 2;
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + ((2 * centerX) - mouseX) + " " + ((2 * centerY) - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
CenterRotationBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
CenterRotationBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
CenterRotationBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
CenterRotationBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function StartRotationBrush() {}
//what the brush does when the user first begins drawing
StartRotationBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.startX = mouseX;
    currentStroke.startY = mouseY;
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
StartRotationBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + ((2 * currentStroke.startX) - mouseX) + " " + ((2 * currentStroke.startY) - mouseY);
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
StartRotationBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
StartRotationBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
StartRotationBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
StartRotationBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function StartDoubleRotationBrush() {}
//what the brush does when the user first begins drawing
StartDoubleRotationBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.startX = mouseX;
    currentStroke.startY = mouseY;
    currentStroke.points = ["" + mouseX + " " + mouseY,
                            "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
StartDoubleRotationBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.points.push("" + mouseX + " " + mouseY);
    currentStroke.points.unshift("" + ((2 * currentStroke.startX) - mouseX) + " " + ((2 * currentStroke.startY) - mouseY));
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
}
//for brushes that do something when the user lifts them up
StartDoubleRotationBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
StartDoubleRotationBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
StartDoubleRotationBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
StartDoubleRotationBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function ColorRotationBrush(colors) {
    this.colors = colors;
}
//what the brush does when the user first begins drawing
ColorRotationBrush.prototype.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", this.colors[0]);
    currentStroke.color = this.colors[0];
    currentStroke.colorNum = 0;
}
//what the brush does when the user moves the mouse
ColorRotationBrush.prototype.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
ColorRotationBrush.prototype.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
ColorRotationBrush.prototype.onStrokeStarts  = function(currentStroke, drawingCanvas) {
    newNum = (currentStroke.colorNum + 1) % this.colors.length;
    currentStroke.colorNum = newNum;
    currentStroke.path.setAttributeNS(null, "stroke", this.colors[currentStroke.colorNum]);
    currentStroke.color = this.colors[currentStroke.colorNum];
}
//onStrokes is for brushes that change with every subsequent stroke movement
ColorRotationBrush.prototype.onStrokes  = function(currentStroke, drawingCanvas) {}
ColorRotationBrush.prototype.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function ErasableBrush() {}
//what the brush does when the user first begins drawing
ErasableBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.points = ["" + mouseX + " " + mouseY,
                            "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
ErasableBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.points.push("" + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
}
//for brushes that do something when the user lifts them up
ErasableBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.eraseNow = false;
}
//onStrokeStarts is for brushes that change once per subsequent stroke
ErasableBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
ErasableBrush.onStrokes  = function(currentStroke, drawingCanvas) {
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
ErasableBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function DelayedBrush() {}
//what the brush does when the user first begins drawing
DelayedBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.pointsQueued = ["" + mouseX + " " + mouseY,
                                  "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "");
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
DelayedBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.pointsQueued.push("" + mouseX + " " + mouseY);
}
//for brushes that do something when the user lifts them up
DelayedBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
DelayedBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
DelayedBrush.onStrokes  = function(currentStroke, drawingCanvas) {
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
DelayedBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function EraserBrush() {} //IN PROGRESS
//what the brush does when the user first begins drawing
EraserBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.eraseNow = false;
}
//what the brush does when the user moves the mouse
EraserBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
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
EraserBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
EraserBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
EraserBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
EraserBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function GravityBrush() {}
//what the brush does when the user first begins drawing
GravityBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
GravityBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
GravityBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.velocity = 1;
    touchingFloor = false;
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    pathParts = currentPath.split(" ");
    for (i = 2; i < pathParts.length; i+=3){
        pathY = parseFloat(pathParts[i]);
        if (pathY + (strokeWeight/2) >= svgHeight) {
            touchingFloor = true;
        }
    }
    if (!touchingFloor) {
        currentStroke.gravityInterval = setInterval(function() {
            applyGravity(currentStroke, drawingCanvas);
        }, 10);
    }
}
//onStrokeStarts is for brushes that change once per subsequent stroke
GravityBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
GravityBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
GravityBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}


function applyGravity(currentStroke, drawingCanvas) {
    touchingFloor = false;
    maxSubtract = 0;
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    pathParts = currentPath.split(" ");
    for (i = 2; i < pathParts.length; i+=3){
        pathY = parseFloat(pathParts[i]);
        newY = pathY + currentStroke.velocity;
        if (newY >= svgHeight) {
            touchingFloor = true;
            if (newY - svgHeight + (strokeWeight/2)> maxSubtract) {
                maxSubtract = newY - svgHeight + (strokeWeight/2);
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
        clearInterval(currentStroke.gravityInterval);
        currentStroke.gravityInterval = null;
        return;
    }
    currentStroke.velocity = Math.min(currentStroke.velocity + 0.5, 70);
}


function StickyBrush() {} //TODO: ADDRESS MOUSING OUT
//what the brush does when the user first begins drawing
StickyBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.points = ["" + mouseX + " " + mouseY,
                            "" + mouseX + " " + mouseY]
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.sticking = false;
    currentStroke.endX = 0;
    currentStroke.endY = 0;
}
//what the brush does when the user moves the mouse
StickyBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.points.push("" + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "d", "M " + currentStroke.points.join(" L "));
}
//for brushes that do something when the user lifts them up
StickyBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.endX = mouseX;
    currentStroke.endY = mouseY;
    currentStroke.sticking = true;
}
//onStrokeStarts is for brushes that change once per subsequent stroke
StickyBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {
    currentStroke.sticking = false;
}
//onStrokes is for brushes that change with every subsequent stroke movement
StickyBrush.onStrokes  = function(currentStroke) {}
StickyBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {
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
DominatingBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
}
//what the brush does when the user moves the mouse
DominatingBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
}
//for brushes that do something when the user lifts them up
DominatingBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    for (i = 0; i < drawingCanvas.strokes.length; i++) {
        testStroke = drawingCanvas.strokes[i];
        testStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    }
}
//onStrokeStarts is for brushes that change once per subsequent stroke
DominatingBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
DominatingBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
DominatingBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}

function pointTouchingEdge(x, y, drawingCanvas) {
    var w = svgWidth;
    var h = svgHeight;
    var r = strokeWeight / 2;
    var res = (x <= r || x >= w - r || y <= r || y >= h - r);
    return res;
}

function buttonToCanvasPoint(button, drawingCanvas) {
    canvasRect = drawingCanvas.mainCanvas.getBoundingClientRect();
    buttonX = button.getBoundingClientRect().left + (button.getBoundingClientRect().width / 2) + window.scrollX - canvasRect.left;
    buttonY = button.getBoundingClientRect().top + (button.getBoundingClientRect().height / 2) + window.scrollY - canvasRect.top;
    return {
        x: buttonX,
        y: buttonY
    }
}


function UnliftableBrush() {}
//what the brush does when the user first begins drawing
UnliftableBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.down = true;
}
//what the brush does when the user moves the mouse
UnliftableBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentPath = currentStroke.path.getAttributeNS(null, "d");
    newPath = currentPath + " L " + mouseX + " " + mouseY;
    currentStroke.path.setAttributeNS(null, "d", newPath);
    currentStroke.touchingEdge = pointTouchingEdge(mouseX, mouseY, drawingCanvas);
}
//for brushes that do something when the user lifts them up
UnliftableBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
UnliftableBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {
    currentStroke.down = false;
}
//onStrokes is for brushes that change with every subsequent stroke movement
UnliftableBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
UnliftableBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    if (currentStroke.down){
        currentPath = currentStroke.path.getAttributeNS(null, "d");
        newPath = currentPath + " L " + mouseX + " " + mouseY;
        currentStroke.path.setAttributeNS(null, "d", newPath);
        currentStroke.touchingEdge = pointTouchingEdge(mouseX, mouseY, drawingCanvas);
    }
}


function NoLeftBrush() {}
//what the brush does when the user first begins drawing
NoLeftBrush.onStart = function(mouseX, mouseY, currentStroke, drawingCanvas) {
    currentStroke.path.setAttributeNS(null, "d", "M " + mouseX + " " + mouseY + " L " + mouseX + " " + mouseY);
    currentStroke.path.setAttributeNS(null, "stroke", currentStroke.color);
    currentStroke.lastX = mouseX;
}
//what the brush does when the user moves the mouse
NoLeftBrush.onDraw = function(mouseX, mouseY, currentStroke, drawingCanvas) {
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
NoLeftBrush.onEnd = function(mouseX, mouseY, currentStroke, drawingCanvas) {}
//onStrokeStarts is for brushes that change once per subsequent stroke
NoLeftBrush.onStrokeStarts  = function(currentStroke, drawingCanvas) {}
//onStrokes is for brushes that change with every subsequent stroke movement
NoLeftBrush.onStrokes  = function(currentStroke, drawingCanvas) {}
NoLeftBrush.onNonStrokeMove = function(mouseX, mouseY, currentStroke, drawingCanvas) {}

function drawUnliftableIfDown(x, y, drawingCanvas){
    if (drawingCanvas.strokes.length > 0 && 
            drawingCanvas.strokes[drawingCanvas.strokes.length - 1].brush == UnliftableBrush &&
            drawingCanvas.strokes[drawingCanvas.strokes.length - 1].down &&
            !drawingCanvas.strokes[drawingCanvas.strokes.length - 1].touchingEdge){
        lastPath = drawingCanvas.strokes[drawingCanvas.strokes.length - 1].path.getAttributeNS(null, "d");
        newPath = lastPath + " L " + x + " " + y;
        drawingCanvas.strokes[drawingCanvas.strokes.length - 1].path.setAttributeNS(null, "d", newPath);
    }

}


//END BRUSH DEFINTIONS

function Event(eventType){
    this.type = eventType;
}


function PlaybackMachine(jsonString, drawingCanvas, undoManager){
    this.setInfoFromRecorderText(jsonString);
    this.speedupFactor = 1;
    this.drawingCanvas = drawingCanvas;
    this.undoManager = undoManager;
    this.paused = false;
}
PlaybackMachine.prototype.setInfoFromRecorderText = function(recorderText){
    this.recorder = JSON.parse(recorderText);
    this.recordedStartTime = this.recorder.recording[1].time;
    this.currentFrameNumber = 0;
}
PlaybackMachine.prototype.startPlayback = function(speedupFactor){
    this.speedupFactor = speedupFactor;
    d = new Date();
    this.startTime = d.getTime();
    this.currentFrameNumber = 0;
    this.paused = false;
    clearCanvas(this.drawingCanvas, this.undoManager);
}
PlaybackMachine.prototype.stepPlayback = function(){
    d = new Date();
    currentTime = d.getTime();
    nextRecordedTime = this.recorder.recording[this.currentFrameNumber].time;
    if (((currentTime - this.startTime) * this.speedupFactor) >= (nextRecordedTime - this.recordedStartTime)) {
        event = this.recorder.recording[this.currentFrameNumber];
        this.executeStep(event);
        this.currentFrameNumber = this.currentFrameNumber + 1;
        if (this.currentFrameNumber > this.recorder.recording.length - 1) {
            this.startPlayback(this.speedupFactor);
        }
    }

}
PlaybackMachine.prototype.executeStep = function(event){
    if (event.type == "toolChange"){
        newTool = colorToTool[event.tool.color];
        newTool.selectTool(this.drawingCanvas);
    } else if (event.type == "undo"){
        this.undoManager.undo();
    } else if (event.type == "startStroke"){
        this.drawingCanvas.startStroke(event.x, event.y);
    } else if (event.type == "endStroke"){
        for (j = 0; j < event.skips; j++){
            this.drawingCanvas.moveMouse(event.x, event.y); //possibly subject to change
        }
        this.drawingCanvas.endStroke(event.x, event.y);
    } else if (event.type == "moveMouse"){
        for (j = 0; j <= event.skips; j++){
            this.drawingCanvas.moveMouse(event.x, event.y); //possibly subject to change
        }
    } else if (event.type == "submit"){
        for (j = 0; j <= event.skips; j++){
            point = buttonToPoint["submit"]
            this.drawingCanvas.moveMouse(point.x, point.y); //possibly subject to change
        }
    }
}

/*function Recorder() {
    if (drawingCanvas.level != null){
        this.levelImg = drawingCanvas.level.image;
    } else {
        this.levelImg = sandbox.image;
    }
    if (CookieManager.getCookie("userID") == ""){
        newID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        CookieManager.setCookie("userID", newID);
        this.user = newID;
    } else {
        this.user = CookieManager.getCookie("userID");
    }
    this.skipsSoFar = 0;
    this.recording = [];
    this.recordToolChange(drawingCanvas.currentTool);
}
Recorder.prototype.clearRecording = function() {
    this.levelImg = drawingCanvas.level.image;
    this.skipsSoFar = 0;
    this.recording = [];
    this.recordToolChange(drawingCanvas.currentTool);
}
Recorder.prototype.sendRecording = function() {
    if (this.recording.length > 3)
    {
        recordingString = JSON.stringify(this); 
        //console.log(recordingString);
        $.post("https://puzzlehunt.club.cc.cmu.edu:5005/save", recordingString);
    }
}
Recorder.prototype.recordMouseEvent = function(eventType, mouseX, mouseY) {
    event = new Event(eventType);
    event.x = ~~mouseX;
    event.y = ~~mouseY;
    if (event.type == "endStroke"){
        event.skips = this.skipsSoFar;
        this.skipsSoFar = 0;
        d = new Date();
        event.time = d.getTime();
        this.recording.push(event);
    } else if (event.type == "startStroke"){
        event.skips = 0;
        this.skipsSoFar = 0;
        d = new Date();
        event.time = d.getTime();
        this.recording.push(event);
    } else if (event.type == "moveMouse"){
        event.skips = this.skipsSoFar;
        if(this.recording.length > 0 && 
        this.recording[this.recording.length-1].type == "moveMouse"){
            prev = this.recording[this.recording.length-1];
            dx = prev.x - event.x;
            dy = prev.y - event.y;
            dist = Math.sqrt((dx*dx) + (dy*dy));
            if (dist > 12){
                d = new Date();
                event.time = d.getTime();
                this.recording.push(event);
                this.skipsSoFar = 0;
            } else {
                this.skipsSoFar += 1;
            }
        } else {
            d = new Date();
            event.time = d.getTime();
            this.recording.push(event);
            this.skipsSoFar = 0;
        }
    }
}
Recorder.prototype.recordToolChange = function(newTool){
    event = new Event("toolChange");
    event.tool = newTool;
    d = new Date();
    event.time = d.getTime();
    this.recording.push(event);
}
Recorder.prototype.recordUndo = function(){
    event = new Event("undo");
    d = new Date();
    event.time = d.getTime();
    this.recording.push(event);
}
Recorder.prototype.recordClear = function(){
    event = new Event("clear");
    d = new Date();
    event.time = d.getTime();
    this.recording.push(event);
}
Recorder.prototype.recordSubmit = function(){
    event = new Event("submit");
    d = new Date();
    event.time = d.getTime();
    this.recording.push(event);
}*/


/*function Level(image, goalimg, button, maxStrokes, completionKeyName, completionH, completionEnc, usageFilter) {
    this.image = image;
    this.goalimg = goalimg;
    this.button = button;
    this.button.onclick = this.selectLevel.bind(this);
    this.maxStrokes = maxStrokes;
    this.completionKeyName = completionKeyName;
    this.completionKey = "";
    this.completionH = completionH;
    this.completionEnc = completionEnc;
    this.usageFilter = usageFilter;
    if (completionKeyName != null) {
        this.completionKey = CookieManager.getCookie(completionKeyName);
        if (this.completionKey != "") {
            this.button.classList.add("completed-level");
        }
    }
}
Level.prototype.selectLevel = function() {
    //background = document.getElementById("level-background");
    //background.style.backgroundImage = this.image;
    if (drawingCanvas.level != null) {
        drawingCanvas.level.button.classList.remove('selected-level');
    }
    this.button.classList.add('selected-level');
    drawingCanvas.level = this;
    updateCounter();
    clearCanvas(); //also updates recorder
}*/

function Stroke(color, brush) {
    this.color = color;
    this.brush = brush;
    var newPath = document.createElementNS(svgNS, 'path');
    newPath.setAttributeNS(null, "stroke-linejoin", "round");
    newPath.setAttributeNS(null, "stroke-linecap", "round");
    newPath.setAttributeNS(null, "fill", "none");
    newPath.setAttributeNS(null, "stroke-width", "" + strokeWeight);
    this.path = newPath;
}
Stroke.prototype.remove = function() {
    this.path.remove();
}
Stroke.prototype.show = function() {
    mainCanvas.appendChild(this.path);
    if (this.gravityInterval != null) {
        this.gravityInterval = setInterval(function() {
            applyGravity(this, this.drawingCanvas);
        }.bind(this), 10);
    }
}
Stroke.prototype.copy = function() {
    var s = new Stroke(this.color, this.brush);
    s.down = this.down;
    s.sticking = this.sticking;
    s.colorNum = this.colorNum;
    if (this.points != undefined)
        s.points = this.points.slice();
    if (this.pointsQueued != undefined)
        s.pointsQueued = this.pointsQueued.slice();
    s.eraseNow = this.eraseNow;
    s.velocity = this.velocity;
    s.endX = this.endX;
    s.endY = this.endY;
    s.lastX = this.lastX;
    s.gravityInterval = this.gravityInterval;
    s.touchingEdge = this.touchingEdge;
    
    var d = this.path.getAttributeNS(null, "d");
    var stroke = this.path.getAttributeNS(null, "stroke");
    s.path.setAttributeNS(null, "d", d);
    s.path.setAttributeNS(null, "stroke", stroke);
    return s;
}

function Tool(color, brush) {
    this.color = color;
    this.brush = brush;
    /*this.button = button;
    this.button.onclick = this.selectTool.bind(this);*/
    this.usageCnt = 0;
    this.usagePattern = "";
}
Tool.prototype.selectTool = function(drawingCanvas) {
    point = buttonToPoint[this.color];
    drawUnliftableIfDown(point.x, point.y, drawingCanvas);
    // drawingCanvas.moveMouse(buttonX - canvasRect.left, buttonY - canvasRect.top);
    //drawingCanvas.currentTool.button.classList.remove('selected-tool-button');
    drawingCanvas.currentTool = this;
    //this.button.classList.add('selected-tool-button');
    //clearFeedbackMarks();
    //recorder.recordToolChange(this);
}


function Toolbar(tools) {
    this.tools = tools;
}

function DrawingCanvas(toolbar, canvas) {
    this.toolbar = toolbar;
    this.strokes = [];
    this.feedbackMarks = [];
    this.currentTool = this.toolbar.tools[0]; //start with the first tool selected
    //this.currentTool.button.classList.add('selected-tool-button');
    this.currentlyDrawing = false;
    this.showingFeedback = false;
    this.mainCanvas = canvas;
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
    this.mainCanvas.appendChild(this.rect);
    //updateCounter();
}
DrawingCanvas.prototype.startStroke = function(mouseX, mouseY){
    //recorder.recordMouseEvent("startStroke", mouseX, mouseY);
    clearFeedbackMarks();
    this.moveMouse(mouseX, mouseY);
    this.undoManager.pushCurrent();
    if (!this.currentlyDrawing){
        this.strokes.forEach(function(stroke) { stroke.brush.onStrokeStarts(stroke, this) } .bind(this));
        if (this.strokes.length >= 1 &&
            this.strokes[this.strokes.length - 1].brush == UnliftableBrush) {
            lastStroke = this.strokes[this .strokes.length - 1];
            if (lastStroke.down) {
                lastPath = lastStroke.path.getAttributeNS(null, "d");
                newPath = lastPath + " L " + mouseX + " " + mouseY;
                lastStroke.path.setAttributeNS(null, "d", newPath);
            }
        }
        this.currentlyDrawing = true;
        newStroke = new Stroke(this.currentTool.color, this.currentTool.brush);
        newStroke.drawingCanvas = this;
        this.currentTool.brush.onStart(mouseX, mouseY, newStroke, this);
        this.strokes.push(newStroke);
        this.currentTool.usageCnt++;
        this.currentTool.usagePattern += "" + this.strokes.length;
        this.mainCanvas.appendChild(newStroke.path);
        //updateCounter();
    }
}
DrawingCanvas.prototype.moveMouse = function(mouseX, mouseY){
    if (this.currentlyDrawing) {
        //recorder.recordMouseEvent("moveMouse", mouseX, mouseY);
        this.strokes.forEach(function(stroke) { 
            if (stroke != this.strokes[this.strokes.length - 1]) 
                { stroke.brush.onStrokes(stroke, this) }} .bind(this));
        this.currentTool.brush.onDraw(mouseX, mouseY, this.strokes[this.strokes.length - 1], this);
    } else {
        this.strokes.forEach(function(stroke) { stroke.brush.onNonStrokeMove(mouseX, mouseY, stroke, this) } .bind(this));
        /*if (this.strokes.length > 0 && 
            (this.strokes[this.strokes.length - 1].sticking ||
             this.strokes[this.strokes.length - 1].down)){ //if pink or brown are active
            //recorder.recordMouseEvent("moveMouse", mouseX, mouseY);
        }*/
    }
}
DrawingCanvas.prototype.endStroke = function(mouseX, mouseY){
    if (this.currentlyDrawing){
        //recorder.recordMouseEvent("endStroke", mouseX, mouseY);
        this.currentlyDrawing = false;
        this.currentTool.brush.onEnd(mouseX, mouseY, this.strokes[this.strokes.length - 1], this);
    }
}


onload();

// MainCanvas (draw events), Toolbar (current tool), Tool (color, brush)
// Brush (instructions on how to draw), Level, Stroke
// 