import { IDIContainer } from "../application/di-container.interface";
import { DIDependencyMap } from "../domain/di-dependency-map.type";

export class DIContainer<M extends DIDependencyMap> implements IDIContainer<M> {
  private services: Partial<M> = {};

  register<K extends keyof M>(key: K, service: M[K]): void {
    if (this.services[key]) {
      throw new Error(
        `Service with name "${String(key)}" is already registered.`
      );
    }
    console.log("Service Registered", key);

    this.services[key] = service;
  }

  get<K extends keyof M>(key: K): M[K] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service with key "${String(key)}" is not registered.`);
    }
    return service;
  }
}
