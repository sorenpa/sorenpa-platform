import { useMemo } from "react";
import { useObservable } from "../common";
import { ISyncStore } from "../../application";
import { useDIService } from "../di/use-di-service";
import { IDIService } from "src/application/di/di-service.interface";

export function useSyncStore<T>(service: ISyncStore<T>): T & IDIService;
export function useSyncStore<T, K extends keyof T>(
  store: ISyncStore<T>,
  keys: K[]
): Pick<T, K> & IDIService;
export function useSyncStore<T, K extends keyof T>(
  store: ISyncStore<T>,
  keys?: K[]
): (T & IDIService) | (Pick<T, K> & IDIService) {
  const { instanceId, meta } = useDIService(store);
  const fullState = useObservable(store.state$, store.getSnapshot());

  const selectedState = useMemo(() => {
    if (!keys || keys.length === 0) return fullState;

    const partial: Partial<T> = {};
    keys.forEach((key) => {
      partial[key] = fullState[key];
    });

    return partial as Pick<T, K>;
  }, [fullState, keys]);

  return { ...selectedState, instanceId, meta };
}
