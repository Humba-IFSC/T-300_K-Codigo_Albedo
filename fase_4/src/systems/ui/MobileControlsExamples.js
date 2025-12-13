/**
 * ============================================================================
 * EXEMPLO DE USO - Mobile Controls
 * ============================================================================
 * 
 * Este arquivo demonstra como integrar o sistema MobileControls em seu jogo.
 * Copie e adapte o código conforme necessário.
 */

import { MobileControls } from './MobileControls.js';

// ============================================================================
// EXEMPLO 1: Integração Básica em uma Cena
// ============================================================================

export class ExampleGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExampleGameScene' });
    }
    
    create() {
        // ----- PASSO 1: Criar Controles Móveis -----
        this.mobileControls = new MobileControls(this, {
            // Configuração do joystick
            joystick: {
                enabled: true,
                baseRadius: 60,
                stickRadius: 30,
                maxDistance: 50,
                deadZone: 0.2
            },
            
            // Configuração dos botões
            buttons: [
                { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
                { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' },
                { action: 'action', label: 'X', color: 0x0000FF, position: 'top' }
            ],
            
            // Opções gerais
            alwaysShow: false  // Só mostra em mobile (use true para testar em desktop)
        });
        
        // ----- PASSO 2: Criar seu jogador -----
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Estado do jogador
        this.isRunning = false;
        this.walkSpeed = 150;
        this.runSpeed = 260;
        
        // ----- PASSO 3: Configurar eventos (opcional) -----
        this._setupEventListeners();
    }
    
    update() {
        // ----- MOVIMENTO COM JOYSTICK -----
        this._handleMovement();
        
        // ----- AÇÕES COM BOTÕES -----
        this._handleActions();
    }
    
    _handleMovement() {
        const joystick = this.mobileControls.joystick;
        
        // Se joystick está ativo, usa ele
        if (joystick && joystick.isActive()) {
            const direction = joystick.getDirection();
            const force = joystick.getForce();
            
            // Verifica se está correndo
            this.isRunning = this.mobileControls.isButtonPressed('run');
            const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
            
            // Aplica velocidade
            this.player.setVelocity(
                direction.x * speed * force,
                direction.y * speed * force
            );
            
            // Animações baseadas na direção
            this._playMovementAnimation(direction);
        } else {
            // Para o jogador se joystick não está ativo
            this.player.setVelocity(0, 0);
            this.player.anims.stop();
        }
    }
    
    _playMovementAnimation(direction) {
        const prefix = this.isRunning ? 'run' : 'walk';
        const absX = Math.abs(direction.x);
        const absY = Math.abs(direction.y);
        
        // Determina direção dominante
        if (absX > absY) {
            // Horizontal
            if (direction.x > 0) {
                this.player.anims.play(`${prefix}-right`, true);
            } else {
                this.player.anims.play(`${prefix}-left`, true);
            }
        } else {
            // Vertical
            if (direction.y > 0) {
                this.player.anims.play(`${prefix}-down`, true);
            } else {
                this.player.anims.play(`${prefix}-up`, true);
            }
        }
    }
    
    _handleActions() {
        // Botão de interação
        if (this.mobileControls.isButtonPressed('interact')) {
            this.interact();
        }
        
        // Botão de ação extra
        if (this.mobileControls.isButtonPressed('action')) {
            this.performAction();
        }
    }
    
    _setupEventListeners() {
        // Escuta eventos dos botões
        this.events.on('mobilecontrols-button-down', (data) => {
            console.log('Botão pressionado:', data.action);
            
            // Ações específicas
            if (data.action === 'interact') {
                console.log('Tentando interagir...');
            }
        });
        
        this.events.on('mobilecontrols-button-up', (data) => {
            console.log('Botão solto:', data.action);
        });
        
        // Escuta eventos do joystick
        this.events.on('mobilecontrols-joystick-start', () => {
            console.log('Jogador começou a mover');
        });
        
        this.events.on('mobilecontrols-joystick-end', () => {
            console.log('Jogador parou de mover');
        });
    }
    
    interact() {
        console.log('Interagindo...');
        // Sua lógica de interação aqui
    }
    
    performAction() {
        console.log('Ação executada!');
        // Sua lógica de ação aqui
    }
    
    // Exemplo: Desabilitar controles durante diálogo
    showDialogue(text) {
        this.mobileControls.disable();
        // ... mostrar diálogo
    }
    
    hideDialogue() {
        this.mobileControls.enable();
        // ... esconder diálogo
    }
}

// ============================================================================
// EXEMPLO 2: Integração com MovementController Existente
// ============================================================================

export class MovementController {
    constructor(scene, player, options = {}) {
        this.scene = scene;
        this.player = player;
        this.walkSpeed = options.walkSpeed || 150;
        this.runSpeed = options.runSpeed || 260;
        
        // Aceita referência para controles móveis
        this.mobileControls = options.mobileControls || null;
        
        // Configuração de teclado existente
        this.moveKeysOrder = [];
        this.facing = 'down';
        this.isRunning = false;
        
        this._setupKeyboard();
    }
    
    _setupKeyboard() {
        const keyMap = {
            ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
            KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right'
        };

        this.scene.input.keyboard.on('keydown', (e) => {
            const dir = keyMap[e.code];
            if (dir && !this.moveKeysOrder.includes(dir)) this.moveKeysOrder.push(dir);
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.isRunning = true;
        });

        this.scene.input.keyboard.on('keyup', (e) => {
            const dir = keyMap[e.code];
            if (dir) this.moveKeysOrder = this.moveKeysOrder.filter(k => k !== dir);
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.isRunning = false;
        });
    }
    
    update() {
        this.player.setVelocity(0);
        
        // ----- PRIORIZA JOYSTICK MÓVEL SE ATIVO -----
        if (this.mobileControls?.joystick?.isActive()) {
            this._updateWithJoystick();
            return;
        }
        
        // ----- CASO CONTRÁRIO, USA TECLADO -----
        this._updateWithKeyboard();
    }
    
    _updateWithJoystick() {
        const joystick = this.mobileControls.joystick;
        const direction = joystick.getDirection();
        const force = joystick.getForce();
        
        // Verifica corrida pelo botão móvel
        const isRunning = this.mobileControls.isButtonPressed('run');
        const speed = isRunning ? this.runSpeed : this.walkSpeed;
        const prefix = isRunning ? 'run' : 'walk';
        
        // Aplica movimento
        this.player.setVelocity(
            direction.x * speed * force,
            direction.y * speed * force
        );
        
        // Animações
        const absX = Math.abs(direction.x);
        const absY = Math.abs(direction.y);
        
        if (absX > absY) {
            if (direction.x > 0) {
                this.player.anims.play(`${prefix}-right`, true);
                this.facing = 'right';
            } else {
                this.player.anims.play(`${prefix}-left`, true);
                this.facing = 'left';
            }
        } else {
            if (direction.y > 0) {
                this.player.anims.play(`${prefix}-down`, true);
                this.facing = 'down';
            } else {
                this.player.anims.play(`${prefix}-up`, true);
                this.facing = 'up';
            }
        }
    }
    
    _updateWithKeyboard() {
        const dir = this.moveKeysOrder.length
            ? this.moveKeysOrder[this.moveKeysOrder.length - 1]
            : null;

        if (!dir) {
            this.player.anims.stop();
            return;
        }

        const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
        const prefix = this.isRunning ? 'run' : 'walk';

        if (dir === 'left') {
            this.player.setVelocityX(-speed);
            this.player.anims.play(`${prefix}-left`, true);
            this.facing = 'left';
        } else if (dir === 'right') {
            this.player.setVelocityX(speed);
            this.player.anims.play(`${prefix}-right`, true);
            this.facing = 'right';
        } else if (dir === 'up') {
            this.player.setVelocityY(-speed);
            this.player.anims.play(`${prefix}-up`, true);
            this.facing = 'up';
        } else if (dir === 'down') {
            this.player.setVelocityY(speed);
            this.player.anims.play(`${prefix}-down`, true);
            this.facing = 'down';
        }
    }
}

// ============================================================================
// EXEMPLO 3: Como Usar o MovementController Integrado
// ============================================================================

export class GameSceneWithController extends Phaser.Scene {
    create() {
        // 1. Criar controles móveis
        this.mobileControls = new MobileControls(this);
        
        // 2. Criar jogador
        this.player = this.physics.add.sprite(400, 300, 'player');
        
        // 3. Criar controller com referência aos controles móveis
        this.movementController = new MovementController(this, this.player, {
            walkSpeed: 150,
            runSpeed: 260,
            mobileControls: this.mobileControls  // Passa a referência
        });
    }
    
    update() {
        // O controller agora lida com teclado E joystick automaticamente!
        this.movementController.update();
    }
}

// ============================================================================
// EXEMPLO 4: Configuração para Jogo de Plataforma
// ============================================================================

export class PlatformerScene extends Phaser.Scene {
    create() {
        // Controles para plataforma (sem joystick vertical, apenas horizontal)
        this.mobileControls = new MobileControls(this, {
            buttons: [
                { action: 'left', label: '←', color: 0x888888, position: 'left-bottom' },
                { action: 'right', label: '→', color: 0x888888, position: 'right-bottom' },
                { action: 'jump', label: '↑', color: 0x00FF00, position: 'right-top' },
                { action: 'attack', label: 'A', color: 0xFF0000, position: 'right-bottom' }
            ],
            joystick: {
                enabled: false  // Desabilita joystick para plataforma
            }
        });
        
        this.player = this.physics.add.sprite(100, 300, 'player');
    }
    
    update() {
        // Movimento horizontal com botões
        if (this.mobileControls.isButtonPressed('left')) {
            this.player.setVelocityX(-200);
            this.player.anims.play('run-left', true);
        } else if (this.mobileControls.isButtonPressed('right')) {
            this.player.setVelocityX(200);
            this.player.anims.play('run-right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        
        // Pulo
        if (this.mobileControls.isButtonPressed('jump') && this.player.body.onFloor()) {
            this.player.setVelocityY(-400);
        }
        
        // Ataque
        if (this.mobileControls.isButtonPressed('attack')) {
            this.attack();
        }
    }
    
    attack() {
        console.log('Atacando!');
    }
}

// ============================================================================
// EXEMPLO 5: Usando Sprites Customizados
// ============================================================================

export class CustomButtonsScene extends Phaser.Scene {
    preload() {
        // Carregar sprites dos botões
        this.load.image('btn_a', 'assets/ui/button_a.png');
        this.load.image('btn_b', 'assets/ui/button_b.png');
        this.load.image('btn_x', 'assets/ui/button_x.png');
    }
    
    create() {
        this.mobileControls = new MobileControls(this, {
            buttons: [
                {
                    action: 'interact',
                    label: 'A',
                    sprite: 'btn_a',  // Usa sprite customizado
                    position: 'right-bottom'
                },
                {
                    action: 'run',
                    label: 'B',
                    sprite: 'btn_b',
                    position: 'left-top'
                },
                {
                    action: 'action',
                    label: 'X',
                    sprite: 'btn_x',
                    position: 'top'
                }
            ]
        });
    }
}
