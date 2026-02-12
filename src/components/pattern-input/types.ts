import { InputProps } from '@chakra-ui/react';
import { PatternFormatProps } from 'react-number-format';

export type PatternInputProps = Omit<InputProps, 'as' | 'onChange' | 'value'> &
  Pick<PatternFormatProps, 'format' | 'mask' | 'allowEmptyFormatting'> & {
    value: string;
    onValueChange: (value: string) => void;
  };
