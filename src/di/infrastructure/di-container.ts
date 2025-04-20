import { IDIContainer } from "src/di/application";

export class DIContainer<K extends string, M extends Record<K, unknown>>
  implements IDIContainer<K, M>
{
  private services: Partial<M> = {};

  register<Key extends K>(key: Key, service: M[Key]): void {
    if (this.services[key]) {
      throw new Error(`Service with name "${key}" is already registered.`);
    }
    console.log("Service Registered", key);
    this.services[key] = service;
  }

  get<Key extends K>(key: Key): M[Key] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service with key "${key}" is not registered.`);
    }
    return service;
  }
}
