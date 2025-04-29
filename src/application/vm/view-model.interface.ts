import { Observable } from "rxjs";

export interface IViewModel<M> {
  getSnapshot: () => Partial<M>;
  vm$: () => Observable<Partial<M>>;
  init: () => void;
  destroy: () => void;
  mount: () => void;
  dismount: () => void;
}
