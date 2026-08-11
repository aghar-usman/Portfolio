export const profile = {
  name: "Aghar Usman K T",
  location: "Calicut, Kerala, India",
  roles: ["Developer", "Data Engineering Enthusiast"],
  summary: "Versatile developer and data engineer with hands-on experience building robust APIs and data pipelines. Proficient in Python, SQL, and modern software engineering practices, with expanding expertise in distributed data processing and warehousing. Passionate about designing scalable architectures and eager to contribute to data-intensive engineering teams."
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
    label: "data engineering — in progress",
    items: ["PySpark", "Databricks", "Snowflake", "ETL pipeline design", "Batch processing", "Data modeling"],
  },
  { label: "languages", items: ["Python", "SQL", "JavaScript"] },
  { label: "databases", items: ["PostgreSQL", "MSSQL", "MySQL", "SQLite", "pyodbc", "psycopg2"] },
  { label: "backend & apis", items: ["Flask", "FastAPI", "REST APIs", "Microservices", "Rate limiting"] },
  { label: "cloud & devops", items: ["GCP", "Docker", "Linux/Unix", "Git/GitHub", "CI/CD"] },
  {
    label: "ai / ml & nlp",
    items: ["Ollama", "Llama 3", "Mistral", "BERT", "Transformers", "PyTorch", "TensorFlow", "Scikit-learn", "HuggingFace"],
  },
  { label: "data & tooling", items: ["Pandas", "NumPy", "NLTK", "spaCy", "TF-IDF", "FuzzyWuzzy", "OpenCV", "React.js"] },
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
    role: "Intern",
    company: "Team Thai",
    location: "Calicut, Kerala",
    period: "Feb 2025 – May 2025",
    points: [
      "Designed and built a text-to-SQL chatbot using Llama 3 and Mistral (via Ollama) with a dual-model fallback architecture, 3-attempt retry logic, and thread-safe TTL caching to handle concurrent requests reliably.",
      "Engineered SQL-injection prevention with 7-pattern regex detection and SELECT-only enforcement, securing natural-language queries over an MSSQL sales database.",
      "Built a Flask REST API with a thread-pool executor for concurrent request handling, configurable pagination (10–500 rows), and CSV export — optimized query response time by ~35% through caching and batch fetching.",
      "Designed and implemented a PostgreSQL ETL pipeline for a 22-column customer schema — batch insertion (100 rows/batch), per-row retry logic, timestamp normalization, and automated failed-row reporting.",
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
}

export const projects: ProjectEntry[] = [
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
