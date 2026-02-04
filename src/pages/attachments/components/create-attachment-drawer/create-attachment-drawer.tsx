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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorInline } from '../../../../components';
import { createAttachment } from '../../../../services';
import { CreateAttachmentFormData, createAttachmentSchema } from './schema';

export type CreateAttachmentDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  animalUuid: string;
};

export const CreateAttachmentDrawer = ({ isOpen, onClose, animalUuid }: CreateAttachmentDrawerProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAttachmentFormData>({
    resolver: zodResolver(createAttachmentSchema),
    defaultValues: { file: undefined },
  });

  const createMutation = useMutation({
    mutationFn: createAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', 'by-animal', animalUuid] });
      reset();
      onClose();
      toast({
        title: 'Anexo cadastrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 409) {
        toast({
          title: 'Não foi possível anexar o arquivo',
          description: 'Já existe um anexo cadastrado com este nome. Renomeie o arquivo e tente novamente.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      toast({
        title: 'Erro ao cadastrar anexo',
        description: 'Não foi possível enviar o arquivo. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const onSubmit = (data: CreateAttachmentFormData) => {
    if (!data.file) return;
    createMutation.mutate({ animalUuid, file: data.file });
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
              Anexar arquivo
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
          <VStack as='form' id='create-attachment-form' spacing={2} align='stretch' onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.file} position='relative' pb='22px'>
              <FormLabel mb={1} color='primary' fontWeight='bold' fontSize='sm'>
                Arquivo *
              </FormLabel>

              <Controller
                name='file'
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <VStack
                    spacing={3}
                    align='stretch'
                    border='2px dashed'
                    borderColor={errors.file ? 'error' : 'inputBorder'}
                    borderRadius='lg'
                    p={5}
                    bg='white'
                    transition='all .2s'
                    _hover={{
                      borderColor: 'primary',
                      bg: 'gray.50',
                    }}
                  >
                    <Input
                      ref={ref}
                      type='file'
                      accept='*/*'
                      display='none'
                      id='file-input'
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />

                    <VStack spacing={2}>
                      <Button
                        as='label'
                        htmlFor='file-input'
                        variant='outline'
                        borderColor='primary'
                        color='primary'
                        size='sm'
                        cursor='pointer'
                      >
                        Selecionar arquivo
                      </Button>

                      <Text fontSize='sm' color='gray.500' textAlign='center'>
                        {value ? value.name : 'Nenhum arquivo selecionado'}
                      </Text>
                    </VStack>
                  </VStack>
                )}
              />

              <FormErrorInline message={errors.file?.message} />
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
              form='create-attachment-form'
              bg='primary'
              color='white'
              fontWeight='bold'
              borderRadius='full'
              px={6}
              h='2.75rem'
              _hover={{ bg: 'secondary' }}
              isLoading={createMutation.isPending}
              loadingText='Enviando...'
            >
              Anexar
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
