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
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select as ChakraSelect } from 'chakra-react-select';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { createAnimal } from '../../../../services';
import {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  brazilianDateToIso,
  createSelectStyles,
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
} from '../../utils/options';
import { CreateAnimalFormData, createAnimalSchema } from './schema';

export const CreateAnimalDrawer = ({ isOpen, onClose }: AnimalDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateAnimalFormData>({
    resolver: zodResolver(createAnimalSchema),
    defaultValues: {
      name: '',
      birthDate: undefined,
      microchip: undefined,
      rga: undefined,
      castrated: false,
      notes: undefined,
    } as CreateAnimalFormData,
  });

  const createMutation = useMutation({
    mutationFn: createAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', 'list'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CreateAnimalFormData) => {
    createMutation.mutate({
      ...data,
      birthDate: brazilianDateToIso(data.birthDate),
    });
  };

  const handleClose = () => {
    if (createMutation.isPending) return;
    reset();
    onClose();
  };

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
            Cadastrar Animal
          </Text>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          <VStack as='form' id='create-animal-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
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
                {...register('notes', {
                  setValueAs: (value: string) => value || undefined,
                })}
              />
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
              form='create-animal-form'
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
