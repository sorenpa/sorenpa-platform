import {
  AsyncStatus,
  Async,
  AsyncEmpty,
  AsyncError,
  AsyncLoading,
  AsyncData,
} from "src/domain";

export class AsyncValue {
  static EMPTY(): AsyncEmpty {
    return { status: AsyncStatus.EMPTY };
  }

  static LOADING(): AsyncLoading {
    return { status: AsyncStatus.LOADING };
  }

  static ERROR(error: Error): AsyncError {
    return { status: AsyncStatus.ERROR, error };
  }

  static DATA<T>(data: T): AsyncData<T> {
    return { status: AsyncStatus.DATA, data };
  }

  static hasData<T>(value: Async<T>): value is AsyncData<T> {
    return value.status === AsyncStatus.DATA;
  }

  static isError<T>(value: Async<T>): value is AsyncError {
    return value.status === AsyncStatus.ERROR;
  }

  static isLoading<T>(value: Async<T>): value is AsyncLoading {
    return value.status === AsyncStatus.LOADING;
  }

  static isEmpty<T>(value: Async<T>): value is AsyncEmpty {
    return value.status === AsyncStatus.EMPTY;
  }

  static getError<T>(value: Async<T>): Error {
    if (AsyncValue.isError(value)) return value.error;
    throw new Error(`Expected Error but got ${value.status}`);
  }

  static getMaybe<T>(value: Async<T>): T | undefined {
    return AsyncValue.hasData(value) ? value.data : undefined;
  }

  static get<T>(value: Async<T>): T {
    if (AsyncValue.hasData(value)) return value.data;
    throw new Error(`Expected SUCCESS but got ${value.status}`);
  }

  static getOr<T>(value: Async<T>, fallback: () => T): T {
    return AsyncValue.hasData(value) ? value.data : fallback();
  }
}
