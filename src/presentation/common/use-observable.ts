import { useMemo, useSyncExternalStore } from "react";
import { Observable } from "rxjs";
import { createSyncObservable } from "./create-sync-observable";

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const syncObservable$ = useMemo(
    () => createSyncObservable(observable$, initial),
    [observable$]
  );

  return useSyncExternalStore(
    (cb) => {
      const sub = syncObservable$.subscribe(() => cb());
      return () => sub.unsubscribe();
    },
    () => syncObservable$.getSnapshot(),
    () => syncObservable$.getSnapshot()
  );
}
