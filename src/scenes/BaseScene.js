import { MovementController } from '../systems/input/MovementController.js';
import { DialogueSystem } from '../systems/ui/DialogueSystem.js';
import { Hotbar } from '../systems/ui/Hotbar.js';
import { VirtualJoystick } from '../systems/ui/VirtualJoystick.js';
import { VirtualButtons } from '../systems/ui/VirtualButtons.js';


export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // Asset comum de áudio
        this.load.audio('textBlip', 'assets/sounds/Fala-rolando.mp3');
        
        // Assets dos botões virtuais
        console.log('[BaseScene] Carregando assets dos botões...');
        this.load.image('button_a', 'assets/sprites/button_xbox_digital_a_5.png');
        this.load.image('button_b', 'assets/sprites/button_xbox_digital_b_4.png');
        this.load.image('button_x', 'assets/sprites/button_xbox_digital_x_4.png');
        
        this.load.on('filecomplete-image-button_a', () => {
            console.log('[BaseScene] Botão A carregado!');
        });
        this.load.on('filecomplete-image-button_b', () => {
            console.log('[BaseScene] Botão B carregado!');
        });
        this.load.on('filecomplete-image-button_x', () => {
            console.log('[BaseScene] Botão X carregado!');
        });
    }

    createCommonPlayer(x = 100, y = 100) {
        this.player = this.physics.add.sprite(x, y, 'player', 0);
        this.player.setCollideWorldBounds(true);
    // Ajuste de hitbox: usar somente a área dos pés para colisões (evita parecer que pisa na água/bordas)
    // Sprite 32x32 -> definimos corpo 16x12 alinhado embaixo.
    this.player.body.setSize(16, 12);
    this.player.body.setOffset(8, 20); // centraliza horizontalmente e posiciona nos pés
        this._createPlayerAnims();
        
        // Criar controles virtuais para mobile
        this.createVirtualControls();
        
        // Criar controller de movimento com joystick
        this.movement = new MovementController(this, this.player, { 
            virtualJoystick: this.virtualJoystick 
        });
        
        return this.player;
    }

    _createPlayerAnims() {
        if (this.anims.exists('walk-down')) return; // evita recriar
        this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }), frameRate: 8, repeat: -1 });
    }

    createDialogueSystem() {
    this.dialogue = new DialogueSystem(this);
    this._registerUIElement(this.dialogue.box, this.dialogue.text, this.dialogue.nextIcon);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    createVirtualControls() {
        console.log('[BaseScene] Criando controles virtuais...');
        
        // Criar joystick virtual (canto inferior esquerdo)
        const joystickX = 100;
        const joystickY = this.scale.height - 100;
        this.virtualJoystick = new VirtualJoystick(this, joystickX, joystickY);
        console.log('[BaseScene] Joystick criado');
        
        // Criar botões virtuais (canto inferior direito)
        this.virtualButtons = new VirtualButtons(this);
        console.log('[BaseScene] Botões virtuais criados');
        
        // Configurar eventos dos botões
        this.events.on('virtualbutton-down', (action) => {
            this.onVirtualButtonDown(action);
        });
        
        this.events.on('virtualbutton-up', (action) => {
            this.onVirtualButtonUp(action);
        });
        
        // Registrar elementos na UI
        this._registerUIElement(...this.virtualJoystick.getElements());
        this._registerUIElement(...this.virtualButtons.getElements());
        console.log('[BaseScene] Elementos UI registrados');
        
        // Mostrar/esconder controles baseado no dispositivo
        this.toggleVirtualControls();
    }
    
    onVirtualButtonDown(action) {
        console.log('[BaseScene] Botão virtual pressionado:', action);
        console.log('[BaseScene] Diálogo ativo?', this.dialogue?.active);
        console.log('[BaseScene] currentInteractable:', this.currentInteractable);
        
        if (action === 'interact') {
            // Durante diálogo, avançar texto
            if (this.dialogue?.active) {
                console.log('[BaseScene] Avançando diálogo');
                this.dialogue.next();
            } else {
                // Fora do diálogo, executar interação
                console.log('[BaseScene] Executando handleInteraction');
                this.handleInteraction();
            }
        } else if (action === 'run') {
            // Ativar corrida
            console.log('[BaseScene] Ativando corrida');
            if (this.movement) {
                this.movement.startRun();
            }
        } else if (action === 'action') {
            // Ação extra - segurar objeto empurrável
            console.log('[BaseScene] Botão de ação pressionado (segurar objeto)');
            this.handleActionButton();
        }
    }
    
    onVirtualButtonUp(action) {
        if (action === 'run') {
            // Desativar corrida
            if (this.movement) {
                this.movement.stopRun();
            }
        } else if (action === 'action') {
            // Soltar objeto empurrável
            console.log('[BaseScene] Botão de ação solto (soltar objeto)');
            this.handleActionButtonRelease();
        }
    }
    
    handleInteraction() {
        // Override este método nas cenas filhas para implementar interações
        console.log('Botão de interação pressionado');
    }
    
    handleActionButton() {
        // Override este método nas cenas filhas para ações extras
        console.log('[BaseScene] Botão de ação pressionado');
    }
    
    handleActionButtonRelease() {
        // Override este método nas cenas filhas quando soltar o botão
        console.log('[BaseScene] Botão de ação solto');
    }
    
    toggleVirtualControls() {
        // SEMPRE mostrar controles virtuais
        console.log('[BaseScene] SEMPRE mostrando controles virtuais');
        if (this.virtualJoystick) this.virtualJoystick.show();
        if (this.virtualButtons) this.virtualButtons.show();
    }

    createHotbar() {
    this.hotbar = new Hotbar(this);
    // registrar elementos da hotbar na lista de UI
    this._registerUIElement(...this.hotbar.slots, this.hotbar.highlight);
    }

    updateBase() {
        if (this.dialogue?.active) {
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.dialogue.next();
            return; // bloqueia movimento durante diálogo
        }
        this.movement?.update();
    }

    // ==== Sistema de UI para segunda câmera ====
    _registerUIElement(...objs) {
        if (!this.uiElements) this.uiElements = [];
        objs.forEach(o => { if (o) this.uiElements.push(o); });
    }

    getUIElements() {
        return this.uiElements || [];
    }
}
