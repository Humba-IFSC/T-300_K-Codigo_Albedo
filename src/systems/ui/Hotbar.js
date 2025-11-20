export class Hotbar {
    constructor(scene, slotCount = 5, { inactivityMs = 3000, bottomMargin = 14 } = {}) {
        this.scene = scene;
        this.slotCount = slotCount;
        this.selectedIndex = 0;
        this.items = new Array(slotCount).fill(null); // Array para armazenar itens
        this.slots = [];
        this.itemSprites = [];
        this.inactivityMs = inactivityMs;
        this.hidden = false;
        this.suppressed = false;
        this.hideTimer = null;
        this.animating = false;
        this.isOpen = false; // Controla se está aberta manualmente
        this.clickLocked = false; // Previne cliques acidentais da hotbar

        // Configuração dos slots
        const slotSize = 80;
        this.slotSize = slotSize;
        const spacing = 22;
        const totalWidth = (slotSize * slotCount) + spacing * (slotCount - 1);
        const startX = (scene.scale.width - totalWidth) / 2;
        let y = scene.scale.height - slotSize - bottomMargin;
        if (y < 4) y = 4;
        this.baseY = y;
        this.offscreenY = scene.scale.height + slotSize + 10;

        // Criar slots
        for (let i = 0; i < slotCount; i++) {
            const x = startX + i * (slotSize + spacing);
            const slot = scene.add.rectangle(x, this.baseY, slotSize, slotSize, 0x000000, 0.6)
                .setStrokeStyle(5, 0xffffff)
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setDepth(15000); // Aumentado para ficar acima dos botões virtuais (10000)
            
            // Fazer a câmera principal ignorar o slot (renderizar apenas na câmera de UI)
            if (scene.cameras && scene.cameras.main) {
                scene.cameras.main.ignore(slot);
            }
            
            // Tornar slots clicáveis
            slot.setInteractive();
            slot.on('pointerdown', () => {
                if (!this.suppressed && !this.scene.dialogue?.active) {
                    this.select(i);
                }
            });
            
            this.slots.push(slot);
            this.itemSprites.push(null); // Inicializa array de sprites
        }

        // Highlight para slot selecionado
        this.highlight = scene.add.rectangle(
            this.slots[0].x, this.slots[0].y, slotSize, slotSize,
            0xffffff, 0.16
        ).setStrokeStyle(7, 0xffff88)
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setDepth(15001); // Aumentado para ficar acima dos slots

        // Fazer a câmera principal ignorar o highlight (renderizar apenas na câmera de UI)
        if (scene.cameras && scene.cameras.main) {
            scene.cameras.main.ignore(this.highlight);
        }

        // Criar área clicável INVISÍVEL apenas no CENTRO da parte inferior
        // Evita overlap com joystick (esquerda) e botões (direita)
        const clickableWidth = scene.scale.width * 0.3; // REDUZIDO: 30% da largura (apenas centro)
        const clickableHeight = 60; // Altura da área clicável
        const clickableY = scene.scale.height - clickableHeight / 2;
        
        this.clickableArea = scene.add.rectangle(
            scene.scale.width / 2,  // Centralizado
            clickableY, 
            clickableWidth,  // Apenas 30% da largura (MENOR para evitar overlap)
            clickableHeight, 
            0x000000, 
            0 // Completamente transparente
        );
        this.clickableArea.setScrollFactor(0).setDepth(9000); // DEPTH MENOR que botões virtuais (10000)
        this.clickableArea.setInteractive();
        this.clickableArea.on('pointerdown', (pointer, localX, localY, event) => {
            // IMPORTANTE: Verificar se o clique está bloqueado
            if (this.clickLocked) {
                console.log('[Hotbar] Clique bloqueado (clickLocked=true)');
                return;
            }
            
            console.log('[Hotbar] Área central inferior clicada!');
            // Parar propagação para evitar conflitos
            event.stopPropagation();
            this.toggleOpen();
        });
        
        // Fazer a câmera principal ignorar a área clicável (renderizar apenas na câmera de UI)
        if (scene.cameras && scene.cameras.main) {
            scene.cameras.main.ignore(this.clickableArea);
        }
        
        // Guardar posição inicial da área para animações
        this.clickableAreaInitialY = clickableY;
        
        // Criar apenas a SETA (sem círculo de fundo)
        const toggleButtonY = scene.scale.height - 30;
        
        this.toggleArrow = scene.add.text(scene.scale.width / 2, toggleButtonY, '▲', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.toggleArrow.setScrollFactor(0).setDepth(15003); // Acima da área clicável
        
        // Fazer a câmera principal ignorar a seta (renderizar apenas na câmera de UI)
        if (scene.cameras && scene.cameras.main) {
            scene.cameras.main.ignore(this.toggleArrow);
        }
        
        // Guardar posição inicial da seta para animações
        this.toggleArrowInitialY = toggleButtonY;
        
        // Todos os objetos da hotbar (sem incluir o toggle button)
        this.allObjects = [...this.slots, this.highlight];
        this.initialYs = this.allObjects.map(o => o.y);

        // Iniciar escondida
        this.allObjects.forEach(o => { o.y = this.offscreenY; });
        this.hidden = true;

        // Input para selecionar slots
        scene.input.keyboard.on('keydown', (e) => {
            if (scene.dialogue?.active) return;
            if (e.code.startsWith('Digit')) {
                const n = parseInt(e.code.replace('Digit', ''));
                if (n >= 1 && n <= slotCount) {
                    if (this.suppressed) return;
                    if (!this.isOpen) {
                        this.showAnimated();
                    }
                    this.select(n - 1);
                }
            }
        });

        if (!this.hidden) this._registerInteraction();
    }

    /**
     * Bloqueia temporariamente cliques na área clicável
     * Usado para prevenir abertura acidental ao usar botões virtuais
     */
    lockClick(duration = 300) {
        this.clickLocked = true;
        console.log('[Hotbar] Clique bloqueado por', duration, 'ms');
        
        if (this.unlockTimer) {
            this.unlockTimer.remove(false);
        }
        
        this.unlockTimer = this.scene.time.delayedCall(duration, () => {
            this.clickLocked = false;
            console.log('[Hotbar] Clique desbloqueado');
        });
    }

    /**
     * Alterna entre aberto e fechado manualmente
     */
    toggleOpen() {
        // Não permitir abrir durante diálogos
        if (this.scene.dialogue?.active) {
            console.log('[Hotbar] Não é possível abrir durante diálogo');
            return;
        }
        
        // Não permitir abrir se há um interactable ativo (ex: placa)
        if (this.scene.currentInteractable) {
            console.log('[Hotbar] Não é possível abrir perto de interactable:', this.scene.currentInteractable);
            return;
        }
        
        if (this.suppressed) return;
        
        if (this.isOpen) {
            this.closeManually();
        } else {
            this.openManually();
        }
    }

    /**
     * Abre a hotbar manualmente e esconde controles
     */
    openManually() {
        if (this.isOpen || this.suppressed || this.scene.dialogue?.active) return;
        
        console.log('[Hotbar] Abrindo manualmente');
        this.isOpen = true;
        
        // Cancela timer de auto-hide
        if (this.hideTimer) this.hideTimer.remove(false);
        
        // Desabilita joystick para evitar interferência
        if (this.scene.virtualJoystick) {
            this.scene.virtualJoystick.disabled = true;
            console.log('[Hotbar] Joystick desabilitado');
        }
        
        // Mantém botões virtuais visíveis e funcionais
        
        // Mostra hotbar
        this.showAnimated();
        
        // Atualiza seta
        this.toggleArrow.setText('▼');
        
        // Anima seta para subir junto com a hotbar (mais próxima)
        const targetY = this.baseY - 20; // Mais perto da hotbar (era -60)
        this.scene.tweens.add({
            targets: this.toggleArrow,
            y: targetY,
            duration: 320,
            ease: 'Sine.easeOut'
        });
        
        // Anima área clicável para subir junto
        const areaTargetY = targetY - 20; // Centralizada na seta
        this.scene.tweens.add({
            targets: this.clickableArea,
            y: areaTargetY,
            duration: 320,
            ease: 'Sine.easeOut'
        });
    }

    /**
     * Fecha a hotbar manualmente e mostra controles
     */
    closeManually() {
        if (!this.isOpen) return;
        
        console.log('[Hotbar] Fechando manualmente');
        this.isOpen = false;
        
        // Reabilita joystick
        if (this.scene.virtualJoystick) {
            this.scene.virtualJoystick.disabled = false;
            console.log('[Hotbar] Joystick reabilitado');
        }
        
        // Esconde hotbar
        this.hideAnimated();
        
        // Atualiza seta
        this.toggleArrow.setText('▲');
        
        // Anima seta para voltar à posição original
        this.scene.tweens.add({
            targets: this.toggleArrow,
            y: this.toggleArrowInitialY,
            duration: 350,
            ease: 'Sine.easeIn'
        });
        
        // Anima área clicável para voltar
        this.scene.tweens.add({
            targets: this.clickableArea,
            y: this.clickableAreaInitialY,
            duration: 350,
            ease: 'Sine.easeIn'
        });
    }

    _registerInteraction() {
        if (this.hideTimer) this.hideTimer.remove(false);
        if (this.suppressed || this.isOpen) return; // Não auto-esconder se aberta manualmente
        this.hideTimer = this.scene.time.delayedCall(this.inactivityMs, () => this.hideAnimated());
    }

    select(index) {
        this.selectedIndex = index;
        const slot = this.slots[index];
        this.highlight.setPosition(slot.x, slot.y);
        this._registerInteraction();
    }

    showAnimated() {
        if (!this.hidden || this.suppressed || this.animating) {
            this._registerInteraction();
            return;
        }
        console.log(`[Hotbar] Iniciando animação de exibição`);
        this.hidden = false;
        this.animating = true;
        
        // Animar slots e highlight
        this.allObjects.forEach((obj, i) => {
            this.scene.tweens.add({
                targets: obj,
                y: this.initialYs[i],
                duration: 320,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    if (i === this.allObjects.length - 1) {
                        this.animating = false;
                        if (!this.isOpen) {
                            this._registerInteraction();
                        }
                        console.log(`[Hotbar] Animação de exibição completa`);
                    }
                }
            });
        });

        // Animar sprites de itens JUNTO com os slots
        this.itemSprites.forEach((sprite, i) => {
            if (sprite) {
                // Usar a posição final do slot (initialYs) + offset do centro
                const targetY = this.initialYs[i] + this.slotSize / 2;
                this.scene.tweens.add({
                    targets: sprite,
                    y: targetY,
                    duration: 320,
                    ease: 'Sine.easeOut'
                });
            }
        });
    }

    hideAnimated() {
        if (this.hidden || this.suppressed || this.animating || this.isOpen) return; // Não esconder se aberta manualmente
        this.hidden = true;
        this.animating = true;
        
        // Animar slots e highlight
        this.allObjects.forEach((obj, i) => {
            this.scene.tweens.add({
                targets: obj,
                y: this.offscreenY,
                duration: 350,
                ease: 'Sine.easeIn',
                onComplete: () => {
                    if (i === this.allObjects.length - 1) {
                        this.animating = false;
                    }
                }
            });
        });

        // Animar sprites de itens JUNTO com os slots
        this.itemSprites.forEach(sprite => {
            if (sprite) {
                this.scene.tweens.add({
                    targets: sprite,
                    y: this.offscreenY,
                    duration: 350,
                    ease: 'Sine.easeIn'
                });
            }
        });
    }

    // Novo método para reposicionar sprites baseado na posição dos slots
    repositionSprites() {
        this.itemSprites.forEach((sprite, i) => {
            if (sprite) {
                const slot = this.slots[i];
                const centerY = slot.y + slot.height / 2;
                sprite.y = centerY;
            }
        });
    }

    suppress() {
        if (this.suppressed) return;
        if (this.hideTimer) this.hideTimer.remove(false);
        this.suppressed = true;
        this.allObjects.forEach(o => { o.setVisible(false); o.active = false; });
        this.itemSprites.forEach(sprite => {
            if (sprite) { sprite.setVisible(false); sprite.active = false; }
        });
        // Esconder seta e área clicável
        this.toggleArrow.setVisible(false);
        this.clickableArea.setVisible(false);
    }

    unsuppress(show = true) {
        if (!this.suppressed) return;
        this.suppressed = false;
        this.allObjects.forEach((o, i) => { 
            o.setVisible(true); 
            o.active = true; 
            if (!show) o.y = this.offscreenY; 
            else o.y = this.initialYs[i]; 
        });
        this.itemSprites.forEach((sprite, i) => {
            if (sprite) {
                sprite.setVisible(true);
                sprite.active = true;
                const slot = this.slots[i];
                if (!show) sprite.y = this.offscreenY;
                else sprite.y = slot.y + slot.height / 2;
            }
        });
        this.hidden = !show;
        // Mostrar seta e área clicável
        this.toggleArrow.setVisible(true);
        this.clickableArea.setVisible(true);
        if (show && !this.isOpen) this._registerInteraction();
    }

    // Método principal para adicionar itens
    setItem(slotIndex, textureKey) {
        console.log(`[Hotbar] Adicionando ${textureKey} ao slot ${slotIndex}`);
        
        if (slotIndex < 0 || slotIndex >= this.slotCount) {
            console.error(`[Hotbar] Slot inválido: ${slotIndex}`);
            return null;
        }

        // Remove sprite anterior se existir
        if (this.itemSprites[slotIndex]) {
            this.itemSprites[slotIndex].destroy();
        }

        // Armazena o item
        this.items[slotIndex] = textureKey;

        // Cria o sprite do item
        const slot = this.slots[slotIndex];
        const centerX = slot.x + slot.width / 2;
        const centerY = slot.y + slot.height / 2;

        // PLACEHOLDER: Criar retângulo colorido ao invés de sprite
        let sprite;
        if (textureKey === 'crowbar') {
            // Usar blackcrowbar.png ao invés de placeholder
            sprite = this.scene.add.image(centerX, centerY, 'blackcrowbar')
                .setScrollFactor(0)
                .setDepth(15100) // Acima da hotbar para ficar visível
                .setVisible(true);
            
            // Escala para caber no slot
            if (sprite.width && sprite.height) {
                const maxSize = this.slotSize - 16;
                const scale = Math.min(maxSize / sprite.width, maxSize / sprite.height);
                sprite.setScale(scale);
            }
            console.log(`[Hotbar] ✓ Sprite blackcrowbar criado para crowbar`);
        } else {
            // Para outros itens, tenta usar a textura normal
            if (this.scene.textures.exists(textureKey)) {
                sprite = this.scene.add.image(centerX, centerY, textureKey)
                    .setScrollFactor(0)
                    .setDepth(15100) // Acima da hotbar para ficar visível
                    .setVisible(true);
                
                // Escala para caber no slot
                if (sprite.width && sprite.height) {
                    const maxSize = this.slotSize - 16;
                    const scale = Math.min(maxSize / sprite.width, maxSize / sprite.height);
                    sprite.setScale(scale);
                }
                console.log(`[Hotbar] ✓ Sprite criado para ${textureKey}`);
            } else {
                // Placeholder genérico: retângulo azul
                sprite = this.scene.add.rectangle(centerX, centerY, 40, 40, 0x0000ff)
                    .setStrokeStyle(3, 0xffffff)
                    .setScrollFactor(0)
                    .setDepth(15100) // Acima da hotbar para ficar visível
                    .setVisible(true);
                console.log(`[Hotbar] ✓ Placeholder azul criado para ${textureKey}`);
            }
        }

        // Se hotbar está escondida, posiciona sprite fora da tela
        if (this.hidden || this.suppressed) {
            sprite.y = this.offscreenY;
        }

        this.itemSprites[slotIndex] = sprite;

        // Força exibição da hotbar quando item é adicionado
        if (this.hidden && !this.suppressed) {
            console.log(`[Hotbar] Mostrando hotbar automaticamente`);
            this.showAnimated();
        }

        return sprite;
    }

    // Obtém o item no slot selecionado
    getSelectedItem() {
        return this.items[this.selectedIndex];
    }

    // Remove item de um slot
    removeItem(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.slotCount) {
            this.items[slotIndex] = null;
            if (this.itemSprites[slotIndex]) {
                this.itemSprites[slotIndex].destroy();
                this.itemSprites[slotIndex] = null;
            }
        }
    }
    
    // Esconde instantaneamente (para diálogos)
    hide() {
        this.allObjects.forEach(obj => obj.setVisible(false));
        this.itemSprites.forEach(sprite => {
            if (sprite) sprite.setVisible(false);
        });
        this.toggleArrow.setVisible(false);
        this.clickableArea.setVisible(false);
    }
    
    // Mostra instantaneamente (para diálogos)
    show() {
        if (!this.suppressed) {
            this.allObjects.forEach(obj => obj.setVisible(true));
            this.itemSprites.forEach(sprite => {
                if (sprite) sprite.setVisible(true);
            });
            this.toggleArrow.setVisible(true);
            this.clickableArea.setVisible(true);
        }
    }
}

