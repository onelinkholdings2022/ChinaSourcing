import Image from "next/image";

/**
 * Infinite logo strip. The list is rendered twice and the track is translated
 * by -50%, so the loop is seamless. Edge fades sit on top at both ends.
 */
export function LogoMarquee({ clientLogos }: { clientLogos: string[] }) {
  const loop = [...clientLogos, ...clientLogos];

  return (
    <section className="container text-center lg:py-[80px] py-[60px]">
      <div className="overflow-hidden relative">
        <div className="absolute z-[2] w-16 h-full top-0 left-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute z-[2] w-16 h-full top-0 right-0 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee">
          {loop.map((logo, i) => (
            <div key={`${logo}-${i}`} className="px-8 shrink-0">
              <Image
                src={logo}
                alt=""
                width={100}
                height={100}
                className="size-[100px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
