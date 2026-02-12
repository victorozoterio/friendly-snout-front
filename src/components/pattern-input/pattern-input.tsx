import { Input } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';
import { PatternInputProps } from './types';

export const PatternInput = forwardRef<HTMLInputElement, PatternInputProps>(function PatternInput(
  { format, mask = '_', allowEmptyFormatting = false, value, onValueChange, ...rest },
  ref,
) {
  return (
    <Input
      as={PatternFormat}
      getInputRef={ref}
      format={format}
      mask={mask}
      allowEmptyFormatting={allowEmptyFormatting}
      value={value}
      onValueChange={(vals) => onValueChange(vals.formattedValue)}
      {...rest}
    />
  );
});
