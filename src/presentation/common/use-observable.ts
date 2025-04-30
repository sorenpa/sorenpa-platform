import { useSyncExternalStore } from "react";
import { Observable } from "rxjs";
import { createSyncObservable } from "./create-sync-observable";

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const syncObservable$ = createSyncObservable(observable$, initial);

  return useSyncExternalStore(
    (cb) => {
      const sub = syncObservable$.subscribe(() => cb());
      return () => sub.unsubscribe();
    },
    () => syncObservable$.getSnapshot(),
    () => syncObservable$.getSnapshot()
  );
}
