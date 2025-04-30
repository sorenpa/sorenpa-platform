import { Observable } from "rxjs";

export interface IBaseStore<T> {
  state$: Observable<T>;
  getSnapshot(): T;
}
