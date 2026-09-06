import type { IQueryHandler } from "../../bus";
import type { GetAllTestimonialsQuery } from "../../queries/GetAllTestimonialsQuery";
import type { TestimonialRepository } from "../../../repositories/strapi/TestimonialRepository";
import type { Testimonial } from "../../../types/testimonial";

export class GetAllTestimonialsHandler implements IQueryHandler<GetAllTestimonialsQuery, Testimonial[]> {
  constructor(private readonly repo: TestimonialRepository) {}

  execute(): Promise<Testimonial[]> {
    return this.repo.getAll();
  }
}
