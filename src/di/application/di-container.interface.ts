export interface IDIContainer<K extends string, M extends Record<K, unknown>> {
  register<Key extends K>(key: Key, service: M[Key]): void;
  get<Key extends K>(key: Key): M[Key];
}
