export const profile = {
  name: "Aghar Usman K T",
  location: "Kerala, India",
  roles: ["Full-stack developer"],
  headline: "Web interfaces. Python backends.",
  intro:
    "I build responsive websites with React and Next.js, backed by Python APIs and SQL databases.",
  summary:
    "I’m a full-stack developer from Kerala, India, working with React, Next.js, Python and SQL. My projects span architecture websites, REST APIs, ETL pipelines and a Text-to-SQL assistant. I’m looking to contribute across the stack and grow within a development team.",
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
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
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
      "Built an ERP assistant that turns plain-English questions into MSSQL queries using Llama 3 and Mistral. Added model fallback, retries and TTL caching.",
      "Built a concurrent Flask API with pagination and CSV export. Reduced response time by approximately 35% through caching and batch fetching.",
      "Added SELECT-only checks and seven-pattern SQL-injection detection to limit unsafe generated queries.",
      "Built a PostgreSQL ETL pipeline for a 22-column schema, with 100-row batches, timestamp normalization, retries and failed-record reports.",
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
    tagline: "Architecture studio website · Kerala & Bangalore",
    period: "2026",
    points: [
      "Built a responsive project archive and individual project pages with Next.js and TypeScript, driven by one typed content file.",
      "Created full-screen architecture galleries with page transitions and scroll animation using Framer Motion and GSAP.",
      "Added light and dark themes, a contact form and layouts for mobile and desktop.",
      "Deployed on Vercel with automatic redeploys from GitHub.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    live: "https://suen-studio.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    tagline: "Developer portfolio · Next.js & TypeScript",
    period: "2026",
    points: [
      "Built a single-page portfolio with a shared content file for skills, experience, projects and education.",
      "Added an interactive stack visual, section navigation, expandable project previews and a copy-email action.",
      "Deployed on Vercel.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "GSAP", "Vercel"],
    live: "https://aghar-portfolio.vercel.app/",
  },
  {
    name: "AgriLeaf Pro",
    tagline: "Plant disease detection · Machine learning & IoT",
    period: "2024 – 2025",
    points: [
      "Trained a five-layer CNN to classify 19 plant diseases across four crops, achieving 85%+ accuracy and sub-100ms inference on test hardware.",
      "Built a Flask API with OpenCV preprocessing, token-based authentication and treatment recommendations.",
      "Connected six soil parameters through ThingSpeak, with seven days of historical visualization.",
    ],
    stack: ["Python", "TensorFlow", "Flask", "OpenCV", "ThingSpeak", "GCP"],
    github: "https://github.com/aghar-usman/Leaf-Disease-Detection-using-CNN",
  },
];

export const achievements = [
  "Second place at a state-level hackathon. Led a four-person team, owned the backend and delivered a working product in six hours.",
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
