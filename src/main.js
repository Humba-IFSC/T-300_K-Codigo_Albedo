    import config from './scenes/config.js'
    import firstFloor from './scenes/firstFloor.js'

    class Game extends Phaser.Game {
        constructor () {
            super(config)

            this.scene.add('firstFloor', firstFloor)
            this.scene.start('firstFloor')
        }
    }

    window.onload = () => {
        window.game = new Game()
    }