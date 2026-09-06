import type { IQueryHandler } from "../../bus";
import type { GetResourceBySlugQuery } from "../../queries/GetResourceBySlugQuery";
import type { ResourceRepository } from "../../../repositories/strapi/ResourceRepository";
import type { Resource } from "../../../types/resource";

export class GetResourceBySlugHandler implements IQueryHandler<GetResourceBySlugQuery, Resource> {
  constructor(private readonly repo: ResourceRepository) {}

  execute(query: GetResourceBySlugQuery): Promise<Resource | null> {
    return this.repo.getBySlug(query.slug);
  }
}
