---
Projeto: T-300 K - Código Albedo
Tipo_Documento: Estrutura Organizacional e Gestão de Fases
Versao_Template: Mestre V2.0 (Adaptado para Markdown)
Professor_Gestor: $H_LO$ (Comando da Missão)
Status: Em Desenvolvimento Ativo
Data_Atualizacao: 2024-05-30
Total_Fases_Cruciais: 6
---

# 🚀 PROJETO T-300 K: DDJ MESTRE - PAINEL DE CONTROLE DA ECPA

Este documento serve como o núcleo central de gestão e documentação, o "Tablet de Thorne", que orientará os 'Game-Builders' a trabalharem como uma unidade coesa. A arquitetura é sólida, fornecendo a planta precisa para que a faísca da vida seja fornecida pelas equipes.

## 1. Visão Geral do Projeto e Navegação Principal

O DDJ não é apenas um documento; é um cofre onde cada especificação técnica, diretriz de estilo e protocolo de colaboração moldará o resultado final.

| Secção do DDJ | Propósito | Link de Navegação |
| :--- | :--- | :--- |
| **Hub das Fases** | Acesso aos QGs (Quartéis-Generais) dos seis grupos e seus módulos. | [[Arquivos de Fase → Hub das Fases]] |
| **Biblioteca Científica** | Material de estudo alinhado com os conceitos de física térmica. | [[Biblioteca Científica → Hub de Física]] |
| **Arsenal Criativo** | Inventário centralizado de todos os assets (arte, som, código). | [[Arsenal Criativo → Banco de Recursos]] |
| **Protocolos** | Guia de estilo e padrões de código para garantir coesão do jogo. | [[Diretrizes Técnicas e de Estilo → Diretrizes]] |
| **Cronograma** | Datas de entrega, objetivos e avaliações do plano de ensino. | [[Registro de Missão → Cronograma]] |

---

## 2. Estrutura das Fases e Times de Game-Builders

O projeto "Código Albedo" é composto por seis fases cruciais. O sucesso reside na sinergia da equipa, onde cada membro conhece a sua função, a sua alavanca, o seu manómetro.

### Tabela de Fases, Conceitos e Equipes

| Fase (Módulo) | Título Narrativo | Conceito Físico Central | Equipe Responsável (Grupo) |
| :--- | :--- | :--- | :--- |
| **Fase 1** | O Legado do Mentor | Albedo e Balanço de Radiação | Arthur, Bruno, Matheus, Miguel e Vinicius |
| **Fase 2** | A Febre Urbana | Calor Sensível e Capacidade Térmica | Caio, Davi, João A., Marcus D., Miguel K. |
| **Fase 3** | O Sopro do Fantasma | Leis dos Gases Ideais (Lei de Boyle) | Aghata, Ana Clara, Ana Júlia, Mª Eduardo, Léo |
| **Fase 4** | A Máquina de Entropia | Primeira Lei da Termodinâmica (ΔU = Q - W) | Ariel, Gabriel A, Gabriel C, João C. Marcos V. |
| **Fase 5** | A Vila dos Sobreviventes | Mudanças de Estado e Calor Latente | Ketlin, João V., Mª Alice, Nicole, Izadora |
| **Fase 6** | A Torre Celeste | Mecanismos de Transferência de Calor (Irradiação) | Antonio, Lucas, Ruan, Vinícius G., Vitor H. |

### Estrutura Padrão de um QG de Fase (Exemplo: Hub_Fase4)

Cada fase possui um Quartel-General (QG) de grupo, que contém a documentação específica para o seu módulo.

*   [[GDD - [Nome da Fase]]] (Onde o design encontra a especificação técnica)
*   [[Pesquisa Científica - [Conceito Físico]]] (A física por trás do puzzle)
*   [[Diário de Bordo - Grupo [Nome]]] (O log de progresso e decisões)
*   [[Scripts e Código - Fase [Número]]] (Boilerplates e snippets de código Phaser)
*   [[Link para o Protótipo Jogável]] (Link externo para o HTML da fase)
*   [[Relatório de Bugs - Grupo [Nome]]] (Criado e mantido pelo QA Lead)

---

## 3. Estrutura de Funções (Os 5 Papéis Essenciais de um Game-Builder)

Para evitar a "anarquia da responsabilidade difusa", cada time de cinco alunos deve operar com funções claras, mas flexíveis. Cada função é uma "peça do mistério da criação" e um guardião de uma secção específica do DDJ.

| Função Principal (Cargo) | Identidade Narrativa | Responsabilidades Chave (DDJ) | Secção DDJ "Guardada" |
| :--- | :--- | :--- | :--- |
| **1. Project Lead / Mission Coordinator** | **O Coordenador da Missão** | Facilita reuniões, define metas de sprint, modera discussões e é o ponto de contacto com o professor. | **[Cronograma]** e **[Diário de Bordo]** do grupo. |
| **2. Lead Architect / Phaser Engineer** | **O Arquiteto do Labirinto** | Traduz o GDD em código técnico, define a estrutura da cena no Phaser e escreve a lógica de programação principal (movimento, colisões, puzzle). | **[Scripts e Código]** da Fase. |
| **3. Creative Director / Asset Integrator** | **O Guardião dos Símbolos** | Define a direção de arte/som da fase (respeitando as Diretrizes), cria ou integra assets e é crucial na implementação (preload/create) no Phaser. | **[Arsenal Criativo]** (Assets). |
| **4. Narrative Designer / Guardian of the Lore** | **O Guardião da Trama** | Desenvolve a micro-narrativa da fase, projeta o puzzle de termodinâmica (pistas, enigmas, solução) e escreve todos os textos do jogo (diálogos, logs). | **[GDD - Game Design Document]** e **[Pesquisa Científica]** da Fase. |
| **5. QA Lead / Systems Analyst** | **O Analista de Sistemas** | É o principal testador do protótipo. Joga repetidamente para encontrar bugs, falhas lógicas e problemas de usabilidade. Verifica a conformidade com o GDD e Diretrizes. | **[Relatório de Bugs]** (dentro do Hub da Fase). |

> **Regra de Ouro:** As funções criam responsabilidade e um ponto de partida, não silos. A equipa deve trocar de "chapéu" quando necessário, pois todos são responsáveis pela qualidade final. Por exemplo, o Guardião da Trama deve testar a implementação do puzzle feita pelo Arquiteto.

## 4. Guia de Documentação (A Lógica do DDJ)

O **Game Design Document (GDD)** de cada fase é o mapa da aventura. O Template Mestre fornece a estrutura (DDJ Checkpoints).

O **Guardião da Trama** preenche principalmente a Visão Geral Narrativa e o Design do Puzzle.
O **Arquiteto do Labirinto** preenche a Secção de Especificações Técnicas (Phaser) e o Boilerplate da Cena.

A documentação deve seguir os padrões técnicos definidos:
*   **Scene Key:** Ex: 'Fase4Scene'.
*   **Nomenclatura Padrão:** Uso de `camelCase` e `PascalCase` para variáveis e classes, conforme as **[Diretrizes Técnicas]**.
*   **Física de Colisão:** Ex: `this.physics.add.collider(player, wallsLayer);`.

### Exemplo de Propriedades do GDD (Para o Hub da Fase 4)

Este bloco de propriedades seria adicionado ao topo do arquivo `GDD - Máquina de Entropia.md` dentro do QG da Fase 4.

```markdown
---
Fase_Numero: 4
Equipe_Grupo: Delta
Coordenador_Missao: [Nome do Project Lead]
Arquiteto_Labirinto: [Nome do Arquiteto]
Conceito_Fisico: Primeira Lei da Termodinâmica
Palavra_Passe_Puzzle: ENERGIA INTERNA
Status_Desenvolvimento: Design Completo
---
````