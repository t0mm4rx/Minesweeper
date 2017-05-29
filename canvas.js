var cellWidth = 30,
    cols = 10,
    rows = 10,
    mineCount = 10;
var cells;
var iManager;
var time = 0,
    lastUpdate = Date.now();
var running = true,
    started = false;

function setup() {
    if (getParam("mines")) {
        mineCount = getParam("mines");
    }
    var cnv = createCanvas(window.innerHeight * 50 / 100, window.innerHeight * 50 / 100);
    cellWidth = width / cols;
    initArray();
    iManager = new InterpolationManager();
    editSelectedMines(getSelectedCount());
    document.getElementById("total").innerHTML = mineCount;

    //CSS things
    cnv.canvas.style.position = "absolute";
    cnv.canvas.style.left = (window.innerWidth - width) / 2 + "px";
    cnv.canvas.style.top = (window.innerHeight - height) / 2 + "px";

    var elm = document.getElementById('mine-elements');
    elm.style.position = "absolute";
    elm.style.left = (window.innerWidth - width) / 2 + "px";
    elm.style.top = (window.innerHeight - height) / 2 - 30 + "px";

    var elm2 = document.getElementById('time-elements');
    elm2.style.position = "absolute";
    elm2.style.top = (window.innerHeight + height) / 2 + 30 + "px";
}

function draw() {
    iManager.update();
    background(37, 116, 169);
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            cells[x][y].draw();
        }
    }
    if (Date.now() - lastUpdate > 1000 && started && running) {
        lastUpdate = Date.now();
        time++;
        document.getElementById("time").innerHTML = formatTime(time);
    }
}

function initArray() {
    cells = new Array(rows);
    for (var y = 0; y < rows; y++) {
        cells[y] = new Array(cols);
    }
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            var cell = new Cell(x, y);
            cell.b -= x * 4;
            cell.g += y * 4;
            cell.r += x * 6;
            cells[x][y] = cell;
        }
    }

    for (var i = 0; i < mineCount; i++) {
        var x = floor(random(0, rows - 1));
        var y = floor(random(0, cols - 1));
        if (!cells[x][y].isMine) {
            cells[x][y].isMine = true;
        } else {
            i--;
        }
    }

    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            var count = 0;
            var closes = cells[x][y].getCells();
            for (var i = 0; i < closes.length; i++) {
                if (closes[i].isMine) {
                    count++;
                }
            }
            cells[x][y].closeMines = count;
            //console.log(count);
        }
    }

}

function mousePressed() {
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            cells[x][y].onClick(mouseX, mouseY);
        }
    }
}

function gameOver() {
    running = false;
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            cells[x][y].reveal(true);
        }
    }
    document.getElementById("result").innerHTML = "Game over !";
    document.getElementById("check").innerHTML = "<span class='icon'>b</span>New game";
    document.getElementById("check").disabled = false;
}

function gameWin() {
    running = false;
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            cells[x][y].reveal();
        }
    }
    document.getElementById("result").innerHTML = "Success !";
    if (confirm("You won ! Do you want to save your score ?")) {
        var name = prompt("Your name :");
        if (name) {
            saveScore(name, time);
            setTimeout(function() {
                window.location = "scores.html";
            }, 1000);

        }
    }
}

function editSelectedMines(n) {
    document.getElementById("mines").innerHTML = n;
}

function getSelectedCount() {
    var i = 0;
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            if (cells[x][y].isSelected) {
                i++;
            }
        }
    }

    if (i == mineCount) {
        document.getElementById("check").disabled = false;
    } else {
        document.getElementById("check").disabled = true;
    }

    return i;
}

function getSelectionMode() {
    var state = document.getElementById("selection").checked;
    if (state) {
        return 1;
    } else {
        return 0;
    }
}


function check() {
    if (running) {
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                if (cells[x][y].isMine && !cells[x][y].isSelected) {
                    gameOver();
                    return;
                }
                if (!cells[x][y].isMine && cells[x][y].isSelected) {
                    gameOver();
                    return;
                }
            }
        }
        gameWin();
    } else {
        window.location = "index.html";
    }
}

function getParam(param) {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function(m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

function formatTime(sec) {
    var secs = sec % 60;
    var mins = floor(sec / 60);
    return (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
}
