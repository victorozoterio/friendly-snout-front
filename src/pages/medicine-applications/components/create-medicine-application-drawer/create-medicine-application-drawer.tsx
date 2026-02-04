import {
  Button,
  Checkbox,
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Select as ChakraSelect } from 'chakra-react-select';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { createMedicineApplication, getAllMedicines } from '../../../../services';
import { brazilianDateTimeToUtcIso, createSelectStyles, mask, MedicineApplicationFrequency } from '../../../../utils';
import { CreateMedicineApplicationFormData, createMedicineApplicationSchema } from './schema';

export type CreateMedicineApplicationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  animalUuid: string;
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

export const CreateMedicineApplicationDrawer = ({
  isOpen,
  onClose,
  animalUuid,
}: CreateMedicineApplicationDrawerProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<CreateMedicineApplicationFormData>({
    resolver: zodResolver(createMedicineApplicationSchema),
    defaultValues: {
      medicineUuid: '',
      quantity: undefined,
      appliedAt: '',
      scheduleNextApplication: false,
      frequency: MedicineApplicationFrequency.DOES_NOT_REPEAT,
      nextApplicationAt: '',
      endsAt: '',
    },
  });

  const scheduleNextApplication = watch('scheduleNextApplication');
  const frequency = watch('frequency');
  const isRepeating = scheduleNextApplication && frequency !== MedicineApplicationFrequency.DOES_NOT_REPEAT;

  React.useEffect(() => {
    if (!scheduleNextApplication) {
      setValue('nextApplicationAt', '');
      setValue('endsAt', '');
      setValue('frequency', MedicineApplicationFrequency.DOES_NOT_REPEAT);
      clearErrors(['nextApplicationAt', 'endsAt', 'frequency']);
    }
  }, [scheduleNextApplication, clearErrors, setValue]);

  React.useEffect(() => {
    if (scheduleNextApplication && frequency === MedicineApplicationFrequency.DOES_NOT_REPEAT) {
      setValue('endsAt', '');
      clearErrors(['endsAt']);
    }
  }, [scheduleNextApplication, frequency, clearErrors, setValue]);

  const medicinesQuery = useQuery({
    queryKey: ['medicines', 'select', 1, 100, 'name:ASC'],
    queryFn: () => getAllMedicines({ page: 1, limit: 100, sortBy: 'name:ASC' }),
    enabled: isOpen,
  });

  const medicineOptions =
    medicinesQuery.data?.data.filter((m) => m.isActive).map((m) => ({ value: m.uuid, label: m.name })) ?? [];

  const frequencyOptions = Object.values(MedicineApplicationFrequency).map((f) => ({ value: f, label: f }));

  const createMutation = useMutation({
    mutationFn: createMedicineApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-applications', 'by-animal', animalUuid] });
      reset();
      onClose();

      toast({
        title: 'Aplicação cadastrada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (_error: AxiosError) => {
      toast({
        title: 'Erro ao cadastrar aplicação',
        description: 'Não foi possível cadastrar a aplicação. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const onSubmit = (data: CreateMedicineApplicationFormData) => {
    const appliedAt = brazilianDateTimeToUtcIso(data.appliedAt);

    if (!appliedAt) {
      setError('appliedAt', { type: 'manual', message: 'Formato inválido' });
      return;
    }

    const shouldSchedule = data.scheduleNextApplication;
    const selectedFrequency = shouldSchedule
      ? (data.frequency as MedicineApplicationFrequency | undefined)
      : MedicineApplicationFrequency.DOES_NOT_REPEAT;
    const shouldRepeat = shouldSchedule && selectedFrequency !== MedicineApplicationFrequency.DOES_NOT_REPEAT;

    const nextApplicationAt =
      shouldSchedule && data.nextApplicationAt ? brazilianDateTimeToUtcIso(data.nextApplicationAt) : undefined;

    if (shouldSchedule && data.nextApplicationAt && !nextApplicationAt) {
      setError('nextApplicationAt', { type: 'manual', message: 'Formato inválido' });
      return;
    }

    const endsAt = shouldRepeat && data.endsAt ? brazilianDateTimeToUtcIso(data.endsAt) : undefined;

    if (shouldRepeat && data.endsAt && !endsAt) {
      setError('endsAt', { type: 'manual', message: 'Formato inválido' });
      return;
    }

    if (data.medicineUuid) {
      const selectedMedicine = medicinesQuery.data?.data.find((m) => m.uuid === data.medicineUuid);

      if (selectedMedicine && selectedMedicine.quantity !== -1) {
        const available = selectedMedicine.quantity;
        const requested = data.quantity;

        if (requested > available) {
          setError('quantity', {
            type: 'manual',
            message: `Quantidade indisponível. Quantidade disponível: ${available}`,
          });
          return;
        }
      }
    }

    createMutation.mutate({
      animalUuid,
      medicineUuid: data.medicineUuid,
      quantity: data.quantity,
      appliedAt,
      frequency: (selectedFrequency ?? MedicineApplicationFrequency.DOES_NOT_REPEAT) as MedicineApplicationFrequency,
      nextApplicationAt,
      endsAt,
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
        <DrawerHeader bg='background' py={6} px={8}>
          <HStack justify='space-between' align='center'>
            <Text fontSize='xl' fontWeight='bold' color='primary'>
              Aplicar medicamento
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
          <VStack
            as='form'
            id='create-medicine-application-form'
            spacing={2}
            align='stretch'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isInvalid={!!errors.medicineUuid} position='relative' pb='22px'>
              <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                Medicamento *
              </FormLabel>
              <Controller
                name='medicineUuid'
                control={control}
                render={({ field }) => (
                  <ChakraSelect
                    placeholder='Selecione o medicamento'
                    options={medicineOptions}
                    value={medicineOptions.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) => field.onChange(opt?.value ?? '')}
                    onBlur={field.onBlur}
                    chakraStyles={createSelectStyles<string>(!!errors.medicineUuid)}
                    isLoading={medicinesQuery.isLoading}
                    isSearchable
                  />
                )}
              />
              <FormErrorInline message={errors.medicineUuid?.message} />
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
              <FormErrorInline message={errors.quantity?.message} />
            </FormControl>

            <FormControl isInvalid={!!errors.appliedAt} position='relative' pb='22px'>
              <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                Data e hora da aplicação *
              </FormLabel>
              <Controller
                name='appliedAt'
                control={control}
                render={({ field }) => (
                  <Input
                    type='text'
                    inputMode='numeric'
                    placeholder='dd/mm/aaaa hh:mm'
                    {...inputStyles}
                    borderColor={errors.appliedAt ? 'error' : 'inputBorder'}
                    sx={{
                      '&::-webkit-calendar-picker-indicator': { display: 'none' },
                      '&::-webkit-inner-spin-button': { display: 'none' },
                    }}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(mask.typingBrazilianDateTime(e.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <FormErrorInline message={errors.appliedAt?.message} />
            </FormControl>

            <FormControl position='relative' pb='22px'>
              <Controller
                name='scheduleNextApplication'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    isChecked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    colorScheme='blue'
                    color='primary'
                    fontWeight='bold'
                    sx={{
                      '.chakra-checkbox__label': {
                        fontSize: 'sm',
                        lineHeight: 'short',
                      },

                      '.chakra-checkbox__control': {
                        borderColor: 'inputBorder',
                        borderWidth: '1px',
                        bg: 'white',
                        boxShadow: '0 0 0 1px var(--chakra-colors-inputBorder)',
                        _hover: { borderColor: 'primary' },
                        _focusVisible: {
                          boxShadow: '0 0 0 2px var(--chakra-colors-primary)',
                        },
                        _checked: {
                          borderColor: 'primary',
                          bg: 'primary',
                          boxShadow: '0 0 0 1px var(--chakra-colors-primary)',
                        },
                      },
                    }}
                  >
                    Agendar próxima aplicação
                  </Checkbox>
                )}
              />
            </FormControl>

            {scheduleNextApplication && (
              <FormControl isInvalid={!!errors.nextApplicationAt} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Data e hora da próxima aplicação *
                </FormLabel>
                <Controller
                  name='nextApplicationAt'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder='dd/mm/aaaa hh:mm'
                      {...inputStyles}
                      borderColor={errors.nextApplicationAt ? 'error' : 'inputBorder'}
                      sx={{
                        '&::-webkit-calendar-picker-indicator': { display: 'none' },
                        '&::-webkit-inner-spin-button': { display: 'none' },
                      }}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(mask.typingBrazilianDateTime(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <FormErrorInline message={errors.nextApplicationAt?.message} />
              </FormControl>
            )}

            {scheduleNextApplication && (
              <FormControl isInvalid={!!errors.frequency} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Frequência *
                </FormLabel>
                <Controller
                  name='frequency'
                  control={control}
                  render={({ field }) => (
                    <ChakraSelect
                      placeholder='Selecione'
                      options={frequencyOptions}
                      value={frequencyOptions.find((o) => o.value === field.value) ?? null}
                      onChange={(opt) => field.onChange(opt?.value ?? MedicineApplicationFrequency.DOES_NOT_REPEAT)}
                      onBlur={field.onBlur}
                      chakraStyles={createSelectStyles<string>(!!errors.frequency)}
                      isSearchable={false}
                    />
                  )}
                />
                <FormErrorInline message={errors.frequency?.message} />
              </FormControl>
            )}

            {scheduleNextApplication && isRepeating && (
              <FormControl isInvalid={!!errors.endsAt} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Data e hora da última aplicação *
                </FormLabel>
                <Controller
                  name='endsAt'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder='dd/mm/aaaa hh:mm'
                      {...inputStyles}
                      borderColor={errors.endsAt ? 'error' : 'inputBorder'}
                      sx={{
                        '&::-webkit-calendar-picker-indicator': { display: 'none' },
                        '&::-webkit-inner-spin-button': { display: 'none' },
                      }}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(mask.typingBrazilianDateTime(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <FormErrorInline message={errors.endsAt?.message} />
              </FormControl>
            )}
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
              form='create-medicine-application-form'
              bg='primary'
              color='white'
              fontWeight='bold'
              borderRadius='full'
              px={6}
              h='2.75rem'
              _hover={{ bg: 'secondary' }}
              isLoading={createMutation.isPending}
              loadingText='Aplicando...'
            >
              Aplicar
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
