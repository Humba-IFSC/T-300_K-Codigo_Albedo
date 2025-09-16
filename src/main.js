import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    pixelArt: true,            // evita borrões e gaps
    backgroundColor: '#000000',
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);