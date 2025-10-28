export class InteractionPrompt {
    /**
     * Caixa pequena de prompt ("Pressione [botão] para falar").
     * @param {Phaser.Scene} scene
     * @param {{prefix?:string, keyLabel?:string, buttonSprite?:string, suffix?:string, fontSize?:number, padding?:{x:number,y:number}, buttonScale?:number}} options
     */
    constructor(scene, { 
        prefix = 'Pressione ', 
        keyLabel = '"A"', 
        buttonSprite = null,
        suffix = ' para falar', 
        fontSize = 26, 
        padding = { x: 10, y: 8 }, 
        fontFamily = 'Arial, sans-serif',
        buttonScale = 0.35
    } = {}) {
        this.scene = scene;
        const style = { fontFamily, fontSize: fontSize + 'px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 };
        const highlightStyle = { fontFamily, fontSize: fontSize + 'px', fill: '#24e40bff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 };

        const prefixText = scene.add.text(0, 0, prefix, style).setScrollFactor(0);
        
        // Criar botão (sprite ou texto)
        let buttonElement;
        let buttonWidth;
        let buttonHeight;
        
        if (buttonSprite && scene.textures.exists(buttonSprite)) {
            // Usar sprite do botão
            buttonElement = scene.add.image(0, 0, buttonSprite)
                .setOrigin(0, 0)
                .setScale(buttonScale)
                .setScrollFactor(0);
            buttonWidth = buttonElement.displayWidth;
            buttonHeight = buttonElement.displayHeight;
        } else {
            // Fallback para texto
            buttonElement = scene.add.text(0, 0, keyLabel, highlightStyle).setScrollFactor(0);
            buttonWidth = buttonElement.width;
            buttonHeight = buttonElement.height;
        }
        
        const suffixText = scene.add.text(0, 0, suffix, style).setScrollFactor(0);
        
        // Posicionar elementos
        buttonElement.x = prefixText.width;
        
        // Centralizar verticalmente o botão com o texto
        const textCenterY = prefixText.height / 2;
        buttonElement.y = textCenterY - (buttonHeight / 2);
        
        suffixText.x = buttonElement.x + buttonWidth;
        
        const totalWidth = suffixText.x + suffixText.width;
        const maxH = Math.max(prefixText.height, buttonHeight, suffixText.height);
        
        const bg = scene.add.rectangle(-padding.x, -padding.y, totalWidth + padding.x * 2, maxH + padding.y * 2, 0x000000, 0.6)
            .setOrigin(0, 0).setScrollFactor(0);

        this.container = scene.add.container(18, 18, [bg, prefixText, buttonElement, suffixText])
            .setDepth(1005).setVisible(false);
        scene._registerUIElement?.(this.container);
        this.visible = false;
    }

    show() { if (!this.visible) { this.container.setVisible(true); this.visible = true; } }
    hide() { if (this.visible) { this.container.setVisible(false); this.visible = false; } }
    destroy() { this.container.destroy(); }
}
