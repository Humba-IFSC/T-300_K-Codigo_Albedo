# Sistema de Ícones de Interação Flutuantes

## Visão Geral
O sistema de prompts de texto foi substituído por ícones de botão que aparecem flutuando sobre os objetos interativos.

## Características

### 🎮 Ícones Flutuantes
- **Posicionamento**: Aparecem automaticamente acima do objeto interativo
- **Animação**: Movimento de flutuação (bobbing) suave
- **Seguimento**: Acompanham objetos que se movem
- **Escala**: Tamanho proporcional ao objeto (0.6-0.8x)

### 🎯 Tipos de Interação

#### Botão A (Verde) 🟢
Usado sobre:
- **NPCs** - Para iniciar diálogo
- **Baús** - Para abrir e coletar itens
- **Portas** - Para entrar/sair de áreas
- **Caixas** - Para quebrar com crowbar

#### Botão X (Azul) 🔵
Usado sobre:
- **Objetos Empurráveis** - Para segurar e arrastar

## Implementação Técnica

### InteractionIcon.js
Nova classe que gerencia ícones flutuantes:

```javascript
// Criar um ícone
const icon = new InteractionIcon(scene, 'button_a', 0.6);

// Mostrar sobre um objeto
icon.showAbove(objeto);

// Atualizar posição (no update loop)
icon.updatePosition();

// Esconder
icon.hide();
```

### Propriedades Configuráveis
- `buttonSprite` - Sprite do botão (button_a, button_x, button_b)
- `scale` - Escala do ícone (padrão: 0.6-0.8)
- `offsetY` - Altura acima do objeto (padrão: -40 a -60)

### Animação de Flutuação
```javascript
// Movimento vertical suave automático
bobTween: {
    y: '+=8',           // Amplitude de 8 pixels
    duration: 600ms,     // Duração do ciclo
    yoyo: true,         // Vai e volta
    repeat: -1,         // Infinito
    ease: 'Sine.easeInOut'
}
```

## Arquivos Modificados

### Criados
- ✨ `src/systems/ui/InteractionIcon.js` - Classe principal dos ícones

### Modificados
1. **GameScene.js**
   - Substituiu `InteractionPrompt` por `InteractionIcon`
   - Criou ícones para: NPC, baús, porta, caixas
   - Atualiza posições no loop `update()`

2. **SecondScene.js**
   - Ícone para porta de retorno
   - Atualização de posição no `update()`

3. **PushableObject.js**
   - Ícone X para objetos arrastáveis
   - Esconde durante o arrasto
   - Atualização contínua de posição

## Vantagens

✅ **Visual Limpo**: Sem caixas de texto obstruindo a tela
✅ **Intuitivo**: Ícone aparece exatamente onde interagir
✅ **Dinâmico**: Segue objetos móveis automaticamente
✅ **Consistente**: Usa mesmos sprites dos botões virtuais mobile
✅ **Elegante**: Animação suave de flutuação
✅ **Proporcional**: Tamanho adequado a cada tipo de objeto

## Diferenças vs Sistema Anterior

| Característica | Prompts Antigos | Ícones Novos |
|---------------|-----------------|--------------|
| Posição | Canto superior esquerdo fixo | Sobre o objeto |
| Texto | "Pressione [A] para..." | Apenas ícone |
| Visibilidade | Pode ser ignorado | Impossível não ver |
| Animação | Estático | Flutuante (bobbing) |
| Seguimento | Não | Sim, acompanha objeto |
| Escala | Fixa | Proporcional ao objeto |

## Próximos Passos (Opcional)
- [ ] Adicionar efeito de "pulse" quando pressionar botão
- [ ] Diferentes cores/brilho baseado em contexto
- [ ] Tooltip pequeno ao lado do ícone (opcional)
- [ ] Efeito de partículas ao redor do ícone
- [ ] Som de feedback ao aparecer/desaparecer
