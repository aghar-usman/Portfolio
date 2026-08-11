import SpotlightCard from './SpotlightCard/SpotlightCard';
import ElectricBorder from './ElectricBorder/ElectricBorder';

export interface ProjectEntry {
  name: string;
  tagline: string;
  period: string;
  points: string[];
  stack: string[];
  github?: string;
}

interface ProjectsProps {
  projects: ProjectEntry[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-16 flex flex-col gap-12">
      <h2 className="text-3xl font-bold font-mono text-[var(--color-text)]">
        projects
      </h2>

      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <ElectricBorder
            key={index}
            color="#ff5a36"
            speed={1}
            chaos={0.1}
            borderRadius={12}
            style={{ borderRadius: '12px' }}
          >
            <SpotlightCard 
              className="w-full h-full"
              spotlightColor="rgba(255, 90, 54, 0.15)"
            >
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-[var(--color-text)]">{project.name}</h3>
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-[var(--color-accent)] hover:underline"
                        >
                          [GitHub]
                        </a>
                      )}
                    </div>
                    <p className="text-[var(--color-accent)] text-sm mt-1">{project.tagline}</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-text)] rounded border border-[var(--color-border)] w-fit">
                    {project.period}
                  </span>
                </div>

                <ul className="list-disc list-inside space-y-2 text-[var(--color-text)] text-sm leading-relaxed">
                  {project.points.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--color-border)]">
                  {project.stack.map((tech, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-xs font-mono px-2.5 py-1 bg-[var(--color-surface-2)] text-[var(--color-accent)] rounded border border-[var(--color-border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </ElectricBorder>
        ))}
      </div>
    </section>
  );
}