export const typingBrazilianDateMask = (value: string): string => {
  if (!value) return '';

  let v = value.replace(/\D/g, '');
  v = v.slice(0, 8);

  if (v.length >= 5) return v.replace(/^(\d{2})(\d{2})(\d{0,4}).*$/, '$1/$2/$3');
  if (v.length >= 3) return v.replace(/^(\d{2})(\d{0,2}).*$/, '$1/$2');
  return v;
};

export const typingBrazilianDateTimeMask = (value: string): string => {
  if (!value) return '';

  const isoMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (isoMatch) {
    const [, yyyy, mm, dd, hh, min] = isoMatch;
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  let v = value.replace(/\D/g, '');
  v = v.slice(0, 12);

  if (v.length <= 2) return v;
  if (v.length <= 4) return v.replace(/^(\d{2})(\d{0,2}).*$/, '$1/$2');
  if (v.length <= 8) return v.replace(/^(\d{2})(\d{2})(\d{0,4}).*$/, '$1/$2/$3');

  const dd = v.slice(0, 2);
  const mm = v.slice(2, 4);
  const yyyy = v.slice(4, 8);
  const hh = v.slice(8, 10);
  const min = v.slice(10, 12);

  let out = `${dd}/${mm}/${yyyy} ${hh}`;

  if (v.length >= 11) {
    out = `${out}:${min}`;
  }

  return out;
};

export const formatToBrazilianDateMask = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatToBrazilianDateTimeMask = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
