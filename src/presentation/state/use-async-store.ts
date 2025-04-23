import { useObservable } from "../../presentation";
import { IAsyncStore } from "../../application";
import { AsyncStatus } from "../../domain";

export function useAsyncStore<T>(store: IAsyncStore<T>) {
  const data = useObservable(store.state$(), store.getSnapshot());
  const loading = useObservable(store.loading$(), false);
  const error = useObservable(store.error$(), null);
  const status = useObservable(store.status$(), AsyncStatus.IDLE);

  return { data, loading, error, status };
}
