import { Observable } from "rxjs";
import { IBaseStore } from "./base-store.interface";
import { AsyncStatus } from "../domain/async-status.type";

export interface IAsyncStore<T, E extends Error> extends IBaseStore<T | null> {
  status$(): Observable<AsyncStatus>;
  loading$(): Observable<boolean>;
  error$(): Observable<E | null>;
}
