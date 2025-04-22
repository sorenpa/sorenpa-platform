import { BehaviorSubject, Observable } from "rxjs";
import { IAsyncStore } from "../application/async-store.interface";
import { AsyncStatus } from "../domain/async-status.type";
import { AsyncStoreError } from "../domain/async-store-error";

export abstract class AsyncStore<T, E extends Error = AsyncStoreError>
  implements IAsyncStore<Partial<T>, E>
{
  protected readonly stateSubject = new BehaviorSubject<Partial<T>>({});
  protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
  protected readonly errorSubject = new BehaviorSubject<E | null>(null);
  protected readonly statusSubject = new BehaviorSubject<AsyncStatus>(
    AsyncStatus.IDLE
  );

  constructor(
    private readonly errorFactory: (e: unknown) => E = (e) =>
      new AsyncStoreError(e, "AsyncStore") as unknown as E
  ) {}

  public state$(): Observable<Partial<T> | null> {
    return this.stateSubject.asObservable();
  }

  public loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  public error$(): Observable<E | null> {
    return this.errorSubject.asObservable();
  }

  public status$(): Observable<AsyncStatus> {
    return this.statusSubject.asObservable();
  }

  public getSnapshot(): Partial<T> {
    return this.stateSubject.getValue();
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
      this.errorSubject.next(this.errorFactory(e));
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
