import { useObservable } from "../../generic";
import { AsyncStore } from "../infrastructure/async-store";
import { AsyncStatus } from "../domain/async-status.type";

export function useAsyncStore<T>(store: AsyncStore<T>) {
  const data = useObservable(store.state$(), store.getSnapshot());
  const loading = useObservable(store.loading$(), false);
  const error = useObservable(store.error$(), null);
  const status = useObservable(store.status$(), AsyncStatus.IDLE);

  return { data, loading, error, status };
}
