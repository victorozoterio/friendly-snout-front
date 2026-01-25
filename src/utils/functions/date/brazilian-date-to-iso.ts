/**
 * Converte DD/MM/YYYY -> YYYY-MM-DD.
 * Retorna undefined se vier vazio/undefined ou inválido no formato.
 */
export function brazilianDateToIso(value?: string): string | undefined {
  if (!value) return undefined;

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return undefined;

  const [dd, mm, yyyy] = value.split('/');
  return `${yyyy}-${mm}-${dd}`;
}
