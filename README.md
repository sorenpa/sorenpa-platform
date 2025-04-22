# @sorenpa/platform

A lightweight TypeScript-first platform layer designed to manage cross-cutting concerns in single-page applications (SPAs), such as dependency injection, state management, and observable utilities. Built for flexibility and strong typing.

---

## 📦 Features

- 🔑 **Dependency Injection (DI)**  
  A type-safe, pluggable DI container system with support for multiple containers and scoped resolution.

- 🧠 **State Management**  
  Reactive sync and async stores with composable hooks, inspired by React Query and Zustand.

- 👀 **Observables & HOCs**  
  Utility HOC and observable hook for component injection and reactive updates.

---

## 🧩 Dependency Injection (DI)

### Container Registry

The DI system supports multiple DIContainers for larger applications. The containers are managed by a container rgistry.

**1. Define your DI Map**

First defined your DI map

```ts
export type DIMap = {
  ApiClient: AxiosInstance;
  UserStore: SyncStore<UserState>;
  FeatureToggleService: FeatureToggleService;
};
```

**2. Register and Access Services**

Use the **createDIContainer<DM>** to create and regsiter a DI container. This function takes two arguments, the container key and an optional registerFn. This gives you two styles for creating a container and registering DI entries.

```ts
import { createDIContainer } from "@sorenpa/platform";

const { container, accessor } = createDIContainer<DIMap>(
  "AppContainer",
  (c) => {
    c.register("ApiClient", axios.create({ baseURL: "/api" }));
    c.register("UserStore", new SyncStore({ loggedIn: false }));
    c.register(
      "FeatureToggleService",
      new FeatureToggleService(c.get("ApiClient"))
    );
  }
);
```

```ts
import { createDIContainer } from "@sorenpa/platform";

const { container, accessor } = createDIContainer<DIMap>("AppContainer");

container.register("ApiClient", axios.create({ baseURL: "/api" }));
container.register("UserStore", new SyncStore({ loggedIn: false }));
container.register(
  "FeatureToggleService",
  new FeatureToggleService(c.get("ApiClient"))
);
```

**3. Access Registered DI Entries**

```ts
const { container, accessor } = createDIContainer<DIMap>("AppContainer");
const apiClient = accessor("ApiClient");
```

OR

```ts
const container = getDiContainer<DIMap>("AppContainer");
const service = container.get("ApiClient");
```

OR

```ts
const getEntry = createDIAccessor<DIMap>("AppContainer");
const apiClient = getEntry("ApiClient");
```

## 🧠 State Management

### Sync Store

**Creattion**

```ts
const userStore = new SyncStore<UserState>({ loggedIn: false });
```

**Usage**

This package expose the useSyncStore hook, that can be used to **Observe** the **state$** stream of the store, or parts of it, setting the state can be done by using the update function exposed by the instance of AsyncStore class. Getting the instance can be done in several ways, if its registered in a DIContainer which is recommended, then how to access is documented in the DI section.

```tsx
import {containerAccessor} from "@di/acessors"

const user = useSyncStore(DIKey.UserStore);
const user = useSyncStore(DIKey.UserStore, [ "memeber1", "member2", "..."]);

containerAccessor.get(DIKey.UserStore).update(...);

```

### Async Store

**Creattion**

The AsyncStore is an rxjs based store whith async actions passed in at construction. An async action supports any number of arguments including none, and must return a **Promise<Partial<T> | void>** where T is the type of state for the AsyncStore, so the options are quite flexible.

```ts
// state.ts
interface AsyncState {
  count: number;
  userName: string;
}

const actions = {
  query: async () => await fetchUserData(),
  increment: async (ammount?: number) => await incrementCount(),
  // ... more actions as preferred
};

const userStore = new AsyncStore<AsyncState, typeof actions>(actions);

userStore.run("query");
userStore.run("increment", 4);
```

**Usage**

This package expose the useAsyncSyncStore hook, that can be used to **Observe** the **state$** stream of the store, or parts of it. Setting the state can be done by using the run method that allows execution of registered store actions. You need to get hold of the async store instance, to do so. Getting the instance can be done in several ways, if its registered in a DIContainer which is recommended, then how to access is documented in the DI section.

```tsx
const [data, status] = useAsyncStore(DIKey.UserService);

containerAccessor.get(DIKey.UserStore).run("action", actionParam1, actionParam2, ...);
```

## 🛠️ Utility Tools

### withInjection Higher Order Component

This higher order component can be used to inject props into a component. This has several use cases, but the envisioned case is injecting DI registered services into a View Model component.

```tsx
import {containerAccessor} from "@di/acessors"

const inject = () => ({
  mapStore: containerAccessor(DIKey.MapStore),
  featureToggleService: containerAccessor(DIKey.FeatureToggleService),
});

export const ComponentVM = withInjection(
  inject,
  ({ mapStore, featureToggleService }) => {

    // Add VM code such as data fetching and side effects here and construct View component props.

    const componentProps = {...}

    return (
      <ComponentV
        {...componentProps}
      />
    );
  }
);
```

### useObservable

Convert observable-like objects into React-friendly subscriptions. Handles mount/dismount subscribe/unsubscribe and manages state.

```tsx
useObservable(observable);
```
