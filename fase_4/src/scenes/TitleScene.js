/**
 * TitleScene - Tela de título com seleção de mapas
 * 
 * Permite escolher entre diferentes cenas/mapas do jogo
 * Agora com suporte a scroll para navegar entre os mapas
 */
export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload() {
        // Carrega assets básicos se necessário
    }

    create() {
        const { width, height } = this.scale;
        
        // Fundo simples
        this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);
        
        // Título do jogo (scroll com fade)
        this.titleText = this.add.text(width / 2, 60, 'T-300 K-CODIGO ALBEDO', {
            fontSize: '42px',
            fontFamily: 'Arial',
            color: '#ecf0f1',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Lista de mapas disponíveis (ordem de criação)
        const maps = [
            { name: 'Title Scene', scene: 'TitleScene', color: 0x34495e },
            { name: 'Intro Scene', scene: 'IntroScene', color: 0x3498db },
            { name: 'Intro 2 Scene', scene: 'Intro2Scene', color: 0x5dade2 },
            { name: 'Game Scene', scene: 'GameScene', color: 0x2ecc71 },
            { name: 'Second Scene', scene: 'SecondScene', color: 0x27ae60 },
            { name: 'Recepção', scene: 'HallDoHalliradoScene', color: 0x9b59b6 },
            { name: 'Hall', scene: 'TcheScene', color: 0xe74c3c },
            { name: 'Quarto Theo', scene: 'QuartoTheoScene', color: 0x8e44ad },
            { name: 'Quarto Dante', scene: 'DanteScene', color: 0xf39c12 }
        ];
        
        // Container scrollável para os botões
        const containerStartY = 120;
        const buttonHeight = 70;
        const spacing = 90;
        const totalHeight = maps.length * spacing;
        
        // Área visível para os botões
        const viewportHeight = height - containerStartY - 80;
        
        // Container para os botões
        this.buttonContainer = this.add.container(0, 0);
        
        // Criar botões dentro do container
        this.buttons = [];
        maps.forEach((map, index) => {
            const y = containerStartY + (index * spacing);
            
            // Botão (retângulo)
            const button = this.add.rectangle(width / 2, y, 400, buttonHeight, map.color, 0.9);
            button.setInteractive({ useHandCursor: true });
            
            // Texto do botão
            const text = this.add.text(width / 2, y, map.name, {
                fontSize: '26px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Armazenar referências
            const buttonObj = { button, text, map };
            this.buttons.push(buttonObj);
            
            // Adicionar ao container
            this.buttonContainer.add([button, text]);
            
            // Efeitos de hover
            button.on('pointerover', () => {
                button.setAlpha(1);
                button.setScale(1.05);
                text.setScale(1.05);
            });
            
            button.on('pointerout', () => {
                button.setAlpha(0.9);
                button.setScale(1);
                text.setScale(1);
            });
            
            // Clique para iniciar a cena
            button.on('pointerdown', () => {
                // Efeito visual
                button.setScale(0.95);
                text.setScale(0.95);
                
                // Iniciar a cena após pequeno delay
                this.time.delayedCall(100, () => {
                    console.log(`[TitleScene] Iniciando ${map.scene}`);
                    this.scene.start(map.scene);
                });
            });
        });
        
        // Scroll offset
        this.scrollOffset = 0;
        this.maxScroll = Math.max(0, totalHeight - viewportHeight);
        
        // Mouse wheel scroll
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollOffset += deltaY * 0.3;
            this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, 0, this.maxScroll);
            this.buttonContainer.y = -this.scrollOffset;
        });
        
        // Touch/drag scroll
        this.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.dragStartY = pointer.y;
            this.dragStartScroll = this.scrollOffset;
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                const deltaY = this.dragStartY - pointer.y;
                this.scrollOffset = this.dragStartScroll + deltaY;
                this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, 0, this.maxScroll);
                this.buttonContainer.y = -this.scrollOffset;
            }
        });
        
        this.input.on('pointerup', () => {
            this.isDragging = false;
        });
        
        // Indicadores de scroll (setas)
        if (this.maxScroll > 0) {
            this.scrollIndicatorUp = this.add.text(width / 2, containerStartY - 15, '▲', {
                fontSize: '24px',
                color: '#ecf0f1'
            }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.3);
            
            this.scrollIndicatorDown = this.add.text(width / 2, height - 30, '▼', {
                fontSize: '24px',
                color: '#ecf0f1'
            }).setOrigin(0.5).setScrollFactor(0);
        }
    }
    
    update() {
        // Atualizar visibilidade dos indicadores de scroll
        if (this.scrollIndicatorUp) {
            this.scrollIndicatorUp.setAlpha(this.scrollOffset > 0 ? 1 : 0.3);
        }
        if (this.scrollIndicatorDown) {
            this.scrollIndicatorDown.setAlpha(this.scrollOffset < this.maxScroll ? 1 : 0.3);
        }
        
        // Fade do título baseado no scroll
        if (this.titleText) {
            const fadeStart = 0;
            const fadeEnd = 100;
            const alpha = 1 - Phaser.Math.Clamp((this.scrollOffset - fadeStart) / (fadeEnd - fadeStart), 0, 1);
            this.titleText.setAlpha(alpha);
        }
    }
}
