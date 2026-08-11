import BorderGlow from './BorderGlow/BorderGlow';

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

interface ExperienceProps {
  experience: ExperienceEntry[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="py-16 flex flex-col gap-12">
      <h2 className="text-3xl font-bold font-mono text-[var(--color-text)]">
        experience
      </h2>

      <div className="flex flex-col gap-8">
        {experience.map((item, index) => (
          <BorderGlow
            key={index}
            borderRadius={12}
            edgeSensitivity={25}
            glowRadius={35}
            glowIntensity={1.0}
            glowColor="11 90 60"
            backgroundColor="var(--color-surface)"
            colors={['#ff5a36', '#b23d1f', '#f5f1ea']}
          >
            <div className="p-6 relative overflow-hidden flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{item.role}</h3>
                  <p className="text-[var(--color-accent)] font-mono text-sm">{item.company} • {item.location}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-text)] rounded border border-[var(--color-border)] w-fit">
                  {item.period}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-2 text-[var(--color-text)] text-sm leading-relaxed">
                {item.points.map((point, pIdx) => (
                  <li key={pIdx}>{point}</li>
                ))}
              </ul>
            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}