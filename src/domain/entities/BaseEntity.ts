import { randomUUID } from "crypto";

export interface IBaseEntity {
  id: string;
  addEvent(event: any): void;
  getEvents(): any[];
}

export class BaseEntity implements IBaseEntity {
  public id = "";
  protected events: any[] = [];

  public addEvent(event: any): void {
    this.events.push(event);
  }

  getEvents(): any[] {
    return this.events;
  }

  static generateId(): string {
    return randomUUID();
  }
}
