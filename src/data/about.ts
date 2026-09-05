import { IMG } from "@/data/site";

/**
 * Content of `/about-us`, lifted verbatim from the live page.
 *
 * Text is copy-pasted rather than retyped — the curly apostrophes and the
 * spacing quirks ("products , we build") are the original's, not typos of ours.
 */

export const aboutHero = {
  heading: "About China Sourcing Co",
  intro:
    "Our mission is to connect you with the best factories in Asia, ensuring you get the highest quality products at the best possible prices.",
  image: `${IMG}/china-sourcing-about-us.png`,
  imageAlt: "Trucks",
};

/** The rail label and the panel heading are the same string on About — the
 * original repeats it, unlike /process which has a separate "Step N". */
export const journey = {
  tag: "Our Journey",
  heading: "From Vision to Impact",
  ship: `${IMG}/Ship.png`,
  milestones: [
    {
      rail: "2020: Where It All Started",
      title: "2020: Where It All Started",
      body: "After a decade of hands-on experience across China and Asia, Tom and Sam launched OneLink to provide importers with a reliable, on the ground supply chain partner they can trust.",
    },
    {
      rail: "2021: Building the Foundation",
      title: "2021: Building the Foundation",
      body: "We built a vetted factory network across China and Vietnam, formalized our QA playbook, and hired core team members across sourcing,  production, quality control and freight.",
    },
    {
      rail: "2022: Growing With Our Clients",
      title: "2022: Growing With Our Clients",
      body: "The addition of new brands across industries, including hotel furniture and packaging, led to a doubling in order volume, validating our model's ability to scale while maintaining full operational control.",
    },
    {
      rail: "2023: Going Global",
      title: "2023: Going Global",
      body: "With the launch of our Australia office, clients now benefit from 24 hour coverage and seamless multi country sourcing across APAC, Australia, and the U.S.",
    },
    {
      rail: "2024: Scaling With Purpose",
      title: "2024: Scaling With Purpose",
      body: "As of 2024, OneLink has a growing team of 21 members operating across Asia, America, Australia, and Europe.",
    },
    {
      rail: "2025: And This Is Just the Beginning",
      title: "2025: And This Is Just the Beginning",
      body: "To better connect with global buyers and address their sourcing needs, we rebranded as China Sourcing Co, a name that underscores our deep expertise and strong capabilities with sourcing in China.",
    },
  ],
};

export const founderQuote = {
  tag: "From Our Founder",
  avatar: `${IMG}/Images.png`,
  name: "Sam Sheehan",
  role: "Director",
  paragraphs: [
    "We started China Sourcing Co after years of working within product-based businesses across various industries. Throughout that journey, we encountered the same recurring challenges gaps in communication, lack of transparency, delayed timelines, and a general disconnect between vision and execution.",
    "We knew there had to be a better way, one that offered clarity, speed, and a true sense of partnership from idea to shelf. China Sourcing Co was built to be that better way.",
  ],
};

/** The marquee order on this page differs from the homepage's. */
export const aboutLogos = [
  `${IMG}/image-85.png`,
  `${IMG}/image-88.png`,
  `${IMG}/image-91.png`,
  `${IMG}/image-93.png`,
  `${IMG}/image-89.png`,
  `${IMG}/image-86.png`,
  `${IMG}/image-87.png`,
];

export const coreValues = {
  tag: "Our Core Value",
  heading: "Mission, Vision & Values",
  cards: [
    {
      icon: `${IMG}/Vision.png`,
      title: "Vision",
      body: "Simplifying sourcing from Asia with transparency and trust for global brands.",
    },
    {
      icon: `${IMG}/Mission.png`,
      title: "Mission",
      body: "Connecting businesses with the best factories in Asia and ensure they receive the highest quality products at the best price.",
    },
    {
      icon: `${IMG}/Values.png`,
      title: "Core Values",
      body: "China Sourcing Co is built on acting in customers’ best interests and understanding their quality needs through real experience and training.",
    },
  ],
};

export const reasons = {
  tag: "What We Do Best",
  heading: "The Reasons to Choose Us",
  intro:
    "We’re not just sourcing agents, we are your “on-the-ground” team, making sure you’re happy with every product you receive.",
  icon: `${IMG}/star-05.png`,
  image: `${IMG}/china-sourcing-container.png`,
  items: [
    {
      title: "Work With Local Experts",
      body: "Manage all parts of the supply chain to ensure you’re truly happy with the results.",
    },
    {
      title: "Remove Language Barriers",
      body: "Communicate effortlessly with our fluent, English-speaking local team.",
    },
    {
      title: "Simplify Communication",
      body: "Coordinate all moving parts of the supply chain through a single point of contact for faster, smoother execution.",
    },
    {
      title: "Reduce Sourcing Costs",
      body: "Leverage our trusted supplier network to secure more competitive pricing.",
    },
    {
      title: "Use Trusted Factories",
      body: "Work with vetted factories we’ve already tested and approved.",
    },
    {
      title: "Ensure Product Quality",
      body: "Conduct inspections at every stage to guarantee consistent, high-quality products.",
    },
  ],
};

export type TeamMember = {
  name: string;
  position: string;
  description: string;
  image: string;
};

export const team = {
  tag: "Humans of China Sourcing Co",
  heading: "Meet the Team",
  intro:
    "We’re a team of supply chain experts strategically located around the world’s manufacturing hubs to deliver great service and ensure our clients are satisfied.",
  members: [
    {
      name: "Sam Sheehan",
      position: "Co Founder",
      description:
        "As a Director at China Sourcing Co, Sam leverages his entrepreneurial background from founding product businesses to benefit clients. His firsthand exploration of Asia's manufacturing landscape provides a deep understanding of supply chain dynamics. Based in Brisbane, Sam ensures OneLink's clients achieve their goals through sourcing and manufacturing solutions.",
      image: `${IMG}/china-sourcing-team-member-sam-scaled.jpg`,
    },
    {
      name: "Tom Daniels",
      position: "Co Founder",
      description:
        "As a Director at China Sourcing Co, Tom leads Asia-based operations from China and Vietnam. His passion for Asian cultures, combined with a deep commitment to quality and operational excellence, ensures rigorous management of the supply chain and guarantees that all orders consistently adhere to the highest standards.",
      image: `${IMG}/china-sourcing-team-member-tom-scaled.jpg`,
    },
    {
      name: "Lee Abrahams",
      position: "Business Development Manager",
      description:
        "Based in Sydney, Lee drives OneLink's development across Australia and the United States. He acts as the key liaison between regional teams to ensure seamless coordination and alignment. Known for his approachable and customer-focused style, Lee prioritizes direct communication, engaging with clients to foster strong, lasting relationships.",
      image: `${IMG}/china-sourcing-team-member-lee-scaled.jpg`,
    },
    {
      name: "Janice Xu",
      position: "Senior Sourcing",
      description:
        "As a key member of our Sourcing team, Janice uses her excellent communication and customer focus to help clients succeed. With her outgoing personality and positive attitude, Janice builds strong relationships with both customers and suppliers, making her a trusted and reliable point of contact throughout the sourcing journey.",
      image: `${IMG}/china-sourcing-team-member-janice-scaled.jpg`,
    },
    {
      name: "Miguel Misa",
      position: "Business Development",
      description:
        "Miguel is a key member of our Business Development team, with a deep understanding of customer needs and how to deliver tailored sourcing solutions that drive success. With a strong focus on relationship-building, Miguel takes the time to understand each client’s unique challenges and ensures that OneLink’s services are aligned to meet their goals.",
      image: `${IMG}/china-sourcing-team-member-long-miguel-scaled.jpg`,
    },
    {
      name: "Kady Hoang",
      position: "Vietnam Manager",
      description:
        "Kady is our exceptional Office Manager in Vietnam. A true maestro at navigating the intricacies of business in this dynamic environment, Kady effortlessly ensures the smooth functioning of our operations.",
      image: `${IMG}/china-sourcing-team-member-kady-scaled.jpg`,
    },
    {
      name: "Germaine Huang",
      position: "Senior Sourcing",
      description:
        "Germaine is a highly experienced Senior Sourcing Specialist at China Sourcing, with a strong background in global supply chains and supplier negotiation. Her deep industry knowledge and hands-on approach ensure that customers consistently receive the best possible value without compromising on quality or timelines.",
      image: `${IMG}/china-sourcing-team-member-germaine-scaled.jpg`,
    },
    {
      name: "Jessie Yi",
      position: "Quality Control Manager",
      description:
        "As Quality Control Manager, Jessie uses her sharp attention to detail and commitment to excellence to ensure every product meets the highest standards. Her deep understanding of manufacturing processes and quality assurance protocols ensures that China Sourcing consistently delivers reliable, high-quality results across all projects.",
      image: `${IMG}/china-sourcing-team-member-jessie-scaled.jpg`,
    },
    {
      name: "Nga Van",
      position: "Accountant",
      description:
        "Nga takes a meticulous and efficient approach to financial management. She has developed streamlined systems for customer payments and workflows, ensuring a smooth and easy process. Her attention to detail and commitment to clear, transparent processes make her a vital part of ensuring a seamless experience for both our team and our clients.",
      image: `${IMG}/china-sourcing-team-member-nga-scaled.jpg`,
    },
    {
      name: "Quang Ho",
      position: "Marketing Manager",
      description:
        "Quang leads all marketing efforts with a strategic approach and exceptional management skills. He aligns internal brand objectives with the unique needs of our customers, ensuring all marketing services are defined by cost-efficiency, speed of execution, and high-quality output. This approach provides clients with effective, timely support that drives real results.",
      image: `${IMG}/china-sourcing-team-member-quang-scaled.jpg`,
    },
    {
      name: "Bheki Mhlanga",
      position: "General Manager",
      description:
        "As General Manager, Bheki leverages deep expertise from years of living and working in China. His hands on knowledge of supply chains, factory operations, and business culture is invaluable. He plays a key role in supplier management, quality assurance, and ensuring smooth production for our customers.",
      image: `${IMG}/china-sourcing-team-member-bheki-scaled.jpg`,
    },
    {
      name: "Jennifer Zhuang",
      position: "Senior Sourcing",
      description:
        "As a key member of our Senior Sourcing team, Jennifer is known for her speed, precision, and customer first mindset. She delivers critical information quickly and accurately, enabling clients to move forward with confidence. Dedicated and proactive, Jennifer is a dependable partner who consistently goes above and beyond for our customers.",
      image: `${IMG}/china-sourcing-team-member-jenifer-scaled.jpg`,
    },
    {
      name: "Thao Ngo",
      position: "Senior Sourcing (Vietnam Office)",
      description:
        "Thao helps customers diversify their supply chains with confidence. She connects clients with Vietnam’s best manufacturers to ensure consistent, high quality production. Thao's cheerful and thoughtful approach makes her a reliable and friendly point of contact throughout your sourcing journey.",
      image: `${IMG}/china-sourcing-team-member-thao-scaled.jpg`,
    },
    {
      name: "Trang Hoang",
      position: "Visual Designer",
      description:
        "Trang specializes in visual storytelling through clean and intentional design. Her work spans branding, social content, and UI assets, all with a consistent and modern aesthetic. With a sharp eye for detail, her approach blends creativity with brand logic, creating visual systems that not only look good but feel aligned and serve a distinct purpose.",
      image: `${IMG}/china-sourcing-team-member-trang-scaled.jpg`,
    },
    {
      name: "Tuan Nguyen",
      position: "SEO & Web Specialist",
      description:
        "Tuan focuses on building websites that rank, load fast and perform well. From optimizing technical SEO to refining site architecture, he ensures every project meets search and user experience standards. He brings a problem-solving mindset to development and works closely with design and content team to ensure smooth integration.",
      image: `${IMG}/china-sourcing-team-member-tuan-scaled.jpg`,
    },
    {
      name: "Long Nguyen",
      position: "Content & Growth Specialist",
      description:
        "Long creates high-impact content by using keyword research and audience insights to turn search intent into strategic content. He builds organic growth systems across platforms like LinkedIn, Instagram, and SEO blogs, crafting every piece to resonate with audiences, rank in search results, and convert.",
      image: `${IMG}/china-sourcing-team-member-long-scaled.jpg`,
    },
  ] satisfies TeamMember[],
  localHeading: "Local teams on the ground",
  offices: [
    {
      flag: `${IMG}/CN.png`,
      alt: "China ",
      country: "China",
      body: "Product development, factory communication, QC inspections",
    },
    {
      flag: `${IMG}/Hong-Kong-flag-1.png`,
      alt: "Hong Kong",
      country: "Hong Kong",
      body: "Supplier vetting, custom manufacturing coordination",
    },
    {
      flag: `${IMG}/VN.png`,
      alt: "Vietnam",
      country: "Vietnam",
      body: "Client support, onboarding, timezone-aligned communication",
    },
    {
      flag: `${IMG}/AU.png`,
      alt: "Australia",
      country: "Australia",
      body: "Client support, onboarding, timezone-aligned communication",
    },
  ],
};

export const aboutCaseStudies = {
  tag: "Real Outcomes",
  headingLines: ["Explore Real Businesses.", "Real Results."],
  cards: [
    {
      title: "TAG Apparel",
      body: "TAG Apparel is a performance-driven running apparel brand focused on creating high-quality, comfortable, and durable gear for athletes and active lifestyles. Built by runners for runners, their products are designed to withstand tough conditions while delivering style and function.",
      href: "/case-study/tag-apparel",
      image: `${IMG}/china-sourcing-tag-apparel-1024x667.png`,
      alt: "tag apparel case study",
    },
    {
      title: "Prestige Residential",
      body: "Ben and his team at Prestige Residential manage a portfolio of high-end apartment buildings across Queensland and Australia, providing quality living experiences for their residents and guests.",
      href: "/case-study/prestige-residential",
      image: `${IMG}/china-sourcing-prestige-residential-1024x667.png`,
      alt: "prestige residential case study",
    },
    {
      title: "Muscle Mat",
      body: "Muscle Mat is a growing online brand that specialises in comfort-focused home products including pillows, mattress toppers, rugs, and wellness accessories. With a strong emphasis on quality and customer satisfaction, they’ve built a loyal following in the e-commerce space.",
      href: "/case-study/muscle-mat",
      image: `${IMG}/china-sourcing-muscle-mat-1-1-1024x667.png`,
      alt: "muscle mat case study",
    },
  ],
};

export const brandTabs = {
  tag: "Behind the Brand",
  heading: "The Why Behind Us",
  slides: [
    {
      label: "Culture",
      subheading: "How we show up, not just where we work",
      title: "Culture",
      paragraphs: [
        "At China Sourcing Co, culture is reflected through our actions.",
        "We maintain a hands-on, proactive approach with meticulous attention to detail. From factory floors in China to client communications worldwide, our team operates cohesively, built on trust, efficiency, and unwavering accountability.",
      ],
      image: `${IMG}/china-sourcing-culture.png`,
      alt: "china sourcing culture",
      nextLabel: "Brand Personality",
    },
    {
      label: "Brand Personality",
      subheading: "How we talk, act and lead",
      title: "Brand Personality",
      paragraphs: [
        "We prioritize transparency: clear, direct, and consistently reliable.",
        "No unnecessary embellishments or empty promises, just precise execution, prompt responses, and complete visibility. This is exactly what global buyers require when sourcing from China.",
      ],
      image: `${IMG}/china-sourcing-community.png`,
      alt: "china sourcing brand personality",
      nextLabel: "Community & Impact",
    },
    {
      label: "Community & Impact",
      subheading: "Why we do more than deliver",
      title: "Community & Impact",
      paragraphs: [
        "We don’t simply move products , we build stronger, more responsible supply chains.",
        "This commitment includes fair factory practices, ethical partnerships, and a focus on long-term sustainability. Because doing business responsibly in China means doing right by all.",
      ],
      image: `${IMG}/china-sourcing-community-1024x797.jpg`,
      alt: "china sourcing community and impact",
    },
  ],
};

export const aboutCta = {
  tag: "Let’s Build Your China Supply Chain",
  heading:
    "Ready to work with a sourcing team that’s built for real-world results?",
  body: "From first quote to final delivery, China Sourcing Co helps you simplify sourcing, reduce risks, and scale with confidence.",
  cta: "Start Your Project",
};
