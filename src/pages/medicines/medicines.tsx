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
import { AxiosError, AxiosResponse } from 'axios';
import { MagnifyingGlass, NotePencil, Power, Trash } from 'phosphor-react';
import * as React from 'react';
import Medicine from '../../assets/medicine.png';
import {
  ActionConfirmDialog,
  DeleteConfirmDialog,
  Header,
  PaginationFooter,
  TableSortableHeader,
} from '../../components';
import { activateMedicine, deactivateMedicine, deleteMedicine, getAllMedicines } from '../../services';
import type { GetMedicineResponse } from '../../services/medicines/types';
import { mask, Pagination } from '../../utils';
import { CreateMedicineDrawer } from './components/create-medicine-drawer';
import { UpdateMedicineDrawer } from './components/update-medicine-drawer';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, SortableKey, SortState } from './utils/sort';

export const Medicines = () => {
  const queryClient = useQueryClient();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isActivateOpen, onOpen: onActivateOpen, onClose: onActivateClose } = useDisclosure();
  const { isOpen: isDeactivateOpen, onOpen: onDeactivateOpen, onClose: onDeactivateClose } = useDisclosure();
  const { isOpen: isCreateDrawerOpen, onOpen: onCreateDrawerOpen, onClose: onCreateDrawerClose } = useDisclosure();
  const { isOpen: isUpdateDrawerOpen, onOpen: onUpdateDrawerOpen, onClose: onUpdateDrawerClose } = useDisclosure();

  const [editUuid, setEditUuid] = React.useState<string | null>(null);
  const [selectedUuid, setSelectedUuid] = React.useState<string | null>(null);
  const [powerUuid, setPowerUuid] = React.useState<string | null>(null);
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

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetMedicineResponse>>({
    queryKey: ['medicines', 'list', page, limit, sortBy, debouncedSearch],
    queryFn: () =>
      getAllMedicines({
        page,
        limit,
        sortBy,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'list'] });
      onDeleteClose();
      setSelectedUuid(null);

      toast({
        title: 'Medicamento excluído com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (error: AxiosError<AxiosResponse>) => {
      if (error.response?.status === 409) {
        toast({
          title: 'Não foi possível excluir o medicamento',
          description: 'Foram feitas aplicações com este medicamento. Remova as aplicações antes de excluí-lo.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      toast({
        title: 'Erro ao excluir o medicamento',
        description: 'Não foi possível excluir o medicamento. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'list'] });
      onActivateClose();
      setPowerUuid(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'list'] });
      onDeactivateClose();
      setPowerUuid(null);
    },
  });

  const openDeleteDialog = (uuid: string) => {
    setSelectedUuid(uuid);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (!selectedUuid) return;
    deleteMutation.mutate({ uuid: selectedUuid });
  };

  const handleCloseDeleteDialog = () => {
    if (deleteMutation.isPending) return;
    onDeleteClose();
    setSelectedUuid(null);
  };

  const openActivateDialog = (uuid: string) => {
    setPowerUuid(uuid);
    onActivateOpen();
  };

  const openDeactivateDialog = (uuid: string) => {
    setPowerUuid(uuid);
    onDeactivateOpen();
  };

  const confirmActivate = () => {
    if (!powerUuid) return;
    activateMutation.mutate({ uuid: powerUuid });
  };

  const confirmDeactivate = () => {
    if (!powerUuid) return;
    deactivateMutation.mutate({ uuid: powerUuid });
  };

  const handleCloseActivateDialog = () => {
    if (activateMutation.isPending) return;
    onActivateClose();
    setPowerUuid(null);
  };

  const handleCloseDeactivateDialog = () => {
    if (deactivateMutation.isPending) return;
    onDeactivateClose();
    setPowerUuid(null);
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

  const medicines = data?.data ?? [];
  const hasData = medicines.length > 0;
  const hasSearch = debouncedSearch.trim().length > 0;

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
              placeholder='Pesquise por um medicamento'
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
              <Box as='img' src={Medicine} alt='Medicamento' w='1.1rem' />
            </HStack>
          </Button>
        </HStack>
      </Header>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteDialog}
        entityLabel='medicamento'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <ActionConfirmDialog
        isOpen={isActivateOpen}
        onClose={handleCloseActivateDialog}
        title='Ativar medicamento'
        highlightText='Após ativar o medicamento ele poderá ser aplicado nos animais!'
        bodyText='Deseja confirmar a ativação?'
        confirmButtonText='Ativar'
        confirmButtonColorScheme='success'
        isLoading={activateMutation.isPending}
        onConfirm={confirmActivate}
      />

      <ActionConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={handleCloseDeactivateDialog}
        title='Inativar medicamento'
        highlightText='Após inativar o medicamento ele não poderá ser aplicado nos animais!'
        bodyText='Deseja confirmar a inativação?'
        confirmButtonText='Inativar'
        confirmButtonColorScheme='error'
        isLoading={deactivateMutation.isPending}
        onConfirm={confirmDeactivate}
      />

      <CreateMedicineDrawer isOpen={isCreateDrawerOpen} onClose={onCreateDrawerClose} />
      <UpdateMedicineDrawer
        isOpen={isUpdateDrawerOpen}
        onClose={handleCloseUpdateDrawer}
        uuid={editUuid ?? undefined}
      />

      <Box w='100%' px={8} pt={10} pb={10}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando medicamentos...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar medicamentos
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
              overflow='hidden'
            >
              <Table w='100%' layout='fixed'>
                <Thead bg='secondary'>
                  <Tr>
                    <TableSortableHeader
                      w='24%'
                      sortKey='name'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Nome
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='12%'
                      sortKey='quantity'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Quantidade
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='20%'
                      sortKey='createdAt'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Criado em
                    </TableSortableHeader>

                    <Th w='14%' color='white'>
                      Status
                    </Th>

                    <Th w='20%' color='white' textAlign='right' pr={14}>
                      Ações
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {!hasData ? (
                    <Tr>
                      <Td colSpan={5} p={0}>
                        <VStack py={12} spacing={3}>
                          <Box>
                            <Box as='img' src={Medicine} alt='Medicamento' w='48px' opacity={0.9} />
                          </Box>

                          <VStack spacing={1}>
                            <Text fontWeight='bold' color='primary'>
                              {hasSearch ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento cadastrado ainda'}
                            </Text>

                            <Text color='gray.600' fontSize='sm' textAlign='center' maxW='520px'>
                              {hasSearch
                                ? 'Tente ajustar o termo da busca ou limpe o filtro.'
                                : 'Clique em “Cadastrar” para adicionar o primeiro medicamento.'}
                            </Text>
                          </VStack>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    medicines.map((medicine) => (
                      <Tr key={medicine.uuid} bg='primary'>
                        <Td color='white' fontWeight='bold' textTransform='capitalize'>
                          <Text isTruncated>{medicine.name}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{medicine.quantity === -1 ? '∞' : medicine.quantity}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{mask.formatToBrazilianDate(medicine.createdAt)}</Text>
                        </Td>

                        <Td color={medicine.isActive ? 'green.400' : 'red.400'} fontWeight='bold'>
                          <Text isTruncated textTransform='capitalize'>
                            {medicine.isActive ? 'Ativo' : 'Inativo'}
                          </Text>
                        </Td>

                        <Td>
                          <HStack justify='flex-end' spacing={0}>
                            <IconButton
                              aria-label={medicine.isActive ? 'Inativar' : 'Ativar'}
                              icon={<Power size={20} />}
                              variant='link'
                              color='gray.200'
                              _hover={{ color: 'gray.300', transform: 'scale(1.1)' }}
                              onClick={() =>
                                medicine.isActive
                                  ? openDeactivateDialog(medicine.uuid)
                                  : openActivateDialog(medicine.uuid)
                              }
                              isLoading={
                                medicine.isActive
                                  ? deactivateMutation.isPending && powerUuid === medicine.uuid
                                  : activateMutation.isPending && powerUuid === medicine.uuid
                              }
                            />

                            <IconButton
                              aria-label='Editar'
                              icon={<NotePencil size={20} />}
                              variant='link'
                              color='orange.400'
                              _hover={{ color: 'orange.500', transform: 'scale(1.1)' }}
                              onClick={() => openUpdateDrawer(medicine.uuid)}
                            />

                            <IconButton
                              aria-label='Excluir'
                              icon={<Trash size={20} />}
                              variant='link'
                              color='red.400'
                              _hover={{ color: 'red.500', transform: 'scale(1.1)' }}
                              onClick={() => openDeleteDialog(medicine.uuid)}
                              isLoading={deleteMutation.isPending && selectedUuid === medicine.uuid}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {data && hasData && (
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
