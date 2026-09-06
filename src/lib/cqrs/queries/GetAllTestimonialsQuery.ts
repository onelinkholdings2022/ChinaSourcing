import type { IQuery } from "../bus";
import type { Testimonial } from "../../types/testimonial";

export const GET_ALL_TESTIMONIALS = "testimonial/GetAll";

export class GetAllTestimonialsQuery implements IQuery<Testimonial[]> {
  readonly type = GET_ALL_TESTIMONIALS;
}
