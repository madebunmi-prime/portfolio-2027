import { content } from '@/content';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { CursorTrail } from '@/components/motion/CursorTrail';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Approach } from '@/components/sections/Approach';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Stack } from '@/components/sections/Stack';
import { Testimonials } from '@/components/sections/Testimonials';
import { ViewCanvasMount } from '@/components/three/ViewCanvasMount';

export default function HomePage() {
  const c = content;
  const builtAt = new Date().toISOString();

  return (
    <>
      <SmoothScroll />
      <CursorTrail />
      <ViewCanvasMount />
      <Navbar person={c.person} nav={c.nav} />

      <main>
        <Hero data={c.hero} />

        {/* Content sheet slides up over the sticky 3D hero */}
        <div className="relative z-[5] -mt-[12vh] rounded-t-[36px] bg-ink-950 shadow-[0_-40px_80px_-20px_rgb(5_4_26/0.9),0_-1px_0_rgb(139_92_246/0.35)]">
          <div className="mx-auto flex max-w-[1240px] flex-col px-5 md:px-12">
            <Process data={c.process} />
            <Stack data={c.stack} />
            <Experience data={c.experience} builtAt={builtAt} />
            <Projects data={c.projects} />
            <Approach data={c.approach} />
            <Testimonials data={c.testimonials} />
            <Contact data={c.contact} socials={c.socials} />
            <Footer data={c.footer} />
          </div>
        </div>
      </main>
    </>
  );
}
