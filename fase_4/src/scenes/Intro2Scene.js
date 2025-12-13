import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';
import { InteractionIcon } from '../systems/ui/InteractionIcon.js';

/**
 * Intro2Scene - Segunda cena de introdução
 */
export default class Intro2Scene extends BaseScene {
    constructor() {
        super('Intro2Scene');
        this.cutsceneActive = false; // Inicializar flag
    }

    preload() {
        super.preload();
        
        // Carregar tilesets do mapa intro2
        this.load.image('tileset-grassland-grass', 'assets/tilesets/tileset-grassland-grass.png');
        this.load.image('tileset-grassland-water', 'assets/tilesets/tileset-grassland-water.png');
        this.load.image('tileset-grassland-paths', 'assets/tilesets/tileset-grassland-paths.png');
        this.load.image('Trees_animation', 'assets/tilesets/Trees_animation.png');
        this.load.image('[Base]BaseChip_pipo', 'assets/tilesets/Pipoya RPG Tileset 32x32/[Base]BaseChip_pipo.png');
        
        // Carregar o mapa intro2
        this.load.tilemapTiledJSON('intro2_map', 'assets/maps/intro2.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[Intro2Scene] Criando segunda cena de introdução');
        
        // Inicializar variáveis de estado
        this.currentInteractable = null;
        this.cutsceneActive = false;
        
        // Criar mapa com tratamento de erro
        try {
            const map = this.make.tilemap({ key: 'intro2_map' });
            
            if (!map) {
                console.error('[Intro2Scene] ERRO: Mapa intro2_map não foi carregado!');
                // Voltar para IntroScene em caso de erro
                this.time.delayedCall(100, () => {
                    this.scene.start('IntroScene');
                });
                return;
            }
            
            this.map = map;
            console.log('[Intro2Scene] Mapa carregado:', map.width, 'x', map.height);
            
            // Adicionar tilesets - baseado no intro2.json atualizado
            let grassTileset, waterTileset, treesTileset, pipoTileset, pathsTileset;
            
            try { 
                grassTileset = map.addTilesetImage('tileset-grassland-grass', 'tileset-grassland-grass'); 
            } catch(e) { 
                console.warn('[Intro2Scene] Tileset grass não encontrado:', e.message); 
            }
            
            try { 
                waterTileset = map.addTilesetImage('tileset-grassland-water', 'tileset-grassland-water'); 
            } catch(e) { 
                console.warn('[Intro2Scene] Tileset water não encontrado:', e.message); 
            }
            
            try { 
                treesTileset = map.addTilesetImage('Trees_animation', 'Trees_animation'); 
            } catch(e) { 
                console.warn('[Intro2Scene] Tileset trees não encontrado:', e.message); 
            }
            
            try { 
                pipoTileset = map.addTilesetImage('[Base]BaseChip_pipo', '[Base]BaseChip_pipo'); 
            } catch(e) { 
                console.warn('[Intro2Scene] Tileset pipo não encontrado:', e.message); 
            }
            
            try { 
                pathsTileset = map.addTilesetImage('tileset-grassland-paths', 'tileset-grassland-paths'); 
            } catch(e) { 
                console.warn('[Intro2Scene] Tileset paths não encontrado:', e.message); 
            }
        
        // Array com todos os tilesets
        const allTilesets = [
            grassTileset, 
            waterTileset, 
            treesTileset, 
            pipoTileset, 
            pathsTileset
        ].filter(Boolean);
        
        console.log('[Intro2Scene] Tilesets carregados:', allTilesets.length);
        
        // Criar camadas baseadas no intro2.json atualizado
        // Ordem de criação define o depth (z-index) - primeira camada fica atrás
        let floor = null;
        let caminhoeflores = null;
        let paredefabrica = null;
        let cerca = null;
        let decoracaofabrica = null;
        let troncos1 = null;
        let arvores = null;
        let troncos2 = null;
        
        // 1. Chão (base)
        if (map.getLayer('floor')) {
            floor = map.createLayer('floor', allTilesets, 0, 0);
        }
        
        // 2. Cerca (bem atrás)
        if (map.getLayer('Cerca')) {
            cerca = map.createLayer('Cerca', allTilesets, 0, 0);
        }
        
        // 3. Caminho e flores
        if (map.getLayer('caminhoeflores')) {
            caminhoeflores = map.createLayer('caminhoeflores', allTilesets, 0, 0);
        }
        
        // 4. Parede da fábrica
        if (map.getLayer('paredefabrica')) {
            paredefabrica = map.createLayer('paredefabrica', allTilesets, 0, 0);
        }
        
        // 5. Decoração da fábrica
        if (map.getLayer('decoracaofabrica')) {
            decoracaofabrica = map.createLayer('decoracaofabrica', allTilesets, 0, 0);
        }
        
        // 6. Troncos 1 (camada de baixo)
        if (map.getLayer('troncos1')) {
            troncos1 = map.createLayer('troncos1', allTilesets, 0, 0);
        }
        
        // 7. Árvores (na frente)
        if (map.getLayer('arvores')) {
            arvores = map.createLayer('arvores', allTilesets, 0, 0);
        }
        
        // 8. Troncos 2 (camada de cima)
        if (map.getLayer('troncos2')) {
            troncos2 = map.createLayer('troncos2', allTilesets, 0, 0);
        }
        
        // Configurar colisão com cerca
        if (cerca) {
            cerca.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com parede da fábrica
        if (paredefabrica) {
            paredefabrica.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com decoração da fábrica
        if (decoracaofabrica) {
            decoracaofabrica.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com troncos1
        if (troncos1) {
            troncos1.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com árvores - IMPORTANTE: todas as árvores precisam bloquear
        if (arvores) {
            // Configurar colisão com TODOS os tiles que não sejam vazios
            arvores.setCollisionByExclusion([-1, 0]);
            
            // Também configurar por propriedade se existir
            arvores.setCollisionByProperty({ collides: true });
            
            console.log('[Intro2Scene] Colisão configurada na camada de árvores');
        }
        
        // Configurar colisão com troncos2
        if (troncos2) {
            troncos2.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar limites do mundo
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Criar player - usar posição salva ou posição padrão (centro inferior)
        const entryPos = window._playerEntryPos;
        console.log('[Intro2Scene] window._playerEntryPos:', entryPos);
        
        const spawnX = entryPos?.x ?? (map.width / 2) * 32 + 16;
        const spawnY = entryPos?.y ?? (map.height - 2) * 32 + 16;
        
        console.log('[Intro2Scene] Spawn do player:', { x: spawnX, y: spawnY, default: !entryPos });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Verificar se deve iniciar cutscene
        // Só inicia se: 1) a flag _startCutscene estiver true E 2) a cutscene ainda não foi vista
        const shouldStartCutscene = (window._startCutscene || false) && !window._intro2CutsceneSeen;
        
        // Limpar flags temporárias
        console.log('[Intro2Scene] Limpando window._playerEntryPos');
        window._playerEntryPos = null;
        window._startCutscene = false;
        
        // Adicionar colisão do player com camadas colisíveis
        if (floor) {
            this.physics.add.collider(this.player, floor);
        }
        if (cerca) {
            this.physics.add.collider(this.player, cerca);
        }
        if (paredefabrica) {
            this.physics.add.collider(this.player, paredefabrica);
        }
        if (decoracaofabrica) {
            this.physics.add.collider(this.player, decoracaofabrica);
        }
        if (troncos1) {
            this.physics.add.collider(this.player, troncos1);
        }
        if (arvores) {
            this.physics.add.collider(this.player, arvores);
            console.log('[Intro2Scene] Collider player-arvores criado');
        }
        if (troncos2) {
            this.physics.add.collider(this.player, troncos2);
        }
        
        // Debug: verificar tiles com colisão
        if (arvores) {
            console.log('[Intro2Scene] Tiles na camada arvores:', arvores.layer.data.flat().filter(t => t.index > 0).length);
        }
        
        // Sistemas comuns (diálogo e hotbar - controles virtuais já foram criados no createCommonPlayer)
        this.createDialogueSystem();
        this.createHotbar();
        
        // Placa da fábrica (tile 16, 7)
        const tileSize = 32;
        const signTileX = 16;
        const signTileY = 7;
        const signX = signTileX * tileSize + tileSize / 2;
        const signY = signTileY * tileSize + tileSize / 2;
        
        // Criar zona invisível para a placa
        this.factorySign = this.add.zone(signX, signY, 32, 32);
        this.physics.world.enable(this.factorySign);
        this.factorySign.body.setImmovable(true);
        this.factorySign.body.moves = false;
        
        // Ícone de interação para a placa
        this.signIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.signIcon.offsetY = -40;
        
        console.log('[Intro2Scene] Placa criada em tile (16, 7) -> pixel:', signX, signY);
        console.log('[Intro2Scene] SignIcon criado:', this.signIcon ? 'SIM' : 'NÃO', 'Icon sprite:', this.signIcon?.icon ? 'OK' : 'ERRO');
        
        // Zona de transição para HallDoHalliradoScene - uma zona no meio das duas portas
        // Portas em tiles (14,3) e (15,3) - criar zona entre elas
        const hallTileX = 14.5; // Meio entre 14 e 15
        const hallTileY = 3;
        const hallX = hallTileX * tileSize + 16;
        const hallY = hallTileY * tileSize + tileSize / 2;
        
        this.hallEntrance = this.add.zone(hallX, hallY, 64, 32); // Largura 64 para cobrir 2 tiles
        this.physics.world.enable(this.hallEntrance);
        this.hallEntrance.body.setImmovable(true);
        this.hallEntrance.body.moves = false;
        
        // Ícone de interação para entrada do hall
        this.hallIcon = new InteractionIcon(this, 'button_a', 0.05);
        this.hallIcon.offsetY = -24;
        
        console.log('[Intro2Scene] Entrada do hall criada no meio em:', hallX, hallY);
        
        // CUTSCENE: Iniciar caminhada automática se a flag estiver setada
        console.log('[Intro2Scene] Verificando cutscene - shouldStartCutscene:', shouldStartCutscene);
        if (shouldStartCutscene) {
            this.startWalkingCutscene();
        } else {
            // Se não há cutscene, garantir que controles estão habilitados
            console.log('[Intro2Scene] SEM CUTSCENE - inicializando controles');
            this.cutsceneActive = false;
            if (this.player.body) {
                this.player.body.enable = true;
                this.player.body.setVelocity(0, 0);
            }
            
            // Garantir que controles virtuais estão visíveis
            this.time.delayedCall(100, () => {
                console.log('[Intro2Scene] Mostrando controles virtuais manualmente');
                if (this.virtualJoystick) {
                    this.virtualJoystick.show();
                    console.log('[Intro2Scene] Joystick mostrado');
                }
                if (this.virtualButtons) {
                    this.virtualButtons.show();
                    console.log('[Intro2Scene] Botões mostrados');
                }
                if (this.hotbar) {
                    this.hotbar.show();
                    console.log('[Intro2Scene] Hotbar mostrada');
                }
            });
            
            // Habilitar transição de volta imediatamente se não houver cutscene
            this.time.delayedCall(1000, () => {
                this.canTransitionBack = true;
                console.log('[Intro2Scene] Transição de volta habilitada (sem cutscene)');
            });
            console.log('[Intro2Scene] Cutscene não iniciada - controles habilitados');
        }
        
        // Probe de coordenadas (debug)
        this.coordProbe = new CoordProbe(this, map);
        
        // Câmera
        const worldCam = this.cameras.main;
        worldCam.startFollow(this.player);
        worldCam.setZoom(1.5); // Zoom maior para melhor visualização
        worldCam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        worldCam.roundPixels = true;
        
        // Fade in suave
        worldCam.fadeIn(500, 0, 0, 0);
        
        // Gerenciador de câmera de UI
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        
        // Adicionar ícones de interação ao array de objetos do mundo
        const signIconObjects = [];
        if (this.signIcon?.icon) signIconObjects.push(this.signIcon.icon);
        if (this.signIcon?.pulse) signIconObjects.push(this.signIcon.pulse);
        
        const hallIconObjects = [];
        if (this.hallIcon?.icon) hallIconObjects.push(this.hallIcon.icon);
        if (this.hallIcon?.pulse) hallIconObjects.push(this.hallIcon.pulse);
        
        const worldObjects = [
            this.player, 
            floor,
            caminhoeflores, 
            paredefabrica,
            cerca,
            decoracaofabrica,
            troncos1,
            arvores,
            troncos2,
            ...signIconObjects,
            ...hallIconObjects
        ].filter(Boolean);
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        worldCam.setRenderToTexture && worldCam.setRoundPixels && (worldCam._padding = 2);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[Intro2Scene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        // Criar zona de transição de VOLTA para IntroScene
        // Zona no tile vermelho/alaranjado (tile Y=18, próximo ao final do mapa)
        const transitionTileY = 18; // Tile fixo onde está o marcador vermelho
        const transitionY = transitionTileY * 32 + 16; // Centro do tile
        
        console.log('[Intro2Scene] Zona de transição no tile Y:', transitionTileY, 'px:', transitionY);
        
        this.transitionZoneBack = this.add.zone(
            map.widthInPixels / 2,
            transitionY,
            map.widthInPixels,
            32  // 1 tile de altura
        );
        this.physics.world.enable(this.transitionZoneBack);
        this.transitionZoneBack.body.setAllowGravity(false);
        this.transitionZoneBack.body.moves = false;
        
        // Flag para evitar transição imediata
        this.isTransitioningBack = false;
        this.canTransitionBack = false;
        
        // NÃO habilitar transição aqui - apenas após cutscene terminar
        // A transição será habilitada no método endWalkingCutscene()
        
        this.physics.add.overlap(
            this.player,
            this.transitionZoneBack,
            this.onReturnToIntro,
            null,
            this
        );
        
        } catch (error) {
            console.error('[Intro2Scene] ERRO ao criar cena:', error);
            // Em caso de erro, voltar para IntroScene
            this.time.delayedCall(100, () => {
                this.scene.start('IntroScene');
            });
        }
    }
    
    /**
     * Inicia a cutscene de caminhada automática até a fábrica
     * Segunda parte - continua da IntroScene
     */
    startWalkingCutscene() {
        console.log('[Intro2Scene] Continuando cutscene de caminhada - parte 2');
        
        // Desabilitar controles do jogador
        this.cutsceneActive = true;
        
        // Inicializar sistema de pular cutscene
        this.skipCutsceneHoldTime = 0;
        this.skipCutsceneRequired = 1000; // 1 segundo segurando (reduzido)
        this.isSkippingCutscene = false;
        this.skipInputConfigured = false; // Flag para evitar duplicação de listeners
        
        // Criar barras cinemáticas (letterbox)
        this.createCinematicBars();
        
        // Criar prompt de pular cutscene
        this.createSkipPrompt();
        
        // Esconder HUD durante cutscene
        console.log('[Intro2Scene] Escondendo controles virtuais...');
        
        if (this.virtualJoystick) {
            this.virtualJoystick.base.setVisible(false);
            this.virtualJoystick.stick.setVisible(false);
            this.virtualJoystick.disabled = true;
        }
        
        if (this.virtualButtons && this.virtualButtons.buttons) {
            this.virtualButtons.buttons.forEach(btn => {
                if (btn && btn.container) {
                    btn.container.setVisible(false);
                }
            });
        }
        
        if (this.hotbar && this.hotbar.allObjects) {
            this.hotbar.allObjects.forEach(obj => {
                obj.setDepth(-1000);
                obj.setAlpha(0);
            });
        }
        
        // IMPORTANTE: Desabilitar física do player para permitir movimento livre
        if (this.player.body) {
            this.player.body.setVelocity(0, 0);
            this.player.body.enable = false; // Desabilita colisões temporariamente
        }
        
        // Waypoints do caminho (do spawn Y=17 até a fábrica Y=8)
        // Mapa intro2 tem apenas 20 tiles de altura (0-19)
        // VIRAR PARA DIREITA LOGO NO INÍCIO
        const waypoints = [
            { x: 15 * 32 + 16, y: 17 * 32 + 16 }, // Vira para direita imediatamente (1 tile)
            { x: 15 * 32 + 16, y: 14 * 32 + 16 }, // Sobe pela direita
            { x: 15 * 32 + 16, y: 11 * 32 + 16 }, // Continuando
            { x: 15 * 32 + 16, y: 8 * 32 + 16 }   // Destino final (fábrica)
        ];
        
        this.currentWaypointIndex = 0;
        this.walkingWaypoints = waypoints;
        
        // Calcular velocidade para duração de ~8 segundos (bem mais rápido)
        const totalDistance = this.calculateTotalDistance(waypoints);
        this.cutsceneSpeed = totalDistance / 8000; // 8 segundos
        
        console.log('[Intro2Scene] Distância total:', totalDistance, 'Velocidade:', this.cutsceneSpeed);
        
        // Iniciar movimento para o primeiro waypoint
        this.moveToNextWaypoint();
    }
    
    /**
     * Calcula a distância total do caminho
     */
    calculateTotalDistance(waypoints) {
        let total = 0;
        let currentPos = { x: this.player.x, y: this.player.y };
        
        for (let waypoint of waypoints) {
            const dx = waypoint.x - currentPos.x;
            const dy = waypoint.y - currentPos.y;
            total += Math.sqrt(dx * dx + dy * dy);
            currentPos = waypoint;
        }
        
        return total;
    }
    
    /**
     * Move o player para o próximo waypoint
     */
    moveToNextWaypoint() {
        if (this.currentWaypointIndex >= this.walkingWaypoints.length) {
            // Cutscene finalizada
            this.endWalkingCutscene();
            return;
        }
        
        const waypoint = this.walkingWaypoints[this.currentWaypointIndex];
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, waypoint.x, waypoint.y);
        const duration = distance / this.cutsceneSpeed; // Duração baseada na velocidade
        
        console.log(`[Intro2Scene] Indo para waypoint ${this.currentWaypointIndex}: (${waypoint.x}, ${waypoint.y}), duração: ${duration}ms`);
        
        // Determinar direção da animação
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, waypoint.x, waypoint.y);
        let direction = 'down';
        
        if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
            direction = 'right';
        } else if (angle > Math.PI / 4 && angle <= 3 * Math.PI / 4) {
            direction = 'down';
        } else if (angle > 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) {
            direction = 'left';
        } else {
            direction = 'up';
        }
        
        // Tocar animação de caminhada
        if (this.player.anims) {
            this.player.anims.play(`walk-${direction}`, true);
        }
        
        // Criar tween para movimento suave
        this.tweens.add({
            targets: this.player,
            x: waypoint.x,
            y: waypoint.y,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.currentWaypointIndex++;
                this.moveToNextWaypoint();
            }
        });
    }
    
    /**
     * Finaliza a cutscene de caminhada
     */
    endWalkingCutscene() {
        console.log('[Intro2Scene] Cutscene finalizada');
        
        // Marcar cutscene como vista para não tocar novamente
        window._intro2CutsceneSeen = true;
        
        // Parar animação
        if (this.player.anims) {
            this.player.anims.stop();
        }
        
        // Reabilitar física do player
        if (this.player.body) {
            this.player.body.enable = true;
            this.player.body.setVelocity(0, 0);
        }
        
        // Reabilitar controles
        this.cutsceneActive = false;
        
        // Esconder e destruir prompt (caso ainda exista)
        if (this.skipPromptContainer) {
            this.skipPromptContainer.destroy();
            this.skipPromptContainer = null;
        }
        
        // Mostrar título "Fase 4: Máquina de entropia"
        this.showPhaseTitle();
        
        // Remover barras cinemáticas
        this.removeCinematicBars();
        
        // Aguardar o título terminar antes de mostrar o HUD
        // Título: 1s delay + 1.5s fade in + 3s show + 1.5s fade out = 7 segundos
        this.time.delayedCall(7000, () => {
            this.restoreHUD();
        });
    }
    
    /**
     * Restaura o HUD após a cutscene
     */
    restoreHUD() {
        // Mostrar HUD novamente
        console.log('[Intro2Scene] Mostrando HUD...');
        
        // Restaurar virtual joystick
        if (this.virtualJoystick) {
            this.virtualJoystick.base.setVisible(true);
            this.virtualJoystick.stick.setVisible(true);
            this.virtualJoystick.disabled = false;
            this.virtualJoystick.base.setAlpha(0.6);
            this.virtualJoystick.stick.setAlpha(0.8);
        }
        
        // Restaurar virtual buttons
        if (this.virtualButtons && this.virtualButtons.buttons) {
            this.virtualButtons.buttons.forEach(btn => {
                if (btn.container) {
                    btn.container.setVisible(true);
                    btn.container.setAlpha(1);
                }
            });
        }
        
        // Restaurar hotbar
        if (this.hotbar) {
            this.hotbar.show();
            if (this.hotbar.allObjects) {
                this.hotbar.allObjects.forEach(obj => {
                    obj.setVisible(true);
                    obj.setDepth(15000);
                    obj.setAlpha(1);
                });
            }
            // Restaurar elementos específicos da hotbar
            if (this.hotbar.toggleArrow) {
                this.hotbar.toggleArrow.setVisible(true);
                this.hotbar.toggleArrow.setAlpha(1);
                this.hotbar.toggleArrow.setDepth(15003);
            }
            if (this.hotbar.clickableArea) {
                this.hotbar.clickableArea.setVisible(true);
                this.hotbar.clickableArea.setAlpha(1);
                this.hotbar.clickableArea.setDepth(15002);
            }
        }
        
        console.log('[Intro2Scene] HUD restaurado completamente');
        
        // Restaurar alpha do DialogueSystem (foi forçado para 0 durante cutscene)
        if (this.dialogue) {
            if (this.dialogue.box) this.dialogue.box.setAlpha(0.6); // Alpha original
            if (this.dialogue.text) this.dialogue.text.setAlpha(1);
            if (this.dialogue.nextIcon) this.dialogue.nextIcon.setAlpha(1);
            console.log('[Intro2Scene] Alpha do diálogo restaurado');
        }
        
        // Forçar atualização dos ícones de interação - restaurar visibilidade
        this.time.delayedCall(100, () => {
            console.log('[Intro2Scene] Restaurando ícones de interação');
            
            // Restaurar signIcon se existir
            if (this.signIcon && this.signIcon.icon) {
                this.signIcon.icon.setAlpha(1);
                // A visibilidade será gerenciada pela lógica de proximidade
            }
            
            // Restaurar hallIcon se existir
            if (this.hallIcon && this.hallIcon.icon) {
                this.hallIcon.icon.setAlpha(1);
                // A visibilidade será gerenciada pela lógica de proximidade
            }
        });
        
        // HABILITAR A TRANSIÇÃO DE VOLTA após o HUD ser restaurado
        this.canTransitionBack = true;
        console.log('[Intro2Scene] Transição de volta para IntroScene HABILITADA');
    }
    
    /**
     * Cria o prompt visual para pular a cutscene
     */
    createSkipPrompt() {
        // Prevenir criação duplicada
        if (this.skipPromptContainer) {
            console.log('[Intro2Scene] Skip prompt já existe, ignorando');
            return;
        }
        
        const centerX = this.cameras.main.width / 2;
        const bottomY = this.cameras.main.height - 80; // 80px do fundo
        
        // Container para o prompt
        this.skipPromptContainer = this.add.container(centerX, bottomY);
        this.skipPromptContainer.setDepth(100001); // Acima das barras cinemáticas
        this.skipPromptContainer.setScrollFactor(0);
        this.skipPromptContainer.setAlpha(0);
        
        // Fundo do prompt
        const promptBg = this.add.rectangle(0, 0, 320, 50, 0x000000, 0.7);
        promptBg.setStrokeStyle(2, 0xffffff, 0.8);
        
        // Texto do prompt
        const promptText = this.add.text(0, 0, 'Segure na tela para pular', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });
        promptText.setOrigin(0.5);
        
        // Barra de progresso (fundo)
        this.skipProgressBg = this.add.rectangle(0, 22, 280, 8, 0x444444, 0.8);
        
        // Barra de progresso (preenchimento)
        this.skipProgressBar = this.add.rectangle(-140, 22, 0, 8, 0x00ff00, 1);
        this.skipProgressBar.setOrigin(0, 0.5);
        
        // Adicionar elementos ao container
        this.skipPromptContainer.add([promptBg, promptText, this.skipProgressBg, this.skipProgressBar]);
        
        // IMPORTANTE: Fazer a câmera PRINCIPAL ignorar o prompt (renderizar apenas na câmera de UI)
        if (this.cameras.main) {
            this.cameras.main.ignore(this.skipPromptContainer);
        }
        
        // NÃO fazer fade in automático - o prompt fica invisível até o jogador clicar
        // Apenas configurar input para segurar na tela
        if (!this.skipInputConfigured) {
            this.setupSkipCutsceneInput();
            this.skipInputConfigured = true;
        }
    }
    
    /**
     * Esconde o prompt de pular cutscene
     */
    hideSkipPrompt() {
        if (this.skipPromptContainer && this.skipPromptContainer.alpha > 0) {
            this.tweens.add({
                targets: this.skipPromptContainer,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
        }
    }
    
    /**
     * Mostra o prompt de pular cutscene
     */
    showSkipPrompt() {
        if (this.skipPromptContainer && this.skipPromptContainer.alpha < 1) {
            // Cancelar timer anterior
            if (this.skipPromptHideTimer) {
                this.skipPromptHideTimer.remove();
            }
            
            this.tweens.add({
                targets: this.skipPromptContainer,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
            
            // Auto-hide após 1.5 segundos
            this.skipPromptHideTimer = this.time.delayedCall(1500, () => {
                this.hideSkipPrompt();
            });
        }
    }
    
    /**
     * Configura input para pular cutscene
     */
    setupSkipCutsceneInput() {
        // Input de mouse/touch
        this.input.on('pointerdown', () => {
            if (this.cutsceneActive && !this.isSkippingCutscene) {
                this.skipCutscenePressed = true;
                this.skipCutsceneHoldTime = 0;
                this.showSkipPrompt();
                
                // Cancelar auto-hide enquanto estiver segurando
                if (this.skipPromptHideTimer) {
                    this.skipPromptHideTimer.remove();
                    this.skipPromptHideTimer = null;
                }
            }
        });
        
        this.input.on('pointerup', () => {
            this.skipCutscenePressed = false;
            this.skipCutsceneHoldTime = 0;
            // Resetar barra de progresso
            if (this.skipProgressBar) {
                this.skipProgressBar.width = 0;
            }
            
            // Quando soltar, agendar auto-hide novamente
            if (this.cutsceneActive && !this.isSkippingCutscene) {
                this.skipPromptHideTimer = this.time.delayedCall(1500, () => {
                    this.hideSkipPrompt();
                });
            }
        });
        
        // Tecla Espaço também pula
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.cutsceneActive && !this.isSkippingCutscene) {
                this.skipCutscene();
            }
        });
    }
    
    /**
     * Pula a cutscene imediatamente
     */
    skipCutscene() {
        if (!this.cutsceneActive || this.isSkippingCutscene) return;
        
        console.log('[Intro2Scene] Pulando cutscene...');
        this.isSkippingCutscene = true;
        
        // Parar todos os tweens do player
        this.tweens.killTweensOf(this.player);
        
        // Mover player para posição final
        const finalWaypoint = this.walkingWaypoints[this.walkingWaypoints.length - 1];
        this.player.setPosition(finalWaypoint.x, finalWaypoint.y);
        
        // Parar animação
        if (this.player.anims) {
            this.player.anims.stop();
        }
        
        // Esconder prompt
        if (this.skipPromptContainer) {
            this.skipPromptContainer.destroy();
            this.skipPromptContainer = null;
        }
        
        // Parar música (fade out rápido)
        const music = this.sound.get('audentropia');
        if (music && music.isPlaying) {
            this.tweens.add({
                targets: music,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    music.stop();
                }
            });
        }
        
        // Finalizar cutscene
        this.endWalkingCutscene();
    }
    
    /**
     * Cria as barras pretas cinemáticas
     */
    createCinematicBars() {
        const barHeight = 40; // Barras menores
        
        // Barra superior
        this.cinematicBarTop = this.add.rectangle(
            this.cameras.main.width / 2,
            0,
            this.cameras.main.width,
            barHeight,
            0x000000
        );
        this.cinematicBarTop.setOrigin(0.5, 0);
        this.cinematicBarTop.setDepth(100000); // Depth MUITO ALTO para ficar acima de TUDO
        this.cinematicBarTop.setScrollFactor(0);
        this.cinematicBarTop.setAlpha(0);
        
        // Barra inferior
        this.cinematicBarBottom = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height,
            this.cameras.main.width,
            barHeight,
            0x000000
        );
        this.cinematicBarBottom.setOrigin(0.5, 1);
        this.cinematicBarBottom.setDepth(100000); // Depth MUITO ALTO para ficar acima de TUDO
        this.cinematicBarBottom.setScrollFactor(0);
        this.cinematicBarBottom.setAlpha(0);
        
        // Animar entrada das barras
        this.tweens.add({
            targets: [this.cinematicBarTop, this.cinematicBarBottom],
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    /**
     * Remove as barras cinemáticas
     */
    removeCinematicBars() {
        if (this.cinematicBarTop && this.cinematicBarBottom) {
            this.tweens.add({
                targets: [this.cinematicBarTop, this.cinematicBarBottom],
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.cinematicBarTop.destroy();
                    this.cinematicBarBottom.destroy();
                }
            });
        }
    }
    
    /**
     * Mostra o título "Fase 4: Máquina de entropia" no final da cutscene
     */
    showPhaseTitle() {
        // Aguardar 1 segundo para as barras sumirem
        this.time.delayedCall(1000, () => {
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            
            // Criar título
            const phaseTitle = this.add.text(centerX, centerY, 'Fase 4: Máquina de entropia', {
                fontSize: '36px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            });
            phaseTitle.setOrigin(0.5);
            phaseTitle.setScrollFactor(0, 0); // Fixo na tela
            phaseTitle.setDepth(100001); // Acima de tudo
            phaseTitle.setAlpha(0);
            phaseTitle.setInteractive(false); // NÃO bloquear interações
            
            // Ignorar pela câmera de UI se existir
            if (this.uiCamManager && this.cameras.main) {
                this.uiCamManager.ignore(phaseTitle);
            }
            
            // Fade in
            this.tweens.add({
                targets: phaseTitle,
                alpha: 1,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    // Manter por 3 segundos
                    this.time.delayedCall(3000, () => {
                        // Fade out
                        this.tweens.add({
                            targets: phaseTitle,
                            alpha: 0,
                            duration: 1500,
                            ease: 'Power2',
                            onComplete: () => {
                                phaseTitle.destroy();
                                console.log('[Intro2Scene] Phase title destru\u00eddo - garantindo que intera\u00e7\u00f5es funcionem');
                                
                                // Garantir que nada est\u00e1 bloqueando intera\u00e7\u00f5es
                                this.input.enabled = true;
                            }
                        });
                    });
                }
            });
        });
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
        console.log('[Intro2Scene] Restaurando controles');
        
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
     * Lê a placa da fábrica
     */
    readFactorySign() {
        console.log('[Intro2Scene] === readFactorySign INICIADO ===');
        console.log('[Intro2Scene] dialogue existe?', !!this.dialogue);
        console.log('[Intro2Scene] dialogue.box existe?', !!this.dialogue?.box);
        console.log('[Intro2Scene] dialogue.text existe?', !!this.dialogue?.text);
        console.log('[Intro2Scene] dialogue.show é função?', typeof this.dialogue?.show);
        
        // Esconder ícone de interação
        if (this.signIcon) {
            this.signIcon.hide();
        }
        
        // Esconder controles
        this.hideVirtualControls();
        
        console.log('[Intro2Scene] Registrando callback');
        
        // Registrar callback para restaurar controles
        this.dialogue.onCloseCallback = () => {
            console.log('[Intro2Scene] Callback executado');
            this.showVirtualControls();
            this.dialogue.onCloseCallback = null;
        };
        
        console.log('[Intro2Scene] Chamando dialogue.show()');
        
        // Mostrar diálogo
        this.dialogue.show('Fábrica de Aris Thorne', {
            disableSound: true
        });
        
        console.log('[Intro2Scene] dialogue.show() chamado');
        console.log('[Intro2Scene] dialogue.active:', this.dialogue.active);
        console.log('[Intro2Scene] dialogue.box.visible:', this.dialogue.box.visible);
    }
    
    /**
     * Override do método de interação para suportar a placa e entrada do hall
     */
    handleInteraction() {
        console.log('[Intro2Scene] === handleInteraction CHAMADO ===');
        console.log('[Intro2Scene] - cutsceneActive:', this.cutsceneActive);
        console.log('[Intro2Scene] - currentInteractable:', this.currentInteractable);
        console.log('[Intro2Scene] - dialogue existe?', !!this.dialogue);
        console.log('[Intro2Scene] - dialogue ativo?', this.dialogue?.active);
        
        if (!this.cutsceneActive && this.currentInteractable === 'sign') {
            console.log('[Intro2Scene] Executando readFactorySign');
            this.readFactorySign();
            return;
        }
        if (!this.cutsceneActive && this.currentInteractable === 'hall') {
            console.log('[Intro2Scene] Entrando no Hall do Hallirado via handleInteraction');
            this.enterHall(this.currentInteractable);
            return;
        }
        
        console.log('[Intro2Scene] Nenhuma interação válida');
    }
    
    /**
     * Transição para HallDoHalliradoScene
     * @param {string} entrance - 'hall-left' ou 'hall-right'
     */
    enterHall(entrance) {
        console.log('[Intro2Scene] === ENTRANDO NO HALL ===');
        console.log('[Intro2Scene] Entrada pela porta:', entrance);
        
        // Esconder ícone
        if (this.hallIcon) {
            this.hallIcon.hide();
        }
        
        // Spawn sempre no meio das portas do HallDoHalliradoScene
        // Portas estão em tiles (19,19) e (20,19)
        // Spawn no meio (19.5) um tile acima (Y=18) para aparecer dentro do hall
        const tileSize = 32;
        window._playerEntryPos = { x: 19.5 * tileSize + 16, y: 18 * tileSize + 16 };
        
        console.log('[Intro2Scene] Definindo window._playerEntryPos (meio):', window._playerEntryPos);
        
        // Fade out
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.time.delayedCall(500, () => {
            console.log('[Intro2Scene] Iniciando HallDoHalliradoScene');
            this.scene.start('HallDoHalliradoScene');
        });
    }

    onReturnToIntro() {
        // Verificar flags para evitar transição múltipla ou prematura
        if (this.isTransitioningBack || !this.canTransitionBack) return;
        this.isTransitioningBack = true;
        
        console.log('[Intro2Scene] Voltando para IntroScene');
        
        // Spawn no topo da IntroScene (tile 14, 2)
        // IMPORTANTE: NÃO iniciar cutscene ao voltar
        window._playerEntryPos = { x: 14 * 32 + 16, y: 2 * 32 + 16 };
        window._startCutscene = false; // Garantir que cutscene não inicie
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('IntroScene');
        });
    }

    update() {
        // FORÇAR HUD ESCONDIDO DURANTE CUTSCENE
        if (this.cutsceneActive) {
            // Garantir que o player esteja sempre visível
            if (this.player) {
                this.player.setVisible(true);
                this.player.setAlpha(1);
            }
            
            // Esconder apenas elementos de UI (depth muito alto)
            this.children.list.forEach(child => {
                // Apenas elementos com depth MUITO alto (UI)
                // Excluir: player, barras cinemáticas
                if (child !== this.player && 
                    child.depth >= 1000 && 
                    child.depth < 100000 && 
                    child !== this.cinematicBarTop && 
                    child !== this.cinematicBarBottom) {
                    child.setVisible(false);
                    child.setAlpha(0);
                }
            });
        }
        
        // Não atualizar controles durante cutscene
        if (!this.cutsceneActive) {
            this.updateBase();
        } else {
            // Durante cutscene, verificar se está segurando para pular
            if (this.skipCutscenePressed && !this.isSkippingCutscene) {
                this.skipCutsceneHoldTime += this.game.loop.delta;
                
                // Atualizar barra de progresso
                if (this.skipProgressBar) {
                    const progress = Math.min(this.skipCutsceneHoldTime / this.skipCutsceneRequired, 1);
                    this.skipProgressBar.width = 280 * progress;
                }
                
                // Se segurou tempo suficiente, pular cutscene
                if (this.skipCutsceneHoldTime >= this.skipCutsceneRequired) {
                    this.skipCutscene();
                }
            }
        }
        
        // Atualizar CoordProbe
        if (this.coordProbe) {
            this.coordProbe.update();
        }
        
        // Interação com a placa da fábrica (somente quando não está em cutscene e não está em diálogo)
        if (!this.cutsceneActive && !this.dialogue?.active && this.factorySign && this.player && this.signIcon) {
            const distanceToSign = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.factorySign.x, 
                this.factorySign.y
            );
            
            // Debug: mostrar distância a cada segundo
            if (this.time.now % 1000 < 16) {
                console.log('[Intro2Scene] Distância à placa:', distanceToSign.toFixed(2), 'cutsceneActive:', this.cutsceneActive, 'dialogue.active:', this.dialogue?.active);
            }
            
            let signIconVisible = false;
            if (distanceToSign < 50) {
                // Mostrar ícone quando próximo
                signIconVisible = true;
                this.currentInteractable = 'sign';
                
                if (!this.signIcon.visible) {
                    this.signIcon.showAbove(this.factorySign);
                    console.log('[Intro2Scene] Mostrado ícone da placa');
                }
            } else {
                // Longe da placa
                signIconVisible = false;
            }
            
            if (!signIconVisible) {
                if (this.signIcon.visible) {
                    this.signIcon.hide();
                    console.log('[Intro2Scene] Escondido ícone da placa (longe)');
                }
                if (this.currentInteractable === 'sign') {
                    this.currentInteractable = null;
                }
            }
            
            // Atualizar posição do ícone
            this.signIcon.updatePosition();
        }
        
        // Interação com a entrada do hall (somente quando não está em cutscene e não está em diálogo)
        if (!this.cutsceneActive && !this.dialogue?.active && this.hallEntrance && this.player) {
            const distanceToHall = Phaser.Math.Distance.Between(
                this.player.x, 
                this.player.y, 
                this.hallEntrance.x, 
                this.hallEntrance.y
            );
            
            const nearHall = distanceToHall < 50;
            
            if (nearHall) {
                // Mostrar ícone quando próximo da entrada
                this.currentInteractable = 'hall';
                
                if (!this.hallIcon.visible) {
                    this.hallIcon.showAbove(this.hallEntrance);
                    console.log('[Intro2Scene] Mostrado ícone da entrada do hall');
                }
            } else {
                if (this.hallIcon.visible) {
                    this.hallIcon.hide();
                    console.log('[Intro2Scene] Escondido ícone da entrada do hall (longe)');
                }
                if (this.currentInteractable === 'hall') {
                    this.currentInteractable = null;
                }
            }
            
            // Atualizar posição do ícone
            this.hallIcon.updatePosition();
        } else if (this.dialogue?.active) {
            // Durante diálogo, esconder ícone e limpar interactable
            if (this.signIcon) {
                this.signIcon.hide();
            }
            if (this.hallIcon) {
                this.hallIcon.hide();
            }
            if (this.currentInteractable === 'sign' || this.currentInteractable === 'hall') {
                this.currentInteractable = null;
                
                // Re-habilitar E tornar visível a área clicável da hotbar
                if (this.hotbar && this.hotbar.clickableArea) {
                    this.hotbar.clickableArea.setInteractive();
                    this.hotbar.clickableArea.setVisible(true);
                    this.hotbar.clickableArea.setActive(true);
                }
            }
        }
        
        // Ordenar depth dos objetos por Y
        if (this.player) {
            this.player.setDepth(this.player.y);
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
