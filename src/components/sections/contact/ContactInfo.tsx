import Image from "next/image";
import { Tag } from "@/components/ui/button";
import { HubspotForm } from "@/components/sections/contact/HubspotForm";

export type ContactDetailCard = {
  icon: string;
  label: string;
  value: string;
  href?: string;
};

export type ContactSocialLink = { href: string; image: string; alt: string };

export type ContactSocial = {
  icon: string;
  label: string;
  links: ContactSocialLink[];
};

export type ContactHubspotForm = { portalId: string; formId: string; region?: string };

/**
 * The indigo band: contact details on the left, the "Get In Touch" form on the
 * right.
 *
 * A 12-column grid where the two halves do not meet — the copy takes columns
 * 1–6 and the form starts at column 8, so there is a full empty column between
 * them on top of the 48px gap.
 *
 * The theme writes `space-y-10` on this column and then overrides every gap it
 * would create — `!mt-3`, `!mt-3`, `lg:!mt-20` — so the spacing utility has no
 * effect on the original at all. It is dropped here rather than carried over
 * with two layers of `!`, because Tailwind v4 would not reproduce it anyway:
 * v3's `space-y-*` sets `margin-top`, which an `mt-*` on the child replaces,
 * while v4's sets `margin-bottom`, which merely collapses against it — the
 * larger of the two wins and the column comes out 56px too tall.
 *
 * The gaps that survive are 12 / 12 / 48, and 80 at `lg` for the last.
 */
export function ContactInfo({
  tag,
  heading,
  intro,
  details,
  social,
  form,
}: {
  tag: string;
  heading: string;
  intro: string;
  details: ContactDetailCard[];
  social: ContactSocial;
  form: ContactHubspotForm;
}) {
  return (
    <section className="bg-dark-blue-950 py-16 md:py-24 lg:py-32 text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:justify-between">
          <div className="lg:col-span-6 max-w-[640px]">
            <div className="w-fit">
              <Tag>{tag}</Tag>
            </div>

            <h2 className="heading-2 font-semibold mt-3 capitalize">
              {heading}
            </h2>
            <p className="body-2 text-dark-blue-400 mt-3">{intro}</p>

            <div className="gap-10 mt-12 lg:mt-20 grid lg:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="flex items-start gap-4">
                  <Image
                    src={detail.icon}
                    alt={detail.label}
                    width={24}
                    height={24}
                    className="w-6 h-6 mt-1 xl:mt-[6px]"
                  />
                  <div>
                    <div className="body-1 text-white font-semibold mb-1">
                      {detail.label}
                    </div>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="text-dark-blue-400 body-2 hover:text-primary transition-colors"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span className="text-dark-blue-400 body-2 cursor-default">
                        {detail.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <Image
                  src={social.icon}
                  alt={social.label}
                  width={24}
                  height={24}
                  className="w-6 h-6 mt-1 xl:mt-[6px]"
                />
                <div>
                  <div className="body-1 text-white font-semibold mb-1">
                    {social.label}
                  </div>
                  <span className="text-dark-blue-400 body-2 flex gap-x-4">
                    {social.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          src={link.image}
                          alt={link.alt}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </a>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 p-6 md:p-8 lg:p-10 rounded-lg shadow-lg lg:col-span-5 lg:col-start-8">
            <HubspotForm
              portalId={form.portalId}
              formId={form.formId}
              region={form.region}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
