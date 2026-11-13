export const profile = {
  name: "Aghar Usman K T",
  location: "Calicut, Kerala, India",
  roles: ["Developer"],
  summary:
    "Developer who builds responsive, clean interfaces with Next.js, React, and Tailwind CSS, and the Python backend services behind them. After an internship building production REST APIs, ETL pipelines, and an LLM-powered Text-to-SQL assistant, I'm comfortable working across the stack: integrating APIs, handling loading and error states, and designing the data underneath. I use Git daily, care about UI detail and clean, maintainable code, and learn new tools quickly. I'm keen to learn from code reviews and grow within a team.",
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
      "Built an AI Text-to-SQL assistant (Llama 3 and Mistral via Ollama) for an ERP, letting business users query an MSSQL sales database in plain English, with dual-model fallback, 3-attempt retry logic, and thread-safe TTL caching for reliability.",
      "Secured the assistant with SELECT-only enforcement and 7-pattern SQL-injection detection to protect live business data.",
      "Developed a Flask REST API with a thread-pool executor for concurrent requests, configurable pagination (10–500 rows), and CSV export, cutting response time by ~35% through caching and batch fetching.",
      "Designed a PostgreSQL ETL pipeline for a 22-column schema, with batch loading (100 rows/batch), timestamp normalization, per-record retry, and automated failed-record reports.",
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
    stack: ["Python", "TensorFlow", "Flask", "OpenCV", "ThingSpeak", "GCP"],
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
