import { BehaviorSubject, Observable } from "rxjs";
import { IAsyncStore } from "../application/async-store.interface";
import { AsyncStoreError } from "../domain/async-store-error";
import { AsyncStatus } from "../domain/async-status.type";

export class AsyncStore<T> implements IAsyncStore<T | null> {
  private readonly storeSubject = new BehaviorSubject<T | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<AsyncStoreError | null>(
    null
  );
  private readonly statusSubject = new BehaviorSubject<AsyncStatus>(
    AsyncStatus.IDLE
  );

  store$(): Observable<T | null> {
    return this.storeSubject.asObservable();
  }

  loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  error$(): Observable<AsyncStoreError | null> {
    return this.errorSubject.asObservable();
  }

  status$(): Observable<AsyncStatus> {
    return this.statusSubject.asObservable();
  }

  getSnapshot(): T | null {
    return this.storeSubject.getValue();
  }

  protected setStoreState(newState: T) {
    this.storeSubject.next(newState);
  }

  protected setError(error: AsyncStoreError) {
    this.errorSubject.next(error);
  }

  protected setStatus(status: AsyncStatus) {
    this.statusSubject.next(status);
  }

  protected setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  protected async runWithStatus<R>(
    fn: () => Promise<R>,
    onSuccess?: (result: R) => void
  ): Promise<void> {
    this.setLoading(true);
    try {
      const result = await fn();
      onSuccess?.(result);
      this.setStatus(AsyncStatus.SUCCESS);
    } catch (e) {
      this.setError(new AsyncStoreError(e));
    } finally {
      this.setLoading(false);
    }
  }
}
