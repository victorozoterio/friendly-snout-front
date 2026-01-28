import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { getMedicineBrandByUuid, updateMedicineBrand } from '../../../../services';
import type { GetMedicineBrandResponse } from '../../../../services/medicine-brands/types';
import { UpdateMedicineBrandFormData, updateMedicineBrandSchema } from './schema';

export type UpdateMedicineBrandDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  uuid?: string;
};

export const UpdateMedicineBrandDrawer = ({ isOpen, onClose, uuid }: UpdateMedicineBrandDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateMedicineBrandFormData>({
    resolver: zodResolver(updateMedicineBrandSchema),
    defaultValues: { name: '' },
  });

  const brandQuery = useQuery<GetMedicineBrandResponse>({
    queryKey: ['medicine-brands', 'detail', uuid],
    queryFn: () => getMedicineBrandByUuid(uuid ?? ''),
    enabled: isOpen && !!uuid,
  });

  React.useEffect(() => {
    if (!brandQuery.data) return;
    const b = brandQuery.data;
    reset({ name: b.name ?? '' }, { keepDefaultValues: true });
  }, [brandQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ uuid: brandUuid, data }: { uuid: string; data: { name: string } }) =>
      updateMedicineBrand(brandUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-brands', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['medicine-brands', 'detail', uuid] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: UpdateMedicineBrandFormData) => {
    if (!uuid) return;
    if (!isDirty) {
      onClose();
      return;
    }
    updateMutation.mutate({ uuid, data: { name: data.name } });
  };

  const handleClose = () => {
    if (updateMutation.isPending) return;
    reset();
    onClose();
  };

  const isLoadingBrand = brandQuery.isLoading || (brandQuery.isFetching && !brandQuery.data);
  const isErrorBrand = brandQuery.isError;

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={handleClose} size='md' autoFocus={false}>
      <DrawerOverlay bg='blackAlpha.400' />
      <DrawerContent
        bg='background'
        overflow='hidden'
        borderTopLeftRadius='2xl'
        borderBottomLeftRadius='2xl'
        borderTopRightRadius={0}
        borderBottomRightRadius={0}
        boxShadow='xl'
      >
        <DrawerCloseButton
          color='primary'
          size='lg'
          borderRadius='full'
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
        />

        <DrawerHeader bg='background' py={6} px={8}>
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            Editar marca de medicamento
          </Text>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          {isLoadingBrand && (
            <VStack mt={8} spacing={4}>
              <Spinner size='lg' />
              <Text color='gray.600'>Carregando dados da marca...</Text>
            </VStack>
          )}

          {isErrorBrand && (
            <VStack mt={8} spacing={2}>
              <Text color='error'>Erro ao carregar marca.</Text>
            </VStack>
          )}

          {!isLoadingBrand && !isErrorBrand && brandQuery.data && (
            <VStack as='form' id='update-medicine-brand-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.name} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Nome *
                </FormLabel>
                <Input
                  placeholder='Nome da marca'
                  h='2.75rem'
                  bg='white'
                  border='1px solid'
                  borderColor={errors.name ? 'error' : 'inputBorder'}
                  borderRadius='md'
                  color='gray.900'
                  fontWeight='medium'
                  _placeholder={{ color: 'placeholder' }}
                  _hover={{ borderColor: errors.name ? 'error' : 'primary' }}
                  _focus={{
                    borderColor: errors.name ? 'error' : 'primary',
                    outline: errors.name
                      ? '1px solid var(--chakra-colors-error)'
                      : '1px solid var(--chakra-colors-primary)',
                    outlineOffset: '0px',
                  }}
                  {...register('name')}
                />
                <FormErrorInline message={errors.name?.message} />
              </FormControl>
            </VStack>
          )}
        </DrawerBody>

        {!isLoadingBrand && !isErrorBrand && brandQuery.data && (
          <DrawerFooter bg='background' px={8} py={4}>
            <HStack spacing={3} w='100%' justify='flex-end'>
              <Button
                variant='outline'
                onClick={handleClose}
                borderColor='inputBorder'
                color='primary'
                fontWeight='bold'
                borderRadius='full'
                px={6}
                h='2.75rem'
                _hover={{ bg: 'gray.50', borderColor: 'primary' }}
                isDisabled={updateMutation.isPending}
              >
                Cancelar
              </Button>

              <Button
                type='submit'
                form='update-medicine-brand-form'
                bg='primary'
                color='white'
                fontWeight='bold'
                borderRadius='full'
                px={6}
                h='2.75rem'
                _hover={{ bg: 'secondary' }}
                isLoading={updateMutation.isPending}
                loadingText='Atualizando...'
                isDisabled={isLoadingBrand || isErrorBrand}
              >
                Atualizar
              </Button>
            </HStack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
