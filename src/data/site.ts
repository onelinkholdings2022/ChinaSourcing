/**
 * All page content, hard-coded for now.
 * When the site moves to a CMS, swap these exports for fetched data —
 * the components only read from here.
 */

export const IMG = "/images";

export const nav = [
  { label: "About Us", href: "/about-us" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
];

export const hero = {
  heading: "Bringing Asia's best factories to you",
  /** Words cycled by the typewriter effect */
  words: [
    "Simple",
    "High Quality",
    "Risk Free",
    "Reliable",
    "Compliant",
    "Flexible",
    "Transparent",
  ],
  subheading: "Your Trusted Sourcing & Procurement Partner in Asia.",
  cta: { idle: "Say Hi!", hover: "Book a Free Consultation" },
  poster: `${IMG}/Screenshot-2025-05-15-at-11.11.34.png`,
};

export type ServiceCard = {
  title: string;
  description: string;
  image: string;
};

export const serviceTabs: { label: string; cards: ServiceCard[] }[] = [
  {
    label: "For E-commerce",
    cards: [
      {
        title: "Product Sourcing",
        description:
          "Sourcing, negotiation, QA and cost-effective procurement, our local team delivers fast, reliable solutions from Asia's top manufacturing hubs.",
        image: `${IMG}/china-sourcing-product-sourcing.png`,
      },
      {
        title: "Quality Control",
        description:
          "Ensure quality from raw materials to delivery. Conduct audits, inspect production and apply strict QA across every stage of the sourcing process.",
        image: `${IMG}/china-sourcing-quality-control.png`,
      },
      {
        title: "Freight & Logistics",
        description:
          "Oversee end-to-end delivery. Offer air, sea, road and rail freight with cost-effective, flexible options to get your goods where they need to be.",
        image: `${IMG}/freight-and-logistics.png`,
      },
      {
        title: "Warehousing & Fulfillment",
        description:
          "Manage storage and fulfillment with ease. Optimize inventory, speed up delivery and ensure accurate, on-time order processing every step of the way.",
        image: `${IMG}/warehousing-and-fulfillment.png`,
      },
      {
        title: "Product Research",
        description:
          "Identify winning products with in-house research. Analyze demand, competition and margin to suggest what to sell and how to position it for success.",
        image: `${IMG}/china-sourcing-product-research.png`,
      },
      {
        title: "Graphic Design",
        description:
          "Deliver high-impact branding at lower cost. Design logos, build brand identity and create guidelines without compromising on quality or budget.",
        image: `${IMG}/graphic-design.png`,
      },
      {
        title: "Photo & Videography",
        description:
          "Produce stunning photos and videos with our Asia-based team. Leverage talent, scenery and cost savings without sacrificing quality.",
        image: `${IMG}/photo-videography.png`,
      },
      {
        title: "Content Creation (UGC)",
        description:
          "Outsource UGC to Asia for cost savings, fast turnaround, multilingual talent and cultural insight so you can stay focused on your core business.",
        image: `${IMG}/china-sourcing-content-creation.png`,
      },
    ],
  },
  {
    label: "For Medium to Large Businesses",
    cards: [
      {
        title: "Factory & Supplier Audit",
        description:
          "Conduct factory audits covering QMS, social compliance, HSE and supply chain security, ensuring your suppliers meet global standards and client expectations.",
        image: `${IMG}/factory-supplier-audit.png`,
      },
      {
        title: "IP Protection",
        description:
          "Protect your IP with tailored contracts and NDAs. Work confidently with factories worldwide knowing your designs and ideas stay exclusively yours.",
        image: `${IMG}/ip-protection.png`,
      },
      {
        title: "Sourcing & Procurement",
        description:
          "Simplify your supply chain with one point of contact. Manage trusted or existing suppliers through our multilingual team for a smooth, end-to-end experience.",
        image: `${IMG}/sourcing-procurement.png`,
      },
      {
        title: "Quality Control",
        description:
          "Ensure quality at every step, from raw material checks to audits, in-line and final inspections and container loading for consistently high product standards.",
        image: `${IMG}/Image-20.png`,
      },
      {
        title: "Freight & Logistics",
        description:
          "Manage freight end-to-end with air, sea, road and rail options. Deliver goods seamlessly while giving you flexible, cost-effective shipping control.",
        image: `${IMG}/Image-21.png`,
      },
      {
        title: "Warehousing & Fulfillment",
        description:
          "Outsource logistics to trusted 3PL partners. Streamline your supply chain and enhance customer experience with fast, seamless order fulfillment.",
        image: `${IMG}/Image-22.png`,
      },
      {
        title: "Custom Manufacturing",
        description:
          "Develop custom products with precision. Turn concepts into scalable, production-ready goods, tailored to your specs, budget, and market needs.",
        image: `${IMG}/china-sourcing-custom-manufacturing-1.png`,
      },
    ],
  },
];

export const usps = [
  {
    title: "Work With Local Experts",
    description:
      "Work with our on the ground team to ensure everything meets your standards.",
    image: `${IMG}/china-sourcing-team-300x300.png`,
  },
  {
    title: "Remove Language Barriers",
    description: "Communicate clearly with our fluent, English-speaking team.",
    image: `${IMG}/china-sourcing-team-3-300x300.png`,
  },
  {
    title: "Simplify Communication",
    description:
      "Coordinate through one point of contact for all of your supply chain needs.",
    image: `${IMG}/china-sourcing-team-4-300x300.png`,
  },
  {
    title: "Maximize Profits",
    description: "Access better prices through our strong supplier relationships.",
    image: `${IMG}/china-sourcing-team-2-300x300.png`,
  },
  {
    title: "Use Trusted Factories",
    description:
      "Work with our trusted manufacturing partners that we've already tested and approved.",
    image: `${IMG}/china-sourcing-trusted-factories-1-300x300.png`,
  },
  {
    title: "Ensure Product Quality",
    description:
      "Inspections at every stage to guarantee consistent, high-quality output.",
    image: `${IMG}/china-sourcing-team-1-300x300.png`,
  },
];

export const caseStudies = [
  {
    title: "TAG Apparel",
    description:
      "TAG Apparel is a performance-driven running apparel brand focused on creating high-quality, comfortable, and durable gear for athletes and active lifestyles. Built by runners for runners, their products are designed to withstand tough conditions while delivering style and function.",
    image: `${IMG}/china-sourcing-tag-apparel-1024x667.png`,
    href: "/case-studies/tag-apparel",
  },
  {
    title: "Prestige Residential",
    description:
      "Ben and his team at Prestige Residential manage a portfolio of high-end apartment buildings across Queensland and Australia, providing quality living experiences for their residents and guests.",
    image: `${IMG}/china-sourcing-prestige-residential-1024x667.png`,
    href: "/case-studies/prestige-residential",
  },
  {
    title: "Muscle Mat",
    description:
      "Muscle Mat is a growing online brand that specialises in comfort-focused home products including pillows, mattress toppers, rugs, and wellness accessories. With a strong emphasis on quality and customer satisfaction, they've built a loyal following in the e-commerce space.",
    image: `${IMG}/china-sourcing-muscle-mat-1-1-1024x667.png`,
    href: "/case-studies/muscle-mat",
  },
];

/** Factory logo tabs — each tab holds 6 partner logos. */
const logoSet = (slug: string, count = 6) =>
  Array.from({ length: count }, (_, i) => `${IMG}/${slug}-${i + 1}-300x82.png`);

export const partnerTabs = [
  {
    label: "Furniture & Interior",
    logos: [
      `${IMG}/furniture-factory-logo-1-1-300x82.png`,
      `${IMG}/furniture-factory-logo-300x82.png`,
      `${IMG}/furniture-factory-logo-5-2-300x82.png`,
      `${IMG}/furniture-factory-logo-3-300x82.png`,
      `${IMG}/furniture-factory-logo-4-300x82.png`,
      `${IMG}/furniture-factory-logo-2-1-300x82.png`,
    ],
  },
  { label: "Promotional Products", logos: logoSet("promotional-products-factory-logo") },
  { label: "Gym & Fitness", logos: logoSet("gym-fitness-factory-logo") },
  { label: "Point of Sale", logos: logoSet("point-of-sale-factory-logo") },
  { label: "Machinery", logos: logoSet("machinery-factory-logo") },
  { label: "Hospitality Items", logos: logoSet("hospitality-factory-logo") },
  { label: "Household Appliances", logos: logoSet("household-appliances-logo") },
];

export const insights = [
  {
    category: "Blog",
    title: "China Manufacturing Rebounds in March 2026: What Buyers Should Watch",
    excerpt:
      "China's March PMI has moved back above the 50-point mark, giving international b...",
    date: "03/08/2026",
    readTime: "5 min read",
    image: `${IMG}/china-manufacturing-rebounds-in-march-2026-what-buyers-should-watch-scaled.jpg`,
    href: "/resources/china-manufacturing-rebounds-march-2026",
  },
  {
    category: "Blog",
    title: "Wholesale Packaging Supplies from China: Where to Buy and What to Expect",
    excerpt:
      "In today's global economy, the demand for wholesale packaging supplies has increased significantly, particularly for businesses looking for wholesale ...",
    date: "31/07/2026",
    readTime: "14 min read",
    image: `${IMG}/wholesale-packaging-supplies-from-china-where-to-buy-and-what-to-expect.jpg`,
    href: "/resources/wholesale-packaging-supplies-from-china",
  },
  {
    category: "Blog",
    title: 'Canton Fair: The "Green Transformation" Landmark of China\'s Industrial Capital',
    excerpt:
      "Held every two years in China's industrial capital, the Canton Fair trade show has always been a large-scale event. As reported by Xinhua News Agency,...",
    date: "10/08/2026",
    readTime: "5 min read",
    image: `${IMG}/canton-fair-the-green-transformation-landmark-of-chinas-industrial-capital.jpg`,
    href: "/resources/canton-fair-green-transformation",
  },
];

export const clientLogos = [
  `${IMG}/image-85.png`,
  `${IMG}/image-86.png`,
  `${IMG}/image-87.png`,
  `${IMG}/image-88.png`,
  `${IMG}/image-89.png`,
  `${IMG}/image-91.png`,
  `${IMG}/image-93.png`,
];

export const faqs = [
  {
    question: "How do I know your factories are actually reliable?",
    answer:
      "We verify our manufacturing partners using stringent criteria. Every factory is thoroughly vetted, tested, and approved by our team before any collaboration begins.",
  },
  {
    question: "How do you handle product defects?",
    answer:
      "We inspect every product before it ships to ensure quality. If there's ever an issue, our team is quick to respond and committed to resolving it.",
  },
  {
    question: "Can I really get better pricing without sacrificing quality?",
    answer:
      "Leverage our buying power and established relationships with supply chain partners to secure the best possible pricing.",
  },
  {
    question: "How do you handle quality issues if something goes wrong?",
    answer:
      "We're on the ground. That means fast response, real inspections and problem-solving before things ever reach your warehouse.",
  },
  {
    question: "How do I stay in control if I'm not physically in Asia?",
    answer:
      "Our team acts as your boots on the ground, handling everything locally, while keeping you updated in real time from anywhere in the world.",
  },
];

export const footer = {
  newsletter: {
    heading: "STAY AHEAD IN SOURCING",
    subheading: "Actionable insights.",
  },
  columns: [
    {
      title: "EXPLORE US",
      links: [
        { label: "About Us", href: "/about-us" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Resources", href: "/resources" },
        { label: "Contact Us", href: "/contact-us" },
      ],
    },
    {
      title: "OUR PRODUCTS",
      links: [
        { label: "Furniture", href: "/products/furniture" },
        { label: "Bags & Cases", href: "/products/bags-cases" },
        { label: "Building Materials", href: "/products/building-materials" },
        { label: "Chemicals & Cleaning", href: "/products/chemicals-cleaning" },
      ],
      more: { label: "See more", href: "/products" },
    },
    {
      title: "OUR SERVICES",
      links: [
        { label: "Product Sourcing", href: "/services/product-sourcing" },
        { label: "Quality Control", href: "/services/quality-control" },
        { label: "Freight & Logistics", href: "/services/freight-logistics" },
        {
          label: "Warehousing & Fulfillment",
          href: "/services/warehousing-fulfillment",
        },
      ],
      more: { label: "See more", href: "/services" },
    },
  ],
  locations: [
    {
      country: "China",
      address:
        "Jinbin Tengyuue Mansion, South Tower, No.49 Huaxia Road, Tianhe District, Guanzhou city, Guangdong Province, China",
      email: "bheki@onelinkholdings.com",
    },
    {
      country: "Hong Kong",
      address:
        "Unit D, 16/F, One Capital Place, 18 Luard Road, Wan Chai - Hong Kong",
      email: "tom@onelinkholdings.com",
    },
    {
      country: "Viet Nam",
      address:
        "771 Ngo Quyen Street, An Hai Bac Ward, Son Tra District, Da Nang city, Vietnam",
      email: "kady@onelinkholdings.com",
    },
    {
      country: "Brisbane, Australia",
      address: "Stafford St, Brisbane 4169, QLD, Australia",
      email: "sam@onelinkholdings.com",
    },
    {
      country: "Sydney, Australia",
      address:
        "Allenby Park Parade, Sydney, Allambie Heights, NSW, Australia - 2100",
      email: "lee@onelinkholdings.com",
    },
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/chinasourcing.co" },
    {
      label: "Linkedin",
      href: "https://www.linkedin.com/company/china-sourcing-co/",
    },
    { label: "Instagram", href: "https://www.instagram.com/chinasourcing.co/" },
  ],
  copyright: "2026 © China Sourcing Co. All Rights Reserved",
  /** The oversized line scrolling through the dark band under the footer. */
  marquee: "Interested in working together? Let’s discuss.",
};
