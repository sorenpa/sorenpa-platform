import {
  DIContainerKey,
  DIDependencyMap,
  DIContainerMap,
  DIContainer,
} from "./";

const containers: Partial<DIContainerMap> = {};

export function getDiContainer<DM extends DIDependencyMap>(
  key?: DIContainerKey
): DIContainer<DM> {
  const resolvedKey = key || Object.keys(containers)[0];
  const container = containers[resolvedKey];
  if (!container) {
    throw new Error(
      `DIContainer for key "${resolvedKey}" has not been registered.`
    );
  }

  return container as DIContainer<DM>;
}

export function createDIContainer<DM extends DIDependencyMap>(
  key: DIContainerKey,
  registerFn?: (container: DIContainer<DM>) => void
) {
  if (containers[key]) {
    throw new Error(`Container "${key}" already registered.`);
  }

  const container = new DIContainer<DM>();

  if (registerFn) {
    registerFn(container);
  }

  containers[key] = container;

  const accessor = createDIAccessor<DM>(key);

  return { container, accessor };
}

export function createDIAccessor<DM extends DIDependencyMap>(
  containerKey: DIContainerKey
) {
  return function <K extends keyof DM>(key: K): DM[K] {
    const container = getDiContainer<DM>(containerKey);
    return container.get(key);
  };
}
