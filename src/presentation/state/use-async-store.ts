import { useMemo } from "react";
import { useObservable } from "../../presentation";
import { IAsyncStore } from "../../application";
import { useDIService } from "../di/use-di-service";

export function useAsyncStore<T>(store: IAsyncStore<T>) {
  const { instanceId, meta } = useDIService(store);
  const data = useObservable(store.state$, store.getSnapshot());

  const asyncState = useMemo(
    () => ({ data, instanceId, meta }),
    [data, instanceId, meta]
  );

  return asyncState;
}
