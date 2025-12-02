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
        
        // Carregar sprites de itens
        this.load.image('privadacrowbar', 'assets/tilesets/privadacrowbar.png');
        this.load.image('crowbar', 'assets/sprites/blackcrowbar.png');
        this.load.image('blackcrowbar', 'assets/sprites/blackcrowbar.png');
    }

    create() {
        console.log('[TcheScene] Criando cena do mapa Tche');
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        this.lightsOn = false; // Começar com luzes apagadas (muito escuro)
        this.crowbarTaken = window._tcheCrowbarTaken || false;
        this.hasCrowbar = false;
        
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
        if (this.salaLayer) {
            this.salaLayer.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão nos objetos do banheiro (tiles específicos)
        if (this.banheiroLayer) {
            // Tiles do banheiro que precisam de colisão
            // 6781-6789: objetos do banheiro (pia, vaso, etc)
            // 6778-6780: acessórios
            // 6784-6786: chuveiro/box
            const bathroomTiles = [6781, 6782, 6783, 6784, 6785, 6786, 6787, 6788, 6789, 6778, 6779, 6780];
            this.banheiroLayer.setCollision(bathroomTiles);
            console.log('[TcheScene] Colisão configurada para tiles do banheiro:', bathroomTiles);
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
        
        // Definir depth do player como Y + 1
        this.player.setDepth(this.player.y + 1);
        
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
        if (this.salaLayer) {
            this.physics.add.collider(this.player, this.salaLayer);
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
        
        // Crowbar no tile (26, 13)
        const tileSize = 32;
        const crowbarTileX = 26;
        const crowbarTileY = 13;
        const crowbarX = crowbarTileX * tileSize + tileSize / 2;
        const crowbarY = crowbarTileY * tileSize + tileSize / 2;
        
        // Criar sprite da crowbar apenas se não foi pega ainda
        if (!this.crowbarTaken) {
            this.crowbarSprite = this.physics.add.sprite(crowbarX, crowbarY, 'privadacrowbar')
                .setImmovable(true)
                .setDepth(crowbarY); // Depth baseado no Y (player tem Y + 1)
            this.physics.add.collider(this.player, this.crowbarSprite);
            
            // Ícone de interação para a crowbar
            this.crowbarIcon = new InteractionIcon(this, 'button_a', 0.05);
            this.crowbarIcon.offsetY = -40;
            
            console.log('[TcheScene] Crowbar criada em tile (26, 13):', crowbarX, crowbarY);
        } else {
            console.log('[TcheScene] Crowbar já foi pega anteriormente');
        }
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, this.map);
        
        // Zona de transição para HallDoHalliradoScene (tiles 17,23 ao 18,23)
        const exitTileX = 17.5; // Meio entre tiles 17 e 18
        const exitTileY = 23;
        const exitX = exitTileX * tileSize + 16;
        const exitY = exitTileY * tileSize + tileSize / 2;
        
        this.exitZoneHall = this.add.zone(exitX, exitY, 64, 32); // Largura 64 para cobrir 2 tiles
        this.physics.world.enable(this.exitZoneHall);
        this.exitZoneHall.body.setImmovable(true);
        this.exitZoneHall.body.moves = false;
        
        console.log('[TcheScene] Zona de saída para Hall criada em tiles (17-18, 23):', exitX, exitY);
        
        // Flag para transição
        this.canTransition = false;
        this.time.delayedCall(1000, () => {
            this.canTransition = true;
        });
        
        // Overlap para detectar saída para Hall
        this.physics.add.overlap(
            this.player,
            this.exitZoneHall,
            this.onEnterExitZoneHall,
            null,
            this
        );
        
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
        
        // Adicionar ícone da crowbar aos worldObjects se existir
        const crowbarIconObjects = [];
        if (this.crowbarIcon?.icon) crowbarIconObjects.push(this.crowbarIcon.icon);
        if (this.crowbarIcon?.pulse) crowbarIconObjects.push(this.crowbarIcon.pulse);
        
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
            this.adornoLayer,
            ...crowbarIconObjects
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
        
        // Atualizar depth do player baseado no Y
        if (this.player) {
            this.player.setDepth(this.player.y + 1);
        }
        
        if (this.dialogue?.active) return;
        
        this.coordProbe.update();
        
        // Interação com crowbar
        if (!this.crowbarTaken && this.crowbarSprite && this.player) {
            const distanceToCrowbar = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.crowbarSprite.x,
                this.crowbarSprite.y
            );
            
            if (distanceToCrowbar < 50) {
                this.crowbarIcon.showAbove(this.crowbarSprite);
                this.currentInteractable = 'crowbar';
            } else {
                if (this.currentInteractable === 'crowbar') {
                    this.crowbarIcon.hide();
                    this.currentInteractable = null;
                }
            }
            
            this.crowbarIcon.updatePosition();
        }
    }
    
    /**
     * Método de interação com objetos
     */
    handleInteraction() {
        super.handleInteraction();
        
        console.log('[TcheScene] handleInteraction chamado');
        console.log('[TcheScene] - currentInteractable:', this.currentInteractable);
        
        // Interação com crowbar
        if (this.currentInteractable === 'crowbar') {
            console.log('[TcheScene] Pegando crowbar');
            this.pickupCrowbar();
            return;
        }
    }
    
    /**
     * Pegar crowbar com animação estilo Zelda
     */
    pickupCrowbar() {
        if (this.crowbarTaken || !this.crowbarSprite) return;
        
        console.log('[TcheScene] PEGANDO CROWBAR - Estado inicial:', {
            hotbarExists: !!this.hotbar,
            hasCrowbar: this.hasCrowbar
        });
        
        // Marcar como pega
        this.crowbarTaken = true;
        window._tcheCrowbarTaken = true;
        
        // Esconder ícone
        if (this.crowbarIcon) {
            this.crowbarIcon.hide();
        }
        
        // Limpar currentInteractable para não bloquear a hotbar
        this.currentInteractable = null;
        
        // Animação Zelda ao pegar crowbar
        this.playCrowbarPickupAnimation(() => {
            this.hasCrowbar = true;
            console.log('[TcheScene] Crowbar obtida!');
            
            // Adicionar à hotbar
            if (this.hotbar) {
                const nextSlot = this.hotbar.items.findIndex(i => i === null);
                this.hotbar.setItem(nextSlot !== -1 ? nextSlot : 0, 'crowbar');
                
                // Salvar hotbar
                window._hotbarItems = [...this.hotbar.items];
                
                // Garantir que o diálogo não está ativo
                if (this.dialogue) {
                    this.dialogue.active = false;
                }
                
                // Fazer a seta aparecer e dar um pulinho para chamar atenção
                if (this.hotbar.toggleButton) {
                    // Posição normal da seta (quando hotbar está fechada/offscreen)
                    const normalY = this.scene.scale.height - 30;
                    
                    // Animar seta aparecendo de baixo para cima e depois pulando
                    this.tweens.add({
                        targets: this.hotbar.toggleButton,
                        y: normalY,
                        duration: 300,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            // Depois de aparecer, fazer pulinho
                            this.tweens.add({
                                targets: this.hotbar.toggleButton,
                                y: normalY - 15,
                                duration: 250,
                                yoyo: true,
                                repeat: 1,
                                ease: 'Sine.easeInOut'
                            });
                        }
                    });
                }
                
                console.log('[TcheScene] Hotbar atualizada, estado:', {
                    items: this.hotbar.items,
                    visible: this.hotbar.container?.visible,
                    suppressed: this.hotbar.isSuppressed
                });
            }
        });
    }
    
    /**
     * Animação estilo Zelda ao pegar crowbar
     */
    playCrowbarPickupAnimation(onComplete) {
        console.log('[TcheScene] INICIANDO animação pickup');
        let completed = false;
        const finish = () => {
            if (!completed) {
                completed = true;
                console.log('[TcheScene] FINALIZANDO animação, chamando callback');
                onComplete && onComplete();
            }
        };
        
        try {
            const startX = this.crowbarSprite.x;
            const startY = this.crowbarSprite.y - 8;
            console.log('[TcheScene] Criando sprite temporário em:', { x: startX, y: startY });
            
            // Esconder sprite original
            this.crowbarSprite.setVisible(false);
            
            const temp = this.add.image(startX, startY, 'blackcrowbar')
                .setDepth(startY + 200);
            temp.setScale(1.2).setAlpha(0);
            
            this.tweens.add({
                targets: temp,
                alpha: 1,
                y: startY - 40,
                duration: 300,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: temp,
                        x: this.player.x,
                        y: this.player.y - 50,
                        scale: 0.8,
                        duration: 320,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            this.tweens.add({
                                targets: temp,
                                alpha: 0,
                                scaleX: 0.2,
                                scaleY: 0.2,
                                duration: 220,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    console.log('[TcheScene] Destruindo sprites');
                                    temp.destroy();
                                    if (this.crowbarSprite) {
                                        this.crowbarSprite.destroy();
                                        this.crowbarSprite = null;
                                    }
                                    finish();
                                }
                            });
                        }
                    });
                }
            });
            
            this.time.delayedCall(1500, finish);
        } catch (e) {
            console.error('[TcheScene] Erro na animação:', e);
            finish();
        }
    }
    
    /**
     * Callback quando player entra na zona de saída para HallDoHalliradoScene
     */
    onEnterExitZoneHall() {
        if (!this.canTransition) return;
        
        console.log('[TcheScene] Player entrou na zona de saída para Hall');
        this.canTransition = false;
        
        // Salvar posição de entrada no Hall (tile 13, 10)
        window._playerEntryPos = {
            x: 13 * 32 + 16,
            y: 10 * 32 + 16
        };
        
        // Fade out e transição
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('HallDoHalliradoScene');
        });
    }
    
    /**
     * Interagir com objetos (porta)
     */
    interact() {
        if (this.currentInteractable === this.interactiveDoor) {
            console.log('[TcheScene] Interagindo com a porta');
            
            // Verificar se as luzes estão ligadas
            if (this.lightsOn) {
                console.log('[TcheScene] Luzes ligadas - transição permitida');
                
                // Salvar posição de entrada no Hall (tile 13, 10)
                window._playerEntryPos = {
                    x: 13 * 32 + 16,
                    y: 10 * 32 + 16
                };
                
                // Fade out e transição
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('HallDoHalliradoScene');
                });
            } else {
                console.log('[TcheScene] Luzes apagadas - muito escuro');
                this.dialogue.showMessage('Não consigo encontrar a fechadura, está muito escuro.');
            }
        }
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
