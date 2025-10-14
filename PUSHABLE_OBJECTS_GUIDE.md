# 🎮 Sistema de Objetos Empurráveis - Estilo Zelda Antigo

Este guia explica como usar o sistema de objetos empurráveis/arrastáveis implementado no jogo.

## 🌟 Características

- **Empurrar automático**: Basta andar contra o objeto para empurrá-lo
- **Movimento suave**: Objetos se movem tile por tile (32 pixels)
- **Colisão com paredes**: Objetos respeitam paredes e obstáculos
- **Tecla de empurrar**: Pode usar a tecla `C` para empurrar (opcional)
- **Sistema modular**: Fácil de adicionar/remover objetos

## 📦 Como Usar

### 1. Inicializar o Sistema na Cena

No método `create()` da sua cena:

```javascript
import { PushableObjectManager } from '../systems/items/PushableObject.js';

// Criar o gerenciador (já feito na GameScene.js)
this.pushableManager = new PushableObjectManager(this, this.player);
```

### 2. Adicionar Objetos Empurráveis

```javascript
// Adicionar um objeto na posição (x, y)
const bloco = this.pushableManager.addObject(400, 300, 'box', {
    pushSpeed: 60,        // Velocidade do empurrão (pixels/segundo)
    pushDistance: 32,     // Distância do movimento (1 tile)
    canBePushed: true,    // Se pode ser empurrado
    
    // Callbacks opcionais
    onPushStart: (obj, direction) => {
        console.log(`Começou a empurrar para ${direction}`);
    },
    onPushEnd: (obj, direction) => {
        console.log(`Terminou de empurrar`);
    }
});
```

### 3. Atualizar no Loop de Jogo

No método `update()`:

```javascript
update() {
    // ... seu código ...
    
    // Atualizar sistema de empurrar (já feito na GameScene.js)
    if (this.pushableManager) {
        this.pushableManager.update();
    }
}
```

### 4. Adicionar Colisões

```javascript
// Colisão com paredes (importante!)
if (walls) {
    this.pushableManager.objects.forEach(obj => {
        this.physics.add.collider(obj.sprite, walls);
    });
}

// Colisão entre objetos empurráveis (opcional)
this.pushableManager.objects.forEach(obj1 => {
    this.pushableManager.objects.forEach(obj2 => {
        if (obj1 !== obj2) {
            this.physics.add.collider(obj1.sprite, obj2.sprite);
        }
    });
});
```

## 🎯 Exemplos Práticos

### Criar Bloco que Abre Porta

```javascript
const bloco = this.pushableManager.addObject(450, 200, 'box', {
    onPushEnd: (obj, direction) => {
        // Verificar se o bloco está em uma posição específica
        if (obj.sprite.x === 480 && obj.sprite.y === 224) {
            console.log('Puzzle resolvido! Abrindo porta...');
            this.abrirPortaSecreta();
        }
    }
});
```

### Criar Bloco que Só Pode Ser Empurrado em Uma Direção

```javascript
const bloco = this.pushableManager.addObject(500, 300, 'box', {
    onPushStart: (obj, direction) => {
        // Só permite empurrar para baixo
        if (direction !== 'down') {
            obj.isPushing = false; // Cancela o empurrão
            return false;
        }
    }
});
```

### Criar Bloco Pesado (Mais Lento)

```javascript
const blocoGrande = this.pushableManager.addObject(350, 250, 'box', {
    pushSpeed: 30,      // Mais lento que o padrão (60)
    pushDistance: 32
});
```

### Desabilitar/Habilitar Empurrão

```javascript
// Desabilitar temporariamente
bloco.disable();

// Habilitar novamente
bloco.enable();
```

## 🎮 Controles

- **Andar contra o objeto**: Empurra automaticamente na direção que está andando
- **Tecla C** (opcional): Pode segurar para empurrar

## ⚙️ Configuração Avançada

### Mudar Modo de Empurrar

```javascript
// Desabilitar empurrar automático (só com tecla C)
this.pushableManager.autoPush = false;

// Mudar a tecla de empurrar
this.pushableManager.pushKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
```

### Verificação de Colisão Personalizada

Edite o método `_canMoveToPosition()` em `PushableObject.js`:

```javascript
_canMoveToPosition(position) {
    // Verificar se há água nessa posição
    const tile = this.scene.map.getTileAtWorldXY(position.x, position.y);
    if (tile && tile.index === 21) { // 21 = água
        return false; // Não pode empurrar para água
    }
    return true;
}
```

## 📝 Notas Importantes

1. **Ordem de criação**: Crie o `PushableObjectManager` DEPOIS de criar o player
2. **Colisões**: Sempre adicione colisão com paredes/obstáculos
3. **Performance**: O sistema suporta múltiplos objetos simultaneamente
4. **Persistência**: Para salvar posição dos blocos entre cenas, use `window._pushablePositions`

## 🐛 Troubleshooting

### Objeto não empurra
- Verifique se `canBePushed` está `true`
- Confirme que o `pushableManager.update()` está sendo chamado
- Certifique-se que o player está colidindo com o objeto

### Objeto atravessa paredes
- Adicione colisão: `this.physics.add.collider(obj.sprite, walls)`

### Movimento muito rápido/lento
- Ajuste `pushSpeed` nas opções do objeto

## 🎨 Customização Visual

Para adicionar animação do jogador empurrando, edite `BaseScene.js`:

```javascript
// Adicionar animações de empurrar
this.anims.create({ 
    key: 'push-down', 
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), 
    frameRate: 4, // Mais lento que andar
    repeat: -1 
});
// ... outras direções ...
```

Então no `PushableObjectManager`, detecte quando está empurrando e mude a animação.

## 🚀 Próximos Passos

- Adicionar som de empurrar (stone_push.mp3)
- Criar sistema de pressão de placas
- Implementar blocos de gelo que deslizam
- Adicionar blocos especiais (pesados, que só movem com item especial)

---

**Criado para**: T-300_K-Codigo_Albedo  
**Data**: Outubro 2025
