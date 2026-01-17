import { Box, Button, FormControl, FormLabel, Input, Link, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { ROUTES } from '../../../routes';
import { signIn } from '../../../services';
import * as T from '../../../services/auth/types';

export const SignIn = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<T.SignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate(ROUTES.HOME.BASE);
    },
  });

  const onSubmit = (data: T.SignIn) => {
    mutation.mutate(data);
  };

  return (
    <Box
      minH='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      bg='background.500'
      px={4}
    >
      <VStack spacing={8} w='100%'>
        <Box as='img' src={Logo} alt='Logo Focinho Amigo' w='18rem' />

        <VStack as='form' w='20rem' spacing={6} align='stretch' onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel mb={1} color='primary.500' fontWeight='bold'>
              Email
            </FormLabel>

            <Input
              type='email'
              placeholder='Digite seu email'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor='inputBorder.500'
              borderRadius='md'
              _placeholder={{ color: 'placeholder.500' }}
              _hover={{ borderColor: 'primary.500' }}
              _focus={{
                borderColor: 'primary.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
              }}
              {...register('email', { required: 'Email é obrigatório' })}
            />
          </FormControl>
          <FormControl>
            <FormLabel mb={1} color='primary.500' fontWeight='bold'>
              Senha
            </FormLabel>

            <Input
              type='password'
              placeholder='Digite sua senha'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor='inputBorder.500'
              borderRadius='md'
              _placeholder={{ color: 'placeholder.500' }}
              _hover={{ borderColor: 'primary.500' }}
              _focus={{
                borderColor: 'primary.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
              }}
              {...register('password', { required: 'Senha é obrigatória' })}
            />

            <Link
              mt={1}
              display='inline-block'
              color='primary.500'
              fontSize='sm'
              _hover={{ textDecoration: 'underline' }}
            >
              Esqueceu a senha?
            </Link>
          </FormControl>
          <Button
            type='submit'
            alignSelf='center'
            mt={2}
            bg='primary.500'
            color='white'
            h='2.5rem'
            w='100%'
            fontWeight='extrabold'
            borderRadius='md'
            _hover={{ bg: 'primary.600' }}
            _active={{ bg: 'primary.700' }}
            isLoading={mutation.isPending}
            loadingText='Acessando...'
          >
            Acessar
          </Button>
        </VStack>
      </VStack>

      <Box mt={3} fontSize='x-small' color='gray.500' textAlign='center'>
        Focinho Amigo © {new Date().getFullYear()}. Todos os direitos reservados.
      </Box>
    </Box>
  );
};
