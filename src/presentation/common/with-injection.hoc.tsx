export function withInjection<P extends object, I extends object>(
  getInjected: () => I,
  Component: React.ComponentType<P & I>
): React.FC<P> {
  return function WrappedComponent(props: P) {
    const injected = getInjected();

    return <Component {...props} {...injected} />;
  };
}
