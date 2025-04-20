export class AsyncStoreError extends Error {
  constructor(
    public readonly original: unknown,
    message = "AsyncStore encountered an error"
  ) {
    super(message);
    this.name = "AsyncStoreError";
  }

  static empty(): AsyncStoreError {
    return new AsyncStoreError(null, "No error");
  }

  get isEmpty(): boolean {
    return this.original == null;
  }
}
