import * as Phaser from 'phaser';

/**
 * Creates a flash animation effect by using the built in Phaser 3 Timer Events. The provided game object
 * will be the target of the effect that is created.
 * @param {Phaser.GameObjects.Image | Phaser.GameObjects.Sprite} target The target game object that the effect will be applied to.
 * @param {() => void} [callback] The callback that will be invoked when the tween is finished
 * @returns {void}
 */
export function flash(target: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, callback?: () => void): void {
  const timeEvent = target.scene.time.addEvent({
    delay: 250,
    callback: () => {
      target.setTintFill(0xffffff);
      target.setAlpha(0.7);

      target.scene.time.addEvent({
        delay: 150,
        callback: () => {
          target.setTint(0xffffff);
          target.setAlpha(1);
          if (timeEvent.getOverallProgress() === 1 && callback) {
            callback();
          }
        },
      });
    },
    startAt: 150,
    repeat: 3,
  });
}
