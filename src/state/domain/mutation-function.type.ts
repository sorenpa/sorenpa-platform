export type MutationFn<T, Args> = (args: Args) => Promise<Partial<T>>;
