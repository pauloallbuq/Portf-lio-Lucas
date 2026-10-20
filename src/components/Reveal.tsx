import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
};

/** Revela o conteúdo ao entrar na viewport. Sem movimento quando o usuário prefere reduzir animações. */
export function Reveal({ children, delay = 0, y = 32, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Título com linhas que sobem por trás de uma máscara. O observador fica no contêiner (não recortado). */
export function MaskLines({ lines, className, delay = 0, inView = true }: { lines: ReactNode[]; className?: string; delay?: number; inView?: boolean }) {
  const reduce = useReducedMotion();
  const trigger = inView ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } } : { animate: 'show' };
  return (
    <motion.span className={className} style={{ display: 'block' }} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            className="mask-inner"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: '110%' },
              show: reduce ? { opacity: 1 } : { y: '0%' },
            }}
            transition={{ duration: reduce ? 0.3 : 1.1, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
