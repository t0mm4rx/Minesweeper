function Cell(x, y) {

    this.pos = createVector(x, y);
    this.isRevealed = false;
    this.isMine = false;
    this.r = 52;
    this.g = 152;
    this.b = 219;
    this.v = 0;
    this.closeMines = 0;
    this.isSelected = false;
    var _this = this;

    this.draw = function() {
        fill(this.r, this.g, this.b);
        if (this.isRevealed) {
            fill(this.r + 50 * this.v, this.g + 50 * this.v, this.b + 50 * this.v);
            if (this.isMine) {
                fill(this.r + 200 * this.v, this.g - 30 * this.v, this.b - 30 * this.v);
            }
        }
        if (this.isSelected) {
            fill(this.r + 100, this.g + 100, this.b - 40);
        }
        stroke(255, 255, 255);
        strokeWeight(0.2);
        rect(this.pos.x * cellWidth, this.pos.y * cellWidth, cellWidth, cellWidth);
        if (this.isRevealed && !this.isMine && this.closeMines > 0) {
            fill(100);
            noStroke();
            textSize(20);
            textAlign(CENTER);
            text(this.closeMines, this.pos.x * cellWidth + cellWidth / 2, this.pos.y * cellWidth + cellWidth / 2 + 6);
        }
    }

    this.onClick = function(x, y) {
        if (x > this.pos.x * cellWidth && x < (this.pos.x + 1) * cellWidth) {
            if (y > this.pos.y * cellWidth && y < (this.pos.y + 1) * cellWidth) {
                if (!started) {
                    started = true;
                }
                if (getSelectionMode() == 0) {
                    this.reveal();
                }
                if (getSelectionMode() == 1) {
                    this.select();
                }
            }

        }
    }

    this.reveal = function() {
        if (!this.isRevealed && !this.isSelected) {
            iManager.interpolate(0, 1, 100, InterpolationTypes.easeInQuart, function(value) {
                _this.v = value;
            }, function() {
                _this.v = 1;
            });
            this.isRevealed = true;
            if (this.closeMines == 0 && !this.isMine) {
                this.revealOther();
            }
            if (this.isMine)  {
                gameOver();
            }
        }
    }

    this.getCells = function() {
        var c = [];
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (x != 0 || y != 0) {
                    var tx = this.pos.x + x;
                    var ty = this.pos.y + y;
                    if (tx >= 0 && tx < cols) {
                        if (typeof(cells[tx][ty]) != 'undefined') {
                            c.push(cells[tx][ty]);
                        }
                    }
                }
            }
        }
        return c;
    }

    this.revealOther = function() {
        var closes = this.getCells();
        for (var i = 0; i < closes.length; i++) {
            if (this.closeMines == 0 && !closes[i].isRevealed) {
                closes[i].reveal();
                closes[i].revealOther();
            }
        }
    }

    this.select = function() {
        if (!this.isRevealed) {
            if (getSelectedCount() < mineCount) {
                this.isSelected = !this.isSelected;
                editSelectedMines(getSelectedCount());
            } else {
                if (this.isSelected) {
                    this.isSelected = false;
                    editSelectedMines(getSelectedCount());
                }
            }
        }
    }

}
