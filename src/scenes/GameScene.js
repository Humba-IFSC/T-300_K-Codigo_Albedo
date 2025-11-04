import { BaseScene } from './BaseScene.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';
import { addItemToInventory, getInventory } from '../systems/items/itemUtils.js';
import { useCrowbar } from '../systems/items/crowbar.js';
import { createDoor, setupDoorInteraction } from '../systems/items/doorUtils.js';
import { useKey } from '../systems/items/key.js';
import { PushableObjectManager } from '../systems/items/PushableObject.js';

export default class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    openKeyChest() {
        this.keyChest.setFrame(1);
        this.keyChestOpened = true;
        window._keyChestOpened = true;
        // Adiciona chave ao inventário
        const inventory = getInventory();
        addItemToInventory(inventory, 'key');
        if (this.hotbar) {
            const nextSlot = this.hotbar.items.findIndex(i => i === null);
            this.hotbar.setItem(nextSlot !== -1 ? nextSlot : 1, 'key'); // 'key' corresponde ao nome do sprite key.png
            this.hotbar.showAnimated();
        }
    this.chestIcon.hide();
    }

    preload() {
        super.preload();
        this.load.image('tiles', 'assets/tilesets/tileset.png');
        this.load.tilemapTiledJSON('map_generated', 'assets/maps/map_generated.json');
        this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('npc', 'assets/sprites/npc.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('chest', 'assets/tilesets/chest2.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('door', 'assets/sprites/Basic_Door_Pixel.png');
        // Itens
    this.load.image('crowbar', 'assets/sprites/blackcrowbar.png');
    this.load.image('blackcrowbar', 'assets/sprites/blackcrowbar.png');
    this.load.image('box', 'assets/sprites/wooden_box1.png');
    this.load.image('key', 'assets/sprites/key.png');
    }

    create() {
        // Restaura ponte aberta
        this.bridgeOpened = window._bridgeOpened || false;
        if (this.bridgeOpened) {
            this.openBridge();
        }
        // Mapa (tolerante a mapas com 1 ou 2 camadas)
        const tileSize = 32;
        const map = this.make.tilemap({ key: 'map_generated' });
        this.map = map;
            // Restaura tiles modificados, se existirem
            let layer = map.getLayer('Camada de Blocos 1')?.tilemapLayer;
            if (window._tileChanges && typeof window._tileChanges === 'object' && layer) {
                for (const key in window._tileChanges) {
                    const [x, y] = key.split(',').map(Number);
                    layer.putTileAt(window._tileChanges[key], x, y);
                }
            }
            // Ponte: sempre desenha diretamente na camada se marcada como aberta
            if (window._bridgeOpened && layer) {
                const x1 = 13, x2 = 16, y1 = 3, y2 = 5;
                const leftBorderX = 12;
                const rightBorderX = 17;
                for (let x = x1; x <= x2; x++) {
                    for (let y = y1; y <= y2; y++) {
                        layer.putTileAt(15, x, y);
                    }
                }
                if (leftBorderX >= 0) {
                    for (let y = y1; y <= y2; y++) {
                        layer.putTileAt(14, leftBorderX, y);
                    }
                }
                if (rightBorderX < map.width) {
                    for (let y = y1; y <= y2; y++) {
                        layer.putTileAt(16, rightBorderX, y);
                    }
                }
            }
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
    // Se existe posição salva, usa ela; senão, usa padrão
    const entryPos = window._playerEntryPos;
    const px = entryPos?.x ?? 481;
    const py = entryPos?.y ?? 350;
    this.createCommonPlayer(px, py);
    if (walls) this.physics.add.collider(this.player, walls);

        // NPC
        this.npc = this.physics.add.sprite(400, 290, 'npc', 1).setImmovable(true);
        this.physics.add.collider(this.player, this.npc);

    // Porta teleportadora (tile 22, 11)
    const doorTileX = 22, doorTileY = 11; // Tile escolhido conforme probe
    const doorX = doorTileX * tileSize + tileSize/2;
    const doorY = doorTileY * tileSize + tileSize/2;
    this.teleportDoor = createDoor(this, doorX, doorY);
    this.teleportDoor.setData('unlocked', false); // Porta começa trancada
    this.physics.add.collider(this.player, this.teleportDoor);
    // Não usa mais overlap para teleporte

        // UI de interação - Ícones sobre objetos (bem menores)
        this.npcIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.chestIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.keyChestIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.doorIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.boxIcon = new InteractionIcon(this, 'button_a', 0.05);

        // Alinha todos os ícones mais próximos dos objetos
        this.chestIcon.offsetY = -40;
        this.keyChestIcon.offsetY = -40;
        this.npcIcon.offsetY = -40;  // NPC é mais alto, ajuste extra
        this.doorIcon.offsetY = -40;
        this.boxIcon.offsetY = -40;

        // Sistemas compartilhados
        this.createDialogueSystem();
        // Hotbar persistente entre cenas
        this.createHotbar();
        if (window._hotbarItems) {
            window._hotbarItems.forEach((item, idx) => {
                if (item) this.hotbar.setItem(idx, item);
            });
        }
        this.hasCrowbar = false;

        // Probe de coordenadas
        this.coordProbe = new CoordProbe(this, map);

    // Baú da crowbar
    const chestTileX = 14, chestTileY = 2;
    const chestX = chestTileX * tileSize + tileSize/2;
    const chestY = chestTileY * tileSize + tileSize/2;
    this.chest = this.physics.add.sprite(chestX, chestY, 'chest', 0).setImmovable(true);
    this.physics.add.collider(this.player, this.chest);
    // Persistência do baú da crowbar
    this.chestOpened = window._chestOpened || false;
    if (this.chestOpened) {
        this.chest.setFrame(1);
        this.chestIcon?.hide();
    }

    // Baú da chave
    const keyChestTileX = 16, keyChestTileY = 15;
    const keyChestX = keyChestTileX * tileSize + tileSize/2;
    const keyChestY = keyChestTileY * tileSize + tileSize/2;
    this.keyChest = this.physics.add.sprite(keyChestX, keyChestY, 'chest', 0)
        .setImmovable(true)
        .setScale(1); // Garante tamanho normal
    this.physics.add.collider(this.player, this.keyChest);
    this.keyChestOpened = window._keyChestOpened || false;
    if (this.keyChestOpened) {
        this.keyChest.setFrame(1);
    }

        // Caixas quebráveis
        this.boxes = this.physics.add.staticGroup();
        const boxPositions = [
            { x: 560, y: 350 },
            { x: 592, y: 350 },
            { x: 624, y: 350 }
        ];
        // Persistência das caixas quebradas (por posição)
        const brokenBoxes = window._brokenBoxes || [];
        boxPositions.forEach((p) => {
            const key = `${p.x},${p.y}`;
            if (!brokenBoxes.includes(key)) {
                const b = this.boxes.create(p.x, p.y, 'box');
                b.setData('breakable', true);
            }
        });
        this.physics.add.collider(this.player, this.boxes);

        // Sistema de objetos empurráveis estilo Zelda
        this.pushableManager = new PushableObjectManager(this, this.player);
        
        // Criar alguns blocos empurráveis de exemplo
        // Você pode adicionar mais objetos conforme necessário
        const pushableBlock1 = this.pushableManager.addObject(450, 200, 'box', {
            pushSpeed: 60,
            pushDistance: 32,
            onPushStart: (obj, direction) => {
                console.log(`Empurrando bloco para ${direction}`);
            },
            onPushEnd: (obj, direction) => {
                console.log(`Bloco parou em (${obj.sprite.x}, ${obj.sprite.y})`);
            }
        });
        
        // Adicionar colisão dos objetos empurráveis com paredes
        if (walls) {
            this.pushableManager.objects.forEach(obj => {
                this.physics.add.collider(obj.sprite, walls);
            });
        }
        
        // Adicionar colisão dos objetos empurráveis com caixas quebráveis
        if (this.boxes) {
            this.pushableManager.objects.forEach(obj => {
                this.physics.add.collider(obj.sprite, this.boxes, (pushableSprite, boxSprite) => {
                    // Quando colidir, parar o movimento do objeto empurrável
                    if (obj.isPushing) {
                        console.log('[GameScene] Caixa empurrável colidiu com caixa quebrável');
                        obj.sprite.setVelocity(0);
                        obj.isPushing = false;
                        obj.pusher = null;
                        obj.pushDirection = null;
                    }
                });
            });
        }
        
        // Adicionar colisão dos objetos empurráveis com baús
        this.pushableManager.objects.forEach(obj => {
            // Colisão com baú da crowbar
            if (this.chest) {
                this.physics.add.collider(obj.sprite, this.chest, () => {
                    if (obj.isPushing) {
                        console.log('[GameScene] Caixa empurrável colidiu com baú');
                        obj.sprite.setVelocity(0);
                        obj.isPushing = false;
                        obj.pusher = null;
                        obj.pushDirection = null;
                    }
                });
            }
            
            // Colisão com baú da chave
            if (this.keyChest) {
                this.physics.add.collider(obj.sprite, this.keyChest, () => {
                    if (obj.isPushing) {
                        console.log('[GameScene] Caixa empurrável colidiu com baú da chave');
                        obj.sprite.setVelocity(0);
                        obj.isPushing = false;
                        obj.pusher = null;
                        obj.pushDirection = null;
                    }
                });
            }
        });
        
        // Adicionar colisão entre objetos empurráveis (para não se atravessarem)
        for (let i = 0; i < this.pushableManager.objects.length; i++) {
            for (let j = i + 1; j < this.pushableManager.objects.length; j++) {
                const obj1 = this.pushableManager.objects[i];
                const obj2 = this.pushableManager.objects[j];
                this.physics.add.collider(obj1.sprite, obj2.sprite, () => {
                    // Parar ambos os objetos se estiverem se empurrando
                    if (obj1.isPushing) {
                        console.log('[GameScene] Caixa empurrável colidiu com outra caixa empurrável');
                        obj1.sprite.setVelocity(0);
                        obj1.isPushing = false;
                        obj1.pusher = null;
                        obj1.pushDirection = null;
                    }
                    if (obj2.isPushing) {
                        obj2.sprite.setVelocity(0);
                        obj2.isPushing = false;
                        obj2.pusher = null;
                        obj2.pushDirection = null;
                    }
                });
            }
        }

        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1);
        if (this.map) worldCam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        worldCam.roundPixels = true;

        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        // Incluir sprites dos objetos empurráveis e ícones de interação na lista de objetos do mundo
        const pushableSprites = this.pushableManager ? this.pushableManager.objects.map(obj => obj.sprite) : [];
        const pushableIcon = this.pushableManager ? this.pushableManager.grabIcon.icon : null;
        const interactionIcons = [
            this.npcIcon.icon,
            this.chestIcon.icon,
            this.keyChestIcon.icon,
            this.doorIcon.icon,
            this.boxIcon.icon,
            pushableIcon
        ];
        const worldObjects = [this.player, this.npc, this.chest, this.keyChest, this.teleportDoor, ...this.boxes.getChildren(), ...pushableSprites, ...interactionIcons, floor, walls].filter(Boolean);
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
        
        // Atualizar sistema de objetos empurráveis
        if (this.pushableManager) {
            this.pushableManager.update();
        }

        // RESETAR currentInteractable no INÍCIO do update
        this.currentInteractable = null;

        // Interação com NPC
        const distanceToNpc = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
        let npcIconVisible = false;
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
                this.npcIcon.showAbove(this.npc);
                npcIconVisible = true;
                this.currentInteractable = 'npc';
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.startNpcDialogue();
                }
            }
        }
        if (!npcIconVisible) this.npcIcon.hide();

        // Interação com Baú da crowbar
        if (!this.chestOpened) {
            const distChest = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.chest.x, this.chest.y);
            if (distChest < 40) {
                this.chestIcon.showAbove(this.chest);
                this.currentInteractable = 'chest';
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.openChest();
                }
            } else {
                this.chestIcon.hide();
            }
        } else {
            this.chestIcon.hide();
        }

        // Interação com Baú da chave
        if (!this.keyChestOpened) {
            const distKeyChest = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.keyChest.x, this.keyChest.y);
            if (distKeyChest < 40) {
                this.keyChestIcon.showAbove(this.keyChest);
                this.currentInteractable = 'keyChest';
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.openKeyChest();
                }
            } else {
                this.keyChestIcon.hide();
            }
        } else {
            this.keyChestIcon.hide();
        }

        // Interação com caixas: só se tiver crowbar e ela estiver selecionada
        let boxIconVisible = false;
        if (this.hasCrowbar && this.boxes) {
            const selectedItem = this.hotbar.getSelectedItem();
            if (selectedItem === 'crowbar') {
                const boxesArr = this.boxes.getChildren();
                let nearest = null;
                let nearestDistSq = Infinity;
                const px = this.player.x, py = this.player.y;
                for (let i = 0; i < boxesArr.length; i++) {
                    const box = boxesArr[i];
                    const dx = box.x - px;
                    const dy = box.y - py;
                    const distSq = dx*dx + dy*dy;
                    if (distSq < nearestDistSq) {
                        nearestDistSq = distSq;
                        nearest = box;
                    }
                }
                if (nearest && nearestDistSq < 50*50) {
                    this.boxIcon.showAbove(nearest);
                    boxIconVisible = true;
                    this.currentInteractable = 'box';
                    this.nearestBox = nearest;
                    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                        useCrowbar(nearest);
                        // Salva caixa quebrada por posição
                        const key = `${nearest.x},${nearest.y}`;
                        window._brokenBoxes = window._brokenBoxes || [];
                        if (!window._brokenBoxes.includes(key)) window._brokenBoxes.push(key);
                    }
                }
            }
        }
        if (!boxIconVisible) this.boxIcon.hide();

        // Interação com porta teleportadora (apenas com ESPAÇO e chave)
        const distanceToDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.teleportDoor.x, this.teleportDoor.y);
        if (distanceToDoor < 50) {
            this.currentInteractable = 'door';
            if (!this.teleportDoor.getData('unlocked')) {
                this.doorIcon.showAbove(this.teleportDoor);
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    // Tenta usar chave
                    const inventory = getInventory();
                    if (useKey(this.teleportDoor, inventory)) {
                        this.doorIcon.hide();
                        this.handleDoorTeleport();
                    } else {
                        this.doorIcon.hide();
                        this.dialogue.show('Você precisa de uma chave para abrir esta porta!');
                    }
                }
            } else {
                this.doorIcon.showAbove(this.teleportDoor);
                if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                    this.handleDoorTeleport();
                }
            }
        } else {
            this.doorIcon.hide();
        }
        
        // Atualizar posição dos ícones visíveis
        this.npcIcon.updatePosition();
        this.chestIcon.updatePosition();
        this.keyChestIcon.updatePosition();
        this.doorIcon.updatePosition();
        this.boxIcon.updatePosition();
    }

    toggleCoordProbe(forceState) { this.coordProbe.toggle(forceState); }
    enableCoordProbe() { this.coordProbe.enable(); }
    disableCoordProbe() { this.coordProbe.disable(); }
    
    // Override dos métodos de BaseScene para interação com botões virtuais
    handleInteraction() {
        console.log('[GameScene] handleInteraction chamado, currentInteractable:', this.currentInteractable);
        
        // Se não há objeto interativo próximo, mostrar mensagem
        if (!this.currentInteractable) {
            console.log('[GameScene] Nenhum objeto interativo próximo');
            // Não fazer nada se não há nada próximo
            return;
        }
        
        // Executar interação baseada no objeto mais próximo
        if (this.currentInteractable === 'npc') {
            console.log('[GameScene] Iniciando diálogo com NPC');
            this.startNpcDialogue();
        } else if (this.currentInteractable === 'chest') {
            console.log('[GameScene] Abrindo baú');
            this.openChest();
        } else if (this.currentInteractable === 'keyChest') {
            console.log('[GameScene] Abrindo baú da chave');
            this.openKeyChest();
        } else if (this.currentInteractable === 'box' && this.nearestBox) {
            console.log('[GameScene] Quebrando caixa');
            useCrowbar(this.nearestBox);
            const key = `${this.nearestBox.x},${this.nearestBox.y}`;
            window._brokenBoxes = window._brokenBoxes || [];
            if (!window._brokenBoxes.includes(key)) window._brokenBoxes.push(key);
        } else if (this.currentInteractable === 'door') {
            console.log('[GameScene] Interagindo com porta');
            if (!this.teleportDoor.getData('unlocked')) {
                const inventory = getInventory();
                if (useKey(this.teleportDoor, inventory)) {
                    this.doorPrompt.hide();
                    this.handleDoorTeleport();
                } else {
                    this.doorPrompt.hide();
                    this.dialogue.show('Você precisa de uma chave para abrir esta porta!');
                }
            } else {
                this.handleDoorTeleport();
            }
        } else {
            console.log('[GameScene] Tipo de interação desconhecido:', this.currentInteractable);
        }
    }
    
    handleActionButton() {
        // Simula um press do botão (toggle) - ativa e desativa rapidamente
        console.log('[GameScene] Toggle do botão de segurar objeto');
        if (this.pushableManager) {
            // Ativa momentaneamente para simular um "press"
            this.pushableManager.setVirtualActionButton(true);
            // Agenda desativação no próximo frame para simular release
            this.time.delayedCall(50, () => {
                if (this.pushableManager) {
                    this.pushableManager.setVirtualActionButton(false);
                }
            });
        }
    }
    
    handleActionButtonRelease() {
        // Com toggle, não precisa fazer nada no release
        // O toggle já foi processado no handleActionButton
        console.log('[GameScene] Release do botão (ignorado com toggle)');
    }

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
        if (!this.map) return;
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
                window._tileChanges = window._tileChanges || {};
                window._tileChanges[`${x},${y}`] = 15;
            }
        }
        // 2. Coloca coluna de borda esquerda (tile 14) se dentro dos limites
        if (leftBorderX >= 0) {
            for (let y = y1; y <= y2; y++) {
                layer.putTileAt(14, leftBorderX, y);
                window._tileChanges = window._tileChanges || {};
                window._tileChanges[`${leftBorderX},${y}`] = 14;
            }
        }
        // 3. Coloca coluna de borda direita (tile 16)
        if (rightBorderX < this.map.width) {
            for (let y = y1; y <= y2; y++) {
                layer.putTileAt(16, rightBorderX, y);
                window._tileChanges = window._tileChanges || {};
                window._tileChanges[`${rightBorderX},${y}`] = 16;
            }
        }
        this.bridgeOpened = true;
        window._bridgeOpened = true;
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
        this.chestIcon.hide();
        window._chestOpened = true;

        // Adiciona crowbar ao inventário global na ordem
        const inventory = getInventory();
        addItemToInventory(inventory, 'crowbar');
        if (this.hotbar) {
            const nextSlot = this.hotbar.items.findIndex(i => i === null);
            this.hotbar.setItem(nextSlot !== -1 ? nextSlot : 0, 'crowbar');
            this.hotbar.showAnimated();
        }
        // Animação Zelda ao pegar crowbar
        this.playCrowbarPickupAnimation(() => {
            this.hasCrowbar = true;
            console.log('[GameScene] Crowbar obtida! Inventário:', getInventory());
        });
    }

    openKeyChest() {
        this.keyChest.setFrame(1);
        this.keyChestOpened = true;
        window._keyChestOpened = true;
        // Adiciona chave ao inventário
        const inventory = getInventory();
        addItemToInventory(inventory, 'key');
        if (this.hotbar) {
            const nextSlot = this.hotbar.items.findIndex(i => i === null);
            this.hotbar.setItem(nextSlot !== -1 ? nextSlot : 1, 'key');
            this.hotbar.showAnimated();
        }
        this.keyChestIcon.hide();
        this.dialogue.show('Você encontrou uma chave!');
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
            if (!this.worldObjects.includes(temp)) {
                this.worldObjects.push(temp);
                if (this.uiCamManager) {
                    this.uiCamManager.applyIgnores(this.cameras.main, this.getUIElements(), this.worldObjects);
                }
            }
            
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
                                    // Remove dos world objects e atualiza ignores
                                    const index = this.worldObjects.indexOf(temp);
                                    if (index !== -1) {
                                        this.worldObjects.splice(index, 1);
                                        if (this.uiCamManager) {
                                            this.uiCamManager.applyIgnores(this.cameras.main, this.getUIElements(), this.worldObjects);
                                        }
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
    handleDoorTeleport() {
    // Salva posição do player antes de trocar de cena
    window._playerEntryPos = { x: this.player.x, y: this.player.y };
    // Salva hotbar antes de trocar de cena
    if (this.hotbar) {
        window._hotbarItems = [...this.hotbar.items];
    }
    // Transição para SecondScene
    this.scene.start('SecondScene');
    }

    breakBox(box) {
        if (!box || !box.active) return;
    // Salva caixa quebrada por posição
    const key = `${box.x},${box.y}`;
    window._brokenBoxes = window._brokenBoxes || [];
    if (!window._brokenBoxes.includes(key)) window._brokenBoxes.push(key);
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
        const sprites = [this.player, this.npc, this.chest, this.teleportDoor].filter(Boolean);
        sprites.forEach(s => s.setDepth(s.y));
    }

}

