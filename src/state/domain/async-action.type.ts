export type AsyncAction<T, Args extends any[] = []> = (
  ...args: Args
) => Promise<Partial<T> | void>;
