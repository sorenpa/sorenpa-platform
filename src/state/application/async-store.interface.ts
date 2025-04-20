import { Observable } from "rxjs";
import { AsyncStatus, AsyncStoreError } from "@state/domain";
import { IBaseStore } from "@state/application";

export interface IAsyncStore<T> extends IBaseStore<T | null> {
  status$(): Observable<AsyncStatus>;
  loading$(): Observable<boolean>;
  error$(): Observable<AsyncStoreError | null>;
}
