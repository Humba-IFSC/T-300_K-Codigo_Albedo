# 🎮 Hotbar Interativa - Guia Completo

## 📋 Funcionalidades Implementadas

A Hotbar agora possui um sistema completo de interação com as seguintes funcionalidades:

### 1. ✅ Slots Clicáveis
- Cada slot da hotbar pode ser clicado para selecionar o item
- O highlight (destaque) se move para o slot clicado
- Funciona tanto no PC quanto em dispositivos móveis

### 2. ✅ Botão Toggle (Seta)
- Um botão circular com seta (▲/▼) aparece na parte inferior da tela
- **Seta para cima (▲)**: Hotbar está fechada, clique para abrir
- **Seta para baixo (▼)**: Hotbar está aberta, clique para fechar
- Posicionado no centro inferior da tela para fácil acesso
- **NOVO**: Botão agora responde corretamente aos cliques (Container com hitArea própria)

### 3. ✅ Esconder Controles Móveis
- Quando a hotbar é aberta manualmente, os controles virtuais (joystick e botões) são escondidos automaticamente
- Quando a hotbar é fechada, os controles voltam a aparecer
- Isso garante que a interface não fique poluída com muitos elementos ao mesmo tempo

### 4. ✅ Bloqueio Durante Diálogos
- A hotbar **não pode ser aberta** durante diálogos ativos
- Se você tentar abrir a hotbar durante um diálogo, nada acontece
- Se a hotbar estava aberta quando um diálogo inicia, ela é fechada automaticamente
- Após o diálogo terminar, a hotbar volta ao estado anterior (se estava aberta, reabre)

### 5. ✅ Joystick Virtual Fixo
- **NOVO**: O joystick agora fica em uma posição fixa no canto inferior esquerdo
- Não se move mais para onde você toca
- Posição: 100px das bordas esquerda e inferior
- Área de ativação ampliada (150px) para facilitar o uso
- Sempre visível quando os controles estão ativos

## 🎯 Como Usar

### Abrindo e Fechando a Hotbar

**Desktop:**
- Pressione as teclas numéricas (1-5) para mostrar a hotbar e selecionar um slot
- A hotbar desaparece automaticamente após 3 segundos de inatividade (se não estiver aberta manualmente)

**Mobile/Touch:**
1. Clique no botão com seta (▲) na parte inferior **central** da tela para abrir
2. Clique nos slots para selecionar itens
3. Clique no botão com seta (▼) novamente para fechar

### Usando o Joystick Virtual

**Novo comportamento - Posição Fixa:**
- O joystick agora está sempre visível no **canto inferior esquerdo** da tela
- Não precisa tocar em qualquer lugar da tela para aparecer
- Toque dentro da área do joystick (raio de 150px) para ativá-lo
- Arraste para controlar o movimento do personagem
- O joystick permanece na mesma posição fixa, apenas o stick interno se move

### Comportamento Automático

#### Durante o Jogo Normal:
- Hotbar aparece automaticamente quando você obtém um item
- Desaparece após 3 segundos de inatividade
- Controles móveis ficam sempre visíveis

#### Quando Aberta Manualmente:
- Hotbar permanece aberta até você clicar no botão de fechar
- Controles móveis são escondidos para dar mais espaço
- Não desaparece automaticamente

#### Durante Diálogos:
- Hotbar é **sempre** escondida
- Botão toggle fica desabilitado
- Controles móveis também são escondidos
- Tudo volta ao normal quando o diálogo termina

## 🔧 Detalhes Técnicos

### Correções Implementadas

**v1.1 - Correções Críticas:**
1. **Botão Toggle da Hotbar**: 
   - Corrigido evento de clique que não funcionava
   - Mudança: Container agora tem seu próprio `setInteractive()` ao invés de apenas o círculo interno
   - Log adicionado para debug: `[Hotbar] Botão toggle clicado!`

2. **Joystick Virtual Fixo**:
   - Mudança de comportamento: de "aparecer onde toca" para "posição fixa"
   - Nova posição: 100px das bordas esquerda e inferior
   - Área de ativação ampliada para 150px de raio
   - Sempre visível (não desaparece mais)

### Posição do Joystick

```javascript
// Localização fixa no construtor do VirtualJoystick
const margin = 100;
this.baseX = margin;  // 100px da esquerda
this.baseY = scene.scale.height - margin;  // 100px do fundo
```

Para ajustar a posição, modifique a constante `margin` no arquivo `MobileControls.js`.

### Propriedades Importantes

```javascript
this.hotbar.isOpen       // true se aberta manualmente
this.hotbar.hidden       // true se está escondida (fora da tela)
this.hotbar.suppressed   // true se completamente desabilitada
this.hotbar.animating    // true durante animações
```

### Métodos Disponíveis

```javascript
// Controle manual
this.hotbar.toggleOpen()        // Alterna entre aberto/fechado
this.hotbar.openManually()      // Abre manualmente
this.hotbar.closeManually()     // Fecha manualmente

// Controle automático
this.hotbar.showAnimated()      // Mostra com animação
this.hotbar.hideAnimated()      // Esconde com animação

// Para diálogos
this.hotbar.hide()              // Esconde instantaneamente
this.hotbar.show()              // Mostra instantaneamente
this.hotbar.suppress()          // Desabilita completamente
this.hotbar.unsuppress()        // Reabilita

// Seleção
this.hotbar.select(index)       // Seleciona um slot (0-4)
```

## 🎨 Personalização

### Posição do Botão Toggle

O botão toggle está configurado em:
```javascript
const toggleButtonY = scene.scale.height - 40;  // 40px do fundo
const toggleButtonSize = 60;                     // 60px de diâmetro
```

Para alterar, edite essas linhas no construtor da `Hotbar.js`.

### Aparência do Botão

```javascript
// Background circular
const toggleBg = scene.add.circle(0, 0, toggleButtonSize / 2, 0x333333, 0.8);
toggleBg.setStrokeStyle(3, 0xffffff, 0.8);

// Seta
this.toggleArrow = scene.add.text(0, 0, '▲', {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff'
});
```

### Tempo de Auto-Hide

Para alterar quanto tempo a hotbar fica visível antes de desaparecer:

```javascript
// No GameScene.js ou onde você cria a hotbar
this.hotbar = new Hotbar(this, 5, {
    inactivityMs: 3000,  // 3 segundos (3000ms)
    bottomMargin: 14
});
```

## 🐛 Resolução de Problemas

### A hotbar não abre durante diálogos
✅ **Isso é o comportamento esperado!** A hotbar é bloqueada durante diálogos intencionalmente.

### Os controles móveis não voltam depois de fechar a hotbar
🔍 Verifique se `this.mobileControls` existe na sua cena:
```javascript
if (this.mobileControls) {
    this.mobileControls.show();
}
```

### O botão toggle não aparece
🔍 Verifique o depth (profundidade) do botão:
```javascript
this.toggleButton.setDepth(10001);  // Deve estar acima de tudo
```

## 📱 Compatibilidade

- ✅ **Desktop**: Totalmente funcional com mouse e teclado
- ✅ **Mobile/Tablet**: Totalmente funcional com touch
- ✅ **Todos os navegadores modernos**: Chrome, Firefox, Safari, Edge

## 🎓 Exemplo de Uso Completo

```javascript
// No create() da sua cena
this.hotbar = new Hotbar(this, 5, {
    inactivityMs: 3000,
    bottomMargin: 14
});

// Adicionar um item
this.hotbar.setItem(0, 'crowbar');

// O jogador pode:
// 1. Pressionar '1' no teclado para selecionar o slot 0
// 2. Clicar no botão ▲ para abrir a hotbar
// 3. Clicar no slot 0 diretamente
// 4. Ver a crowbar aparecer no slot

// Durante um diálogo, a hotbar será automaticamente escondida
this.dialogue.show(['Olá jogador!', 'Bem-vindo ao jogo!']);
// A hotbar não pode ser aberta agora

// Quando o diálogo terminar, a hotbar volta ao estado anterior
```

## 🚀 Melhorias Futuras Possíveis

- [ ] Adicionar animação de "pulse" no botão toggle quando há itens novos
- [ ] Permitir arrastar itens entre slots
- [ ] Adicionar tooltips com nome dos itens ao passar o mouse
- [ ] Adicionar som de clique ao selecionar slots
- [ ] Permitir configurar teclas de atalho personalizadas
- [ ] Adicionar quantidade de itens empilháveis (ex: "x3")

---

**Desenvolvido para o projeto T-300 K-Codigo Albedo** 🎮
