import { GameObject } from "../../common/types";
import { InputComponents } from "../input/input-components";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class LifeComponent extends BaseGameObjectComponent {
  #maxLife: number;
  #currentLife: number;

  constructor(gameObject:GameObject, maxLife: number, currentLife = maxLife) {
    super(gameObject);
    this.#maxLife = maxLife;
    this.#currentLife = currentLife
  }

  get life(): number {
    return this.#currentLife;
  }

  get maxLife(): number {
    return this.#maxLife;
  }

  public takeDamage(damage: number): void {
    if (this.#currentLife === 0) {
      return;
    }
    this.#currentLife -= damage;
    if (this.#currentLife < 0) {
      this.#currentLife = 0;
    }
  }
}