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
import { CaseStudiesPageRepository } from "./repositories/strapi/CaseStudiesPageRepository";
import { CaseStudySettingRepository } from "./repositories/strapi/CaseStudySettingRepository";
import { ServicesPageRepository } from "./repositories/strapi/ServicesPageRepository";
import { ServiceRepository } from "./repositories/strapi/ServiceRepository";
import { ServiceSettingRepository } from "./repositories/strapi/ServiceSettingRepository";
import { TestimonialRepository } from "./repositories/strapi/TestimonialRepository";
import { ProductsPageRepository } from "./repositories/strapi/ProductsPageRepository";
import { ProductRepository } from "./repositories/strapi/ProductRepository";
import { ProductSettingRepository } from "./repositories/strapi/ProductSettingRepository";

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
import { GET_CASE_STUDIES_PAGE } from "./cqrs/queries/GetCaseStudiesPageQuery";
import { GET_CASE_STUDY_SETTING } from "./cqrs/queries/GetCaseStudySettingQuery";
import { GET_ALL_CASE_STUDIES } from "./cqrs/queries/GetAllCaseStudiesQuery";
import { GET_CASE_STUDY_BY_SLUG } from "./cqrs/queries/GetCaseStudyBySlugQuery";
import { GET_SERVICES_PAGE } from "./cqrs/queries/GetServicesPageQuery";
import { GET_ALL_SERVICES } from "./cqrs/queries/GetAllServicesQuery";
import { GET_SERVICE_BY_SLUG } from "./cqrs/queries/GetServiceBySlugQuery";
import { GET_SERVICE_SETTING } from "./cqrs/queries/GetServiceSettingQuery";
import { GET_ALL_TESTIMONIALS } from "./cqrs/queries/GetAllTestimonialsQuery";
import { GET_PRODUCTS_PAGE } from "./cqrs/queries/GetProductsPageQuery";
import { GET_ALL_PRODUCTS } from "./cqrs/queries/GetAllProductsQuery";
import { GET_PRODUCT_BY_SLUG } from "./cqrs/queries/GetProductBySlugQuery";
import { GET_PRODUCT_SETTING } from "./cqrs/queries/GetProductSettingQuery";

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
import { GetCaseStudiesPageHandler } from "./cqrs/handlers/queries/GetCaseStudiesPageHandler";
import { GetCaseStudySettingHandler } from "./cqrs/handlers/queries/GetCaseStudySettingHandler";
import { GetAllCaseStudiesHandler } from "./cqrs/handlers/queries/GetAllCaseStudiesHandler";
import { GetCaseStudyBySlugHandler } from "./cqrs/handlers/queries/GetCaseStudyBySlugHandler";
import { GetServicesPageHandler } from "./cqrs/handlers/queries/GetServicesPageHandler";
import { GetAllServicesHandler } from "./cqrs/handlers/queries/GetAllServicesHandler";
import { GetServiceBySlugHandler } from "./cqrs/handlers/queries/GetServiceBySlugHandler";
import { GetServiceSettingHandler } from "./cqrs/handlers/queries/GetServiceSettingHandler";
import { GetAllTestimonialsHandler } from "./cqrs/handlers/queries/GetAllTestimonialsHandler";
import { GetProductsPageHandler } from "./cqrs/handlers/queries/GetProductsPageHandler";
import { GetAllProductsHandler } from "./cqrs/handlers/queries/GetAllProductsHandler";
import { GetProductBySlugHandler } from "./cqrs/handlers/queries/GetProductBySlugHandler";
import { GetProductSettingHandler } from "./cqrs/handlers/queries/GetProductSettingHandler";

import { HomepageService } from "./services/HomepageService";
import { GlobalService } from "./services/GlobalService";
import { CaseStudyService } from "./services/CaseStudyService";
import { BlogPostService } from "./services/BlogPostService";
import { PartnerService } from "./services/PartnerService";
import { AboutPageService } from "./services/AboutPageService";
import { TeamMemberService } from "./services/TeamMemberService";
import { ProcessPageService } from "./services/ProcessPageService";
import { ContactPageService } from "./services/ContactPageService";
import { CaseStudiesPageService } from "./services/CaseStudiesPageService";
import { CaseStudySettingService } from "./services/CaseStudySettingService";
import { ServicesPageService } from "./services/ServicesPageService";
import { ServiceService } from "./services/ServiceService";
import { ServiceSettingService } from "./services/ServiceSettingService";
import { TestimonialService } from "./services/TestimonialService";
import { ProductsPageService } from "./services/ProductsPageService";
import { ProductService } from "./services/ProductService";
import { ProductSettingService } from "./services/ProductSettingService";

import { HomepageController } from "./controllers/HomepageController";
import { GlobalController } from "./controllers/GlobalController";
import { CaseStudyController } from "./controllers/CaseStudyController";
import { BlogPostController } from "./controllers/BlogPostController";
import { PartnerController } from "./controllers/PartnerController";
import { AboutPageController } from "./controllers/AboutPageController";
import { TeamMemberController } from "./controllers/TeamMemberController";
import { ProcessPageController } from "./controllers/ProcessPageController";
import { ContactPageController } from "./controllers/ContactPageController";
import { CaseStudiesPageController } from "./controllers/CaseStudiesPageController";
import { CaseStudySettingController } from "./controllers/CaseStudySettingController";
import { ServicesPageController } from "./controllers/ServicesPageController";
import { ServiceController } from "./controllers/ServiceController";
import { ServiceSettingController } from "./controllers/ServiceSettingController";
import { TestimonialController } from "./controllers/TestimonialController";
import { ProductsPageController } from "./controllers/ProductsPageController";
import { ProductController } from "./controllers/ProductController";
import { ProductSettingController } from "./controllers/ProductSettingController";

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
  caseStudiesPageController: CaseStudiesPageController;
  caseStudySettingController: CaseStudySettingController;
  servicesPageController: ServicesPageController;
  serviceController: ServiceController;
  serviceSettingController: ServiceSettingController;
  testimonialController: TestimonialController;
  productsPageController: ProductsPageController;
  productController: ProductController;
  productSettingController: ProductSettingController;
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
  const caseStudiesPageRepo = new CaseStudiesPageRepository();
  const caseStudySettingRepo = new CaseStudySettingRepository();
  const servicesPageRepo = new ServicesPageRepository();
  const serviceRepo = new ServiceRepository();
  const serviceSettingRepo = new ServiceSettingRepository();
  const testimonialRepo = new TestimonialRepository();
  const productsPageRepo = new ProductsPageRepository();
  const productRepo = new ProductRepository();
  const productSettingRepo = new ProductSettingRepository();

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
  queryBus.register(GET_CASE_STUDIES_PAGE, new GetCaseStudiesPageHandler(caseStudiesPageRepo));
  queryBus.register(GET_CASE_STUDY_SETTING, new GetCaseStudySettingHandler(caseStudySettingRepo));
  queryBus.register(GET_ALL_CASE_STUDIES, new GetAllCaseStudiesHandler(caseStudyRepo));
  queryBus.register(GET_CASE_STUDY_BY_SLUG, new GetCaseStudyBySlugHandler(caseStudyRepo));
  queryBus.register(GET_SERVICES_PAGE, new GetServicesPageHandler(servicesPageRepo));
  queryBus.register(GET_ALL_SERVICES, new GetAllServicesHandler(serviceRepo));
  queryBus.register(GET_SERVICE_BY_SLUG, new GetServiceBySlugHandler(serviceRepo));
  queryBus.register(GET_SERVICE_SETTING, new GetServiceSettingHandler(serviceSettingRepo));
  queryBus.register(GET_ALL_TESTIMONIALS, new GetAllTestimonialsHandler(testimonialRepo));
  queryBus.register(GET_PRODUCTS_PAGE, new GetProductsPageHandler(productsPageRepo));
  queryBus.register(GET_ALL_PRODUCTS, new GetAllProductsHandler(productRepo));
  queryBus.register(GET_PRODUCT_BY_SLUG, new GetProductBySlugHandler(productRepo));
  queryBus.register(GET_PRODUCT_SETTING, new GetProductSettingHandler(productSettingRepo));

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
    caseStudiesPageController: new CaseStudiesPageController(new CaseStudiesPageService(queryBus)),
    caseStudySettingController: new CaseStudySettingController(new CaseStudySettingService(queryBus)),
    servicesPageController: new ServicesPageController(new ServicesPageService(queryBus)),
    serviceController: new ServiceController(new ServiceService(queryBus)),
    serviceSettingController: new ServiceSettingController(new ServiceSettingService(queryBus)),
    testimonialController: new TestimonialController(new TestimonialService(queryBus)),
    productsPageController: new ProductsPageController(new ProductsPageService(queryBus)),
    productController: new ProductController(new ProductService(queryBus)),
    productSettingController: new ProductSettingController(new ProductSettingService(queryBus)),
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
export const caseStudiesPageController = container.caseStudiesPageController;
export const caseStudySettingController = container.caseStudySettingController;
export const servicesPageController = container.servicesPageController;
export const serviceController = container.serviceController;
export const serviceSettingController = container.serviceSettingController;
export const testimonialController = container.testimonialController;
export const productsPageController = container.productsPageController;
export const productController = container.productController;
export const productSettingController = container.productSettingController;
