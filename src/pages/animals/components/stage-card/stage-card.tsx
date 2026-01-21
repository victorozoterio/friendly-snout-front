import { Box, Text, VStack } from '@chakra-ui/react';
import type { StageCardType } from './types';

export const StageCard = ({ title, dogs, cats, total }: StageCardType) => {
  return (
    <VStack spacing={4} align='center'>
      <Text fontWeight='extrabold' fontSize='2xl' color='black'>
        {title}
      </Text>

      <VStack spacing={3} w='14rem'>
        <Box
          w='100%'
          h='8.5rem'
          bg='primary'
          borderRadius='lg'
          boxShadow='md'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          pt={6}
          gap={4}
        >
          <Text fontSize='5xl' fontWeight='extrabold' color='white' lineHeight='1'>
            {dogs}
          </Text>
          <Text fontSize='sm' color='white'>
            Total de cães
          </Text>
        </Box>

        <Box
          w='100%'
          h='8.5rem'
          bg='primary'
          borderRadius='lg'
          boxShadow='md'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          pt={6}
          gap={4}
        >
          <Text fontSize='5xl' fontWeight='extrabold' color='white' lineHeight='1'>
            {cats}
          </Text>
          <Text fontSize='sm' color='white'>
            Total de gatos
          </Text>
        </Box>

        <Box
          w='100%'
          h='8.5rem'
          bg='secondary'
          borderRadius='lg'
          boxShadow='md'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          pt={6}
          gap={4}
        >
          <Text fontSize='5xl' fontWeight='extrabold' color='white' lineHeight='1'>
            {total}
          </Text>
          <Text fontSize='sm' color='white'>
            Total de animais
          </Text>
        </Box>
      </VStack>
    </VStack>
  );
};
