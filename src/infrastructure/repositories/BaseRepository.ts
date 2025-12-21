import { db } from "../../database";

export abstract class BaseRepository {
  protected get db() {
    return db;
  }
}
