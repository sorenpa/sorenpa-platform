import { IDIContainer } from "../../application/di/di-container.interface";
import { DIContainerKey } from "./di-container-key.type";
import { DIDependencyMap } from "./di-dependency-map.type";

export type DIContainerMap = {
  [key: DIContainerKey]: IDIContainer<DIDependencyMap>;
};
