import * as Phaser from 'phaser';
import { Direction, Position } from "../../common/types";
import { InputComponents } from '../../components/input/input-components';
import { IdleState } from '../../components/state-machine/states/character/idle-state';
import { CHARACTER_STATES } from '../../components/state-machine/states/character/character-states';
import { MoveState } from '../../components/state-machine/states/character/move-state';
import { ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MAX, ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MIN, ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_WAIT, ENEMY_ZOMBIE_MAX_HEALTH, ENEMY_ZOMBIE_PUSH_BACK_SPEED, ENEMY_ZOMBIE_SPEED, ENEMY_ZOMBIE_INVULNERABLE_AFTER_HIT_DURATION, ENEMY_ZOMBIE_CHASE_RADIUS } from '../../common/config';
import { AnimationConfig } from '../../components/game.object/animation-component';
import { ASSET_KEYS, ZOMBIE_ANIMATION_KEYS } from '../../common/assets';
import { CharacterGameObject } from '../common/character-game-object';
import { DIRECTION } from '../../common/commom';
import { exhaustiveGuard } from '../../common/utils';
import { HurtState } from '../../components/state-machine/states/character/hurt-state';
import { DeathState } from '../../components/state-machine/states/character/death-state';

export type ZombieConfig = {
    scene: Phaser.Scene;
    position: Position;
    target?: CharacterGameObject;
    // when true the zombie will be created but won't start moving/following until `startAI()` is called
    startDisabled?: boolean;
};

export class Zombie extends CharacterGameObject {
    #target?: CharacterGameObject;
    #aiEnabled: boolean;
    #timers: Phaser.Time.TimerEvent[] = [];
    constructor(config: ZombieConfig) {
        // create animation config for component
        const walkAnim = { key: ZOMBIE_ANIMATION_KEYS.WALK, repeat: -1, ignoreIfPlaying: true }
    // use idle animation for hurt visual (user's spritesheet doesn't have a dedicated hurt set)
    const hurtAnim = { key: ZOMBIE_ANIMATION_KEYS.IDLE, repeat: 0, ignoreIfPlaying: true }
        const deathAnim = { key: ZOMBIE_ANIMATION_KEYS.DEATH, repeat: 0, ignoreIfPlaying: true }
        const animationConfig: AnimationConfig = {
            WALK_DOWN: walkAnim,
            WALK_UP: walkAnim,
            WALK_LEFT: walkAnim,
            WALK_RIGHT: walkAnim,
        IDLE_DOWN: { key: ZOMBIE_ANIMATION_KEYS.IDLE, repeat: -1, ignoreIfPlaying: true },
        IDLE_UP: { key: ZOMBIE_ANIMATION_KEYS.IDLE, repeat: -1, ignoreIfPlaying: true },
        IDLE_LEFT: { key: ZOMBIE_ANIMATION_KEYS.IDLE, repeat: -1, ignoreIfPlaying: true },
        IDLE_RIGHT: { key: ZOMBIE_ANIMATION_KEYS.IDLE, repeat: -1, ignoreIfPlaying: true },
            HURT_DOWN: hurtAnim,
            HURT_UP: hurtAnim,
            HURT_LEFT: hurtAnim,
            HURT_RIGHT: hurtAnim,
            DIE_DOWN: deathAnim,
            DIE_UP: deathAnim,
            DIE_LEFT: deathAnim,
            DIE_RIGHT: deathAnim,
        };

        super({
            scene: config.scene,
            position: config.position,
            assetKey: ASSET_KEYS.ZOMBIE,
            frame: 0,
            id: `zombie-${Phaser.Math.RND.uuid()}`,
            isPlayer: false,
            animationConfig,
            speed: ENEMY_ZOMBIE_SPEED,
            InputComponent: new InputComponents(),
            isInvulnerable: false,
            invulnerableAfterHitAnimationDuration: ENEMY_ZOMBIE_INVULNERABLE_AFTER_HIT_DURATION,
            maxLife: ENEMY_ZOMBIE_MAX_HEALTH,
        });

        // when direction changes, rotate sprite to visually indicate facing
        this._directionComponent.callback = (direction: Direction) => {
            this.#handleDirectionChange(direction);
        }

        // add state machine states
        this._stateMachine.addState(new IdleState(this));
        this._stateMachine.addState(new MoveState(this));
        this._stateMachine.addState(new HurtState(this, ENEMY_ZOMBIE_PUSH_BACK_SPEED));
        this._stateMachine.addState(new DeathState(this));
        this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

        // save optional target (player) for follow AI
        this.#target = config.target;

        // AI enabled by default unless explicitly created disabled (for emergence/spawn effect)
        this.#aiEnabled = !config.startDisabled;

        if (this.#aiEnabled) {
            this.#enableAI();
        }

        // ensure timers and event listeners are cleaned when the object is destroyed
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.#cleanup();
        });
    }

    // enable follow/patrol AI (call this after an emergence delay)
    public startAI(): void {
                if (this.#aiEnabled) return;
                // make sure the zombie still belongs to a scene (it may have been destroyed)
                if (!this.scene) return;
                if (!this.active) return;
                this.#aiEnabled = true;
                this.#enableAI();
        // make sure the object is not invulnerable anymore when AI starts
        try {
          this._invulnerableComponent.invulnerable = false;
        } catch (e) {
          // ignore if component missing
        }
    }

    // internal helper to wire subscriptions/timers for AI behavior
    #enableAI(): void {
        if (this.#target) {
            // subscribe to scene update to follow the target each frame
            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.#followTarget, this);
        } else {
            // fallback to simple horizontal patrol (left / right)
            const t = this.scene.time.addEvent({
                delay: Phaser.Math.Between(ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MIN, ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MAX),
                callback: this.#changeDirection,
                callbackScope: this,
                loop: false,
            });
            this.#timers.push(t);
        }
    }

    #followTarget(): void {
        if (!this.#target || this.isDefeated) {
            return;
        }
        // simple pursuit: set controls flags based on relative position to target
        const dx = this.#target.x - this.x;
        const dy = this.#target.y - this.y;

        // if target is too far, stop chasing and go to idle
        const distance = Math.hypot(dx, dy);
        if (distance > ENEMY_ZOMBIE_CHASE_RADIUS) {
            this.controls.reset();
            this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
            return;
        }

        // small dead zone so the zombie doesn't jitter when very close
        const DEAD_ZONE = 12;

        // reset existing input
        this.controls.reset();

        if (Math.abs(dx) > DEAD_ZONE) {
            if (dx < 0) {
                this.controls.isLeftDown = true;
            } else {
                this.controls.isRightDown = true;
            }
        }

        if (Math.abs(dy) > DEAD_ZONE) {
            if (dy < 0) {
                this.controls.isUpDown = true;
            } else {
                this.controls.isDownDown = true;
            }
        }
    }

    #handleDirectionChange(direction: Direction): void {
        // Don't rotate the zombie sprite. Use flipX for left/right like the player
        switch (direction) {
            case DIRECTION.DOWN:
                // no flip change for vertical
                break;
            case DIRECTION.UP:
                // no flip change for vertical
                break;
            case DIRECTION.LEFT:
                this.setFlipX(true);
                break;
            case DIRECTION.RIGHT:
                this.setFlipX(false);
                break;
            default:
                exhaustiveGuard(direction);
        }
    }

    #changeDirection(): void {
        // reset existing enemy input
        this.controls.reset();

        // wait a small period of time and then choose left or right direction to move
        const delayed = this.scene.time.delayedCall(ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_WAIT, () => {
            const randomDirection = Phaser.Math.Between(0, 1);
            if (randomDirection === 0) {
                this.controls.isLeftDown = true;
            } else {
                this.controls.isRightDown = true;
            }

            // set up event for next direction change
            const t = this.scene.time.addEvent({
                delay: Phaser.Math.Between(ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MIN, ENEMY_ZOMBIE_CHANGE_DIRECTION_DELAY_MAX),
                callback: this.#changeDirection,
                callbackScope: this,
                loop: false,
            });
            this.#timers.push(t);
        });
        this.#timers.push(delayed);
    }

    // cleanup timers and event listeners
    #cleanup(): void {
        try {
            if (this.scene) {
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.#followTarget, this);
            }
        } catch (e) {
            // ignore
        }

        // destroy any pending timers
        for (const t of this.#timers) {
            try {
                // TimerEvent has a destroy method in Phaser; use it if available
                if ((t as any).destroy) {
                    (t as any).destroy();
                } else if ((t as any).remove) {
                    (t as any).remove(false);
                }
            } catch (e) {
                // ignore
            }
        }
        this.#timers.length = 0;
    }
}
