import { Observable } from "rxjs";
import { IDIService } from "../di/di-service.interface";

export interface IStore<T> extends IDIService {
  state$: Observable<T>;
  getSnapshot(): T;
}
