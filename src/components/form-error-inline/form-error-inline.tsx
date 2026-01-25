import { FormErrorMessage, HStack, Text } from '@chakra-ui/react';
import { XCircle } from 'phosphor-react';

type FormErrorInlineProps = {
  message?: string;
};

export const FormErrorInline = ({ message }: FormErrorInlineProps) => {
  if (!message) return null;
  return (
    <FormErrorMessage position='absolute' left='0' bottom='0' m='0'>
      <HStack align='center' spacing={1}>
        <XCircle size={14} weight='duotone' color='var(--chakra-colors-error)' />
        <Text color='error' fontSize='xs'>
          {message}
        </Text>
      </HStack>
    </FormErrorMessage>
  );
};
