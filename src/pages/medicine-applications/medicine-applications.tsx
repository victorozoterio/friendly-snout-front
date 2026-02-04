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
import { FirstAidKit, MagnifyingGlass, Trash } from 'phosphor-react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DeleteConfirmDialog, Header, PaginationFooter, TableSortableHeader } from '../../components';
import { deleteMedicineApplication, getAllMedicineApplications } from '../../services';
import type { GetMedicineApplicationResponse } from '../../services/medicine-applications/types';
import { Pagination } from '../../utils';
import { formatToBrazilianDateTimeMask } from '../../utils/masks/date';
import { CreateMedicineApplicationDrawer } from './components';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, SortableKey, SortState } from './utils/sort';

const getMedicineName = (application: GetMedicineApplicationResponse) => {
  const anyApp = application as unknown as { medicine?: { name?: string }; medicineName?: string };
  return anyApp.medicine?.name ?? anyApp.medicineName ?? '-';
};

export const MedicineApplications = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { animalUuid } = useParams<{ animalUuid: string }>();

  const { isOpen: isCreateDrawerOpen, onOpen: onCreateDrawerOpen, onClose: onCreateDrawerClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetMedicineApplicationResponse>>({
    queryKey: ['medicine-applications', 'by-animal', animalUuid, page, limit, sortBy, debouncedSearch],
    queryFn: () => {
      if (!animalUuid) throw new Error('animalUuid is required');
      return getAllMedicineApplications({
        animalUuid,
        page,
        limit,
        sortBy,
        search: debouncedSearch || undefined,
      });
    },
    placeholderData: keepPreviousData,
    enabled: !!animalUuid,
  });

  const handleSortClick = (key: SortableKey) => {
    applySort(key, setPage, setSortState, setSortBy);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteMedicineApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-applications', 'by-animal', animalUuid] });
      onDeleteClose();
      setSelectedUuid(null);

      toast({
        title: 'Aplicação excluída com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao excluir aplicação',
        description: 'Não foi possível excluir a aplicação. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
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

  const applications = data?.data ?? [];
  const hasData = applications.length > 0;
  const hasSearch = debouncedSearch.trim().length > 0;

  if (!animalUuid) {
    return (
      <Box minH='100vh' bg='background'>
        <Header />
        <VStack mt={20} spacing={3}>
          <Text color='error' fontWeight='bold'>
            Animal não encontrado
          </Text>
        </VStack>
      </Box>
    );
  }

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
              <Text fontWeight='bold'>Aplicar</Text>
              <FirstAidKit size={20} />
            </HStack>
          </Button>
        </HStack>
      </Header>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteDialog}
        entityLabel='aplicação'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <CreateMedicineApplicationDrawer
        isOpen={isCreateDrawerOpen}
        onClose={onCreateDrawerClose}
        animalUuid={animalUuid}
      />

      <Box w='100%' px={8} pt={10} pb={10}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando aplicações...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar aplicações
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
                      w='25%'
                      sortKey='medicine'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Medicamento
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
                      w='18%'
                      sortKey='frequency'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Frequência
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='20%'
                      sortKey='appliedAt'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Aplicado em
                    </TableSortableHeader>

                    <TableSortableHeader
                      w='20%'
                      sortKey='endsAt'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Última aplicação será em
                    </TableSortableHeader>

                    <Th w='5%' color='white' textAlign='right' pr={10}>
                      Ações
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {!hasData ? (
                    <Tr>
                      <Td colSpan={6} p={0}>
                        <VStack py={12} spacing={3}>
                          <Box color='primary' opacity={0.9}>
                            <FirstAidKit size={44} />
                          </Box>

                          <VStack spacing={1}>
                            <Text fontWeight='bold' color='primary'>
                              {hasSearch ? 'Nenhuma aplicação encontrada' : 'Nenhuma aplicação cadastrada ainda'}
                            </Text>

                            <Text color='gray.600' fontSize='sm' textAlign='center' maxW='520px'>
                              {hasSearch
                                ? 'Tente ajustar o termo da busca ou limpe o filtro para ver todas as aplicações.'
                                : 'Clique em “Aplicar” para registrar a primeira aplicação deste animal.'}
                            </Text>
                          </VStack>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    applications.map((application) => (
                      <Tr key={application.uuid} bg='primary'>
                        <Td color='white' fontWeight='bold' textTransform='capitalize'>
                          <Text isTruncated>{getMedicineName(application)}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{application.quantity}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{application.frequency ?? '-'}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{formatToBrazilianDateTimeMask(application.appliedAt)}</Text>
                        </Td>

                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>
                            {application.endsAt ? formatToBrazilianDateTimeMask(application.endsAt) : '-'}
                          </Text>
                        </Td>

                        <Td>
                          <HStack justify='flex-end' spacing={0}>
                            <IconButton
                              aria-label='Excluir'
                              icon={<Trash size={20} />}
                              variant='link'
                              color='red.400'
                              _hover={{ color: 'red.500', transform: 'scale(1.1)' }}
                              onClick={() => openDeleteDialog(application.uuid)}
                              isLoading={deleteMutation.isPending && selectedUuid === application.uuid}
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
