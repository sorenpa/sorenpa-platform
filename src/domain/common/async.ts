import { AsyncStatus } from "./async-status";

export interface AsyncBase<T> {
  status: AsyncStatus;
  data?: T;
  error?: Error;
}

export interface AsyncEmpty extends AsyncBase<unknown> {
  status: AsyncStatus.EMPTY;
}

export interface AsyncLoading extends AsyncBase<unknown> {
  status: AsyncStatus.LOADING;
}

export interface AsyncError extends AsyncBase<unknown> {
  status: AsyncStatus.ERROR;
  error: Error;
}

export interface AsyncData<T> extends AsyncBase<T> {
  status: AsyncStatus.DATA;
  data: T;
}

export type Async<T> = AsyncEmpty | AsyncLoading | AsyncError | AsyncData<T>;
