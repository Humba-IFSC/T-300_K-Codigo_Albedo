import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';

/**
 * DanteScene - Cena do mapa Dante
 */
export default class DanteScene extends BaseScene {
    constructor() {
        super('DanteScene');
    }

    preload() {
        super.preload();
        
        // Carregar tilesets do mapa dante
        this.load.image('nAtitK', 'assets/tilesets/nAtitK.png');
        this.load.image('furniture_and_props', 'assets/tilesets/furniture_and_props.png');
        this.load.image('Interiors_tilesets', 'assets/tilesets/Interiors_tilesets.png');
        this.load.image('cyberpunk', 'assets/tilesets/cyberpunk.png');
        this.load.image('LightShadow_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/LightShadow_pipo.png');
        this.load.image('[Base]BaseChip_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/[Base]BaseChip_pipo.png');
        this.load.image('gravador', 'assets/tilesets/gravador.png');
        
        // Carregar o mapa dante
        this.load.tilemapTiledJSON('dante_map', 'assets/maps/dante.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[DanteScene] Criando cena Dante');
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        this.isTransitioning = false;
        
        // Criar mapa
        const map = this.make.tilemap({ key: 'dante_map' });
        
        if (!map) {
            console.error('[DanteScene] ERRO: Mapa dante_map não foi carregado!');
            this.scene.start('TitleScene');
            return;
        }
        
        this.map = map;
        console.log('[DanteScene] Mapa carregado:', map.width, 'x', map.height);
        
        // Adicionar tilesets
        const nAtitKTileset = map.addTilesetImage('nAtitK');
        const furnitureTileset = map.addTilesetImage('furniture_and_props');
        const interiorsTileset = map.addTilesetImage('Interiors_tilesets');
        const cyberpunkTileset = map.addTilesetImage('cyberpunk');
        const lightShadowTileset = map.addTilesetImage('LightShadow_pipo');
        const baseChipTileset = map.addTilesetImage('[Base]BaseChip_pipo');
        const gravadorTileset = map.addTilesetImage('gravador');
        
        console.log('[DanteScene] Tilesets adicionados:', {
            nAtitK: !!nAtitKTileset,
            furniture: !!furnitureTileset,
            interiors: !!interiorsTileset,
            cyberpunk: !!cyberpunkTileset,
            lightShadow: !!lightShadowTileset,
            baseChip: !!baseChipTileset,
            gravador: !!gravadorTileset
        });
        
        const allTilesets = [
            nAtitKTileset,
            furnitureTileset,
            interiorsTileset,
            cyberpunkTileset,
            lightShadowTileset,
            baseChipTileset,
            gravadorTileset
        ].filter(Boolean);
        
        console.log('[DanteScene] Tilesets válidos:', allTilesets.length);
        
        // Criar camadas do mapa
        const layers = map.layers.map(layerData => {
            const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
            if (layer) {
                layer.setVisible(true);
                layer.setAlpha(1);
                console.log('[DanteScene] Camada criada:', layerData.name, 'Visível:', layer.visible);
            } else {
                console.error('[DanteScene] FALHA ao criar camada:', layerData.name);
            }
            return layer;
        }).filter(Boolean);
        
        // Guardar referência às camadas
        this.layers = layers;
        
        // Configurar colisões para camadas de parede e objetos (exceto objeto1camada)
        layers.forEach(layer => {
            const layerName = layer.layer.name.toLowerCase();
            if (layerName === 'objeto1camada') {
                // Não configurar colisão para objeto1camada
                console.log('[DanteScene] Pulando colisão para:', layer.layer.name);
            } else if (layerName.includes('parede') || 
                layerName.includes('objeto') ||
                layerName.includes('colisao') ||
                layerName.includes('divisoria')) {
                layer.setCollisionByExclusion([-1, 0]);
                console.log('[DanteScene] Colisão configurada para:', layer.layer.name);
            }
        });
        
        // Configurar limites do mundo
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Criar o jogador
        const tileSize = 32;
        const entryPos = window._playerEntryPos;
        const defaultX = 15 * tileSize + 16;
        const defaultY = 20 * tileSize + 16;
        
        const spawnX = entryPos?.x ?? defaultX;
        const spawnY = entryPos?.y ?? defaultY;
        
        console.log('[DanteScene] Spawn do player:', { x: spawnX, y: spawnY });
        
        this.createCommonPlayer(spawnX, spawnY);
        this.player.setCollideWorldBounds(true);
        
        // Limpar flag de entrada
        window._playerEntryPos = null;
        
        // Adicionar colisão do player com camadas (exceto objeto1camada)
        layers.forEach(layer => {
            const layerName = layer.layer.name.toLowerCase();
            if (layerName === 'objeto1camada') {
                // Não adicionar colisão para objeto1camada
            } else if (layerName.includes('parede') || 
                layerName.includes('objeto') ||
                layerName.includes('colisao') ||
                layerName.includes('divisoria')) {
                this.physics.add.collider(this.player, layer);
            }
        });
        
        // Criar sistemas de UI
        this.createDialogueSystem();
        this.createHotbar();
        
        // Restaurar itens da hotbar
        if (window._hotbarItems && this.hotbar) {
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
        
        // Criar interação com o gravador (tiles 9,18 e 10,18)
        const gravadorTileX = 9.5; // Meio entre tiles 9 e 10
        const gravadorTileY = 18;
        const gravadorX = gravadorTileX * tileSize + 16;
        const gravadorY = gravadorTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para o gravador
        this.gravador = this.add.zone(gravadorX, gravadorY, 64, 32); // Largura 64 para cobrir 2 tiles
        this.physics.world.enable(this.gravador);
        this.gravador.body.setImmovable(true);
        this.gravador.body.moves = false;
        
        // Ícone de interação para o gravador
        this.gravadorIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.gravadorIcon.offsetY = -24;
        
        console.log('[DanteScene] Gravador criado em tiles (9-10, 18) -> pixel:', gravadorX, gravadorY);
        
        // Zona de saída para TcheScene (tiles 14-16, linha 24)
        const exitTcheTileX = 15; // Meio entre tiles 14 e 16
        const exitTcheTileY = 24;
        const exitTcheX = exitTcheTileX * tileSize + tileSize / 2;
        const exitTcheY = exitTcheTileY * tileSize + tileSize / 2;
        
        this.exitTcheZone = this.add.zone(exitTcheX, exitTcheY, 96, 32); // Largura 96 para cobrir 3 tiles
        this.physics.world.enable(this.exitTcheZone);
        this.exitTcheZone.body.setImmovable(true);
        this.exitTcheZone.body.moves = false;
        
        console.log('[DanteScene] Zona de saída para TcheScene criada em tiles (14-16, 24):', exitTcheX, exitTcheY);
        
        // Overlap para detectar saída
        this.physics.add.overlap(
            this.player,
            this.exitTcheZone,
            () => this.exitToTche(),
            null,
            this
        );
        
        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5);
        worldCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        worldCam.roundPixels = true;
        
        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        
        // Adicionar ícones de interação aos worldObjects
        const gravadorIconObjects = [];
        if (this.gravadorIcon?.icon) gravadorIconObjects.push(this.gravadorIcon.icon);
        if (this.gravadorIcon?.pulse) gravadorIconObjects.push(this.gravadorIcon.pulse);
        
        const worldObjects = [
            this.player,
            ...layers,
            ...gravadorIconObjects
        ].filter(Boolean);
        
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[DanteScene] Voltando ao menu');
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
        
        // Verificar proximidade com o gravador
        if (!this.dialogue?.active && this.gravador && this.player) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y,
                this.gravador.x, 
                this.gravador.y
            );
            
            const interactionRange = 50;
            
            if (distance < interactionRange) {
                // Player está perto do gravador
                if (!this.currentInteractable || this.currentInteractable !== 'gravador') {
                    this.currentInteractable = 'gravador';
                    this.gravadorIcon.showAbove(this.gravador);
                }
            } else {
                // Player se afastou do gravador
                if (this.currentInteractable === 'gravador') {
                    this.currentInteractable = null;
                    this.gravadorIcon.hide();
                }
            }
        }
    }
    
    handleInteraction() {
        super.handleInteraction();
        
        console.log('[DanteScene] handleInteraction chamado');
        console.log('[DanteScene] - currentInteractable:', this.currentInteractable);
        
        // Interação com o gravador
        if (this.currentInteractable === 'gravador') {
            console.log('[DanteScene] Executando listenToRecorder');
            this.listenToRecorder();
            return;
        }
    }
    
    /**
     * Esconde os controles virtuais (hotbar, joystick, botões)
     */
    hideVirtualControls() {
        // Esconder e suprimir hotbar
        if (this.hotbar) {
            this.hotbar.suppress();
        }
        
        // Esconder controles virtuais manualmente
        if (this.virtualJoystick) {
            this.virtualJoystick.base.setVisible(false);
            this.virtualJoystick.stick.setVisible(false);
            this.virtualJoystick.disabled = true;
        }
        
        if (this.virtualButtons) {
            this.virtualButtons.buttons.forEach(btn => {
                if (btn && btn.container) {
                    btn.container.setVisible(false);
                }
            });
        }
    }
    
    /**
     * Restaura os controles virtuais (hotbar, joystick, botões)
     */
    showVirtualControls() {
        console.log('[DanteScene] Restaurando controles');
        
        // Restaurar hotbar
        if (this.hotbar) {
            this.hotbar.unsuppress(false);
        }
        
        // Restaurar joystick
        if (this.virtualJoystick) {
            this.virtualJoystick.base.setVisible(true);
            this.virtualJoystick.stick.setVisible(true);
            this.virtualJoystick.disabled = false;
        }
        
        // Restaurar botões
        if (this.virtualButtons) {
            this.virtualButtons.buttons.forEach(btn => {
                if (btn && btn.container) {
                    btn.container.setVisible(true);
                }
            });
        }
    }
    
    /**
     * Escuta o gravador de Dante
     */
    listenToRecorder() {
        console.log('[DanteScene] Dante ouvindo o gravador');
        
        // Esconder ícone de interação
        if (this.gravadorIcon) {
            this.gravadorIcon.hide();
        }
        
        // Esconder controles
        this.hideVirtualControls();
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        // Mensagens de Dante com o gravador
        const messages = [
            'É um gravador... vou dar play.',
            '"Droga... tá tudo uma bagunça aqui."',
            '"Onde eu deixei meu pé de cabra?"',
            '"Sem ele eu não consigo abrir nada..."'
        ];
        
        // Mostrar mensagens com áudio
        this.dialogue.show(messages);
    }

    /**
     * Volta para TcheScene
     */
    exitToTche() {
        if (this.isTransitioning) {
            console.log('[DanteScene] Já está em transição, ignorando');
            return;
        }
        
        this.isTransitioning = true;
        console.log('[DanteScene] === SAINDO PARA TCHESCENE ===');
        
        // Definir posição de spawn na TcheScene (meio entre tiles 2,12 e 2,13)
        window._playerEntryPos = {
            x: 2 * 32 + 16,
            y: 12.5 * 32 + 16
        };
        
        console.log('[DanteScene] Definindo window._playerEntryPos:', window._playerEntryPos);
        
        // Fade out
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.time.delayedCall(500, () => {
            console.log('[DanteScene] Iniciando TcheScene');
            this.scene.start('TcheScene');
        });
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
