// ============================================
// CONFIGURAÇÃO INICIAL DO JOGO
// ============================================

// Configuração do Phaser com física arcade e dimensões 800x600
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Sem gravidade (visão top-down)
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Inicializa o jogo
const game = new Phaser.Game(config);

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let player; // Objeto do jogador
let cursors; // Teclas de seta
let currentFloor = 1; // Andar atual (começa no 1)
let doors = []; // Array com todas as portas do jogo
let stairs = []; // Array com todas as escadas
let interactKey; // Tecla de interação (ESPAÇO)
let floorGraphics = {}; // Contêineres gráficos de cada andar
let statusText; // Texto de status no topo da tela
let doorStates = {}; // Estado de cada porta (trancada/destrancada, desafio)
let rooms = {}; // Armazena os contêineres das salas atrás das portas

// ============================================
// FUNÇÃO PRELOAD - Carregamento de Assets
// ============================================
function preload() {
  // Aqui você pode carregar imagens personalizadas:
  // this.load.image('floor1_bg', 'caminho/para/andar1_fundo.png');
  // this.load.image('player', 'caminho/para/player.png');
  // etc.
}

// ============================================
// FUNÇÃO CREATE - Criação Inicial do Jogo
// ============================================
function create() {
  // Criar os gráficos dos 3 andares
  createFloorGraphics(this);

  // Criar o jogador (círculo verde)
  player = this.add.circle(400, 500, 15, 0x4caf50);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true); // Não deixa sair da tela

  // Criar elementos de cada andar
  createFloor1Elements(this);
  createFloor2Elements(this);
  createFloor3Elements(this);

  // Criar salas vazias atrás das portas especificadas
  createRooms(this);

  // Configurar controles do teclado
  cursors = this.input.keyboard.createCursorKeys();
  interactKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  // Criar texto de status no canto superior esquerdo
  statusText = this.add.text(10, 10, "", {
    fontSize: "18px",
    fill: "#fff",
    backgroundColor: "#000",
    padding: { x: 10, y: 5 },
  });
  statusText.setDepth(1000); // Sempre visível por cima

  // Mostrar apenas o andar 1 no início
  updateFloorVisibility(this);
  updateStatus();
}

// ============================================
// CRIAÇÃO DOS GRÁFICOS DOS ANDARES
// ============================================
function createFloorGraphics(scene) {
  // ANDAR 1 - Entrada com 8 portas
  floorGraphics.floor1 = scene.add.container(0, 0);
  const bg1 = scene.add.rectangle(400, 300, 800, 600, 0x2c3e50);
  const floor1Text = scene.add
    .text(400, 50, "ANDAR 1 - ENTRADA", {
      fontSize: "24px",
      fill: "#fff",
    })
    .setOrigin(0.5);
  floorGraphics.floor1.add([bg1, floor1Text]);

  // ANDAR 2 - Torre
  floorGraphics.floor2 = scene.add.container(0, 0);
  const bg2 = scene.add.rectangle(400, 300, 800, 600, 0x34495e);
  const floor2Text = scene.add
    .text(400, 50, "ANDAR 2 - TORRE", {
      fontSize: "24px",
      fill: "#fff",
    })
    .setOrigin(0.5);
  floorGraphics.floor2.add([bg2, floor2Text]);

  // ANDAR 3 - Sala Final
  floorGraphics.floor3 = scene.add.container(0, 0);
  const bg3 = scene.add.rectangle(400, 300, 800, 600, 0x8e44ad);
  const floor3Text = scene.add
    .text(400, 50, "ANDAR 3 - SALA FINAL", {
      fontSize: "24px",
      fill: "#fff",
    })
    .setOrigin(0.5);
  const finalText = scene.add
    .text(400, 300, 'DESAFIO ESCONDIDO\nPARA O "FINAL FELIZ"', {
      fontSize: "32px",
      fill: "#FFD700",
      align: "center",
    })
    .setOrigin(0.5);
  floorGraphics.floor3.add([bg3, floor3Text, finalText]);
}

// ============================================
// CRIAÇÃO DOS ELEMENTOS DO ANDAR 1
// ============================================
function createFloor1Elements(scene) {
  // Posições das 8 portas ao redor do andar
  // P2 = ESCADA para subir à torre (posição superior)
  // P6 = ENTRADA do prédio (posição inferior)
  // P1, P3, P4, P5, P7 e P8 = portas com salas
  const doorPositions = [
    { x: 200, y: 200, angle: 45, label: "P1", hasRoom: true, isSpecial: false }, // P1 - sala
    {
      x: 400,
      y: 150,
      angle: 90,
      label: "P2",
      hasRoom: false,
      isSpecial: "stair_up",
    }, // P2 - ESCADA SUBIR
    {
      x: 600,
      y: 200,
      angle: 135,
      label: "P3",
      hasRoom: true,
      isSpecial: false,
    }, // P3 - sala
    {
      x: 650,
      y: 350,
      angle: 180,
      label: "P4",
      hasRoom: true,
      isSpecial: false,
    }, // P4 - sala
    {
      x: 600,
      y: 500,
      angle: 225,
      label: "P5",
      hasRoom: true,
      isSpecial: false,
    }, // P5 - sala
    {
      x: 400,
      y: 550,
      angle: 270,
      label: "P6",
      hasRoom: false,
      isSpecial: "entrance",
    }, // P6 - ENTRADA
    {
      x: 200,
      y: 500,
      angle: 315,
      label: "P7",
      hasRoom: true,
      isSpecial: false,
    }, // P7 - sala
    { x: 150, y: 350, angle: 0, label: "P8", hasRoom: true, isSpecial: false }, // P8 - sala
  ];

  doorPositions.forEach((pos, index) => {
    // P2 - Criar escada para SUBIR à torre
    if (pos.isSpecial === "stair_up") {
      const stairUp = scene.add.triangle(
        pos.x,
        pos.y,
        0,
        30,
        15,
        0,
        30,
        30,
        0xffd700
      );
      scene.physics.add.existing(stairUp);
      stairUp.floor = 1;
      stairUp.direction = "up";

      const stairLabel = scene.add
        .text(pos.x, pos.y - 40, "↑ Subir Torre", {
          fontSize: "14px",
          fill: "#FFD700",
        })
        .setOrigin(0.5);

      floorGraphics.floor1.add([stairUp, stairLabel]);
      stairs.push(stairUp);
    }
    // P6 - Criar porta de ENTRADA (destrancada)
    else if (pos.isSpecial === "entrance") {
      const door = scene.add.rectangle(pos.x, pos.y, 40, 60, 0x2ecc71); // Verde = aberta
      scene.physics.add.existing(door);
      door.floor = 1;
      door.id = `floor1_door${index + 1}`;
      door.locked = false; // Entrada sempre aberta
      door.hasRoom = false;

      doorStates[door.id] = {
        locked: false,
        challenge: "Entrada do Prédio",
        hasRoom: false,
      };

      const doorLabel = scene.add
        .text(pos.x, pos.y - 40, "🚪 ENTRADA", {
          fontSize: "14px",
          fill: "#2ecc71",
        })
        .setOrigin(0.5);

      floorGraphics.floor1.add([door, doorLabel]);
      doors.push(door);
    }
    // Portas normais com salas
    else {
      const door = scene.add.rectangle(pos.x, pos.y, 40, 60, 0x8b4513);
      scene.physics.add.existing(door);
      door.floor = 1;
      door.id = `floor1_door${index + 1}`;
      door.locked = true; // Começa trancada
      door.hasRoom = pos.hasRoom;

      doorStates[door.id] = {
        locked: true,
        challenge: `Desafio ${index + 1}`,
        hasRoom: pos.hasRoom,
      };

      const doorLabel = scene.add
        .text(pos.x, pos.y - 40, pos.label, {
          fontSize: "14px",
          fill: "#fff",
        })
        .setOrigin(0.5);

      floorGraphics.floor1.add([door, doorLabel]);
      doors.push(door);
    }
  });
}

// ============================================
// CRIAÇÃO DAS SALAS VAZIAS
// ============================================
function createRooms(scene) {
  // Salas para P1, P3, P4, P5, P7 e P8 (andar 1)
  const roomIds = [
    "floor1_door1",
    "floor1_door3",
    "floor1_door4",
    "floor1_door5",
    "floor1_door7",
    "floor1_door8",
  ];

  roomIds.forEach((doorId, index) => {
    // Criar contêiner para cada sala
    const room = scene.add.container(0, 0);
    room.setVisible(false); // Começa invisível

    // Fundo da sala
    const roomBg = scene.add.rectangle(400, 300, 800, 600, 0x1a1a1a);

    // Título da sala
    const roomTitle = scene.add
      .text(400, 100, `SALA ${index + 1}`, {
        fontSize: "32px",
        fill: "#FFD700",
      })
      .setOrigin(0.5);

    // Descrição da sala vazia
    const roomDesc = scene.add
      .text(
        400,
        300,
        "Sala vazia\n\n(Aqui você pode adicionar\ndesafios ou conteúdo)",
        {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Botão de voltar
    const backButton = scene.add.rectangle(400, 500, 200, 50, 0x8b4513);
    const backText = scene.add
      .text(400, 500, "← Voltar (ESPAÇO)", {
        fontSize: "18px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    room.add([roomBg, roomTitle, roomDesc, backButton, backText]);
    room.setDepth(100); // Fica por cima de tudo

    // Armazenar referência à sala
    rooms[doorId] = room;
  });
}

// ============================================
// CRIAÇÃO DOS ELEMENTOS DO ANDAR 2
// ============================================
function createFloor2Elements(scene) {
  // Posições no andar 2:
  // P2 (superior) = ENTRADA do andar 2 (escada que vem do andar 1)
  // P6 (inferior) = ESCADA para subir ao andar 3

  // P2 - Escada de ENTRADA (descida do andar 1)
  const stairDown = scene.add.triangle(400, 150, 0, 0, 15, 30, 30, 0, 0xff6347);
  scene.physics.add.existing(stairDown);
  stairDown.floor = 2;
  stairDown.direction = "down";

  const downLabel = scene.add
    .text(400, 120, "↓ Entrada (Andar 1)", {
      fontSize: "14px",
      fill: "#FF6347",
    })
    .setOrigin(0.5);

  // P6 - Escada para SUBIR ao terraço (andar 3)
  const stairUp = scene.add.triangle(400, 550, 0, 30, 15, 0, 30, 30, 0xffd700);
  scene.physics.add.existing(stairUp);
  stairUp.floor = 2;
  stairUp.direction = "up";

  const upLabel = scene.add
    .text(400, 520, "↑ Subir Terraço", {
      fontSize: "14px",
      fill: "#FFD700",
    })
    .setOrigin(0.5);

  floorGraphics.floor2.add([stairDown, downLabel, stairUp, upLabel]);
  stairs.push(stairDown, stairUp);
}

// ============================================
// CRIAÇÃO DOS ELEMENTOS DO ANDAR 3
// ============================================
function createFloor3Elements(scene) {
  // Apenas escada para descer
  const stairDown = scene.add.triangle(400, 500, 0, 0, 15, 30, 30, 0, 0xff6347);
  scene.physics.add.existing(stairDown);
  stairDown.floor = 3;
  stairDown.direction = "down";

  const downLabel = scene.add
    .text(400, 530, "↓ Descer", {
      fontSize: "14px",
      fill: "#FF6347",
    })
    .setOrigin(0.5);

  floorGraphics.floor3.add([stairDown, downLabel]);
  stairs.push(stairDown);
}

// ============================================
// FUNÇÃO UPDATE - Loop Principal do Jogo
// ============================================
function update() {
  // Movimento do jogador (velocidade 200 pixels/segundo)
  const speed = 200;

  // Movimento horizontal
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  } else {
    player.body.setVelocityX(0);
  }

  // Movimento vertical
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  } else {
    player.body.setVelocityY(0);
  }

  // Verificar se está perto de uma escada
  checkStairInteraction(this);

  // Verificar se pressionou ESPAÇO perto de uma porta
  if (Phaser.Input.Keyboard.JustDown(interactKey)) {
    checkDoorInteraction(this);
    checkRoomExit(this);
  }

  // Atualizar texto de status
  updateStatus();
}

// ============================================
// VERIFICAR INTERAÇÃO COM ESCADAS
// ============================================
function checkStairInteraction(scene) {
  stairs.forEach((stair) => {
    // Só verifica escadas do andar atual
    if (stair.floor !== currentFloor) return;

    // Calcular distância entre jogador e escada
    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      stair.x,
      stair.y
    );

    // Se estiver perto (menos de 50 pixels) e pressionar ESPAÇO
    if (distance < 50 && Phaser.Input.Keyboard.JustDown(interactKey)) {
      // Subir se for escada para cima
      if (stair.direction === "up") {
        changeFloor(scene, currentFloor + 1);
      }
      // Descer se for escada para baixo
      else if (stair.direction === "down") {
        changeFloor(scene, currentFloor - 1);
      }
    }
  });
}

// ============================================
// VERIFICAR INTERAÇÃO COM PORTAS
// ============================================
function checkDoorInteraction(scene) {
  doors.forEach((door) => {
    // Só verifica portas do andar atual
    if (door.floor !== currentFloor) return;

    // Calcular distância entre jogador e porta
    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      door.x,
      door.y
    );

    // Se estiver perto (menos de 60 pixels)
    if (distance < 60) {
      const state = doorStates[door.id];

      if (state.locked) {
        // Porta trancada - mostrar mensagem de desafio
        showMessage(scene, `Porta trancada!\n${state.challenge}`);
      } else if (state.hasRoom) {
        // Porta aberta e tem sala - entrar na sala
        enterRoom(scene, door.id);
      } else {
        // Porta aberta mas sem sala
        showMessage(scene, "Porta aberta!");
      }
    }
  });
}

// ============================================
// ENTRAR EM UMA SALA
// ============================================
function enterRoom(scene, doorId) {
  if (rooms[doorId]) {
    // Esconder andar atual
    updateFloorVisibility(scene);
    floorGraphics.floor1.setVisible(false);
    floorGraphics.floor2.setVisible(false);
    floorGraphics.floor3.setVisible(false);

    // Mostrar sala
    rooms[doorId].setVisible(true);

    // Esconder jogador
    player.setVisible(false);

    // Marcar que está em uma sala
    player.inRoom = doorId;
  }
}

// ============================================
// SAIR DE UMA SALA
// ============================================
function checkRoomExit(scene) {
  if (player.inRoom && rooms[player.inRoom]) {
    // Esconder sala
    rooms[player.inRoom].setVisible(false);

    // Mostrar andar novamente
    updateFloorVisibility(scene);

    // Mostrar jogador
    player.setVisible(true);

    // Limpar flag
    player.inRoom = null;

    showMessage(scene, "Voltou ao corredor");
  }
}

// ============================================
// MUDAR DE ANDAR
// ============================================
function changeFloor(scene, newFloor) {
  // Verificar limites (andares 1 a 3)
  if (newFloor < 1 || newFloor > 3) return;

  currentFloor = newFloor;

  // MANTER a posição X e Y do jogador ao trocar de andar
  // Não reposicionar - o jogador mantém sua posição

  // Atualizar visibilidade dos andares
  updateFloorVisibility(scene);
  showMessage(scene, `Andar ${currentFloor}`);
}

// ============================================
// ATUALIZAR VISIBILIDADE DOS ANDARES
// ============================================
function updateFloorVisibility(scene) {
  // Mostrar apenas o andar atual
  floorGraphics.floor1.setVisible(currentFloor === 1);
  floorGraphics.floor2.setVisible(currentFloor === 2);
  floorGraphics.floor3.setVisible(currentFloor === 3);
}

// ============================================
// ATUALIZAR TEXTO DE STATUS
// ============================================
function updateStatus() {
  statusText.setText(`Andar: ${currentFloor}/3`);
}

// ============================================
// MOSTRAR MENSAGEM TEMPORÁRIA
// ============================================
function showMessage(scene, text) {
  // Criar texto no centro da tela
  const msg = scene.add
    .text(400, 300, text, {
      fontSize: "24px",
      fill: "#fff",
      backgroundColor: "#000",
      padding: { x: 20, y: 10 },
      align: "center",
    })
    .setOrigin(0.5);

  msg.setDepth(999); // Por cima de tudo

  // Fazer fade out em 2 segundos e depois destruir
  scene.tweens.add({
    targets: msg,
    alpha: 0,
    duration: 2000,
    ease: "Power2",
    onComplete: () => msg.destroy(),
  });
}
