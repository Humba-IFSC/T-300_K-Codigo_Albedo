export class MovementController {
     /**
     * Controla movimento (WASD / setas / joystick virtual) e corrida (SHIFT).
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {{ walkSpeed?:number, runSpeed?:number, virtualJoystick?:Object }} options
     */
    constructor(scene, player, { walkSpeed = 150, runSpeed = 260, virtualJoystick = null } = {}) {
        this.scene = scene;
        this.player = player;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.moveKeysOrder = [];
        this.facing = 'down';
        this.isRunning = false; // enquanto SHIFT pressionado
        this._hasRunAnimCache = undefined; // lazy detection
        
        // Referência para o joystick virtual (opcional)
        this.virtualJoystick = virtualJoystick;

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

        // Priorizar joystick virtual se estiver ativo
        if (this.virtualJoystick && this.virtualJoystick.isActive()) {
            const direction = this.virtualJoystick.getDirection();
            const force = this.virtualJoystick.getForce();
            
            if (force > 0.2) { // Dead zone para evitar movimento acidental
                const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
                const prefix = (this.isRunning && this._hasRunAnimCache) ? 'run' : 'walk';
                
                // Aplicar velocidade baseada na direção do joystick
                p.setVelocity(direction.x * speed * force, direction.y * speed * force);
                
                // Determinar animação baseada na direção dominante
                const absX = Math.abs(direction.x);
                const absY = Math.abs(direction.y);
                
                if (absX > absY) {
                    // Movimento horizontal dominante
                    if (direction.x > 0) {
                        p.anims.play(`${prefix}-right`, true);
                        this.facing = 'right';
                    } else {
                        p.anims.play(`${prefix}-left`, true);
                        this.facing = 'left';
                    }
                } else {
                    // Movimento vertical dominante
                    if (direction.y > 0) {
                        p.anims.play(`${prefix}-down`, true);
                        this.facing = 'down';
                    } else {
                        p.anims.play(`${prefix}-up`, true);
                        this.facing = 'up';
                    }
                }
            } else {
                p.anims.stop();
            }
            return; // Pula controle por teclado se joystick estiver ativo
        }

        // Controle por teclado (comportamento original)
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
