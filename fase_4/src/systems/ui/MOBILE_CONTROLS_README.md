# 📱 Mobile Controls - Sistema Unificado de Controles Virtuais

Sistema completo e portátil de controles touch para jogos Phaser 3. Inclui joystick virtual e botões de ação totalmente personalizáveis.

## ✨ Características

- ✅ **100% Portátil** - Copie um único arquivo e use em qualquer projeto Phaser 3
- ✅ **Auto-detecção** - Detecta automaticamente dispositivos móveis
- ✅ **Joystick Virtual** - Controle analógico com dead zone configurável
- ✅ **Botões Customizáveis** - Crie quantos botões quiser com cores e sprites personalizados
- ✅ **Sistema de Eventos** - Integração fácil via eventos do Phaser
- ✅ **Totalmente Configurável** - Todas as opções podem ser personalizadas
- ✅ **Feedback Visual** - Animações e feedback visual nos toques

## 📦 Instalação

### Método 1: Copiar Arquivo Único

Basta copiar o arquivo `MobileControls.js` para seu projeto:

```
seu-projeto/
  └── src/
      └── systems/
          └── MobileControls.js
```

### Método 2: Importar Diretamente

Se você tem um sistema de módulos ES6 configurado:

```javascript
import { MobileControls } from './path/to/MobileControls.js';
```

## 🚀 Uso Rápido

### Exemplo Básico

```javascript
// Na sua cena Phaser
class GameScene extends Phaser.Scene {
    create() {
        // Criar controles móveis com configuração padrão
        this.mobileControls = new MobileControls(this);
        
        // Criar seu jogador
        this.player = this.physics.add.sprite(400, 300, 'player');
    }
    
    update() {
        // Controle de movimento com joystick
        if (this.mobileControls.joystick && this.mobileControls.joystick.isActive()) {
            const direction = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            const speed = 200;
            
            this.player.setVelocity(
                direction.x * speed * force,
                direction.y * speed * force
            );
        } else {
            this.player.setVelocity(0, 0);
        }
        
        // Verificar botões
        if (this.mobileControls.isButtonPressed('interact')) {
            this.interact();
        }
        
        if (this.mobileControls.isButtonPressed('run')) {
            this.playerSpeed = 300; // Aumenta velocidade
        }
    }
}
```

## ⚙️ Configuração Avançada

### Configuração Completa

```javascript
this.mobileControls = new MobileControls(this, {
    // Configuração do Joystick
    joystick: {
        enabled: true,              // Ativar/desativar joystick
        baseRadius: 60,             // Raio da base (pixels)
        stickRadius: 30,            // Raio do stick (pixels)
        maxDistance: 50,            // Distância máxima do stick
        alpha: 0.6,                 // Opacidade (0-1)
        deadZone: 0.2               // Zona morta (0-1)
    },
    
    // Configuração dos Botões
    buttons: [
        {
            action: 'interact',     // Nome da ação
            label: 'A',             // Texto do botão
            color: 0x00FF00,        // Cor (hexadecimal)
            position: 'right-bottom', // Posição relativa
            sprite: 'button_a'      // Sprite opcional
        },
        {
            action: 'run',
            label: 'B',
            color: 0xFF0000,
            position: 'left-top'
        },
        {
            action: 'jump',
            label: 'X',
            color: 0x0000FF,
            position: 'top'
        }
    ],
    
    // Configurações Gerais dos Botões
    buttonRadius: 50,               // Raio dos botões
    buttonAlpha: 0.8,               // Opacidade dos botões
    buttonSpacing: 20,              // Espaçamento entre botões
    
    // Configurações do Sistema
    autoDetectMobile: true,         // Auto-detectar mobile
    alwaysShow: false               // Sempre mostrar (mesmo em desktop)
});
```

### Posições Disponíveis para Botões

- `'right-bottom'` - Canto inferior direito (posição principal)
- `'left-top'` - Esquerda e acima do principal
- `'top'` - Diretamente acima do principal
- `'right-top'` - Direita e acima
- `'left-bottom'` - Esquerda e no mesmo nível

## 🎮 API Completa

### Classe Principal: MobileControls

#### Propriedades

```javascript
mobileControls.joystick    // Instância do VirtualJoystick
mobileControls.buttons     // Instância do VirtualButtonsManager
mobileControls.isMobile    // Boolean: true se dispositivo móvel
mobileControls.enabled     // Boolean: controles habilitados
mobileControls.visible     // Boolean: controles visíveis
```

#### Métodos

```javascript
// Verificar botão
mobileControls.isButtonPressed('action')  // Returns: boolean

// Visibilidade
mobileControls.show()                     // Mostra controles
mobileControls.hide()                     // Esconde controles

// Estado
mobileControls.enable()                   // Habilita controles
mobileControls.disable()                  // Desabilita controles

// Destruição
mobileControls.destroy()                  // Limpa tudo
```

### Joystick Virtual

#### Métodos

```javascript
// Direção
const direction = joystick.getDirection()  // { x: number, y: number }
// Retorna vetor normalizado (-1 a 1 em cada eixo)

// Força/Intensidade
const force = joystick.getForce()         // 0 a 1
// Retorna a intensidade do movimento (considerando dead zone)

// Estado
const isActive = joystick.isActive()      // boolean
// true se o joystick está sendo usado
```

### Botões

#### Métodos

```javascript
// Verificar estado de um botão específico
const isPressed = buttons.isButtonDown('action')  // boolean
```

## 📡 Sistema de Eventos

O sistema emite eventos que você pode escutar:

```javascript
// Evento: Botão Pressionado
this.events.on('mobilecontrols-button-down', (data) => {
    console.log('Botão pressionado:', data.action);
    
    if (data.action === 'interact') {
        // Fazer algo
    }
});

// Evento: Botão Solto
this.events.on('mobilecontrols-button-up', (data) => {
    console.log('Botão solto:', data.action);
});

// Evento: Joystick Começou
this.events.on('mobilecontrols-joystick-start', () => {
    console.log('Jogador começou a mover');
});

// Evento: Joystick Parou
this.events.on('mobilecontrols-joystick-end', () => {
    console.log('Jogador parou de mover');
});
```

## 💡 Exemplos Práticos

### Exemplo 1: Movimento com Animações

```javascript
update() {
    const joystick = this.mobileControls.joystick;
    
    if (joystick && joystick.isActive()) {
        const dir = joystick.getDirection();
        const force = joystick.getForce();
        const speed = 200;
        
        this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
        
        // Animações baseadas na direção
        if (Math.abs(dir.x) > Math.abs(dir.y)) {
            // Movimento horizontal dominante
            if (dir.x > 0) {
                this.player.anims.play('walk-right', true);
            } else {
                this.player.anims.play('walk-left', true);
            }
        } else {
            // Movimento vertical dominante
            if (dir.y > 0) {
                this.player.anims.play('walk-down', true);
            } else {
                this.player.anims.play('walk-up', true);
            }
        }
    } else {
        this.player.setVelocity(0, 0);
        this.player.anims.stop();
    }
}
```

### Exemplo 2: Sistema de Corrida

```javascript
create() {
    this.mobileControls = new MobileControls(this, {
        buttons: [
            { action: 'interact', label: 'A', color: 0x00FF00 },
            { action: 'run', label: 'B', color: 0xFF0000 }
        ]
    });
    
    this.isRunning = false;
}

update() {
    // Verifica se está correndo
    this.isRunning = this.mobileControls.isButtonPressed('run');
    
    const speed = this.isRunning ? 300 : 150;
    const animPrefix = this.isRunning ? 'run' : 'walk';
    
    if (this.mobileControls.joystick.isActive()) {
        const dir = this.mobileControls.joystick.getDirection();
        const force = this.mobileControls.joystick.getForce();
        
        this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
        this.player.anims.play(`${animPrefix}-down`, true);
    }
}
```

### Exemplo 3: Desabilitar Durante Diálogos

```javascript
showDialogue(text) {
    // Desabilita controles durante diálogo
    this.mobileControls.disable();
    
    // Mostra diálogo
    this.dialogueBox.show(text);
    
    // Quando terminar o diálogo
    this.dialogueBox.on('close', () => {
        this.mobileControls.enable();
    });
}
```

### Exemplo 4: Mostrar Apenas em Mobile

```javascript
create() {
    // Criar controles que aparecem apenas em dispositivos móveis
    this.mobileControls = new MobileControls(this, {
        autoDetectMobile: true,
        alwaysShow: false  // Não mostra em desktop
    });
    
    // Verificar se está em mobile
    if (this.mobileControls.isMobile) {
        console.log('Jogando em dispositivo móvel');
    } else {
        console.log('Jogando em desktop - use teclado');
    }
}
```

### Exemplo 5: Usar Sprites Personalizados

```javascript
preload() {
    // Carregar sprites dos botões
    this.load.image('btn_interact', 'assets/ui/button_a.png');
    this.load.image('btn_run', 'assets/ui/button_b.png');
    this.load.image('btn_jump', 'assets/ui/button_x.png');
}

create() {
    this.mobileControls = new MobileControls(this, {
        buttons: [
            {
                action: 'interact',
                label: 'A',
                sprite: 'btn_interact',  // Usa sprite customizado
                position: 'right-bottom'
            },
            {
                action: 'run',
                label: 'B',
                sprite: 'btn_run',
                position: 'left-top'
            },
            {
                action: 'jump',
                label: 'X',
                sprite: 'btn_jump',
                position: 'top'
            }
        ]
    });
}
```

## 🔧 Integração com Sistemas Existentes

### Integração com MovementController

```javascript
class MovementController {
    constructor(scene, player, options = {}) {
        this.scene = scene;
        this.player = player;
        this.walkSpeed = options.walkSpeed || 150;
        this.runSpeed = options.runSpeed || 260;
        
        // Referência para controles móveis
        this.mobileControls = options.mobileControls || null;
    }
    
    update() {
        // Prioriza joystick se estiver ativo
        if (this.mobileControls?.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            const isRunning = this.mobileControls.isButtonPressed('run');
            const speed = isRunning ? this.runSpeed : this.walkSpeed;
            
            this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
            // ... animações
            return;
        }
        
        // Caso contrário, usa teclado
        // ... lógica de teclado existente
    }
}

// Uso:
const mobileControls = new MobileControls(this);
const movementController = new MovementController(this, player, {
    mobileControls: mobileControls
});
```

## 🎯 Casos de Uso Comuns

### Plataforma

```javascript
update() {
    const controls = this.mobileControls;
    
    // Movimento horizontal
    if (controls.joystick.isActive()) {
        const dir = controls.joystick.getDirection();
        this.player.setVelocityX(dir.x * 200);
    }
    
    // Pulo
    if (controls.isButtonPressed('jump') && this.player.body.onFloor()) {
        this.player.setVelocityY(-400);
    }
}
```

### Top-Down RPG

```javascript
update() {
    const controls = this.mobileControls;
    
    if (controls.joystick.isActive()) {
        const dir = controls.joystick.getDirection();
        const force = controls.joystick.getForce();
        const speed = controls.isButtonPressed('run') ? 300 : 150;
        
        this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
    }
    
    if (controls.isButtonPressed('interact')) {
        this.checkInteraction();
    }
}
```

## 📱 Testando em Desktop

Para testar em desktop (sem precisar de dispositivo móvel):

```javascript
// Força mostrar controles mesmo em desktop
this.mobileControls = new MobileControls(this, {
    alwaysShow: true  // Mostra sempre, independente do dispositivo
});
```

Ou use as ferramentas de desenvolvedor do navegador:
1. F12 para abrir DevTools
2. Ctrl+Shift+M para modo responsivo
3. Selecione um dispositivo móvel

## 🐛 Troubleshooting

### Controles não aparecem

```javascript
// Verifique se auto-detecção está correta
console.log('É mobile?', this.mobileControls.isMobile);

// Force mostrar sempre durante testes
this.mobileControls = new MobileControls(this, {
    alwaysShow: true
});
```

### Joystick não responde

```javascript
// Verifique se está habilitado
console.log('Joystick habilitado?', this.mobileControls.joystick);

// Verifique dead zone
this.mobileControls = new MobileControls(this, {
    joystick: {
        deadZone: 0.1  // Diminua se necessário
    }
});
```

### Botões não respondem

```javascript
// Verifique se está desabilitado
console.log('Controles habilitados?', this.mobileControls.enabled);

// Habilite manualmente
this.mobileControls.enable();
```

## 📄 Licença

MIT License - Use livremente em seus projetos!

## 🤝 Contribuindo

Sinta-se livre para modificar e adaptar às suas necessidades!

---

**Feito com ❤️ para a comunidade Phaser**
