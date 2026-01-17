import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { WarningCircle, XCircle } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { ROUTES } from '../../../routes';
import { signIn } from '../../../services';
import { type SignInFormData, signInSchema } from './schema';

export const SignIn = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
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
    onError: () => {
      clearErrors();
    },
  });

  const getErrorMessage = () => {
    if (!mutation.error) return null;

    const axiosError = mutation.error as AxiosError;
    if (axiosError.response?.status === 401) return 'Credenciais inválidas';

    return 'Erro ao fazer login. Tente novamente mais tarde.';
  };

  const backendError = getErrorMessage();
  const hasEmailError = !!errors.email || !!backendError;
  const hasPasswordError = !!errors.password || !!backendError;

  const onSubmit = (data: SignInFormData) => {
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

        <VStack as='form' w='20rem' spacing={8} align='stretch' onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={hasEmailError}>
            <FormLabel mb={1} color='primary.500' fontWeight='bold'>
              Email
            </FormLabel>

            <Input
              type='text'
              placeholder='Digite seu email'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor={hasEmailError ? 'red' : 'inputBorder.500'}
              borderRadius='md'
              _placeholder={{ color: 'placeholder.500' }}
              _hover={{ borderColor: hasEmailError ? 'red' : 'primary.500' }}
              _focus={{
                borderColor: hasEmailError ? 'red' : 'primary.500',
                outline: hasEmailError ? '1px solid red' : '1px solid var(--chakra-colors-primary-500)',
                outlineOffset: '0px',
              }}
              _autofill={{
                boxShadow: hasEmailError
                  ? '0 0 0px 1000px white inset, 0 0 0 1px red !important'
                  : '0 0 0px 1000px white inset',
              }}
              {...register('email')}
            />

            {errors.email && (
              <FormErrorMessage position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center'>
                  <XCircle size={16} weight='duotone' color='red' />
                  <Text color='red' fontSize='small'>
                    {errors.email.message}
                  </Text>
                </HStack>
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={hasPasswordError}>
            <FormLabel mb={1} color='primary.500' fontWeight='bold'>
              Senha
            </FormLabel>

            <Input
              type='password'
              placeholder='Digite sua senha'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor={hasPasswordError ? 'red' : 'inputBorder.500'}
              borderRadius='md'
              _placeholder={{ color: 'placeholder.500' }}
              _hover={{ borderColor: hasPasswordError ? 'red' : 'primary.500' }}
              _focus={{
                borderColor: hasPasswordError ? 'red' : 'primary.500',
                outline: hasPasswordError ? '1px solid red' : '1px solid var(--chakra-colors-primary-500)',
                outlineOffset: '0px',
              }}
              _autofill={{
                boxShadow: hasPasswordError
                  ? '0 0 0px 1000px white inset, 0 0 0 1px red !important'
                  : '0 0 0px 1000px white inset',
              }}
              {...register('password')}
            />

            {errors.password && (
              <FormErrorMessage position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center'>
                  <XCircle size={16} weight='duotone' color='red' />
                  <Text color='red' fontSize='small'>
                    {errors.password.message}
                  </Text>
                </HStack>
              </FormErrorMessage>
            )}

            {backendError && (
              <Box position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center' spacing={2}>
                  <WarningCircle size={16} weight='duotone' color='red' />
                  <Text color='red' fontSize='small'>
                    {backendError}
                  </Text>
                </HStack>
              </Box>
            )}
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

      <Link mt={3} alignSelf='center' color='primary.500' fontSize='sm' _hover={{ textDecoration: 'underline' }}>
        Esqueceu a senha?
      </Link>

      <Box mt={3} fontSize='x-small' color='gray.500' textAlign='center'>
        Focinho Amigo © {new Date().getFullYear()}. Todos os direitos reservados.
      </Box>
    </Box>
  );
};
