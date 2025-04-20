import { Observable } from "rxjs";
import { AsyncStatus, AsyncStoreError } from "src/state/domain";
import { IBaseStore } from "src/state/application";

export interface IAsyncStore<T> extends IBaseStore<T | null> {
  status$(): Observable<AsyncStatus>;
  loading$(): Observable<boolean>;
  error$(): Observable<AsyncStoreError | null>;
}
