import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotePencil, Trash } from 'phosphor-react';
import * as React from 'react';

import Paws from '../../assets/paws.png';
import { Header } from '../../components';
import { DeleteConfirmDialog } from '../../components/DeleteConfirmDialog';
import { deleteAnimal, getAllAnimals } from '../../services';
import type { GetAnimalResponse } from '../../services/animals/types';
import { AnimalFivAndFelv } from '../../utils';
import {
  translateAnimalBreed,
  translateAnimalFivAndFelv,
  translateAnimalSize,
  translateAnimalSpecies,
  translateAnimalStatus,
} from './utils';

const YesNoBadge = ({ value }: { value: boolean }) => (
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

const FivAndFelvBadge = ({ value }: { value: AnimalFivAndFelv }) => (
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
    {translateAnimalFivAndFelv(value)}
  </Badge>
);

export const Animals = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, isError, refetch } = useQuery<GetAnimalResponse[]>({
    queryKey: ['animals', 'list'],
    queryFn: getAllAnimals,
  });

  const [selectedUuid, setSelectedUuid] = React.useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', 'list'] });
      onClose();
      setSelectedUuid(null);
    },
  });

  const openDeleteDialog = (uuid: string) => {
    setSelectedUuid(uuid);
    onOpen();
  };

  const confirmDelete = () => {
    if (!selectedUuid) return;
    deleteMutation.mutate({ uuid: selectedUuid });
  };

  const handleCloseDialog = () => {
    if (deleteMutation.isPending) return;
    onClose();
    setSelectedUuid(null);
  };

  return (
    <Box minH='100vh' bg='background'>
      <Header>
        <Button bg='primary' color='white' borderRadius='full' px={6} h='2.75rem' _hover={{ bg: 'secondary' }}>
          <HStack spacing={2}>
            <Text fontWeight='bold'>Cadastrar</Text>
            <Box as='img' src={Paws} alt='Patas' w='1.1rem' />
          </HStack>
        </Button>
      </Header>

      <DeleteConfirmDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        entityLabel='animal'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <Box w='100%' px={8} pt={10} pb={10}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando animais...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar animais
            </Text>
            <Button onClick={() => refetch()} bg='primary' color='white'>
              Tentar novamente
            </Button>
          </VStack>
        )}

        {!isLoading && !isError && (
          <TableContainer
            bg='rgba(19,113,175,0.12)'
            borderRadius='xl'
            border='1px solid'
            borderColor='background'
            backdropFilter='blur(6px)'
          >
            <Table w='100%' layout='fixed'>
              <Thead bg='secondary'>
                <Tr>
                  <Th w='10%' color='white'>
                    Status
                  </Th>
                  <Th w='22%' color='white'>
                    Nome
                  </Th>
                  <Th w='10%' color='white'>
                    Espécie
                  </Th>
                  <Th w='10%' color='white'>
                    Raça
                  </Th>
                  <Th w='8%' color='white'>
                    Porte
                  </Th>
                  <Th w='8%' color='white'>
                    Castrado
                  </Th>
                  <Th w='12%' color='white'>
                    FIV
                  </Th>
                  <Th w='12%' color='white'>
                    FELV
                  </Th>
                  <Th w='8%' color='white' textAlign='right' pr={12}>
                    Ações
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {data?.map((animal) => (
                  <Tr key={animal.uuid} bg='primary'>
                    <Td color='white' fontWeight='bold'>
                      <Text isTruncated>{translateAnimalStatus(animal.status)}</Text>
                    </Td>

                    <Td color='white' fontWeight='bold' textTransform='capitalize'>
                      <Text isTruncated>{animal.name}</Text>
                    </Td>

                    <Td color='white' fontWeight='bold'>
                      <Text isTruncated>{translateAnimalSpecies(animal.species)}</Text>
                    </Td>

                    <Td color='white' fontWeight='bold'>
                      <Text isTruncated>{translateAnimalBreed(animal.breed)}</Text>
                    </Td>

                    <Td color='white' fontWeight='bold'>
                      <Text isTruncated>{translateAnimalSize(animal.size)}</Text>
                    </Td>

                    <Td>
                      <YesNoBadge value={animal.castrated} />
                    </Td>

                    <Td>
                      <FivAndFelvBadge value={animal.fiv} />
                    </Td>

                    <Td>
                      <FivAndFelvBadge value={animal.felv} />
                    </Td>

                    <Td>
                      <HStack justify='flex-end' spacing={1}>
                        <IconButton aria-label='Editar' icon={<NotePencil size={20} />} variant='link' color='white' />

                        <IconButton
                          aria-label='Excluir'
                          icon={<Trash size={20} />}
                          variant='link'
                          color='white'
                          onClick={() => openDeleteDialog(animal.uuid)}
                          isLoading={deleteMutation.isPending && selectedUuid === animal.uuid}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};
