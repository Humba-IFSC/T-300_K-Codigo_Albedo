export class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.messages = [];
        this.index = 0;
        this.writing = false;

        const w = scene.scale.width;
        const h = scene.scale.height;

    const boxHeight = 170;          // ainda mais alto
    const bottomPadding = 28;       // ajuste para afastar da borda
    const boxWidth = w - 32;        // quase largura total
        const boxY = h - bottomPadding - boxHeight / 2;

    this.box = scene.add.rectangle(
            w / 2, boxY, boxWidth, boxHeight,
            0x000000, 0.6
    ).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(1000);

        this.wrapWidth = this.box.width - 96; // área interna de texto
        const fontFamily = 'Arial, sans-serif';
        const mainStyle = { fontFamily, fontSize: '40px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 };
        this.text = scene.add.text(
            this.box.x - this.box.width / 2 + 48,
            this.box.y - this.box.height / 2 + 30,
            '',
            mainStyle
        ).setScrollFactor(0).setVisible(false).setDepth(1001);
        // Texto oculto para medir largura sem wraps (mesmo estilo para precisão)
        this.measureText = scene.add.text(0, 0, '', mainStyle)
            .setVisible(false);

        this.nextIcon = scene.add.text(
            this.box.x + this.box.width / 2 - 50,
            this.box.y + this.box.height / 2 - 52,
            '▼',
            { fontFamily, fontSize: '42px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2, letterSpacing: 0 }
        ).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(1002);

        scene.tweens.add({
            targets: this.nextIcon,
            alpha: { from: 1, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.sound = scene.sound.add('textBlip', { loop: true, volume: 0.3, rate: 1 });
    }

    show(messages) {
        this.messages = Array.isArray(messages) ? messages : [messages];
        this.index = 0;
        this.active = true;
        this.box.setVisible(true);
        this.text.setVisible(true);
        
        // Guardar estado da hotbar se estava aberta manualmente
        this.wasHotbarOpen = this.scene.hotbar?.isOpen || false;
        
        // Fechar hotbar se estiver aberta
        if (this.scene.hotbar?.isOpen) {
            this.scene.hotbar.closeManually();
        }
        
        // Esconder HUD e desabilitar controles virtuais
        if (this.scene.hotbar) this.scene.hotbar.hide();
        if (this.scene.virtualButtons) this.scene.virtualButtons.hide();
        if (this.scene.virtualJoystick) this.scene.virtualJoystick.disable();
        
        // Adicionar listener de clique global para avançar diálogo
        if (!this.clickHandler) {
            this.clickHandler = () => this.next();
            this.scene.input.on('pointerdown', this.clickHandler);
        }
        
        this.write(this.messages[this.index]);
    }

    write(message) {
        this.text.setText('');
        this.writing = true;
        this.nextIcon.setVisible(false);
        if (!this.sound.isPlaying) this.sound.play();

        let i = 0;
        let currentLine = '';
        const appendChar = (ch) => {
            if (ch === '\n') { // quebra manual existente na string
                this.text.setText(this.text.text + '\n');
                currentLine = '';
                return;
            }
            // Testar largura incluindo este char
            const testLine = currentLine + ch;
            this.measureText.setText(testLine);
            if (this.measureText.width > this.wrapWidth) {
                // quebra de linha antes do char; se char for espaço, não leva para próxima linha
                if (ch === ' ') {
                    this.text.setText(this.text.text + '\n');
                    currentLine = '';
                } else {
                    this.text.setText(this.text.text + '\n' + ch);
                    currentLine = ch;
                }
            } else {
                this.text.setText(this.text.text + ch);
                currentLine = testLine;
            }
        };

        this.timer = this.scene.time.addEvent({
            delay: 40,
            repeat: message.length - 1,
            callback: () => {
                appendChar(message[i]);
                i++;
                if (i === message.length) {
                    this.writing = false;
                    if (this.sound.isPlaying) this.sound.stop();
                    if (this.index < this.messages.length - 1) this.nextIcon.setVisible(true);
                }
            }
        });
    }

    next() {
        if (!this.active) return;
        if (this.writing) {
            if (this.timer) this.timer.remove(false);
            // Reconstruir texto completo com lógica de wrap para finalizar instantaneamente
            const full = this.messages[this.index];
            this.text.setText('');
            let currentLine = '';
            for (const ch of full) {
                if (ch === '\n') {
                    this.text.setText(this.text.text + '\n');
                    currentLine = '';
                    continue;
                }
                this.measureText.setText(currentLine + ch);
                if (this.measureText.width > this.wrapWidth) {
                    if (ch === ' ') {
                        this.text.setText(this.text.text + '\n');
                        currentLine = '';
                    } else {
                        this.text.setText(this.text.text + '\n' + ch);
                        currentLine = ch;
                    }
                } else {
                    this.text.setText(this.text.text + ch);
                    currentLine += ch;
                }
            }
            this.writing = false;
            if (this.sound.isPlaying) this.sound.stop();
            if (this.index < this.messages.length - 1) this.nextIcon.setVisible(true);
        } else {
            if (this.index < this.messages.length - 1) {
                this.index++;
                this.write(this.messages[this.index]);
            } else {
                this.close();
            }
        }
    }

    close() {
        this.box.setVisible(false);
        this.text.setVisible(false);
        this.nextIcon.setVisible(false);
        this.active = false;
        if (this.sound.isPlaying) this.sound.stop();
        
        // Mostrar HUD e reabilitar controles virtuais
        if (this.scene.hotbar) this.scene.hotbar.show();
        if (this.scene.virtualButtons) this.scene.virtualButtons.show();
        if (this.scene.virtualJoystick) this.scene.virtualJoystick.enable();
        
        // Reabrir hotbar se estava aberta antes do diálogo
        if (this.wasHotbarOpen && this.scene.hotbar) {
            this.scene.hotbar.openManually();
        }
        
        // Remover listener de clique
        if (this.clickHandler) {
            this.scene.input.off('pointerdown', this.clickHandler);
            this.clickHandler = null;
        }
    }
}
