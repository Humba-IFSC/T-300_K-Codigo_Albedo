import GameScene from './scenes/GameScene.js';
import SecondScene from './scenes/SecondScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
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
    scene: [GameScene, SecondScene]
};

const game = new Phaser.Game(config);