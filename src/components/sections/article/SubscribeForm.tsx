"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/button";
import { markSubscribed, useSubscribed } from "@/hooks/useSubscribed";

/**
 * `.resource-form` — the indigo panel that unlocks the article body.
 *
 * The original drops a HubSpot form into `#hubspot-form-container`, which
 * renders as a 352x150 cross-origin iframe; on success it sets
 * `localStorage.onelink_subscribed` and the gate lifts. Like the footer
 * newsletter (see TARGET.md deviation 2) the clone posts nowhere — but it does
 * set the same flag, because otherwise the article below could never be read.
 *
 * The whole section disappears once subscribed, which is what the theme's own
 * script does (`#subscribe-form { display: none }`).
 */
export function SubscribeForm({
  tag,
  heading,
  body,
}: {
  tag: string;
  heading: string;
  body: string;
}) {
  const subscribed = useSubscribed();
  const [email, setEmail] = useState("");

  if (subscribed) return null;

  return (
    <section className="resource-form mt-10">
      <div className="container py-[80px] bg-dark-blue-950 rounded-2xl mt-10">
        <div className="space-y-3 flex flex-col justify-center items-center w-4/5 max-w-[900px] mx-auto">
          <Tag className="mx-auto">{tag}</Tag>
          <h2 className="heading-2 font-semibold text-white text-center">
            {heading}
          </h2>
          <p className="text-dark-blue-400 body-2">{body}</p>

          {/* The original's HubSpot iframe is 352x154: a bold "Email" label with
              HubSpot's red required marker, an underlined field with no
              placeholder, then a small white Submit centred beneath — not a
              full-width button. Rebuilt at the same measurements. */}
          <form
            className="w-full lg:w-[352px] mx-auto min-h-[154px] pb-5"
            aria-label="Subscribe for full access"
            onSubmit={(e) => {
              e.preventDefault();
              markSubscribed();
            }}
          >
            <label
              htmlFor="subscribe-email"
              className="block text-white text-[13px] font-bold leading-[15px]"
            >
              Email
              <span className="text-[#f2545b]">*</span>
            </label>
            <input
              id="subscribe-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-[6px] w-full h-[40px] bg-transparent border-b border-white text-white outline-none"
            />
            <div className="flex justify-center mt-[35px]">
              <button
                type="submit"
                className="bg-white text-dark-blue-900 text-[13px] font-bold leading-[18px] rounded px-6 py-[10px] duration-300 hover:bg-dark-blue-50 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
