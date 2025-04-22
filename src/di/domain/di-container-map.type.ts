import { DIContainer } from "../infrastructure/di-container";
import { DIContainerKey } from "./di-container-key.type";
import { DIDependencyMap } from "./di-dependency-map.type";

export type DIContainerMap = {
  [key: DIContainerKey]: DIContainer<DIDependencyMap>;
};
