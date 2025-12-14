export const ASSET_PACK_KEYS = {
  MAIN: 'MAIN',
} as const;

export const ASSET_KEYS = {
  PLAYER: 'PLAYER',
  POT: 'POT',
  POT_BREAK: 'POT_BREAK',
  SPIDER: 'SPIDER',
  WISP: 'WISP',
  DROW: 'DROW',
  ZOMBIE: 'ZOMBIE',
  DAGGER: 'DAGGER',
  DUNGEON_1_BACKGROUND: 'DUNGEON_1_BACKGROUND',
  DUNGEON_1_FOREGROUND: 'DUNGEON_1_FOREGROUND',
  DUNGEON_1_LEVEL: 'DUNGEON_1_LEVEL',
  COLLISION: 'COLLISION',
  DUNGEON_OBJECTS: 'DUNGEON_OBJECTS',
  ENEMY_DEATH: 'ENEMY_DEATH',
  UI_DIALOG: 'UI_DIALOG',
  UI_ICONS: 'UI_ICONS',
  UI_CURSOR: 'UI_CURSOR',
  WORLD_BACKGROUND: 'WORLD_BACKGROUND',
  WORLD_FOREGROUND: 'WORLD_FOREGROUND',
  WORLD_LEVEL: 'WORLD_LEVEL',
  HUD_NUMBERS: 'HUD_NUMBERS',
  FONT_PRESS_START_2P: 'FONT_PRESS_START_2P',
} as const;

export const PLAYER_ANIMATION_KEYS = {
  WALK_DOWN: 'player_walk_down',
  WALK_UP: 'player_walk_up',
  WALK_SIDE: 'player_walk_side',
  IDLE_DOWN: 'player_idle_down',
  IDLE_UP: 'player_idle_up',
  IDLE_SIDE: 'player_idle_side',
  IDLE_HOLD_DOWN: 'player_hand_in_air_down',
  IDLE_HOLD_UP: 'player_hand_in_air_up',
  IDLE_HOLD_SIDE: 'player_hand_in_air_side',
  WALK_HOLD_DOWN: 'player_walk_hand_in_air_down',
  WALK_HOLD_UP: 'player_walk_hand_in_air_up',
  WALK_HOLD_SIDE: 'player_walk_hand_in_air_side',
  LIFT_DOWN: 'player_open_chest_down',
  LIFT_UP: 'player_open_chest_up',
  LIFT_SIDE: 'player_open_chest_side',
  HURT_DOWN: 'player_hit_down',
  HURT_UP: 'player_hit_up',
  HURT_SIDE: 'player_hit_side',
  DIE_DOWN: 'player_die_down',
  DIE_UP: 'player_die_up',
  DIE_SIDE: 'player_die_side',
  SWORD_1_ATTACK_DOWN: 'player_atk_1_down',
  SWORD_1_ATTACK_UP: 'player_atk_1_up',
  SWORD_1_ATTACK_SIDE: 'player_atk_1_side',
} as const;

export const SPIDER_ANIMATION_KEYS = {
  WALK: 'spider_walk',
  HIT: 'spider_hit',
  DEATH: ASSET_KEYS.ENEMY_DEATH,
} as const;

export const ZOMBIE_ANIMATION_KEYS = {
  WALK: 'zombie_walk',
  IDLE: 'zombie_idle',
  HIT: 'zombie_hit',
  DEATH: 'zombie_death',
} as const;

export const DROW_ANIMATION_KEYS = {
  WALK_DOWN: 'drow_walk_down',
  WALK_UP: 'drow_walk_up',
  WALK_LEFT: 'drow_walk_left',
  WALK_RIGHT: 'drow_walk_right',
  IDLE_DOWN: 'drow_idle_down',
  IDLE_UP: 'drow_idle_up',
  IDLE_SIDE: 'drow_idle_right',
  HIT: 'drow_hit',
  ATTACK_DOWN: 'drow_atk_down',
  ATTACK_UP: 'drow_atk_up',
  ATTACK_SIDE: 'drow_atk_right',
} as const;

export const WISP_ANIMATION_KEYS = {
  IDLE: 'wisp_idle',
} as const;

export const CHARACTER_ANIMATIONS = {
  IDLE_DOWN: 'IDLE_DOWN',
  IDLE_UP: 'IDLE_UP',
  IDLE_LEFT: 'IDLE_LEFT',
  IDLE_RIGHT: 'IDLE_RIGHT',
  WALK_DOWN: 'WALK_DOWN',
  WALK_UP: 'WALK_UP',
  WALK_LEFT: 'WALK_LEFT',
  WALK_RIGHT: 'WALK_RIGHT',
  IDLE_HOLD_DOWN: 'IDLE_HOLD_DOWN',
  IDLE_HOLD_UP: 'IDLE_HOLD_UP',
  IDLE_HOLD_LEFT: 'IDLE_HOLD_LEFT',
  IDLE_HOLD_RIGHT: 'IDLE_HOLD_RIGHT',
  WALK_HOLD_DOWN: 'WALK_HOLD_DOWN',
  WALK_HOLD_UP: 'WALK_HOLD_UP',
  WALK_HOLD_LEFT: 'WALK_HOLD_LEFT',
  WALK_HOLD_RIGHT: 'WALK_HOLD_RIGHT',
  LIFT_DOWN: 'LIFT_DOWN',
  LIFT_UP: 'LIFT_UP',
  LIFT_LEFT: 'LIFT_LEFT',
  LIFT_RIGHT: 'LIFT_RIGHT',
  HURT_DOWN: 'HURT_DOWN',
  HURT_UP: 'HURT_UP',
  HURT_LEFT: 'HURT_LEFT',
  HURT_RIGHT: 'HURT_RIGHT',
  DIE_DOWN: 'DIE_DOWN',
  DIE_UP: 'DIE_UP',
  DIE_LEFT: 'DIE_LEFT',
  DIE_RIGHT: 'DIE_RIGHT',
} as const;

export const CHEST_FRAME_KEYS = {
  BIG_CHEST_CLOSED: 'big_chest_closed.png',
  SMALL_CHEST_CLOSED: 'chest_closed.png',
  BIG_CHEST_OPEN: 'big_chest_open.png',
  SMALL_CHEST_OPEN: 'chest_open.png',
} as const;

export const DOOR_FRAME_KEYS = {
  TRAP_LEFT: 'trap_left.png',
  TRAP_RIGHT: 'trap_right.png',
  TRAP_UP: 'trap_up.png',
  TRAP_DOWN: 'trap_down.png',
  BOSS_LEFT: 'boss_left.png',
  BOSS_RIGHT: 'boss_right.png',
  BOSS_UP: 'boss_up.png',
  BOSS_DOWN: 'boss_down.png',
  LOCK_LEFT: 'lock_left.png',
  LOCK_RIGHT: 'lock_right.png',
  LOCK_UP: 'lock_up.png',
  LOCK_DOWN: 'lock_down.png',
} as const;

export const BUTTON_FRAME_KEYS = {
  FLOOR_SWITCH: 'floor_switch.png',
  PLATE_SWITCH: 'plate_switch.png',
} as const;

export const CHEST_REWARD_TO_TEXTURE_FRAME = {
  SMALL_KEY: 119,
  BOSS_KEY: 121,
  MAP: 117,
  COMPASS: 118,
  NOTHING: 126,
} as const;

export const HEART_ANIMATIONS = {
  LOSE_LAST_HALF: 'heart_lose_last_half',
  LOSE_FIRST_HALF: 'heart_lost_first_half',
};

export const HEART_TEXTURE_FRAME = {
  NONE: '15',
  FULL: '10',
  EMPTY: '14',
  HALF: '12',
} as const;
