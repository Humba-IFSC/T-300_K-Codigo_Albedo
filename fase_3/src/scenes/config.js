export default {
    type: Phaser.AUTO, // Tipo de renderização: tenta usar WebGL e cai para Canvas se não for suportado
    title: 'Feira de Jogos',
    description: '',
    parent: 'game-container', // ID do elemento HTML onde o jogo será inserido
    width: 1280,
    height: 720,
    backgroundColor: '#3a3a50', // Cor de fundo do jogo
    pixelArt: true, // false para suavização de imagens, true para estilo pixelado
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta o jogo para caber na tela mantendo proporção
        autoCenter: Phaser.Scale.CENTER_BOTH // Centraliza o jogo na tela
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0}
        }
    }
}