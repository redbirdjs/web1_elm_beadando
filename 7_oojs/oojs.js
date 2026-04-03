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

class Game {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.width = gameArea.offsetWidth;
        this.height = gameArea.offsetHeight;
        this.player = new Player(this.width / 4, this.height / 2, this.gameArea, this.height);
        this.score = 0;
        this.isGameOver = false;

        this.pipeSpawnInterval = 1500;
        this.lastPipeSpawnTime = 0;
        this.lastFrameTime = 0;

        this.scoreDisplay = document.getElementById('score');
        this.gameOverOverlay = document.getElementById('gameOver');
        this.gameOverScoreDisplay = document.getElementById('final-score');
        this.groundHeight = document.getElementById('ground').offsetHeight;

    }
}