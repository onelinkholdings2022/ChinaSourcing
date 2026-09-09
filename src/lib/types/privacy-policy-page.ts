import type { StrapiSeo } from "./strapi";

/** Một cụm `<h3>` + thân bài WYSIWYG — component `legal.text-section`. */
export interface LegalTextSection {
  id: number;
  heading: string | null;
  /** HTML do CKEditor sinh. */
  body: string | null;
}

export interface PrivacyPolicyPageData {
  id: number;
  documentId?: string;
  title: string | null;
  intro: string | null;
  sections: LegalTextSection[];
  seo?: StrapiSeo | null;
}
