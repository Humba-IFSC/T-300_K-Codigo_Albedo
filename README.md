# T-300_K-Codigo_Albedo
Desenvolvimento do Jogo T-300 K: Código Albedo com a turna FSC060806 - 2025.2
---

### Template de Documento de Design de Jogo (DDJ)

**Nome do Projeto (Fase do Jogo):** `[Insira o nome provisório da Fase do Jogo]`
**Autor(a/e)s/Desenvolvedor(a/)s:** `[Seu(s) Nome(s)]`
**Data de Início:** `[DD/MM/AAAA]`

---

### Checkpoint 1: A Grande Ideia (Introdução ao Projeto)

*(Esta seção define a alma do seu jogo. É o seu "pitch" de elevador.)*

*   **Conceito Central:** Descreva seu jogo em uma ou duas frases.
    *   *Exemplo:* "Um jogo de plataforma 2D onde um robô perdido precisa coletar peças de energia para reativar seu portal e voltar para casa."
*   **Gênero:** Plataforma, Puzzle, Ação, Aventura, etc.
*   **Público-Alvo:** Para quem é este jogo? (Crianças, jogadores casuais, fãs de desafios, etc.)
*   **Objetivo do Jogador:** O que o jogador precisa fazer para vencer ou progredir?
    *   *Exemplo:* "Coletar todas as 10 moedas do nível para destravar a saída."

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
    *   *Exemplo:*
        ```
        /projeto-jogo
          - index.html
          - main.js
          /assets
            - /images
            - /sounds
        ```
*   **Configuração Inicial (Objeto `config` do Phaser):** Quais são as definições básicas do seu jogo?
    *   **Dimensões da Tela:** Largura (width) e Altura (height).
    *   **Tipo de Renderização:** `Phaser.AUTO`, `Phaser.CANVAS`, `Phaser.WEBGL`.
    *   **Física:** `arcade`, `matter`, etc.
    *   **Cenas (Scenes):** `preload`, `create`, `update`.

---

### Checkpoint 4: O Inventário (Pré-Carregamento de Assets)

*(O que o jogo precisa carregar antes de começar a diversão? Liste tudo aqui.)*

| Apelido (Key) | Tipo de Asset | Caminho do Arquivo (`path`) |
| :--- | :--- | :--- |
| `sky` | Image | `assets/images/sky.png` |
| `ground` | Image | `assets/images/platform.png` |
| `coin` | Image | `assets/images/coin.png` |
| `player` | Spritesheet | `assets/images/dude.png` |
| `jumpSound` | Audio | `assets/sounds/jump.wav` |

---

### Checkpoint 5: Construindo a Fase (Criação de Elementos)

*(O que vai aparecer na tela quando o jogo começar? Descreva os elementos e suas funções.)*

*   **Cenário:** Imagem de fundo, plataformas estáticas.
*   **Jogador (Player):**
    *   **Posição Inicial:** Onde ele aparece?
    *   **Física:** Terá gravidade? Vai colidir com os limites do mundo?
    *   **Animações:** `left` (andando para esquerda), `turn` (parado), `right` (andando para direita).
*   **Coletáveis (Moedas):**
    *   **Comportamento:** Vão quicar? Ficarão paradas?
    *   **Disposição:** Onde elas estarão no mapa?
*   **Inimigos (Opcional):**
    *   **Comportamento:** Patrulham uma área? Perseguem o jogador?
*   **Interface (UI):** Placar de pontos, contador de vidas, etc.

---

### Checkpoint 6: As Regras do Jogo (Lógica e Atualização)

*(Inspirado em "Atualização do Jogo" e "Função de Coleta". Como o jogo reage e funciona a cada segundo?)*

*   **Controles do Jogador (`update function`):**
    *   **Esquerda:** Se a tecla de seta para a esquerda for pressionada, aplicar velocidade negativa em X e tocar a animação `left`.
    *   **Direita:** Se a tecla de seta para a direita for pressionada, aplicar velocidade positiva em X e tocar a animação `right`.
    *   **Pulo:** Se a tecla de seta para cima for pressionada e o jogador estiver no chão, aplicar velocidade em Y.
*   **Interações e Colisões:**
    *   **Jogador vs. Plataformas:** O jogador deve colidir e não atravessar.
    *   **Jogador vs. Moedas (`collectCoin function`):** Quando o jogador tocar numa moeda, a moeda desaparece, o placar aumenta em 10 pontos e um som é tocado.
*   **Condições de Vitória/Derrota:**
    *   **Vitória:** Coletar todas as moedas.
    *   **Derrota:** Tocar em um inimigo ou cair para fora da tela.

---

### Checkpoint Final: Tesouro Encontrado! (Resultado Final)

*(Qual é a aparência e a sensação do jogo finalizado, com base nos checkpoints acima?)*

*   **Descrição da Experiência:** Descreva como é jogar a versão finalizada do seu projeto.
    *   *Exemplo:* "O jogador controla o personagem em um cenário azul, pulando em plataformas marrons para coletar moedas douradas que giram. Ao coletar todas, uma mensagem de 'Você Venceu!' aparece na tela."
*   **Próximos Passos (Missões Futuras):** O que você poderia adicionar depois?
    *   *Exemplo:* "Adicionar inimigos, criar mais fases, implementar um sistema de vidas."

---
