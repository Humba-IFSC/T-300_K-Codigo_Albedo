/**
 * Ícone de botão que aparece flutuando sobre objetos interativos
 */
export class InteractionIcon {
    /**
     * @param {Phaser.Scene} scene
     * @param {string} buttonSprite - Nome do sprite do botão (button_a, button_x, etc)
     * @param {number} scale - Escala do botão
     */
    constructor(scene, buttonSprite = 'button_a', scale = 0.8) {
        this.scene = scene;
        this.targetObject = null;
        this.offsetY = -64; // Um tile acima (assumindo tiles de 64x64)
        
        // Criar sprite do botão na câmera do mundo (não UI)
        this.icon = scene.add.image(0, 0, buttonSprite)
            .setScale(scale)
            .setDepth(1005)
            .setVisible(false)
            .setScrollFactor(1); // Acompanha a câmera do mundo
        
        // Desabilitar física/colisão
        if (this.icon.body) {
            this.icon.body.enable = false;
        }
        
        // Animação de flutuação (bobbing)
        this.bobTween = scene.tweens.add({
            targets: this.icon,
            y: '+=8',
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.bobTween.pause();
        
        // NÃO registra como elemento UI
        // scene._registerUIElement?.(this.icon);
    }
    
    /**
     * Mostra o ícone sobre um objeto
     * @param {Phaser.GameObjects.Sprite} object - Objeto sobre o qual mostrar o ícone
     */
    showAbove(object) {
        if (!object) {
            this.hide();
            return;
        }
        
        this.targetObject = object;
        this.icon.setVisible(true);
        this.icon.setAlpha(1); // Garantir que alpha seja restaurado
        this.updatePosition();
        this.bobTween.resume();
    }
    
    /**
     * Atualiza a posição do ícone para seguir o objeto
     */
    updatePosition() {
        if (this.targetObject && this.icon.visible) {
            this.icon.x = this.targetObject.x;
            this.icon.y = this.targetObject.y + this.offsetY;
        }
    }
    
    /**
     * Esconde o ícone
     */
    hide() {
        this.targetObject = null;
        this.icon.setVisible(false);
        this.bobTween.pause();
    }
    
    /**
     * Verifica se está visível
     */
    get visible() {
        return this.icon.visible;
    }
    
    /**
     * Destrói o ícone
     */
    destroy() {
        this.bobTween.remove();
        this.icon.destroy();
    }
}
