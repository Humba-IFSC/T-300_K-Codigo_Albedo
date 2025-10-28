# T-300_K-Codigo_Albedo
Desenvolvimento do Jogo T-300 K: Código Albedo com a turna FSC060806 - 2025.2
---

### Template de Documento de Design de Jogo (DDJ)

**Nome do Projeto (Fase do Jogo):** `[Máquina de Entropia]`

### **Autores/Desenvolvedores:** 
- Gabriel de Sousa Conforto `Coordenador, roteiro, história, trama e narrativa
- Marcos Vinícius Faustino `Progamação`
- Ariel da Silva Coutinho `Arte, som e progamação`
- Gabriel Corrêa Abreu de Oliveira `Arte, som, testador e relator de bugs`
- João Campos Neto`Testador e relator de bugs e auxiliar em documentaçao e escrita` 
 ---

 ### **Data de Início:** `[19/08/2025]`
--- 

### Checkpoint 1: A Grande Ideia (Introdução ao Projeto)


*   **Conceito Central:** Em uma fábrica abandonada, o jogador investiga os experimentos do Dr. Aris Thorne, um cientista que tentou controlar a entropia e acabou desencadeando forças que desafiam as leis da física.
   
*   **Gênero:** Puzzle, Aventura, Educativo.
*   **Público-Alvo:** Estudantes, jogadores casuais, Fans de quebra-cabeça
*   **Objetivo do Jogador:** O objetivo da fase é explorar a fábrica, resolver enigmas baseados nas leis da termodinâmica e estabilizar o reator para completar a criação da Máquina de Entropia.

---

### Checkpoint 2: As Ferramentas da Aventura (Configuração do Ambiente)

*(Aqui listamos o que você vai usar para construir sua obra-prima.)*

*   **Engine/Framework:** Phaser 3
*   **Linguagem:** JavaScript (ES6+)
*   **Editor de Código:** VS Code, Sublime Text, etc.
*   **Servidor Local:** Live Server (extensão do VS Code), Node.js http-server, etc.
*   **Recursos (Assets):** Onde você vai conseguir seus gráficos e sons?
    *   *Exemplo:* "Sprites de Kenney.nl, sons do freesound.org."

---

### Checkpoint 3: A Planta do Mundo (Estrutura e Configuração do Jogo)

*(Inspirado em "Estrutura do Código" e "Configuração Inicial do Jogo". É o esqueleto do seu projeto.)*

*   **Estrutura de Pastas:** Como você organizará seus arquivos?
    *   *Estrutura atual do projeto:*
        ```
        /T-300_K-Codigo_Albedo
          ├── index.html
          ├── LICENSE
          ├── README.md
          ├── PUSHABLE_OBJECTS_GUIDE.md
          ├── PUSHABLE_EXAMPLES.js
          ├── PUSHABLE_IMPROVEMENTS.md
          ├── assets/
          │   ├── maps/
          │   │   ├── floresta.json
          │   │   ├── map_generated.json
          │   │   └── map.json
          │   ├── sounds/
          │   ├── sprites/
          │   └── tilesets/
          └── src/
              ├── main.js
              ├── scenes/
              │   ├── BaseScene.js
              │   ├── GameScene.js
              │   └── SecondScene.js
              └── systems/
                  ├── debug/
                  │   └── CoordProbe.js
                  ├── input/
                  │   └── MovementController.js
                  ├── items/
                  │   ├── PushableObject.js
                  │   ├── crowbar.js
                  │   ├── doorUtils.js
                  │   ├── itemUtils.js
                  │   └── key.js
                  └── ui/
                      ├── DialogueSystem.js
                      ├── Hotbar.js
                      ├── InteractionPrompt.js
                      └── UICameraManager.js
        ```
*   **Configuração Inicial (Objeto `config` do Phaser):** Quais são as definições básicas do seu jogo?
    *   **Dimensões da Tela:** Largura (width) e Altura (height).
    *   **Tipo de Renderização:** `Phaser.AUTO`, `Phaser.CANVAS`, `Phaser.WEBGL`.
    *   **Física:** `arcade`, `matter`, etc.
    *   **Cenas (Scenes):** `preload`, `create`, `update`.

---

### Checkpoint 4: O Inventário (Pré-Carregamento de Assets)

*(O que o jogo precisa carregar antes de começar a diversão? Liste tudo aqui.)*

| Apelido (Key) | Tipo de Asset | Caminho do Arquivo (`path`) | Descrição |
| :--- | :--- | :--- | :--- |
| `tiles` | Image | `assets/tilesets/[nome_do_tileset].png` | Tileset principal do jogo |
| `floresta` | Tilemap | `assets/maps/floresta.json` | Mapa da área floresta |
| `map` | Tilemap | `assets/maps/map.json` | Mapa principal |
| `map_generated` | Tilemap | `assets/maps/map_generated.json` | Mapa gerado |
| `player` | Spritesheet | `assets/sprites/[player].png` | Sprites do personagem jogável |
| `box` | Image | `assets/sprites/[box].png` | Caixa empurrável (sistema push/pull) |
| `key` | Image | `assets/sprites/[key].png` | Chave para interação com portas |
| `crowbar` | Image | `assets/sprites/[crowbar].png` | Pé de cabra para quebrar objetos |
| `door` | Image | `assets/sprites/[door].png` | Portas interativas |
| `jumpSound` | Audio | `assets/sounds/[jump].wav` | Som de pulo (exemplo) |

**Sistemas Implementados:**
- **MovementController**: Sistema de movimentação com WASD/Setas
- **PushableObject**: Sistema completo de empurrar/puxar objetos (estilo Zelda)
- **DialogueSystem**: Sistema de diálogos e narrativa
- **Hotbar**: Barra de itens/inventário
- **InteractionPrompt**: Prompts de interação ("Pressione Z para...")
- **UICameraManager**: Gerenciamento de câmera e UI
- **CoordProbe**: Debug de coordenadas
- **Item Systems**: Chaves, portas, pé de cabra e utilitários

---

### Checkpoint 5: Construindo a Fase (Criação de Elementos)

*(O que vai aparecer na tela quando o jogo começar? Descreva os elementos e suas funções.)*

*   **Cenário:** Imagem de fundo, profundidade de tiles e objetos
*   **Jogador (Player):**
    *   **Posição Inicial:**O jogador chega em um barco nas proximidades da fábrica.
    *   **Física:** O jogador poderá colidir com os limites do mapa e de objetos, mas não há gravidade sendo aplicada no jogo.
    *   **Animações:** `left` (andando para esquerda), `turn` (parado), `right` (andando para direita).
*   **Coletáveis:** Itens disponíveis para pegar nas salas da fase, tendo documentos e itens com mecânicas próprias.
*   **Inimigos (Opcional):** Inimigo Ariel Papa-Capim
    *   **Comportamento:** Haverá um inimigo em uma das salas, que patrulha por um caminho predeterminado tendo um campo de visão, matando o jogador caso o veja.
*   **Interface (UI):** Haverá uma barra de inventário.

---

### Checkpoint 6: As Regras do Jogo (Lógica e Atualização)

*(Inspirado em "Atualização do Jogo" e "Função de Coleta". Como o jogo reage e funciona a cada segundo?)*

*   **Controles do Jogador (`update function`):**
    *   **Esquerda:** Se a tecla de seta para a esquerda for pressionada, aplicar velocidade negativa em X de 150 e tocar a animação `left`.
    *   **Direita:** Se a tecla de seta para a direita for pressionada, aplicar velocidade positiva em X de 150 e tocar a animação `right`.
*   **Interações e Colisões:**
    *   **Jogador vs. limites:** O jogador deve colidir e não atravessar.
    *   **Jogador vs. Moedas (`collectCoin function`):** Quando o jogador interagir com um item ou objeto, deverá pegá-lo
---

### Checkpoint Final: Tesouro Encontrado! (Resultado Final)

*(Qual é a aparência e a sensação do jogo finalizado, com base nos checkpoints acima?)*

*   **Descrição da Experiência:** Descreva como é jogar a versão finalizada do seu projeto.
    *   *Exemplo:* "O jogador controla o personagem em um cenário azul, pulando em plataformas marrons para coletar moedas douradas que giram. Ao coletar todas, uma mensagem de 'Você Venceu!' aparece na tela."
*   **Próximos Passos (Missões Futuras):** O que você poderia adicionar depois?
    *   *Exemplo:* "Adicionar inimigos, criar mais fases, implementar um sistema de vidas."

---
