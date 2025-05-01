import { BehaviorSubject, Observable } from "rxjs";
import { DIService, ISyncStore } from "../../application";

export class SyncStore<T extends { [key in keyof T]: unknown }>
  extends DIService
  implements ISyncStore<T>
{
  protected readonly stateSubject: BehaviorSubject<T>;
  protected readonly initialState: T;
  public readonly state$: Observable<T>;

  constructor(initialState: T) {
    super();
    this._meta.name = this.constructor.name;
    this._meta.type = "sync-store";
    this.initialState = initialState;
    this.stateSubject = new BehaviorSubject(initialState);
    this.state$ = this.stateSubject.asObservable();
  }

  getSnapshot(): T {
    return this.stateSubject.getValue();
  }

  update(patch: Partial<T>): void {
    this.stateSubject.next({
      ...this.stateSubject.getValue(),
      ...patch,
    });
  }

  reset(): void {
    this.stateSubject.next(this.initialState);
  }
}
