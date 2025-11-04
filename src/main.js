import TitleScene from './scenes/TitleScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';
import SecondScene from './scenes/SecondScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    pixelArt: true,            // evita borrões e gaps
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    input: {
        activePointers: 3,  // Suporta múltiplos toques simultâneos
        touch: {
            target: null,
            capture: true
        }
    },
    scene: [TitleScene, IntroScene, GameScene, SecondScene] // TitleScene é a primeira
};

const game = new Phaser.Game(config);