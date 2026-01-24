import {
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
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotePencil, Trash } from 'phosphor-react';
import * as React from 'react';

import Paws from '../../assets/paws.png';
import { DeleteConfirmDialog, Header, PaginationFooter } from '../../components';
import { deleteAnimal, getAllAnimals } from '../../services';
import type { GetAnimalResponse } from '../../services/animals/types';
import type { Pagination } from '../../utils';

import { FivAndFelvBadge, YesNoBadge } from './components/badges';
import { SortableTh } from './components/sortable-th';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, type SortableKey, type SortState } from './utils/sort';

export const Animals: React.FC = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedUuid, setSelectedUuid] = React.useState<string | null>(null);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [sortState, setSortState] = React.useState<SortState>(DEFAULT_SORT_STATE);
  const [sortBy, setSortBy] = React.useState<string>(DEFAULT_SORT_BY);

  const [name] = React.useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetAnimalResponse>>({
    queryKey: ['animals', 'list', page, limit, sortBy, name],
    queryFn: () => getAllAnimals({ page, limit, sortBy, name }),
    placeholderData: keepPreviousData,
  });

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

  const handleSortClick = (key: SortableKey) => {
    applySort(key, setPage, setSortState, setSortBy);
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
          <>
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
                    <SortableTh w='10%' colKey='status' sortState={sortState} onSort={handleSortClick}>
                      Status
                    </SortableTh>

                    <SortableTh w='22%' colKey='name' sortState={sortState} onSort={handleSortClick}>
                      Nome
                    </SortableTh>

                    <SortableTh w='10%' colKey='species' sortState={sortState} onSort={handleSortClick}>
                      Espécie
                    </SortableTh>

                    <SortableTh w='10%' colKey='breed' sortState={sortState} onSort={handleSortClick}>
                      Raça
                    </SortableTh>

                    <SortableTh w='8%' colKey='size' sortState={sortState} onSort={handleSortClick}>
                      Porte
                    </SortableTh>

                    <SortableTh w='8%' colKey='castrated' sortState={sortState} onSort={handleSortClick}>
                      Castrado
                    </SortableTh>

                    <SortableTh w='12%' colKey='fiv' sortState={sortState} onSort={handleSortClick}>
                      FIV
                    </SortableTh>

                    <SortableTh w='12%' colKey='felv' sortState={sortState} onSort={handleSortClick}>
                      FELV
                    </SortableTh>

                    <Th w='8%' color='white' textAlign='right' pr={12}>
                      Ações
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {data?.data.map((animal) => (
                    <Tr key={animal.uuid} bg='primary'>
                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{animal.status}</Text>
                      </Td>

                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{animal.name}</Text>
                      </Td>

                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{animal.species}</Text>
                      </Td>

                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{animal.breed}</Text>
                      </Td>

                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{animal.size}</Text>
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
                          <IconButton
                            aria-label='Editar'
                            icon={<NotePencil size={20} />}
                            variant='link'
                            color='white'
                          />

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

            {data && (
              <HStack mt={6} justify='flex-end'>
                <PaginationFooter
                  page={data.meta.currentPage}
                  limit={limit}
                  totalItems={data.meta.totalItems}
                  totalPages={data.meta.totalPages}
                  isFetching={isFetching}
                  onChangeLimit={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => p + 1)}
                />
              </HStack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
