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
    }
}