import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';

/**
 * TcheScene - Cena do mapa "tche"
 * Interior cyberpunk com múltiplas salas e objetos interativos
 */
export default class TcheScene extends BaseScene {
    constructor() {
        super('TcheScene');
    }

    preload() {
        super.preload();
        
        // Carregar tilesets do mapa tche - caminhos EXATOS do JSON
        this.load.image('Interiors_tilesets', 'assets/tilesets/Interiors_tilesets.png');
        this.load.image('pixel-cyberpunk-interior', 'assets/tilesets/pixel-cyberpunk-interior.png');
        this.load.image('furniture_and_props', 'assets/tilesets/furniture_and_props.png');
        this.load.image('[Base]BaseChip_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/[Base]BaseChip_pipo.png');
        this.load.image('Door3_pipo', 'assets/tilesets/Door_Animation/Door_Animation/Door3_pipo.png');
        this.load.image('InteriorTilesLITE', 'assets/tilesets/InteriorTilesLITE.png');
        this.load.image('bathroom', 'assets/tilesets/textiles_BA.png');
        this.load.image('bathroom2', 'assets/tilesets/fixtures_BA.png');
        
        // Carregar o mapa tche
        this.load.tilemapTiledJSON('tche_map', 'assets/maps/tche.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[TcheScene] Criando cena do mapa Tche');
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        
        // Criar mapa
        const map = this.make.tilemap({ key: 'tche_map' });
        
        if (!map) {
            console.error('[TcheScene] ERRO: Mapa tche_map não foi carregado!');
            this.scene.start('TitleScene');
            return;
        }
        
        this.map = map;
        console.log('[TcheScene] Mapa carregado:', map.width, 'x', map.height);
        console.log('[TcheScene] Tilesets no JSON:', map.tilesets.map(t => ({ name: t.name, firstgid: t.firstgid })));
        
        // Verificar se todos os tilesets foram carregados
        const loadedTextures = this.textures.list;
        console.log('[TcheScene] Texturas carregadas:', Object.keys(loadedTextures).filter(k => !k.startsWith('__')));
        
        // Adicionar tilesets EXATAMENTE como estão no JSON do mapa
        let interiorsTileset, cyberpunkTileset, furnitureTileset, pipoTileset;
        let doorTileset, interiorLiteTileset, bathroomTileset, bathroom2Tileset;
        
        // Interiors_tilesets - firstgid: 1
        interiorsTileset = map.addTilesetImage('Interiors_tilesets');
        console.log('[TcheScene] Interiors_tilesets:', interiorsTileset ? 'OK' : 'FALHOU');
        
        // pixel-cyberpunk-interior - firstgid: 3393
        cyberpunkTileset = map.addTilesetImage('pixel-cyberpunk-interior');
        console.log('[TcheScene] pixel-cyberpunk-interior:', cyberpunkTileset ? 'OK' : 'FALHOU');
        
        // furniture_and_props - firstgid: 3624
        furnitureTileset = map.addTilesetImage('furniture_and_props');
        console.log('[TcheScene] furniture_and_props:', furnitureTileset ? 'OK' : 'FALHOU');
        
        // [Base]BaseChip_pipo - firstgid: 5301
        pipoTileset = map.addTilesetImage('[Base]BaseChip_pipo');
        console.log('[TcheScene] [Base]BaseChip_pipo:', pipoTileset ? 'OK' : 'FALHOU');
        
        // Door3_pipo - firstgid: 6365
        doorTileset = map.addTilesetImage('Door3_pipo');
        console.log('[TcheScene] Door3_pipo:', doorTileset ? 'OK' : 'FALHOU');
        
        // InteriorTilesLITE - firstgid: 6509
        interiorLiteTileset = map.addTilesetImage('InteriorTilesLITE');
        console.log('[TcheScene] InteriorTilesLITE:', interiorLiteTileset ? 'OK' : 'FALHOU');
        
        // bathroom - firstgid: 6733
        bathroomTileset = map.addTilesetImage('bathroom');
        console.log('[TcheScene] bathroom:', bathroomTileset ? 'OK' : 'FALHOU');
        
        // bathroom2 - firstgid: 6778
        bathroom2Tileset = map.addTilesetImage('bathroom2');
        console.log('[TcheScene] bathroom2:', bathroom2Tileset ? 'OK' : 'FALHOU');
        
        // Array com todos os tilesets
        const allTilesets = [
            interiorsTileset,
            cyberpunkTileset,
            furnitureTileset,
            pipoTileset,
            doorTileset,
            interiorLiteTileset,
            bathroomTileset,
            bathroom2Tileset
        ].filter(Boolean);
        
        console.log('[TcheScene] Tilesets carregados:', allTilesets.length);
        
        // Criar camadas na ordem correta (de baixo para cima) com logs
        console.log('[TcheScene] Criando camadas...');
        this.pisoLayer = map.createLayer('Piso', allTilesets, 0, 0);
        console.log('[TcheScene] Piso:', !!this.pisoLayer);
        
        this.banheirochaoLayer = map.createLayer('banheirochao', allTilesets, 0, 0);
        console.log('[TcheScene] banheirochao:', !!this.banheirochaoLayer);
        
        this.paredesLayer = map.createLayer('paredes', allTilesets, 0, 0);
        console.log('[TcheScene] paredes:', !!this.paredesLayer);
        
        this.banheiroLayer = map.createLayer('banheiro', allTilesets, 0, 0);
        console.log('[TcheScene] banheiro:', !!this.banheiroLayer);
        
        this.portasLayer = map.createLayer('PORTAS', allTilesets, 0, 0);
        console.log('[TcheScene] PORTAS:', !!this.portasLayer);
        
        this.nseiLayer = map.createLayer('nsei', allTilesets, 0, 0);
        console.log('[TcheScene] nsei:', !!this.nseiLayer);
        
        this.salaLayer = map.createLayer('sala', allTilesets, 0, 0);
        console.log('[TcheScene] sala:', !!this.salaLayer);
        
        this.objetosLayer = map.createLayer('OBJETOS', allTilesets, 0, 0);
        console.log('[TcheScene] OBJETOS:', !!this.objetosLayer);
        
        this.escadasLayer = map.createLayer('ESCADAS', allTilesets, 0, 0);
        console.log('[TcheScene] ESCADAS:', !!this.escadasLayer);
        
        this.temcolisaoLayer = map.createLayer('temcolisao', allTilesets, 0, 0);
        console.log('[TcheScene] temcolisao:', !!this.temcolisaoLayer);
        
        this.propsLayer = map.createLayer('props', allTilesets, 0, 0);
        console.log('[TcheScene] props:', !!this.propsLayer);
        
        this.teiasLayer = map.createLayer('teias', allTilesets, 0, 0);
        console.log('[TcheScene] teias:', !!this.teiasLayer);
        
        this.portatheoLayer = map.createLayer('portatheo', allTilesets, 0, 0);
        console.log('[TcheScene] portatheo:', !!this.portatheoLayer);
        
        console.log('[TcheScene] Todas as camadas criadas!');
        
        // Configurar colisões apenas nas camadas que precisam
        if (this.paredesLayer) {
            this.paredesLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.temcolisaoLayer) {
            this.temcolisaoLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.objetosLayer) {
            this.objetosLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.portasLayer) {
            this.portasLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.escadasLayer) {
            this.escadasLayer.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar limites do mundo - começar 32 pixels (1 tile) para a direita
        // Isso evita o problema de colisão na borda esquerda
        this.physics.world.setBounds(32, 0, this.map.widthInPixels - 32, this.map.heightInPixels);
        
        // Criar o jogador - usar posição salva ou posição padrão (centro do mapa)
        const entryPos = window._playerEntryPos;
        console.log('[TcheScene] window._playerEntryPos:', entryPos);
        
        // Posição padrão: centro aproximado do mapa principal
        const defaultX = 15 * 32 + 16;
        const defaultY = 10 * 32 + 16;
        
        const spawnX = entryPos?.x ?? defaultX;
        const spawnY = entryPos?.y ?? defaultY;
        
        console.log('[TcheScene] Spawn do player:', { x: spawnX, y: spawnY, default: !entryPos });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Garantir que o player não ultrapasse os limites do mundo
        this.player.setCollideWorldBounds(true);
        
        // Criar camada de adornos DEPOIS do player para ficar acima dele
        this.adornoLayer = map.createLayer('adorno parede', allTilesets, 0, 0);
        if (this.adornoLayer) {
            this.adornoLayer.setDepth(10000); // Depth alto para ficar acima do player
        }
        
        // Limpar flag de entrada DEPOIS de usar
        console.log('[TcheScene] Limpando window._playerEntryPos');
        window._playerEntryPos = null;
        
        // Adicionar colisão do player com camadas colisíveis
        if (this.paredesLayer) {
            this.physics.add.collider(this.player, this.paredesLayer);
        }
        if (this.temcolisaoLayer) {
            this.physics.add.collider(this.player, this.temcolisaoLayer);
        }
        if (this.objetosLayer) {
            this.physics.add.collider(this.player, this.objetosLayer);
        }
        if (this.portasLayer) {
            this.physics.add.collider(this.player, this.portasLayer);
        }
        if (this.escadasLayer) {
            this.physics.add.collider(this.player, this.escadasLayer);
        }
        if (this.banheiroLayer) {
            this.physics.add.collider(this.player, this.banheiroLayer);
        }
        
        // Criar sistemas de UI
        this.createDialogueSystem();
        this.createHotbar();
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, this.map);
        
        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5); // Zoom maior para ver melhor os detalhes
        
        if (this.map) {
            // Prender a câmera nas bordas do mapa (começando 1 tile à direita)
            worldCam.setBounds(32, 0, this.map.widthInPixels - 32, this.map.heightInPixels);
        }
        
        worldCam.roundPixels = true;
        
        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        
        const worldObjects = [
            this.player,
            this.pisoLayer,
            this.banheirochaoLayer,
            this.paredesLayer,
            this.banheiroLayer,
            this.portasLayer,
            this.nseiLayer,
            this.salaLayer,
            this.objetosLayer,
            this.escadasLayer,
            this.temcolisaoLayer,
            this.propsLayer,
            this.teiasLayer,
            this.portatheoLayer,
            this.adornoLayer
        ].filter(Boolean);
        
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[TcheScene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update() {
        this.updateBase();
        
        if (this.dialogue?.active) return;
        
        this.coordProbe.update();
    }

    // Métodos para controlar o CoordProbe
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
