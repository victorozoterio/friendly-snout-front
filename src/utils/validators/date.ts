/**
 * Valida se uma string YYYY-MM-DD representa uma data real no calendário.
 * Ex.: 2024-02-29 => true, 2024-02-35 => false
 */
export const isValidBrazilianDate = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;

  const [dStr, mStr, yStr] = value.split('/');

  const day = Number(dStr);
  const month = Number(mStr);
  const year = Number(yStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const dt = new Date(Date.UTC(year, month - 1, day));

  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
};

/**
 * Data de nascimento válida (DD/MM/YYYY):
 * - é uma data real (isValidDate)
 * - não pode ser no futuro (<= hoje)
 */
export const isValidBrazilianBirthDate = (value: string): boolean => {
  if (!isValidBrazilianDate(value)) return false;

  const [dStr, mStr, yStr] = value.split('/');
  const day = Number(dStr);
  const month = Number(mStr);
  const year = Number(yStr);

  const inputUTC = Date.UTC(year, month - 1, day);

  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return inputUTC <= todayUTC;
};
