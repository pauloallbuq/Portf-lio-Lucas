import { Header } from './components/Header';
import { Hero, Marquee } from './components/Hero';
import { About } from './components/About';
import { Works } from './components/Works';
import { Videos } from './components/Videos';
import { Timeline } from './components/Timeline';
import { Services, Skills } from './components/Services';
import { Contact, Footer } from './components/Contact';

export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
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
