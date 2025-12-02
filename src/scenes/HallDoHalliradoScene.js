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
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        // Restaurar estado das luzes salvo anteriormente (se existir)
        this.lightsOn = window._hallLightsOn ?? false;
        console.log('[HallDoHalliradoScene] Estado das luzes restaurado:', this.lightsOn);
        this.switchUsed = false;
        
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
        
        // Criar o jogador - usar posição salva ou posição padrão (meio das portas)
        const entryPos = window._playerEntryPos;
        console.log('[HallDoHalliradoScene] window._playerEntryPos:', entryPos);
        
        // Posição padrão: meio das portas (tile 19.5, 18)
        const defaultX = 19.5 * 32 + 16;
        const defaultY = 18 * 32 + 16;
        
        const spawnX = entryPos?.x ?? defaultX;
        const spawnY = entryPos?.y ?? defaultY;
        
        console.log('[HallDoHalliradoScene] Spawn do player:', { x: spawnX, y: spawnY, default: !entryPos });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Limpar flag de entrada DEPOIS de usar
        console.log('[HallDoHalliradoScene] Limpando window._playerEntryPos');
        window._playerEntryPos = null;
        
        // Criar divisória DEPOIS do player para ficar acima dele
        this.divisionLayer = this.map.createLayer('divisória', tilesets, 0, 0);
        if (this.divisionLayer) {
            this.divisionLayer.setDepth(10000); // Depth alto para ficar acima do player
        }
        
        // Aplicar estado das luzes (se já foram acesas antes, esconder sombra)
        if (this.lightsOn && this.shadowLayer) {
            this.shadowLayer.setVisible(false);
            console.log('[HallDoHalliradoScene] Sombra escondida - luzes já estavam acesas');
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
        
        // Restaurar hotbar se já tinha itens (sem mostrar)
        if (window._hotbarItems) {
            window._hotbarItems.forEach((item, idx) => {
                if (item) this.hotbar.setItem(idx, item);
            });
        }
        
        // Forçar hotbar a começar fechada (offscreen)
        if (this.hotbar) {
            this.hotbar.isOpen = false;
            // Mover slots e highlight para posição offscreen
            this.hotbar.slots.forEach(slot => slot.y = this.hotbar.offscreenY);
            this.hotbar.highlight.y = this.hotbar.offscreenY;
            if (this.hotbar.toggleButton) {
                this.hotbar.toggleButton.y = this.hotbar.offscreenY + this.hotbar.slotSize + 10;
            }
            // Atualizar posição dos sprites de itens
            this.hotbar.itemSprites.forEach((sprite, idx) => {
                if (sprite) {
                    const slot = this.hotbar.slots[idx];
                    sprite.y = slot.y + slot.height / 2;
                }
            });
        }
        
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
        console.log('[HallDoHalliradoScene] PosterIcon criado:', this.posterIcon ? 'SIM' : 'NÃO', 'Icon sprite:', this.posterIcon?.icon ? 'OK' : 'ERRO');
        
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
        
        console.log('[HallDoHalliradoScene] Interruptor criado em tile (16, 8) -> pixel:', switchX, switchY);
        
        // Porta para TcheScene (tiles 13, 8-9)
        const doorTcheX = 13 * tileSize + tileSize / 2;
        const doorTcheY = 8.5 * tileSize + 16; // Meio entre tiles 8 e 9
        
        this.doorToTche = this.add.zone(doorTcheX, doorTcheY, 32, 64); // Altura 64 para cobrir 2 tiles
        this.physics.world.enable(this.doorToTche);
        this.doorToTche.body.setImmovable(true);
        this.doorToTche.body.moves = false;
        
        // Ícone de interação para a porta TcheScene
        this.doorTcheIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.doorTcheIcon.offsetY = -40;
        
        console.log('[HallDoHalliradoScene] Porta para TcheScene criada em tiles (13, 8-9):', doorTcheX, doorTcheY);
        
        // Zonas de saída para voltar à Intro2Scene (portas no tile Y=19)
        // Criar uma zona no meio das duas portas
        const exitTileX = 19.5; // Meio entre tiles 19 e 20
        const exitTileY = 19;
        const exitX = exitTileX * tileSize + 16;
        const exitY = exitTileY * tileSize + tileSize / 2;
        
        this.exitZone = this.add.zone(exitX, exitY, 64, 32); // Largura 64 para cobrir 2 tiles
        this.physics.world.enable(this.exitZone);
        this.exitZone.body.setImmovable(true);
        this.exitZone.body.moves = false;
        
        console.log('[HallDoHalliradoScene] Zona de saída criada no meio em:', exitX, exitY);
        
        // Overlap para detectar saída
        this.physics.add.overlap(
            this.player,
            this.exitZone,
            () => this.exitToIntro2(),
            null,
            this
        );
        
        // Flag para evitar múltiplas transições
        this.isTransitioning = false;
        
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
        
        console.log('[HallDoHalliradoScene] Configurando ícones de interação...');
        
        // Adicionar ícones de interação ao array de objetos do mundo
        const posterIconObjects = [];
        if (this.posterIcon?.icon) {
            posterIconObjects.push(this.posterIcon.icon);
            console.log('[HallDoHalliradoScene] Poster icon adicionado');
        }
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
        
        const doorTcheIconObjects = [];
        if (this.doorTcheIcon?.icon) doorTcheIconObjects.push(this.doorTcheIcon.icon);
        if (this.doorTcheIcon?.pulse) doorTcheIconObjects.push(this.doorTcheIcon.pulse);
        
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
            ...mapIconObjects,
            ...doorTcheIconObjects
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
            
            // Debug: mostrar distância a cada 60 frames (~1 segundo)
            if (this.time.now % 1000 < 16) {
                console.log('[HallDoHalliradoScene] Distância ao poster:', distanceToPoster.toFixed(2), 'Player:', this.player.x.toFixed(0), this.player.y.toFixed(0), 'Poster:', this.wantedPoster.x.toFixed(0), this.wantedPoster.y.toFixed(0));
            }
            
            let posterIconVisible = false;
            if (distanceToPoster < 50) {
                // Mostrar ícone quando próximo
                posterIconVisible = true;
                this.currentInteractable = 'poster';
                
                if (!this.posterIcon.visible) {
                    console.log('[HallDoHalliradoScene] MOSTRANDO ícone do cartaz');
                    this.posterIcon.showAbove(this.wantedPoster);
                }
            } else {
                // Longe do poster
                posterIconVisible = false;
            }
            
            if (!posterIconVisible) {
                if (this.posterIcon.visible) {
                    this.posterIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do cartaz (longe)');
                }
                if (this.currentInteractable === 'poster') {
                    this.currentInteractable = null;
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
                listIconVisible = true;
                this.currentInteractable = 'list';
                
                if (!this.listIcon.visible) {
                    this.listIcon.showAbove(this.visitList);
                    console.log('[HallDoHalliradoScene] Mostrado ícone da lista');
                }
            }
            
            if (!listIconVisible) {
                if (this.listIcon.visible) {
                    this.listIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone da lista (longe)');
                }
                if (this.currentInteractable === 'list') {
                    this.currentInteractable = null;
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
                switchIconVisible = true;
                this.currentInteractable = 'switch';
                
                if (!this.switchIcon.visible) {
                    this.switchIcon.showAbove(this.lightSwitch);
                    console.log('[HallDoHalliradoScene] Mostrado ícone do interruptor');
                }
            }
            
            if (!switchIconVisible) {
                if (this.switchIcon.visible) {
                    this.switchIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do interruptor (longe)');
                }
                if (this.currentInteractable === 'switch') {
                    this.currentInteractable = null;
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
                mapIconVisible = true;
                this.currentInteractable = 'map';
                
                if (!this.mapIcon.visible) {
                    this.mapIcon.showAbove(this.factoryMap);
                    console.log('[HallDoHalliradoScene] Mostrado ícone do mapa');
                }
            }
            
            if (!mapIconVisible) {
                if (this.mapIcon.visible) {
                    this.mapIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone do mapa (longe)');
                }
                if (this.currentInteractable === 'map') {
                    this.currentInteractable = null;
                }
            }
            
            // Atualizar posição do ícone
            this.mapIcon.updatePosition();
        }
        
        // Interação com a porta para TcheScene
        if (!this.dialogue?.active && this.doorToTche && this.player) {
            const distanceToDoor = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.doorToTche.x, 
                this.doorToTche.y
            );
            
            let doorIconVisible = false;
            if (distanceToDoor < 50) {
                // Mostrar ícone quando próximo
                doorIconVisible = true;
                this.currentInteractable = 'doorTche';
                
                if (!this.doorTcheIcon.visible) {
                    this.doorTcheIcon.showAbove(this.doorToTche);
                    console.log('[HallDoHalliradoScene] Mostrado ícone da porta TcheScene');
                }
            }
            
            if (!doorIconVisible) {
                if (this.doorTcheIcon.visible) {
                    this.doorTcheIcon.hide();
                    console.log('[HallDoHalliradoScene] Escondido ícone da porta TcheScene (longe)');
                }
                if (this.currentInteractable === 'doorTche') {
                    this.currentInteractable = null;
                }
            }
            
            // Atualizar posição do ícone
            this.doorTcheIcon.updatePosition();
        }
        
        // Durante diálogo, apenas esconder ícones (manter currentInteractable)
        if (this.dialogue?.active) {
            if (this.posterIcon) this.posterIcon.hide();
            if (this.listIcon) this.listIcon.hide();
            if (this.switchIcon) this.switchIcon.hide();
            if (this.mapIcon) this.mapIcon.hide();
            if (this.doorTcheIcon) this.doorTcheIcon.hide();
        }
        
        // Lógica específica da cena pode ser adicionada aqui
    }
    
    handleInteraction() {
        super.handleInteraction();
        
        console.log('[HallDoHalliradoScene] handleInteraction chamado');
        console.log('[HallDoHalliradoScene] - currentInteractable:', this.currentInteractable);
        console.log('[HallDoHalliradoScene] - dialogue existe?', !!this.dialogue);
        console.log('[HallDoHalliradoScene] - dialogue ativo?', this.dialogue?.active);
        
        // Interação com o cartaz de procurado
        if (this.currentInteractable === 'poster') {
            console.log('[HallDoHalliradoScene] Executando readWantedPoster');
            this.readWantedPoster();
            return;
        }
        
        // Interação com a lista de visitação
        if (this.currentInteractable === 'list') {
            console.log('[HallDoHalliradoScene] Executando readVisitList');
            this.readVisitList();
            return;
        }
        
        // Interação com o interruptor
        if (this.currentInteractable === 'switch') {
            console.log('[HallDoHalliradoScene] Executando toggleLights');
            this.toggleLights();
            return;
        }
        
        // Interação com o mapa
        if (this.currentInteractable === 'map') {
            console.log('[HallDoHalliradoScene] Executando readFactoryMap');
            this.readFactoryMap();
            return;
        }
        
        // Interação com a porta para TcheScene
        if (this.currentInteractable === 'doorTche') {
            console.log('[HallDoHalliradoScene] Interagindo com a porta para TcheScene');
            this.openDoorToTche();
            return;
        }
        
        console.log('[HallDoHalliradoScene] Nenhuma interação válida');
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
        
        // Esconder controles
        this.hideVirtualControls();
        
        // Ligar luzes (só pode ligar, não desligar)
        this.lightsOn = true;
        window._hallLightsOn = true; // Salvar estado globalmente
        console.log('[HallDoHalliradoScene] Estado das luzes salvo:', window._hallLightsOn);
        
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
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        // Mostrar diálogo indicando a ação
        this.dialogue.show('Interruptor acionado. As luzes foram ligadas!', {
            disableSound: true
        });
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
        
        // Esconder controles
        this.hideVirtualControls();
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        // Mostrar diálogo
        this.dialogue.show('Lista de visitação da fábrica, Dr. Aris Thorne estava presente.', {
            disableSound: true
        });
    }
    
    /**
     * Lê o cartaz de procurado
     */
    readWantedPoster() {
        console.log('[HallDoHalliradoScene] === readWantedPoster INICIADO ===');
        console.log('[HallDoHalliradoScene] lightsOn:', this.lightsOn);
        
        // Verificar se está muito escuro
        if (!this.lightsOn) {
            console.log('[HallDoHalliradoScene] Muito escuro, mostrando mensagem');
            this.showDarkMessage();
            return;
        }
        
        console.log('[HallDoHalliradoScene] Escondendo ícone e controles');
        
        // Esconder ícone de interação
        if (this.posterIcon) {
            this.posterIcon.hide();
        }
        
        // Esconder controles
        this.hideVirtualControls();
        
        console.log('[HallDoHalliradoScene] Registrando callback');
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            console.log('[HallDoHalliradoScene] Callback de close executado');
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        console.log('[HallDoHalliradoScene] Mostrando diálogo:', 'Cartaz de procurado de um homem  chamado Ariel da Silva Coutinho');
        console.log('[HallDoHalliradoScene] dialogue objeto:', this.dialogue);
        console.log('[HallDoHalliradoScene] dialogue.show existe?', !!this.dialogue.show);
        
        // Mostrar diálogo
        this.dialogue.show('Cartaz de procurado de um homem  chamado Ariel da Silva Coutinho', {
            disableSound: true
        });
        
        console.log('[HallDoHalliradoScene] Diálogo mostrado, active:', this.dialogue.active);
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
        
        // Esconder controles
        this.hideVirtualControls();
        
        // Array de mensagens para o DialogueSystem
        const messages = [
            'É um mapa da fábrica',
            'Hall - Montagem',
            'Andar superior - Primeira lei da termodinâmica',
            'Sala 2 - Segunda lei da termodinâmica',
            'O resto do mapa está velho demais para ler.'
        ];
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        // Mostrar todas as mensagens em sequência
        this.dialogue.show(messages, {
            disableSound: true
        });
    }
    
    /**
     * Mostra mensagem quando está muito escuro para ler
     */
    showDarkMessage() {
        console.log('[HallDoHalliradoScene] === showDarkMessage CHAMADO ===');
        console.log('[HallDoHalliradoScene] dialogue existe?', !!this.dialogue);
        console.log('[HallDoHalliradoScene] dialogue.active?', this.dialogue?.active);
        
        // Esconder ícones
        if (this.posterIcon) {
            this.posterIcon.hide();
            console.log('[HallDoHalliradoScene] posterIcon escondido');
        }
        if (this.listIcon) {
            this.listIcon.hide();
            console.log('[HallDoHalliradoScene] listIcon escondido');
        }
        if (this.mapIcon) {
            this.mapIcon.hide();
            console.log('[HallDoHalliradoScene] mapIcon escondido');
        }
        
        // Esconder controles
        this.hideVirtualControls();
        console.log('[HallDoHalliradoScene] Controles virtuais escondidos');
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            console.log('[HallDoHalliradoScene] Callback: restaurando controles');
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        console.log('[HallDoHalliradoScene] Chamando dialogue.show()');
        
        // Mostrar diálogo
        this.dialogue.show('Está muito escuro, não consigo ler.', {
            disableSound: true
        });
        
        console.log('[HallDoHalliradoScene] dialogue.show() chamado, active agora:', this.dialogue.active);
    }
    
    /**
     * Volta para Intro2Scene pela porta especificada
     * @param {string} exit - 'left' ou 'right'
     */
    exitToIntro2() {
        // Evitar múltiplas transições
        if (this.isTransitioning) {
            console.log('[HallDoHalliradoScene] Já está em transição, ignorando');
            return;
        }
        
        this.isTransitioning = true;
        
        console.log('[HallDoHalliradoScene] === SAINDO PARA INTRO2SCENE ===');
        
        // Spawn no meio das portas da Intro2Scene
        // Portas estão em tiles (14,3) e (15,3), spawn no meio entre elas
        window._playerEntryPos = { x: 14.5 * 32 + 16, y: 4 * 32 + 16 }; // tile 14.5,4 (meio)
        
        console.log('[HallDoHalliradoScene] Definindo window._playerEntryPos (meio):', window._playerEntryPos);
        
        // Não iniciar cutscene ao voltar
        window._startCutscene = false;
        
        // Fade out
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.time.delayedCall(500, () => {
            console.log('[HallDoHalliradoScene] Iniciando Intro2Scene');
            this.scene.start('Intro2Scene');
        });
    }
    
    /**
     * Abrir porta para TcheScene
     */
    openDoorToTche() {
        console.log('[HallDoHalliradoScene] openDoorToTche chamado');
        console.log('[HallDoHalliradoScene] lightsOn:', this.lightsOn);
        
        // Esconder ícone de interação
        if (this.doorTcheIcon) {
            this.doorTcheIcon.hide();
        }
        
        // Verificar se as luzes estão apagadas
        if (!this.lightsOn) {
            console.log('[HallDoHalliradoScene] Luzes apagadas - muito escuro');
            
            // Esconder controles
            this.hideVirtualControls();
            
            // Registrar callback para restaurar controles
            this.dialogue.onCloseCallback = () => {
                this.showVirtualControls();
                this.dialogue.onCloseCallback = null;
            };
            
            // Mostrar mensagem
            this.dialogue.show('Não consigo encontrar a fechadura, está muito escuro.', {
                disableSound: true
            });
            return;
        }
        
        // Luzes ligadas - permitir transição
        console.log('[HallDoHalliradoScene] Luzes ligadas - abrindo porta para TcheScene');
        
        // Esconder controles antes da transição
        this.hideVirtualControls();
        
        if (this.isTransitioning) {
            console.log('[HallDoHalliradoScene] Já está em transição, ignorando');
            return;
        }
        
        this.isTransitioning = true;
        
        // Salvar posição de entrada na TcheScene (meio entre tiles 17 e 18, linha 24 - um tile à frente)
        window._playerEntryPos = {
            x: 17.5 * 32 + 16,
            y: 24 * 32 + 16
        };
        
        console.log('[HallDoHalliradoScene] Definindo window._playerEntryPos para TcheScene:', window._playerEntryPos);
        
        // Fade out
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.time.delayedCall(500, () => {
            console.log('[HallDoHalliradoScene] Iniciando TcheScene');
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
