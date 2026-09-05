import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetFeaturedTeamMembersQuery } from "../cqrs/queries/GetFeaturedTeamMembersQuery";
import type { TeamMember } from "../types/team-member";

export class TeamMemberService extends BaseService<QueryBus> {
  getFeatured(): Promise<TeamMember[] | null> {
    return this.bus.dispatch(new GetFeaturedTeamMembersQuery());
  }
}
