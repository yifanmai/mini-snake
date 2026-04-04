class World {
    /**
     *
     * @param {number} height
     * @param {number} width
     */
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.cells = new Array(this.height);
        for (let row = 0; row < this.height; ++row) {
            this.cells[row] = new Array(this.width);
        }
        this.reset();
    }

    reset() {
        for (let row = 0; row < this.width; ++row) {
            for (let col = 0; col < this.width; ++col) {
                this.cells[row][col] = EMPTY_CELL;
            }
        }
    }
}

class ConsoleDisplay {
    /**
     *
     * @param {World} world
     */
    render(world) {
        console.clear();
        for (let row = 0; row < world.height; ++row) {
            let line = "";
            line += row % 10;
            for (let col = 0; col < world.width; ++col) {
                if (world.cells[row][col] === SNAKE_CELL) {
                    line += "#";
                } else if (world.cells[row][col] === APPLE_CELL){
                    line += "*";
                } else {
                    line += ".";
                }

            }
            console.log(line);
        }
    }
}


const UP = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;

const EMPTY_CELL = 0;
const SNAKE_CELL = 1;
const APPLE_CELL = 2;

const DIRECTION_TO_DIFF = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
];

/**
 *
 * @param {number} max
 * @return {number} A random integer X where 0 <= X < max
 */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}

class Player {
    constructor() {
        this.direction = RIGHT;
        this.bindToKeyboardEvents();
    }

    getMove() {
        return this.direction;
    }

    bindToKeyboardEvents() {
        addEventListener("keydown", (event) => {
            if (event.code === "ArrowUp") {
                this.direction = UP;
                event.preventDefault();
            } else if (event.code === "ArrowLeft") {
                this.direction = LEFT;
                event.preventDefault();
            } else if (event.code === "ArrowDown") {
                this.direction = DOWN;
                event.preventDefault();
            } else if (event.code === "ArrowRight") {
                this.direction = RIGHT;
                event.preventDefault();
            }

        });
    }
}

class Game {
    /**
     *
     * @param {number} height
     * @param {number} width
     */
    constructor(height, width) {
        this.world = new World(height, width);
        this.display = new ConsoleDisplay();
        this.reset();
        this.timer = null;
        this.player = new Player();

    }

    reset() {
        this.world.reset();
        const snakeRow = Math.floor(this.world.height / 2);
        const snakeCol = Math.floor(this.world.width / 2);
        console.log(this.world);
        this.world.cells[snakeRow][snakeCol] = SNAKE_CELL;
        this.snakeCells = [[snakeRow, snakeCol]];
        this.placeApple();
        this.display.render(this.world);
    }

    placeApple() {
        const availableCells = [];
        // TODO: Check that there is at least one legal space
        for (let row = 0; row < this.world.width; ++row) {
            for (let col = 0; col < this.world.width; ++col) {
                if (this.world.cells[row][col] === EMPTY_CELL) {
                    availableCells.push([row, col]);
                }
            }
        }
        const randomIndex = randomInt(availableCells.length);
        this.appleCell = availableCells[randomIndex];
        const appleRow = this.appleCell[0];
        const appleCol = this.appleCell[1];
        this.world.cells[appleRow][appleCol] = APPLE_CELL;
    }

    step() {
        const direction = this.player.getMove();
        const snakeHead = this.snakeCells[0];
        const snakeHeadRow = snakeHead[0];
        const snakeHeadCol = snakeHead[1];
        const diff = DIRECTION_TO_DIFF[direction];
        const diffRow = diff[0];
        const diffCol = diff[1];
        let nextRow = snakeHeadRow + diffRow;
        let nextCol = snakeHeadCol + diffCol;
        if (nextRow < 0) { nextRow = this.world.height - 1; }
        else if (nextCol < 0) { nextCol = this.world.width - 1; }
        else if (nextRow >= this.world.height) { nextRow = 0; }
        else if (nextCol >= this.world.width) { nextCol = 0; }

        if (this.world.cells[nextRow][nextCol] === SNAKE_CELL) {
            this.display.render(this.world);
            this.stop()
            return;
        }


        const ateApple = this.world.cells[nextRow][nextCol] === APPLE_CELL;

        this.snakeCells.unshift([nextRow, nextCol]);
        this.world.cells[nextRow][nextCol] = SNAKE_CELL;

        if (ateApple) {
            this.placeApple();
        } else {

            const snakeTail = this.snakeCells.pop();
            const snakeTailRow = snakeTail[0];
            const snakeTailCol = snakeTail[1];
            this.world.cells[snakeTailRow][snakeTailCol] = EMPTY_CELL;
        }

        this.display.render(this.world);
    }

    start() {
        this.timer = setInterval(() => this.step(), 250);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

const game = new Game(16, 16);
