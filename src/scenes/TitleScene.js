/**
 * TitleScene - Tela de título com seleção de mapas
 * 
 * Permite escolher entre diferentes cenas/mapas do jogo
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
        
        // Título do jogo
        this.add.text(width / 2, 100, 'T-300 K-CODIGO ALBEDO', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ecf0f1',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Subtítulo
        this.add.text(width / 2, 160, 'Selecione um Mapa', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#bdc3c7',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Lista de mapas disponíveis
        const maps = [
            { name: 'Introdução', scene: 'IntroScene', color: 0x3498db },
            { name: 'Mapa Principal', scene: 'GameScene', color: 0x2ecc71 },
            { name: 'Segunda Área', scene: 'SecondScene', color: 0xe74c3c }
        ];
        
        const startY = 250;
        const spacing = 120;
        
        maps.forEach((map, index) => {
            const y = startY + (index * spacing);
            
            // Botão (retângulo)
            const button = this.add.rectangle(width / 2, y, 400, 80, map.color, 0.9);
            button.setInteractive({ useHandCursor: true });
            
            // Texto do botão
            const text = this.add.text(width / 2, y, map.name, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
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
        
        // Instruções na parte inferior
        this.add.text(width / 2, height - 40, 'Clique em um mapa para começar', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#95a5a6',
            style: 'italic'
        }).setOrigin(0.5);
        
        // Dica de desenvolvimento
        this.add.text(10, height - 30, 'Dev: ESC para voltar ao menu (em qualquer cena)', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#7f8c8d'
        }).setOrigin(0);
    }
}
