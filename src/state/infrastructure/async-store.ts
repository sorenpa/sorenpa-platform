import { BehaviorSubject, Observable } from "rxjs";
import { IAsyncStore } from "../application/async-store.interface";
import { AsyncStatus } from "../domain/async-status.type";
import { AsyncStoreError } from "../domain/async-store-error";
import { AsyncActions } from "../domain/async-actions.type";
export class AsyncStore<T, A extends AsyncActions<T>>
  implements IAsyncStore<Partial<T>>
{
  protected readonly stateSubject = new BehaviorSubject<Partial<T>>({});
  protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
  protected readonly errorSubject = new BehaviorSubject<AsyncStoreError | null>(
    null
  );
  protected readonly statusSubject = new BehaviorSubject<AsyncStatus>(
    AsyncStatus.IDLE
  );

  constructor(private readonly actions: A) {}

  public state$(): Observable<Partial<T> | null> {
    return this.stateSubject.asObservable();
  }

  public loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  public error$(): Observable<AsyncStoreError | null> {
    return this.errorSubject.asObservable();
  }

  public status$(): Observable<AsyncStatus> {
    return this.statusSubject.asObservable();
  }

  public getSnapshot(): Partial<T> {
    return this.stateSubject.getValue();
  }

  public async run<K extends keyof A>(
    key: K,
    ...args: Parameters<A[K]>
  ): Promise<void> {
    const fn = this.actions[key];
    if (!fn) throw new Error(`Action "${String(key)}" not found`);

    return this.runWithStatus(async () => {
      const patch = await fn(...args);
      if (patch) {
        const updated = { ...this.stateSubject.getValue(), ...patch };
        this.stateSubject.next(updated);
      }
    });
  }

  protected async runWithStatus<R>(
    fn: () => Promise<R>,
    onSuccess?: (result: R) => void
  ): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const result = await fn();
      onSuccess?.(result);
      this.statusSubject.next(AsyncStatus.SUCCESS);
    } catch (e) {
      this.errorSubject.next(new AsyncStoreError(e));
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
