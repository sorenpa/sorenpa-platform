import { AsyncStoreError } from "../domain/async-store-error";

export function asyncErrorFactory(
  context: string
): (e: unknown) => AsyncStoreError {
  return (e: unknown) => new AsyncStoreError(e, context);
}
