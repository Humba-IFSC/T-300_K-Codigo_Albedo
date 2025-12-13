/**
 * Exemplos de uso do sistema de objetos empurráveis
 * Copie e cole estes exemplos na sua GameScene.js
 */

// ========================================
// EXEMPLO 1: Puzzle Simples - Bloco em Botão
// ========================================
createPuzzleBasico() {
    // Criar botão/placa de pressão
    this.botao = this.add.sprite(500, 300, 'botao-sprite');
    this.botao.setData('ativado', false);
    
    // Criar bloco que deve ser empurrado para o botão
    const bloco = this.pushableManager.addObject(450, 200, 'box', {
        pushSpeed: 60,
        onPushEnd: (obj) => {
            // Verificar se o bloco está sobre o botão
            const distancia = Phaser.Math.Distance.Between(
                obj.sprite.x, obj.sprite.y,
                this.botao.x, this.botao.y
            );
            
            if (distancia < 16 && !this.botao.getData('ativado')) {
                this.botao.setData('ativado', true);
                this.botao.setTint(0x00ff00); // Fica verde
                console.log('Puzzle resolvido!');
                this.abrirPorta(); // Sua função de abrir porta
            }
        }
    });
}

// ========================================
// EXEMPLO 2: Múltiplos Blocos - Labirinto
// ========================================
criarLabirintoDeBlocos() {
    const posicoes = [
        { x: 300, y: 200 },
        { x: 350, y: 200 },
        { x: 400, y: 200 },
        { x: 300, y: 250 },
        { x: 400, y: 250 },
    ];
    
    posicoes.forEach(pos => {
        this.pushableManager.addObject(pos.x, pos.y, 'box', {
            pushSpeed: 50,
            pushDistance: 32
        });
    });
    
    // Adicionar colisões entre blocos
    this.pushableManager.objects.forEach((obj1, i) => {
        this.pushableManager.objects.forEach((obj2, j) => {
            if (i !== j) {
                this.physics.add.collider(obj1.sprite, obj2.sprite);
            }
        });
    });
}

// ========================================
// EXEMPLO 3: Bloco de Gelo (Desliza Contínuo)
// ========================================
criarBlocoDeGelo(x, y) {
    const blocoGelo = this.pushableManager.addObject(x, y, 'ice-block', {
        pushSpeed: 120, // Mais rápido
        pushDistance: 160, // Desliza mais longe (5 tiles)
        onPushStart: (obj, direction) => {
            // Som de gelo deslizando
            this.sound.play('ice-slide');
        },
        onPushEnd: (obj) => {
            // Som de parar
            this.sound.play('ice-stop');
        }
    });
    
    return blocoGelo;
}

// ========================================
// EXEMPLO 4: Bloco Pesado (Precisa de Item)
// ========================================
criarBlocoPesado(x, y) {
    const blocoPesado = this.pushableManager.addObject(x, y, 'heavy-block', {
        pushSpeed: 30, // Muito lento
        canBePushed: false // Começa bloqueado
    });
    
    // Habilitar apenas se player tiver "power-gloves"
    this.events.on('update', () => {
        const inventory = getInventory();
        if (inventory.includes('power-gloves')) {
            blocoPesado.enable();
        }
    });
    
    return blocoPesado;
}

// ========================================
// EXEMPLO 5: Sistema de 4 Blocos em 4 Botões
// ========================================
criarPuzzleComplexo() {
    // Posições dos botões (alvos)
    const botoes = [
        { x: 400, y: 300 },
        { x: 500, y: 300 },
        { x: 400, y: 400 },
        { x: 500, y: 400 }
    ];
    
    // Criar sprites de botões
    this.botoes = botoes.map(pos => {
        const botao = this.add.sprite(pos.x, pos.y, 'botao');
        botao.setData('ativado', false);
        return botao;
    });
    
    // Posições iniciais dos blocos
    const blocosPosicoes = [
        { x: 300, y: 200 },
        { x: 350, y: 200 },
        { x: 400, y: 200 },
        { x: 450, y: 200 }
    ];
    
    // Criar blocos
    blocosPosicoes.forEach(pos => {
        this.pushableManager.addObject(pos.x, pos.y, 'box', {
            onPushEnd: () => {
                this.verificarPuzzleCompleto();
            }
        });
    });
}

verificarPuzzleCompleto() {
    let botõesAtivados = 0;
    
    // Para cada botão, verificar se há um bloco em cima
    this.botoes.forEach(botao => {
        let temBloco = false;
        
        this.pushableManager.objects.forEach(obj => {
            const dist = Phaser.Math.Distance.Between(
                obj.sprite.x, obj.sprite.y,
                botao.x, botao.y
            );
            
            if (dist < 16) {
                temBloco = true;
            }
        });
        
        if (temBloco) {
            botao.setTint(0x00ff00);
            botao.setData('ativado', true);
            botõesAtivados++;
        } else {
            botao.clearTint();
            botao.setData('ativado', false);
        }
    });
    
    // Se todos os 4 botões estão ativados
    if (botõesAtivados === 4) {
        console.log('Puzzle complexo resolvido!');
        this.abrirPortaFinal();
    }
}

// ========================================
// EXEMPLO 6: Bloco que Só Move em Uma Direção
// ========================================
criarBlocoUnidirecional(x, y, direcaoPermitida) {
    return this.pushableManager.addObject(x, y, 'directional-block', {
        onPushStart: (obj, direction) => {
            if (direction !== direcaoPermitida) {
                // Cancelar o movimento
                obj.isPushing = false;
                obj.sprite.setVelocity(0);
                
                // Mostrar mensagem visual
                const texto = this.add.text(obj.sprite.x, obj.sprite.y - 40, 
                    '↓ Só pode empurrar nesta direção ↓', 
                    { fontSize: '16px', fill: '#ff0000' }
                );
                this.time.delayedCall(2000, () => texto.destroy());
                
                return false;
            }
        }
    });
}

// ========================================
// EXEMPLO 7: Salvar/Carregar Posições dos Blocos
// ========================================
salvarPosicoesDosBlocos() {
    const posicoes = this.pushableManager.objects.map(obj => ({
        x: obj.sprite.x,
        y: obj.sprite.y
    }));
    
    window._pushablePositions = posicoes;
    console.log('Posições salvas:', posicoes);
}

carregarPosicoesDosBlocos() {
    if (window._pushablePositions) {
        window._pushablePositions.forEach((pos, index) => {
            if (this.pushableManager.objects[index]) {
                const obj = this.pushableManager.objects[index];
                obj.sprite.setPosition(pos.x, pos.y);
            }
        });
        console.log('Posições carregadas!');
    }
}

// Chamar ao sair da cena
shutdown() {
    this.salvarPosicoesDosBlocos();
}

// ========================================
// EXEMPLO 8: Bloco com Som
// ========================================
criarBlocoComSom(x, y) {
    // Certifique-se de carregar o som no preload()
    // this.load.audio('push-sound', 'assets/sounds/push.mp3');
    
    return this.pushableManager.addObject(x, y, 'box', {
        onPushStart: (obj) => {
            this.sound.play('push-sound');
        },
        onPushEnd: (obj) => {
            this.sound.play('thud-sound');
        }
    });
}

// ========================================
// EXEMPLO 9: Bloco que Revela Tesouro
// ========================================
criarBlocoComTesouro(x, y) {
    // Criar tesouro escondido embaixo
    const tesouro = this.add.sprite(x, y, 'chest', 0);
    tesouro.setVisible(false);
    
    return this.pushableManager.addObject(x, y, 'box', {
        onPushStart: (obj) => {
            // Revelar tesouro quando bloco é movido pela primeira vez
            tesouro.setVisible(true);
            tesouro.setPosition(x, y); // Posição original
            
            // Animação de aparecer
            this.tweens.add({
                targets: tesouro,
                alpha: { from: 0, to: 1 },
                duration: 500
            });
        }
    });
}

// ========================================
// EXEMPLO 10: Resetar Puzzle
// ========================================
resetarPuzzle() {
    // Remover todos os blocos atuais
    this.pushableManager.clear();
    
    // Recriar blocos nas posições iniciais
    this.criarPuzzleBasico(); // ou qualquer outro puzzle
}

// Botão de reset (tecla R)
criarBotaoReset() {
    const resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    resetKey.on('down', () => {
        this.resetarPuzzle();
        console.log('Puzzle resetado!');
    });
}
