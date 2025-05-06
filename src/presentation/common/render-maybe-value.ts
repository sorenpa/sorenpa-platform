import { Maybe, MaybeStatus } from "../../domain";
import { MaybeValue } from "../../application";

type RenderHandlers<T, R> = {
  none: () => R;
  some: (data: T) => R;
};

export function renderMaybeValue<T, R>(
  value: Maybe<T>,
  handlers: RenderHandlers<T, R>
): R {
  switch (value.status) {
    case MaybeStatus.NONE:
      return handlers.none();
    case MaybeStatus.SOME:
    default:
      return handlers.some(MaybeValue.get(value));
  }
}
