import { useEffect, useState } from "react";
import { IDIService } from "src/application/di/di-service.interface";

export function useDIService<T extends IDIService>(service: T): IDIService {
  const [id, setId] = useState(service.instanceId);

  useEffect(() => {
    if (service.instanceId !== id) {
      setId(service.instanceId);
    }
  }, [service]);

  return service;
}
