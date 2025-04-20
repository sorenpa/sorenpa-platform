import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const sub = observable$.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [observable$]);

  return value;
}
