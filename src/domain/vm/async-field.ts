import { AsyncStatus } from "../state";

export type AsyncField<T> = {
  value: T;
  status: AsyncStatus;
};
