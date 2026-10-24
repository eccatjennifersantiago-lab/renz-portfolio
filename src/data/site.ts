/**
 * Site content: the single source of truth.
 *
 * Every name, link, figure and paragraph shown on the page lives here, so the
 * portfolio can be updated without touching the components.
 */

/**
 * Public address of the site, used for SEO tags, the sitemap and link previews.
 * Change this if you use a different Cloudflare Pages project name or a custom domain.
 */
export const siteUrl = "https://renz-portfolio-108.pages.dev";

export const profile = {
  name: "Renz Russel Santiago",
  title: "YouTube Automation Manager",
  specialties: ["Video Editing", "Shopify", "Digital Marketing"],
  location: "Bulacan, Philippines",
  availability: "Open to Remote Roles",
  email: "admin@renzandjendigitalmarketing.com",
  phoneDisplay: "+63 921 608 1817",
  phoneHref: "tel:+639216081817",
  resumeUrl:
    "https://drive.google.com/file/d/124imrU2yVrSHGxcNgj4BAHE_XLSp7yZH/view?usp=sharing",
  avatar: {
    src: "/images/renz-avatar.webp",
    alt: "Portrait of Renz Russel Santiago",
  },
  portrait: {
    src: "/images/renz-portrait.webp",
    width: 960,
    height: 960,
    alt: "Renz Russel Santiago smiling in a desk chair, holding a silver and a gold YouTube Creator Award plaque",
  },
} as const;

export const mailtoHref = `mailto:${profile.email}`;

/** Sidebar / mobile navigation. `id` must match a section id on the page. */
export const navItems = [
  { id: "home", label: "Home" },
  { id: "results", label: "YouTube Results" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];

export const hero = {
  headline: "From content ideas to publish-ready videos.",
  intro:
    "I build and manage faceless YouTube content, create engaging videos, and support Shopify businesses—from research and production to publishing and product-page quality.",
};

/**
 * Tools strip. Logos live in public/icons/. `fit: "cover"` is for app-icon
 * style marks that fill their circle; the rest sit on a white tile.
 */
export const tools: { name: string; icon: string; fit?: "cover" }[] = [
  { name: "CapCut", icon: "/icons/capcut.png" },
  { name: "Google Flow", icon: "/icons/google-flow.png", fit: "cover" },
  { name: "Claude", icon: "/icons/claude.svg" },
  { name: "ChatGPT", icon: "/icons/chatgpt.svg" },
  { name: "Shopify", icon: "/icons/shopify.svg" },
  { name: "Canva", icon: "/icons/canva.png", fit: "cover" },
  { name: "GoHighLevel", icon: "/icons/gohighlevel.png" },
  { name: "vidIQ", icon: "/icons/vidiq.png", fit: "cover" },
  { name: "Go Motion", icon: "/icons/gomotion.svg" },
  { name: "GenAIpro", icon: "/icons/genaipro.png" },
  { name: "VidRush", icon: "/icons/vidrush.png", fit: "cover" },
  { name: "ElevenLabs", icon: "/icons/elevenlabs.svg" },
  { name: "Slack", icon: "/icons/slack.svg" },
  { name: "Google Workspace", icon: "/icons/google-workspace.svg" },
];

/** Featured case study: results from Renz's own channel. Keep figures exact. */
export const caseStudy = {
  eyebrow: "Featured case study · My own channel",
  title: "Built from scratch. Managed from idea to upload.",
  description:
    "I built my own faceless YouTube channel from scratch and personally handled research, scripting, clip sourcing, editing, uploading, and branding.",
  responsibilities: [
    "Research",
    "Scripting",
    "Clip sourcing",
    "Editing",
    "Uploading",
    "Branding",
  ],
  metrics: [
    { value: "191,536,536", label: "views" },
    { value: "+1.3M", label: "subscribers gained" },
    { value: "847.2K", label: "watch hours" },
    { value: "$13,849.21", label: "estimated revenue" },
  ],
  disclosure: "Channel results shown over a 365-day reporting period.",
  note: "Results from my own channel. Past results are not a guarantee of future outcomes.",
  chartNote: "The daily line is traced from my YouTube Studio chart, so individual days are approximate.",
  screenshot: {
    src: "/images/youtube-analytics.webp",
    width: 1659,
    height: 1101,
    alt: "YouTube Studio analytics overview of my own channel for a 365-day period, showing 191,536,536 views, 847.2K watch hours, +1.3M subscribers and $13,849.21 estimated revenue, with a daily views chart.",
  },
};

export type ProjectIcon = "script" | "thumbnail" | "ecommerce" | "portfolio";

export const projects: {
  title: string;
  description: string;
  category: string;
  host: string;
  cta: string;
  url: string;
  icon: ProjectIcon;
}[] = [
  {
    title: "Script Samples",
    description: "Explore examples of my scripting work.",
    category: "Scripting",
    host: "Google Drive folder",
    cta: "Open folder",
    url: "https://drive.google.com/drive/folders/1_Mus3sxQ3UmNENekr3D6QNedMGNmkSo1?usp=sharing",
    icon: "script",
  },
  {
    title: "Thumbnail Gallery",
    description: "View my thumbnail portfolio.",
    category: "Thumbnail design",
    host: "External gallery",
    cta: "View gallery",
    url: "https://thumbnail-sensie.vibepreview.com/",
    icon: "thumbnail",
  },
  {
    title: "E-commerce Projects",
    description: "Explore examples of my e-commerce work.",
    category: "Shopify & e-commerce",
    host: "Google Drive folder",
    cta: "Open folder",
    url: "https://drive.google.com/drive/folders/1XWJv95FRnHh9VTwEADANzB34nJbx2RNt?usp=sharing",
    icon: "ecommerce",
  },
  {
    title: "Additional Portfolio",
    description: "Browse more of my work.",
    category: "More work",
    host: "External page",
    cta: "Browse portfolio",
    url: "https://claude.ai/public/artifacts/5482f766-2ac3-4e8c-a892-d19cf02e5c15",
    icon: "portfolio",
  },
];

export type ServiceIcon =
  | "automation"
  | "editing"
  | "script"
  | "thumbnail"
  | "shopify"
  | "marketing";

export const services: { title: string; description: string; icon: ServiceIcon }[] = [
  {
    title: "YouTube Automation Management",
    description:
      "Topic and market research, content planning, production coordination, quality control, and publishing preparation.",
    icon: "automation",
  },
  {
    title: "Video Editing",
    description:
      "Short-form editing with attention to hooks, pacing, visual selection, narration alignment, storytelling, and audience retention.",
    icon: "editing",
  },
  {
    title: "Script and Content Development",
    description:
      "Research, scripting, content structure, and constructive revision feedback.",
    icon: "script",
  },
  {
    title: "Thumbnail Design",
    description: "Visual concepts and thumbnail creation for YouTube content.",
    icon: "thumbnail",
  },
  {
    title: "Shopify Support",
    description:
      "Product descriptions, pricing, variants, image editing, listing uploads, organization, and final product-page checks.",
    icon: "shopify",
  },
  {
    title: "Digital Marketing and Operations",
    description:
      "Social media management, graphic design, lead generation, local SEO, Google Business Profile setup, client communication, training, and administrative support.",
    icon: "marketing",
  },
];

export const processSteps = [
  {
    title: "Research",
    description:
      "Explore topics, audience interests, references, and content opportunities.",
  },
  {
    title: "Plan",
    description:
      "Organize ideas into a production plan, structure, and clear deliverables.",
  },
  {
    title: "Produce",
    description:
      "Develop scripts and coordinate or carry out the required creative work.",
  },
  {
    title: "Review",
    description:
      "Check content quality, visual consistency, accuracy, and readiness for publication.",
  },
  {
    title: "Publish",
    description:
      "Prepare final deliverables and publishing details for release.",
  },
];

/**
 * About copy. Each block carries a short label so visitors can tell the
 * independently produced channel apart from the team-management role.
 */
export const about = {
  intro:
    "I’m Renz Russel Santiago, a YouTube Automation Manager, Video Editor, and Shopify & Digital Marketing Specialist based in Bulacan, Philippines.",
  blocks: [
    {
      label: "My own channel",
      text: "I built my own faceless YouTube channel from scratch, handling the entire production process—from research and scripting to editing, branding, and uploading.",
    },
    {
      label: "Team management",
      text: "I also have seven months of experience managing a YouTube automation operation, coordinating editors, scriptwriters, quality assurance, and video production. I set priorities, review deliverables, and provide clear feedback to keep content consistent and ready for publication.",
    },
    {
      label: "Beyond YouTube",
      text: "Beyond YouTube, I support Shopify operations and digital marketing. My three years of teaching experience strengthened my ability to train team members, create clear processes, and communicate constructive feedback.",
    },
  ],
  facts: [
    { value: "7 months", label: "Managing a YouTube automation operation" },
    { value: "3 years", label: "Teaching experience" },
  ],
};

export const contact = {
  heading: "Let’s build your next project.",
  description:
    "Available for long-term remote opportunities in YouTube production, video editing, Shopify support, and digital marketing.",
};
