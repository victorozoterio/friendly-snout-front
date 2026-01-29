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
  VStack,
} from '@chakra-ui/react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Files, MagnifyingGlass, Trash } from 'phosphor-react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DeleteConfirmDialog, Header, PaginationFooter, TableSortableHeader } from '../../components';
import { deleteAttachment, getAllAttachments } from '../../services';
import type { GetAttachmentResponse } from '../../services/attachments/types';
import { mask, Pagination } from '../../utils';
import { CreateAttachmentDrawer } from './components/create-attachment-drawer';
import { applySort, DEFAULT_SORT_BY, DEFAULT_SORT_STATE, SortableKey, SortState } from './utils/sort';

export const Attachments = () => {
  const queryClient = useQueryClient();
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

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Pagination<GetAttachmentResponse>>({
    queryKey: ['attachments', 'by-animal', animalUuid, page, limit, sortBy, debouncedSearch],
    queryFn: () => {
      if (!animalUuid) throw new Error('animalUuid is required');
      return getAllAttachments({
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
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', 'by-animal', animalUuid] });
      onDeleteClose();
      setSelectedUuid(null);
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

  const handleOpenAttachment = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const attachments = data?.data ?? [];
  const hasData = attachments.length > 0;
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
              placeholder='Pesquise por um anexo'
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
              <Text fontWeight='bold'>Anexar</Text>
              <Files size={20} />
            </HStack>
          </Button>
        </HStack>
      </Header>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteDialog}
        entityLabel='anexo'
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <CreateAttachmentDrawer isOpen={isCreateDrawerOpen} onClose={onCreateDrawerClose} animalUuid={animalUuid} />

      <Box w='100%' px={8} pt={10} pb={10}>
        {isLoading && (
          <VStack mt={20} spacing={4}>
            <Spinner size='lg' />
            <Text color='gray.600'>Carregando anexos...</Text>
          </VStack>
        )}

        {isError && (
          <VStack mt={20} spacing={3}>
            <Text color='error' fontWeight='bold'>
              Erro ao carregar anexos
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
                      w='40%'
                      sortKey='name'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Nome
                    </TableSortableHeader>
                    <TableSortableHeader
                      w='20%'
                      sortKey='type'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Tipo
                    </TableSortableHeader>
                    <TableSortableHeader
                      w='34%'
                      sortKey='createdAt'
                      sortState={sortState}
                      onSort={(key) => handleSortClick(key as SortableKey)}
                    >
                      Criado em
                    </TableSortableHeader>
                    <Th w='6%' color='white' textAlign='right' pr={10}>
                      Ações
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {!hasData ? (
                    <Tr>
                      <Td colSpan={4} p={0}>
                        <VStack py={12} spacing={3}>
                          <Box color='primary' opacity={0.9}>
                            <Files size={44} />
                          </Box>

                          <VStack spacing={1}>
                            <Text fontWeight='bold' color='primary'>
                              {hasSearch ? 'Nenhum anexo encontrado' : 'Nenhum anexo cadastrado ainda'}
                            </Text>
                            <Text color='gray.600' fontSize='sm' textAlign='center' maxW='520px'>
                              {hasSearch
                                ? 'Tente ajustar o termo da busca ou limpe o filtro para ver todos os anexos.'
                                : 'Clique em “Anexar” para enviar o primeiro arquivo deste animal.'}
                            </Text>
                          </VStack>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    attachments.map((attachment) => (
                      <Tr key={attachment.uuid} bg='primary'>
                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{attachment.name}</Text>
                        </Td>
                        <Td color='white' fontWeight='bold' textTransform='capitalize'>
                          <Text isTruncated>{attachment.type}</Text>
                        </Td>
                        <Td color='white' fontWeight='bold'>
                          <Text isTruncated>{mask.formatToBrazilianDate(attachment.createdAt)}</Text>
                        </Td>
                        <Td>
                          <HStack justify='flex-end' spacing={0}>
                            <IconButton
                              aria-label='Visualizar'
                              icon={<Eye size={20} />}
                              variant='link'
                              color='gray.200'
                              _hover={{ color: 'gray.300', transform: 'scale(1.1)' }}
                              onClick={() => handleOpenAttachment(attachment.url)}
                            />
                            <IconButton
                              aria-label='Excluir'
                              icon={<Trash size={20} />}
                              variant='link'
                              color='red.400'
                              _hover={{ color: 'red.500', transform: 'scale(1.1)' }}
                              onClick={() => openDeleteDialog(attachment.uuid)}
                              isLoading={deleteMutation.isPending && selectedUuid === attachment.uuid}
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
