import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import EducationAndExtras from "@/components/EducationAndExtras";
import Footer from "@/components/Footer";
import PageGuide from "@/components/PageGuide";

import {
  profile,
  contact,
  skillGroups,
  experience,
  projects,
  education,
  certifications,
  achievements,
  languages,
  navLinks,
} from "@/data";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[var(--color-accent)] focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>

      <Navbar links={navLinks} />

      <main id="main-content" tabIndex={-1} className="min-h-screen">
        <Hero profile={profile} contact={contact} />

        <Skills skills={skillGroups} />

        <Experience experience={experience} />

        <Projects projects={projects} />

        <EducationAndExtras
          education={education}
          certifications={certifications}
          achievements={achievements}
          languages={languages}
        />
      </main>

      <Footer contact={contact} />

      <PageGuide links={navLinks} />
    </>
  );
}
