import { Box, HStack, Text, Th } from '@chakra-ui/react';
import { ArrowDown, ArrowsDownUp, ArrowUp } from 'phosphor-react';
import { TableSortableHeaderProps, TableSortState } from './types';

const SortIcon = ({ sortState, sortKey }: { sortState: TableSortState; sortKey: string }) => {
  if (sortState.key !== sortKey || !sortState.dir) return <ArrowsDownUp size={16} />;
  if (sortState.dir === 'ASC') return <ArrowUp size={16} />;
  return <ArrowDown size={16} />;
};

export const TableSortableHeader = ({
  w,
  sortKey,
  sortState,
  onSort,
  children,
}: TableSortableHeaderProps) => {
  return (
    <Th
      w={w}
      color='white'
      cursor='pointer'
      userSelect='none'
      onClick={() => onSort(sortKey)}
      _hover={{ opacity: 0.9 }}
    >
      <HStack spacing={2}>
        <Text>{children}</Text>
        <Box color='white' display='inline-flex' alignItems='center'>
          <SortIcon sortState={sortState} sortKey={sortKey} />
        </Box>
      </HStack>
    </Th>
  );
};
