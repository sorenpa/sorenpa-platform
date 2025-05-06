import { Async } from "src/domain";
import { IStore } from "./base-store.interface";

export type IAsyncStore<T> = IStore<Async<T>>;
