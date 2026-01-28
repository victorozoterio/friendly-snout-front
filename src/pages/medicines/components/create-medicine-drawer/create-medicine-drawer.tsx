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
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select as ChakraSelect } from 'chakra-react-select';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { createMedicine, getAllMedicineBrands } from '../../../../services';
import { createSelectStyles } from '../../../../utils';
import { CreateMedicineFormData, createMedicineSchema } from './schema';

export type CreateMedicineDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
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

export const CreateMedicineDrawer = ({ isOpen, onClose }: CreateMedicineDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateMedicineFormData>({
    resolver: zodResolver(createMedicineSchema),
    defaultValues: { name: '', description: '', quantity: undefined, medicineBrandUuid: '' },
  });

  const brandsQuery = useQuery({
    queryKey: ['medicine-brands', 'list', 1, 100],
    queryFn: () => getAllMedicineBrands({ page: 1, limit: 100 }),
    enabled: isOpen,
  });

  const brandOptions = brandsQuery.data?.data.map((b) => ({ value: b.uuid, label: b.name })) ?? [];

  const createMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'list'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CreateMedicineFormData) => {
    createMutation.mutate({
      name: data.name,
      description: data.description || undefined,
      quantity: data.quantity ?? undefined,
      medicineBrandUuid: data.medicineBrandUuid,
    });
  };

  const handleClose = () => {
    if (createMutation.isPending) return;
    reset();
    onClose();
  };

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
            Cadastrar medicamento
          </Text>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          <VStack as='form' id='create-medicine-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
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
        </DrawerBody>

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
              isDisabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              form='create-medicine-form'
              bg='primary'
              color='white'
              fontWeight='bold'
              borderRadius='full'
              px={6}
              h='2.75rem'
              _hover={{ bg: 'secondary' }}
              isLoading={createMutation.isPending}
              loadingText='Cadastrando...'
            >
              Cadastrar
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
