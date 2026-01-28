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
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { createMedicineBrand } from '../../../../services';
import { CreateMedicineBrandFormData, createMedicineBrandSchema } from './schema';

export type CreateMedicineBrandDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateMedicineBrandDrawer = ({ isOpen, onClose }: CreateMedicineBrandDrawerProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMedicineBrandFormData>({
    resolver: zodResolver(createMedicineBrandSchema),
    defaultValues: { name: '' },
  });

  const createMutation = useMutation({
    mutationFn: createMedicineBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-brands', 'list'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: CreateMedicineBrandFormData) => {
    createMutation.mutate(data);
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
            Cadastrar marca de medicamento
          </Text>
        </DrawerHeader>

        <DrawerBody px={8} py={6} bg='background' overflowY='auto' overflowX='hidden'>
          <VStack as='form' id='create-medicine-brand-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
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
              form='create-medicine-brand-form'
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
