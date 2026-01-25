import { ChakraStylesConfig } from 'chakra-react-select';

const errorColorVar = 'var(--chakra-colors-error)';
const primaryColorVar = 'var(--chakra-colors-primary)';
const inputBorderVar = 'var(--chakra-colors-inputBorder)';
const placeholderVar = 'var(--chakra-colors-placeholder)';
const whiteVar = 'var(--chakra-colors-white)';
const gray100Var = 'var(--chakra-colors-gray-100)';
const gray900Var = 'var(--chakra-colors-gray-900)';
const shadowXlVar = 'var(--chakra-shadows-xl)';

type SelectOption<V extends string> = { value: V; label: string };

export function createSelectStyles<V extends string>(hasError = false): ChakraStylesConfig<SelectOption<V>, false> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: '2.75rem',
      height: '2.75rem',
      background: whiteVar,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: hasError ? errorColorVar : state.isFocused ? primaryColorVar : inputBorderVar,
      borderRadius: 'var(--chakra-radii-md)',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': {
        borderColor: hasError ? errorColorVar : primaryColorVar,
      },
    }),

    valueContainer: (base) => ({
      ...base,
      paddingInline: '0.75rem',
      height: '2.75rem',
    }),

    placeholder: (base) => ({
      ...base,
      color: placeholderVar,
    }),

    singleValue: (base) => ({
      ...base,
      color: gray900Var,
      fontWeight: 500,
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: primaryColorVar,
      paddingInline: '0.5rem',
      '&:hover': { color: primaryColorVar },
    }),

    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: shadowXlVar,
      border: `1px solid ${gray100Var}`,
      marginTop: '8px',
      background: whiteVar,
      zIndex: 1000,
    }),

    menuList: (base) => ({
      ...base,
      padding: '6px',
    }),

    option: (base, state) => ({
      ...base,
      borderRadius: '10px',
      padding: '10px 12px',
      cursor: 'pointer',
      background: state.isSelected ? primaryColorVar : state.isFocused ? gray100Var : 'transparent',
      color: state.isSelected ? whiteVar : gray900Var,
      fontWeight: state.isSelected ? 700 : 500,
      '&:active': {
        background: primaryColorVar,
        color: whiteVar,
      },
    }),
  };
}
