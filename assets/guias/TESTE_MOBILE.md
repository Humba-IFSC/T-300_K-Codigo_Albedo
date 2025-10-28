# Lista de Verificação - Controles Virtuais Mobile

## ✅ Checklist de Implementação

### Arquivos Criados
- [x] `src/systems/ui/VirtualJoystick.js` - Joystick virtual
- [x] `src/systems/ui/VirtualButtons.js` - Botões de ação
- [x] `CONTROLES_VIRTUAIS.md` - Documentação completa

### Arquivos Modificados
- [x] `src/systems/input/MovementController.js` - Suporte a joystick
- [x] `src/scenes/BaseScene.js` - Integração dos controles
- [x] `src/scenes/GameScene.js` - Métodos de interação
- [x] `src/main.js` - Configuração para mobile (centralização + touch)
- [x] `index.html` - Meta tags e container para centralização

## 🎮 Funcionalidades Implementadas

### Joystick Virtual
- [x] Aparece ao tocar na metade esquerda da tela
- [x] Controle analógico (intensidade variável)
- [x] Desaparece ao soltar
- [x] Dead zone para evitar movimentos acidentais
- [x] Integrado com MovementController

### Botões Virtuais
- [x] Botão A (Interagir) - Verde
- [x] Botão B (Correr) - Azul
- [x] Botão X (Ação Extra) - Laranja
- [x] Feedback visual ao pressionar
- [x] Posicionamento no canto inferior direito
- [x] Hit area maior para facilitar toques

### Integração
- [x] Detecção automática de dispositivos touch
- [x] Priorização de joystick sobre teclado quando ativo
- [x] Eventos de botões conectados às ações do jogo
- [x] Compatibilidade com sistema de UI existente
- [x] Centralização automática do jogo na tela
- [x] Logs de debug para troubleshooting

## 🔧 Correções Aplicadas

### Problema 1: Jogo não centralizado em mobile
**Solução aplicada:**
- Adicionado `<div id="game-container">` no HTML
- Configurado Phaser scale: `parent: 'game-container'`
- CSS com flexbox para centralização perfeita
- Suporte para orientações retrato e paisagem

### Problema 2: Botão de interação não funcionava
**Soluções aplicadas:**
- Container do botão tornado interativo (não apenas o círculo)
- Hit area explícita com `Phaser.Geom.Circle`
- Suporte para diálogos (avanço de texto com botão)
- Logs de debug para rastrear eventos
- Verificação de `currentInteractable` no update

## 🧪 Como Testar

### 1. Testar no Desktop (Modo Touch Simulado)

Abra o Chrome DevTools:
1. Pressione F12
2. Clique no ícone de dispositivo móvel (ou Ctrl+Shift+M)
3. Selecione um dispositivo (ex: iPhone 12)
4. **Recarregue a página (F5)**
5. Use o mouse para simular toques
6. **Abra o Console (F12 > Console) para ver os logs**

### 2. Testar em Dispositivo Real

#### Opção A: Servidor Local
```bash
# Se você tiver Python instalado
python3 -m http.server 8000

# Ou se tiver Node.js
npx http-server -p 8000
```

Depois acesse `http://SEU_IP_LOCAL:8000` no celular

#### Opção B: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"
4. Use o IP mostrado no terminal para acessar do celular

### 3. Verificações Essenciais

**Centralização:**
- [ ] Jogo aparece no centro da tela?
- [ ] Não há scroll na página?
- [ ] Canvas não ultrapassa os limites da tela?

**Joystick:**
- [ ] Joystick aparece ao tocar na esquerda?
- [ ] Personagem se move em todas as direções?
- [ ] Joystick desaparece ao soltar?

**Botões:**
- [ ] Botão A interage com NPCs/objetos?
- [ ] Feedback visual ao tocar (escurece e reduz)?
- [ ] Botão B faz o personagem correr?
- [ ] Múltiplos toques funcionam (joystick + botão)?

**Interações:**
- [ ] Aproximar do NPC e apertar A inicia diálogo?
- [ ] Apertar A durante diálogo avança o texto?
- [ ] Aproximar do baú e apertar A abre o baú?
- [ ] Aproximar da porta e apertar A interage?

### 4. Debug com Console

Abra o console do navegador (F12) e verifique:

**Quando tocar no botão A, você deve ver:**
```
[VirtualButtons] Botão pressionado: interact
[VirtualButtons] Emitindo evento virtualbutton-down
[BaseScene] Botão virtual pressionado: interact
[BaseScene] Executando handleInteraction
[GameScene] handleInteraction chamado, currentInteractable: npc (ou chest, etc)
```

**Se não vir nada no console:**
- Os eventos não estão sendo disparados
- Verifique se os botões estão visíveis
- Tente forçar: `scene.virtualButtons.show()`

**Se ver até "Botão pressionado" mas não passar:**
- Problema no sistema de eventos do Phaser
- Verifique se `createVirtualControls()` foi chamado

**Se ver até "handleInteraction" mas currentInteractable é null:**
- Você não está próximo de nenhum objeto
- Aproxime-se de um NPC ou baú e tente novamente

## 🐛 Troubleshooting

### Problema: Controles não aparecem em mobile

**Debug:**
```javascript
// No console do navegador
scene = game.scene.scenes[0];
console.log('Touch enabled:', scene.input.touch.enabled);
console.log('Joystick exists:', !!scene.virtualJoystick);
console.log('Buttons exist:', !!scene.virtualButtons);

// Forçar aparecer
scene.virtualJoystick?.show();
scene.virtualButtons?.show();
```

### Problema: Jogo não está centralizado

**Verifique:**
1. O HTML tem `<div id="game-container">`?
2. O CSS tem `display: flex` e `justify-content: center`?
3. O Phaser config tem `parent: 'game-container'`?
4. Tente recarregar a página (F5)

**Forçar centralização via CSS:**
```javascript
// No console
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
```

### Problema: Botão não responde

**Verifique no console:**
1. Há logs quando toca no botão?
2. Se não: problema na hit area ou interatividade
3. Se sim mas não executa: problema no handler

**Teste direto:**
```javascript
// No console
scene = game.scene.scenes[0];
scene.handleInteraction();  // Deve executar a ação
```

### Problema: Movimento não funciona

**Solução:**
- Verifique se o joystick foi passado para o MovementController
- Confirme que `this.movement.update()` está sendo chamado
- Verifique o console para erros

```javascript
// No console
scene = game.scene.scenes[0];
console.log('Movement exists:', !!scene.movement);
console.log('Joystick active:', scene.virtualJoystick.isActive());
console.log('Direction:', scene.virtualJoystick.getDirection());
```

## 📱 Comandos Úteis

### Forçar Exibição dos Controles (Console do Navegador)
```javascript
// Obter a cena ativa
scene = game.scene.scenes[0];

// Mostrar controles
scene.virtualJoystick.show();
scene.virtualButtons.show();

// Esconder controles
scene.virtualJoystick.hide();
scene.virtualButtons.hide();
```

### Verificar Estado dos Controles
```javascript
// Verificar se joystick está ativo
console.log(scene.virtualJoystick.isActive());

// Verificar direção
console.log(scene.virtualJoystick.getDirection());

// Verificar botões pressionados
console.log(scene.virtualButtons.isButtonDown('interact'));
```

### Debug de Interações
```javascript
// Ver qual objeto está próximo
console.log('Interactable:', scene.currentInteractable);

// Ver posição do player
console.log('Player:', scene.player.x, scene.player.y);

// Testar interação diretamente
scene.handleInteraction();

// Abrir baú diretamente (teste)
scene.openChest();

// Iniciar diálogo diretamente (teste)
scene.startNpcDialogue();
```

### Remover Logs de Debug (Quando Finalizar)

Quando tudo estiver funcionando, remova os `console.log()` de:
- `src/scenes/BaseScene.js` (método `onVirtualButtonDown`)
- `src/systems/ui/VirtualButtons.js` (método `onButtonDown`)
- `src/scenes/GameScene.js` (método `handleInteraction`)

## 🎯 Próximos Testes Recomendados

1. **Teste de Performance**: Verificar FPS em dispositivos menos potentes
2. **Teste de Orientação**: Testar em modo retrato e paisagem
3. **Teste de Tela Cheia**: Verificar se funciona em fullscreen
4. **Teste de Múltiplos Toques**: Mover e interagir simultaneamente
5. **Teste de Diferentes Dispositivos**: iOS, Android, tablets

## 💡 Dicas para Desenvolvimento Mobile

- Use `console.log()` liberalmente durante desenvolvimento
- Teste em dispositivo real o quanto antes
- Considere o tamanho dos dedos (botões grandes o suficiente)
- Adicione feedback visual claro
- Otimize assets para carregar rápido em 3G/4G
- Use Remote Debugging para ver console do celular no PC

### Remote Debugging (Chrome Android)
1. Conecte o celular via USB
2. Ative "Depuração USB" no Android
3. No Chrome do PC: `chrome://inspect`
4. Selecione o dispositivo e inspecione

---

**Status**: ✅ Implementação Completa + Correções Aplicadas
**Última Atualização**: 2025-10-28 (Corrigido: Centralização + Botão de Interação)
