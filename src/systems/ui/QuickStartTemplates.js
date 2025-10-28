/**
 * ============================================================================
 * QUICK START TEMPLATE - Mobile Controls
 * ============================================================================
 * 
 * Template pronto para copiar e colar.
 * Escolha o template que melhor se adapta ao seu jogo!
 * 
 * INSTRUÇÕES:
 * 1. Escolha um template abaixo
 * 2. Copie o código
 * 3. Cole na sua cena
 * 4. Adapte conforme necessário
 * 5. Pronto!
 */

// ============================================================================
// TEMPLATE 1: TOP-DOWN RPG (Zelda-like, Pokemon-like)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

export class RPGScene extends Phaser.Scene {
    create() {
        // Criar controles móveis
        this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
        
        // Criar player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.walkSpeed = 150;
        this.runSpeed = 260;
    }
    
    update() {
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            const isRunning = this.mobileControls.isButtonPressed('run');
            const speed = isRunning ? this.runSpeed : this.walkSpeed;
            
            this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
            
            // Animações
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                this.player.anims.play(dir.x > 0 ? 'walk-right' : 'walk-left', true);
            } else {
                this.player.anims.play(dir.y > 0 ? 'walk-down' : 'walk-up', true);
            }
        } else {
            this.player.setVelocity(0, 0);
        }
        
        if (this.mobileControls.isButtonPressed('interact')) {
            this.interact();
        }
    }
    
    interact() {
        // Sua lógica de interação aqui
    }
}

// ============================================================================
// TEMPLATE 2: PLATFORMER (Mario-like, Sonic-like)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

export class PlatformerScene extends Phaser.Scene {
    create() {
        // Controles para plataforma
        this.mobileControls = new MobileControls(this, CONFIGS.PLATFORMER);
        
        // Criar player
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.speed = 200;
        this.jumpVelocity = -400;
    }
    
    update() {
        // Movimento horizontal
        if (this.mobileControls.isButtonPressed('left')) {
            this.player.setVelocityX(-this.speed);
            this.player.anims.play('run-left', true);
        } else if (this.mobileControls.isButtonPressed('right')) {
            this.player.setVelocityX(this.speed);
            this.player.anims.play('run-right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        
        // Pulo
        if (this.mobileControls.isButtonPressed('jump') && this.player.body.onFloor()) {
            this.player.setVelocityY(this.jumpVelocity);
        }
        
        // Ataque
        if (this.mobileControls.isButtonPressed('attack')) {
            this.attack();
        }
    }
    
    attack() {
        // Sua lógica de ataque aqui
    }
}

// ============================================================================
// TEMPLATE 3: SIMPLE (Configuração mais básica possível)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class SimpleScene extends Phaser.Scene {
    create() {
        // Controles básicos
        this.mobileControls = new MobileControls(this);
        
        // Criar player
        this.player = this.physics.add.sprite(400, 300, 'player');
    }
    
    update() {
        // Movimento básico
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
        } else {
            this.player.setVelocity(0, 0);
        }
    }
}

// ============================================================================
// TEMPLATE 4: CUSTOM (Configuração personalizada)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class CustomScene extends Phaser.Scene {
    create() {
        // Controles customizados
        this.mobileControls = new MobileControls(this, {
            // Joystick
            joystick: {
                enabled: true,
                baseRadius: 70,        // Tamanho customizado
                stickRadius: 35,
                maxDistance: 55,
                deadZone: 0.15         // Dead zone menor
            },
            
            // Botões customizados
            buttons: [
                {
                    action: 'action1',
                    label: '1',
                    color: 0xFF0000,
                    position: 'right-bottom'
                },
                {
                    action: 'action2',
                    label: '2',
                    color: 0x00FF00,
                    position: 'left-top'
                },
                {
                    action: 'action3',
                    label: '3',
                    color: 0x0000FF,
                    position: 'top'
                }
            ],
            
            // Configurações gerais
            buttonRadius: 55,
            buttonAlpha: 0.9,
            alwaysShow: false  // Mude para true para testar em desktop
        });
        
        // Seu código aqui...
    }
    
    update() {
        // Seu código aqui...
    }
}

// ============================================================================
// TEMPLATE 5: WITH SPRITES (Com sprites customizados)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class SpritesScene extends Phaser.Scene {
    preload() {
        // Carregar sprites dos botões
        this.load.image('btn_a', 'assets/ui/button_a.png');
        this.load.image('btn_b', 'assets/ui/button_b.png');
        this.load.image('btn_x', 'assets/ui/button_x.png');
    }
    
    create() {
        // Controles com sprites
        this.mobileControls = new MobileControls(this, {
            buttons: [
                {
                    action: 'interact',
                    label: 'A',
                    sprite: 'btn_a',  // Usa sprite customizado
                    position: 'right-bottom'
                },
                {
                    action: 'run',
                    label: 'B',
                    sprite: 'btn_b',
                    position: 'left-top'
                },
                {
                    action: 'action',
                    label: 'X',
                    sprite: 'btn_x',
                    position: 'top'
                }
            ]
        });
        
        // Seu código aqui...
    }
}

// ============================================================================
// TEMPLATE 6: WITH EVENTS (Com sistema de eventos)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class EventsScene extends Phaser.Scene {
    create() {
        // Criar controles
        this.mobileControls = new MobileControls(this);
        
        // Escutar eventos dos botões
        this.events.on('mobilecontrols-button-down', (data) => {
            console.log('Botão pressionado:', data.action);
            this.onButtonPress(data.action);
        });
        
        this.events.on('mobilecontrols-button-up', (data) => {
            console.log('Botão solto:', data.action);
            this.onButtonRelease(data.action);
        });
        
        // Escutar eventos do joystick
        this.events.on('mobilecontrols-joystick-start', () => {
            console.log('Jogador começou a mover');
            this.onMoveStart();
        });
        
        this.events.on('mobilecontrols-joystick-end', () => {
            console.log('Jogador parou de mover');
            this.onMoveEnd();
        });
    }
    
    onButtonPress(action) {
        // Lógica quando botão é pressionado
    }
    
    onButtonRelease(action) {
        // Lógica quando botão é solto
    }
    
    onMoveStart() {
        // Lógica quando jogador começa a mover
    }
    
    onMoveEnd() {
        // Lógica quando jogador para de mover
    }
}

// ============================================================================
// TEMPLATE 7: WITH DIALOGUE (Desabilita durante diálogos)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class DialogueScene extends Phaser.Scene {
    create() {
        this.mobileControls = new MobileControls(this);
        this.isDialogueActive = false;
    }
    
    showDialogue(text) {
        // Desabilita controles durante diálogo
        this.mobileControls.disable();
        this.isDialogueActive = true;
        
        // Mostrar seu sistema de diálogo aqui
        // ...
    }
    
    hideDialogue() {
        // Reabilita controles após diálogo
        this.mobileControls.enable();
        this.isDialogueActive = false;
    }
    
    update() {
        // Só processa movimento se não estiver em diálogo
        if (!this.isDialogueActive && this.mobileControls.joystick?.isActive()) {
            // Lógica de movimento
        }
    }
}

// ============================================================================
// TEMPLATE 8: BEAT EM UP (Streets of Rage-like)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

export class BeatEmUpScene extends Phaser.Scene {
    create() {
        // Controles para beat em up
        this.mobileControls = new MobileControls(this, CONFIGS.BEAT_EM_UP);
        
        // Criar player
        this.player = this.physics.add.sprite(200, 300, 'player');
        this.attackCooldown = 0;
    }
    
    update(time, delta) {
        // Movimento
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
        } else {
            this.player.setVelocity(0, 0);
        }
        
        // Ataque
        if (this.mobileControls.isButtonPressed('attack') && this.attackCooldown <= 0) {
            this.attack();
            this.attackCooldown = 500; // 500ms cooldown
        }
        
        // Pulo
        if (this.mobileControls.isButtonPressed('jump') && this.player.body.onFloor()) {
            this.player.setVelocityY(-300);
        }
        
        // Especial
        if (this.mobileControls.isButtonPressed('special')) {
            this.specialAttack();
        }
        
        // Agarrar
        if (this.mobileControls.isButtonPressed('grab')) {
            this.grab();
        }
        
        // Cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
    }
    
    attack() {
        // Lógica de ataque
    }
    
    specialAttack() {
        // Lógica de ataque especial
    }
    
    grab() {
        // Lógica de agarrar
    }
}

// ============================================================================
// TEMPLATE 9: TESTING (Para testes em desktop)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class TestScene extends Phaser.Scene {
    create() {
        // Controles SEMPRE VISÍVEIS para testes
        this.mobileControls = new MobileControls(this, {
            alwaysShow: true,  // SEMPRE visível (mesmo em desktop)
            
            joystick: {
                enabled: true,
                alpha: 0.9  // Mais visível para debug
            },
            
            buttons: [
                { action: 'test1', label: 'T1', color: 0xFF0000, position: 'right-bottom' },
                { action: 'test2', label: 'T2', color: 0x00FF00, position: 'left-top' },
                { action: 'test3', label: 'T3', color: 0x0000FF, position: 'top' }
            ],
            
            buttonAlpha: 0.9  // Mais visível para debug
        });
        
        // Criar indicador visual de detecção
        const isMobile = this.mobileControls.isMobile;
        const text = this.add.text(10, 10, `Mobile: ${isMobile}`, {
            fontSize: '24px',
            color: isMobile ? '#00ff00' : '#ff0000'
        });
        text.setScrollFactor(0);
        text.setDepth(10000);
        
        // Player para testes
        this.player = this.physics.add.sprite(400, 300, 'player');
        
        // Debug no console
        console.log('[TestScene] Mobile Controls Info:', {
            isMobile: this.mobileControls.isMobile,
            hasJoystick: !!this.mobileControls.joystick,
            hasButtons: !!this.mobileControls.buttons,
            buttonCount: this.mobileControls.buttons?.buttons.length || 0
        });
    }
    
    update() {
        // Movimento de teste
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            
            console.log('Joystick:', { direction: dir, force: force });
            
            this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
        } else {
            this.player.setVelocity(0, 0);
        }
        
        // Teste de botões
        if (this.mobileControls.isButtonPressed('test1')) {
            console.log('Test 1 pressed');
        }
        if (this.mobileControls.isButtonPressed('test2')) {
            console.log('Test 2 pressed');
        }
        if (this.mobileControls.isButtonPressed('test3')) {
            console.log('Test 3 pressed');
        }
    }
}

// ============================================================================
// TEMPLATE 10: MINIMAL (O mais simples possível)
// ============================================================================

import { MobileControls } from './systems/ui/MobileControls.js';

export class MinimalScene extends Phaser.Scene {
    create() {
        this.mobileControls = new MobileControls(this);
        this.player = this.physics.add.sprite(400, 300, 'player');
    }
    
    update() {
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            this.player.setVelocity(dir.x * 200, dir.y * 200);
        } else {
            this.player.setVelocity(0, 0);
        }
    }
}

// ============================================================================
// DICA: Como Escolher o Template Certo
// ============================================================================

/*

TIPO DE JOGO                    TEMPLATE RECOMENDADO
───────────────────────────────────────────────────────────
RPG / Adventure                 Template 1 (TOP-DOWN RPG)
Plataforma                      Template 2 (PLATFORMER)
Primeiro projeto                Template 3 (SIMPLE)
Precisa customizar              Template 4 (CUSTOM)
Tem sprites próprios            Template 5 (WITH SPRITES)
Usa sistema de eventos          Template 6 (WITH EVENTS)
Tem sistema de diálogo          Template 7 (WITH DIALOGUE)
Beat em up / Luta               Template 8 (BEAT EM UP)
Testando/Desenvolvendo          Template 9 (TESTING)
Prototipagem rápida             Template 10 (MINIMAL)

*/
