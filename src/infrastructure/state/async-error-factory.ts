import { AsyncStoreError } from "../../domain/state/async-store-error";

export function asyncErrorFactory(
  context: string
): (e: unknown) => AsyncStoreError {
  return (e: unknown) => new AsyncStoreError(e, context);
}
