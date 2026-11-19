export const profile = {
  name: "Aghar Usman K T",
  location: "Kerala, India",
  roles: ["Full-stack developer"],
  headline: "From the first click\nto the database.",
  intro:
    "I’ve built an architecture studio’s website, Flask APIs, and an assistant that turns plain-English questions into SQL.",
  summary:
    "I’m a full-stack developer based in Kerala. I build websites with React and Next.js and work on APIs and data pipelines with Python and SQL.",
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
  screenshot?: { src: string; alt: string };
}

export const projects: ProjectEntry[] = [
  {
    name: "SU·EN Studio",
    tagline: "Portfolio website for an architecture studio",
    period: "2026",
    points: [
      "Built an architecture project archive and individual case-study pages in Next.js. A single typed content file feeds both views.",
      "Built full-screen project galleries with scroll animation and page transitions using Framer Motion and GSAP.",
      "Added light and dark themes, a contact form, and layouts for mobile and desktop.",
      "Connected the GitHub repository to Vercel for automatic deployments.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    live: "https://suen-studio.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    tagline: "This site",
    period: "2026",
    points: [
      "Built this single-page portfolio in Next.js and TypeScript. Its sections share one content file.",
      "Built a GSAP sequence that connects the hero illustration to each section as you scroll, with a reduced-motion view.",
      "Deployed on Vercel.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "GSAP", "Vercel"],
    live: "https://aghar-portfolio.vercel.app/",
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
