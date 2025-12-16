# 📝 HTML ESSENCIAL

## O que é HTML?

HTML (HyperText Markup Language) é a linguagem que define a **estrutura** de uma página web. É como o esqueleto de um site.

**No projeto T-300 K:**
- HTML cria a página que carrega o jogo
- Define o canvas onde o Phaser desenha

---

## Estrutura Básica

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>T-300 K: Código Albedo</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="phaser.js"></script>
    <script src="game.js"></script>
  </body>
</html>
```

### O que cada tag faz?

- `<!DOCTYPE html>` - Define que é HTML5
- `<html>` - Começo e fim da página
- `<head>` - Informações da página (não aparece)
- `<meta charset="UTF-8">` - Suporte para acentos
- `<meta name="viewport"...>` - Funciona em celular
- `<title>` - Nome da aba do navegador
- `<link rel="stylesheet">` - Carrega CSS
- `<body>` - Conteúdo que aparece
- `<div id="app">` - Container para o jogo
- `<script>` - Carrega JavaScript

---

## Tags Úteis no Projeto

### Div - Container
```html
<div id="menu">
  <!-- Conteúdo aqui -->
</div>
```

### Span - Texto dentro de linha
```html
<p>Você tem <span id="energia">100</span> de energia</p>
```

### Button - Botão
```html
<button id="continuar">Continuar</button>
```

### Input - Entrada de texto
```html
<input type="text" id="nome-jogador" placeholder="Digite seu nome">
```

### Img - Imagem
```html
<img src="assets/torre.png" alt="Torre Celeste">
```

---

# 🎨 CSS ESSENCIAL

## O que é CSS?

CSS (Cascading Style Sheets) define a **aparência** (cores, tamanhos, posições). É como a pintura e decoração de um site.

---

## Estrutura Básica

```css
/* Arquivo: styles.css */

/* Seletor */
#app {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  background-color: #1a1a2e;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #16c784;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #12a857;
}
```

### Conceitos Básicos

**Seletor:** O que vai ser estilizado
```css
#app        /* ID (único) */
.botao      /* Classe (múltiplos) */
button      /* Tag HTML */
```

**Propriedade e Valor:**
```css
width: 800px;     /* propriedade : valor ; */
```

---

## Propriedades Mais Usadas

### Tamanho
```css
width: 100px;        /* Largura */
height: 50px;        /* Altura */
padding: 10px;       /* Espaço interno */
margin: 20px;        /* Espaço externo */
```

### Cores
```css
color: white;                    /* Texto */
background-color: #1a1a2e;       /* Fundo */
border: 2px solid #16c784;       /* Borda */
```

### Posicionamento
```css
display: flex;       /* Flexbox (muito útil!) */
justify-content: center;    /* Horizontal */
align-items: center;        /* Vertical */

display: grid;       /* Grid (para tabelas) */
```

### Fonte
```css
font-size: 16px;
font-family: Arial, sans-serif;
font-weight: bold;
```

---

## Exemplo Para o Projeto

```css
/* Container do jogo */
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d0d1a;
  font-family: Arial, sans-serif;
}

/* Menu */
.menu {
  text-align: center;
  color: white;
}

.menu h1 {
  font-size: 48px;
  margin-bottom: 30px;
  color: #00d4ff;
}

/* Botões */
.btn-primary {
  padding: 12px 30px;
  font-size: 18px;
  background-color: #16c784;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: #12a857;
  transform: scale(1.05);
}
```

---

# ⚙️ JAVASCRIPT ESSENCIAL

## O que é JavaScript?

JavaScript é a linguagem que **anima** e **controla** as páginas web. É o "cérebro" do projeto.

**No T-300 K:**
- JavaScript controlará o Phaser
- Será responsável pela lógica dos enigmas
- Gerenciará os pontos e progresso

---

## Conceitos Básicos

### Variáveis - Guardar Dados
```javascript
// Criar variável
let energia = 100;          // Pode mudar depois
const nome = "Torre Celeste";  // Não muda nunca
var velocidade = 5;         // Evite usar (problema de escopo)

// Usar variável
console.log(energia);  // Imprime 100
energia = 90;          // Mudou para 90
```

### Tipos de Dados
```javascript
let numero = 42;              // Número
let texto = "Olá";            // Texto (string)
let verdade = true;           // Booleano (true/false)
let lista = [1, 2, 3];        // Array (lista)
let objeto = { x: 10, y: 20 }; // Objeto (conjunto de dados)
```

### Funções - Reutilizar Código
```javascript
// Definir função
function calcularDano(potencia, defesa) {
  return potencia - defesa;
}

// Usar função
let dano = calcularDano(50, 10);  // Retorna 40

// Função sem retorno
function mostrarMensagem(texto) {
  console.log(texto);
}

mostrarMensagem("Jogador venceu!");
```

### If/Else - Tomar Decisões
```javascript
let vida = 30;

if (vida > 50) {
  console.log("Vida alta");
} else if (vida > 0) {
  console.log("Vida baixa");
} else {
  console.log("Morreu!");
}
```

### Loops - Repetir Ações
```javascript
// Loop com número
for (let i = 0; i < 5; i++) {
  console.log(i);  // Imprime 0, 1, 2, 3, 4
}

// Loop para cada elemento
let enigmas = ["irradiação", "emissividade", "stefan-boltzmann"];
for (let enigma of enigmas) {
  console.log(enigma);
}

// Loop enquanto verdadeiro
let contador = 0;
while (contador < 3) {
  console.log(contador);
  contador++;
}
```

### Objetos - Agrupar Dados
```javascript
let jogador = {
  nome: "João",
  vida: 100,
  energia: 50,
  localizacao: "Torre Celeste"
};

// Acessar dados
console.log(jogador.nome);        // "João"
console.log(jogador["vida"]);     // 100

// Modificar dados
jogador.vida = 80;
```

---

## Classes - Criar Objetos Reutilizáveis

```javascript
class Enigma {
  constructor(nome, dificuldade) {
    this.nome = nome;
    this.dificuldade = dificuldade;
    this.resolvido = false;
  }

  resolver() {
    this.resolvido = true;
    console.log(`Enigma "${this.nome}" resolvido!`);
  }

  getDificuldade() {
    return this.dificuldade;
  }
}

// Criar enigmas
let enigma1 = new Enigma("Irradiação", "Médio");
let enigma2 = new Enigma("Stefan-Boltzmann", "Difícil");

// Usar
enigma1.resolver();
console.log(enigma1.nome);  // "Irradiação"
```

---

## Exemplo Para o Projeto

```javascript
// Gerenciador de jogo
class GameManager {
  constructor() {
    this.pontos = 0;
    this.enigmasResolvidos = 0;
    this.vida = 100;
  }

  adicionarPontos(quantidade) {
    this.pontos += quantidade;
    console.log(`Pontos: ${this.pontos}`);
  }

  resolverEnigma(dificuldade) {
    this.enigmasResolvidos++;
    
    if (dificuldade === "fácil") {
      this.adicionarPontos(10);
    } else if (dificuldade === "médio") {
      this.adicionarPontos(25);
    } else if (dificuldade === "difícil") {
      this.adicionarPontos(50);
    }
  }

  gameOver() {
    if (this.vida <= 0) {
      return true;
    }
    return false;
  }
}

// Usar
let game = new GameManager();
game.resolverEnigma("médio");  // +25 pontos
console.log(game.pontos);       // 25
```

---

# 🎮 PHASER PARA O JOGO T-300 K

## O que é Phaser?

Phaser é uma **biblioteca JavaScript** que facilita criar jogos 2D. Ela:
- Desenha gráficos
- Toca sons
- Controla movimento
- Gerencia colisões
- E muito mais!

**Phaser é perfeito para T-300 K porque:**
- Fácil para iniciantes
- Rápido de desensenvolvo
- Funciona em navegadores

---

## Instalação e Setup

### Passo 1: Criar Pasta do Projeto
```bash
mkdir t-300-k
cd t-300-k
```

### Passo 2: Criar Arquivos Básicos

**index.html:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>T-300 K: Código Albedo</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="game.js"></script>
</body>
</html>
```

**styles.css:**
```css
* {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0d0d1a;
  font-family: Arial, sans-serif;
}

#app {
  width: 800px;
  height: 600px;
}
```

---

## Estrutura Básica de um Jogo

```javascript
// game.js

// Configuração do jogo
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// 1. PRELOAD - Carregar recursos (imagens, sons)
function preload() {
  // Exemplo: carregar imagem
  // this.load.image('torre', 'assets/torre.png');
  // this.load.audio('musica', 'assets/musica.mp3');
}

// 2. CREATE - Criar objetos do jogo (executado uma vez)
function create() {
  // Criar sprites, textos, etc
  this.add.text(400, 300, 'Bem-vindo ao T-300 K!', {
    fontSize: '32px',
    fill: '#00d4ff'
  }).setOrigin(0.5);
}

// 3. UPDATE - Atualizar jogo (executado 60x por segundo)
function update() {
  // Movimento, colisões, lógica do jogo
}
```

---

## Adicionando Objetos

### Texto
```javascript
// No create()
let texto = this.add.text(100, 100, 'Enigma 1', {
  fontSize: '24px',
  fill: '#ffffff',
  fontStyle: 'bold'
});

// Mudar depois
texto.setText('Enigma Resolvido!');
texto.setFill('#00ff00');
```

### Retângulo/Formas
```javascript
// Retângulo
let ret = this.add.rectangle(400, 300, 100, 50, 0xff0000);

// Círculo
let circulo = this.add.circle(200, 200, 30, 0x00ff00);

// Mudar cor, tamanho, posição
ret.setFill(0x0000ff);
ret.setPosition(300, 250);
ret.setScale(2);
```

### Imagens/Sprites
```javascript
// No preload()
this.load.image('torre', 'assets/torre.png');

// No create()
let torre = this.add.sprite(400, 300, 'torre');
torre.setScale(0.5);
torre.setPosition(200, 100);
```

### Botão Interativo
```javascript
// Criar retângulo como botão
let botao = this.add.rectangle(400, 500, 150, 50, 0x16c784)
  .setInteractive();

// Adicionar texto ao botão
let textoBtn = this.add.text(400, 500, 'Próximo', {
  fontSize: '20px',
  fill: '#ffffff'
}).setOrigin(0.5);

// Evento ao clicar
botao.on('pointerdown', () => {
  console.log('Botão clicado!');
});

// Efeito hover
botao.on('pointerover', () => {
  botao.setFill(0x12a857);
});

botao.on('pointerout', () => {
  botao.setFill(0x16c784);
});
```

---

## Gerenciando Estados (Cenas)

```javascript
// Cena 1: Menu
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
  }

  create() {
    this.add.text(400, 150, 'T-300 K', {
      fontSize: '48px',
      fill: '#00d4ff'
    }).setOrigin(0.5);

    let botao = this.add.rectangle(400, 400, 200, 60, 0x16c784)
      .setInteractive();
    
    this.add.text(400, 400, 'COMEÇAR', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    botao.on('pointerdown', () => {
      this.scene.start('game');  // Mudar para cena 'game'
    });
  }
}

// Cena 2: Jogo
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });
  }

  create() {
    this.add.text(400, 50, 'Torre Celeste', {
      fontSize: '32px',
      fill: '#00d4ff'
    }).setOrigin(0.5);
  }

  update() {
    // Lógica do jogo
  }
}

// Configurar jogo com múltiplas cenas
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);
```

---

## Exemplo Completo: Enigma de Irradiação

```javascript
class EnigmaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'enigma' });
    this.resposta = null;
  }

  create() {
    // Título
    this.add.text(400, 50, 'Enigma: Lei de Stefan-Boltzmann', {
      fontSize: '28px',
      fill: '#00d4ff'
    }).setOrigin(0.5);

    // Pergunta
    this.add.text(400, 150, 'Qual a fórmula de radiação térmica?', {
      fontSize: '20px',
      fill: '#ffffff',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Opções
    const opcoes = [
      { texto: 'E = mc²', resposta: false },
      { texto: 'P = σT⁴A', resposta: true },
      { texto: 'F = ma', resposta: false }
    ];

    opcoes.forEach((opcao, index) => {
      let y = 300 + (index * 80);
      let botao = this.add.rectangle(400, y, 300, 60, 0x444444)
        .setInteractive();

      this.add.text(400, y, opcao.texto, {
        fontSize: '18px',
        fill: '#ffffff'
      }).setOrigin(0.5);

      botao.on('pointerdown', () => {
        if (opcao.resposta) {
          this.acertou();
        } else {
          this.errou();
        }
      });

      botao.on('pointerover', () => {
        botao.setFill(0x666666);
      });

      botao.on('pointerout', () => {
        botao.setFill(0x444444);
      });
    });
  }

  acertou() {
    this.add.text(400, 550, '✓ CORRETO!', {
      fontSize: '24px',
      fill: '#00ff00'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('game');
    });
  }

  errou() {
    this.add.text(400, 550, '✗ INCORRETO!', {
      fontSize: '24px',
      fill: '#ff0000'
    }).setOrigin(0.5);
  }
}

// Usar a cena
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [EnigmaScene]
};

const game = new Phaser.Game(config);
```

---

## Dicas Importantes para T-300 K

✅ **Organize o código em cenas**
- MenuScene (menu principal)
- TowerScene (exploração)
- EnigmaScene (puzzle)
- FinalScene (finais)

✅ **Reutilize componentes**
```javascript
criarBotao(scene, x, y, texto, callback) {
  let botao = scene.add.rectangle(x, y, 150, 50, 0x16c784)
    .setInteractive();
  scene.add.text(x, y, texto, { fill: '#ffffff' }).setOrigin(0.5);
  botao.on('pointerdown', callback);
  return botao;
}
```

✅ **Use dados do GameManager**
```javascript
// Passar dados entre cenas
this.scene.start('enigma', { pontos: 100, enigma: 1 });

// Receber dados
create(data) {
  console.log(data.pontos);  // 100
}
```

✅ **Teste no navegador frequentemente**
- Abra `index.html` no navegador
- Abra DevTools (F12)
- Procure por erros no console

---

## Próximos Passos

1. **Implementar Menu Principal**
2. **Criar Sistema de Enigmas**
3. **Adicionar Feedback Educacional**
4. **Implementar os 3 Finais**
5. **Adicionar Música e Sons**
6. **Polir e Testar**

Boa sorte desenvolvendo o T-300 K! 🚀