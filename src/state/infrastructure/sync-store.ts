import { BehaviorSubject, Observable } from "rxjs";
import { ISyncStore } from "../application/sync-store.interface";

export class SyncStore<T extends { [key in keyof T]: unknown }>
  implements ISyncStore<T>
{
  private readonly storeSubject: BehaviorSubject<T>;
  private readonly initialState: T;

  constructor(initialState: T) {
    this.initialState = initialState;
    this.storeSubject = new BehaviorSubject(initialState);
  }

  store$(): Observable<T> {
    return this.storeSubject.asObservable();
  }

  getSnapshot(): T {
    return this.storeSubject.getValue();
  }

  update(patch: Partial<T>): void {
    this.storeSubject.next({
      ...this.storeSubject.getValue(),
      ...patch,
    });
  }

  reset(): void {
    this.storeSubject.next(this.initialState);
  }
}
