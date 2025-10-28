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
                .setDepth(1000);
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
          .setDepth(1001);

        // Todos os objetos da hotbar
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
                    this.showAnimated();
                    this.select(n - 1);
                }
            }
        });

        if (!this.hidden) this._registerInteraction();
    }

    _registerInteraction() {
        if (this.hideTimer) this.hideTimer.remove(false);
        if (this.suppressed) return;
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
                        this._registerInteraction();
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
        if (this.hidden || this.suppressed || this.animating) return;
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
        if (show) this._registerInteraction();
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
                .setDepth(2000)
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
                    .setDepth(2000)
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
                    .setDepth(2000)
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
    }
    
    // Mostra instantaneamente (para diálogos)
    show() {
        if (!this.suppressed) {
            this.allObjects.forEach(obj => obj.setVisible(true));
            this.itemSprites.forEach(sprite => {
                if (sprite) sprite.setVisible(true);
            });
        }
    }
}

