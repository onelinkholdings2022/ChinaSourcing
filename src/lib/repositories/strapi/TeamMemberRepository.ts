import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { TeamMember } from "../../types/team-member";

export class TeamMemberRepository extends StrapiBaseRepository<TeamMember> {
  protected getBaseEndpoint() {
    return "/api/team-members";
  }

  getFeatured(): Promise<TeamMember[]> {
    const query =
      "filters[featuredOnAboutUs][$eq]=true&sort=order:asc&pagination[pageSize]=100";
    return this.fetchList(`/team-members?${query}`, {
      revalidate: 3600,
      tags: ["strapi", "team-members"],
    });
  }
}
