import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import EducationAndExtras from "@/components/EducationAndExtras";
import Footer from "@/components/Footer";

import {
  profile,
  contact,
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
      <Navbar links={navLinks} />

      <main className="min-h-screen max-w-5xl mx-auto px-6 py-20 flex flex-col gap-24">
        <Hero profile={profile} contact={contact} />

        <Skills />

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
    </>
  );
}