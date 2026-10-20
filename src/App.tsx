import { Intro } from './components/Intro';
import { Header } from './components/Header';
import { Hero, Marquee } from './components/Hero';
import { About } from './components/About';
import { Works } from './components/Works';
import { Videos } from './components/Videos';
import { Timeline } from './components/Timeline';
import { Services, Skills } from './components/Services';
import { Contact, Footer } from './components/Contact';

import { useState } from 'react';

export default function App() {
  const [entered, setEntered] = useState(0);
  return (
    <>
      <Intro onDone={() => setEntered(1)} />
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero key={entered} />
        <Marquee />
        <About />
        <Timeline />
        <Works />
        <Videos />
        <Services />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
