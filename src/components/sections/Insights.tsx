import Image from "next/image";
import Link from "next/link";
import type { InsightViewData } from "@/lib/views/homeView";
import { Button, Tag } from "@/components/ui/button";
import { CalendarIcon, ClockIcon } from "@/components/icons";

export function Insights({ insights }: { insights: InsightViewData[] }) {
  return (
    <section className="resource-card py-24 lg:pt-20 lg:pb-[120px] bg-grey-50">
      <div className="container">
        <Tag className="mx-auto">Insight &amp; Guides</Tag>

        <h2 className="heading-2 font-medium mb-3 lg:mb-8 mt-3 flex flex-wrap gap-x-1 justify-center text-dark-blue-950">
          Latest Sourcing Insights
        </h2>

        <div className="flex flex-row flex-wrap w-full gap-6 md:gap-10 justify-center mt-10">
          {insights.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="flex md:w-[calc(50%-20px)] xl:w-[calc(33.33%-27px)] w-full bg-dark-blue-900 hover:bg-dark-blue-800 transition-all duration-300 text-white rounded-lg group overflow-hidden"
            >
              <div className="flex flex-col rounded-lg w-full">
                <div className="overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={533}
                    className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="body-3 text-dark-blue-400 font-medium px-6 pt-6 font-lora">
                  {post.category}
                </div>
                <h3 className="body-1 mt-2 mb-4 font-medium px-6 grow">
                  {post.title}
                </h3>
                <p className="body-3 font-medium text-dark-blue-400 px-6 grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 body-3 text-grey-200 px-6 pb-6 mt-20 font-lora">
                  <CalendarIcon className="w-6 h-6" />
                  <span className="font-lora">{post.date}</span>
                  <span className="w-px h-7 bg-grey-200" />
                  <ClockIcon className="w-6 h-6" />
                  <span className="font-lora">{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center mt-10">
          <Button href="/resources" withArrow>
            See All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}
