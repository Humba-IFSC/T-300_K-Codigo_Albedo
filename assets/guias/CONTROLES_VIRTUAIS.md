# Guia de Controles Virtuais para Mobile

Este guia explica como funcionam os controles virtuais implementados no jogo para dispositivos móveis.

## 📱 Componentes Implementados

### 1. **VirtualJoystick** (Joystick Virtual)
Localizado em: `src/systems/ui/VirtualJoystick.js`

**Características:**
- Aparece no canto inferior esquerdo da tela quando você toca
- Funciona com gestos de arrastar (drag)
- Suporta controle analógico (quanto mais longe você arrasta, mais rápido se move)
- Desaparece quando você solta o dedo
- Dead zone configurável para evitar movimentos acidentais

**Como usar:**
1. Toque na metade esquerda da tela
2. Arraste na direção que deseja mover o personagem
3. Quanto mais longe você arrasta, mais rápido o personagem se move
4. Solte para parar

### 2. **VirtualButtons** (Botões de Ação)
Localizado em: `src/systems/ui/VirtualButtons.js`

**Botões disponíveis:**
- **Botão A (Verde)**: Interagir com objetos, NPCs, baús, portas
- **Botão B (Azul)**: Correr (mantém pressionado para correr)
- **Botão X (Laranja)**: Ação extra (pode ser customizado)

**Visual:**
- Usa sprites de botões estilo Xbox (`button_xbox_digital_a_5.png`, etc)
- Feedback visual ao pressionar (aumenta opacidade e reduz escala)
- Layout similar aos controles de console

**Posições:**
- Todos ficam no canto inferior direito
- Layout similar aos controles de console (A mais baixo e à direita)

### 3. **MovementController Atualizado**
Localizado em: `src/systems/input/MovementController.js`

**Melhorias:**
- Suporta controle por teclado (WASD/setas) E joystick virtual
- Prioriza o joystick quando está ativo
- Animações ajustadas à direção do movimento
- Suporte para corrida via botão virtual ou SHIFT

## 🎮 Como Funciona a Integração

### No BaseScene.js

```javascript
createVirtualControls() {
    // Cria joystick no canto inferior esquerdo
    this.virtualJoystick = new VirtualJoystick(this, 100, height - 100);
    
    // Cria botões no canto inferior direito
    this.virtualButtons = new VirtualButtons(this);
    
    // Configura eventos dos botões
    this.events.on('virtualbutton-down', (action) => {
        // Tratamento quando botão é pressionado
    });
}
```

### Detecção Automática de Dispositivos

O sistema detecta automaticamente se é um dispositivo touch:

```javascript
toggleVirtualControls() {
    const isTouchDevice = this.input.touch && this.input.touch.enabled;
    
    if (isTouchDevice || this.scale.width < 800) {
        // Mostra controles em mobile
        this.virtualJoystick.show();
        this.virtualButtons.show();
    } else {
        // Esconde em desktop
        this.virtualJoystick.hide();
        this.virtualButtons.hide();
    }
}
```

## 🔧 Configurações Customizáveis

### Joystick

```javascript
const joystick = new VirtualJoystick(scene, x, y, {
    baseRadius: 60,      // Tamanho do círculo externo
    stickRadius: 30,     // Tamanho do círculo interno
    maxDistance: 50,     // Distância máxima do arrasto
    alpha: 0.6           // Transparência
});
```

### Botões

```javascript
const buttons = new VirtualButtons(scene, {
    buttonRadius: 35,    // Tamanho dos botões
    alpha: 0.6,          // Transparência
    spacing: 15          // Espaçamento entre botões
});
```

### Controller de Movimento

```javascript
const movement = new MovementController(scene, player, {
    walkSpeed: 150,      // Velocidade de caminhada
    runSpeed: 260,       // Velocidade de corrida
    virtualJoystick: joystick  // Referência ao joystick
});
```

## 📝 Implementando em Suas Cenas

### Passo 1: Importar no BaseScene

```javascript
import { VirtualJoystick } from '../systems/ui/VirtualJoystick.js';
import { VirtualButtons } from '../systems/ui/VirtualButtons.js';
```

### Passo 2: Criar os Controles

```javascript
createCommonPlayer(x, y) {
    this.player = this.physics.add.sprite(x, y, 'player');
    
    // Criar controles virtuais
    this.createVirtualControls();
    
    // Criar movimento com referência ao joystick
    this.movement = new MovementController(this, this.player, {
        virtualJoystick: this.virtualJoystick
    });
}
```

### Passo 3: Implementar Interações

```javascript
handleInteraction() {
    // Override este método para definir o que acontece
    // quando o botão de interação (A) é pressionado
    
    if (this.currentInteractable === 'npc') {
        this.startNpcDialogue();
    } else if (this.currentInteractable === 'chest') {
        this.openChest();
    }
}

handleActionButton() {
    // Override para o botão X
    console.log('Ação extra');
}
```

### Passo 4: Rastrear Objetos Interativos

No método `update()` da sua cena, defina qual objeto está próximo:

```javascript
update() {
    this.updateBase();
    
    // Resetar no início do frame
    this.currentInteractable = null;
    
    // Verificar proximidade com objetos
    if (distanceToNPC < 50) {
        this.currentInteractable = 'npc';
        this.interactionPrompt.show();
    }
}
```

## 🎨 Customização Visual

### Assets dos Botões

Os botões usam sprites localizados em `assets/sprites/`:
- `button_xbox_digital_a_5.png` - Botão A (Interagir)
- `button_xbox_digital_b_4.png` - Botão B (Correr)
- `button_xbox_digital_x_4.png` - Botão X (Ação Extra)

Para trocar os sprites, substitua esses arquivos ou atualize as chaves no `BaseScene.preload()`:

```javascript
// Em BaseScene.js
this.load.image('button_a', 'assets/sprites/seu_botao_a.png');
this.load.image('button_b', 'assets/sprites/seu_botao_b.png');
this.load.image('button_x', 'assets/sprites/seu_botao_x.png');
```

### Ajustar Tamanho dos Botões

Edite o arquivo `VirtualButtons.js`:

```javascript
// No construtor
this.buttonRadius = 35;  // Altere este valor para mudar o tamanho
```

### Alterar Posicionamento

Edite o método `createButtons()` em `VirtualButtons.js`:

```javascript
const rightMargin = 80;   // Distância da borda direita
const bottomMargin = 80;  // Distância da borda inferior
```

### Alterar Aparência do Joystick

Edite o arquivo `VirtualJoystick.js`:

```javascript
createVisuals() {
    // Base (círculo externo)
    this.base = this.scene.add.circle(x, y, radius, 0x333333, alpha);
    this.base.setStrokeStyle(2, 0xffffff, alpha);
    
    // Stick (círculo interno)
    this.stick = this.scene.add.circle(x, y, radius, 0x666666, alpha);
    this.stick.setStrokeStyle(2, 0xffffff, alpha);
}
```

**Nota:** O joystick ainda usa desenhos de círculos. Para usar sprites no joystick, adicione imagens em `assets/sprites/` e adapte o `VirtualJoystick.js` de forma similar aos botões.

## 🐛 Resolução de Problemas

### Controles não aparecem em mobile

Verifique se `toggleVirtualControls()` está sendo chamado após criar os controles:

```javascript
createVirtualControls() {
    // ... criação dos controles ...
    this.toggleVirtualControls(); // Adicione esta linha
}
```

### Movimento não funciona com joystick

Certifique-se de passar a referência do joystick para o MovementController:

```javascript
this.movement = new MovementController(this, this.player, {
    virtualJoystick: this.virtualJoystick  // Importante!
});
```

### Botões não respondem

Verifique se os eventos estão configurados e os métodos override implementados:

```javascript
// Em BaseScene
this.events.on('virtualbutton-down', (action) => {
    this.onVirtualButtonDown(action);
});

// Na sua cena (GameScene, etc)
handleInteraction() {
    // Implementar lógica de interação
}
```

## 📱 Testando em Mobile

### Opção 1: Chrome DevTools
1. Abra o jogo no Chrome
2. Pressione F12
3. Clique no ícone de dispositivo móvel
4. Selecione um dispositivo para emular
5. Use o mouse para simular toques

### Opção 2: Servidor Local + Dispositivo Real
1. Execute o jogo em um servidor local
2. Descubra o IP da sua máquina (`ipconfig` ou `ifconfig`)
3. Acesse `http://SEU_IP:PORTA` no navegador do celular
4. Teste com toques reais

### Opção 3: Deploy Temporário
1. Faça deploy em um serviço como Netlify ou Vercel
2. Acesse a URL no dispositivo móvel
3. Teste a experiência completa

## 🚀 Próximos Passos

- **Feedback Háptico**: Adicionar vibração ao tocar botões (API Vibration)
- **Customização**: Permitir que o jogador mova/redimensione controles
- **Salvamento**: Salvar preferências de controle no localStorage
- **Mais Botões**: Adicionar botões para inventário, mapa, etc.
- **Modo Paisagem**: Otimizar layout para diferentes orientações

## 📚 Recursos Adicionais

- [Phaser Input Documentation](https://photonstorm.github.io/phaser3-docs/Phaser.Input.html)
- [Touch Events API](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Mobile Game Development Best Practices](https://phaser.io/tutorials/making-your-first-phaser-3-game)

---

Desenvolvido para o projeto T-300 K-Codigo Albedo 🎮
