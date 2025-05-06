import { Maybe, MaybeNone, MaybeSome } from "src/domain/common/maybe";
import { MaybeStatus } from "src/domain/common/maybe-status";

export class MaybeValue {
  static NONE(): MaybeNone {
    return { status: MaybeStatus.NONE };
  }

  static SOME<T>(value: T): MaybeSome<T> {
    return { status: MaybeStatus.SOME, value };
  }

  static isSome<T>(value: Maybe<T>): value is MaybeSome<T> {
    return value.status === MaybeStatus.SOME;
  }

  static isNone<T>(value: Maybe<T>): value is MaybeNone {
    return value.status === MaybeStatus.NONE;
  }

  static getMaybe<T>(value: Maybe<T>): T | undefined {
    return MaybeValue.isSome(value) ? value.value : undefined;
  }

  static get<T>(value: Maybe<T>): T {
    if (MaybeValue.isSome(value)) return value.value;
    throw new Error(`Expected SOME but got ${value.status}`);
  }

  static getOr<T>(value: Maybe<T>, fallback: () => T): T {
    return MaybeValue.isSome(value) ? value.value : fallback();
  }
}
