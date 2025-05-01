import { IDIService } from "src/application/di/di-service.interface";

export abstract class DIService implements IDIService {
  protected _meta: Record<string, unknown> = {};
  public readonly instanceId = crypto.randomUUID();
  public readonly meta: Record<string, unknown> = this._meta;

  constructor() {}
}
