import type { StrapiButton, StrapiMedia, StrapiSeo } from "./strapi";

export interface NavLink {
  id: number;
  label: string | null;
  url: string | null;
}

export interface NavItem extends NavLink {
  children: NavLink[];
}

export interface NavbarData {
  logo: StrapiMedia | null;
  ctaButton: StrapiButton | null;
  menuItems: NavItem[];
}

export interface SocialLink {
  id: number;
  name: string | null;
  url: string | null;
  icon: StrapiMedia | null;
}

export interface FooterColumnLink {
  id: number;
  label: string | null;
  url: string | null;
}

export interface FooterColumn {
  id: number;
  title: string | null;
  links: FooterColumnLink[];
  hasSeeMore: boolean;
  seeMoreUrl: string | null;
}

export interface FooterLocation {
  id: number;
  name: string | null;
  address: string | null;
  email: string | null;
}

export interface FooterNewsletter {
  eyebrow: string | null;
  heading: string | null;
  placeholder: string | null;
  buttonLabel: string | null;
}

export interface FooterData {
  logo: StrapiMedia | null;
  newsletter: FooterNewsletter | null;
  linkColumns: FooterColumn[];
  locations: FooterLocation[];
  socialMedia: SocialLink[];
  copyright: string | null;
  legalLinks: FooterColumnLink[];
}

export interface GlobalData {
  defaultSeo: StrapiSeo | null;
  navbar: NavbarData;
  footer: FooterData;
}
