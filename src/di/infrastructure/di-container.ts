import { IDIContainer } from "../application/di-container.interface";
import { DIDependencyMap } from "../domain/di-dependency-map.type";

type Factory<T> = () => T;

export class DIContainer<M extends DIDependencyMap> implements IDIContainer<M> {
  private serviceFactories: Partial<{ [K in keyof M]: Factory<M[K]> }> = {};
  private serviceInstances: Partial<M> = {};

  register<K extends keyof M>(key: K, service: M[K]): void;
  register<K extends keyof M>(key: K, factory: Factory<M[K]>): void;
  register<K extends keyof M>(key: K, input: Factory<M[K]> | M[K]): void {
    if (this.serviceFactories[key] || this.serviceInstances[key]) {
      throw new Error(
        `Service with key "${String(key)}" is already registered.`
      );
    }

    if (typeof input === "function") {
      this.serviceFactories[key] = input as Factory<M[K]>;
      console.log("Lazy Service Registered:", key);
    } else {
      this.serviceInstances[key] = input;
      console.log("Eager Service Registered:", key);
    }
  }

  get<K extends keyof M>(key: K): M[K] {
    if (this.serviceInstances[key]) {
      return this.serviceInstances[key] as M[K];
    }

    const factory = this.serviceFactories[key];
    if (!factory) {
      throw new Error(`Service with key "${String(key)}" is not registered.`);
    }

    const instance = factory();
    this.serviceInstances[key] = instance;

    return instance;
  }
}
