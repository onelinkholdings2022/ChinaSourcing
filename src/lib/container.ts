// ─── container.ts — nơi wiring DUY NHẤT ──────────────────────────────────────
// Repo → đăng ký handler lên bus → Service → Controller. FE chỉ import
// controller từ `./index.ts`, không bao giờ import trực tiếp từ đây.

import { QueryBus } from "./cqrs/bus";

import { HomepageRepository } from "./repositories/strapi/HomepageRepository";
import { GlobalRepository } from "./repositories/strapi/GlobalRepository";
import { CaseStudyRepository } from "./repositories/strapi/CaseStudyRepository";
import { BlogPostRepository } from "./repositories/strapi/BlogPostRepository";
import { PartnerRepository } from "./repositories/strapi/PartnerRepository";
import { AboutPageRepository } from "./repositories/strapi/AboutPageRepository";
import { TeamMemberRepository } from "./repositories/strapi/TeamMemberRepository";
import { ProcessPageRepository } from "./repositories/strapi/ProcessPageRepository";
import { ContactPageRepository } from "./repositories/strapi/ContactPageRepository";

import { GET_HOMEPAGE } from "./cqrs/queries/GetHomepageQuery";
import { GET_GLOBAL } from "./cqrs/queries/GetGlobalQuery";
import { GET_FEATURED_CASE_STUDIES } from "./cqrs/queries/GetFeaturedCaseStudiesQuery";
import { GET_LATEST_BLOG_POSTS } from "./cqrs/queries/GetLatestBlogPostsQuery";
import { GET_ALL_PARTNERS } from "./cqrs/queries/GetAllPartnersQuery";
import { GET_CLIENT_LOGOS } from "./cqrs/queries/GetClientLogosQuery";
import { GET_ABOUT_PAGE } from "./cqrs/queries/GetAboutPageQuery";
import { GET_FEATURED_TEAM_MEMBERS } from "./cqrs/queries/GetFeaturedTeamMembersQuery";
import { GET_PROCESS_PAGE } from "./cqrs/queries/GetProcessPageQuery";
import { GET_CONTACT_PAGE } from "./cqrs/queries/GetContactPageQuery";

import { GetHomepageHandler } from "./cqrs/handlers/queries/GetHomepageHandler";
import { GetGlobalHandler } from "./cqrs/handlers/queries/GetGlobalHandler";
import { GetFeaturedCaseStudiesHandler } from "./cqrs/handlers/queries/GetFeaturedCaseStudiesHandler";
import { GetLatestBlogPostsHandler } from "./cqrs/handlers/queries/GetLatestBlogPostsHandler";
import { GetAllPartnersHandler } from "./cqrs/handlers/queries/GetAllPartnersHandler";
import { GetClientLogosHandler } from "./cqrs/handlers/queries/GetClientLogosHandler";
import { GetAboutPageHandler } from "./cqrs/handlers/queries/GetAboutPageHandler";
import { GetFeaturedTeamMembersHandler } from "./cqrs/handlers/queries/GetFeaturedTeamMembersHandler";
import { GetProcessPageHandler } from "./cqrs/handlers/queries/GetProcessPageHandler";
import { GetContactPageHandler } from "./cqrs/handlers/queries/GetContactPageHandler";

import { HomepageService } from "./services/HomepageService";
import { GlobalService } from "./services/GlobalService";
import { CaseStudyService } from "./services/CaseStudyService";
import { BlogPostService } from "./services/BlogPostService";
import { PartnerService } from "./services/PartnerService";
import { AboutPageService } from "./services/AboutPageService";
import { TeamMemberService } from "./services/TeamMemberService";
import { ProcessPageService } from "./services/ProcessPageService";
import { ContactPageService } from "./services/ContactPageService";

import { HomepageController } from "./controllers/HomepageController";
import { GlobalController } from "./controllers/GlobalController";
import { CaseStudyController } from "./controllers/CaseStudyController";
import { BlogPostController } from "./controllers/BlogPostController";
import { PartnerController } from "./controllers/PartnerController";
import { AboutPageController } from "./controllers/AboutPageController";
import { TeamMemberController } from "./controllers/TeamMemberController";
import { ProcessPageController } from "./controllers/ProcessPageController";
import { ContactPageController } from "./controllers/ContactPageController";

interface Container {
  homepageController: HomepageController;
  globalController: GlobalController;
  caseStudyController: CaseStudyController;
  blogPostController: BlogPostController;
  partnerController: PartnerController;
  aboutPageController: AboutPageController;
  teamMemberController: TeamMemberController;
  processPageController: ProcessPageController;
  contactPageController: ContactPageController;
}

const CONTAINER_KEY = "__cnsContainer";
type ContainerGlobalStore = typeof globalThis & { [CONTAINER_KEY]?: Container };

/** Wire một lượt: repo → đăng ký handler → service → controller. */
function build(): Container {
  const queryBus = QueryBus.getInstance();

  const homepageRepo = new HomepageRepository();
  const globalRepo = new GlobalRepository();
  const caseStudyRepo = new CaseStudyRepository();
  const blogPostRepo = new BlogPostRepository();
  const partnerRepo = new PartnerRepository();
  const aboutPageRepo = new AboutPageRepository();
  const teamMemberRepo = new TeamMemberRepository();
  const processPageRepo = new ProcessPageRepository();
  const contactPageRepo = new ContactPageRepository();

  queryBus.register(GET_HOMEPAGE, new GetHomepageHandler(homepageRepo));
  queryBus.register(GET_GLOBAL, new GetGlobalHandler(globalRepo));
  queryBus.register(GET_FEATURED_CASE_STUDIES, new GetFeaturedCaseStudiesHandler(caseStudyRepo));
  queryBus.register(GET_LATEST_BLOG_POSTS, new GetLatestBlogPostsHandler(blogPostRepo));
  queryBus.register(GET_ALL_PARTNERS, new GetAllPartnersHandler(partnerRepo));
  queryBus.register(GET_CLIENT_LOGOS, new GetClientLogosHandler(aboutPageRepo));
  queryBus.register(GET_ABOUT_PAGE, new GetAboutPageHandler(aboutPageRepo));
  queryBus.register(GET_FEATURED_TEAM_MEMBERS, new GetFeaturedTeamMembersHandler(teamMemberRepo));
  queryBus.register(GET_PROCESS_PAGE, new GetProcessPageHandler(processPageRepo));
  queryBus.register(GET_CONTACT_PAGE, new GetContactPageHandler(contactPageRepo));

  return {
    homepageController: new HomepageController(new HomepageService(queryBus)),
    globalController: new GlobalController(new GlobalService(queryBus)),
    caseStudyController: new CaseStudyController(new CaseStudyService(queryBus)),
    blogPostController: new BlogPostController(new BlogPostService(queryBus)),
    partnerController: new PartnerController(new PartnerService(queryBus)),
    aboutPageController: new AboutPageController(new AboutPageService(queryBus)),
    teamMemberController: new TeamMemberController(new TeamMemberService(queryBus)),
    processPageController: new ProcessPageController(new ProcessPageService(queryBus)),
    contactPageController: new ContactPageController(new ContactPageService(queryBus)),
  };
}

/** Neo vào `globalThis` — HMR ở dev có thể nạp module này nhiều lần. */
function getOrBuildContainer(): Container {
  const store = globalThis as ContainerGlobalStore;
  if (!store[CONTAINER_KEY]) store[CONTAINER_KEY] = build();
  return store[CONTAINER_KEY];
}

const container = getOrBuildContainer();

export const homepageController = container.homepageController;
export const globalController = container.globalController;
export const caseStudyController = container.caseStudyController;
export const blogPostController = container.blogPostController;
export const partnerController = container.partnerController;
export const aboutPageController = container.aboutPageController;
export const teamMemberController = container.teamMemberController;
export const processPageController = container.processPageController;
export const contactPageController = container.contactPageController;
