import { content } from '@/content';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { CursorTrail } from '@/components/motion/CursorTrail';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Agents } from '@/components/sections/Agents';
import { Capabilities } from '@/components/sections/Capabilities';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Leadership } from '@/components/sections/Leadership';
import { Lifecycle } from '@/components/sections/Lifecycle';
import { Proof } from '@/components/sections/Proof';
import { Systems } from '@/components/sections/Systems';
import { Testimonials } from '@/components/sections/Testimonials';
import { Toolbox } from '@/components/sections/Toolbox';
import { ViewCanvasMount } from '@/components/three/ViewCanvasMount';

export default function HomePage() {
  const c = content;

  return (
    <>
      <SmoothScroll />
      <CursorTrail />
      <ViewCanvasMount />
      <Navbar person={c.person} nav={c.nav} />

      <main>
        <Hero data={c.hero} />

        {/* Content sheet slides up over the sticky 3D hero */}
        <div className="relative z-[5] -mt-[12vh] rounded-t-[36px] bg-ink-950 bg-[radial-gradient(40%_18%_at_12%_18%,rgb(139_92_246/0.18),transparent_70%),radial-gradient(32%_16%_at_88%_36%,rgb(34_211_238/0.12),transparent_70%),radial-gradient(38%_16%_at_16%_62%,rgb(244_114_182/0.11),transparent_70%),radial-gradient(36%_14%_at_85%_84%,rgb(139_92_246/0.14),transparent_70%)] shadow-[0_-40px_80px_-20px_rgb(5_4_26/0.9),0_-1px_0_rgb(139_92_246/0.35)]">
          <div className="container-page flex flex-col">
            <Proof data={c.proof} />
            <Lifecycle data={c.lifecycle} />
            <Systems data={c.systems} />
            <Agents data={c.agents} />
            <Capabilities data={c.capabilities} />
            <CaseStudies data={c.work} />
            <Experience data={c.experience} />
            <Leadership data={c.leadership} />
            <Toolbox data={c.toolbox} />
            <Testimonials data={c.testimonials} />
            <Contact data={c.contact} socials={c.socials} />
            <Footer data={c.footer} />
          </div>
        </div>
      </main>
    </>
  );
}
