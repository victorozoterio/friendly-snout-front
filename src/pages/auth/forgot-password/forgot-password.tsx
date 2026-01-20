import { Box, Text, VStack } from '@chakra-ui/react';
import Logo from '../../../assets/logo.png';

export const ForgotPassword = () => {
  return (
    <Box
      minH='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      bg='background'
      px={4}
    >
      <VStack spacing={6} w='100%' maxW='28rem' align='center'>
        <Box as='img' src={Logo} alt='Logo Pata Amiga' w='18rem' />

        <Text textAlign='center' fontSize='lg' color='primary'>
          Entre em contato com o suporte técnico!
        </Text>
      </VStack>

      <Box mt={3} fontSize='x-small' color='gray.500' textAlign='center'>
        Focinho Amigo © {new Date().getFullYear()}. Todos os direitos reservados.
      </Box>
    </Box>
  );
};
