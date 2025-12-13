// Funções genéricas para manipulação de itens e inventário

export function addItemToInventory(inventory, item) {
    // Adiciona item ao final do inventário
    inventory.push(item);
    return inventory;
}

export function removeItemFromInventory(inventory, item) {
    const idx = inventory.indexOf(item);
    if (idx !== -1) inventory.splice(idx, 1);
    return inventory;
}

export function hasItem(inventory, item) {
    return inventory.includes(item);
}

export function getInventory() {
    // Retorna inventário global (window._inventory)
    if (!window._inventory) window._inventory = [];
    return window._inventory;
}
