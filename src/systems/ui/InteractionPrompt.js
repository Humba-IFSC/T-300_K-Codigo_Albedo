export class InteractionPrompt {
    /**
     * Caixa pequena de prompt ("Pressione \"ESPAÇO\" para falar").
     * @param {Phaser.Scene} scene
     * @param {{prefix?:string, keyLabel?:string, suffix?:string, fontSize?:number, padding?:{x:number,y:number}}} options
     */
    constructor(scene, { prefix = 'Pressione ', keyLabel = '"ESPAÇO"', suffix = ' para falar', fontSize = 26, padding = { x: 10, y: 8 }, fontFamily = 'Arial, sans-serif' } = {}) {
        this.scene = scene;
        const style = { fontFamily, fontSize: fontSize + 'px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 };
        const highlightStyle = { fontFamily, fontSize: fontSize + 'px', fill: '#fada7cff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 };

        const prefixText = scene.add.text(0, 0, prefix, style).setScrollFactor(0);
        const keyText = scene.add.text(0, 0, keyLabel, highlightStyle).setScrollFactor(0);
        const suffixText = scene.add.text(0, 0, suffix, style).setScrollFactor(0);
        keyText.x = prefixText.width;
        suffixText.x = keyText.x + keyText.width;
        const totalWidth = suffixText.x + suffixText.width;
        const maxH = Math.max(prefixText.height, keyText.height, suffixText.height);
        const bg = scene.add.rectangle(-padding.x, -padding.y, totalWidth + padding.x * 2, maxH + padding.y * 2, 0x000000, 0.6)
            .setOrigin(0, 0).setScrollFactor(0);

        this.container = scene.add.container(18, 18, [bg, prefixText, keyText, suffixText])
            .setDepth(1005).setVisible(false);
        scene._registerUIElement?.(this.container);
        this.visible = false;
    }

    show() { if (!this.visible) { this.container.setVisible(true); this.visible = true; } }
    hide() { if (this.visible) { this.container.setVisible(false); this.visible = false; } }
    destroy() { this.container.destroy(); }
}
