export class AsyncStoreError extends Error {
  public readonly original: unknown;
  public readonly context: string;
  public readonly originalMessage?: string;
  public readonly originalStack?: string;

  constructor(error: unknown, context: string) {
    const isError = error instanceof Error;
    const message = isError
      ? `[${context}] ${error.message}`
      : `[${context}] Async operation failed`;

    super(message);
    this.name = "AsyncStoreError";
    this.context = context;
    this.original = error;

    if (isError) {
      this.originalMessage = error.message;
      this.originalStack = error.stack;
    }
  }
}
