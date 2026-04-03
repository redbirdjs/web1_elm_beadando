class GameObject {
    constructor(x, y, width, height, gameArea, name = '') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameArea = gameArea;

        this.element = this.create(name);
        this.gameArea.appendChild(this.element);
        this.render();
    }

    create(name) {
        const div = document.createElement('div');
        div.classList.add('game-object');
        if (name) div.classList.add(name);

        div.style.width = `${this.width}px`;
        div.style.height = `${this.height}px`;
        return div;
    }

    update() {}

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    delete() {
        if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
    }
}

class Player extends GameObject {
    constructor(x, y, gameArea, gameHeight) {
        const width = 70;
        const height = 70;
        super(x, y, width, height, gameArea, 'player');

        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpStrength = 8;
        this.gameHeight = gameHeight;
    }

    jump() {
        this.velocity = -this.jumpStrength;
        this.element.classList.add('jumping');
        setTimeout(() => {
            this.element.classList.remove('jumping');
        }, 100);
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

class PipeSegment extends GameObject {
    constructor(x, y, width, height, gameArea) {
        super(x, y, width, height, gameArea, 'pipe-segment');
    }
}

class Pipe {
    constructor(x, gameHeight, gameArea) {
        this.x = x;
        this.width = 50;
        this.gapHeight = 150;
        this.minHeight = 80;
        this.speed = 2;
        this.gameHeight = gameHeight;
        this.gameArea = gameArea;

        this.topPipeHeight = Math.random() * (this.gameHeight - this.gapHeight - 2 * this.minHeight) + this.minHeight;
        this.bottomPipeY = this.topPipeHeight + this.gapHeight;
        this.bottomPipeHeight = this.gameHeight - this.bottomPipeY;

        this.passed = false;
        this.topSegment = new PipeSegment(this.x, 0, this.width, this.topPipeHeight, this.gameArea);
        this.bottomSegment = new PipeSegment(this.x, this.bottomPipeY, this.width, this.bottomPipeHeight, this.gameArea);
    }

    update() {
        this.x -= this.speed;
        this.topSegment.x = this.x;
        this.bottomSegment.x = this.x;
    }

    render() {
        this.topSegment.render();
        this.bottomSegment.render();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

class Game {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.width = gameArea.offsetWidth;
        this.height = gameArea.offsetHeight;
        this.player = new Player(this.width / 4, this.height / 2, this.gameArea, this.height);
        this.score = 0;
        this.isGameOver = false;
        this.pipes = [];

        this.pipeSpawnInterval = 1500;
        this.lastPipeSpawnTime = 0;
        this.lastFrameTime = 0;

        this.scoreDisplay = document.getElementById('score');
        this.gameOverOverlay = document.getElementById('gameOver');
        this.gameOverScoreDisplay = document.getElementById('final-score');
        this.groundHeight = document.getElementById('ground').offsetHeight;

        this.setListeners();
    }

    start() {
        this.lastPipeSpawnTime = performance.now();
        this.lastFrameTime = performance.now();
        this.loop();
    }

    loop(currentTime) {
        if (this.isGameOver) {
            this.displayGameOver();
            return;
        }

        const deltaT = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.update(deltaT);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaT) {
        this.player.update();
    }

    render() {
        this.player.render();

        this.checkCollision();
    }

    checkCollision() {
        // ceiling / ground check
        if (this.player.y + this.player.height >= this.height - this.groundHeight ||
            this.player.y <= 0
        ) {
            this.triggerGameOver();
        }
    }

    updateScoreDisplay() {
        this.scoreDisplay.textContent = `Pontok: ${this.score}`;
    }

    triggerGameOver() {
        this.isGameOver = true;
    }

    displayGameOver() {
        this.gameOverScoreDisplay.textContent = `Pontok: ${this.score}`;
        this.gameOverOverlay.style.display = 'flex';
    }

    restart() {
        this.pipes.forEach(pipe => pipe.delete());
        this.pipes = [];
        this.player.delete();
        this.player = new Player(this.width / 4, this.height / 2, this.gameArea, this.height);

        this.score = 0;
        this.updateScoreDisplay();
        this.isGameOver = false;
        this.gameOverOverlay.style.display = 'none';
        this.lastPipeSpawnTime = performance.now();
        this.lastFrameTime = performance.now();
        this.loop();
    }

    setListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isGameOver) {
                this.player.jump();
            } else if (e.code === 'Space' && this.isGameOver) {
                this.restart();
            }
        });

        this.gameArea.addEventListener('click', (e) => {
            if (!this.isGameOver) {
                this.player.jump();
            } else {
                this.restart();
            }
        });
    }
}

function initGame() {
    const gameArea = document.getElementById('gameArea');
    const game = new Game(gameArea);

    game.start();
}