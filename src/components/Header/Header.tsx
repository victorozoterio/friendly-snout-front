import { Box, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { SignOut, UserCircle } from 'phosphor-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes';

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.SIGN_IN);
  };

  return (
    <HStack w='100%' px={8} pt={6} justify='space-between' align='center'>
      <Box as='img' src={Logo} alt='Logo Focinho Amigo' w='7rem' />

      <HStack spacing={3}>
        {children}

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Menu do usuário'
            icon={<UserCircle size={40} />}
            variant='underline'
            borderRadius='full'
            color='primary'
          />
          <MenuList boxShadow='none' border='1px solid' borderColor='gray.200' borderRadius='lg' p={0}>
            <MenuItem
              icon={<SignOut size={18} />}
              onClick={handleLogout}
              _hover={{ bg: 'gray.100' }}
              borderRadius='md'
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};
