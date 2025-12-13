# 📦 Guia de Portabilidade - Mobile Controls

## Como Levar para Outro Projeto

Este guia mostra **passo a passo** como levar o sistema Mobile Controls para qualquer outro projeto Phaser 3.

---

## 🎯 Opção 1: Instalação Mínima (1 arquivo)

### Arquivos Necessários
- ✅ `MobileControls.js` (arquivo principal - **OBRIGATÓRIO**)

### Passos

1. **Copie o arquivo**
   ```
   Seu projeto/
   └── src/
       └── systems/
           └── MobileControls.js  ← Copie este arquivo
   ```

2. **Importe na sua cena**
   ```javascript
   import { MobileControls } from './systems/MobileControls.js';
   ```

3. **Use na sua cena**
   ```javascript
   class GameScene extends Phaser.Scene {
       create() {
           // Criar controles
           this.mobileControls = new MobileControls(this);
       }
       
       update() {
           // Usar joystick
           if (this.mobileControls.joystick?.isActive()) {
               const dir = this.mobileControls.joystick.getDirection();
               const force = this.mobileControls.joystick.getForce();
               this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
           }
           
           // Usar botões
           if (this.mobileControls.isButtonPressed('interact')) {
               this.interact();
           }
       }
   }
   ```

4. **Pronto! ✅**

---

## 🚀 Opção 2: Instalação Completa (com configurações e exemplos)

### Arquivos Recomendados
- ✅ `MobileControls.js` (principal - **OBRIGATÓRIO**)
- ✅ `MobileControlsConfigs.js` (configurações pré-definidas - **RECOMENDADO**)
- 📄 `MOBILE_CONTROLS_README.md` (documentação - opcional)
- 📄 `MobileControlsExamples.js` (exemplos - opcional)
- 📄 `MIGRATION_GUIDE.md` (guia de migração - opcional)

### Estrutura Recomendada
```
Seu projeto/
└── src/
    └── systems/
        └── ui/
            ├── MobileControls.js           ← Principal
            ├── MobileControlsConfigs.js    ← Configurações prontas
            ├── MOBILE_CONTROLS_README.md   ← Documentação
            ├── MobileControlsExamples.js   ← Exemplos
            └── MIGRATION_GUIDE.md          ← Guia de migração
```

### Uso com Configurações Pré-definidas
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

class GameScene extends Phaser.Scene {
    create() {
        // Use uma configuração pronta!
        this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
    }
}
```

---

## 📋 Checklist de Portabilidade

Use esta checklist ao portar para outro projeto:

### Antes de Começar
- [ ] Backup do projeto atual
- [ ] Verifique versão do Phaser (requer 3.x)
- [ ] Prepare estrutura de pastas

### Copiar Arquivos
- [ ] Copiar `MobileControls.js`
- [ ] Copiar `MobileControlsConfigs.js` (opcional)
- [ ] Copiar documentação (opcional)

### Integração
- [ ] Importar nas cenas necessárias
- [ ] Adicionar código de inicialização
- [ ] Adicionar código de uso no update
- [ ] Configurar botões conforme necessário

### Testes
- [ ] Testar joystick em todas as direções
- [ ] Testar todos os botões
- [ ] Testar em dispositivo móvel real
- [ ] Testar detecção automática de mobile
- [ ] Testar habilitar/desabilitar controles
- [ ] Testar mostrar/esconder controles

---

## 🔧 Configuração para Diferentes Tipos de Jogos

### Top-Down RPG (Zelda-like)
```javascript
import { MobileControls } from './systems/MobileControls.js';

this.mobileControls = new MobileControls(this, {
    joystick: { enabled: true },
    buttons: [
        { action: 'interact', label: 'A', color: 0x00FF00 },
        { action: 'run', label: 'B', color: 0xFF0000 },
        { action: 'menu', label: 'X', color: 0x0000FF }
    ]
});
```

### Plataforma (Mario-like)
```javascript
import { MobileControls } from './systems/MobileControls.js';

this.mobileControls = new MobileControls(this, {
    joystick: { enabled: false },  // Sem joystick
    buttons: [
        { action: 'left', label: '◄', color: 0x888888 },
        { action: 'right', label: '►', color: 0x888888 },
        { action: 'jump', label: 'A', color: 0x00FF00 }
    ]
});
```

### Beat 'em Up (Streets of Rage-like)
```javascript
import { MobileControls } from './systems/MobileControls.js';

this.mobileControls = new MobileControls(this, {
    joystick: { enabled: true },
    buttons: [
        { action: 'attack', label: 'A', color: 0xFF0000 },
        { action: 'jump', label: 'B', color: 0x00FF00 },
        { action: 'special', label: 'X', color: 0xFFFF00 }
    ]
});
```

---

## 💡 Adaptações Comuns

### Adaptar para Sistema de Animações Diferente

Se seu jogo usa nomes de animações diferentes:

```javascript
update() {
    if (this.mobileControls.joystick?.isActive()) {
        const dir = this.mobileControls.joystick.getDirection();
        const force = this.mobileControls.joystick.getForce();
        
        // Adapte para seus nomes de animação
        if (Math.abs(dir.x) > Math.abs(dir.y)) {
            if (dir.x > 0) {
                this.player.anims.play('moveRight', true);  // Seu nome
            } else {
                this.player.anims.play('moveLeft', true);   // Seu nome
            }
        } else {
            if (dir.y > 0) {
                this.player.anims.play('moveDown', true);   // Seu nome
            } else {
                this.player.anims.play('moveUp', true);     // Seu nome
            }
        }
        
        this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
    }
}
```

### Adaptar para Sistema de Física Diferente

Se você usa Matter.js em vez de Arcade:

```javascript
update() {
    if (this.mobileControls.joystick?.isActive()) {
        const dir = this.mobileControls.joystick.getDirection();
        const force = this.mobileControls.joystick.getForce();
        const speed = 0.01;  // Ajuste conforme necessário
        
        // Para Matter.js
        this.matter.applyForce(
            this.player,
            { x: dir.x * speed * force, y: dir.y * speed * force }
        );
    }
}
```

### Adaptar Posições dos Botões

Se a tela do seu jogo tem proporções diferentes:

```javascript
this.mobileControls = new MobileControls(this, {
    buttons: [
        {
            action: 'interact',
            label: 'A',
            color: 0x00FF00,
            position: 'right-bottom'  // Posições pré-definidas
        }
    ],
    buttonRadius: 50,  // Ajuste o tamanho
    buttonSpacing: 20  // Ajuste o espaçamento
});
```

---

## 🎨 Personalização Visual

### Usar Sprites Próprios

1. **Carregue seus sprites no preload:**
   ```javascript
   preload() {
       this.load.image('myButtonA', 'assets/ui/button_a.png');
       this.load.image('myButtonB', 'assets/ui/button_b.png');
   }
   ```

2. **Configure para usar os sprites:**
   ```javascript
   create() {
       this.mobileControls = new MobileControls(this, {
           buttons: [
               {
                   action: 'interact',
                   label: 'A',
                   sprite: 'myButtonA',  // Usa seu sprite
                   position: 'right-bottom'
               },
               {
                   action: 'run',
                   label: 'B',
                   sprite: 'myButtonB',  // Usa seu sprite
                   position: 'left-top'
               }
           ]
       });
   }
   ```

### Customizar Cores

```javascript
this.mobileControls = new MobileControls(this, {
    buttons: [
        { action: 'interact', label: 'A', color: 0x00FF00 },  // Verde
        { action: 'run', label: 'B', color: 0xFF0000 },       // Vermelho
        { action: 'jump', label: 'X', color: 0x0000FF }       // Azul
    ],
    buttonAlpha: 0.9  // Mais opaco
});
```

---

## 🐛 Resolução de Problemas

### Problema: Controles não aparecem

**Causa:** Só aparece em dispositivos móveis por padrão.

**Solução:** Force mostrar para testar:
```javascript
this.mobileControls = new MobileControls(this, {
    alwaysShow: true  // Mostra sempre
});
```

### Problema: Joystick responde mas player não se move

**Causa:** Código de movimento não está correto.

**Solução:** Verifique se está aplicando velocidade:
```javascript
update() {
    if (this.mobileControls.joystick?.isActive()) {
        const dir = this.mobileControls.joystick.getDirection();
        const force = this.mobileControls.joystick.getForce();
        
        // IMPORTANTE: Aplicar velocidade
        this.player.setVelocity(
            dir.x * 200 * force,
            dir.y * 200 * force
        );
    } else {
        // IMPORTANTE: Parar quando não usar joystick
        this.player.setVelocity(0, 0);
    }
}
```

### Problema: Botões não respondem

**Causa:** Método errado ou botão desabilitado.

**Solução:** Use o método correto:
```javascript
// CORRETO
if (this.mobileControls.isButtonPressed('interact')) {
    // ...
}

// ERRADO
if (this.mobileControls.buttons.isButtonDown('interact')) {
    // ...
}
```

### Problema: Conflito com controles de teclado

**Causa:** Ambos estão ativos ao mesmo tempo.

**Solução:** Priorize o joystick:
```javascript
update() {
    // Prioriza joystick
    if (this.mobileControls.joystick?.isActive()) {
        // Usa joystick
        const dir = this.mobileControls.joystick.getDirection();
        // ...
        return;  // IMPORTANTE: return para não usar teclado
    }
    
    // Só usa teclado se joystick não está ativo
    if (this.cursors.left.isDown) {
        // ...
    }
}
```

---

## 📱 Teste em Dispositivos Reais

### Preparar para Testes

1. **Hospede seu jogo:**
   - Use servidor local com HTTPS (required para touch)
   - Ou use ngrok/localtunnel para expor localhost
   - Ou faça deploy em servidor web

2. **Acesse no mobile:**
   - Abra no navegador do celular
   - Use modo fullscreen se possível
   - Teste em diferentes dispositivos

3. **Debug no mobile:**
   ```javascript
   // Adicione logs para debug
   create() {
       this.mobileControls = new MobileControls(this);
       
       console.log('Mobile Controls criado:', {
           isMobile: this.mobileControls.isMobile,
           hasJoystick: !!this.mobileControls.joystick,
           hasButtons: !!this.mobileControls.buttons
       });
   }
   ```

### Chrome DevTools Mobile

Para testar no desktop:

1. Abra DevTools (F12)
2. Ctrl+Shift+M (Toggle Device Toolbar)
3. Selecione um dispositivo móvel
4. Configure para `alwaysShow: true` durante desenvolvimento

---

## ✅ Exemplo Completo Portátil

Aqui está um exemplo **completo e funcional** que você pode copiar:

```javascript
// GameScene.js - COPIE ESTE CÓDIGO
import { MobileControls } from './systems/MobileControls.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // 1. Criar controles móveis
        this.mobileControls = new MobileControls(this, {
            joystick: {
                enabled: true,
                deadZone: 0.2
            },
            buttons: [
                { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
                { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' }
            ],
            alwaysShow: false  // Mude para true para testar em desktop
        });
        
        // 2. Criar player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // 3. Velocidades
        this.walkSpeed = 150;
        this.runSpeed = 260;
    }
    
    update() {
        // 4. Controle de movimento
        const joystick = this.mobileControls.joystick;
        
        if (joystick && joystick.isActive()) {
            // Joystick está ativo
            const dir = joystick.getDirection();
            const force = joystick.getForce();
            const isRunning = this.mobileControls.isButtonPressed('run');
            const speed = isRunning ? this.runSpeed : this.walkSpeed;
            
            // Aplica movimento
            this.player.setVelocity(dir.x * speed * force, dir.y * speed * force);
            
            // Animações (adapte para seus nomes)
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                this.player.anims.play(dir.x > 0 ? 'walk-right' : 'walk-left', true);
            } else {
                this.player.anims.play(dir.y > 0 ? 'walk-down' : 'walk-up', true);
            }
        } else {
            // Para o player
            this.player.setVelocity(0, 0);
            this.player.anims.stop();
        }
        
        // 5. Ações
        if (this.mobileControls.isButtonPressed('interact')) {
            this.interact();
        }
    }
    
    interact() {
        console.log('Interagindo!');
        // Sua lógica aqui
    }
}
```

---

## 🎯 Resumo Rápido

1. **Copie** `MobileControls.js` para seu projeto
2. **Importe** na sua cena
3. **Crie** no `create()`: `this.mobileControls = new MobileControls(this)`
4. **Use** no `update()`: Verificar joystick e botões
5. **Teste** em mobile ou com `alwaysShow: true`

**Pronto! Seu jogo agora tem controles móveis funcionais! 🎮📱**

---

## 📚 Links Úteis

- `MOBILE_CONTROLS_README.md` - Documentação completa
- `MobileControlsExamples.js` - Mais exemplos
- `MobileControlsConfigs.js` - Configurações pré-definidas
- `MIGRATION_GUIDE.md` - Migrar de sistema antigo

---

**Dúvidas? Consulte a documentação completa!**
