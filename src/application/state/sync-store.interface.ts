import { IStore } from "./base-store.interface";

export interface ISyncStore<T> extends IStore<T> {
  update(patch: Partial<T>): void;
  reset(): void;
}
