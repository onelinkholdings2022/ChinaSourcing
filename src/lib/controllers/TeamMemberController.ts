import { BaseController, type Result } from "../core/BaseController";
import type { TeamMemberService } from "../services/TeamMemberService";
import type { TeamMember } from "../types/team-member";

export class TeamMemberController extends BaseController {
  constructor(private readonly service: TeamMemberService) {
    super();
  }

  getFeatured(): Promise<Result<TeamMember[]>> {
    return this.handle(() => this.service.getFeatured());
  }
}
