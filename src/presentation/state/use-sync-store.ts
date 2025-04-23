import { useMemo } from "react";
import { useObservable } from "../common";
import { ISyncStore } from "../../application";

export function useSyncStore<T>(service: ISyncStore<T>): T;
export function useSyncStore<T, K extends keyof T>(
  service: ISyncStore<T>,
  keys: K[]
): Pick<T, K>;
export function useSyncStore<T, K extends keyof T>(
  service: ISyncStore<T>,
  keys?: K[]
): T | Pick<T, K> {
  const fullState = useObservable(service.state$(), service.getSnapshot());

  const selectedState = useMemo(() => {
    if (!keys || keys.length === 0) return fullState;

    const partial: Partial<T> = {};
    keys.forEach((key) => {
      partial[key] = fullState[key];
    });

    return partial as Pick<T, K>;
  }, [fullState, keys]);

  return selectedState;
}
