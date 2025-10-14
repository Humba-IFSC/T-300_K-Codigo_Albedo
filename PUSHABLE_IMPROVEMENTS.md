# 🎮 Melhorias Futuras - Sistema de Objetos Empurráveis

## 🚀 Melhorias Sugeridas

### 1. Animação do Jogador Empurrando

Adicione animações específicas para quando o jogador está empurrando:

```javascript
// Em BaseScene.js, adicionar no _createPlayerAnims()
this.anims.create({ 
    key: 'push-down', 
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), 
    frameRate: 4, // Mais lento
    repeat: -1 
});
this.anims.create({ key: 'push-left', frames: [...], frameRate: 4, repeat: -1 });
this.anims.create({ key: 'push-right', frames: [...], frameRate: 4, repeat: -1 });
this.anims.create({ key: 'push-up', frames: [...], frameRate: 4, repeat: -1 });
```

Então, modificar `MovementController.js` para detectar empurrar:

```javascript
update() {
    // ... código existente ...
    
    // Verificar se está empurrando
    const isPushing = this.scene.pushableManager?.objects.some(obj => obj.isPushing && obj.pusher === this.player);
    
    const prefix = isPushing ? 'push' : (this.isRunning && this._hasRunAnimCache) ? 'run' : 'walk';
    
    // ... resto do código ...
}
```

### 2. Partículas ao Empurrar

```javascript
// No PushableObject.js, adicionar no método push():
if (this.scene.add.particles) {
    const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
        speed: { min: 20, max: 50 },
        scale: { start: 0.5, end: 0 },
        lifespan: 300,
        quantity: 5,
        emitting: false
    });
    particles.explode();
}
```

### 3. Câmera Shake ao Empurrar

```javascript
onPushStart: (obj) => {
    this.cameras.main.shake(100, 0.002);
}
```

### 4. Marcas no Chão

```javascript
// Criar sprite de marca quando bloco se move
onPushEnd: (obj) => {
    const marca = this.add.sprite(obj.sprite.x, obj.sprite.y, 'floor-mark');
    marca.setDepth(-1); // Atrás do bloco
    marca.setAlpha(0.3);
    
    // Fade out após alguns segundos
    this.tweens.add({
        targets: marca,
        alpha: 0,
        duration: 3000,
        onComplete: () => marca.destroy()
    });
}
```

### 5. Blocos com Peso Diferente

```javascript
// Criar tipos de blocos
const BLOCK_TYPES = {
    LEVE: { pushSpeed: 80, tint: 0xffff99, requiresItem: null },
    NORMAL: { pushSpeed: 60, tint: 0xffffff, requiresItem: null },
    PESADO: { pushSpeed: 30, tint: 0x666666, requiresItem: 'power-gloves' },
    SUPER_PESADO: { pushSpeed: 15, tint: 0x333333, requiresItem: 'titan-gloves' }
};

function criarBlocoPorTipo(tipo, x, y) {
    const config = BLOCK_TYPES[tipo];
    const bloco = this.pushableManager.addObject(x, y, 'box', {
        pushSpeed: config.pushSpeed
    });
    bloco.sprite.setTint(config.tint);
    
    if (config.requiresItem) {
        bloco.canBePushed = false;
        // Verificar item no update...
    }
    
    return bloco;
}
```

### 6. Efeito Sonoro com Variação

```javascript
// Carregar múltiplos sons
this.load.audio('push1', 'assets/sounds/push1.mp3');
this.load.audio('push2', 'assets/sounds/push2.mp3');
this.load.audio('push3', 'assets/sounds/push3.mp3');

// No callback:
onPushStart: (obj) => {
    const soundIndex = Phaser.Math.Between(1, 3);
    this.sound.play(`push${soundIndex}`, { volume: 0.3 });
}
```

### 7. Sistema de Desfazer (Undo)

```javascript
class PuzzleHistory {
    constructor() {
        this.history = [];
        this.maxHistory = 10;
    }
    
    save(positions) {
        this.history.push([...positions]);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    undo() {
        if (this.history.length > 1) {
            this.history.pop(); // Remove estado atual
            return this.history[this.history.length - 1];
        }
        return null;
    }
}

// Usar:
this.puzzleHistory = new PuzzleHistory();

onPushEnd: (obj) => {
    const positions = this.pushableManager.objects.map(o => ({
        x: o.sprite.x,
        y: o.sprite.y
    }));
    this.puzzleHistory.save(positions);
}

// Tecla Z para desfazer
const undoKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
undoKey.on('down', () => {
    const lastState = this.puzzleHistory.undo();
    if (lastState) {
        lastState.forEach((pos, i) => {
            const obj = this.pushableManager.objects[i];
            obj.sprite.setPosition(pos.x, pos.y);
        });
    }
});
```

### 8. Indicador Visual de Direção Bloqueada

```javascript
// Se o bloco não pode ser empurrado em uma direção
onPushStart: (obj, direction) => {
    if (!this._canMoveToPosition(this.targetPosition)) {
        // Criar X vermelho temporário
        const x = this.sprite.x;
        const y = this.sprite.y;
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, 0xff0000);
        graphics.strokeCircle(x, y, 20);
        graphics.lineBetween(x - 15, y - 15, x + 15, y + 15);
        graphics.lineBetween(x + 15, y - 15, x - 15, y + 15);
        
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 500,
            onComplete: () => graphics.destroy()
        });
        
        return false;
    }
}
```

### 9. Sistema de Pegadas/Rastro

```javascript
// Adicionar rastro visual quando arrasta
let lastTrailTime = 0;

onPushStart: (obj) => {
    this.scene.time.addEvent({
        delay: 100,
        callback: () => {
            if (obj.isPushing) {
                const trail = this.scene.add.sprite(obj.sprite.x, obj.sprite.y, 'trail-mark');
                trail.setDepth(-10);
                trail.setAlpha(0.4);
                this.scene.tweens.add({
                    targets: trail,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => trail.destroy()
                });
            }
        },
        loop: true
    });
}
```

### 10. Detecção de Puzzles Impossíveis

```javascript
// Verificar se o puzzle ainda é solucionável
function verificarPuzzleSolucionavel() {
    // Exemplo: bloco encostado em canto
    this.pushableManager.objects.forEach(obj => {
        const x = obj.sprite.x / 32; // Converter para grid
        const y = obj.sprite.y / 32;
        
        // Verificar tiles ao redor
        const esquerda = this.map.getTileAt(x - 1, y);
        const direita = this.map.getTileAt(x + 1, y);
        const cima = this.map.getTileAt(x, y - 1);
        const baixo = this.map.getTileAt(x, y + 1);
        
        // Se encostado em canto, mostrar aviso
        if ((esquerda?.collides && cima?.collides) ||
            (direita?.collides && cima?.collides) ||
            (esquerda?.collides && baixo?.collides) ||
            (direita?.collides && baixo?.collides)) {
            console.log('⚠️ Bloco encostado em canto! Pressione R para resetar.');
            this.mostrarAvisoReset();
        }
    });
}
```

## 🎯 Melhorias de Performance

### Spatial Hashing para Colisões

```javascript
// Para muitos objetos, usar grid de colisão
class SpatialGrid {
    constructor(cellSize = 64) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }
    
    getCell(x, y) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        return `${cx},${cy}`;
    }
    
    add(obj) {
        const cell = this.getCell(obj.x, obj.y);
        if (!this.grid.has(cell)) {
            this.grid.set(cell, []);
        }
        this.grid.get(cell).push(obj);
    }
    
    getNearby(x, y) {
        const cell = this.getCell(x, y);
        return this.grid.get(cell) || [];
    }
}
```

### Object Pooling

```javascript
// Reusar objetos ao invés de criar/destruir
class PushableObjectPool {
    constructor(scene, maxSize = 20) {
        this.scene = scene;
        this.pool = [];
        this.active = [];
        
        // Pré-criar objetos
        for (let i = 0; i < maxSize; i++) {
            const obj = new PushableObject(scene, 0, 0, 'box');
            obj.sprite.setActive(false).setVisible(false);
            this.pool.push(obj);
        }
    }
    
    spawn(x, y, texture) {
        let obj = this.pool.pop();
        if (!obj) {
            obj = new PushableObject(this.scene, x, y, texture);
        } else {
            obj.sprite.setPosition(x, y);
            obj.sprite.setActive(true).setVisible(true);
        }
        this.active.push(obj);
        return obj;
    }
    
    despawn(obj) {
        obj.sprite.setActive(false).setVisible(false);
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.pool.push(obj);
        }
    }
}
```

## 📱 Suporte Mobile

```javascript
// Adicionar controles touch para empurrar
criarControlesMobile() {
    // Botão virtual de empurrar
    const pushButton = this.add.circle(700, 500, 40, 0x00ff00, 0.5);
    pushButton.setScrollFactor(0);
    pushButton.setInteractive();
    
    pushButton.on('pointerdown', () => {
        this.pushableManager.autoPush = true;
    });
    
    pushButton.on('pointerup', () => {
        this.pushableManager.autoPush = false;
    });
}
```

---

**Divirta-se criando seus puzzles estilo Zelda! 🎮✨**
