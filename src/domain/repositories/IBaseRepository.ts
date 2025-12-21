export interface IFindItemsDataSet<T> {
  rows: T[];
  count: number;
}

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  findItemsByParams?(...args: any[]): Promise<IFindItemsDataSet<T>>;
}
