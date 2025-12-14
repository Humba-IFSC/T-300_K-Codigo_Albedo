import * as Phaser from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { ASSET_KEYS } from '../common/assets';
import { Player } from '../game-objects/player/player';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { Spider } from '../game-objects/enemies/spider';
import { Zombie } from '../game-objects/enemies/zombie';
import { Wisp } from '../game-objects/enemies/wisp';
import { CharacterGameObject } from '../game-objects/common/character-game-object';
import { DIRECTION } from '../common/commom';
import { PLAYER_START_MAX_HEALTH } from '../common/config';

export class GameScene extends Phaser.Scene {
  #controls!: KeyboardComponent;
  #player!: Player;
  #enemyGroup!: Phaser.GameObjects.Group
  #doorRects: Phaser.Geom.Rectangle[] = [];
  #playerHiddenInHole = false;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  // update loop: check whether player is inside a door/hole and hide/unhide accordingly
  public update(): void {
    if (!this.#player) return;

    // depth sorting by Y: make player and enemies depth = their y so they render in front/behind correctly
    try {
      (this.#player as any).setDepth(this.#player.y);
    } catch (e) {}
    this.#enemyGroup?.getChildren().forEach((c) => {
      try { (c as any).setDepth((c as any).y); } catch (e) {}
    });

    const playerPoint = new Phaser.Geom.Point(this.#player.x, this.#player.y);
    const inside = this.#doorRects.some((r) => Phaser.Geom.Rectangle.ContainsPoint(r, playerPoint));

    if (inside && !this.#playerHiddenInHole) {
      // hide player and disable collisions so it "disappears" in the hole
      try {
        (this.#player as any).setVisible(false);
        (this.#player as any).disableObject();
      } catch (e) {}
      this.#playerHiddenInHole = true;
    } else if (!inside && this.#playerHiddenInHole) {
      // player left the hole, restore
      try {
        (this.#player as any).setVisible(true);
        (this.#player as any).enableObject();
      } catch (e) {}
      this.#playerHiddenInHole = false;
    }
  }

  public create(): void {
    if (!this.input.keyboard) {
      console.warn('Phaser keyboard plugin is not setup properly');
      return;
    }

    this.#controls = new KeyboardComponent(this.input.keyboard);

    // Try to read the tiled map JSON early so we can size the world to the actual map
    let mapData: any = null;
    try {
      const mapCache = this.cache.tilemap.get(ASSET_KEYS.WORLD_LEVEL);
      mapData = mapCache && (mapCache as any).data ? (mapCache as any).data : null;
    } catch (err) {
      mapData = null;
    }

    // compute world bounds from map data (support infinite maps via chunks)
    let WORLD_MIN_X = 0;
    let WORLD_MIN_Y = 0;
    let WORLD_WIDTH = 1536; // fallback
    let WORLD_HEIGHT = 768; // fallback

    if (mapData) {
      const tileWidth = mapData.tilewidth || 16;
      const tileHeight = mapData.tileheight || 16;

      let minTileX = Number.POSITIVE_INFINITY;
      let minTileY = Number.POSITIVE_INFINITY;
      let maxTileX = Number.NEGATIVE_INFINITY;
      let maxTileY = Number.NEGATIVE_INFINITY;

      const scanLayer = (layer: any) => {
        if (!layer) return;
        if (layer.type === 'tilelayer') {
          const chunks = (layer.chunks && layer.chunks.length) ? layer.chunks : [{ x: 0, y: 0, width: layer.width || mapData.width || 0, height: layer.height || mapData.height || 0 }];
          for (const chunk of chunks) {
            minTileX = Math.min(minTileX, chunk.x);
            minTileY = Math.min(minTileY, chunk.y);
            maxTileX = Math.max(maxTileX, chunk.x + (chunk.width || 0));
            maxTileY = Math.max(maxTileY, chunk.y + (chunk.height || 0));
          }
        } else if (layer.type === 'group' && Array.isArray(layer.layers)) {
          for (const l of layer.layers) scanLayer(l);
        }
      };

      for (const layer of mapData.layers) scanLayer(layer);

      if (minTileX !== Number.POSITIVE_INFINITY && maxTileX !== Number.NEGATIVE_INFINITY) {
        WORLD_MIN_X = minTileX * tileWidth;
        WORLD_MIN_Y = minTileY * tileHeight;
        WORLD_WIDTH = Math.max(1, (maxTileX - minTileX) * tileWidth);
        WORLD_HEIGHT = Math.max(1, (maxTileY - minTileY) * tileHeight);
      }
    }

    // add a tiled background that fills the computed world bounds
    const bg = this.add.tileSprite(WORLD_MIN_X, WORLD_MIN_Y, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.WORLD_BACKGROUND).setOrigin(0);

    // add HUD text (keeps relative position on screen)
    this.add
      .text(this.scale.width / 2, 32, 'Games do HUMBA', { fontFamily: ASSET_KEYS.FONT_PRESS_START_2P })
      .setOrigin(0.5);

    // choose a sensible spawn point: prefer the first 'room' object if present, otherwise center of map
    let spawnX = Math.floor(WORLD_MIN_X + WORLD_WIDTH / 2);
    let spawnY = Math.floor(WORLD_MIN_Y + WORLD_HEIGHT / 2);
    if (mapData) {
      const findRoom = (layers: any[]): any | null => {
        for (const layer of layers) {
          if (!layer) continue;
          if (layer.type === 'objectgroup') {
            const objs = layer.objects || [];
            for (const o of objs) {
              if (o.type === 'room' || (o.properties && o.properties.find((p: any) => p.name === 'id' && p.value))) {
                return o;
              }
            }
          } else if (layer.type === 'group' && Array.isArray(layer.layers)) {
            const found = findRoom(layer.layers);
            if (found) return found;
          }
        }
        return null;
      };

      const room = findRoom(mapData.layers || []);
      if (room) {
        // Tiled generally uses top-left (x,y) for rectangles — compute center
        const rx = room.x || 0;
        const ry = room.y || 0;
        const rw = room.width || 0;
        const rh = room.height || 0;
        spawnX = Math.floor(rx + rw / 2);
        spawnY = Math.floor(ry + rh / 2);
      }
    }

    // create player at chosen spawn
    this.#player = new Player({
      scene: this,
      position: { x: spawnX, y: spawnY },
      controls: this.#controls,
      maxLife: PLAYER_START_MAX_HEALTH,
      currentLife: PLAYER_START_MAX_HEALTH,
    });

    // keep player inside the world bounds
    this.#player.setCollideWorldBounds(true);

    // configure physics world and camera bounds to match the map bounds
    this.physics.world.setBounds(WORLD_MIN_X, WORLD_MIN_Y, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(WORLD_MIN_X, WORLD_MIN_Y, WORLD_WIDTH, WORLD_HEIGHT);
    // make the camera follow the player with a little smoothing
    this.cameras.main.startFollow(this.#player, true, 0.12, 0.12);

    this.#enemyGroup = this.add.group([
      new Spider({
        scene: this,
        position: { x: this.scale.width / 2, y: this.scale.height / 2 + 50 },
      }),
      new Zombie({
        scene: this,
        position: { x: this.scale.width / 2 - 70, y: this.scale.height / 2 + 20 },
        target: this.#player,
      }),
      new Wisp({
        scene: this,
        position: { x: this.scale.width / 2, y: this.scale.height / 2 - 50 },
      }),
    ],
    {
      runChildUpdate: true,
    },
    );

    // enable collisions between enemies so they don't stack on top of each other
    // this will automatically separate overlapping bodies handled by Arcade physics
    this.physics.add.collider(this.#enemyGroup, this.#enemyGroup);

    // configure initial physics body tweaks for existing children
    this.#enemyGroup.getChildren().forEach((child) => {
      const enemy = child as Phaser.GameObjects.GameObject & { body?: Phaser.Physics.Arcade.Body };
      if (enemy.body) {
        enemy.body.setBounce(0.1);
        enemy.body.setCollideWorldBounds(true);
      }
    });

    // Periodically attempt to spawn more zombies. Each attempt has a chance to spawn near the player
    // so it looks like the zombie "appeared from the ground". We use a short tween to fade/scale them in
    // (visual effect only — no sprite spawn frames required).
    const SPAWN_INTERVAL_MS = 4000;
  // lowered spawn chance so zombies don't constantly appear near the player
  const CHANCE_SPAWN_NEAR_PLAYER = 0.12;

    this.time.addEvent({
      delay: SPAWN_INTERVAL_MS,
      loop: true,
      callback: () => this.spawnZombie(CHANCE_SPAWN_NEAR_PLAYER),
    });

    // attempt to read the tiled map JSON from the cache and create wall colliders + door areas
    try {
      const mapCache = this.cache.tilemap.get(ASSET_KEYS.WORLD_LEVEL);
      const mapData = mapCache && (mapCache as any).data ? (mapCache as any).data : null;
      if (mapData && mapData.layers) {
        const tileWidth = mapData.tilewidth || 16;
        const tileHeight = mapData.tileheight || 16;

        // create a static group for walls
        const walls = this.physics.add.staticGroup();

        // first pass: collect door rectangles from object layers so we can skip wall tiles that overlap doors
        for (const layer of mapData.layers) {
          if (layer.type === 'objectgroup') {
            const objects = layer.objects || [];
            for (const obj of objects) {
              const isDoor = obj.type === 'door' || (obj.properties && obj.properties.find((p: any) => p.name === 'isLevelTransition' && p.value === true));
              if (isDoor) {
                const rx = obj.x || 0;
                const ry = obj.y || 0;
                const rw = obj.width || tileWidth;
                const rh = obj.height || tileHeight;
                // Tiled y is typically the bottom of the object; convert to top-left
                const rect = new Phaser.Geom.Rectangle(rx, ry - rh, rw, rh);
                this.#doorRects.push(rect);
              }
            }
          }
        }

        // second pass: create wall tiles but skip those overlapping door rects
        // collect all collision tile coords first (cx,cy) then filter duplicates so we keep the right-most tile
        const tilePositions = new Set<string>();
        for (const layer of mapData.layers) {
          if (layer.type === 'tilelayer' && (layer.name === 'collision' || layer.properties?.find?.((p: any) => p.name === 'collision'))) {
            const chunks = (layer.chunks && layer.chunks.length) ? layer.chunks : [{ x: 0, y: 0, data: layer.data, width: layer.width, height: layer.height }];
            for (const chunk of chunks) {
              const data: number[] = chunk.data || [];
              const w = chunk.width;
              for (let i = 0; i < data.length; i++) {
                const gid = data[i];
                if (gid && gid !== 0) {
                  const cx = chunk.x + (i % w);
                  const cy = chunk.y + Math.floor(i / w);
                  tilePositions.add(`${cx},${cy}`);
                }
              }
            }
          }
        }

        // now add tiles but skip left column tiles if there is another tile immediately to the right
        for (const key of Array.from(tilePositions)) {
          const [cxStr, cyStr] = key.split(',');
          const cx = parseInt(cxStr, 10);
          const cy = parseInt(cyStr, 10);
          // if there is a tile to the right (cx+1, cy), skip this one so we keep the right-most barrier
          if (tilePositions.has(`${cx + 1},${cy}`)) continue;

          const x = cx * tileWidth + tileWidth / 2;
          const y = cy * tileHeight + tileHeight / 2;
          const tileRect = new Phaser.Geom.Rectangle(x - tileWidth / 2, y - tileHeight / 2, tileWidth, tileHeight);
          const overlapsDoor = this.#doorRects.some((dr) => Phaser.Geom.Rectangle.Overlaps(dr, tileRect));
          if (overlapsDoor) continue;

          const rect = this.add.rectangle(x, y, tileWidth, tileHeight, 0x000000, 0);
          try {
            this.physics.add.existing(rect, true);
            const b = rect.body as Phaser.Physics.Arcade.StaticBody;
            if (b) {
              b.setSize(tileWidth, tileHeight);
              b.setOffset(-tileWidth / 2, -tileHeight / 2);
            }
          } catch (err) {}
          walls.add(rect);
        }

        // player should collide with walls
        this.physics.add.collider(this.#player, walls);
        // enemies should also collide with walls
        this.physics.add.collider(this.#enemyGroup, walls);
      }
    } catch (e) {
      // ignore gracefully if map is not present or parsing fails
    }

    // periodically clean up far-away zombies so the game doesn't keep too many active objects
    const DESPAWN_CHECK_INTERVAL_MS = 5000; // check every 5s
    const DESPAWN_DISTANCE = 300; // px; if zombie is farther than this from player, despawn it

    this.time.addEvent({
      delay: DESPAWN_CHECK_INTERVAL_MS,
      loop: true,
      callback: () => {
        const toRemove: Phaser.GameObjects.GameObject[] = [];
        this.#enemyGroup.getChildren().forEach((child) => {
          const enemy = child as Phaser.GameObjects.Sprite & { x: number; y: number };
          const dist = Phaser.Math.Distance.Between(this.#player.x, this.#player.y, enemy.x, enemy.y);
          if (dist > DESPAWN_DISTANCE) {
            toRemove.push(enemy);
          }
        });

        // fade & remove
        toRemove.forEach((enemy) => {
          this.tweens.add({
            targets: enemy,
            alpha: 0,
            scaleY: 0.2,
            ease: 'Cubic.easeIn',
            duration: 300,
            onComplete: () => {
              // remove from the group and destroy
              try {
                this.#enemyGroup.remove(enemy, true, true);
              } catch (e) {
                // fallback: destroy directly
                (enemy as any).destroy?.();
              }
            },
          });
        });
      },
    });

  this.#registerColliders();
  }

  #registerColliders(): void {
    this.#enemyGroup.getChildren().forEach((enemy) => {
      const enemyGameObject = enemy as CharacterGameObject;
      enemyGameObject.setCollideWorldBounds(true);
    });

    this.physics.add.overlap(this.#player, this.#enemyGroup, (player, enemy) => {
      this.#player.hit(DIRECTION.DOWN, 1)
      const enemyGameObject = enemy as CharacterGameObject;
      enemyGameObject.hit(this.#player.direction, 1);
    });
  }

  // spawn a zombie; with `nearChance` probability it will appear near the player
  private spawnZombie(nearChance: number): void {
    const MAX_ZOMBIES = 3;
    // simple limit so we don't flood the world
    if (this.#enemyGroup.getLength() >= MAX_ZOMBIES) return;

    let x: number;
    let y: number;

  if (Math.random() < nearChance) {
      // spawn near player (but not on top) — random angle & distance
      const minDist = 64;
      const maxDist = 140;
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(minDist, maxDist);
      x = this.#player.x + Math.cos(angle) * dist;
      y = this.#player.y + Math.sin(angle) * dist;
      // clamp to world bounds
      const b = this.physics.world.bounds;
      x = Phaser.Math.Clamp(x, b.x + 16, b.x + b.width - 16);
      y = Phaser.Math.Clamp(y, b.y + 16, b.y + b.height - 16);
  } else {
      // spawn anywhere in world bounds
      const b = this.physics.world.bounds;
      x = Phaser.Math.Between(b.x + 16, Math.max(b.x + 16, b.x + b.width - 16));
      y = Phaser.Math.Between(b.y + 16, Math.max(b.y + 16, b.y + b.height - 16));
    }

    // try to avoid spawning on top of other enemies. attempt a few times to find a separated spot
    const MIN_SPAWN_SEPARATION = 28; // px
    const MAX_SPAWN_ATTEMPTS = 6;
    let attempts = 0;
    const isTooClose = (cx: number, cy: number) => {
      return this.#enemyGroup.getChildren().some((child) => {
        const c = child as Phaser.GameObjects.Sprite & { x: number; y: number };
        const d = Phaser.Math.Distance.Between(cx, cy, c.x, c.y);
        return d < MIN_SPAWN_SEPARATION;
      });
    };

    while (attempts < MAX_SPAWN_ATTEMPTS && isTooClose(x, y)) {
      attempts += 1;
      if (Math.random() < nearChance) {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist = Phaser.Math.Between(64, 140);
        x = this.#player.x + Math.cos(angle) * dist;
        y = this.#player.y + Math.sin(angle) * dist;
        const b = this.physics.world.bounds;
        x = Phaser.Math.Clamp(x, b.x + 16, b.x + b.width - 16);
        y = Phaser.Math.Clamp(y, b.y + 16, b.y + b.height - 16);
      } else {
        const b = this.physics.world.bounds;
        x = Phaser.Math.Between(b.x + 16, Math.max(b.x + 16, b.x + b.width - 16));
        y = Phaser.Math.Between(b.y + 16, Math.max(b.y + 16, b.y + b.height - 16));
      }
    }

    if (isTooClose(x, y)) {
      // couldn't find a free spot, skip this spawn attempt
      return;
    }

    // create zombie in a disabled AI state so it can "emerge" from the ground
    const EMERGE_DELAY_MS = 700; // how long the zombie waits before starting to move
    const zombie = new Zombie({ scene: this, position: { x, y }, target: this.#player, startDisabled: true });
    // Add to group so collisions/updates include it
    this.#enemyGroup.add(zombie);


    // make it temporarily invulnerable while emerging
    try {
      zombie.invulnerableComponent.invulnerable = true;
    } catch (e) {
      // ignore if component missing
    }

    // make it appear from the ground using a short timeline so it looks like the zombie
    // is rising from the soil, then settles and starts AI.
    const spawnY = zombie.y;
    zombie.y = spawnY + 12; // start slightly below ground
    zombie.setAlpha(0);
    zombie.setScale(1, 0.2);
    zombie.setCollideWorldBounds(true);

    // ensure the physics body won't be zero-sized and set some separation behaviour
    const body = (zombie.body as Phaser.Physics.Arcade.Body | undefined);
    if (body) {
      body.setSize(12, 16, true);
      body.setBounce(0.08);
      body.setCollideWorldBounds(true);
    }

    // Phaser build here doesn't expose a .timeline helper; chain tweens instead
    this.tweens.add({
      targets: zombie,
      y: spawnY - 4,
      alpha: 1,
      scaleY: 1,
      ease: 'Cubic.easeOut',
      duration: 320,
      onComplete: () => {
        this.tweens.add({
          targets: zombie,
          y: spawnY,
          ease: 'Quad.easeIn',
          duration: 140,
          onComplete: () => {
            // small settle bounce effect and then enable AI after EMERGE_DELAY_MS
            this.tweens.add({
              targets: zombie,
              y: spawnY - 2,
              duration: 80,
              yoyo: true,
              ease: 'Sine.easeOut',
              onComplete: () => {
                this.time.delayedCall(EMERGE_DELAY_MS, () => {
                      // remove any temporary tint and start AI only if the zombie still exists
                      try { zombie.clearTint(); } catch (e) {}
                      try {
                        if (zombie && (zombie as any).scene && zombie.active) {
                          zombie.startAI();
                        }
                      } catch (err) {
                        // ignore — zombie was destroyed or out of scope
                      }
                    });
              },
            });
          }
        });
      }
    });
  }
}
