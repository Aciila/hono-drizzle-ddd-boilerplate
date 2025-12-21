import { BaseEntity } from "../src/domain/entities/BaseEntity";

export interface IUserProps {
  id: string;
  email: string;
  name: string;
}

export class User extends BaseEntity {
  private _email: string;
  private _name: string;

  constructor(props: IUserProps) {
    super();
    this.id = props.id;
    this._email = props.email;
    this._name = props.name;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this._name = newName;
  }

  static create(email: string, name: string): User {
    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    return new User({
      id: BaseEntity.generateId(),
      email,
      name,
    });
  }
}
