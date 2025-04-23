export const injectLazy =
  <T>(fn: () => T) =>
  () =>
    fn;
