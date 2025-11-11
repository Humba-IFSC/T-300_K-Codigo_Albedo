import { BaseScene } from './BaseScene.js';
import { UICameraManager } from '../systems/ui/UICameraManager.js';
import { CoordProbe } from '../systems/debug/CoordProbe.js';

/**
 * IntroScene - Cena com o mapa de introdução
 */
export default class IntroScene extends BaseScene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        super.preload();
        
        // Carregar música da cutscene
        this.load.audio('audentropia', 'assets/sounds/audentropia.mp3');
        
        // Carregar tilesets do mapa de introdução
        this.load.image('tileset-grassland-grass', 'assets/tilesets/tileset-grassland-grass.png');
        this.load.image('tileset-grassland-water', 'assets/tilesets/tileset-grassland-water.png');
        this.load.image('tileset-grassland-paths', 'assets/tilesets/tileset-grassland-paths.png');
        this.load.image('ground_grass_details', 'assets/tilesets/ground_grass_details.png');
        this.load.image('Trees_animation', 'assets/tilesets/Trees_animation.png');
        this.load.image('props', 'assets/tilesets/props.png');
        this.load.image('boat0001-sheet', 'assets/tilesets/boat0001-sheet.png');
        
        // Carregar o mapa
        this.load.tilemapTiledJSON('intro_map', 'assets/maps/introdução.json');
        
        // Carregar sprite do player
        this.load.spritesheet('player', 'assets/sprites/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
    }

    create() {
        console.log('[IntroScene] Criando cena de introdução');
        
        // Criar mapa
        const map = this.make.tilemap({ key: 'intro_map' });
        this.map = map;
        
        // Adicionar tilesets
        const grassTileset = map.addTilesetImage('tileset-grassland-grass', 'tileset-grassland-grass');
        const waterTileset = map.addTilesetImage('tileset-grassland-water', 'tileset-grassland-water');
        const pathsTileset = map.addTilesetImage('tileset-grassland-paths', 'tileset-grassland-paths');
        const detailsTileset = map.addTilesetImage('ground_grass_details', 'ground_grass_details');
        const treesTileset = map.addTilesetImage('Trees_animation', 'Trees_animation');
        const propsTileset = map.addTilesetImage('props', 'props');
        const boatTileset = map.addTilesetImage('boat0001-sheet', 'boat0001-sheet');
        
        // Array com todos os tilesets
        const allTilesets = [
            grassTileset, 
            waterTileset, 
            pathsTileset, 
            detailsTileset, 
            treesTileset, 
            propsTileset, 
            boatTileset
        ];
        
        // Criar camadas na ordem correta
        const layer1 = map.createLayer('Camada de Blocos 1', allTilesets, 0, 0);
        const caminho = map.createLayer('caminho', allTilesets, 0, 0);
        const arvores = map.createLayer('arvores', allTilesets, 0, 0);
        const arvores2 = map.createLayer('arvores 2', allTilesets, 0, 0);
        const arvores3 = map.createLayer('arvores 3', allTilesets, 0, 0);
        const arvores4 = map.createLayer('arvores 4', allTilesets, 0, 0);

        // Configurar colisão com água (tile 38 do tileset water)
        if (layer1) {
            layer1.setCollisionByProperty({ collides: true });
            // Se não tiver propriedade, usar IDs específicos da água
            layer1.setCollisionBetween(38, 42); // IDs da água no tileset
        }
        
        // Camada "caminho" NÃO tem colisão (player pode andar sobre ela)
        
        // Configurar colisão com árvores e decorações
        if (arvores) {
            arvores.setCollisionByProperty({ collides: true });
            arvores.setCollisionByExclusion([-1, 0]); // Árvores são colisíveis
        }
        
        if (arvores2) {
            arvores2.setCollisionByProperty({ collides: true });
            arvores2.setCollisionByExclusion([-1, 0]); // Árvores camada 2 são colisíveis
        }
        
        if (arvores3) {
            arvores3.setCollisionByProperty({ collides: true });
            arvores3.setCollisionByExclusion([-1, 0]); // Árvores camada 3 são colisíveis
        }
        
        if (arvores4) {
            arvores4.setCollisionByProperty({ collides: true });
            arvores4.setCollisionByExclusion([-1, 0]); // Árvores camada 4 são colisíveis
        }
        
        // Configurar limites do mundo
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Criar player - usar posição salva ou posição padrão (saindo do barco)
        const entryPos = window._playerEntryPos;
        const spawnX = entryPos?.x ?? (14 * 32 + 16); // Tile 14, centralizado
        const spawnY = entryPos?.y ?? (43 * 32 + 16); // Tile 43 (saindo do barco)
        
        console.log('[IntroScene] Spawn do player:', { x: spawnX, y: spawnY, entryPos, tileX: Math.floor(spawnX / 32), tileY: Math.floor(spawnY / 32) });
        
        this.createCommonPlayer(spawnX, spawnY);
        
        // Limpar posição salva
        window._playerEntryPos = null;
        
        // Adicionar colisão do player com camadas colisíveis (SEM o caminho)
        if (layer1) {
            this.physics.add.collider(this.player, layer1);
        }
        if (arvores) {
            this.physics.add.collider(this.player, arvores);
        }
        if (arvores2) {
            this.physics.add.collider(this.player, arvores2);
        }
        if (arvores3) {
            this.physics.add.collider(this.player, arvores3);
        }
        if (arvores4) {
            this.physics.add.collider(this.player, arvores4);
        }
        
        // Sistemas comuns
        this.createDialogueSystem();
        this.createHotbar();
        this.createVirtualControls();
        
        // CUTSCENE: Iniciar caminhada automática se for primeira entrada
        const shouldStartCutscene = !entryPos;
        if (shouldStartCutscene) {
            console.log('[IntroScene] Iniciando cutscene de caminhada');
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
        
        // Gerenciador de câmera de UI (igual ao mapa principal)
        this.uiCamManager = new UICameraManager(this, { zoom: 1 });
        const uiElems = this.getUIElements();
        const worldObjects = [
            this.player, 
            layer1, 
            caminho, 
            arvores, 
            arvores2,
            arvores3,
            arvores4
        ].filter(Boolean);
        this.worldObjects = worldObjects;
        this.uiCamManager.applyIgnores(worldCam, uiElems, worldObjects);
        if (this.coordProbe?.highlight) this.uiCamManager.ignore(this.coordProbe.highlight);
        
        worldCam.setRenderToTexture && worldCam.setRoundPixels && (worldCam._padding = 2);
        
        // Tecla ESC para voltar ao menu
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('[IntroScene] Voltando ao menu');
            this.scene.start('TitleScene');
        });
        
        // Criar zona de transição para Intro2Scene no TOPO do mapa
        // Área de transição: apenas tile Y = 0 (borda superior)
        this.transitionZone = this.add.zone(
            map.widthInPixels / 2,  // Centro horizontal
            16,                      // Y = meio do tile 0 (16px)
            map.widthInPixels,       // Largura total do mapa
            32                       // Altura de 1 tile
        );
        this.physics.world.enable(this.transitionZone);
        this.transitionZone.body.setAllowGravity(false);
        this.transitionZone.body.moves = false;
        
        // Flag para evitar transição imediata após spawn
        this.isTransitioning = false;
        this.canTransition = false;
        
        // Habilitar transição após 1 segundo (tempo para player se afastar da zona se voltou de outra cena)
        this.time.delayedCall(1000, () => {
            this.canTransition = true;
            console.log('[IntroScene] Transição habilitada');
        });
        
        // Overlap para detectar quando o player entra na zona de transição
        this.physics.add.overlap(
            this.player, 
            this.transitionZone, 
            this.onEnterTransitionZone, 
            null, 
            this
        );
    }
    
    /**
     * Inicia a cutscene de caminhada até o topo da IntroScene
     */
    startWalkingCutscene() {
        console.log('[IntroScene] Cutscene iniciada - caminhando até o topo');
        
        // Desabilitar controles do jogador
        this.cutsceneActive = true;
        
        // Criar barras cinemáticas (letterbox)
        this.createCinematicBars();
        
        // Esconder HUD - mobileControls
        console.log('[IntroScene] Escondendo mobileControls...');
        
        if (this.mobileControls) {
            this.mobileControls.hide();
            console.log('[IntroScene] mobileControls.hide() chamado');
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
        
        // Waypoints do caminho (do barco até o topo)
        const waypoints = [
            { x: 14 * 32 + 16, y: 35 * 32 + 16 }, // Meio do caminho
            { x: 14 * 32 + 16, y: 25 * 32 + 16 }, // Continuando
            { x: 14 * 32 + 16, y: 15 * 32 + 16 }, // Mais acima
            { x: 14 * 32 + 16, y: 5 * 32 + 16 },  // Próximo ao topo
            { x: 14 * 32 + 16, y: 1 * 32 + 16 }   // No topo - vai ativar transição
        ];
        
        this.currentWaypointIndex = 0;
        this.walkingWaypoints = waypoints;
        
        // Calcular duração: ~30 segundos para esta parte (mais devagar)
        const totalDistance = this.calculateTotalDistance(waypoints);
        this.cutsceneSpeed = totalDistance / 30000; // 30 segundos (era 20)
        
        console.log('[IntroScene] Distância total:', totalDistance, 'Velocidade:', this.cutsceneSpeed);
        
        // Tocar música audentropia.mp3 após 0.5 segundos (sem loop)
        this.time.delayedCall(500, () => {
            if (this.sound.get('audentropia')) {
                this.sound.get('audentropia').play({ loop: false, volume: 0.5 });
            } else {
                this.sound.play('audentropia', { loop: false, volume: 0.5 });
            }
            console.log('[IntroScene] Música audentropia.mp3 iniciada');
        });
        
        // Mostrar créditos durante a cutscene
        this.showCredits();
        
        // Iniciar movimento
        this.moveToNextWaypoint();
    }
    
    /**
     * Mostra os créditos animados durante a cutscene
     */
    showCredits() {
        console.log('[IntroScene] Mostrando créditos...');
        
        const credits = [
            'Gabriel\nConforto',
            'Gabriel\nCorrea',
            'Ariel',
            'João\nCampos\nNeto',
            'Marcos\nVinicius'
        ];
        
        const centerY = this.cameras.main.height / 2;
        const leftX = this.cameras.main.width * 0.30; // 25% da largura (esquerda)
        const rightX = this.cameras.main.width * 0.70; // 75% da largura (direita)
        
        // Mostrar cada crédito com fade in/out
        credits.forEach((name, index) => {
            const delay = 3000 + (index * 4000); // Começa aos 3s, depois a cada 4s
            const isLeft = index % 2 === 0; // Par = esquerda, Ímpar = direita
            const posX = isLeft ? leftX : rightX;
            
            console.log(`[IntroScene] Agendando crédito "${name}" para ${delay}ms (${isLeft ? 'esquerda' : 'direita'})`);
            
            this.time.delayedCall(delay, () => {
                console.log(`[IntroScene] Mostrando crédito: ${name}`);
                
                // Criar texto do crédito
                const creditText = this.add.text(posX, centerY, name, {
                    fontSize: '28px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                    align: 'center'
                });
                creditText.setOrigin(0.5);
                creditText.setScrollFactor(0, 0); // Fixo na tela
                creditText.setDepth(100000); // Mesma camada das barras cinemáticas
                creditText.setAlpha(0);
                
                // Ignorar pela câmera de UI se existir
                if (this.uiCamManager && this.cameras.main) {
                    this.uiCamManager.ignore(creditText);
                }
                
                console.log(`[IntroScene] Crédito criado - depth: ${creditText.depth}, alpha: ${creditText.alpha}`);
                
                // Fade in
                this.tweens.add({
                    targets: creditText,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        console.log(`[IntroScene] Crédito "${name}" fade in completo`);
                        // Fade out após 2 segundos
                        this.time.delayedCall(2000, () => {
                            this.tweens.add({
                                targets: creditText,
                                alpha: 0,
                                duration: 1000,
                                ease: 'Power2',
                                onComplete: () => {
                                    console.log(`[IntroScene] Crédito "${name}" removido`);
                                    creditText.destroy();
                                }
                            });
                        });
                    }
                });
            });
        });
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
            // Finalizar cutscene parte 1, vai continuar na Intro2Scene
            this.endFirstPartCutscene();
            return;
        }
        
        const waypoint = this.walkingWaypoints[this.currentWaypointIndex];
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, waypoint.x, waypoint.y);
        const duration = distance / this.cutsceneSpeed;
        
        console.log(`[IntroScene] Indo para waypoint ${this.currentWaypointIndex}: tile Y=${Math.floor(waypoint.y/32)}, duração: ${duration.toFixed(0)}ms`);
        
        // Determinar direção da animação
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, waypoint.x, waypoint.y);
        let direction = 'up'; // Sempre subindo na IntroScene
        
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
     * Finaliza primeira parte da cutscene e faz transição
     */
    endFirstPartCutscene() {
        console.log('[IntroScene] Primeira parte da cutscene finalizada - fazendo transição');
        
        // A transição automática vai acontecer porque o player está na zona
        // Mas vamos forçar para garantir
        this.time.delayedCall(100, () => {
            if (!this.isTransitioning) {
                // Salvar que é continuação da cutscene
                window._startCutscene = true;
                window._playerEntryPos = { x: 15 * 32 + 16, y: 17 * 32 + 16 }; // Spawnar no tile 15 (vermelho)
                
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('Intro2Scene');
                });
            }
        });
    }
    
    onEnterTransitionZone() {
        // Prevenir múltiplas transições e verificar se pode fazer transição
        if (this.isTransitioning || !this.canTransition) return;
        this.isTransitioning = true;
        
        console.log('[IntroScene] Player entrou na zona de transição - mudando para Intro2Scene');
        
        // Salvar posição para spawn na próxima cena (parte inferior do intro2)
        window._playerEntryPos = { x: 15 * 32 + 16, y: 17 * 32 + 16 }; // Spawnar no tile 15 (vermelho)
        
        // Flag para iniciar cutscene na Intro2Scene
        window._startCutscene = true;
        
        // Transição suave
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('Intro2Scene');
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
            
            // Esconder apenas elementos de UI (depth muito alto), exceto diálogos
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
        }        // Atualizar CoordProbe
        if (this.coordProbe) {
            this.coordProbe.update();
        }
        
        // Ordenar depth dos objetos por Y (igual ao mapa principal)
        if (this.player) {
            this.player.setDepth(this.player.y);
        }
    }
    
    // Métodos para controlar o CoordProbe (como no GameScene)
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
