import { useObservable } from "../../presentation";
import { IAsyncStore } from "../../application";
import { AsyncStatus } from "../../domain";
import { useMemo } from "react";
import { useDIService } from "../di/use-di-service";

export function useAsyncStore<T>(store: IAsyncStore<T>) {
  const { instanceId, meta } = useDIService(store);
  const data = useObservable(store.state$, store.getSnapshot());
  const loading = useObservable(store.loading$, false);
  const error = useObservable(store.error$, null);
  const status = useObservable(store.status$, AsyncStatus.IDLE);

  const asyncState = useMemo(
    () => ({ data, loading, error, status, instanceId, meta }),
    [data, loading, error, status, instanceId, meta]
  );

  return asyncState;
}
