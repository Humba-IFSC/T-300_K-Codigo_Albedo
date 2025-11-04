import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';

/**
 * IntroScene - Cena com o mapa de introdução
 */
export default class IntroScene extends BaseScene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        super.preload();
        
        // Carregar tilesets do mapa de introdução
        this.load.image('tileset-grassland-grass', 'assets/tilesets/tileset-grassland-grass.png');
        this.load.image('tileset-grassland-water', 'assets/tilesets/tileset-grassland-water.png');
        this.load.image('tileset-grassland-paths', 'assets/tilesets/tileset-grassland-paths.png');
        this.load.image('ground_grass_details', 'assets/tilesets/ground_grass_details.png');
        this.load.image('Trees_animation', 'assets/tilesets/Trees_animation.png');
        this.load.image('props', 'assets/tilesets/props.png');
        this.load.image('boat0001-sheet', 'assets/tilesets/boat0001-sheet.png');
        
        // Carregar o mapa
        this.load.tilemapTiledJSON('intro_map', 'assets/maps/introdução.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[IntroScene] Criando cena de introdução');
        
        // Criar mapa
        const map = this.make.tilemap({ key: 'intro_map' });
        this.map = map;
        
        // Adicionar tilesets
        const grassTileset = map.addTilesetImage('tileset-grassland-grass', 'tileset-grassland-grass');
        const waterTileset = map.addTilesetImage('tileset-grassland-water', 'tileset-grassland-water');
        const pathsTileset = map.addTilesetImage('tileset-grassland-paths', 'tileset-grassland-paths');
        const detailsTileset = map.addTilesetImage('ground_grass_details', 'ground_grass_details');
        const treesTileset = map.addTilesetImage('Trees_animation', 'Trees_animation');
        const propsTileset = map.addTilesetImage('props', 'props');
        const boatTileset = map.addTilesetImage('boat0001-sheet', 'boat0001-sheet');
        
        // Array com todos os tilesets
        const allTilesets = [
            grassTileset, 
            waterTileset, 
            pathsTileset, 
            detailsTileset, 
            treesTileset, 
            propsTileset, 
            boatTileset
        ];
        
        // Criar camadas na ordem correta
        const layer1 = map.createLayer('Camada de Blocos 1', allTilesets, 0, 0);
        const caminho = map.createLayer('caminho', allTilesets, 0, 0);
        const arvores = map.createLayer('arvores', allTilesets, 0, 0);
        const arvores2 = map.createLayer('arvores 2', allTilesets, 0, 0);
        
        // Configurar colisão com água (tile 38 do tileset water)
        if (layer1) {
            layer1.setCollisionByProperty({ collides: true });
            // Se não tiver propriedade, usar IDs específicos da água
            layer1.setCollisionBetween(38, 42); // IDs da água no tileset
        }
        
        // Camada "caminho" NÃO tem colisão (player pode andar sobre ela)
        
        // Configurar colisão com árvores e decorações
        if (arvores) {
            arvores.setCollisionByProperty({ collides: true });
            arvores.setCollisionByExclusion([-1, 0]); // Árvores são colisíveis
        }
        
        if (arvores2) {
            arvores2.setCollisionByProperty({ collides: true });
            arvores2.setCollisionByExclusion([-1, 0]); // Árvores camada 2 são colisíveis
        }
        
        // Configurar limites do mundo
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Criar player no tile (13, 12)
        const spawnX = 13 * 32 + 16; // Tile 13, centralizado (416px)
        const spawnY = 12 * 32 + 16; // Tile 12, centralizado (400px)
        this.createCommonPlayer(spawnX, spawnY);
        
        // Adicionar colisão do player com camadas colisíveis (SEM o caminho)
        if (layer1) {
            this.physics.add.collider(this.player, layer1);
        }
        if (arvores) {
            this.physics.add.collider(this.player, arvores);
        }
        if (arvores2) {
            this.physics.add.collider(this.player, arvores2);
        }
        
        // Sistemas comuns
        this.createDialogueSystem();
        this.createHotbar();
        this.createVirtualControls();
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, map);
        
        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5); // Zoom maior para melhor visualização
        worldCam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        worldCam.roundPixels = true;
        
        // Gerenciador de câmera de UI (igual ao mapa principal)
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        const worldObjects = [
            this.player, 
            layer1, 
            caminho, 
            arvores, 
            arvores2
        ].filter(Boolean);
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        worldCam.setRenderToTexture && worldCam.setRoundPixels && (worldCam._padding = 2);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[IntroScene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        // Mensagem de boas-vindas
        this.time.delayedCall(500, () => {
            if (this.dialogue) {
                this.dialogue.show('Bem-vindo ao Mapa de Introdução!');
            }
        });
    }

    update() {
        this.updateBase();
        
        // Atualizar CoordProbe
        if (this.coordProbe) {
            this.coordProbe.update();
        }
        
        // Ordenar depth dos objetos por Y (igual ao mapa principal)
        if (this.player) {
            this.player.setDepth(this.player.y);
        }
    }
    
    // Métodos para controlar o CoordProbe (como no GameScene)
    toggleCoordProbe(forceState) { 
        if (this.coordProbe) this.coordProbe.toggle(forceState); 
    }
    enableCoordProbe() { 
        if (this.coordProbe) this.coordProbe.enable(); 
    }
    disableCoordProbe() { 
        if (this.coordProbe) this.coordProbe.disable(); 
    }
}
