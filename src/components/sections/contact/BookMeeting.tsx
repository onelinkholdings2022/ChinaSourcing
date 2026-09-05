import { Tag } from "@/components/ui/button";
import { HubspotMeetings } from "@/components/sections/contact/HubspotMeetings";

/**
 * `.book-meeting-form` — the pale blue band holding the booking calendar.
 *
 * The heading carries `leading-[1.3333]` rather than `heading-2`'s own
 * line-height, which is why it sits tighter than every other section heading on
 * the site.
 */
export function BookMeeting({
  tag,
  heading,
  intro,
  meetingsSrc,
}: {
  tag: string;
  heading: string;
  intro: string;
  meetingsSrc: string;
}) {
  return (
    <section className="book-meeting-form bg-cyan-50 spacing">
      <div className="container">
        <Tag className="mx-auto">{tag}</Tag>

        <h2 className="heading-2 leading-[1.3333] text-cyan-400 font-semibold mb-5 lg:mb-10 text-center mt-3 max-w-[800px] mx-auto">
          {heading}
        </h2>

        <p className="body-2 leading-7 text-grey-600 mb-2 text-center max-w-[450px] mx-auto">
          {intro}
        </p>

        <div className="form-embed max-w-[800px] mx-auto">
          <HubspotMeetings src={meetingsSrc} />
        </div>
      </div>
    </section>
  );
}
