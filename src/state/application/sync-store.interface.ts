import { IBaseStore } from "src/state/application";

export interface ISyncStore<T> extends IBaseStore<T> {
  update(patch: Partial<T>): void;
  reset(): void;
}
