import { Badge } from '@chakra-ui/react';
import { AnimalFivAndFelv } from '../../../../utils';

export const YesNoBadge = ({ value }: { value: boolean }) => (
  <Badge
    px={2}
    py={1}
    borderRadius='md'
    bg={value ? 'success' : 'error'}
    color='white'
    fontSize='0.9rem'
    fontWeight='bold'
    textTransform='capitalize'
  >
    {value ? 'Sim' : 'Não'}
  </Badge>
);

export const FivAndFelvBadge = ({ value }: { value: AnimalFivAndFelv }) => (
  <Badge
    px={2}
    py={1}
    borderRadius='md'
    bg={value === AnimalFivAndFelv.YES ? 'success' : value === AnimalFivAndFelv.NO ? 'error' : 'warning'}
    color='white'
    fontSize='0.9rem'
    fontWeight='bold'
    textTransform='capitalize'
  >
    {value}
  </Badge>
);
