import { StrapiBaseRepository } from "../../core/BaseRepository";
import type { Testimonial } from "../../types/testimonial";

export class TestimonialRepository extends StrapiBaseRepository<Testimonial> {
  protected getBaseEndpoint() {
    return "/api/testimonials";
  }

  /** Toàn bộ testimonial — nhóm theo `product.id` ở tầng view (services.testimonial-tab). */
  getAll(): Promise<Testimonial[]> {
    return this.fetchList<Testimonial>("/testimonials?sort=order:asc&pagination[pageSize]=100", {
      revalidate: 3600,
      tags: ["strapi", "testimonial"],
    });
  }
}
