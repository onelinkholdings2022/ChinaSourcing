import type { IQueryHandler } from "../../bus";
import type { GetFeaturedTeamMembersQuery } from "../../queries/GetFeaturedTeamMembersQuery";
import type { TeamMemberRepository } from "../../../repositories/strapi/TeamMemberRepository";
import type { TeamMember } from "../../../types/team-member";

export class GetFeaturedTeamMembersHandler
  implements IQueryHandler<GetFeaturedTeamMembersQuery, TeamMember[]>
{
  constructor(private readonly repo: TeamMemberRepository) {}

  execute(): Promise<TeamMember[]> {
    return this.repo.getFeatured();
  }
}
