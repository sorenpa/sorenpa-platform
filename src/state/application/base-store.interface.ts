import { Observable } from "rxjs";

export interface IBaseStore<T> {
  store$(): Observable<T>;
  getSnapshot(): T;
}
