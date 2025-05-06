import { BehaviorSubject, Observable } from "rxjs";
import { AsyncStoreError, AsyncStatus, Async } from "../../domain";
import { DIService, IAsyncStore } from "../../application";

export abstract class AsyncStore<T, E extends Error = AsyncStoreError>
  extends DIService
  implements IAsyncStore<Partial<T>>
{
  protected readonly stateSubject = new BehaviorSubject<Async<Partial<T>>>({
    status: AsyncStatus.EMPTY,
  });
  public readonly state$: Observable<Async<Partial<T>>>;

  constructor(
    private readonly errorFactory: (e: unknown) => E = (e) =>
      new AsyncStoreError(e, "AsyncStore") as unknown as E
  ) {
    super();
    this._meta.name = this.constructor.name;
    this._meta.type = "async-store";
    this.state$ = this.stateSubject.asObservable();
  }

  public getSnapshot(): Async<Partial<T>> {
    return this.stateSubject.getValue();
  }

  protected async runWithStatus(fn: () => Promise<Partial<T>>): Promise<void> {
    this.stateSubject.next({ status: AsyncStatus.LOADING });
    return await fn()
      .then((data) => {
        this.stateSubject.next({ status: AsyncStatus.DATA, data });
      })
      .catch((e) => {
        const error = this.errorFactory(e);
        this.stateSubject.next({ status: AsyncStatus.ERROR, error });
        throw error;
      });
  }
}
