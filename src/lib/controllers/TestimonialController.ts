import { BaseController, type Result } from "../core/BaseController";
import type { TestimonialService } from "../services/TestimonialService";
import type { Testimonial } from "../types/testimonial";

export class TestimonialController extends BaseController {
  constructor(private readonly service: TestimonialService) {
    super();
  }

  getAll(): Promise<Result<Testimonial[]>> {
    return this.handle(() => this.service.getAll());
  }
}
