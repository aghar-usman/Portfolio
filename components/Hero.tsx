"use client";

import GradientWaves from "./GradientWaves/GradientWaves";
import TextType from "./TextType/TextType";
import FoldText from "./FoldText/FoldText";

interface HeroProps {
  profile: {
    name: string;
    roles: string[];
    summary: string | string[];
  };

  contact: {
    resume: string;
    github: string;
    linkedin: string;
  };
}

/* GitHub official-style mark */
function GitHubIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.335-.012 2.412-.012 2.74 0 .267.18.578.688.48A10.002 10.002 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
      />
    </svg>
  );
}

/* LinkedIn official brand glyph */
function LinkedInIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

export default function Hero({ profile, contact }: HeroProps) {
  return (
    <section
      id="about"
      className="
        relative
        w-full
        min-h-[700px]
        overflow-hidden
        bg-[var(--color-bg)]
        flex
        items-center
        box-border
      "
    >
      {/* Gradient Waves Background - Full coverage */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "auto",
        }}
      >
        <GradientWaves
          horizonColor="#131313"
          waveColor="#ff5a36"
          crestColor="#ff8c73"
          speed={0.35}
          amplitude={3.2}
          waveScale={0.75}
          waveRatio={0.85}
          swell={45}
          turbulence={28}
          tilt={0.95}
          zoom={0.85}
          height={6.5}
          fogDepth={22}
          brightness={1.3}
          opacity={0.95}
          mouseInteraction={true}
          parallaxStrength={1.8}
          grain={true}
          grainIntensity={0.04}
        />
      </div>

      {/* Dark overlay for readability */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-black/30
        "
      />

      {/* Bottom gradient fade into next section */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-gradient-to-b
          from-black/10
          via-transparent
          to-[var(--color-bg)]
        "
      />

      {/* Hero content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-4xl
          flex-col
          items-start
          gap-8
          px-4
          sm:px-8
          py-20
          md:px-12
          lg:px-16
          pointer-events-none
          box-border
          min-w-0
        "
      >
        {/* Name + roles */}
        <div className="pointer-events-auto w-full min-w-0">
          <div
            className="
              mb-6
              overflow-visible
              w-full
              min-w-0
            "
          >
            <FoldText
              text={profile.name}
              splitBy="char"
              hinge="top"
              duration={2}
              stagger={0.055}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(2rem, 7vw, 5rem)"
              fontWeight={800}
              color="var(--color-text)"
            />
          </div>

          {/* Roles */}
          <div
            className="
              flex
              flex-wrap
              gap-2.5
              font-mono
              w-full
              min-w-0
            "
          >
            {profile.roles.map((role, index) => (
              <span
                key={`${role}-${index}`}
                className="
                  rounded-full
                  border
                  border-[var(--color-accent)]/30
                  bg-[var(--color-surface)]/70
                  px-3
                  py-1
                  text-xs
                  sm:text-sm
                  text-[var(--color-accent)]
                  backdrop-blur-md
                  truncate
                  max-w-full
                "
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full pointer-events-auto min-w-0">
          <TextType
            text={profile.summary}
            typingSpeed={100}
            deletingSpeed={60}
            pauseDuration={180000}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            cursorClassName="text-[var(--color-accent)]"
            className="
              font-mono
              text-sm
              sm:text-lg
              font-medium
              leading-relaxed
              text-white
              md:text-xl
              break-words
              w-full
              min-w-0
            "
          />
        </div>

        {/* Buttons */}
        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-3
            sm:gap-4
            font-mono
            pointer-events-auto
            w-full
            min-w-0
          "
        >
          {/* Resume */}
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              bg-[var(--color-accent)]
              px-5
              sm:px-6
              py-3
              text-sm
              sm:text-base
              font-semibold
              text-[#000000]
              shadow-lg
              shadow-[var(--color-accent)]/20
              transition-all
              duration-300
              hover:bg-[#ff704f]
              hover:shadow-[var(--color-accent)]/35
            "
          >
            View Resume
          </a>

          {/* GitHub */}
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2.5
              rounded-lg
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]/75
              px-4
              sm:px-5
              py-3
              text-sm
              sm:text-base
              text-[var(--color-text)]
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-[var(--color-accent)]/60
              hover:bg-[var(--color-surface-2)]
              hover:text-[var(--color-accent)]
            "
          >
            <span
              className="
                flex
                items-center
                justify-center
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <GitHubIcon />
            </span>

            <span>GitHub</span>
          </a>

          {/* LinkedIn */}
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2.5
              rounded-lg
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]/75
              px-4
              sm:px-5
              py-3
              text-sm
              sm:text-base
              text-[var(--color-text)]
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-[var(--color-accent)]/60
              hover:bg-[var(--color-surface-2)]
              hover:text-[var(--color-accent)]
            "
          >
            <span
              className="
                flex
                items-center
                justify-center
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <LinkedInIcon />
            </span>

            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}
