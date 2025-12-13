// Funcionalidade da chave

export function useKey(door, inventory) {
    // Só abre a porta se o inventário tiver a chave
    if (inventory && inventory.includes('key')) {
        door.setData('unlocked', true);
        return true;
    }
    return false;
}
