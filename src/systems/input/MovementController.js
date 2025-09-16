export class MovementController {
     /**
     * Controla movimento (WASD / setas) e corrida (SHIFT).
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {{ walkSpeed?:number, runSpeed?:number }} options
     */
    constructor(scene, player, { walkSpeed = 150, runSpeed = 260 } = {}) {
        this.scene = scene;
        this.player = player;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.moveKeysOrder = [];
        this.facing = 'down';
        this.isRunning = false; // enquanto SHIFT pressionado
        this._hasRunAnimCache = undefined; // lazy detection

        // Mapear códigos de teclas para direções
        const keyMap = {
            ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
            KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right'
        };

        // Listeners globais de teclado (movimento)
        scene.input.keyboard.on('keydown', (e) => {
            const dir = keyMap[e.code];
            if (dir && !this.moveKeysOrder.includes(dir)) this.moveKeysOrder.push(dir);
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.startRun();
        });

        scene.input.keyboard.on('keyup', (e) => {
            const dir = keyMap[e.code];
            if (dir) this.moveKeysOrder = this.moveKeysOrder.filter(k => k !== dir);
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.stopRun();
        });
    }

    update() {
        const p = this.player;
        p.setVelocity(0);

        // Detectar se existem animações de corrida (executa uma vez)
        if (this._hasRunAnimCache === undefined) {
            this._hasRunAnimCache = this.scene.anims.exists('run-down');
        }

        const dir = this.moveKeysOrder.length
            ? this.moveKeysOrder[this.moveKeysOrder.length - 1]
            : null;

        const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
        const prefix = (this.isRunning && this._hasRunAnimCache) ? 'run' : 'walk';

        if (dir === 'left') {
            p.setVelocityX(-speed);
            p.anims.play(`${prefix}-left`, true);
            this.facing = 'left';
        } else if (dir === 'right') {
            p.setVelocityX(speed);
            p.anims.play(`${prefix}-right`, true);
            this.facing = 'right';
        } else if (dir === 'up') {
            p.setVelocityY(-speed);
            p.anims.play(`${prefix}-up`, true);
            this.facing = 'up';
        } else if (dir === 'down') {
            p.setVelocityY(speed);
            p.anims.play(`${prefix}-down`, true);
            this.facing = 'down';
        } else {
            p.anims.stop();
        }
    }

    startRun() { this.isRunning = true; }
    stopRun() { this.isRunning = false; }
    toggleRun() { this.isRunning = !this.isRunning; }
    isRunningNow() { return this.isRunning; }
}
