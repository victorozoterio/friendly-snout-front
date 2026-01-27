export const typingBrazilianDateMask = (value: string): string => {
  if (!value) return '';

  let v = value.replace(/\D/g, '');
  v = v.slice(0, 8);

  if (v.length >= 5) return v.replace(/^(\d{2})(\d{2})(\d{0,4}).*$/, '$1/$2/$3');
  if (v.length >= 3) return v.replace(/^(\d{2})(\d{0,2}).*$/, '$1/$2');
  return v;
};

export const formatToBrazilianDateMask = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
