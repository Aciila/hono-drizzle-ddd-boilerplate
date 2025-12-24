import { BaseEntity } from "./BaseEntity";

// =============================================================================
// User Entity
// =============================================================================
//
// Domain entity containing business logic and validation.
// Independent of database structure and framework.

export interface IUserProps {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export class User extends BaseEntity {
  private _email: string;
  private _name: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date | null;

  constructor(props: IUserProps) {
    super();
    this.id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Business Logic
  // ---------------------------------------------------------------------------

  updateName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    this._name = newName.trim();
  }

  updateEmail(newEmail: string): void {
    if (!newEmail || !newEmail.includes("@")) {
      throw new Error("Invalid email format");
    }
    this._email = newEmail.toLowerCase();
  }

  deactivate(): void {
    this._isActive = false;
  }

  activate(): void {
    this._isActive = true;
  }

  // ---------------------------------------------------------------------------
  // Factory Method
  // ---------------------------------------------------------------------------

  static create(email: string, name: string): User {
    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    return new User({
      id: BaseEntity.generateId(),
      email: email.toLowerCase(),
      name: name.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: null,
    });
  }
}
