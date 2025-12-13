export class CoordProbe {
    /**
     * Ferramenta de inspeção de coordenadas (toggle com tecla 0 por padrão).
     * Mostra world(x,y) + tile(x,y) e destaca o tile em vermelho.
     * @param {Phaser.Scene} scene
     * @param {Phaser.Tilemaps.Tilemap} map
     * @param {{ keyCode?: number, highlightColor?: number, highlightAlpha?: number }} options
     */
    constructor(scene, map, { keyCode = Phaser.Input.Keyboard.KeyCodes.ZERO, highlightColor = 0xff0000, highlightAlpha = 0.28 } = {}) {
        this.scene = scene;
        this.map = map;
        this.active = false;

        // Texto (UI) - registrado para ser ignorado pela camera do mundo
        this.text = scene.add.text(12, scene.scale.height - 32, '', {
            fontSize: '18px', fill: '#ffec57', backgroundColor: 'rgba(0,0,0,0.55)', padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(1200).setVisible(false);
        scene._registerUIElement?.(this.text);

        // Destaque do tile (mundo) - será ignorado pela camera de UI posteriormente
        const tw = map?.tileWidth || 32;
        const th = map?.tileHeight || 32;
        this.highlight = scene.add.rectangle(-99999, -99999, tw, th, highlightColor, highlightAlpha)
            .setOrigin(0, 0)
            .setVisible(false)
            .setActive(false)
            .setDepth(500);

        this.key = scene.input.keyboard.addKey(keyCode);
        this.originalCursor = scene.game.canvas.style.cursor;
    }

    toggle(forceState) {
        if (typeof forceState === 'boolean') this.active = forceState; else this.active = !this.active;
        if (this.active) {
            this.text.setVisible(true);
            this.scene.game.canvas.style.cursor = 'crosshair';
        } else {
            this.text.setVisible(false);
            this.highlight.setVisible(false).setActive(false).setPosition(-99999, -99999);
            this.scene.game.canvas.style.cursor = this.originalCursor || 'default';
        }
    }
    enable() { this.toggle(true); }
    disable() { this.toggle(false); }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.key)) this.toggle();
        if (!this.active) return;

        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const wx = Math.floor(worldPoint.x);
        const wy = Math.floor(worldPoint.y);
        let tileInfo = '';
        if (this.map) {
            const tw = this.map.tileWidth;
            const th = this.map.tileHeight;
            const tx = Math.floor(wx / tw);
            const ty = Math.floor(wy / th);
            tileInfo = ` tile(${tx},${ty})`;
            if (tx >= 0 && ty >= 0 && tx < this.map.width && ty < this.map.height) {
                this.highlight.setPosition(tx * tw, ty * th).setVisible(true).setActive(true);
            } else {
                this.highlight.setVisible(false).setActive(false).setPosition(-99999, -99999);
            }
        }
        this.text.setText(`world(${wx},${wy})${tileInfo}`);

        // Posicionar perto do cursor (coordenadas de tela)
        const offset = 16;
        let screenX = pointer.x + offset;
        let screenY = pointer.y + offset;
        if (screenX + this.text.width > this.scene.scale.width) screenX -= (this.text.width + offset * 2);
        if (screenY + this.text.height > this.scene.scale.height) screenY -= (this.text.height + offset * 2);
        this.text.setPosition(screenX, screenY);
    }
}
