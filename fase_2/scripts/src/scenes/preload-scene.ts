import * as Phaser from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { ASSET_KEYS, ASSET_PACK_KEYS, ZOMBIE_ANIMATION_KEYS } from '../common/assets';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  public preload(): void {
    // load asset pack that has assets for the rest of the game
    this.load.pack(ASSET_PACK_KEYS.MAIN, 'assets/data/assets.json');
  }

  public create(): void {
    this.#createAnimations();
    
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }

  #createAnimations(): void {
    this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
    this.anims.createFromAseprite(ASSET_KEYS.SPIDER);
    // Zombie is provided as a spritesheet (32x32 frames). Create animations manually
    // Use 0-based frames according to the sprite sheet specification you provided:
    // idle: frames 1-8  => 0..7
    // hit/attack: frames 9-15 => 8..14
    // walk/run: frames 16-23 => 15..22
    // death: frames 46-53 => 45..52
    this.anims.create({
      key: ZOMBIE_ANIMATION_KEYS.IDLE,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.ZOMBIE, { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: ZOMBIE_ANIMATION_KEYS.HIT,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.ZOMBIE, { start: 8, end: 14 }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: ZOMBIE_ANIMATION_KEYS.WALK,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.ZOMBIE, { start: 15, end: 22 }),
      frameRate: 8,
      repeat: -1,
    });

    // death frames provided in the spritesheet (frames 46-53 => 0-based 45-52)
    this.anims.create({
      key: ZOMBIE_ANIMATION_KEYS.DEATH,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.ZOMBIE, { start: 45, end: 52 }),
      frameRate: 8,
      repeat: 0,
    });
    this.anims.createFromAseprite(ASSET_KEYS.WISP);
    this.anims.create({
      key: ASSET_KEYS.ENEMY_DEATH,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.ENEMY_DEATH),
      frameRate: 6,
      repeat: 0,
      delay: 0,
    });
  }
}
