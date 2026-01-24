import { Box, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { CaretDown, CaretLeft, CaretRight } from 'phosphor-react';
import { PaginationFooterProps } from './types';

export const PaginationFooter = ({
  page,
  limit,
  totalItems,
  totalPages,
  isFetching,
  onChangeLimit,
  onPrev,
  onNext,
}: PaginationFooterProps) => {
  const perPage = limit;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const from = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const to = totalItems === 0 ? 0 : Math.min(page * perPage, totalItems);

  return (
    <Box
      w='fit-content'
      px={4}
      py={2}
      borderRadius='full'
      bg='primary'
      boxShadow='0 10px 30px rgba(0,0,0,0.18)'
      backdropFilter='blur(8px)'
      opacity={isFetching ? 0.85 : 1}
    >
      <HStack spacing={3} align='center'>
        <Text fontSize='sm' color='white' fontWeight='semibold'>
          Visualizar por página:
        </Text>

        <Box position='relative'>
          <Select
            size='sm'
            value={limit}
            onChange={(e) => onChangeLimit(Number(e.target.value))}
            w='56px'
            minW='56px'
            h='32px'
            borderRadius='md'
            bg='rgba(255,255,255,0.10)'
            color='white'
            fontWeight='bold'
            borderColor='rgba(255,255,255,0.18)'
            _hover={{ borderColor: 'rgba(255,255,255,0.28)' }}
            _focusVisible={{ boxShadow: '0 0 0 1px rgba(230,238,246,0.35)' }}
            iconColor='transparent'
            sx={{
              paddingInlineStart: '10px',
              paddingInlineEnd: '26px',
              textAlignLast: 'center',
              option: { color: '#0B4F80', textAlign: 'center' },
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>

          <Box position='absolute' right='8px' top='50%' transform='translateY(-50%)' pointerEvents='none'>
            <CaretDown size={14} color='white' />
          </Box>
        </Box>

        <IconButton
          aria-label='Página anterior'
          size='sm'
          variant='ghost'
          color='white'
          minW='32px'
          h='32px'
          borderRadius='full'
          isDisabled={!canGoPrev || isFetching}
          onClick={onPrev}
          _hover={{ bg: 'rgba(255,255,255,0.10)' }}
          _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
          icon={<CaretLeft size={16} />}
        />

        <Text fontSize='sm' color='white' minW='86px' textAlign='center'>
          {from}-{to} de {totalItems}
        </Text>

        <IconButton
          aria-label='Próxima página'
          size='sm'
          variant='ghost'
          color='white'
          minW='32px'
          h='32px'
          borderRadius='full'
          isDisabled={!canGoNext || isFetching}
          onClick={onNext}
          _hover={{ bg: 'rgba(255,255,255,0.10)' }}
          _disabled={{ opacity: 0.35, cursor: 'not-allowed' }}
          icon={<CaretRight size={16} />}
        />
      </HStack>
    </Box>
  );
};
