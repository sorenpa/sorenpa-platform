import { DIDependencyMap } from "../domain/di-dependency-map.type";

export interface IDIContainer<M extends DIDependencyMap> {
  register<K extends keyof M>(key: K, service: M[K]): void;
  get<K extends keyof M>(key: K): M[K];
}
