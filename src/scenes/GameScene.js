import { BaseScene } from './BaseScene.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { InteractionPrompt } from '../systems/ui/InteractionPrompt.js';

export default class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    preload() {
        super.preload();
        this.load.image('tiles', 'assets/tilesets/tileset.png');
        this.load.tilemapTiledJSON('map_generated', 'assets/maps/map_generated.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('npc', 'assets/sprites/npc.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('chest', 'assets/tilesets/chest2.png', { frameWidth: 32, frameHeight: 32 });
        // Itens
        this.load.image('crowbar', 'assets/sprites/blackcrowbar.png');
        this.load.image('blackcrowbar', 'assets/sprites/blackcrowbar.png');
        this.load.image('box', 'assets/sprites/wooden_box1.png');
    }

    create() {
        // Mapa (tolerante a mapas com 1 ou 2 camadas)
        const map = this.make.tilemap({ key: 'map_generated' });
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
        if (walls) {
            const waterIndices = [21];
            walls.setCollision(waterIndices);
        }
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Player
        this.createCommonPlayer(481, 350);
        if (walls) this.physics.add.collider(this.player, walls);

        // NPC
        this.npc = this.physics.add.sprite(400, 290, 'npc', 1).setImmovable(true);
        this.physics.add.collider(this.player, this.npc);

    // UI de interação
    this.interactionPrompt = new InteractionPrompt(this, { suffix: ' para falar' });
    this.boxPrompt = new InteractionPrompt(this, { suffix: ' para quebrar' });
    this.chestPrompt = new InteractionPrompt(this, { suffix: ' para abrir' });
    // Alinha todos os prompts na mesma altura
    this.chestPrompt.container.y = this.interactionPrompt.container.y;
    this.boxPrompt.container.y = this.interactionPrompt.container.y;

        // Sistemas compartilhados
        this.createDialogueSystem();
        this.createHotbar();
        this.hasCrowbar = false;

        // Probe de coordenadas
        this.coordProbe = new CoordProbe(this, map);

        // Baú
        const tileSize = 32;
        const chestTileX = 14, chestTileY = 2;
        const chestX = chestTileX * tileSize + tileSize/2;
        const chestY = chestTileY * tileSize + tileSize/2;
        this.chest = this.physics.add.sprite(chestX, chestY, 'chest', 0).setImmovable(true);
        this.physics.add.collider(this.player, this.chest);
        this.chestOpened = false;

        // Caixas quebráveis
        this.boxes = this.physics.add.staticGroup();
        const boxPositions = [
            { x: 560, y: 350 },
            { x: 592, y: 350 },
            { x: 624, y: 350 }
        ];
        boxPositions.forEach(p => {
            const b = this.boxes.create(p.x, p.y, 'box');
            b.setData('breakable', true);
        });
        this.physics.add.collider(this.player, this.boxes);

        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(2.5);
        if (this.map) worldCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        worldCam.roundPixels = true;

        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        const worldObjects = [this.player, this.npc, this.chest, ...this.boxes.getChildren(), floor, walls].filter(Boolean);
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

        // Interação com NPC
        const distanceToNpc = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
        let npcPromptVisible = false;
        if (distanceToNpc < 50) {
            const dx = this.npc.x - this.player.x;
            const dy = this.npc.y - this.player.y;
            const facing = this.movement.facing;
            let facingNpc = false;
            if (Math.abs(dx) > Math.abs(dy)) {
                facingNpc = (dx > 0 && facing === 'right') || (dx < 0 && facing === 'left');
            } else {
                facingNpc = (dy > 0 && facing === 'down') || (dy < 0 && facing === 'up');
            }
            if (facingNpc) {
                this.interactionPrompt.show();
                npcPromptVisible = true;
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.startNpcDialogue();
                }
            }
        }
        if (!npcPromptVisible) this.interactionPrompt.hide();

        // Interação com Baú (se ainda não aberto)
        if (!this.chestOpened) {
            const distChest = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.chest.x, this.chest.y);
            if (distChest < 40) {
                this.chestPrompt.show();
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.openChest();
                }
            } else {
                this.chestPrompt.hide();
            }
        } else {
            this.chestPrompt.hide();
        }

        // Interação com caixas: só se tiver crowbar e ela estiver selecionada
        let boxPromptVisible = false;
        if (this.hasCrowbar && this.boxes) {
            // Verifica se a crowbar está no slot selecionado
            const selectedItem = this.hotbar.getSelectedItem();
            if (selectedItem === 'crowbar') {
                let nearest = null;
                let nearestDist = 9999;
                this.boxes.getChildren().forEach(box => {
                    const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, box.x, box.y);
                    if (d < nearestDist) { nearestDist = d; nearest = box; }
                });
                if (nearest && nearestDist < 50) {
                    this.boxPrompt.show();
                    boxPromptVisible = true;
                    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                        this.breakBox(nearest);
                    }
                }
            }
        }
        if (!boxPromptVisible) this.boxPrompt.hide();
    }

    toggleCoordProbe(forceState) { this.coordProbe.toggle(forceState); }
    enableCoordProbe() { this.coordProbe.enable(); }
    disableCoordProbe() { this.coordProbe.disable(); }

    startNpcDialogue() {
    // Esconde hotbar (suprimindo sem destruir estado)
    this.hotbar.suppress();
    this._hotbarWasVisible = true; // marcamos que estava disponível antes

        // Virar NPC para player
        const dx = this.player.x - this.npc.x;
        const dy = this.player.y - this.npc.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            this.npc.setFrame(dx > 0 ? 7 : 4);
        } else {
            this.npc.setFrame(dy > 0 ? 1 : 10);
        }

        this.dialogue.show([
            'teste de dialogo',
            'segundo texto do dialogo',
            'Abra o tesouro monstruoso de todas as verdades irredutiveis e eternas',
        ]);

        // Quando fechar, mostrar hotbar novamente (polling simples no updateBase já libera movimento)
        const originalClose = this.dialogue.close.bind(this.dialogue);
        this.dialogue.close = () => {
            originalClose();
            // Retorna de supressão mas mantém escondida; jogador mostra ao escolher slot
            if (this._hotbarWasVisible) this.hotbar.unsuppress(false);
            // Abre ponte após primeiro diálogo
            this.openBridge();
        };
    }

    openBridge() {
        if (this.bridgeOpened || !this.map) return;
        const layer = this.map.getLayer('Camada de Blocos 1')?.tilemapLayer;
        if (!layer) return;
        // Região fixa solicitada: (13,3) até (16,5) inclusive (4x3 tiles)
        const x1 = 13, x2 = 16, y1 = 3, y2 = 5;
        // Bordas verticais externas solicitadas: esquerda em x=12, direita em x=17 (mesma faixa y).
        const leftBorderX = 12;
        const rightBorderX = 17;
        // 1. Preenche interior (13..16, 3..5) somente com grama (15)
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                layer.putTileAt(15, x, y);
            }
        }
        // 2. Coloca coluna de borda esquerda (tile 14) se dentro dos limites
        if (leftBorderX >= 0) {
            for (let y = y1; y <= y2; y++) layer.putTileAt(14, leftBorderX, y);
        }
        // 3. Coloca coluna de borda direita (tile 16)
        if (rightBorderX < this.map.width) {
            for (let y = y1; y <= y2; y++) layer.putTileAt(16, rightBorderX, y);
        }
        this.bridgeOpened = true;
    }

    _buildBridge() { /* método antigo não usado */ }

    openChest() {
        if (this.chestOpened) return;
        console.log('[GameScene] ABRINDO BAÚ - Estado inicial:', {
            hotbarExists: !!this.hotbar,
            hasCrowbar: this.hasCrowbar
        });
        
        this.chest.setFrame(1); // frame aberto
        this.chestOpened = true;
        this.chestPrompt.hide();
        
        // TESTE DIRETO: Adicionar item imediatamente para testar
        console.log('[GameScene] TESTE: Adicionando crowbar direto à hotbar');
        if (this.hotbar) {
            this.hotbar.setItem(0, 'crowbar');
            this.hotbar.showAnimated();
        }
        
        // Animação Zelda ao pegar crowbar
        this.playCrowbarPickupAnimation(() => {
            this.hasCrowbar = true;
            console.log('[GameScene] Crowbar obtida! Adicionando à hotbar...');
            
            // Adiciona crowbar ao slot 0 da hotbar (novamente para garantir)
            if (this.hotbar) {
                this.hotbar.setItem(0, 'crowbar');
                console.log('[GameScene] ✓ Crowbar adicionada com sucesso!');
            } else {
                console.error('[GameScene] ✗ Hotbar não encontrada');
            }
        });
    }
    playCrowbarPickupAnimation(onComplete) {
        console.log('[Crowbar Zelda] INICIANDO animação pickup');
        let completed = false;
        const finish = () => {
            if (!completed) {
                completed = true;
                if (this.hotbar) {
                    this.hotbar.showAnimated();
                }
                console.log('[Crowbar Zelda] FINALIZANDO animação, chamando callback');
                console.log('[Crowbar Zelda] Callback existe?', !!onComplete);
                onComplete && onComplete();
                console.log('[Crowbar Zelda] Callback executado!');
            }
        };
        try {
            const startX = this.chest.x;
            const startY = this.chest.y - 8;
            console.log('[Crowbar Zelda] Criando sprite temporário em:', { x: startX, y: startY });
            const temp = this.add.image(startX, startY, 'blackcrowbar').setDepth(startY + 200);
            temp.setScale(1.2).setAlpha(0);
            console.log('[Crowbar Zelda] Sprite criado:', { x: temp.x, y: temp.y, visible: temp.visible });
            
            // Adicionar aos world objects para que seja ignorado pela câmera UI
            this.worldObjects.push(temp);
            
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
                                    console.log('[Crowbar Zelda] Destruindo sprite temporário');
                                    // Remove dos world objects
                                    const index = this.worldObjects.indexOf(temp);
                                    if (index !== -1) {
                                        this.worldObjects.splice(index, 1);
                                    }
                                    temp.destroy();
                                    finish();
                                }
                            });
                        }
                    });
                }
            });
            this.time.delayedCall(1500, finish);
        } catch (e) {
            finish();
        }
    }
    breakBox(box) {
        if (!box || !box.active) return;
        this.tweens.add({
            targets: box,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            onComplete: () => { box.destroy(); }
        });
    }

    // Ordena depth de sprites principais por coordenada Y para simular perspectiva top-down
    sortDepths() {
        const sprites = [this.player, this.npc, this.chest].filter(Boolean);
        sprites.forEach(s => s.setDepth(s.y));
    }

}

