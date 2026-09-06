import type { IQuery } from "../bus";
import type { Resource } from "../../types/resource";

export const GET_RESOURCE_BY_SLUG = "resource/GetBySlug";

export class GetResourceBySlugQuery implements IQuery<Resource> {
  readonly type = GET_RESOURCE_BY_SLUG;
  constructor(readonly slug: string) {}
}
