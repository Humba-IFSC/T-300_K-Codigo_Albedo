// Funcionalidade específica da crowbar

export function useCrowbar(target) {
    // Exemplo: quebra caixa
    if (target && target.getData('breakable')) {
        target.scene.tweens.add({
            targets: target,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            onComplete: () => { target.destroy(); }
        });
        return true;
    }
    return false;
}
