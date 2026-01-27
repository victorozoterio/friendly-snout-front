import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MagnifyingGlass, NotePencil, Trash } from 'phosphor-react';
import * as React from 'react';
import Paws from '../../assets/paws.png';
import { DeleteConfirmDialog, Header, PaginationFooter, TableSortableHeader } from '../../components';
import { deleteAnimal, getAllAnimals } from '../../services';
import { GetAnimalResponse } from '../../services/animals/types';
import { Pagination } from '../../utils';
import { FivAndFelvBadge, YesNoBadge } from './components/badges';
import { CreateAnimalDrawer } from './components/create-animal-drawer';
import { UpdateAnimalDrawer } from './components/update-animal-drawer';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, SortableKey, SortState } from './utils/sort';

export const Animals = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isCreateDrawerOpen, onOpen: onCreateDrawerOpen, onClose: onCreateDrawerClose } = useDisclosure();

  const { isOpen: isUpdateDrawerOpen, onOpen: onUpdateDrawerOpen, onClose: onUpdateDrawerClose } = useDisclosure();
  const [editUuid, setEditUuid] = React.useState<string | null>(null);

  const [selectedUuid, setSelectedUuid] = React.useState<string | null>(null);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [sortState, setSortState] = React.useState<SortState>(DEFAULT_SORT_STATE);
  const [sortBy, setSortBy] = React.useState<string>(DEFAULT_SORT_BY);

  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetAnimalResponse>>({
    queryKey: ['animals', 'list', page, limit, sortBy, debouncedSearch],
    queryFn: () =>
      getAllAnimals({
        page,
        limit,
        sortBy,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', 'list'] });
      onClose();
      setSelectedUuid(null);

      toast({
        title: 'Marca excluída com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao excluir o animal',
        description: 'Não foi possível excluir o animal. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
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

  const openUpdateDrawer = (uuid: string) => {
    setEditUuid(uuid);
    onUpdateDrawerOpen();
  };

  const handleCloseUpdateDrawer = () => {
    onUpdateDrawerClose();
    setEditUuid(null);
  };

  return (
    <Box minH='100vh' bg='background'>
      <Header>
        <HStack spacing={4}>
          <Box position='relative'>
            <Box
              position='absolute'
              left={3}
              top='50%'
              transform='translateY(-50%)'
              color='primary'
              zIndex={2}
              pointerEvents='none'
            >
              <MagnifyingGlass size={18} />
            </Box>

            <Input
              pl='2.5rem'
              w='240px'
              h='2.75rem'
              bg='white'
              borderRadius='full'
              border='1px solid'
              borderColor='inputBorder'
              placeholder='Pesquise por um animal'
              _placeholder={{ color: 'placeholder' }}
              _focus={{ borderColor: 'primary' }}
              _focusVisible={{ borderColor: 'primary' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Button
            bg='primary'
            color='white'
            borderRadius='full'
            px={6}
            h='2.75rem'
            _hover={{ bg: 'secondary' }}
            onClick={onCreateDrawerOpen}
          >
            <HStack spacing={2}>
              <Text fontWeight='bold'>Cadastrar</Text>
              <Box as='img' src={Paws} alt='Patas' w='1.1rem' />
            </HStack>
          </Button>
        </HStack>
      </Header>

      <DeleteConfirmDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        entityLabel='animal'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <CreateAnimalDrawer isOpen={isCreateDrawerOpen} onClose={onCreateDrawerClose} />

      <UpdateAnimalDrawer isOpen={isUpdateDrawerOpen} onClose={handleCloseUpdateDrawer} uuid={editUuid ?? undefined} />

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
                    <TableSortableHeader
                      w='10%'
                      sortKey='status'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Status
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='22%'
                      sortKey='name'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Nome
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='10%'
                      sortKey='species'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Espécie
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='10%'
                      sortKey='breed'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Raça
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='8%'
                      sortKey='size'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Porte
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='8%'
                      sortKey='castrated'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Castrado
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='12%'
                      sortKey='fiv'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      FIV
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='12%'
                      sortKey='felv'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      FELV
                    </TableSortableHeader>

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
                            onClick={() => openUpdateDrawer(animal.uuid)}
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
