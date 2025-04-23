import { DIDependencyMap } from "../../domain/di/di-dependency-map.type";

export interface IDIContainer<M extends DIDependencyMap> {
  register<K extends keyof M>(key: K, input: () => M[K] | M[K]): void;
  get<K extends keyof M>(key: K): M[K];
}
