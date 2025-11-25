import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';

export class HallDoHalliradoScene extends BaseScene {
    constructor() {
        super('HallDoHalliradoScene');
    }

    preload() {
        super.preload();
        
        // Carregar sprite do jogador
        this.load.spritesheet('player', 'assets/sprites/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        // Carregar o mapa JSON
        this.load.tilemapTiledJSON('halldohallirado', 'assets/maps/halldohallirado.json');
        
        // Carregar os tilesets necessários
        this.load.image('LightShadow_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/LightShadow_pipo.png');
        this.load.image('Dirt1_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/[A]_type1/[A]Dirt1_pipo.png');
        this.load.image('BaseChip_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/[Base]BaseChip_pipo.png');
        this.load.image('Interiors_tilesets', 'assets/tilesets/Interiors_tilesets.png');
        this.load.image('TbG3+J', 'assets/tilesets/TbG3+J.png');
        this.load.image('furniture_and_props', 'assets/tilesets/furniture_and_props.png');
        this.load.image('pixel-cyberpunk-interior', 'assets/tilesets/pixel-cyberpunk-interior.png');
    }

    create() {
        console.log('[HallDoHalliradoScene] Criando cena Hall do Hallirado');
        
        // Criar o mapa a partir do JSON
        this.map = this.make.tilemap({ key: 'halldohallirado' });
        
        // Adicionar os tilesets ao mapa (ORDEM EXATA DO JSON!)
        const lightShadowTileset = this.map.addTilesetImage('LightShadow_pipo', 'LightShadow_pipo');
        const dirtTileset = this.map.addTilesetImage('[A]Dirt1_pipo', 'Dirt1_pipo');
        const baseChipTileset = this.map.addTilesetImage('[Base]BaseChip_pipo', 'BaseChip_pipo');
        const interiorsTileset = this.map.addTilesetImage('Interiors_tilesets', 'Interiors_tilesets');
        const tbg3Tileset = this.map.addTilesetImage('TbG3+J', 'TbG3+J');
        const furnitureTileset = this.map.addTilesetImage('furniture_and_props', 'furniture_and_props');
        const cyberpunkTileset = this.map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interior');
        
        // Array com todos os tilesets para usar nas camadas
        const tilesets = [
            lightShadowTileset,
            dirtTileset,
            baseChipTileset,
            interiorsTileset,
            tbg3Tileset,
            furnitureTileset,
            cyberpunkTileset
        ].filter(Boolean);
        
        console.log('[HallDoHalliradoScene] Tilesets carregados:', tilesets.length);
        
        // Criar as camadas do mapa na ordem correta (de baixo para cima)
        this.shadowLayer = this.map.createLayer('sombra', tilesets, 0, 0);
        this.groundLayer = this.map.createLayer('Camada de Blocos 1', tilesets, 0, 0);
        this.wallLayer = this.map.createLayer('parede', tilesets, 0, 0);
        this.boxesLayer = this.map.createLayer('caixotes', tilesets, 0, 0);
        this.pipeLayer = this.map.createLayer('cano', tilesets, 0, 0);
        this.webLayer = this.map.createLayer('teia de aranhya', tilesets, 0, 0);
        this.switchLayer = this.map.createLayer('interruptor', tilesets, 0, 0);
        this.doorLayer = this.map.createLayer('porta', tilesets, 0, 0);
        
        // Divisória será criada depois do player para ficar acima
        
        // Configurar colisões nas camadas necessárias
        if (this.wallLayer) {
            this.wallLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.boxesLayer) {
            this.boxesLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.switchLayer) {
            this.switchLayer.setCollisionByExclusion([-1, 0]);
        }
        if (this.doorLayer) {
            this.doorLayer.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar limites do mundo
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Criar o jogador no centro do hall (createCommonPlayer já cria os controles virtuais)
        this.createCommonPlayer(480, 384);
        
        // Criar divisória DEPOIS do player para ficar acima dele
        this.divisionLayer = this.map.createLayer('divisória', tilesets, 0, 0);
        if (this.divisionLayer) {
            this.divisionLayer.setDepth(10000); // Depth alto para ficar acima do player
        }
        
        // Adicionar colisões entre o jogador e as camadas
        if (this.wallLayer) {
            this.physics.add.collider(this.player, this.wallLayer);
        }
        if (this.boxesLayer) {
            this.physics.add.collider(this.player, this.boxesLayer);
        }
        if (this.switchLayer) {
            this.physics.add.collider(this.player, this.switchLayer);
        }
        if (this.doorLayer) {
            this.physics.add.collider(this.player, this.doorLayer);
        }
        
        // Criar sistemas de UI
        this.createDialogueSystem();
        this.createHotbar();
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, this.map);
        
        // Cartaz de procurado (tiles 27, 17-18)
        const tileSize = 32;
        const posterTileX = 27;
        const posterTileY = 17; // Usar o tile superior
        const posterX = posterTileX * tileSize + tileSize / 2;
        const posterY = posterTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para o cartaz
        this.wantedPoster = this.add.zone(posterX, posterY, 32, 64); // 2 tiles de altura
        this.physics.world.enable(this.wantedPoster);
        this.wantedPoster.body.setImmovable(true);
        this.wantedPoster.body.moves = false;
        
        // Ícone de interação para o cartaz
        this.posterIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.posterIcon.offsetY = -40;
        
        console.log('[HallDoHalliradoScene] Cartaz criado em tile (27, 17-18) -> pixel:', posterX, posterY);
        
        // Configurar câmera principal (igual Intro2Scene)
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(2);
        
        // Limitar câmera à área da sala (tiles 10-29 em X, tiles 7-19 em Y)
        // Tile 10 = 320px, Tile 29 = 960px (29+1)*32 = 960
        // Tile 7 = 224px, Tile 19 = 640px (19+1)*32 = 640
        const roomLeft = 10 * 32;
        const roomTop = 7 * 32;
        const roomWidth = 20 * 32; // 20 tiles de largura
        const roomHeight = 13 * 32; // 13 tiles de altura
        
        worldCam.setBounds(roomLeft, roomTop, roomWidth, roomHeight);
        worldCam.roundPixels = true;
        
        // Fade in suave
        worldCam.fadeIn(500, 0, 0, 0);
        
        // Gerenciador de câmera de UI (igual Intro2Scene)
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        
        // Adicionar ícones de interação ao array de objetos do mundo
        const posterIconObjects = [];
        if (this.posterIcon?.icon) posterIconObjects.push(this.posterIcon.icon);
        if (this.posterIcon?.pulse) posterIconObjects.push(this.posterIcon.pulse);
        
        const worldObjects = [
            this.player,
            this.shadowLayer,
            this.groundLayer,
            this.wallLayer,
            this.divisionLayer,
            this.boxesLayer,
            this.pipeLayer,
            this.webLayer,
            this.switchLayer,
            this.doorLayer,
            ...posterIconObjects
        ].filter(Boolean);
        
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[HallDoHalliradoScene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        console.log('[HallDoHalliradoScene] Cena criada com sucesso');
    }

    update() {
        this.updateBase();
        
        // Atualizar CoordProbe
        if (this.coordProbe) {
            this.coordProbe.update();
        }
        
        // Interação com o cartaz de procurado
        if (!this.dialogue?.active && this.wantedPoster && this.player) {
            const distanceToPoster = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.wantedPoster.x, 
                this.wantedPoster.y
            );
            
            let posterIconVisible = false;
            if (distanceToPoster < 50) {
                // Mostrar ícone quando próximo
                if (!this.posterIcon.visible) {
                    this.posterIcon.showAbove(this.wantedPoster);
                    console.log('[HallDoHalliradoScene] Mostrado ícone do cartaz');
                }
                posterIconVisible = true;
                this.currentInteractable = 'poster';
                
                // Desabilitar área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.disableInteractive();
                    this.hotbar.clickableArea.setVisible(false);
                    this.hotbar.clickableArea.setActive(false);
                }
            }
            
            if (!posterIconVisible) {
                if (this.posterIcon.visible) {
                    this.posterIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do cartaz (longe)');
                }
                if (this.currentInteractable === 'poster') {
                    this.currentInteractable = null;
                    
                    // Re-habilitar área clicável da hotbar
                    if (this.hotbar && this.hotbar.clickableArea) {
                        this.hotbar.clickableArea.setInteractive();
                        this.hotbar.clickableArea.setVisible(true);
                        this.hotbar.clickableArea.setActive(true);
                    }
                }
            }
            
            // Atualizar posição do ícone
            this.posterIcon.updatePosition();
        } else if (this.dialogue?.active) {
            // Durante diálogo, esconder ícone e limpar interactable
            if (this.posterIcon) {
                this.posterIcon.hide();
            }
            if (this.currentInteractable === 'poster') {
                this.currentInteractable = null;
                
                // Re-habilitar área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.setInteractive();
                    this.hotbar.clickableArea.setVisible(true);
                    this.hotbar.clickableArea.setActive(true);
                }
            }
        }
        
        // Lógica específica da cena pode ser adicionada aqui
    }
    
    handleInteraction() {
        super.handleInteraction();
        
        console.log('[HallDoHalliradoScene] handleInteraction chamado, currentInteractable:', this.currentInteractable);
        
        // Interação com o cartaz de procurado
        if (this.currentInteractable === 'poster') {
            this.readWantedPoster();
        }
    }
    
    /**
     * Lê o cartaz de procurado
     */
    readWantedPoster() {
        console.log('[HallDoHalliradoScene] Lendo cartaz de procurado');
        
        // Esconder ícone de interação
        if (this.posterIcon) {
            this.posterIcon.hide();
        }
        
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
        
        // Mostrar diálogo
        this.dialogue.show('Cartaz de procurado de um homem  chamado Ariel da Silva Coutinho', {
            disableSound: true
        });
        
        // Sobrescrever close() para restaurar controles
        const originalClose = this.dialogue.close.bind(this.dialogue);
        this.dialogue.close = () => {
            originalClose();
            
            console.log('[HallDoHalliradoScene] Restaurando controles');
            
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
        };
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
