export class UICameraManager {
    /**
     * Gerencia segunda câmera para UI: cria câmera sem zoom, registra elementos UI e aplica ignore.
     * @param {Phaser.Scene} scene
     * @param {{ zoom?: number }} options
     */
    constructor(scene, { zoom = 1 } = {}) {
        this.scene = scene;
        // cria câmera de UI
        this.camera = scene.cameras.add(0, 0, scene.scale.width, scene.scale.height);
        this.camera.setScroll(0, 0).setZoom(zoom);
        this.camera.roundPixels = true;
    }

    /**
     * Aplica ignores entre mundo e UI.
     * @param {Phaser.Cameras.Scene2D.Camera} worldCamera
     * @param {Phaser.GameObjects.GameObject[]} uiElements
     * @param {Phaser.GameObjects.GameObject[]} worldObjects
     */
    applyIgnores(worldCamera, uiElements, worldObjects) {
        worldCamera.ignore(uiElements);
        this.camera.ignore(worldObjects);
    }

    ignore(obj) { this.camera.ignore(obj); }
}
