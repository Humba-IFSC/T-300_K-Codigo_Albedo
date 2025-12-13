/**
 * VirtualButtons - Botões virtuais para ações em dispositivos móveis
 * 
 * Cria botões touch na tela para ações como interagir, correr, usar itens, etc.
 */
export class VirtualButtons {
    /**
     * @param {Phaser.Scene} scene - A cena onde os botões serão criados
     * @param {Object} options - Opções de configuração
     */
    constructor(scene, options = {}) {
        console.log('[VirtualButtons] Construtor iniciado');
        this.scene = scene;
        
        // Configurações - VALORES MAIORES PARA VISIBILIDADE
        this.buttonRadius = options.buttonRadius || 50;  // Aumentado de 35 para 50
        this.alpha = options.alpha || 1.0;  // Opacidade máxima
        this.spacing = options.spacing || 20;
        
        // Array para armazenar os botões
        this.buttons = [];
        
        // Estado dos botões
        this.activeButtons = new Set();
        
        // Criar botões
        this.createButtons();
        console.log('[VirtualButtons] Construtor finalizado,', this.buttons.length, 'botões criados');
        
        // Garantir que começam visíveis
        this.show();
    }
    
    createButtons() {
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;
        
        // Posições dos botões (canto inferior direito)
        const rightMargin = 80;
        const bottomMargin = 80;
        
        // Botão de Interação (A) - Mais à direita e mais baixo
        this.interactButton = this.createButton(
            screenWidth - rightMargin,
            screenHeight - bottomMargin,
            'button_a',
            'interact'
        );
        
        // Botão de Correr (B) - À esquerda do botão A e um pouco acima
        this.runButton = this.createButton(
            screenWidth - rightMargin - (this.buttonRadius * 2 + this.spacing),
            screenHeight - bottomMargin - 40,
            'button_b',
            'run'
        );
        
        // Botão de Ação Extra (X) - Acima do botão A
        this.actionButton = this.createButton(
            screenWidth - rightMargin,
            screenHeight - bottomMargin - (this.buttonRadius * 2 + this.spacing),
            'button_x',
            'action'
        );
    }
    
    createButton(x, y, spriteKey, action) {
        console.log('[VirtualButtons] Criando botão:', action, 'em', x, y, 'com sprite:', spriteKey);
        
        // Container para o botão
        const container = this.scene.add.container(x, y);
        container.setScrollFactor(0);
        container.setDepth(10000);  // DEPTH MUITO ALTO para ficar no topo
        
        let sprite;
        let scale;
        
        // Verificar se a textura existe
        if (this.scene.textures.exists(spriteKey)) {
            console.log('[VirtualButtons] Usando sprite:', spriteKey);
            // Sprite do botão
            sprite = this.scene.add.image(0, 0, spriteKey);
            sprite.setAlpha(this.alpha);
            
            // Escalar o sprite para o tamanho desejado
            scale = (this.buttonRadius * 2) / sprite.width;
            sprite.setScale(scale);
            
            console.log('[VirtualButtons] Sprite carregado - tamanho:', sprite.width, 'escala:', scale);
        } else {
            console.warn('[VirtualButtons] Sprite não encontrado, usando círculo:', spriteKey);
            // Fallback para círculo GRANDE e BEM VISÍVEL
            sprite = this.scene.add.circle(0, 0, this.buttonRadius, 0xFF0000, 1.0);  // VERMELHO FORTE
            sprite.setStrokeStyle(5, 0xFFFFFF, 1.0);  // BORDA BRANCA GROSSA
            scale = 1;
            
            // Adicionar texto GRANDE
            const label = action === 'interact' ? 'A' : action === 'run' ? 'B' : 'X';
            const text = this.scene.add.text(0, 0, label, {
                fontSize: '32px',  // Fonte maior
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            text.setOrigin(0.5, 0.5);
            container.add(text);
        }
        
        // Adicionar sprite ao container
        container.add(sprite);
        
        // Tornar container interativo
        const hitAreaRadius = this.buttonRadius * 1.5; // Área maior para facilitar toque
        const hitArea = new Phaser.Geom.Circle(0, 0, hitAreaRadius);
        container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
        
        console.log('[VirtualButtons] Container criado em', x, y, 'depth:', container.depth, 'visível:', container.visible);
        
        // Configurar eventos no container
        container.on('pointerdown', (pointer, localX, localY, event) => {
            // CRÍTICO: Parar propagação para evitar que o evento chegue à hotbar
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            this.onButtonDown(action, sprite, scale);
        });
        
        container.on('pointerup', (pointer, localX, localY, event) => {
            // CRÍTICO: Parar propagação
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            this.onButtonUp(action, sprite, scale);
        });
        
        container.on('pointerout', (pointer, localX, localY, event) => {
            // CRÍTICO: Parar propagação
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            this.onButtonUp(action, sprite, scale);
        });
        
        // Armazenar referência
        const button = {
            container,
            sprite,
            action,
            originalAlpha: this.alpha,
            originalScale: scale
        };
        
        this.buttons.push(button);
        
        return button;
    }
    
    onButtonDown(action, sprite, originalScale) {
        console.log('[VirtualButtons] Botão pressionado:', action);
        
        // IMPORTANTE: Bloquear área clicável da hotbar imediatamente
        if (this.scene.hotbar && this.scene.hotbar.lockClick) {
            this.scene.hotbar.lockClick(500);
        }
        
        // Feedback visual - aumentar opacidade e diminuir escala
        sprite.setAlpha(1);
        sprite.setScale(sprite.scale * 0.9);
        
        // Marcar botão como ativo
        this.activeButtons.add(action);
        
        // Emitir evento para a cena
        console.log('[VirtualButtons] Emitindo evento virtualbutton-down');
        this.scene.events.emit('virtualbutton-down', action);
    }
    
    onButtonUp(action, sprite, originalScale) {
        // Resetar visual - voltar opacidade e escala originais
        const button = this.buttons.find(b => b.action === action);
        if (button) {
            sprite.setAlpha(button.originalAlpha);
            sprite.setScale(button.originalScale);
        }
        
        // Remover da lista de ativos
        this.activeButtons.delete(action);
        
        // Emitir evento para a cena
        this.scene.events.emit('virtualbutton-up', action);
    }
    
    /**
     * Verifica se um botão específico está pressionado
     * @param {string} action - Nome da ação
     * @returns {boolean}
     */
    isButtonDown(action) {
        return this.activeButtons.has(action);
    }
    
    /**
     * Mostra todos os botões
     */
    show() {
        console.log('[VirtualButtons] Mostrando', this.buttons.length, 'botões');
        this.buttons.forEach(button => {
            button.container.setVisible(true);
            console.log('[VirtualButtons] Botão', button.action, 'visível em', button.container.x, button.container.y);
        });
    }
    
    /**
     * Esconde todos os botões
     */
    hide() {
        this.buttons.forEach(button => {
            button.container.setVisible(false);
        });
    }
    
    /**
     * Define a visibilidade de um botão específico
     * @param {string} action - Nome da ação
     * @param {boolean} visible - Visível ou não
     */
    setButtonVisible(action, visible) {
        const button = this.buttons.find(b => b.action === action);
        if (button) {
            button.container.setVisible(visible);
        }
    }
    
    /**
     * Retorna todos os elementos visuais para registro na UI
     * @returns {Array} Array com containers dos botões
     */
    getElements() {
        return this.buttons.map(b => b.container);
    }
    
    /**
     * Esconde todos os botões
     */
    hide() {
        console.log('[VirtualButtons] Escondendo', this.buttons.length, 'botões');
        this.buttons.forEach(button => {
            button.container.setVisible(false);
            console.log('[VirtualButtons] Botão', button.action, 'escondido');
        });
    }
    
    /**
     * Mostra todos os botões
     */
    show() {
        console.log('[VirtualButtons] Mostrando', this.buttons.length, 'botões');
        this.buttons.forEach(button => {
            button.container.setVisible(true);
            console.log('[VirtualButtons] Botão', button.action, 'visível em', button.container.x, button.container.y);
        });
    }
    
    /**
     * Destrói todos os botões e limpa eventos
     */
    destroy() {
        this.buttons.forEach(button => {
            button.container.removeAllListeners();
            button.container.destroy();
        });
        this.buttons = [];
        this.activeButtons.clear();
    }
}
