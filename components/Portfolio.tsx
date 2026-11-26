import SelectedWork from "./SelectedWork";
import StackPlotter from "./StackPlotter";
import HeroStudy from "./HeroStudy";
import ExperienceLab from "./ExperienceLab";
import EducationContact from "./EducationContact";
import SmoothScroll from "./SmoothScroll";
export default function Portfolio() {
  return <>
    <SmoothScroll />
    <a className="skip" href="#main">Skip to content</a>
    <main id="main">
      <HeroStudy embedded />
      <SelectedWork />
      <StackPlotter />
      <ExperienceLab />
      <EducationContact />
    </main>
  </>;
}
