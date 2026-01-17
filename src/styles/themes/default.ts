export const colors = {
  primary: '#0B5ED7',
  secondary: '#084298',
  background: '#E6EEF6',
  inputBorder: '#C9D7E6',
  placeholder: '#8FA6BF',
} as const;

export const themeColors = {
  primary: {
    500: colors.primary,
    600: colors.secondary,
  },
  secondary: {
    500: colors.secondary,
  },
  background: {
    500: colors.background,
  },
  inputBorder: {
    500: colors.inputBorder,
  },
  placeholder: {
    500: colors.placeholder,
  },
} as const;
