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

/**
 * Converte YYYY-MM-DD -> DD/MM/YYYY.
 * Retorna undefined se vier vazio/undefined ou inválido no formato.
 */
export function isoDateToBrazilian(value?: string): string | undefined {
  if (!value) return undefined;

  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return undefined;

  const [yyyy, mm, dd] = value.split('T')[0].split('-');
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Converte DD/MM/YYYY HH:mm -> YYYY-MM-DDTHH:mm:ssZ (UTC).
 * Aceita ambos os formatos: com ou sem T.
 * Retorna undefined se vier vazio/undefined ou inválido.
 */
export const brazilianDateTimeToUtcIso = (value?: string): string | undefined => {
  if (!value) return undefined;

  const v = value.trim();

  const isoMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (isoMatch) {
    const yyyy = Number(isoMatch[1]);
    const mm = Number(isoMatch[2]);
    const dd = Number(isoMatch[3]);
    const hh = Number(isoMatch[4]);
    const min = Number(isoMatch[5]);

    if ([dd, mm, yyyy, hh, min].some((n) => Number.isNaN(n))) return undefined;
    if (mm < 1 || mm > 12) return undefined;
    if (dd < 1 || dd > 31) return undefined;
    if (hh < 0 || hh > 23) return undefined;
    if (min < 0 || min > 59) return undefined;

    const utcMs = Date.UTC(yyyy, mm - 1, dd, hh + 3, min, 0, 0);
    return new Date(utcMs).toISOString();
  }

  if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(v)) return undefined;

  const [datePart, timePart] = v.split(' ');
  const [ddRaw, mmRaw, yyyyRaw] = datePart.split('/');
  const [hhRaw, minRaw] = timePart.split(':');

  const dd = Number(ddRaw);
  const mm = Number(mmRaw);
  const yyyy = Number(yyyyRaw);
  const hh = Number(hhRaw);
  const min = Number(minRaw);

  if ([dd, mm, yyyy, hh, min].some((n) => Number.isNaN(n))) return undefined;
  if (mm < 1 || mm > 12) return undefined;
  if (dd < 1 || dd > 31) return undefined;
  if (hh < 0 || hh > 23) return undefined;
  if (min < 0 || min > 59) return undefined;

  const utcMs = Date.UTC(yyyy, mm - 1, dd, hh + 3, min, 0, 0);
  return new Date(utcMs).toISOString();
};
