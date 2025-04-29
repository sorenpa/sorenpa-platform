import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { IViewModel } from "../../application/vm/view-model.interface";

export abstract class BaseViewModel<M> implements IViewModel<M> {
  protected vmSubject = new BehaviorSubject<Partial<M>>({});
  protected readonly vmId = crypto.randomUUID();
  private _initialized = false;

  getSnapshot(): Partial<M> {
    return this.vmSubject.getValue();
  }

  vm$(): Observable<Partial<M>> {
    return this.vmSubject.asObservable();
  }

  init(): void {
    if (!this._initialized) {
      this.onInit();
      this._initialized = true;
    }
  }

  destroy(): void {
    if (this._initialized) {
      this.onDestroy();
      this._initialized = false;
    }
  }

  mount(): void {}
  dismount(): void {}

  protected onInit(): void {}
  protected onDestroy(): void {}

  protected bindToVM<K extends keyof M>(
    key: K,
    source$: Observable<M[K]>
  ): Subscription {
    return source$.subscribe((value) => {
      this.vmSubject.next({
        ...this.vmSubject.getValue(),
        [key]: value,
      });
    });
  }
}
