import { BaseScene } from './BaseScene.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { InteractionPrompt } from '../systems/ui/InteractionPrompt.js';

export default class SecondScene extends BaseScene {
    constructor() {
        super('SecondScene');
    }

    preload() {
        super.preload();
        this.load.image('tiles', 'assets/tilesets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('door', 'assets/sprites/Basic_Door_Pixel.png');
    }

    create() {
        // Mapa
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;
        const tileset = map.addTilesetImage('tiles', 'tiles');
        
        let floor = null;
        let walls = null;
        
        if (map.getLayerIndex('Camada de Blocos 2') !== -1) {
            floor = map.createLayer('Camada de Blocos 2', tileset, 0, 0);
        }
        if (map.getLayerIndex('Camada de Blocos 1') !== -1) {
            walls = map.createLayer('Camada de Blocos 1', tileset, 0, 0);
        }
        
        if (!floor && !walls && map.layers?.length) {
            floor = map.createLayer(map.layers[0].name, tileset, 0, 0);
        }
        
        // Configurar colisões com bordas (tile 119)
        if (walls) {
            const borderIndices = [119];
            walls.setCollision(borderIndices);
        }
        
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Player (começar próximo à porta de retorno)
        this.createCommonPlayer(96, 320); // Posição próxima à borda esquerda
        if (walls) this.physics.add.collider(this.player, walls);

        // Porta de retorno para GameScene (na borda esquerda)
        this.returnDoor = this.physics.add.sprite(64, 320, 'door').setImmovable(true);
        this.physics.add.overlap(this.player, this.returnDoor, this.handleDoorInteraction, null, this);

        // UI de interação
        this.doorPrompt = new InteractionPrompt(this, { suffix: ' para voltar' });

        // Sistemas compartilhados
        this.createDialogueSystem();
        this.createHotbar();

        // Probe de coordenadas
        this.coordProbe = new CoordProbe(this, map);

        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(2.5);
        if (this.map) worldCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        worldCam.roundPixels = true;

        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        const worldObjects = [this.player, this.returnDoor, floor, walls].filter(Boolean);
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);

        worldCam.setRenderToTexture && worldCam.setRoundPixels && (worldCam._padding = 2);
        this.sortDepths();
    }

    update() {
        this.updateBase();
        this.sortDepths();
        if (this.dialogue?.active) return;

        this.coordProbe.update();

        // Interação com porta de retorno
        const distanceToDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.returnDoor.x, this.returnDoor.y);
        if (distanceToDoor < 50) {
            this.doorPrompt.show();
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                this.handleDoorInteraction();
            }
        } else {
            this.doorPrompt.hide();
        }
    }

    handleDoorInteraction() {
        // Transição de volta para GameScene
        this.scene.start('GameScene');
    }

    toggleCoordProbe(forceState) { this.coordProbe.toggle(forceState); }
    enableCoordProbe() { this.coordProbe.enable(); }
    disableCoordProbe() { this.coordProbe.disable(); }

    // Ordena depth de sprites principais por coordenada Y
    sortDepths() {
        const sprites = [this.player, this.returnDoor].filter(Boolean);
        sprites.forEach(s => s.setDepth(s.y));
    }
}