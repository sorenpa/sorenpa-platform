import { DIDependencyMap } from "./di-dependency-map";
import { IDIContainer } from "./di-container.interface";
import { IDIService } from "./di-service.interface";

type Factory<T> = () => T;

export class DIContainer<M extends DIDependencyMap> implements IDIContainer<M> {
  private serviceFactories: Partial<{ [K in keyof M]: Factory<M[K]> }> = {};
  private serviceInstances: Partial<M> = {};

  register<K extends string, T extends IDIService>(key: K, service: T): void;
  register<K extends string, T extends IDIService>(
    key: K,
    factory: Factory<T>
  ): void;
  register<K extends string>(key: K, input: Factory<M[K]> | M[K]): void {
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

  replace<K extends keyof M>(key: K, service: M[K] | Factory<M[K]>): void {
    delete this.serviceInstances[key];
    delete this.serviceFactories[key];

    if (typeof service === "function") {
      this.serviceFactories[key] = service as Factory<M[K]>;
    } else {
      this.serviceInstances[key] = service;
    }
  }
}
