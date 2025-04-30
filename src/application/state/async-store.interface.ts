import { Observable } from "rxjs";
import { IBaseStore } from "./base-store.interface";
import { AsyncStatus, AsyncStoreError } from "../../domain";

export interface IAsyncStore<T, E extends Error = AsyncStoreError>
  extends IBaseStore<T | null> {
  status$: Observable<AsyncStatus>;
  loading$: Observable<boolean>;
  error$: Observable<E | null>;
}
