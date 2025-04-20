import { IBaseStore } from "@state/application";

export interface ISyncStore<T> extends IBaseStore<T> {
  update(patch: Partial<T>): void;
  reset(): void;
}
