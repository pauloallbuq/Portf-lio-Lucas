import { useState } from 'react';
import { MaskLines, Reveal } from './Reveal';
import { site } from '../config/site';
import { contact as text } from '../content';
import { Availability } from './Header';

const YEAR = new Date().getFullYear();

function SocialLink({ href, label, external = true }: { href: string; label: string; external?: boolean }) {
  if (!href) return null;
  return (
    <a className="social" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <span>{label}</span>
      <span className="social-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export function Contact() {
  const { email, whatsapp, instagram, linkedin, behance } = site.contact;
  const [copied, setCopied] = useState(false);
  const hasAny = !!(email || whatsapp || instagram || linkedin || behance);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section className="contact" id="contato" aria-labelledby="contato-title">
      <div className="contact-inner">
        <p className="section-num">(05) — Contato</p>
        <h2 id="contato-title" className="contact-title">
          <MaskLines lines={[text.title[0], <em key="a">{text.title[1]}</em>]} />
        </h2>
        <Reveal delay={0.15}>
          <p className="contact-text">{text.text}</p>
        </Reveal>

        {email && (
          <Reveal delay={0.2} className="contact-mail">
            <a href={`mailto:${email}?subject=${encodeURIComponent('Contato pelo portfólio')}`} className="mail-big">
              {email}
            </a>
            <button className="copy-btn" onClick={copy} aria-live="polite">
              {copied ? 'Copiado ✓' : 'Copiar e-mail'}
            </button>
          </Reveal>
        )}

        {hasAny ? (
          <Reveal delay={0.25} className="socials">
            <SocialLink href={whatsapp ? `https://wa.me/${whatsapp}` : ''} label="WhatsApp" />
            <SocialLink href={instagram} label="Instagram" />
            <SocialLink href={linkedin} label="LinkedIn" />
            <SocialLink href={behance} label="Behance" />
            <SocialLink href={email ? `mailto:${email}` : ''} label="E-mail" external={false} />
          </Reveal>
        ) : (
          <p className="contact-empty">Contatos a configurar em src/config/site.ts (e-mail, WhatsApp, Instagram, LinkedIn, Behance).</p>
        )}

        <Availability />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>
        © {YEAR} {site.fullName}
      </span>
      <span className="footer-loc">{site.location}</span>
      <a href="#topo" className="link-underline">
        Voltar ao topo ↑
      </a>
    </footer>
  );
}
