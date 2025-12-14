# Legend of the Wispguard

![License](https://img.shields.io/badge/license-MIT-green)

![Monster Tamer Logo](/docs/logo.png?raw=true 'Monster Tamer Logo')

Legend of the Wispguard - Zelda-like Tutorial with [Phaser 3](https://github.com/photonstorm/phaser)!

This repo is the official code repository for the <a href="https://www.youtube.com/playlist?list=PLmcXe0-sfoShPM_vCNsuumh7crnNaLCwX" target="_blank">Legend of the Wispguard: Build a Zelda-Like Game in Phaser 3 Course</a> that is available on YouTube.

## Demo

You can find a playable demo of the game on Itch.io here: [Legend of the Wispguard](https://galemius.itch.io/legend-of-the-wispguard)

![Game play Screenshot 1](/docs/screenshot1.png?raw=true 'Screenshot 1')
![Game play Screenshot 2](/docs/screenshot2.png?raw=true 'Screenshot 2')
![Game play Screenshot 3](/docs/screenshot3.png?raw=true 'Screenshot 3')

## How To Play

Currently, the only supported way to play the game is with a Keyboard.

### Controls

| Keys                                   | Description                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Arrow Keys (Up, Down, Left, and Right) | Moves the player. Navigate menu.                                                                      |
| Z                                      | Attack                                                                                                |
| X                                      | Lift/Throw                                                                                            |
| Enter                                  | Select menu option.                                                                                   |


## Local Development

### Requirements

<a href="https://nodejs.org" target="_blank">Node.js</a> and <a href="https://pnpm.io/" target="_blank">pnpm</a> are required to install dependencies and run scripts via `pnpm`.

**Note:** You can also use `npm` to install the required project dependencies. To do this, replace the commands listed below with the relevant `npm` command, such as `npm install` or `npm run start`.

<a href="https://vitejs.dev/" target="_blank">Vite</a> is required to bundle and serve the web application. This is included as part of the projects dev dependencies.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install --frozen-lockfile` | Install project dependencies |
| `pnpm start` | Build project and open web server running project |
| `pnpm build` | Builds code bundle for production |
| `pnpm lint` | Uses ESLint to lint code |

### Writing Code

After cloning the repo, run `pnpm install --frozen-lockfile` from your project directory. Then, you can start the local development
server by running `pnpm start`.

After starting the development server with `pnpm start`, you can edit any files in the `src` folder
and parcel will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

### Deploying Code

After you run the `pnpm build` command, your code will be built into a single bundle located at
`dist/*` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://myserver.com`),
you should be able to open `http://myserver.com/index.html` and play your game.

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at `http://localhost:8080/path-to-file-your-file/file-name.file-type`.

## Credits

This project would have not been possible without the use of some awesome assets created by some amazing artists! This project would not have been possible without the following people/resources:

| Asset                       | Author           | Link                                                                   |
| --------------------------- | ---------------- | ---------------------------------------------------------------------- |
| Press Start 2P Font         | CodeMan38        | [Kenney Fonts](https://fonts.google.com/specimen/Press+Start+2P)       |
| Player                      | Foozle           | [Legend Main Character](https://foozlecc.itch.io/legend-main-character)|
| Enemies                     | Foozle           | [Legend Enemy Pack 1](https://foozlecc.itch.io/legend-enemy-pack-1)    |
| Dungeon Pack                | Foozle           | [Legend Spider Dungeon](https://foozlecc.itch.io/legend-spider-dungeon)|
| UI Icons                    | Foozle           | [Legend UI Icons](https://foozlecc.itch.io/legend-ui-icons)            |

## Issues

For any issues you encounter, please open a new [GitHub Issue](https://github.com/devshareacademy/phaser-zelda-like-tutorial/issues) on this project.
