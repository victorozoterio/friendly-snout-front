import { Box, Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Paws from '../../assets/paws.png';
import { Header } from '../../components';
import { ROUTES } from '../../routes';
import { totalAnimalsPerStage } from '../../services';
import { StageCard } from './components';

export const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['animals', 'total-per-stage'],
    queryFn: totalAnimalsPerStage,
  });

  const quarantine = data?.quarantine;
  const sheltered = data?.sheltered;
  const adopted = data?.adopted;

  return (
    <Box minH='100vh' bg='background'>
      <Header hideBackButton>
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
          as={Link}
          to={ROUTES.MEDICINE_BRANDS.BASE}
          bg='primary'
          color='white'
          borderRadius='full'
          px={6}
          h='2.75rem'
          _hover={{ bg: 'secondary' }}
          _active={{ bg: 'secondary' }}
        >
          <HStack spacing={2}>
            <Text fontWeight='bold'>Marcas</Text>
            <Box as='img' src={Paws} alt='Patas' w='1.1rem' />
          </HStack>
        </Button>
      </Header>

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
