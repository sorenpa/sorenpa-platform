import { MutationFn, QueryFn } from "src/state/domain";

export interface AsyncStoreServiceConfig<
  T,
  Mutators extends Record<string, unknown>
> {
  query?: QueryFn<T>;
  mutations?: {
    [K in keyof Mutators]: MutationFn<T, Mutators[K]>;
  };
}
