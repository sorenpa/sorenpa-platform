import { AsyncStoreServiceConfig, QueryFn } from "src/state/domain";
import { AsyncStore } from "src/state/infrastructure";

export class AsyncStoreService<
  T,
  Mutators extends Record<string, unknown>
> extends AsyncStore<T | null> {
  private readonly queryFn?: QueryFn<T>;
  private readonly mutations?: AsyncStoreServiceConfig<
    T,
    Mutators
  >["mutations"];

  constructor(config: AsyncStoreServiceConfig<T, Mutators>) {
    super();
    this.queryFn = config.query;
    this.mutations = config.mutations;
  }

  async fetch(force = false): Promise<void> {
    if (!this.queryFn) throw new Error("Query function not provided");
    if (this.getSnapshot() && !force) return;

    return this.runWithStatus(async () => {
      const data = await this.queryFn!();
      this.setStoreState(data);
    });
  }

  async mutate<K extends keyof Mutators>(
    key: K,
    args: Mutators[K]
  ): Promise<void> {
    const fn = this.mutations?.[key];
    if (!fn) throw new Error(`Mutation "${String(key)}" not found`);

    return this.runWithStatus(async () => {
      const patch = await fn(args);
      const updated = { ...this.getSnapshot(), ...patch } as T | null;
      this.setStoreState(updated);
    });
  }
}
