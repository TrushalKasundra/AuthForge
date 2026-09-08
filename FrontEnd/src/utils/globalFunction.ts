
type ComponentModule<T> = {
  default: T;
};

export const lazyRetry = <T>(
  componentImport: () => Promise<ComponentModule<T>>,
): Promise<ComponentModule<T>> => {
  return new Promise((resolve, reject) => {
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem("retry-lazy-refreshed") || "false",
    );

    componentImport()
      .then((component) => {
        window.sessionStorage.setItem("retry-lazy-refreshed", "false");
        resolve(component);
      })
      .catch((error: unknown) => {
        if (!hasRefreshed) {
          window.sessionStorage.setItem("retry-lazy-refreshed", "true");
          window.location.reload();
          return;
        }

        reject(error);
      });
  });
};
