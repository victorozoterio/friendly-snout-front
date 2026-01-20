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
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES } from '../../../routes';
import { signIn } from '../../../services';
import { storage } from '../../../utils';
import { type SignInFormData, signInSchema } from './schema';

export const SignIn = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

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
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      storage.token.setTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
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
      bg='background'
      px={4}
    >
      <VStack spacing={8} w='100%'>
        <Box as='img' src={Logo} alt='Logo Focinho Amigo' w='18rem' />

        <VStack as='form' w='20rem' spacing={8} align='stretch' onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={hasEmailError}>
            <FormLabel mb={1} color='primary' fontWeight='bold'>
              Email
            </FormLabel>

            <Input
              type='text'
              placeholder='Digite seu email'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor={hasEmailError ? 'error' : 'inputBorder'}
              borderRadius='md'
              _placeholder={{ color: 'placeholder' }}
              _hover={{ borderColor: hasEmailError ? 'error' : 'primary' }}
              _focus={{
                borderColor: hasEmailError ? 'error' : 'primary',
                outline: hasEmailError
                  ? '1px solid var(--chakra-colors-error)'
                  : '1px solid var(--chakra-colors-primary)',
                outlineOffset: '0px',
              }}
              _autofill={{
                boxShadow: hasEmailError
                  ? '0 0 0px 1000px white inset, 0 0 0 1px var(--chakra-colors-error) !important'
                  : '0 0 0px 1000px white inset',
              }}
              {...register('email')}
            />

            {errors.email && (
              <FormErrorMessage position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center'>
                  <XCircle size={16} weight='duotone' color='var(--chakra-colors-error)' />
                  <Text color='error' fontSize='small'>
                    {errors.email.message}
                  </Text>
                </HStack>
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={hasPasswordError}>
            <FormLabel mb={1} color='primary' fontWeight='bold'>
              Senha
            </FormLabel>

            <Input
              type='password'
              placeholder='Digite sua senha'
              h='2.5rem'
              bg='white'
              border='1px solid'
              borderColor={hasPasswordError ? 'error' : 'inputBorder'}
              borderRadius='md'
              _placeholder={{ color: 'placeholder' }}
              _hover={{ borderColor: hasPasswordError ? 'error' : 'primary' }}
              _focus={{
                borderColor: hasPasswordError ? 'error' : 'primary',
                outline: hasPasswordError
                  ? '1px solid var(--chakra-colors-error)'
                  : '1px solid var(--chakra-colors-primary)',
                outlineOffset: '0px',
              }}
              _autofill={{
                boxShadow: hasPasswordError
                  ? '0 0 0px 1000px white inset, 0 0 0 1px var(--chakra-colors-error) !important'
                  : '0 0 0px 1000px white inset',
              }}
              {...register('password')}
            />

            {errors.password && (
              <FormErrorMessage position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center'>
                  <XCircle size={16} weight='duotone' color='var(--chakra-colors-error)' />
                  <Text color='error' fontSize='small'>
                    {errors.password.message}
                  </Text>
                </HStack>
              </FormErrorMessage>
            )}

            {backendError && (
              <Box position='absolute' left='0' bottom='-22px' m='0'>
                <HStack align='center' spacing={2}>
                  <WarningCircle size={16} weight='duotone' color='var(--chakra-colors-error)' />
                  <Text color='error' fontSize='small'>
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
            bg='primary'
            color='white'
            h='2.5rem'
            w='100%'
            fontWeight='extrabold'
            borderRadius='md'
            _hover={{ bg: 'secondary' }}
            _active={{ bg: 'secondary' }}
            isLoading={mutation.isPending}
            loadingText='Acessando...'
          >
            Acessar
          </Button>
        </VStack>
      </VStack>

      <Link mt={3} alignSelf='center' color='primary' fontSize='sm' _hover={{ textDecoration: 'underline' }}>
        Esqueceu a senha?
      </Link>

      <Box mt={3} fontSize='x-small' color='gray.500' textAlign='center'>
        Focinho Amigo © {new Date().getFullYear()}. Todos os direitos reservados.
      </Box>
    </Box>
  );
};
