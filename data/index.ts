export const profile = {
  name: "Aghar Usman K T",
  location: "Kerala, India",
  roles: ["Full-stack developer"],
  headline: "From interface\nto database.",
  intro:
    "I build React interfaces and Python APIs. At Team Thai, I built an ERP assistant that turns plain-English questions into SQL.",
  summary:
    "I’m a full-stack developer based in Kerala. I build websites with React and Next.js and work on APIs and data pipelines with Python and SQL.",
};

export const contact = {
  email: "agharusman529@gmail.com",
  linkedin: "https://linkedin.com/in/aghar-usmankt",
  github: "https://github.com/aghar-usman",
  resume: "/resume.pdf",
};

export const portfolioCopy = {
  skills: {
    heading: "Tech stack",
    more: "More tools",
  },
  experience: {
    heading: "Experience",
    more: "Query safeguards and data loading",
    empty: "See my projects for examples of my work.",
  },
  projects: {
    heading: "Selected projects",
    details: "How I built it",
  },
  contact: {
    heading: "Contact",
    intro: "Email me about a full-stack role or a website you’re building.",
  },
} as const;

export type StackLayer = "ui" | "api" | "data";
type LayerPose = Record<StackLayer, readonly [x: number, y: number]>;

export const layerStory = {
  layers: [
    { id: "ui", label: "UI" },
    { id: "api", label: "API" },
    { id: "data", label: "DATA" },
  ],
  steps: {
    about: { id: "about", status: "GET /click" },
    skills: { id: "skills", status: "layers" },
    experience: { id: "experience", status: "POST /request", layer: "api" },
    projects: { id: "projects", status: "results", layer: "ui" },
    education: { id: "education" },
    contact: { id: "contact", status: "200 OK" },
  },
  poses: {
    assembled: { ui: [0, 0], api: [0, 0], data: [0, 0] },
    exploded: { ui: [-6, -41], api: [0, 0], data: [6, 39] },
    request: { ui: [-3, -24], api: [0, 0], data: [3, 23] },
    showcase: { ui: [0, -31], api: [3, 22], data: [7, -8] },
    response: { ui: [0, 47], api: [0, -1], data: [0, -49] },
  } satisfies Record<string, LayerPose>,
} as const satisfies {
  layers: readonly { id: StackLayer; label: string }[];
  steps: Record<string, { id: string; status?: string; layer?: StackLayer }>;
  poses: Record<string, LayerPose>;
};

export const requestDemo = {
  title: "Text-to-SQL demo",
  run: "Run sample query",
  replay: "Replay demo",
  questionLabel: "Question",
  queryLabel: "Generated SQL",
  resultsLabel: "Sample orders (fictional)",
  question: "Which orders are pending?",
  query: "SELECT order_id, status\nFROM orders\nWHERE status = 'pending';",
  columns: ["Order ID", "Status"],
  rows: [["DEMO-104", "pending"], ["DEMO-108", "pending"], ["DEMO-113", "pending"]],
  blocked: { question: "delete all orders", badge: "SELECT only", message: "The demo rejected the delete request. It can only read records." },
  status: {
    idle: "Run a question against fictional order data.",
    question: "Entering the sample question.",
    query: "Generating a read-only SQL query.",
    results: "Three fictional orders returned.",
    blocked: "The sample returned three orders and blocked the delete request.",
  },
  timing: { questionEnd: 980, queryStart: 1120, queryEnd: 2700, resultStart: 2830, rowGap: 130, blockStart: 3660, blockEnd: 4340, done: 4690 },
  event: "portfolio:request-packet",
  blockedEvent: "portfolio:request-blocked",
} as const;

export type StorySection = keyof typeof layerStory.steps;

export const guideCharacter = {
  label: "Open page guide",
  navigationEvent: "portfolio:guide-open",
  manyClicks: "One request at a time.",
  blocked: requestDemo.blocked.badge,
  sectionEvent: "portfolio:guide-section",
  packetEvent: "portfolio:guide-packet",
  educationTitle: "Education.",
  anchors: { about: .49, skills: .27, experience: .72, projects: .37, education: .61, contact: .84 } satisfies Record<StorySection, number>,
  idle: {
    first: 2400,
    repeat: 8100,
    gap: 1700,
    sections: {
      about: ["stretch", "blink", "cuff"],
      skills: ["scan", "blink", "cuff"],
      experience: ["think", "blink", "nod"],
      projects: ["scan", "nod", "blink"],
      education: ["think", "scan", "blink"],
      contact: ["nod", "blink", "cuff"],
    },
  },
} as const;

export const stompIntro = {
  mainPose: "pockets" as "pockets" | "front",
  sessionKey: "introSeen",
  skip: "Skip",
  seconds: 3.4,
  fastScale: 1.5,
  decodeWindow: 400,
  readyEvent: "portfolio:stomp-ready",
  endedEvent: "portfolio:stomp-ended",
  startedEvent: "portfolio:stomp-started",
  cutEvent: "portfolio:stomp-cut",
  assets: ["front", "side-right", "pose-pockets-body", "head-smirk", "head-neutral", "surprised", "angry", "happy", "walk-1", "walk-2", "walk-3", "walk-4", "walk-5", "walk-6"],
} as const;

export const education = {
  school: "Malnad College of Engineering",
  location: "Hassan, Karnataka",
  degree: "B.E. in Information Science and Engineering",
  detail: "CGPA 7.81 / 10 · First Class with Distinction",
  period: "Aug 2021 – May 2025",
  coursework: [
  "Data Structures and Applications",
  "Design and Analysis of Algorithms",
  "Database Management Systems",
  "Object Oriented Programming using Java",
  "Software Engineering",
  "Operating Systems",
  "Computer Networks",
  "UNIX and Shell Programming",
  "Artificial Intelligence",
  "Machine Learning",
  "Big Data Technologies",
  "Information Storage and Management",
],
};

export interface SkillGroup {
  label: string;
  items: string[];
  layer?: StackLayer;
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    layer: "ui",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Motion (Framer Motion)",
      "GSAP",
    ],
  },
  {
    label: "Backend & APIs",
    layer: "api",
    items: [
      "Python",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Token-based auth",
      "Rate limiting",
    ],
  },
  {
    label: "AI & machine learning",
    layer: "api",
    items: [
      "LLM Integration",
      "Text-to-SQL",
      "Prompt Engineering",
      "Ollama",
      "Llama 3",
      "Mistral",
      "Claude",
      "HuggingFace",
      "TensorFlow",
      "PyTorch",
      "OpenCV",
    ],
  },
  {
    label: "Databases & data",
    layer: "data",
    items: [
      "PostgreSQL",
      "MSSQL",
      "MySQL",
      "SQLite",
      "SQL",
      "ETL Pipelines",
      "Pandas",
      "NumPy",
      "Data Validation",
    ],
  },
  {
    label: "Tools & cloud",
    layer: "api",
    items: ["Git/GitHub", "Docker", "Linux", "GCP", "CI/CD", "Vercel"],
  },
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C", "SQL"],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  badgeUrl?: string;
  credentialUrl?: string;
}

// Add Coursera (or other) certifications here once completed, e.g.
// { name: "Course name", issuer: "Coursera", credentialUrl: "https://..." }
export const certifications: Certification[] = [];

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "Intern",
    company: "Team Thai",
    location: "Calicut, Kerala",
    period: "Feb 2025 – May 2025",
    points: [
      "Built an ERP assistant that turns plain-English questions into SQL Server queries using Llama 3 and Mistral. Added model fallback, retries, and time-limited caching.",
      "Cut response time by about 35% on a Flask API by caching results and fetching records in batches. The API supports concurrent requests, pagination, and CSV export.",
      "Restricted generated queries to SELECT statements and checked for seven SQL injection patterns.",
      "Built a PostgreSQL pipeline that loads records into a 22-column schema in batches of 100. It normalizes timestamps, retries failed loads, and reports failed records.",
    ],
  },
];

export interface ProjectEntry {
  name: string;
  tagline: string;
  period: string;
  points: string[];
  stack: string[];
  github?: string;
  live?: string;
  currentPage?: boolean;
  screenshot?: { src: string; alt: string };
}

export const projects: ProjectEntry[] = [
  {
    name: "SU·EN Studio",
    tagline: "Portfolio website for an architecture studio",
    period: "2026",
    points: [
      "Built a project archive and case-study pages for an architecture studio. Both views use the same typed content file.",
      "Built full-screen project galleries with scroll animation and page transitions using Framer Motion and GSAP.",
      "Added light and dark themes, a contact form, and layouts for mobile and desktop.",
      "Connected the GitHub repository to Vercel for automatic deployments.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    live: "https://suen-studio.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    tagline: "Interactive developer portfolio",
    period: "2026",
    points: [
      "Organized this portfolio around a single typed content file for projects, experience, and education.",
      "Built the scroll-linked stack and the interactive page guide in GSAP, with a static view for reduced motion.",
      "Deployed on Vercel.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "GSAP", "Vercel"],
    live: "https://aghar-portfolio.vercel.app/",
    github: "https://github.com/aghar-usman/Portfolio",
    currentPage: true,
  },
  {
    name: "AgriLeaf Pro",
    tagline: "Plant disease detection and soil monitoring",
    period: "2024 – 2025",
    points: [
      "Trained a five-layer CNN to identify 19 diseases across four crops. It reached 85%+ accuracy and ran inference in under 100 ms on test hardware.",
      "Built a Flask API that preprocesses photos with OpenCV and returns treatment recommendations. The API uses token-based authentication.",
      "Connected six soil measurements to ThingSpeak and displayed seven days of readings.",
    ],
    stack: ["Python", "TensorFlow", "Flask", "OpenCV", "ThingSpeak", "GCP"],
    github: "https://github.com/aghar-usman/Leaf-Disease-Detection-using-CNN",
  },
];

export const achievements = [
  "Placed second at a state-level hackathon. I led a team of four and built the backend for a working product we delivered in six hours.",
];

export const languages = [
  { name: "English", level: "Professional" },
  { name: "Hindi", level: "Professional" },
  { name: "Malayalam", level: "Conversational" },
  { name: "Kannada", level: "Conversational" },
];

export const navLinks = [
  { href: "#about", label: "about" },
  { href: "#skills", label: "stack" },
  { href: "#experience", label: "experience" },
  { href: "#projects", label: "projects" },
  { href: "#education", label: "education" },
  { href: "#contact", label: "contact" },
];
