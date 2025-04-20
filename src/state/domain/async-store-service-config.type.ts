import { MutationFn } from "./mutation-function.type";
import { QueryFn } from "./query-function.type";

export interface AsyncStoreServiceConfig<
  T,
  Mutators extends Record<string, unknown>
> {
  query?: QueryFn<T>;
  mutations?: {
    [K in keyof Mutators]: MutationFn<T, Mutators[K]>;
  };
}
