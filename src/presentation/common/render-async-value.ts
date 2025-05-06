import { AsyncValue } from "../../application";
import { AsyncStatus, Async } from "../../domain";

type RenderHandlers<T, R> = {
  empty: () => R;
  loading: () => R;
  error: (error: Error) => R;
  success: (data: T) => R;
};

export function renderAsyncValue<T, R>(
  value: Async<T>,
  handlers: RenderHandlers<T, R>
): R {
  switch (value.status) {
    case AsyncStatus.EMPTY:
      return handlers.empty();
    case AsyncStatus.LOADING:
      return handlers.loading();
    case AsyncStatus.ERROR:
      return handlers.error(AsyncValue.getError(value));
    case AsyncStatus.DATA:
    default:
      return handlers.success(AsyncValue.get(value));
  }
}
