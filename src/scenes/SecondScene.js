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
    // Tilesets do mapa floresta
    this.load.image('terrain_tiles_v2', 'assets/tilesets/terrain_tiles_v2.png');
    this.load.image('props', 'assets/tilesets/props.png');
    this.load.tilemapTiledJSON('forest', 'assets/maps/floresta.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('door', 'assets/sprites/Basic_Door_Pixel.png');
    }

    create() {
        // Mapa floresta
        const map = this.make.tilemap({ key: 'forest' });
        this.map = map;
        // Adiciona tilesets conforme especificado no JSON
        const terrainTiles = map.addTilesetImage('terrain_tiles_v2', 'terrain_tiles_v2');
        const propsTiles = map.addTilesetImage('props', 'props');

        // Camadas do mapa
        // Chão (sempre visível)
        let floor = null;
        if (map.getLayerIndex('Camada de Blocos 1') !== -1) {
            floor = map.createLayer('Camada de Blocos 1', terrainTiles, 0, 0);
            floor.setDepth(0); // Garante que fique abaixo dos objetos
        }
        // Objetos (árvores, pedras, etc) - apenas esta camada tem colisão
        let propsLayer = null;
        if (map.getLayerIndex('props') !== -1) {
            propsLayer = map.createLayer('props', propsTiles, 0, 0);
            propsLayer.setCollisionByExclusion([-1]);
            propsLayer.setDepth(10);
        }
        // Casa (se existir) - sem colisão
        let casaLayer = null;
        if (map.getLayerIndex('casa') !== -1) {
            casaLayer = map.createLayer('casa', propsTiles, 0, 0);
            casaLayer.setDepth(20);
        }
        // Frente das árvores (deve ficar acima do jogador, sem colisão)
        let frenteLayer = null;
        if (map.getLayerIndex('props frente') !== -1) {
            frenteLayer = map.createLayer('props frente', propsTiles, 0, 0);
            frenteLayer.setDepth(1000); // Garante que fique acima do jogador
        }

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Player (posição inicial próxima à borda esquerda)
        this.createCommonPlayer(96, 320);
        if (propsLayer) this.physics.add.collider(this.player, propsLayer);

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
        const worldObjects = [this.player, this.returnDoor, floor, propsLayer, casaLayer, frenteLayer].filter(Boolean);
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