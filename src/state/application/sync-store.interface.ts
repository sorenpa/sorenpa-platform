import { IBaseStore } from "./base-store.interface";

export interface ISyncStore<T> extends IBaseStore<T> {
  update(patch: Partial<T>): void;
  reset(): void;
}
