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
  Text,
  VStack,
} from '@chakra-ui/react';
import { WarningCircle } from 'phosphor-react';
import * as React from 'react';
import { ActionConfirmDialogProps } from './types';

export const ActionConfirmDialog = ({
  isOpen,
  onClose,
  title,
  highlightText,
  bodyText,
  confirmButtonText,
  isLoading,
  onConfirm,
  confirmButtonColorScheme = 'primary',
}: ActionConfirmDialogProps) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
              <Text>{title}</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody pt={6} color='white'>
            <VStack align='start' spacing={4} w='100%'>
              <VStack align='start' spacing={1}>
                <Text opacity={0.9} fontWeight='bold'>
                  {highlightText}
                </Text>
                <Text opacity={0.85}>{bodyText}</Text>
              </VStack>
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
              bg={confirmButtonColorScheme}
              color='white'
              _hover={{ filter: 'brightness(0.95)' }}
              _active={{ filter: 'brightness(0.9)' }}
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
