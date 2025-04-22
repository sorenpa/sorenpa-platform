import { BehaviorSubject, Observable } from "rxjs";
import { ISyncStore } from "../application/sync-store.interface";

export class SyncStore<T extends { [key in keyof T]: unknown }>
  implements ISyncStore<T>
{
  protected readonly stateSubject: BehaviorSubject<T>;
  protected readonly initialState: T;

  constructor(initialState: T) {
    this.initialState = initialState;
    this.stateSubject = new BehaviorSubject(initialState);
  }

  state$(): Observable<T> {
    return this.stateSubject.asObservable();
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
