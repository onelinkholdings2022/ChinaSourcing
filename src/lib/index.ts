// ─── Public API của lib backend ──────────────────────────────────────────────
// FE chỉ import từ đây (controllers) + từ ./types/* (kiểu) + ./api/media-url.
// Refactor nội bộ (repo/handler/bus) không được đổi các export này.

export {
  homepageController,
  globalController,
  caseStudyController,
  blogPostController,
  partnerController,
  aboutPageController,
  teamMemberController,
  processPageController,
  contactPageController,
  caseStudiesPageController,
  caseStudySettingController,
  servicesPageController,
  serviceController,
  serviceSettingController,
  testimonialController,
  productsPageController,
  productController,
  productSettingController,
  resourcesPageController,
  resourceSettingController,
  resourceController,
  categoryController,
} from "./container";

export { getMediaUrl, mediaWidth, mediaHeight, mediaAlt } from "./api/media-url";
export { STRAPI_URL } from "./api/strapi-client";

export type { Result } from "./core/BaseController";
export type { HomepageData } from "./types/homepage";
export type { GlobalData, NavItem, FooterColumn, FooterLocation, SocialLink } from "./types/global";
export type { CaseStudy } from "./types/case-study";
export type { BlogPost } from "./types/blog-post";
export type { Partner, PartnerCategory } from "./types/partner";
export type { AboutPageData } from "./types/about-page";
export type { TeamMember } from "./types/team-member";
export type { StrapiMedia, StrapiButton, StrapiTag, StrapiSeo } from "./types/strapi";
export type { ServicesPageData, ServiceData, ServiceSettingData } from "./types/services-page";
export type { Testimonial } from "./types/testimonial";
export type { Resource } from "./types/resource";
export type { Category } from "./types/category";
export type { ProductsPageData, ProductData, ProductSettingData } from "./types/products-page";
export type { ResourcesPageData, ResourceSettingData } from "./types/resources-page";
