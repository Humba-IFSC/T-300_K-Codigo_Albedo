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
        if (this.shadowLayer) {
            console.log('[HallDoHalliradoScene] Camada de sombra criada com sucesso');
            this.shadowLayer.setDepth(5000); // Depth alto para ficar acima de outras camadas
        } else {
            console.error('[HallDoHalliradoScene] ERRO: Camada de sombra não foi criada!');
        }
        
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
        
        // Criar o jogador - usar posição salva ou posição padrão (centro do hall)
        const entryPos = window._playerEntryPos;
        const spawnX = entryPos?.x ?? 480;
        const spawnY = entryPos?.y ?? 384;
        
        console.log('[HallDoHalliradoScene] Spawn do player:', { x: spawnX, y: spawnY, entryPos });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Limpar flag de entrada
        window._playerEntryPos = null;
        
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
        
        // Lista de visitação (tiles 21, 10-11)
        const listTileX = 21;
        const listTileY = 10; // Usar o tile superior
        const listX = listTileX * tileSize + tileSize / 2;
        const listY = listTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para a lista
        this.visitList = this.add.zone(listX, listY, 32, 64); // 2 tiles de altura
        this.physics.world.enable(this.visitList);
        this.visitList.body.setImmovable(true);
        this.visitList.body.moves = false;
        
        // Ícone de interação para a lista
        this.listIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.listIcon.offsetY = -40;
        
        console.log('[HallDoHalliradoScene] Lista criada em tile (21, 10-11) -> pixel:', listX, listY);
        
        // Mapa da fábrica (tiles 19, 10-11)
        const mapTileX = 19;
        const mapTileY = 10;
        const mapX = mapTileX * tileSize + tileSize / 2;
        const mapY = mapTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para o mapa
        this.factoryMap = this.add.zone(mapX, mapY, 32, 64); // 2 tiles de altura
        this.physics.world.enable(this.factoryMap);
        this.factoryMap.body.setImmovable(true);
        this.factoryMap.body.moves = false;
        
        // Ícone de interação para o mapa
        this.mapIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.mapIcon.offsetY = -40;
        
        console.log('[HallDoHalliradoScene] Mapa criado em tile (19, 10-11) -> pixel:', mapX, mapY);
        
        // Interruptor (tile 16, 8)
        const switchTileX = 16;
        const switchTileY = 8;
        const switchX = switchTileX * tileSize + tileSize / 2;
        const switchY = switchTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para o interruptor
        this.lightSwitch = this.add.zone(switchX, switchY, 32, 32);
        this.physics.world.enable(this.lightSwitch);
        this.lightSwitch.body.setImmovable(true);
        this.lightSwitch.body.moves = false;
        
        // Ícone de interação para o interruptor
        this.switchIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.switchIcon.offsetY = -24;
        
        // Estado das luzes (começam desligadas - sombra visível)
        this.lightsOn = false;
        
        console.log('[HallDoHalliradoScene] Interruptor criado em tile (16, 8) -> pixel:', switchX, switchY);
        
        // Configurar câmera principal (igual Intro2Scene)
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5); // Zoom maior para melhor visualização
        
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
        
        const listIconObjects = [];
        if (this.listIcon?.icon) listIconObjects.push(this.listIcon.icon);
        if (this.listIcon?.pulse) listIconObjects.push(this.listIcon.pulse);
        
        const switchIconObjects = [];
        if (this.switchIcon?.icon) switchIconObjects.push(this.switchIcon.icon);
        if (this.switchIcon?.pulse) switchIconObjects.push(this.switchIcon.pulse);
        
        const mapIconObjects = [];
        if (this.mapIcon?.icon) mapIconObjects.push(this.mapIcon.icon);
        if (this.mapIcon?.pulse) mapIconObjects.push(this.mapIcon.pulse);
        
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
            ...posterIconObjects,
            ...listIconObjects,
            ...switchIconObjects,
            ...mapIconObjects
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
        }
        
        // Interação com a lista de visitação
        if (!this.dialogue?.active && this.visitList && this.player) {
            const distanceToList = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.visitList.x, 
                this.visitList.y
            );
            
            let listIconVisible = false;
            if (distanceToList < 50) {
                // Mostrar ícone quando próximo
                if (!this.listIcon.visible) {
                    this.listIcon.showAbove(this.visitList);
                    console.log('[HallDoHalliradoScene] Mostrado ícone da lista');
                }
                listIconVisible = true;
                this.currentInteractable = 'list';
                
                // Desabilitar área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.disableInteractive();
                    this.hotbar.clickableArea.setVisible(false);
                    this.hotbar.clickableArea.setActive(false);
                }
            }
            
            if (!listIconVisible) {
                if (this.listIcon.visible) {
                    this.listIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone da lista (longe)');
                }
                if (this.currentInteractable === 'list') {
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
            this.listIcon.updatePosition();
        }
        
        // Interação com o interruptor
        if (!this.dialogue?.active && this.lightSwitch && this.player && !this.switchUsed) {
            const distanceToSwitch = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.lightSwitch.x, 
                this.lightSwitch.y
            );
            
            let switchIconVisible = false;
            if (distanceToSwitch < 50) {
                // Mostrar ícone quando próximo
                if (!this.switchIcon.visible) {
                    this.switchIcon.showAbove(this.lightSwitch);
                    console.log('[HallDoHalliradoScene] Mostrado ícone do interruptor');
                }
                switchIconVisible = true;
                this.currentInteractable = 'switch';
                
                // Desabilitar área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.disableInteractive();
                    this.hotbar.clickableArea.setVisible(false);
                    this.hotbar.clickableArea.setActive(false);
                }
            }
            
            if (!switchIconVisible) {
                if (this.switchIcon.visible) {
                    this.switchIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do interruptor (longe)');
                }
                if (this.currentInteractable === 'switch') {
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
            this.switchIcon.updatePosition();
        }
        
        // Interação com o mapa da fábrica
        if (!this.dialogue?.active && this.factoryMap && this.player) {
            const distanceToMap = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.factoryMap.x, 
                this.factoryMap.y
            );
            
            let mapIconVisible = false;
            if (distanceToMap < 50) {
                // Mostrar ícone quando próximo
                if (!this.mapIcon.visible) {
                    this.mapIcon.showAbove(this.factoryMap);
                    console.log('[HallDoHalliradoScene] Mostrado ícone do mapa');
                }
                mapIconVisible = true;
                this.currentInteractable = 'map';
                
                // Desabilitar área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.disableInteractive();
                    this.hotbar.clickableArea.setVisible(false);
                    this.hotbar.clickableArea.setActive(false);
                }
            }
            
            if (!mapIconVisible) {
                if (this.mapIcon.visible) {
                    this.mapIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do mapa (longe)');
                }
                if (this.currentInteractable === 'map') {
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
            this.mapIcon.updatePosition();
        }
        
        // Durante diálogo, esconder ícones e limpar interactable
        if (this.dialogue?.active) {
            // Esconder ícones
            if (this.posterIcon) {
                this.posterIcon.hide();
            }
            if (this.listIcon) {
                this.listIcon.hide();
            }
            if (this.switchIcon) {
                this.switchIcon.hide();
            }
            if (this.mapIcon) {
                this.mapIcon.hide();
            }
            if (this.currentInteractable === 'poster' || this.currentInteractable === 'list' || this.currentInteractable === 'switch' || this.currentInteractable === 'map') {
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
        
        // Interação com a lista de visitação
        if (this.currentInteractable === 'list') {
            this.readVisitList();
        }
        
        // Interação com o interruptor
        if (this.currentInteractable === 'switch') {
            this.toggleLights();
        }
        
        // Interação com o mapa
        if (this.currentInteractable === 'map') {
            this.readFactoryMap();
        }
    }
    
    /**
     * Alterna o estado das luzes (opacidade da camada de sombra)
     */
    toggleLights() {
        console.log('[HallDoHalliradoScene] Alternando luzes');
        
        // Marcar interruptor como usado
        this.switchUsed = true;
        
        // Esconder ícone de interação
        if (this.switchIcon) {
            this.switchIcon.hide();
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
        
        // Ligar luzes (só pode ligar, não desligar)
        this.lightsOn = true;
        
        // Animar opacidade da camada de sombra
        if (this.shadowLayer) {
            this.tweens.add({
                targets: this.shadowLayer,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    console.log('[HallDoHalliradoScene] Luzes LIGADAS');
                }
            });
        }
        
        // Mostrar diálogo indicando a ação
        this.dialogue.show('Interruptor acionado. As luzes foram ligadas!', {
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
    
    /**
     * Lê a lista de visitação
     */
    readVisitList() {
        console.log('[HallDoHalliradoScene] Lendo lista de visitação');
        
        // Verificar se está muito escuro
        if (!this.lightsOn) {
            this.showDarkMessage();
            return;
        }
        
        // Esconder ícone de interação
        if (this.listIcon) {
            this.listIcon.hide();
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
        this.dialogue.show('Lista de visitação da fábrica, Dr. Aris Thorne estava presente.', {
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
    
    /**
     * Lê o cartaz de procurado
     */
    readWantedPoster() {
        console.log('[HallDoHalliradoScene] Lendo cartaz de procurado');
        
        // Verificar se está muito escuro
        if (!this.lightsOn) {
            this.showDarkMessage();
            return;
        }
        
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
    
    /**
     * Lê o mapa da fábrica
     */
    readFactoryMap() {
        console.log('[HallDoHalliradoScene] Lendo mapa da fábrica');
        
        // Verificar se está muito escuro
        if (!this.lightsOn) {
            this.showDarkMessage();
            return;
        }
        
        // Esconder ícone de interação
        if (this.mapIcon) {
            this.mapIcon.hide();
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
        
        // Array de mensagens para o DialogueSystem
        const messages = [
            'É um mapa da fábrica',
            'Hall - Montagem',
            'Andar superior - Primeira lei da termodinâmica',
            'Sala 2 - Segunda lei da termodinâmica',
            'O resto do mapa está velho demais para ler.'
        ];
        
        // Mostrar todas as mensagens em sequência
        this.dialogue.show(messages, {
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
    
    /**
     * Mostra mensagem quando está muito escuro para ler
     */
    showDarkMessage() {
        console.log('[HallDoHalliradoScene] Muito escuro para ler');
        
        // Esconder ícones
        if (this.posterIcon) {
            this.posterIcon.hide();
        }
        if (this.listIcon) {
            this.listIcon.hide();
        }
        if (this.mapIcon) {
            this.mapIcon.hide();
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
        this.dialogue.show('Está muito escuro, não consigo ler.', {
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
