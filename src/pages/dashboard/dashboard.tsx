import {
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { SignOut, UserCircle } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import Paws from '../../assets/paws.png';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes';
import { totalAnimalsPerStage } from '../../services';
import { StageCard } from './components';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['animals', 'total-per-stage'],
    queryFn: totalAnimalsPerStage,
  });

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.SIGN_IN);
  };

  const quarantine = data?.quarantine;
  const sheltered = data?.sheltered;
  const adopted = data?.adopted;

  return (
    <Box minH='100vh' bg='background'>
      <HStack w='100%' px={8} pt={6} justify='space-between' align='center'>
        <Box as='img' src={Logo} alt='Logo Focinho Amigo' w='7rem' />

        <HStack spacing={3}>
          <Button
            as={Link}
            to={ROUTES.ANIMALS.BASE}
            bg='primary'
            color='white'
            borderRadius='full'
            px={6}
            h='2.75rem'
            _hover={{ bg: 'secondary' }}
            _active={{ bg: 'secondary' }}
          >
            <HStack spacing={2}>
              <Text fontWeight='bold'>Animais</Text>
              <Box as='img' src={Paws} alt='Patas' w='1.1rem' />
            </HStack>
          </Button>

          <Button
            bg='primary'
            color='white'
            borderRadius='full'
            px={6}
            h='2.75rem'
            _hover={{ bg: 'secondary' }}
            _active={{ bg: 'secondary' }}
          >
            <HStack spacing={2}>
              <Text fontWeight='bold'>Produtos</Text>
              <Box as='img' src={Paws} alt='Patas' w='1.1rem' />
            </HStack>
          </Button>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Menu do usuário'
              icon={<UserCircle size={40} />}
              variant='underline'
              borderRadius='full'
              color='primary'
            />
            <MenuList boxShadow='none' border='1px solid' borderColor='gray.200' borderRadius='lg' p={0}>
              <MenuItem
                icon={<SignOut size={18} />}
                onClick={handleLogout}
                _hover={{ bg: 'gray.100' }}
                borderRadius='md'
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      <Box w='100%' px={8} pt={16}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando dashboard...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar dados do dashboard
            </Text>
            <Button onClick={() => refetch()} bg='primary' color='white' _hover={{ bg: 'secondary' }}>
              Tentar novamente
            </Button>
          </VStack>
        )}

        {!isLoading && !isError && data && (
          <HStack justify='center' align='flex-start' spacing={{ base: 6, md: 14 }} w='100%'>
            <StageCard
              title='Quarentena'
              dogs={quarantine?.dogs ?? 0}
              cats={quarantine?.cats ?? 0}
              total={quarantine?.total ?? 0}
            />
            <StageCard
              title='Abrigados'
              dogs={sheltered?.dogs ?? 0}
              cats={sheltered?.cats ?? 0}
              total={sheltered?.total ?? 0}
            />
            <StageCard
              title='Adotados'
              dogs={adopted?.dogs ?? 0}
              cats={adopted?.cats ?? 0}
              total={adopted?.total ?? 0}
            />
          </HStack>
        )}
      </Box>
    </Box>
  );
};
