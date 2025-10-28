/**
 * VirtualJoystick - Joystick virtual para controle touch em dispositivos móveis
 * 
 * Cria um joystick visual na tela que permite controlar o movimento do jogador
 * através de gestos de toque (drag).
 */
export class VirtualJoystick {
    /**
     * @param {Phaser.Scene} scene - A cena onde o joystick será criado
     * @param {number} x - Posição X do joystick na tela
     * @param {number} y - Posição Y do joystick na tela
     * @param {Object} options - Opções de configuração
     */
    constructor(scene, x, y, options = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Configurações
        this.baseRadius = options.baseRadius || 60;
        this.stickRadius = options.stickRadius || 30;
        this.maxDistance = options.maxDistance || 50;
        this.alpha = options.alpha || 0.6;
        
        // Estado do joystick
        this.direction = { x: 0, y: 0 };
        this.angle = 0;
        this.distance = 0;
        this.isDragging = false;
        this.pointer = null;
        this.disabled = false;  // Controla se está desabilitado (ex: durante diálogos)
        
        // Criar elementos visuais
        this.createVisuals();
        
        // Configurar interação
        this.setupInteraction();
        
        // SEMPRE VISÍVEL para teste
        this.show();
    }
    
    createVisuals() {
        // Base do joystick (círculo externo)
        this.base = this.scene.add.circle(this.x, this.y, this.baseRadius, 0x333333, this.alpha);
        this.base.setStrokeStyle(2, 0xffffff, this.alpha);
        this.base.setScrollFactor(0);
        this.base.setDepth(1000);
        
        // Stick do joystick (círculo interno móvel)
        this.stick = this.scene.add.circle(this.x, this.y, this.stickRadius, 0x666666, this.alpha + 0.2);
        this.stick.setStrokeStyle(2, 0xffffff, this.alpha + 0.2);
        this.stick.setScrollFactor(0);
        this.stick.setDepth(1001);
    }
    
    setupInteraction() {
        // Configurar input touch para a cena
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
    }
    
    onPointerDown(pointer) {
        // Não responde se estiver desabilitado
        if (this.disabled) return;
        
        // Só ativa o joystick se tocar na metade esquerda da tela
        // E se não for em um botão interativo
        if (pointer.x < this.scene.scale.width / 2) {
            console.log('[VirtualJoystick] Pointer down em', pointer.x, pointer.y);
            this.isDragging = true;
            this.pointer = pointer;
            
            // Posicionar joystick onde tocou
            this.x = pointer.x;
            this.y = pointer.y;
            this.base.setPosition(this.x, this.y);
            this.stick.setPosition(this.x, this.y);
            
            // GARANTIR que está visível
            this.base.setVisible(true);
            this.stick.setVisible(true);
            
            // Tornar mais visível quando ativo
            this.base.setAlpha(0.8);
            this.stick.setAlpha(1);
        }
    }
    
    onPointerMove(pointer) {
        if (this.disabled || !this.isDragging || this.pointer !== pointer) return;
        
        console.log('[VirtualJoystick] Movendo joystick');
        
        // Calcular diferença entre posição atual e centro do joystick
        const dx = pointer.x - this.x;
        const dy = pointer.y - this.y;
        
        // Calcular distância e ângulo
        this.distance = Math.min(Math.sqrt(dx * dx + dy * dy), this.maxDistance);
        this.angle = Math.atan2(dy, dx);
        
        // Calcular direção normalizada
        const totalDist = Math.sqrt(dx * dx + dy * dy);
        if (totalDist > 0) {
            this.direction.x = dx / totalDist;
            this.direction.y = dy / totalDist;
        }
        
        // Limitar distância do stick
        const limitedX = this.x + Math.cos(this.angle) * this.distance;
        const limitedY = this.y + Math.sin(this.angle) * this.distance;
        
        this.stick.setPosition(limitedX, limitedY);
    }
    
    onPointerUp(pointer) {
        if (this.pointer === pointer) {
            console.log('[VirtualJoystick] Pointer up');
            this.isDragging = false;
            this.pointer = null;
            this.reset();
            // Deixar semi-transparente quando inativo
            this.base.setAlpha(this.alpha);
            this.stick.setAlpha(this.alpha);
        }
    }
    
    reset() {
        // Resetar direção e posição
        this.direction.x = 0;
        this.direction.y = 0;
        this.distance = 0;
        this.angle = 0;
        
        // Retornar stick ao centro
        this.stick.setPosition(this.x, this.y);
    }
    
    show() {
        this.base.setVisible(true);
        this.stick.setVisible(true);
    }
    
    hide() {
        this.base.setVisible(false);
        this.stick.setVisible(false);
    }
    
    /**
     * Retorna a direção atual do joystick
     * @returns {{ x: number, y: number }} Vetor de direção normalizado
     */
    getDirection() {
        return this.direction;
    }
    
    /**
     * Retorna a força/intensidade do movimento (0 a 1)
     * @returns {number} Força do movimento
     */
    getForce() {
        return Math.min(this.distance / this.maxDistance, 1);
    }
    
    /**
     * Verifica se o joystick está sendo usado
     * @returns {boolean}
     */
    isActive() {
        return this.isDragging && !this.disabled;
    }
    
    /**
     * Retorna os elementos visuais para registro na UI
     * @returns {Array} Array com elementos gráficos
     */
    getElements() {
        return [this.base, this.stick];
    }
    
    /**
     * Desabilita o joystick
     */
    disable() {
        this.disabled = true;
        // Reseta estado se estava sendo usado
        if (this.isDragging) {
            this.isDragging = false;
            this.pointer = null;
        }
        this.direction = { x: 0, y: 0 };
        this.force = 0;
        this.stick.x = this.base.x;
        this.stick.y = this.base.y;
        
        // SEMPRE esconde quando desabilita (ex: durante diálogo)
        this.base.setVisible(false);
        this.stick.setVisible(false);
    }
    
    /**
     * Habilita o joystick
     */
    enable() {
        this.disabled = false;
        // Não mostra automaticamente - aparecerá no próximo toque
    }
    
    /**
     * Destrói o joystick e limpa eventos
     */
    destroy() {
        this.scene.input.off('pointerdown', this.onPointerDown, this);
        this.scene.input.off('pointermove', this.onPointerMove, this);
        this.scene.input.off('pointerup', this.onPointerUp, this);
        
        this.base.destroy();
        this.stick.destroy();
    }
}
