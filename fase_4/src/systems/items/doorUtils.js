// Funções para criar e manipular portas

export function createDoor(scene, x, y, texture = 'door') {
    const door = scene.physics.add.sprite(x, y, texture).setImmovable(true);
    return door;
}

export function setupDoorInteraction(scene, player, door, callback, prompt) {
    scene.physics.add.collider(player, door);
    scene.events.on('update', () => {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, door.x, door.y);
        if (distance < 50) {
            prompt.show();
            if (Phaser.Input.Keyboard.JustDown(scene.interactKey)) {
                callback();
            }
        } else {
            prompt.hide();
        }
    });
}
