import type { IQuery } from "../bus";
import type { ResourceType } from "../../types/resource-type";

export const GET_ALL_RESOURCE_TYPES = "resourceType/GetAll";

export class GetAllResourceTypesQuery implements IQuery<ResourceType[]> {
  readonly type = GET_ALL_RESOURCE_TYPES;
}
