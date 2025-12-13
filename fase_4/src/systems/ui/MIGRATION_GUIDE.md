# 🔄 Guia de Migração - Mobile Controls

Este guia ajuda você a migrar do sistema antigo (VirtualJoystick + VirtualButtons separados) para o novo sistema unificado (MobileControls).

## 📋 Checklist de Migração

- [ ] Backup do código existente
- [ ] Copiar arquivo `MobileControls.js` para o projeto
- [ ] Atualizar imports nas cenas
- [ ] Modificar código de inicialização
- [ ] Atualizar código de uso no `update()`
- [ ] Testar em dispositivo móvel ou emulador
- [ ] Remover arquivos antigos (opcional)

## 🔧 Passos de Migração

### Antes (Sistema Antigo)

```javascript
// GameScene.js - ANTES
import { VirtualJoystick } from './systems/ui/VirtualJoystick.js';
import { VirtualButtons } from './systems/ui/VirtualButtons.js';

class GameScene extends Phaser.Scene {
    create() {
        // Criar joystick
        this.virtualJoystick = new VirtualJoystick(
            this, 
            100, 
            this.scale.height - 100,
            {
                baseRadius: 60,
                stickRadius: 30,
                maxDistance: 50,
                alpha: 0.6
            }
        );
        
        // Criar botões
        this.virtualButtons = new VirtualButtons(this, {
            buttonRadius: 50,
            alpha: 0.8
        });
        
        // Escutar eventos dos botões
        this.events.on('virtualbutton-down', (action) => {
            if (action === 'interact') {
                this.interact();
            }
        });
        
        // Registrar na UI
        if (this.uiManager) {
            const joystickElements = this.virtualJoystick.getElements();
            const buttonElements = this.virtualButtons.getElements();
            joystickElements.forEach(el => this.uiManager.registerElement(el));
            buttonElements.forEach(el => this.uiManager.registerElement(el));
        }
    }
    
    update() {
        // Verificar joystick
        if (this.virtualJoystick && this.virtualJoystick.isActive()) {
            const direction = this.virtualJoystick.getDirection();
            const force = this.virtualJoystick.getForce();
            const speed = 200;
            
            this.player.setVelocity(
                direction.x * speed * force,
                direction.y * speed * force
            );
        }
        
        // Verificar botão de corrida
        if (this.virtualButtons && this.virtualButtons.isButtonDown('run')) {
            this.playerSpeed = 300;
        }
    }
}
```

### Depois (Sistema Novo)

```javascript
// GameScene.js - DEPOIS
import { MobileControls } from './systems/ui/MobileControls.js';

class GameScene extends Phaser.Scene {
    create() {
        // Criar sistema unificado
        this.mobileControls = new MobileControls(this, {
            // Configuração do joystick
            joystick: {
                enabled: true,
                baseRadius: 60,
                stickRadius: 30,
                maxDistance: 50,
                alpha: 0.6
            },
            
            // Configuração dos botões
            buttons: [
                { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
                { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' },
                { action: 'action', label: 'X', color: 0x0000FF, position: 'top' }
            ],
            
            buttonRadius: 50,
            buttonAlpha: 0.8
        });
        
        // Escutar eventos (NOVO NOME)
        this.events.on('mobilecontrols-button-down', (data) => {
            if (data.action === 'interact') {
                this.interact();
            }
        });
        
        // Não precisa mais registrar manualmente na UI!
    }
    
    update() {
        // Verificar joystick (agora acessado via mobileControls)
        if (this.mobileControls.joystick && this.mobileControls.joystick.isActive()) {
            const direction = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            const speed = 200;
            
            this.player.setVelocity(
                direction.x * speed * force,
                direction.y * speed * force
            );
        }
        
        // Verificar botão de corrida (NOVO MÉTODO)
        if (this.mobileControls.isButtonPressed('run')) {
            this.playerSpeed = 300;
        }
    }
}
```

## 🔍 Mudanças Principais

### 1. Imports

**Antes:**
```javascript
import { VirtualJoystick } from './systems/ui/VirtualJoystick.js';
import { VirtualButtons } from './systems/ui/VirtualButtons.js';
```

**Depois:**
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';
```

### 2. Inicialização

**Antes:**
```javascript
this.virtualJoystick = new VirtualJoystick(this, x, y, options);
this.virtualButtons = new VirtualButtons(this, options);
```

**Depois:**
```javascript
this.mobileControls = new MobileControls(this, {
    joystick: { /* opções */ },
    buttons: [ /* configuração */ ]
});
```

### 3. Acesso ao Joystick

**Antes:**
```javascript
this.virtualJoystick.isActive()
this.virtualJoystick.getDirection()
this.virtualJoystick.getForce()
```

**Depois:**
```javascript
this.mobileControls.joystick.isActive()
this.mobileControls.joystick.getDirection()
this.mobileControls.joystick.getForce()
```

### 4. Verificar Botões

**Antes:**
```javascript
this.virtualButtons.isButtonDown('action')
```

**Depois:**
```javascript
this.mobileControls.isButtonPressed('action')
```

### 5. Eventos

**Antes:**
```javascript
this.events.on('virtualbutton-down', (action) => {
    // action é uma string
});

this.events.on('virtualbutton-up', (action) => {
    // action é uma string
});
```

**Depois:**
```javascript
this.events.on('mobilecontrols-button-down', (data) => {
    // data.action é uma string
});

this.events.on('mobilecontrols-button-up', (data) => {
    // data.action é uma string
});

// Novos eventos:
this.events.on('mobilecontrols-joystick-start', () => {});
this.events.on('mobilecontrols-joystick-end', () => {});
```

### 6. Mostrar/Esconder

**Antes:**
```javascript
this.virtualJoystick.show();
this.virtualJoystick.hide();
this.virtualButtons.show();
this.virtualButtons.hide();
```

**Depois:**
```javascript
this.mobileControls.show();  // Mostra tudo
this.mobileControls.hide();  // Esconde tudo

// Ou individual:
this.mobileControls.joystick.show();
this.mobileControls.buttons.show();
```

### 7. Habilitar/Desabilitar

**Antes:**
```javascript
this.virtualJoystick.disable();
this.virtualJoystick.enable();
this.virtualButtons.disable();
this.virtualButtons.enable();
```

**Depois:**
```javascript
this.mobileControls.disable();  // Desabilita tudo
this.mobileControls.enable();   // Habilita tudo

// Ou individual:
this.mobileControls.joystick.disable();
this.mobileControls.buttons.disable();
```

### 8. Destruir

**Antes:**
```javascript
this.virtualJoystick.destroy();
this.virtualButtons.destroy();
```

**Depois:**
```javascript
this.mobileControls.destroy();  // Destrói tudo
```

## 📦 Migração do MovementController

### Antes

```javascript
// MovementController.js - ANTES
export class MovementController {
    constructor(scene, player, { walkSpeed = 150, runSpeed = 260, virtualJoystick = null } = {}) {
        this.virtualJoystick = virtualJoystick;
        // ...
    }
    
    update() {
        if (this.virtualJoystick && this.virtualJoystick.isActive()) {
            // usar joystick
        }
        // ...
    }
}

// Uso:
this.movementController = new MovementController(this, this.player, {
    virtualJoystick: this.virtualJoystick
});
```

### Depois

```javascript
// MovementController.js - DEPOIS
export class MovementController {
    constructor(scene, player, { walkSpeed = 150, runSpeed = 260, mobileControls = null } = {}) {
        this.mobileControls = mobileControls;
        // ...
    }
    
    update() {
        if (this.mobileControls?.joystick?.isActive()) {
            // usar joystick
        }
        // ...
    }
}

// Uso:
this.movementController = new MovementController(this, this.player, {
    mobileControls: this.mobileControls
});
```

## 🎨 Migração de Configuração de Botões

### Antes

Os botões eram fixos no VirtualButtons:
- Botão A (interact)
- Botão B (run)
- Botão X (action)

### Depois

Você pode configurar qualquer botão:

```javascript
buttons: [
    { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
    { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' },
    { action: 'jump', label: 'Y', color: 0xFFFF00, position: 'top' },
    { action: 'attack', label: 'X', color: 0x0000FF, position: 'left-bottom' }
]
```

## ⚠️ Problemas Comuns na Migração

### 1. Eventos não funcionam

**Problema:**
```javascript
// ERRADO - usando nome antigo do evento
this.events.on('virtualbutton-down', (action) => {});
```

**Solução:**
```javascript
// CORRETO - usando novo nome e estrutura
this.events.on('mobilecontrols-button-down', (data) => {
    const action = data.action;
});
```

### 2. Joystick não aparece

**Problema:** Esqueceu de configurar joystick nas opções.

**Solução:**
```javascript
this.mobileControls = new MobileControls(this, {
    joystick: {
        enabled: true  // Garanta que está habilitado
    }
});
```

### 3. Botões não customizados

**Problema:** Esqueceu de configurar os botões.

**Solução:**
```javascript
this.mobileControls = new MobileControls(this, {
    buttons: [
        // Configure seus botões aqui
        { action: 'interact', label: 'A', color: 0x00FF00 }
    ]
});
```

### 4. Controles não aparecem em desktop

**Solução:** Para testar em desktop, use:
```javascript
this.mobileControls = new MobileControls(this, {
    alwaysShow: true  // Força mostrar mesmo em desktop
});
```

## 🧹 Limpeza Após Migração

Depois que tudo estiver funcionando, você pode:

1. **Remover arquivos antigos (opcional):**
   - `VirtualJoystick.js`
   - `VirtualButtons.js`

2. **Remover imports não utilizados:**
   ```javascript
   // Remova estas linhas:
   import { VirtualJoystick } from './systems/ui/VirtualJoystick.js';
   import { VirtualButtons } from './systems/ui/VirtualButtons.js';
   ```

3. **Atualizar documentação:**
   - Atualize READMEs e guias do seu projeto

## ✅ Teste Final

Após a migração, teste:

- [ ] Joystick responde ao toque
- [ ] Movimentos em todas as direções funcionam
- [ ] Botões respondem ao toque
- [ ] Eventos são disparados corretamente
- [ ] Controles podem ser habilitados/desabilitados
- [ ] Controles podem ser mostrados/escondidos
- [ ] Funciona em dispositivo móvel real
- [ ] Funciona em navegador móvel
- [ ] Não quebrou controles de teclado existentes

## 💡 Dicas de Otimização

### Detecção Automática de Mobile

O novo sistema detecta automaticamente se é mobile:

```javascript
if (this.mobileControls.isMobile) {
    console.log('Usuário está em dispositivo móvel');
}
```

### Desabilitar Durante Diálogos

```javascript
showDialogue() {
    this.mobileControls.disable();
}

hideDialogue() {
    this.mobileControls.enable();
}
```

### Configuração Condicional

```javascript
const config = {
    joystick: {
        enabled: true
    },
    buttons: []
};

// Adiciona botões apenas se não for plataforma
if (this.gameType !== 'platformer') {
    config.buttons.push({ action: 'interact', label: 'A', color: 0x00FF00 });
}

this.mobileControls = new MobileControls(this, config);
```

## 🆘 Precisa de Ajuda?

Consulte os arquivos:
- `MOBILE_CONTROLS_README.md` - Documentação completa
- `MobileControlsExamples.js` - Exemplos práticos
- `MobileControls.js` - Código fonte (bem comentado)

---

**Boa migração! 🚀**
