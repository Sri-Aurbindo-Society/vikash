export default interface BaseRepository<T> {
  getAllRecords(item: T): Promise<T[]>;
  getRecordById(id: string): Promise<T>;
  delete(id: string): Promise<boolean>;
  createRecord(item: T): Promise<boolean>;
  updateRecord(id: string, item: T): Promise<boolean>;
  activate(id: string): Promise<boolean>;
  deactivate(id: string): Promise<boolean>;
}
