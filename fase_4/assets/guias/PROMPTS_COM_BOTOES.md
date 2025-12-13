# Sistema de Prompts com Imagens de Botões

## Visão Geral
O sistema `InteractionPrompt` foi atualizado para suportar sprites de botões ao invés de apenas texto.

## Configuração dos Prompts

### Botão A (Verde) - Interações Principais
Usado para:
- 🗣️ **Falar com NPCs**: "Pressione [A] para falar"
- 📦 **Abrir baús**: "Pressione [A] para abrir"
- 🚪 **Entrar em portas**: "Pressione [A] para entrar"
- 📦 **Quebrar caixas**: "Pressione [A] para quebrar"

### Botão X (Azul) - Ações de Segurar
Usado para:
- 📦 **Arrastar objetos**: "Segure [X] para mover"

### Botão B (Vermelho) - Corrida
Usado para:
- 🏃 **Correr**: Segurar B enquanto se move

## Como Usar

### Sintaxe Básica
```javascript
new InteractionPrompt(scene, {
    prefix: 'Pressione ',      // Texto antes do botão
    buttonSprite: 'button_a',  // Nome do sprite (button_a, button_b, button_x)
    suffix: ' para falar',     // Texto depois do botão
    fontSize: 26,              // Tamanho da fonte
    buttonScale: 0.6           // Escala do botão (padrão: 0.6)
});
```

### Exemplos

#### Com Sprite de Botão
```javascript
this.interactionPrompt = new InteractionPrompt(this, { 
    buttonSprite: 'button_a',
    suffix: ' para falar' 
});
```

#### Fallback para Texto (se sprite não existir)
```javascript
this.interactionPrompt = new InteractionPrompt(this, { 
    keyLabel: '"ESPAÇO"',  // Será usado se buttonSprite não existir
    suffix: ' para falar' 
});
```

## Sprites Disponíveis
- `button_a` - Botão A (verde) - Xbox
- `button_b` - Botão B (vermelho) - Xbox
- `button_x` - Botão X (azul) - Xbox

## Implementação

### Arquivos Modificados
1. **InteractionPrompt.js** - Lógica para renderizar sprites
2. **GameScene.js** - Prompts de interação, baú, porta
3. **SecondScene.js** - Prompt de porta de retorno
4. **PushableObject.js** - Prompt de arrastar objetos

### Como o Sistema Funciona
1. O construtor verifica se `buttonSprite` foi fornecido
2. Se o sprite existe nas texturas, cria um `Image` do Phaser
3. Caso contrário, usa texto como fallback (comportamento antigo)
4. O sprite é centralizado verticalmente com o texto
5. A escala pode ser ajustada com `buttonScale`

## Vantagens
✅ Visualmente mais atraente e intuitivo
✅ Consistente com os botões virtuais mobile
✅ Fallback automático para texto se sprite não existir
✅ Fácil de adicionar novos tipos de botões

## Próximos Passos (Opcional)
- [ ] Adicionar sprites para botões de teclado (ESPAÇO, SHIFT, etc.)
- [ ] Animar os botões (pulse, glow)
- [ ] Adaptar tamanho automaticamente baseado no tipo de dispositivo
- [ ] Mostrar diferentes botões para desktop vs mobile
