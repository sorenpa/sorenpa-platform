import { AsyncAction } from "./async-action.type";

export type AsyncActions<T> = {
  [key: string]: AsyncAction<T, any[]>;
};
