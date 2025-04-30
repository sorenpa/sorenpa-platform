import { BehaviorSubject, Observable } from "rxjs";
import { IAsyncStore } from "../../application";
import { AsyncStatus } from "../../domain/state/async-status.type";
import { AsyncStoreError } from "../../domain/state/async-store-error";

export abstract class AsyncStore<T, E extends Error = AsyncStoreError>
  implements IAsyncStore<Partial<T>, E>
{
  protected readonly stateSubject = new BehaviorSubject<Partial<T>>({});
  protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
  protected readonly errorSubject = new BehaviorSubject<E | null>(null);
  protected readonly statusSubject = new BehaviorSubject<AsyncStatus>(
    AsyncStatus.IDLE
  );

  public readonly state$: Observable<Partial<T> | null>;
  public readonly loading$: Observable<boolean>;
  public readonly error$: Observable<E | null>;
  public readonly status$: Observable<AsyncStatus>;

  constructor(
    private readonly errorFactory: (e: unknown) => E = (e) =>
      new AsyncStoreError(e, "AsyncStore") as unknown as E
  ) {
    this.state$ = this.stateSubject.asObservable();
    this.loading$ = this.loadingSubject.asObservable();
    this.error$ = this.errorSubject.asObservable();
    this.status$ = this.statusSubject.asObservable();
  }

  public getSnapshot(): Partial<T> {
    return this.stateSubject.getValue();
  }

  protected async runWithStatus<R>(fn: () => Promise<R>): Promise<void> {
    this.loadingSubject.next(true);
    return await fn()
      .then(() => {
        this.statusSubject.next(AsyncStatus.SUCCESS);
      })
      .catch((e) => {
        const err = this.errorFactory(e);
        this.errorSubject.next(err);
        throw err;
      })
      .finally(() => this.loadingSubject.next(false));
  }
}
