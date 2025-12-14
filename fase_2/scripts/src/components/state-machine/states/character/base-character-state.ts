import { CharacterGameObject } from "../../../../game-objects/common/character-game-object";
import { State, StateMachine } from "../../state-machine";

export abstract class BaseCharacterState implements State {
  protected _gameObject: CharacterGameObject;
  protected _stateMachine!: StateMachine;
  #name: string;

  constructor(name: string, gameObject: CharacterGameObject) {
    this.#name = name;
    this._gameObject = gameObject;
  }

  get name(): string {
    return this.#name;
  }

  set stateMachine(stateMachine: StateMachine) {
    this._stateMachine = stateMachine;
  }
}