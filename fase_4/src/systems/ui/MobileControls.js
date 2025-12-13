/**
 * ============================================================================
 * MOBILE CONTROLS - Sistema Unificado de Controles Virtuais
 * ============================================================================
 * 
 * Sistema completo e portátil de controles touch para jogos Phaser 3.
 * Inclui joystick virtual e botões de ação totalmente personalizáveis.
 * 
 * COMO USAR EM OUTRO PROJETO:
 * ----------------------------
 * 1. Copie este arquivo para seu projeto
 * 2. No seu arquivo de cena (scene):
 * 
 *    import { MobileControls } from './path/to/MobileControls.js';
 * 
 *    // Na função create():
 *    this.mobileControls = new MobileControls(this, {
 *        // Configurações opcionais
 *        joystick: {
 *            enabled: true,
 *            baseRadius: 60,
 *            stickRadius: 30,
 *            maxDistance: 50
 *        },
 *        buttons: [
 *            { action: 'interact', label: 'A', color: 0x00FF00 },
 *            { action: 'run', label: 'B', color: 0xFF0000 },
 *            { action: 'jump', label: 'X', color: 0x0000FF }
 *        ]
 *    });
 * 
 *    // Na função update():
 *    // Verificar joystick
 *    if (this.mobileControls.joystick.isActive()) {
 *        const direction = this.mobileControls.joystick.getDirection();
 *        const force = this.mobileControls.joystick.getForce();
 *        this.player.setVelocity(direction.x * 200 * force, direction.y * 200 * force);
 *    }
 * 
 *    // Verificar botões
 *    if (this.mobileControls.isButtonPressed('interact')) {
 *        // Executar ação de interação
 *    }
 * 
 * EVENTOS DISPONÍVEIS:
 * -------------------
 * - 'mobilecontrols-button-down': { action: string } - Botão pressionado
 * - 'mobilecontrols-button-up': { action: string } - Botão solto
 * - 'mobilecontrols-joystick-start': - Joystick começou a ser usado
 * - 'mobilecontrols-joystick-end': - Joystick parou de ser usado
 * 
 * @author Sistema de Controles Virtuais Unificado
 * @version 2.0
 * @license MIT
 */

// ============================================================================
// CLASSE PRINCIPAL - MOBILE CONTROLS
// ============================================================================

export class MobileControls {
    /**
     * Cria um sistema completo de controles virtuais
     * @param {Phaser.Scene} scene - A cena do Phaser
     * @param {Object} config - Configurações do sistema
     * @param {Object} config.joystick - Configurações do joystick
     * @param {boolean} config.joystick.enabled - Se o joystick está habilitado (padrão: true)
     * @param {number} config.joystick.baseRadius - Raio da base do joystick (padrão: 60)
     * @param {number} config.joystick.stickRadius - Raio do stick do joystick (padrão: 30)
     * @param {number} config.joystick.maxDistance - Distância máxima do stick (padrão: 50)
     * @param {number} config.joystick.alpha - Opacidade do joystick (padrão: 0.6)
     * @param {Array} config.buttons - Array de configuração dos botões
     * @param {string} config.buttons[].action - Nome da ação do botão
     * @param {string} config.buttons[].label - Texto a ser exibido no botão
     * @param {number} config.buttons[].color - Cor do botão (hexadecimal)
     * @param {string} config.buttons[].sprite - Chave do sprite (opcional)
     * @param {number} config.buttonRadius - Raio dos botões (padrão: 50)
     * @param {number} config.buttonAlpha - Opacidade dos botões (padrão: 0.8)
     * @param {boolean} config.autoDetectMobile - Detectar automaticamente mobile (padrão: true)
     * @param {boolean} config.alwaysShow - Sempre mostrar controles (padrão: false)
     */
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = this._mergeDefaultConfig(config);
        
        // Estado do sistema
        this.isMobile = this._detectMobile();
        this.enabled = true;
        this.visible = true;
        
        // Componentes
        this.joystick = null;
        this.buttons = null;
        
        // Criar controles se mobile ou se forçado
        if (this.isMobile || this.config.alwaysShow) {
            this._createControls();
        }
        
        console.log('[MobileControls] Sistema inicializado', {
            isMobile: this.isMobile,
            joystickEnabled: this.config.joystick.enabled,
            buttonCount: this.config.buttons.length
        });
    }
    
    /**
     * Mescla configurações do usuário com padrões
     * @private
     */
    _mergeDefaultConfig(userConfig) {
        const defaults = {
            joystick: {
                enabled: true,
                baseRadius: 60,
                stickRadius: 30,
                maxDistance: 50,
                alpha: 0.6,
                deadZone: 0.2
            },
            buttons: [
                { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
                { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' },
                { action: 'action', label: 'X', color: 0x0000FF, position: 'top' }
            ],
            buttonRadius: 50,
            buttonAlpha: 0.8,
            buttonSpacing: 20,
            autoDetectMobile: true,
            alwaysShow: false
        };
        
        // Merge profundo
        return {
            ...defaults,
            ...userConfig,
            joystick: { ...defaults.joystick, ...(userConfig.joystick || {}) },
            buttons: userConfig.buttons || defaults.buttons
        };
    }
    
    /**
     * Detecta se está em dispositivo móvel
     * @private
     */
    _detectMobile() {
        if (!this.config.autoDetectMobile) return true;
        
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }
    
    /**
     * Cria os controles virtuais
     * @private
     */
    _createControls() {
        // Criar joystick se habilitado
        if (this.config.joystick.enabled) {
            this.joystick = new VirtualJoystick(this.scene, this.config.joystick);
        }
        
        // Criar botões
        if (this.config.buttons.length > 0) {
            this.buttons = new VirtualButtonsManager(this.scene, {
                buttons: this.config.buttons,
                buttonRadius: this.config.buttonRadius,
                buttonAlpha: this.config.buttonAlpha,
                spacing: this.config.buttonSpacing
            });
        }
    }
    
    /**
     * Verifica se um botão está pressionado
     * @param {string} action - Nome da ação do botão
     * @returns {boolean}
     */
    isButtonPressed(action) {
        return this.buttons ? this.buttons.isButtonDown(action) : false;
    }
    
    /**
     * Mostra todos os controles
     */
    show() {
        this.visible = true;
        if (this.joystick) this.joystick.show();
        if (this.buttons) this.buttons.show();
    }
    
    /**
     * Esconde todos os controles
     */
    hide() {
        this.visible = false;
        if (this.joystick) this.joystick.hide();
        if (this.buttons) this.buttons.hide();
    }
    
    /**
     * Habilita os controles
     */
    enable() {
        this.enabled = true;
        if (this.joystick) this.joystick.enable();
        if (this.buttons) this.buttons.enable();
    }
    
    /**
     * Desabilita os controles
     */
    disable() {
        this.enabled = false;
        if (this.joystick) this.joystick.disable();
        if (this.buttons) this.buttons.disable();
    }
    
    /**
     * Destrói todos os controles e limpa eventos
     */
    destroy() {
        if (this.joystick) this.joystick.destroy();
        if (this.buttons) this.buttons.destroy();
    }
}

// ============================================================================
// CLASSE: VIRTUAL JOYSTICK
// ============================================================================

class VirtualJoystick {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        
        // Estado
        this.direction = { x: 0, y: 0 };
        this.angle = 0;
        this.distance = 0;
        this.isDragging = false;
        this.pointer = null;
        this.disabled = false;
        
        // Posição fixa do joystick (canto inferior esquerdo)
        const margin = 100;
        this.baseX = margin;
        this.baseY = scene.scale.height - margin;
        
        // Criar elementos visuais
        this._createVisuals();
        
        // Configurar interação
        this._setupInteraction();
        
        // Inicialmente visível
        this.show();
    }
    
    _createVisuals() {
        const { baseRadius, stickRadius, alpha } = this.config;
        
        // Base do joystick - posição fixa
        this.base = this.scene.add.circle(this.baseX, this.baseY, baseRadius, 0x333333, alpha);
        this.base.setStrokeStyle(2, 0xffffff, alpha);
        this.base.setScrollFactor(0);
        this.base.setDepth(1000);
        
        // Stick do joystick - começa na mesma posição da base
        this.stick = this.scene.add.circle(this.baseX, this.baseY, stickRadius, 0x666666, alpha + 0.2);
        this.stick.setStrokeStyle(2, 0xffffff, alpha + 0.2);
        this.stick.setScrollFactor(0);
        this.stick.setDepth(1001);
    }
    
    _setupInteraction() {
        this.scene.input.on('pointerdown', this._onPointerDown, this);
        this.scene.input.on('pointermove', this._onPointerMove, this);
        this.scene.input.on('pointerup', this._onPointerUp, this);
    }
    
    _onPointerDown(pointer) {
        if (this.disabled) return;
        
        // Verifica se o toque está perto do joystick (raio de ativação maior)
        const activationRadius = 150; // Área maior para facilitar o uso
        const dx = pointer.x - this.baseX;
        const dy = pointer.y - this.baseY;
        const distToJoystick = Math.sqrt(dx * dx + dy * dy);
        
        if (distToJoystick < activationRadius) {
            this.isDragging = true;
            this.pointer = pointer;
            
            // Joystick fica sempre na posição fixa
            // Não altera baseX e baseY
            
            // Torna mais opaco quando ativo
            this.base.setAlpha(0.8);
            this.stick.setAlpha(1);
            
            // Emite evento
            this.scene.events.emit('mobilecontrols-joystick-start');
        }
    }
    
    _onPointerMove(pointer) {
        if (this.disabled || !this.isDragging || this.pointer !== pointer) return;
        
        // Calcula diferença
        const dx = pointer.x - this.baseX;
        const dy = pointer.y - this.baseY;
        
        // Calcula distância e ângulo
        const totalDist = Math.sqrt(dx * dx + dy * dy);
        this.distance = Math.min(totalDist, this.config.maxDistance);
        this.angle = Math.atan2(dy, dx);
        
        // Calcula direção normalizada
        if (totalDist > 0) {
            this.direction.x = dx / totalDist;
            this.direction.y = dy / totalDist;
        }
        
        // Posiciona o stick
        const limitedX = this.baseX + Math.cos(this.angle) * this.distance;
        const limitedY = this.baseY + Math.sin(this.angle) * this.distance;
        this.stick.setPosition(limitedX, limitedY);
    }
    
    _onPointerUp(pointer) {
        if (this.pointer === pointer) {
            this.isDragging = false;
            this.pointer = null;
            this._reset();
            
            // Volta à opacidade original
            this.base.setAlpha(this.config.alpha);
            this.stick.setAlpha(this.config.alpha);
            
            // Emite evento
            this.scene.events.emit('mobilecontrols-joystick-end');
        }
    }
    
    _reset() {
        this.direction.x = 0;
        this.direction.y = 0;
        this.distance = 0;
        this.angle = 0;
        // Stick volta para o centro da base (posição fixa)
        this.stick.setPosition(this.baseX, this.baseY);
    }
    
    /**
     * Retorna a direção atual do joystick
     * @returns {{ x: number, y: number }} Vetor normalizado
     */
    getDirection() {
        return this.direction;
    }
    
    /**
     * Retorna a força/intensidade (0 a 1)
     * @returns {number}
     */
    getForce() {
        const force = this.distance / this.config.maxDistance;
        return force < this.config.deadZone ? 0 : force;
    }
    
    /**
     * Verifica se o joystick está sendo usado
     * @returns {boolean}
     */
    isActive() {
        return this.isDragging && !this.disabled && this.getForce() > 0;
    }
    
    show() {
        this.base.setVisible(true);
        this.stick.setVisible(true);
    }
    
    hide() {
        this.base.setVisible(false);
        this.stick.setVisible(false);
    }
    
    disable() {
        this.disabled = true;
        if (this.isDragging) {
            this.isDragging = false;
            this.pointer = null;
            this._reset();
        }
        this.hide();
    }
    
    enable() {
        this.disabled = false;
    }
    
    destroy() {
        this.scene.input.off('pointerdown', this._onPointerDown, this);
        this.scene.input.off('pointermove', this._onPointerMove, this);
        this.scene.input.off('pointerup', this._onPointerUp, this);
        this.base.destroy();
        this.stick.destroy();
    }
}

// ============================================================================
// CLASSE: VIRTUAL BUTTONS MANAGER
// ============================================================================

class VirtualButtonsManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        
        // Estado
        this.buttons = [];
        this.activeButtons = new Set();
        this.disabled = false;
        
        // Criar botões
        this._createButtons();
    }
    
    _createButtons() {
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;
        const margin = 80;
        const spacing = this.config.spacing;
        const radius = this.config.buttonRadius;
        
        // Mapear posições para cada botão
        const positions = {
            'right-bottom': { x: screenWidth - margin, y: screenHeight - margin },
            'left-top': { x: screenWidth - margin - (radius * 2 + spacing), y: screenHeight - margin - 40 },
            'top': { x: screenWidth - margin, y: screenHeight - margin - (radius * 2 + spacing) },
            'right-top': { x: screenWidth - margin, y: screenHeight - margin - (radius * 2 + spacing) },
            'left-bottom': { x: screenWidth - margin - (radius * 2 + spacing), y: screenHeight - margin }
        };
        
        // Criar cada botão
        this.config.buttons.forEach((buttonConfig, index) => {
            const position = positions[buttonConfig.position] || positions['right-bottom'];
            
            // Ajustar posição se necessário (para evitar sobreposição)
            const x = position.x;
            const y = position.y;
            
            const button = this._createButton(x, y, buttonConfig);
            this.buttons.push(button);
        });
    }
    
    _createButton(x, y, config) {
        const { action, label, color, sprite } = config;
        const radius = this.config.buttonRadius;
        const alpha = this.config.buttonAlpha;
        
        // Container do botão
        const container = this.scene.add.container(x, y);
        container.setScrollFactor(0);
        container.setDepth(10000);
        
        let visual;
        let originalScale = 1;
        
        // Criar visual (sprite ou círculo)
        if (sprite && this.scene.textures.exists(sprite)) {
            visual = this.scene.add.image(0, 0, sprite);
            visual.setAlpha(alpha);
            originalScale = (radius * 2) / visual.width;
            visual.setScale(originalScale);
        } else {
            visual = this.scene.add.circle(0, 0, radius, color, alpha);
            visual.setStrokeStyle(3, 0xffffff, alpha);
            
            // Adicionar texto
            const text = this.scene.add.text(0, 0, label, {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            text.setOrigin(0.5, 0.5);
            container.add(text);
        }
        
        container.add(visual);
        
        // Tornar interativo
        const hitArea = new Phaser.Geom.Circle(0, 0, radius * 1.5);
        container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
        
        // Eventos
        container.on('pointerdown', () => this._onButtonDown(action, visual, originalScale));
        container.on('pointerup', () => this._onButtonUp(action, visual, originalScale, alpha));
        container.on('pointerout', () => this._onButtonUp(action, visual, originalScale, alpha));
        
        return {
            container,
            visual,
            action,
            originalScale,
            originalAlpha: alpha
        };
    }
    
    _onButtonDown(action, visual, originalScale) {
        if (this.disabled) return;
        
        // Feedback visual
        visual.setAlpha(1);
        visual.setScale(originalScale * 0.9);
        
        // Marcar como ativo
        this.activeButtons.add(action);
        
        // Emitir evento
        this.scene.events.emit('mobilecontrols-button-down', { action });
    }
    
    _onButtonUp(action, visual, originalScale, originalAlpha) {
        // Resetar visual
        visual.setAlpha(originalAlpha);
        visual.setScale(originalScale);
        
        // Desmarcar
        this.activeButtons.delete(action);
        
        // Emitir evento
        this.scene.events.emit('mobilecontrols-button-up', { action });
    }
    
    /**
     * Verifica se um botão está pressionado
     * @param {string} action
     * @returns {boolean}
     */
    isButtonDown(action) {
        return this.activeButtons.has(action) && !this.disabled;
    }
    
    show() {
        this.buttons.forEach(button => button.container.setVisible(true));
    }
    
    hide() {
        this.buttons.forEach(button => button.container.setVisible(false));
    }
    
    disable() {
        this.disabled = true;
        this.activeButtons.clear();
    }
    
    enable() {
        this.disabled = false;
    }
    
    destroy() {
        this.buttons.forEach(button => {
            button.container.removeAllListeners();
            button.container.destroy();
        });
        this.buttons = [];
        this.activeButtons.clear();
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export { VirtualJoystick, VirtualButtonsManager };
