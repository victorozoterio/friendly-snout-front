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
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select as ChakraSelect } from 'chakra-react-select';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { getAllMedicineBrands, getMedicineByUuid, updateMedicine } from '../../../../services';
import type { GetMedicineResponse } from '../../../../services/medicines/types';
import { createSelectStyles } from '../../../../utils';
import { UpdateMedicineFormData, updateMedicineSchema } from './schema';

export type UpdateMedicineDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  uuid?: string;
};

const inputStyles = {
  h: '2.75rem' as const,
  bg: 'white' as const,
  border: '1px solid' as const,
  borderRadius: 'md' as const,
  color: 'gray.900' as const,
  fontWeight: 'medium' as const,
  _placeholder: { color: 'placeholder' as const },
  _hover: { borderColor: 'primary' as const },
  _focus: {
    borderColor: 'primary' as const,
    outline: '1px solid var(--chakra-colors-primary)' as const,
    outlineOffset: '0px' as const,
  },
};

export const UpdateMedicineDrawer = ({ isOpen, onClose, uuid }: UpdateMedicineDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<UpdateMedicineFormData>({
    resolver: zodResolver(updateMedicineSchema),
    defaultValues: { name: '', description: '', quantity: undefined, medicineBrandUuid: '' },
  });

  const medicineQuery = useQuery<GetMedicineResponse>({
    queryKey: ['medicines', 'detail', uuid],
    queryFn: () => getMedicineByUuid(uuid ?? ''),
    enabled: isOpen && !!uuid,
  });

  const brandsQuery = useQuery({
    queryKey: ['medicine-brands', 'list', 1, 100],
    queryFn: () => getAllMedicineBrands({ page: 1, limit: 100 }),
    enabled: isOpen && !!uuid,
  });

  const brandOptions = React.useMemo(() => {
    const brandsFromApi = brandsQuery.data?.data.map((brand) => ({ value: brand.uuid, label: brand.name })) ?? [];
    const medicineData = medicineQuery.data;
    const currentBrand = medicineData?.medicineBrand;

    if (currentBrand && !brandsFromApi.some((option) => option.value === currentBrand.uuid)) {
      return [{ value: currentBrand.uuid, label: currentBrand.name }, ...brandsFromApi];
    }
    return brandsFromApi;
  }, [brandsQuery.data?.data, medicineQuery.data]);

  React.useEffect(() => {
    const medicineData = medicineQuery.data;
    if (!medicineData) return;

    const brandUuid = medicineData.medicineBrand?.uuid ?? '';
    reset(
      {
        name: medicineData.name ?? '',
        description: medicineData.description ?? '',
        quantity: medicineData.quantity,
        medicineBrandUuid: brandUuid,
      },
      { keepDefaultValues: true },
    );
  }, [medicineQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({
      uuid: medicineUuid,
      data,
    }: {
      uuid: string;
      data: { name: string; description?: string; quantity: number; medicineBrandUuid: string };
    }) => updateMedicine(medicineUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'detail', uuid] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: UpdateMedicineFormData) => {
    if (!uuid) return;
    if (!isDirty) {
      onClose();
      return;
    }
    updateMutation.mutate({
      uuid,
      data: {
        name: data.name,
        description: data.description || undefined,
        quantity: data.quantity,
        medicineBrandUuid: data.medicineBrandUuid,
      },
    });
  };

  const handleClose = () => {
    if (updateMutation.isPending) return;
    reset();
    onClose();
  };

  const isLoadingMedicine = medicineQuery.isLoading || (medicineQuery.isFetching && !medicineQuery.data);
  const isErrorMedicine = medicineQuery.isError;

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
        <DrawerHeader bg='background' py={6} px={8}>
          <HStack justify='space-between' align='center'>
            <Text fontSize='xl' fontWeight='bold' color='primary'>
              Editar medicamento
            </Text>

            <DrawerCloseButton
              position='static'
              color='primary'
              size='lg'
              borderRadius='full'
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
            />
          </HStack>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          {isLoadingMedicine && (
            <VStack mt={8} spacing={4}>
              <Spinner size='lg' />
              <Text color='gray.600'>Carregando dados do medicamento...</Text>
            </VStack>
          )}

          {isErrorMedicine && (
            <VStack mt={8} spacing={2}>
              <Text color='error'>Erro ao carregar medicamento.</Text>
            </VStack>
          )}

          {!isLoadingMedicine && !isErrorMedicine && medicineQuery.data && (
            <VStack as='form' id='update-medicine-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.name} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Nome *
                </FormLabel>
                <Input
                  placeholder='Nome do medicamento'
                  {...inputStyles}
                  borderColor={errors.name ? 'error' : 'inputBorder'}
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

              <FormControl isInvalid={!!errors.medicineBrandUuid} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Marca *
                </FormLabel>
                <Controller
                  name='medicineBrandUuid'
                  control={control}
                  render={({ field }) => (
                    <ChakraSelect
                      placeholder='Selecione a marca'
                      options={brandOptions}
                      value={brandOptions.find((o) => o.value === field.value) ?? null}
                      onChange={(opt) => field.onChange(opt?.value ?? '')}
                      onBlur={field.onBlur}
                      chakraStyles={createSelectStyles<string>(!!errors.medicineBrandUuid)}
                      isLoading={brandsQuery.isLoading}
                    />
                  )}
                />
                <FormErrorInline message={errors.medicineBrandUuid?.message} />
              </FormControl>

              <FormControl isInvalid={!!errors.quantity} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Quantidade *
                </FormLabel>
                <Input
                  type='number'
                  placeholder='0'
                  {...inputStyles}
                  borderColor={errors.quantity ? 'error' : 'inputBorder'}
                  {...register('quantity', {
                    setValueAs: (value) => {
                      if (value === null || value === '') return undefined;
                      const number = Number(value);
                      return !Number.isNaN(number) ? number : undefined;
                    },
                  })}
                />
                <Text fontSize='xs' color='gray.500' mt={1}>
                  Use -1 para estoque infinito
                </Text>
                <FormErrorInline message={errors.quantity?.message} />
              </FormControl>

              <FormControl isInvalid={!!errors.description} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Descrição
                </FormLabel>
                <Textarea
                  placeholder='Descrição (opcional)'
                  bg='white'
                  border='1px solid'
                  borderColor='inputBorder'
                  borderRadius='md'
                  minH='80px'
                  _placeholder={{ color: 'placeholder' }}
                  _focus={{ borderColor: 'primary' }}
                  {...register('description', { setValueAs: (v: string) => v || undefined })}
                />
                <FormErrorInline message={errors.description?.message} />
              </FormControl>
            </VStack>
          )}
        </DrawerBody>

        {!isLoadingMedicine && !isErrorMedicine && medicineQuery.data && (
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
                form='update-medicine-form'
                bg='primary'
                color='white'
                fontWeight='bold'
                borderRadius='full'
                px={6}
                h='2.75rem'
                _hover={{ bg: 'secondary' }}
                isLoading={updateMutation.isPending}
                loadingText='Atualizando...'
                isDisabled={isLoadingMedicine || isErrorMedicine}
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
