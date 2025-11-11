import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';

/**
 * Intro2Scene - Segunda cena de introdução
 */
export default class Intro2Scene extends BaseScene {
    constructor() {
        super('Intro2Scene');
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
        let chao = null;
        let caminho = null;
        let fabrica = null;
        let cerca = null;
        let fachada = null;
        let arvores = null;
        
        // 1. Chão (base)
        if (map.getLayer('chao')) {
            chao = map.createLayer('chao', allTilesets, 0, 0);
        }
        
        // 2. Cerca (bem atrás)
        if (map.getLayer('Cerca')) {
            cerca = map.createLayer('Cerca', allTilesets, 0, 0);
        }
        
        // 3. Caminho
        if (map.getLayer('caminho')) {
            caminho = map.createLayer('caminho', allTilesets, 0, 0);
        }
        
        // 4. Fábrica
        if (map.getLayer('fabrica')) {
            fabrica = map.createLayer('fabrica', allTilesets, 0, 0);
        }
        
        // 5. Fachada
        if (map.getLayer('fachada')) {
            fachada = map.createLayer('fachada', allTilesets, 0, 0);
        }
        
        // 6. Árvores (na frente)
        if (map.getLayer('arvores')) {
            arvores = map.createLayer('arvores', allTilesets, 0, 0);
        }
        
        // Configurar colisão com cerca
        if (cerca) {
            cerca.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com fachada
        if (fachada) {
            fachada.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com fábrica
        if (fabrica) {
            fabrica.setCollisionByExclusion([-1, 0]);
        }
        
        // Configurar colisão com árvores - IMPORTANTE: todas as árvores precisam bloquear
        if (arvores) {
            // Configurar colisão com TODOS os tiles que não sejam vazios
            arvores.setCollisionByExclusion([-1, 0]);
            
            // Também configurar por propriedade se existir
            arvores.setCollisionByProperty({ collides: true });
            
            console.log('[Intro2Scene] Colisão configurada na camada de árvores');
        }
        
        // Configurar limites do mundo
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Criar player - usar posição salva ou posição padrão (centro inferior)
        const entryPos = window._playerEntryPos;
        const spawnX = entryPos?.x ?? (map.width / 2) * 32 + 16;
        const spawnY = entryPos?.y ?? (map.height - 2) * 32 + 16;
        
        console.log('[Intro2Scene] Spawn do player:', { x: spawnX, y: spawnY, entryPos });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Verificar se deve iniciar cutscene
        const shouldStartCutscene = window._startCutscene || false;
        
        // Limpar flags
        window._playerEntryPos = null;
        window._startCutscene = false;
        
        // Adicionar colisão do player com camadas colisíveis
        if (chao) {
            this.physics.add.collider(this.player, chao);
        }
        if (cerca) {
            this.physics.add.collider(this.player, cerca);
        }
        if (fachada) {
            this.physics.add.collider(this.player, fachada);
        }
        if (fabrica) {
            this.physics.add.collider(this.player, fabrica);
        }
        if (arvores) {
            this.physics.add.collider(this.player, arvores);
            console.log('[Intro2Scene] Collider player-arvores criado');
        }
        
        // Debug: verificar tiles com colisão
        if (arvores) {
            console.log('[Intro2Scene] Tiles na camada arvores:', arvores.layer.data.flat().filter(t => t.index > 0).length);
        }
        
        // Sistemas comuns
        this.createDialogueSystem();
        this.createHotbar();
        this.createVirtualControls();
        
        // CUTSCENE: Iniciar caminhada automática se a flag estiver setada
        console.log('[Intro2Scene] Verificando cutscene - shouldStartCutscene:', shouldStartCutscene);
        if (shouldStartCutscene) {
            this.startWalkingCutscene();
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
        const worldObjects = [
            this.player, 
            chao,
            caminho, 
            fabrica,
            cerca,
            fachada,
            arvores
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
        
        // Criar zona de transição de VOLTA para IntroScene 15 TILES ACIMA DO SPAWN
        // Se spawnar no tile Y=48, a zona fica no tile Y=33 (48 - 15 = 33)
        const transitionTileY = Math.max(0, Math.floor(spawnY / 32) - 15);
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
        
        // Habilitar transição após 1 segundo
        this.time.delayedCall(1000, () => {
            this.canTransitionBack = true;
            console.log('[Intro2Scene] Transição de volta habilitada');
        });
        
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
        
        // Criar barras cinemáticas (letterbox)
        this.createCinematicBars();
        
        // Esconder HUD - mobileControls
        console.log('[Intro2Scene] Escondendo mobileControls...');
        
        if (this.mobileControls) {
            this.mobileControls.hide();
            console.log('[Intro2Scene] mobileControls.hide() chamado');
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
        // Mostrar HUD novamente - RESTAURAR TUDO
        console.log('[Intro2Scene] Mostrando HUD...');
        
        // Restaurar mobileControls (joystick e botões)
        if (this.mobileControls) {
            this.mobileControls.show();
        }
        
        // Restaurar virtual buttons individualmente
        if (this.virtualButtons && this.virtualButtons.buttons) {
            this.virtualButtons.buttons.forEach(btn => {
                if (btn.container) {
                    btn.container.setVisible(true);
                    btn.container.setAlpha(1);
                }
            });
        }
        
        // Restaurar virtual joystick
        if (this.virtualJoystick) {
            if (this.virtualJoystick.base) {
                this.virtualJoystick.base.setVisible(true);
                this.virtualJoystick.base.setAlpha(0.6);
            }
            if (this.virtualJoystick.stick) {
                this.virtualJoystick.stick.setVisible(true);
                this.virtualJoystick.stick.setAlpha(0.8);
            }
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
                            }
                        });
                    });
                }
            });
        });
    }
    
    onReturnToIntro() {
        // Verificar flags para evitar transição múltipla ou prematura
        if (this.isTransitioningBack || !this.canTransitionBack) return;
        this.isTransitioningBack = true;
        
        console.log('[Intro2Scene] Voltando para IntroScene');
        
        // Spawn no topo da IntroScene (tile 14, 2)
        window._playerEntryPos = { x: 14 * 32 + 16, y: 2 * 32 + 16 };
        
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
        }
        
        // Atualizar CoordProbe
        if (this.coordProbe) {
            this.coordProbe.update();
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
