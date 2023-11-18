const panSpeed = 8; // 9
const gravity = 1.5; // 1.5
const initialJumpSpeed = -10; // -5
const jumpSpeed = -20;
let humanPlayer;
let pipeA;
let pipeB;
const canvasHeight = 600;
const canvasWidth = 720;
let maxScore = 0;
let speed = 60;
let welcomePage = true;

//------------------------------------ player class

class Player {
    constructor() {
        this.x = 125;
        this.y = canvasHeight / 2 - 70;
        this.vely = initialJumpSpeed;
        this.dead = false;
        this.score = 0;
        this.size = 30;
    }
    show() {
        fill('#F99417');
        rect(this.x, this.y, this.size);
    }
    move() {
        this.vely += gravity;
        this.vely = constrain(this.vely, -1000, 25);
        this.y += this.vely;
    }
    update() {
        this.checkCollision();
        this.scoreCalc();
        this.move();
        this.death();
    }
    checkCollision() {
        if (this.x + this.size >= pipeA.x && this.x <= pipeA.x + pipeA.width) {
            if (
                this.y <= canvasHeight - pipeA.height - 80 ||
                this.y + this.size >= pipeA.y + 80
            ) {
                this.dead = true;
            }
        }
        if (this.x + this.size >= pipeB.x && this.x <= pipeB.x + pipeB.width) {
            if (
                this.y <= canvasHeight - pipeB.height - 80 ||
                this.y + this.size >= pipeB.y + 80
            ) {
                this.dead = true;
            }
        }
    }
    flap() {
        this.vely = jumpSpeed;
    }
    death() {
        if (this.y + this.size > canvasHeight || this.y < 0) {
            this.dead = true;
        }
    }
    scoreCalc() {
        if (
            pipeA.x + pipeA.width < humanPlayer.x &&
            !pipeA.dead &&
            !pipeA.counted
        ) {
            humanPlayer.score++;
            pipeA.counted = true;
        } else if (
            pipeB.x + pipeB.width < humanPlayer.x &&
            !pipeB.dead &&
            !pipeB.counted
        ) {
            humanPlayer.score++;
            pipeB.counted = true;
        }
    }
}

//------------------------------------ pipes class

class Pipes {
    constructor(offset) {
        this.width = 60;
        this.maxHeight = (canvasHeight * 3) / 4;
        this.minHeight = canvasHeight / 4;
        this.height = random(this.minHeight - 40, this.maxHeight - 40);
        this.x = offset + canvasWidth;
        this.y = canvasHeight - this.height;
        this.velx = panSpeed;
        this.dead = false;
        this.counted = false;
    }
    show() {
        rectMode(CORNER);
        fill('#F5F5F5');
        rect(this.x, this.y + 80, this.width, this.height - 79);
        rect(this.x, -1, this.width, canvasHeight - this.height - 80);
    }
    move() {
        this.x -= this.velx;
    }
    update() {
        this.move();
        this.death();
    }
    death() {
        if (this.x + this.width < 0) {
            this.dead = true;
        }
    }
}

//------------------------------------ setup and draw

function setup() {
    window.canvas = createCanvas(canvasWidth, canvasHeight);
    humanPlayer = new Player();
    pipeA = new Pipes(0);
    pipeB = new Pipes(canvasWidth / 2);
}

function draw() {
    text('Roboto', 'white');
    noStroke();
    drawToScreen();
    humanPlaying();
}

function drawToScreen() {
    background('#4D4C7D');
    textSize(24);
    fill('black')
    text('Score: ' + humanPlayer.score, 35, 50);
    text('High Score: ' + maxScore, 160, 50);
}

function humanPlaying() {
    if (welcomePage) {
        background('#4D4C7D');
        fill('white');
        textSize(30);
        text(
            'Welcome to Flappy Square!',
            35,
            55
        );
        fill('#C2D9FF');
        textSize(24);
        text(
            '\n\nPress "B" to begin the game.',
            35,
            65
        );
        
        textSize(18);
        text(
            'Press "J", "Spacebar", or "+" to jump. \n\n\nPress "F" to speed up the framerate. \n\n\nPress "S" to slow down the framerate.',
            35,
            190
        );
        textSize(24);
        text('Press "A" to watch the AI play.', 35, 410);
        textSize(18);
        fill('white')
        text('Made by Somanshu Rath :)', 35, 550);
    } else if (!humanPlayer.dead) {
        // speedMod();
        pipeA.show();
        pipeB.show();
        pipeA.update();
        pipeB.update();
        humanPlayer.show();
        humanPlayer.update();
        if (pipeA.dead) {
            pipeA = new Pipes(0);
        } else if (pipeB.dead) {
            pipeB = new Pipes(0);
        }
    } else {
        background('#4D4C7D');
        fill('white');
        textSize(24);
        if (humanPlayer.score > maxScore) {
            text(
                'Score: ' +
                    humanPlayer.score +
                    '     NEW HIGH SCORE!!' +
                    '\n\n\nPress "P" to try again.',
                35,
                155
            );
        } else {
            text(
                'Score: ' +
                    humanPlayer.score +
                    '\n\n\nPress "P" to try again.',
                35,
                155
            );
        }
    }
}

// function speedMod() {
//     while (panSpeed<9){
//     panSpeed = 4 + Math.floor(humanPlayer.score / 5);
//     }
// }

function keyPressed() {
    switch (key) {
        case 'a':
        case 'A':
            welcomePage = false;
            humanPlayer.dead = true;
            break;
        case 'F':
            speed += 10;
            frameRate(speed);
            print(speed);
            break;
        case 'S':
            if (speed > 10) {
                speed -= 10;
                frameRate(speed);
                print(speed);
            }
            break;
        case 'j':
        case ' ':
        case '+':
            if (!humanPlayer.dead) {
                humanPlayer.flap();
            }
            break;
        case 'p':
        case 'P':
            if (humanPlayer.dead) {
                maxScore = max(maxScore, humanPlayer.score);

                delete humanPlayer;
                humanPlayer = new Player();
                pipeA = new Pipes(0);
                pipeB = new Pipes(canvasWidth / 2);
            }
            break;
        case 'b':
        case 'B':
            welcomePage = false;
            break;
    }
}
