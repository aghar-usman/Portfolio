export const profile = {
  name: "Aghar Usman K T",
  location: "Calicut, Kerala, India",
  roles: ["Full-stack developer"],
  headline: "Web interfaces. Python backends.",
  intro:
    "I’m a full-stack developer in Calicut, Kerala. I build Next.js websites, React interfaces and Python APIs, with SQL databases behind them.",
  summary:
    "I’m Aghar Usman K T, a full-stack developer based in Calicut, Kerala. I build responsive websites with Next.js, React and TypeScript, and backend services with Python, Flask and SQL. My work includes an architecture studio website, production REST APIs, PostgreSQL ETL pipelines and an LLM-powered Text-to-SQL assistant. I’m interested in development roles where I can contribute across the stack and grow through code reviews and collaboration.",
};

export const contact = {
  email: "agharusman529@gmail.com",
  linkedin: "https://linkedin.com/in/aghar-usmankt",
  github: "https://github.com/aghar-usman",
  resume: "/resume.pdf",
};

export const education = {
  school: "Malnad College of Engineering",
  location: "Hassan, Karnataka",
  degree: "B.E. in Information Science and Engineering",
  detail: "CGPA 7.81 / 10 · First Class with Distinction",
  period: "Aug 2021 – May 2025",
  coursework: [
    "Data Structures & Algorithms",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Information Storage and Management",
  ],
};

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "front end",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    label: "backend & apis",
    items: [
      "Python",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Token-based auth",
      "Rate limiting",
      "Java",
      "C",
    ],
  },
  {
    label: "ai & llms",
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
    label: "databases & data",
    items: [
      "PostgreSQL",
      "MSSQL",
      "MySQL",
      "SQLite",
      "SQL (Joins, CTEs, Subqueries)",
      "ETL Pipelines",
      "Pandas",
      "NumPy",
      "Data Validation",
    ],
  },
  {
    label: "tools & cloud",
    items: ["Git/GitHub", "Docker", "Linux", "GCP", "CI/CD", "Vercel"],
  },
  {
    label: "languages",
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
      "Built an ERP Text-to-SQL assistant that let business users query an MSSQL sales database in plain English, using Llama 3 and Mistral through Ollama. Added model fallback, three-attempt retries and thread-safe TTL caching.",
      "Restricted generated queries to SELECT statements and added seven-pattern SQL-injection detection to reduce the risk of unsafe database access.",
      "Developed a Flask REST API with concurrent request handling, configurable pagination and CSV export. Reduced response time by approximately 35% through caching and batch fetching.",
      "Built a PostgreSQL ETL pipeline for a 22-column schema, with 100-row batch loading, timestamp normalization, per-record retries and automated failed-record reports.",
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
  screenshot?: { src: string; alt: string };
}

export const projects: ProjectEntry[] = [
  {
    name: "SU·EN Studio",
    tagline: "Next.js website for an architecture and design studio in Kerala and Bangalore",
    period: "2026",
    points: [
      "Built a responsive architecture studio website with Next.js and TypeScript. A typed content file powers the project archive and individual project pages.",
      "Created full-screen image galleries for residential and commercial projects, with page transitions and scroll-based animation using Framer Motion and GSAP.",
      "Implemented a light and dark theme, a contact form, and a responsive layout that works from mobile to desktop.",
      "Deployed on Vercel with automatic redeploys from GitHub.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    live: "https://suen-studio.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    tagline: "An interactive developer portfolio with Next.js, TypeScript and Tailwind CSS",
    period: "2026",
    points: [
      "Built with Next.js and Tailwind CSS, with sections for stack, experience, projects and education rendered from one typed content config.",
      "Added section navigation, an interactive stack explorer, a floating page guide and a copy-email contact action.",
      "Deployed on Vercel.",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    live: "https://aghar-portfolio.vercel.app/",
  },
  {
    name: "AgriLeaf Pro",
    tagline: "Plant disease detection with TensorFlow, a Flask API and IoT soil data",
    period: "2024 – 2025",
    points: [
      "Designed and trained a 5-layer CNN classifying 19 plant diseases across 4 crops, achieving 85%+ accuracy with sub-100ms inference on test hardware.",
      "Built a Flask REST API with OpenCV image preprocessing, secure token-based authentication, and automated treatment-recommendation responses.",
      "Integrated a ThingSpeak IoT pipeline ingesting 6 real-time soil parameters with 7-day historical visualization.",
    ],
    stack: ["Python", "TensorFlow", "Flask", "OpenCV", "ThingSpeak", "GCP"],
    github: "https://github.com/aghar-usman/Leaf-Disease-Detection-using-CNN",
  },
];

export const achievements = [
  "Placed second in a state-level hackathon, leading a four-person team through a six-hour build. Owned the backend architecture, coordinated tasks and delivered a working product.",
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
