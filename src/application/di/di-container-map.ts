import { IDIContainer } from "./di-container.interface";
import { DIContainerKey } from "./di-container-key";
import { DIDependencyMap } from "./di-dependency-map";

export type DIContainerMap = {
  [key: DIContainerKey]: IDIContainer<DIDependencyMap>;
};
