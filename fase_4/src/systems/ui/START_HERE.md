# 🎮 Mobile Controls System

> Sistema completo, portátil e plug-and-play de controles virtuais para Phaser 3

[![Phaser 3](https://img.shields.io/badge/Phaser-3.x-blue.svg)](https://phaser.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Portable](https://img.shields.io/badge/100%25-Portable-brightgreen.svg)]()

---

## ⚡ Quick Start (30 segundos)

```javascript
import { MobileControls } from './systems/ui/MobileControls.js';

class GameScene extends Phaser.Scene {
    create() {
        this.mobileControls = new MobileControls(this);
        this.player = this.physics.add.sprite(400, 300, 'player');
    }
    
    update() {
        if (this.mobileControls.joystick?.isActive()) {
            const dir = this.mobileControls.joystick.getDirection();
            const force = this.mobileControls.joystick.getForce();
            this.player.setVelocity(dir.x * 200 * force, dir.y * 200 * force);
        }
    }
}
```

**Pronto! 🎉** Seu jogo agora tem controles móveis funcionais!

---

## 📁 Arquivos do Sistema

| Arquivo | Tipo | Descrição | Necessário? |
|---------|------|-----------|-------------|
| **`MobileControls.js`** | 📄 Código | Sistema principal (600 linhas) | ⭐ **OBRIGATÓRIO** |
| `MobileControlsConfigs.js` | 📄 Código | Configurações pré-definidas | ✅ Recomendado |
| `QuickStartTemplates.js` | 📄 Código | 10 templates prontos | 💡 Útil |
| `MobileControlsExamples.js` | 📄 Código | 5 exemplos completos | 💡 Útil |
| `MOBILE_CONTROLS_README.md` | 📖 Docs | Documentação completa | 📚 Referência |
| `PORTABILITY_GUIDE.md` | 📖 Docs | Como portar para outros projetos | 🚀 Início |
| `MIGRATION_GUIDE.md` | 📖 Docs | Migrar de sistema antigo | 🔄 Migração |
| `INDEX.md` | 📖 Docs | Índice de toda documentação | 🗺️ Navegação |
| `START_HERE.md` | 📖 Docs | Este arquivo | 👋 Início |

---

## 🎯 Escolha Sua Jornada

### 👶 Sou Iniciante
1. Copie **`MobileControls.js`** para seu projeto
2. Copie um template de **`QuickStartTemplates.js`**
3. Cole na sua cena
4. **Pronto!**

### 🧑‍💻 Sou Intermediário
1. Copie **`MobileControls.js`** + **`MobileControlsConfigs.js`**
2. Use uma configuração pronta: `CONFIGS.TOP_DOWN_RPG`
3. Customize conforme necessário
4. **Pronto!**

### 🚀 Sou Avançado
1. Copie todos os arquivos (para referência)
2. Leia **`MOBILE_CONTROLS_README.md`** (API completa)
3. Customize **`MobileControls.js`** ao seu gosto
4. **Pronto!**

### 🔄 Já tenho sistema antigo
1. Leia **`MIGRATION_GUIDE.md`**
2. Siga o checklist de migração
3. Teste tudo
4. **Pronto!**

---

## 📚 Documentação Rápida

### Onde Encontrar Cada Informação

| Preciso de... | Arquivo |
|---------------|---------|
| ⚡ **Começar rápido** | `QuickStartTemplates.js` |
| 📖 **Documentação completa** | `MOBILE_CONTROLS_README.md` |
| 🚀 **Portar para outro projeto** | `PORTABILITY_GUIDE.md` |
| 🔄 **Migrar sistema antigo** | `MIGRATION_GUIDE.md` |
| ⚙️ **Configurações prontas** | `MobileControlsConfigs.js` |
| 💡 **Exemplos de código** | `MobileControlsExamples.js` |
| 🗺️ **Visão geral** | `INDEX.md` |

---

## ✨ Características

- ✅ **100% Portátil** - Um único arquivo, zero dependências
- ✅ **Plug & Play** - Copie, cole, funciona
- ✅ **Auto-detecção** - Detecta mobile automaticamente
- ✅ **Joystick Virtual** - Controle analógico suave
- ✅ **Botões Customizáveis** - Quantos você quiser
- ✅ **Configurações Prontas** - 9 presets para diferentes jogos
- ✅ **Sistema de Eventos** - Integração fácil
- ✅ **Totalmente Documentado** - Mais de 2000 linhas de docs
- ✅ **10 Templates Prontos** - Copie e use
- ✅ **Sprites Customizados** - Use seus próprios assets

---

## 🎮 Configurações Prontas

```javascript
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

// Escolha uma configuração:
CONFIGS.TOP_DOWN_RPG    // ⚔️ RPG visto de cima (Zelda, Pokemon)
CONFIGS.PLATFORMER      // 🏃 Plataforma (Mario, Sonic)
CONFIGS.BEAT_EM_UP      // 👊 Luta (Streets of Rage)
CONFIGS.TWIN_STICK      // 🎯 Tiro (Geometry Wars)
CONFIGS.RACER           // 🏎️ Corrida
CONFIGS.PUZZLE          // 🧩 Puzzle
CONFIGS.SIMPLE_ACTION   // 🎮 Ação simples
CONFIGS.MINIMAL         // 📱 Só joystick
CONFIGS.TESTING         // 🔧 Para testes
```

**Uso:**
```javascript
this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
```

---

## 📦 Instalação

### Opção 1: Mínima (1 arquivo)
```
seu-projeto/
└── src/
    └── systems/
        └── MobileControls.js  ← Copie este arquivo
```

### Opção 2: Recomendada (2 arquivos)
```
seu-projeto/
└── src/
    └── systems/
        └── ui/
            ├── MobileControls.js        ← Principal
            └── MobileControlsConfigs.js ← Configurações
```

### Opção 3: Completa (tudo)
```
seu-projeto/
└── src/
    └── systems/
        └── ui/
            ├── MobileControls.js
            ├── MobileControlsConfigs.js
            ├── QuickStartTemplates.js
            ├── MobileControlsExamples.js
            ├── MOBILE_CONTROLS_README.md
            ├── PORTABILITY_GUIDE.md
            ├── MIGRATION_GUIDE.md
            ├── INDEX.md
            └── START_HERE.md
```

---

## 💻 Exemplos de Uso

### Exemplo 1: RPG Básico
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
```

### Exemplo 2: Plataforma
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

this.mobileControls = new MobileControls(this, CONFIGS.PLATFORMER);
```

### Exemplo 3: Customizado
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';

this.mobileControls = new MobileControls(this, {
    joystick: {
        enabled: true,
        baseRadius: 70
    },
    buttons: [
        { action: 'action1', label: 'A', color: 0xFF0000 },
        { action: 'action2', label: 'B', color: 0x00FF00 }
    ],
    alwaysShow: false  // true para testar em desktop
});
```

---

## 🔌 API Rápida

### Verificar Joystick
```javascript
if (this.mobileControls.joystick?.isActive()) {
    const dir = this.mobileControls.joystick.getDirection();  // { x, y }
    const force = this.mobileControls.joystick.getForce();    // 0 a 1
}
```

### Verificar Botões
```javascript
if (this.mobileControls.isButtonPressed('interact')) {
    // Executar ação
}
```

### Controlar Visibilidade
```javascript
this.mobileControls.show();    // Mostra controles
this.mobileControls.hide();    // Esconde controles
```

### Habilitar/Desabilitar
```javascript
this.mobileControls.enable();   // Habilita controles
this.mobileControls.disable();  // Desabilita controles
```

### Eventos
```javascript
this.events.on('mobilecontrols-button-down', (data) => {
    console.log('Botão pressionado:', data.action);
});

this.events.on('mobilecontrols-joystick-start', () => {
    console.log('Jogador começou a mover');
});
```

---

## 🧪 Testes

### Testar em Desktop
```javascript
this.mobileControls = new MobileControls(this, {
    alwaysShow: true  // ← Força mostrar em desktop
});
```

### Testar em Mobile
1. Hospede seu jogo (HTTP/HTTPS)
2. Acesse no navegador do celular
3. Ou use Chrome DevTools (F12 → Ctrl+Shift+M)

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| **Controles não aparecem** | Use `alwaysShow: true` para testar |
| **Joystick não responde** | Verifique se está aplicando velocidade no player |
| **Botões não funcionam** | Use `isButtonPressed()` não `isButtonDown()` |
| **Conflito com teclado** | Priorize joystick com `return` após usá-lo |

---

## 📱 Compatibilidade

- ✅ **Phaser:** 3.x
- ✅ **Navegadores:** Chrome, Firefox, Safari, Edge
- ✅ **Mobile:** iOS, Android
- ✅ **Desktop:** Windows, Mac, Linux (com `alwaysShow: true`)

---

## 📖 Leia Mais

- **[PORTABILITY_GUIDE.md](PORTABILITY_GUIDE.md)** - Como portar para outros projetos
- **[MOBILE_CONTROLS_README.md](MOBILE_CONTROLS_README.md)** - Documentação completa (API, exemplos, etc)
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Migrar de sistema antigo
- **[INDEX.md](INDEX.md)** - Índice completo de arquivos
- **[QuickStartTemplates.js](QuickStartTemplates.js)** - 10 templates prontos
- **[MobileControlsExamples.js](MobileControlsExamples.js)** - 5 exemplos completos

---

## 🎯 Próximos Passos

1. **Escolha um template** em `QuickStartTemplates.js`
2. **Copie para sua cena**
3. **Adapte conforme necessário**
4. **Teste!**

Ou:

1. **Leia** `PORTABILITY_GUIDE.md` para instruções detalhadas
2. **Copie** `MobileControls.js` para seu projeto
3. **Configure** com `MobileControlsConfigs.js`
4. **Pronto!**

---

## 💡 Dica Pro

Para 99% dos casos, você só precisa de:
1. `MobileControls.js` (arquivo principal)
2. `MobileControlsConfigs.js` (configurações prontas)

Copie esses 2 arquivos e use:
```javascript
import { MobileControls } from './systems/ui/MobileControls.js';
import { CONFIGS } from './systems/ui/MobileControlsConfigs.js';

this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
```

**É só isso!** 🎉

---

## 📄 Licença

MIT License - Use livremente em seus projetos!

---

## 🤝 Contribuições

Sistema desenvolvido para máxima portabilidade e facilidade de uso.  
Sinta-se livre para modificar e adaptar às suas necessidades!

---

## 🌟 Features

- [x] Joystick virtual
- [x] Botões customizáveis
- [x] Auto-detecção mobile
- [x] 9 configurações prontas
- [x] 10 templates prontos
- [x] Sprites customizados
- [x] Sistema de eventos
- [x] Documentação completa
- [x] Exemplos práticos
- [x] 100% portátil

---

**Feito com ❤️ para a comunidade Phaser**

🎮 **Bons jogos!** 📱
