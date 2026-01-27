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
  Switch,
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
import { getAnimalByUuid, updateAnimal } from '../../../../services';
import type { GetAnimalResponse, UpdateAnimalRequest } from '../../../../services/animals/types';
import {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  brazilianDateToIso,
  createSelectStyles,
  isoDateToBrazilian,
  mask,
} from '../../../../utils';
import {
  AnimalDrawerProps,
  breedOptions,
  colorOptions,
  findOption,
  fivFelvOptions,
  sexOptions,
  sizeOptions,
  speciesOptions,
  statusOptions,
} from '../../utils/options';
import { UpdateAnimalFormData, updateAnimalSchema } from './schema';

export const UpdateAnimalDrawer = ({ isOpen, onClose, uuid }: AnimalDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<UpdateAnimalFormData>({
    resolver: zodResolver(updateAnimalSchema),
    defaultValues: {
      name: '',
      birthDate: undefined,
      status: AnimalStatus.QUARANTINE,
      microchip: undefined,
      rga: undefined,
      castrated: false,
      notes: undefined,
    } as UpdateAnimalFormData,
  });

  const animalQuery = useQuery<GetAnimalResponse>({
    queryKey: ['animals', 'detail', uuid],
    queryFn: () => getAnimalByUuid(uuid ?? ''),
    enabled: isOpen && !!uuid,
  });

  React.useEffect(() => {
    if (!animalQuery.data) return;

    const a = animalQuery.data;

    reset(
      {
        name: a.name ?? '',
        species: a.species as AnimalSpecies,
        sex: a.sex as AnimalSex,
        breed: a.breed as AnimalBreed,
        size: a.size as AnimalSize,
        color: a.color as AnimalColor,
        birthDate: isoDateToBrazilian(a.birthDate),
        status: a.status as AnimalStatus,
        microchip: a.microchip ?? undefined,
        rga: a.rga ?? undefined,
        castrated: !!a.castrated,
        fiv: a.fiv as AnimalFivAndFelv,
        felv: a.felv as AnimalFivAndFelv,
        notes: a.notes ?? undefined,
      },
      {
        keepDefaultValues: true,
      },
    );
  }, [animalQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ uuid: animalUuid, data: animalData }: { uuid: string; data: UpdateAnimalRequest }) =>
      updateAnimal(animalUuid, animalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['animals', 'detail', uuid] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: UpdateAnimalFormData) => {
    if (!uuid) return;

    if (!isDirty) {
      onClose();
      return;
    }

    updateMutation.mutate({
      uuid,
      data: {
        ...data,
        birthDate: brazilianDateToIso(data.birthDate),
      },
    });
  };

  const handleClose = () => {
    if (updateMutation.isPending) return;
    reset();
    onClose();
  };

  const isLoadingAnimal = animalQuery.isLoading || (animalQuery.isFetching && !animalQuery.data);
  const isErrorAnimal = animalQuery.isError;

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={handleClose} size='md'>
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
            Editar Animal
          </Text>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          {isLoadingAnimal && (
            <VStack mt={8} spacing={4}>
              <Spinner size='lg' />
              <Text color='gray.600'>Carregando dados do animal...</Text>
            </VStack>
          )}

          {isErrorAnimal && (
            <VStack mt={8} spacing={3}>
              <Text color='error' fontWeight='bold'>
                Erro ao carregar dados do animal
              </Text>
              <Button onClick={() => animalQuery.refetch()} bg='primary' color='white'>
                Tentar novamente
              </Button>
            </VStack>
          )}

          {!isLoadingAnimal && !isErrorAnimal && (
            <VStack as='form' id='update-animal-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.name} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Nome *
                </FormLabel>
                <Input
                  placeholder='Digite o nome do animal'
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

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.species} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Espécie *
                  </FormLabel>
                  <Controller
                    name='species'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalSpecies; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(speciesOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={speciesOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalSpecies>(!!errors.species)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.species?.message} />
                </FormControl>

                <FormControl isInvalid={!!errors.sex} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Sexo *
                  </FormLabel>
                  <Controller
                    name='sex'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalSex; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(sexOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={sexOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalSex>(!!errors.sex)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.sex?.message} />
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.breed} position='relative' pb='22px'>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Raça *
                </FormLabel>
                <Controller
                  name='breed'
                  control={control}
                  render={({ field }) => (
                    <ChakraSelect<{ value: AnimalBreed; label: string }, false>
                      placeholder='Selecione'
                      value={findOption(breedOptions, field.value)}
                      onChange={(opt) => field.onChange(opt?.value)}
                      options={breedOptions}
                      isSearchable
                      chakraStyles={createSelectStyles<AnimalBreed>(!!errors.breed)}
                    />
                  )}
                />
                <FormErrorInline message={errors.breed?.message} />
              </FormControl>

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.size} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Porte *
                  </FormLabel>
                  <Controller
                    name='size'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalSize; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(sizeOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={sizeOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalSize>(!!errors.size)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.size?.message} />
                </FormControl>

                <FormControl isInvalid={!!errors.color} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Cor *
                  </FormLabel>
                  <Controller
                    name='color'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalColor; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(colorOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={colorOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalColor>(!!errors.color)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.color?.message} />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.birthDate} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Data de Nascimento
                  </FormLabel>
                  <Controller
                    name='birthDate'
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='text'
                        inputMode='numeric'
                        placeholder='dd/mm/aaaa'
                        h='2.75rem'
                        bg='white'
                        border='1px solid'
                        borderColor={errors.birthDate ? 'error' : 'inputBorder'}
                        borderRadius='md'
                        color='gray.900'
                        fontWeight='medium'
                        _hover={{ borderColor: errors.birthDate ? 'error' : 'primary' }}
                        _focus={{
                          borderColor: errors.birthDate ? 'error' : 'primary',
                          outline: errors.birthDate
                            ? '1px solid var(--chakra-colors-error)'
                            : '1px solid var(--chakra-colors-primary)',
                          outlineOffset: '0px',
                        }}
                        sx={{
                          '&::-webkit-calendar-picker-indicator': { display: 'none' },
                          '&::-webkit-inner-spin-button': { display: 'none' },
                        }}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(mask.typingBrazilianDate(e.target.value) || undefined)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.birthDate?.message as string | undefined} />
                </FormControl>

                <FormControl isInvalid={!!errors.status} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Status *
                  </FormLabel>

                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalStatus; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(statusOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={statusOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalStatus>(!!errors.status)}
                      />
                    )}
                  />

                  <FormErrorInline message={errors.status?.message} />
                </FormControl>
              </HStack>

              <HStack spacing={4} align='flex-start' w='100%'>
                <FormControl flex='1 1 0' minW={0} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Microchip
                  </FormLabel>
                  <Input
                    w='100%'
                    placeholder='Número do microchip'
                    h='2.75rem'
                    bg='white'
                    border='1px solid'
                    borderColor='inputBorder'
                    borderRadius='md'
                    color='gray.900'
                    fontWeight='medium'
                    _placeholder={{ color: 'placeholder' }}
                    _hover={{ borderColor: 'primary' }}
                    _focus={{
                      borderColor: 'primary',
                      outline: '1px solid var(--chakra-colors-primary)',
                      outlineOffset: '0px',
                    }}
                    {...register('microchip', {
                      setValueAs: (value: string) => value || undefined,
                    })}
                  />
                </FormControl>

                <FormControl flex='1 1 0' minW={0} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    RGA
                  </FormLabel>
                  <Input
                    w='100%'
                    placeholder='Número do RGA'
                    h='2.75rem'
                    bg='white'
                    border='1px solid'
                    borderColor='inputBorder'
                    borderRadius='md'
                    color='gray.900'
                    fontWeight='medium'
                    _placeholder={{ color: 'placeholder' }}
                    _hover={{ borderColor: 'primary' }}
                    _focus={{
                      borderColor: 'primary',
                      outline: '1px solid var(--chakra-colors-primary)',
                      outlineOffset: '0px',
                    }}
                    {...register('rga', {
                      setValueAs: (value: string) => value || undefined,
                    })}
                  />
                </FormControl>

                <FormControl flex='0 0 84px' position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    Castrado
                  </FormLabel>
                  <HStack h='2.75rem' align='center' justify='center' pr={5}>
                    <Controller
                      name='castrated'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Switch isChecked={value} onChange={(e) => onChange(e.target.checked)} colorScheme='blue' />
                      )}
                    />
                  </HStack>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isInvalid={!!errors.fiv} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    FIV *
                  </FormLabel>
                  <Controller
                    name='fiv'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalFivAndFelv; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(fivFelvOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={fivFelvOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalFivAndFelv>(!!errors.fiv)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.fiv?.message} />
                </FormControl>

                <FormControl isInvalid={!!errors.felv} position='relative' pb='22px'>
                  <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                    FELV *
                  </FormLabel>
                  <Controller
                    name='felv'
                    control={control}
                    render={({ field }) => (
                      <ChakraSelect<{ value: AnimalFivAndFelv; label: string }, false>
                        placeholder='Selecione'
                        value={findOption(fivFelvOptions, field.value)}
                        onChange={(opt) => field.onChange(opt?.value)}
                        options={fivFelvOptions}
                        isSearchable={false}
                        chakraStyles={createSelectStyles<AnimalFivAndFelv>(!!errors.felv)}
                      />
                    )}
                  />
                  <FormErrorInline message={errors.felv?.message} />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                  Observações
                </FormLabel>
                <Textarea
                  placeholder='Digite observações sobre o animal (opcional)'
                  bg='white'
                  border='1px solid'
                  borderColor='inputBorder'
                  borderRadius='md'
                  minH='100px'
                  _placeholder={{ color: 'placeholder' }}
                  _hover={{ borderColor: 'primary' }}
                  _focus={{
                    borderColor: 'primary',
                    outline: '1px solid var(--chakra-colors-primary)',
                    outlineOffset: '0px',
                  }}
                  {...register('notes', { setValueAs: (v: string) => v || undefined })}
                />
              </FormControl>
            </VStack>
          )}
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
              isDisabled={updateMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type='submit'
              form='update-animal-form'
              bg='primary'
              color='white'
              fontWeight='bold'
              borderRadius='full'
              px={6}
              h='2.75rem'
              _hover={{ bg: 'secondary' }}
              isLoading={updateMutation.isPending}
              loadingText='Atualizando...'
              isDisabled={isLoadingAnimal || isErrorAnimal}
            >
              Atualizar
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
