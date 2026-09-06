import { BaseService } from "../core/BaseService";
import type { QueryBus } from "../cqrs/bus";
import { GetAllTestimonialsQuery } from "../cqrs/queries/GetAllTestimonialsQuery";
import type { Testimonial } from "../types/testimonial";

export class TestimonialService extends BaseService<QueryBus> {
  getAll(): Promise<Testimonial[] | null> {
    return this.bus.dispatch(new GetAllTestimonialsQuery());
  }
}
