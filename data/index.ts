export const profile = {
  name: "Aghar Usman K T",
  location: "Calicut, Kerala, India",
  roles: ["Developer"],
  summary:
    "Developer who builds responsive, clean interfaces with Next.js, React, and Tailwind CSS. After an internship building production REST APIs, I'm comfortable integrating APIs, handling loading and error states, and talking through data needs with backend teammates. I use Git daily, care about UI detail and clean, maintainable code, and enjoy turning designs into fast pages. I also build AI-powered features with LLMs, and I'm keen to learn from code reviews and grow within a  team.",
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
  detail: "CGPA 7.81 / 10",
  period: "Aug 2021 – May 2025",
  coursework: [
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Artificial Intelligence",
    "Machine Learning",
    "Big Data Technologies",
    "Data Science Using R",
    "Information Storage and Management",
  ],
};

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "frontend",
    items: ["Next.js", "React", "Tailwind CSS", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    label: "apis & integration",
    items: ["REST APIs", "Flask", "FastAPI", "Token-based auth", "Rate limiting"],
  },
  { label: "tools & workflow", items: ["Git/GitHub", "Docker", "CI/CD", "Linux/Unix", "Vercel"] },
  { label: "languages", items: ["Python", "SQL", "JavaScript", "TypeScript"] },
  { label: "databases", items: ["PostgreSQL", "MSSQL", "MySQL", "SQLite"] },
  {
    label: "ai / ml",
    items: ["Ollama", "Llama 3", "Mistral", "HuggingFace", "TensorFlow", "Scikit-learn", "OpenCV"],
  },
  {
    label: "currently exploring",
    items: ["Agentic AI", "PySpark", "Databricks", "Snowflake"],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  badgeUrl?: string;
  credentialUrl?: string;
}

export const certifications: Certification[] = [
  {
    name: "Academy Accreditation - Databricks Fundamentals",
    issuer: "Databricks Academy",
    badgeUrl: "https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190902395",
    credentialUrl: "https://www.credential.net/f1088c5a-d461-45b0-8edb-4ecd2c68fc85",
  },
];

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "Python Backend Intern",
    company: "Team Thai",
    location: "Calicut, Kerala",
    period: "Feb 2025 – May 2025",
    points: [
      "Built a Flask REST API with a thread-pool executor for concurrent request handling, configurable pagination (10–500 rows), and CSV export, optimizing query response time by ~35% through caching and batch fetching.",
      "Designed and built a text-to-SQL chatbot using Llama 3 and Mistral (via Ollama) with a dual-model fallback architecture, 3-attempt retry logic, and thread-safe TTL caching to handle concurrent requests reliably.",
      "Engineered SQL-injection prevention with 7-pattern regex detection and SELECT-only enforcement, securing natural-language queries over an MSSQL sales database.",
      "Designed and implemented a PostgreSQL ETL pipeline for a 22-column customer schema, with batch insertion (100 rows/batch), per-row retry logic, timestamp normalization, and automated failed-row reporting.",
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
}

export const projects: ProjectEntry[] = [
  {
    name: "SU·EN Studio",
    tagline: "Portfolio website for an architecture and design studio in Kerala and Bangalore",
    period: "2026",
    points: [
      "Built the studio's website with Next.js (App Router) and TypeScript, with a project archive and dynamic project pages generated from one typed data file.",
      "Created full-screen image galleries for residential and commercial projects, with page transitions and scroll-based animation using Framer Motion and GSAP.",
      "Implemented a light and dark theme, a contact form, and a responsive layout that works from mobile to desktop.",
      "Deployed on Vercel with automatic redeploys from GitHub.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    live: "https://suen-studio.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    tagline: "Single-page developer portfolio built with Next.js and Tailwind CSS",
    period: "2026",
    points: [
      "Built with Next.js and Tailwind CSS, with sections for stack, experience, projects and education rendered from one typed content config.",
      "Added anchor-based navigation across all sections, plus resume download and contact links.",
      "Deployed on Vercel.",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    live: "https://aghar-portfolio.vercel.app/",
  },
  {
    name: "AgriLeaf Pro",
    tagline: "CNN-based plant disease detection with IoT integration",
    period: "2024 – 2025",
    points: [
      "Designed and trained a 5-layer CNN classifying 19 plant diseases across 4 crops, achieving 85%+ accuracy with sub-100ms inference on test hardware.",
      "Built a Flask REST API with OpenCV image preprocessing, secure token-based authentication, and automated treatment-recommendation responses.",
      "Integrated a ThingSpeak IoT pipeline ingesting 6 real-time soil parameters with 7-day historical visualization.",
    ],
    stack: ["TensorFlow", "Flask", "OpenCV", "ThingSpeak", "GCP"],
    github: "https://github.com/aghar-usman/Leaf-Disease-Detection-using-CNN",
  },
];

export const achievements = [
  "State-level hackathon — 2nd place: led a 4-member team in a 6-hour hackathon, owned backend architecture, coordinated the task split, and delivered a working product under time pressure.",
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
