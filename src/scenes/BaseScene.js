import { MovementController } from '../systems/input/MovementController.js';
import { DialogueSystem } from '../systems/ui/DialogueSystem.js';
import { Hotbar } from '../systems/ui/Hotbar.js';

export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // Asset comum de áudio
        this.load.audio('textBlip', 'assets/sounds/Fala-rolando.mp3');
    }

    createCommonPlayer(x = 100, y = 100) {
        this.player = this.physics.add.sprite(x, y, 'player', 0);
        this.player.setCollideWorldBounds(true);
    // Ajuste de hitbox: usar somente a área dos pés para colisões (evita parecer que pisa na água/bordas)
    // Sprite 32x32 -> definimos corpo 16x12 alinhado embaixo.
    this.player.body.setSize(16, 12);
    this.player.body.setOffset(8, 20); // centraliza horizontalmente e posiciona nos pés
        this._createPlayerAnims();
        this.movement = new MovementController(this, this.player);
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
