import { Box, HStack, Text, Th } from '@chakra-ui/react';
import { ArrowDown, ArrowsDownUp, ArrowUp } from 'phosphor-react';
import * as React from 'react';

import type { SortableThProps, SortIconProps } from './types';

const SortIcon: React.FC<SortIconProps> = ({ sortState, colKey }) => {
  if (sortState.key !== colKey || !sortState.dir) return <ArrowsDownUp size={16} />;
  if (sortState.dir === 'ASC') return <ArrowUp size={16} />;
  return <ArrowDown size={16} />;
};

export const SortableTh: React.FC<SortableThProps> = ({ w, colKey, sortState, onSort, children }) => {
  return (
    <Th w={w} color='white' cursor='pointer' userSelect='none' onClick={() => onSort(colKey)} _hover={{ opacity: 0.9 }}>
      <HStack spacing={2}>
        <Text>{children}</Text>
        <Box color='white' display='inline-flex' alignItems='center'>
          <SortIcon sortState={sortState} colKey={colKey} />
        </Box>
      </HStack>
    </Th>
  );
};
