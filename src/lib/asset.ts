/** Resolve um arquivo de /public respeitando o caminho base do build. URLs completas passam direto. */
export function asset(path: string) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
