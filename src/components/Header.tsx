import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { site } from '../config/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { setSound, useSound } from '../hooks/useSound';

const links = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'design', label: 'Design' },
  { id: 'audiovisual', label: 'Audiovisual' },
  { id: 'trajetoria', label: 'Trajetória' },
  { id: 'contato', label: 'Contato' },
];

export function SoundToggle() {
  const on = useSound();
  return (
    <button
      type="button"
      className={`sound-toggle ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros'}
      title={on ? 'Efeitos sonoros ligados' : 'Efeitos sonoros desligados'}
      onClick={() => setSound(!on)}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-label">Som {on ? 'on' : 'off'}</span>
    </button>
  );
}

export function Availability({ compact = false }: { compact?: boolean }) {
  const { show, open, label, closedLabel } = site.availability;
  if (!show) return null;
  return (
    <span className={`availability ${open ? 'is-open' : 'is-closed'} ${compact ? 'is-compact' : ''}`}>
      <span className="availability-dot" aria-hidden="true" />
      <span className="availability-label">{open ? label : closedLabel}</span>
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(links.map((l) => l.id));
  const reduce = useReducedMotion();
  const activeNav = active;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const onResize = () => window.innerWidth > 860 && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#topo" className="brand" aria-label={`${site.name} — voltar ao início`}>
          {site.brand}
        </a>

        <div className="header-right">
          <Availability compact />
          <SoundToggle />
          <nav aria-label="Principal" className="nav-desktop">
            <ul>
              {links.map((l, i) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className={activeNav === l.id ? 'is-active' : ''} aria-current={activeNav === l.id ? 'location' : undefined}>
                    <span className="nav-index">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-mobile"
            className="nav-mobile"
            aria-label="Menu"
            initial={{ clipPath: reduce ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', opacity: reduce ? 0 : 1 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: reduce ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.2 + i * 0.07, duration: 0.5 }}
                >
                  <a href={`#${l.id}`} onClick={() => setMenuOpen(false)}>
                    <span className="nav-index">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="nav-mobile-foot">
              <Availability />
              {site.contact.email && <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}
              <SoundToggle />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
