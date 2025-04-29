import { useEffect, useSyncExternalStore } from "react";
import { IViewModel } from "../../application/vm/view-model.interface";

export function useVM<T>(vm: IViewModel<T>): Partial<T> {
  useEffect(() => {
    vm.mount();
    return () => vm.dismount();
  }, [vm]);

  return useSyncExternalStore(
    (cb) => {
      const sub = vm.vm$().subscribe(() => cb());
      return () => sub.unsubscribe();
    },
    () => vm.getSnapshot(),
    () => vm.getSnapshot()
  );
}
