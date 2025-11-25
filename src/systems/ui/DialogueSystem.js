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

    /**
     * Separa uma palavra em sílabas seguindo as regras da língua portuguesa
     */
    syllabify(word) {
        // Converter para minúsculas para análise
        const lower = word.toLowerCase();
        const syllables = [];
        let currentSyllable = '';
        
        // Vogais
        const vowels = 'aeiouáéíóúâêîôûãõ';
        const isVowel = (c) => vowels.includes(c);
        
        for (let i = 0; i < lower.length; i++) {
            const c = lower[i];
            const next = lower[i + 1] || '';
            const next2 = lower[i + 2] || '';
            
            currentSyllable += word[i]; // Manter capitalização original
            
            // Regras de separação silábica
            if (isVowel(c)) {
                // Vogal seguida de consoante e vogal: se-pa-rar
                if (!isVowel(next) && isVowel(next2)) {
                    // Verificar dígrafos que não se separam
                    const digraph = (c + next).toLowerCase();
                    if (['ch', 'lh', 'nh', 'qu', 'gu'].includes(digraph)) {
                        currentSyllable += word[i + 1];
                        i++;
                    } else {
                        syllables.push(currentSyllable);
                        currentSyllable = '';
                    }
                }
                // Vogal seguida de duas consoantes: sep-a-rar
                else if (!isVowel(next) && !isVowel(next2) && next2) {
                    const cons1 = next.toLowerCase();
                    const cons2 = next2.toLowerCase();
                    
                    // Encontros consonantais que ficam juntos (br, cr, dr, fr, gr, pr, tr, bl, cl, fl, gl, pl)
                    const inseparable = ['br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'vr', 
                                        'bl', 'cl', 'fl', 'gl', 'pl', 'tl'];
                    
                    if (inseparable.includes(cons1 + cons2)) {
                        syllables.push(currentSyllable);
                        currentSyllable = '';
                    } else {
                        currentSyllable += word[i + 1];
                        i++;
                        syllables.push(currentSyllable);
                        currentSyllable = '';
                    }
                }
                // Ditongos: não separar (ai, ei, oi, ui, au, eu, iu, ou)
                else if (isVowel(next)) {
                    const diphthong = (c + next).toLowerCase();
                    if (['ai', 'ei', 'oi', 'ui', 'au', 'eu', 'iu', 'ou', 'ão', 'ãe', 'õe'].includes(diphthong)) {
                        currentSyllable += word[i + 1];
                        i++;
                    }
                }
            }
        }
        
        // Adicionar última sílaba
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }
        
        return syllables.length > 0 ? syllables : [word];
    }

    /**
     * Encontra o melhor ponto de quebra em uma palavra
     */
    findBreakPoint(word) {
        const syllables = this.syllabify(word);
        
        // Se a palavra tem apenas uma sílaba, não quebra
        if (syllables.length <= 1) {
            return { part1: word, part2: '' };
        }
        
        // Quebrar antes da última sílaba para maximizar uso da linha
        let part1 = '';
        for (let i = 0; i < syllables.length - 1; i++) {
            part1 += syllables[i];
        }
        
        const part2 = syllables[syllables.length - 1];
        
        return { part1: part1 + '-', part2 };
    }

    show(messages, options = {}) {
        this.messages = Array.isArray(messages) ? messages : [messages];
        this.index = 0;
        this.active = true;
        this.box.setVisible(true);
        this.text.setVisible(true);
        
        // Guardar opções (como desabilitar som)
        this.options = options;
        
        // Guardar estado da hotbar se estava aberta manualmente
        this.wasHotbarOpen = this.scene.hotbar?.isOpen || false;
        
        // Fechar hotbar se estiver aberta
        if (this.scene.hotbar?.isOpen) {
            this.scene.hotbar.closeManually();
        }
        
        // Nota: O esconder/mostrar dos controles virtuais é gerenciado pela cena
        // através do override do método close()
        
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
        
        // Tocar som apenas se não estiver desabilitado
        if (!this.options?.disableSound && !this.sound.isPlaying) {
            this.sound.play();
        }

        // Pré-processar o texto completo com quebras de linha corretas
        const processedText = this.preprocessText(message);
        
        let i = 0;
        const appendChar = (ch) => {
            this.text.setText(this.text.text + ch);
        };

        this.timer = this.scene.time.addEvent({
            delay: 40,
            repeat: processedText.length - 1,
            callback: () => {
                appendChar(processedText[i]);
                i++;
                if (i === processedText.length) {
                    this.writing = false;
                    if (this.sound.isPlaying) this.sound.stop();
                    if (this.index < this.messages.length - 1) this.nextIcon.setVisible(true);
                }
            }
        });
    }
    
    /**
     * Pré-processa o texto aplicando quebras de linha e hifenização
     */
    preprocessText(message) {
        let result = '';
        let currentLine = '';
        let currentWord = '';
        
        for (const ch of message) {
            if (ch === '\n') {
                result += currentWord + '\n';
                currentLine = '';
                currentWord = '';
                continue;
            }
            
            if (ch === ' ') {
                const testLine = currentLine + currentWord + ' ';
                this.measureText.setText(testLine);
                
                if (this.measureText.width > this.wrapWidth) {
                    result += '\n' + currentWord + ' ';
                    currentLine = currentWord + ' ';
                } else {
                    result += currentWord + ' ';
                    currentLine = testLine;
                }
                currentWord = '';
            } else {
                currentWord += ch;
                const testLine = currentLine + currentWord;
                this.measureText.setText(testLine);
                
                if (this.measureText.width > this.wrapWidth) {
                    if (currentWord.length > 3) {
                        const { part1, part2 } = this.findBreakPoint(currentWord);
                        this.measureText.setText(currentLine + part1);
                        
                        if (this.measureText.width <= this.wrapWidth && part2) {
                            result += part1 + '\n';
                            currentLine = '';
                            currentWord = part2;
                        } else {
                            result += '\n';
                            currentLine = '';
                        }
                    } else {
                        result += '\n';
                        currentLine = '';
                    }
                }
            }
        }
        
        if (currentWord) {
            result += currentWord;
        }
        
        return result;
    }

    next() {
        if (!this.active) return;
        if (this.writing) {
            if (this.timer) this.timer.remove(false);
            // Usar texto pré-processado para finalizar instantaneamente
            const full = this.messages[this.index];
            const processedText = this.preprocessText(full);
            this.text.setText(processedText);
            
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
        
        // Nota: O mostrar dos controles virtuais é gerenciado pela cena
        // através do override deste método
        
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
