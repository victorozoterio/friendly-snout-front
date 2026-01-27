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
import { MagnifyingGlass, NotePencil, Trash } from 'phosphor-react';
import * as React from 'react';
import { DeleteConfirmDialog, Header, PaginationFooter, TableSortableHeader } from '../../components';
import { deleteMedicineBrand, getAllMedicineBrands } from '../../services';
import type { GetMedicineBrandResponse } from '../../services/medicine-brands/types';
import { mask, Pagination } from '../../utils';
import { CreateMedicineBrandDrawer } from './components/create-medicine-brand-drawer';
import { UpdateMedicineBrandDrawer } from './components/update-medicine-brand-drawer';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, SortableKey, SortState } from './utils/sort';

export const MedicineBrands = () => {
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

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetMedicineBrandResponse>>({
    queryKey: ['medicine-brands', 'list', page, limit, sortBy, debouncedSearch],
    queryFn: () =>
      getAllMedicineBrands({
        page,
        limit,
        sortBy,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteMedicineBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-brands', 'list'] });
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
    onError: (error: AxiosError<AxiosResponse>) => {
      if (error.response?.status === 409) {
        toast({
          title: 'Não foi possível excluir a marca',
          description:
            'Esta marca possui medicamentos ativos vinculados. Remova/Desative os medicamentos antes de excluir a marca.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      toast({
        title: 'Erro ao excluir a marca',
        description: 'Não foi possível excluir a marca. Tente novamente mais tarde.',
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
              placeholder='Pesquise por uma marca'
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
            <Text fontWeight='bold'>Cadastrar</Text>
          </Button>
        </HStack>
      </Header>

      <DeleteConfirmDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        entityLabel='marca de medicamento'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <CreateMedicineBrandDrawer isOpen={isCreateDrawerOpen} onClose={onCreateDrawerClose} />
      <UpdateMedicineBrandDrawer
        isOpen={isUpdateDrawerOpen}
        onClose={handleCloseUpdateDrawer}
        uuid={editUuid ?? undefined}
      />

      <Box w='100%' px={8} pt={10} pb={10}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando marcas...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar marcas
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
                      w='50%'
                      sortKey='name'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Nome
                    </TableSortableHeader>
                    <TableSortableHeader
                      w='34%'
                      sortKey='createdAt'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Criado em
                    </TableSortableHeader>
                    <Th w='16%' color='white' textAlign='right' pr={12}>
                      Ações
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.data.map((brand) => (
                    <Tr key={brand.uuid} bg='primary'>
                      <Td color='white' fontWeight='bold' textTransform='capitalize'>
                        <Text isTruncated>{brand.name}</Text>
                      </Td>
                      <Td color='white' fontWeight='bold'>
                        <Text isTruncated>{mask.formatToBrazilianDate(brand.createdAt)}</Text>
                      </Td>
                      <Td>
                        <HStack justify='flex-end' spacing={1}>
                          <IconButton
                            aria-label='Editar'
                            icon={<NotePencil size={20} />}
                            variant='link'
                            color='white'
                            onClick={() => openUpdateDrawer(brand.uuid)}
                          />
                          <IconButton
                            aria-label='Excluir'
                            icon={<Trash size={20} />}
                            variant='link'
                            color='white'
                            onClick={() => openDeleteDialog(brand.uuid)}
                            isLoading={deleteMutation.isPending && selectedUuid === brand.uuid}
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
