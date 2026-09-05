import type { IQuery } from "../bus";
import type { TeamMember } from "../../types/team-member";

export const GET_FEATURED_TEAM_MEMBERS = "team-member/GetFeatured";

export class GetFeaturedTeamMembersQuery implements IQuery<TeamMember[]> {
  readonly type = GET_FEATURED_TEAM_MEMBERS;
}
