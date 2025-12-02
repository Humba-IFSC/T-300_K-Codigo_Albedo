import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';

/**
 * QuartoTheoScene - Cena do quarto do Theo
 */
export default class QuartoTheoScene extends BaseScene {
    constructor() {
        super('QuartoTheoScene');
    }

    preload() {
        super.preload();
        
        // Carregar tilesets do mapa quartotheo
        this.load.image('cyberpunk', 'assets/tilesets/cyberpunk.png');
        this.load.image('furniture_and_props', 'assets/tilesets/furniture_and_props.png');
        this.load.image('Interiors_tilesets', 'assets/tilesets/Interiors_tilesets.png');
        this.load.image('nAtitK', 'assets/tilesets/nAtitK.png');
        this.load.image('TbG3+J', 'assets/tilesets/TbG3+J.png');
        this.load.image('documento', 'assets/tilesets/documento.png');
        
        // Carregar o mapa quartotheo
        this.load.tilemapTiledJSON('quartotheo_map', 'assets/maps/quartotheo.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[QuartoTheoScene] Criando cena Quarto do Theo');
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        
        // Criar mapa
        const map = this.make.tilemap({ key: 'quartotheo_map' });
        
        if (!map) {
            console.error('[QuartoTheoScene] ERRO: Mapa quartotheo_map não foi carregado!');
            this.scene.start('TitleScene');
            return;
        }
        
        this.map = map;
        console.log('[QuartoTheoScene] Mapa carregado:', map.width, 'x', map.height);
        
        // Adicionar tilesets
        const cyberpunkTileset = map.addTilesetImage('cyberpunk');
        const furnitureTileset = map.addTilesetImage('furniture_and_props');
        const interiorsTileset = map.addTilesetImage('Interiors_tilesets');
        const nAtitKTileset = map.addTilesetImage('nAtitK');
        const TbG3JTileset = map.addTilesetImage('TbG3+J');
        const documentoTileset = map.addTilesetImage('documento');
        
        console.log('[QuartoTheoScene] Tilesets adicionados:', {
            cyberpunk: !!cyberpunkTileset,
            furniture: !!furnitureTileset,
            interiors: !!interiorsTileset,
            nAtitK: !!nAtitKTileset,
            TbG3J: !!TbG3JTileset,
            documento: !!documentoTileset
        });
        
        const allTilesets = [
            cyberpunkTileset,
            furnitureTileset,
            interiorsTileset,
            nAtitKTileset,
            TbG3JTileset,
            documentoTileset
        ].filter(Boolean);
        
        console.log('[QuartoTheoScene] Tilesets válidos:', allTilesets.length);
        
        // Criar camadas do mapa
        const layers = map.layers.map(layerData => {
            const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
            if (layer) {
                layer.setVisible(true);
                layer.setAlpha(1);
                console.log('[QuartoTheoScene] Camada criada:', layerData.name, 'Visível:', layer.visible, 'Alpha:', layer.alpha);
            } else {
                console.error('[QuartoTheoScene] FALHA ao criar camada:', layerData.name);
            }
            return layer;
        }).filter(Boolean);
        
        // Configurar colisões (ajustar conforme necessário)
        layers.forEach(layer => {
            if (layer.layer.name.toLowerCase().includes('colisao') || 
                layer.layer.name.toLowerCase().includes('parede') ||
                layer.layer.name.toLowerCase().includes('objeto')) {
                layer.setCollisionByExclusion([-1, 0]);
                console.log('[QuartoTheoScene] Colisão configurada para:', layer.layer.name);
            }
        });
        
        // Configurar limites do mundo
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Criar o jogador
        const entryPos = window._playerEntryPos;
        const defaultX = 10 * 32 + 16;
        const defaultY = 15 * 32 + 16;
        
        const spawnX = entryPos?.x ?? defaultX;
        const spawnY = entryPos?.y ?? defaultY;
        
        console.log('[QuartoTheoScene] Spawn do player:', { x: spawnX, y: spawnY });
        
        this.createCommonPlayer(spawnX, spawnY);
        this.player.setCollideWorldBounds(true);
        
        // Limpar flag de entrada
        window._playerEntryPos = null;
        
        // Adicionar colisão do player com camadas
        layers.forEach(layer => {
            if (layer.layer.properties?.collides || 
                layer.layer.name.toLowerCase().includes('colisao') ||
                layer.layer.name.toLowerCase().includes('parede') ||
                layer.layer.name.toLowerCase().includes('objeto')) {
                this.physics.add.collider(this.player, layer);
            }
        });
        
        // Criar sistemas de UI
        this.createDialogueSystem();
        this.createHotbar();
        
        // Restaurar hotbar se já tinha itens (sem mostrar)
        if (window._hotbarItems) {
            window._hotbarItems.forEach((item, idx) => {
                if (item) this.hotbar.setItem(idx, item);
            });
        }
        
        // Forçar hotbar a começar fechada (offscreen)
        if (this.hotbar) {
            this.hotbar.isOpen = false;
            this.hotbar.slots.forEach(slot => slot.y = this.hotbar.offscreenY);
            this.hotbar.highlight.y = this.hotbar.offscreenY;
            if (this.hotbar.toggleButton) {
                this.hotbar.toggleButton.y = this.hotbar.offscreenY + this.hotbar.slotSize + 10;
            }
            this.hotbar.itemSprites.forEach((sprite, idx) => {
                if (sprite) {
                    const slot = this.hotbar.slots[idx];
                    sprite.y = slot.y + slot.height / 2;
                }
            });
        }
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, this.map);
        
        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5);
        worldCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        worldCam.roundPixels = true;
        
        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        
        const worldObjects = [
            this.player,
            ...layers
        ].filter(Boolean);
        
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[QuartoTheoScene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update() {
        this.updateBase();
        
        // Atualizar depth do player baseado no Y
        if (this.player) {
            this.player.setDepth(this.player.y + 1);
        }
        
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
