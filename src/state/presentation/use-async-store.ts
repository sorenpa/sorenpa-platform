import { useObservable } from "@generic/presentation";
import { AsyncStore } from "@state/infrastructure";
import { AsyncStatus } from "@state/domain";

export function useAsyncStore<T>(store: AsyncStore<T>) {
  const data = useObservable(store.store$(), store.getSnapshot());
  const loading = useObservable(store.loading$(), false);
  const error = useObservable(store.error$(), null);
  const status = useObservable(store.status$(), AsyncStatus.IDLE);

  return { data, loading, error, status };
}
