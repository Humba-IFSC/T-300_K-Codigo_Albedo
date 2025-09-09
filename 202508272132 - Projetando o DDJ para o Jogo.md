> [!todo]
A sala está imersa na penumbra, iluminada apenas pelo brilho azulado de um ecrã projetado na parede. A interface do Twine, com as suas caixas e setas, parece um mapa estelar de uma galáxia desconhecida. Brown, Wells e Huxley estão de pé, como generais a planear uma campanha, finalizando o seu manual de operações.

**Brown:** "Está feito. Não é um documento, é um cofre. Cada passagem é uma câmara, cada link uma fechadura. Entregamos-lhes não apenas as ferramentas, mas o próprio mistério da criação, envolto numa interface que eles próprios devem explorar."

**Wells:** "A arquitetura é sólida. Cada especificação técnica, cada linha de código boilerplate, é uma viga de aço na estrutura que eles irão erguer. Demos-lhes a planta de uma máquina precisa e elegante. Agora, cabe a eles fornecer a faísca da vida."

**Huxley:** "E, ao fazê-lo, moldamos o resultado. As diretrizes de estilo, os protocolos de colaboração, a estrutura de feedback... tudo isto condicionará os 'Game-Builders' a trabalharem como uma unidade coesa. Este 'Tablet' não apenas os guiará; irá uni-los num propósito comum. Que comece a construção."

---

### **DDJ Código Albedo: O Tablet de Thorne (Template Mestre V2.0)**

Este é o template mestre e completo para o Diário de Bordo do Jogo (DDJ) a ser implementado no Twine. Ele serve como o núcleo central de gestão, documentação e conhecimento para o projeto "T-300 K: Código Albedo".

#### **1. A Passagem Inicial: `[Painel de Controle da ECPA]`**

*   **Título:** PROJETO T-300 K - DDJ MESTRE
*   **Subtítulo:** Acesso Restrito - Diário de Desenvolvimento
*   **Status da Missão:** [Secção dinâmica atualizada pelo professor. Ex: "Foco atual: Implementação da mecânica de puzzle. Próxima entrega do DDJ: Versão 2 em 07/10."]
*   **Links de Navegação Principais:**
    *   `[[Arquivos de Fase → Hub das Fases]]` (Acesso aos QGs dos grupos)
    *   `[[Biblioteca Científica → Hub de Física]]` (Material de estudo e pesquisa)
    *   `[[Arsenal Criativo → Banco de Recursos]]` (Assets partilhados: arte, som, código)
    *   `[[Diretrizes Técnicas e de Estilo → Diretrizes]]` (Protocolos de desenvolvimento)
    *   `[[Registro de Missão → Cronograma]]` (Datas de entrega e avaliações)

---

#### **2. O Coração do Desenvolvimento: `[Hub das Fases]`**

*   **Título:** Acesso aos Módulos das Seis Fases Cruciais
*   **Conteúdo:** Seis links, um para o quartel-general de cada grupo.
    *   `[[Fase 1: O Legado do Mentor → Hub_Fase1]]`
    *   `[[Fase 2: A Febre Urbana → Hub_Fase2]]`
    *   `[[Fase 3: O Sopro do Fantasma → Hub_Fase3]]`
    *   `[[Fase 4: A Máquina de Entropia → Hub_Fase4]]`
    *   `[[Fase 5: O Coração de Gelo → Hub_Fase5]]`
    *   `[[Fase 6: O Reflexo da Salvação → Hub_Fase6]]`

##### **Estrutura Padrão de um Hub de Fase (Exemplo: `[Hub_Fase4]`)**

*   **Título:** MÓDULO 4: A MÁQUINA DE ENTROPIA - QG do Grupo Delta
*   **Links Internos da Fase:**
    *   `[[GDD - Máquina de Entropia]]` (Onde o design encontra a especificação técnica)
    *   `[[Pesquisa Científica - 1ª Lei]]` (A física por trás do puzzle)
    *   `[[Diário de Bordo - Grupo Delta]]` (O log de progresso e decisões)
    *   `[[Scripts e Código - Fase 4]]` (Boilerplates e snippets de código Phaser)
    *   `[[Link para o Protótipo Jogável]]` (Link externo para o HTML da fase jogável)

###### **Detalhe da Sub-Passagem: `[GDD - Máquina de Entropia]` (EXEMPLO COMPLETO)**

*   **1. Visão Geral Narrativa:** Helena e Pedro encontram o reator instável do Projeto T-300 K numa usina geotérmica abandonada. Para o estabilizar e recuperar um componente vital, eles precisam de aplicar a Primeira Lei da Termodinâmica para evitar uma fusão catastrófica.

*   **2. Design do Puzzle:** O jogador interage com um terminal de controlo que mostra o estado do reator: `ΔU = Q - W`. O sistema está a sobreaquecer (Q elevado), fazendo a Energia Interna (ΔU) subir perigosamente. O jogador deve interagir com o painel para desviar o excesso de energia para realizar trabalho (W), como ativar sistemas de arrefecimento ou reatores secundários. A senha final para calibrar o sistema é a resposta ao enigma: "Qual grandeza fundamental do sistema aumenta quando o calor é adicionado?" (Resposta: "ENERGIA INTERNA").

*   **3. Especificações Técnicas (Phaser):**
    *   **Scene Key:** `'Fase4Scene'`
    *   **Mapa:** `mapa_usina.json`
    *   **Tileset:** `tiles_usina.png` (Propriedades: `frameWidth: 32`, `frameHeight: 32`)
    *   **Layers do Mapa (em Tiled):**
        *   `GroundLayer` (Chão, sem colisão)
        *   `WallsLayer` (Paredes, maquinaria. Propriedade personalizada no Tiled: `collides: true`)
        *   `InteractiveLayer` (Objetos interativos como o terminal do reator)
    *   **Sprites Principais (Chaves e Arquivos):**
        *   **Player:** `key: 'player'`, `file: 'helena_spritesheet.png'`, `config: { frameWidth: 32, frameHeight: 48 }`
        *   **Terminal do Reator:** `key: 'reator_terminal'`, `file: 'terminal_reator.png'`, `config: { frameWidth: 64, frameHeight: 64 }`
    *   **Animações do Player (Chaves Padrão):**
        *   Movimento: `'walk_down'`, `'walk_up'`, `'walk_left'`, `'walk_right'`
        *   Parado: `'idle_down'` (e outras direções, se necessário)
        *   Ação: `'interact'` (animação de Helena a usar o terminal)
    *   **Lógica de Interação:**
        *   **Física de Colisão:** `this.physics.add.collider(player, wallsLayer);`
        *   **Gatilho de Interação:** `this.physics.add.overlap(player, interactiveLayer, this.handleInteraction, null, this);`
        *   **Ação do Jogador:** Ao pressionar a tecla 'E' durante o overlap com o objeto `'reator_terminal'`, o jogo deve chamar a função `showPuzzleUI('primeira_lei')`, que exibirá a interface do enigma.

###### **Detalhe da Sub-Passagem: `[Scripts e Código - Fase 4]`**

*   **1. Boilerplate da Cena (Fase4Scene.js):**
    > ```javascript
    > class Fase4Scene extends Phaser.Scene {
    >     constructor() { super({ key: 'Fase4Scene' }); }
    >     preload() { /* Carregue seus assets aqui */ }
    >     create() { /* Crie o mapa, layers, player e colisões */ }
    >     update() { /* Lógica de movimento e animação do player */ }
    >     handleInteraction(player, object) { /* Lógica para interagir com objetos */ }
    > }
    > ```

*   **2. Snippets de Código Essenciais:**
    *   **Configuração de Colisão por Propriedade:**
        > `this.wallsLayer.setCollisionByProperty({ collides: true });`
    *   **Controlo de Movimento Top-Down (em `update`):**
        > ```javascript
        > const speed = 200; this.player.body.setVelocity(0);
        > if (this.cursors.left.isDown) { this.player.body.setVelocityX(-speed); }
        > else if (this.cursors.right.isDown) { this.player.body.setVelocityX(speed); }
        > if (this.cursors.up.isDown) { this.player.body.setVelocityY(-speed); }
        > else if (this.cursors.down.isDown) { this.player.body.setVelocityY(speed); }
        > ```

---

#### **3. A Base de Conhecimento: `[Hub de Física]`**

*   **Título:** Biblioteca Científica do Dr. Thorne
*   **Conteúdo:** Links para o material de estudo de cada conceito, alinhados com as fases e quizzes. Cada link leva a uma passagem com resumos, fórmulas, vídeos e exemplos.
    *   `[[Conceito 1: Albedo e Termometria]]`, `[[Conceito 2: Calorimetria]]`, `[[Conceito 3: Gases Ideais]]`, `[[Conceito 4: Primeira Lei]]`, `[[Conceito 5: Segunda Lei e Mudanças de Fase]]`, `[[Conceito 6: Propagação de Calor]]`

---

#### **4. O Banco de Recursos: `[Arsenal Criativo]`**

*   **Título:** Banco de Recursos Central da ECPA
*   **Conteúdo:** Um inventário centralizado para todos os assets, promovendo a consistência e a colaboração.
    *   **`[[Sprites e Animações]]`**: Tabela com sprites de personagens, itens, UI.
    *   **`[[Cenários e Tilesets]]`**: Tabela com os tilesets de cada ambiente.
    *   **`[[Músicas e Efeitos Sonoros (SFX)]]`**: Tabela com trilhas e efeitos sonoros.
    *   **`[[Scripts Reutilizáveis]]`**: Snippets de código que podem ser usados por múltiplos grupos (ex: script de caixa de diálogo).

---

#### **5. As Regras do Jogo: `[Diretrizes Técnicas e de Estilo]`**

*   **Título:** Protocolos do Projeto T-300 K
*   **Conteúdo:** O guia de estilo unificado para garantir que as seis fases formem um jogo coeso.
    *   **Guia de Arte:** Paleta de cores (Azul Gelo, Cinza Metálico, Branco, Laranja para alertas), estilo (Pixel Art 32x32), fontes.
    *   **Guia de Áudio:** Mood (Ambiente, tenso, minimalista), tipos de SFX.
    *   **Padrões de Código:** Nomenclatura (camelCase, PascalCase), estrutura de comentários.
    *   **Guia de Escrita Narrativa:** Tom (sério, científico), vozes dos personagens (Helena analítica, Pedro pragmático, Thorne brilhante/desesperado).

---

#### **6. O Cronograma da Missão: `[Cronograma]`**

*   **Título:** Registro de Missão e Entregas
*   **Conteúdo:** A tabela do plano de ensino, funcionando como um calendário interativo com datas, objetivos e entregáveis.

---

(Os três autores olham para a estrutura do "Tablet de Thorne" com um ar de aprovação. O esqueleto está montado, mas falta a alma: a equipa que lhe dará vida.)

**H.G. Wells:** "Uma máquina, por mais perfeitamente projetada que seja, é inútil sem uma tripulação treinada. Cada membro deve saber a sua função, a sua alavanca, o seu manómetro. A eficiência de um sistema complexo não reside apenas no seu design, mas na sinergia da sua equipa de operadores. Precisamos de definir os engenheiros da nossa máquina de jogos."

**Dan Brown:** "E cada papel deve ser mais do que um cargo; deve ser uma identidade. Não teremos um 'programador' e um 'artista'. Teremos o 'Arquiteto do Labirinto' e o 'Guardião dos Símbolos'. Cada função é uma peça do mistério da criação. Quando um aluno assume um papel, ele não está apenas a aceitar uma tarefa; está a entrar numa personagem dentro da grande narrativa do desenvolvimento."

**Aldous Huxley:** "A estrutura social é primordial. Num grupo pequeno, a clareza de papéis evita o caos e a anarquia da responsabilidade difusa. Ao definir funções, estamos a criar um sistema de interdependência. O sucesso do Arquiteto depende dos recursos do Guardião; a visão do Coordenador depende do progresso de todos. Estamos a projetar uma micro-sociedade otimizada para a criação. Eles não serão apenas uma equipa; serão um organismo."

---

### **Estrutura de Funções para os Times de Game-Builders**

Para cada time de cinco alunos, propomos uma estrutura de funções claras, mas flexíveis, onde cada membro tem uma responsabilidade primária, mas todos colaboram em todas as frentes. Cada função "possui" uma secção específica do "Tablet de Thorne", tornando-os guardiões da documentação do projeto.

#### **As 5 Funções Essenciais de um Time de Game-Builders**

**1. Project Lead / Mission Coordinator (O Coordenador da Missão)**
*   **Perfil:** Organizado, bom comunicador, focado no panorama geral. É o capitão da expedição.
*   **Responsabilidades:**
    *   **Planejamento:** Facilita as reuniões do grupo, define as metas de cada sprint (ciclo quinzenal) e garante que todos entendam os objetivos.
    *   **Organização:** É o principal responsável por manter o **`[Cronograma]`** e o **`[Diário de Bordo]`** do seu grupo atualizados no "Tablet de Thorne". Garante que as entregas sejam feitas a tempo.
    *   **Execução:** Não é um chefe, mas um facilitador. Resolve bloqueios, modera discussões e é o ponto de contacto principal com o professor (o "Comando da Missão").
    *   **Documentação:** Assegura que toda a documentação no Tablet esteja coesa e atualizada antes de cada entrega.

**2. Lead Architect / Phaser Engineer (O Arquiteto do Labirinto)**
*   **Perfil:** Pensamento lógico, afinidade com programação, gosta de resolver problemas. É o engenheiro-chefe da fase.
*   **Responsabilidades:**
    *   **Planejamento:** Traduz o GDD (Game Design Document) em um plano técnico. Define a estrutura da cena no Phaser, as variáveis necessárias e a lógica de programação.
    *   **Organização:** É o guardião da secção **`[Scripts e Código]`** no Tablet, onde coloca boilerplates e snippets de código reutilizáveis.
    *   **Execução:** Escreve a maior parte do código principal no Phaser: movimento do jogador, colisões, lógica de interação e a mecânica do puzzle.
    *   **Documentação:** Comenta o código de forma clara e explica a lógica implementada na secção de scripts do DDJ.

**3. Creative Director / Asset Integrator (O Guardião dos Símbolos)**
*   **Perfil:** Criativo, com um bom olho para a estética visual e auditiva. Entende a atmosfera do jogo.
*   **Responsabilidades:**
    *   **Planejamento:** Define a direção de arte e som da fase, sempre respeitando as **`[Diretrizes]`** gerais do projeto. Cria a lista de todos os assets (sprites, tilesets, sons) necessários.
    *   **Organização:** É o principal responsável por preencher o **`[Arsenal Criativo]`** com os assets da sua fase, incluindo links e status.
    *   **Execução:** Cria ou encontra os assets gráficos e sonoros. Crucialmente, é responsável por carregar (`preload`) e implementar (`create`) os assets no Phaser, garantindo que apareçam corretamente no jogo.
    *   **Documentação:** Documenta cada asset no "Tablet", explicando o seu propósito e formato.

**4. Narrative Designer / Guardian of the Lore (O Guardião da Trama)**
*   **Perfil:** Bom escritor, criativo, focado na experiência do jogador e na coerência da história. É o historiador e o mestre dos enigmas.
*   **Responsabilidades:**
    *   **Planejamento:** Desenvolve a micro-narrativa específica da fase. Projeta o puzzle de termodinâmica em detalhe, incluindo as pistas, o texto do enigma e a lógica da solução.
    *   **Organização:** É o dono absoluto do **`[GDD - Game Design Document]`** e da secção **`[Pesquisa Científica]`** no Tablet. É aqui que ele detalha toda a história e o design do puzzle.
    *   **Execução:** Escreve todos os textos do jogo: diálogos, descrições de itens, logs do Dr. Thorne e a interface do puzzle. Trabalha em estreita colaboração com o Arquiteto para garantir que a mecânica sirva à narrativa.
    *   **Documentação:** O GDD é o seu principal entregável. Deve ser tão claro que qualquer membro da equipa o possa ler e compreender a visão completa da fase.

**5. QA Lead / Systems Analyst (O Analista de Sistemas)**
*   **Perfil:** Metódico, detalhista, crítico e com empatia pelo jogador. É o "agente do caos" que tenta quebrar o jogo para o tornar mais forte.
*   **Responsabilidades:**
    *   **Planejamento:** Ajuda a definir os critérios de sucesso da fase ("O que significa 'funcionar'?"). Planeia os testes a serem realizados.
    *   **Organização:** Cria uma secção de **`[Relatório de Bugs]`** dentro do hub da sua fase no Tablet, onde documenta os problemas encontrados de forma clara (O que aconteceu? Como reproduzir? Qual o resultado esperado?).
    *   **Execução:** É o principal testador do protótipo. Joga repetidamente para encontrar bugs, falhas lógicas e problemas de usabilidade. Verifica se a fase cumpre todas as especificações do GDD e das **`[Diretrizes]`** de estilo.
    *   **Documentação:** Mantém o relatório de bugs atualizado e dá o "selo de qualidade" antes de cada entrega, garantindo que a versão apresentada é a mais estável possível.

#### **Flexibilidade e Colaboração: A Regra de Ouro**

Embora cada membro tenha uma função primária, a colaboração é essencial. O **Arquiteto** deve programar, mas o **Guardião da Trama** deve testar a implementação do puzzle. O **Guardião dos Símbolos** cria a arte, mas o **Coordenador** ajuda a integrá-la se necessário. Todos são responsáveis pela qualidade final. Estas funções servem para criar responsabilidade e um ponto de partida, não para construir silos. A equipa mais bem-sucedida será aquela que souber trocar de "chapéu" quando necessário.