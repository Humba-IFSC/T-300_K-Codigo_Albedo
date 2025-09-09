### Glossário para Criação de Jogos de Plataforma

- **Animação:** Uma sequência de imagens (chamadas _sprites_) que, quando mostradas rapidamente, dão a **ilusão de movimento** a um personagem ou objeto, como fazer o personagem andar ou pular.
- **Arcade Physics:** Um **sistema de física simples**, muito usado em jogos de plataforma, como o estilo Super Mario. Ele define como os objetos se movem e interagem, incluindo a **gravidade**.
- **Assets (Recursos):** São todos os **arquivos e materiais** necessários para construir o jogo, como as imagens dos personagens (_sprites_), as configurações do mapa e sons. Eles são "pré-carregados" antes de o jogo começar.
- **Background (Plano de Fundo):** A **imagem ou cenário** que fica atrás de todos os elementos interativos do jogo, criando o ambiente visual.
- **Brains (Cérebros) / Coins (Moedas):** No contexto do jogo de Halloween, são os **itens colecionáveis** que o personagem deve pegar. Embora o código os chame de "moedas", eles aparecem como "cérebros" no jogo final, adicionando pontos à pontuação.
- **Câmera:** O **"olho" do jogo**, que mostra ao jogador a parte do cenário que está visível na tela. Ela pode ser programada para seguir o personagem principal enquanto ele se move.
- **Colisão:** Acontece quando **dois objetos do jogo se tocam**. É fundamental para o personagem não "atravessar" o chão, colidir com paredes ou coletar os cérebros.
- **Cursor / Input de Teclado:** Refere-se às **teclas do teclado** usadas para controlar o personagem no jogo, como as setas (esquerda, direita, cima) para movimentação e a barra de espaço para pular.
- **Função `create` (Criar):** Uma parte do código que é **executada apenas uma vez, logo no início do jogo**, para criar e configurar todos os elementos visuais e interativos, como o mapa, o personagem, e os cérebros.
- **Função `preload` (Pré-carregar):** Uma parte do código que é **executada antes de o jogo aparecer**, com a função de carregar todos os "assets" (recursos) do jogo (imagens, arquivos de mapa, etc.) na memória.
- **Função `update` (Atualizar):** Uma parte do código que é **executada repetidamente, a cada pequeno momento**, para atualizar o estado do jogo. É onde a movimentação do personagem e as animações são controladas continuamente.
- **Gravidade:** Uma **força simulada** no jogo que puxa os objetos para baixo, fazendo com que o personagem caia no chão após um pulo, por exemplo.
- **HTML (HyperText Markup Language):** A **linguagem fundamental** usada para estruturar e exibir conteúdo em páginas da web. No caso do jogo, é a base que inicia o site onde o jogo será executado.
- **JavaScript (JS):** A **linguagem de programação** principal usada para adicionar interatividade e toda a lógica ao jogo. É nela que se define como o personagem se move, como os itens são coletados, e todas as regras do jogo.
- **JSON (JavaScript Object Notation):** Um **formato de arquivo** simples usado para guardar informações e configurações do jogo, como a estrutura do mapa ou detalhes sobre as animações dos personagens.
- **Layers (Camadas):** Diferentes **"níveis" ou "planos" invisíveis** onde os elementos do jogo são posicionados. Por exemplo, o plano de fundo pode estar em uma camada mais distante, e o chão em uma camada mais próxima, à frente.
- **Live Server:** Um **programa extra (plugin)** para o Visual Studio Code que permite ver as mudanças no código HTML e JavaScript em tempo real no navegador, facilitando o desenvolvimento.
- **`main.js` (ou `meio JS`):** O **principal arquivo de código JavaScript** onde a maior parte da lógica e programação do jogo é escrita.
- **Mapa:** A **estrutura ou o design do cenário** do jogo, que é construído usando arquivos de configuração e "tiles" (blocos de imagem). É o "mundo" por onde o personagem irá se mover.
- **Phaser:** Uma **"biblioteca" ou "ferramenta"** que simplifica bastante a criação de jogos para a web usando JavaScript e HTML, cuidando de muitos detalhes técnicos para o programador.
- **Personagem (Player):** O **principal protagonista** do jogo, que o jogador controla e interage com o ambiente e os objetos.
- **Pontuação (Score):** O **número de pontos** que o jogador acumula ao longo do jogo, geralmente ao coletar os cérebros.
- **Scene (Cena):** Um **"ambiente" ou "fase" específica** dentro do jogo. Jogos mais complexos podem ter várias cenas, como uma tela de menu, uma introdução ou diferentes níveis.
- **Sprites:** **Pequenas imagens** que representam os personagens, objetos (como os cérebros), ou elementos do cenário (como os blocos do chão) no jogo.
- **Tiles (Ladrilhos/Blocos):** **Imagens pequenas e reutilizáveis** que são usadas para construir o mapa do jogo, como blocos de chão, caixas ou plataformas.
- **`var` (Variável):** Uma **"caixa" ou "espaço" no código** onde se pode guardar e nomear informações (como a pontuação atual, a velocidade do personagem ou a referência ao mapa) para usar mais tarde.
- **Velocidade (Velocity):** A **rapidez e a direção** com que um objeto (como o personagem) se move no jogo, tanto na horizontal (eixo X) quanto na vertical (eixo Y).
- **Visual Studio Code (VS Code):** Um **programa gratuito e popular (editor de código)** onde os programadores escrevem, organizam e editam seus códigos. É o ambiente recomendado para criar este jogo.

---

### Glossário de Termos Técnicos do Github

Este glossário tem como objetivo facilitar a compreensão dos termos e conceitos fundamentais para quem está começando a usar o Git e o GitHub para gerenciar seus projetos de código.

1. **Git**
    
    - **Função:** É uma **ferramenta de versionamento e gerenciamento de código**. Imagine que você está construindo um projeto grande; o Git permite que você crie e controle diferentes "versões" do seu código ao longo do tempo. Com ele, você pode retroceder para uma versão anterior que estava funcionando, avançar, ou até mesmo copiar partes do código. É essencial para **trabalho em equipe**, pois permite que vários programadores colaborem no mesmo projeto sem sobrescrever o trabalho um do outro.
2. **GitHub**
    
    - **Função:** É uma **plataforma online** que funciona como um "Hub" (centro) para o Git. Seu principal objetivo é **hospedar seus códigos e projetos**. Além de armazenar seu código com segurança (como um backup na nuvem), o GitHub é amplamente utilizado para criar um **portfólio de projetos**, onde você pode mostrar suas habilidades e o que já desenvolveu para recrutadores, clientes ou outros desenvolvedores.
3. **Repositório (Repository)**
    
    - **Função:** No contexto do Git e GitHub, um repositório é basicamente o seu **projeto**. Ele é uma **pasta que contém todos os códigos, arquivos e o histórico de versões** do seu projeto. Existem dois tipos principais:
        - **Repositório Local:** É a pasta do seu projeto que está salva no seu computador.
        - **Repositório Remoto:** É a pasta do seu projeto que está hospedada online no GitHub. Você pode configurar um repositório para ser **público** (qualquer pessoa pode ver) ou **privado** (somente você e quem você autorizar tem acesso).
4. **Branch (Ramificação)**
    
    - **Função:** Imagine seu projeto como uma linha do tempo principal. Uma branch é como uma **"ramificação" ou "cópia" paralela dessa linha do tempo**. As branches são utilizadas para **desenvolver novas funcionalidades (features), experimentar ideias ou corrigir bugs** sem afetar diretamente a versão principal do código. Tudo o que você altera em uma branch específica afeta apenas essa ramificação.
5. **Main / Master**
    
    - **Função:** São os nomes dados à **branch principal** do seu projeto. Historicamente, era chamada de "Master", mas a nomenclatura está migrando para "Main". É a versão mais estável e padrão do código, onde as alterações de outras branches são geralmente incorporadas após serem testadas.
6. **Commit**
    
    - **Função:** São os "pontos na história" ou as **"versões salvas" do seu código**. Cada commit representa um conjunto específico de alterações que você fez e salvou no seu repositório local, sempre acompanhado de uma **mensagem descritiva** do que foi modificado naquela versão.
7. **Staging Area (Área de Staging)**
    
    - **Função:** É uma **área intermediária** onde os arquivos que você modificou ou criou são "preparados" antes de serem definitivamente salvos como um commit. Pense nela como uma "sala de espera" para as suas alterações, onde você seleciona o que irá para a próxima versão do código.
8. **Git Bash**
    
    - **Função:** É um **terminal de linha de comando** que permite que você utilize os comandos do Git para controlar seus repositórios. Ele pode ser aberto diretamente na pasta do seu projeto para facilitar a execução dos comandos.
9. **Git Init**
    
    - **Função:** Este é o **primeiro comando** que você usa para **inicializar um novo repositório Git vazio** em uma pasta do seu computador. Ao executá-lo, o Git cria uma pasta oculta chamada `.git` dentro do seu projeto, que contém todas as configurações e o histórico de versionamento.
10. **Git Status**
    
    - **Função:** Um comando para **verificar o estado atual dos seus arquivos** no repositório. Ele mostra quais arquivos foram modificados, quais estão na staging area (geralmente em verde) e quais ainda não foram adicionados (geralmente em vermelho).
11. **Git Add [nome_do_arquivo]** ou **Git Add .**
    
    - **Função:** Este comando é usado para **adicionar arquivos à staging area**. Você pode adicionar um arquivo específico pelo nome (por exemplo, `git add meu_arquivo.txt`) ou usar `.` (ponto) para adicionar todos os arquivos modificados ou novos na pasta atual de uma só vez (`git add .`).
12. **Git Commit -m "[mensagem]"**
    
    - **Função:** Após adicionar os arquivos à staging area, este comando **cria um novo commit**, ou seja, uma nova versão salva do seu código. A mensagem (`-m "sua mensagem"`) é obrigatória e deve descrever claramente as alterações feitas naquele commit.
13. **Git Config --global user.email "[seu_email]"** e **Git Config --global user.name "[seu_nome]"**
    
    - **Função:** Estes comandos são usados para **configurar seu e-mail e nome de usuário globalmente** no Git. Essa configuração é essencial para que o Git possa identificar quem fez cada commit.
14. **Git Remote Add Origin [link_do_repositório_GitHub]**
    
    - **Função:** Este comando é usado para **conectar seu repositório Git local a um repositório remoto existente no GitHub**. "Origin" é um apelido padrão que você dá ao repositório remoto no GitHub para se referir a ele de forma mais fácil.
15. **Git Push [Origin] [nome_da_branch]**
    
    - **Função:** Comando para **enviar (ou "empurrar") os commits do seu repositório local para o repositório remoto no GitHub**. É assim que suas alterações salvas localmente se tornam visíveis e acessíveis na plataforma online.
16. **Git Pull [Origin] [nome_da_branch]**
    
    - **Função:** Comando para **baixar (ou "puxar") as últimas alterações do repositório remoto do GitHub para o seu repositório local**. Isso é importante para garantir que seu código local esteja sempre atualizado com a versão que está online, especialmente ao trabalhar em equipe.
17. **Git Clone [link_do_repositório_GitHub]**
    
    - **Função:** Usado para **copiar um repositório inteiro existente do GitHub** (seu ou de outra pessoa) para uma nova pasta no seu computador. É útil para começar a trabalhar em um projeto que já está hospedado no GitHub.
18. **Git Checkout [nome_da_branch]** ou **Git Checkout -b [nome_da_nova_branch]**
    
    - **Função:**
        - `Git Checkout [nome_da_branch]`: Usado para **alternar entre branches existentes** no seu repositório local.
        - `Git Checkout -b [nome_da_nova_branch]`: Cria uma **nova branch e já muda para ela** automaticamente.
19. **Git Merge [nome_da_branch_a_mesclar]**
    
    - **Função:** Comando para **combinar as alterações de uma branch em outra**. Por exemplo, depois de desenvolver uma nova funcionalidade em uma branch separada, você pode mesclá-la na branch principal (Main/Master) para incorporar essas mudanças ao projeto.
20. **Fork**
    
    - **Função:** No GitHub, "forkar" um repositório significa **criar uma cópia de um projeto existente de outra pessoa para o seu próprio perfil** no GitHub. Isso permite que você faça alterações, experimente e contribua com o código sem afetar diretamente o projeto original.
21. **Pull Request (PR)**
    
    - **Função:** É uma **solicitação formal para que o dono de um repositório revise e incorpore as alterações** que você fez (seja em um fork ou em uma branch sua) no projeto original. É um processo colaborativo onde as alterações são propostas, discutidas e aprovadas (ou não) antes de serem mescladas.
22. **README.md (Arquivo README)**
    
    - **Função:** É um arquivo de texto (geralmente escrito na linguagem Markdown) que deve estar na raiz do seu repositório. Sua função é **fornecer uma descrição detalhada do projeto, instruções de uso, informações de instalação, e qualquer outra informação relevante** que as pessoas precisem saber sobre o código. No GitHub, o conteúdo deste arquivo é exibido automaticamente na página principal do repositório.
23. **.git (Pasta .git)**
    
    - **Função:** É uma **pasta oculta** que é criada automaticamente quando você executa o comando `git init`. Ela contém todas as informações essenciais para o Git rastrear e gerenciar o versionamento do seu projeto. É muito importante **não apagar** ou modificar esta pasta diretamente, pois isso pode corromper o histórico do seu projeto.
24. **.gitignore (Arquivo .gitignore)**
    
    - **Função:** Este é um arquivo de texto onde você lista arquivos ou pastas que o Git deve **ignorar e não rastrear**. Por exemplo, você pode usá-lo para excluir arquivos temporários, credenciais de segurança, ou arquivos gerados automaticamente pelo sistema operacional que não fazem parte do código principal do projeto. _Esta explicação detalhada da função de ignorar arquivos é baseada em conhecimento geral sobre Git, complementando a menção de sua existência nos materiais fornecidos._
25. **CD (Change Directory)**
    
    - **Função:** Um comando de terminal usado para **navegar entre as pastas** do seu sistema operacional. Por exemplo, `cd nome_da_pasta` entra em uma pasta, e `cd ..` volta para a pasta anterior.
26. **Clear**
    
    - **Função:** Um comando de terminal simples que serve para **limpar a tela do terminal**, removendo os comandos anteriores e deixando-a mais organizada.