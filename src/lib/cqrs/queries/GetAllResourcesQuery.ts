import type { IQuery } from "../bus";
import type { Resource } from "../../types/resource";

export const GET_ALL_RESOURCES = "resource/GetAll";

export class GetAllResourcesQuery implements IQuery<Resource[]> {
  readonly type = GET_ALL_RESOURCES;
}
