import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { WarningCircle } from 'phosphor-react';
import * as React from 'react';

type DeleteConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  entityLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
};

export function DeleteConfirmDialog({ isOpen, onClose, entityLabel, isLoading, onConfirm }: DeleteConfirmDialogProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [value, setValue] = React.useState('');

  const canDelete = value.toLowerCase() === 'confirmar';

  React.useEffect(() => {
    if (!isOpen) setValue('');
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={handleClose}
      leastDestructiveRef={cancelRef}
      isCentered
      motionPreset='slideInBottom'
      closeOnOverlayClick={!isLoading}
      closeOnEsc={!isLoading}
    >
      <AlertDialogOverlay bg='rgba(8, 32, 56, 0.75)' backdropFilter='blur(8px)'>
        <AlertDialogContent
          bg='rgba(19,113,175,0.18)'
          border='1px solid rgba(255,255,255,0.18)'
          borderRadius='2xl'
          backdropFilter='blur(12px)'
          boxShadow='0 20px 50px rgba(0,0,0,0.45)'
          outline='none'
          _focusVisible={{ boxShadow: 'none' }}
          overflow='hidden'
        >
          <AlertDialogHeader
            bg='secondary'
            opacity={0.85}
            color='white'
            fontWeight='bold'
            fontSize='lg'
            py={4}
            borderBottom='1px solid rgba(255,255,255,0.12)'
          >
            <HStack spacing={2}>
              <Box display='grid' placeItems='center'>
                <WarningCircle size={22} weight='duotone' />
              </Box>
              <Text>Excluir {entityLabel}</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody pt={6} color='white'>
            <VStack align='start' spacing={4} w='100%'>
              <VStack align='start' spacing={1}>
                <Text opacity={0.9} fontWeight='bold'>
                  Essa ação não poderá ser desfeita!
                </Text>
                <Text opacity={0.85}>Deseja confirmar a exclusão?</Text>
              </VStack>

              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='confirmar'
                bg='rgba(255,255,255,0.08)'
                border='1px solid rgba(255,255,255,0.18)'
                color='white'
                _placeholder={{ color: 'placeholder' }}
                _hover={{ bg: 'rgba(255,255,255,0.10)' }}
                _focus={{
                  bg: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.35)',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.12)',
                }}
              />
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter pt={6} pb={5}>
            <Button
              ref={cancelRef}
              onClick={handleClose}
              variant='ghost'
              color='white'
              _hover={{ bg: 'rgba(255,255,255,0.12)' }}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              ml={3}
              bg='error'
              color='white'
              _hover={{ filter: 'brightness(0.95)' }}
              _active={{ filter: 'brightness(0.9)' }}
              isDisabled={!canDelete}
              isLoading={isLoading}
              loadingText='Excluindo'
              onClick={onConfirm}
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
