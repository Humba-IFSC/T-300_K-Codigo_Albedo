import { GameObject } from "../../common/types";
import { InputComponents } from "../input/input-components";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class ControlsComponent extends BaseGameObjectComponent {
  #inputComponent: InputComponents

  constructor(gameObject:GameObject, inputComponent: InputComponents) {
    super(gameObject)
    this.#inputComponent = inputComponent;
  }

  get controls(): InputComponents {
    return this.#inputComponent;
  }
}